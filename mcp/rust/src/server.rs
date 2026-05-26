use rmcp::handler::server::router::tool::ToolRouter;
use rmcp::handler::server::wrapper::Parameters;
use rmcp::model::*;
use rmcp::{ServerHandler, tool, tool_handler, tool_router};

use crate::clients::graphql::GraphqlClient;
use crate::clients::ipfs::IpfsClient;
use crate::clients::lcd::LcdClient;
use crate::clients::rpc::RpcClient;
use crate::clients::signing::SigningClient;
use lithium_cli::contract_types::{
    CoreQueryMsg, CoreExecuteMsg,
    MineQueryMsg,
    StakeQueryMsg, StakeExecuteMsg,
    ReferQueryMsg, ReferExecuteMsg,
};

const LCD_DEFAULT: &str = "https://lcd.bostrom.cybernode.ai";
const RPC_DEFAULT: &str = "https://rpc.bostrom.cybernode.ai";
const GRAPHQL_DEFAULT: &str = "https://index.bostrom.cybernode.ai/v1/graphql";
const IPFS_GATEWAY_DEFAULT: &str = "https://gateway.ipfs.cybernode.ai";
const IPFS_API_DEFAULT: &str = "https://io.cybernode.ai";

// Lithium contract addresses — single source of truth from lithium-cli deployments TOML
fn litium_core() -> &'static str { &lithium_cli::deployments::mainnet().litium_core }
fn litium_mine() -> &'static str { &lithium_cli::deployments::mainnet().litium_mine }
fn litium_stake() -> &'static str { &lithium_cli::deployments::mainnet().litium_stake }
fn litium_refer() -> &'static str { &lithium_cli::deployments::mainnet().litium_refer }

// Liquidity pool discovery helpers

async fn find_pool(
    lcd: &crate::clients::lcd::LcdClient,
    offer_denom: &str,
    demand_denom: &str,
) -> anyhow::Result<serde_json::Value> {
    let data = lcd
        .get_json("/cosmos/liquidity/v1beta1/pools?pagination.limit=200")
        .await?;
    let pools = data["pools"]
        .as_array()
        .ok_or_else(|| anyhow::anyhow!("No pools found"))?;
    for pool in pools {
        let coins = pool["reserve_coin_denoms"].as_array();
        if let Some(coins) = coins {
            let denoms: Vec<&str> = coins.iter().filter_map(|c| c.as_str()).collect();
            if denoms.contains(&offer_denom) && denoms.contains(&demand_denom) {
                return Ok(pool.clone());
            }
        }
    }
    anyhow::bail!("No pool found for {offer_denom}/{demand_denom}")
}

fn find_balance(balances: Option<&Vec<serde_json::Value>>, denom: &str) -> f64 {
    balances
        .and_then(|arr| {
            arr.iter().find(|b| b["denom"].as_str() == Some(denom))
        })
        .and_then(|b| b["amount"].as_str())
        .and_then(|s| s.parse::<f64>().ok())
        .unwrap_or(0.0)
}

#[derive(Clone)]
pub struct BostromMcp {
    tool_router: ToolRouter<Self>,
    pub(crate) lcd: LcdClient,
    pub(crate) rpc: RpcClient,
    pub(crate) graphql: GraphqlClient,
    pub(crate) ipfs: IpfsClient,
    pub(crate) signing: Option<SigningClient>,
}

#[tool_router]
impl BostromMcp {
    pub fn new(
        lcd: LcdClient,
        rpc: RpcClient,
        graphql: GraphqlClient,
        ipfs: IpfsClient,
        signing: Option<SigningClient>,
    ) -> Self {
        Self {
            tool_router: Self::tool_router(),
            lcd,
            rpc,
            graphql,
            ipfs,
            signing,
        }
    }

    pub(crate) fn require_signing(&self) -> std::result::Result<&SigningClient, rmcp::ErrorData> {
        self.signing.as_ref().ok_or_else(|| {
            rmcp::ErrorData::new(
                rmcp::model::ErrorCode::INVALID_REQUEST,
                "BOSTROM_MNEMONIC not set. Write tools require a wallet.",
                None::<serde_json::Value>,
            )
        })
    }


