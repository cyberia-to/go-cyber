/* eslint-disable @typescript-eslint/naming-convention */
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";

import { PageRequest } from "../codec/cyber/base/query/v1beta1/pagination";
import {
  QueryClientImpl,
  QueryKarmaResponse,
  QueryLinkExistResponse,
  QueryNegentropyResponse,
  QueryRankResponse,
  QuerySearchResponse,
} from "../codec/cyber/rank/v1beta1/query";

export function createPagination(page?: number, perPage?: number): PageRequest {
  return page
    ? {
        page: page,
        perPage: perPage ? perPage : 10,
      }
    : {
        page: 0,
        perPage: 10,
      };
}

export interface RankExtension {
  readonly rank: {
    readonly search: (particle: string, page?: number, perPage?: number) => Promise<QuerySearchResponse>;
    readonly backlinks: (particle: string, page?: number, perPage?: number) => Promise<QuerySearchResponse>;
    readonly rank: (particle: string) => Promise<QueryRankResponse>;
    readonly karma: (neuron: string) => Promise<QueryKarmaResponse>;
    readonly isLinkExist: (from: string, to: string, agent: string) => Promise<QueryLinkExistResponse>;
    readonly isAnyLinkExist: (from: string, to: string) => Promise<QueryLinkExistResponse>;
    readonly negentropy: () => Promise<QueryNegentropyResponse>;
  };
}

export function setupRankExtension(base: QueryClient): RankExtension {
  const rpc = createProtobufRpcClient(base);
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc);

  return {
    rank: {
      search: async (particle: string, page?: number, perPage?: number) => {
        const response = await queryService.Search({
          particle: particle,
          pagination: createPagination(page, perPage),
        });
        return response;
      },
      backlinks: async (particle: string, page?: number, perPage?: number) => {
        const response = await queryService.Backlinks({
          particle: particle,
          pagination: createPagination(page, perPage),
        });
        return response;
      },
      rank: async (particle: string) => {
        const response = await queryService.Rank({
          particle: particle,
        });
        return response;
      },
      karma: async (neuron: string) => {
        const response = await queryService.Karma({
          neuron: neuron,
        });
        return response;
      },
      isLinkExist: async (from: string, to: string, agent: string) => {
        const response = await queryService.IsLinkExist({
          from: from,
          to: to,
          address: agent,
        });
        return response;
      },
      isAnyLinkExist: async (from: string, to: string) => {
        const response = await queryService.IsAnyLinkExist({
          from: from,
          to: to,
        });
        return response;
      },
      negentropy: async () => {
        const response = await queryService.Negentropy({});
        return response;
      },
    },
  };
}
