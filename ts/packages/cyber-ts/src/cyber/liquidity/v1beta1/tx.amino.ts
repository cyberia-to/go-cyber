//@ts-nocheck
import { MsgCreatePool, MsgDepositWithinBatch, MsgWithdrawWithinBatch, MsgSwapWithinBatch } from "./tx";
export const AminoConverter = {
  "/cyber.liquidity.v1beta1.MsgCreatePool": {
    aminoType: "/cyber.liquidity.v1beta1.MsgCreatePool",
    toAmino: MsgCreatePool.toAmino,
    fromAmino: MsgCreatePool.fromAmino
  },
  "/cyber.liquidity.v1beta1.MsgDepositWithinBatch": {
    aminoType: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
    toAmino: MsgDepositWithinBatch.toAmino,
    fromAmino: MsgDepositWithinBatch.fromAmino
  },
  "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch": {
    aminoType: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
    toAmino: MsgWithdrawWithinBatch.toAmino,
    fromAmino: MsgWithdrawWithinBatch.fromAmino
  },
  "/cyber.liquidity.v1beta1.MsgSwapWithinBatch": {
    aminoType: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
    toAmino: MsgSwapWithinBatch.toAmino,
    fromAmino: MsgSwapWithinBatch.fromAmino
  }
};