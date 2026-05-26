import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgExec, MsgGrant, MsgRevoke } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { MsgDeposit, MsgSubmitProposal, MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { MsgBeginRedelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";

import { MsgCyberlink } from "./codec/cyber/graph/v1beta1/tx";
import {
  MsgCreateRoute,
  MsgDeleteRoute,
  MsgEditRoute,
  MsgEditRouteName,
} from "./codec/cyber/grid/v1beta1/tx";
import { MsgInvestmint } from "./codec/cyber/resources/v1beta1/tx";
import {
  MsgCreatePool,
  MsgDepositWithinBatch,
  MsgSwapWithinBatch,
  MsgWithdrawWithinBatch,
} from "./codec/tendermint/liquidity/v1beta1/tx";

// Staking module

export interface MsgBeginRedelegateEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate";
  readonly value: Partial<MsgBeginRedelegate>;
}

export function isMsgBeginRedelegateEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgBeginRedelegateEncodeObject {
  return (
    (encodeObject as MsgBeginRedelegateEncodeObject).typeUrl === "/cosmos.staking.v1beta1.MsgBeginRedelegate"
  );
}

// Energy module

export interface MsgCreateRouteEncodeObject extends EncodeObject {
  readonly typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute";
  readonly value: Partial<MsgCreateRoute>;
}

export function isMsgCreateRouteEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgCreateRouteEncodeObject {
  return (encodeObject as MsgCreateRouteEncodeObject).typeUrl === "/cyber.grid.v1beta1.MsgCreateRoute";
}

export interface MsgDeleteRouteEncodeObject extends EncodeObject {
  readonly typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute";
  readonly value: Partial<MsgDeleteRoute>;
}

export function isMsgDeleteRouteEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgDeleteRouteEncodeObject {
  return (encodeObject as MsgDeleteRouteEncodeObject).typeUrl === "/cyber.grid.v1beta1.MsgDeleteRoute";
}

export interface MsgEditRouteEncodeObject extends EncodeObject {
  readonly typeUrl: "/cyber.grid.v1beta1.MsgEditRoute";
  readonly value: Partial<MsgEditRoute>;
}

export function isMsgEditRouteEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgEditRouteEncodeObject {
  return (encodeObject as MsgEditRouteEncodeObject).typeUrl === "/cyber.grid.v1beta1.MsgEditRoute";
}

export interface MsgEditRouteNameEncodeObject extends EncodeObject {
  readonly typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName";
  readonly value: Partial<MsgEditRouteName>;
}

export function isMsgEditRouteNameEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgEditRouteNameEncodeObject {
  return (encodeObject as MsgEditRouteNameEncodeObject).typeUrl === "/cyber.grid.v1beta1.MsgEditRouteName";
}

// Graph module

export interface MsgCyberlinkEncodeObject extends EncodeObject {
  readonly typeUrl: "/cyber.graph.v1beta1.MsgCyberlink";
  readonly value: Partial<MsgCyberlink>;
}

export function isMsgCyberlinkEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgCyberlinkEncodeObject {
  return (encodeObject as MsgCyberlinkEncodeObject).typeUrl === "/cyber.graph.v1beta1.MsgCyberlink";
}

// Resources module

export interface MsgInvestmintEncodeObject extends EncodeObject {
  readonly typeUrl: "/cyber.resources.v1beta1.MsgInvestmint";
  readonly value: Partial<MsgInvestmint>;
}

export function isMsgInvestmintEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgInvestmintEncodeObject {
  return (encodeObject as MsgInvestmintEncodeObject).typeUrl === "/cyber.resources.v1beta1.MsgInvestmint";
}

// Liquidity module

export interface MsgSwapWithinBatchEncodeObject extends EncodeObject {
  readonly typeUrl: "/tendermint.liquidity.v1beta1.MsgSwapWithinBatch";
  readonly value: Partial<MsgSwapWithinBatch>;
}

export function isMsgSwapWithinBatchEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgSwapWithinBatchEncodeObject {
  return (
    (encodeObject as MsgSwapWithinBatchEncodeObject).typeUrl ===
    "/tendermint.liquidity.v1beta1.MsgSwapWithinBatch"
  );
}

export interface MsgDepositWithinBatchEncodeObject extends EncodeObject {
  readonly typeUrl: "/tendermint.liquidity.v1beta1.MsgDepositWithinBatch";
  readonly value: Partial<MsgDepositWithinBatch>;
}

export function isMsgDepositWithinBatchEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgDepositWithinBatchEncodeObject {
  return (
    (encodeObject as MsgDepositWithinBatchEncodeObject).typeUrl ===
    "/tendermint.liquidity.v1beta1.MsgDepositWithinBatch"
  );
}

export interface MsgWithdrawWithinBatchEncodeObject extends EncodeObject {
  readonly typeUrl: "/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch";
  readonly value: Partial<MsgWithdrawWithinBatch>;
}

export function isMsgWithdrawWithinBatchEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgWithdrawWithinBatchEncodeObject {
  return (
    (encodeObject as MsgWithdrawWithinBatchEncodeObject).typeUrl ===
    "/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch"
  );
}

export interface MsgCreatePoolEncodeObject extends EncodeObject {
  readonly typeUrl: "/tendermint.liquidity.v1beta1.MsgCreatePool";
  readonly value: Partial<MsgCreatePool>;
}

export function isMsgCreatePoolEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgCreatePoolEncodeObject {
  return (
    (encodeObject as MsgCreatePoolEncodeObject).typeUrl === "/tendermint.liquidity.v1beta1.MsgCreatePool"
  );
}

// Gov module

export interface MsgSubmitProposalEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal";
  readonly value: Partial<MsgSubmitProposal>;
}

