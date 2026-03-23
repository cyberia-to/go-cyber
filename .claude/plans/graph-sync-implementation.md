# Graph Sync Implementation Plan

## Context

go-cyber stores 3M+ particles, 3M+ links, and rank values but has no bulk export. Getting the full graph requires millions of individual gRPC calls. The Graph Sync feature generates periodic snapshots (protobuf + parquet) and serves them via HTTP, enabling light clients, data scientists, and desktop apps to sync the full knowledge graph efficiently.

Spec: `go-cyber/docs/sync.md`. No consensus changes — query-side infrastructure only.

---

## Architecture Decision

**New top-level package `graphsync/`** (not under `x/`).

Rationale: This is NOT a Cosmos SDK module — no store keys, no genesis, no message handlers. It's a cross-cutting background service that reads from multiple keepers (graph, rank, account, bank, staking). Putting it under `x/` would require implementing the full `AppModule` interface for no benefit.

---

## Phase 1: Snapshot Generation + HTTP

### Step 1 — Protobuf Messages

**New file: `proto/cyber/graph/v1beta1/snapshot.proto`**

Define data-only messages (not gRPC service):
- `GraphSnapshot` (header + repeated particles, links, neurons)
- `GraphSnapshotHeader` (chain_id, height, timestamp, counts, rank_merkle_root, checksum)
- `Particle` (number, cid, rank)
- `Cyberlink` (from, to, account, height)
- `Neuron` (number, address, links_count, boot_staked, hydrogen, ampere, volt)

Run `make proto-gen` → generates `x/graph/types/snapshot.pb.go`.

### Step 2 — Configuration

**New file: `graphsync/config.go`**
- `GraphSyncConfig` struct with fields: `Enabled`, `SyncPeriod` (1000), `MilestonePeriod` (100000), `Protobuf` (true), `Parquet` (true), `HTTPAddress` ("localhost:9999"), `RankDeltaBps` (100)
- `DefaultGraphSyncConfig()` — returns defaults with `Enabled: false` (opt-in)
- `DefaultConfigTemplate` — TOML template string for `[graph-sync]` section
- `ReadConfig(appOpts)` — reads config from viper/appOpts

**Modify: `cmd/cyber/cmd/root.go`** (`initAppConfig` function, line ~126)
- Add `GraphSync graphsync.GraphSyncConfig` field to `CustomAppConfig` struct
- Append `graphsync.DefaultConfigTemplate` to `customAppTemplate`
- Set `GraphSync: graphsync.DefaultGraphSyncConfig()` in defaults

### Step 3 — SyncService Core

**New file: `graphsync/service.go`**

```go
type SyncService struct {
    cfg          GraphSyncConfig
    homePath     string
    logger       log.Logger
    db           dbm.DB
    storeKeys    map[string]*storetypes.KVStoreKey

    // Keepers (read-only)
    graphKeeper   *graphkeeper.GraphKeeper
    indexKeeper   *graphkeeper.IndexKeeper
    rankKeeper    *rankkeeper.StateKeeper
    accountKeeper authkeeper.AccountKeeper
    bankKeeper    bankkeeper.Keeper
    stakingKeeper *stakingkeeper.Keeper

    // State
    mu           sync.Mutex
    latestMeta   *SnapshotMeta
    generating   atomic.Bool  // prevents concurrent generation

    // HTTP
    httpServer   *http.Server
}
```

Methods:
- `NewSyncService(cfg, homePath, logger, db, storeKeys, keepers...) *SyncService`
- `Start()` — starts HTTP server if configured
- `Stop()` — graceful shutdown
- `OnEndBlock(ctx sdk.Context, height int64)` — checks `height % sync_period == 0`, launches background goroutine

**Trigger design**: Hook into `EndBlocker` in `app.go`. Capture `chainID`, `timestamp`, `height` from ctx, then launch goroutine. The actual snapshot uses `utils.NewContextWithMSVersion(db, height, keysCopy)` to create a fresh read-only context at the committed IAVL version.

