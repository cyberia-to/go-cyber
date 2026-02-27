# State Transitions

## Route creation

1. Verify source ≠ destination.
2. Verify route does not already exist.
3. Verify source has not reached `MaxRoutes`.
4. Create destination account if it does not exist.
5. Store route with empty value.
6. Call `OnCoinsTransfer` hook for the destination account.

## Route edit (set value)

1. Verify route exists.
2. Compare new value with current value for the given denom:
   - If current value is zero: transfer full amount from source to `energy_grid`.
   - If increasing: transfer difference from source to `energy_grid`.
   - If decreasing: transfer difference from `energy_grid` to source.
3. Update aggregated routed energy for the destination.
4. Update the route with new value (preserving the other denom).
5. Call `OnCoinsTransfer` hook for source and destination.

## Route name edit

1. Verify route exists.
2. Update route name.

## Route deletion

1. Verify route exists.
2. Transfer full route value from `energy_grid` back to source.
3. Subtract route value from aggregated destination energy.
4. Remove route from store.
5. Call `OnCoinsTransfer` hook for source and destination.

## Genesis import

For each route: accumulate routed energy for destination, store route, call `OnCoinsTransfer` hook.
