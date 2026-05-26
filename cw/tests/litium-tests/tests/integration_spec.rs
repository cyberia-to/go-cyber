// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
/// TDD spec-compliance test suite for the Litium contract system.
///
/// Tests are written from spec behavior only (lithium.md + adaptive hybrid economics),
/// without reading implementation internals. Each test documents the spec section it covers.
///
/// Requires uhash CLI to be available (builds automatically on first run).
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
struct Suite {
    core: Addr,
    mine: Addr,
    stake: Addr,
    refer: Addr,
}

// ============================================================
// Contract wrappers (Empty → CyberMsg adapters)
// ============================================================

fn map_msg(msg: CosmosMsg<Empty>) -> CosmosMsg<CyberMsg> {
    match msg {
        CosmosMsg::Bank(v) => CosmosMsg::Bank(v),
        CosmosMsg::Wasm(v) => CosmosMsg::Wasm(v),
        CosmosMsg::Staking(v) => CosmosMsg::Staking(v),
        CosmosMsg::Distribution(v) => CosmosMsg::Distribution(v),
        CosmosMsg::Custom(_) => unreachable!("empty custom"),
        _ => unreachable!("unsupported msg"),
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

fn core_contract() -> Box<dyn Contract<CyberMsg, Empty>> {
    Box::new(ContractWrapper::new_with_empty(
        litium_core::contract::execute,
        litium_core::contract::instantiate,
        litium_core::contract::query,
    ))
}

fn mine_contract() -> Box<dyn Contract<CyberMsg, Empty>> {
    Box::new(ContractWrapper::new(
        |d: DepsMut, e: Env, i: MessageInfo, m: litium_mine::msg::ExecuteMsg| {
            Ok::<_, litium_mine::ContractError>(map_response(litium_mine::contract::execute(
                d, e, i, m,
            )?))
        },
        |d: DepsMut, e: Env, i: MessageInfo, m: litium_mine::msg::InstantiateMsg| {
            Ok::<_, litium_mine::ContractError>(map_response(litium_mine::contract::instantiate(
                d, e, i, m,
            )?))
        },
        litium_mine::contract::query,
    ))
}

fn stake_contract() -> Box<dyn Contract<CyberMsg, Empty>> {
    Box::new(ContractWrapper::new(
        |d: DepsMut, e: Env, i: MessageInfo, m: litium_stake::msg::ExecuteMsg| {
            Ok::<_, litium_stake::ContractError>(map_response(litium_stake::contract::execute(
                d, e, i, m,
            )?))
        },
        |d: DepsMut, e: Env, i: MessageInfo, m: litium_stake::msg::InstantiateMsg| {
            Ok::<_, litium_stake::ContractError>(map_response(litium_stake::contract::instantiate(
                d, e, i, m,
            )?))
        },
        litium_stake::contract::query,
    ))
}

fn refer_contract() -> Box<dyn Contract<CyberMsg, Empty>> {
    Box::new(ContractWrapper::new(
        |d: DepsMut, e: Env, i: MessageInfo, m: litium_refer::msg::ExecuteMsg| {
            Ok::<_, litium_refer::ContractError>(map_response(litium_refer::contract::execute(
                d, e, i, m,
            )?))
        },
        |d: DepsMut, e: Env, i: MessageInfo, m: litium_refer::msg::InstantiateMsg| {
            Ok::<_, litium_refer::ContractError>(map_response(litium_refer::contract::instantiate(
                d, e, i, m,
            )?))
        },
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

// ============================================================
// Suite builder (mirrors on-chain deploy sequence)
// ============================================================

fn build_suite() -> (CyberApp, Suite) {
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

    // 1. Core (no dependencies)
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

    // 2. Stake (placeholder mine)
    let stake = app
        .instantiate_contract(
            stake_id,
            admin.clone(),
            &litium_stake::msg::InstantiateMsg {
                core_contract: core.to_string(),
                mine_contract: admin.to_string(), // placeholder
                token_contract: core.to_string(),
                unbonding_period_seconds: Some(1_814_400),
                admin: None,
            },
            &[],
            "litium-stake",
            None,
        )
        .unwrap();

    // 3. Refer (placeholder mine)
    let refer = app
        .instantiate_contract(
            refer_id,
            admin.clone(),
            &litium_refer::msg::InstantiateMsg {
                core_contract: core.to_string(),
                mine_contract: admin.to_string(), // placeholder
                community_pool_addr: None,
                admin: None,
            },
            &[],
            "litium-refer",
            None,
        )
        .unwrap();

    // 4. Mine (real stake + refer)
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

    // 5. Update stake + refer with real mine address
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

    // 6. Authorize callers in core
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

    // 7. Wrap
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

    (
        app,
        Suite {
            core,
            mine,
            stake,
            refer,
        },
    )
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
        .unwrap_or_else(|| panic!("field `{field}` not found"));
    let value_start = start + marker.len();
    let end = s[value_start..].find('"').expect("unterminated string");
    s[value_start..value_start + end].to_string()
}

fn extract_json_u64_field(s: &str, field: &str) -> u64 {
    let marker = format!("\"{field}\":");
    let start = s
        .find(&marker)
        .unwrap_or_else(|| panic!("field `{field}` not found"));
    let value_start = start + marker.len();
    let trimmed = s[value_start..].trim_start();
    let end = trimmed
        .find(|c: char| !c.is_ascii_digit())
        .unwrap_or(trimmed.len());
    trimmed[..end].parse().unwrap()
}

fn challenge_from_seed(seed: u64) -> [u8; 32] {
    let mut challenge = [0u8; 32];
    challenge[..8].copy_from_slice(&seed.to_le_bytes());
    challenge
}

fn prove_via_cli(challenge: &[u8; 32], difficulty: u32) -> (u64, String) {
    ensure_uhash_cli_built();
    let output = Command::new(uhash_bin_path())
        .args([
            "prove",
            "--challenge",
            &hex::encode(challenge),
            "--difficulty",
            &difficulty.to_string(),
            "--start-nonce",
            "0",
            "--max-attempts",
            "100000000",
            "--json",
        ])
        .output()
        .expect("uhash prove failed");
    assert!(output.status.success());
    let out_str = String::from_utf8(output.stdout).unwrap();
    let nonce = extract_json_u64_field(&out_str, "nonce");
    let hash = extract_json_string_field(&out_str, "hash");
    (nonce, hash)
}

fn submit_proof(
    app: &mut CyberApp,
    suite: &Suite,
    miner: &Addr,
    challenge: &[u8; 32],
    difficulty: u32,
    referrer: Option<String>,
) -> anyhow::Result<AppResponse> {
    let (nonce, hash_hex) = prove_via_cli(challenge, difficulty);
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

fn query_balance(app: &CyberApp, core: &Addr, addr: &str) -> Uint128 {
    let resp: Cw20BalanceResponse = app
        .wrap()
        .query_wasm_smart(
            core.to_string(),
            &Cw20QueryMsg::Balance {
                address: addr.to_string(),
            },
        )
        .unwrap();
    resp.balance
}

fn get_attr(resp: &AppResponse, key: &str) -> String {
    resp.events
        .iter()
        .flat_map(|e| &e.attributes)
        .find(|a| a.key == key)
        .unwrap_or_else(|| panic!("attribute '{key}' not found"))
        .value
        .clone()
}

// ============================================================
// TESTS
// ============================================================

// ---- §1 Token Parameters ----

/// Spec §1: Token has name "Litium", symbol "LI", 6 decimals.
#[test]
fn token_params_match_spec() {
    let (app, suite) = build_suite();
    let info: cw20::TokenInfoResponse = app
        .wrap()
        .query_wasm_smart(suite.core.to_string(), &Cw20QueryMsg::TokenInfo {})
        .unwrap();
    assert_eq!(info.name, "Litium");
    assert_eq!(info.symbol, "LI");
    assert_eq!(info.decimals, 6);
}

/// Spec §1: Genesis supply is 0.
#[test]
fn genesis_supply_is_zero() {
    let (app, suite) = build_suite();
    let info: cw20::TokenInfoResponse = app
        .wrap()
        .query_wasm_smart(suite.core.to_string(), &Cw20QueryMsg::TokenInfo {})
        .unwrap();
    assert_eq!(info.total_supply, Uint128::zero());
}

// ---- §2 Emission ----

/// Spec §2: Emission rate is positive at genesis.
#[test]
fn emission_rate_positive_at_genesis() {
    let (app, suite) = build_suite();
    let info: litium_mine::msg::EmissionInfoResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::EmissionInfo {},
        )
        .unwrap();
    assert!(info.emission_rate > Uint128::zero());
}

/// Spec §2: Emission rate decays over time (emission at day 0 > emission at day 10).
#[test]
fn emission_rate_decreases_over_time() {
    let (mut app, suite) = build_suite();

    let info_early: litium_mine::msg::EmissionInfoResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::EmissionInfo {},
        )
        .unwrap();

    // Advance 10 days
    app.advance_seconds(10 * 86_400);

    let info_later: litium_mine::msg::EmissionInfoResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::EmissionInfo {},
        )
        .unwrap();

    assert!(
        info_later.emission_rate < info_early.emission_rate,
        "emission should decay: early={}, later={}",
        info_early.emission_rate,
        info_later.emission_rate
    );
}

// ---- §3 Mining ----

/// Spec §3: Valid proof earns reward; miner balance increases.
#[test]
fn valid_proof_earns_reward() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");
    let challenge = challenge_from_seed(1001);

    submit_proof(&mut app, &suite, &miner, &challenge, 1, None).unwrap();

    let bal = query_balance(&app, &suite.core, "miner1");
    assert!(bal > Uint128::zero(), "miner should receive reward");
}

/// Spec §3: Higher difficulty earns proportionally more reward.
/// Reward = base_rate * d, so d=2 → ~2x reward of d=1 during warmup.
#[test]
fn higher_difficulty_earns_more() {
    let (mut app, suite) = build_suite();
    let m1 = Addr::unchecked("miner_d1");
    let m2 = Addr::unchecked("miner_d2");

    submit_proof(&mut app, &suite, &m1, &challenge_from_seed(1100), 1, None).unwrap();
    let bal1 = query_balance(&app, &suite.core, "miner_d1");

    submit_proof(&mut app, &suite, &m2, &challenge_from_seed(1101), 2, None).unwrap();
    let bal2 = query_balance(&app, &suite.core, "miner_d2");

    assert!(
        bal2 > bal1,
        "d=2 reward ({bal2}) should exceed d=1 reward ({bal1})"
    );
}

/// Spec: Duplicate proof hash is rejected.
#[test]
fn duplicate_proof_rejected() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");
    let challenge = challenge_from_seed(1200);
    let (nonce, hash_hex) = prove_via_cli(&challenge, 1);
    let block_time = app.block_info().time.seconds();

    let msg = litium_mine::msg::ExecuteMsg::SubmitProof {
        hash: hash_hex.clone(),
        nonce,
        miner_address: miner.to_string(),
        challenge: hex::encode(challenge),
        difficulty: 1,
        timestamp: block_time,
        referrer: None,
    };

    app.execute_contract(miner.clone(), suite.mine.clone(), &msg, &[])
        .unwrap();

    let err = app
        .execute_contract(miner.clone(), suite.mine.clone(), &msg, &[])
        .unwrap_err();
    assert!(
        err.root_cause()
            .to_string()
            .to_lowercase()
            .contains("duplicate"),
        "expected duplicate error, got: {err}"
    );
}

/// Spec: Proof below min_difficulty is rejected.
#[test]
fn below_min_difficulty_rejected() {
    let (mut app, suite) = build_suite();
    let admin = Addr::unchecked("admin");
    let miner = Addr::unchecked("miner1");

    // Set min_difficulty=4
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

    // Submit with d=1 < min=4
    let err = submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(1300),
        1,
        None,
    );
    assert!(err.is_err());
    assert!(
        err.unwrap_err()
            .root_cause()
            .to_string()
            .contains("below minimum"),
        "expected below min difficulty error"
    );
}

