// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_std::{QuerierWrapper, QueryRequest, StdResult};

use crate::query::CyberQuery;
use crate::query_res::{
    BandwidthLoadResponse, BandwidthPriceResponse, GraphStatsResponse, NeuronBandwidthResponse,
    ParticleRankResponse, PoolAddressResponse, PoolLiquidityResponse, PoolParamsResponse,
    PoolPriceResponse, PoolSupplyResponse, RouteResponse, RoutedEnergyResponse, RoutesResponse,
    ThoughtResponse, ThoughtStatsResponse, ThoughtsFeesResponse, TotalBandwidthResponse,
};
use crate::tokenfactory::query::{
    AdminResponse, DenomsByCreatorResponse, FullDenomResponse, MetadataResponse, ParamsResponse,
};

pub struct CyberQuerier<'a> {
    querier: &'a QuerierWrapper<'a, CyberQuery>,
}

impl<'a> CyberQuerier<'a> {
    pub fn new(querier: &'a QuerierWrapper<'a, CyberQuery>) -> Self {
        CyberQuerier { querier }
    }

    pub fn query_particle_rank<T: Into<String>>(
        &self,
        particle: T,
    ) -> StdResult<ParticleRankResponse> {
        let request = QueryRequest::Custom(CyberQuery::particle_rank(particle.into()));
        let res: ParticleRankResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_graph_stats(&self) -> StdResult<GraphStatsResponse> {
        let request = QueryRequest::Custom(CyberQuery::graph_stats());
        let res: GraphStatsResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_thought<T: Into<String>>(
        &self,
        program: T,
        name: T,
    ) -> StdResult<ThoughtResponse> {
        let request = QueryRequest::Custom(CyberQuery::thought(program.into(), name.into()));
        let res: ThoughtResponse = self.querier.query(&request.into())?;
        Ok(res)
    }

    pub fn query_thought_stats<T: Into<String>>(
        &self,
        program: T,
        name: T,
    ) -> StdResult<ThoughtStatsResponse> {
        let request = QueryRequest::Custom(CyberQuery::thought_stats(program.into(), name.into()));
        let res: ThoughtStatsResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_thoughts_fees(&self) -> StdResult<ThoughtsFeesResponse> {
        let request = QueryRequest::Custom(CyberQuery::thoughts_fees());
        let res: ThoughtsFeesResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_source_routes<T: Into<String>>(&self, source: T) -> StdResult<RoutesResponse> {
        let request = QueryRequest::Custom(CyberQuery::source_routes(source.into()));
        let res: RoutesResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_source_routed_energy<T: Into<String>>(
        &self,
        source: T,
    ) -> StdResult<RoutedEnergyResponse> {
        let request = QueryRequest::Custom(CyberQuery::source_routed_energy(source.into()));
        let res: RoutedEnergyResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_destination_routed_energy<T: Into<String>>(
        &self,
        destination: T,
    ) -> StdResult<RoutedEnergyResponse> {
        let request =
            QueryRequest::Custom(CyberQuery::destination_routed_energy(destination.into()));
        let res: RoutedEnergyResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_route<T: Into<String>>(
        &self,
        source: T,
        destination: T,
    ) -> StdResult<RouteResponse> {
        let request = QueryRequest::Custom(CyberQuery::route(source.into(), destination.into()));
        let res: RouteResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_bandwidth_price(&self) -> StdResult<BandwidthPriceResponse> {
        let request = QueryRequest::Custom(CyberQuery::bandwidth_price());
        let res: BandwidthPriceResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_bandwidth_load(&self) -> StdResult<BandwidthLoadResponse> {
        let request = QueryRequest::Custom(CyberQuery::bandwidth_load());
        let res: BandwidthLoadResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_total_bandwidth(&self) -> StdResult<TotalBandwidthResponse> {
        let request = QueryRequest::Custom(CyberQuery::bandwidth_total());
        let res: TotalBandwidthResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_neuron_bandwidth<T: Into<String>>(
        &self,
        address: T,
    ) -> StdResult<NeuronBandwidthResponse> {
        let request = QueryRequest::Custom(CyberQuery::neuron_bandwidth(address.into()));
        let res: NeuronBandwidthResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_pool_params(&self, pool_id: u64) -> StdResult<PoolParamsResponse> {
        let request = QueryRequest::Custom(CyberQuery::pool_params(pool_id.into()));
        let res: PoolParamsResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_pool_liquidity(&self, pool_id: u64) -> StdResult<PoolLiquidityResponse> {
        let request = QueryRequest::Custom(CyberQuery::pool_liquidity(pool_id.into()));
        let res: PoolLiquidityResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_pool_supply(&self, pool_id: u64) -> StdResult<PoolSupplyResponse> {
        let request = QueryRequest::Custom(CyberQuery::pool_supply(pool_id.into()));
        let res: PoolSupplyResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_pool_price(&self, pool_id: u64) -> StdResult<PoolPriceResponse> {
        let request = QueryRequest::Custom(CyberQuery::pool_price(pool_id.into()));
        let res: PoolPriceResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_pool_address(&self, pool_id: u64) -> StdResult<PoolAddressResponse> {
        let request = QueryRequest::Custom(CyberQuery::pool_address(pool_id.into()));
        let res: PoolAddressResponse = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_full_denom(
        &self,
        creator_addr: String,
        subdenom: String,
    ) -> StdResult<FullDenomResponse> {
        let request =
            QueryRequest::Custom(CyberQuery::full_denom(creator_addr.into(), subdenom.into()));
        let res = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_denom_metadata(&self, denom: String) -> StdResult<MetadataResponse> {
        let request = QueryRequest::Custom(CyberQuery::denom_metadata(denom.into()));
        let res = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_denom_admin(&self, denom: String) -> StdResult<AdminResponse> {
        let request = QueryRequest::Custom(CyberQuery::denom_admin(denom.into()));
        let res = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_denoms_by_creator(&self, denom: String) -> StdResult<DenomsByCreatorResponse> {
        let request = QueryRequest::Custom(CyberQuery::denoms_by_creator(denom.into()));
        let res = self.querier.query(&request.into())?;

        Ok(res)
    }

    pub fn query_denom_creation_fee(&self) -> StdResult<ParamsResponse> {
        let request = QueryRequest::Custom(CyberQuery::denom_creation_fee());
        let res = self.querier.query(&request.into())?;

        Ok(res)
    }
}
