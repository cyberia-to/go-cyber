# State

## Params

`0x00` → `Params` (protobuf)

Module parameters: creation fee and gas consumption.

## Authority Metadata

`denoms|{denom}|authoritymetadata` → `DenomAuthorityMetadata` (protobuf)

Stores the admin address for each factory denom. When admin is `""`, the denom has no admin.

## Creator Index

`creator|{creator_address}|{denom}` → `{denom}` (bytes)

Maps each creator to the list of denoms they created. Used by the `DenomsFromCreator` query.

## Bank Module State

Denom metadata (name, symbol, display, denom units) is stored in the bank module via `SetDenomMetaData`, not in tokenfactory's own store.
