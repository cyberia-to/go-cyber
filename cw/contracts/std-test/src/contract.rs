// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, MigrateMsg, QueryMsg, SudoMsg};
use crate::state::{State, STATE};
use crate::ContractError::{InvalidDenom, InvalidSubdenom, ZeroAmount};
use cosmwasm_std::{
    coin, entry_point, to_json_binary, BankMsg, Binary, Coin, Decimal, Env, MessageInfo,
    StakingMsg, StdError, Uint128,
};
use cyber_std::query_res::*;
use cyber_std::tokenfactory::query::{
    AdminResponse, DenomsByCreatorResponse, FullDenomResponse, MetadataResponse, ParamsResponse,
};
use cyber_std::tokenfactory::types::Metadata;
use cyber_std::types::{Link, Load, Trigger};
use cyber_std::{CyberMsg, CyberQuerier, Deps, DepsMut, Response};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, StdError> {
    let state = State {
        creator: info.sender.into(),
        beats: msg.beats,
    };

    STATE.save(deps.storage, &state)?;

    Ok(Response::default())
}
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Cyberlink { links } => cyberlink(deps, env, links),
        ExecuteMsg::Stake { validator, amount } => stake(deps, env, info, validator, amount),
        ExecuteMsg::Unstake { validator, amount } => unstake(deps, env, info, validator, amount),
        ExecuteMsg::Investmint {
            amount,
            resource,
            length,
        } => investmint(deps, env, info, amount, resource, length),
        ExecuteMsg::CreateEnergyRoute { destination, name } => {
            create_energy_route(deps, env, info, destination, name)
        }
        ExecuteMsg::EditEnergyRoute { destination, value } => {
            edit_energy_route(deps, env, info, destination, value)
        }
        ExecuteMsg::EditEnergyRouteName { destination, name } => {
            edit_energy_route_name(deps, env, info, destination, name)
        }
        ExecuteMsg::DeleteEnergyRoute { destination } => {
            delete_energy_route(deps, env, info, destination)
        }
        ExecuteMsg::CreateThought {
            trigger,
            load,
            name,
            particle,
        } => create_thought(deps, env, info, trigger, load, name, particle),
        ExecuteMsg::ForgetThought { name } => forget_thought(deps, env, info, name),
        ExecuteMsg::ChangeThoughtInput { name, input } => {
            change_thought_call_data(deps, env, info, name, input)
        }
        ExecuteMsg::ChangeThoughtPeriod { name, period } => {
            change_thought_period(deps, env, info, name, period)
        }
        ExecuteMsg::ChangeThoughtBlock { name, block } => {
            change_thought_block(deps, env, info, name, block)
        }
        ExecuteMsg::CreatePool {
            pool_type_id,
            deposit_coins,
        } => create_pool(deps, env, info, pool_type_id, deposit_coins),
        ExecuteMsg::DepositWithinBatch {
            pool_id,
            deposit_coins,
        } => deposit_within_batch(deps, env, info, pool_id, deposit_coins),
        ExecuteMsg::WithdrawWithinBatch { pool_id, pool_coin } => {
            withdraw_within_batch(deps, env, info, pool_id, pool_coin)
        }
        ExecuteMsg::SwapWithinBatch {
            pool_id,
            swap_type_id,
            offer_coin,
            demand_coin_denom,
            offer_coin_fee,
            order_price,
        } => swap_within_batch(
            deps,
            env,
            info,
            pool_id,
            swap_type_id,
            offer_coin,
            demand_coin_denom,
            offer_coin_fee,
            order_price,
        ),
        ExecuteMsg::CreateToken { subdenom, metadata } => create_denom(deps, subdenom, metadata),
        ExecuteMsg::ChangeTokenAdmin {
            denom,
            new_admin_address,
        } => change_admin(deps, denom, new_admin_address),
        ExecuteMsg::MintTokens {
            denom,
            amount,
            mint_to_address,
        } => mint_tokens(deps, denom, amount, mint_to_address),
        ExecuteMsg::BurnTokens {
            denom,
            amount,
            burn_from_address,
        } => burn_tokens(deps, denom, amount, burn_from_address),
        ExecuteMsg::ForceTokenTransfer {
            denom,
            amount,
            from_address,
            to_address,
        } => force_transfer(deps, denom, amount, from_address, to_address),
        ExecuteMsg::SetTokenMetadata { denom, metadata } => set_metadata(deps, denom, metadata),
    }
}

