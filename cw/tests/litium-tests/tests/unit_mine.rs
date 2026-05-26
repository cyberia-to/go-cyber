// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{Api, Uint128};

use litium_mine::contract::{
    compute_proof_reward, execute, fee_history_windowed_sum, instantiate, push_to_window,
};
use litium_mine::emission::{
    emission_rate_per_second, finite_component_rate, infinite_component_rate,
    total_emitted_at_time, total_rate_at_time, COMPONENT_ALLOC_ATOMIC, LI_TOTAL_SUPPLY_ATOMIC,
    SECONDS_PER_DAY,
};
use litium_mine::error::ContractError;
use litium_mine::msg::{ExecuteMsg, InstantiateMsg};
use litium_mine::state::{
    FeeBucket, FeeHistory, MineConfig, PidState, SlidingWindow, CONFIG, FEE_HISTORY, PID_STATE,
    SLIDING_WINDOW,
};

// ============================================================
// Contract unit tests (from contract.rs)
// ============================================================

fn default_instantiate_msg() -> InstantiateMsg {
    InstantiateMsg {
        max_proof_age: 600,
        estimated_gas_cost_uboot: Some(Uint128::from(250_000u128)),
        core_contract: "core_contract".to_string(),
        stake_contract: "stake_contract".to_string(),
        refer_contract: "refer_contract".to_string(),
        token_contract: "factory/core_contract/uli".to_string(),
        admin: None,
        window_size: Some(10),
        pid_interval: Some(5),
        min_difficulty: Some(4),
        warmup_base_rate: Uint128::from(1000u128),
        fee_bucket_duration: None,
        fee_num_buckets: None,
        genesis_time: None,
    }
}

#[test]
fn instantiate_works() {
    let mut deps = mock_dependencies();
    let env = mock_env();
    let info = mock_info("creator", &[]);

    let msg = default_instantiate_msg();
    let res = instantiate(deps.as_mut(), env, info, msg).unwrap();
    assert_eq!(res.attributes.len(), 4);

    let config = CONFIG.load(deps.as_ref().storage).unwrap();
    assert_eq!(config.window_size, 10);
    assert_eq!(config.min_difficulty, 4);
    assert!(!config.paused);

    let window = SLIDING_WINDOW.load(deps.as_ref().storage).unwrap();
    assert_eq!(window.count, 0);
    assert!(window.entries.is_empty());

    let pid = PID_STATE.load(deps.as_ref().storage).unwrap();
    assert_eq!(pid.alpha, 500_000);
    assert_eq!(pid.beta, 0);
}

#[test]
fn sliding_window_ring_buffer() {
    let mut window = SlidingWindow {
        entries: Vec::new(),
        head: 0,
        count: 0,
        total_d: 0,
        t_first: 0,
        t_last: 0,
    };

    // Fill window of size 3
    push_to_window(&mut window, 3, 10, 100);
    assert_eq!(window.count, 1);
    assert_eq!(window.total_d, 10);
    assert_eq!(window.t_first, 100);
    assert_eq!(window.t_last, 100);

    push_to_window(&mut window, 3, 12, 200);
    assert_eq!(window.count, 2);
    assert_eq!(window.total_d, 22);

    push_to_window(&mut window, 3, 8, 300);
    assert_eq!(window.count, 3);
    assert_eq!(window.total_d, 30);
    assert_eq!(window.entries.len(), 3);

    // Now it wraps — should evict entry with d=10
    push_to_window(&mut window, 3, 15, 400);
    assert_eq!(window.count, 4);
    assert_eq!(window.total_d, 35); // 12 + 8 + 15
    assert_eq!(window.entries.len(), 3);
    assert_eq!(window.t_first, 200); // oldest is now t=200
    assert_eq!(window.t_last, 400);
}

#[test]
fn warmup_reward_uses_fixed_base_rate() {
    let config = MineConfig {
        max_proof_age: 600,
        estimated_gas_cost_uboot: Uint128::from(250_000u128),
        core_contract: cosmwasm_std::Addr::unchecked("core"),
        stake_contract: cosmwasm_std::Addr::unchecked("stake"),
        refer_contract: cosmwasm_std::Addr::unchecked("refer"),
        token_contract: "token".to_string(),
        admin: cosmwasm_std::Addr::unchecked("admin"),
        paused: false,
        window_size: 100,
        pid_interval: 10,
        genesis_time: 1000,
        warmup_base_rate: Uint128::from(500u128),
        min_difficulty: 8,
        fee_bucket_duration: 600,
        fee_num_buckets: 36,
    };

    // Window not full (0 entries < 100 window_size)
    let window = SlidingWindow {
        entries: Vec::new(),
        head: 0,
        count: 0,
        total_d: 0,
        t_first: 0,
        t_last: 0,
    };
    let pid = PidState {
        alpha: 500_000,
        beta: 0,
        e_eff_prev: 0,
        e_cov_prev: 0,
        de_eff: 0,
        de_cov: 0,
        cached_staking_share: 0,
    };
    let fee_history = FeeHistory {
        buckets: vec![
            FeeBucket {
                epoch: 0,
                amount: Uint128::zero()
            };
            36
        ],
        bucket_duration: 600,
    };

    let (reward, base_rate) =
        compute_proof_reward(&config, &window, &pid, &fee_history, 2000, 12).unwrap();
    assert_eq!(base_rate, Uint128::from(500u128));
    assert_eq!(reward, Uint128::from(6000u128)); // 500 * 12
}

