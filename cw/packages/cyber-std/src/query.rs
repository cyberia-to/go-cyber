// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
#[allow(unused_imports)]
use crate::query_res::*;
use crate::tokenfactory::query::TokenFactoryQuery;
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{CustomQuery, QueryRequest};

#[cw_serde]
#[derive(QueryResponses)]
#[query_responses(nested)]
#[serde(untagged)]
pub enum CyberQuery {
    Rank(RankQuery),
    Graph(GraphQuery),
    DMN(DMNQuery),
    Grid(GridQuery),
    Bandwidth(BandwidthQuery),
    Liquidity(LiquidityQuery),
    TokenFactory(TokenFactoryQuery),
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum RankQuery {
    #[returns(ParticleRankResponse)]
    ParticleRank { particle: String },
}
#[cw_serde]
#[derive(QueryResponses)]
pub enum GraphQuery {
    #[returns(GraphStatsResponse)]
    GraphStats {},
}
#[cw_serde]
#[derive(QueryResponses)]
pub enum DMNQuery {
    #[returns(ThoughtResponse)]
    Thought { program: String, name: String },
    #[returns(ThoughtStatsResponse)]
    ThoughtStats { program: String, name: String },
    #[returns(ThoughtsFeesResponse)]
    ThoughtsFees {},
}
#[cw_serde]
#[derive(QueryResponses)]
pub enum GridQuery {
    #[returns(RoutesResponse)]
    SourceRoutes { source: String },
    #[returns(RoutedEnergyResponse)]
    SourceRoutedEnergy { source: String },
    #[returns(RoutedEnergyResponse)]
    DestinationRoutedEnergy { destination: String },
    #[returns(RouteResponse)]
    Route { source: String, destination: String },
}
#[cw_serde]
#[derive(QueryResponses)]
pub enum BandwidthQuery {
    #[returns(BandwidthPriceResponse)]
    BandwidthPrice {},
    #[returns(BandwidthLoadResponse)]
    BandwidthLoad {},
    #[returns(TotalBandwidthResponse)]
    TotalBandwidth {},
    #[returns(NeuronBandwidthResponse)]
    NeuronBandwidth { neuron: String },
}
#[cw_serde]
#[derive(QueryResponses)]
pub enum LiquidityQuery {
    #[returns(PoolParamsResponse)]
    PoolParams { pool_id: u64 },
    #[returns(PoolLiquidityResponse)]
    PoolLiquidity { pool_id: u64 },
    #[returns(PoolSupplyResponse)]
    PoolSupply { pool_id: u64 },
    #[returns(PoolPriceResponse)]
    PoolPrice { pool_id: u64 },
    #[returns(PoolAddressResponse)]
    PoolAddress { pool_id: u64 },
}

impl CustomQuery for CyberQuery {}

impl From<RankQuery> for QueryRequest<CyberQuery> {
    fn from(msg: RankQuery) -> Self {
        QueryRequest::Custom(CyberQuery::Rank(msg))
    }
}

impl From<GraphQuery> for QueryRequest<CyberQuery> {
    fn from(msg: GraphQuery) -> Self {
        QueryRequest::Custom(CyberQuery::Graph(msg))
    }
}

impl From<DMNQuery> for QueryRequest<CyberQuery> {
    fn from(msg: DMNQuery) -> Self {
        QueryRequest::Custom(CyberQuery::DMN(msg))
    }
}

impl From<GridQuery> for QueryRequest<CyberQuery> {
    fn from(msg: GridQuery) -> Self {
        QueryRequest::Custom(CyberQuery::Grid(msg))
    }
}

impl From<BandwidthQuery> for QueryRequest<CyberQuery> {
    fn from(msg: BandwidthQuery) -> Self {
        QueryRequest::Custom(CyberQuery::Bandwidth(msg))
    }
}

impl From<LiquidityQuery> for QueryRequest<CyberQuery> {
    fn from(msg: LiquidityQuery) -> Self {
        QueryRequest::Custom(CyberQuery::Liquidity(msg))
    }
}
impl From<TokenFactoryQuery> for QueryRequest<CyberQuery> {
    fn from(msg: TokenFactoryQuery) -> Self {
        QueryRequest::Custom(CyberQuery::TokenFactory(msg))
    }
}

impl CyberQuery {
    pub fn particle_rank(particle: String) -> Self {
        Self::Rank(RankQuery::ParticleRank { particle })
    }

    pub fn graph_stats() -> Self {
        Self::Graph(GraphQuery::GraphStats {})
    }

    pub fn thought(program: String, name: String) -> Self {
        Self::DMN(DMNQuery::Thought { program, name })
    }

    pub fn thought_stats(program: String, name: String) -> Self {
        Self::DMN(DMNQuery::ThoughtStats { program, name })
    }

    pub fn thoughts_fees() -> Self {
        Self::DMN(DMNQuery::ThoughtsFees {})
    }

    pub fn source_routes(source: String) -> Self {
        Self::Grid(GridQuery::SourceRoutes { source })
    }

    pub fn source_routed_energy(source: String) -> Self {
        Self::Grid(GridQuery::SourceRoutedEnergy { source })
    }

    pub fn destination_routed_energy(destination: String) -> Self {
        Self::Grid(GridQuery::DestinationRoutedEnergy { destination })
    }

    pub fn route(source: String, destination: String) -> Self {
        Self::Grid(GridQuery::Route {
            source,
            destination,
        })
    }

    pub fn bandwidth_price() -> Self {
        Self::Bandwidth(BandwidthQuery::BandwidthPrice {})
    }

    pub fn bandwidth_load() -> Self {
        Self::Bandwidth(BandwidthQuery::BandwidthLoad {})
    }

    pub fn bandwidth_total() -> Self {
        Self::Bandwidth(BandwidthQuery::TotalBandwidth {})
    }

    pub fn neuron_bandwidth(neuron: String) -> Self {
        Self::Bandwidth(BandwidthQuery::NeuronBandwidth { neuron })
    }

    pub fn pool_params(pool_id: u64) -> Self {
        Self::Liquidity(LiquidityQuery::PoolParams { pool_id })
    }

    pub fn pool_liquidity(pool_id: u64) -> Self {
        Self::Liquidity(LiquidityQuery::PoolLiquidity { pool_id })
    }

    pub fn pool_supply(pool_id: u64) -> Self {
        Self::Liquidity(LiquidityQuery::PoolSupply { pool_id })
    }

    pub fn pool_price(pool_id: u64) -> Self {
        Self::Liquidity(LiquidityQuery::PoolPrice { pool_id })
    }

    pub fn pool_address(pool_id: u64) -> Self {
        Self::Liquidity(LiquidityQuery::PoolAddress { pool_id })
    }

    pub fn full_denom(creator_addr: String, subdenom: String) -> Self {
        Self::TokenFactory(TokenFactoryQuery::FullDenom {
            creator_addr,
            subdenom,
        })
    }

    pub fn denom_metadata(denom: String) -> Self {
        Self::TokenFactory(TokenFactoryQuery::Metadata { denom })
    }

    pub fn denom_admin(denom: String) -> Self {
        Self::TokenFactory(TokenFactoryQuery::Admin { denom })
    }

    pub fn denoms_by_creator(creator: String) -> Self {
        Self::TokenFactory(TokenFactoryQuery::DenomsByCreator { creator })
    }

    pub fn denom_creation_fee() -> Self {
        Self::TokenFactory(TokenFactoryQuery::Params {})
    }
}
