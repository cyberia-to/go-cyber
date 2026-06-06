# Concepts

## Cyberrank

Cyberrank is a stake-weighted PageRank over the knowledge graph. Each particle (CID) receives a rank proportional to how many high-ranked particles link to it, weighted by the linker's ampere stake normalized by their out-degree (neudeg). The algorithm iterates until convergence within `tolerance`.

## Quality Over Quantity

The algorithm divides each neuron's ampere stake by their total number of outgoing links. A neuron with 100,000 amperes and 2,000,000 links contributes 0.05 weight per link. A neuron with 10,000 amperes and 20,000 links contributes 0.5 weight per link — 10x more influence per cyberlink.

Mass-linking dilutes influence. The system economically incentivizes selective, high-quality linking: each additional cyberlink reduces the weight of all previous ones. Combined with the bandwidth cost (each cyberlink burns volts), there is a double filter — bandwidth limits quantity, rank algorithm limits influence per link.

## Calculation Cycle

Rank recalculation triggers every `calculation_period` blocks (default 5) if new cyberlinks were created or neuron stakes changed. The cycle:

1. EndBlocker snapshots CID count, link count, and current graph indexes.
2. Calculation runs asynchronously in a goroutine (consensus continues in parallel).
3. Next EndBlocker cycle collects the result and promotes it to the active rank.
4. Search index re-sorts all links by new rank values.

Between recalculations the previous rank remains active and queryable.

## Algorithm

Initialize all ranks to `(1 - dampingFactor) / cidsCount`. Then iterate:

    rank[i] = dampingFactor × Σ(prevRank[j] × stake[j→i] / totalOutStake[j]) + correction

Where:
- `stake[j→i]`: ampere stake of the neuron that created the link from j to i.
- `totalOutStake[j]`: sum of stakes on all outgoing links from j.
- `correction`: accounts for dangling nodes (particles whose outgoing links are all absent) redistributing rank uniformly.

Convergence: `max(|rank[i] - prevRank[i]|) ≤ tolerance`.

Three compute backends:
- CPU: iterative Go implementation.
- GPU: CUDA kernel via cgo, processes all CIDs in parallel.
- Mock: deterministic descending distribution for testing.

## Rank Values

Raw float64 ranks scaled to uint64 by multiplying by 1e15. A merkle tree built over the uint64 values for on-chain proofs.

## Search Index

When `--search-api` enabled, the module maintains an in-memory index of forward links (outlinks) and backlinks sorted by rank. This enables the `Search`, `Backlinks`, and `Top` queries. The index locks during re-sorting after a new rank is applied; queries return "unavailable" during this window.

## Top Particles

Top 1000 particles by rank pre-computed and cached on each rank update.

## Negentropy

Two entropy metrics computed at query time from current rank values:

- Particle negentropy: `-πi × log2(πi)` where `πi = rank[i] / totalRank`. Measures how much attention a single particle concentrates.
- System negentropy: `log2(n) - H(π)` where `H(π)` is Shannon entropy over all ranks. Measures how far the graph's attention distribution deviates from uniform. Higher negentropy means more focused graph.
