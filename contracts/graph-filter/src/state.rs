// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub admins: Vec<Addr>,
}

impl Config {
    pub fn is_admin(&self, addr: impl AsRef<str>) -> bool {
        let addr = addr.as_ref();
        self.admins.iter().any(|a| a.as_ref() == addr)
    }

    pub fn can_modify(&self, addr: &str) -> bool {
        self.is_admin(addr)
    }
}

pub const CONFIG_KEY: &str = "config";
pub const CONFIG: Item<Config> = Item::new(CONFIG_KEY);

pub const PARTICLES_KEY: &str = "particles";
pub const PARTICLES: Map<u32, String> = Map::new(PARTICLES_KEY);

pub const HEAD_ID_KEY: &str = "id";
pub const HEAD_ID: Item<u32> = Item::new(HEAD_ID_KEY);

pub const TOTAL_PARTICLES_KEY: &str = "total_particles";
pub const TOTAL_PARTICLES: Item<u32> = Item::new(TOTAL_PARTICLES_KEY);
