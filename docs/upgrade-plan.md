# go-cyber Dependency Upgrade Plan

This document describes the upgrade path for go-cyber's core dependencies from the current v7 stack to the latest available versions, covering what each step unlocks, what breaks, and the recommended execution order.

## Current Stack (go-cyber v7)

| Component | Version | Notes |
|---|---|---|
| Cosmos SDK | v0.47.16 | Forked as `cybercongress/cosmos-sdk` |
| CometBFT | v0.37.18 | Tachyon security fix applied |
| IBC-Go | v7.10.0 | |
| CosmWasm/wasmd | v0.46.0 | |
| CosmWasm/wasmvm | v1.5.9 | CosmWasm 1.x runtime |
| Packet-Forward-Middleware | v7.3.0 | |
| async-icq | v7.1.1 | |
| ibc-hooks | v7.0.0 | |
| Go | 1.22.7 | |

## Target Stack (Latest Stable)

| Component | Version | Notes |
|---|---|---|
| Cosmos SDK | **v0.53.6** | Released 2026-02-10 |
| CometBFT | **v0.38.21** | Released 2026-01-23 |
| IBC-Go | **v10.5.0** | IBC Eureka / IBC v2 |
| CosmWasm/wasmd | **v0.61.8** | Released 2026-02-11 |
| CosmWasm/wasmvm | **v3.0.3** | CosmWasm 3.0 runtime |
| Packet-Forward-Middleware | **v10.1.0** | |
| async-icq | **v8.0.0** | No v10 release yet |
| ibc-hooks | **v8.0.0** | No v10 release yet |
| Go | 1.23.2+ | Required by SDK v0.53 |

## Compatibility Matrix

All versions in a row must be used together. Mixing across rows is not supported.

| SDK | CometBFT | IBC-Go | wasmd | wasmvm | CosmWasm |
|---|---|---|---|---|---|
| v0.47.x (current) | v0.37.x | v7.x | v0.46.x | v1.5.x | 1.x |
| **v0.50.x** | **v0.38.x** | **v8.x** | v0.50 - v0.54 | v1.5 - v2.2.x | 2.0 - 2.2 |
| **v0.53.x** | **v0.38.x** | **v10.x** | v0.60 - v0.61 | v2.3 - v3.0.x | 2.3 - 3.0 |
| v0.54.x (planned Q2 2026) | v0.39.x | v11.x | TBD | TBD | TBD |

Skipped versions that were never released: SDK v0.48/v0.49/v0.51/v0.52, IBC-Go v9, wasmd v0.47-v0.49, CometBFT v1.x (retracted).

---

## Upgrade Path: Two Steps

The upgrade must happen in two sequential steps. There is no way to skip Step 1.

### Step 1: SDK v0.47 -> v0.50 (Major)

This is the largest and hardest step. All four core dependencies change simultaneously.

#### Version Targets for Step 1

| Component | From | To |
|---|---|---|
| Cosmos SDK | v0.47.16 | **v0.50.15** |
| CometBFT | v0.37.18 | **v0.38.21** |
| IBC-Go | v7.10.0 | **v8.8.0** |
| wasmd | v0.46.0 | **v0.54.6** |
| wasmvm | v1.5.9 | **v2.2.6** |
| PFM | v7.3.0 | **v8.2.0** |
| async-icq | v7.1.1 | **v8.0.0** |
| ibc-hooks | v7.0.0 | **v8.0.0** |
| Go | 1.22.7 | 1.22+ (no change required) |

#### Breaking Changes in Step 1

**ABCI 2.0 (CometBFT v0.37 -> v0.38)**
- `BeginBlock`, `DeliverTx`, and `EndBlock` are removed. Replaced by a single `FinalizeBlock` method.
- New `ExtendVote` and `VerifyVoteExtension` methods added (vote extensions).
- CometBFT package renames: `client.TendermintRPC` -> `client.CometRPC`, `client/grpc/tmservice` -> `client/grpc/cmtservice`.

**Cosmos SDK v0.50 Module Interface Overhaul**
- All keeper methods now accept `context.Context` instead of `sdk.Context`.
- `BeginBlock` signature changes from `(sdk.Context, abci.RequestBeginBlock)` to `(context.Context) error`.
- `EndBlock` no longer returns `[]abci.ValidatorUpdate`; returns `error` instead.
- Messages no longer need `ValidateBasic()` or `GetSignBytes()` implementations. Validation moves to message server handlers.
- `GetSigners()` replaced by protobuf `cosmos.msg.v1.signer` field annotations.

**App Wiring**
- Global `ModuleBasics` variable eliminated; use `module.NewBasicManagerFromManager()`.
- Modules accept `KVStoreService` instead of `StoreKey` (wrap with `runtime.NewKVStoreService()`).
- New `PreBlocker` concept: upgrade module must be in `PreBlockers`.
- Store upgrades required for new modules `circuit` and `feeibc` (panic without them).

**x/params Deprecation**
- `x/params` is deprecated. All SDK modules store parameters directly via `MsgUpdateParams`.
- Custom modules must migrate their parameters out of `x/params`.
- v0.50 is the mandatory migration point; future versions drop `x/params` migration support entirely.

