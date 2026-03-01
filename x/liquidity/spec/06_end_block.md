# End-Block

## Append messages to batch

After message validation and coin escrow, incoming `MsgDepositWithinBatch`, `MsgWithdrawWithinBatch`, and `MsgSwapWithinBatch` messages appended to the current `PoolBatch`.

## Execute batch

When `BlockHeight % UnitBatchHeight == 0` the batch executes for each pool. Execution order:

1. Swaps — orderbook built, uniform swap price found, matched coins exchanged, fees collected.
2. Deposits — escrowed coins sent to reserve, pool coins minted.
3. Withdrawals — pool coins burned, reserve coins sent to withdrawer.

Each message result is recorded in the corresponding `MsgState`. Successfully processed and failed messages are marked `ToBeDeleted = true` (deleted in the next BeginBlock). Partially filled swap orders remain in the batch for the next cycle.

## Refunds

Escrowed coins refunded for failed messages and cancelled orders. Refunds use `SendCoinsFromModuleToAccount` (escrow → sender).
