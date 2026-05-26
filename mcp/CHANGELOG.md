# Changelog

## [0.8.3] - 2026-03-19

### Changed
- Made `li_mine_proof` tool always available — removed `#[cfg(feature = "mining")]` conditional compilation gates
- Made `uhash-prover` and `uhash-core` non-optional dependencies (mining is always built-in)
- Removed `[features]` section from Cargo.toml

### Fixed
- `li_mine_proof` tool not being discovered by some MCP clients due to conditional compilation

## [0.2.0] - 2026-02-26

### Added

**Signing infrastructure**
- Wallet management from `BOSTROM_MNEMONIC` environment variable
- `SigningStargateClient` with merged cyber + osmosis + default type registries
- `SigningCosmWasmClient` for contract execution
- Gas estimation with configurable multiplier and minimum gas floor
- `BOSTROM_MAX_SEND_AMOUNT` circuit breaker

**Wallet tools (7)**
- `wallet_info`, `wallet_send`, `wallet_delegate`, `wallet_undelegate`, `wallet_redelegate`, `wallet_claim_rewards`, `wallet_vote`

**Knowledge graph write tools (5)**
- `graph_create_cyberlink`, `graph_create_cyberlinks`, `graph_investmint`, `graph_pin_content`, `graph_create_knowledge`
- IPFS pinning via cybernode cluster API (`https://io.cybernode.ai`)

**CosmWasm contract tools (7)**
- `contract_execute`, `contract_execute_multi`
- `wasm_upload`, `wasm_instantiate`, `wasm_migrate`, `wasm_update_admin`, `wasm_clear_admin`

**Lithium mining write tools (5)**
- `li_submit_proof`, `li_stake`, `li_unstake`, `li_claim_rewards`, `li_set_referrer`

**Token factory tools (6)**
- `token_create`, `token_set_metadata`, `token_mint`, `token_burn`, `token_change_admin`, `token_list_created`

**Liquidity & swap tools (7)**
- `swap_tokens` (auto pool discovery + price calculation), `swap_estimate`
- `liquidity_create_pool`, `liquidity_deposit`, `liquidity_withdraw`, `liquidity_swap`, `liquidity_pool_detail`
- Automatic swap fee calculation from chain params

**Energy grid tools (4)**
- `grid_create_route`, `grid_edit_route`, `grid_delete_route`, `grid_list_routes`

**IBC tools (2)**
- `ibc_transfer`, `ibc_channels`

### Dependencies
- Added: `@cosmjs/stargate`, `@cosmjs/cosmwasm-stargate`, `@cosmjs/proto-signing`, `@cosmjs/amino`, `@cosmjs/crypto`, `@cosmjs/encoding`, `@cybercongress/cyber-ts`

### Summary
- Tools: 44 → 87 (44 read + 43 write)
- New files: 18 source files
- Read tools continue to work without a mnemonic

## [0.1.1] - 2025-05-06

### Added
- Export `createServer` for Smithery scanning

## [0.1.0] - 2025-05-06

### Added
- Initial release: 44 read-only tools for Bostrom blockchain
- Knowledge graph, economy, lithium mining, governance, infrastructure