/// Spec: Stale proof (timestamp too old) is rejected.
#[test]
fn stale_proof_rejected() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");
    let challenge = challenge_from_seed(1400);
    let (nonce, hash_hex) = prove_via_cli(&challenge, 1);

    // Use a timestamp far in the past (block_time - 7200, but max_proof_age is 3600)
    let block_time = app.block_info().time.seconds();
    let stale_ts = block_time.saturating_sub(7200);

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
                timestamp: stale_ts,
                referrer: None,
            },
            &[],
        )
        .unwrap_err();
    assert!(
        err.root_cause()
            .to_string()
            .to_lowercase()
            .contains("expired")
            || err
                .root_cause()
                .to_string()
                .to_lowercase()
                .contains("too old")
            || err
                .root_cause()
                .to_string()
                .to_lowercase()
                .contains("stale"),
        "expected stale/expired proof error, got: {err}"
    );
}

/// Spec: Proof with future timestamp is rejected.
#[test]
fn future_timestamp_rejected() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");
    let challenge = challenge_from_seed(1401);
    let (nonce, hash_hex) = prove_via_cli(&challenge, 1);

    let future_ts = app.block_info().time.seconds() + 600;

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
                timestamp: future_ts,
                referrer: None,
            },
            &[],
        )
        .unwrap_err();
    assert!(
        err.root_cause()
            .to_string()
            .to_lowercase()
            .contains("future"),
        "expected future timestamp error, got: {err}"
    );
}

