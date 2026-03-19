# Messages

## MsgUpdateParams

Updates module parameters. Restricted to governance authority.

```go
type MsgUpdateParams struct {
    Authority string // governance module address
    Params    Params // new parameters
}
```

Fails if:
- `Authority` does not match the governance module address
- `Params` fail validation (see Parameters)
