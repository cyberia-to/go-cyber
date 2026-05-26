# `x/tokenfactory`

## Abstract

The tokenfactory module enables permissionless token creation. Any account can create a new denomination namespaced under its address: `factory/{creator}/{subdenom}`. The creator becomes the denom admin with full control over minting, burning, force-transferring, and metadata. Admin privileges can be transferred or permanently removed.

## Contents

1. [Concepts](00_concepts.md)
2. [State](01_state.md)
3. [Messages](02_messages.md)
4. [Queries](03_queries.md)
5. [Events](04_events.md)
6. [Params](05_params.md)
7. [WASM Bindings](06_wasm.md)
8. [Errors](07_errors.md)
9. [CLI](08_cli.md)
