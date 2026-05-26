use anyhow::{Context, Result, bail};
use base64::{Engine, engine::general_purpose::STANDARD as BASE64};
use bip32::secp256k1::ecdsa::{SigningKey, signature::Signer};
use prost::Message;
use serde_json::Value;
use ripemd::Ripemd160;
use sha2::{Digest, Sha256};
use std::time::Duration;

use crate::clients::lcd::LcdClient;

// Use cosmos_sdk_proto's re-exported Any type
use cosmos_sdk_proto::Any;

#[derive(Clone)]
pub struct SigningClient {
    address: String,
    signing_key: SigningKey,
    pub_key_bytes: Vec<u8>,
    lcd: LcdClient,
    rpc_url: String,
    gas_price: f64,
    gas_multiplier: f64,
    min_gas: u64,
    max_send_amount: Option<u64>,
    http: reqwest::Client,
}

#[derive(serde::Serialize)]
pub struct TxResult {
    #[serde(rename = "txHash")]
    pub tx_hash: String,
    pub height: i64,
    #[serde(rename = "gasUsed")]
    pub gas_used: i64,
    #[serde(rename = "gasWanted")]
    pub gas_wanted: i64,
    pub code: i64,
}

impl SigningClient {
    pub fn from_mnemonic(
        mnemonic: &str,
        lcd: LcdClient,
        rpc_url: &str,
        gas_price: f64,
        gas_multiplier: f64,
        min_gas: u64,
        max_send_amount: Option<u64>,
    ) -> Result<Self> {
        let mn = bip39::Mnemonic::parse(mnemonic).context("invalid mnemonic")?;
        let seed = mn.to_seed("");
        let child = bip32::XPrv::derive_from_path(
            seed,
            &"m/44'/118'/0'/0/0".parse().unwrap(),
        )
        .context("HD derivation")?;
        let signing_key: SigningKey = child.into();
        let verifying_key = signing_key.verifying_key();
        let pub_key_bytes = verifying_key.to_encoded_point(true).as_bytes().to_vec();

        // bech32 address from ripemd160(sha256(pubkey))
        let hash = Sha256::digest(&pub_key_bytes);
        let hash20 = Ripemd160::digest(&hash);
        let address =
            bech32::encode::<bech32::Bech32>(bech32::Hrp::parse("bostrom").unwrap(), &hash20)
                .context("bech32 encode")?;

        let http = reqwest::Client::builder()
            .timeout(Duration::from_secs(30))
            .build()?;

        Ok(Self {
            address,
            signing_key,
            pub_key_bytes,
            lcd,
            rpc_url: rpc_url.to_string(),
            gas_price,
            gas_multiplier,
            min_gas,
            max_send_amount,
            http,
        })
    }

    pub fn address(&self) -> &str {
        &self.address
    }

    pub fn check_amount_limit(&self, amount: &str, denom: &str) -> Result<()> {
        if let Some(max) = self.max_send_amount {
            let val: u64 = amount.parse().unwrap_or(0);
            if val > max {
                bail!(
                    "Amount {amount} {denom} exceeds BOSTROM_MAX_SEND_AMOUNT ({max}). \
                     Increase the limit or reduce the amount."
                );
            }
        }
        Ok(())
    }

    async fn account_info(&self) -> Result<(u64, u64)> {
        let path = format!("/cosmos/auth/v1beta1/accounts/{}", self.address);
        let resp: Value = self.lcd.get_json(&path).await?;
        let account = &resp["account"];
        // Handle nested account types (BaseAccount, PeriodicVestingAccount, etc.)
        let base = if account["base_vesting_account"]["base_account"]["account_number"].is_string() {
            &account["base_vesting_account"]["base_account"]
        } else if account["base_account"]["account_number"].is_string() {
            &account["base_account"]
        } else {
            account
        };
        let account_number: u64 = base["account_number"]
            .as_str()
            .unwrap_or("0")
            .parse()
            .unwrap_or(0);
        let sequence: u64 = base["sequence"]
            .as_str()
            .unwrap_or("0")
            .parse()
            .unwrap_or(0);
        Ok((account_number, sequence))
    }

    async fn simulate(&self, tx_bytes: &[u8]) -> Result<u64> {
        let body = serde_json::json!({
            "tx_bytes": BASE64.encode(tx_bytes),
            "mode": "BROADCAST_MODE_UNSPECIFIED",
        });
        let url = format!("{}/cosmos/tx/v1beta1/simulate", self.lcd.base_url);
        let resp: Value = self
            .http
            .post(&url)
            .json(&body)
            .send()
            .await?
            .json()
            .await?;
        // Check for error response
        if let Some(code) = resp.get("code").and_then(|c| c.as_i64()) {
            if code != 0 {
                let msg = resp.get("message").and_then(|m| m.as_str()).unwrap_or("unknown");
                bail!("Simulate failed (code {code}): {msg}");
            }
        }
        let gas_used: u64 = resp["gas_info"]["gas_used"]
            .as_str()
            .unwrap_or("0")
            .parse()
            .unwrap_or(100_000);
        Ok(gas_used)
    }

    fn build_tx_body(&self, messages: &[prost::bytes::Bytes], memo: &str) -> Vec<u8> {
        let any_msgs: Vec<Any> = messages
            .iter()
            .map(|m| Any::decode(m.as_ref()).expect("invalid Any message"))
            .collect();

        let tx_body = cosmos_sdk_proto::cosmos::tx::v1beta1::TxBody {
            messages: any_msgs,
            memo: memo.to_string(),
            timeout_height: 0,
            extension_options: vec![],
            non_critical_extension_options: vec![],
        };
        tx_body.encode_to_vec()
    }