**Database Backends**
- ClevelDB, BoltDB, and BadgerDB are no longer supported.

**wasmvm v2 (v1.5 -> v2.2)**
- Import path changes from `github.com/CosmWasm/wasmvm` to `github.com/CosmWasm/wasmvm/v2`.
- Gas values reduced by 1000x. Any hardcoded gas values or gas-related parameters need recalibration.
- `InstantiateContractCosts` renamed to `SetupContractCost`.
- Backward compatible for existing contracts: contracts compiled with cosmwasm-std ^1.0.0 continue to work.

**IBC-Go v8**
- `PortKeeper` field changed to `*portkeeper.Keeper` (pointer type).
- `NewKeeper` functions require an authority identifier parameter.
- `SerializeCosmosTx` / `DeserializeCosmosTx` take an extra `encoding` parameter.
- Channel upgradability introduced (new channel states: `FLUSHING`, `FLUSHCOMPLETE`).

**go-cyber Specific: Forked Cosmos SDK**
- The fork `cybercongress/cosmos-sdk` must be rebased onto SDK v0.50.x.
- This is the single largest piece of work in the entire upgrade. The v0.50 SDK has fundamental changes to BaseApp, module interfaces, and the ABCI layer.
- All cyber-specific modules must migrate keepers to `context.Context`, remove legacy `BeginBlock`/`EndBlock`, and update parameter management.

#### What Step 1 Unlocks

| Capability | Description |
|---|---|
| **ABCI 2.0 / FinalizeBlock** | Simplified block processing, foundation for all advanced features |
| **Vote Extensions** | Validators inject custom data into consensus (oracles, MEV protection, encrypted mempools). Rujira reported oracle latency dropping from 30s to 6s |
| **Optimistic Execution** | Block execution runs in parallel with voting. Sei Network showed 50% block time reduction (~300ms saved) |
| **IAVL v1** | ~7x improvement in set operations (1,800 -> 12,225 leaves/sec), reduced storage overhead via orphan removal |
| **AutoCLI** | Automatic CLI command generation from gRPC definitions, no more hand-written CLI boilerplate |
| **SIGN_MODE_TEXTUAL** | Human-readable transaction signing for hardware wallets |
| **CosmWasm 2.x** | `CosmosMsg::Any`, `QueryRequest::Grpc`, IBC callbacks (ADR-8), secp256r1/BLS12-381 crypto, MessagePack support |
| **IBC Channel Upgradability** | Upgrade existing IBC channels without closing them |

---

### Step 2: SDK v0.50 -> v0.53 + CosmWasm 3.0 (Moderate)

This step is significantly easier. The SDK v0.50 -> v0.53 upgrade was designed to be non-breaking and was described by Cosmos Labs as requiring "only 2 lines of code changed" for many chains.

#### Version Targets for Step 2

| Component | From | To |
|---|---|---|
| Cosmos SDK | v0.50.15 | **v0.53.6** |
| CometBFT | v0.38.21 | v0.38.21 (no change) |
| IBC-Go | v8.8.0 | **v10.5.0** |
| wasmd | v0.54.6 | **v0.61.8** |
| wasmvm | v2.2.6 | **v3.0.3** |
| PFM | v8.2.0 | **v10.1.0** |
| async-icq | v8.0.0 | v8.0.0 (no v10 release yet) |
| ibc-hooks | v8.0.0 | v8.0.0 (no v10 release yet) |
| Go | 1.22+ | **1.23.2+** |

#### Breaking Changes in Step 2

**Cosmos SDK v0.53**
- `x/auth` module now has a `PreBlocker` that must be added to `SetOrderPreBlockers` alongside the upgrade module.
- All modules split into separate `go.mod` files (`cosmossdk.io/x/{moduleName}`).
- Address codecs and bech32 prefixes must be supplied in `client.Context`.

**IBC-Go v10 (IBC Eureka)**
- **Capabilities module removed entirely.** Remove `CapabilityKeeper`, all scoped keepers, and related store keys.
- **Fee middleware (ICS-29) removed entirely.** Remove `IBCFeeKeeper` from App struct, module account permissions, and store keys.
- **Channel upgradability removed** (was added in v8, removed in v10).
- Import paths change from `/v8/` to `/v10/`.
- Light client modules need explicit wiring in keeper construction.
- IBC v2 stack must be wired alongside the classic IBC stack.

**CosmWasm 3.0 / wasmvm v3**
- `Coin::amount` changed from `Uint128` to `Uint256` in the contract API.
- `serde-json-wasm` replaced with standard `serde_json`.
- `MemoryStorage` removed (use `MockStorage`).
- `BankQuery::AllBalances` and `IbcQuery::ListChannels` removed.
- Backward compatible: contracts compiled with cosmwasm-std ^1.0.0 and ^2.0.0 continue to work on CosmWasm 3.0 chains.

**Potential Blockers**
- `async-icq` and `ibc-hooks` do not have v10 releases as of February 2026. If go-cyber depends on these, this may require using unreleased branches or waiting for releases.

#### What Step 2 Unlocks

