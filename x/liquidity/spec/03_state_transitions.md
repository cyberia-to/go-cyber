# State Transitions

## Coin Escrow

When a batch message is accepted the module escrows coins into the liquidity module account:

- MsgDepositWithinBatch: `DepositCoins` sent to escrow via `SendCoinsFromAccountToModule`.
- MsgWithdrawWithinBatch: `PoolCoin` sent to escrow via `SendCoinsFromAccountToModule`.
- MsgSwapWithinBatch: `OfferCoin` + `OfferCoinFee` sent to escrow via `SendCoinsFromAccountToModule`.

## Pool Creation

On `MsgCreatePool`:

1. Pool type, coin pair uniqueness, and balances validated.
2. `PoolCreationFee` transferred to the community pool via `FundCommunityPool`.
3. Deposit coins transferred from creator to pool reserve account.
4. `InitPoolCoinMintAmount` pool coins minted and sent to creator.
5. Pool record created, first PoolBatch initialized.

## Batch Execution

At the end of each `UnitBatchHeight` interval the `EndBlocker` executes the pool batch:

### Swap

Unexecuted swap messages collected, orderbook built, uniform swap price found that maximizes matched volume. Matched coins exchanged between requestors (self-swap) or between requestors and the pool (pool-swap). Swap fees sent to the pool reserve.

### Deposit

Escrowed deposit coins sent to the pool reserve account. Pool coins minted proportional to the deposit and sent to the depositor. Truncated remainders refunded from escrow.

### Withdrawal

Escrowed pool coins burned. Reserve coins proportional to the burned pool coins (minus `WithdrawFeeRate`) sent from the pool reserve account to the withdrawer via `InputOutputCoins`.

## Swap Fee Payment

Fees split half-half to minimize pool price impact:

- Half reserved upfront as `OfferCoinFee` (in offer coin denom).
- Half deducted after execution as `ExchangedCoinFee` (in received coin denom, equal value at swap price).

Both halves sent to the pool reserve, shared among liquidity providers.

## Order Expiry

After batch execution, unmatched swap orders with `OrderExpiryHeight` <= current height cancelled. Escrowed coins refunded.

## Refunds

Escrowed coins refunded for: cancelled swap orders, partially matched swaps (remaining portion), and failed deposit/withdraw messages.
