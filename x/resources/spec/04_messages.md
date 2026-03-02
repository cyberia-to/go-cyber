# Messages

## MsgInvestmint

Burns hydrogen and mints volts or amperes.

```go
type MsgInvestmint struct {
    Neuron   string   // neuron's address
    Amount   sdk.Coin // hydrogen amount to burn
    Resource string   // "millivolt" or "milliampere"
    Length   uint64   // accepted but ignored (maxPeriod used)
}
```

Fails if:

- `Neuron` is not a valid address
- `Amount` is not positive or wrong denom
- `Resource` is not millivolt or milliampere
- `Length` is 0
- `Amount` denom does not match base resource denom for the target resource
- Spendable hydrogen balance < `Amount`
- Calculated return < 1000 units

## MsgUpdateParams

Updates module parameters. Restricted to governance authority.

```go
type MsgUpdateParams struct {
    Authority string
    Params    Params
}
```
