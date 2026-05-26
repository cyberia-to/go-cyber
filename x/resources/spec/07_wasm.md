# WASM Bindings

## Messages

Contracts call mint via custom messages. The `neuron` field must match the calling contract address.

| Operation    | Fields                          |
|--------------|---------------------------------|
| Investmint   | neuron, amount, resource, length |
