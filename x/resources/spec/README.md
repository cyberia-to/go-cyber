# `x/resources`

## Abstract

The resources module allows neurons to mint the computer's resources — volts (bandwidth) and amperes (attention) — by burning hydrogen. A neuron burns hydrogen and receives newly minted resource tokens. The mint rate depends on the amount burned, a time-based halving schedule, and exponential supply decay. Minted resources are available immediately.

### Examples

Mint VOLT by burning 1 GBOOT:
```
burn 1 GBOOT → mint VOLT (amount depends on current halving and supply)
```

Mint AMPERE by burning 4.2 GBOOT:
```
burn 4.2 GBOOT → mint AMPERE (amount depends on current halving and supply)
```

## Contents

1. [Concepts](00_concepts.md)
2. [Queries](01_queries.md)
3. [State](02_state.md)
4. [State Transitions](03_state_transitions.md)
5. [Messages](04_messages.md)
6. [Events](05_events.md)
7. [Parameters](06_params.md)
8. [WASM Bindings](07_wasm.md)
9. [Errors](08_errors.md)
10. [CLI](09_cli.md)
