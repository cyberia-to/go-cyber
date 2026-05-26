// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cid::multihash::{Code, MultihashDigest};
use cid::{Cid, Version};
use std::ops::Add;
use std::str::FromStr;
use thiserror::Error;

pub fn prepare_particle(input: String) -> Result<Cid, ParticleError> {
    if input.is_empty() || input.len() > 255 {
        return Err(ParticleError::InvalidParticleData {});
    }

    // unixfs/dagnode/proto shortcut
    // wrap input bytes as a dagnode unixfs file
    let length: u8 = input.len() as u8;
    let mut raw: Vec<u8> = vec![10, length.add(6) as u8, 8, 2, 18, length];
    raw.append(&mut input.as_bytes().to_vec());
    raw.append(&mut vec![24, length]);

    let h = Code::Sha2_256.digest(&raw.as_slice());
    let particle = Cid::new_v0(h).unwrap();

    Ok(particle)
}

pub fn check_particle(input: String) -> Result<Cid, ParticleError> {
    let particle: Cid;
    let try_particle = Cid::from_str(&input.clone());
    if try_particle.is_ok() {
        particle = try_particle.unwrap();
        if particle.version() != Version::V0 {
            return Err(ParticleError::InvalidParticleVersion {});
        }
    } else {
        return Err(ParticleError::InvalidParticle {});
    }

    Ok(particle)
}

#[derive(Error, Debug, PartialEq)]
pub enum ParticleError {
    #[error("Invalid data for the particle")]
    InvalidParticleData {},

    #[error("Invalid particle")]
    InvalidParticle {},

    #[error("Invalid particle version")]
    InvalidParticleVersion {},
}
