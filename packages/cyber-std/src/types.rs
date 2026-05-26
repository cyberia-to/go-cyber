// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_schema::cw_serde;
use cosmwasm_std::Coin;

#[cw_serde]
pub struct Link {
    pub from: String,
    pub to: String,
}

#[cw_serde]
pub struct Trigger {
    pub period: Option<u64>,
    pub block: Option<u64>,
}

#[cw_serde]
pub struct Load {
    pub input: String,
    pub gas_price: Coin,
}

#[cw_serde]
pub struct Route {
    pub source: String,
    pub destination: String,
    pub name: String,
    pub value: Vec<Coin>,
}

#[cw_serde]
pub struct NeuronBandwidth {
    pub neuron: String,
    pub remained_value: Option<u64>,
    pub last_updated_block: u64,
    pub max_value: Option<u64>,
}

#[cw_serde]
pub struct Thought {
    pub program: String,
    pub trigger: Trigger,
    pub load: Load,
    pub name: String,
    pub particle: String,
}
#[cw_serde]
pub struct ThoughtStats {
    pub program: String,
    pub name: String,
    pub calls: u64,
    pub fees: u64,
    pub gas: u64,
    pub last_block: u64,
}
