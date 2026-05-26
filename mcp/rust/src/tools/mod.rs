// Parameter structs for all tool categories.
// Handler methods are in server.rs within the #[tool_router] impl block.

use rmcp::schemars::{self, JsonSchema};
use serde::Deserialize;

// ── Infra params ──

#[derive(Deserialize, JsonSchema)]
pub struct TxSearchParams {
    #[schemars(description = "Filter by sender address")]
    pub sender: Option<String>,
    #[schemars(description = "Filter by contract address")]
    pub contract: Option<String>,
    #[schemars(description = "Filter by message type (e.g. /cosmos.bank.v1beta1.MsgSend)")]
    pub message_type: Option<String>,
    #[schemars(description = "Max results to return (1-50)")]
    pub limit: Option<u64>,
    #[schemars(description = "Offset for pagination")]
    pub offset: Option<u64>,
}

#[derive(Deserialize, JsonSchema)]
pub struct TxDetailParams {
    #[schemars(description = "Transaction hash")]
    pub txhash: String,
}

// ── Economy params ──

#[derive(Deserialize, JsonSchema)]
pub struct AddressParam {
    #[schemars(description = "Bostrom address (bostrom1...)")]
    pub address: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct DenomParam {
    #[schemars(description = "Token denomination (e.g. boot, hydrogen, millivolt, milliampere)")]
    pub denom: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct StakingParams {
    #[schemars(description = "Bostrom address to check staking info for")]
    pub address: String,
}

// ── Governance params ──

#[derive(Deserialize, JsonSchema)]
pub struct GovProposalsParams {
    #[schemars(description = "Filter by status: PROPOSAL_STATUS_VOTING_PERIOD, PROPOSAL_STATUS_PASSED, PROPOSAL_STATUS_REJECTED, PROPOSAL_STATUS_DEPOSIT_PERIOD, or all")]
    pub status: Option<String>,
    #[schemars(description = "Max results (1-50, default 10)")]
    pub limit: Option<u64>,
}

#[derive(Deserialize, JsonSchema)]
pub struct ProposalDetailParams {
    #[schemars(description = "Proposal ID")]
    pub proposal_id: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct ValidatorsParams {
    #[schemars(description = "Validator status: BOND_STATUS_BONDED (default), BOND_STATUS_UNBONDED, BOND_STATUS_UNBONDING")]
    pub status: Option<String>,
    #[schemars(description = "Max results (1-200, default 50)")]
    pub limit: Option<u64>,
}

#[derive(Deserialize, JsonSchema)]
pub struct GovParamsParam {
    #[schemars(description = "Module name: staking, slashing, gov, distribution, or mint")]
    pub module: String,
}

// ── Graph params ──

#[derive(Deserialize, JsonSchema)]
pub struct GraphSearchParams {
    #[schemars(description = "Particle CID to search for")]
    pub particle: Option<String>,
    #[schemars(description = "Neuron address to search for")]
    pub neuron: Option<String>,
    #[schemars(description = "Max results (1-100, default 20)")]
    pub limit: Option<u64>,
    #[schemars(description = "Offset for pagination")]
    pub offset: Option<u64>,
}

#[derive(Deserialize, JsonSchema)]
pub struct ParticleParam {
    #[schemars(description = "Particle CID")]
    pub particle: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct CidParam {
    #[schemars(description = "IPFS content identifier (CID)")]
    pub cid: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct RecentLinksParams {
    #[schemars(description = "Max results (1-100, default 20)")]
    pub limit: Option<u64>,
}

// ── Graph write params ──

#[derive(Deserialize, JsonSchema)]
pub struct CreateCyberlinkParams {
    #[schemars(description = "Source CID (from particle)")]
    pub from_cid: String,
    #[schemars(description = "Destination CID (to particle)")]
    pub to_cid: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct LinkItem {
    pub from: String,
    pub to: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct CreateCyberlinksParams {
    #[schemars(description = "Array of links to create (1-64). Each link has 'from' and 'to' CID fields.")]
    pub links: Vec<LinkItem>,
}

#[derive(Deserialize, JsonSchema)]
pub struct InvestmintParams {
    #[schemars(description = "Amount of HYDROGEN to investmint")]
    pub amount: String,
    #[schemars(description = "Resource type: millivolt or milliampere")]
    pub resource: String,
    #[schemars(description = "Lock period length in cycles (minimum 1)")]
    pub length: u64,
}

#[derive(Deserialize, JsonSchema)]
pub struct PinContentParams {
    #[schemars(description = "Text content to pin (1-100000 chars)")]
    pub content: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct CreateKnowledgeParams {
    #[schemars(description = "Text content to pin to IPFS (1-100000 chars)")]
    pub content: String,
    #[schemars(description = "Optional source CID to link FROM")]
    pub from_cid: Option<String>,
    #[schemars(description = "Optional destination CID to link TO")]
    pub to_cid: Option<String>,
}

// ── Lithium params ──

#[derive(Deserialize, JsonSchema)]
pub struct ContractParam {
    #[schemars(description = "Contract address (optional, defaults to canonical contract)")]
    pub contract: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct MinerStatsParams {
    #[schemars(description = "Miner address")]
    pub address: String,
    #[schemars(description = "Mine contract address (optional)")]
    pub contract: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct RecentProofsParams {
    #[schemars(description = "Max results (1-50, default 10)")]
    pub limit: Option<u64>,
    #[schemars(description = "Mine contract address (optional)")]
    pub contract: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct StakeInfoParams {
    #[schemars(description = "Staker address")]
    pub address: String,
    #[schemars(description = "Stake contract address (optional)")]
    pub contract: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct ReferrerOfParams {
    #[schemars(description = "Miner address")]
    pub miner: String,
    #[schemars(description = "Refer contract address (optional)")]
    pub contract: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct ReferralInfoParams {
    #[schemars(description = "Referrer address")]
    pub address: String,
    #[schemars(description = "Refer contract address (optional)")]
    pub contract: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct RewardEstimateParams {
    #[schemars(description = "Difficulty bits for reward estimation (minimum 1)")]
    pub difficulty_bits: u64,
    #[schemars(description = "Mine contract address (optional)")]
    pub contract: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct MinerTxHistoryParams {
    #[schemars(description = "Miner address")]
    pub address: String,
    #[schemars(description = "Max results (1-50, default 20)")]
    pub limit: Option<u64>,
}

// ── Lithium write params ──

#[derive(Deserialize, JsonSchema)]
pub struct SubmitProofParams {
    #[schemars(description = "Proof hash (hex string)")]
    pub hash: String,
    #[schemars(description = "Nonce that produces the valid proof")]
    pub nonce: u64,
    #[schemars(description = "Miner address")]
    pub miner_address: String,
    #[schemars(description = "Challenge hex string (32 bytes)")]
    pub challenge: String,
    #[schemars(description = "Difficulty in bits")]
    pub difficulty: u32,
    #[schemars(description = "Timestamp (unix seconds)")]
    pub timestamp: u64,
    #[schemars(description = "Optional referrer address")]
    pub referrer: Option<String>,
    #[schemars(description = "Mine contract address (optional)")]
    pub contract: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct LiStakeParams {
    #[schemars(description = "Amount of LI tokens to stake")]
    pub amount: String,
    #[schemars(description = "Stake contract address (optional)")]
    pub contract: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct LiUnstakeParams {
    #[schemars(description = "Amount of LI tokens to unstake")]
    pub amount: String,
    #[schemars(description = "Stake contract address (optional)")]
    pub contract: Option<String>,
}

// ── Wallet params ──

#[derive(Deserialize, JsonSchema)]
pub struct SendParams {
    #[schemars(description = "Recipient address")]
    pub to: String,
    #[schemars(description = "Amount to send")]
    pub amount: String,
    #[schemars(description = "Token denomination (default: boot)")]
    pub denom: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct DelegateParams {
    #[schemars(description = "Validator address (bostromvaloper1...)")]
    pub validator: String,
    #[schemars(description = "Amount to delegate")]
    pub amount: String,
    #[schemars(description = "Token denomination (default: boot)")]
    pub denom: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct RedelegateParams {
    #[schemars(description = "Source validator address")]
    pub src_validator: String,
    #[schemars(description = "Destination validator address")]
    pub dst_validator: String,
    #[schemars(description = "Amount to redelegate")]
    pub amount: String,
    #[schemars(description = "Token denomination (default: boot)")]
    pub denom: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct ClaimRewardsParams {
    #[schemars(description = "Validator address (optional — if not specified, claims from all)")]
    pub validator: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct VoteParams {
    #[schemars(description = "Proposal ID")]
    pub proposal_id: u64,
    #[schemars(description = "Vote option: yes, no, abstain, or no_with_veto")]
    pub option: String,
}

// ── TokenFactory params ──

#[derive(Deserialize, JsonSchema)]
pub struct CreateDenomParams {
    #[schemars(description = "Subdenom name (1-44 characters)")]
    pub subdenom: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct SetDenomMetadataParams {
    #[schemars(description = "Full denom string (e.g. factory/bostrom1.../mytoken)")]
    pub denom: String,
    #[schemars(description = "Human-readable name")]
    pub name: String,
    #[schemars(description = "Token symbol")]
    pub symbol: String,
    #[schemars(description = "Token description")]
    pub description: String,
    #[schemars(description = "Display exponent (0-18, default 0)")]
    pub exponent: Option<u32>,
}

#[derive(Deserialize, JsonSchema)]
pub struct MintTokenParams {
    #[schemars(description = "Full denom string")]
    pub denom: String,
    #[schemars(description = "Amount to mint")]
    pub amount: String,
    #[schemars(description = "Address to mint to")]
    pub mint_to: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct BurnTokenParams {
    #[schemars(description = "Full denom string")]
    pub denom: String,
    #[schemars(description = "Amount to burn")]
    pub amount: String,
    #[schemars(description = "Address to burn from")]
    pub burn_from: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct ChangeAdminParams {
    #[schemars(description = "Full denom string")]
    pub denom: String,
    #[schemars(description = "New admin address")]
    pub new_admin: String,
}

// ── Liquidity params ──

#[derive(Deserialize, JsonSchema)]
pub struct CreatePoolParams {
    #[schemars(description = "First token denomination")]
    pub denom_a: String,
    #[schemars(description = "Amount of first token")]
    pub amount_a: String,
    #[schemars(description = "Second token denomination")]
    pub denom_b: String,
    #[schemars(description = "Amount of second token")]
    pub amount_b: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct DepositParams {
    #[schemars(description = "Pool ID")]
    pub pool_id: u64,
    #[schemars(description = "First token denomination")]
    pub denom_a: String,
    #[schemars(description = "Amount of first token")]
    pub amount_a: String,
    #[schemars(description = "Second token denomination")]
    pub denom_b: String,
    #[schemars(description = "Amount of second token")]
    pub amount_b: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct WithdrawParams {
    #[schemars(description = "Pool ID")]
    pub pool_id: u64,
    #[schemars(description = "Amount of pool coins to withdraw")]
    pub pool_coin_amount: String,
    #[schemars(description = "Pool coin denomination")]
    pub pool_coin_denom: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct LiquiditySwapParams {
    #[schemars(description = "Pool ID")]
    pub pool_id: u64,
    #[schemars(description = "Offer token denomination")]
    pub offer_denom: String,
    #[schemars(description = "Offer amount")]
    pub offer_amount: String,
    #[schemars(description = "Demand token denomination")]
    pub demand_denom: String,
    #[schemars(description = "Order price as decimal string")]
    pub order_price: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct SwapTokensParams {
    #[schemars(description = "Offer token denomination")]
    pub offer_denom: String,
    #[schemars(description = "Offer amount")]
    pub offer_amount: String,
    #[schemars(description = "Demand token denomination")]
    pub demand_denom: String,
    #[schemars(description = "Slippage tolerance percent (0-50, default 3)")]
    pub slippage_percent: Option<f64>,
}

#[derive(Deserialize, JsonSchema)]
pub struct SwapEstimateParams {
    #[schemars(description = "Offer token denomination")]
    pub offer_denom: String,
    #[schemars(description = "Offer amount")]
    pub offer_amount: String,
    #[schemars(description = "Demand token denomination")]
    pub demand_denom: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct PoolDetailParams {
    #[schemars(description = "Pool ID")]
    pub pool_id: u64,
}

// ── Contract params ──

#[derive(Deserialize, JsonSchema)]
pub struct ContractExecuteParams {
    #[schemars(description = "Contract address")]
    pub contract: String,
    #[schemars(description = "JSON message to execute")]
    pub msg: serde_json::Value,
    #[schemars(description = "Funds to send with execution [{denom, amount}]")]
    pub funds: Option<Vec<FundItem>>,
    #[schemars(description = "Optional memo")]
    pub memo: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct FundItem {
    pub denom: String,
    pub amount: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct OperationItem {
    pub contract: String,
    pub msg: serde_json::Value,
    pub funds: Option<Vec<FundItem>>,
}

#[derive(Deserialize, JsonSchema)]
pub struct ContractExecuteMultiParams {
    #[schemars(description = "Array of operations (1-32). Each has contract, msg, and optional funds.")]
    pub operations: Vec<OperationItem>,
    #[schemars(description = "Optional memo")]
    pub memo: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct WasmUploadParams {
    #[schemars(description = "Path to .wasm file")]
    pub file_path: String,
    #[schemars(description = "Optional memo")]
    pub memo: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct WasmInstantiateParams {
    #[schemars(description = "Code ID to instantiate")]
    pub code_id: u64,
    #[schemars(description = "Instantiation message (JSON)")]
    pub msg: serde_json::Value,
    #[schemars(description = "Contract label")]
    pub label: String,
    #[schemars(description = "Funds to send [{denom, amount}]")]
    pub funds: Option<Vec<FundItem>>,
    #[schemars(description = "Admin address (optional)")]
    pub admin: Option<String>,
    #[schemars(description = "Optional memo")]
    pub memo: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct WasmMigrateParams {
    #[schemars(description = "Contract address")]
    pub contract: String,
    #[schemars(description = "New code ID")]
    pub new_code_id: u64,
    #[schemars(description = "Migration message (JSON)")]
    pub msg: serde_json::Value,
    #[schemars(description = "Optional memo")]
    pub memo: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct WasmUpdateAdminParams {
    #[schemars(description = "Contract address")]
    pub contract: String,
    #[schemars(description = "New admin address")]
    pub new_admin: String,
    #[schemars(description = "Optional memo")]
    pub memo: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
pub struct WasmClearAdminParams {
    #[schemars(description = "Contract address")]
    pub contract: String,
    #[schemars(description = "Optional memo")]
    pub memo: Option<String>,
}

// ── Grid params ──

#[derive(Deserialize, JsonSchema)]
pub struct GridCreateRouteParams {
    #[schemars(description = "Destination address for the energy route")]
    pub destination: String,
    #[schemars(description = "Route name")]
    pub name: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct GridEditRouteParams {
    #[schemars(description = "Destination address")]
    pub destination: String,
    #[schemars(description = "Amount to allocate")]
    pub amount: String,
    #[schemars(description = "Token denomination (millivolt or milliampere)")]
    pub denom: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct GridDeleteRouteParams {
    #[schemars(description = "Destination address of route to delete")]
    pub destination: String,
}

#[derive(Deserialize, JsonSchema)]
pub struct GridListRoutesParams {
    #[schemars(description = "Source address (optional, defaults to wallet address)")]
    pub address: Option<String>,
}

// ── IBC params ──

#[derive(Deserialize, JsonSchema)]
pub struct IbcTransferParams {
    #[schemars(description = "IBC channel ID (e.g. channel-0)")]
    pub channel: String,
    #[schemars(description = "Token denomination")]
    pub denom: String,
    #[schemars(description = "Amount to transfer")]
    pub amount: String,
    #[schemars(description = "Receiver address on the destination chain")]
    pub receiver: String,
    #[schemars(description = "Timeout in minutes (1-1440, default 10)")]
    pub timeout_minutes: Option<u64>,
}

// ── Mining params ──

#[derive(Deserialize, JsonSchema)]
pub struct MineProofParams {
    #[schemars(description = "Mining difficulty in leading zero bits (1-256)")]
    pub difficulty: u32,
    #[schemars(description = "Timeout in seconds (default 30, max 300)")]
    pub timeout_seconds: Option<u64>,
    #[schemars(description = "Batch size per solver iteration (default 65536)")]
    pub batch_size: Option<usize>,
    #[schemars(description = "Auto-submit proof on-chain if found (default false, requires BOSTROM_MNEMONIC)")]
    pub auto_submit: Option<bool>,
    #[schemars(description = "Referrer address for mining rewards")]
    pub referrer: Option<String>,
    #[schemars(description = "Mine contract address (optional, defaults to canonical contract)")]
    pub contract: Option<String>,
}
