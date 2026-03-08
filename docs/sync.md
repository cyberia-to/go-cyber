# Graph Sync Specification

Periodic graph snapshot generation and distribution for light clients, data science, and inference pipelines.

**Scope:** Query-side infrastructure only. No consensus changes. No modifications to state machine, rank computation, or transaction processing. This is for peripheral nodes — not validators.

---

## Problem

go-cyber stores the full knowledge graph (particles, cyberlinks, rank) but has no way to export it in bulk. Existing query endpoints:

| Endpoint | Returns | Useful for bulk sync? |
|---|---|---|
| `GraphStats` | counts only | No |
| `Rank(particle)` | rank of one particle | No — need one call per CID |
| `Search(particle)` | outlinks of one particle | No — need one call per CID |
| `Backlinks(particle)` | inlinks of one particle | No — need one call per CID |
| `Top` | top 1000 by rank | Partial |

To get the full graph (3M+ particles, 3M+ links), a client would need millions of individual gRPC calls. This is impractical.

## What This Unlocks

| Consumer | Needs Graph For |
|---|---|
| **cyb (desktop app)** | Local graph browsing, offline search |
| **Data scientists** | Graph analysis, community detection, PageRank studies |
| **Inference pipeline** | Training embeddings (cid2vec), LLM fine-tuning corpus |
| **Light clients** | Show graph structure without running a full node |
| **External indexers** | Build custom indexes without parsing blocks |
| **Personal networks** | Seed a new chain with subgraph from bostrom |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     go-cyber node                        │
│                                                          │
│  EndBlocker (every CalculationPeriod blocks)             │
│    └── rank recalculation (existing)                     │
│                                                          │
│  SnapshotTicker (every sync_period blocks, e.g. 600)     │
│    └── background goroutine:                             │
│        1. Read in-memory index (outLinks/inLinks)        │
│        2. Read rank array (networkCidRank.RankValues)     │
│        3. Read CID registry (IAVL prefix 0x02)           │
│        4. Write snapshot files to data/snapshots/         │
│        5. Notify SubscribeGraph subscribers               │
│                                                          │
│  HTTP server (:8888)                                    │
│    └── GET /snapshot/* — serve snapshot files             │
│                                                          │
│  gRPC (existing :9090)                                   │
│    ├── LatestSnapshot() — metadata + download URLs       │
│    └── SubscribeGraph() — server-stream, push updates    │
└─────────────────────────────────────────────────────────┘
         │                        │
         │ HTTP download          │ gRPC stream
         ▼                        ▼
    ┌──────────┐           ┌──────────────┐
    │ curl     │           │ Go/Rust/TS   │
    │ wget     │           │ gRPC client  │
    │ browser  │           │              │
    │ CDN/IPFS │           │ stays        │
    │          │           │ connected,   │
    │ one-shot │           │ gets diffs   │
    └──────────┘           └──────────────┘
```

Key design: **one IAVL scan serves all clients.** The node generates snapshot files on a timer. Clients download files or subscribe for updates. No per-client scan.

---

## Data Model

### Particles

Every CID registered in the knowledge graph.

| Field | Type | Source | Description |
|---|---|---|---|
| `number` | uint64 | CID registry (`0x02` prefix) | Sequential ID assigned on first link |
| `cid` | string | CID registry (`0x02` prefix) | IPFS CID string (CIDv0: 46 bytes, CIDv1: variable) |
| `rank` | uint64 | `networkCidRank.RankValues[number]` | PageRank × 10¹⁵, 0 if not yet ranked |

### Links

Every cyberlink (edge) in the knowledge graph.

| Field | Type | Source | Description |
|---|---|---|---|
| `from` | uint64 | IAVL key bytes [1:9] | Source particle number |
| `to` | uint64 | IAVL key bytes [17:25] | Destination particle number |
| `account` | uint64 | IAVL key bytes [9:17] | Neuron (account) number that created the link |
| `height` | uint64 | IAVL value | Block height when link was created |

Note: IAVL key layout is `[0x03][From 8B][Account 8B][To 8B]`, value is `[Height 8B]`, all big-endian in store. The snapshot uses native uint64 (little-endian in protobuf, typed columns in parquet).

### Header

| Field | Type | Description |
|---|---|---|
| `chain_id` | string | e.g. "bostrom" |
| `height` | uint64 | Block height at snapshot time |
| `timestamp` | int64 | Unix timestamp of the block |
| `particles_count` | uint64 | Total particles in this snapshot |
| `links_count` | uint64 | Total links in this snapshot |
| `neurons_count` | uint64 | Total neurons (unique accounts) in this snapshot |
| `rank_merkle_root` | bytes | On-chain rank merkle root at this height |
| `checksum` | string | SHA-256 of the entire snapshot payload |

### Neurons

Every account that has created at least one cyberlink.

| Field | Type | Source | Description |
|---|---|---|---|
| `number` | uint64 | auth module account number | Sequential account ID used in links |
| `address` | string | auth module | Bech32 address (e.g. `bostrom1abc...`, ~44 bytes) |
| `links_count` | uint64 | `GraphKeeper.neudeg[number]` | Total outgoing links (neuron degree) |
| `boot_staked` | uint64 | `stakingKeeper.GetDelegatorBonded()` | Total BOOT staked (delegated) |
| `hydrogen` | uint64 | `bankKeeper.GetBalance(addr, "hydrogen")` | H resource token balance |
| `ampere` | uint64 | `bankKeeper.GetBalance(addr, "ampere")` | A resource token balance |
| `volt` | uint64 | `bankKeeper.GetBalance(addr, "volt")` | V resource token balance |

Without this table, account numbers in links are opaque integers. With it — every link is fully resolved: who linked what to what, with what resources.

Size: ~92 bytes × num_unique_neurons. At 100K neurons — ~9 MB. Negligible.

### What's NOT Included (and Why)

| Data | Why Excluded |
|---|---|
| Particle content (IPFS) | Not stored on-chain. Clients resolve CIDs via IPFS directly. |
| Liquid BOOT balance | Highly volatile — changes every block with rewards/fees. Staked amount is more stable and meaningful. |

---

## File Formats

Two formats generated from the same data. Both contain identical information.

### Protobuf Format

Primary format for programmatic clients (Go, Rust, TypeScript, Python).

**File:** `graph-{height}.pb`

```protobuf
syntax = "proto3";
package cyber.graph.v1beta1;

message GraphSnapshot {
  GraphSnapshotHeader header = 1;
  repeated Particle particles = 2;
  repeated Cyberlink links = 3;
  repeated Neuron neurons = 4;
}

message GraphSnapshotHeader {
  string chain_id = 1;
  uint64 height = 2;
  int64  timestamp = 3;
  uint64 particles_count = 4;
  uint64 links_count = 5;
  uint64 neurons_count = 6;
  bytes  rank_merkle_root = 7;
  string checksum = 8;
}

message Particle {
  uint64 number = 1;
  string cid = 2;
  uint64 rank = 3;
}

message Cyberlink {
  uint64 from = 1;
  uint64 to = 2;
  uint64 account = 3;
  uint64 height = 4;
}

message Neuron {
  uint64 number = 1;
  string address = 2;
  uint64 links_count = 3;
  uint64 boot_staked = 4;
  uint64 hydrogen = 5;
  uint64 ampere = 6;
  uint64 volt = 7;
}
```

### Parquet Format

For data science tools (pandas, DuckDB, polars, Nushell, Spark, R).

**Files:** Three tables in separate files for efficient columnar access.

**`particles-{height}.parquet`**

| Column | Parquet Type | Description |
|---|---|---|
| `number` | UINT64 | Particle sequential ID |
| `cid` | BYTE_ARRAY (UTF8) | IPFS CID string |
| `rank` | UINT64 | PageRank × 10¹⁵ |

**`links-{height}.parquet`**

| Column | Parquet Type | Description |
|---|---|---|
| `from` | UINT64 | Source particle number |
| `to` | UINT64 | Destination particle number |
| `account` | UINT64 | Neuron account number |
| `height` | UINT64 | Block height of creation |

**`neurons-{height}.parquet`**

| Column | Parquet Type | Description |
|---|---|---|
| `number` | UINT64 | Account sequential ID |
| `address` | BYTE_ARRAY (UTF8) | Bech32 address (e.g. `bostrom1abc...`) |
| `links_count` | UINT64 | Total outgoing links (neuron degree) |
| `boot_staked` | UINT64 | Total BOOT staked (delegated) |
| `hydrogen` | UINT64 | H resource token balance |
| `ampere` | UINT64 | A resource token balance |
| `volt` | UINT64 | V resource token balance |

**Parquet settings:**
- Compression: ZSTD (best ratio for mixed data)
- Row group size: 100,000 rows
- No dictionary encoding for `cid` column (hashes don't deduplicate)
- Dictionary encoding for `account` column (neurons repeat across many links)
- Dictionary encoding for `height` column (heights cluster in time)

### Size Estimates

CID strings are cryptographic hashes — essentially random bytes. They do not compress.

| Component | Raw Size | Compressed |
|---|---|---|
| Particles: cid strings (~46 bytes avg, 3M) | ~138 MB | ~138 MB (incompressible) |
| Particles: number + rank (16 bytes, 3M) | ~48 MB | ~20 MB |
| Links: from + to + account + height (32 bytes, 3M) | ~96 MB | ~50 MB (heights/accounts repeat) |
| Neurons: address + links + balances (~92 bytes, 100K) | ~9 MB | ~5.5 MB |
| **Protobuf total** | **~288 MB** | **~225 MB** (gzip) |
| **Parquet total** | **~288 MB** | **~205 MB** (zstd, columnar) |

Neurons add negligible overhead (~9 MB raw) but make the snapshot self-contained — every account number in links resolves to a human-readable address with staking and resource balances.

CID strings dominate the size in both formats. They are hashes and do not compress.

---

## Snapshot Generation

### Trigger and Retention

Snapshots fire at round block numbers. Two tiers:

```
snapshot fires when: block_height % sync_period == 0
default sync_period: 1000 blocks (~1.7 hours at 6s blocks)
```

**Rolling snapshot** — always available, overwritten each cycle:
```
latest snapshot: the most recent snapshot (at height % 1000 == 0)
kept: only 1 — previous is deleted when new one is generated
```

**Milestone snapshots** — permanent archive for historical analysis:
```
milestone fires when: block_height % milestone_period == 0
default milestone_period: 100000 blocks (~7 days at 6s blocks)
kept: all — never deleted automatically
```

This gives two things:
1. **Fresh data** — latest snapshot is always < 2 hours old
2. **Time series** — milestone snapshots accumulate over months/years, enabling graph dynamics analysis (how did rank evolve? when did neurons appear? growth rate?)

Both `sync_period` (1000) and `milestone_period` (100000) are divisible by `CalculationPeriod` (5), so rank values are always fresh at snapshot time.

### Disk Budget

| Timeframe | Milestones | Size (both formats) |
|---|---|---|
| 1 month | ~4 | ~1.7 GB |
| 1 year | ~52 | ~22 GB |
| 3 years | ~156 | ~65 GB |
| 5 years | ~260 | ~108 GB |

~100 GB for 5 years of weekly graph snapshots. Reasonable for a node with SSD. The historical archive enables programmatic analysis of graph dynamics — rank evolution, neuron growth curves, link creation patterns over time.

Rolling snapshot adds only ~400 MB (one copy, overwritten).

### Data Sources

All data read during snapshot generation:

| Data | Source | I/O Type | Speed |
|---|---|---|---|
| Links (edges) | `IndexKeeper.GetOutLinks()` | **RAM** (in-memory map) | ~1-5M entries/sec |
| Rank values | `StateKeeper.networkCidRank.RankValues[]` | **RAM** (uint64 array) | Direct index, instant |
| CID strings | IAVL iterator on prefix `0x02` | **Disk** (LevelDB) | ~100-200K entries/sec |
| Neuron degrees | `GraphKeeper.neudeg` map | **RAM** | Instant |
| Neuron addresses | `AccountKeeper.GetAccount()` per number | **Disk** (LevelDB) | ~100-200K entries/sec |
| Neuron staked BOOT | `stakingKeeper.GetDelegatorBonded()` per addr | **Disk** (LevelDB) | ~100-200K entries/sec |
| Neuron H/A/V | `bankKeeper.GetBalance()` per addr × 3 denoms | **Disk** (LevelDB) | ~100-200K entries/sec |

CID strings, account addresses, and balance lookups are disk I/O. Everything else is in memory.

### Generation Flow

```go
// Runs in a background goroutine, does NOT block consensus
func (s *SyncService) generateSnapshot(ctx sdk.Context) {
    // 1. Collect header
    header := buildHeader(ctx)

    // 2. Read CID registry (disk I/O — slowest part)
    //    IAVL prefix scan on 0x02: num → cid string
    particles := []Particle{}
    graphKeeper.IterateCids(ctx, func(cid Cid, num CidNumber) {
        rank := rankKeeper.GetRankValueByNumber(uint64(num))  // RAM lookup
        particles = append(particles, Particle{num, cid, rank})
    })

    // 3. Read links from in-memory index (fast)
    links := []Cyberlink{}
    outLinks := indexKeeper.GetOutLinks()  // RAM: map[CidNumber]CidLinks
    for from, cidLinks := range outLinks {
        for to, accounts := range cidLinks {
            for acc := range accounts {
                // height requires IAVL lookup for exact value
                // or we skip height and just export topology
                links = append(links, Cyberlink{from, to, acc, 0})
            }
        }
    }

    // 4. Collect neurons (account number → address + balances)
    //    Iterate neudeg map (RAM) for account numbers with links
    //    Resolve address, staking, and resource balances (disk I/O)
    neurons := []Neuron{}
    for accNum, degree := range graphKeeper.GetNeudegs() {
        addr := accountKeeper.GetAccount(ctx, accNum).GetAddress()
        staked := stakingKeeper.GetDelegatorBonded(ctx, addr).Amount.Uint64()
        h := bankKeeper.GetBalance(ctx, addr, "hydrogen").Amount.Uint64()
        a := bankKeeper.GetBalance(ctx, addr, "ampere").Amount.Uint64()
        v := bankKeeper.GetBalance(ctx, addr, "volt").Amount.Uint64()
        neurons = append(neurons, Neuron{accNum, addr.String(), degree, staked, h, a, v})
    }

    // 5. Write protobuf file
    writeProtobuf(particles, links, neurons, header)

    // 6. Write parquet files
    writeParquet(particles, links, neurons, header)

    // 7. Notify subscribers
    s.notifySubscribers(header, newParticles, newLinks)
}
```

### Link Height: In-Memory Index vs IAVL

The in-memory index (`outLinks`/`inLinks`) does **not** store block height — only `(from, to, account)` triples. Block height is only available from the IAVL store (prefix `0x03` value).

Two options:

| Approach | Speed | Has Height? |
|---|---|---|
| Read from in-memory index | Fast (~5 sec for 3M) | No — height = 0 |
| Read from IAVL (`IterateLinks`) | Slow (~30 sec for 3M) | Yes |

**Recommendation:** Use IAVL iteration. The snapshot runs once per hour in background — 30 seconds is fine. Height is valuable context (when was this link created?).

Alternative: read links from in-memory index (fast), then batch-lookup heights from IAVL only for links that are new since last snapshot (for diffs). Full snapshots use IAVL.

### File Management

```
~/.cyber/data/snapshots/
├── latest/                                # rolling snapshot (overwritten every sync_period)
│   ├── graph.pb
│   ├── particles.parquet
│   ├── links.parquet
│   ├── neurons.parquet
│   └── meta.json
│
└── milestones/                            # permanent archive (every milestone_period)
    ├── 22400000/
    │   ├── graph.pb
    │   ├── particles.parquet
    │   ├── links.parquet
    │   ├── neurons.parquet
    │   └── meta.json
    ├── 22300000/
    │   └── ...
    ├── 22200000/
    │   └── ...
    └── index.json                         # list of all milestones with metadata
```

**Rolling (`latest/`)**: Overwritten every `sync_period` blocks. Only one copy on disk at a time. Previous is deleted before new is written.

**Milestones (`milestones/{height}/`)**: Created when `block_height % milestone_period == 0`. Never deleted automatically. Accumulate over time. Each milestone is a self-contained directory with all formats.

**`milestones/index.json`**: Index of all milestone snapshots for discovery:
```json
{
  "chain_id": "bostrom",
  "milestone_period": 100000,
  "snapshots": [
    {"height": 22400000, "timestamp": 1709654400, "particles": 3180000, "links": 3050000, "neurons": 97500},
    {"height": 22300000, "timestamp": 1709049600, "particles": 3150000, "links": 3020000, "neurons": 97000},
    {"height": 22200000, "timestamp": 1708444800, "particles": 3120000, "links": 2990000, "neurons": 96500}
  ]
}
```

**meta.json** (present in both `latest/` and each milestone directory):
```json
{
  "chain_id": "bostrom",
  "height": 22400000,
  "timestamp": 1709654400,
  "is_milestone": true,
  "particles_count": 3200000,
  "links_count": 3100000,
  "neurons_count": 98000,
  "rank_merkle_root": "a1b2c3...",
  "files": {
    "protobuf": {"file": "graph.pb", "size_bytes": 225000000, "checksum": "sha256:..."},
    "parquet_particles": {"file": "particles.parquet", "size_bytes": 155000000, "checksum": "sha256:..."},
    "parquet_links": {"file": "links.parquet", "size_bytes": 52000000, "checksum": "sha256:..."},
    "parquet_neurons": {"file": "neurons.parquet", "size_bytes": 4000000, "checksum": "sha256:..."}
  },
  "generation_time_ms": 28500
}
```

---

## Endpoints

### HTTP Endpoints (port 8888)

Embedded HTTP server serves snapshot files directly. Static file serving — nginx/CDN-friendly, cacheable.

**`GET /snapshot/latest/{file}`** — latest rolling snapshot

```bash
curl http://localhost:8888/snapshot/latest/meta.json
curl -O http://localhost:8888/snapshot/latest/graph.pb
curl -O http://localhost:8888/snapshot/latest/particles.parquet
curl -O http://localhost:8888/snapshot/latest/links.parquet
curl -O http://localhost:8888/snapshot/latest/neurons.parquet
```

**`GET /snapshot/milestones/`** — list all milestone snapshots

```bash
curl http://localhost:8888/snapshot/milestones/index.json
```

**`GET /snapshot/milestones/{height}/{file}`** — specific milestone

```bash
# Download a specific milestone
curl -O http://localhost:8888/snapshot/milestones/22400000/particles.parquet
curl -O http://localhost:8888/snapshot/milestones/22300000/particles.parquet

# Compare graph at two points in time — graph dynamics!
```

### gRPC Endpoints (existing port 9090)

Added to `x/graph` query service.

```protobuf
service Query {
  // Existing
  rpc GraphStats(QueryGraphStatsRequest) returns (QueryGraphStatsResponse);

  // NEW: Get latest snapshot metadata
  rpc LatestSnapshot(QueryLatestSnapshotRequest)
      returns (QueryLatestSnapshotResponse) {
    option (google.api.http).get = "/cyber/graph/v1beta1/snapshot/latest";
  }

  // NEW: Subscribe to graph updates (server-side streaming)
  // Client receives a message each time a new snapshot is generated
  rpc SubscribeGraph(SubscribeGraphRequest)
      returns (stream GraphUpdate) {
    option (google.api.http).get = "/cyber/graph/v1beta1/snapshot/subscribe";
  }
}

message QueryLatestSnapshotRequest {}

message QueryLatestSnapshotResponse {
  string chain_id = 1;
  uint64 height = 2;
  int64  timestamp = 3;
  uint64 particles_count = 4;
  uint64 links_count = 5;
  uint64 neurons_count = 6;
  bytes  rank_merkle_root = 7;
  string protobuf_url = 8;              // HTTP URL to download .pb file
  string parquet_particles_url = 9;      // HTTP URL to download particles .parquet
  string parquet_links_url = 10;         // HTTP URL to download links .parquet
  string parquet_neurons_url = 11;       // HTTP URL to download neurons .parquet
  uint64 protobuf_size = 12;
  uint64 parquet_particles_size = 13;
  uint64 parquet_links_size = 14;
  uint64 parquet_neurons_size = 15;
  string protobuf_checksum = 16;         // sha256
}

message SubscribeGraphRequest {
  uint64 since_height = 1;  // send diff from this height (0 = latest full snapshot info)
}

message GraphUpdate {
  uint64 from_height = 1;
  uint64 to_height = 2;
  int64  timestamp = 3;
  repeated Particle new_particles = 4;    // particles added since from_height
  repeated Cyberlink new_links = 5;       // links added since from_height
  repeated Neuron new_neurons = 6;        // neurons that appeared since from_height
  repeated RankDelta rank_updates = 7;    // particles whose rank changed significantly
  uint64 total_particles = 8;
  uint64 total_links = 9;
  uint64 total_neurons = 10;
}

message RankDelta {
  uint64 particle = 1;
  uint64 rank = 2;       // new rank value
}
```

### SubscribeGraph Flow

```
Client                                Node
  │                                     │
  │── SubscribeGraph(since=0) ────────►│
  │                                     │
  │◄── GraphUpdate (full snapshot meta) │  immediately: latest snapshot info
  │                                     │
  │    ... client downloads snapshot    │
  │    ... client builds local graph   │
  │                                     │
  │    ... ~1 hour passes ...           │
  │                                     │
  │◄── GraphUpdate (diff) ─────────────│  new_particles: 150
  │                                     │  new_links: 230
  │                                     │  rank_updates: 5000
  │                                     │  (total payload: ~50 KB)
  │                                     │
  │    ... client applies diff ...      │
  │                                     │
  │    ... ~1 hour passes ...           │
  │                                     │
  │◄── GraphUpdate (diff) ─────────────│  next diff
  │                                     │
  ...                                 ...
```

The first `GraphUpdate` after subscribe contains the full snapshot metadata (URLs to download). Subsequent updates are incremental diffs.

---

## Incremental Updates (Diffs)

Between snapshots, the node tracks what changed:

### What's Tracked

| Change Type | Source | How Tracked |
|---|---|---|
| New particles | `IndexKeeper` transient store | CID numbers > prev snapshot's max CID number |
| New links | `IndexKeeper.nextRankOutLinks` | Links added since last snapshot height |
| New neurons | `GraphKeeper.neudeg` | Account numbers not in prev snapshot |
| Rank changes | Compare `networkCidRank.RankValues` | Delta between current and previous snapshot's rank array |

### Diff Size

Typical hourly diff on bostrom (estimates):

| Data | Count | Size |
|---|---|---|
| New particles | ~100-500 | ~5-25 KB |
| New links | ~200-1000 | ~6-30 KB |
| New neurons | ~5-50 | ~0.3-3 KB |
| Rank changes (>1% delta) | ~1000-10000 | ~16-160 KB |
| **Total diff** | | **~30-200 KB** |

Diffs are tiny compared to full snapshots. A client on a slow connection can stay in sync with negligible bandwidth.

### Rank Delta Threshold

Not all rank changes are interesting. With 3M particles, every rank recalculation shifts most values slightly. The diff includes only particles where rank changed by more than a configurable threshold:

```
include in diff if: |new_rank - old_rank| > rank_delta_threshold
default rank_delta_threshold: old_rank / 100  (1% relative change)
```

This keeps diffs small while capturing meaningful rank movements.

---

## Configuration

New section in `app.toml`:

```toml
###############################################################################
###                         Graph Sync Configuration                        ###
###############################################################################

[graph-sync]

# Enable periodic graph snapshot generation
enabled = true

# Generate rolling snapshot every N blocks (must be divisible by CalculationPeriod)
# 1000 blocks ≈ 1.7 hours at 6s block time
sync_period = 1000

# Keep permanent milestone snapshot every N blocks
# 100000 blocks ≈ 7 days at 6s block time
# Set to 0 to disable milestones
milestone_period = 100000

# Generate protobuf format (.pb)
protobuf = true

# Generate parquet format (.parquet)
parquet = true

# HTTP server address for serving snapshot files
# Set to "" to disable HTTP serving (files still generated on disk)
http_address = "localhost:8888"

# Minimum rank change (basis points, 100 = 1%) to include in diff updates
rank_delta_bps = 100
```

### Minimal Config (just files, no HTTP, no milestones)

```toml
[graph-sync]
enabled = true
http_address = ""
parquet = false
milestone_period = 0
```

Generates only latest protobuf snapshot on disk. No HTTP server, no parquet, no history. For nodes that distribute snapshots via IPFS or external HTTP server.

### Full Archive Node

```toml
[graph-sync]
enabled = true
milestone_period = 50000
```

More frequent milestones (~3.5 days). At ~400 MB per milestone, this is ~40 GB/year. For nodes dedicated to graph analytics and historical research.

---

## Client Usage Examples

### curl + jq

```bash
# Check what's available
curl -s http://node:8888/snapshot/latest/meta.json | jq .

# Download latest parquet files
curl -O http://node:8888/snapshot/latest/particles.parquet
curl -O http://node:8888/snapshot/latest/links.parquet
curl -O http://node:8888/snapshot/latest/neurons.parquet

# List all milestones
curl -s http://node:8888/snapshot/milestones/index.json | jq .

# Download a historical milestone for comparison
curl -O http://node:8888/snapshot/milestones/22000000/particles.parquet
```

### DuckDB (SQL directly on files)

```sql
-- Top 50 particles by rank
SELECT number, cid, rank
FROM 'latest/particles.parquet'
ORDER BY rank DESC
LIMIT 50;

-- Most active neurons: links, stake, and resources
SELECT n.address, n.links_count, n.boot_staked, n.hydrogen, n.ampere, n.volt
FROM 'latest/neurons.parquet' n
ORDER BY n.links_count DESC
LIMIT 20;

-- Whales by stake who are also active linkers
SELECT n.address, n.boot_staked, n.links_count, n.hydrogen, n.volt
FROM 'latest/neurons.parquet' n
WHERE n.links_count > 10
ORDER BY n.boot_staked DESC
LIMIT 20;

-- Join: which CIDs are most linked-to, with their rank
SELECT p.cid, p.rank, COUNT(*) as inlinks
FROM 'latest/links.parquet' l
JOIN 'latest/particles.parquet' p ON l."to" = p.number
GROUP BY p.cid, p.rank
ORDER BY inlinks DESC
LIMIT 30;

-- Full picture: recent links with CID strings and neuron addresses
SELECT
    n.address as neuron,
    p_from.cid as from_cid,
    p_to.cid as to_cid,
    l.height
FROM 'latest/links.parquet' l
JOIN 'latest/particles.parquet' p_from ON l."from" = p_from.number
JOIN 'latest/particles.parquet' p_to ON l."to" = p_to.number
JOIN 'latest/neurons.parquet' n ON l.account = n.number
WHERE l.height > (SELECT MAX(height) FROM 'latest/links.parquet') - 1000
ORDER BY l.height DESC;
```

### Python + pandas

```python
import pandas as pd

particles = pd.read_parquet("latest/particles.parquet")
links = pd.read_parquet("latest/links.parquet")
neurons = pd.read_parquet("latest/neurons.parquet")

# Top particles
top = particles.nlargest(100, "rank")
print(top[["cid", "rank"]])

# Who linked the most? Show with resources
print(neurons.nlargest(20, "links_count")[["address", "links_count", "boot_staked", "hydrogen", "volt"]])

# Full join: human-readable link table
full = (links
    .merge(particles[["number", "cid"]], left_on="from", right_on="number", suffixes=("", "_from"))
    .merge(particles[["number", "cid"]], left_on="to", right_on="number", suffixes=("", "_to"))
    .merge(neurons[["number", "address"]], left_on="account", right_on="number", suffixes=("", "_neuron"))
    [["address", "cid", "cid_to", "height"]]
    .rename(columns={"cid": "from_cid", "cid_to": "to_cid", "address": "neuron"})
)
```

### Python + polars (10-50x faster than pandas)

```python
import polars as pl

particles = pl.read_parquet("latest/particles.parquet")
links = pl.read_parquet("latest/links.parquet")
neurons = pl.read_parquet("latest/neurons.parquet")

# Top neurons by link count — with stake and resources
print(neurons.sort("links_count", descending=True)
    .select(["address", "links_count", "boot_staked", "hydrogen", "ampere", "volt"])
    .head(20))

# Top particles with their inlink counts
top = (
    links.group_by("to").agg(pl.count().alias("inlinks"))
    .join(particles, left_on="to", right_on="number")
    .sort("rank", descending=True)
    .head(50)
)
```

### Nushell

```nu
# Top 20 particles by rank
> open latest/particles.parquet
  | dfr into-df
  | dfr sort-by rank --reverse
  | dfr first 20
  | dfr into-nu

# Links per account
> open latest/links.parquet
  | dfr into-df
  | dfr group-by account
  | dfr agg (dfr col from | dfr count)
  | dfr sort-by from --reverse
  | dfr first 10
  | dfr into-nu
```

### Go (gRPC subscribe)

```go
conn, _ := grpc.Dial("node:9090", grpc.WithInsecure())
client := graphtypes.NewQueryClient(conn)

// Get latest snapshot info
meta, _ := client.LatestSnapshot(ctx, &graphtypes.QueryLatestSnapshotRequest{})
fmt.Printf("Height: %d, Particles: %d, Links: %d\n",
    meta.Height, meta.ParticlesCount, meta.LinksCount)

// Download and parse protobuf snapshot
resp, _ := http.Get(meta.ProtobufUrl)
data, _ := io.ReadAll(resp.Body)
snapshot := &graphtypes.GraphSnapshot{}
proto.Unmarshal(data, snapshot)

// Subscribe for updates
stream, _ := client.SubscribeGraph(ctx, &graphtypes.SubscribeGraphRequest{
    SinceHeight: meta.Height,
})
for {
    update, err := stream.Recv()
    if err != nil { break }
    fmt.Printf("New: %d particles, %d links, %d rank changes\n",
        len(update.NewParticles), len(update.NewLinks), len(update.RankUpdates))
    // Apply diff to local graph...
}
```

### NetworkX (graph analysis)

```python
import pandas as pd
import networkx as nx

particles = pd.read_parquet("latest/particles.parquet")
links = pd.read_parquet("latest/links.parquet")

G = nx.from_pandas_edgelist(links, source="from", target="to",
                             create_using=nx.DiGraph)

# Add rank as node attribute
rank_map = dict(zip(particles["number"], particles["rank"]))
nx.set_node_attributes(G, rank_map, "rank")

# Compare on-chain PageRank with standard PageRank
nx_rank = nx.pagerank(G)
print(f"Nodes: {G.number_of_nodes()}, Edges: {G.number_of_edges()}")
print(f"Graph density: {nx.density(G):.6f}")
```

### Graph Dynamics (milestone time-series analysis)

The killer feature of milestone snapshots — analyze how the graph evolves over time.

```sql
-- DuckDB: compare graph growth across milestones
SELECT
    m.height,
    m.particles_count,
    m.links_count,
    m.neurons_count,
    m.links_count - LAG(m.links_count) OVER (ORDER BY m.height) as new_links,
    m.neurons_count - LAG(m.neurons_count) OVER (ORDER BY m.height) as new_neurons
FROM read_json('milestones/index.json')
CROSS JOIN UNNEST(snapshots) as m
ORDER BY m.height;
```

```python
# Track how a specific particle's rank evolved over months
import polars as pl
from pathlib import Path

milestones = sorted(Path("milestones").iterdir())
target_cid = "QmYourFavoriteCID..."

history = []
for m in milestones:
    p = pl.read_parquet(m / "particles.parquet")
    row = p.filter(pl.col("cid") == target_cid)
    if len(row) > 0:
        meta = json.load(open(m / "meta.json"))
        history.append({"height": meta["height"], "rank": row["rank"][0]})

# Plot rank over time
df = pl.DataFrame(history)
# → see how this particle gained or lost importance
```

```python
# Neuron activity over time — who's been linking consistently?
import polars as pl

milestones = ["milestones/22000000", "milestones/22100000", "milestones/22200000"]

frames = []
for m in milestones:
    n = pl.read_parquet(f"{m}/neurons.parquet")
    meta = json.load(open(f"{m}/meta.json"))
    n = n.with_columns(pl.lit(meta["height"]).alias("snapshot_height"))
    frames.append(n)

all_neurons = pl.concat(frames)

# Growth per neuron over time — links and stake dynamics
growth = (all_neurons
    .sort("snapshot_height")
    .group_by("address")
    .agg([
        pl.col("links_count").first().alias("first_links"),
        pl.col("links_count").last().alias("last_links"),
        (pl.col("links_count").last() - pl.col("links_count").first()).alias("link_growth"),
        pl.col("boot_staked").first().alias("first_stake"),
        pl.col("boot_staked").last().alias("last_stake"),
    ])
    .sort("link_growth", descending=True)
    .head(20))
```

---

## Performance and Capacity

### Snapshot Generation

| Step | Operation | Time (3M particles, 3M links, 100K neurons) |
|---|---|---|
| CID iteration | IAVL prefix scan (`0x02`) | ~15-30 sec |
| Rank lookup | RAM array index per CID | ~0 (during CID iteration) |
| Link iteration | IAVL prefix scan (`0x03`) | ~15-30 sec |
| Neuron iteration | neudeg (RAM) + address + staking + bank lookups (disk) | ~2-5 sec |
| Write protobuf | Serialize + write to disk | ~2-5 sec |
| Write parquet | Serialize + write to disk | ~3-8 sec |
| **Total** | | **~35-80 sec** |

Runs in background goroutine. Does not block consensus. IAVL iterators are read-only and use the committed state at snapshot height.

### Serving Capacity

Snapshot files are static files on disk. Serving is trivial:

| Method | Throughput | Notes |
|---|---|---|
| Embedded HTTP (Go net/http) | ~500 MB/s locally | Limited by disk/network |
| nginx reverse proxy | Line rate | Standard static file serving |
| CDN | Unlimited | Cache at edge, one origin fetch |
| IPFS | P2P distribution | Pin CID, network distributes |

One snapshot generation per hour. Serving is decoupled from generation — thousands of concurrent downloads have zero impact on the node beyond disk I/O for file reads.

### Disk Usage

**Rolling snapshot** (always 1 copy):

| Config | Size |
|---|---|
| Protobuf only | ~225 MB |
| Parquet only | ~210 MB |
| Both (default) | ~435 MB |

**Milestone archive** (accumulates over time):

| Config | 1 year | 3 years | 5 years |
|---|---|---|---|
| Default (100K blocks, both formats) | ~22 GB | ~65 GB | ~108 GB |
| Archive node (50K blocks, both formats) | ~44 GB | ~130 GB | ~216 GB |
| Parquet only milestones | ~11 GB/yr | ~33 GB/3yr | ~55 GB/5yr |

~100 GB for 5 years of weekly graph history is a reasonable budget. The historical archive unlocks time-series analysis that no other data source provides: rank evolution, neuron growth, link creation patterns, graph density over time.

---

## Relation to Other Features

| Feature | How It Uses Graph Sync |
|---|---|
| **0.3 cyb (tray app)** | Downloads snapshot on first launch, subscribes for updates, shows local graph |
| **0.4 Dashboard** | Shows snapshot metadata: last generation time, file sizes, subscriber count |
| **0.9 Embeddings (cid2vec)** | Trains on snapshot topology — reads parquet directly into training pipeline |
| **0.10 LLM Inference** | Uses snapshot CIDs to resolve content via IPFS for training corpus |
| **1.3 Snapshot Extensions** | Future: embed graph data in state-sync snapshots (consensus-level, different from this) |
| **1.7 Native Indexing** | Complementary: indexer handles historical queries, graph sync handles bulk topology export |
| **1.11 Personal Networks** | Seed a new personal chain with a subgraph from bostrom snapshot |
| **1.12 IKP** | Use snapshots to identify which subgraph to push/pull between chains |

Graph sync is the **foundation** — everything that needs the graph topology starts here.

---

## Implementation Checklist

### Phase 1: Snapshot Generation + HTTP

- [ ] Add `[graph-sync]` config section to app.toml parsing (`sync_period`, `milestone_period`, `protobuf`, `parquet`, `http_address`)
- [ ] Implement `SyncService` with periodic ticker (fires every `sync_period` blocks)
- [ ] Implement snapshot generation: iterate IAVL (CIDs + links + neurons), read rank array from RAM
- [ ] Define protobuf messages (`GraphSnapshot`, `Particle`, `Cyberlink`, `Neuron`) in `proto/cyber/graph/v1beta1/`
- [ ] Write protobuf snapshot to `data/snapshots/latest/graph.pb`
- [ ] Write parquet files using `parquet-go` library to `data/snapshots/latest/`
- [ ] Write `meta.json` with snapshot metadata
- [ ] Implement rolling retention: overwrite `latest/` each cycle
- [ ] Implement milestone retention: copy to `milestones/{height}/` when `height % milestone_period == 0`
- [ ] Maintain `milestones/index.json` with all milestone metadata
- [ ] Embed HTTP server on configurable port, serve `data/snapshots/` directory tree

### Phase 2: gRPC Endpoints + Subscribe

- [ ] Add `LatestSnapshot` gRPC query to `x/graph`
- [ ] Add `SubscribeGraph` server-streaming gRPC to `x/graph`
- [ ] Implement diff tracking between snapshots (new CIDs, new links, rank deltas)
- [ ] Push `GraphUpdate` messages to all subscribers on each snapshot generation
- [ ] Handle subscriber lifecycle (connect, disconnect, backpressure)

### Phase 3: Distribution

- [ ] IPFS integration: `ipfs add` snapshot files if IPFS sidecar is running, publish CID
- [ ] Include IPFS CID in `meta.json` and `LatestSnapshot` response
- [ ] Document nginx/CDN setup for high-traffic nodes
- [ ] Add Prometheus metrics: snapshot generation time, file sizes, active subscribers
