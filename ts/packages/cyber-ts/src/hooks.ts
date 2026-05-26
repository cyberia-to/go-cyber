//@ts-nocheck
import { ProtobufRpcClient } from "@cosmjs/stargate";
import * as _CosmosAuthV1beta1Queryrpc from "./cosmos/auth/v1beta1/query.rpc.Query";
import * as _CosmosAuthzV1beta1Queryrpc from "./cosmos/authz/v1beta1/query.rpc.Query";
import * as _CosmosBankV1beta1Queryrpc from "./cosmos/bank/v1beta1/query.rpc.Query";
import * as _CosmosDistributionV1beta1Queryrpc from "./cosmos/distribution/v1beta1/query.rpc.Query";
import * as _CosmosGovV1Queryrpc from "./cosmos/gov/v1/query.rpc.Query";
import * as _CosmosGovV1beta1Queryrpc from "./cosmos/gov/v1beta1/query.rpc.Query";
import * as _CosmosMintV1beta1Queryrpc from "./cosmos/mint/v1beta1/query.rpc.Query";
import * as _CosmosParamsV1beta1Queryrpc from "./cosmos/params/v1beta1/query.rpc.Query";
import * as _CosmosStakingV1beta1Queryrpc from "./cosmos/staking/v1beta1/query.rpc.Query";
import * as _CosmosTxV1beta1Servicerpc from "./cosmos/tx/v1beta1/service.rpc.Service";
import * as _CosmosUpgradeV1beta1Queryrpc from "./cosmos/upgrade/v1beta1/query.rpc.Query";
import * as _CosmwasmWasmV1Queryrpc from "./cosmwasm/wasm/v1/query.rpc.Query";
import * as _CyberBandwidthV1beta1Queryrpc from "./cyber/bandwidth/v1beta1/query.rpc.Query";
import * as _CyberClockV1Queryrpc from "./cyber/clock/v1/query.rpc.Query";
import * as _CyberDmnV1beta1Queryrpc from "./cyber/dmn/v1beta1/query.rpc.Query";
import * as _CyberGraphV1beta1Queryrpc from "./cyber/graph/v1beta1/query.rpc.Query";
import * as _CyberGridV1beta1Queryrpc from "./cyber/grid/v1beta1/query.rpc.Query";
import * as _CyberLiquidityV1beta1Queryrpc from "./cyber/liquidity/v1beta1/query.rpc.Query";
import * as _CyberRankV1beta1Queryrpc from "./cyber/rank/v1beta1/query.rpc.Query";
import * as _CyberResourcesV1beta1Queryrpc from "./cyber/resources/v1beta1/query.rpc.Query";
import * as _OsmosisTokenfactoryV1beta1Queryrpc from "./osmosis/tokenfactory/v1beta1/query.rpc.Query";
export const createRpcQueryHooks = ({
  rpc
}: {
  rpc: ProtobufRpcClient | undefined;
}) => {
  return {
    cosmos: {
      auth: {
        v1beta1: _CosmosAuthV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      authz: {
        v1beta1: _CosmosAuthzV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      bank: {
        v1beta1: _CosmosBankV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      distribution: {
        v1beta1: _CosmosDistributionV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      gov: {
        v1: _CosmosGovV1Queryrpc.createRpcQueryHooks(rpc),
        v1beta1: _CosmosGovV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      mint: {
        v1beta1: _CosmosMintV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      params: {
        v1beta1: _CosmosParamsV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      staking: {
        v1beta1: _CosmosStakingV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      tx: {
        v1beta1: _CosmosTxV1beta1Servicerpc.createRpcQueryHooks(rpc)
      },
      upgrade: {
        v1beta1: _CosmosUpgradeV1beta1Queryrpc.createRpcQueryHooks(rpc)
      }
    },
    cosmwasm: {
      wasm: {
        v1: _CosmwasmWasmV1Queryrpc.createRpcQueryHooks(rpc)
      }
    },
    cyber: {
      bandwidth: {
        v1beta1: _CyberBandwidthV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      clock: {
        v1: _CyberClockV1Queryrpc.createRpcQueryHooks(rpc)
      },
      dmn: {
        v1beta1: _CyberDmnV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      graph: {
        v1beta1: _CyberGraphV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      grid: {
        v1beta1: _CyberGridV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      liquidity: {
        v1beta1: _CyberLiquidityV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      rank: {
        v1beta1: _CyberRankV1beta1Queryrpc.createRpcQueryHooks(rpc)
      },
      resources: {
        v1beta1: _CyberResourcesV1beta1Queryrpc.createRpcQueryHooks(rpc)
      }
    },
    osmosis: {
      tokenfactory: {
        v1beta1: _OsmosisTokenfactoryV1beta1Queryrpc.createRpcQueryHooks(rpc)
      }
    }
  };
};