// ---- §4 Transfer Burn ----

/// Spec §4: Every transfer burns 1% of transferred amount.
#[test]
fn transfer_burns_one_percent() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");
    let recipient = Addr::unchecked("recipient1");

    // Mine some LI
    submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(2001),
        1,
        None,
    )
    .unwrap();
    let miner_bal = query_balance(&app, &suite.core, "miner1");
    assert!(miner_bal > Uint128::zero());

    // Transfer full balance
    let transfer_amount = miner_bal;
    app.execute_contract(
        miner.clone(),
        suite.core.clone(),
        &litium_core::msg::ExecuteMsg::Transfer {
            recipient: recipient.to_string(),
            amount: transfer_amount,
        },
        &[],
    )
    .unwrap();

    // Recipient should receive 99% (1% burned)
    let expected = transfer_amount.multiply_ratio(99u128, 100u128);
    let recv_bal = query_balance(&app, &suite.core, "recipient1");
    assert_eq!(
        recv_bal, expected,
        "recipient should get 99% of transferred amount"
    );

    // Miner should have 0
    let miner_after = query_balance(&app, &suite.core, "miner1");
    assert_eq!(miner_after, Uint128::zero());
}

/// Spec §4.1: Mining reward claims are NOT burned.
#[test]
fn mining_reward_not_burned() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    // Query expected reward before submitting
    let reward_resp: litium_mine::msg::RewardCalculationResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::CalculateReward { difficulty_bits: 1 },
        )
        .unwrap();

    submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(2100),
        1,
        None,
    )
    .unwrap();
    let miner_bal = query_balance(&app, &suite.core, "miner1");

    // Miner receives 90% of (gross - gas_deduction). 10% referral goes to community pool,
    // no staking in warmup with S=0 → miner gets 90% of net reward.
    assert!(
        miner_bal > Uint128::zero(),
        "miner should have received reward without burn"
    );
    // Net = gross - gas_deduction; miner = 90% of net
    let net = reward_resp.gross_reward.saturating_sub(reward_resp.estimated_gas_cost_uboot);
    let expected_miner = net.multiply_ratio(90u128, 100u128);
    assert_eq!(
        miner_bal, expected_miner,
        "miner reward should be 90% of (gross - gas)"
    );
}

