# Messages

## MsgCreateThought

Create a scheduled thought for a program.

| Field | Type | Validation |
|---|---|---|
| program | string | valid bech32 address |
| trigger | Trigger | exactly one of period or block set |
| load | Load | input 1–2048 chars, gas_price positive CYB |
| name | string | 1–32 characters |
| particle | string | valid IPFS CIDv0 |

Fails with `ErrExceededMaxThoughts` if all slots are occupied and the gas price is not higher than the lowest existing thought.

## MsgForgetThought

Delete a thought and its stats.

| Field | Type |
|---|---|
| program | string |
| name | string |

## MsgChangeThoughtName

Rename a thought. Stats migrate to the new key.

| Field | Type |
|---|---|
| program | string |
| name | string |
| new_name | string |

## MsgChangeThoughtParticle

Update the IPFS CIDv0 reference.

| Field | Type |
|---|---|
| program | string |
| name | string |
| particle | string (CIDv0) |

## MsgChangeThoughtInput

Update the call data.

| Field | Type | Validation |
|---|---|---|
| program | string | |
| name | string | |
| input | string | 1–2048 chars |

## MsgChangeThoughtGasPrice

Update the gas price.

| Field | Type | Validation |
|---|---|---|
| program | string | |
| name | string | |
| gas_price | sdk.Coin | positive, CYB denomination |

## MsgChangeThoughtPeriod

Set or update the period trigger. Only valid when the thought is already in period mode (`trigger.Block == 0`).

| Field | Type | Validation |
|---|---|---|
| program | string | |
| name | string | |
| period | uint64 | > 0 |

## MsgChangeThoughtBlock

Convert to block trigger. Zeroes the period field. Only valid when the thought is in period mode (`trigger.Period > 0`).

| Field | Type | Validation |
|---|---|---|
| program | string | |
| name | string | |
| block | uint64 | > current block height |

## MsgUpdateParams

Governance message to update module parameters. Only callable by the module authority.

| Field | Type |
|---|---|
| authority | string |
| params | Params |
