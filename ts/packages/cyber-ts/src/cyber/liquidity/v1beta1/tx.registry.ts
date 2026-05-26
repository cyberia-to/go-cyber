//@ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgCreatePool, MsgDepositWithinBatch, MsgWithdrawWithinBatch, MsgSwapWithinBatch } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cyber.liquidity.v1beta1.MsgCreatePool", MsgCreatePool], ["/cyber.liquidity.v1beta1.MsgDepositWithinBatch", MsgDepositWithinBatch], ["/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch", MsgWithdrawWithinBatch], ["/cyber.liquidity.v1beta1.MsgSwapWithinBatch", MsgSwapWithinBatch]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    createPool(value: MsgCreatePool) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool",
        value: MsgCreatePool.encode(value).finish()
      };
    },
    depositWithinBatch(value: MsgDepositWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
        value: MsgDepositWithinBatch.encode(value).finish()
      };
    },
    withdrawWithinBatch(value: MsgWithdrawWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
        value: MsgWithdrawWithinBatch.encode(value).finish()
      };
    },
    swap(value: MsgSwapWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
        value: MsgSwapWithinBatch.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    createPool(value: MsgCreatePool) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool",
        value
      };
    },
    depositWithinBatch(value: MsgDepositWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
        value
      };
    },
    withdrawWithinBatch(value: MsgWithdrawWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
        value
      };
    },
    swap(value: MsgSwapWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
        value
      };
    }
  },
  toJSON: {
    createPool(value: MsgCreatePool) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool",
        value: MsgCreatePool.toJSON(value)
      };
    },
    depositWithinBatch(value: MsgDepositWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
        value: MsgDepositWithinBatch.toJSON(value)
      };
    },
    withdrawWithinBatch(value: MsgWithdrawWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
        value: MsgWithdrawWithinBatch.toJSON(value)
      };
    },
    swap(value: MsgSwapWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
        value: MsgSwapWithinBatch.toJSON(value)
      };
    }
  },
  fromJSON: {
    createPool(value: any) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool",
        value: MsgCreatePool.fromJSON(value)
      };
    },
    depositWithinBatch(value: any) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
        value: MsgDepositWithinBatch.fromJSON(value)
      };
    },
    withdrawWithinBatch(value: any) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
        value: MsgWithdrawWithinBatch.fromJSON(value)
      };
    },
    swap(value: any) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
        value: MsgSwapWithinBatch.fromJSON(value)
      };
    }
  },
  fromPartial: {
    createPool(value: MsgCreatePool) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool",
        value: MsgCreatePool.fromPartial(value)
      };
    },
    depositWithinBatch(value: MsgDepositWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
        value: MsgDepositWithinBatch.fromPartial(value)
      };
    },
    withdrawWithinBatch(value: MsgWithdrawWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
        value: MsgWithdrawWithinBatch.fromPartial(value)
      };
    },
    swap(value: MsgSwapWithinBatch) {
      return {
        typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
        value: MsgSwapWithinBatch.fromPartial(value)
      };
    }
  }
};