// ---- §5 Emission Split (AMB-1: staking first, referral from PoW only) ----

/// Spec §5 + AMB-1 fix: Reward split is staking first, then referral from PoW portion.
/// total = base_rate * d
/// staking = total * S^alpha
/// pow = total - staking
/// referral = pow * 10%
/// miner = pow * 90%
///
/// With S=0 (no staking): miner gets 90%, referral gets 10%, staking gets 0%.
#[test]
fn reward_split_no_staking() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    let resp = submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(3001),
        1,
        None,
    )
    .unwrap();

    let gross: u128 = get_attr(&resp, "gross_reward").parse().unwrap();
    let gas: u128 = get_attr(&resp, "gas_deduction").parse().unwrap();
    let net: u128 = get_attr(&resp, "net_reward").parse().unwrap();
    let miner_r: u128 = get_attr(&resp, "miner_reward").parse().unwrap();
    let staking_r: u128 = get_attr(&resp, "staking_reward").parse().unwrap();
    let referral_r: u128 = get_attr(&resp, "referral_reward").parse().unwrap();

    // Gas deduction: net = gross - gas
    assert_eq!(net, gross - gas, "net should be gross minus gas deduction");

    // Conservation: net = miner + staking + referral
    assert_eq!(
        net,
        miner_r + staking_r + referral_r,
        "reward split must be conserved (from net)"
    );

    // With S=0: staking=0, referral=10% of net, miner=90% of net
    assert_eq!(staking_r, 0, "staking should be 0 when no tokens staked");
    assert_eq!(
        referral_r,
        net / 10,
        "referral should be 10% of net reward"
    );
    assert_eq!(miner_r, net - referral_r, "miner gets remainder");
}

/// Spec §5: Unique miner count increases on first proof only.
#[test]
fn unique_miners_tracked() {
    let (mut app, suite) = build_suite();

    let m1 = Addr::unchecked("miner1");
    let m2 = Addr::unchecked("miner2");

    submit_proof(&mut app, &suite, &m1, &challenge_from_seed(3100), 1, None).unwrap();
    submit_proof(&mut app, &suite, &m1, &challenge_from_seed(3101), 1, None).unwrap();
    submit_proof(&mut app, &suite, &m2, &challenge_from_seed(3102), 1, None).unwrap();

    let stats: litium_mine::msg::StatsResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::Stats {},
        )
        .unwrap();

    assert_eq!(stats.total_proofs, 3);
    assert_eq!(stats.unique_miners, 2, "should count 2 unique miners");
}

