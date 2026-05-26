// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_json_binary, Addr, Api, Binary, Deps, DepsMut, Empty, Env, MessageInfo, Response, StdResult,
};
use cw2::{get_contract_version, set_contract_version};

use crate::error::ContractError;
use crate::execute::{execute_add_particles, execute_delete_particles, execute_update_admins};
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::query::{query_admins, query_head_id, query_particles, query_total_particles};
use crate::state::{Config, CONFIG, HEAD_ID, TOTAL_PARTICLES};

use semver::Version;

const CONTRACT_NAME: &str = "graph-filter";
const CONTRACT_VERSION: &str = "1.0.0";

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let config = Config {
        admins: map_validate(deps.api, &msg.admins)?,
    };
    CONFIG.save(deps.storage, &config)?;
    HEAD_ID.save(deps.storage, &0)?;
    TOTAL_PARTICLES.save(deps.storage, &0)?;

    Ok(Response::default())
}

pub fn map_validate(api: &dyn Api, admins: &[String]) -> StdResult<Vec<Addr>> {
    admins.iter().map(|addr| api.addr_validate(addr)).collect()
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::UpdateAdmins { admins } => execute_update_admins(deps, env, info, admins),
        ExecuteMsg::AddParticles { particles } => execute_add_particles(deps, env, info, particles),
        ExecuteMsg::DeleteParticles { particles } => {
            execute_delete_particles(deps, env, info, particles)
        }
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_json_binary(&query_admins(deps)?),
        QueryMsg::Particles { start_after, limit } => {
            to_json_binary(&query_particles(deps, start_after, limit)?)
        }
        QueryMsg::HeadId {} => to_json_binary(&query_head_id(deps)?),
        QueryMsg::TotalParticles {} => to_json_binary(&query_total_particles(deps)?),
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(deps: DepsMut, _env: Env, _msg: Empty) -> Result<Response, ContractError> {
    let stored = get_contract_version(deps.storage)?;
    if stored.contract != CONTRACT_NAME {
        return Err(ContractError::CannotMigrate {
            previous_contract: stored.contract,
        });
    }

    let version: Version = CONTRACT_VERSION.parse()?;
    let storage_version: Version = get_contract_version(deps.storage)?.version.parse()?;

    if storage_version > version {
        return Err(ContractError::CannotMigrateVersion {
            previous_version: stored.version,
        });
    }

    if storage_version < version {
        set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    }

    Ok(Response::new())
}
