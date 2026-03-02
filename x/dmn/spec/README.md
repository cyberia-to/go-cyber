# `x/dmn`

## Abstract

The dmn (daemon) module is an automated smart contract execution system. It allows CosmWasm programs to schedule recurring or block-triggered executions called thoughts. Each thought carries call data, a gas price, and a trigger condition. The module executes eligible thoughts at the beginning of every block, ordered by gas price, and collects fees from the program account.

## Contents

1. [Concepts](00_concepts.md)
2. [State](01_state.md)
3. [State Transitions](02_state_transitions.md)
4. [Messages](03_messages.md)
5. [Queries](04_queries.md)
6. [Events](05_events.md)
7. [Parameters](06_params.md)
8. [WASM Bindings](07_wasm.md)
9. [CLI](08_cli.md)
