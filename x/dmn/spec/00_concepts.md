# Concepts

## Thought

A thought is a scheduled execution plan owned by a CosmWasm program. It consists of a name (up to 32 characters), a trigger, a load, and a particle reference.

When the trigger condition is met, the module executes the program via `Sudo` with the call data from the load. The program pays fees from its own account balance.

## Trigger

A trigger defines when a thought executes. Two modes exist:

- Period: execute every N blocks (recurring)
- Block: execute at a specific block height (one-shot, deleted after execution)

A trigger must have exactly one mode set. Setting both or neither is invalid.

## Load

A load carries the execution payload:

- Input: call data passed to the program (1–2048 characters)
- GasPrice: fee per unit of gas, denominated in CYB (must be positive)

## Particle

An IPFS CIDv0 reference to the smart contract code associated with the thought.

## Slot Management

The module maintains a fixed number of thought slots (default 4). When all slots are occupied and a new thought is submitted, the module compares gas prices. If the new thought's gas price exceeds the lowest existing one, the lowest is evicted. Otherwise the creation is rejected.

This creates a gas-price auction: programs compete for execution slots by offering higher fees.

## Fee Model

Each thought execution incurs two fees:

- Gas fee: `gasPrice.Amount * gasUsed / 10` (10x reduction factor, minimum 0.1 per gas unit)
- TTL fee: `(currentBlock - lastExecutionBlock) * feeTTL` (charged for occupying a slot between executions)

Fees are deducted from the program account and sent to the fee collector module for distribution as staking rewards. If the program account has insufficient balance, the thought is deleted.

## Execution Order

At the beginning of each block, the module retrieves all thoughts sorted by gas price (descending). It executes each eligible thought within the block gas budget. Higher-paying thoughts execute first.

If a thought's execution fails, its state changes are rolled back but the thought persists (fees are still collected). If the fee transfer fails, the thought is deleted.
