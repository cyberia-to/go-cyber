// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{Addr, Binary, Env, Uint128, Uint256};
use cw20::Cw20ReceiveMsg;

use litium_stake::contract::{execute, query, DEFAULT_UNBONDING_PERIOD_SECONDS};
use litium_stake::error::ContractError;
use litium_stake::msg::{
    ConfigResponse, ExecuteMsg, QueryMsg, StakeInfoResponse, TestingOverrides,
    TotalPendingRewardsResponse,
};
use litium_stake::state::{
    StakeConfig, CONFIG, STAKING_RESERVE, STAKING_REWARD_INDEX, STAKING_TOTAL_STAKED,
    TOTAL_ACCRUED_REWARDS, TOTAL_CLAIMED_REWARDS,
};

fn setup() -> (
    cosmwasm_std::OwnedDeps<
        cosmwasm_std::MemoryStorage,
        cosmwasm_std::testing::MockApi,
        cosmwasm_std::testing::MockQuerier,
    >,
    Env,
) {
    let mut deps = mock_dependencies();
    let env = mock_env();
    let config = StakeConfig {
        core_contract: Addr::unchecked("core_contract"),
        mine_contract: Addr::unchecked("mine_contract"),
        token_contract: Addr::unchecked("core_contract"),
        unbonding_period_seconds: DEFAULT_UNBONDING_PERIOD_SECONDS,
        admin: Addr::unchecked("admin"),
        paused: false,
    };
    CONFIG.save(deps.as_mut().storage, &config).unwrap();
    STAKING_RESERVE
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    STAKING_TOTAL_STAKED
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    STAKING_REWARD_INDEX
        .save(deps.as_mut().storage, &Uint256::zero())
        .unwrap();
    TOTAL_ACCRUED_REWARDS
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    TOTAL_CLAIMED_REWARDS
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    (deps, env)
}

fn stake_via_receive(
    deps: &mut cosmwasm_std::OwnedDeps<
        cosmwasm_std::MemoryStorage,
        cosmwasm_std::testing::MockApi,
        cosmwasm_std::testing::MockQuerier,
    >,
    env: Env,
    staker: &str,
    amount: u128,
) {
    let cw20_msg = Cw20ReceiveMsg {
        sender: staker.to_string(),
        amount: Uint128::from(amount),
        msg: Binary::default(),
    };
    let info = mock_info("core_contract", &[]);
    execute(deps.as_mut(), env, info, ExecuteMsg::Receive(cw20_msg)).unwrap();
}

#[test]
fn only_mine_contract_can_accrue() {
    let (mut deps, env) = setup();
    let info = mock_info("random", &[]);
    let err = execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::AccrueReward {
            amount: Uint128::from(1000u128),
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::NotMineContract {});
}

#[test]
fn mine_contract_can_accrue() {
    let (mut deps, env) = setup();
    let info = mock_info("mine_contract", &[]);
    let res = execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::AccrueReward {
            amount: Uint128::from(1000u128),
        },
    )
    .unwrap();
    assert_eq!(res.attributes[0].value, "accrue_reward");
    let reserve = STAKING_RESERVE.load(deps.as_ref().storage).unwrap();
    assert_eq!(reserve, Uint128::from(1000u128));
}

#[test]
fn stake_via_cw20_receive() {
    let (mut deps, env) = setup();
    stake_via_receive(&mut deps, env, "user", 2_000_000);
    let total = STAKING_TOTAL_STAKED.load(deps.as_ref().storage).unwrap();
    assert_eq!(total, Uint128::from(2_000_000u128));
}

#[test]
fn stake_rejects_wrong_token() {
    let (mut deps, env) = setup();
    let cw20_msg = Cw20ReceiveMsg {
        sender: "user".to_string(),
        amount: Uint128::from(1_000_000u128),
        msg: Binary::default(),
    };
    let info = mock_info("wrong_token", &[]);
    let err = execute(deps.as_mut(), env, info, ExecuteMsg::Receive(cw20_msg)).unwrap_err();
    assert_eq!(err, ContractError::UnexpectedFunds {});
}

