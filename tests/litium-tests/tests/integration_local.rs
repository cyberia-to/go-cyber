// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_std::{
    coins, Addr, CosmosMsg, DepsMut, Empty, Env, MessageInfo, Response, SubMsg, Uint128,
};
use cw20::{BalanceResponse as Cw20BalanceResponse, Cw20QueryMsg};
use cw_multi_test::{AppResponse, Contract, ContractWrapper, Executor};
use cyber_std::CyberMsg;
use cyber_std_test::CyberApp;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::Once;

static UHASH_BUILD_ONCE: Once = Once::new();

#[derive(Debug, Clone)]
struct SuiteContracts {
    core: Addr,
    mine: Addr,
}

// ============================================================
// Contract wrappers for multi-test
// ============================================================

fn core_contract() -> Box<dyn Contract<CyberMsg, Empty>> {
    Box::new(ContractWrapper::new_with_empty(
        litium_core::contract::execute,
        litium_core::contract::instantiate,
        litium_core::contract::query,
    ))
}

fn mine_contract() -> Box<dyn Contract<CyberMsg, Empty>> {
    Box::new(ContractWrapper::new(
        mine_execute,
        mine_instantiate,
        litium_mine::contract::query,
    ))
}

fn stake_contract() -> Box<dyn Contract<CyberMsg, Empty>> {
    Box::new(ContractWrapper::new(
        stake_execute,
        stake_instantiate,
        litium_stake::contract::query,
    ))
}

fn refer_contract() -> Box<dyn Contract<CyberMsg, Empty>> {
    Box::new(ContractWrapper::new(
        refer_execute,
        refer_instantiate,
        litium_refer::contract::query,
    ))
}

fn wrap_contract() -> Box<dyn Contract<CyberMsg, Empty>> {
    Box::new(ContractWrapper::new(
        litium_wrap::contract::execute,
        litium_wrap::contract::instantiate,
        litium_wrap::contract::query,
    ))
}

fn map_msg(msg: CosmosMsg<Empty>) -> CosmosMsg<CyberMsg> {
    match msg {
        CosmosMsg::Bank(v) => CosmosMsg::Bank(v),
        CosmosMsg::Wasm(v) => CosmosMsg::Wasm(v),
        CosmosMsg::Staking(v) => CosmosMsg::Staking(v),
        CosmosMsg::Distribution(v) => CosmosMsg::Distribution(v),
        CosmosMsg::Custom(_) => unreachable!("empty custom message should not be present"),
        _ => unreachable!("unsupported cosmos message variant in test adapter"),
    }
}

fn map_response(resp: Response<Empty>) -> Response<CyberMsg> {
    let mapped_submsgs: Vec<SubMsg<CyberMsg>> = resp
        .messages
        .into_iter()
        .map(|m| SubMsg {
            id: m.id,
            msg: map_msg(m.msg),
            gas_limit: m.gas_limit,
            reply_on: m.reply_on,
        })
        .collect();

    let mut out = Response::<CyberMsg>::new()
        .add_submessages(mapped_submsgs)
        .add_attributes(resp.attributes)
        .add_events(resp.events);
    if let Some(data) = resp.data {
        out = out.set_data(data);
    }
    out
}

fn mine_execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: litium_mine::msg::ExecuteMsg,
) -> Result<Response<CyberMsg>, litium_mine::ContractError> {
    Ok(map_response(litium_mine::contract::execute(
        deps, env, info, msg,
    )?))
}

fn mine_instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: litium_mine::msg::InstantiateMsg,
) -> Result<Response<CyberMsg>, litium_mine::ContractError> {
    Ok(map_response(litium_mine::contract::instantiate(
        deps, env, info, msg,
    )?))
}

fn stake_execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: litium_stake::msg::ExecuteMsg,
) -> Result<Response<CyberMsg>, litium_stake::ContractError> {
    Ok(map_response(litium_stake::contract::execute(
        deps, env, info, msg,
    )?))
}

fn stake_instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: litium_stake::msg::InstantiateMsg,
) -> Result<Response<CyberMsg>, litium_stake::ContractError> {
    Ok(map_response(litium_stake::contract::instantiate(
        deps, env, info, msg,
    )?))
}

fn refer_execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: litium_refer::msg::ExecuteMsg,
) -> Result<Response<CyberMsg>, litium_refer::ContractError> {
    Ok(map_response(litium_refer::contract::execute(
        deps, env, info, msg,
    )?))
}

fn refer_instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: litium_refer::msg::InstantiateMsg,
) -> Result<Response<CyberMsg>, litium_refer::ContractError> {
    Ok(map_response(litium_refer::contract::instantiate(
        deps, env, info, msg,
    )?))
}

