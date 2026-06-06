# WASM Bindings

## Messages

Contracts can create cyberlinks via the custom `Cyberlink` message. The `neuron` field must match the calling contract address.

| Operation | Fields |
|---|---|
| Cyberlink | neuron, links (array of {from, to}) |

## Queries

| Query | Fields | Returns |
|---|---|---|
| GraphStats | — | {cyberlinks, particles} |
