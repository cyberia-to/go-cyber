# `x/rank`

## Abstract

The rank module computes a stake-weighted PageRank over the knowledge graph built by x/graph. Every `calculation_period` blocks the module snapshots all cyberlinks and neuron stakes, runs an iterative Expectation-Maximization algorithm (CPU or GPU), and publishes the resulting rank values with a merkle proof. Ranks determine the relevance of particles (CIDs) in search queries and feed the negentropy metric that measures how focused the graph's attention is.

## Contents

1. [Concepts](00_concepts.md)
2. [Queries](01_queries.md)
3. [State](02_state.md)
4. [End-Block](03_end_block.md)
5. [Messages](04_messages.md)
6. [Parameters](05_params.md)
7. [WASM Bindings](06_wasm.md)
8. [CLI](07_cli.md)
