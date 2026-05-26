use anyhow::{Context, Result};
use std::time::Duration;

const MAX_SIZE: usize = 50 * 1024; // 50KB

#[derive(Clone)]
pub struct IpfsClient {
    client: reqwest::Client,
    gateway_url: String,
    api_url: String,
}

impl IpfsClient {
    pub fn new(gateway_url: &str, api_url: &str) -> Self {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(10))
            .build()
            .expect("failed to build HTTP client");
        Self {
            client,
            gateway_url: gateway_url.trim_end_matches('/').to_string(),
            api_url: api_url.trim_end_matches('/').to_string(),
        }
    }

    /// Fetch content from IPFS gateway, truncating at 50KB.
    pub async fn get(&self, cid: &str) -> Result<String> {
        let url = format!("{}/ipfs/{}", self.gateway_url, cid);
        let resp = self
            .client
            .get(&url)
            .send()
            .await
            .with_context(|| format!("IPFS GET {cid}"))?;
        if !resp.status().is_success() {
            anyhow::bail!("IPFS GET {cid} returned {}", resp.status());
        }
        let text = resp.text().await.context("IPFS read body")?;
        if text.len() > MAX_SIZE {
            Ok(format!(
                "{}...\n[truncated at 50KB, total {} bytes]",
                &text[..MAX_SIZE],
                text.len()
            ))
        } else {
            Ok(text)
        }
    }

    /// Add content to IPFS, returning the CID.
    pub async fn add(&self, content: &str) -> Result<String> {
        let is_kubo = self.api_url.contains("5001")
            || self.api_url.contains("localhost")
            || self.api_url.contains("127.0.0.1");

        let upload_client = reqwest::Client::builder()
            .timeout(Duration::from_secs(30))
            .build()?;

        let part = reqwest::multipart::Part::bytes(content.as_bytes().to_vec())
            .file_name("file")
            .mime_str("application/octet-stream")?;
        let form = reqwest::multipart::Form::new().part("file", part);

        if is_kubo {
            let url = format!("{}/api/v0/add?pin=true", self.api_url);
            let resp: serde_json::Value = upload_client
                .post(&url)
                .multipart(form)
                .send()
                .await
                .context("IPFS kubo add")?
                .json()
                .await?;
            resp.get("Hash")
                .and_then(|h| h.as_str())
                .map(|s| s.to_string())
                .ok_or_else(|| anyhow::anyhow!("IPFS kubo add: no Hash in response"))
        } else {
            let url = format!(
                "{}/add?cid-version=0&raw-leaves=false",
                self.api_url
            );
            let resp: serde_json::Value = upload_client
                .post(&url)
                .multipart(form)
                .send()
                .await
                .context("IPFS cluster add")?
                .json()
                .await?;
            resp.get("cid")
                .and_then(|c| c.as_str())
                .map(|s| s.to_string())
                .ok_or_else(|| anyhow::anyhow!("IPFS cluster add: no cid in response"))
        }
    }
}
