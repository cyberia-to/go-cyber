# State

All cyberbank state lives in memory — rebuilt from chain state on each restart.

## In-memory maps

| Map | Key | Value | Description |
| --- | --- | --- | --- |
| userTotalStakeAmpere | accountNumber (uint64) | ampereStake (uint64) | Current rank calculation snapshot |
| userNewTotalStakeAmpere | accountNumber (uint64) | ampereStake (uint64) | Accumulator for next rank calculation |
| accountToUpdate | — | []AccAddress | Accounts touched since last EndBlock |

## State loading

On node start or snapshot restore, `LoadState` iterates all accounts at two block heights:

1. `rankCtx` (last rank calculation height) — populates `userTotalStakeAmpere`
2. `freshCtx` (current height) — populates `userNewTotalStakeAmpere`

## Genesis

`InitGenesis` iterates all accounts and initializes both maps with each account's ampere-plus-routed balance.
