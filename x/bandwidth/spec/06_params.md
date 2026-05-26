# Parameters

The bandwidth module contains the following parameters:

| Key | Type | Default | Validation |
| --- | --- | --- | --- |
| RecoveryPeriod | uint64 | 100 | > 50 |
| AdjustPricePeriod | uint64 | 5 | >= 5 |
| BasePrice | sdk.Dec | 0.25 | (0, 1] |
| BaseLoad | sdk.Dec | 0.10 | [0.01, 1] |
| MaxBlockBandwidth | uint64 | 10000 | > 1000 |

## RecoveryPeriod

Length of the sliding window (in blocks) over which the module tracks total bandwidth consumption. Determines how far back the load calculation reaches.

## AdjustPricePeriod

Interval (in blocks) between bandwidth price recalculations. The EndBlocker adjusts the price every `AdjustPricePeriod` blocks.

## BasePrice

Minimum price multiplier for bandwidth billing. At 0.25, each cyberlink costs 250 millivolt (0.25 * 1000). Since the v6 upgrade, the price is fixed at `BasePrice`.

## BaseLoad

Target network load fraction used in the price adjustment formula. Load is calculated as `totalSpent / (BaseLoad * desirableBandwidth)`. With `BaseLoad` = 0.10, the target utilization is 10% of desirable bandwidth.

## MaxBlockBandwidth

Maximum total bandwidth units that can be consumed in a single block. Transactions exceeding this limit fail with `ErrExceededMaxBlockBandwidth`.

## Governance

Parameters are updatable via `MsgUpdateParams`, which requires the module's governance authority.