| Capability | Description |
|---|---|
| **IBC Eureka / IBC v2** | Ethereum connectivity via ZK light clients. Any chain connected to the Cosmos Hub can reach Ethereum permissionlessly. Transfer WETH, WBTC, stablecoins for ~$1 in fees |
| **IBC v2 Simplified Setup** | 3-step handshake instead of 8-10 steps. Dramatically cheaper channel establishment |
| **CosmWasm 3.0 IBCv2 Entrypoints** | Native `ibc2_packet_send`, `ibc2_packet_receive`, `ibc2_packet_ack`, `ibc2_packet_timeout` in smart contracts |
| **Unordered Transactions** | Timestamp-based transactions without sequence numbers. Enables concurrent sends from same account (critical for relayers and exchanges) |
| **x/epochs** | Cron-job scheduling for periodic on-chain actions |
| **x/protocolpool** | Upgraded community pool with continuous fund streaming |
| **Wasmer 5.0.6** | Fully FOSS-licensed Wasm runtime |
| **CosmWasm cw-schema** | Concise alternative to JSON Schema for contract interfaces |
| **Path to IAVLx** | SDK v0.53+ positions for IAVLx storage backend (Q2 2026): 30x faster writes, 20ms commits, ~25,000 ops/sec |

---

## Future: Step 3 (SDK v0.54, planned Q2 2026)

Not yet released. When available, this step would bring:

| Component | Version | Key Feature |
|---|---|---|
| Cosmos SDK | v0.54.x | BlockSTM parallel execution, x/poa |
| CometBFT | v0.39.x | BLS signing, concurrent ABCI |
| IBC-Go | v11.x | TBD |
| IAVLx | New | 30x write improvement, 20ms commits |

Key capabilities:
- **BlockSTM**: Parallel transaction execution. Internal testing showed doubled TPS.
- **BLS Signing**: Aggregated validator signatures for reduced block size and faster verification.
- **Native Proof of Authority**: Token-free PoA with migration path to PoS via `x/poa`.
- **Target**: 5,000 TPS and 500ms block times sustained in production by Q4 2026.

---

## Why Upgrade: Summary of Benefits

### Performance

| Metric | Current (SDK v0.47) | After Step 1 (SDK v0.50) | After Step 2 (SDK v0.53) |
|---|---|---|---|
| IAVL set ops/sec | ~1,800 | ~12,225 (IAVL v1) | ~25,000 (IAVLx, when ready) |
| Block execution | Sequential | Optimistic (50% faster) | Optimistic |
| ABCI calls per block | 3+ (BeginBlock, DeliverTx..., EndBlock) | 1 (FinalizeBlock) | 1 (FinalizeBlock) |

### Security

- CometBFT v0.37.x has received critical security advisories (ASA-2024-001, ASA-2025-003). While patches exist for v0.37, the line receives only critical fixes and is approaching end of life.
- SDK v0.53.3 fixed a chain-halting bug in `x/distribution` (GHSA-p22h-3m2v-cmgh).
- The `x/params` module (used in v0.47) is a historical attack vector; direct parameter storage in modules is more secure.

### Interoperability

| Feature | Current | After Step 1 | After Step 2 |
|---|---|---|---|
| IBC Classic | Yes | Yes | Yes |
| IBC Eureka (Ethereum) | No | No | **Yes** |
| CosmWasm contract compatibility | 1.x only | 1.x + 2.x | 1.x + 2.x + **3.x** |
| IBC Callbacks in contracts | No | **Yes** (CosmWasm 2.1) | Yes |
| IBCv2 in contracts | No | No | **Yes** (CosmWasm 3.0) |
| Vote extensions (oracles) | No | **Yes** | Yes |
| Unordered transactions | No | No | **Yes** |

### Ecosystem Relevance

Chains that have already upgraded to SDK v0.53: Cosmos Hub, Babylon, MANTRA, Warden, Cronos, Akash Network. Osmosis remains on SDK v0.50.x.

Smart contracts and dApps targeting CosmWasm 2.0+ features will not deploy on chains running SDK < v0.50. As the ecosystem moves forward, staying on v0.47 means growing incompatibility with new contracts and tooling.

---

## Cosmos SDK Fork Analysis

The `go.mod` replace directive points to a fork: `github.com/cybercongress/cosmos-sdk` (branch `bostrom-47-custom`).

The fork contains **exactly 4 commits** (5 files changed) on top of upstream `release/v0.47.x`:

### Change 1: `RegisterCustomTypeURL` on InterfaceRegistry Interface

**Files:** `codec/types/interface_registry.go`, `client/grpc_query.go`

The upstream SDK v0.47 has `RegisterCustomTypeURL` as a method on the **concrete struct** `interfaceRegistry`, but it is **not declared on the `InterfaceRegistry` interface**. The fork promotes it to the interface level.

**Why:** The `x/liquidity` module registers messages under legacy Tendermint-namespaced type URLs for backward compatibility:

```go
// x/liquidity/types/codec.go
registry.RegisterCustomTypeURL((*sdk.Msg)(nil), "/tendermint.liquidity.v1beta1.MsgCreatePool", &MsgCreatePool{})
registry.RegisterCustomTypeURL((*sdk.Msg)(nil), "/tendermint.liquidity.v1beta1.MsgDepositWithinBatch", &MsgDepositWithinBatch{})
registry.RegisterCustomTypeURL((*sdk.Msg)(nil), "/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch", &MsgWithdrawWithinBatch{})
registry.RegisterCustomTypeURL((*sdk.Msg)(nil), "/tendermint.liquidity.v1beta1.MsgSwapWithinBatch", &MsgSwapWithinBatch{})
```