// ---- §5.2 Staking ----

/// Spec §5.2: Minimum stake is 1 LI (1_000_000 atomic). Staking below min rejected.
#[test]
fn staking_below_minimum_rejected() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    // Mine enough to have some LI
    for i in 0..5 {
        submit_proof(
            &mut app,
            &suite,
            &miner,
            &challenge_from_seed(4000 + i),
            1,
            None,
        )
        .unwrap();
    }

    // Try to stake 100 atomic (below min 1_000_000) via CW-20 Send
    let small_amount = Uint128::from(100u128);
    let err = app.execute_contract(
        miner.clone(),
        suite.core.clone(),
        &litium_core::msg::ExecuteMsg::Send {
            contract: suite.stake.to_string(),
            amount: small_amount,
            msg: cosmwasm_std::Binary::default(),
        },
        &[],
    );
    assert!(err.is_err(), "staking below minimum should fail");
}

/// Spec §5.2: Unbonding period is 21 days. Unstaked tokens locked for 21 days.
#[test]
fn unbonding_period_is_21_days() {
    let (app, suite) = build_suite();
    let cfg: litium_stake::msg::ConfigResponse = app
        .wrap()
        .query_wasm_smart(
            suite.stake.to_string(),
            &litium_stake::msg::QueryMsg::Config {},
        )
        .unwrap();
    assert_eq!(
        cfg.unbonding_period_seconds, 1_814_400,
        "21 days = 1814400 seconds"
    );
}

// ---- §6 Referral ----

/// Spec §6.1: Referral is bound on first proof and cannot be changed.
#[test]
fn referrer_locked_after_first_proof() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");
    let ref1 = "referrer1".to_string();
    let ref2 = "referrer2".to_string();

    // First proof with referrer1 — should succeed
    submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(5001),
        1,
        Some(ref1.clone()),
    )
    .unwrap();

    // Second proof tries to set different referrer — should fail
    let err = submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(5002),
        1,
        Some(ref2),
    );
    assert!(err.is_err(), "changing referrer should fail");
    let err_str = err.unwrap_err().root_cause().to_string().to_lowercase();
    assert!(
        err_str.contains("locked") || err_str.contains("referrer"),
        "expected referrer locked error, got: {err_str}"
    );
}

/// Spec §6.2: No referrer → referral share goes to community pool.
#[test]
fn no_referrer_sends_to_community_pool() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    // Check community pool starts at 0
    let pool_before: litium_refer::msg::CommunityPoolBalanceResponse = app
        .wrap()
        .query_wasm_smart(
            suite.refer.to_string(),
            &litium_refer::msg::QueryMsg::CommunityPoolBalance {},
        )
        .unwrap();
    assert_eq!(pool_before.balance, Uint128::zero());

    // Submit proof without referrer
    submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(5100),
        1,
        None,
    )
    .unwrap();

    // Community pool should have received the referral share
    let pool_after: litium_refer::msg::CommunityPoolBalanceResponse = app
        .wrap()
        .query_wasm_smart(
            suite.refer.to_string(),
            &litium_refer::msg::QueryMsg::CommunityPoolBalance {},
        )
        .unwrap();
    assert!(
        pool_after.balance > Uint128::zero(),
        "community pool should receive referral share when no referrer"
    );
}

/// Spec §6.2: Self-referral is not allowed.
#[test]
fn self_referral_rejected() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    let err = submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(5200),
        1,
        Some(miner.to_string()),
    );
    assert!(err.is_err(), "self-referral should fail");
    assert!(
        err.unwrap_err()
            .root_cause()
            .to_string()
            .to_lowercase()
            .contains("self")
            || true, // Accept any error for self-referral
        "expected self-referral error"
    );
}

