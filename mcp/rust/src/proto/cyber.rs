/// Bostrom-specific protobuf message types.
/// Hand-written to avoid pulling the full go-cyber proto tree.

// ── cyber.graph.v1beta1 ──

#[derive(Clone, prost::Message)]
pub struct Link {
    #[prost(string, tag = "1")]
    pub from: String,
    #[prost(string, tag = "2")]
    pub to: String,
}

#[derive(Clone, prost::Message)]
pub struct MsgCyberlink {
    #[prost(string, tag = "1")]
    pub neuron: String,
    #[prost(message, repeated, tag = "2")]
    pub links: Vec<Link>,
}

// ── cyber.resources.v1beta1 ──

#[derive(Clone, prost::Message)]
pub struct MsgInvestmint {
    #[prost(string, tag = "1")]
    pub neuron: String,
    #[prost(message, optional, tag = "2")]
    pub amount: Option<Coin>,
    #[prost(string, tag = "3")]
    pub resource: String,
    #[prost(uint64, tag = "4")]
    pub length: u64,
}

// ── cyber.grid.v1beta1 ──

#[derive(Clone, prost::Message)]
pub struct MsgCreateRoute {
    #[prost(string, tag = "1")]
    pub source: String,
    #[prost(string, tag = "2")]
    pub destination: String,
    #[prost(string, tag = "3")]
    pub name: String,
}

#[derive(Clone, prost::Message)]
pub struct MsgEditRoute {
    #[prost(string, tag = "1")]
    pub source: String,
    #[prost(string, tag = "2")]
    pub destination: String,
    #[prost(message, optional, tag = "3")]
    pub value: Option<Coin>,
}

#[derive(Clone, prost::Message)]
pub struct MsgDeleteRoute {
    #[prost(string, tag = "1")]
    pub source: String,
    #[prost(string, tag = "2")]
    pub destination: String,
}

// ── cyber.liquidity.v1beta1 ──

#[derive(Clone, prost::Message)]
pub struct MsgCreatePool {
    #[prost(string, tag = "1")]
    pub pool_creator_address: String,
    #[prost(uint32, tag = "2")]
    pub pool_type_id: u32,
    #[prost(message, repeated, tag = "3")]
    pub deposit_coins: Vec<Coin>,
}

#[derive(Clone, prost::Message)]
pub struct MsgDepositWithinBatch {
    #[prost(string, tag = "1")]
    pub depositor_address: String,
    #[prost(uint64, tag = "2")]
    pub pool_id: u64,
    #[prost(message, repeated, tag = "3")]
    pub deposit_coins: Vec<Coin>,
}

#[derive(Clone, prost::Message)]
pub struct MsgWithdrawWithinBatch {
    #[prost(string, tag = "1")]
    pub withdrawer_address: String,
    #[prost(uint64, tag = "2")]
    pub pool_id: u64,
    #[prost(message, optional, tag = "3")]
    pub pool_coin: Option<Coin>,
}

#[derive(Clone, prost::Message)]
pub struct MsgSwapWithinBatch {
    #[prost(string, tag = "1")]
    pub swap_requester_address: String,
    #[prost(uint64, tag = "2")]
    pub pool_id: u64,
    #[prost(uint32, tag = "3")]
    pub swap_type_id: u32,
    #[prost(message, optional, tag = "4")]
    pub offer_coin: Option<Coin>,
    #[prost(string, tag = "5")]
    pub demand_coin_denom: String,
    #[prost(message, optional, tag = "6")]
    pub offer_coin_fee: Option<Coin>,
    #[prost(string, tag = "7")]
    pub order_price: String,
}

// ── osmosis.tokenfactory.v1beta1 ──

#[derive(Clone, prost::Message)]
pub struct MsgCreateDenom {
    #[prost(string, tag = "1")]
    pub sender: String,
    #[prost(string, tag = "2")]
    pub subdenom: String,
}

#[derive(Clone, prost::Message)]
pub struct MsgMint {
    #[prost(string, tag = "1")]
    pub sender: String,
    #[prost(message, optional, tag = "2")]
    pub amount: Option<Coin>,
    #[prost(string, tag = "3")]
    pub mint_to_address: String,
}

#[derive(Clone, prost::Message)]
pub struct MsgBurn {
    #[prost(string, tag = "1")]
    pub sender: String,
    #[prost(message, optional, tag = "2")]
    pub amount: Option<Coin>,
    #[prost(string, tag = "3")]
    pub burn_from_address: String,
}

#[derive(Clone, prost::Message)]
pub struct MsgChangeAdmin {
    #[prost(string, tag = "1")]
    pub sender: String,
    #[prost(string, tag = "2")]
    pub denom: String,
    #[prost(string, tag = "3")]
    pub new_admin: String,
}

#[derive(Clone, prost::Message)]
pub struct DenomUnit {
    #[prost(string, tag = "1")]
    pub denom: String,
    #[prost(uint32, tag = "2")]
    pub exponent: u32,
    #[prost(string, repeated, tag = "3")]
    pub aliases: Vec<String>,
}

#[derive(Clone, prost::Message)]
pub struct Metadata {
    #[prost(string, tag = "1")]
    pub description: String,
    #[prost(message, repeated, tag = "2")]
    pub denom_units: Vec<DenomUnit>,
    #[prost(string, tag = "3")]
    pub base: String,
    #[prost(string, tag = "4")]
    pub display: String,
    #[prost(string, tag = "5")]
    pub name: String,
    #[prost(string, tag = "6")]
    pub symbol: String,
}

#[derive(Clone, prost::Message)]
pub struct MsgSetDenomMetadata {
    #[prost(string, tag = "1")]
    pub sender: String,
    #[prost(message, optional, tag = "2")]
    pub metadata: Option<Metadata>,
}

// ── IBC types ──

#[derive(Clone, prost::Message)]
pub struct Height {
    #[prost(uint64, tag = "1")]
    pub revision_number: u64,
    #[prost(uint64, tag = "2")]
    pub revision_height: u64,
}

#[derive(Clone, prost::Message)]
pub struct MsgTransfer {
    #[prost(string, tag = "1")]
    pub source_port: String,
    #[prost(string, tag = "2")]
    pub source_channel: String,
    #[prost(message, optional, tag = "3")]
    pub token: Option<Coin>,
    #[prost(string, tag = "4")]
    pub sender: String,
    #[prost(string, tag = "5")]
    pub receiver: String,
    #[prost(message, optional, tag = "6")]
    pub timeout_height: Option<Height>,
    #[prost(uint64, tag = "7")]
    pub timeout_timestamp: u64,
    #[prost(string, tag = "8")]
    pub memo: String,
}

// ── Shared Coin type (matches cosmos.base.v1beta1.Coin) ──

#[derive(Clone, prost::Message)]
pub struct Coin {
    #[prost(string, tag = "1")]
    pub denom: String,
    #[prost(string, tag = "2")]
    pub amount: String,
}