#[test]
fn stake_below_minimum_rejected() {
    let (mut deps, env) = setup();
    let cw20_msg = Cw20ReceiveMsg {
        sender: "user".to_string(),
        amount: Uint128::from(999_999u128),
        msg: Binary::default(),
    };
    let info = mock_info("core_contract", &[]);
    let err = execute(deps.as_mut(), env, info, ExecuteMsg::Receive(cw20_msg)).unwrap_err();
    assert_eq!(err, ContractError::InvalidStakeAmount {});
}

#[test]
fn stake_and_unstake_flow() {
    let (mut deps, env) = setup();
    stake_via_receive(&mut deps, env.clone(), "user", 2_000_000);

    let total = STAKING_TOTAL_STAKED.load(deps.as_ref().storage).unwrap();
    assert_eq!(total, Uint128::from(2_000_000u128));

    let info = mock_info("user", &[]);
    execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::Unstake {
            amount: Uint128::from(1_000_000u128),
        },
    )
    .unwrap();

    let total = STAKING_TOTAL_STAKED.load(deps.as_ref().storage).unwrap();
    assert_eq!(total, Uint128::from(1_000_000u128));
}

#[test]
fn unstake_that_leaves_sub_minimum_residual_rejected() {
    let (mut deps, env) = setup();
    stake_via_receive(&mut deps, env.clone(), "user", 1_500_000);

    let err = execute(
        deps.as_mut(),
        env,
        mock_info("user", &[]),
        ExecuteMsg::Unstake {
            amount: Uint128::from(600_001u128),
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::InvalidStakeAmount {});
}

#[test]
fn staking_reward_distribution() {
    let (mut deps, env) = setup();
    stake_via_receive(&mut deps, env.clone(), "user", 1_000_000);

    let info = mock_info("mine_contract", &[]);
    execute(
        deps.as_mut(),
        env.clone(),
        info,
        ExecuteMsg::AccrueReward {
            amount: Uint128::from(100u128),
        },
    )
    .unwrap();

    let resp: StakeInfoResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env,
            QueryMsg::StakeInfo {
                address: "user".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert_eq!(resp.claimable_rewards, Uint128::from(100u128));
}

#[test]
fn claim_unbonding_returns_cw20() {
    let (mut deps, mut env) = setup();
    stake_via_receive(&mut deps, env.clone(), "user", 1_000_000);

    execute(
        deps.as_mut(),
        env.clone(),
        mock_info("user", &[]),
        ExecuteMsg::Unstake {
            amount: Uint128::from(1_000_000u128),
        },
    )
    .unwrap();

    // Before maturity
    let early = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("user", &[]),
        ExecuteMsg::ClaimUnbonding {},
    )
    .unwrap();
    assert_eq!(early.messages.len(), 0);

    // After maturity
    env.block.time = env
        .block
        .time
        .plus_seconds(DEFAULT_UNBONDING_PERIOD_SECONDS + 1);
    let mature = execute(
        deps.as_mut(),
        env,
        mock_info("user", &[]),
        ExecuteMsg::ClaimUnbonding {},
    )
    .unwrap();
    // Should have CW-20 Transfer message
    assert_eq!(mature.messages.len(), 1);
    assert_eq!(
        mature
            .attributes
            .iter()
            .find(|a| a.key == "claimed")
            .map(|a| a.value.as_str()),
        Some("1000000")
    );
}

#[test]
fn default_unbonding_is_21_days() {
    let (deps, env) = setup();
    let resp: ConfigResponse =
        cosmwasm_std::from_json(query(deps.as_ref(), env, QueryMsg::Config {}).unwrap()).unwrap();
    assert_eq!(resp.unbonding_period_seconds, 1_814_400);
}

#[test]
fn apply_testing_overrides_admin_updates_state() {
    let (mut deps, env) = setup();
    let info = mock_info("admin", &[]);
    execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::ApplyTestingOverrides {
            overrides: TestingOverrides {
                paused: Some(true),
                unbonding_period_seconds: Some(10),
                staking_reserve: Some(Uint128::from(33u128)),
                staking_total_staked: Some(Uint128::from(44u128)),
                staking_reward_index: Some(Uint256::from(55u128)),
                total_accrued_rewards: Some(Uint128::from(66u128)),
                total_claimed_rewards: Some(Uint128::from(11u128)),
            },
        },
    )
    .unwrap();

    let cfg = CONFIG.load(deps.as_ref().storage).unwrap();
    assert!(cfg.paused);
    assert_eq!(cfg.unbonding_period_seconds, 10);
    assert_eq!(
        STAKING_RESERVE.load(deps.as_ref().storage).unwrap(),
        Uint128::from(33u128)
    );
    assert_eq!(
        STAKING_TOTAL_STAKED.load(deps.as_ref().storage).unwrap(),
        Uint128::from(44u128)
    );
    assert_eq!(
        STAKING_REWARD_INDEX.load(deps.as_ref().storage).unwrap(),
        Uint256::from(55u128)
    );
    assert_eq!(
        TOTAL_ACCRUED_REWARDS.load(deps.as_ref().storage).unwrap(),
        Uint128::from(66u128)
    );
    assert_eq!(
        TOTAL_CLAIMED_REWARDS.load(deps.as_ref().storage).unwrap(),
        Uint128::from(11u128)
    );
}

