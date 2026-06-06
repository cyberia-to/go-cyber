# State

## ClockContract

Stores the contract address and jail status.

```protobuf
message ClockContract {
    string contract_address = 1;
    bool is_jailed = 2;
}
```

## Parameters

```protobuf
message Params {
    uint64 contract_gas_limit = 1;
}
```

| Key | Type | Default | Validation |
| --- | --- | --- | --- |
| contract_gas_limit | uint64 | 100,000 | >= 100,000 |

## State transitions

- Register: creates a `ClockContract` with `is_jailed = false`.
- Jail: sets `is_jailed = true` on execution error or gas exceeded.
- Unjail: sets `is_jailed = false`.
- Unregister: deletes the `ClockContract` from state.
