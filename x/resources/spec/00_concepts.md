# Concepts

## Mint

Mint is the core operation: burn hydrogen, receive newly minted volts or amperes. The hydrogen is permanently burned. The minted resource is added to the neuron's account with a 1-second vesting period (immediately spendable in practice). The `length` field in `MsgInvestmint` is accepted but ignored — the module always uses the maximum available period for calculation.

## Mint Calculation

```
cycles = maxPeriod / baseInvestmintPeriod
base   = amount / baseInvestmintAmount
halving = 0.5^((blockHeight - 6,000,000) / halvingPeriod)   [if blockHeight > 15,000,000, else 1.0]
halving = max(halving, 0.01)

mint = cycles × base × halving × 1000
```

After the base calculation, an exponential supply adjustment applies:

```
supplyFactor = 0.5^(totalSupply / halfLife)
finalMint = mint × supplyFactor
```

Where `totalSupply` includes both circulating supply and burned resources (from cyberlink creation for volts, from transfer fees for both). Half-life: 4×10⁹ for volts, 3.2×10¹⁰ for amperes.

Minimum return is 1000 units (millivolt or milliampere). Below this the transaction fails.

## Halving and Period Doubling

The block-based halving and period doubling are designed to compensate each other. Every `HalvingPeriodBlocks` the mint rate halves, but the maximum available period doubles at the same rate:

```
doubling = 2^(blockHeight / halvingPeriod)
maxPeriod = doubling × halvingPeriod × 6
```

Since `cycles = maxPeriod / basePeriod`, doubling the period doubles cycles. Halving the rate cuts the mint in half. The net effect: `cycles × halving ≈ constant`. The base mint rate per unit of hydrogen remains stable over time regardless of block height.

## Supply Decay — The Real Growth Curve

The actual decrease in mint rate comes from the exponential supply adjustment: `0.5^(totalSupply / halfLife)`. As more volts and amperes are minted across the network, each subsequent mint produces fewer resources. This is a tokenized feedback loop — the resource economy self-regulates through supply rather than through time.

Early participants mint more because supply is low. As the network grows and more resources exist, minting becomes progressively harder. This creates organic scarcity proportional to actual usage of the computer.

## Max Period

```
doubling = 2^(blockHeight / halvingPeriod)
maxPeriod = doubling × halvingPeriod × 6
```

The module always uses maxPeriod for calculation regardless of what `length` the user specifies in the message.

## Desirable Bandwidth

Every mint to VOLT increases the network's desirable bandwidth by the minted amount.
