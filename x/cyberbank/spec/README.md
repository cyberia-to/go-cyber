# `cyberbank`

## Abstract

The cyberbank module wraps the Cosmos SDK bank keeper with three additions:

1. 2% burn on every transfer of millivolt and milliampere tokens
2. In-memory index of ampere balances (own + routed) for the [rank](../../rank/spec/README.md) module
3. Transfer hooks that notify other modules of balance changes

The module introduces no new storage — all indexing state lives in memory and rebuilds on restart.

## Contents

1. [Concepts](00_concepts.md)
2. [State](02_state.md)
3. [State Transitions](03_state_transitions.md)
