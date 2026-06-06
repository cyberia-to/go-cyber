# Queries

All queries served via gRPC at `/cyber.rank.v1beta1.Query/`.

## Params

Returns current module parameters.

## Rank

Returns rank value (uint64, scaled by 1e15) for a given particle (CID).

## Search

Returns particles linked from a given particle, sorted by rank descending. Paginated.

## Backlinks

Returns particles linking to a given particle, sorted by rank descending. Paginated.

## Top

Returns top-ranked particles globally (max 1000). Paginated.

## IsLinkExist

Checks if a specific neuron created a link between two particles. Returns bool.

## IsAnyLinkExist

Checks if any link exists between two particles regardless of who created it. Returns bool.

## ParticleNegentropy

Returns negentropy contribution of a single particle: `-πi × log2(πi) × 1e15`.

## Negentropy

Returns system-wide negentropy: `(log2(n) - H(π)) × 1e15`. Higher value means more focused graph attention.

## Karma

Deprecated. Returns unimplemented error.
