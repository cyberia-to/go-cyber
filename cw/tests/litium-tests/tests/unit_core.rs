// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{Addr, Binary, Env, StdResult, Uint128};
use cw20::{BalanceResponse, TokenInfoResponse};
use cw20_base::state::{TokenInfo, BALANCES, TOKEN_INFO};

use litium_core::contract::{execute, query, SUPPLY_CAP};
use litium_core::error::ContractError;
use litium_core::msg::{ExecuteMsg, IsAuthorizedCallerResponse, QueryMsg, TestingOverrides};
use litium_core::state::{
    CoreConfig, AUTHORIZED_CALLERS, BURN_TOTAL, CONFIG, FEE_TOTAL, TOTAL_MINTED,
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

    // Initialize CW-20 token info
    let token_info = TokenInfo {
        name: "Litium".to_string(),
        symbol: "LI".to_string(),
        decimals: 6,
        total_supply: Uint128::zero(),
        mint: None,
    };
    TOKEN_INFO.save(deps.as_mut().storage, &token_info).unwrap();

    let config = CoreConfig {
        admin: Addr::unchecked("admin"),
        paused: false,
        mine_contract: None,
        stake_contract: None,
        refer_contract: None,
        wrap_contract: None,
    };
    CONFIG.save(deps.as_mut().storage, &config).unwrap();
    BURN_TOTAL
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    FEE_TOTAL
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    TOTAL_MINTED
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    (deps, env)
}

fn give_balance(
    deps: &mut cosmwasm_std::OwnedDeps<
        cosmwasm_std::MemoryStorage,
        cosmwasm_std::testing::MockApi,
        cosmwasm_std::testing::MockQuerier,
    >,
    addr: &str,
    amount: u128,
) {
    let addr = Addr::unchecked(addr);
    BALANCES
        .save(deps.as_mut().storage, &addr, &Uint128::from(amount))
        .unwrap();
    TOKEN_INFO
        .update(deps.as_mut().storage, |mut info| -> StdResult<_> {
            info.total_supply += Uint128::from(amount);
            Ok(info)
        })
        .unwrap();
}

#[test]
fn unauthorized_caller_cannot_mint() {
    let (mut deps, env) = setup();
    let info = mock_info("random", &[]);
    let msg = ExecuteMsg::Mint {
        to: "recipient".to_string(),
        amount: Uint128::from(1000u128),
    };
    let err = execute(deps.as_mut(), env, info, msg).unwrap_err();
    assert_eq!(
        err,
        ContractError::NotAuthorizedCaller {
            addr: "random".to_string()
        }
    );
}

