# End-Block

## Every Block

1. Current block height stored.
2. New cyberlinks from x/graph merged into search index.
3. Graph context updated with new links.
4. Module tracks whether new links or stake changes occurred during this period.

## Every `calculation_period` Blocks

1. Previous async calculation collected (blocking wait if still running).
2. Completed rank promoted: `nextCidRank` → `networkCidRank`.
3. Search index re-sorted by new rank values (index locked during re-sort).
4. If new links or stake changes detected:
   - CID and link counts snapshotted.
   - Graph indexes updated.
   - New async rank calculation spawned in a goroutine.
5. Rank array extended for any new CIDs added since last calculation.
6. Merkle tree hash logged.

Calculation does not block consensus. The goroutine runs in parallel with block processing and delivers the result to a channel picked up by the next cycle.
