# State

## Store Layout

| Prefix | Key | Value | Description |
|---|---|---|---|
| `0x00` | source + destination | Route | energy route |
| `0x01` | destination | Value | aggregated energy routed to destination |
| `0x02` | — | Params | module parameters |

Module store key: `grid`. Pool account: `energy_grid`.

## Route

```protobuf
message Route {
    string source      = 1;  // bech32 source address
    string destination = 2;  // bech32 destination address
    string name        = 3;  // label (1–32 chars)
    repeated sdk.Coin value = 4;  // routed volts and amperes
}
```

## Value

```protobuf
message Value {
    repeated sdk.Coin value = 1;  // total energy routed to destination
}
```

## Genesis

`InitGenesis` loads params and routes. `ExportGenesis` returns current params.
