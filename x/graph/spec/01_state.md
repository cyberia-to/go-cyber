# State

## Persistent Store

Store key: `graph`

### Global counters (prefix `0x00`)

| Key | Type | Description |
|---|---|---|
| LastCidNumber | uint64 | highest particle index assigned |
| LinksCount | uint64 | total cyberlinks |
| BurnedVolts | uint64 | cumulative millivolts burned by cyberlinks |
| BurnedAmperes | uint64 | cumulative milliamperes burned |
| HasNewLinks | uint64 | flag: new links created in this block |

### Particle index (prefix `0x01`, `0x02`)

| Prefix | Key | Value | Description |
|---|---|---|---|
| `0x01` | CID string | uint64 | forward: CID → CidNumber |
| `0x02` | uint64 | CID string | reverse: CidNumber → CID |

### Cyberlinks (prefix `0x03`)

| Key | Value |
|---|---|
| `0x03` + CompactLink (24 bytes) | block height (uint64) |

CompactLink is 24 bytes: `FromCidNumber(8) + AccountNumber(8) + ToCidNumber(8)`, big-endian.

### Neuron out-degrees (prefix `0x05`)

| Key | Value |
|---|---|
| `0x05` + accountNumber (uint64) | neudeg count (uint64) |

## Transient Store

Store key: `transient_index` (reset every block)

| Prefix | Key | Value | Description |
|---|---|---|---|
| `0x04` | CompactLink (24 bytes) | — | new links created this block |
| `0x06` | accountNumber (uint64) | neudeg delta (uint64) | degree changes this block |

## In-memory Index

| Field | Type | Description |
|---|---|---|
| currentRankInLinks | Links | in-links for active rank |
| currentRankOutLinks | Links | out-links for active rank |
| nextRankInLinks | Links | in-links pending next rank |
| nextRankOutLinks | Links | out-links pending next rank |
| neudeg | map[uint64]uint64 | current block neudegs |
| rankNeudeg | map[uint64]uint64 | neudegs for rank computation |

`Links` type: `map[CidNumber]map[CidNumber]map[AccNumber]struct{}`

## Genesis

Binary file at `config/graph`. Format: CID count + CID entries + link count + link entries (little-endian uint64). Export writes to `export/graph`.
