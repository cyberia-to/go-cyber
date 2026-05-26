# WASM Bindings

WASM bindings are deprecated. The `Parse()` and `Query()` methods return nil. Legacy `ParseCustom` and `QueryCustom` still function but are not recommended.

## Messages (deprecated)

Contracts call liquidity operations via custom messages:

| Operation           | Fields                                                            |
|---------------------|-------------------------------------------------------------------|
| CreatePool          | pool_creator_address, pool_type_id, deposit_coins                 |
| DepositWithinBatch  | depositor_address, pool_id, deposit_coins                         |
| WithdrawWithinBatch | withdrawer_address, pool_id, pool_coin                            |
| SwapWithinBatch     | swap_requester_address, pool_id, swap_type_id, offer_coin, demand_coin_denom, offer_coin_fee, order_price |

## Queries (deprecated)

| Query         | Input   | Returns                                                  |
|---------------|---------|----------------------------------------------------------|
| PoolParams    | pool_id | type_id, reserve_coin_denoms, reserve_account, pool_coin_denom |
| PoolLiquidity | pool_id | reserve coins                                            |
| PoolSupply    | pool_id | pool coin total supply                                   |
| PoolPrice     | pool_id | X/Y price ratio                                          |
| PoolAddress   | pool_id | reserve account address                                  |
