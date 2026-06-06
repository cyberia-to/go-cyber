# State

## Neuron bandwidth

`NeuronBandwidth` represents a neuron's bandwidth capacity. In the current implementation this value is computed on the fly from the neuron's volt balance via `GetAccountStakeVolt`, so `RemainedValue` and `MaxValue` both equal the current balance.

```protobuf
message NeuronBandwidth {
    string neuron            = 1;
    uint64 remained_value    = 2;
    uint64 last_updated_block = 3;
    uint64 max_value         = 4;
}
```

## Bandwidth price

Stores the current bandwidth price multiplier. Falls back to `BasePrice` if unset.

```protobuf
message Price {
    string price = 1; // sdk.Dec
}
```

## Block bandwidth

Stores the total bandwidth consumed by all neurons in a given block. Used for the sliding-window load calculation and for enforcing `MaxBlockBandwidth`.

```
BlockStoreKey(blockNumber) -> uint64 (big-endian encoded)
```

## Desirable bandwidth

Desirable bandwidth represents amount of cyberlinks that network would like to process.

```
TotalBandwidth key -> uint64 (big-endian encoded)
```

## Keys

| Key | Prefix | Value |
| --- | --- | --- |
| Neuron bandwidth | `0x01 \| []byte(address)` | `ProtocolBuffer(NeuronBandwidth)` |
| Block bandwidth | `0x02 \| uint64(blockNumber)` | `uint64(value)` |
| Bandwidth price | `0x00 \| "lastBandwidthPrice"` | `ProtocolBuffer(Price)` |
| Desirable bandwidth | `0x00 \| "totalBandwidth"` | `uint64(value)` |
| Parameters | `0x02` | `ProtocolBuffer(Params)` |

Module name and store key: `bandwidth`

Transient store key: `transient_bandwidth` — holds the current block's accumulated bandwidth before it is committed to persistent storage in EndBlocker.