// ============================================================
// Suite builder
// ============================================================

fn build_suite() -> (CyberApp, SuiteContracts) {
    let admin = Addr::unchecked("admin");
    let mut app = CyberApp::new();
    app.init_modules(|router, _, storage| {
        router
            .bank
            .init_balance(storage, &admin, coins(1_000_000_000, "boot"))
            .unwrap();
    });

    let core_id = app.store_code(core_contract());
    let mine_id = app.store_code(mine_contract());
    let stake_id = app.store_code(stake_contract());
    let refer_id = app.store_code(refer_contract());
    let wrap_id = app.store_code(wrap_contract());

    let core = app
        .instantiate_contract(
            core_id,
            admin.clone(),
            &litium_core::msg::InstantiateMsg {
                name: "Litium".to_string(),
                symbol: "LI".to_string(),
                decimals: 6,
                admin: None,
                mine_contract: None,
                stake_contract: None,
                refer_contract: None,
                wrap_contract: None,
            },
            &[],
            "litium-core",
            None,
        )
        .unwrap();

    let stake = app
        .instantiate_contract(
            stake_id,
            admin.clone(),
            &litium_stake::msg::InstantiateMsg {
                core_contract: core.to_string(),
                mine_contract: admin.to_string(),
                token_contract: core.to_string(),
                unbonding_period_seconds: Some(1_814_400),
                admin: None,
            },
            &[],
            "litium-stake",
            None,
        )
        .unwrap();

    let refer = app
        .instantiate_contract(
            refer_id,
            admin.clone(),
            &litium_refer::msg::InstantiateMsg {
                core_contract: core.to_string(),
                mine_contract: admin.to_string(),
                community_pool_addr: None,
                admin: None,
            },
            &[],
            "litium-refer",
            None,
        )
        .unwrap();

    let genesis = app.block_info().time.seconds();
    let mine = app
        .instantiate_contract(
            mine_id,
            admin.clone(),
            &litium_mine::msg::InstantiateMsg {
                max_proof_age: 3_600,
                estimated_gas_cost_uboot: Some(Uint128::from(250_000u128)),
                core_contract: core.to_string(),
                stake_contract: stake.to_string(),
                refer_contract: refer.to_string(),
                token_contract: core.to_string(),
                admin: None,
                window_size: Some(100),
                pid_interval: Some(10),
                min_difficulty: Some(1),
                warmup_base_rate: Uint128::from(1_000_000u128),
                fee_bucket_duration: None,
                fee_num_buckets: None,
                genesis_time: Some(genesis),
            },
            &[],
            "litium-mine",
            None,
        )
        .unwrap();

    app.execute_contract(
        admin.clone(),
        stake.clone(),
        &litium_stake::msg::ExecuteMsg::UpdateConfig {
            core_contract: None,
            mine_contract: Some(mine.to_string()),
            token_contract: None,
            unbonding_period_seconds: None,
            admin: None,
        },
        &[],
    )
    .unwrap();

    app.execute_contract(
        admin.clone(),
        refer.clone(),
        &litium_refer::msg::ExecuteMsg::UpdateConfig {
            core_contract: None,
            mine_contract: Some(mine.to_string()),
            community_pool_addr: None,
            admin: None,
        },
        &[],
    )
    .unwrap();

    for caller in [&mine, &stake, &refer] {
        app.execute_contract(
            admin.clone(),
            core.clone(),
            &litium_core::msg::ExecuteMsg::RegisterAuthorizedCaller {
                contract_addr: caller.to_string(),
            },
            &[],
        )
        .unwrap();
    }

    let wrap = app
        .instantiate_contract(
            wrap_id,
            admin.clone(),
            &litium_wrap::msg::InstantiateMsg {
                cw20_contract: core.to_string(),
                token_subdenom: "li".to_string(),
                admin: None,
            },
            &[],
            "litium-wrap",
            None,
        )
        .unwrap();

    app.execute_contract(
        admin.clone(),
        core.clone(),
        &litium_core::msg::ExecuteMsg::RegisterAuthorizedCaller {
            contract_addr: wrap.to_string(),
        },
        &[],
    )
    .unwrap();

    app.execute_contract(
        admin,
        core.clone(),
        &litium_core::msg::ExecuteMsg::UpdateConfig {
            admin: None,
            mine_contract: Some(mine.to_string()),
            stake_contract: Some(stake.to_string()),
            refer_contract: Some(refer.to_string()),
            wrap_contract: Some(wrap.to_string()),
        },
        &[],
    )
    .unwrap();

    (app, SuiteContracts { core, mine })
}

