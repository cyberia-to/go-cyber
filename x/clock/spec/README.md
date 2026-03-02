# `clock`

## Abstract

The clock module executes registered CosmWasm contracts at the start and end of every block. Contracts receive a Sudo call with `BeginBlock` or `EndBlock` message. Contracts that error or exceed the gas limit are automatically jailed.

Based on the Juno clock module with BeginBlocker support added.

## Contents

1. [Concepts](01_concepts.md)
2. [State](02_state.md)
3. [Contract Integration](03_integration.md)
4. [Clients](04_clients.md)
