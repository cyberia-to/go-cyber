mod clients;
mod proto;
mod server;
mod tools;
mod util;

use anyhow::Result;
use rmcp::ServiceExt;
use rmcp::transport::io::stdio;
use tracing_subscriber::{EnvFilter, fmt};

#[tokio::main]
async fn main() -> Result<()> {
    fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .with_writer(std::io::stderr)
        .init();

    tracing::info!("bostrom-mcp starting");

    let server = server::BostromMcp::from_env().await?;
    let service = server.serve(stdio()).await
        .map_err(|e| anyhow::anyhow!("{e:?}"))?;
    service.waiting().await
        .map_err(|e| anyhow::anyhow!("{e:?}"))?;

    Ok(())
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_address_derivation() {
        use sha2::{Sha256, Digest};
        use ripemd::{Ripemd160};
        use bip32::secp256k1::ecdsa::SigningKey;

        let mn: bip39::Mnemonic = "grocery century album snap wool crumble wonder predict enforce shoe ahead spice talent file educate foot suspect draw pluck farm lecture behind tool cave".parse().unwrap();
        let seed = mn.to_seed("");

        let child = bip32::XPrv::derive_from_path(seed, &"m/44'/118'/0'/0/0".parse().unwrap()).unwrap();
        let sk: SigningKey = child.into();
        let vk = sk.verifying_key();
        let pub_bytes = vk.to_encoded_point(true);
        let pub_bytes = pub_bytes.as_bytes();

        let hash = Sha256::digest(pub_bytes);
        let hash20 = Ripemd160::digest(&hash);
        let addr = bech32::encode::<bech32::Bech32>(bech32::Hrp::parse("bostrom").unwrap(), &hash20).unwrap();

        assert_eq!(addr, "bostrom1kgkwc3t3x8ck0pzut5myeq7a8j4zp2smqgwrjd");
    }
}