// ============================================================
// uhash CLI helpers
// ============================================================

fn uhash_manifest_path() -> PathBuf {
    if let Ok(p) = std::env::var("UHASH_CLI_MANIFEST_PATH") {
        return PathBuf::from(p);
    }
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../../universal-hash/Cargo.toml")
        .to_path_buf()
}

fn uhash_bin_path() -> PathBuf {
    if let Ok(p) = std::env::var("UHASH_CLI_BIN") {
        return PathBuf::from(p);
    }
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../../../universal-hash/target/debug/uhash")
        .to_path_buf()
}

fn ensure_uhash_cli_built() {
    UHASH_BUILD_ONCE.call_once(|| {
        let output = Command::new("cargo")
            .arg("build")
            .arg("-p")
            .arg("uhash-cli")
            .arg("--manifest-path")
            .arg(uhash_manifest_path())
            .output()
            .expect("failed to run cargo build for uhash-cli");
        assert!(
            output.status.success(),
            "failed to build uhash-cli\nstdout:\n{}\nstderr:\n{}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        );
    });
}

fn extract_json_string_field(s: &str, field: &str) -> String {
    let marker = format!("\"{field}\":\"");
    let start = s
        .find(&marker)
        .unwrap_or_else(|| panic!("field `{field}` not found in JSON: {s}"));
    let value_start = start + marker.len();
    let end = s[value_start..]
        .find('"')
        .expect("unterminated string value");
    s[value_start..value_start + end].to_string()
}

fn extract_json_u64_field(s: &str, field: &str) -> u64 {
    let marker = format!("\"{field}\":");
    let start = s
        .find(&marker)
        .unwrap_or_else(|| panic!("field `{field}` not found in JSON: {s}"));
    let value_start = start + marker.len();
    let trimmed = s[value_start..].trim_start();
    let end = trimmed
        .find(|c: char| !c.is_ascii_digit())
        .unwrap_or(trimmed.len());
    trimmed[..end]
        .parse()
        .unwrap_or_else(|e| panic!("bad u64 for `{field}`: {e}"))
}

/// Use uhash CLI to find a proof meeting the given difficulty.
fn prove_in_range_via_uhash_cli(
    challenge: &[u8; 32],
    difficulty: u32,
    start_nonce: u64,
    max_attempts: u64,
) -> Option<(u64, String)> {
    ensure_uhash_cli_built();
    let challenge_hex = hex::encode(challenge);
    let output = Command::new(uhash_bin_path())
        .args([
            "prove",
            "--challenge",
            &challenge_hex,
            "--difficulty",
            &difficulty.to_string(),
            "--start-nonce",
            &start_nonce.to_string(),
            "--max-attempts",
            &max_attempts.to_string(),
            "--json",
        ])
        .output()
        .expect("failed to run uhash prove");

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        eprintln!("uhash prove failed: {stderr}");
        return None;
    }
    let out_str = String::from_utf8(output.stdout).unwrap();
    if out_str.contains("\"found\":false") || out_str.contains("\"found\": false") {
        return None;
    }
    let nonce = extract_json_u64_field(&out_str, "nonce");
    let hash_hex = extract_json_string_field(&out_str, "hash");
    Some((nonce, hash_hex))
}

/// Helper: generate a challenge from an arbitrary seed.
fn challenge_from_seed(seed: u64) -> [u8; 32] {
    let mut challenge = [0u8; 32];
    let bytes = seed.to_le_bytes();
    challenge[..8].copy_from_slice(&bytes);
    challenge
}

/// Submit a valid proof to the mine contract.
fn submit_valid_proof(
    app: &mut CyberApp,
    suite: &SuiteContracts,
    miner: &Addr,
    challenge: &[u8; 32],
    difficulty: u32,
    referrer: Option<String>,
) -> anyhow::Result<AppResponse> {
    let (nonce, hash_hex) = prove_in_range_via_uhash_cli(challenge, difficulty, 0, 100_000_000)
        .expect("failed to find proof");

    let block_time = app.block_info().time.seconds();

    app.execute_contract(
        miner.clone(),
        suite.mine.clone(),
        &litium_mine::msg::ExecuteMsg::SubmitProof {
            hash: hash_hex,
            nonce,
            miner_address: miner.to_string(),
            challenge: hex::encode(challenge),
            difficulty,
            timestamp: block_time,
            referrer,
        },
        &[],
    )
}

