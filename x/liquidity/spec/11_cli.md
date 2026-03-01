# CLI

## Query

```bash
cyber query liquidity params
cyber query liquidity pool [pool-id]              # by ID
cyber query liquidity pool --pool-coin-denom [d]   # by pool coin denom
cyber query liquidity pool --reserve-acc [addr]    # by reserve account
cyber query liquidity pools                        # all pools (paginated)
cyber query liquidity batch [pool-id]              # current batch
cyber query liquidity deposits [pool-id]           # all deposit messages in batch
cyber query liquidity deposit [pool-id] [msg-index]
cyber query liquidity withdraws [pool-id]          # all withdraw messages in batch
cyber query liquidity withdraw [pool-id] [msg-index]
cyber query liquidity swaps [pool-id]              # all swap messages in batch
cyber query liquidity swap [pool-id] [msg-index]
```

## Transaction

```bash
cyber tx liquidity create-pool [pool-type] [deposit-coins]
cyber tx liquidity deposit [pool-id] [deposit-coins]
cyber tx liquidity withdraw [pool-id] [pool-coin]
cyber tx liquidity swap [pool-id] [swap-type] [offer-coin] [demand-coin-denom] [order-price] [swap-fee-rate]
```
