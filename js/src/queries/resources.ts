/* eslint-disable @typescript-eslint/naming-convention */
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";

import { QueryClientImpl, QueryParamsResponse } from "../codec/cyber/resources/v1beta1/query";

export interface ResourcesExtension {
  readonly resources: {
    readonly params: () => Promise<QueryParamsResponse>;
  };
}

export function setupResourcesExtension(base: QueryClient): ResourcesExtension {
  const rpc = createProtobufRpcClient(base);
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc);

  return {
    resources: {
      params: async () => {
        const response = await queryService.Params({});
        return response;
      },
    },
  };
}