fn query_cw20_balance(app: &CyberApp, core: &Addr, address: &str) -> Uint128 {
    let resp: Cw20BalanceResponse = app
        .wrap()
        .query_wasm_smart(
            core.to_string(),
            &Cw20QueryMsg::Balance {
                address: address.to_string(),
            },
        )
        .unwrap();
    resp.balance
}

// ============================================================
// Tests
// ============================================================

#[test]
fn local_config_mining_flow_works_without_chain_deploy() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");
    let challenge = challenge_from_seed(42);

    // Submit a proof with min difficulty
    let res = submit_valid_proof(&mut app, &suite, &miner, &challenge, 1, None);
    assert!(res.is_ok(), "proof submission failed: {:?}", res.err());

    // Check miner got rewards
    let miner_bal = query_cw20_balance(&app, &suite.core, miner.as_str());
    assert!(miner_bal > Uint128::zero(), "miner should have rewards");

    // Check stats
    let stats: litium_mine::msg::StatsResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::Stats {},
        )
        .unwrap();
    assert_eq!(stats.total_proofs, 1);
    assert!(stats.total_rewards > Uint128::zero());
}

#[test]
fn local_config_query_works() {
    let (app, suite) = build_suite();

    let cfg: litium_mine::msg::ConfigResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::Config {},
        )
        .unwrap();
    assert_eq!(cfg.window_size, 100);
    assert_eq!(cfg.pid_interval, 10);
    assert_eq!(cfg.min_difficulty, 1);
    assert!(!cfg.paused);
    assert_eq!(cfg.alpha, 500_000); // 0.5
    assert_eq!(cfg.beta, 0);
}

#[test]
fn local_window_status_query_works() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    let ws: litium_mine::msg::WindowStatusResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::WindowStatus {},
        )
        .unwrap();
    assert_eq!(ws.proof_count, 0);
    assert_eq!(ws.window_entries, 0);

    // Submit a proof
    let challenge = challenge_from_seed(100);
    submit_valid_proof(&mut app, &suite, &miner, &challenge, 1, None).unwrap();

    let ws: litium_mine::msg::WindowStatusResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::WindowStatus {},
        )
        .unwrap();
    assert_eq!(ws.proof_count, 1);
    assert_eq!(ws.window_entries, 1);
}

#[test]
fn local_client_chosen_difficulty_scales_reward() {
    let (mut app, suite) = build_suite();
    let miner_low = Addr::unchecked("miner_low");
    let miner_high = Addr::unchecked("miner_high");

    // Submit with difficulty=1
    let challenge1 = challenge_from_seed(200);
    submit_valid_proof(&mut app, &suite, &miner_low, &challenge1, 1, None).unwrap();
    let bal_low = query_cw20_balance(&app, &suite.core, miner_low.as_str());

    // Submit with difficulty=2 (reward should be roughly 2x)
    let challenge2 = challenge_from_seed(201);
    submit_valid_proof(&mut app, &suite, &miner_high, &challenge2, 2, None).unwrap();
    let bal_high = query_cw20_balance(&app, &suite.core, miner_high.as_str());

    // During warmup, reward = warmup_base_rate * d
    // So d=2 should get ~2x reward of d=1
    assert!(
        bal_high > bal_low,
        "higher difficulty should earn more: low={bal_low}, high={bal_high}"
    );
}

#[test]
fn local_duplicate_proof_hash_rejected() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");
    let challenge = challenge_from_seed(300);

    let (nonce, hash_hex) =
        prove_in_range_via_uhash_cli(&challenge, 1, 0, 100_000_000).expect("find proof");

    let block_time = app.block_info().time.seconds();

    // First submission should succeed
    app.execute_contract(
        miner.clone(),
        suite.mine.clone(),
        &litium_mine::msg::ExecuteMsg::SubmitProof {
            hash: hash_hex.clone(),
            nonce,
            miner_address: miner.to_string(),
            challenge: hex::encode(challenge),
            difficulty: 1,
            timestamp: block_time,
            referrer: None,
        },
        &[],
    )
    .unwrap();

    // Same proof again should fail (duplicate hash)
    let err = app
        .execute_contract(
            miner.clone(),
            suite.mine.clone(),
            &litium_mine::msg::ExecuteMsg::SubmitProof {
                hash: hash_hex,
                nonce,
                miner_address: miner.to_string(),
                challenge: hex::encode(challenge),
                difficulty: 1,
                timestamp: block_time,
                referrer: None,
            },
            &[],
        )
        .unwrap_err();
    assert!(
        err.root_cause().to_string().contains("Duplicate proof"),
        "expected duplicate proof error, got: {err}"
    );
}