#[test]
fn apply_testing_overrides_unauthorized() {
    let (mut deps, env) = setup();
    let info = mock_info("hacker", &[]);
    let err = execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::ApplyTestingOverrides {
            overrides: TestingOverrides {
                paused: Some(true),
                unbonding_period_seconds: None,
                staking_reserve: None,
                staking_total_staked: None,
                staking_reward_index: None,
                total_accrued_rewards: None,
                total_claimed_rewards: None,
            },
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::Unauthorized {});
}

/// Regression: when claimed exceeds accrued by rounding dust,
/// TotalPendingRewards query must return 0 (not panic from overflow).
#[test]
fn total_pending_rewards_saturates_on_rounding_dust() {
    let (mut deps, env) = setup();

    // Simulate: accrued = 100, claimed = 111 (dust overshoot)
    TOTAL_ACCRUED_REWARDS
        .save(deps.as_mut().storage, &Uint128::from(100u128))
        .unwrap();
    TOTAL_CLAIMED_REWARDS
        .save(deps.as_mut().storage, &Uint128::from(111u128))
        .unwrap();

    let resp: TotalPendingRewardsResponse = cosmwasm_std::from_json(
        query(deps.as_ref(), env, QueryMsg::TotalPendingRewards {}).unwrap(),
    )
    .unwrap();
    assert_eq!(resp.total_pending_rewards, Uint128::zero());
}

/// Verify claim increments TOTAL_CLAIMED_REWARDS instead of decrementing a single counter.
#[test]
fn claim_staking_rewards_increments_claimed_counter() {
    let (mut deps, env) = setup();
    stake_via_receive(&mut deps, env.clone(), "user", 1_000_000);

    // Accrue reward
    let info = mock_info("mine_contract", &[]);
    execute(
        deps.as_mut(),
        env.clone(),
        info,
        ExecuteMsg::AccrueReward {
            amount: Uint128::from(500u128),
        },
    )
    .unwrap();

    let accrued_before = TOTAL_ACCRUED_REWARDS.load(deps.as_ref().storage).unwrap();
    assert_eq!(accrued_before, Uint128::from(500u128));
    let claimed_before = TOTAL_CLAIMED_REWARDS.load(deps.as_ref().storage).unwrap();
    assert_eq!(claimed_before, Uint128::zero());

    // Claim
    execute(
        deps.as_mut(),
        env.clone(),
        mock_info("user", &[]),
        ExecuteMsg::ClaimStakingRewards {},
    )
    .unwrap();

    // Accrued stays the same, claimed increases
    let accrued_after = TOTAL_ACCRUED_REWARDS.load(deps.as_ref().storage).unwrap();
    assert_eq!(accrued_after, accrued_before);
    let claimed_after = TOTAL_CLAIMED_REWARDS.load(deps.as_ref().storage).unwrap();
    assert!(claimed_after > Uint128::zero());

    // Query returns the difference
    let resp: TotalPendingRewardsResponse = cosmwasm_std::from_json(
        query(deps.as_ref(), env, QueryMsg::TotalPendingRewards {}).unwrap(),
    )
    .unwrap();
    assert_eq!(
        resp.total_pending_rewards,
        accrued_after.saturating_sub(claimed_after)
    );
}
