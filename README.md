# Cyber Bindings for CosmWasm

![Crates.io](https://img.shields.io/crates/v/cyber-std)
![Crates.io](https://img.shields.io/crates/d/cyber-std)

This crate provides Cyber-specific bindings to enable your CosmWasm smart contracts to interact with the Cyber blockchain by exposing messages and queriers that can be emitted and used from within your contract.

## Packages

Currently, the cyber-std Cyber bindings include:

| Module    	| Execute                                                                                                                                                                                          	| Query                                                                  	|
|-----------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|------------------------------------------------------------------------	|
| Graph     	| MsgCyberlink                                                                                                                                                                                     	| CyberlinkExist<br>ParticleExist<br>ParticlesAmount<br>CyberlinksAmount 	|
| Rank      	|                                                                                                                                                                                                  	| ParticleRank                                                           	|
| Bandwidth 	|                                                                                                                                                                                                  	| BandwidthPrice<br>BandwidthLoad<br>BandwidthTotal<br>NeuronBandwidth   	|
| Resources 	| MsgInvestmint                                                                                                                                                                                    	|                                                                        	|
| Grid      	| MsgCreateRoute<br>MsgEditRoute<br>MsgEditRouteName<br>MsgDeleteRoute                                                                                                                             	| SourceRoutes<br>SourceRoutedEnergy<br>DestinationRoutedEnergy<br>Route 	|
| DMN       	| MsgCreateThought<br>MsgForgetThought<br>MsgChangeThoughtInput<br>MsgChangeThoughtPeriod<br>MsgChangeThoughtBlock<br>MsgChangeThoughtGasPrice<br>MsgChangeThoughtParticle<br>MsgChangeThoughtName 	| Thought<br>ThoughtStats<br>ThoughtLowestFee                            	|
| Liquidity 	| MsgCreatePool<br>MsgDepositWithinBath<br>MsgWithdrawWithinBath<br>MsgSwapWithinBath                                                                                                              	| PoolParams<br>PoolLiquidity<br>PoolSupply<br>PoolPrice<br>PoolAddress  	|
| Token Factory | CreateDenom<br>ChangeAdmin<br>MintTokens<br>BurnTokens<br>ForceTransfer<br>SetMetadata<br> | FullDenom<br>Metadata<br>Admin<br>DenomsByCreator<br>Params<br> |

PS: There is cyber-std-test with tooling for writing test for multiple contracts

## Contracts

This repository also includes production contracts:

| Contract | Description |
|----------|-------------|
| **cw-cyber-passport** | Identity/passport NFT contract with multi-chain address verification (Cosmos ADR-36, Ethereum signatures) |
| **cw-cyber-gift** | Airdrop distribution contract with merkle tree verification and staged release |
| **cw-cyber-subgraph** | Cyberlink execution proxy for managing graph data |
| **cybernet** | Bittensor-style neural consensus with delegates, staking, and subnets |
| **graph-filter** | Particle filtering and graph management |
| **hub-\*** | Hub contracts for channels, networks, protocols, skills, and tokens |
| **litium-core** | Token factory core: mint, burn, transfer-with-burn with access control |
| **litium-mine** | Proof-of-work mining with difficulty adjustment and reward distribution |
| **litium-stake** | Staking with reward accrual and distribution |
| **litium-refer** | Referral tracking for miners |
| **litium-wrap** | Native/CW20 wrapping *(WIP — core functionality not yet implemented)* |

### Passport Contract
Creates and manages identity passports as NFTs with:
- Nickname registration with cyberlink to name subgraph
- Avatar with cyberlink to avatar subgraph
- Multi-address proofs (Cosmos, Ethereum) with signature verification
- Address labels and metadata

### Gift Contract
Merkle-tree based airdrop with:
- Multi-stage release schedule
- Integration with passport contract for identity verification
- Configurable claim and release mechanics

See individual contract READMEs in `/contracts/` for detailed documentation.

## Project Structure

This project follows a **mono-repo workspace** pattern — all contracts and shared packages live in a single repository.

```
cw-cyber/
├── Cargo.toml          # workspace root
├── contracts/          # smart contracts (each compiles to .wasm)
│   ├── hub-channels/
│   ├── hub-networks/
│   ├── hub-protocols/
│   ├── hub-libs/
│   ├── hub-skills/
│   ├── hub-tokens/
│   ├── cybernet/
│   └── ...
├── packages/           # shared libraries (not compiled to .wasm)
│   ├── cyber-std/
│   └── cyber-std-test/
└── artifacts/          # optimized .wasm binaries + checksums
```

**Why mono-repo:**
- Shared dependencies via single `Cargo.lock` — all contracts build with the same dependency versions
- Easy code reuse between contracts via workspace `path` dependencies
- Atomic cross-contract changes — API changes across contracts land in a single commit
- Single CI/CD pipeline and optimizer run

## Target Runtime

These contracts are built and tested against the following runtime versions deployed on **Bostrom mainnet**:

| Component      | Version  |
|----------------|----------|
| Cosmos SDK     | v0.47.16 |
| wasmd          | v0.46.0  |
| wasmvm         | v1.5.9   |
| cosmwasm-std   | 1.5.8    |

When upgrading dependencies, ensure `cosmwasm-std` remains compatible with the `wasmvm` version running on-chain. Mismatched versions may produce wasm binaries that the node cannot execute.

## Interacting with Deployed Contracts

All deployed contract addresses are in `deployments/bostrom-mainnet.toml`. You need the `cyber` CLI to interact with them.

### Prerequisites

```bash
# Install cyber CLI (or build from go-cyber repo)
# Verify it works:
cyber version

# Set common variables
NODE=https://rpc.bostrom.cybernode.ai:443
```

### Reading (queries — no wallet needed)

```bash
# Query any contract using its address from deployments/bostrom-mainnet.toml
cyber query wasm contract-state smart <contract_address> '<json_query>' --node $NODE -o json

# Example: look up a passport
cyber query wasm contract-state smart \
  bostrom1xut80d09q0tgtch8p0z4k5f88d3uvt8cvtzm5h3tu3tsy4jk9xlsfzhxel \
  '{"passport_by_nickname":{"nickname":"master"}}' --node $NODE -o json

# Example: query litium-mine config
cyber query wasm contract-state smart \
  bostrom123wr6faa62xxrft6t5wmpqmh9g0chvu7ddedggx0lkecmgef7thsls9my2 \
  '{"config":{}}' --node $NODE -o json
```

### Writing (transactions — requires funded wallet)

```bash
TX_FLAGS="--from <your-key> --chain-id bostrom --node $NODE --gas-prices 0boot --gas-adjustment 2.5 --gas auto -y"

# Execute a message on any contract
cyber tx wasm execute <contract_address> '<json_msg>' $TX_FLAGS

# Execute with funds attached
cyber tx wasm execute <contract_address> '<json_msg>' --amount 1000000boot $TX_FLAGS
```

### JSON Schemas

Each contract has JSON Schema files (CosmWasm equivalent of ABI) in `contracts/<name>/schema/`:
- `execute_msg.json` — all executable messages with parameter types
- `query_msg.json` — all query messages
- `instantiate_msg.json` — initialization parameters
- Response schemas for each query

These schemas are checked into git so anyone cloning the repo can see the full API.

### Contract-specific guides

See individual contract READMEs for detailed query/execute examples:
- [cw-cyber-passport](contracts/cw-cyber-passport/README.md) — passport identity NFTs
- litium contracts — see `scripts/deploy-litium-modular.sh` for deployment and interaction patterns

## Building

### Build a specific contract

```bash
cargo build --package hub-channels
```

### Build optimized .wasm for all contracts

```bash
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/optimizer:0.16.0
```

Optimized artifacts are written to `artifacts/` with deterministic checksums in `artifacts/checksums.txt`.

### Build a single optimized contract

```bash
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/optimizer:0.16.0 ./contracts/hub-channels
```

## Deployment

### Deployment tracking

All deployment metadata is tracked in `deployments/` directory. Each network has its own TOML file:

```
deployments/
├── bostrom-mainnet.toml
└── space-pussy-testnet.toml
```

Example deployment record:

```toml
[hub-channels]
code_id = 42
address = "bostrom1abc..."
admin = "bostrom1xyz..."
commit = "ed614a0"
deployed_at = "2026-02-20"
checksum = "3c773eec51dba62e7a8bd9c15987a7ef1e79dc81727946e01b392e607c66dff4"

[hub-networks]
code_id = 43
address = "bostrom1def..."
admin = "bostrom1xyz..."
commit = "529c32d"
deployed_at = "2026-02-18"
checksum = "3b4d4d4bfa6a65b75a0898f9bde41fb5ef5ff5c866f91b3f03900943fdec4b61"
```

After every deployment, update the corresponding file and commit it to the repo.

### Checking what needs redeployment

There are two ways to determine if a contract needs redeployment:

**1. Git-based check** — compare the deployed commit with current HEAD:

```bash
# Check if hub-channels has changes since last deploy
DEPLOYED_COMMIT="ed614a0"  # from deployments/*.toml
git diff --name-only "$DEPLOYED_COMMIT"..HEAD -- contracts/hub-channels/ packages/cyber-std/
```

If there is output, the contract source has changed and may need redeployment.

**2. Checksum-based check (deterministic)** — compare the local optimized binary against the on-chain code hash:

```bash
# 1. Build optimized wasm
docker run --rm -v "$(pwd)":/code \
  cosmwasm/optimizer:0.16.0 ./contracts/hub-channels

# 2. Get local checksum from artifacts/checksums.txt
LOCAL_HASH=$(grep hub_channels artifacts/checksums.txt | awk '{print $1}')

# 3. Get on-chain code hash
ONCHAIN_HASH=$(cyber query wasm code-info $CODE_ID --output json | jq -r '.data_hash')

# 4. Compare
if [ "$LOCAL_HASH" != "$ONCHAIN_HASH" ]; then
  echo "hub-channels: code changed — needs store + migrate"
else
  echo "hub-channels: up to date"
fi
```

The checksum-based approach is the only way to be 100% certain, since dependency updates in `Cargo.lock` can change the binary even without touching contract source code.

### Deployment actions

| Situation | Action |
|---|---|
| Contract code changed | `store` new code, then `migrate` existing instance |
| Only config/data needs update | `execute` with an admin message |
| Brand new contract | `store` code, then `instantiate` |
| Shared package changed | Rebuild, check checksums — if .wasm changed, `store` + `migrate` |

### What affects the binary

Changes to any of the following can change the compiled `.wasm`:

- `contracts/<name>/src/**` — contract source code
- `packages/**` — shared libraries used as dependencies
- `Cargo.lock` — transitive dependency versions
- `Cargo.toml` — features, dependency versions, compiler settings

### Deploy workflow

```bash
# 1. Build optimized wasm
docker run --rm -v "$(pwd)":/code \
  cosmwasm/optimizer:0.16.0 ./contracts/hub-channels

# 2. Store code on-chain
RES=$(cyber tx wasm store artifacts/hub_channels-aarch64.wasm \
  --from wallet --gas auto --gas-adjustment 1.3 -y --output json)
CODE_ID=$(echo $RES | jq -r '.logs[0].events[-1].attributes[1].value')

# 3a. Instantiate (new contract)
cyber tx wasm instantiate $CODE_ID '{"config": ...}' \
  --from wallet --label "hub-channels" --admin bostrom1... -y

# 3b. Migrate (existing contract)
cyber tx wasm migrate $CONTRACT_ADDR $CODE_ID '{}' --from wallet -y

# 4. Update deployments/bostrom-mainnet.toml with new code_id, commit, checksum
# 5. Commit the updated deployment file
```
