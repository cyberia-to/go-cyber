# Messages

## MsgCyberlink

Create one or more cyberlinks between particles.

| Field | Type | Validation |
|---|---|---|
| neuron | string | valid bech32 address, non-zero ampere balance |
| links | []Link | at least one link required |

### Link

| Field | Type | Validation |
|---|---|---|
| from | string | valid CID v0 |
| to | string | valid CID v0, must differ from `from` |

Additional validation:
- No duplicate links within the same message
- Each `from → to` pair must not already exist for this neuron
- Neuron must have sufficient volt bandwidth for `len(links) * 1000 * creditPrice`
- Block must not have exceeded max bandwidth

### Errors

| Error | Code | Condition |
|---|---|---|
| ErrZeroLinks | 3 | empty links array |
| ErrSelfLink | 4 | from == to |
| ErrInvalidParticle | 5 | invalid CID format |
| ErrCidVersion | 7 | CID version other than v0 |
| ErrZeroPower | 8 | neuron has zero ampere balance |
| ErrCyberlinkExist | 2 | link already exists for this neuron |
| ErrNotEnoughBandwidth | — | insufficient volt bandwidth |
| ErrExceededMaxBlockBandwidth | — | block bandwidth limit reached |
