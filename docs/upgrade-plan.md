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

---

## Roadmap: Priorities and Execution Order

Everything we want to do, sorted by dependency chain and impact. Three phases: what we can ship **now** on SDK v0.47, what requires the **SDK v0.50 upgrade**, and what comes **after v0.53**.

### Phase 0 — Now (SDK v0.47, no consensus change)

These items can ship as point releases or soft-fork patches. No chain upgrade required.

| # | Item | Scope | Depends On |
|---|------|-------|------------|
| 0.1 | **Graph Streaming gRPC** — `GraphSnapshot`, `CyberlinksAfter`, `CyberlinksByParticle` endpoints | `x/graph` new queries | — |
| 0.2 | **Native Graph Query Endpoints** — `CyberlinksByNeuron`, `ParticlesByNeuron` (replace cyberindex for basic queries) | `x/graph` new queries | — |
| 0.3 | **cyb (go-cyb) Tray App** — orchestrator managing `cyber` + `ipfs`, tray icon, health polling, Start/Stop | new repo `go-cyb` | — |
| 0.4 | **Embedded Dashboard** — single HTML page on `:26660`, node/IPFS/graph/rank stats | `cyber` binary, `//go:embed` | — |
| 0.5 | **IPFS Sidecar: Kubo Lifecycle** — `cyber init` creates IPFS repo, `cyber start` manages Kubo subprocess | `app/` startup code | — |
| 0.6 | **`cyber service` command** — systemd/launchd install/start/stop for headless servers | `cmd/cyber/` | — |
| 0.7 | **CPU Rank Optimization** — SIMD, goroutine parallelism, memoize per-CID stake | `x/rank/keeper/calculate_cpu.go` | — |
| 0.8 | **Installer & Packaging** — `get.cyber.page` script, GoReleaser update, Homebrew formula | build/release infra | 0.3, 0.5 |
| 0.9 | **Graph Inference: Embeddings + Retrieval** — cid2vec from topology (TransE/RotatE), HNSW index, Similar/Predict gRPC | `scripts/`, `x/inference` | 0.1 |
| 0.10 | **Graph Inference: LLM Training + Native Inference** — resolve content via IPFS, fine-tune Llama 3B (LoRA), llama-server sidecar, Ask/AskStream gRPC, RAG pipeline | `scripts/`, `x/inference`, sidecar | 0.5, 0.9 |
| 0.11 | **Query-time Negentropy** *(done)* — `J(π) = log₂(n) − H(π)` from rank distribution | `x/rank` gRPC | ✅ committed |
| 0.12 | **Dead Code Removal** *(done)* — karma/entropy/luminosity kernels removed | `x/rank/cuda/rank.cu` | ✅ committed |

**Priority order:** 0.1 → 0.3 → 0.5 → 0.4 → 0.2 → 0.9 → 0.10 → 0.6 → 0.7 → 0.8

Rationale: Graph streaming (0.1) is the foundation for light clients, inference training, and any external tool. The tray app (0.3) and IPFS sidecar (0.5) together make "download → run → it works" possible. Dashboard (0.4) gives visual feedback. Native queries (0.2) start replacing cyberindex. Inference training (0.9) needs graph streaming, then native inference (0.10) makes it available on the node. Service management (0.6) and CPU optimization (0.7) are independent polish items. Packaging (0.8) wraps everything for distribution.

### Phase 1 — SDK v0.50 Chain Upgrade

All of these require the consensus-breaking upgrade to Cosmos SDK v0.50 + CometBFT v0.38.

| # | Item | Scope | Depends On |
|---|------|-------|------------|
| 1.0 | **Remove `x/liquidity` module** — delete module code, drop store key via `StoreUpgrades.Deleted`, clean up params and codec registrations | `x/liquidity`, `app/`, upgrade handler | — |
| 1.1 | **SDK v0.47 → v0.50 migration** — ABCI 2.0, FinalizeBlock, context.Context keepers, x/params removal | all modules, `app/` | 1.0 |
| 1.2 | **Eliminate Cosmos SDK fork** — remove `cybercongress/cosmos-sdk` replace directive | `go.mod` | 1.1 |
| 1.3 | **Snapshot Extensions** — graph + rank data in state-sync snapshots (instant sync without GPU) | `x/graph`, `x/rank` snapshotters | 1.1 |
| 1.4 | **Height Index for Incremental Sync** — `[0x07][Height][Seq]` secondary index for O(k) `CyberlinksAfter` | `x/graph` store | 1.1 |
| 1.5 | **Rank Computation Fixes** — div-by-zero guard (CPU), overflow protection, dangling node decision | `x/rank` | 1.1 |
| 1.6 | **Multi-chain Binary (Phase A)** — configurable bech32, denoms from genesis, chain-id switch in upgrade handlers | `app/`, `types/` | 1.1 |
| 1.7 | **ABCIListener Indexing Plugin** — embedded SQLite/DuckDB via ADR-038, replace cyberindex | `app/`, new plugin | 1.1 |
| 1.8 | **Space-Pussy Upgrade (Phase B)** — in-place upgrade v0.45→v0.50 using unified binary | upgrade handler | 1.1, 1.6 |
| 1.9 | **IBC-Go v7 → v8, wasmd v0.46 → v0.54, wasmvm v1.5 → v2.2** | deps | 1.1 |
| 1.10 | **Graph Inference: On-Chain Commitment** — `MsgCommitModel`, validator verification, embedding merkle tree | `x/inference` | 0.10, 1.1 |
| 1.11 | **Personal Networks (`cyber network`)** — one-command launch of a private chain, peer join, graph sync between machines | `cmd/cyber/`, `app/` | 1.6 |
| 1.12 | **Inter-Knowledge Protocol (IKP): Basic Link Sync** — `x/ikp` IBC module, SyncCyberlinks packet, derived neurons, push links between chains | `x/ikp`, new module | 1.1, 1.9 |

**Priority order:** 1.0 → 1.1 → 1.2 → 1.9 → 1.5 → 1.3 → 1.4 → 1.6 → 1.11 → 1.12 → 1.7 → 1.8 → 1.10

Rationale: Liquidity removal (1.0) comes first — it is a standalone consensus-breaking change that eliminates dead module code, its SDK fork dependency (`RegisterCustomTypeURL`), and simplifies the subsequent SDK migration. The SDK migration (1.1) unlocks everything else. Fork elimination (1.2) and dep updates (1.9) are part of the same push. Rank fixes (1.5) are consensus-breaking so bundle with the upgrade. Snapshots (1.3) and height index (1.4) make light client experience good. Multi-chain binary (1.6) is prerequisite for personal networks (1.11). IKP (1.12) enables graph sync between personal networks and bostrom — requires IBC v8 from 1.9. ABCIListener indexing (1.7) replaces cyberindex. Inference on-chain commitment (1.10) makes the model verifiable.

### Phase 2 — SDK v0.53 + CosmWasm 3.0

| # | Item | Scope | Depends On |
|---|------|-------|------------|
| 2.1 | **SDK v0.50 → v0.53 migration** — IBC Eureka, unordered TXs, x/epochs, auth PreBlocker | all modules | 1.1 |
| 2.2 | **IBC-Go v8 → v10 (IBC Eureka)** — Ethereum connectivity, remove capabilities module | IBC wiring | 2.1 |
| 2.3 | **CosmWasm 3.0** — IBCv2 entrypoints, Uint256 balances, wasmd v0.61, wasmvm v3.0 | deps | 2.1 |
| 2.4 | **Schema/Indexer Framework** — `HasModuleCodec` for auto-generated SQL tables | custom modules | 2.1, 1.7 |
| 2.5 | **wgpu Prototype (f32)** — port 4 CUDA kernels to WGSL compute shaders, test precision | `x/rank` | 0.7 |
| 2.6 | **Light Client with Rank Proofs** — `QueryRankWithProof`, `--rank-proofs` flag, full merkle tree | `x/rank` | 1.3 |
| 2.7 | **Graph Inference: Incremental Training + 7B Model** — daily LoRA adapters, weekly full retrain, 7B option for validators | `x/inference` | 0.10 |
| 2.8 | **IKP: Pull Sync + Rank Signals** — RequestSubgraph, selective filters, ShareRankSignal, trust governance | `x/ikp` | 1.12 |

### Phase 3 — Long-term / Research

| # | Item | Notes |
|---|------|-------|
| 3.1 | **Rust Migration Path** — CosmWasm-first (move logic to contracts), then pure Rust ABCI | Research done: Penumbra, Namada, Nomic as references |
| 3.2 | **wgpu f64** — native on Vulkan/DX12, emulated double-single on Metal | Depends on 2.5 precision results |
| 3.3 | **Graph Store Separation** — flat append-only store for cyberlinks, only merkle root in IAVL | SDK v0.53 pluggable storage |
| 3.4 | **SDK v0.54 + CometBFT v0.39** — BlockSTM, BLS signing, concurrent ABCI | Planned Q2 2026 |
| 3.5 | **macOS .dmg / Linux .deb** — native OS packages for cyb | Depends on 0.3, 0.8 |

### Summary Table

| Phase | Items | Consensus Change | Key Deliverable |
|-------|-------|:----------------:|-----------------|
| **0** | 12 items (2 done) | No | Graph sync + Desktop app + IPFS sidecar + **LLM inference from graph** |
| **1** | 13 items | Yes (SDK v0.50) | Liquidity removal + full SDK upgrade + snapshot sync + rank fixes + **personal networks** + **IKP basic sync** |
| **2** | 8 items | Yes (SDK v0.53) | IBC Eureka + CosmWasm 3.0 + wgpu + **IKP pull/rank signals** |
| **3** | 5 items | TBD | Rust migration + advanced GPU + native packages |

---

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
| `RegisterCustomTypeURL` on interface | No longer needed — `x/liquidity` (sole consumer) is removed in Step 0 (item 1.0) |
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
| Custom modules | bandwidth, clock, cyberbank, dmn, graph, grid, ~~liquidity~~ *(removed in 1.0)*, rank, resources, staking, **tokenfactory** | bandwidth, cyberbank, dmn, graph, grid, rank, resources, staking |
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

4. **Remaining modules (tokenfactory, clock) stay included** for both chains. Modules that space-pussy doesn't use are simply empty (no state, no genesis entries). They become available for space-pussy to use in the future. Note: `x/liquidity` is removed in 1.0 before the SDK migration, so it is not present in the unified binary.

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
   - `clock`, `tokenfactory` (empty initial state)
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
- [ ] Add store upgrades for new modules (clock, tokenfactory, circuit, feeibc)
- [ ] Test upgrade against space-pussy mainnet state export (in-place testnet)
- [ ] Submit upgrade proposal on space-pussy governance
- [ ] Coordinate validator binary swap
- [ ] Archive `cyberia-to/space-pussy` repo (replaced by go-cyber)

---

## Graph Sync, Topology Export, and Dynamic Rank

### Goal

A client can sync the **full graph topology** (all particles + all cyberlinks) quickly and cheaply, then **pull rank dynamically** only for the subgraph it cares about. Everything through go-cyber natively, no external indexer required.

### Current Architecture and Its Limitations

The knowledge graph has three layers of state:

1. **Graph store (IAVL):** CID registry, cyberlinks stored as `CompactLink` (24 bytes: `from_cid uint64 + to_cid uint64 + account uint64`), neuron degree counters. IAVL keys: `[0x03][From 8B][Account 8B][To 8B]`, value: `[BlockHeight 8B]`.

2. **In-memory index (`IndexKeeper`):** On startup, full graph loaded from IAVL into RAM as adjacency lists (`outLinks`, `inLinks` maps of `map[CidNumber]map[CidNumber]map[AccNumber]struct{}`). This is what the rank algorithm reads.

3. **Rank values (in-memory only):** `uint64[]` array holding PageRank for every CID. Computed by GPU/CPU every `CalculationPeriod` blocks (default: 5). Only the merkle tree root is stored on-chain — **rank values are never persisted to disk**.

**Current bottlenecks:**

| Problem | Details |
|---|---|
| **No graph streaming** | No gRPC endpoint to get all links or particles in bulk. Only `GraphStats()` (counts) and per-particle `Search`/`Backlinks` exist. |
| **No incremental sync** | Block height stored in IAVL value, not key — cannot efficiently query "links after height X" without full scan. |
| **Snapshot is empty** | Both `GraphSnapshotter.SnapshotExtension()` and `RankSnapshotter.SnapshotExtension()` return `nil` — state-sync snapshots contain no graph or rank data. |
| **No index by neuron** | IAVL key is `[From][Account][To]` — can prefix-scan by From, but finding all links by a specific Account requires full scan. |
| **No index by particle (To)** | Finding all backlinks to a particle in IAVL requires full scan — the in-memory index does this, but there's no query endpoint for it from IAVL. |
| **Rank requires full recalc** | After state-sync restore, node must load entire graph + run full PageRank before serving queries. Requires GPU or hours of CPU time. |

### Target Architecture: Graph Topology Sync + Lazy Rank

