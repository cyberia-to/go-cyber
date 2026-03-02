# `x/graph`

## Abstract

The graph module manages the knowledge graph — the core data structure of Cyber. It stores cyberlinks (directed edges between content hashes), indexes particles (CIDs), tracks neuron out-degrees, and burns bandwidth volts on every cyberlink creation. In-memory link indices feed the rank module for GPU-computed diffusion.

## Contents

1. [Concepts](00_concepts.md)
2. [State](01_state.md)
3. [State Transitions](02_state_transitions.md)
4. [Messages](03_messages.md)
5. [Queries](04_queries.md)
6. [Events](05_events.md)
7. [WASM Bindings](06_wasm.md)
8. [CLI](07_cli.md)
