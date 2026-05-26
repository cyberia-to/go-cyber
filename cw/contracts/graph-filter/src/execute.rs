// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use crate::contract::map_validate;
use crate::error::ContractError;
use crate::state::{CONFIG, HEAD_ID, PARTICLES, TOTAL_PARTICLES};
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response, StdResult};
use cyber_std::particle::check_particle;

pub fn execute_update_admins(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    new_admins: Vec<String>,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    if !cfg.can_modify(info.sender.as_ref()) {
        return Err(ContractError::Unauthorized {});
    }

    let admins = map_validate(deps.api, &new_admins)?;
    CONFIG.update(deps.storage, |mut cfg| -> StdResult<_> {
        cfg.admins = admins;
        Ok(cfg)
    })?;

    Ok(Response::new().add_attribute("action", "update_admins"))
}

pub fn execute_add_particles(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    particles: Vec<String>,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    if !cfg.is_admin(info.sender.as_ref()) {
        return Err(ContractError::Unauthorized {});
    }

    let mut id = HEAD_ID.load(deps.storage)?;
    let particles_len = particles.len();

    for particle in particles {
        id += 1;
        check_particle(particle.clone())?;
        PARTICLES.save(deps.storage, id, &particle)?;
    }

    HEAD_ID.save(deps.storage, &id)?;
    TOTAL_PARTICLES.update(deps.storage, |total| -> StdResult<_> {
        Ok(total + particles_len as u32)
    })?;

    Ok(Response::new().add_attribute("action", "add_particles"))
}

pub fn execute_delete_particles(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    particles: Vec<u32>,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    if !cfg.is_admin(info.sender.as_ref()) {
        return Err(ContractError::Unauthorized {});
    }

    let mut deleted_count = 0u32;
    for particle_id in particles {
        if PARTICLES.has(deps.storage, particle_id) {
            PARTICLES.remove(deps.storage, particle_id);
            deleted_count += 1;
        }
    }
    if deleted_count > 0 {
        TOTAL_PARTICLES.update(deps.storage, |total| -> StdResult<_> {
            Ok(total.saturating_sub(deleted_count))
        })?;
    }

    Ok(Response::new().add_attribute("action", "delete_particles"))
}
