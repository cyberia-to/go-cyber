# State

## Store Layout

| Prefix | Key | Value | Description |
|---|---|---|---|
| `0x00` | `program_addr + name` | `Thought` | Scheduled thought |
| `0x01` | `program_addr + name` | `ThoughtStats` | Execution statistics |
| `0x02` | — | `Params` | Module parameters |

## Thought

```protobuf
message Thought {
    string program  = 1;  // bech32 contract address
    Trigger trigger = 2;  // execution condition
    Load load       = 3;  // call data and gas price
    string name     = 4;  // identifier (1–32 chars)
    string particle = 5;  // IPFS CIDv0
}
```

## Trigger

```protobuf
message Trigger {
    uint64 period = 1;  // execute every N blocks (0 = disabled)
    uint64 block  = 2;  // execute at block height (0 = disabled)
}
```

## Load

```protobuf
message Load {
    string   input     = 1;  // call data (1–2048 chars)
    sdk.Coin gas_price = 2;  // fee per gas unit in CYB
}
```

## ThoughtStats

```protobuf
message ThoughtStats {
    string program    = 1;  // bech32 contract address
    string name       = 2;  // thought name
    uint64 calls      = 3;  // total executions
    uint64 fees       = 4;  // total fees paid
    uint64 gas        = 5;  // total gas consumed
    uint64 last_block = 6;  // block of last execution
}
```

## Genesis

`InitGenesis` sets module parameters. `ExportGenesis` returns current parameters. Thoughts are not exported — they are runtime state created by programs.
