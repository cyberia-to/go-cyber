use anyhow::{Context, Result};
use serde_json::Value;
use std::time::Duration;

#[derive(Clone)]
pub struct RpcClient {
    client: reqwest::Client,
    base_url: String,
}

impl RpcClient {
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

    /// GET an RPC endpoint, returning `.result` from the JSON response.
    pub async fn get(&self, path: &str) -> Result<Value> {
        let url = format!("{}{}", self.base_url, path);
        let resp = self
            .client
            .get(&url)
            .send()
            .await
            .with_context(|| format!("RPC GET {url}"))?;
        let status = resp.status();
        if !status.is_success() {
            let body = resp.text().await.unwrap_or_default();
            anyhow::bail!("RPC GET {url} returned {status}: {body}");
        }
        let json: Value = resp
            .json()
            .await
            .with_context(|| format!("RPC GET {url} json parse"))?;
        Ok(json.get("result").cloned().unwrap_or(json))
    }
}
