# Concepts

## Particle

A particle is a content hash (IPFS CID v0) registered in the knowledge graph. Each particle receives a sequential numeric index (CidNumber) on first use. The module maintains forward (CID → number) and reverse (number → CID) mappings.

Only CID v0 format is accepted. Other CID versions are rejected.

## Cyberlink

A cyberlink is a directed edge from one particle to another, created by a neuron. It represents an economic commitment that two pieces of content are related — each link costs bandwidth volts to create.

Properties:
- Directed: `from → to` (from ≠ to, self-links are forbidden)
- Attributed: each link records which neuron created it
- Timestamped: each link stores the block height at which it was created
- Unique per neuron: a neuron can create only one link for a given `from → to` pair
- Multiple neurons can independently link the same pair
- Permanent: cyberlinks persist forever

## Neuron

A chain account that creates cyberlinks. A neuron must hold a non-zero ampere balance to create links — amperes represent attention (focus influence) in the relevance machine. The term neuron emphasizes the account's role as an intelligent agent contributing to the knowledge graph.

## Neudeg (neuron out-degree)

The count of outgoing cyberlinks created by a neuron. Tracked persistently and in memory. Used by the rank module to distribute ampere weight across a neuron's links during diffusion.

## Bandwidth cost

Creating cyberlinks burns bandwidth volts. The cost per link:

```
cost = numLinks * 1000 * currentCreditPrice
```

The credit price is set by the bandwidth module and adjusts dynamically with network load. The volts are permanently burned from the neuron's account.

## In-memory index

The module maintains in-memory link indices for rank computation. Two generations exist:

- Current rank links: used by the active rank calculation
- Next rank links: accumulates new links until the next rank epoch

After each rank calculation, next-generation links promote to current. This dual-buffer design allows the rank module to read a stable snapshot while new links accumulate.

The index structure is a three-level map: `fromCid → toCid → {neurons}`, stored bidirectionally (in-links and out-links).
