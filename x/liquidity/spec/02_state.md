# State

## Pool

```go
type Pool struct {
    Id                    uint64   // pool index
    TypeId                uint32   // pool type (only 1 supported)
    ReserveCoinDenoms     []string // sorted pair of reserve coin denoms
    ReserveAccountAddress string   // reserve account holding coins
    PoolCoinDenom         string   // denom of pool coin for this pool
}
```

KV layout:

- Pool: `0x11 | PoolId -> Pool`
- PoolByReserveAccIndex: `0x12 | ReserveAccLen (1 byte) | ReserveAcc -> PoolId`
- GlobalLiquidityPoolIdKey: `"globalLiquidityPoolId" -> uint64`

## PoolBatch

```go
type PoolBatch struct {
    PoolId           uint64 // target pool
    Index            uint64 // batch index
    BeginHeight      uint64 // block height when batch was created
    DepositMsgIndex  uint64 // last deposit message index
    WithdrawMsgIndex uint64 // last withdraw message index
    SwapMsgIndex     uint64 // last swap message index
    Executed         bool   // true if batch has been executed
}
```

KV layout: `0x22 | PoolId -> PoolBatch`

## Batch Message States

Each message type has a state object that tracks execution progress within a batch.

### DepositMsgState

```go
type DepositMsgState struct {
    MsgHeight  int64  // block height when appended
    MsgIndex   uint64 // index within pool batch
    Executed   bool
    Succeeded  bool
    ToBeDelete bool
    Msg        MsgDepositWithinBatch
}
```

KV layout: `0x31 | PoolId | MsgIndex -> DepositMsgState`

### WithdrawMsgState

```go
type WithdrawMsgState struct {
    MsgHeight  int64
    MsgIndex   uint64
    Executed   bool
    Succeeded  bool
    ToBeDelete bool
    Msg        MsgWithdrawWithinBatch
}
```

KV layout: `0x32 | PoolId | MsgIndex -> WithdrawMsgState`

### SwapMsgState

```go
type SwapMsgState struct {
    MsgHeight          int64
    MsgIndex           uint64
    Executed           bool
    Succeeded          bool
    ToBeDelete         bool
    OrderExpiryHeight  int64    // cancelled when height >= ExpiryHeight
    ExchangedOfferCoin sdk.Coin // offer coin exchanged so far
    RemainingOfferCoin sdk.Coin // offer coin remaining
    Msg                MsgSwapWithinBatch
}
```

KV layout: `0x33 | PoolId | MsgIndex -> SwapMsgState`