pub fn create_denom(
    deps: DepsMut,
    subdenom: String,
    metadata: Option<Metadata>,
) -> Result<Response, ContractError> {
    if subdenom.eq("") {
        return Err(InvalidSubdenom { subdenom });
    }

    let create_denom_msg = CyberMsg::create_contract_denom(subdenom, metadata);

    let res = Response::new()
        .add_attribute("method", "create_denom")
        .add_message(create_denom_msg);

    Ok(res)
}

pub fn change_admin(
    deps: DepsMut,
    denom: String,
    new_admin_address: String,
) -> Result<Response, ContractError> {
    deps.api.addr_validate(&new_admin_address)?;

    validate_denom(deps, denom.clone())?;

    let change_admin_msg = CyberMsg::change_denom_admin(denom, new_admin_address);

    let res = Response::new()
        .add_attribute("method", "change_admin")
        .add_message(change_admin_msg);

    Ok(res)
}

pub fn mint_tokens(
    deps: DepsMut,
    denom: String,
    amount: Uint128,
    mint_to_address: String,
) -> Result<Response, ContractError> {
    deps.api.addr_validate(&mint_to_address)?;

    if amount.eq(&Uint128::new(0_u128)) {
        return Result::Err(ZeroAmount {});
    }

    validate_denom(deps, denom.clone())?;

    let mint_tokens_msg = CyberMsg::mint_contract_tokens(denom, amount, mint_to_address);

    let res = Response::new()
        .add_attribute("method", "mint_tokens")
        .add_message(mint_tokens_msg);

    Ok(res)
}

pub fn burn_tokens(
    deps: DepsMut,
    denom: String,
    amount: Uint128,
    burn_from_address: String,
) -> Result<Response, ContractError> {
    if amount.eq(&Uint128::new(0_u128)) {
        return Result::Err(ZeroAmount {});
    }

    validate_denom(deps, denom.clone())?;

    let burn_token_msg = CyberMsg::burn_contract_tokens(denom, amount, burn_from_address);

    let res = Response::new()
        .add_attribute("method", "burn_tokens")
        .add_message(burn_token_msg);

    Ok(res)
}

pub fn force_transfer(
    deps: DepsMut,
    denom: String,
    amount: Uint128,
    from_address: String,
    to_address: String,
) -> Result<Response, ContractError> {
    if amount.eq(&Uint128::new(0_u128)) {
        return Result::Err(ZeroAmount {});
    }

    validate_denom(deps, denom.clone())?;

    let force_msg = CyberMsg::force_transfer_tokens(denom, amount, from_address, to_address);

    let res = Response::new()
        .add_attribute("method", "force_transfer_tokens")
        .add_message(force_msg);

    Ok(res)
}

pub fn set_metadata(
    deps: DepsMut,
    denom: String,
    metadata: Metadata,
) -> Result<Response, ContractError> {
    validate_denom(deps, denom.clone())?;

    let force_msg = CyberMsg::set_metadata(denom, metadata);

    let res = Response::new()
        .add_attribute("method", "force_transfer_tokens")
        .add_message(force_msg);

    Ok(res)
}

fn validate_denom(deps: DepsMut, denom: String) -> Result<(), ContractError> {
    let denom_to_split = denom.clone();
    let tokenfactory_denom_parts: Vec<&str> = denom_to_split.split('/').collect();

    if tokenfactory_denom_parts.len() != 3 {
        return Result::Err(InvalidDenom {
            denom,
            message: std::format!(
                "denom must have 3 parts separated by /, had {}",
                tokenfactory_denom_parts.len()
            ),
        });
    }

    let prefix = tokenfactory_denom_parts[0];
    let creator_address = tokenfactory_denom_parts[1];
    let subdenom = tokenfactory_denom_parts[2];

    if !prefix.eq_ignore_ascii_case("factory") {
        return Result::Err(InvalidDenom {
            denom,
            message: std::format!("prefix must be 'factory', was {}", prefix),
        });
    }

    // Validate denom by attempting to query for full denom
    let response = CyberQuerier::new(&deps.querier)
        .query_full_denom(String::from(creator_address), String::from(subdenom));
    if response.is_err() {
        return Result::Err(InvalidDenom {
            denom,
            message: response.err().unwrap().to_string(),
        });
    }

    Result::Ok(())
}

pub fn cyberlink(_deps: DepsMut, env: Env, links: Vec<Link>) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::cyberlink(contract.into(), links);

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn stake(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    validator: String,
    amount: Coin,
) -> Result<Response, ContractError> {
    let amount = coin(u128::from(amount.amount), amount.denom);
    let res = Response::new().add_message(StakingMsg::Delegate {
        validator: validator.into(),
        amount: amount.clone(),
    });
    Ok(res)
}