    fn build_auth_info(&self, sequence: u64, gas_limit: u64) -> Vec<u8> {
        let pub_key_any = Any {
            type_url: "/cosmos.crypto.secp256k1.PubKey".to_string(),
            value: {
                let pk = cosmos_sdk_proto::cosmos::crypto::secp256k1::PubKey {
                    key: self.pub_key_bytes.clone(),
                };
                pk.encode_to_vec()
            },
        };
        let signer_info = cosmos_sdk_proto::cosmos::tx::v1beta1::SignerInfo {
            public_key: Some(pub_key_any),
            mode_info: Some(cosmos_sdk_proto::cosmos::tx::v1beta1::ModeInfo {
                sum: Some(
                    cosmos_sdk_proto::cosmos::tx::v1beta1::mode_info::Sum::Single(
                        cosmos_sdk_proto::cosmos::tx::v1beta1::mode_info::Single {
                            mode: cosmos_sdk_proto::cosmos::tx::signing::v1beta1::SignMode::Direct
                                as i32,
                        },
                    ),
                ),
            }),
            sequence,
        };
        let fee_amount = ((gas_limit as f64) * self.gas_price).ceil() as u64;
        let fee = cosmos_sdk_proto::cosmos::tx::v1beta1::Fee {
            amount: vec![cosmos_sdk_proto::cosmos::base::v1beta1::Coin {
                denom: "boot".to_string(),
                amount: fee_amount.to_string(),
            }],
            gas_limit,
            payer: String::new(),
            granter: String::new(),
        };
        #[allow(deprecated)]
        let auth_info = cosmos_sdk_proto::cosmos::tx::v1beta1::AuthInfo {
            signer_infos: vec![signer_info],
            fee: Some(fee),
            tip: None,
        };
        auth_info.encode_to_vec()
    }

    pub async fn sign_and_broadcast(
        &self,
        messages: Vec<prost::bytes::Bytes>,
        memo: Option<&str>,
    ) -> Result<TxResult> {
        let memo = memo.unwrap_or("");
        let (account_number, sequence) = self.account_info().await?;

        let tx_body_bytes = self.build_tx_body(&messages, memo);

        // Build auth_info with 0 gas first for simulation
        let sim_auth_info = self.build_auth_info(sequence, 0);
        let sim_sign_doc = cosmos_sdk_proto::cosmos::tx::v1beta1::SignDoc {
            body_bytes: tx_body_bytes.clone(),
            auth_info_bytes: sim_auth_info.clone(),
            chain_id: "bostrom".to_string(),
            account_number,
        };
        let sim_sign_bytes = sim_sign_doc.encode_to_vec();
        let sim_signature: bip32::secp256k1::ecdsa::Signature =
            self.signing_key.sign(&sim_sign_bytes);
        let sim_sig_bytes: Vec<u8> = sim_signature.to_bytes().to_vec();
        let sim_tx = cosmos_sdk_proto::cosmos::tx::v1beta1::TxRaw {
            body_bytes: tx_body_bytes.clone(),
            auth_info_bytes: sim_auth_info,
            signatures: vec![sim_sig_bytes],
        };
        let sim_tx_bytes = sim_tx.encode_to_vec();

        // Simulate
        let gas_used = self.simulate(&sim_tx_bytes).await?;
        let gas_limit = ((gas_used as f64 * self.gas_multiplier).ceil() as u64).max(self.min_gas);

        // Build real auth_info with actual gas
        let auth_info_bytes = self.build_auth_info(sequence, gas_limit);

        // Sign
        let sign_doc = cosmos_sdk_proto::cosmos::tx::v1beta1::SignDoc {
            body_bytes: tx_body_bytes.clone(),
            auth_info_bytes: auth_info_bytes.clone(),
            chain_id: "bostrom".to_string(),
            account_number,
        };
        let sign_bytes = sign_doc.encode_to_vec();
        let signature: bip32::secp256k1::ecdsa::Signature = self.signing_key.sign(&sign_bytes);
        let sig_bytes: Vec<u8> = signature.to_bytes().to_vec();

        let tx_raw = cosmos_sdk_proto::cosmos::tx::v1beta1::TxRaw {
            body_bytes: tx_body_bytes,
            auth_info_bytes,
            signatures: vec![sig_bytes],
        };
        let tx_bytes = tx_raw.encode_to_vec();

        // Broadcast via RPC broadcast_tx_sync
        let url = format!("{}/broadcast_tx_sync?tx=0x{}", self.rpc_url, hex::encode(&tx_bytes));
        let resp: Value = self
            .http
            .get(&url)
            .send()
            .await
            .context("broadcast tx")?
            .json()
            .await?;

        let result = &resp["result"];
        if result.is_null() {
            let err = resp.get("error").and_then(|e| e.get("data")).and_then(|d| d.as_str())
                .or_else(|| resp.get("error").and_then(|e| e.get("message")).and_then(|m| m.as_str()))
                .unwrap_or("unknown error");
            bail!("Broadcast failed: {err}");
        }
        let code = result["code"].as_i64().unwrap_or(-1);
        if code != 0 {
            let log = result["log"].as_str().unwrap_or("unknown error");
            bail!("Transaction failed (code {code}): {log}");
        }
        let hash = result["hash"].as_str().unwrap_or("").to_string();

        Ok(TxResult {
            tx_hash: hash,
            height: 0,  // sync broadcast doesn't return height
            gas_used: gas_limit as i64,
            gas_wanted: gas_limit as i64,
            code,
        })
    }
}

/// Encode a protobuf message as an `Any`.
pub fn encode_any(type_url: &str, msg: &impl prost::Message) -> prost::bytes::Bytes {
    let any = Any {
        type_url: type_url.to_string(),
        value: msg.encode_to_vec(),
    };
    prost::bytes::Bytes::from(any.encode_to_vec())
}