#[test]
fn pause_unpause() {
    let mut deps = mock_dependencies();
    let env = mock_env();
    let info = mock_info("creator", &[]);

    instantiate(
        deps.as_mut(),
        env.clone(),
        info.clone(),
        default_instantiate_msg(),
    )
    .unwrap();

    // Pause
    execute(
        deps.as_mut(),
        env.clone(),
        info.clone(),
        ExecuteMsg::Pause {},
    )
    .unwrap();
    let config = CONFIG.load(deps.as_ref().storage).unwrap();
    assert!(config.paused);

    // Unpause
    execute(
        deps.as_mut(),
        env.clone(),
        info.clone(),
        ExecuteMsg::Unpause {},
    )
    .unwrap();
    let config = CONFIG.load(deps.as_ref().storage).unwrap();
    assert!(!config.paused);
}

#[test]
fn accrue_fees_only_from_core() {
    let mut deps = mock_dependencies();
    let env = mock_env();
    let info = mock_info("creator", &[]);

    instantiate(deps.as_mut(), env.clone(), info, default_instantiate_msg()).unwrap();

    // Non-core should fail
    let bad_info = mock_info("random_user", &[]);
    let err = execute(
        deps.as_mut(),
        env.clone(),
        bad_info,
        ExecuteMsg::AccrueFees {
            amount: Uint128::from(1000u128),
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::UnauthorizedFeeAccrual {});

    // Core contract should succeed
    let core_addr = deps.api.addr_validate("core_contract").unwrap();
    let core_info = mock_info(core_addr.as_str(), &[]);
    execute(
        deps.as_mut(),
        env.clone(),
        core_info,
        ExecuteMsg::AccrueFees {
            amount: Uint128::from(1000u128),
        },
    )
    .unwrap();

    // Verify fee was recorded in fee history
    let history = FEE_HISTORY.load(deps.as_ref().storage).unwrap();
    let now = env.block.time.seconds();
    let total = fee_history_windowed_sum(&history, 0, now);
    assert_eq!(total, Uint128::from(1000u128));
}

// ============================================================
// Emission unit tests (from emission.rs)
// ============================================================

#[test]
fn emission_rate_positive_at_genesis() {
    let rate = emission_rate_per_second(0, 0);
    assert!(rate.u128() > 0, "emission rate must be positive at genesis");
}

#[test]
fn emission_rate_decays_over_time() {
    let early = emission_rate_per_second(0, 86400); // day 1
    let late = emission_rate_per_second(0, 365 * 86400); // day 365
    assert!(
        early > late,
        "emission rate at day 1 ({early}) should exceed day 365 ({late})"
    );
}

#[test]
fn total_emission_converges_to_supply() {
    let large_t = 1000 * 365 * 86400; // 1000 years in seconds
    let emitted = total_emitted_at_time(0, large_t);
    let supply = Uint128::from(LI_TOTAL_SUPPLY_ATOMIC);
    let fraction_remaining = (supply.u128() as f64 - emitted.u128() as f64) / supply.u128() as f64;
    assert!(
        fraction_remaining < 1e-4,
        "Expected near-total emission at t=1000yr, fraction remaining: {fraction_remaining:.6}"
    );
}

#[test]
fn emission_rate_monotone_decreasing() {
    let r1 = total_rate_at_time(86400.0); // day 1
    let r30 = total_rate_at_time(30.0 * 86400.0); // day 30
    let r365 = total_rate_at_time(365.0 * 86400.0); // day 365
    assert!(r1 > r30, "day-1 rate {r1} should exceed day-30 rate {r30}");
    assert!(
        r30 > r365,
        "day-30 rate {r30} should exceed day-365 rate {r365}"
    );
    assert!(r365 > 0.0, "emission rate must remain positive at 1 year");
}

#[test]
fn li_inf_constant_then_zero() {
    let rate_1yr = infinite_component_rate(365.0 * SECONDS_PER_DAY);
    let rate_10yr = infinite_component_rate(10.0 * 365.0 * SECONDS_PER_DAY);
    assert_eq!(
        rate_1yr, rate_10yr,
        "Li_inf rate must be constant before the 20-year cutoff"
    );
    assert!(rate_1yr > 0.0, "Li_inf rate must be positive before cutoff");

    let just_after = 20.0 * 365.0 * SECONDS_PER_DAY + 1.0;
    assert_eq!(
        infinite_component_rate(just_after),
        0.0,
        "Li_inf rate must be zero after the 20-year cutoff"
    );
}

#[test]
fn finite_component_genesis_rate_matches_formula() {
    for period_days in [1.0, 7.0, 30.0, 90.0, 365.0, 1461.0_f64] {
        let lambda = f64::ln(10.0) / (period_days * SECONDS_PER_DAY);
        let expected = 0.9 * COMPONENT_ALLOC_ATOMIC as f64 * lambda;
        let actual = finite_component_rate(0.0, period_days);
        let rel_err = (actual - expected).abs() / expected;
        assert!(
            rel_err < 1e-10,
            "Li_{period_days}-day component genesis rate deviates by {rel_err:.2e}"
        );
    }
}
