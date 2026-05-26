// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_std::StdError;
use cyber_std::particle::ParticleError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Cannot migrate from different contract type: {previous_contract}")]
    CannotMigrate { previous_contract: String },

    #[error("Cannot migrate from unsupported version: {previous_version}")]
    CannotMigrateVersion { previous_version: String },

    #[error("Semver parsing error: {0}")]
    SemVer(String),

    #[error("Invalid data for the particle")]
    InvalidParticleData {},

    #[error("Invalid particle")]
    InvalidParticle {},

    #[error("Invalid particle version")]
    InvalidParticleVersion {},
}

impl From<ParticleError> for ContractError {
    fn from(msg: ParticleError) -> ContractError {
        match msg {
            ParticleError::InvalidParticleData {} => ContractError::InvalidParticleData {},
            ParticleError::InvalidParticle {} => ContractError::InvalidParticle {},
            ParticleError::InvalidParticleVersion {} => ContractError::InvalidParticleVersion {},
        }
    }
}

impl From<semver::Error> for ContractError {
    fn from(err: semver::Error) -> Self {
        Self::SemVer(err.to_string())
    }
}
