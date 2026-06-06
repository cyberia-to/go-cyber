# Messages

## MsgCreatePool

Creates a liquidity pool and deposits initial coins.

```go
type MsgCreatePool struct {
    PoolCreatorAddress string    // creator address
    PoolTypeId         uint32    // pool type (only 1 supported)
    DepositCoins       sdk.Coins // initial reserve coins (exactly 2)
}
```

Fails if:

- `CircuitBreakerEnabled` is true
- `PoolTypeId` does not exist in parameters
- Pool with same type and coin pair already exists
- Creator balance insufficient for `DepositCoins` + `PoolCreationFee`
- Deposit coins less than `MinInitDepositAmount`

## MsgDepositWithinBatch

Deposits coins to an existing pool. Coins are escrowed until batch execution.

```go
type MsgDepositWithinBatch struct {
    DepositorAddress string    // depositor address
    PoolId           uint64    // target pool
    DepositCoins     sdk.Coins // coins to deposit (exactly 2)
}
```

Fails if:

- `CircuitBreakerEnabled` is true
- `PoolId` does not exist
- `DepositCoins` denoms do not match pool reserve coin denoms
- Depositor balance insufficient

## MsgWithdrawWithinBatch

Withdraws reserve coins from a pool by returning pool coins. Pool coins are escrowed until batch execution.

```go
type MsgWithdrawWithinBatch struct {
    WithdrawerAddress string   // withdrawer address
    PoolId            uint64   // target pool
    PoolCoin          sdk.Coin // pool coins to return
}
```

Fails if:

- `PoolId` does not exist
- `PoolCoin` denom does not match pool coin denom
- Withdrawer balance insufficient

## MsgSwapWithinBatch

Swaps offer coin for demand coin through a pool. Offer coin and fee are escrowed until batch execution.

```go
type MsgSwapWithinBatch struct {
    SwapRequesterAddress string   // requester address
    PoolId               uint64   // target pool
    SwapTypeId           uint32   // only 1 (instant swap)
    OfferCoin            sdk.Coin // coin offered
    DemandCoinDenom      string   // denom wanted
    OfferCoinFee         sdk.Coin // half of swap fee reserved upfront
    OrderPrice           sdk.Dec  // limit price (X/Y, denoms sorted alphabetically)
}
```

Fails if:

- `CircuitBreakerEnabled` is true
- `PoolId` does not exist
- `OfferCoin` or `DemandCoinDenom` not in pool reserves
- `OrderPrice` <= 0
- `OfferCoin` amount < 100 (minimum offer)
- `OfferCoinFee` != ceil(`OfferCoin` * `SwapFeeRate` * 0.5)
- Requester balance insufficient for `OfferCoin` + `OfferCoinFee`
- `OfferCoin` amount exceeds `MaxOrderAmountRatio` of pool reserves
