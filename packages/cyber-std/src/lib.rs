// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
pub mod errors;
pub mod msg;
pub mod particle;
mod querier;
pub mod query;
pub mod query_res;
pub mod tokenfactory;
pub mod types;

use crate::errors::CyberError;
pub use msg::*;
pub use querier::CyberQuerier;
pub use query::*;

pub type Deps<'a> = cosmwasm_std::Deps<'a, CyberQuery>;
pub type DepsMut<'a> = cosmwasm_std::DepsMut<'a, CyberQuery>;
pub type Response = cosmwasm_std::Response<CyberMsg>;
pub type CyberResult = Result<CyberMsg, CyberError>;

// This export is added to all contracts that import this package, signifying that they require
// "cyber" support on the chain they run on.
#[no_mangle]
extern "C" fn requires_cyber() {}