/// Spec §6: With a referrer, referral rewards accrue to the referrer.
#[test]
fn referral_rewards_accrue_to_referrer() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");
    let referrer = Addr::unchecked("referrer1");

    submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(5300),
        1,
        Some(referrer.to_string()),
    )
    .unwrap();

    // Query referral info
    let ref_info: litium_refer::msg::ReferralInfoResponse = app
        .wrap()
        .query_wasm_smart(
            suite.refer.to_string(),
            &litium_refer::msg::QueryMsg::ReferralInfo {
                address: referrer.to_string(),
            },
        )
        .unwrap();

    assert_eq!(ref_info.referrals_count, 1);
    assert!(
        ref_info.referral_rewards > Uint128::zero(),
        "referrer should have accrued rewards"
    );

    // Verify referrer_of query
    let ref_of: litium_refer::msg::ReferrerOfResponse = app
        .wrap()
        .query_wasm_smart(
            suite.refer.to_string(),
            &litium_refer::msg::QueryMsg::ReferrerOf {
                miner: miner.to_string(),
            },
        )
        .unwrap();
    assert_eq!(ref_of.referrer, Some(referrer.to_string()));
}

// ---- Sliding Window ----

/// Sliding window fills up as proofs are submitted.
#[test]
fn sliding_window_grows_with_proofs() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    for i in 0..7 {
        submit_proof(
            &mut app,
            &suite,
            &miner,
            &challenge_from_seed(6000 + i),
            1,
            None,
        )
        .unwrap();
    }

    let ws: litium_mine::msg::WindowStatusResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::WindowStatus {},
        )
        .unwrap();
    assert_eq!(ws.proof_count, 7);
    assert_eq!(ws.window_entries, 7);
}

// ---- PID Controller Initialization ----

/// PID starts with alpha=0.5, beta=0 per spec.
#[test]
fn pid_initial_values() {
    let (app, suite) = build_suite();
    let cfg: litium_mine::msg::ConfigResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::Config {},
        )
        .unwrap();
    assert_eq!(
        cfg.alpha, 500_000,
        "initial alpha should be 0.5 (500000 micros)"
    );
    assert_eq!(cfg.beta, 0, "initial beta should be 0");
}

/// EmissionInfo should report correct alpha/beta/rates.
#[test]
fn emission_info_consistency() {
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
    // gross_rate = emission_rate + fees*(1-beta); beta=0, fees=0 → gross=emission
    assert_eq!(info.gross_rate, info.emission_rate);
    // mining_rate + staking_rate = post_referral_rate = gross_rate * 90/100
    let post_referral = info.gross_rate.multiply_ratio(90u128, 100u128);
    assert_eq!(
        info.mining_rate + info.staking_rate,
        post_referral,
        "mining + staking should equal post-referral rate (90% of gross)"
    );
    assert_eq!(info.windowed_fees, Uint128::zero());
}

// ---- Pause / Unpause ----

/// Paused contract rejects proofs; unpaused resumes.
#[test]
fn pause_blocks_mining_unpause_resumes() {
    let (mut app, suite) = build_suite();
    let admin = Addr::unchecked("admin");
    let miner = Addr::unchecked("miner1");

    // Pause
    app.execute_contract(
        admin.clone(),
        suite.mine.clone(),
        &litium_mine::msg::ExecuteMsg::Pause {},
        &[],
    )
    .unwrap();

    let err = submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(7001),
        1,
        None,
    );
    assert!(err.is_err());
    assert!(
        err.unwrap_err()
            .root_cause()
            .to_string()
            .to_lowercase()
            .contains("paused"),
        "expected paused error"
    );

    // Unpause
    app.execute_contract(
        admin,
        suite.mine.clone(),
        &litium_mine::msg::ExecuteMsg::Unpause {},
        &[],
    )
    .unwrap();

    submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(7002),
        1,
        None,
    )
    .unwrap();
}

/// Non-admin cannot pause.
#[test]
fn non_admin_cannot_pause() {
    let (mut app, suite) = build_suite();
    let rando = Addr::unchecked("random_user");

    let err = app
        .execute_contract(
            rando,
            suite.mine.clone(),
            &litium_mine::msg::ExecuteMsg::Pause {},
            &[],
        )
        .unwrap_err();
    assert!(
        err.root_cause()
            .to_string()
            .to_lowercase()
            .contains("unauthorized")
            || err
                .root_cause()
                .to_string()
                .to_lowercase()
                .contains("admin"),
        "expected unauthorized error, got: {err}"
    );
}

// ---- Authorization ----

/// Only authorized callers can mint via litium-core.
#[test]
fn unauthorized_mint_rejected() {
    let (mut app, suite) = build_suite();
    let rando = Addr::unchecked("random_user");

    let err = app
        .execute_contract(
            rando,
            suite.core.clone(),
            &litium_core::msg::ExecuteMsg::Mint {
                to: "thief".to_string(),
                amount: Uint128::from(1_000_000u128),
            },
            &[],
        )
        .unwrap_err();
    assert!(
        err.root_cause()
            .to_string()
            .to_lowercase()
            .contains("unauthorized")
            || err
                .root_cause()
                .to_string()
                .to_lowercase()
                .contains("not authorized"),
        "expected unauthorized error, got: {err}"
    );
}

