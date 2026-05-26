// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
use cosmwasm_std::{Addr, Binary, Env, Uint128};
use cw20::Cw20ReceiveMsg;

use litium_wrap::contract::execute;
use litium_wrap::error::ContractError;
use litium_wrap::msg::{ExecuteMsg, TestingOverrides};
use litium_wrap::state::{WrapConfig, CONFIG, WRAPPED_SUPPLY};

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
    let config = WrapConfig {
        cw20_contract: Addr::unchecked("core"),
        native_denom: "factory/wrap_contract/li".to_string(),
        admin: Addr::unchecked("admin"),
    };
    CONFIG.save(deps.as_mut().storage, &config).unwrap();
    WRAPPED_SUPPLY
        .save(deps.as_mut().storage, &Uint128::zero())
        .unwrap();
    (deps, env)
}

#[test]
fn receive_wraps_cw20_to_native() {
    let (mut deps, env) = setup();
    let cw20_msg = Cw20ReceiveMsg {
        sender: "alice".to_string(),
        amount: Uint128::from(1_000_000u128),
        msg: Binary::default(),
    };
    let info = mock_info("core", &[]);
    let msg = ExecuteMsg::Receive(cw20_msg);
    let res = execute(deps.as_mut(), env, info, msg).unwrap();
    // 1:1 wrap — one mint message, no burn
    assert_eq!(res.messages.len(), 1);
    assert_eq!(
        WRAPPED_SUPPLY.load(deps.as_ref().storage).unwrap(),
        Uint128::from(1_000_000u128)
    );
}

#[test]
fn receive_rejects_wrong_cw20_sender() {
    let (mut deps, env) = setup();
    let cw20_msg = Cw20ReceiveMsg {
        sender: "alice".to_string(),
        amount: Uint128::from(1_000_000u128),
        msg: Binary::default(),
    };
    let info = mock_info("wrong_contract", &[]);
    let err = execute(deps.as_mut(), env, info, ExecuteMsg::Receive(cw20_msg)).unwrap_err();
    assert_eq!(err, ContractError::InvalidCw20Sender {});
}

#[test]
fn unwrap_native_rejects_unexpected_funds() {
    let (mut deps, env) = setup();
    WRAPPED_SUPPLY
        .save(deps.as_mut().storage, &Uint128::from(1_000_000u128))
        .unwrap();

    let info = mock_info("alice", &[cosmwasm_std::coin(1u128, "boot")]);
    let err = execute(deps.as_mut(), env, info, ExecuteMsg::UnwrapNative {}).unwrap_err();
    assert_eq!(err, ContractError::UnexpectedFunds {});
}

#[test]
fn unwrap_rejects_if_wrapped_supply_underflows() {
    let (mut deps, env) = setup();
    WRAPPED_SUPPLY
        .save(deps.as_mut().storage, &Uint128::from(100u128))
        .unwrap();

    let info = mock_info(
        "alice",
        &[cosmwasm_std::coin(200u128, "factory/wrap_contract/li")],
    );
    let err = execute(deps.as_mut(), env, info, ExecuteMsg::UnwrapNative {}).unwrap_err();
    assert_eq!(err, ContractError::WrappedSupplyUnderflow {});
}

#[test]
fn apply_testing_overrides_admin_updates_wrapped_supply() {
    let (mut deps, env) = setup();
    let info = mock_info("admin", &[]);
    execute(
        deps.as_mut(),
        env,
        info,
        ExecuteMsg::ApplyTestingOverrides {
            overrides: TestingOverrides {
                wrapped_supply: Some(Uint128::from(321u128)),
            },
        },
    )
    .unwrap();
    assert_eq!(
        WRAPPED_SUPPLY.load(deps.as_ref().storage).unwrap(),
        Uint128::from(321u128)
    );
}

#[test]
fn apply_testing_overrides_unauthorized() {
    let (mut deps, env) = setup();
    let err = execute(
        deps.as_mut(),
        env,
        mock_info("hacker", &[]),
        ExecuteMsg::ApplyTestingOverrides {
            overrides: TestingOverrides {
                wrapped_supply: Some(Uint128::from(1u128)),
            },
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::Unauthorized {});
}

#[test]
fn update_config_unauthorized() {
    let (mut deps, env) = setup();
    let err = execute(
        deps.as_mut(),
        env,
        mock_info("hacker", &[]),
        ExecuteMsg::UpdateConfig {
            cw20_contract: Some("core2".to_string()),
            admin: None,
        },
    )
    .unwrap_err();
    assert_eq!(err, ContractError::Unauthorized {});
}
