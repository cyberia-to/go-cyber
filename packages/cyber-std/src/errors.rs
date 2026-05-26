// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_std::StdError;
use serde_json_wasm;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum CyberError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("{0}")]
    Fmt(#[from] std::fmt::Error),

    #[error("{0}")]
    FromUTF8Error(#[from] std::string::FromUtf8Error),

    // #[error("Bech32 error")]
    // Bech32(#[from] bech32::Error),
    #[error("Prost protobuf error")]
    ProstProtobuf(#[from] prost::DecodeError),

    #[error("Serde JSON (Wasm) error")]
    SerdeJSONWasm(String),
    // ParticleError(#[from] ParticleError),
}

impl From<serde_json_wasm::de::Error> for CyberError {
    fn from(e: serde_json_wasm::de::Error) -> Self {
        CyberError::SerdeJSONWasm(e.to_string())
    }
}
