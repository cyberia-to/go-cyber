# `x/grid`

## Abstract

The grid module routes volt and ampere energy between accounts. A neuron or contract creates a route to a destination, then sets the amount of volts and amperes to supply. Routed amperes increase the destination's focus weight in the relevance machine. Coins are held in the `energy_grid` module account while routed.

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
