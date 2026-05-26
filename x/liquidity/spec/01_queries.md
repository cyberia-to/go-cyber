# Queries

All queries are served via gRPC at `/cyber.liquidity.v1beta1.Query/`.

## Params

Returns current module parameters.

## LiquidityPool

Returns a single pool by pool ID.

## LiquidityPoolByPoolCoinDenom

Returns a pool by its pool coin denomination.

## LiquidityPoolByReserveAcc

Returns a pool by its reserve account address.

## LiquidityPools

Returns all pools (paginated).

## LiquidityPoolBatch

Returns the current batch for a given pool ID.

## PoolBatchSwapMsgs

Returns all swap messages in a pool batch (paginated).

## PoolBatchSwapMsg

Returns a single swap message by pool ID and message index.

## PoolBatchDepositMsgs

Returns all deposit messages in a pool batch (paginated).

## PoolBatchDepositMsg

Returns a single deposit message by pool ID and message index.

## PoolBatchWithdrawMsgs

Returns all withdraw messages in a pool batch (paginated).

## PoolBatchWithdrawMsg

Returns a single withdraw message by pool ID and message index.
