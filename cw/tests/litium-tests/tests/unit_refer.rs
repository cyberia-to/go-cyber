// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{Addr, Env, StdResult, Uint128};

use litium_refer::contract::{execute, query};
use litium_refer::error::ContractError;
use litium_refer::msg::{
    CommunityPoolBalanceResponse, ExecuteMsg, QueryMsg, ReferralInfoResponse, ReferrerOfResponse,
    TestingOverrides, TotalPendingRewardsResponse,
};
use litium_refer::state::{
    ReferConfig, COMMUNITY_POOL_BALANCE, CONFIG, TOTAL_ACCRUED_REWARDS, TOTAL_CLAIMED_REWARDS,
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
    let config = ReferConfig {
        core_contract: Addr::unchecked("core_contract"),
        mine_contract: Addr::unchecked("mine_contract"),
        community_pool_addr: None,
        admin: Addr::unchecked("admin"),
        paused: false,
    };
    CONFIG.save(deps.as_mut().storage, &config).unwrap();
    COMMUNITY_POOL_BALANCE
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    TOTAL_ACCRUED_REWARDS
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    TOTAL_CLAIMED_REWARDS
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    (deps, env)
}

#[test]
fn only_mine_can_bind_referrer() {
    let (mut deps, env) = setup();
    let info = mock_info("random", &[]);
    let err = execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::BindReferrer {
            miner: "miner1".to_string(),
            referrer: "referrer1".to_string(),
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::NotMineContract {});
}

