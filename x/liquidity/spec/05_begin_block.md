# Begin-Block

## Delete completed batch messages

`{Deposit,Withdraw,Swap}MsgState` records with `ToBeDeleted = true` removed from the store. Records are kept for one block after execution so they remain queryable in the block where they were processed.

## Reset unexecuted batch messages

Remaining `{Deposit,Withdraw,Swap}MsgState` records have `Executed` and `Succeeded` flags reset to `false` for the next batch cycle.

Expired swap orders (`OrderExpiryHeight` <= current height) marked `ToBeDeleted = true`, escrowed coins refunded.

## Reinitialize pool batch

Executed `PoolBatch` records reinitialized for the next batch:

- `Index` incremented
- `BeginHeight` set to current block height
- `Executed` set to `false`
