# API

## gRPC

| Path | Description |
| --- | --- |
| `/cyber/bandwidth/v1beta1/bandwidth/params` | Module parameters |
| `/cyber/bandwidth/v1beta1/bandwidth/load` | Current network load |
| `/cyber/bandwidth/v1beta1/bandwidth/price` | Current bandwidth price |
| `/cyber/bandwidth/v1beta1/bandwidth/total` | Total (desirable) bandwidth |
| `/cyber/bandwidth/v1beta1/bandwidth/neuron/{neuron}` | Neuron bandwidth by address |

## Messages

| Path | Description |
| --- | --- |
| `cyber.bandwidth.v1beta1.Msg/UpdateParams` | Update module parameters (governance) |
