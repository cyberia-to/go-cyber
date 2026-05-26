# CosmWasm Integration

No custom bindings required. The contract must implement a Sudo entry point handling `BeginBlock` and `EndBlock` messages. Contracts missing this entry point will be jailed on first execution.

## Implementation

```rust
// msg.rs
#[cw_serde]
pub enum SudoMsg {
    BeginBlock {},
    EndBlock {},
}

// contract.rs
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn sudo(deps: DepsMut, env: Env, msg: SudoMsg) -> Result<Response, ContractError> {
    match msg {
        SudoMsg::BeginBlock {} => Ok(Response::new()),
        SudoMsg::EndBlock {} => {
            // perform logic here
            Ok(Response::new())
        }
    }
}
```

Both arms must return `Ok`. An error in either jails the contract.

## Examples

Increment a counter every block:

```rust
SudoMsg::EndBlock {} => {
    let mut config = CONFIG.load(deps.storage)?;
    config.val += 1;
    CONFIG.save(deps.storage, &config)?;
    Ok(Response::new())
}
```

Act every N blocks using `env.block.height`:

```rust
SudoMsg::EndBlock {} => {
    if env.block.height % 10 != 0 {
        return Ok(Response::new());
    }
    let mut config = CONFIG.load(deps.storage)?;
    config.val += 1;
    CONFIG.save(deps.storage, &config)?;
    Ok(Response::new())
}
```

See also: [cw-clock example contract](https://github.com/Reecepbcups/cw-clock-example).