**Critical**: `NewContextWithMSVersion` destructively deletes entries from the keys map. Must pass a **copy** of `app.GetKVStoreKey()`, not the original.

### Step 4 — Snapshot Generation

**New file: `graphsync/generate.go`**

`generateSnapshot(height, chainID, timestamp)`:
1. Create read-only context via `utils.NewContextWithMSVersion`
2. `collectParticles(ctx)` — `graphKeeper.IterateCids(ctx, ...)` + `rankKeeper.GetRankValueByNumber(num)`
3. `collectLinks(ctx)` — `graphKeeper.IterateBinaryLinks(ctx, func(key, value []byte))` — extracts from/account/to from key bytes, height from value bytes
4. `collectNeurons(ctx)` — build accNumber→address map via `accountKeeper.IterateAccounts`, then for each neuron in `graphKeeper.GetNeudegs()`: query `stakingKeeper.GetDelegatorBonded` + `bankKeeper.GetBalance` for hydrogen/ampere/volt
5. Build header with counts, merkle root from `rankKeeper.GetLatestMerkleTree`, compute checksum
6. Write files, update `latestMeta`

Key data access patterns:
- **Links key**: `[0x03][From:8][Account:8][To:8]`, value: `[Height:8]` — all big-endian
- **CIDs**: `IterateCids` uses prefix 0x01, gives `(cid_string, cid_number)` pairs
- **Rank**: `rankKeeper.GetRankValueByNumber(uint64(cidNum))` — direct array index into `networkCidRank.RankValues`
- **Neudeg**: `graphKeeper.GetNeudegs()` returns `map[uint64]uint64` (accNumber → linkCount), uses `rankNeudeg` (snapshot from last rank calculation)

### Step 5 — File Writers

**New file: `graphsync/write_pb.go`**
- Marshal `GraphSnapshot` protobuf message, write to `graph.pb`

**New file: `graphsync/write_parquet.go`**
- Uses `github.com/parquet-go/parquet-go` library
- Three files: `particles.parquet`, `links.parquet`, `neurons.parquet`
- Settings: ZSTD compression, 100K row groups, dictionary encoding on `account` and `height` columns

**New file: `graphsync/write_meta.go`**
- Write `meta.json` with header info, file sizes, SHA-256 checksums

### Step 6 — File Management

**New file: `graphsync/filemanager.go`**
- Directory structure: `~/.cyber/data/snapshots/{latest,milestones}/`
- Atomic writes: write to `.tmp-{height}/`, rename to `latest/`
- Milestone detection: when `height % milestone_period == 0`, copy/hardlink to `milestones/{height}/`
- Maintain `milestones/index.json`

### Step 7 — HTTP Server

**New file: `graphsync/http.go`**
- `net/http.FileServer` serving `data/snapshots/` directory
- Routes: `/snapshot/latest/*`, `/snapshot/milestones/*`

### Step 8 — App Wiring

**Modify: `app/app.go`**
- Add `graphSync *graphsync.SyncService` to `App` struct
- In `NewBostromApp`, after `loadContexts`: read config, create SyncService, call `Start()`
- In `EndBlocker` (line ~360): add `app.graphSync.OnEndBlock(ctx, ctx.BlockHeight())`

**Modify: `go.mod`**
- Add `github.com/parquet-go/parquet-go`

---

## Phase 2: gRPC Endpoints + Subscribe

### Step 1 — Proto Definitions

**New file: `proto/cyber/graph/v1beta1/sync_query.proto`**

Separate gRPC service (not extending existing `Query` to avoid breaking `GraphKeeper` interface):
```protobuf
service GraphSyncQuery {
  rpc LatestSnapshot(QueryLatestSnapshotRequest) returns (QueryLatestSnapshotResponse);
  rpc SubscribeGraph(SubscribeGraphRequest) returns (stream GraphUpdate);
}
```

Plus request/response messages and `RankDelta` as defined in `docs/sync.md`.

