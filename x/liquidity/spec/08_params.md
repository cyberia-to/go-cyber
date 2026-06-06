# Parameters

| Key                    | Type          | Default                                              |
|------------------------|---------------|------------------------------------------------------|
| PoolTypes              | []PoolType    | [{id:1, name:"StandardLiquidityPool", min:2, max:2}] |
| MinInitDepositAmount   | math.Int      | 1,000,000                                            |
| InitPoolCoinMintAmount | math.Int      | 1,000,000                                            |
| MaxReserveCoinAmount   | math.Int      | 0 (unlimited)                                        |
| PoolCreationFee        | sdk.Coins     | 40,000,000 bond denom                                |
| SwapFeeRate            | sdk.Dec       | 0.003 (0.3%)                                         |
| WithdrawFeeRate        | sdk.Dec       | 0.0 (0%)                                             |
| MaxOrderAmountRatio    | sdk.Dec       | 0.1 (10%)                                            |
| UnitBatchHeight        | uint32        | 1                                                    |
| CircuitBreakerEnabled  | bool          | false                                                |

## PoolTypes

List of available pool types. Only type 1 (StandardLiquidityPool) is supported: two reserve coins, constant-product X/Y price function.

## MinInitDepositAmount

Minimum number of each coin to deposit on pool creation.

## InitPoolCoinMintAmount

Pool coins minted on pool creation.

## MaxReserveCoinAmount

Maximum reserve per coin in a pool. Deposit fails if exceeded. Zero means unlimited.

## PoolCreationFee

Fee paid on pool creation, sent to the community pool. Prevents spam.

## SwapFeeRate

Fee rate on every executed swap. Half reserved upfront as `OfferCoinFee`, half deducted after execution as `ExchangedCoinFee`. Collected fees sent to pool reserve.

## WithdrawFeeRate

Deducted from withdrawn reserve coins. Prevents deposit/withdraw cycling attacks.

## MaxOrderAmountRatio

Maximum ratio of pool reserves that a single swap order can request.

## UnitBatchHeight

Number of blocks per batch cycle. Batch executes when `BlockHeight % UnitBatchHeight == 0`.

## CircuitBreakerEnabled

Emergency switch. When true, `MsgCreatePool`, `MsgDepositWithinBatch`, and `MsgSwapWithinBatch` disabled. Withdrawals remain enabled so funds can be recovered.

## Constants

| Key                 | Type   | Value |
|---------------------|--------|-------|
| CancelOrderLifeSpan | int64  | 0     |
| MinReserveCoinNum   | uint32 | 2     |
| MaxReserveCoinNum   | uint32 | 2     |

`CancelOrderLifeSpan`: swap order lifetime in blocks (0 = expires at end of current batch).
