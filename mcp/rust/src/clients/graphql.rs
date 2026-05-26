use anyhow::{Context, Result};
use serde_json::Value;
use std::time::Duration;

#[derive(Clone)]
pub struct GraphqlClient {
    client: reqwest::Client,
    url: String,
}

impl GraphqlClient {
    pub fn new(url: &str) -> Self {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .expect("failed to build HTTP client");
        Self {
            client,
            url: url.to_string(),
        }
    }

    /// Execute a GraphQL query, returning `.data` from the response.
    pub async fn query(&self, query: &str, variables: Option<&Value>) -> Result<Value> {
        let body = serde_json::json!({
            "query": query,
            "variables": variables.unwrap_or(&Value::Null),
        });
        let resp = self
            .client
            .post(&self.url)
            .json(&body)
            .send()
            .await
            .with_context(|| "GraphQL POST")?;
        let status = resp.status();
        if !status.is_success() {
            let body = resp.text().await.unwrap_or_default();
            anyhow::bail!("GraphQL returned {status}: {body}");
        }
        let json: Value = resp.json().await.context("GraphQL json parse")?;
        if let Some(errors) = json.get("errors") {
            if errors.is_array() && !errors.as_array().unwrap().is_empty() {
                anyhow::bail!("GraphQL errors: {errors}");
            }
        }
        Ok(json.get("data").cloned().unwrap_or(json))
    }
}