pub fn unstake(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    validator: String,
    amount: Coin,
) -> Result<Response, ContractError> {
    let amount = coin(u128::from(amount.amount), amount.denom);
    let res = Response::new().add_message(StakingMsg::Undelegate {
        validator: validator.into(),
        amount: amount.clone(),
    });
    Ok(res)
}

pub fn investmint(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    amount: Coin,
    resource: String,
    length: u64,
) -> Result<Response, ContractError> {
    let amount = coin(u128::from(amount.amount), amount.denom);
    let agent = env.contract.address;
    let msg = CyberMsg::investmint(agent.into(), amount.clone(), resource.into(), length.into());

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn create_energy_route(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    destination: String,
    name: String,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::create_energy_route(contract.into(), destination.into(), name.into());

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn edit_energy_route(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    destination: String,
    value: Coin,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let value = coin(u128::from(value.amount), value.denom);
    let msg = CyberMsg::edit_energy_route(contract.into(), destination.into(), value.clone());

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn edit_energy_route_name(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    destination: String,
    name: String,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::edit_energy_route_name(contract.into(), destination.into(), name.into());

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn delete_energy_route(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    destination: String,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::delete_energy_route(contract.into(), destination.into());

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn create_thought(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    trigger: Trigger,
    load: Load,
    name: String,
    particle: String,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::creat_thought(
        contract.into(),
        trigger.into(),
        load.into(),
        name.into(),
        particle.into(),
    );

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn forget_thought(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    name: String,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::forget_thought(contract.into(), name.into());

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn change_thought_call_data(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    name: String,
    input: String,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::change_thought_input(contract.into(), name.into(), input.into());

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn change_thought_period(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    name: String,
    period: u64,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::change_thought_period(contract.into(), name.into(), period.into());

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn change_thought_block(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    name: String,
    block: u64,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::change_thought_block(contract.into(), name.into(), block.into());

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn create_pool(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    pool_type_id: u32,
    deposit_coins: Vec<Coin>,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::create_pool(contract.into(), pool_type_id, deposit_coins);

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn deposit_within_batch(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    pool_id: u64,
    deposit_coins: Vec<Coin>,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::deposit_within_batch(contract.into(), pool_id, deposit_coins);

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn withdraw_within_batch(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    pool_id: u64,
    pool_coin: Coin,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::withdraw_within_batch(contract.into(), pool_id, pool_coin);

    let res = Response::new().add_message(msg);
    Ok(res)
}

pub fn swap_within_batch(
    _deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    pool_id: u64,
    swap_type_id: u32,
    offer_coin: Coin,
    demand_coin_denom: String,
    offer_coin_fee: Coin,
    order_price: Decimal,
) -> Result<Response, ContractError> {
    let contract = env.contract.address;
    let msg = CyberMsg::swap_within_batch(
        contract.into(),
        pool_id,
        swap_type_id,
        offer_coin,
        demand_coin_denom,
        offer_coin_fee,
        order_price,
    );

    let res = Response::new().add_message(msg);
    Ok(res)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn sudo(deps: DepsMut, env: Env, msg: SudoMsg) -> Result<Response, ContractError> {
    match msg {
        SudoMsg::Heartbeat { beats } => do_beat(deps, env, beats),
        SudoMsg::Cyberlink { links } => cyberlink(deps, env, links),
        SudoMsg::Release {} => do_release(deps, env),
        SudoMsg::CpuLoop {} => do_cpu_loop(),
        SudoMsg::StorageLoop {} => do_storage_loop(deps),
        SudoMsg::MemoryLoop {} => do_memory_loop(),
        SudoMsg::Panic {} => do_panic(),
        SudoMsg::TransferFunds { recipient, amount } => {
            let response = Response::new().add_message(BankMsg::Send {
                to_address: recipient,
                amount,
            });
            Ok(response)
        }
    }
}

fn do_beat(deps: DepsMut, _env: Env, beats: u64) -> Result<Response, ContractError> {
    let mut state = STATE.load(deps.storage)?;

    state.beats = state.beats + beats;

    STATE.save(deps.storage, &state)?;
    Ok(Response::default())
}

fn do_release(deps: DepsMut, env: Env) -> Result<Response, ContractError> {
    let state = STATE.load(deps.storage)?;

    let to_addr = state.creator;
    let balance = deps.querier.query_all_balances(env.contract.address)?;

    let resp = Response::new()
        .add_attribute("action", "release")
        .add_attribute("destination", to_addr.clone())
        .add_message(BankMsg::Send {
            to_address: to_addr.into(),
            amount: balance,
        })
        .set_data(&[0xF0, 0x0B, 0xAA]);
    Ok(resp)
}

fn do_cpu_loop() -> Result<Response, ContractError> {
    let mut counter = 0u64;
    loop {
        counter += 1;
        if counter >= 9_000_000_000 {
            counter = 0;
        }
    }
}

fn do_storage_loop(deps: DepsMut) -> Result<Response, ContractError> {
    let mut test_case = 0u64;
    loop {
        deps.storage
            .set(b"test.key", test_case.to_string().as_bytes());
        test_case += 1;
    }
}

fn do_memory_loop() -> Result<Response, ContractError> {
    let mut data = vec![1usize];
    loop {
        // add one element
        data.push((*data.last().expect("must not be empty")) + 1);
    }
}

fn do_panic() -> Result<Response, ContractError> {
    panic!("This page intentionally faulted");
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> Result<Binary, ContractError> {
    match msg {
        QueryMsg::ParticleRank { particle } => {
            Ok(to_json_binary(&query_particle_rank(deps, particle)?)?)
        }
        QueryMsg::GraphStats {} => Ok(to_json_binary(&query_graph_stats(deps)?)?),
        QueryMsg::State {} => Ok(to_json_binary(&STATE.load(deps.storage)?)?),
        QueryMsg::Thought { program, name } => {
            Ok(to_json_binary(&query_thought(deps, program, name)?)?)
        }
        QueryMsg::ThoughtStats { program, name } => {
            Ok(to_json_binary(&query_thought_stats(deps, program, name)?)?)
        }
        QueryMsg::ThoughtsFees {} => Ok(to_json_binary(&query_thought_lowest_fee(deps)?)?),
        QueryMsg::SourceRoutes { source } => {
            Ok(to_json_binary(&query_source_routes(deps, source)?)?)
        }
        QueryMsg::SourceRoutedEnergy { source } => {
            Ok(to_json_binary(&query_source_routed_energy(deps, source)?)?)
        }
        QueryMsg::DestinationRoutedEnergy { destination } => Ok(to_json_binary(
            &query_destination_routed_energy(deps, destination)?,
        )?),
        QueryMsg::Route {
            source,
            destination,
        } => Ok(to_json_binary(&query_route(deps, source, destination)?)?),
        QueryMsg::BandwidthPrice {} => Ok(to_json_binary(&query_price(deps)?)?),
        QueryMsg::BandwidthLoad {} => Ok(to_json_binary(&query_load(deps)?)?),
        QueryMsg::TotalBandwidth {} => Ok(to_json_binary(&query_total_bandwidth(deps)?)?),
        QueryMsg::NeuronBandwidth { neuron } => {
            Ok(to_json_binary(&query_neuron_bandwidth(deps, neuron)?)?)
        }
        QueryMsg::PoolParams { pool_id } => Ok(to_json_binary(&query_pool_params(deps, pool_id)?)?),
        QueryMsg::PoolLiquidity { pool_id } => {
            Ok(to_json_binary(&query_pool_liquidity(deps, pool_id)?)?)
        }
        QueryMsg::PoolSupply { pool_id } => Ok(to_json_binary(&query_pool_supply(deps, pool_id)?)?),
        QueryMsg::PoolPrice { pool_id } => Ok(to_json_binary(&query_pool_price(deps, pool_id)?)?),
        QueryMsg::PoolAddress { pool_id } => {
            Ok(to_json_binary(&query_pool_address(deps, pool_id)?)?)
        }
        QueryMsg::FullDenom {
            creator_addr,
            subdenom,
        } => Ok(to_json_binary(&query_full_denom(
            deps,
            creator_addr,
            subdenom,
        )?)?),
        QueryMsg::DenomMetadata { denom } => {
            Ok(to_json_binary(&query_denom_metadata(deps, denom)?)?)
        }
        QueryMsg::DenomAdmin { denom } => Ok(to_json_binary(&query_denom_admin(deps, denom)?)?),
        QueryMsg::DenomsByCreator { creator } => {
            Ok(to_json_binary(&query_denoms_by_creator(deps, creator)?)?)
        }
        QueryMsg::DenomCreationFee {} => Ok(to_json_binary(&query_denom_creation_fee(deps)?)?),
    }
}

pub fn query_particle_rank(
    deps: Deps,
    particle: String,
) -> Result<ParticleRankResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: ParticleRankResponse = querier.query_particle_rank(particle)?;

    Ok(res)
}

pub fn query_graph_stats(deps: Deps) -> Result<GraphStatsResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: GraphStatsResponse = querier.query_graph_stats()?;

    Ok(res)
}

pub fn query_thought(
    deps: Deps,
    program: String,
    name: String,
) -> Result<ThoughtResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: ThoughtResponse = querier.query_thought(program, name)?;

    Ok(res)
}

pub fn query_thought_stats(
    deps: Deps,
    program: String,
    name: String,
) -> Result<ThoughtStatsResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: ThoughtStatsResponse = querier.query_thought_stats(program, name)?;

    Ok(res)
}

pub fn query_thought_lowest_fee(deps: Deps) -> Result<ThoughtsFeesResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: ThoughtsFeesResponse = querier.query_thoughts_fees()?;

    Ok(res)
}

pub fn query_source_routes(deps: Deps, source: String) -> Result<RoutesResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: RoutesResponse = querier.query_source_routes(source)?;

    Ok(res)
}

pub fn query_source_routed_energy(
    deps: Deps,
    source: String,
) -> Result<RoutedEnergyResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: RoutedEnergyResponse = querier.query_source_routed_energy(source)?;

    Ok(res)
}

pub fn query_destination_routed_energy(
    deps: Deps,
    destination: String,
) -> Result<RoutedEnergyResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: RoutedEnergyResponse = querier.query_destination_routed_energy(destination)?;

    Ok(res)
}

pub fn query_route(
    deps: Deps,
    source: String,
    destination: String,
) -> Result<RouteResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: RouteResponse = querier.query_route(source, destination)?;

    Ok(res)
}

pub fn query_price(deps: Deps) -> Result<BandwidthPriceResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: BandwidthPriceResponse = querier.query_bandwidth_price()?;

    Ok(res)
}

pub fn query_load(deps: Deps) -> Result<BandwidthLoadResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: BandwidthLoadResponse = querier.query_bandwidth_load()?;

    Ok(res)
}

pub fn query_total_bandwidth(deps: Deps) -> Result<TotalBandwidthResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: TotalBandwidthResponse = querier.query_total_bandwidth()?;

    Ok(res)
}

pub fn query_neuron_bandwidth(
    deps: Deps,
    address: String,
) -> Result<NeuronBandwidthResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: NeuronBandwidthResponse = querier.query_neuron_bandwidth(address)?;

    Ok(res)
}

pub fn query_pool_params(deps: Deps, pool_id: u64) -> Result<PoolParamsResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: PoolParamsResponse = querier.query_pool_params(pool_id)?;

    Ok(res)
}

