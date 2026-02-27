# CLI

All commands are under `cyber query dmn`.

## Query

```bash
# Module parameters
cyber query dmn params

# Single thought
cyber query dmn thought [program] [name]

# Thought execution stats
cyber query dmn thought-stats [program] [name]

# All thoughts
cyber query dmn thoughts

# All thought stats
cyber query dmn thoughts-stats
```

No transaction CLI commands are provided. Thoughts are managed by CosmWasm programs via WASM bindings or generic `cyber tx` message submission.
