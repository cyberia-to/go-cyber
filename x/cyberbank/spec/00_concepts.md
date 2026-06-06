# Concepts

## Proxy

The `Proxy` wraps the standard `bank.Keeper` and implements the same interface. All bank operations pass through to the underlying keeper, except `SendCoins` which applies a 2% burn on millivolt and milliampere transfers before forwarding the net amount.

The burn is calculated as `amount * 2 / 100`. The burned portion is sent to the `resources` module account and then burned via `BurnCoins`. Burned amounts are reported to the graph module for tracking.

## Transfer hooks

The Proxy maintains a list of `CoinsTransferHook` callbacks. After every successful coin transfer (`SendCoins`, `InputOutputCoins`, `SendCoinsFromModuleToAccount`, `SendCoinsFromAccountToModule`), the Proxy calls all registered hooks with the sender and recipient addresses. The `IndexedKeeper` uses this hook to track which accounts need their ampere stake updated.

## In-memory ampere index

The `IndexedKeeper` maintains two in-memory maps of `accountNumber -> ampereStake`:

- `userTotalStakeAmpere` — the snapshot used by the current rank calculation
- `userNewTotalStakeAmpere` — accumulates balance changes for the next rank calculation

Each account's ampere stake equals their milliampere balance plus any ampere routed to them via the grid (energy) module.

The rank module calls `DetectUsersStakeAmpereChange` to check whether any account's ampere stake has changed since the last rank computation. If so, the rank is recalculated with the updated weights.

## Ampere plus routed

A neuron's effective ampere stake is: `own milliampere balance + routed ampere from grid module`. A neuron can increase its influence in the knowledge graph both by minting ampere and by receiving routed ampere from other neurons.
