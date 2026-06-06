# Queries

All queries are served via gRPC at `/cyber.dmn.v1beta1.Query/`.

## Params

Returns current module parameters.

```
GET /cyber/dmn/v1beta1/dmn/params
```

## Thought

Returns a single thought by program address and name.

```
GET /cyber/dmn/v1beta1/dmn/thought?program={addr}&name={name}
```

Returns error if the thought does not exist.

## ThoughtStats

Returns execution statistics for a thought.

```
GET /cyber/dmn/v1beta1/dmn/thought_stats?program={addr}&name={name}
```

Returns error if the thought does not exist.

## Thoughts

Returns all thoughts in the system.

```
GET /cyber/dmn/v1beta1/dmn/thoughts
```

## ThoughtsStats

Returns execution statistics for all thoughts.

```
GET /cyber/dmn/v1beta1/dmn/thoughts_stats
```

## ThoughtsFees

Returns gas prices of all thoughts, sorted descending.

```
GET /cyber/dmn/v1beta1/dmn/thoughts_fees
```
