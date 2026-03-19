# CLI

## Query

```bash
cyber query tokenfactory params
cyber query tokenfactory denom-authority-metadata [denom]
cyber query tokenfactory denoms-from-creator [creator-address]
```

## Transaction

```bash
cyber tx tokenfactory create-denom [subdenom]
cyber tx tokenfactory mint [amount]
cyber tx tokenfactory mint-to [address] [amount]
cyber tx tokenfactory burn [amount]
cyber tx tokenfactory burn-from [address] [amount]
cyber tx tokenfactory force-transfer [amount] [from-addr] [to-addr]
cyber tx tokenfactory change-admin [denom] [new-admin-address]
cyber tx tokenfactory modify-metadata [denom] [ticker] [description] [exponent]
```