This call goes through the `InterfaceRegistry` interface (not the concrete type), so without the fork change it fails to compile.

**Elimination strategy for v0.50+:** Use a type assertion to the concrete `interfaceRegistry` type instead of modifying the interface. Alternatively, check if SDK v0.50+ already exposes this method on the interface.

### Change 2: In-Place Testnet Command

**Files:** `server/start.go` (+325 lines), `server/util.go`, `baseapp/options.go`

Adds a CLI command `in-place-testnet [newChainID] [newOperatorAddress]` that takes a node's existing mainnet state and rewrites it into a single-validator local testnet. Originally pioneered by Osmosis.

Used in `cmd/cyber/cmd/root.go`:
```go
server.AddTestnetCreatorCommand(rootCmd, app.DefaultNodeHome, newTestnetApp, addModuleInitFlags)
```

**Elimination strategy for v0.50+:** This feature was upstreamed into later SDK versions. On SDK v0.50+ the fork change is unnecessary — use the native implementation.

### Fork Elimination Plan

Both fork changes can be eliminated during the Step 1 upgrade, **removing the need for a forked SDK entirely**:

| Fork Change | Action on SDK v0.50+ |
|---|---|
| `RegisterCustomTypeURL` on interface | Use type assertion `registry.(interfaceRegistry).RegisterCustomTypeURL(...)` or check if v0.50 interface already includes it |
| In-place testnet command | Use the native SDK implementation (upstreamed from Osmosis) |

Eliminating the fork removes the highest-risk item in the upgrade plan and dramatically simplifies future maintenance.

---

## Space-Pussy Network Unification

### Current State of Divergence

Space-pussy was forked from go-cyber circa 2022 and has not been updated since. The codebases have diverged massively:

| | **go-cyber (bostrom)** | **space-pussy** |
|---|---|---|
| Cosmos SDK | v0.47.16 | v0.45.5 |
| Consensus | CometBFT v0.37.18 | Tendermint v0.34.19 |
| IBC-Go | v7.10.0 | v3.0.0 |
| CosmWasm/wasmd | v0.46.0 | v0.28.0 |
| wasmvm | v1.5.9 | v1.0.0 |
| Go | 1.22.7 | 1.17 |
| Module path | `github.com/cybercongress/go-cyber/v7` | `github.com/joinresistance/space-pussy` |
| Custom modules | bandwidth, clock, cyberbank, dmn, graph, grid, **liquidity**, rank, resources, staking, **tokenfactory** | bandwidth, cyberbank, dmn, graph, grid, rank, resources, staking |
| Bech32 prefix | `bostrom` | `pussy` |
| Bond denom | `boot` | `pussy` |
| Staking denom | `hydrogen` | `liquidpussy` |

### The Problem: Hardcoded Chain Identity

The go-cyber binary currently **hardcodes** chain-specific values that prevent it from running space-pussy:

- `app/app.go`: `Bech32Prefix = "bostrom"`, `appName = "BostromHub"`
- `app/params/const.go`: `DefaultDenom = "boot"`, `BondDenom = "boot"`
- `types/coins.go`: `CYB = "boot"`, `SCYB = "hydrogen"`, `VOLT = "millivolt"`, `AMPERE = "milliampere"`
- `app/prefix.go`: bech32 prefix sealed at init with `config.Seal()`

These constants are referenced across 13+ source files in 6+ modules. A single go-cyber binary cannot currently serve both networks.

### Solution: Configurable Chain Identity + In-Place Upgrade

The approach is two-phase: first make go-cyber multi-chain capable, then upgrade space-pussy to use the unified binary.

#### Phase A: Make go-cyber Multi-Chain (prerequisite, do during Step 1)

Refactor hardcoded chain identity into runtime configuration driven by genesis.json or app config:

1. **Replace hardcoded denoms with genesis-derived values.** Read `bond_denom` from staking params at init. Replace all references to `"boot"`, `"hydrogen"` etc. with configuration read from genesis or module params.

2. **Make bech32 prefix configurable.** Read prefix from app config or derive from chain-id. Set before `config.Seal()`. Osmosis and other chains already do this — the prefix is set based on configuration, not hardcoded.

3. **Use `ctx.ChainID()` in upgrade handlers** for chain-specific migration logic (Osmosis v25 pattern):
   ```go
   func CreateUpgradeHandler(...) {
       return func(ctx sdk.Context, ...) {
           switch ctx.ChainID() {
           case "bostrom":
               // bostrom-specific migrations
           case "space-pussy":
               // space-pussy-specific migrations
           }
       }
   }
   ```

4. **All modules (liquidity, tokenfactory, clock) stay included** for both chains. Modules that space-pussy doesn't use are simply empty (no state, no genesis entries). They become available for space-pussy to use in the future.

After this refactor, one `cyber` binary serves any chain with the appropriate genesis.json and config.

#### Phase B: Upgrade Space-Pussy to Unified Binary

This is an **in-place chain upgrade** submitted via governance on space-pussy. The new binary is the multi-chain go-cyber binary with a massive upgrade handler.

