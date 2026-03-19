# WASM Bindings

Contracts interact with tokenfactory via custom messages and queries. The contract address acts as both creator and admin for denoms it creates.

## Messages

| Operation | Fields |
|---|---|
| CreateDenom | subdenom, metadata (optional) |
| MintTokens | denom, amount, mint_to_address |
| BurnTokens | denom, amount, burn_from_address (optional) |
| ChangeAdmin | denom, new_admin_address |
| SetMetadata | denom, metadata |
| ForceTransfer | denom, amount, from_address, to_address |

## Queries

| Query | Fields | Returns |
|---|---|---|
| FullDenom | creator_addr, subdenom | Full denom string |
| Admin | denom | Admin address |
| Metadata | denom | Bank denom metadata |
| DenomsByCreator | creator | List of denoms |
| Params | — | Module parameters |
