use anyhow::{Context, Result};
use base64::{Engine, engine::general_purpose::STANDARD as BASE64};
use serde::de::DeserializeOwned;
use serde_json::Value;
use std::time::Duration;

#[derive(Clone)]
pub struct LcdClient {
    client: reqwest::Client,
    pub(crate) base_url: String,
}

impl LcdClient {
    pub fn new(base_url: &str) -> Self {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .expect("failed to build HTTP client");
        Self {
            client,
            base_url: base_url.trim_end_matches('/').to_string(),
        }
    }

    /// Generic REST GET, deserializing the full response body.
    pub async fn get<T: DeserializeOwned>(&self, path: &str) -> Result<T> {
        let url = format!("{}{}", self.base_url, path);
        let resp = self
            .client
            .get(&url)
            .send()
            .await
            .with_context(|| format!("LCD GET {url}"))?;
        let status = resp.status();
        if !status.is_success() {
            let body = resp.text().await.unwrap_or_default();
            anyhow::bail!("LCD GET {url} returned {status}: {body}");
        }
        resp.json::<T>()
            .await
            .with_context(|| format!("LCD GET {url} json parse"))
    }

    /// GET returning raw serde_json::Value.
    pub async fn get_json(&self, path: &str) -> Result<Value> {
        self.get::<Value>(path).await
    }

    /// CosmWasm smart query: base64-encode the JSON query, GET the endpoint, return `.data`.
    pub async fn smart_query(&self, contract: &str, query: &Value) -> Result<Value> {
        let encoded = BASE64.encode(serde_json::to_string(query)?);
        let path = format!("/cosmwasm/wasm/v1/contract/{contract}/smart/{encoded}");
        let resp: Value = self.get(&path).await?;
        Ok(resp.get("data").cloned().unwrap_or(resp))
    }
}