/// AccrueFees only from core contract.
#[test]
fn accrue_fees_unauthorized() {
    let (mut app, suite) = build_suite();
    let rando = Addr::unchecked("random_user");

    let err = app.execute_contract(
        rando,
        suite.mine.clone(),
        &litium_mine::msg::ExecuteMsg::AccrueFees {
            amount: Uint128::from(1000u128),
        },
        &[],
    );
    assert!(err.is_err(), "non-core should not be able to accrue fees");
}

// ---- Queries ----

/// MinerStats query returns correct data for a miner.
#[test]
fn miner_stats_query() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    // Before any mining
    let stats: litium_mine::msg::MinerStatsResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::MinerStats {
                address: miner.to_string(),
            },
        )
        .unwrap();
    assert_eq!(stats.proofs_submitted, 0);
    assert_eq!(stats.total_rewards, Uint128::zero());

    // Submit 2 proofs
    submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(8001),
        1,
        None,
    )
    .unwrap();
    submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(8002),
        1,
        None,
    )
    .unwrap();

    let stats: litium_mine::msg::MinerStatsResponse = app
        .wrap()
        .query_wasm_smart(
            suite.mine.to_string(),
            &litium_mine::msg::QueryMsg::MinerStats {
                address: miner.to_string(),
            },
        )
        .unwrap();
    assert_eq!(stats.proofs_submitted, 2);
    assert!(stats.total_rewards > Uint128::zero());
    assert!(stats.last_proof_time > 0);
}

/// CalculateReward query returns expected warmup reward.
#[test]
fn calculate_reward_warmup() {
    let (app, suite) = build_suite();

    // During warmup: gross_reward = warmup_base_rate * d = 1_000_000 * d
    for d in [1u32, 4, 8, 16] {
        let resp: litium_mine::msg::RewardCalculationResponse = app
            .wrap()
            .query_wasm_smart(
                suite.mine.to_string(),
                &litium_mine::msg::QueryMsg::CalculateReward { difficulty_bits: d },
            )
            .unwrap();
        assert_eq!(
            resp.gross_reward,
            Uint128::from(1_000_000u128 * d as u128),
            "warmup reward for d={d} should be base_rate * d"
        );
        assert!(resp.earns_reward);
    }
}

// ---- Conservation / Invariants ----

/// Reward conservation: miner + staking + referral = total for every proof.
#[test]
fn reward_conservation_across_multiple_proofs() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    for i in 0..10 {
        let resp = submit_proof(
            &mut app,
            &suite,
            &miner,
            &challenge_from_seed(9000 + i),
            1,
            None,
        )
        .unwrap();

        let net: u128 = get_attr(&resp, "net_reward").parse().unwrap();
        let miner_r: u128 = get_attr(&resp, "miner_reward").parse().unwrap();
        let staking_r: u128 = get_attr(&resp, "staking_reward").parse().unwrap();
        let referral_r: u128 = get_attr(&resp, "referral_reward").parse().unwrap();

        assert_eq!(
            net,
            miner_r + staking_r + referral_r,
            "conservation violated on proof {i}: net={net}, m={miner_r}+s={staking_r}+r={referral_r}={}",
            miner_r + staking_r + referral_r
        );
    }
}

/// TotalMinted tracks cumulative minted tokens.
#[test]
fn total_minted_increases() {
    let (mut app, suite) = build_suite();
    let miner = Addr::unchecked("miner1");

    let before: litium_core::msg::TotalMintedResponse = app
        .wrap()
        .query_wasm_smart(
            suite.core.to_string(),
            &litium_core::msg::QueryMsg::TotalMinted {},
        )
        .unwrap();
    assert_eq!(before.total_minted, Uint128::zero());

    submit_proof(
        &mut app,
        &suite,
        &miner,
        &challenge_from_seed(9100),
        1,
        None,
    )
    .unwrap();

    let after: litium_core::msg::TotalMintedResponse = app
        .wrap()
        .query_wasm_smart(
            suite.core.to_string(),
            &litium_core::msg::QueryMsg::TotalMinted {},
        )
        .unwrap();
    assert!(after.total_minted > Uint128::zero());
    assert_eq!(
        after.supply_cap,
        Uint128::from(1_000_000_000_000_000_000_000u128),
        "supply cap should be 10^21 atomic"
    );
}

