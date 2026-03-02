# Messages

All messages are standard Cosmos SDK staking messages. Four of them are wrapped with hydrogen mint/burn logic.

## MsgCreateValidator

Standard validator creation. Additionally mints hydrogen equal to the self-delegation amount to the validator operator.

## MsgDelegate

Standard delegation. Additionally mints hydrogen equal to the delegated amount to the delegator.

## MsgBeginRedelegate

Standard redelegation. No hydrogen side effects (stake remains delegated, hydrogen unchanged).

## MsgUndelegate

Standard undelegation. Additionally burns hydrogen equal to the undelegated amount from the delegator.

## MsgCancelUnbondingDelegation

Standard cancel unbonding. Additionally re-mints hydrogen equal to the cancelled amount to the delegator.

## MsgEditValidator

Standard validator edit. No hydrogen side effects.

## MsgUpdateParams

Standard governance parameter update. No hydrogen side effects.
