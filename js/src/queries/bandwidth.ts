/* eslint-disable @typescript-eslint/naming-convention */
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";

import {
  QueryClientImpl,
  QueryLoadResponse,
  QueryNeuronBandwidthResponse,
  QueryPriceResponse,
} from "../codec/cyber/bandwidth/v1beta1/query";

export interface BandwidthExtension {
  readonly bandwidth: {
    readonly load: () => Promise<QueryLoadResponse>;
    readonly price: () => Promise<QueryPriceResponse>;
    readonly account: (agent: string) => Promise<QueryNeuronBandwidthResponse>;
  };
}

export function setupBandwidthExtension(base: QueryClient): BandwidthExtension {
  const rpc = createProtobufRpcClient(base);
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc);

  return {
    bandwidth: {
      load: async () => {
        const response = await queryService.Load({});
        return response;
      },
      price: async () => {
        const response = await queryService.Price({});
        return response;
      },
      account: async (neuron: string) => {
        const response = await queryService.NeuronBandwidth({
          neuron: neuron,
        });
        return response;
      },
    },
  };
}
