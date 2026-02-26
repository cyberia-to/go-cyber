# State Transitions

The bandwidth module has no messages that trigger state transitions directly. State changes occur through the `graph` module's cyberlink handler and the bandwidth EndBlocker.

## Cyberlink creation (graph module handler)

When a `MsgCyberlink` is processed in the `graph` module:

1. Compute cost: `price * len(links) * 1000` millivolt, truncated to integer.
2. Check the neuron's volt balance covers the cost (`HasEnoughAccountBandwidthVolt`).
3. Check the block has remaining capacity: `cost + currentBlockSpent <= MaxBlockBandwidth`.
4. Burn cost in volt from the neuron's account (`BurnAccountBandwidthVolt`).
5. Add cost to the current block's transient bandwidth counter (`AddToBlockBandwidth`).

## Commit block bandwidth (EndBlocker)

Every block:

1. Read the transient block bandwidth counter.
2. Add it to `totalSpentForSlidingWindow`.
3. Remove the block that falls outside the `RecoveryPeriod` window from both in-memory map and persistent storage.
4. Persist the current block's bandwidth to storage.

## Adjust bandwidth price (EndBlocker)

Every `AdjustPricePeriod` blocks (default: 5):

1. Compute load as `totalSpentForSlidingWindow / (BaseLoad * desirableBandwidth)`.
2. Set price to `BasePrice`.

Since the v6 upgrade, the price is always set to `BasePrice` regardless of computed load. The load-based pricing path remains in code for potential reactivation.

## Genesis initialization

For each neuron with volt in genesis state:

1. Set module parameters from genesis.
2. Initialize the bandwidth price to `BasePrice`.
