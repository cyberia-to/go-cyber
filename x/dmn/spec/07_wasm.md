# WASM Bindings

The dmn module exposes both message and query bindings to CosmWasm contracts.

## Messages

Contracts call dmn operations via custom Sudo messages. The `program` field in each message must match the calling contract address — only self-manipulation is permitted.

| Operation | Fields |
|---|---|
| CreateThought | trigger, load, name, particle |
| ForgetThought | name |
| ChangeThoughtInput | name, input |
| ChangeThoughtPeriod | name, period |
| ChangeThoughtBlock | name, block |
| ChangeThoughtGasPrice | name, gas_price |
| ChangeThoughtParticle | name, particle |
| ChangeThoughtName | name, new_name |

## Queries

Contracts can query dmn state via custom queries.

| Query | Fields | Returns |
|---|---|---|
| Thought | program, name | Thought |
| ThoughtStats | program, name | ThoughtStats |
| ThoughtsFees | — | array of sdk.Coin |