```
Light client / indexer / UI:
  1. Initial sync: call GraphSnapshot stream → receive full topology (particles + links)
  2. Incremental sync: call CyberlinksAfter(height) → receive new links since last sync
  3. Rank on demand: call Rank(particle), Search(particle), Backlinks(particle)
     → node returns pre-computed rank for requested particles
  4. Bulk rank: call TopParticles(limit) → top N ranked particles with scores
```

The client builds a local graph representation, and lazily fetches rank values for the subgraph it's exploring. No need to sync all rank values — only what the user is looking at.

### Implementation: Three Levels

#### Level 1: Graph Streaming gRPC (Now, No Consensus Change)

New gRPC endpoints in `x/graph`, using existing IAVL data:

```protobuf
service Query {
  // Existing
  rpc GraphStats(QueryGraphStatsRequest) returns (QueryGraphStatsResponse);

  // NEW: Stream full graph topology in chunks
  // Server-side streaming: sends batches of 1000 links until complete.
  // Under the hood: IterateLinks() prefix scan on 0x03.
  rpc GraphSnapshot(QueryGraphSnapshotRequest)
      returns (stream QueryGraphSnapshotResponse);

  // NEW: Incremental sync — links created after a given height.
  // Implementation: full IAVL scan + filter by height value.
  // Slow (O(n)) but correct. Secondary index added in Level 2.
  rpc CyberlinksAfter(QueryCyberlinksAfterRequest)
      returns (QueryCyberlinksAfterResponse);

  // NEW: All links from/to a specific particle (paginated).
  // Uses in-memory index (inLinks/outLinks) — fast, O(degree).
  rpc CyberlinksByParticle(QueryCyberlinksByParticleRequest)
      returns (QueryCyberlinksByParticleResponse);
}
```

Size estimate for full graph sync (1M links):
- Particles: ~34 MB (CID strings + numbers)
- Links: ~24 MB (24 bytes × 1M)
- Total: ~58 MB uncompressed, ~15 MB with gRPC compression

This is the **minimum viable product** for graph sync — can be implemented immediately on SDK v0.47.

#### Level 2: Snapshot Extensions + Height Index (Consensus Change, with SDK Upgrade)

**A. Fill the empty snapshotters:**

```go
// x/graph/keeper/snapshotter.go
func (gs *GraphSnapshotter) SnapshotExtension(height uint64, pw snapshot.ExtensionPayloadWriter) error {
    // Binary format already exists: WriteCids() + WriteLinks()
    // 1. Write all CIDs (variable-length binary)
    // 2. Write all CompactLinks (24 bytes each)
    return gs.graphKeeper.WriteGenesis(pw)
}

// x/rank/keeper/snapshotter.go
func (rs *RankSnapshotter) SnapshotExtension(height uint64, pw snapshot.ExtensionPayloadWriter) error {
    // 1. Write cidCount (uint64)
    // 2. Write rankValues[] (cidCount × 8 bytes)
    return rs.WriteRankValues(pw)
}

func (rs *RankSnapshotter) RestoreExtension(...) error {
    // 1. Read rank values from payload
    // 2. Build merkle tree from values
    // 3. Verify merkle root matches on-chain LatestMerkleTree
    // 4. Load into networkCidRank — node is immediately ready, NO GPU needed
    return rs.LoadRankValues(pr)
}
```

Snapshot payload sizes (estimated):
- 1M links: ~58 MB graph + ~8 MB rank = ~66 MB (→ ~15-20 MB compressed)
- 10M links: ~580 MB graph + ~80 MB rank = ~660 MB (→ ~150-200 MB compressed)

**B. Secondary index by height** (for efficient `CyberlinksAfter`):

New IAVL key prefix: `[0x07][Height 8B][LinkSeq 8B]` → enables O(k) incremental sync where k = new links only.

This is a consensus change (new store key) and must ship with a chain upgrade.

#### Level 3: Light Client with Rank Proofs

The codebase already has the foundation: `merkle/tree.go` implements RFC-6962 merkle tree with `GetIndexProofs()` and `ValidateIndexByProofs()`.

**A. Rank Inclusion Proofs:**

Two merkle tree modes:
- `full=false` — stores only subtree roots (used for consensus, 40 hashes for 1T links)
- `full=true` — stores all nodes (enables proof generation for any leaf)

New node flag `--rank-proofs=true` enables full mode on nodes that serve light clients.

New gRPC endpoint:
```
QueryRankWithProof(particle) → { rank, cid_number, proofs[], merkle_root }
```

**B. Graph Inclusion Proofs (already available):**

IAVL natively supports merkle proofs. Any gRPC query with `prove=true` returns an IAVL proof verifiable against app_hash.

**C. Full verification path:**
```
CometBFT light client → verified block header → app_hash
  → IAVL proof for graph queries (cyberlink existence)
  → RFC-6962 proof for rank queries (rank value for a CID)
```

A trustless light client can verify any cyberlink exists and verify the rank of any particle — without downloading full chain state or running PageRank.

### Dynamic Rank: How It Works for Clients

The client does NOT need all rank values. The workflow:

```
Client:
  1. Sync full graph topology via GraphSnapshot (one-time, ~15-60 MB compressed)
  2. Keep up via CyberlinksAfter(lastHeight) every N blocks
  3. User navigates to particle "QmFoo":
     a. Client knows local topology: QmFoo has 47 outlinks, 312 backlinks
     b. Client calls Search("QmFoo", page=0, limit=10) → top 10 outlinks with rank
     c. Client calls Backlinks("QmFoo", page=0, limit=10) → top 10 backlinks with rank
     d. Client calls Rank("QmFoo") → rank value of QmFoo itself
  4. User drills into "QmBar" (linked from QmFoo):
     a. Repeat step 3 for QmBar — lazy load rank for this subgraph
  5. Client caches rank values locally, invalidates every CalculationPeriod blocks
```

This is already possible with existing `Rank`, `Search`, `Backlinks`, `Top` gRPC endpoints. The missing piece is only Level 1 (graph topology streaming).

### Graph Store Separation (Future, SDK v0.53)

SDK v0.53 introduces pluggable storage backends and IAVL v2. This opens the possibility of:

- **Current:** Cyberlinks stored as individual IAVL KV pairs. Each write goes through full IAVL tree path (O(log n) with proof generation).
- **Future:** Flat append-only store for cyberlinks (no per-link proof needed), with only the graph merkle root in IAVL for consensus. Dramatically reduces storage overhead and speeds up full graph iteration.

### Checklist

**Level 1 (Now, no consensus change):**
- [ ] Add `GraphSnapshot` server-side streaming gRPC endpoint (prefix scan on `0x03`)
- [ ] Add `CyberlinksAfter` gRPC endpoint (full scan + height filter, O(n))
- [ ] Add `CyberlinksByParticle` gRPC endpoint (from in-memory index, O(degree))
- [ ] Benchmark: full graph stream time for production graph size
- [ ] Test: client syncs full topology, then lazy-loads rank via existing Search/Backlinks

**Level 2 (Consensus change, with SDK upgrade):**
- [ ] Implement graph data in `GraphSnapshotter.SnapshotExtension()` using existing `WriteGenesis()` format
- [ ] Implement rank values in `RankSnapshotter.SnapshotExtension()`
- [ ] Implement rank values restore + merkle verification in `RankSnapshotter.RestoreExtension()`
- [ ] Add secondary index `[0x07][Height][Seq]` for efficient incremental sync
- [ ] Benchmark snapshot size with rank values for production graph
- [ ] Test state-sync restore without GPU (rank loaded from snapshot)

**Level 3 (Light client):**
- [ ] Add `--rank-proofs` node flag to control `full=true` merkle tree mode
- [ ] Add `QueryRankWithProof` gRPC endpoint to `x/rank` module
- [ ] Document light client verification protocol
- [ ] Evaluate graph store separation feasibility after SDK v0.53 migration

---

## Native Graph Indexing (Replace Cyberindex)

### Problem

The current indexing architecture requires three external services (cyberindex, PostgreSQL, Hasura) running alongside the node. This adds operational complexity, deployment overhead, and introduces latency (block polling). For the knowledge graph use case, the node itself should be the primary data source.

### Current State

- **cyberindex** (separate Go service) polls RPC, parses blocks/events, writes to PostgreSQL
- **Hasura** auto-generates GraphQL API over PostgreSQL
- **go-cyber already loads** `streaming.LoadStreamingServices()` in `app/keepers/keepers.go` — the ADR-038 infrastructure is wired but unused
- CometBFT `tx_index = "kv"` with `index-events = []` already indexes ALL events natively
- Transaction queries by address work out of the box: `query txs --events 'message.sender=<addr>'`

### What Cyberindex Captures (SQL Schema)

| Table | Source | Can Node Do This Natively? |
|---|---|---|
| `block`, `transaction`, `message` | Block/TX parsing | Yes — CometBFT tx_index already provides this |
| `cyberlinks`, `particles` | `EventTypeCyberlink` events | Yes — events indexed, but no structured query API |
| `account_balance` | Bank module state | Yes — gRPC query already exists |
| `routes` | Grid module events | Yes — events indexed |
| `investmints` | Resources module events | Yes — events indexed |
| `contracts` | Wasm module state | Yes — gRPC query already exists |
| `validator`, `pre_commit` | CometBFT consensus | Yes — CometBFT RPC provides this |

### Architecture: Embedded ABCIListener Plugin

Replace cyberindex with a native streaming plugin that writes to an embedded database (SQLite or embedded PostgreSQL):

```
go-cyber node
   BaseApp
     ├── FinalizeBlock → ABCIListener
     │     ├── cyberlink events → embedded DB (cyberlinks, particles)
     │     ├── investmint events → embedded DB
     │     ├── grid events → embedded DB
     │     └── wasm events → embedded DB
     └── Commit → flush batch
                    ↓
              Embedded SQLite/DuckDB
                    ↓
              Native gRPC query endpoints (graph by address, history, analytics)
                    ↓
              Optional: Hasura over embedded DB (for GraphQL compatibility)
```

### Implementation Plan

#### Step 0: Native Graph Query Endpoints (No Consensus Change)

Add gRPC query endpoints to the graph module for data that currently requires cyberindex:

```protobuf
service Query {
  // Existing
  rpc GraphStats(QueryGraphStatsRequest) returns (QueryGraphStatsResponse);

  // New: paginated cyberlinks by neuron address
  rpc CyberlinksByNeuron(QueryCyberlinksByNeuronRequest)
      returns (QueryCyberlinksByNeuronResponse);

  // New: paginated cyberlinks by particle (all links from/to a CID)
  rpc CyberlinksByParticle(QueryCyberlinksByParticleRequest)
      returns (QueryCyberlinksByParticleResponse);

  // New: all particles created by a neuron
  rpc ParticlesByNeuron(QueryParticlesByNeuronRequest)
      returns (QueryParticlesByNeuronResponse);

  // New: incremental graph export (for external indexers and light clients)
  rpc CyberlinksAfter(CyberlinksAfterRequest)
      returns (CyberlinksAfterResponse);
}
```

These queries can be implemented by iterating the existing IAVL store with prefix scans — no new state needed.

#### Step 1: ABCIListener Streaming Plugin (With SDK v0.50)

SDK v0.50 fixes the `ListenFinalizeBlock` bug and provides proper event grouping. Implement a streaming plugin that:

1. Receives all state changes and events via `ABCIListener`
2. Writes structured data to an embedded database (SQLite for simplicity, DuckDB for analytics)
3. Exposes additional gRPC endpoints for historical queries (link history, balance history)
4. Configuration via `app.toml`:
   ```toml
   [indexer]
   enabled = true
   backend = "sqlite"    # or "duckdb", "postgres"
   path = "data/index.db"
   ```

#### Step 2: Schema/Indexer Framework (With SDK v0.53)

SDK v0.53 introduces `cosmossdk.io/schema/indexer` with automatic table generation from module schemas. Implement `HasModuleCodec` for custom modules (graph, rank, resources, grid) so the native indexer framework can auto-generate SQL tables.

### What This Eliminates

| Component | Status |
|---|---|
| cyberindex Docker service | **Eliminated** — node indexes natively |
| PostgreSQL for indexing | **Replaced** by embedded DB (or optional external Postgres) |
| Hasura | **Optional** — can still point at embedded DB for GraphQL, or use native gRPC |
| Block polling latency | **Eliminated** — data available at commit time |
| Separate deployment/monitoring | **Eliminated** — single binary |

### Checklist

- [ ] Add `CyberlinksByNeuron` gRPC endpoint (IAVL prefix scan, no new state)
- [ ] Add `CyberlinksByParticle` gRPC endpoint (IAVL prefix scan)
- [ ] Add `ParticlesByNeuron` gRPC endpoint (IAVL prefix scan)
- [ ] Add `CyberlinksAfter` gRPC endpoint (incremental export by height)
- [ ] Implement ABCIListener plugin with SQLite backend (SDK v0.50)
- [ ] Implement `HasModuleCodec` for graph, rank, resources, grid modules (SDK v0.53)
- [ ] Add `[indexer]` configuration section to `app.toml`
- [ ] Benchmark embedded DB vs external PostgreSQL for query performance
- [ ] Migration guide: cyberindex users → native indexing