The upgrade handler must perform these migrations in order:

1. **Cosmos SDK v0.45 -> v0.47 state migrations**
   - Migrate all module stores to v0.47 format
   - Migrate x/params to per-module param storage
   - Add store keys for new modules (crisis, feegrant, authz changes)

2. **Tendermint v0.34 -> CometBFT v0.37 compatibility**
   - CometBFT v0.37 can read Tendermint v0.34 state (backward compatible at data level)
   - ABCI changes are handled by the new binary, not by state migration

3. **IBC-Go v3 -> v7 sequential migrations**
   - v3 -> v4: ICS-29 fee middleware state
   - v4 -> v5: ICS-27 interchain accounts controller changes
   - v5 -> v6: self-managing params migration
   - v6 -> v7: localhost v2 client migration
   - Each step has its own SDK migration module that must run in sequence

4. **CosmWasm v0.28 -> v0.46 state migration**
   - Contract store format changes
   - Pin/unpin contract code migrations

5. **Add store keys for new modules**
   - `clock`, `liquidity`, `tokenfactory` (empty initial state)
   - Module stores must be added via `StoreUpgrades.Added`

**Precedent**: Akash Network successfully jumped from SDK v0.45 directly to v0.53 in their Mainnet 14 upgrade. The approach was a single large upgrade handler that performed all intermediate migrations.

#### Execution Order

The space-pussy upgrade happens **after** Step 1 (bostrom -> SDK v0.50) because:
1. The multi-chain refactor is done as part of Step 1
2. Space-pussy can then upgrade directly to the same binary as bostrom
3. Both chains advance together in Step 2

Timeline:
```
Step 1: go-cyber v0.50 + multi-chain refactor
  │
  ├── Deploy on bostrom (upgrade proposal)
  │
  └── Deploy on space-pussy (upgrade proposal, includes v0.45->v0.50 migration)
       └── space-pussy now runs same binary as bostrom
  │
Step 2: go-cyber v0.53 + CosmWasm 3.0
  │
  ├── Deploy on bostrom (upgrade proposal)
  └── Deploy on space-pussy (upgrade proposal)
       └── Both chains in sync going forward
```

### Space-Pussy Upgrade Checklist

- [ ] Refactor `app/app.go`, `app/params/const.go`, `types/coins.go` to read denoms from config/genesis
- [ ] Make bech32 prefix configurable (read from app config)
- [ ] Verify all 13+ source files that reference hardcoded denoms are updated
- [ ] Write space-pussy upgrade handler with chain-id conditional logic
- [ ] Implement SDK v0.45 -> v0.50 state migrations for space-pussy's state
- [ ] Implement IBC v3 -> v8 sequential state migrations
- [ ] Implement CosmWasm v0.28 -> v0.54 state migrations
- [ ] Add store upgrades for new modules (clock, liquidity, tokenfactory, circuit, feeibc)
- [ ] Test upgrade against space-pussy mainnet state export (in-place testnet)
- [ ] Submit upgrade proposal on space-pussy governance
- [ ] Coordinate validator binary swap
- [ ] Archive `cyberia-to/space-pussy` repo (replaced by go-cyber)

---

## Graph State Sync and Light Client

### Current Architecture

The knowledge graph has three layers of state:

1. **Graph store (IAVL):** CID registry, cyberlinks stored as `CompactLink` (24 bytes: `from_cid uint64 + to_cid uint64 + account uint64`), and neuron degree counters. All stored in IAVL trees under `x/graph` module store keys.

2. **In-memory index (`IndexKeeper`):** On node startup, the full graph is loaded from IAVL into RAM as adjacency lists (`outLinks`, `inLinks` maps). This is the structure that the rank algorithm reads.

3. **Rank values (in-memory):** `float64[]` array holding the PageRank for every CID. Computed by GPU (CUDA) or CPU every `CalculationPeriod` blocks (default: 5). Only the merkle tree root hashes of rank values are stored on-chain — the actual rank values are **never persisted to disk**.

### Current Bottleneck: Rank Recalculation on Sync

The snapshot extensions (`x/rank/keeper/snapshotter.go`, `x/graph/keeper/snapshotter.go`) currently work as follows:

- **`SnapshotExtension()`** — writes **nothing** (empty payload for both graph and rank).
- **`RestoreExtension()`** — reloads the full graph into memory from IAVL, then **triggers a full rank calculation from scratch**.

This means every node that restores from a state-sync snapshot must:
1. Load the entire graph into RAM (iterating all IAVL leaves)
2. Run a full PageRank computation (GPU or CPU)
3. Wait for convergence before the node can serve queries

For a graph with millions of cyberlinks, this takes significant time and requires GPU hardware just to sync.

### Proposed Improvements

#### A. Serialize Rank Values in Snapshot Extension (Step 1)

The highest-impact change: write actual rank values into the snapshot payload.

```
SnapshotExtension():
  1. Write cidCount (uint64)
  2. Write rankValues[] (cidCount × 8 bytes, uint64 encoded)

RestoreExtension():
  1. Read rank values from payload
  2. Build merkle tree from values
  3. Verify merkle root matches on-chain LatestMerkleTree
  4. Load into networkCidRank — node is immediately ready
```

