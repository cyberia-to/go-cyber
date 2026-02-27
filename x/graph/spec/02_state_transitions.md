# State Transitions

## MsgCyberlink

When a neuron submits cyberlinks:

1. Verify the neuron has non-zero ampere balance.
2. Calculate bandwidth cost: `len(links) * 1000 * currentCreditPrice`.
3. Verify the neuron has enough volt bandwidth.
4. Verify the block has not exceeded max bandwidth.
5. Burn volts from the neuron's account. Add cost to block spent bandwidth. Accumulate global burned volts.
6. For each link in the message:
   a. Get or create CidNumbers for the `from` and `to` particles (increment LastCidNumber if new).
   b. Check the link does not already exist for this neuron.
   c. Store the CompactLink with the current block height.
   d. Increment the neuron's out-degree (neudeg).
   e. Cache the link in the transient store for rank updates.
7. Increment global LinksCount. Set HasNewLinks flag.

## EndBlocker

Every block:

1. Read new neudeg deltas from the transient store.
2. Merge deltas into the persistent neudeg store and the in-memory rankNeudeg map.
3. Clear the transient store (automatic on block commit).
