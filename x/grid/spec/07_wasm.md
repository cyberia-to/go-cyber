# WASM Bindings

## Messages

Contracts call grid operations via custom messages. The `source` field must match the calling contract address.

| Operation | Fields |
|---|---|
| CreateEnergyRoute | destination, name |
| EditEnergyRoute | destination, value |
| EditEnergyRouteName | destination, name |
| DeleteEnergyRoute | destination |

## Queries

| Query | Fields | Returns |
|---|---|---|
| SourceRoutes | source | array of Route |
| SourceRoutedEnergy | source | sdk.Coins |
| DestinationRoutedEnergy | destination | sdk.Coins |
| Route | source, destination | Route |
