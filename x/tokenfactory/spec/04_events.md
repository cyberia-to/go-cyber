# Events

## create_denom

| Attribute | Description |
|---|---|
| creator | Creator address |
| new_token_denom | Full denom created |

## tf_mint

| Attribute | Description |
|---|---|
| mint_to_address | Recipient address |
| amount | Amount minted |

## tf_burn

| Attribute | Description |
|---|---|
| burn_from_address | Source address |
| amount | Amount burned |

## force_transfer

| Attribute | Description |
|---|---|
| transfer_from_address | Source address |
| transfer_to_address | Destination address |
| amount | Amount transferred |

## change_admin

| Attribute | Description |
|---|---|
| denom | Full factory denom |
| new_admin | New admin address |

## set_denom_metadata

| Attribute | Description |
|---|---|
| denom | Full factory denom |
| denom_metadata | String representation of metadata |
