# State

## On-Chain (KV Store)

| Key                | Type   | Description                              |
|--------------------|--------|------------------------------------------|
| LatestBlockNumber  | uint64 | current block height                     |
| LatestMerkleTree   | []byte | merkle root of active rank values        |
| NextMerkleTree     | []byte | merkle root of pending rank calculation  |
| NextRankCidCount   | uint64 | CID count at next recalculation          |
| ContextCidCount    | uint64 | CID count snapshot for current calc      |
| ContextLinkCount   | uint64 | link count snapshot for current calc     |
| ParamsKey          | Params | module parameters                        |

## In-Memory

Rank values and the search index are held in memory, not persisted to the KV store. On node restart the module loads merkle trees from storage and triggers a fresh rank calculation.

### Rank

```go
type Rank struct {
    RankValues []uint64          // rank per CID, scaled by 1e15
    MerkleTree *merkle.Tree      // SHA256 merkle tree over RankValues
    CidCount   uint64            // number of ranked particles
    TopCIDs    []RankedCidNumber // pre-sorted top 1000
}
```

### Search Index

Forward links and backlinks per CID, sorted by rank descending. Updated asynchronously when new ranks are applied.