#[test]
fn bind_referrer_works() {
    let (mut deps, env) = setup();
    let info = mock_info("mine_contract", &[]);
    execute(
        deps.as_mut(),
        env.clone(),
        info,
        ExecuteMsg::BindReferrer {
            miner: "miner1".to_string(),
            referrer: "referrer1".to_string(),
        },
    )
    .unwrap();

    let resp: ReferrerOfResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env,
            QueryMsg::ReferrerOf {
                miner: "miner1".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert_eq!(resp.referrer, Some("referrer1".to_string()));
}

#[test]
fn self_referral_rejected() {
    let (mut deps, env) = setup();
    let info = mock_info("mine_contract", &[]);
    let err = execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::BindReferrer {
            miner: "miner1".to_string(),
            referrer: "miner1".to_string(),
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::SelfReferral {});
}

#[test]
fn referrer_mismatch_rejected() {
    let (mut deps, env) = setup();
    let info = mock_info("mine_contract", &[]);
    execute(
        deps.as_mut(),
        env.clone(),
        info.clone(),
        ExecuteMsg::BindReferrer {
            miner: "miner1".to_string(),
            referrer: "referrer1".to_string(),
        },
    )
    .unwrap();

    let err = execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::BindReferrer {
            miner: "miner1".to_string(),
            referrer: "referrer2".to_string(),
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::ReferrerMismatch {});
}

#[test]
fn accrue_to_referrer() {
    let (mut deps, env) = setup();
    let info = mock_info("mine_contract", &[]);

    // Bind first
    execute(
        deps.as_mut(),
        env.clone(),
        info.clone(),
        ExecuteMsg::BindReferrer {
            miner: "miner1".to_string(),
            referrer: "referrer1".to_string(),
        },
    )
    .unwrap();

    // Accrue
    execute(
        deps.as_mut(),
        env.clone(),
        info,
        ExecuteMsg::AccrueReward {
            miner: "miner1".to_string(),
            amount: Uint128::from(100u128),
        },
    )
    .unwrap();

    let resp: ReferralInfoResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env,
            QueryMsg::ReferralInfo {
                address: "referrer1".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert_eq!(resp.referral_rewards, Uint128::from(100u128));
    assert_eq!(resp.referrals_count, 1);
}

#[test]
fn accrue_to_community_pool_when_no_referrer() {
    let (mut deps, env) = setup();
    let info = mock_info("mine_contract", &[]);

    // Accrue without binding referrer
    execute(
        deps.as_mut(),
        env.clone(),
        info,
        ExecuteMsg::AccrueReward {
            miner: "miner1".to_string(),
            amount: Uint128::from(100u128),
        },
    )
    .unwrap();

    let resp: CommunityPoolBalanceResponse = cosmwasm_std::from_json(
        query(deps.as_ref(), env, QueryMsg::CommunityPoolBalance {}).unwrap(),
    )
    .unwrap();
    assert_eq!(resp.balance, Uint128::from(100u128));
}

#[test]
fn claim_rewards() {
    let (mut deps, env) = setup();
    let info = mock_info("mine_contract", &[]);

    // Bind + accrue
    execute(
        deps.as_mut(),
        env.clone(),
        info.clone(),
        ExecuteMsg::BindReferrer {
            miner: "miner1".to_string(),
            referrer: "referrer1".to_string(),
        },
    )
    .unwrap();
    execute(
        deps.as_mut(),
        env.clone(),
        info,
        ExecuteMsg::AccrueReward {
            miner: "miner1".to_string(),
            amount: Uint128::from(100u128),
        },
    )
    .unwrap();

    // Claim as referrer
    let info = mock_info("referrer1", &[]);
    let res = execute(
        deps.as_mut(),
        env.clone(),
        info,
        ExecuteMsg::ClaimRewards {},
    )
    .unwrap();
    assert_eq!(res.messages.len(), 1); // Mint msg to core

    // Should be zero after claim
    let resp: ReferralInfoResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env,
            QueryMsg::ReferralInfo {
                address: "referrer1".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert_eq!(resp.referral_rewards, Uint128::zero());
}

#[test]
fn claim_rewards_rejected_when_paused() {
    let (mut deps, env) = setup();
    CONFIG
        .update(deps.as_mut().storage, |mut c| -> StdResult<_> {
            c.paused = true;
            Ok(c)
        })
        .unwrap();

    let err = execute(
        deps.as_mut(),
        env,
        mock_info("referrer1", &[]),
        ExecuteMsg::ClaimRewards {},
    )
    .unwrap_err();
    assert_eq!(err, ContractError::Paused {});
}

#[test]
fn claim_community_pool_rejected_when_paused() {
    let (mut deps, env) = setup();
    CONFIG
        .update(deps.as_mut().storage, |mut c| -> StdResult<_> {
            c.paused = true;
            Ok(c)
        })
        .unwrap();

    let err = execute(
        deps.as_mut(),
        env,
        mock_info("admin", &[]),
        ExecuteMsg::ClaimCommunityPool {
            to: "recipient".to_string(),
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::Paused {});
}

#[test]
fn claim_community_pool_requires_admin() {
    let (mut deps, env) = setup();
    COMMUNITY_POOL_BALANCE
        .save(deps.as_mut().storage, &Uint128::from(10u128))
        .unwrap();

    let err = execute(
        deps.as_mut(),
        env,
        mock_info("not_admin", &[]),
        ExecuteMsg::ClaimCommunityPool {
            to: "recipient".to_string(),
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::Unauthorized {});
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
                community_pool_addr: Some("pool".to_string()),
                community_pool_balance: Some(Uint128::from(123u128)),
                total_accrued_rewards: Some(Uint128::from(321u128)),
                total_claimed_rewards: Some(Uint128::from(21u128)),
            },
        },
    )
    .unwrap();

    let cfg = CONFIG.load(deps.as_ref().storage).unwrap();
    assert!(cfg.paused);
    assert_eq!(cfg.community_pool_addr.unwrap().as_str(), "pool");
    assert_eq!(
        COMMUNITY_POOL_BALANCE.load(deps.as_ref().storage).unwrap(),
        Uint128::from(123u128)
    );
    assert_eq!(
        TOTAL_ACCRUED_REWARDS.load(deps.as_ref().storage).unwrap(),
        Uint128::from(321u128)
    );
    assert_eq!(
        TOTAL_CLAIMED_REWARDS.load(deps.as_ref().storage).unwrap(),
        Uint128::from(21u128)
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
                community_pool_addr: None,
                community_pool_balance: None,
                total_accrued_rewards: None,
                total_claimed_rewards: None,
            },
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::Unauthorized {});
}

/// Regression: when claimed exceeds accrued (should never happen but defensive),
/// TotalPendingRewards query must return 0 (not panic from overflow).
#[test]
fn total_pending_rewards_saturates_on_overshoot() {
    let (mut deps, env) = setup();

    TOTAL_ACCRUED_REWARDS
        .save(deps.as_mut().storage, &Uint128::from(50u128))
        .unwrap();
    TOTAL_CLAIMED_REWARDS
        .save(deps.as_mut().storage, &Uint128::from(55u128))
        .unwrap();

    let resp: TotalPendingRewardsResponse = cosmwasm_std::from_json(
        query(deps.as_ref(), env, QueryMsg::TotalPendingRewards {}).unwrap(),
    )
    .unwrap();
    assert_eq!(resp.total_pending_rewards, Uint128::zero());
}

/// Verify claim increments TOTAL_CLAIMED_REWARDS instead of decrementing a single counter.
#[test]
fn claim_rewards_increments_claimed_counter() {
    let (mut deps, env) = setup();

    // Bind referrer and accrue reward
    let mine_info = mock_info("mine_contract", &[]);
    execute(
        deps.as_mut(),
        env.clone(),
        mine_info.clone(),
        ExecuteMsg::BindReferrer {
            miner: "miner1".to_string(),
            referrer: "referrer1".to_string(),
        },
    )
    .unwrap();
    execute(
        deps.as_mut(),
        env.clone(),
        mine_info,
        ExecuteMsg::AccrueReward {
            miner: "miner1".to_string(),
            amount: Uint128::from(200u128),
        },
    )
    .unwrap();

    let accrued = TOTAL_ACCRUED_REWARDS.load(deps.as_ref().storage).unwrap();
    assert_eq!(accrued, Uint128::from(200u128));
    assert_eq!(
        TOTAL_CLAIMED_REWARDS.load(deps.as_ref().storage).unwrap(),
        Uint128::zero()
    );

    // Claim as referrer
    execute(
        deps.as_mut(),
        env.clone(),
        mock_info("referrer1", &[]),
        ExecuteMsg::ClaimRewards {},
    )
    .unwrap();

    // Accrued unchanged, claimed increased
    assert_eq!(
        TOTAL_ACCRUED_REWARDS.load(deps.as_ref().storage).unwrap(),
        Uint128::from(200u128)
    );
    assert_eq!(
        TOTAL_CLAIMED_REWARDS.load(deps.as_ref().storage).unwrap(),
        Uint128::from(200u128)
    );

    // Query returns zero pending
    let resp: TotalPendingRewardsResponse = cosmwasm_std::from_json(
        query(deps.as_ref(), env, QueryMsg::TotalPendingRewards {}).unwrap(),
    )
    .unwrap();
    assert_eq!(resp.total_pending_rewards, Uint128::zero());
}