Note: karma/entropy/luminosity have been removed from consensus state. Negentropy is now computed at query time from rank values (no storage needed).

Benefits:
- **No GPU required for sync.** Nodes without CUDA can still sync and serve rank queries.
- **Sync time drops from minutes/hours to seconds.** Reading a flat array is O(n), versus PageRank iteration which is O(n × k × iterations).
- **Merkle verification ensures correctness.** The on-chain `LatestMerkleTree` (stored every block) acts as the commitment — restored rank values are verified against it.

Estimated payload size: for 10M CIDs, rank values ≈ 80 MB (uncompressed). Snapshot compression (zstd) typically achieves 3-5x on numeric data.

#### B. Incremental Graph Export Endpoint (Step 1)

Add a gRPC query endpoint for incremental graph sync:

```protobuf
service Query {
  rpc CyberlinksAfter(CyberlinksAfterRequest) returns (CyberlinksAfterResponse);
}

message CyberlinksAfterRequest {
  uint64 after_height = 1;
  uint64 limit = 2;
}
```

This allows indexers (cyberindex) and light clients to fetch only new cyberlinks since a given height, rather than scanning the full IAVL tree. The graph module already tracks links per block (`GetCurrentBlockNewLinks`), so the data is available — it just needs a query endpoint.

#### C. Graph Store Separation (Step 2, with SDK v0.53)

SDK v0.53 introduces pluggable storage backends and IAVL v2. This opens the possibility of storing the graph in a more efficient structure:

- **Current:** Cyberlinks stored as individual IAVL key-value pairs. Each link read/write goes through the full IAVL tree path (O(log n) with proof generation overhead).
- **Future option:** Store cyberlinks in a flat append-only store (no proof needed for individual links) while keeping only the graph merkle root in IAVL for consensus. This would dramatically reduce storage overhead and speedup full graph iteration.

This is a larger architectural change that becomes feasible with the storage flexibility in SDK v0.53+.

### Light Client Architecture

#### D. Rank Inclusion Proofs (Step 1)

The codebase already has the foundation: `merkle/tree.go` implements an RFC-6962 merkle tree with `GetIndexProofs()` and `ValidateIndexByProofs()` methods. The tree supports two modes:

- `full=false` — stores only subtree roots (used for consensus, 40 hashes for 1 trillion links)
- `full=true` — stores all nodes (enables proof generation for any leaf)

To enable rank proofs for light clients:

1. **Run rank merkle tree in `full=true` mode** on nodes that serve light clients (configurable flag, e.g. `--rank-proofs=true`).
2. **Add `QueryRankWithProof` gRPC endpoint:**
   ```
   Request:  { particle: "QmHash..." }
   Response: { rank: uint64, cid_number: uint64, proofs: []Proof, merkle_root: bytes }
   ```
3. **Client verification:** The light client fetches the latest block header (which contains app_hash), extracts the rank module's store commitment, and verifies the merkle proof chain: `rank_value → rank_merkle_root → module_store_hash → app_hash`.

#### E. Graph Inclusion Proofs (Already Available)

Cyberlinks stored in IAVL already support merkle proofs natively — this is a built-in IAVL feature. Any gRPC query with `prove=true` returns an IAVL merkle proof that can be verified against the app hash.

A light client can verify that a specific cyberlink exists by:
1. Querying the cyberlink with proof
2. Verifying the IAVL proof against the graph module's store hash in the block header

#### F. CometBFT Light Client Integration (Step 1)

CometBFT v0.38 includes a production-ready light client that verifies block headers using validator signatures without downloading full blocks. Combined with the above:

```
Full verification path:
  CometBFT light client → verified block header → app_hash
    → IAVL proof for graph queries (cyberlink existence)
    → RFC-6962 proof for rank queries (rank value for a CID)
```

This enables a fully trustless light client that can:
- Verify any cyberlink exists in the knowledge graph
- Verify the rank of any particle (CID)
- All without downloading the full chain state or running PageRank

### Graph Sync and Light Client Checklist

- [ ] Implement rank values serialization in `RankSnapshotter.SnapshotExtension()`
- [ ] Implement rank values deserialization and merkle verification in `RankSnapshotter.RestoreExtension()`
- [ ] Add `--rank-proofs` node flag to control `full=true` merkle tree mode
- [ ] Add `QueryRankWithProof` gRPC endpoint to `x/rank` module
- [ ] Add `CyberlinksAfter` gRPC endpoint to `x/graph` module for incremental sync
- [ ] Benchmark snapshot size with rank values for production graph size
- [ ] Test state-sync restore without GPU (verify rank values loaded from snapshot)
- [ ] Document light client verification protocol
- [ ] Evaluate graph store separation feasibility after SDK v0.53 migration

---

## CybeRank Computation Fixes (Consensus-Breaking)

These issues were found during a code audit of the rank computation (`x/rank/keeper/calculate_cpu.go`, `x/rank/cuda/rank.cu`). They require a coordinated chain upgrade since they affect consensus state (rank values feed into the on-chain merkle tree commitment).

### Issue 1: CRITICAL — Divide by Zero in `getNormalizedStake()` (CPU only)

