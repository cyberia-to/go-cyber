// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_schema::cw_serde;
use cosmwasm_std::Coin;

/// This maps to cosmos.bank.v1beta1.Metadata protobuf struct
#[cw_serde]
pub struct Metadata {
    pub description: Option<String>,
    /// denom_units represents the list of DenomUnit's for a given coin
    pub denom_units: Vec<DenomUnit>,
    /// base represents the base denom (should be the DenomUnit with exponent = 0).
    pub base: Option<String>,
    /// display indicates the suggested denom that should be displayed in clients.
    pub display: Option<String>,
    /// name defines the name of the token (eg: Cosmos Atom)
    pub name: Option<String>,
    /// symbol is the token symbol usually shown on exchanges (eg: ATOM). This can
    /// be the same as the display.
    pub symbol: Option<String>,
}

/// This maps to cosmos.bank.v1beta1.DenomUnit protobuf struct
#[cw_serde]
pub struct DenomUnit {
    /// denom represents the string name of the given denom unit (e.g uatom).
    pub denom: String,
    /// exponent represents power of 10 exponent that one must
    /// raise the base_denom to in order to equal the given DenomUnit's denom
    /// 1 denom = 1^exponent base_denom
    /// (e.g. with a base_denom of uatom, one can create a DenomUnit of 'atom' with
    /// exponent = 6, thus: 1 atom = 10^6 uatom).
    pub exponent: u32,
    /// aliases is a list of string aliases for the given denom
    pub aliases: Vec<String>,
}

/// This maps to osmosis.tokenfactory.v1beta1.Params protobuf struct
#[cw_serde]
pub struct Params {
    /// TODO: verify semantics - does it charge all of these or one of these?
    pub denom_creation_fee: Vec<Coin>,
}
