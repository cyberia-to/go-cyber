// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use crate::state::{Config, CONFIG, HEAD_ID, PARTICLES, TOTAL_PARTICLES};
use cosmwasm_std::{Deps, Order, StdResult};
use cw_storage_plus::Bound;

const MAX_LIMIT: u32 = 500;
const DEFAULT_LIMIT: u32 = 100;

pub fn query_admins(deps: Deps) -> StdResult<Vec<String>> {
    let cfg = CONFIG.load(deps.storage)?;
    Ok(cfg.admins.into_iter().map(|a| a.into()).collect())
}

pub fn query_head_id(deps: Deps) -> StdResult<u32> {
    let head_id = HEAD_ID.load(deps.storage)?;
    Ok(head_id)
}

pub fn query_total_particles(deps: Deps) -> StdResult<u32> {
    let total_particles = TOTAL_PARTICLES.load(deps.storage)?;
    Ok(total_particles)
}

pub fn query_particles(
    deps: Deps,
    start_after: Option<u32>,
    limit: Option<u32>,
) -> StdResult<Vec<(u32, String)>> {
    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    let start = start_after.map(Bound::exclusive);

    let particles = PARTICLES
        .range(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .collect::<StdResult<Vec<(u32, String)>>>()?;

    Ok(particles)
}
