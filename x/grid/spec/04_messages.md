# Messages

## MsgCreateRoute

Create an empty energy route to a destination.

| Field | Type | Validation |
|---|---|---|
| source | string | valid bech32, ≠ destination |
| destination | string | valid bech32 |
| name | string | 1–32 characters |

Fails if route already exists or source has reached `MaxRoutes`.

## MsgEditRoute

Set the value of volts or amperes on an existing route. The module computes the difference and transfers coins to/from `energy_grid`.

| Field | Type | Validation |
|---|---|---|
| source | string | valid bech32 |
| destination | string | valid bech32 |
| value | sdk.Coin | denom must be millivolt or milliampere |

Fails if route does not exist or source has insufficient balance.

## MsgDeleteRoute

Delete a route and return all coins to the source.

| Field | Type |
|---|---|
| source | string |
| destination | string |

## MsgEditRouteName

Update the name label of an existing route.

| Field | Type | Validation |
|---|---|---|
| source | string | valid bech32 |
| destination | string | valid bech32 |
| name | string | 1–32 characters |

## MsgUpdateParams

Governance message to update module parameters. Only callable by the module authority.

| Field | Type |
|---|---|
| authority | string |
| params | Params |
