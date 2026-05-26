// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use crate::types::{NeuronBandwidth, Route, Thought, ThoughtStats};
use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Coin, Decimal};

#[cw_serde]
pub struct ParticleRankResponse {
    pub rank: u64,
}

#[cw_serde]
pub struct GraphStatsResponse {
    pub cyberlinks: u64,
    pub particles: u64,
}

#[cw_serde]
pub struct ThoughtResponse {
    pub thought: Thought,
}

#[cw_serde]
pub struct ThoughtStatsResponse {
    pub thought_stats: ThoughtStats,
}

#[cw_serde]
pub struct ThoughtsFeesResponse {
    pub fees: Vec<Coin>,
}

#[cw_serde]
pub struct RoutesResponse {
    pub routes: Vec<Route>,
}

#[cw_serde]
pub struct RoutedEnergyResponse {
    pub value: Vec<Coin>,
}

#[cw_serde]
pub struct RouteResponse {
    pub route: Route,
}

#[cw_serde]
pub struct BandwidthPriceResponse {
    pub price: String,
}

#[cw_serde]
pub struct BandwidthLoadResponse {
    pub load: Decimal,
}

#[cw_serde]
pub struct TotalBandwidthResponse {
    pub total_bandwidth: u64,
}

#[cw_serde]
pub struct NeuronBandwidthResponse {
    pub neuron_bandwidth: NeuronBandwidth,
}

#[cw_serde]
pub struct PoolParamsResponse {
    pub type_id: u32,
    pub reserve_coin_denoms: Vec<String>,
    pub reserve_account_address: String,
    pub pool_coin_denom: String,
}

#[cw_serde]
pub struct PoolLiquidityResponse {
    pub liquidity: Vec<Coin>,
}

#[cw_serde]
pub struct PoolSupplyResponse {
    pub supply: Coin,
}

#[cw_serde]
pub struct PoolPriceResponse {
    pub price: Decimal,
}

#[cw_serde]
pub struct PoolAddressResponse {
    pub address: String,
}
