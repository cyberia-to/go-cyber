# Queries

## Params

```
/osmosis.tokenfactory.v1beta1.Query/Params
```

Returns module parameters (DenomCreationFee, DenomCreationGasConsume).

## DenomAuthorityMetadata

```
/osmosis.tokenfactory.v1beta1.Query/DenomAuthorityMetadata
```

| Field | Type | Description |
|---|---|---|
| denom | string | Full factory denom |

Returns the admin address for the denom. Empty admin means no account has control.

## DenomsFromCreator

```
/osmosis.tokenfactory.v1beta1.Query/DenomsFromCreator
```

| Field | Type | Description |
|---|---|---|
| creator | string | Creator address |

Returns all denoms created by the address.
