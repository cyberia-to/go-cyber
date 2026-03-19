# Concepts

## Hydrogen Coupling

The module couples staking with hydrogen supply:

- Delegate BOOT → mint hydrogen to delegator
- Undelegate BOOT → burn hydrogen from delegator
- Create validator (self-delegation) → mint hydrogen to validator operator
- Cancel unbonding → re-mint hydrogen (restores hydrogen burned on undelegate since the delegation is restored)

This creates a 1:1 relationship between staked BOOT and circulating hydrogen. Hydrogen is then used in x/resources to mint volts and amperes.

## Standard Cosmos SDK Staking

All other behavior is inherited from the Cosmos SDK staking module:

- Validator creation, editing, jailing, unjailing
- Delegation, redelegation, unbonding
- Slashing for downtime and double-signing
- Parameters (unbonding time, max validators, bond denom, etc.)
- All queries and CLI commands
