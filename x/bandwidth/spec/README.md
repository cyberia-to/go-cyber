# `bandwidth`

## Abstract

The bandwidth module meters cyberlink creation by burning volt (V) tokens. Each cyberlink permanently burns volt from the neuron's account at the current bandwidth price. The module tracks per-block consumption, maintains a sliding-window load metric over `RecoveryPeriod` blocks, and enforces a per-block capacity limit via `MaxBlockBandwidth`.

## Contents

1. [Concepts](00_concepts.md)
2. [API](01_api.md)
3. [State](02_state.md)
4. [State Transitions](03_state_transitions.md)
5. [Parameters](06_params.md)
6. [WASM](07_wasm.md)
7. [Errors](08_errors.md)
8. [CLI](09_cli.md)
