# Proposal: CosmWasm Wrapper Contracts for Bostrom

## Context

Currently contracts interact with Bostrom-specific modules (Graph, Grid, DMN, TokenFactory, Resources) through `cyber-std` custom bindings — a non-standard `CyberMsg`/`CyberQuery` pattern hardwired into go-cyber. This creates:
- Vendor lock-in: contracts can't run on vanilla CosmWasm
- No composability: contract A can't call module X through contract B without duplicating binding code
- Testing pain: need a full cyber node binary, can't test on generic wasmd

Strategic direction: transition from Go to Rust base. Wrappers become the intermediate layer that first proxies to Go modules, then replaces them with native Rust logic.

The existing `cw-cyber-subgraph` already proves this pattern for Graph — passport never calls `CyberMsg::Cyberlink` directly, it calls the subgraph wrapper.

## Key Constraint

**Contract = Actor.** The go-cyber wasm handler enforces `msg.neuron/program/source == contract_address`. A wrapper cannot act "on behalf of" a user — the wrapper IS the identity. This is by design and matches the subgraph pattern.

## What Can and Cannot Be Wrapped

| Module | Execute from WASM | Query from WASM | Wrappable |
|---|---|---|---|
| Graph (Cyberlink) | Yes (neuron=contract) | Yes | Yes — `cw-cyber-subgraph` exists |
| Grid (Energy Routes) | Yes (source=contract) | Yes | Yes |
| DMN (Thoughts) | Yes (program=contract) | Yes | Yes |
| Resources (Investmint) | Yes (neuron=contract) | Yes | Yes |
| TokenFactory | Yes (sender=contract) | Yes | Yes |
| Liquidity | **NO** — dispatch not wired | Yes (query only) | **NO** without go-cyber change |
| Clock | **NO** — no wasm interface | No | **NO** without go-cyber change |
| Rank | No execute | Yes | Query-only wrapper |
| Bandwidth | No execute | Yes | Query-only wrapper |

## Deliverables

### 1. Package: `cyber-wrap-std`

**Path:** `packages/cyber-wrap-std`

Shared ACL + helpers extracted from existing `cw-cyber-subgraph`.

```
acl.rs       — AclConfig { admins, executors }, assert_admin/assert_executor, storage, standard msgs
helpers.rs   — typed WasmMsg::Execute builders for each wrapper (cyberlink_submsg, mint_submsg, etc.)
errors.rs    — WrapError { NotAdmin, NotExecutor, InvalidAddress, Std }
```

ACL model (same for every wrapper):
- **admins** — can change config, update ACL lists
- **executors** — can perform module operations

### 2. Refactor: `cw-cyber-subgraph` (Graph wrapper, exists)

- Replace inline ACL with `cyber-wrap-std::acl`
- Add query passthroughs: `ParticleRank`, `GraphStats`, `NeuronBandwidth` (of self)
- Bump version, add migration

### 3. New contract: `cw-cyber-grid`

Wraps Grid module. Wrapper IS the energy source.

Execute: `CreateRoute { destination, name }`, `EditRoute { destination, value }`, `EditRouteName { destination, name }`, `DeleteRoute { destination }`
Query: `MyRoutes`, `MyRoutedEnergy`, `Route { destination }`, `DestinationRoutedEnergy { destination }`

### 4. New contract: `cw-cyber-dmn`

Wraps DMN module. Wrapper IS the program.

Execute: `CreateThought { trigger, load, name, particle }`, `ForgetThought { name }`, `ChangeThoughtInput { name, input }`, `ChangeThoughtPeriod { name, period }`, `ChangeThoughtBlock { name, block }`
Query: `MyThought { name }`, `MyThoughtStats { name }`, `ThoughtsFees`

### 5. New contract: `cw-cyber-resources`

Wraps Resources module. Wrapper IS the neuron that investmints.

Execute: `Investmint { amount, resource, length }`
Query: `MyBandwidth`

Note: contract must be funded with BOOT/HYDROGEN and staked. Optionally add `Stake/Unstake/Redelegate` helpers (standard `CosmosMsg::Staking`).

### 6. New contract: `cw-cyber-tokenfactory`

Wraps TokenFactory. Wrapper IS the denom creator/admin.

Execute: `CreateDenom { subdenom, metadata }`, `MintTokens { denom, amount, mint_to }`, `BurnTokens { denom, amount, burn_from }`, `ForceTransfer { denom, amount, from, to }`, `SetMetadata { denom, metadata }`, `ChangeAdmin { denom, new_admin }` (admin-only)
Query: `FullDenom { subdenom }`, `MyDenoms`, `DenomMetadata { denom }`, `DenomAdmin { denom }`, `DenomCreationFee`

### 7. New contract: `cw-cyber-oracle` (query aggregator)

No execute (beyond ACL). Passthrough for ALL `CyberQuery` variants via a single contract address. Useful for frontends and cross-contract reads.

Query: all 20+ CyberQuery variants unified.

## NOT in scope (requires go-cyber changes)

- **Liquidity execute** — `dispatch_msg.go` doesn't route liquidity messages. Old `x/liquidity/wasm/liquidity.go` is deprecated. Need to add `Messenger` implementation and register in `RegisterCustomPlugins()`.
- **Clock** — no wasm directory. Need to create `x/clock/wasm/` with Messenger + Querier.

Both should be tracked as go-cyber issues, not cw-cyber work.

## Migration Path

1. **Phase 1**: Create `cyber-wrap-std`, refactor `cw-cyber-subgraph`
2. **Phase 2**: Create `cw-cyber-tokenfactory` + `cw-cyber-grid` (highest utility)
3. **Phase 3**: Create `cw-cyber-dmn` + `cw-cyber-resources`
4. **Phase 4**: Create `cw-cyber-oracle`
5. **Phase 5**: Refactor passport/graph-filter to use `cyber-wrap-std` helpers
6. **Phase 6**: Document pattern — new contracts use wrappers, direct `cyber-std` only for own-identity cases

## Critical files

| File | Role |
|---|---|
| `contracts/cw-cyber-subgraph/src/state.rs` | ACL pattern to extract |
| `contracts/cw-cyber-subgraph/src/execute.rs` | Cyberlink wrapper pattern |
| `contracts/cw-cyber-passport/src/helpers.rs:229-245` | Composition pattern (prepare_cyberlink_submsg) |
| `contracts/litium-wrap/src/contract.rs` | TokenFactory direct usage reference |
| `packages/cyber-std/src/msg.rs` | All CyberMsg variants |
| `packages/cyber-std/src/querier.rs` | CyberQuerier API |
| `packages/cyber-std/src/query.rs` | All CyberQuery variants |

## Verification

1. Each wrapper: unit tests with `cw-multi-test` (mock CyberMsg handling via `cyber-std-test`)
2. Integration: deploy to testnet, verify each wrapper calls native module correctly
3. Composition: test passport → subgraph call pattern works with new `cyber-wrap-std` helpers
4. Query: verify oracle returns same results as direct `CyberQuerier` calls