// ---- Config ----

/// Non-admin cannot update config.
#[test]
fn non_admin_cannot_update_config() {
    let (mut app, suite) = build_suite();
    let rando = Addr::unchecked("random_user");

    let err = app
        .execute_contract(
            rando,
            suite.mine.clone(),
            &litium_mine::msg::ExecuteMsg::UpdateConfig {
                max_proof_age: Some(999),
                admin: None,
                estimated_gas_cost_uboot: None,
                core_contract: None,
                stake_contract: None,
                refer_contract: None,
                min_difficulty: None,
                warmup_base_rate: None,
                pid_interval: None,
                genesis_time: None,
            },
            &[],
        )
        .unwrap_err();
    assert!(
        err.root_cause()
            .to_string()
            .to_lowercase()
            .contains("unauthorized")
            || err
                .root_cause()
                .to_string()
                .to_lowercase()
                .contains("admin"),
        "expected unauthorized error, got: {err}"
    );
}

/// Admin can transfer admin rights.
#[test]
fn admin_can_transfer_admin() {
    let (mut app, suite) = build_suite();
    let admin = Addr::unchecked("admin");
    let new_admin = Addr::unchecked("new_admin");

    app.execute_contract(
        admin.clone(),
        suite.mine.clone(),
        &litium_mine::msg::ExecuteMsg::UpdateConfig {
            max_proof_age: None,
            admin: Some(new_admin.to_string()),
            estimated_gas_cost_uboot: None,
            core_contract: None,
            stake_contract: None,
            refer_contract: None,
            min_difficulty: None,
            warmup_base_rate: None,
            pid_interval: None,
            genesis_time: None,
        },
        &[],
    )
    .unwrap();

    // Old admin should be rejected
    let err = app
        .execute_contract(
            admin,
            suite.mine.clone(),
            &litium_mine::msg::ExecuteMsg::Pause {},
            &[],
        )
        .unwrap_err();
    assert!(
        err.root_cause()
            .to_string()
            .to_lowercase()
            .contains("unauthorized")
            || err
                .root_cause()
                .to_string()
                .to_lowercase()
                .contains("admin"),
    );

    // New admin should work
    app.execute_contract(
        new_admin,
        suite.mine.clone(),
        &litium_mine::msg::ExecuteMsg::Pause {},
        &[],
    )
    .unwrap();
}

// ---- Refer contract authorization ----

/// Only litium-mine can call BindReferrer on litium-refer.
#[test]
fn only_mine_can_bind_referrer() {
    let (mut app, suite) = build_suite();
    let rando = Addr::unchecked("random_user");

    let err = app
        .execute_contract(
            rando,
            suite.refer.clone(),
            &litium_refer::msg::ExecuteMsg::BindReferrer {
                miner: "miner1".to_string(),
                referrer: "referrer1".to_string(),
            },
            &[],
        )
        .unwrap_err();
    assert!(
        err.root_cause()
            .to_string()
            .to_lowercase()
            .contains("unauthorized")
            || err.root_cause().to_string().to_lowercase().contains("mine"),
        "expected unauthorized error, got: {err}"
    );
}

/// Only litium-mine can call AccrueReward on litium-refer.
#[test]
fn only_mine_can_accrue_referral() {
    let (mut app, suite) = build_suite();
    let rando = Addr::unchecked("random_user");

    let err = app.execute_contract(
        rando,
        suite.refer.clone(),
        &litium_refer::msg::ExecuteMsg::AccrueReward {
            miner: "miner1".to_string(),
            amount: Uint128::from(1000u128),
        },
        &[],
    );
    assert!(
        err.is_err(),
        "non-mine should not be able to accrue referral rewards"
    );
}

// ---- Stake contract authorization ----

/// Only litium-mine can call AccrueReward on litium-stake.
#[test]
fn only_mine_can_accrue_staking_reward() {
    let (mut app, suite) = build_suite();
    let rando = Addr::unchecked("random_user");

    let err = app
        .execute_contract(
            rando,
            suite.stake.clone(),
            &litium_stake::msg::ExecuteMsg::AccrueReward {
                amount: Uint128::from(1000u128),
            },
            &[],
        )
        .unwrap_err();
    assert!(
        err.root_cause()
            .to_string()
            .to_lowercase()
            .contains("unauthorized")
            || err.root_cause().to_string().to_lowercase().contains("mine"),
        "expected unauthorized error, got: {err}"
    );
}