**File:** `x/rank/keeper/calculate_cpu.go:94-96`

```go
func getNormalizedStake(ctx *types.CalculationContext, agent uint64) uint64 {
    return ctx.GetStakes()[agent] / ctx.GetNeudegs()[agent]
}
```

If `neudeg == 0` for any account appearing in links, this **panics** with integer divide by zero. The GPU code guards against this (`calculate_gpu.go:48-53`):

```go
if neudeg != 0 {
    stakes[neuron] = stake / neudeg
} else {
    stakes[neuron] = 0
}
```

The CPU code does not have this guard. This is a **CPU/GPU divergence** — if the same edge case is hit, GPU returns 0 while CPU crashes.

**Fix:**
```go
func getNormalizedStake(ctx *types.CalculationContext, agent uint64) uint64 {
    neudeg := ctx.GetNeudegs()[agent]
    if neudeg == 0 {
        return 0
    }
    return ctx.GetStakes()[agent] / neudeg
}
```

### Issue 2: MEDIUM — Dangling Node Detection Uses Wrong Direction

**File:** `x/rank/keeper/calculate_cpu.go:26`

```go
if len(inLinks[graphtypes.CidNumber(i)]) == 0 {
    danglingNodesSize++
}
```

Standard PageRank defines **dangling nodes** as nodes with **no outgoing links** (sinks). This code counts nodes with **no incoming links** instead. Both CPU and GPU implementations have this same behavior — it's consistent but deviates from textbook PageRank.

Additionally, `defaultRankWithCorrection` is computed **once** before iteration and frozen. In standard PageRank, dangling mass must be recomputed each iteration as rank values change.

**Impact:** The algorithm converges to a well-defined fixed point, but it is not the textbook PageRank fixed point. Whether to fix this is a design decision — changing it would alter all rank values.

### Issue 3: MEDIUM — Potential Integer Overflow in Stake Accumulation

**Files:** `calculate_cpu.go:78-83`, `calculate_cpu.go:86-92`

`getOverallLinkStake()` and `getOverallOutLinksStake()` accumulate `uint64` sums without overflow checks. With high stakes (e.g., 10^18 per account) and many contributors per link, the sum could exceed `uint64` max (~1.84 × 10^19), silently wrapping around and producing incorrect weights.

**Fix:** Add overflow-safe arithmetic or assert bounds on individual normalized stakes.

### Issue 4: LOW — Nodes Without In-Links Miss Correction Term

**File:** `calculate_cpu.go:54`

`step()` only iterates `ctx.GetInLinks()`, so nodes without incoming links retain `defaultRank = (1-d)/N` instead of `defaultRankWithCorrection = d*(danglingMass/N) + (1-d)/N`. They miss the redistribution correction. Both CPU and GPU have this same behavior.

### Issue 5: PERFORMANCE — `getOverallOutLinksStake()` Redundant Recomputation

**File:** `calculate_cpu.go:86-92`

The total outgoing stake for a CID is recomputed every time it appears as a source in some other CID's in-links. This is O(|V| × avg_degree²). The GPU precomputes this once. Could be memoized in the CPU path for significant speedup.

### Rank Fix Checklist

These fixes must ship as part of a chain upgrade (Step 1 or a dedicated rank-fix upgrade):

- [ ] Fix `getNormalizedStake` divide by zero guard (CPU parity with GPU)
- [ ] Decide on dangling node direction: keep as-is (document) or fix to standard PageRank (consensus-breaking)
- [ ] Add overflow protection to stake accumulation
- [ ] Document the intentional deviations from textbook PageRank
- [ ] If any rank computation changes are made: compute expected rank delta on mainnet state export to assess migration impact
- [ ] Precompute `getOverallOutLinksStake` per CID in the CPU path (performance, not consensus)

---

## Execution Checklist

### Pre-work

- [ ] Verify `RegisterCustomTypeURL` is on the `InterfaceRegistry` interface in SDK v0.50, or prepare type assertion workaround for `x/liquidity`
- [ ] Verify in-place testnet command exists natively in SDK v0.50
- [ ] Confirm fork can be fully eliminated — switch `go.mod` replace to upstream `github.com/cosmos/cosmos-sdk v0.50.15`
- [ ] Audit all custom modules for `x/params` usage, `BeginBlock`/`EndBlock` implementations, and `sdk.Context` in keeper methods
- [ ] Set up a testnet environment for migration testing

### Step 1: SDK v0.50

- [ ] **Eliminate the cosmos-sdk fork** — remove the `go.mod` replace directive and use upstream SDK v0.50.15
- [ ] Apply type assertion workaround for `RegisterCustomTypeURL` in `x/liquidity` if needed
- [ ] Switch to native in-place testnet command from SDK v0.50
- [ ] Migrate all custom modules:
  - [ ] Replace `sdk.Context` with `context.Context` in keeper methods
  - [ ] Replace `BeginBlock`/`EndBlock` with the new signatures returning `error`
  - [ ] Remove `ValidateBasic()` and `GetSignBytes()` from messages
  - [ ] Add `cosmos.msg.v1.signer` protobuf annotations
  - [ ] Migrate parameters out of `x/params` into direct module storage
