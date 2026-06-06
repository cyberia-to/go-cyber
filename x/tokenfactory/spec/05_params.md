# Params

| Parameter | Type | Default | Description |
|---|---|---|---|
| DenomCreationFee | sdk.Coins | 10,000,000 stake | Fee transferred to community pool on denom creation. Contracts (32-byte addresses) are exempt |
| DenomCreationGasConsume | uint64 | 2,000,000 | Additional gas consumed on denom creation |

Parameters are updatable via MsgUpdateParams (governance).