### Step 2 — gRPC Implementation

**New file: `graphsync/grpc.go`**
- `SyncService` implements `GraphSyncQueryServer`
- `LatestSnapshot`: returns in-memory `latestMeta`
- `SubscribeGraph`: creates subscriber channel, sends updates on each snapshot

**Modify: `app/app.go`** — register `GraphSyncQueryServer` on `GRPCQueryRouter`

### Step 3 — Diff Tracking

**New file: `graphsync/diff.go`**
- Track previous state: `prevCidCount`, `prevRankValues`, `prevNeuronSet`, `prevHeight`
- After each snapshot: compute new particles (cidNum >= prevCidCount), new links (height > prevHeight), rank deltas (>threshold), new neurons
- Push `GraphUpdate` to all subscribers

---

## Phase 3: Distribution (Future)

- `graphsync/ipfs.go` — `ipfs add -r` if sidecar available, store CID in meta
- `graphsync/metrics.go` — Prometheus: generation time, file sizes, subscriber count

---

## New Files Summary

| File | Purpose |
|------|---------|
| `proto/cyber/graph/v1beta1/snapshot.proto` | Protobuf data messages |
| `graphsync/config.go` | Config struct, defaults, TOML template |
| `graphsync/service.go` | SyncService lifecycle, OnEndBlock trigger |
| `graphsync/generate.go` | Snapshot generation: collect particles/links/neurons |
| `graphsync/write_pb.go` | Protobuf file writer |
| `graphsync/write_parquet.go` | Parquet file writer (3 files) |
| `graphsync/write_meta.go` | meta.json writer |
| `graphsync/filemanager.go` | Directory structure, retention, atomic writes |
| `graphsync/http.go` | HTTP file server |
| `graphsync/grpc.go` | Phase 2: LatestSnapshot + SubscribeGraph |
| `graphsync/diff.go` | Phase 2: Diff computation |
| `proto/cyber/graph/v1beta1/sync_query.proto` | Phase 2: gRPC service definition |

## Modified Files Summary

| File | Change |
|------|--------|
| `cmd/cyber/cmd/root.go` | Add GraphSync to CustomAppConfig + template |
| `app/app.go` | Add graphSync field, init service, hook EndBlocker |
| `go.mod` | Add parquet-go dependency |

## Critical Existing Code to Reuse

| What | File | Method/Pattern |
|------|------|----------------|
| CID iteration | `x/graph/keeper/particles.go` | `IterateCids(ctx, func(Cid, CidNumber))` |
| Link iteration with height | `x/graph/keeper/graph.go` | `IterateBinaryLinks(ctx, func(key, value []byte))` |
| Rank by CID number | `x/rank/keeper/keeper.go` | `GetRankValueByNumber(uint64)` |
| Neuron degrees | `x/graph/keeper/neudeg.go` | `GetNeudegs() map[uint64]uint64` |
| Read-only historical context | `utils/context.go` | `NewContextWithMSVersion(db, height, keys)` |
| Config pattern | `cmd/cyber/cmd/root.go:126` | `CustomAppConfig` + `initAppConfig()` |
| EndBlocker hook | `app/app.go:360` | `EndBlocker(ctx, req)` |
| Account iteration | auth keeper | `IterateAccounts(ctx, func(AccountI) bool)` |

## Verification

1. **Unit tests**: Test each collector function (particles, links, neurons) with mock keepers
2. **Integration test**: Start a test node with `graph-sync.enabled=true`, create some cyberlinks, wait for `sync_period` blocks, verify files appear in `data/snapshots/latest/`
3. **File validation**: Read generated protobuf file back, verify counts match `GraphStats` gRPC
4. **Parquet validation**: Open parquet files with DuckDB/pandas, verify schema and row counts
5. **HTTP test**: `curl http://localhost:9999/snapshot/latest/meta.json` returns valid JSON with correct height
6. **Milestone test**: Set `milestone_period` to a small value, verify milestone directories are created
