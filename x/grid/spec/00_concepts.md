# Concepts

## Route

A route is a persistent energy supply line from a source account to a destination account. Each route carries volts and amperes independently and has a name label (1–32 characters).

A source can create up to `MaxRoutes` (default 8, max 16) outgoing routes. Self-routes are forbidden.

## Routing amperes

Routed amperes increase the destination's focus weight in the relevance machine. The cyberbank module counts routed amperes on top of the destination's own balance (`GetAccountStakeAmperPlusRouted`). This enables:
- Onboarding new neurons by supplying attention weight
- Adjusting rank influence for a personal, program, or community subgraph

## Routing volts

Routed volts are held in the `energy_grid` module account. In the current implementation, bandwidth checks (`HasEnoughAccountBandwidthVolt`) only look at the destination's own volt balance, not routed volts. Routed volts do not currently increase the destination's cyberlink bandwidth.

## Energy Grid

Coins routed through the grid are held in the `energy_grid` module account. When a route value is increased, coins move from the source to this pool. When decreased or deleted, coins return to the source.

Routing uses `SendCoinsFromAccountToModule` / `SendCoinsFromModuleToAccount`, which bypass the 2% burn fee applied to peer-to-peer `SendCoins` transfers. Energy routing is fee-free.

## Accounting

Editing a route sets the target value. The module computes the difference between old and new values and transfers coins accordingly — the source pays if increasing, receives if decreasing.
