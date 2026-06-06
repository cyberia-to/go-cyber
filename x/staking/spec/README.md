# `x/staking`

## Abstract

The staking module wraps the standard Cosmos SDK staking with hydrogen economics. When a neuron delegates, the module mints hydrogen (SCYB) to the delegator. When a neuron undelegates, hydrogen is burned. All other staking behavior — validators, redelegation, slashing, params, queries, CLI — is standard Cosmos SDK.

## Contents

1. [Concepts](00_concepts.md)
2. [Messages](01_messages.md)
