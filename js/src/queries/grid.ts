/* eslint-disable @typescript-eslint/naming-convention */
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";

import {
  QueryClientImpl,
  QueryParamsResponse,
  QueryRoutedEnergyResponse,
  QueryRouteResponse,
  QueryRoutesResponse,
} from "../codec/cyber/grid/v1beta1/query";

export interface GridExtension {
  readonly grid: {
    readonly sourceRoutes: (source: string) => Promise<QueryRoutesResponse>;
    readonly destinationRoutes: (destination: string) => Promise<QueryRoutesResponse>;
    readonly destinationRoutedEnergy: (destination: string) => Promise<QueryRoutedEnergyResponse>;
    readonly sourceRoutedEnergy: (source: string) => Promise<QueryRoutedEnergyResponse>;
    readonly route: (source: string, destination: string) => Promise<QueryRouteResponse>;
    readonly routes: () => Promise<QueryRoutesResponse>;
    readonly params: () => Promise<QueryParamsResponse>;
  };
}

export function setupGridExtension(base: QueryClient): GridExtension {
  const rpc = createProtobufRpcClient(base);
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc);

  return {
    grid: {
      sourceRoutes: async (source: string) => {
        const response = await queryService.SourceRoutes({ source: source });
        return response;
      },
      destinationRoutes: async (destination: string) => {
        const response = await queryService.DestinationRoutes({ destination: destination });
        return response;
      },
      destinationRoutedEnergy: async (destination: string) => {
        const response = await queryService.DestinationRoutedEnergy({ destination: destination });
        return response;
      },
      sourceRoutedEnergy: async (source: string) => {
        const response = await queryService.SourceRoutedEnergy({ source: source });
        return response;
      },
      route: async (source: string, destination: string) => {
        const response = await queryService.Route({
          source: source,
          destination: destination,
        });
        return response;
      },
      routes: async () => {
        const response = await queryService.Routes({});
        return response;
      },

      params: async () => {
        const response = await queryService.Params({});
        return response;
      },
    },
  };
}
