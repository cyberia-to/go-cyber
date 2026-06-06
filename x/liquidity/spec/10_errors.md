# Errors

| Error                        | Code | Description                                    |
|------------------------------|------|------------------------------------------------|
| ErrPoolNotExists             | 1    | pool does not exist                            |
| ErrPoolTypeNotExists         | 2    | pool type does not exist                       |
| ErrEqualDenom                | 3    | reserve coin denoms are equal                  |
| ErrInvalidDenom              | 4    | invalid coin denom                             |
| ErrNumOfReserveCoin          | 5    | wrong number of reserve coins                  |
| ErrNumOfPoolCoin             | 6    | wrong number of pool coins                     |
| ErrInsufficientPool          | 7    | insufficient pool                              |
| ErrInsufficientBalance       | 8    | insufficient balance                           |
| ErrLessThanMinInitDeposit    | 9    | deposit below MinInitDepositAmount             |
| ErrNotImplementedYet         | 10   | feature not implemented                        |
| ErrPoolAlreadyExists         | 11   | pool with same type and coin pair exists       |
| ErrPoolBatchNotExists        | 12   | pool batch does not exist                      |
| ErrOrderBookInvalidity       | 13   | orderbook invariant violation                  |
| ErrBatchNotExecuted          | 14   | batch has not been executed                    |
| ErrInvalidPoolCreatorAddr    | 15   | invalid pool creator address                   |
| ErrInvalidDepositorAddr      | 16   | invalid depositor address                      |
| ErrInvalidWithdrawerAddr     | 17   | invalid withdrawer address                     |
| ErrInvalidSwapRequesterAddr  | 18   | invalid swap requester address                 |
| ErrBadPoolCoinAmount         | 19   | invalid pool coin amount                       |
| ErrBadDepositCoinsAmount     | 20   | invalid deposit coins amount                   |
| ErrBadOfferCoinAmount        | 21   | invalid offer coin amount                      |
| ErrBadOrderingReserveCoin    | 22   | reserve coins not sorted alphabetically        |
| ErrBadOrderPrice             | 23   | invalid order price                            |
| ErrNumOfReserveCoinDenoms    | 24   | wrong number of reserve coin denoms            |
| ErrEmptyReserveAccountAddress| 25   | empty reserve account address                  |
| ErrEmptyPoolCoinDenom        | 26   | empty pool coin denom                          |
| ErrBadOrderingReserveCoinDenoms | 27 | reserve coin denoms not sorted                |
| ErrBadReserveAccountAddress  | 28   | invalid reserve account address                |
| ErrBadPoolCoinDenom          | 29   | invalid pool coin denom                        |
| ErrInsufficientPoolCreationFee | 30 | insufficient pool creation fee                 |
| ErrExceededMaxOrderable      | 31   | order exceeds MaxOrderAmountRatio              |
| ErrBadBatchMsgIndex          | 32   | invalid batch message index                    |
| ErrSwapTypeNotExists         | 33   | swap type does not exist                       |
| ErrLessThanMinOfferAmount    | 34   | offer amount below minimum (100)               |
| ErrBadOfferCoinFee           | 35   | offer coin fee does not match expected         |
| ErrNotMatchedReserveCoin     | 36   | deposit denoms do not match pool reserves      |
| ErrBadPoolTypeID             | 37   | invalid pool type ID                           |
| ErrExceededReserveCoinLimit  | 38   | deposit exceeds MaxReserveCoinAmount            |
| ErrDepletedPool              | 39   | pool is depleted                               |
| ErrCircuitBreakerEnabled     | 40   | circuit breaker is enabled                     |
| ErrOverflowAmount            | 41   | arithmetic overflow                            |