#[test]
fn authorized_caller_can_mint() {
    let (mut deps, env) = setup();
    let addr = Addr::unchecked("mine_contract");
    AUTHORIZED_CALLERS
        .save(deps.as_mut().storage, &addr, &true)
        .unwrap();

    let info = mock_info("mine_contract", &[]);
    let msg = ExecuteMsg::Mint {
        to: "miner1".to_string(),
        amount: Uint128::from(1000u128),
    };
    let res = execute(deps.as_mut(), env.clone(), info, msg).unwrap();
    assert_eq!(res.messages.len(), 0);
    assert_eq!(
        TOTAL_MINTED.load(deps.as_ref().storage).unwrap(),
        Uint128::from(1000u128)
    );

    // Check CW-20 balance
    let balance: BalanceResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env,
            QueryMsg::Balance {
                address: "miner1".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert_eq!(balance.balance, Uint128::from(1000u128));
}

#[test]
fn supply_cap_enforced() {
    let (mut deps, env) = setup();
    let addr = Addr::unchecked("mine_contract");
    AUTHORIZED_CALLERS
        .save(deps.as_mut().storage, &addr, &true)
        .unwrap();
    TOTAL_MINTED
        .save(deps.as_mut().storage, &Uint128::from(SUPPLY_CAP))
        .unwrap();

    let info = mock_info("mine_contract", &[]);
    let msg = ExecuteMsg::Mint {
        to: "miner1".to_string(),
        amount: Uint128::from(1u128),
    };
    let err = execute(deps.as_mut(), env, info, msg).unwrap_err();
    assert_eq!(err, ContractError::SupplyCapExceeded {});
}

#[test]
fn admin_can_register_and_remove_callers() {
    let (mut deps, env) = setup();

    let info = mock_info("admin", &[]);
    let msg = ExecuteMsg::RegisterAuthorizedCaller {
        contract_addr: "new_contract".to_string(),
    };
    execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();

    let resp: IsAuthorizedCallerResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env.clone(),
            QueryMsg::IsAuthorizedCaller {
                address: "new_contract".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert!(resp.authorized);

    let msg = ExecuteMsg::RemoveAuthorizedCaller {
        contract_addr: "new_contract".to_string(),
    };
    execute(deps.as_mut(), env.clone(), info, msg).unwrap();

    let resp: IsAuthorizedCallerResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env,
            QueryMsg::IsAuthorizedCaller {
                address: "new_contract".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert!(!resp.authorized);
}

#[test]
fn non_admin_cannot_register_callers() {
    let (mut deps, env) = setup();
    let info = mock_info("random", &[]);
    let msg = ExecuteMsg::RegisterAuthorizedCaller {
        contract_addr: "hacker".to_string(),
    };
    let err = execute(deps.as_mut(), env, info, msg).unwrap_err();
    assert_eq!(err, ContractError::Unauthorized {});
}

#[test]
fn transfer_burns_1_percent_fee() {
    let (mut deps, env) = setup();

    // Configure mine_contract so AccrueFees notification works
    CONFIG
        .update(deps.as_mut().storage, |mut c| -> StdResult<_> {
            c.mine_contract = Some(Addr::unchecked("mine_contract"));
            Ok(c)
        })
        .unwrap();
    FEE_TOTAL
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();

    give_balance(&mut deps, "user", 1000);

    let info = mock_info("user", &[]);
    let msg = ExecuteMsg::Transfer {
        recipient: "recipient".to_string(),
        amount: Uint128::from(1000u128),
    };
    let res = execute(deps.as_mut(), env.clone(), info, msg).unwrap();
    // Should have an AccrueFees notification to mine contract
    assert_eq!(res.messages.len(), 1);
    assert_eq!(
        FEE_TOTAL.load(deps.as_ref().storage).unwrap(),
        Uint128::from(10u128)
    );
    // Fee is burned permanently
    assert_eq!(
        BURN_TOTAL.load(deps.as_ref().storage).unwrap(),
        Uint128::from(10u128)
    );

    // Check balances
    let sender_bal: BalanceResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env.clone(),
            QueryMsg::Balance {
                address: "user".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert_eq!(sender_bal.balance, Uint128::zero());

    let rcpt_bal: BalanceResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env.clone(),
            QueryMsg::Balance {
                address: "recipient".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert_eq!(rcpt_bal.balance, Uint128::from(990u128));

    // Fee NOT credited to mine_contract — burned instead
    let mine_bal: BalanceResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env,
            QueryMsg::Balance {
                address: "mine_contract".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert_eq!(mine_bal.balance, Uint128::zero());
}

#[test]
fn transfer_exempt_for_authorized_sender() {
    let (mut deps, env) = setup();
    CONFIG
        .update(deps.as_mut().storage, |mut c| -> StdResult<_> {
            c.stake_contract = Some(Addr::unchecked("stake_contract"));
            Ok(c)
        })
        .unwrap();
    give_balance(&mut deps, "stake_contract", 1000);

    let info = mock_info("stake_contract", &[]);
    let msg = ExecuteMsg::Transfer {
        recipient: "user".to_string(),
        amount: Uint128::from(1000u128),
    };
    execute(deps.as_mut(), env.clone(), info, msg).unwrap();

    assert_eq!(
        BURN_TOTAL.load(deps.as_ref().storage).unwrap(),
        Uint128::zero()
    );
    let rcpt_bal: BalanceResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env,
            QueryMsg::Balance {
                address: "user".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert_eq!(rcpt_bal.balance, Uint128::from(1000u128));
}

#[test]
fn transfer_exempt_for_authorized_recipient() {
    let (mut deps, env) = setup();
    CONFIG
        .update(deps.as_mut().storage, |mut c| -> StdResult<_> {
            c.stake_contract = Some(Addr::unchecked("stake_contract"));
            Ok(c)
        })
        .unwrap();
    give_balance(&mut deps, "user", 1000);

    let info = mock_info("user", &[]);
    let msg = ExecuteMsg::Transfer {
        recipient: "stake_contract".to_string(),
        amount: Uint128::from(1000u128),
    };
    execute(deps.as_mut(), env.clone(), info, msg).unwrap();

    assert_eq!(
        BURN_TOTAL.load(deps.as_ref().storage).unwrap(),
        Uint128::zero()
    );
    let rcpt_bal: BalanceResponse = cosmwasm_std::from_json(
        query(
            deps.as_ref(),
            env,
            QueryMsg::Balance {
                address: "stake_contract".to_string(),
            },
        )
        .unwrap(),
    )
    .unwrap();
    assert_eq!(rcpt_bal.balance, Uint128::from(1000u128));
}

#[test]
fn send_routes_1_percent_fee() {
    let (mut deps, env) = setup();

    CONFIG
        .update(deps.as_mut().storage, |mut c| -> StdResult<_> {
            c.mine_contract = Some(Addr::unchecked("mine_contract"));
            Ok(c)
        })
        .unwrap();
    FEE_TOTAL
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();

    give_balance(&mut deps, "user", 1000);

    let info = mock_info("user", &[]);
    let msg = ExecuteMsg::Send {
        contract: "some_contract".to_string(),
        amount: Uint128::from(1000u128),
        msg: Binary::default(),
    };
    let res = execute(deps.as_mut(), env, info, msg).unwrap();
    // Should have Cw20ReceiveMsg + AccrueFees messages
    assert_eq!(res.messages.len(), 2);
    assert_eq!(
        FEE_TOTAL.load(deps.as_ref().storage).unwrap(),
        Uint128::from(10u128)
    );
}

#[test]
fn send_exempt_for_authorized_recipient() {
    let (mut deps, env) = setup();
    CONFIG
        .update(deps.as_mut().storage, |mut c| -> StdResult<_> {
            c.wrap_contract = Some(Addr::unchecked("wrap_contract"));
            Ok(c)
        })
        .unwrap();
    give_balance(&mut deps, "user", 1000);

    let info = mock_info("user", &[]);
    let msg = ExecuteMsg::Send {
        contract: "wrap_contract".to_string(),
        amount: Uint128::from(1000u128),
        msg: Binary::default(),
    };
    execute(deps.as_mut(), env, info, msg).unwrap();

    assert_eq!(
        BURN_TOTAL.load(deps.as_ref().storage).unwrap(),
        Uint128::zero()
    );
}

#[test]
fn burn_zero_rejected() {
    let (mut deps, env) = setup();
    let err = execute(
        deps.as_mut(),
        env,
        mock_info("user", &[]),
        ExecuteMsg::Burn {
            amount: Uint128::zero(),
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::InvalidAmount {});
}

#[test]
fn pause_blocks_operations() {
    let (mut deps, env) = setup();

    let info = mock_info("admin", &[]);
    execute(deps.as_mut(), env.clone(), info, ExecuteMsg::Pause {}).unwrap();

    let addr = Addr::unchecked("mine_contract");
    AUTHORIZED_CALLERS
        .save(deps.as_mut().storage, &addr, &true)
        .unwrap();

    let info = mock_info("mine_contract", &[]);
    let err = execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::Mint {
            to: "miner".to_string(),
            amount: Uint128::from(100u128),
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::Paused {});
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
                burn_total: Some(Uint128::from(55u128)),
                fee_total: None,
                total_minted: Some(Uint128::from(77u128)),
            },
        },
    )
    .unwrap();

    let cfg = CONFIG.load(deps.as_ref().storage).unwrap();
    assert!(cfg.paused);
    assert_eq!(
        BURN_TOTAL.load(deps.as_ref().storage).unwrap(),
        Uint128::from(55u128)
    );
    assert_eq!(
        TOTAL_MINTED.load(deps.as_ref().storage).unwrap(),
        Uint128::from(77u128)
    );
}

#[test]
fn apply_testing_overrides_unauthorized() {
    let (mut deps, env) = setup();
    let info = mock_info("random", &[]);
    let err = execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::ApplyTestingOverrides {
            overrides: TestingOverrides {
                paused: Some(true),
                burn_total: None,
                fee_total: None,
                total_minted: None,
            },
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::Unauthorized {});
}

#[test]
fn token_info_query_works() {
    let (deps, env) = setup();
    let info: TokenInfoResponse =
        cosmwasm_std::from_json(query(deps.as_ref(), env, QueryMsg::TokenInfo {}).unwrap())
            .unwrap();
    assert_eq!(info.name, "Litium");
    assert_eq!(info.symbol, "LI");
    assert_eq!(info.decimals, 6);
}

#[test]
fn mint_increases_total_supply() {
    let (mut deps, env) = setup();
    let addr = Addr::unchecked("mine_contract");
    AUTHORIZED_CALLERS
        .save(deps.as_mut().storage, &addr, &true)
        .unwrap();

    execute(
        deps.as_mut(),
        env.clone(),
        mock_info("mine_contract", &[]),
        ExecuteMsg::Mint {
            to: "miner1".to_string(),
            amount: Uint128::from(5000u128),
        },
    )
    .unwrap();

    let info: TokenInfoResponse =
        cosmwasm_std::from_json(query(deps.as_ref(), env, QueryMsg::TokenInfo {}).unwrap())
            .unwrap();
    assert_eq!(info.total_supply, Uint128::from(5000u128));
}

#[test]
fn transfer_insufficient_balance_fails() {
    let (mut deps, env) = setup();
    give_balance(&mut deps, "user", 100);

    let err = execute(
        deps.as_mut(),
        env,
        mock_info("user", &[]),
        ExecuteMsg::Transfer {
            recipient: "bob".to_string(),
            amount: Uint128::from(200u128),
        },
    )
    .unwrap_err();
    // Should be an overflow/underflow error from checked_sub
    match err {
        ContractError::Std(_) => {} // expected
        _ => panic!("expected Std error from checked_sub, got: {:?}", err),
    }
}