    // ── infra tools ──


#[tool(description = "Get current Bostrom chain status: latest block height, time, chain ID, sync status")]
async fn infra_chain_status(&self) -> Result<CallToolResult, rmcp::ErrorData> {
    match self.rpc.get("/status").await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Search transactions by sender address, contract address, or message type")]
async fn infra_tx_search(
    &self,
    params: Parameters<crate::tools::TxSearchParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let limit = p.limit.unwrap_or(10).min(50).max(1);
    let offset = p.offset.unwrap_or(0);

    let mut events = Vec::new();
    if let Some(ref sender) = p.sender {
        events.push(format!("message.sender='{sender}'"));
    }
    if let Some(ref contract) = p.contract {
        events.push(format!("execute._contract_address='{contract}'"));
    }
    if let Some(ref msg_type) = p.message_type {
        events.push(format!("message.action='{msg_type}'"));
    }
    if events.is_empty() {
        return Ok(crate::util::err(
            "At least one filter required: sender, contract, or message_type",
        ));
    }
    let query = events.join("&events=");
    let path = format!(
        "/cosmos/tx/v1beta1/txs?events={query}&pagination.limit={limit}&pagination.offset={offset}&order_by=2"
    );
    match self.lcd.get_json(&path).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get full decoded transaction by hash")]
async fn infra_tx_detail(
    &self,
    params: Parameters<crate::tools::TxDetailParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let path = format!("/cosmos/tx/v1beta1/txs/{}", params.0.txhash);
    match self.lcd.get_json(&path).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

    // ── economy tools ──


#[tool(description = "Get all token balances for an address (BOOT, HYDROGEN, VOLT, AMPERE, LI, etc.)")]
async fn economy_balances(
    &self,
    params: Parameters<crate::tools::AddressParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let path = format!("/cosmos/bank/v1beta1/balances/{}", params.0.address);
    match self.lcd.get_json(&path).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get total supply for a token denom")]
async fn economy_supply(
    &self,
    params: Parameters<crate::tools::DenomParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let path = format!(
        "/cosmos/bank/v1beta1/supply/by_denom?denom={}",
        params.0.denom
    );
    match self.lcd.get_json(&path).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get current Volt and Ampere mint prices (resources module parameters)")]
async fn economy_mint_price(&self) -> Result<CallToolResult, rmcp::ErrorData> {
    match self
        .lcd
        .get_json("/cyber/resources/v1beta1/resources/params")
        .await
    {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(_) => match self.lcd.get_json("/cyber/resources/v1beta1/params").await {
            Ok(data) => Ok(crate::util::ok(&data)),
            Err(e) => Ok(crate::util::err(&e.to_string())),
        },
    }
}

#[tool(description = "Get staking info for an address: delegations, rewards, and unbonding")]
async fn economy_staking(
    &self,
    params: Parameters<crate::tools::StakingParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let addr = &params.0.address;
    let p1 = format!("/cosmos/staking/v1beta1/delegations/{addr}");
    let p2 = format!("/cosmos/distribution/v1beta1/delegators/{addr}/rewards");
    let p3 = format!("/cosmos/staking/v1beta1/delegators/{addr}/unbonding_delegations");
    let (delegations, rewards, unbonding) = tokio::join!(
        self.lcd.get_json(&p1),
        self.lcd.get_json(&p2),
        self.lcd.get_json(&p3),
    );
    let result = serde_json::json!({
        "delegations": delegations.unwrap_or_default(),
        "rewards": rewards.unwrap_or_default(),
        "unbonding": unbonding.unwrap_or_default(),
    });
    Ok(crate::util::ok(&result))
}

#[tool(description = "Get liquidity pool stats from the pools module")]
async fn economy_pools(&self) -> Result<CallToolResult, rmcp::ErrorData> {
    match self
        .lcd
        .get_json("/cosmos/liquidity/v1beta1/pools")
        .await
    {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(_) => match self
            .lcd
            .get_json("/osmosis/gamm/v1beta1/pools")
            .await
        {
            Ok(data) => Ok(crate::util::ok(&data)),
            Err(e) => Ok(crate::util::err(&e.to_string())),
        },
    }
}

#[tool(description = "Get current inflation rate and minting parameters")]
async fn economy_inflation(&self) -> Result<CallToolResult, rmcp::ErrorData> {
    let (inflation, mint_params) = tokio::join!(
        self.lcd.get_json("/cosmos/mint/v1beta1/inflation"),
        self.lcd.get_json("/cosmos/mint/v1beta1/params"),
    );
    let result = serde_json::json!({
        "inflation": inflation.unwrap_or_default(),
        "params": mint_params.unwrap_or_default(),
    });
    Ok(crate::util::ok(&result))
}

    // ── governance tools ──


#[tool(description = "List governance proposals. Filter by status.")]
async fn gov_proposals(
    &self,
    params: Parameters<crate::tools::GovProposalsParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let limit = p.limit.unwrap_or(10).min(50).max(1);
    let status = p.status.as_deref().unwrap_or("all");
    let mut path = format!(
        "/cosmos/gov/v1/proposals?pagination.limit={limit}&pagination.reverse=true"
    );
    if status != "all" {
        path.push_str(&format!("&proposal_status={status}"));
    }
    match self.lcd.get_json(&path).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get full proposal details including vote tally")]
async fn gov_proposal_detail(
    &self,
    params: Parameters<crate::tools::ProposalDetailParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let id = &params.0.proposal_id;
    let p1 = format!("/cosmos/gov/v1/proposals/{id}");
    let p2 = format!("/cosmos/gov/v1/proposals/{id}/tally");
    let (proposal, tally) = tokio::join!(
        self.lcd.get_json(&p1),
        self.lcd.get_json(&p2),
    );
    let result = serde_json::json!({
        "proposal": proposal.unwrap_or_default(),
        "tally": tally.unwrap_or_default(),
    });
    Ok(crate::util::ok(&result))
}

#[tool(description = "Get the active validator set with moniker, commission, and voting power")]
async fn gov_validators(
    &self,
    params: Parameters<crate::tools::ValidatorsParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let status = p.status.as_deref().unwrap_or("BOND_STATUS_BONDED");
    let limit = p.limit.unwrap_or(50).min(200).max(1);
    let path = format!(
        "/cosmos/staking/v1beta1/validators?status={status}&pagination.limit={limit}"
    );
    match self.lcd.get_json(&path).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get chain parameters: staking, slashing, governance, distribution, or minting params")]
async fn gov_params(
    &self,
    params: Parameters<crate::tools::GovParamsParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let path = match params.0.module.as_str() {
        "staking" => "/cosmos/staking/v1beta1/params",
        "slashing" => "/cosmos/slashing/v1beta1/params",
        "gov" => "/cosmos/gov/v1/params/tallying",
        "distribution" => "/cosmos/distribution/v1beta1/params",
        "mint" => "/cosmos/mint/v1beta1/params",
        other => {
            return Ok(crate::util::err(&format!(
                "Unknown module: {other}. Use: staking, slashing, gov, distribution, mint"
            )));
        }
    };
    match self.lcd.get_json(path).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

    // ── graph tools ──


#[tool(description = "Search cyberlinks by particle CID or neuron address. Returns linked particles and their creators.")]
async fn graph_search(
    &self,
    params: Parameters<crate::tools::GraphSearchParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let limit = p.limit.unwrap_or(20).min(100).max(1);
    let offset = p.offset.unwrap_or(0);

    let mut conditions = Vec::new();
    if let Some(ref particle) = p.particle {
        conditions.push(format!(
            "{{_or: [{{particle_from: {{_eq: \"{particle}\"}}}}, {{particle_to: {{_eq: \"{particle}\"}}}}]}}"
        ));
    }
    if let Some(ref neuron) = p.neuron {
        conditions.push(format!("{{neuron: {{_eq: \"{neuron}\"}}}}"));
    }
    if conditions.is_empty() {
        return Ok(crate::util::err(
            "At least one filter required: particle or neuron",
        ));
    }

    let where_clause = if conditions.len() == 1 {
        conditions[0].clone()
    } else {
        format!("{{_and: [{}]}}", conditions.join(", "))
    };

    let query = format!(
        r#"query {{
  cyberlinks(where: {where_clause}, limit: {limit}, offset: {offset}, order_by: {{height: desc}}) {{
    particle_from
    particle_to
    neuron
    height
    timestamp
  }}
  cyberlinks_aggregate(where: {where_clause}) {{
    aggregate {{ count }}
  }}
}}"#
    );
    match self.graphql.query(&query, None).await {
        Ok(data) => {
            let total = data["cyberlinks_aggregate"]["aggregate"]["count"]
                .as_u64()
                .unwrap_or(0);
            let mut result = data;
            if let Some(hint) = crate::util::pagination_hint("graph_search", offset, limit, total) {
                result["pagination"] = hint;
            }
            Ok(crate::util::ok(&result))
        }
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get the cyberank score for a particle (CID). Higher rank = more important in the knowledge graph.")]
async fn graph_rank(
    &self,
    params: Parameters<crate::tools::ParticleParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let path = format!(
        "/cyber/rank/v1beta1/rank/rank/{}",
        params.0.particle
    );
    match self.lcd.get_json(&path).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get neuron profile: number of cyberlinks created")]
async fn graph_neuron(
    &self,
    params: Parameters<crate::tools::AddressParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let addr = &params.0.address;
    let query = format!(
        r#"query {{
  cyberlinks_aggregate(where: {{neuron: {{_eq: "{addr}"}}}}) {{
    aggregate {{ count }}
  }}
}}"#
    );
    match self.graphql.query(&query, None).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Fetch particle content by CID from IPFS. Returns text content (truncated at 50KB).")]
async fn graph_particle(
    &self,
    params: Parameters<crate::tools::CidParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    match self.ipfs.get(&params.0.cid).await {
        Ok(content) => Ok(CallToolResult::success(vec![Content::text(content)])),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get the most recent cyberlinks created on Bostrom")]
async fn graph_recent_links(
    &self,
    params: Parameters<crate::tools::RecentLinksParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let limit = params.0.limit.unwrap_or(20).min(100).max(1);
    let query = format!(
        r#"query {{
  cyberlinks(limit: {limit}, order_by: {{timestamp: desc}}) {{
    particle_from
    particle_to
    neuron
    height
    timestamp
  }}
}}"#
    );
    match self.graphql.query(&query, None).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get knowledge graph statistics: total cyberlinks and active neurons")]
async fn graph_stats(&self) -> Result<CallToolResult, rmcp::ErrorData> {
    let query = r#"query {
  total: cyberlinks_aggregate { aggregate { count } }
  neurons: cyberlinks_aggregate(distinct_on: neuron) { aggregate { count } }
}"#;
    match self.graphql.query(query, None).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

    // ── graph_write tools ──


#[tool(description = "Create a cyberlink between two CIDs in the knowledge graph. Requires VOLT and AMPERE energy.")]
async fn graph_create_cyberlink(
    &self,
    params: Parameters<crate::tools::CreateCyberlinkParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = crate::proto::cyber::MsgCyberlink {
        neuron: signing.address().to_string(),
        links: vec![crate::proto::cyber::Link {
            from: p.from_cid.clone(),
            to: p.to_cid.clone(),
        }],
    };
    let any = crate::clients::signing::encode_any("/cyber.graph.v1beta1.MsgCyberlink", &msg);
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Create multiple cyberlinks in a single transaction (batch, 1-64 links)")]
async fn graph_create_cyberlinks(
    &self,
    params: Parameters<crate::tools::CreateCyberlinksParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    if p.links.is_empty() || p.links.len() > 64 {
        return Ok(crate::util::err("links must contain 1-64 items"));
    }
    let msg = crate::proto::cyber::MsgCyberlink {
        neuron: signing.address().to_string(),
        links: p
            .links
            .iter()
            .map(|l| crate::proto::cyber::Link {
                from: l.from.clone(),
                to: l.to.clone(),
            })
            .collect(),
    };
    let any = crate::clients::signing::encode_any("/cyber.graph.v1beta1.MsgCyberlink", &msg);
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Convert HYDROGEN into millivolt or milliampere energy")]
async fn graph_investmint(
    &self,
    params: Parameters<crate::tools::InvestmintParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = crate::proto::cyber::MsgInvestmint {
        neuron: signing.address().to_string(),
        amount: Some(crate::proto::cyber::Coin {
            denom: "hydrogen".to_string(),
            amount: p.amount.clone(),
        }),
        resource: p.resource.clone(),
        length: p.length,
    };
    let any = crate::clients::signing::encode_any(
        "/cyber.resources.v1beta1.MsgInvestmint",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Pin text content to IPFS and return the CID")]
async fn graph_pin_content(
    &self,
    params: Parameters<crate::tools::PinContentParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let content = &params.0.content;
    if content.is_empty() || content.len() > 100_000 {
        return Ok(crate::util::err("Content must be 1-100000 characters"));
    }
    match self.ipfs.add(content).await {
        Ok(cid) => Ok(crate::util::ok(&serde_json::json!({ "cid": cid }))),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Pin content to IPFS then create cyberlink(s). Compound operation.")]
async fn graph_create_knowledge(
    &self,
    params: Parameters<crate::tools::CreateKnowledgeParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    if p.content.is_empty() || p.content.len() > 100_000 {
        return Ok(crate::util::err("Content must be 1-100000 characters"));
    }

    // Pin content
    let cid = match self.ipfs.add(&p.content).await {
        Ok(cid) => cid,
        Err(e) => return Ok(crate::util::err(&format!("IPFS add failed: {e}"))),
    };

    // Build links
    let mut links = Vec::new();
    if let Some(ref from) = p.from_cid {
        links.push(crate::proto::cyber::Link {
            from: from.clone(),
            to: cid.clone(),
        });
    }
    if let Some(ref to) = p.to_cid {
        links.push(crate::proto::cyber::Link {
            from: cid.clone(),
            to: to.clone(),
        });
    }
    if links.is_empty() {
        return Ok(crate::util::ok(&serde_json::json!({
            "cid": cid,
            "note": "Content pinned but no cyberlink created (provide from_cid or to_cid)"
        })));
    }

    let msg = crate::proto::cyber::MsgCyberlink {
        neuron: signing.address().to_string(),
        links,
    };
    let any = crate::clients::signing::encode_any("/cyber.graph.v1beta1.MsgCyberlink", &msg);
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => {
            let mut r = serde_json::to_value(&result).unwrap();
            r["cid"] = serde_json::Value::String(cid);
            Ok(crate::util::ok(&r))
        }
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

    // ── lithium tools ──

#[tool(description = "Get litium-core config: token_denom, admin, paused")]
async fn li_core_config(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_core());
    match self.lcd.smart_query(contract, &serde_json::to_value(&CoreQueryMsg::Config {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get LI burn stats: total_burned via contract-mediated transfers")]
async fn li_burn_stats(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_core());
    match self.lcd.smart_query(contract, &serde_json::to_value(&CoreQueryMsg::BurnStats {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get total LI minted and supply cap")]
async fn li_total_minted(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_core());
    match self.lcd.smart_query(contract, &serde_json::to_value(&CoreQueryMsg::TotalMinted {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get full litium-mine state: config, window_status, stats, emission breakdown")]
async fn li_mine_state(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_mine());
    let q1 = serde_json::to_value(&MineQueryMsg::Config {}).unwrap();
    let q2 = serde_json::to_value(&MineQueryMsg::WindowStatus {}).unwrap();
    let q3 = serde_json::to_value(&MineQueryMsg::Stats {}).unwrap();
    let q4 = serde_json::to_value(&MineQueryMsg::EmissionInfo {}).unwrap();
    let (config, window, stats, emission) = tokio::join!(
        self.lcd.smart_query(contract, &q1),
        self.lcd.smart_query(contract, &q2),
        self.lcd.smart_query(contract, &q3),
        self.lcd.smart_query(contract, &q4),
    );
    let result = serde_json::json!({
        "config": config.unwrap_or_default(),
        "window_status": window.unwrap_or_default(),
        "stats": stats.unwrap_or_default(),
        "emission": emission.unwrap_or_default(),
    });
    Ok(crate::util::ok(&result))
}

#[tool(description = "Get litium-mine config: max_proof_age, estimated_gas_cost_uboot, window_size, pid_interval, min_profitable_difficulty, alpha, beta")]
async fn li_mine_config(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_mine());
    match self.lcd.smart_query(contract, &serde_json::to_value(&MineQueryMsg::Config {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get sliding window status: proof_count, window_d_rate, window_entries, base_rate, min_profitable_difficulty, alpha, beta")]
async fn li_window_status(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_mine());
    match self.lcd.smart_query(contract, &serde_json::to_value(&MineQueryMsg::WindowStatus {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get Lithium emission breakdown: alpha, beta, emission_rate, gross_rate, mining_rate, staking_rate, windowed_fees")]
async fn li_emission(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_mine());
    match self.lcd.smart_query(contract, &serde_json::to_value(&MineQueryMsg::EmissionInfo {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Estimate LI reward for a given difficulty")]
async fn li_reward_estimate(
    &self,
    params: Parameters<crate::tools::RewardEstimateParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let contract = p.contract.as_deref().unwrap_or(litium_mine());
    match self
        .lcd
        .smart_query(
            contract,
            &serde_json::to_value(&MineQueryMsg::CalculateReward { difficulty_bits: p.difficulty_bits as u32 }).unwrap(),
        )
        .await
    {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get aggregate mining stats: total_proofs, total_rewards, unique_miners, avg_difficulty")]
async fn li_mine_stats(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_mine());
    match self.lcd.smart_query(contract, &serde_json::to_value(&MineQueryMsg::Stats {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get per-miner stats: proofs_submitted, total_rewards, last_proof_time")]
async fn li_miner_stats(
    &self,
    params: Parameters<crate::tools::MinerStatsParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let contract = p.contract.as_deref().unwrap_or(litium_mine());
    match self
        .lcd
        .smart_query(
            contract,
            &serde_json::to_value(&MineQueryMsg::MinerStats { address: p.address.clone() }).unwrap(),
        )
        .await
    {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get recent proof submission transactions for the mine contract")]
async fn li_recent_proofs(
    &self,
    params: Parameters<crate::tools::RecentProofsParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let limit = p.limit.unwrap_or(10).min(50).max(1);
    let contract = p.contract.as_deref().unwrap_or(litium_mine());
    let query = format!(
        r#"query {{
  messages_by_address(args: {{addresses: "{{{contract}}}", types: "{{cosmwasm.wasm.v1.MsgExecuteContract}}"}}, limit: {limit}, order_by: {{transaction: {{block: {{height: desc}}}}}}) {{
    transaction_hash
    value
    transaction {{
      block {{ height timestamp }}
    }}
  }}
}}"#
    );
    match self.graphql.query(&query, None).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get litium-stake config: core_contract, mine_contract, token_contract, unbonding_period_seconds, admin, paused")]
async fn li_stake_config(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_stake());
    match self.lcd.smart_query(contract, &serde_json::to_value(&StakeQueryMsg::Config {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get total LI staked across all stakers")]
async fn li_total_staked(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_stake());
    match self.lcd.smart_query(contract, &serde_json::to_value(&StakeQueryMsg::TotalStaked {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get staking state for an address: staked_amount, pending_unbonding, claimable_rewards")]
async fn li_stake_info(
    &self,
    params: Parameters<crate::tools::StakeInfoParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let contract = p.contract.as_deref().unwrap_or(litium_stake());
    match self
        .lcd
        .smart_query(
            contract,
            &serde_json::to_value(&StakeQueryMsg::StakeInfo { address: p.address.clone() }).unwrap(),
        )
        .await
    {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get aggregate staking stats: reserve, total_staked, reward_index")]
async fn li_staking_stats(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_stake());
    match self.lcd.smart_query(contract, &serde_json::to_value(&StakeQueryMsg::StakingStats {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get litium-refer config: core_contract, mine_contract, community_pool_addr, admin, paused")]
async fn li_refer_config(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_refer());
    match self.lcd.smart_query(contract, &serde_json::to_value(&ReferQueryMsg::Config {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get who referred a specific miner")]
async fn li_referrer_of(
    &self,
    params: Parameters<crate::tools::ReferrerOfParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let contract = p.contract.as_deref().unwrap_or(litium_refer());
    match self
        .lcd
        .smart_query(
            contract,
            &serde_json::to_value(&ReferQueryMsg::ReferrerOf { miner: p.miner.clone() }).unwrap(),
        )
        .await
    {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get referral stats for a referrer: referral_rewards, referrals_count")]
async fn li_referral_info(
    &self,
    params: Parameters<crate::tools::ReferralInfoParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let contract = p.contract.as_deref().unwrap_or(litium_refer());
    match self
        .lcd
        .smart_query(
            contract,
            &serde_json::to_value(&ReferQueryMsg::ReferralInfo { address: p.address.clone() }).unwrap(),
        )
        .await
    {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get unclaimed community pool balance")]
async fn li_community_pool(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let contract = params.0.contract.as_deref().unwrap_or(litium_refer());
    match self.lcd.smart_query(contract, &serde_json::to_value(&ReferQueryMsg::CommunityPoolBalance {}).unwrap()).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Get a miner's recent contract execution TX history and total count")]
async fn li_miner_tx_history(
    &self,
    params: Parameters<crate::tools::MinerTxHistoryParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let limit = p.limit.unwrap_or(20).min(50).max(1);
    let query = format!(
        r#"query {{
  messages_by_address(args: {{addresses: "{{{addr}}}", types: "{{cosmwasm.wasm.v1.MsgExecuteContract}}"}}, limit: {limit}, order_by: {{transaction: {{block: {{height: desc}}}}}}) {{
    transaction_hash
    value
    transaction {{
      block {{ height timestamp }}
    }}
  }}
  messages_by_address_aggregate(args: {{addresses: "{{{addr}}}", types: "{{cosmwasm.wasm.v1.MsgExecuteContract}}"}}) {{
    aggregate {{ count }}
  }}
}}"#,
        addr = p.address,
    );
    match self.graphql.query(&query, None).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

    // ── lithium_write tools ──


#[tool(description = "Submit a lithium mining proof to the mine contract")]
async fn li_submit_proof(
    &self,
    params: Parameters<crate::tools::SubmitProofParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let contract = p.contract.as_deref().unwrap_or(litium_mine());
    let msg = lithium_cli::contract_types::MineExecuteMsg::SubmitProof {
        hash: p.hash.clone(),
        nonce: p.nonce,
        miner_address: p.miner_address.clone(),
        challenge: p.challenge.clone(),
        difficulty: p.difficulty,
        timestamp: p.timestamp,
        referrer: p.referrer.clone(),
    };
    let execute_msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgExecuteContract {
        sender: signing.address().to_string(),
        contract: contract.to_string(),
        msg: serde_json::to_vec(&msg).unwrap(),
        funds: vec![],
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgExecuteContract",
        &execute_msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Stake LI tokens to earn staking rewards")]
async fn li_stake(
    &self,
    params: Parameters<crate::tools::LiStakeParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let stake_contract = p.contract.as_deref().unwrap_or(litium_stake());
    // CW-20 send: execute on litium_core() to send LI to stake contract
    let msg_inner = serde_json::to_value(&CoreExecuteMsg::Send {
        contract: stake_contract.to_string(),
        amount: p.amount.clone(),
        msg: base64::Engine::encode(&base64::engine::general_purpose::STANDARD, "{}"),
    }).unwrap();
    let execute_msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgExecuteContract {
        sender: signing.address().to_string(),
        contract: litium_core().to_string(),
        msg: serde_json::to_vec(&msg_inner).unwrap(),
        funds: vec![],
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgExecuteContract",
        &execute_msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Unstake LI tokens. Subject to unbonding period.")]
async fn li_unstake(
    &self,
    params: Parameters<crate::tools::LiUnstakeParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let contract = p.contract.as_deref().unwrap_or(litium_stake());
    let msg_inner = serde_json::to_value(&StakeExecuteMsg::Unstake { amount: p.amount.clone() }).unwrap();
    let execute_msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgExecuteContract {
        sender: signing.address().to_string(),
        contract: contract.to_string(),
        msg: serde_json::to_vec(&msg_inner).unwrap(),
        funds: vec![],
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgExecuteContract",
        &execute_msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Claim LI staking rewards from the stake contract")]
async fn li_claim_rewards(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let contract = params.0.contract.as_deref().unwrap_or(litium_stake());
    let msg_inner = serde_json::to_value(&StakeExecuteMsg::ClaimStakingRewards {}).unwrap();
    let execute_msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgExecuteContract {
        sender: signing.address().to_string(),
        contract: contract.to_string(),
        msg: serde_json::to_vec(&msg_inner).unwrap(),
        funds: vec![],
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgExecuteContract",
        &execute_msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Claim matured unbonding LI tokens from the stake contract")]
async fn li_claim_unbonding(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let contract = params.0.contract.as_deref().unwrap_or(litium_stake());
    let msg_inner = serde_json::to_value(&StakeExecuteMsg::ClaimUnbonding {}).unwrap();
    let execute_msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgExecuteContract {
        sender: signing.address().to_string(),
        contract: contract.to_string(),
        msg: serde_json::to_vec(&msg_inner).unwrap(),
        funds: vec![],
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgExecuteContract",
        &execute_msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Claim accumulated referral rewards from the litium-refer contract")]
async fn li_claim_referral_rewards(
    &self,
    params: Parameters<crate::tools::ContractParam>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let contract = params.0.contract.as_deref().unwrap_or(litium_refer());
    let msg_inner = serde_json::to_value(&ReferExecuteMsg::ClaimRewards {}).unwrap();
    let execute_msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgExecuteContract {
        sender: signing.address().to_string(),
        contract: contract.to_string(),
        msg: serde_json::to_vec(&msg_inner).unwrap(),
        funds: vec![],
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgExecuteContract",
        &execute_msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

    // ── mining tool ──

#[tool(description = "Mine a lithium proof using CPU. Generates random challenge, runs UniversalHash PoW solver, returns proof details. Optionally auto-submits on-chain.")]
async fn li_mine_proof(
    &self,
    params: Parameters<crate::tools::MineProofParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    use uhash_prover::Solver;

    let p = &params.0;
    let difficulty = p.difficulty;
    if difficulty < 1 || difficulty > 256 {
        return Ok(crate::util::err("difficulty must be 1-256"));
    }
    let timeout_secs = p.timeout_seconds.unwrap_or(30).min(300);
    let batch_size = p.batch_size.unwrap_or(65536);
    let auto_submit = p.auto_submit.unwrap_or(false);
    let contract = p.contract.as_deref().unwrap_or(litium_mine());

    // Random 32-byte challenge (matches lithium-cli canonical approach)
    let mut challenge_bytes = [0u8; 32];
    rand::RngCore::fill_bytes(&mut rand::thread_rng(), &mut challenge_bytes);
    let challenge_hex = hex::encode(challenge_bytes);

    // Timestamp = now - 5s to avoid "timestamp in future" rejection
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
        .saturating_sub(5);

    // Random start nonce
    let start_nonce = rand::random::<u64>();

    let challenge = challenge_bytes.to_vec();
    let start = std::time::Instant::now();

    // Run CPU-bound mining in a blocking task
    let mine_result = tokio::task::spawn_blocking(move || {
        let mut solver = uhash_prover::cpu::ParallelCpuSolver::new(0);
        let timeout = std::time::Duration::from_secs(timeout_secs);
        let mut nonce = start_nonce;
        let mut total_hashes: u64 = 0;

        loop {
            if start.elapsed() >= timeout {
                return (None::<(u64, [u8; 32])>, total_hashes, start.elapsed());
            }
            match solver.find_proof_batch(&challenge, nonce, batch_size, difficulty) {
                Ok((Some(proof), hashes)) => {
                    total_hashes += hashes as u64;
                    return (Some(proof), total_hashes, start.elapsed());
                }
                Ok((None, hashes)) => {
                    total_hashes += hashes as u64;
                    nonce = nonce.wrapping_add(batch_size as u64);
                }
                Err(_) => {
                    return (None, total_hashes, start.elapsed());
                }
            }
        }
    })
    .await;

    let (proof, total_hashes, elapsed) = match mine_result {
        Ok(r) => r,
        Err(e) => return Ok(crate::util::err(&format!("Mining task failed: {e}"))),
    };

    let elapsed_secs = elapsed.as_secs_f64();
    let hashrate = if elapsed_secs > 0.0 {
        total_hashes as f64 / elapsed_secs
    } else {
        0.0
    };

    match proof {
        Some((nonce, hash)) => {
            let hash_hex = hex::encode(hash);

            let mut result = serde_json::json!({
                "status": "found",
                "nonce": nonce,
                "hash": hash_hex,
                "challenge": challenge_hex,
                "difficulty": difficulty,
                "timestamp": timestamp,
                "elapsed_seconds": format!("{elapsed_secs:.2}"),
                "total_hashes": total_hashes,
                "hashrate": format!("{hashrate:.1} H/s"),
            });

            // Auto-submit if requested
            if auto_submit {
                if let Some(signing) = &self.signing {
                    let msg = lithium_cli::contract_types::MineExecuteMsg::SubmitProof {
                        hash: hash_hex.clone(),
                        nonce,
                        miner_address: signing.address().to_string(),
                        challenge: challenge_hex.clone(),
                        difficulty,
                        timestamp,
                        referrer: p.referrer.clone(),
                    };
                    let execute_msg =
                        cosmos_sdk_proto::cosmwasm::wasm::v1::MsgExecuteContract {
                            sender: signing.address().to_string(),
                            contract: contract.to_string(),
                            msg: serde_json::to_vec(&msg).unwrap(),
                            funds: vec![],
                        };
                    let any = crate::clients::signing::encode_any(
                        "/cosmwasm.wasm.v1.MsgExecuteContract",
                        &execute_msg,
                    );
                    match signing.sign_and_broadcast(vec![any], None).await {
                        Ok(tx_result) => {
                            result["tx"] = serde_json::to_value(&tx_result).unwrap();
                        }
                        Err(e) => {
                            result["tx_error"] = serde_json::Value::String(e.to_string());
                        }
                    }
                } else {
                    result["tx_error"] =
                        serde_json::Value::String("auto_submit requires BOSTROM_MNEMONIC".into());
                }
            }

            Ok(crate::util::ok(&result))
        }
        None => {
            let result = serde_json::json!({
                "status": "timeout",
                "challenge": challenge_hex,
                "difficulty": difficulty,
                "elapsed_seconds": format!("{elapsed_secs:.2}"),
                "total_hashes": total_hashes,
                "hashrate": format!("{hashrate:.1} H/s"),
            });
            Ok(crate::util::ok(&result))
        }
    }
}

    // ── wallet tools ──


#[tool(description = "Get agent wallet address and all token balances")]
async fn wallet_info(&self) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let addr = signing.address();
    let path = format!("/cosmos/bank/v1beta1/balances/{addr}");
    match self.lcd.get_json(&path).await {
        Ok(data) => {
            let result = serde_json::json!({
                "address": addr,
                "balances": data.get("balances"),
            });
            Ok(crate::util::ok(&result))
        }
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Send tokens to a recipient address")]
async fn wallet_send(
    &self,
    params: Parameters<crate::tools::SendParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let denom = p.denom.as_deref().unwrap_or("boot");
    if let Err(e) = signing.check_amount_limit(&p.amount, denom) {
        return Ok(crate::util::err(&e.to_string()));
    }
    let msg = cosmos_sdk_proto::cosmos::bank::v1beta1::MsgSend {
        from_address: signing.address().to_string(),
        to_address: p.to.clone(),
        amount: vec![cosmos_sdk_proto::cosmos::base::v1beta1::Coin {
            denom: denom.to_string(),
            amount: p.amount.clone(),
        }],
    };
    let any = crate::clients::signing::encode_any("/cosmos.bank.v1beta1.MsgSend", &msg);
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Delegate (stake) tokens to a validator")]
async fn wallet_delegate(
    &self,
    params: Parameters<crate::tools::DelegateParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let denom = p.denom.as_deref().unwrap_or("boot");
    let msg = cosmos_sdk_proto::cosmos::staking::v1beta1::MsgDelegate {
        delegator_address: signing.address().to_string(),
        validator_address: p.validator.clone(),
        amount: Some(cosmos_sdk_proto::cosmos::base::v1beta1::Coin {
            denom: denom.to_string(),
            amount: p.amount.clone(),
        }),
    };
    let any =
        crate::clients::signing::encode_any("/cosmos.staking.v1beta1.MsgDelegate", &msg);
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Undelegate (unstake) tokens from a validator. Unbonding takes ~21 days.")]
async fn wallet_undelegate(
    &self,
    params: Parameters<crate::tools::DelegateParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let denom = p.denom.as_deref().unwrap_or("boot");
    let msg = cosmos_sdk_proto::cosmos::staking::v1beta1::MsgUndelegate {
        delegator_address: signing.address().to_string(),
        validator_address: p.validator.clone(),
        amount: Some(cosmos_sdk_proto::cosmos::base::v1beta1::Coin {
            denom: denom.to_string(),
            amount: p.amount.clone(),
        }),
    };
    let any =
        crate::clients::signing::encode_any("/cosmos.staking.v1beta1.MsgUndelegate", &msg);
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Redelegate tokens from one validator to another without unbonding")]
async fn wallet_redelegate(
    &self,
    params: Parameters<crate::tools::RedelegateParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let denom = p.denom.as_deref().unwrap_or("boot");
    let msg = cosmos_sdk_proto::cosmos::staking::v1beta1::MsgBeginRedelegate {
        delegator_address: signing.address().to_string(),
        validator_src_address: p.src_validator.clone(),
        validator_dst_address: p.dst_validator.clone(),
        amount: Some(cosmos_sdk_proto::cosmos::base::v1beta1::Coin {
            denom: denom.to_string(),
            amount: p.amount.clone(),
        }),
    };
    let any = crate::clients::signing::encode_any(
        "/cosmos.staking.v1beta1.MsgBeginRedelegate",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Claim staking rewards. If no validator specified, claims from all delegations.")]
async fn wallet_claim_rewards(
    &self,
    params: Parameters<crate::tools::ClaimRewardsParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let addr = signing.address().to_string();

    let validators = if let Some(ref v) = params.0.validator {
        vec![v.clone()]
    } else {
        // Discover all validators
        let path = format!("/cosmos/staking/v1beta1/delegators/{addr}/delegations");
        match self.lcd.get_json(&path).await {
            Ok(data) => data["delegation_responses"]
                .as_array()
                .map(|arr| {
                    arr.iter()
                        .filter_map(|d| {
                            d["delegation"]["validator_address"].as_str().map(String::from)
                        })
                        .collect()
                })
                .unwrap_or_default(),
            Err(e) => return Ok(crate::util::err(&format!("Failed to get delegations: {e}"))),
        }
    };

    if validators.is_empty() {
        return Ok(crate::util::err("No delegations found"));
    }

    let msgs: Vec<prost::bytes::Bytes> = validators
        .iter()
        .map(|v| {
            let msg =
                cosmos_sdk_proto::cosmos::distribution::v1beta1::MsgWithdrawDelegatorReward {
                    delegator_address: addr.clone(),
                    validator_address: v.clone(),
                };
            crate::clients::signing::encode_any(
                "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                &msg,
            )
        })
        .collect();

    match signing.sign_and_broadcast(msgs, None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Vote on a governance proposal (yes, no, abstain, no_with_veto)")]
async fn wallet_vote(
    &self,
    params: Parameters<crate::tools::VoteParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let option = match p.option.as_str() {
        "yes" => 1i32,
        "abstain" => 2,
        "no" => 3,
        "no_with_veto" => 4,
        other => {
            return Ok(crate::util::err(&format!(
                "Invalid vote option: {other}. Use: yes, no, abstain, no_with_veto"
            )));
        }
    };
    let msg = cosmos_sdk_proto::cosmos::gov::v1beta1::MsgVote {
        proposal_id: p.proposal_id,
        voter: signing.address().to_string(),
        option,
    };
    let any = crate::clients::signing::encode_any("/cosmos.gov.v1beta1.MsgVote", &msg);
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

    // ── tokenfactory tools ──


#[tool(description = "Create a new TokenFactory denom. WARNING: costs ~10,000 BOOT.")]
async fn token_create(
    &self,
    params: Parameters<crate::tools::CreateDenomParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let msg = crate::proto::cyber::MsgCreateDenom {
        sender: signing.address().to_string(),
        subdenom: params.0.subdenom.clone(),
    };
    let any = crate::clients::signing::encode_any(
        "/osmosis.tokenfactory.v1beta1.MsgCreateDenom",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Set human-readable metadata for a TokenFactory denom")]
async fn token_set_metadata(
    &self,
    params: Parameters<crate::tools::SetDenomMetadataParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let exponent = p.exponent.unwrap_or(0);
    let msg = crate::proto::cyber::MsgSetDenomMetadata {
        sender: signing.address().to_string(),
        metadata: Some(crate::proto::cyber::Metadata {
            description: p.description.clone(),
            denom_units: vec![
                crate::proto::cyber::DenomUnit {
                    denom: p.denom.clone(),
                    exponent: 0,
                    aliases: vec![],
                },
                crate::proto::cyber::DenomUnit {
                    denom: p.symbol.to_lowercase(),
                    exponent,
                    aliases: vec![],
                },
            ],
            base: p.denom.clone(),
            display: p.symbol.to_lowercase(),
            name: p.name.clone(),
            symbol: p.symbol.clone(),
        }),
    };
    let any = crate::clients::signing::encode_any(
        "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Mint new tokens to a specified address")]
async fn token_mint(
    &self,
    params: Parameters<crate::tools::MintTokenParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = crate::proto::cyber::MsgMint {
        sender: signing.address().to_string(),
        amount: Some(crate::proto::cyber::Coin {
            denom: p.denom.clone(),
            amount: p.amount.clone(),
        }),
        mint_to_address: p.mint_to.clone(),
    };
    let any = crate::clients::signing::encode_any(
        "/osmosis.tokenfactory.v1beta1.MsgMint",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Burn tokens from a specified address")]
async fn token_burn(
    &self,
    params: Parameters<crate::tools::BurnTokenParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = crate::proto::cyber::MsgBurn {
        sender: signing.address().to_string(),
        amount: Some(crate::proto::cyber::Coin {
            denom: p.denom.clone(),
            amount: p.amount.clone(),
        }),
        burn_from_address: p.burn_from.clone(),
    };
    let any = crate::clients::signing::encode_any(
        "/osmosis.tokenfactory.v1beta1.MsgBurn",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Transfer admin rights for a denom to a new address. Irreversible.")]
async fn token_change_admin(
    &self,
    params: Parameters<crate::tools::ChangeAdminParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = crate::proto::cyber::MsgChangeAdmin {
        sender: signing.address().to_string(),
        denom: p.denom.clone(),
        new_admin: p.new_admin.clone(),
    };
    let any = crate::clients::signing::encode_any(
        "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "List all TokenFactory denoms created by the agent wallet")]
async fn token_list_created(&self) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let addr = signing.address();
    let path = format!("/osmosis/tokenfactory/v1beta1/denoms_from_creator/{addr}");
    match self.lcd.get_json(&path).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

    // ── liquidity tools ──


#[tool(description = "Create a new Gravity DEX liquidity pool. WARNING: costs ~1,000 BOOT.")]
async fn liquidity_create_pool(
    &self,
    params: Parameters<crate::tools::CreatePoolParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    // Coins must be sorted alphabetically by denom
    let mut coins = vec![
        crate::proto::cyber::Coin { denom: p.denom_a.clone(), amount: p.amount_a.clone() },
        crate::proto::cyber::Coin { denom: p.denom_b.clone(), amount: p.amount_b.clone() },
    ];
    coins.sort_by(|a, b| a.denom.cmp(&b.denom));
    let msg = crate::proto::cyber::MsgCreatePool {
        pool_creator_address: signing.address().to_string(),
        pool_type_id: 1,
        deposit_coins: coins,
    };
    let any = crate::clients::signing::encode_any(
        "/cyber.liquidity.v1beta1.MsgCreatePool",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Deposit tokens into an existing liquidity pool")]
async fn liquidity_deposit(
    &self,
    params: Parameters<crate::tools::DepositParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let mut coins = vec![
        crate::proto::cyber::Coin { denom: p.denom_a.clone(), amount: p.amount_a.clone() },
        crate::proto::cyber::Coin { denom: p.denom_b.clone(), amount: p.amount_b.clone() },
    ];
    coins.sort_by(|a, b| a.denom.cmp(&b.denom));
    let msg = crate::proto::cyber::MsgDepositWithinBatch {
        depositor_address: signing.address().to_string(),
        pool_id: p.pool_id,
        deposit_coins: coins,
    };
    let any = crate::clients::signing::encode_any(
        "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Withdraw LP tokens from a pool to receive underlying assets")]
async fn liquidity_withdraw(
    &self,
    params: Parameters<crate::tools::WithdrawParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = crate::proto::cyber::MsgWithdrawWithinBatch {
        withdrawer_address: signing.address().to_string(),
        pool_id: p.pool_id,
        pool_coin: Some(crate::proto::cyber::Coin {
            denom: p.pool_coin_denom.clone(),
            amount: p.pool_coin_amount.clone(),
        }),
    };
    let any = crate::clients::signing::encode_any(
        "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Swap tokens via a Gravity DEX pool with explicit pool_id and price")]
async fn liquidity_swap(
    &self,
    params: Parameters<crate::tools::LiquiditySwapParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    // Get swap fee rate
    let fee_rate: f64 = match self.lcd.get_json("/cosmos/liquidity/v1beta1/params").await {
        Ok(data) => data["params"]["swap_fee_rate"]
            .as_str()
            .and_then(|s| s.parse().ok())
            .unwrap_or(0.003),
        Err(_) => 0.003,
    };
    let offer_amount: f64 = p.offer_amount.parse().unwrap_or(0.0);
    let fee_amount = (offer_amount * fee_rate / 2.0).ceil() as u64;
    let msg = crate::proto::cyber::MsgSwapWithinBatch {
        swap_requester_address: signing.address().to_string(),
        pool_id: p.pool_id,
        swap_type_id: 1,
        offer_coin: Some(crate::proto::cyber::Coin {
            denom: p.offer_denom.clone(),
            amount: p.offer_amount.clone(),
        }),
        demand_coin_denom: p.demand_denom.clone(),
        offer_coin_fee: Some(crate::proto::cyber::Coin {
            denom: p.offer_denom.clone(),
            amount: fee_amount.to_string(),
        }),
        order_price: p.order_price.clone(),
    };
    let any = crate::clients::signing::encode_any(
        "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Swap tokens using Gravity DEX. Auto-discovers pool and calculates market price.")]
async fn swap_tokens(
    &self,
    params: Parameters<crate::tools::SwapTokensParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let slippage = p.slippage_percent.unwrap_or(3.0).min(50.0).max(0.0);

    // Find pool
    let pool = match find_pool(&self.lcd, &p.offer_denom, &p.demand_denom).await {
        Ok(pool) => pool,
        Err(e) => return Ok(crate::util::err(&e.to_string())),
    };

    // Get reserves for price calculation
    let reserve_account = pool["reserve_account_address"].as_str().unwrap_or("");
    let balances_path = format!("/cosmos/bank/v1beta1/balances/{reserve_account}");
    let reserves = match self.lcd.get_json(&balances_path).await {
        Ok(data) => data,
        Err(e) => return Ok(crate::util::err(&format!("Failed to get reserves: {e}"))),
    };
    let balances = reserves["balances"].as_array();
    let offer_reserve = find_balance(balances, &p.offer_denom);
    let demand_reserve = find_balance(balances, &p.demand_denom);
    if offer_reserve == 0.0 || demand_reserve == 0.0 {
        return Ok(crate::util::err("Pool has zero reserves"));
    }
    let price = offer_reserve / demand_reserve;
    let adjusted_price = price * (1.0 + slippage / 100.0);

    let pool_id = pool["id"].as_str().unwrap_or("0").parse::<u64>().unwrap_or(0);
    let fee_rate: f64 = match self.lcd.get_json("/cosmos/liquidity/v1beta1/params").await {
        Ok(data) => data["params"]["swap_fee_rate"]
            .as_str()
            .and_then(|s| s.parse().ok())
            .unwrap_or(0.003),
        Err(_) => 0.003,
    };
    let offer_amount: f64 = p.offer_amount.parse().unwrap_or(0.0);
    let fee_amount = (offer_amount * fee_rate / 2.0).ceil() as u64;

    let msg = crate::proto::cyber::MsgSwapWithinBatch {
        swap_requester_address: signing.address().to_string(),
        pool_id,
        swap_type_id: 1,
        offer_coin: Some(crate::proto::cyber::Coin {
            denom: p.offer_denom.clone(),
            amount: p.offer_amount.clone(),
        }),
        demand_coin_denom: p.demand_denom.clone(),
        offer_coin_fee: Some(crate::proto::cyber::Coin {
            denom: p.offer_denom.clone(),
            amount: fee_amount.to_string(),
        }),
        order_price: format!("{adjusted_price:.18}"),
    };
    let any = crate::clients::signing::encode_any(
        "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Estimate a token swap: find the pool, get current price, calculate expected output")]
async fn swap_estimate(
    &self,
    params: Parameters<crate::tools::SwapEstimateParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let p = &params.0;
    let pool = match find_pool(&self.lcd, &p.offer_denom, &p.demand_denom).await {
        Ok(pool) => pool,
        Err(e) => return Ok(crate::util::err(&e.to_string())),
    };

    let reserve_account = pool["reserve_account_address"].as_str().unwrap_or("");
    let balances_path = format!("/cosmos/bank/v1beta1/balances/{reserve_account}");
    let reserves = match self.lcd.get_json(&balances_path).await {
        Ok(data) => data,
        Err(e) => return Ok(crate::util::err(&format!("Failed to get reserves: {e}"))),
    };
    let balances = reserves["balances"].as_array();
    let offer_reserve = find_balance(balances, &p.offer_denom);
    let demand_reserve = find_balance(balances, &p.demand_denom);

    let offer_amount: f64 = p.offer_amount.parse().unwrap_or(0.0);
    let expected_output = if offer_reserve > 0.0 {
        (offer_amount * demand_reserve) / (offer_reserve + offer_amount)
    } else {
        0.0
    };
    let price = if demand_reserve > 0.0 {
        offer_reserve / demand_reserve
    } else {
        0.0
    };

    let result = serde_json::json!({
        "pool_id": pool["id"],
        "offer_denom": p.offer_denom,
        "offer_amount": p.offer_amount,
        "demand_denom": p.demand_denom,
        "expected_output": (expected_output as u64).to_string(),
        "price": format!("{price:.6}"),
        "offer_reserve": offer_reserve.to_string(),
        "demand_reserve": demand_reserve.to_string(),
    });
    Ok(crate::util::ok(&result))
}

#[tool(description = "Get pool details: reserves, parameters, current batch info")]
async fn liquidity_pool_detail(
    &self,
    params: Parameters<crate::tools::PoolDetailParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let pool_id = params.0.pool_id;
    let p1 = format!("/cosmos/liquidity/v1beta1/pools/{pool_id}");
    let p2 = format!("/cosmos/liquidity/v1beta1/pools/{pool_id}/batch");
    let (pool, batch) = tokio::join!(
        self.lcd.get_json(&p1),
        self.lcd.get_json(&p2),
    );
    let result = serde_json::json!({
        "pool": pool.unwrap_or_default(),
        "batch": batch.unwrap_or_default(),
    });
    Ok(crate::util::ok(&result))
}



    // ── contract tools ──


#[tool(description = "Execute a CosmWasm smart contract message")]
async fn contract_execute(
    &self,
    params: Parameters<crate::tools::ContractExecuteParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let funds: Vec<cosmos_sdk_proto::cosmos::base::v1beta1::Coin> = p
        .funds
        .as_ref()
        .map(|f| {
            f.iter()
                .map(|fi| cosmos_sdk_proto::cosmos::base::v1beta1::Coin {
                    denom: fi.denom.clone(),
                    amount: fi.amount.clone(),
                })
                .collect()
        })
        .unwrap_or_default();
    let execute_msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgExecuteContract {
        sender: signing.address().to_string(),
        contract: p.contract.clone(),
        msg: serde_json::to_vec(&p.msg).unwrap(),
        funds,
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgExecuteContract",
        &execute_msg,
    );
    match signing
        .sign_and_broadcast(vec![any], p.memo.as_deref())
        .await
    {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Execute multiple contract messages in a single transaction (1-32 operations)")]
async fn contract_execute_multi(
    &self,
    params: Parameters<crate::tools::ContractExecuteMultiParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    if p.operations.is_empty() || p.operations.len() > 32 {
        return Ok(crate::util::err("operations must contain 1-32 items"));
    }
    let msgs: Vec<prost::bytes::Bytes> = p
        .operations
        .iter()
        .map(|op| {
            let funds: Vec<cosmos_sdk_proto::cosmos::base::v1beta1::Coin> = op
                .funds
                .as_ref()
                .map(|f| {
                    f.iter()
                        .map(|fi| cosmos_sdk_proto::cosmos::base::v1beta1::Coin {
                            denom: fi.denom.clone(),
                            amount: fi.amount.clone(),
                        })
                        .collect()
                })
                .unwrap_or_default();
            let execute_msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgExecuteContract {
                sender: signing.address().to_string(),
                contract: op.contract.clone(),
                msg: serde_json::to_vec(&op.msg).unwrap(),
                funds,
            };
            crate::clients::signing::encode_any(
                "/cosmwasm.wasm.v1.MsgExecuteContract",
                &execute_msg,
            )
        })
        .collect();
    match signing
        .sign_and_broadcast(msgs, p.memo.as_deref())
        .await
    {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Upload CosmWasm contract bytecode (.wasm file) to the chain")]
async fn wasm_upload(
    &self,
    params: Parameters<crate::tools::WasmUploadParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let wasm_bytes = match tokio::fs::read(&p.file_path).await {
        Ok(bytes) => bytes,
        Err(e) => return Ok(crate::util::err(&format!("Failed to read file: {e}"))),
    };
    let msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgStoreCode {
        sender: signing.address().to_string(),
        wasm_byte_code: wasm_bytes,
        instantiate_permission: None,
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgStoreCode",
        &msg,
    );
    match signing
        .sign_and_broadcast(vec![any], p.memo.as_deref())
        .await
    {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Instantiate a CosmWasm contract from a code ID")]
async fn wasm_instantiate(
    &self,
    params: Parameters<crate::tools::WasmInstantiateParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let funds: Vec<cosmos_sdk_proto::cosmos::base::v1beta1::Coin> = p
        .funds
        .as_ref()
        .map(|f| {
            f.iter()
                .map(|fi| cosmos_sdk_proto::cosmos::base::v1beta1::Coin {
                    denom: fi.denom.clone(),
                    amount: fi.amount.clone(),
                })
                .collect()
        })
        .unwrap_or_default();
    let msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgInstantiateContract {
        sender: signing.address().to_string(),
        admin: p.admin.clone().unwrap_or_default(),
        code_id: p.code_id,
        label: p.label.clone(),
        msg: serde_json::to_vec(&p.msg).unwrap(),
        funds,
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgInstantiateContract",
        &msg,
    );
    match signing
        .sign_and_broadcast(vec![any], p.memo.as_deref())
        .await
    {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Migrate a CosmWasm contract to a new code ID")]
async fn wasm_migrate(
    &self,
    params: Parameters<crate::tools::WasmMigrateParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgMigrateContract {
        sender: signing.address().to_string(),
        contract: p.contract.clone(),
        code_id: p.new_code_id,
        msg: serde_json::to_vec(&p.msg).unwrap(),
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgMigrateContract",
        &msg,
    );
    match signing
        .sign_and_broadcast(vec![any], p.memo.as_deref())
        .await
    {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Update the admin of a CosmWasm contract")]
async fn wasm_update_admin(
    &self,
    params: Parameters<crate::tools::WasmUpdateAdminParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgUpdateAdmin {
        sender: signing.address().to_string(),
        new_admin: p.new_admin.clone(),
        contract: p.contract.clone(),
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgUpdateAdmin",
        &msg,
    );
    match signing
        .sign_and_broadcast(vec![any], p.memo.as_deref())
        .await
    {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Clear the admin of a CosmWasm contract, making it immutable. WARNING: irreversible.")]
async fn wasm_clear_admin(
    &self,
    params: Parameters<crate::tools::WasmClearAdminParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = cosmos_sdk_proto::cosmwasm::wasm::v1::MsgClearAdmin {
        sender: signing.address().to_string(),
        contract: p.contract.clone(),
    };
    let any = crate::clients::signing::encode_any(
        "/cosmwasm.wasm.v1.MsgClearAdmin",
        &msg,
    );
    match signing
        .sign_and_broadcast(vec![any], p.memo.as_deref())
        .await
    {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

    // ── grid tools ──


#[tool(description = "Create an energy route to allocate VOLT/AMPERE to another address")]
async fn grid_create_route(
    &self,
    params: Parameters<crate::tools::GridCreateRouteParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = crate::proto::cyber::MsgCreateRoute {
        source: signing.address().to_string(),
        destination: p.destination.clone(),
        name: p.name.clone(),
    };
    let any = crate::clients::signing::encode_any(
        "/cyber.grid.v1beta1.MsgCreateRoute",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Edit an existing energy route's allocated value")]
async fn grid_edit_route(
    &self,
    params: Parameters<crate::tools::GridEditRouteParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let msg = crate::proto::cyber::MsgEditRoute {
        source: signing.address().to_string(),
        destination: p.destination.clone(),
        value: Some(crate::proto::cyber::Coin {
            denom: p.denom.clone(),
            amount: p.amount.clone(),
        }),
    };
    let any = crate::clients::signing::encode_any(
        "/cyber.grid.v1beta1.MsgEditRoute",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "Delete an energy route")]
async fn grid_delete_route(
    &self,
    params: Parameters<crate::tools::GridDeleteRouteParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let msg = crate::proto::cyber::MsgDeleteRoute {
        source: signing.address().to_string(),
        destination: params.0.destination.clone(),
    };
    let any = crate::clients::signing::encode_any(
        "/cyber.grid.v1beta1.MsgDeleteRoute",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "List all energy routes from an address")]
async fn grid_list_routes(
    &self,
    params: Parameters<crate::tools::GridListRoutesParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let source = if let Some(ref addr) = params.0.address {
        addr.clone()
    } else if let Some(ref signing) = self.signing {
        signing.address().to_string()
    } else {
        return Ok(crate::util::err(
            "Provide an address or set BOSTROM_MNEMONIC for wallet address",
        ));
    };
    let path = format!("/cyber/grid/v1beta1/grid/source_routes?source={source}");
    match self.lcd.get_json(&path).await {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

    // ── ibc tools ──


#[tool(description = "Transfer tokens to another chain via IBC")]
async fn ibc_transfer(
    &self,
    params: Parameters<crate::tools::IbcTransferParams>,
) -> Result<CallToolResult, rmcp::ErrorData> {
    let signing = self.require_signing()?;
    let p = &params.0;
    let timeout_minutes = p.timeout_minutes.unwrap_or(10).min(1440).max(1);
    let timeout_ns =
        (std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos() as u64)
            + (timeout_minutes * 60 * 1_000_000_000);

    let msg = crate::proto::cyber::MsgTransfer {
        source_port: "transfer".to_string(),
        source_channel: p.channel.clone(),
        token: Some(crate::proto::cyber::Coin {
            denom: p.denom.clone(),
            amount: p.amount.clone(),
        }),
        sender: signing.address().to_string(),
        receiver: p.receiver.clone(),
        timeout_height: Some(crate::proto::cyber::Height {
            revision_number: 0,
            revision_height: 0,
        }),
        timeout_timestamp: timeout_ns,
        memo: String::new(),
    };
    let any = crate::clients::signing::encode_any(
        "/ibc.applications.transfer.v1.MsgTransfer",
        &msg,
    );
    match signing.sign_and_broadcast(vec![any], None).await {
        Ok(result) => Ok(crate::util::ok(&serde_json::to_value(&result).unwrap())),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}

#[tool(description = "List active IBC channels with counterparty info")]
async fn ibc_channels(&self) -> Result<CallToolResult, rmcp::ErrorData> {
    match self
        .lcd
        .get_json("/ibc/core/channel/v1/channels?pagination.limit=100")
        .await
    {
        Ok(data) => Ok(crate::util::ok(&data)),
        Err(e) => Ok(crate::util::err(&e.to_string())),
    }
}
}

impl BostromMcp {
    pub async fn from_env() -> anyhow::Result<Self> {
        let lcd_url = std::env::var("BOSTROM_LCD").unwrap_or_else(|_| LCD_DEFAULT.to_string());
        let rpc_url = std::env::var("BOSTROM_RPC").unwrap_or_else(|_| RPC_DEFAULT.to_string());
        let graphql_url =
            std::env::var("BOSTROM_GRAPHQL").unwrap_or_else(|_| GRAPHQL_DEFAULT.to_string());
        let ipfs_gateway = std::env::var("BOSTROM_IPFS_GATEWAY")
            .unwrap_or_else(|_| IPFS_GATEWAY_DEFAULT.to_string());
        let ipfs_api =
            std::env::var("BOSTROM_IPFS_API").unwrap_or_else(|_| IPFS_API_DEFAULT.to_string());

        let lcd = LcdClient::new(&lcd_url);
        let rpc = RpcClient::new(&rpc_url);
        let graphql = GraphqlClient::new(&graphql_url);
        let ipfs = IpfsClient::new(&ipfs_gateway, &ipfs_api);

        let signing = if let Ok(mnemonic) = std::env::var("BOSTROM_MNEMONIC") {
            let gas_price: f64 = std::env::var("BOSTROM_GAS_PRICE")
                .ok()
                .and_then(|s| s.replace("boot", "").parse().ok())
                .unwrap_or(0.01);
            let gas_multiplier: f64 = std::env::var("BOSTROM_GAS_MULTIPLIER")
                .ok()
                .and_then(|s| s.parse().ok())
                .unwrap_or(1.4);
            let min_gas: u64 = std::env::var("BOSTROM_MIN_GAS")
                .ok()
                .and_then(|s| s.parse().ok())
                .unwrap_or(100_000);
            let max_send: Option<u64> = std::env::var("BOSTROM_MAX_SEND_AMOUNT")
                .ok()
                .and_then(|s| s.parse().ok());

            Some(SigningClient::from_mnemonic(
                &mnemonic,
                lcd.clone(),
                &rpc_url,
                gas_price,
                gas_multiplier,
                min_gas,
                max_send,
            )?)
        } else {
            tracing::warn!("BOSTROM_MNEMONIC not set — write tools disabled");
            None
        };

        Ok(Self::new(lcd, rpc, graphql, ipfs, signing))
    }
}

#[tool_handler]
impl ServerHandler for BostromMcp {
    fn get_info(&self) -> ServerInfo {
        ServerInfo::new(
            ServerCapabilities::builder().enable_tools().build()
        )
        .with_server_info(Implementation::new("bostrom-mcp", env!("CARGO_PKG_VERSION")))
        .with_instructions(
            "Bostrom blockchain MCP server. Write tools require BOSTROM_MNEMONIC env var."
        )
    }
}
