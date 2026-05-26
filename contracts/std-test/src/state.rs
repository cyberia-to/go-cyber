// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cw_storage_plus::Item;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub creator: String,
    pub beats: u64,
}

pub const STATE: Item<State> = Item::new("config");
