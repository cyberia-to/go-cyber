# `x/liquidity`

## Abstract

The liquidity module implements a batch-based AMM (Automated Market Maker) for decentralized coin swaps. A neuron or contract creates a two-coin liquidity pool, deposits reserve coins to provide liquidity, and requests swaps through the pool. Orders are collected into batches and executed at the end of each batch height, producing a single uniform swap price per batch. This Equivalent Swap Price Model (ESPM) prevents front-running and reduces arbitrage opportunities compared to instant-execution AMMs.

## Contents

1. [Concepts](00_concepts.md)
2. [Queries](01_queries.md)
3. [State](02_state.md)
4. [State Transitions](03_state_transitions.md)
5. [Messages](04_messages.md)
6. [Begin-Block](05_begin_block.md)
7. [End-Block](06_end_block.md)
8. [Events](07_events.md)
9. [Parameters](08_params.md)
10. [WASM Bindings](09_wasm.md)
11. [Errors](10_errors.md)
12. [CLI](11_cli.md)
