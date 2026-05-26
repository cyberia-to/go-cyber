/* eslint-disable @typescript-eslint/naming-convention */
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";

import { QueryClientImpl, QueryGraphStatsResponse } from "../codec/cyber/graph/v1beta1/query";

export interface GraphExtension {
  readonly graph: {
    readonly graphStats: () => Promise<QueryGraphStatsResponse>;
  };
}

export function setupGraphExtension(base: QueryClient): GraphExtension {
  const rpc = createProtobufRpcClient(base);
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc);

  return {
    graph: {
      graphStats: async () => {
        const response = await queryService.GraphStats({});
        return response;
      },
    },
  };
}
