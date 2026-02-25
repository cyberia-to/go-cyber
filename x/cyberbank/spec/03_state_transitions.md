# State Transitions

## Coin transfer with burn (SendCoins)

When `SendCoins` is called with millivolt or milliampere tokens:

1. Calculate 2% burn: `fee = amount * 2 / 100`.
2. Send fee from sender to `resources` module account.
3. Burn fee via `BurnCoins`.
4. Report burned volts/amperes to graph module.
5. Send remaining 98% from sender to recipient.
6. Fire transfer hooks.

For other denominations, `SendCoins` delegates directly to the bank keeper with no burn.

## Account stake update (EndBlocker)

Every block:

1. For each account in `accountToUpdate` (collected by transfer hooks during the block):
   - Query current ampere-plus-routed balance.
   - Update `userNewTotalStakeAmpere[accountNumber]`.
2. If new accounts were created (account count mismatch), backfill missing entries with zero stake.
3. Clear `accountToUpdate`.

## Stake change detection

When the rank module is ready to recompute:

1. Call `DetectUsersStakeAmpereChange`.
2. Compare `userNewTotalStakeAmpere` against `userTotalStakeAmpere`.
3. If any entry differs, copy the new value and return `true` to trigger rank recalculation.
