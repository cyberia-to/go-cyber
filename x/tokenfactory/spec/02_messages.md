# Messages

## MsgCreateDenom

Create a new factory denom.

| Field | Type | Description |
|---|---|---|
| sender | string | Creator address |
| subdenom | string | Token subdenom (max 44 bytes) |

State changes:
- `DenomCreationFee` transferred to community pool (skipped for contracts)
- `DenomCreationGasConsume` gas consumed
- Bank denom metadata initialized (base = display = name = symbol = full denom)
- `AuthorityMetadata` set with admin = sender
- Denom added to creator index

Returns the full denom: `factory/{sender}/{subdenom}`.

## MsgMint

Mint tokens. Admin only.

| Field | Type | Description |
|---|---|---|
| sender | string | Admin address |
| amount | Coin | Amount to mint |
| mint_to_address | string | Recipient (defaults to sender if empty) |

Mints via bank module to the module account, then sends to the recipient. Cannot mint to blocked addresses.

## MsgBurn

Burn tokens. Admin only.

| Field | Type | Description |
|---|---|---|
| sender | string | Admin address |
| amount | Coin | Amount to burn |
| burn_from_address | string | Source (defaults to sender if empty) |

When `burn_from_address` differs from sender, requires `enable_burn_from` capability. Sends coins from the source to the module account, then burns via bank module.

## MsgForceTransfer

Transfer tokens between arbitrary addresses. Admin only. Requires `enable_force_transfer` capability.

| Field | Type | Description |
|---|---|---|
| sender | string | Admin address |
| amount | Coin | Amount to transfer |
| transfer_from_address | string | Source address |
| transfer_to_address | string | Destination address |

Cannot transfer from module accounts. Cannot transfer to blocked addresses.

## MsgChangeAdmin

Transfer admin privileges. Current admin only.

| Field | Type | Description |
|---|---|---|
| sender | string | Current admin |
| denom | string | Full factory denom |
| new_admin | string | New admin address (empty = renounce) |

Setting `new_admin` to `""` permanently removes admin control.

## MsgSetDenomMetadata

Update bank module metadata for the denom. Admin only. Requires `enable_metadata` capability.

| Field | Type | Description |
|---|---|---|
| sender | string | Admin address |
| metadata | bank.Metadata | Full metadata (base, display, name, symbol, denom_units, description) |

## MsgUpdateParams

Governance-only parameter update.

| Field | Type | Description |
|---|---|---|
| authority | string | Governance module address |
| params | Params | New parameters |
