//@ts-nocheck
import { Rpc } from "../helpers";
export const createRPCMsgClient = async ({
  rpc
}: {
  rpc: Rpc;
}) => ({
  cosmos: {
    authz: {
      v1beta1: new (await import("../cosmos/authz/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    bank: {
      v1beta1: new (await import("../cosmos/bank/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    distribution: {
      v1beta1: new (await import("../cosmos/distribution/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    gov: {
      v1: new (await import("../cosmos/gov/v1/tx.rpc.msg")).MsgClientImpl(rpc),
      v1beta1: new (await import("../cosmos/gov/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    staking: {
      v1beta1: new (await import("../cosmos/staking/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    upgrade: {
      v1beta1: new (await import("../cosmos/upgrade/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    vesting: {
      v1beta1: new (await import("../cosmos/vesting/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    }
  },
  cyber: {
    bandwidth: {
      v1beta1: new (await import("./bandwidth/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    clock: {
      v1: new (await import("./clock/v1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    dmn: {
      v1beta1: new (await import("./dmn/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    graph: {
      v1beta1: new (await import("./graph/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    grid: {
      v1beta1: new (await import("./grid/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    liquidity: {
      v1beta1: new (await import("./liquidity/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    rank: {
      v1beta1: new (await import("./rank/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    },
    resources: {
      v1beta1: new (await import("./resources/v1beta1/tx.rpc.msg")).MsgClientImpl(rpc)
    }
  }
});