pub fn query_pool_liquidity(
    deps: Deps,
    pool_id: u64,
) -> Result<PoolLiquidityResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: PoolLiquidityResponse = querier.query_pool_liquidity(pool_id)?;

    Ok(res)
}

pub fn query_pool_supply(deps: Deps, pool_id: u64) -> Result<PoolSupplyResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: PoolSupplyResponse = querier.query_pool_supply(pool_id)?;

    Ok(res)
}

pub fn query_pool_price(deps: Deps, pool_id: u64) -> Result<PoolPriceResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: PoolPriceResponse = querier.query_pool_price(pool_id)?;

    Ok(res)
}

pub fn query_pool_address(deps: Deps, pool_id: u64) -> Result<PoolAddressResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: PoolAddressResponse = querier.query_pool_address(pool_id)?;

    Ok(res)
}

pub fn query_full_denom(
    deps: Deps,
    creator_addr: String,
    subdenom: String,
) -> Result<FullDenomResponse, ContractError> {
    deps.api.addr_validate(&creator_addr)?;

    let querier = CyberQuerier::new(&deps.querier);
    let res: FullDenomResponse = querier.query_full_denom(creator_addr, subdenom)?;

    Ok(res)
}

pub fn query_denom_metadata(deps: Deps, denom: String) -> Result<MetadataResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: MetadataResponse = querier.query_denom_metadata(denom)?;

    Ok(res)
}

pub fn query_denom_admin(deps: Deps, denom: String) -> Result<AdminResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: AdminResponse = querier.query_denom_admin(denom)?;

    Ok(res)
}

pub fn query_denoms_by_creator(
    deps: Deps,
    creator: String,
) -> Result<DenomsByCreatorResponse, ContractError> {
    deps.api.addr_validate(&creator)?;

    let querier = CyberQuerier::new(&deps.querier);
    let res: DenomsByCreatorResponse = querier.query_denoms_by_creator(creator)?;

    Ok(res)
}

pub fn query_denom_creation_fee(deps: Deps) -> Result<ParamsResponse, ContractError> {
    let querier = CyberQuerier::new(&deps.querier);
    let res: ParamsResponse = querier.query_denom_creation_fee()?;

    Ok(res)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(_: DepsMut, _env: Env, _msg: MigrateMsg) -> Result<Response, ContractError> {
    Ok(Response::new().add_attribute("action", "migrate"))
}