export function isMsgSubmitProposalEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is MsgSubmitProposalEncodeObject {
  return (encodeObject as MsgSubmitProposalEncodeObject).typeUrl === "/cosmos.gov.v1beta1.MsgSubmitProposal";
}

export interface MsgVoteEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.gov.v1beta1.MsgVote";
  readonly value: Partial<MsgVote>;
}

export function isMsgVoteEncodeObject(encodeObject: EncodeObject): encodeObject is MsgVoteEncodeObject {
  return (encodeObject as MsgVoteEncodeObject).typeUrl === "/cosmos.gov.v1beta1.MsgVote";
}

export interface MsgDepositEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.gov.v1beta1.MsgDeposit";
  readonly value: Partial<MsgDeposit>;
}

export function isMsgDepositEncodeObject(encodeObject: EncodeObject): encodeObject is MsgDepositEncodeObject {
  return (encodeObject as MsgDepositEncodeObject).typeUrl === "/cosmos.gov.v1beta1.MsgDeposit";
}

export interface MsgGrantEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.authz.v1beta1.MsgGrant";
  readonly value: Partial<MsgGrant>;
}

export function isMsgGrantEncodeObject(encodeObject: EncodeObject): encodeObject is MsgGrantEncodeObject {
  return (encodeObject as MsgGrantEncodeObject).typeUrl === "/cosmos.authz.v1beta1.MsgGrant";
}

export interface MsgExecEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.authz.v1beta1.MsgExec";
  readonly value: Partial<MsgExec>;
}

export function isMsgExecEncodeObject(encodeObject: EncodeObject): encodeObject is MsgExecEncodeObject {
  return (encodeObject as MsgExecEncodeObject).typeUrl === "/cosmos.authz.v1beta1.MsgExec";
}
export interface MsgRevokeEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.authz.v1beta1.MsgRevoke";
  readonly value: Partial<MsgRevoke>;
}

export function isMsgRevokeEncodeObject(encodeObject: EncodeObject): encodeObject is MsgRevokeEncodeObject {
  return (encodeObject as MsgRevokeEncodeObject).typeUrl === "/cosmos.authz.v1beta1.MsgRevoke";
}