- [ ] Rewrite `app.go`:
  - [ ] Replace `ModuleBasics` with `module.NewBasicManagerFromManager()`
  - [ ] Add `PreBlocker` with upgrade module
  - [ ] Add store upgrades for `circuit` and `feeibc`
  - [ ] Migrate to `KVStoreService` from `StoreKey`
- [ ] Update CometBFT v0.37 -> v0.38 package references
- [ ] Update IBC-Go v7 -> v8
- [ ] Update ibc-apps: PFM v8, async-icq v8, ibc-hooks v8
- [ ] Update wasmd v0.46 -> v0.54.6 and wasmvm v1.5 -> v2.2
- [ ] Update protobuf code generation if needed
- [ ] Write and test state migration handler
- [ ] Full testnet deployment and validation
- [ ] Mainnet upgrade proposal and execution

### Step 2: SDK v0.53 + CosmWasm 3.0

- [ ] Update Cosmos SDK v0.50 -> v0.53.6
- [ ] Add `x/auth` PreBlocker to `SetOrderPreBlockers`
- [ ] Update module imports to `cosmossdk.io/x/{moduleName}` where applicable
- [ ] Update IBC-Go v8 -> v10:
  - [ ] Remove capabilities module and all scoped keepers
  - [ ] Remove IBC fee middleware (ICS-29)
  - [ ] Wire IBC v2 stack alongside classic stack
  - [ ] Wire light client modules explicitly
- [ ] Update wasmd v0.54 -> v0.61.8 and wasmvm v2.2 -> v3.0
- [ ] Update PFM v8 -> v10
- [ ] Assess async-icq and ibc-hooks (v10 releases may not be available)
- [ ] Update Go version to 1.23.2+
- [ ] Testnet deployment and validation
- [ ] Mainnet upgrade proposal and execution

---

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Cosmos SDK fork elimination | **Medium** (downgraded from High) | Fork has only 4 commits. `RegisterCustomTypeURL` solvable via type assertion; in-place testnet is upstreamed. Plan is to eliminate the fork entirely, not rebase it |
| State migration failure | **High** | Extensive testnet testing with mainnet state export |
| ibc-hooks / async-icq lacking v10 releases | **Medium** | Can stay on Step 1 (IBC v8) until releases appear. Or use unreleased branches |
| Gas parameter recalibration (wasmvm 1000x change) | **Medium** | Benchmark contract gas usage on testnet before mainnet |
| Breaking changes in custom modules | **Medium** | Systematic migration of each module with unit tests |
| Database backend incompatibility | **Low** | go-cyber uses goleveldb/rocksdb which remain supported |
| Space-pussy v0.45->v0.50 state migration | **High** | Largest version jump (3 SDK majors, 4 IBC majors). Test extensively with mainnet state. Akash successfully did v0.45->v0.53 as precedent |
| Hardcoded denom/prefix refactor | **Medium** | Systematic search-and-replace across 13+ files. Must not break bostrom compatibility. Test both chains |
| Space-pussy validator coordination | **Medium** | Space-pussy has its own validator set that must coordinate the binary swap. Adequate notice and testing required |

## Reference Chains

These chains have completed similar migrations and their repositories can serve as reference implementations:

| Chain | Migration | Repository |
|---|---|---|
| Cosmos Hub (Gaia) | SDK v0.47 -> v0.53 | github.com/cosmos/gaia |
| Akash Network | SDK v0.45 -> v0.53 (skipped v0.47/v0.50) | github.com/akash-network/node |
| Osmosis | SDK v0.47 -> v0.50 | github.com/osmosis-labs/osmosis |
| Neutron | SDK v0.47 -> v0.50 (CosmWasm chain) | github.com/neutron-org/neutron |

## Sources

- [Cosmos SDK Releases](https://github.com/cosmos/cosmos-sdk/releases)
- [Cosmos SDK v0.50 UPGRADING.md](https://github.com/cosmos/cosmos-sdk/blob/release/v0.50.x/UPGRADING.md)
- [CometBFT Releases](https://github.com/cometbft/cometbft/releases)
- [IBC-Go Releases](https://github.com/cosmos/ibc-go/releases)
- [IBC-Go v7 to v8 Migration](https://ibc.cosmos.network/main/migrations/v7-to-v8/)
- [IBC-Go v8.1 to v10 Migration](https://ibc.cosmos.network/main/migrations/v8_1-to-v10/)
- [CosmWasm/wasmd Releases](https://github.com/CosmWasm/wasmd/releases)
- [CosmWasm 3.0 Announcement](https://medium.com/cosmwasm/cosmwasm-3-0-fd84d72c2d35)
- [CosmWasm 2.1 / 2.2 Announcements](https://medium.com/cosmwasm)
- [The Cosmos Stack Roadmap for 2026](https://www.cosmoslabs.io/blog/the-cosmos-stack-roadmap-2026)
- [IAVL v1.0 Performance](https://medium.com/the-interchain-foundation/iavl-v1-0-optimizing-storage-in-the-cosmos-sdk-41e871e4ec1c)
- [Optimistic Execution in SDK](https://medium.com/the-interchain-foundation/optimistic-execution-landing-in-the-cosmos-sdk-a28fc72af650)
- [cosmos/ibc-apps Repository](https://github.com/cosmos/ibc-apps)
