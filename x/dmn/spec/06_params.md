# Parameters

| Parameter | Type | Default | Validation |
|---|---|---|---|
| MaxSlots | uint32 | 4 | ≥ 4 |
| MaxGas | uint32 | 2,000,000 | ≥ 2,000,000 |
| FeeTtl | uint32 | 50 | > 0 |

- `MaxSlots` — maximum number of concurrent thoughts across the system. Programs compete for slots via gas-price auction.
- `MaxGas` — total gas budget for thought execution per block. Once exhausted, remaining thoughts are skipped until the next block.
- `FeeTtl` — per-block fee charged to each thought for occupying a slot between executions. Discourages low-frequency thoughts from holding slots indefinitely.

Parameters are updatable via `MsgUpdateParams` (governance).