#[test]
fn local_below_min_difficulty_rejected() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    // Set min_difficulty to 4
    let admin = Addr::unchecked("admin");
    app.execute_contract(
        admin,
        suite.mine.clone(),
        &litium_mine::msg::ExecuteMsg::UpdateConfig {
            max_proof_age: None,
            admin: None,
            estimated_gas_cost_uboot: None,
            core_contract: None,
            stake_contract: None,
            refer_contract: None,
            min_difficulty: Some(4),
            warmup_base_rate: None,
            pid_interval: None,
            genesis_time: None,
        },
        &[],
    )
    .unwrap();

    // Try to submit with difficulty=1 (below min=4)
    let challenge = challenge_from_seed(400);
    let (nonce, hash_hex) =
        prove_in_range_via_uhash_cli(&challenge, 1, 0, 100_000_000).expect("find proof");
    let block_time = app.block_info().time.seconds();

    let err = app
        .execute_contract(
            miner.clone(),
            suite.mine.clone(),
            &litium_mine::msg::ExecuteMsg::SubmitProof {
                hash: hash_hex,
                nonce,
                miner_address: miner.to_string(),
                challenge: hex::encode(challenge),
                difficulty: 1,
                timestamp: block_time,
                referrer: None,
            },
            &[],
        )
        .unwrap_err();
    assert!(
        err.root_cause().to_string().contains("below minimum"),
        "expected below min difficulty error, got: {err}"
    );
}

#[test]
fn local_referral_rewards_accrue() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");
    let referrer = Addr::unchecked("referrer1");

    let challenge = challenge_from_seed(500);
    submit_valid_proof(
        &mut app,
        &suite,
        &miner,
        &challenge,
        1,
        Some(referrer.to_string()),
    )
    .unwrap();

    // Miner should have rewards (90% of mining share)
    let miner_bal = query_cw20_balance(&app, &suite.core, miner.as_str());
    assert!(miner_bal > Uint128::zero());

    // Stats should show 1 proof
    let stats: litium_mine::msg::StatsResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::Stats {},
        )
        .unwrap();
    assert_eq!(stats.total_proofs, 1);
}

#[test]
fn local_calculate_reward_query() {
    let (app, suite) = build_suite();

    let reward: litium_mine::msg::RewardCalculationResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::CalculateReward { difficulty_bits: 8 },
        )
        .unwrap();

    // During warmup, reward = warmup_base_rate * d = 1_000_000 * 8
    assert_eq!(reward.gross_reward, Uint128::from(8_000_000u128));
    assert!(reward.earns_reward);
}

#[test]
fn local_emission_info_query() {
    let (app, suite) = build_suite();

    let info: litium_mine::msg::EmissionInfoResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::EmissionInfo {},
        )
        .unwrap();

    assert_eq!(info.alpha, 500_000);
    assert_eq!(info.beta, 0);
    assert!(info.emission_rate > Uint128::zero());
    assert_eq!(info.windowed_fees, Uint128::zero());
}

#[test]
fn local_pause_blocks_mining() {
    let (mut app, suite) = build_suite();
    let admin = Addr::unchecked("admin");
    let miner = Addr::unchecked("miner1");

    app.execute_contract(
        admin.clone(),
        suite.mine.clone(),
        &litium_mine::msg::ExecuteMsg::Pause {},
        &[],
    )
    .unwrap();

    let challenge = challenge_from_seed(600);
    let err = submit_valid_proof(&mut app, &suite, &miner, &challenge, 1, None);
    assert!(err.is_err(), "should fail when paused");
    assert!(
        err.unwrap_err().root_cause().to_string().contains("paused"),
        "expected paused error"
    );

    // Unpause and try again
    app.execute_contract(
        admin,
        suite.mine.clone(),
        &litium_mine::msg::ExecuteMsg::Unpause {},
        &[],
    )
    .unwrap();

    let challenge2 = challenge_from_seed(601);
    submit_valid_proof(&mut app, &suite, &miner, &challenge2, 1, None).unwrap();
}

#[test]
fn local_multiple_proofs_fill_window() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    // Submit several proofs to populate the sliding window
    for i in 0..5 {
        let challenge = challenge_from_seed(700 + i);
        submit_valid_proof(&mut app, &suite, &miner, &challenge, 1, None).unwrap();
    }

    let ws: litium_mine::msg::WindowStatusResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::WindowStatus {},
        )
        .unwrap();
    assert_eq!(ws.proof_count, 5);
    assert_eq!(ws.window_entries, 5);

    let stats: litium_mine::msg::StatsResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::Stats {},
        )
        .unwrap();
    assert_eq!(stats.total_proofs, 5);
    assert!(stats.total_rewards > Uint128::zero());
}
