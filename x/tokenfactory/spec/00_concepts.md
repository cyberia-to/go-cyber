# Concepts

## Factory Denoms

Every token created through the module has the format:

```
factory/{creator_address}/{subdenom}
```

Address-based namespacing prevents name collisions and makes creation permissionless — no governance proposal needed.

## Subdenom Constraints

- Maximum length: 44 bytes
- Allowed characters: `[0-9a-zA-Z./]`
- Can contain `/` (e.g. `factory/bostrom1.../atom/derivative`)
- Creator address maximum length: 75 bytes (59 + 16 HRP)
- Total denom maximum length: 128 bytes (SDK limit)

## Admin

The creator address is automatically set as admin on denom creation. The admin can:

- Mint tokens to any address
- Burn tokens from any address (requires `BurnFrom` capability)
- Force-transfer tokens between any two addresses (requires `ForceTransfer` capability)
- Set denom metadata in the bank module (requires `SetMetadata` capability)
- Transfer admin privileges to another address
- Renounce admin by setting it to `""`

Once admin is set to empty, the denom becomes immutable — no account can mint, burn, or force-transfer.

## Capabilities

Three operations can be selectively disabled at chain level:

| Capability | Controls |
|---|---|
| `enable_metadata` | MsgSetDenomMetadata |
| `enable_force_transfer` | MsgForceTransfer |
| `enable_burn_from` | MsgBurn with `burn_from_address` |

If the capabilities list is empty, all capabilities are enabled (default). When a capability is disabled, the corresponding message returns `ErrCapabilityNotEnabled`.

## Creation Fee

Denom creation charges `DenomCreationFee` to the community pool. Contracts (32-byte addresses) are exempt from the fee — they only consume `DenomCreationGasConsume` gas.
