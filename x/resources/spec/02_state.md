# State

The module stores only parameters. Vesting state is managed by the auth module.

## Keys

- ModuleName, RouterKey, StoreKey: `resources`
- ParamsKey: `0x00`

## Vesting (auth module)

On first mint a neuron's `BaseAccount` converts to `PeriodicVestingAccount`. Each subsequent mint overwrites the vesting schedule with a single 1-second period. This is backward compatibility with UI — resources are available immediately.
