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
