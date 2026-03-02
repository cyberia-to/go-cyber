# Parameters

| Key                        | Type     | Default              |
|----------------------------|----------|----------------------|
| HalvingPeriodVoltBlocks    | uint32   | 9,000,000 blocks     |
| HalvingPeriodAmpereBlocks  | uint32   | 9,000,000 blocks     |
| BaseInvestmintPeriodVolt   | uint32   | 2,592,000 seconds (30 days) |
| BaseInvestmintPeriodAmpere | uint32   | 2,592,000 seconds (30 days) |
| BaseInvestmintAmountVolt   | sdk.Coin | 1,000,000,000 hydrogen (1 GBOOT) |
| BaseInvestmintAmountAmpere | sdk.Coin | 100,000,000 hydrogen (0.1 GBOOT) |

## HalvingPeriodVoltBlocks

Block interval for VOLT halving and period doubling. These two effects compensate each other — see Concepts. Min: 6,000,000.

## HalvingPeriodAmpereBlocks

Block interval for AMPERE halving and period doubling. Min: 6,000,000.

## BaseInvestmintPeriodVolt

Divisor for VOLT cycle calculation: `cycles = maxPeriod / BaseInvestmintPeriodVolt`. This is a pure arithmetic divisor in the cycle formula. Min: 604,800 (7 days).

## BaseInvestmintPeriodAmpere

Divisor for AMPERE cycle calculation. Min: 604,800 (7 days).

## BaseInvestmintAmountVolt

Divisor for VOLT base calculation: `base = amount / BaseInvestmintAmountVolt`. Min: 10,000,000.

## BaseInvestmintAmountAmpere

Divisor for AMPERE base calculation. Min: 10,000,000.

## maxPeriod (computed, not a parameter)

`maxPeriod` is a virtual value derived from block height. It exists solely as a multiplier in the mint formula, inherited from an earlier model where users chose their own lock period and were rewarded proportionally. The current implementation always substitutes the maximum:

```
doubling = 2^(blockHeight / halvingPeriod)
maxPeriod = doubling × halvingPeriod × 6
```

## Legacy Parameters

The following parameters exist in state but are not used by current code:

- `MaxSlots` (default 8): vesting slot limit. Current implementation overwrites the single vesting slot on each mint.
- `MinInvestmintPeriod` (default 86,400 seconds): minimum lock period. Current implementation ignores user-specified length.