---

## IPFS Sidecar: Kubo as Managed Subprocess

### Problem

go-cyber stores CID references but cannot resolve them to content. Users must install, configure, and maintain a separate Kubo (IPFS) node — a process that has historically been painful and error-prone (port conflicts, CORS configuration, bootstrap peers, garbage collection tuning).

Without a working IPFS node, the knowledge graph is just a graph of opaque hashes. Content resolution is essential for search, discovery, and any meaningful interaction with the graph.

### Why Not Embed IPFS in the Binary

Three approaches were evaluated:

| Approach | Verdict | Why |
|---|---|---|
| **Embed full Kubo** | Rejected | +50MB binary, 68 direct deps, go-cid v0.0.7→v0.5.0 breaking upgrade, monthly Kubo releases break integration. Textile tried this, deprecated it. |
| **Embed libp2p + Bitswap** | Rejected | Bitswap without DHT is useless (can't find content providers). Adding DHT = 80% of Kubo without the useful 20% (gateway, pinning, GC). Still massive dep conflicts. |
| **Kubo as managed sidecar** | **Selected** | Zero dep conflicts, full IPFS functionality, process isolation, independent updates, battle-tested. IPFS Cluster uses this pattern. |

### Architecture: Managed Kubo Sidecar

```
cyber init
  ├── Initialize blockchain node (as before)
  └── Initialize IPFS repo with pre-configured config
        ├── Ports: API 5001, Gateway 8080, Swarm 4001 (no conflicts with CometBFT)
        ├── Bootstrap: cyber network peers + default IPFS bootstrap
        ├── CORS: configured for cyber.page and localhost
        ├── Gateway: writable=false, localhost only
        ├── Peering: known cyber full nodes pre-configured
        └── GC: automatic, watermark-based

cyber start
  ├── Start CometBFT + go-cyber (blockchain)
  └── Start Kubo daemon (managed subprocess)
        ├── Lifecycle tied to cyber process (start/stop together)
        ├── Health monitoring (restart on crash)
        └── HTTP API on localhost:5001 (not exposed externally)

go-cyber ←→ Kubo communication: HTTP API (localhost:5001)
```

### What This Gives

- **"Install once, everything works"** — `cyber init` sets up IPFS with sane defaults, no manual configuration
- **Full IPFS** — DHT, Bitswap, DAG resolution, gateway, pinning, GC — everything works because it's real Kubo
- **Process isolation** — Kubo crash doesn't affect consensus; blockchain crash doesn't lose pinned content
- **Independent updates** — upgrade Kubo without touching the blockchain binary, and vice versa
- **Zero dependency conflicts** — go-cyber binary unchanged, Kubo runs as separate process

### go-cyber Integration (Minimal Code)

The blockchain side needs only an HTTP client to Kubo's RPC API:

```go
// x/content/keeper/ipfs.go
type IPFSClient struct {
    apiURL string  // default: http://localhost:5001
}

func (c *IPFSClient) Resolve(cid string) ([]byte, error) {
    resp, err := http.Post(c.apiURL+"/api/v0/cat?arg="+cid, "", nil)
    // ...
}

func (c *IPFSClient) Pin(cid string) error {
    resp, err := http.Post(c.apiURL+"/api/v0/pin/add?arg="+cid, "", nil)
    // ...
}

func (c *IPFSClient) Add(data []byte) (string, error) {
    // multipart upload to /api/v0/add
    // returns CID
}
```

New gRPC endpoints exposed by go-cyber (proxying to Kubo):

```protobuf
service Query {
  // Resolve particle CID to content bytes (proxied to Kubo)
  rpc ResolveParticle(QueryResolveParticleRequest)
      returns (QueryResolveParticleResponse);
}
```

### Pre-configured Kubo Config

The `cyber init` command generates `~/.cyber/ipfs/config` with:

```json
{
  "Addresses": {
    "API": "/ip4/127.0.0.1/tcp/5001",
    "Gateway": "/ip4/127.0.0.1/tcp/8080",
    "Swarm": ["/ip4/0.0.0.0/tcp/4001", "/ip6/::/tcp/4001"]
  },
  "Bootstrap": [
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7...",
    "/dns4/hub.bostrom.cybernode.ai/tcp/4001/p2p/..."
  ],
  "Peering": {
    "Peers": [
      {"ID": "...", "Addrs": ["/dns4/earth.bostrom.cybernode.ai/tcp/4001"]}
    ]
  },
  "Datastore": {
    "StorageMax": "50GB",
    "GCPeriod": "1h"
  },
  "Gateway": {
    "HTTPHeaders": {
      "Access-Control-Allow-Origin": ["http://localhost:3000", "https://cyber.page"]
    }
  },
  "API": {
    "HTTPHeaders": {
      "Access-Control-Allow-Origin": ["http://localhost:3000", "https://cyber.page"]
    }
  },
  "Swarm": {
    "ConnMgr": {"LowWater": 50, "HighWater": 200, "GracePeriod": "60s"}
  }
}
```

### Implementation Plan

#### Phase 1: Managed Lifecycle
- `cyber init` generates IPFS repo with pre-configured config
- `cyber start` launches Kubo as subprocess, manages lifecycle (restart on crash)
- `cyber stop` cleanly shuts down both processes
- `[ipfs]` section in `app.toml` for enabling/disabling and config path
- Kubo binary location: bundled in release tarball or auto-downloaded on first init

#### Phase 2: Content Integration
- `ResolveParticle` gRPC endpoint (proxy to Kubo API)
- Auto-pin particles from new cyberlinks (configurable)
- Pin top-ranked particles from search index (configurable)

#### Phase 3: Cyber-Aware IPFS
- Custom Kubo plugin or peering config that preferentially connects to other cyber nodes
- Content availability metrics per particle (how many cyber nodes pin it)
- Integration with rank: content availability as a signal

### Configuration

```toml
[ipfs]
enabled = true
binary = "/usr/local/bin/ipfs"   # or bundled path
repo_path = "ipfs"               # relative to cyber home
auto_pin = true                  # pin particles from new cyberlinks
pin_top = 1000                   # pin top N ranked particles
```

### Checklist

- [ ] Add IPFS repo initialization to `cyber init` with pre-configured config
- [ ] Implement Kubo subprocess management in `cyber start` (launch, health check, restart)
- [ ] Add `[ipfs]` configuration section to `app.toml`
- [ ] Implement `IPFSClient` HTTP wrapper for Kubo API
- [ ] Add `ResolveParticle` gRPC endpoint
- [ ] Bundle Kubo binary in release artifacts (or auto-download script)
- [ ] Pre-configure bootstrap peers and peering for cyber network
- [ ] Pre-configure CORS for cyber.page and localhost
- [ ] Implement auto-pin for new cyberlinks (Phase 2)
- [ ] Implement top-ranked particle pinning (Phase 2)
- [ ] Test: `cyber init && cyber start` on clean machine gives working IPFS + blockchain
- [ ] Document: how to use existing Kubo installation instead of managed sidecar

---

## Cross-Platform GPU Compute (wgpu, Replace CUDA)

### Problem

CybeRank computation currently requires NVIDIA CUDA — only Linux + NVIDIA GPU can run rank calculation on GPU. macOS, AMD, Intel Arc, and any non-NVIDIA setup falls back to CPU, which is orders of magnitude slower for large graphs. This limits who can run a full node with fast rank computation.

### Current CUDA Architecture

After removing karma/entropy/luminosity, **4 CUDA kernels remain** in `x/rank/cuda/rank.cu`:

| Kernel | Purpose | Complexity |
|---|---|---|
| `get_particle_stake_by_links` | Weighted stake per neuron's links | Simple: divide stake by neudeg |
| `get_compressed_in_links_count` | Count incoming links per particle | Simple: parallel count |
| `get_compressed_in_links` | Build compressed in-links array with weights | Medium: prefix sum + scatter |
| `run_rank_iteration` | One PageRank iteration (core algorithm) | Medium: weighted sum + normalize |

Supporting operations:
- `find_max_ranks_diff` — Thrust-based reduction (convergence check)
- `get_links_start_index` — CPU prefix sum (link offsets)

Build: `//go:build cuda` tag, `-fmad=false` flag for **consensus determinism** (disables fused multiply-add to ensure all nodes compute identical float64 results).

Data types: **float64 (double precision)** throughout — `CompressedInLink` = `{uint64_t fromIndex, double weight}` (16 bytes).

### wgpu/WebGPU as Cross-Platform Alternative

WebGPU (via wgpu-native, written in Rust) provides a cross-platform GPU compute API over:
- **Vulkan** (Linux, Windows, Android)
- **Metal** (macOS, iOS)
- **DX12** (Windows)

Best Go binding: **`go-webgpu/webgpu`** (v0.3.1, zero-CGO, active project). Uses wgpu-native under the hood.

Performance: **85-100% of CUDA** for optimized compute shaders on Vulkan.

### Critical Blockers

#### 1. f64 Not Supported on Apple Silicon / Metal

**This is the biggest blocker for the Mac use case.** Metal (and therefore wgpu on macOS) does **not support 64-bit floating point** in compute shaders. WGSL's `f64` type requires the `shader-f64` extension, which is only available on:
- Vulkan devices with `shaderFloat64` feature (most discrete NVIDIA/AMD GPUs)
- DX12 devices (most desktop GPUs)
- **NOT Metal** — Apple has never shipped f64 in Metal shaders

This means the exact same algorithm (using float64) **cannot run on Mac GPU**.

Workarounds:
- **f32 (single precision):** Works on all GPUs including Apple Silicon. But reduces precision from ~15 decimal digits to ~7. Must prove that PageRank convergence and final values are identical (or acceptably close) to the f64 version for consensus.
- **Emulated f64:** Use double-single (ds) arithmetic — represent each f64 as a pair of f32. ~4x slower than native f64, but still much faster than CPU. Determinism is hard to guarantee.

#### 2. Consensus Determinism (no `-fmad=false` equivalent)

CUDA's `-fmad=false` disables fused multiply-add to ensure `a*b+c` is computed as two separate operations, producing identical results across all NVIDIA GPUs. WGSL has **no equivalent flag**:
- Metal: no FMA control
- Vulkan/SPIR-V: can annotate `NoContraction` on individual operations
- WGSL: no standard annotation yet (proposal exists but not adopted)

This means: ensuring bit-exact results across different GPU vendors (NVIDIA vs AMD vs Intel vs Apple) requires manual effort — either hand-written SPIR-V with `NoContraction`, or proving that FMA differences don't affect final convergence.

### Recommended Approach: Three Phases

#### Phase 1: Optimize CPU Path (Now, No Risk)

The CPU fallback (`calculate_cpu.go`) is unoptimized. Before adding wgpu complexity, make CPU viable for medium-sized graphs:

- [ ] SIMD (AVX2/NEON) for the rank iteration inner loop
- [ ] `sync.Pool` + goroutine parallelism for multi-core utilization
- [ ] Precompute `getOverallOutLinksStake` per CID (currently recomputed O(|V| × avg_degree²))
- [ ] Cache-friendly memory layout for compressed links (struct-of-arrays vs array-of-structs)

Target: **10x CPU speedup** — viable for graphs up to ~1M links without GPU.

#### Phase 2: wgpu Prototype with f32 (Medium Term)

Build a wgpu compute shader implementation of the 4 kernels using f32:

- [ ] Port `run_rank_iteration` to WGSL compute shader (f32)
- [ ] Port `get_compressed_in_links` to WGSL
- [ ] Port `get_particle_stake_by_links` to WGSL
- [ ] Implement max_diff reduction in WGSL
- [ ] Benchmark: compare f32 wgpu vs f64 CUDA rank values on mainnet graph
- [ ] Quantify precision loss: max absolute and relative error in rank values
- [ ] Test consensus: run f32 and f64 on same graph, verify convergence to same ordering (top-N agreement)

If f32 precision is **sufficient for consensus** (same merkle root), this becomes the cross-platform default:
- Works on Mac (Apple Silicon Metal)
- Works on Linux (Vulkan, any GPU vendor)
- Works on Windows (DX12/Vulkan)
- Build tag: `//go:build wgpu`

If f32 precision is **not sufficient**, fall back to Phase 3.

#### Phase 3: Full f64 wgpu (Long Term)

For validators and full nodes that need consensus-grade f64:

- [ ] wgpu with f64 on Vulkan/DX12 (NVIDIA, AMD, Intel Arc on Linux/Windows)
- [ ] Emulated f64 (double-single) on Metal for Mac — slower but correct
- [ ] Cross-vendor determinism testing: NVIDIA vs AMD vs Intel GPU producing identical rank values
- [ ] `NoContraction` annotation in SPIR-V backend for Vulkan determinism
- [ ] Build tag: `//go:build wgpu_f64`

### Decision Matrix

| Platform | CUDA (current) | wgpu f32 (Phase 2) | wgpu f64 (Phase 3) | CPU optimized (Phase 1) |
|---|---|---|---|---|
| Linux + NVIDIA | **Yes** | Yes | Yes (Vulkan) | Yes |
| Linux + AMD | No | Yes (Vulkan) | Yes (Vulkan) | Yes |
| macOS + Apple Silicon | No | **Yes (Metal)** | Emulated only | Yes |
| Windows + any GPU | No | Yes (DX12/Vulkan) | Yes (DX12/Vulkan) | Yes |
| ARM server (no GPU) | No | No | No | **Yes** |

### Migration Path

```
Current:  [CUDA (NVIDIA only)] ←OR→ [CPU (slow, unoptimized)]
                                        ↓
Phase 1:  [CUDA (NVIDIA only)] ←OR→ [CPU optimized (10x faster)]
                                        ↓
Phase 2:  [CUDA] ←OR→ [wgpu f32 (cross-platform)] ←OR→ [CPU optimized]
                                        ↓
Phase 3:  [wgpu f64 (Vulkan/DX12)] ←OR→ [wgpu f32 (Metal)] ←OR→ [CPU]
          └── CUDA becomes optional/deprecated
```

### Checklist

**Phase 1 (CPU optimization, now):**
- [ ] Profile CPU rank calculation on mainnet-sized graph, identify hotspots
- [ ] Parallelize rank iteration across goroutines
- [ ] Add SIMD intrinsics for inner loop (AVX2 on x86, NEON on ARM)
- [ ] Precompute per-CID outgoing stake totals
- [ ] Benchmark: CPU optimized vs CUDA on same hardware

**Phase 2 (wgpu f32 prototype):**
- [ ] Evaluate `go-webgpu/webgpu` v0.3.1: build, run compute shader example
- [ ] Port 4 CUDA kernels to WGSL compute shaders (f32)
- [ ] Integrate with go-cyber via `//go:build wgpu` tag
- [ ] Precision analysis: f32 vs f64 rank values on mainnet state export
- [ ] Consensus test: can f32 produce identical merkle roots as f64?
- [ ] Cross-platform test: same rank output on Mac Metal vs Linux Vulkan

**Phase 3 (wgpu f64, long term):**
- [ ] f64 WGSL shaders with `shader-f64` extension
- [ ] Emulated f64 on Metal (double-single arithmetic)
- [ ] Cross-vendor determinism test (NVIDIA Vulkan vs AMD Vulkan vs Intel Vulkan)
- [ ] `NoContraction` SPIR-V annotation for FMA determinism
- [ ] Deprecation path for CUDA: runtime detection of best available backend

---

## Node Distribution: cyb Desktop App (Tray + Dashboard)

### Problem

go-cyber is currently distributed as a bare CLI binary. Running a node requires manual configuration (config.toml, app.toml, genesis), separate IPFS installation, no visual status feedback, no auto-start, no OS integration. This is a barrier for anyone who isn't a devops specialist.

Goal: **"Download → double-click → it works."** Like Docker Desktop — a daemon with a tray icon and a web dashboard.

### Current State

| What | Status |
|---|---|
| Binary build | `make build` → `build/cyber` CLI |
| Installation | Manual or `scripts/install_cyber.sh` (outdated, references v0.2.0) |
| OS service | None (no systemd/launchd files) |
| Dashboard/UI | None (only Swagger at `:1317/swagger`) |
| IPFS | Separate manual install |
| Desktop app | None |
| GoReleaser | Outdated (references `cyberdcli`) |

### Target Architecture: Three Binaries, One App

The distribution consists of three binaries. The user interacts only with **cyb** (`go-cyb`) — the desktop app that orchestrates the other two.

```
Binaries:
  cyber  (~50MB)  ← blockchain node (Cosmos SDK + CosmWasm + rank)
  ipfs   (~50MB)  ← Kubo IPFS node (separate project, cannot embed due to dep conflicts)
  cyb    (~5MB)   ← desktop app: tray, orchestrator, the only thing user launches
                     (separate repo: go-cyb)

Why three binaries:
  - cyber + ipfs cannot be one binary: massive Go dependency conflicts
    (go-cid v0.0.7 vs v0.5.0, libp2p versions, etc.)
  - cyb is lightweight: no blockchain deps, no IPFS deps, just HTTP + systray
  - Each has its own release cycle: update IPFS or node without touching the others

Process tree (when running):
  cyb (always running, started at login)
    ├── manages → cyber start --home ~/.cyber
    │               ├── CometBFT consensus
    │               ├── Cosmos SDK app
    │               ├── gRPC/REST/RPC servers
    │               └── embedded dashboard (port 26660)
    └── manages → ipfs daemon --repo-dir ~/.cyber/ipfs
                    ├── DHT
                    ├── Bitswap
                    ├── Gateway (port 8080)
                    └── API (port 5001)
```

**cyb is the orchestrator:**
- Launches `cyber` and `ipfs` as child processes
- Monitors health of both (restart on crash)
- Shows combined status in tray icon
- Provides Start/Stop for the whole stack
- On quit: gracefully stops both daemons

**CLI still works independently:**
- `cyber start` works without cyb (for servers, Docker, CI)
- `ipfs daemon` works without cyb (for advanced users)
- cyb is the desktop UX layer, not a requirement

### Port Map (all services from one install)

| Port | Service | Binding |
|---|---|---|
| 26656 | P2P (CometBFT peers) | 0.0.0.0 |
| 26657 | CometBFT RPC | 0.0.0.0 |
| 9090 | gRPC | 0.0.0.0 |
| 9091 | gRPC-Web (browser) | 0.0.0.0 |
| 1317 | REST API + Swagger | 0.0.0.0 |
| **26660** | **Dashboard (web UI)** | localhost |
| 5001 | IPFS API (Kubo) | localhost |
| 4001 | IPFS Swarm (Kubo) | 0.0.0.0 |
| 8080 | IPFS Gateway (Kubo) | localhost |

### Component 1: cyb (go-cyb) — Desktop App & Orchestrator

The **only thing the user launches**. Manages both `cyber` and `ipfs` processes. Separate repository: `go-cyb`.

**Technology:** Go + `getlantern/systray` (cross-platform: macOS, Linux, Windows). No blockchain or IPFS dependencies — only `net/http`, `os/exec`, and `systray`.

**Process Management:**
```
cyb start sequence:
  1. Check if cyber and ipfs are already running (poll health endpoints)
  2. If not: find binaries (PATH or configured location)
  3. Launch ipfs daemon --repo-dir ~/.cyber/ipfs (background)
  4. Wait for IPFS API ready (poll localhost:5001/api/v0/id)
  5. Launch cyber start --home ~/.cyber (background)
  6. Wait for node ready (poll localhost:26657/health)
  7. Show tray icon: 🟡 syncing

cyb health loop (every 5s):
  - GET localhost:26657/status → height, catching_up, voting_power
  - GET localhost:5001/api/v0/id → IPFS peer ID, connected peers
  - If cyber crashed → restart (up to 3 retries, then show error)
  - If ipfs crashed → restart
  - Update icon: 🟢 both synced, 🟡 syncing, 🟠 IPFS down, 🔴 node down

cyb stop sequence:
  1. Send SIGTERM to cyber process → wait for graceful shutdown
  2. Send SIGTERM to ipfs process → wait for graceful shutdown
  3. Icon → 🔴 stopped
```

**Tray Menu:**
```
  ┌─────────────────────────────────┐
  │ 🟢 Cyber Node                   │
  │    Height: 22,451,003           │
  │    Peers: 47  |  Block: 5.2s   │
  │ 🟢 IPFS                         │
  │    Peers: 156  |  Repo: 12 GB  │
  ├─────────────────────────────────┤
  │ Open Dashboard                  │  → open http://localhost:26660
  │ Open IPFS Gateway               │  → open http://localhost:8080
  │ Open IPFS WebUI                 │  → open http://localhost:5001/webui
  ├─────────────────────────────────┤
  │ Start All                       │  → start ipfs + cyber
  │ Stop All                        │  → stop cyber + ipfs
  │ Restart All                     │  → stop all, start all
  ├─────────────────────────────────┤
  │ View Logs                       │  → open ~/.cyber/logs/
  │ Open Config                     │  → open ~/.cyber/
  ├─────────────────────────────────┤
  │ Quit                            │  → stop all + exit tray
  └─────────────────────────────────┘
```

**macOS specifics:**
- Tray lives in menu bar (standard macOS pattern)
- `Cyb.app` bundle in `/Applications/` (contains cyb binary + references to cyber and ipfs binaries)
- Login item via launchd plist or `SMAppService`
- First launch: if binaries not found, offer to download

**Linux specifics:**
- Tray via AppIndicator (GNOME) or SNI (KDE)
- `.desktop` file for autostart: `~/.config/autostart/cyb.desktop`

**Key design:** cyb never touches chain state. Communication is purely HTTP polling. Start/stop is `os/exec.Command`. cyb is a thin orchestrator + status display.

### Component 2: Embedded Dashboard (port 26660)

Single HTML page embedded in the `cyber` binary via Go `embed`. Served by a goroutine alongside the node.

**Content:**
```
┌──────────────────────────────────────────────────────────┐
│  CYBER NODE DASHBOARD                    chain: bostrom  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  STATUS         NETWORK           GRAPH                  │
│  ● Synced       Peers: 47/50      Particles: 8.2M       │
│  Height: 22.4M  In: 32  Out: 15   Cyberlinks: 12.1M     │
│  Block time: 5s Bandwidth: 42%    Neurons: 340K          │
│                                                          │
│  RANK                    IPFS                            │
│  Method: GPU (CUDA)      ● Connected                     │
│  Last calc: block 22.4M  Peers: 156                      │
│  Iterations: 23          Pinned: 45.2K objects           │
│  Tolerance: 0.001        Repo size: 12.3 GB              │
│                                                          │
│  RESOURCES                                               │
│  CPU: 34%  RAM: 8.2 GB  Disk: 124 GB  GPU: 67%         │
│                                                          │
│  LOGS (last 50 lines, auto-scroll)                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 14:23:01 INF committed state height=22451003 ...   │  │
│  │ 14:23:06 INF committed state height=22451004 ...   │  │
│  │ ...                                                │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Implementation:**
- One `index.html` + vanilla JS (~500 lines total)
- Polls every 3-5 seconds:
  - `localhost:26657/status` — height, sync, validator info
  - `localhost:26657/net_info` — peers
  - `localhost:1317/cyber/graph/v1beta1/graph_stats` — graph metrics
  - `localhost:5001/api/v0/id` — IPFS status
  - `localhost:5001/api/v0/repo/stat` — IPFS storage
- Embedded via `//go:embed dashboard/*`
- Served on `localhost:26660` by `net/http` goroutine in the node process
- No frameworks, no npm, no build step — just static files
- Dark theme, monospace, minimal

### Component 3: OS Service Management (`cyber service`)

```bash
cyber service install     # Create systemd unit / launchd plist
cyber service uninstall   # Remove service
cyber service start       # Start via OS service manager
cyber service stop        # Stop via OS service manager
cyber service restart     # Restart
cyber service status      # Show service status
cyber service logs        # Tail service logs (journalctl / log show)
```

**Linux (systemd):**
```ini
[Unit]
Description=Cyber Node — Knowledge Graph Computer
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=%u
ExecStart=/usr/local/bin/cyber start --home %h/.cyber
ExecStop=/usr/local/bin/cyber stop
Restart=always
RestartSec=5
LimitNOFILE=65535
Environment=DAEMON_HOME=%h/.cyber

[Install]
WantedBy=default.target
```

**macOS (launchd):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "...">
<plist version="1.0">
<dict>
    <key>Label</key><string>ai.cyber.node</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/cyber</string>
        <string>start</string>
        <string>--home</string>
        <string>~/.cyber</string>
    </array>
    <key>KeepAlive</key><true/>
    <key>RunAtLoad</key><true/>
    <key>StandardOutPath</key><string>~/.cyber/logs/node.log</string>
    <key>StandardErrorPath</key><string>~/.cyber/logs/node.err</string>
    <key>SoftResourceLimits</key>
    <dict>
        <key>NumberOfFiles</key><integer>65535</integer>
    </dict>
</dict>
</plist>
```

### Component 4: Installer

**One-liner (Linux/macOS):**
```bash
curl -sL https://get.cyber.page | bash
```

Script does:
1. Detect OS/arch (darwin-arm64, linux-amd64, linux-arm64)
2. Download `cyber` + `cyb` binaries from GitHub Releases (go-cyber + go-cyb)
3. Download Kubo binary (or detect existing installation)
4. Install to `/usr/local/bin/`
5. Install `libwasmvm` shared library
6. Run `cyber init` (if first install)
7. Register `cyb` as login item
8. Launch `cyb` (which starts everything)
9. Print: "Dashboard: http://localhost:26660"

**Homebrew (macOS):**
```bash
brew install cybercongress/tap/cyb
# Installs: cyb, cyber, kubo (dependencies)
# Post-install: cyber init, register cyb as login item
```

**Desktop packages:**
- macOS: `Cyb.dmg` containing `Cyb.app` + `cyber` + `ipfs` + `libwasmvm.dylib`
- Linux: `.deb` / `.rpm` / AppImage — all three binaries + libwasmvm.so
- Snap/Flatpak: future option

### User Experience Flow

```
First time (macOS):
  1. User downloads Cyb.dmg
  2. Drags Cyb.app to Applications
  3. Launches Cyb.app → tray icon appears (red — nothing running)
  4. cyb detects first run → runs cyber init + ipfs init
  5. cyb starts ipfs daemon + cyber start
  6. Icon turns yellow (syncing), dashboard opens in browser
  7. User watches sync progress on dashboard
  8. Icon turns green when both synced
  9. On reboot: cyb auto-launches → starts both daemons

First time (Linux, curl):
  1. curl -sL https://get.cyber.page | bash
  2. Script installs cyber + ipfs + cyb + libwasmvm
  3. Runs cyber init + ipfs init
  4. Registers cyb as login item
  5. Starts everything
  6. Prints: "Dashboard: http://localhost:26660"

Daily use:
  - Tray icon always visible — one glance: green = all running
  - Click "Open Dashboard" for details
  - Click "Stop All" before closing laptop
  - cyb auto-restarts crashed processes
  - Updates: cyb checks GitHub Releases for all components, shows notification
```

### Implementation Priority

| Step | Component | Effort | Impact |
|---|---|---|---|
| **1** | **cyb** (go-cyb tray app) | 3-5 days | Critical — primary UX touchpoint |
| **2** | **Dashboard** (embedded web page) | 2-3 days | High — visual status |
| **3** | **`cyber service`** (systemd + launchd) | 1-2 days | High — auto-start/restart |
| **4** | **Kubo sidecar** in `cyber start` | 3-5 days | High — IPFS out of box |
| **5** | **Installer script** (`get.cyber.page`) | 1 day | Medium — easy onboarding |
| **6** | **GoReleaser** update + multi-platform | 1 day | Medium — automated releases |
| **7** | **macOS .dmg / Linux .deb** packages | 2-3 days | Medium — native install |

### Checklist

**cyb (go-cyb — orchestrator + tray UI):**
- [ ] Create `go-cyb` repository, implement with `getlantern/systray` (macOS + Linux)
- [ ] Process management: launch/monitor/restart `cyber` and `ipfs` as child processes
- [ ] Health polling loop: node status + IPFS status → tray icon update
- [ ] Tray menu: Start All / Stop All / Restart / Dashboard / IPFS WebUI / Logs / Config / Quit
- [ ] First-run detection: run `cyber init` + `ipfs init` with preconfigured settings
- [ ] macOS: `Cyb.app` bundle, login item registration (launchd plist or SMAppService)
- [ ] Linux: `.desktop` file for autostart
- [ ] Graceful shutdown: SIGTERM to both processes on Quit

**Dashboard (embedded in cyber):**
- [ ] Embed dashboard HTML/JS in `cyber` binary via `//go:embed`
- [ ] Dashboard: node status, peers, graph stats, rank info, IPFS stats, logs
- [ ] Serve dashboard on `localhost:26660` from node process

**OS service (headless/server use without tray):**
- [ ] `cyber service install/uninstall/start/stop` for systemd
- [ ] `cyber service install/uninstall/start/stop` for launchd

**Packaging:**
- [ ] Update `.goreleaser.yml` in go-cyber: build `cyber` for darwin-arm64, linux-amd64, linux-arm64
- [ ] GoReleaser in go-cyb: build `cyb` for darwin-arm64, linux-amd64, linux-arm64
- [ ] Release tarball: `cyber` + `cyb` + `ipfs` (Kubo) + `libwasmvm` per platform
- [ ] macOS `.dmg`: `Cyb.app` bundle containing cyb + bundled `cyber` + `ipfs` binaries
- [ ] Linux `.deb` / `.rpm`: all three binaries + libwasmvm + systemd unit + .desktop file
- [ ] Installer script (`get.cyber.page`): detect OS, download all binaries, init, launch cyb
- [ ] Homebrew formula: `brew install cybercongress/tap/cyb` (cyb + cyber + ipfs as deps)
- [ ] Auto-update notification in cyb (check GitHub Releases for all three components)
- [ ] Documentation: first-time setup guide with screenshots

---

## Graph Inference: LLM Trained on Knowledge Graph

### Problem

CybeRank gives each particle a single number (PageRank). You can find "what's important" but you can't ask a question and get a human-readable answer. The knowledge graph has 3M particles linked to real content on IPFS — text, markdown, documents. With an IPFS sidecar resolving content, we can train an actual LLM on the graph's content and make it answer questions.

Goal: **periodically train a small LLM from the knowledge graph content, distribute the model as a downloadable binary, enable generative text inference on the node and on clients. Ask a question → get a coherent text answer grounded in the graph's knowledge.**

### Two-Layer Architecture

The inference system has two complementary layers:

| Layer | What | Size | Speed | Purpose |
|-------|------|------|-------|---------|
| **Embeddings** (cid2vec) | Vector per particle from graph topology | ~200 MB | microseconds | Retrieval: find relevant particles |
| **LLM** (cyber-LLM) | Fine-tuned language model on resolved content | ~2 GB | seconds | Generation: answer questions in text |

Both are needed. Embeddings find what's relevant. LLM generates the answer. Together: **RAG (Retrieval-Augmented Generation) grounded in the knowledge graph.**

### Inference Costs a Cyberlink — The Full Loop

**Every inference request requires a cyberlink transaction.** This is the core design: asking the LLM is not free — it costs a link, and that link feeds the graph, and the graph feeds the next model.

```
User wants to ask: "What is the relationship between entropy and consensus?"

  1. PREPARE (client-side)
     - User's question text → ipfs add → question_CID
     - question_CID is now a particle in IPFS

  2. CYBERLINK (on-chain transaction)
     - User submits: MsgCyberlink { from: question_CID, to: INFERENCE_PARTICLE }
       (INFERENCE_PARTICLE is a well-known CID, e.g. "QmInference...")
     - This costs bandwidth (anti-spam), requires stake (Sybil resistance)
     - The cyberlink is now ON-CHAIN — question is part of the graph

  3. INFERENCE (triggered by the link, node-side)
     - Node sees cyberlink to INFERENCE_PARTICLE → triggers inference pipeline
     - RETRIEVE: embed question → HNSW search → top-K relevant particles
     - RESOLVE: top-K CIDs → text content via IPFS
     - GENERATE: llama-server produces answer text
     - answer text → ipfs add → answer_CID

  4. RESPONSE LINK (node creates the return link)
     - Node (or user's client) creates: MsgCyberlink { from: question_CID, to: answer_CID }
     - Answer is now a particle, linked to the question, IN THE GRAPH

  5. THE GRAPH GROWS
     - question_CID and answer_CID are new particles
     - Both are linked (question → inference, question → answer)
     - Next rank recalculation includes these new particles
     - Next model training includes this new content
     - Model gets better → more people ask → more links → better model

         ┌──────────────────────────────────────────┐
         │           THE FULL LOOP                   │
         │                                           │
         │  Ask question ──→ cyberlink (pays)        │
         │       │                                   │
         │       ▼                                   │
         │  LLM generates answer                     │
         │       │                                   │
         │       ▼                                   │
         │  Answer → graph (new particle + link)     │
         │       │                                   │
         │       ▼                                   │
         │  Graph grows → rank recalculates          │
         │       │                                   │
         │       ▼                                   │
         │  Model retrains on bigger graph           │
         │       │                                   │
         │       ▼                                   │
         │  Better model → more questions → ───┐     │
         │       ▲                             │     │
         │       └─────────────────────────────┘     │
         └──────────────────────────────────────────┘
```

**Why this matters:**

| Property | Mechanism |
|----------|-----------|
| **Spam control** | Cyberlink costs bandwidth + requires stake. No stake = no questions. |
| **Demand signal** | Each question is a real on-chain signal of what users want to know. This feeds PageRank — popular questions/answers rank higher. |
| **Self-improving** | Every Q&A pair enriches the graph. The model trains on the graph. More questions → richer graph → better model. |
| **Censorship resistance** | Questions and answers are CIDs on IPFS, linked on-chain. No one can delete them. |
| **Economic alignment** | Neurons who ask good questions (that get linked to by others) earn rank. Neurons who create cyberlinks to inference create demand. |

### Inference Request Flow (Technical)

```
Client:
  1. ipfs add "What is entropy?" → QmQuestion123
  2. sign & broadcast MsgCyberlink(from=QmQuestion123, to=QmInference)
     └── requires: bandwidth, stake (existing anti-spam)
  3. wait for block inclusion

Node (inference trigger):
  4. EndBlocker or event listener sees link to QmInference
  5. Resolve QmQuestion123 via IPFS → "What is entropy?"
  6. RAG pipeline:
     a. Embed question → HNSW → top-5 relevant particles
     b. Resolve top-5 CIDs → context text
     c. llama-server: generate answer with context
  7. ipfs add answer_text → QmAnswer456
  8. Create link: QmQuestion123 → QmAnswer456
     (node signs with module account or user pre-authorizes)

Client:
  9. Query: Search(QmQuestion123) → finds QmAnswer456
  10. Resolve QmAnswer456 → read answer text

Alternative (client-side inference):
  4. Client has local cyber-llm.gguf + embedding.bin
  5. Client runs RAG locally (no node needed for inference)
  6. Client creates answer link: MsgCyberlink(from=QmQuestion123, to=QmAnswer456)
  7. Both question and answer are in the graph either way
```

**Two modes:**

| Mode | Where inference runs | Cyberlink | Graph grows |
|------|---------------------|-----------|-------------|
| **Node-side** | Node runs llama-server, generates answer | User pays link to trigger | Yes — node creates answer link |
| **Client-side** | Client has local model, generates locally | User pays link to record Q&A | Yes — client creates answer link |

Both modes require a cyberlink. Both modes grow the graph. The model itself doesn't care who runs it — the graph is the source of truth.

### Base Model Selection

Target: small enough for consumer hardware (Mac M1 8GB, Linux no GPU), good enough for domain Q&A after fine-tuning.

| Model | Params | Q4_K_M Size | RAM for Inference | Mac M1 Speed | Quality |
|-------|--------|-------------|-------------------|-------------|---------|
| Qwen2.5-1.5B | 1.5B | ~1.0 GB | ~2 GB | ~70 tok/s | Good for simple Q&A |
| **Llama 3.2 3B** | 3.2B | **~1.8 GB** | **~3.5 GB** | **~35 tok/s** | **Best quality/size** |
| Phi-3.5 mini | 3.8B | ~2.2 GB | ~4 GB | ~30 tok/s | Strong reasoning |
| Mistral 7B | 7.2B | ~4.1 GB | ~6.5 GB | ~20 tok/s | Best quality |

**Recommendation: Llama 3.2 3B at Q4_K_M quantization.** 1.8 GB on disk, runs on any Mac M1+, 35 tokens/sec. A fine-tuned 3B matches general-purpose 7B on domain-specific questions.

### Training Pipeline

```
                    PERIODIC TRAINING (daily or per-epoch)
                    ══════════════════════════════════════

  ┌──────────────────────────────────────────────────────────────┐
  │ Step 1: CONTENT RESOLUTION                                   │
  │                                                               │
  │   GraphSnapshot gRPC → all particles (CID list)              │
  │   Rank values → sort by PageRank                             │
  │   For top-N particles (by rank):                             │
  │     IPFS resolve CID → raw content (text, markdown)          │
  │     Filter: keep text, skip binary/images                    │
  │     Cache locally: ~/.cyber/data/content_cache/              │
  │                                                               │
  │   Result: corpus of resolved text documents                   │
  │   Size estimate: 3M particles, ~50% text, ~1KB avg           │
  │          = ~1.5M documents, ~1.5 GB text                     │
  └──────────────────────────────────────────────────────────────┘
                              │
                              ▼
  ┌──────────────────────────────────────────────────────────────┐
  │ Step 2: TRAINING DATA CONSTRUCTION                           │
  │                                                               │
  │  A) Continued Pre-Training (CPT) corpus:                     │
  │     - All resolved text, PageRank-weighted sampling           │
  │     - High-rank particles repeated more often                 │
  │     - Graph walks: follow cyberlinks to create                │
  │       "document sequences" (linked content concatenated)      │
  │                                                               │
  │  B) Instruction Fine-Tuning (IFT) pairs:                     │
  │     - Graph-structure Q&A: "What links from X?" "What is Y?" │
  │     - Synthetic Q&A: use larger model to generate             │
  │       question-answer pairs from content                      │
  │     - Link-based pairs: "How does [content A] relate          │
  │       to [content B]?" for linked particles                   │
  │     - Target: ~50K-100K Q&A pairs                            │
  │                                                               │
  │  C) Graph walk sequences (teaches link structure):            │
  │     - Random walks following cyberlinks, weighted by stake    │
  │     - Concatenate resolved content along the walk             │
  │     - Model learns that linked content is related             │
  └──────────────────────────────────────────────────────────────┘
                              │
                              ▼
  ┌──────────────────────────────────────────────────────────────┐
  │ Step 3: FINE-TUNING                                          │
  │                                                               │
  │   Base model: Llama 3.2 3B (frozen)                          │
  │   Method: LoRA (r=32, alpha=64)                              │
  │                                                               │
  │   Phase 1 (weekly): CPT on full corpus                       │
  │     - 1 epoch over all resolved content                      │
  │     - GPU: 12-24 hours on RTX 4090 / 8-15 hours on A100     │
  │     - CPU: feasible but slow (~2-3 days)                     │
  │                                                               │
  │   Phase 2 (daily): IFT on Q&A pairs                          │
  │     - LoRA fine-tune on 50K-100K Q&A pairs                   │
  │     - GPU: 30-60 min on RTX 4090                             │
  │     - CPU: 3-6 hours                                         │
  │                                                               │
  │   Determinism: fixed seeds, pinned library versions           │
  │   CPU training is bit-exact on x86_64                        │
  │                                                               │
  │   Output: LoRA adapter (~30-80 MB)                           │
  └──────────────────────────────────────────────────────────────┘
                              │
                              ▼
  ┌──────────────────────────────────────────────────────────────┐
  │ Step 4: MERGE, QUANTIZE, PUBLISH                             │
  │                                                               │
  │   Merge LoRA adapter into base weights                       │
  │   Quantize to GGUF Q4_K_M → cyber-llm.gguf (~1.8 GB)       │
  │   ipfs add cyber-llm.gguf → model CID                       │
  │   On-chain: commit {epoch, height, model_cid, hash}         │
  └──────────────────────────────────────────────────────────────┘
```

### Inference Architecture

```
cyber node or client
  │
  ├── llama-server (subprocess, bundled binary)
  │     └── loads cyber-llm.gguf (~1.8 GB)
  │     └── serves OpenAI-compatible HTTP API on localhost:8091
  │
  ├── embedding index (in-process, Go)
  │     └── loads embedding.bin (~200 MB) + HNSW index
  │     └── retrieval: query → top-K relevant particles
  │
  └── IPFS sidecar (subprocess)
        └── resolves CIDs to content for RAG context

Query flow:
  1. User sends question via gRPC/REST
  2. Node embeds query → HNSW retrieval → top-K particles
  3. Node resolves top-K CIDs via IPFS cache → text chunks
  4. Node builds prompt: system + retrieved context + question
  5. Node sends prompt to llama-server → streaming text response
  6. Return generated answer to user
```

### Four Managed Processes

With LLM inference, cyb now orchestrates four processes:

```
cyb (tray app)
  ├── cyber    (blockchain node, ~50 MB)
  ├── ipfs     (Kubo IPFS node, ~50 MB)
  └── llama-server (LLM inference, ~5 MB binary + ~2 GB model)
```

Port map:

| Port | Service |
|------|---------|
| 26656 | P2P (CometBFT) |
| 26657 | CometBFT RPC |
| 9090 | gRPC |
| 1317 | REST API |
| 26660 | Dashboard |
| 5001 | IPFS API |
| 8080 | IPFS Gateway |
| **8091** | **llama-server (LLM inference)** |

### Embeddings Layer (cid2vec) — Retrieval

Same as before but serves as the retrieval component for RAG:

**Training:** TransE/RotatE from graph topology (minutes on CPU, 3M edges).

**Model:** `embedding.bin` — flat `[3M × 64] float32` + HNSW index. ~200 MB after quantization.

**gRPC endpoints (pure Go, no Python):**

```protobuf
service Query {
  // Find particles with similar embeddings (retrieval for RAG)
  rpc Similar(QuerySimilarRequest) returns (QuerySimilarResponse);

  // Predict likely outgoing links
  rpc Predict(QueryPredictRequest) returns (QueryPredictResponse);

  // Raw embedding vector for a particle
  rpc Embedding(QueryEmbeddingRequest) returns (QueryEmbeddingResponse);

  // Current embedding model info
  rpc EmbeddingModel(QueryEmbeddingModelRequest) returns (QueryEmbeddingModelResponse);
}
```

### LLM Layer (cyber-LLM) — Generation

**Runtime:** `llama-server` (from llama.cpp project) as subprocess. Bundled binary, ~5 MB. Supports:
- Apple Silicon (Metal acceleration, native)
- Linux (CUDA for NVIDIA, Vulkan for AMD/Intel)
- CPU fallback everywhere

**Integration from Go:**

```go
// x/inference/keeper/llm.go
type LLMClient struct {
    serverURL string  // default: http://localhost:8091
}

func (c *LLMClient) Generate(ctx context.Context, question string, context []string) (string, error) {
    // Build prompt with retrieved context
    systemPrompt := "You are a knowledge assistant. Answer based on the provided context from the cyber knowledge graph."
    contextText := strings.Join(context, "\n\n---\n\n")

    prompt := fmt.Sprintf("Context:\n%s\n\nQuestion: %s", contextText, question)

    resp, err := http.Post(c.serverURL+"/v1/chat/completions", "application/json",
        // OpenAI-compatible request
    )
    return parseResponse(resp)
}
```

**gRPC endpoints:**

```protobuf
service Query {
  // Inference triggered by cyberlink: resolve question, generate answer, return answer CID
  // Caller must have already submitted MsgCyberlink(question_cid → INFERENCE_PARTICLE)
  rpc Infer(QueryInferRequest) returns (QueryInferResponse);
  // Request: { question_particle: string }  (the CID that was linked to INFERENCE_PARTICLE)
  // Response: { answer_particle: string, answer_text: string,
  //             sources: [{ particle: string, rank: uint64 }], model_epoch: uint64 }

  // Stream the answer token by token (same requirement: cyberlink must exist)
  rpc InferStream(QueryInferRequest) returns (stream QueryInferStreamResponse);

  // Current LLM model info (no link required)
  rpc LLMModel(QueryLLMModelRequest) returns (QueryLLMModelResponse);
  // Response: { epoch, height, model_cid, base_model, params_count, quantization }
}
```

**Link validation:** The `Infer` endpoint checks that a cyberlink `(question_particle → INFERENCE_PARTICLE)` exists on-chain before running inference. No link = no inference. This is enforced at the gRPC handler level — not consensus, but node-side policy.

**INFERENCE_PARTICLE:** A well-known CID registered at genesis (e.g. content "inference" → `QmInference...`). Linking to it signals "I want inference for this question". Different inference types could use different target particles (e.g. `QmSummary...` for summarization, `QmTranslate...` for translation).

### Model Distribution

Two distributable artifacts per epoch:

| Artifact | Size | Format | Purpose |
|----------|------|--------|---------|
| `embedding.bin` | ~200 MB | flat binary + HNSW | Retrieval (cid2vec) |
| `cyber-llm.gguf` | ~1.8 GB | GGUF Q4_K_M | Generation (LLM) |
| **Total** | **~2 GB** | | |

Distribution via IPFS (content-addressed, verifiable):
```
On-chain commitment per epoch:
  {
    epoch: 42,
    height: 22451000,
    embedding_cid: "QmEmb...",     // ~200 MB
    llm_cid: "QmLLM...",           // ~1.8 GB
    embedding_hash: "sha256:...",
    llm_hash: "sha256:...",
    base_model: "llama-3.2-3b",
    lora_rank: 32,
    training_seed: 42
  }
```

**Update strategy:**
- Full model: download `cyber-llm.gguf` (~1.8 GB) — for first sync
- LoRA adapter only: download `adapter.safetensors` (~30-80 MB) — for daily updates (clients already have base model)
- llama.cpp supports runtime `--lora` adapter loading

### Determinism and Verification

**LoRA adapter** (the trainable part) is deterministic on CPU with fixed seeds:

```python
torch.manual_seed(42)
torch.use_deterministic_algorithms(True)
# CPU: bit-for-bit reproducible on x86_64 with pinned PyTorch version
```

**Verification protocol:**
1. Training config published on-chain: `{base_model_hash, training_data_cid, seed, hyperparams}`
2. Anyone can reproduce: download same base model + same training data + same config → same adapter hash
3. Merged GGUF hash committed on-chain
4. Validators with GPU can verify daily; light clients trust the commitment

**Caveat:** Full determinism requires pinning: PyTorch version, Python version, OS (x86_64 Linux). Provide a Docker image or Nix flake as canonical training environment.

### Training Data from Graph Structure

The knowledge graph provides unique training signals that generic LLMs don't have:

**1. PageRank-weighted corpus (most important content seen more)**
```python
for particle in sorted(particles, key=lambda p: p.rank, reverse=True):
    content = ipfs_resolve(particle.cid)
    repetitions = max(1, int(log(particle.rank * 1000)))  # 1-7x
    for _ in range(repetitions):
        corpus.append(content)
```

**2. Graph walk sequences (linked content concatenated)**
```python
def walk_sequence(start_cid, graph, max_tokens=2048):
    """Follow cyberlinks, concatenate resolved content"""
    seq = ipfs_resolve(start_cid)
    current = start_cid
    while len(tokenize(seq)) < max_tokens:
        neighbors = graph.outlinks(current)  # weighted by stake
        next_cid = weighted_sample(neighbors)
        seq += "\n\n---\n\n" + ipfs_resolve(next_cid)
        current = next_cid
    return seq
```

**3. Link-based Q&A pairs**
```
Q: "How does [summary of content A] relate to [summary of content B]?"
A: "These are linked in the knowledge graph: [content A] connects to [content B] through..."
```

**4. Graph structure Q&A**
```
Q: "What are the most important topics about X?"
A: "Based on the knowledge graph, the top-ranked particles about X are: ..."
  (generated from Search(X) results + resolved content)
```

### Configuration

```toml
[inference]
enabled = true

[inference.embeddings]
model_path = "data/embedding.bin"
auto_update = true

[inference.llm]
enabled = true
binary = "llama-server"                  # bundled or PATH
model_path = "data/cyber-llm.gguf"       # ~1.8 GB
port = 8091
context_size = 4096
gpu_layers = 99                          # auto: use GPU if available
auto_update = true                       # download new model each epoch

[inference.rag]
top_k = 5                               # retrieve top-K particles for context
resolve_content = true                   # resolve CIDs via IPFS for context
```

### Implementation Plan

#### Phase A: Embeddings + Retrieval (Now, no consensus change)

The retrieval layer can ship immediately with graph streaming (item 0.1).

- [ ] Python script `scripts/train_embeddings.py`: TransE/RotatE on graph topology
- [ ] Go embedding index in `x/inference`: load flat binary, HNSW search
- [ ] gRPC: `Similar`, `Predict`, `Embedding`, `EmbeddingModel`
- [ ] Benchmark: training time, retrieval quality (MRR, hits@10)

#### Phase B: Content Resolution + Training Data (With IPFS sidecar)

- [ ] Content resolver: bulk IPFS resolution of top-ranked particles
- [ ] Content cache: `~/.cyber/data/content_cache/` with CID→text mapping
- [ ] Corpus builder: PageRank-weighted + graph walk sequences
- [ ] Synthetic Q&A generator: script using existing LLM to create training pairs
- [ ] Training script `scripts/train_llm.py`: LoRA fine-tuning with deterministic config
- [ ] Merge + quantize script: output GGUF Q4_K_M

#### Phase C: Native LLM Inference in Node (Inference-via-Link)

- [ ] Register `INFERENCE_PARTICLE` at genesis (well-known CID for inference requests)
- [ ] Bundle `llama-server` binary in release artifacts
- [ ] Process management: launch/monitor/restart llama-server from cyber node
- [ ] LLM HTTP client in Go: query llama-server for generation
- [ ] RAG pipeline: embed query → retrieve → resolve → generate
- [ ] **Link validation:** `Infer` gRPC checks that cyberlink `(question → INFERENCE_PARTICLE)` exists on-chain before running
- [ ] **Answer publishing:** node creates answer CID via IPFS, creates answer link `(question → answer)`
- [ ] gRPC: `Infer`, `InferStream`, `LLMModel`
- [ ] `[inference.llm]` section in `app.toml`
- [ ] Dashboard integration: show LLM model info, inference stats, recent Q&A pairs
- [ ] Support multiple inference types via different target particles (e.g. `QmSummary`, `QmTranslate`)

#### Phase D: On-Chain Model Commitment (Consensus integration)

- [ ] `MsgCommitModel` message type: `{epoch, embedding_cid, llm_cid, training_config_cid}`
- [ ] Validator verification: re-run training from same data, compare hashes
- [ ] Auto-download: node fetches new model from IPFS when new epoch committed
- [ ] Governance: `inference_epoch_period` param (blocks between retraining)
- [ ] Q&A feedback loop: track which answer particles get linked to by other neurons (quality signal)

#### Phase E: Incremental Training + Optimization

- [ ] Incremental LoRA: daily fine-tune on new content only (~30 min GPU)
- [ ] **Include inference Q&A pairs in training data:** previous epoch's questions + answers feed next model
- [ ] Weekly full retrain to prevent drift
- [ ] LoRA adapter distribution (base model + small daily adapter, ~30-80 MB updates)
- [ ] Evaluate 7B model for validators with more resources
- [ ] Explore Rust training (burn/candle) to eliminate Python dependency

### Checklist Summary

- [ ] **Phase A:** Embeddings pipeline + retrieval gRPC (pure Go)
- [ ] **Phase B:** Content resolution, corpus building, LLM fine-tuning scripts
- [ ] **Phase C:** llama-server sidecar, inference-via-link, RAG pipeline, Infer/InferStream gRPC
- [ ] **Phase D:** On-chain model commitment, validator verification
- [ ] **Phase E:** Incremental training with feedback loop, LoRA adapters

---

## Personal Networks: Private Knowledge Graphs with Sync

### Problem

Launching a personal knowledge graph on go-cyber today requires understanding Cosmos SDK internals: genesis construction, gentx ceremony, validator setup, bech32 prefixes. The binary is hardcoded to bostrom. There is no path from "I want my own graph" to "it's running and syncing across my machines" without significant manual work.

Goal: **`cyber network create my-graph` on one machine, `cyber network join` on another, graphs sync via consensus.** A personal or team knowledge graph that runs on your own machines with the same rank, inference, and IPFS infrastructure as bostrom.

### Why Not Solo Mode

A single-node graph without consensus is just a database. The value is in **sync** — the same graph state replicated across laptop, server, phone. This requires consensus (even with 1 validator), because consensus gives you:

- **Deterministic state** — every machine has the exact same graph after sync
- **State-sync / snapshot** — new machine catches up fast
- **Rank agreement** — all machines compute identical PageRank
- **Model agreement** — inference model trained from identical graph
- **IBC bridge** — personal graph can exchange links with bostrom or other personal graphs

Solo mode without consensus is just SQLite. With consensus, it's a distributed knowledge computer.

### Current Blockers

| Blocker | Details |
|---------|---------|
| **Hardcoded bostrom** | `Bech32Prefix = "bostrom"`, `appName = "BostromHub"`, denoms `"boot"/"hydrogen"` in 5+ files. Cannot change without recompiling. |
| **No `--bech32-prefix` flag** | Prefix sealed at init-time from hardcoded constant. |
| **Hardcoded valoper encoding** | `app.go:589`: `bech32.ConvertAndEncode("bostromvaloper", bz)` — crashes for non-bostrom prefixes. |
| **Complex genesis ceremony** | Standard Cosmos flow: `init` → edit genesis → `add-genesis-account` → `gentx` → `collect-gentxs` → distribute genesis → `start`. 6+ manual steps for single-validator. |
| **No peer discovery** | Peers are empty by default. Second machine needs manual `persistent_peers` configuration with node ID + IP + port. |
| **No quick join** | New machine must get genesis.json + correct config + peer address manually. |

### Target UX

```
Machine A (creator):
  $ cyber network create my-graph
    → generates genesis with single validator (this machine)
    → picks random denom name or uses default
    → starts the chain
    → prints join token: "cyber network join <token>"
    → token = base64(genesis_hash + peer_addr + chain_id)

Machine B (joiner):
  $ cyber network join eyJjaGFp...
    → decodes token → gets genesis + peer address
    → initializes node with matching genesis
    → connects to Machine A as persistent peer
    → state-syncs (with graph + rank snapshots from item 1.3)
    → running — same graph, same rank, same state

Machine C (another join):
  $ cyber network join eyJjaGFp...
    → same flow, now 3 nodes in the network
    → all three have identical graph state
```

### Architecture

```
cyber network create my-graph
  │
  ├── 1. Generate keypair (validator key)
  ├── 2. Build genesis.json:
  │       chain_id: "my-graph-1"
  │       bech32_prefix: "cyber" (default, configurable)
  │       denom: "stake" (default, configurable)
  │       single validator with all initial tokens
  │       all cyber modules enabled (graph, rank, bandwidth, etc.)
  │       sane defaults for personal use:
  │         - bandwidth: relaxed (high base, low price)
  │         - rank: CalculationPeriod=5 (keep frequent)
  │         - block time: 1s (low-latency for personal use)
  │
  ├── 3. Write config.toml:
  │       listen on 0.0.0.0 (accessible from LAN)
  │       fast block times (timeout_commit = 1s)
  │
  ├── 4. Start chain
  │
  └── 5. Print join token:
          cyber network join eyJjaGFpbklkIjoibXktZ3Jh...

cyber network join <token>
  │
  ├── 1. Decode token:
  │       { chain_id, genesis_hash, peer_addrs, rpc_addr }
  │
  ├── 2. Fetch genesis from peer:
  │       GET http://<peer>:26657/genesis → verify hash
  │
  ├── 3. Initialize node:
  │       cyber init <chain_id> --home ~/.cyber-<chain_id>
  │       replace genesis.json with fetched one
  │       set persistent_peers in config.toml
  │
  ├── 4. State-sync or full sync:
  │       if snapshots available (item 1.3): fast state-sync
  │       includes graph + rank data → instant graph access
  │
  └── 5. Start chain
          connected to creator's node, syncing
```

### Join Token

The join token encodes everything a new node needs to connect:

```json
{
  "chain_id": "my-graph-1",
  "genesis_hash": "sha256:abc123...",
  "peers": ["node_id@192.168.1.10:26656"],
  "rpc": "http://192.168.1.10:26657"
}
```

Base64-encoded → single copyable string. Similar to how WireGuard or Tailscale share connection configs.

For LAN discovery: optionally, nodes could broadcast mDNS/Bonjour so `cyber network join` auto-discovers peers on the same network without a token.

### Validator Topology for Personal Networks

Single-validator is the common case (your laptop = the validator). But the system supports adding more:

```
Scenario A: One person, multiple machines
  - Laptop creates network, is the validator
  - Server joins as full node (syncs graph, not a validator)
  - Phone joins as light client (graph streaming from item 0.1)

Scenario B: Team / small group
  - Machine A creates network, is validator
  - Machine B joins, becomes validator via staking TX
  - Now 2 validators — network survives if one goes offline
  - Machine C joins as full node
```

For single-validator personal use: if the validator goes offline, the chain pauses. When it comes back — resumes. This is fine for personal graphs.

### Multi-Network Support

A single cyb (tray app) can manage multiple networks:

```
cyb tray menu:
  ┌─────────────────────────────┐
  │ 🟢 bostrom (main network)   │
  │    Height: 22.4M            │
  │ 🟢 my-graph (personal)      │
  │    Height: 1,234            │
  │ 🟡 team-wiki (team)         │
  │    Height: 567, syncing     │
  ├─────────────────────────────┤
  │ Create New Network...       │
  │ Join Network...             │
  └─────────────────────────────┘
```

Each network runs in its own home directory (`~/.cyber-<chain_id>/`) with its own data, config, and ports. Port allocation is automatic (26656, 26756, 26856, ...).

### IBC Between Personal Graphs and Bostrom

Once both personal network and bostrom run IBC (already available in go-cyber v7), personal graphs can bridge to the global network:

```
Personal graph ←──IBC──→ Bostrom

Use cases:
  - Publish selected links from personal graph to bostrom (selective sharing)
  - Pull high-rank content from bostrom into personal graph
  - Cross-reference: personal notes linked to public knowledge
  - Team graph publishes research to bostrom when ready
```

This is standard IBC relaying — no new code needed, just configuration. The personal chain and bostrom are both Cosmos SDK chains with IBC modules.

### Relation to Multi-Chain Binary (Item 1.6)

The multi-chain binary work (planned for space-pussy unification) is the **prerequisite** for personal networks:

| Multi-chain binary gives | Personal networks use it for |
|--------------------------|------------------------------|
| Configurable bech32 prefix | Each network has its own prefix (or shares "cyber") |
| Denoms from genesis | Each network names its own tokens |
| Chain-id switch in upgrade handlers | Not needed for personal (no upgrades from mainnet state) |
| Single binary serves any genesis | `cyber network create` just generates a new genesis |

Once the binary is chain-agnostic, `cyber network create` is mostly genesis generation + config templating + a join token printer. The hard part (making the binary multi-chain) is already scoped in item 1.6.

### Personal Network Defaults (Tuned for Personal Use)

| Parameter | Bostrom Default | Personal Default | Why |
|-----------|----------------|-----------------|-----|
| Block time | ~5s | **1s** | Low latency, single validator |
| Bandwidth BasePrice | 0.25 | **0.01** | Relaxed — it's your own network |
| Bandwidth RecoveryPeriod | 100 | **10** | Fast recovery |
| Rank CalculationPeriod | 5 | **5** | Keep same — rank is fast on small graphs |
| Max validators | 150 | **10** | Personal networks are small |
| Min gas price | varies | **0** | No fees on personal network |
| Staking unbonding | 21 days | **1 hour** | Personal use, no adversarial setting |

### Checklist

**Prerequisites (from other items):**
- [ ] Multi-chain binary (item 1.6): configurable bech32, denoms from genesis
- [ ] Snapshot extensions (item 1.3): graph + rank in state-sync for fast join

**`cyber network create`:**
- [ ] Subcommand: generates genesis, validator key, starts chain — all in one step
- [ ] Genesis template with personal-network defaults (relaxed bandwidth, fast blocks, zero gas)
- [ ] Configurable: `--denom`, `--bech32-prefix`, `--chain-id` flags
- [ ] Join token generation: base64 encoded `{chain_id, genesis_hash, peers, rpc}`
- [ ] Print join command to stdout after start

**`cyber network join`:**
- [ ] Decode join token → fetch genesis from RPC → verify hash
- [ ] Auto-configure: persistent_peers, chain-id, home directory
- [ ] State-sync by default (if snapshots available)
- [ ] Fallback to full sync from genesis

**`cyber network list`:**
- [ ] List all local networks (scan `~/.cyber-*/config/genesis.json`)
- [ ] Show: chain_id, height, peers, running status

**Multi-network support:**
- [ ] Separate home directories per chain-id (`~/.cyber-<chain_id>/`)
- [ ] Automatic port allocation (avoid conflicts between networks)
- [ ] cyb tray: manage multiple networks from one menu

**Optional / Future:**
- [ ] LAN auto-discovery (mDNS/Bonjour): `cyber network join --auto` finds peers on local network
- [ ] IBC relayer setup between personal graph and bostrom
- [ ] `cyber network invite` — generate a new join token for an existing network
- [ ] `cyber network export` — export graph as flat file for offline sharing

---

## Inter-Knowledge Protocol (IKP): Graph Sync Over IBC

### Problem

IBC moves tokens and messages between chains. But knowledge graphs need to sync **particles, cyberlinks, and rank** — not tokens. When a personal graph wants to publish selected links to bostrom, or pull high-rank content from bostrom into a team graph, raw IBC transfer doesn't help. There is no protocol that understands the semantic structure of a knowledge graph.

Goal: **a protocol layer over IBC that enables selective, bidirectional sync of knowledge graph data between any two go-cyber chains.** Personal ↔ bostrom, team ↔ bostrom, personal ↔ personal.

### What IBC Gives Us (Transport Layer)

go-cyber already has a full IBC stack:
- IBC Transfer (token moves)
- IBC Hooks (wasm contract triggers on packet receive)
- Packet Forward Middleware (multi-hop routing)
- ICA (interchain accounts)
- ICQ (interchain queries)
- Wasm IBC handler (contracts can send/receive IBC packets)

IBC provides: reliable packet delivery, channel management, timeout handling, light client verification. IKP builds on top.

### What IKP Adds (Knowledge Layer)

| IBC (transport) | IKP (knowledge) |
|-----------------|------------------|
| Sends bytes between chains | Sends particles + cyberlinks + rank signals |
| Channels between ports | Knowledge channels between graphs |
| Token denomination tracking | Particle origin tracking (which chain created this CID) |
| Fungible transfer | Non-fungible graph structure sync |

### Protocol Design

#### Packet Types

IKP defines 3 packet types carried over an IBC channel:

```
1. SyncCyberlinks   — create cyberlinks on the receiving chain
2. ShareRankSignal  — share rank values as advisory weights
3. RequestSubgraph  — pull a subgraph from the remote chain
```

No separate "SyncParticles" — particles in go-cyber auto-register on first use via `GetOrPutCidNumber()`. Sending cyberlinks is sufficient; CIDs register themselves on arrival.

#### Packet 1: SyncCyberlinks (Core)

```protobuf
message IKPSyncCyberlinksPacket {
  repeated IKPCyberlink links = 1;
  string source_chain_id = 2;
  uint64 source_height = 3;
}

message IKPCyberlink {
  string from_cid = 1;               // CID string (not number — portable)
  string to_cid = 2;                 // CID string
  string source_neuron = 3;          // original author address on source chain
  uint64 source_weight = 4;          // normalized stake on source chain (advisory)
}
```

**Key design decisions:**

**Who is the neuron on the receiving chain?**

Links on the receiving chain need an `Account` (neuron). Three options:

| Approach | How | Pros | Cons |
|----------|-----|------|------|
| **Bridge neuron** (module account) | All IBC links attributed to `ikp-bridge` module account | Simple, no auth complexity | Loses original authorship. One account = all imported links have equal weight |
| **Derived address** | `neuron = hash(source_chain_id + source_neuron)` → deterministic address per-source-author | Preserves per-author distinction | Derived accounts have no stake → zero weight in rank. Need "virtual stake" |
| **Mapped address** | Source neuron registers a local account on dest chain, links mapped to it | Full authorship preservation | Requires pre-registration, complex UX |

**Recommended: Derived address + virtual stake.**

Each source chain gets a "trust weight" set by governance or channel config. Links from that chain's neurons get virtual stake proportional to:
```
virtual_stake(link) = channel_trust_weight × source_weight(link)
```

This means: bostrom can assign high trust to links from a known team's graph, and low trust to random unknown personal graphs. The receiving chain controls how much influence imported links have on its rank.

**Bandwidth cost:**

Imported links should cost bandwidth on the receiving chain — otherwise they're a spam vector. Two options:
- Relayer pays bandwidth (like IBC relayer pays gas)
- Channel has a "bandwidth budget" per epoch (governance-set)

**Deduplication:**

Same `(from_cid, to_cid, derived_neuron)` on the receiving chain = link already exists → no-op. IAVL key structure already handles this naturally.

#### Packet 2: ShareRankSignal (Advisory)

```protobuf
message IKPShareRankSignalPacket {
  repeated IKPRankEntry ranks = 1;
  string source_chain_id = 2;
  uint64 source_height = 3;
  uint64 source_cid_count = 4;       // total particles on source for normalization
}

message IKPRankEntry {
  string cid = 1;
  uint64 rank_value = 2;             // PageRank × 10^15 on source chain
}
```

**This is NOT consensus-binding.** Rank signals from other chains are advisory data. The receiving chain can:
- Store them in a separate index (not in consensus state)
- Use them as **boost signals** in local rank display (UI re-ranking, not PageRank modification)
- Use them as **training signals** for the inference model (external rank as node feature)
- Ignore them entirely

Rank cannot be directly "imported" because PageRank depends on the entire topology. But knowing that a particle is highly ranked on bostrom is useful information for a personal graph's UI and inference.

#### Packet 3: RequestSubgraph (Pull)

```protobuf
message IKPRequestSubgraphPacket {
  oneof request {
    string particle_cid = 1;          // "give me all links to/from this CID"
    string neuron_address = 2;        // "give me all links by this neuron"
    uint64 min_rank = 3;              // "give me all particles with rank > X"
    uint64 since_height = 4;          // "give me all links since height H"
  }
  uint32 max_links = 5;              // pagination
}
```

Response comes as a `SyncCyberlinks` packet. This enables **pull-based sync**: personal graph asks bostrom "what are the top 1000 particles about topic X?" and bostrom responds with the relevant subgraph.

### Sync Modes

| Mode | Direction | Trigger | Use Case |
|------|-----------|---------|----------|
| **Push** | Source → Dest | Source decides what to export | Publish personal notes to bostrom |
| **Pull** | Dest ← Source | Dest requests specific subgraph | Import bostrom knowledge into personal graph |
| **Mirror** | Bidirectional, continuous | Auto-sync all new links | Two machines syncing the same personal graph (but this is already handled by consensus within the same chain) |
| **Selective push** | Source → Dest, filtered | Source filters by neuron, topic, or rank | Team publishes only their reviewed research |

### Channel Configuration

Each IKP channel has parameters set at channel opening:

```protobuf
message IKPChannelConfig {
  uint64 trust_weight = 1;           // how much rank influence imported links get (0-10000 basis points)
  uint64 bandwidth_budget = 2;       // max links per epoch via this channel
  bool   allow_pull = 3;             // whether remote can request subgraphs
  bool   auto_sync = 4;             // continuously forward new links
  repeated string neuron_filter = 5; // only sync links from these neurons (empty = all)
  uint64 min_rank_filter = 6;        // only sync particles with rank above this
}
```

### Architecture

```
Chain A (e.g., personal graph)          Chain B (e.g., bostrom)
┌──────────────────────────┐           ┌──────────────────────────┐
│  x/graph (local graph)   │           │  x/graph (local graph)   │
│  x/rank  (local rank)    │           │  x/rank  (local rank)    │
│                          │           │                          │
│  x/ikp                   │           │  x/ikp                   │
│   ├── IKP Keeper         │           │   ├── IKP Keeper         │
│   ├── Link Filter        │           │   ├── Link Filter        │
│   ├── Trust Weight Mgr   │           │   ├── Trust Weight Mgr   │
│   └── IBC Module impl    │           │   └── IBC Module impl    │
│         │                │           │         │                │
│         └──── IBC ───────┼───────────┼─────────┘                │
│              Channel     │           │              Channel     │
└──────────────────────────┘           └──────────────────────────┘

Data flow (push):
  1. Neuron on Chain A creates cyberlinks normally
  2. IKP module sees new links (EndBlocker hook or event listener)
  3. If auto_sync on channel: build SyncCyberlinks packet
  4. Apply neuron_filter + min_rank_filter
  5. Send packet over IBC
  6. Chain B receives packet
  7. Chain B creates links with derived neuron address + virtual stake
  8. Chain B's graph grows, rank recalculates
  9. Chain B acknowledges packet

Data flow (pull):
  1. Chain A sends RequestSubgraph(particle_cid="QmFoo")
  2. Chain B receives, queries local graph for QmFoo subgraph
  3. Chain B responds with SyncCyberlinks packet
  4. Chain A receives, creates links locally
```

### Trust and Rank Interaction

This is the most subtle part. How do imported links affect the receiving chain's PageRank?

```
Local PageRank computation:
  - Local links:    neuron has real stake → real weight in rank
  - Imported links: derived neuron has virtual_stake = channel_trust × source_weight

  virtual_stake is NOT real staking tokens. It's a parameter set per-channel.

  Example:
    Channel bostrom↔personal has trust_weight = 5000 (50%)
    Link from bostrom neuron with source_weight 1000
    → virtual_stake on personal chain = 500

    This means: imported links from bostrom have 50% the influence
    of equivalent local links. Tunable per-channel.
```

**Why not import rank directly?**

PageRank is a global property of the entire graph topology. You can't meaningfully "add" rank from one graph to another — the matrices are different sizes, the damping factors mix differently, the topology is different. What you CAN do:
1. Import links → they participate in local rank computation naturally
2. Use remote rank as a UI boost (display, not consensus)
3. Use remote rank as inference model feature

### Relation to Existing Modules

| Existing | IKP Uses |
|----------|----------|
| `x/graph` GraphKeeper | `GetOrPutCidNumber()`, `SaveLink()` — creating particles and links on receive |
| `x/graph` IndexKeeper | `PutLink()` — update in-memory index after import |
| `x/bandwidth` | Cost accounting for imported links |
| `x/cyberbank` | Virtual stake accounting for derived neurons |
| `x/rank` | Imported links participate in rank computation via virtual stake |
| IBC Keeper | Channel management, packet routing |
| Capability Keeper | Scoped capability for IKP port |

### Implementation Plan

#### Phase A: Basic Link Sync (With SDK v0.50 + IBC v8)

Minimum viable IKP: push cyberlinks from one chain to another.

- [ ] New module `x/ikp` implementing `porttypes.IBCModule`
- [ ] `SyncCyberlinks` packet type: send links, receive and create on dest
- [ ] Derived neuron address: `hash(source_chain + source_neuron)` → deterministic account
- [ ] Fixed trust weight per channel (set at channel open)
- [ ] Bandwidth cost: relayer pays, or fixed budget per channel
- [ ] CLI: `cyber ikp push --channel <ch> --neuron <addr>` (push all links from a neuron)
- [ ] CLI: `cyber ikp push --channel <ch> --particle <cid>` (push all links to/from a CID)

#### Phase B: Pull + Selective Sync

- [ ] `RequestSubgraph` packet: request links by particle, neuron, rank threshold, or height
- [ ] Channel configuration: neuron filter, rank filter, bandwidth budget
- [ ] Auto-sync mode: EndBlocker hook forwards new links matching filter criteria
- [ ] CLI: `cyber ikp pull --channel <ch> --particle <cid>` (pull subgraph from remote)

#### Phase C: Rank Signals + Trust Tuning

- [ ] `ShareRankSignal` packet: share rank values as advisory data
- [ ] Rank signal storage (separate from consensus rank — off-chain index)
- [ ] Governance: update `trust_weight` per channel via `MsgUpdateChannelTrust`
- [ ] Dashboard: show imported links, their source chains, trust weights
- [ ] Use imported rank signals as node features in inference model training

#### Phase D: Multi-Chain Knowledge Network

- [ ] Relayer config templates for IKP channels (Hermes / Go relayer)
- [ ] Auto-channel setup in `cyber network create` (IKP channel to bostrom by default)
- [ ] Graph federation: personal graph ↔ team graph ↔ bostrom — multi-hop knowledge routing
- [ ] Reputation system: channels that import high-quality links (as judged by local rank over time) get trust_weight increased automatically

### Checklist Summary

- [ ] **Phase A:** `x/ikp` module, SyncCyberlinks, derived neurons, basic push
- [ ] **Phase B:** Pull requests, selective sync, channel filters, auto-sync
- [ ] **Phase C:** Rank signals, trust governance, inference integration
- [ ] **Phase D:** Multi-chain federation, auto-channels, reputation

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

- [ ] Verify in-place testnet command exists natively in SDK v0.50
- [ ] Confirm fork can be fully eliminated — switch `go.mod` replace to upstream `github.com/cosmos/cosmos-sdk v0.50.15`
- [ ] Audit all custom modules for `x/params` usage, `BeginBlock`/`EndBlock` implementations, and `sdk.Context` in keeper methods
- [ ] Set up a testnet environment for migration testing

### Step 0: Remove x/liquidity (before SDK migration)

- [ ] Add new upgrade version (e.g. `v8`) with `StoreUpgrades.Deleted` for `liquidity` store key
- [ ] Remove `x/liquidity` module code and all references from `app/app.go`
- [ ] Remove `liquiditytypes.ParamKeyTable()` case from v4 upgrade handler params migration
- [ ] Remove liquidity-related `RegisterCustomTypeURL` calls from codec registration
- [ ] Remove liquidity keeper, message server, and gRPC query server wiring
- [ ] Clean up any remaining references in genesis, params, and module registrations
- [ ] Verify the `RegisterCustomTypeURL` SDK fork change is no longer needed (sole consumer was `x/liquidity`)
- [ ] Test upgrade against bostrom mainnet state export (in-place testnet)
- [ ] Mainnet upgrade proposal and execution

### Step 1: SDK v0.50

- [ ] **Eliminate the cosmos-sdk fork** — remove the `go.mod` replace directive and use upstream SDK v0.50.15 (the `RegisterCustomTypeURL` fork change is no longer needed after liquidity removal in Step 0)
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
| wgpu f32 precision for consensus | **High** | f32 may not produce identical merkle roots as f64. Requires empirical testing on mainnet state. Fallback: CPU or emulated f64 |
| wgpu cross-vendor determinism | **Medium** | Different GPU vendors may produce different float results. Requires NoContraction annotations and extensive testing |
| Apple Silicon f64 absence | **Low** (design constraint) | Accept f32 on Metal or use CPU. Not a risk — a known platform limitation to design around |
| LLM training determinism | **Medium** | LoRA fine-tuning on CPU with fixed seeds is bit-exact on x86_64. Different architectures (ARM) may differ. Mitigation: canonical Docker/Nix training environment on x86_64 Linux |
| LLM quality on graph corpus (~1.5 GB text) | **Low** | 1.5 GB of domain text is sufficient for LoRA fine-tuning. Fine-tuned 3B matches general 7B on domain tasks. Synthetic Q&A pairs critical for instruction-following quality |
| Python dependency for training | **Medium** | Training requires PyTorch — acceptable as offline process (cron/script), never in consensus path. Inference uses llama-server (C++ binary). Future: Rust training (burn/candle) to eliminate Python |
| LLM + embeddings distribution size | **Medium** | ~2 GB total (1.8 GB GGUF + 200 MB embeddings). Comparable to state-sync snapshot. Distribute via IPFS. Daily updates via LoRA adapter only (~30-80 MB) |
| Content resolution for training | **Medium** | Requires IPFS sidecar + time to resolve 3M CIDs. Many CIDs may be unavailable. Mitigation: train on available content, weighted by PageRank (high-rank content more likely pinned) |
| llama-server as fourth managed process | **Low** | Same pattern as IPFS sidecar — subprocess managed by cyb. Separate lifecycle, crash doesn't affect consensus. ~5 MB binary + ~2 GB model |
| Personal networks: port conflicts | **Low** | Automatic port allocation per chain-id. Each network gets its own port range (26656+N*100). cyb manages this |
| Personal networks: single-validator liveness | **Low** (design constraint) | If validator goes offline — chain pauses, resumes when back. Acceptable for personal use. For teams: add second validator |
| IKP: spam via imported links | **Medium** | Imported links cost bandwidth (relayer pays or channel budget). Trust weight controls rank influence. Governance can close abusive channels |
| IKP: derived neuron stake | **Medium** | Derived neurons have no real stake — need virtual stake mechanism. Must be carefully designed to prevent rank manipulation via cheap personal chains |

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
