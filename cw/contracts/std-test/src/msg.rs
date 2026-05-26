// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Coin, Decimal, Uint128};

#[allow(unused_imports)]
use crate::state::State;
#[allow(unused_imports)]
use cyber_std::query_res::{
    BandwidthLoadResponse, BandwidthPriceResponse, GraphStatsResponse, NeuronBandwidthResponse,
    ParticleRankResponse, PoolAddressResponse, PoolLiquidityResponse, PoolParamsResponse,
    PoolPriceResponse, PoolSupplyResponse, RouteResponse, RoutedEnergyResponse, RoutesResponse,
    ThoughtResponse, ThoughtStatsResponse, ThoughtsFeesResponse, TotalBandwidthResponse,
};
use cyber_std::tokenfactory::query::{
    AdminResponse, DenomsByCreatorResponse, FullDenomResponse, MetadataResponse, ParamsResponse,
};
use cyber_std::tokenfactory::types::Metadata;
use cyber_std::types::{Link, Load, Trigger};

#[cw_serde]
pub struct InstantiateMsg {
    pub creator: String,
    pub beats: u64,
}

#[cw_serde]
pub enum SudoMsg {
    Heartbeat {
        beats: u64,
    },
    Cyberlink {
        links: Vec<Link>,
    },
    Release {},
    CpuLoop {},
    StorageLoop {},
    MemoryLoop {},
    Panic {},
    TransferFunds {
        recipient: String,
        amount: Vec<Coin>,
    },
}

#[cw_serde]
pub enum ExecuteMsg {
    Cyberlink {
        links: Vec<Link>,
    },
    Stake {
        validator: String,
        amount: Coin,
    },
    Unstake {
        validator: String,
        amount: Coin,
    },
    Investmint {
        amount: Coin,
        resource: String,
        length: u64,
    },
    CreateEnergyRoute {
        destination: String,
        name: String,
    },
    EditEnergyRoute {
        destination: String,
        value: Coin,
    },
    EditEnergyRouteName {
        destination: String,
        name: String,
    },
    DeleteEnergyRoute {
        destination: String,
    },
    CreateThought {
        trigger: Trigger,
        load: Load,
        name: String,
        particle: String,
    },
    ForgetThought {
        name: String,
    },
    ChangeThoughtInput {
        name: String,
        input: String,
    },
    ChangeThoughtPeriod {
        name: String,
        period: u64,
    },
    ChangeThoughtBlock {
        name: String,
        block: u64,
    },
    CreatePool {
        pool_type_id: u32,
        deposit_coins: Vec<Coin>,
    },
    DepositWithinBatch {
        pool_id: u64,
        deposit_coins: Vec<Coin>,
    },
    WithdrawWithinBatch {
        pool_id: u64,
        pool_coin: Coin,
    },
    SwapWithinBatch {
        pool_id: u64,
        swap_type_id: u32,
        offer_coin: Coin,
        demand_coin_denom: String,
        offer_coin_fee: Coin,
        order_price: Decimal,
    },
    CreateToken {
        subdenom: String,
        metadata: Option<Metadata>,
    },
    ChangeTokenAdmin {
        denom: String,
        new_admin_address: String,
    },
    MintTokens {
        denom: String,
        amount: Uint128,
        mint_to_address: String,
    },
    BurnTokens {
        denom: String,
        amount: Uint128,
        burn_from_address: String,
    },
    ForceTokenTransfer {
        denom: String,
        amount: Uint128,
        from_address: String,
        to_address: String,
    },
    SetTokenMetadata {
        denom: String,
        metadata: Metadata,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ParticleRankResponse)]
    ParticleRank { particle: String },
    #[returns(GraphStatsResponse)]
    GraphStats {},
    #[returns(State)]
    State {},
    #[returns(ThoughtResponse)]
    Thought { program: String, name: String },
    #[returns(ThoughtStatsResponse)]
    ThoughtStats { program: String, name: String },
    #[returns(ThoughtsFeesResponse)]
    ThoughtsFees {},
    #[returns(RoutesResponse)]
    SourceRoutes { source: String },
    #[returns(RoutedEnergyResponse)]
    SourceRoutedEnergy { source: String },
    #[returns(RoutedEnergyResponse)]
    DestinationRoutedEnergy { destination: String },
    #[returns(RouteResponse)]
    Route { source: String, destination: String },
    #[returns(BandwidthPriceResponse)]
    BandwidthPrice {},
    #[returns(BandwidthLoadResponse)]
    BandwidthLoad {},
    #[returns(TotalBandwidthResponse)]
    TotalBandwidth {},
    #[returns(NeuronBandwidthResponse)]
    NeuronBandwidth { neuron: String },
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
    #[returns(FullDenomResponse)]
    FullDenom {
        creator_addr: String,
        subdenom: String,
    },
    #[returns(MetadataResponse)]
    DenomMetadata { denom: String },
    #[returns(AdminResponse)]
    DenomAdmin { denom: String },
    #[returns(DenomsByCreatorResponse)]
    DenomsByCreator { creator: String },
    #[returns(ParamsResponse)]
    DenomCreationFee {},
}

#[cw_serde]
pub struct MigrateMsg {}
