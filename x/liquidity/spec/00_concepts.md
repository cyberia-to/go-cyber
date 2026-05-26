# Concepts

## Liquidity Pool

A liquidity pool holds two different coins as reserves and enables swaps between them. Each coin pair and pool type combination must be unique. Anyone can create a pool or provide liquidity by depositing reserve coins. Liquidity providers earn accumulated swap fees proportional to their pool share represented by pool coins.

Only pool type 1 (StandardLiquidityPool) is supported: exactly two reserve coins, constant-product X/Y price function with ESPM constraint.

## Pool Lifecycle

### Creation

A neuron sends `MsgCreatePool` with two deposit coins and pays `PoolCreationFee` (sent to the community pool). The module mints `InitPoolCoinMintAmount` pool coins and sends them to the creator. Reserve coins are transferred to the newly created pool reserve account.

### Deposit

A neuron sends `MsgDepositWithinBatch`. Deposit coins are escrowed in the module account. At batch execution the module calculates the mint amount proportional to existing reserves:

    mintAmount = min(supply * coinA / reserveA, supply * coinB / reserveB)

Accepted coins go to the pool reserve account, minted pool coins go to the depositor. Any truncated remainder is refunded.

### Withdrawal

A neuron sends `MsgWithdrawWithinBatch`. Pool coins are escrowed in the module account. At batch execution the module calculates withdraw amounts:

    withdrawAmount = reserveAmount * poolCoinAmount * (1 - withdrawFeeRate) / totalSupply

Reserve coins are sent from the pool reserve account to the withdrawer. Escrowed pool coins are burned. The transfer uses `InputOutputCoins` which bypasses the 2% energy burn fee applied by cyberbank on regular `SendCoins` transfers.

### Depleted Pool

When all pool coins are withdrawn and reserves reach zero the pool is depleted. A depleted pool can be reactivated by a new deposit that meets `MinInitDepositAmount`.

## Equivalent Swap Price Model (ESPM)

A hybrid AMM that combines an orderbook with a constant-product pool. Orders are collected into batches and executed at a single uniform swap price. The pool price always equals the last swap price, reducing arbitrage and preventing front-running compared to instant-execution AMMs.

## Batch Execution

Deposits, withdrawals, and swap orders accumulate in a pool batch for `UnitBatchHeight` blocks (default 1). At the end of the batch all orders execute simultaneously. Execution order within a batch: swaps first, then deposits, then withdrawals. Batch state transitions happen inside `EndBlocker` and are not visible as separate transactions.

## Escrow

The module account acts as escrow. When a batch message is accepted the offered coins transfer from the sender to the escrow. On batch execution the escrow releases coins to recipients or refunds them if the order was not matched or failed.

## Fees

- PoolCreationFee (default 40,000,000 bond denom): paid once on pool creation, sent to community pool. Prevents spam.
- SwapFeeRate (default 0.3%): split half-half between offer coin and exchanged coin to minimize pool price impact. Fees go to the pool reserve and are shared among providers.
- WithdrawFeeRate (default 0%): deducted from withdrawn reserve coins.

## Pool Identification

- PoolName: `{denomA}/{denomB}/{poolTypeId}` with denoms sorted alphabetically.
- ReserveAccount: `crypto.AddressHash(PoolName)`.
- PoolCoinDenom: `pool` prefix + uppercase hex of `sha256(PoolName)`.
