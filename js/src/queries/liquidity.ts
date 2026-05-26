/* eslint-disable @typescript-eslint/naming-convention */
import { Uint53 } from "@cosmjs/math";
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import Long from "long";

import {
  QueryClientImpl,
  QueryLiquidityPoolResponse,
  QueryLiquidityPoolsResponse,
  QueryParamsResponse,
} from "../codec/tendermint/liquidity/v1beta1/query";

export interface LiquidityExtension {
  readonly liquidity: {
    readonly params: () => Promise<QueryParamsResponse>;
    readonly pool: (id: number) => Promise<QueryLiquidityPoolResponse>;
    readonly pools: () => Promise<QueryLiquidityPoolsResponse>;
  };
}

export function setupLiquidityExtension(base: QueryClient): LiquidityExtension {
  const rpc = createProtobufRpcClient(base);
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc);

  return {
    liquidity: {
      params: async () => {
        const response = await queryService.Params({});
        return response;
      },
      pool: async (id: number) => {
        const response = await queryService.LiquidityPool({
          poolId: id,
        });
        return response;
      },
      pools: async () => {
        const response = await queryService.LiquidityPools({
          pagination: undefined,
        });
        return response;
      },
    },
  };
}
