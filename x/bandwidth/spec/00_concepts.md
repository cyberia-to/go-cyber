# Concepts

## Bandwidth model

Bandwidth replaces gas-based fee billing for cyberlink creation. Neurons hold volt (V) as their bandwidth resource. Creating a cyberlink permanently burns volt from the neuron's account. The cost per cyberlink is determined by the current bandwidth price multiplied by a base cost of 1000 units.

Total volt supply across all accounts defines the desirable network bandwidth. Neurons acquire volt by burning hydrogen (H) through the `resources` module (mint). Each mint increases personal bandwidth and the network's desirable capacity.

## Bandwidth cost

Each cyberlink costs `price * links * 1000` millivolt, where `price` is the current bandwidth price and `links` is the number of links in the message. At `BasePrice` = 0.25, one cyberlink costs 250 millivolt. A neuron holding 5000 millivolt (5 V) can create 20 cyberlinks at current pricing before needing to mint more volt.

## Bandwidth price

The bandwidth price is a multiplier applied to the base cost of 1000 units per cyberlink.

Since the v6 upgrade, dynamic price adjustment is disabled. The `AdjustPrice` function sets the price to `BasePrice` regardless of load. The `AdjustPricePeriod` and load-based pricing logic remain in the codebase for potential reactivation via governance.

## Network load tracking

The module tracks total bandwidth consumed across a sliding window of `RecoveryPeriod` blocks (default: 100). Each block records its consumed bandwidth. At the end of every block, the oldest block exits the window and the current block enters. This sliding sum provides the network load metric.

## Transaction processing

Cyberlink billing happens inside the `graph` module's `MsgCyberlink` handler (not in an ante handler). The handler checks the neuron's volt balance, verifies the block has capacity, burns volt from the neuron, and adds the consumed amount to the block's bandwidth counter.

The neuron must also hold a non-zero ampere (A) balance to create cyberlinks.

## Block capacity

Each block accepts at most `MaxBlockBandwidth` units of bandwidth (default: 10,000). If a cyberlink message would push the block total beyond this limit, the transaction fails with `ErrExceededMaxBlockBandwidth`.

## Network capacity

The total minted volt supply represents aggregate bandwidth demand. The community can adjust `MaxBlockBandwidth` via governance to handle peak load.
