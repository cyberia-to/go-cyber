# Cyber Bindings for CosmWasm

![Crates.io](https://img.shields.io/crates/v/cyber-std)
![Crates.io](https://img.shields.io/crates/d/cyber-std)

This crate provides Cyber-specific bindings to enable your CosmWasm smart contracts to interact with the Cyber blockchain by exposing messages and queriers that can be emitted and used from within your contract.

## Bindings

Currently, the Cyber bindings include:

- Query support for:
  - Graph
    - ParticlesAmount
    - CyberlinksAmount
  - Bandwidth
    - BandwidthPrice
    - BandwidthLoad
    - BandwidthTotal
    - NeuronBandwidth
  - Rank
    - ParticleRank
  - Energy
    - SourceRoutes
    - SourceRoutedEnergy
    - DestinationRoutedEnergy
    - Route
  - DMN
    - Thought
    - ThoughtStats
    - ThoughtLowestFee
  - Liquidity
    - PoolParams
    - PoolLiquidity
    - PoolSupply
    - PoolPrice
    - PoolAddress
- Messages
  - Graph 
    - MsgCyberlink
  - Resources
    - MsgInvestmint
  - Energy
    - MsgCreateRoute
    - MsgEditRoute
    - MsgEditRouteName
    - MsgDeleteRoute
  - DMN
    - MsgCreateThought
    - MsgForgetThought
    - MsgChangeThoughtInput
    - MsgChangeThoughtPeriod
    - MsgChangeThoughtBlock
    - MsgChangeThoughtGasPrice
    - MsgChangeThoughtParticle
    - MsgChangeThoughtName
  - Liquidity
    - MsgCreatePool
    - MsgDepositWithinBath
    - MsgWithdrawWithinBath
    - MsgSwapWithinBath

## Usage

### Querying

In order to use the query functions enabled by the bindings, create a `CyberQuerier` instance within your contract logic. You can access all the enabled queries through this object.

```rust
// src/contract.rs
use cosmwasm_std::Coin;
use cyber_std::{ CyberQuerier, RankValueResponse };

...

// handler
pub fn try_something(
    deps: Deps,
    _env: Env,
    particle: String,
    ...
) -> StdResult<ParticleRankResponse> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: ParticleRankResponse = querier.query_particle_rank(particle)?;
    ...
    Ok(res)
}
```

## Creating Messages

You may want your contract to perform messages such as `MsgCyberlink` operations at the end of its execution. To do this, create a message using the predefined functions:

- `create_cyberlink_msg`

```rust
use cosmwasm_std::CosmosMsg;
use cyber_std::{ create_cyberlink_msg, CyberMsgWrapper };

...

pub fn try_something(
    deps: DepsMut,
    env: Env,
    links: Vec<Link>,
    ...
) -> Result<Response, ContractError> {
    ...
    let contract_addr = env.contract.address;
    let msg: CosmosMsg<CyberMsgWrapper> = create_cyberlink_msg(contract_addr.into(), links);
    
    let res = Response::new()
          .add_message(msg);
    Ok(res)
}
```