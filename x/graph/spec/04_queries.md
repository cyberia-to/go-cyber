# Queries

All queries are served via gRPC at `/cyber.graph.v1beta1.Query/`.

## GraphStats

Returns total cyberlinks and particles in the graph.

```
GET /cyber/graph/v1beta1/graph/stats
```

Response:

| Field | Type | Description |
|---|---|---|
| cyberlinks | uint64 | total cyberlink count |
| particles | uint64 | total particle count |

## BurnStats

Returns cumulative bandwidth burned by cyberlink creation.

```
GET /cyber/graph/v1beta1/graph/burn_stats
```

Response:

| Field | Type | Description |
|---|---|---|
| millivolt | uint64 | total millivolts burned |
| milliampere | uint64 | total milliamperes burned |
