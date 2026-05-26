# Queries

All queries are served via gRPC at `/cyber.grid.v1beta1.Query/`.

## Params

Returns current module parameters.

## SourceRoutes

Returns all routes from a given source address (max 16).

## DestinationRoutes

Returns all routes to a given destination address.

## SourceRoutedEnergy

Returns total energy (sum of all route values) routed from a source.

## DestinationRoutedEnergy

Returns total energy (sum of all route values) routed to a destination.

## Route

Returns a single route between source and destination.

## Routes

Returns all routes in the system (paginated).
