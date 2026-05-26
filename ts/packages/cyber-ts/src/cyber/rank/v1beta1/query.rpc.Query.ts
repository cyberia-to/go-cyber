//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { QueryClient, createProtobufRpcClient, ProtobufRpcClient } from "@cosmjs/stargate";
import { ReactQueryParams } from "../../../react-query";
import { useQuery } from "@tanstack/react-query";
import { QueryParamsRequest, QueryParamsResponse, QueryRankRequest, QueryRankResponse, QuerySearchRequest, QuerySearchResponse, QueryTopRequest, QueryIsLinkExistRequest, QueryLinkExistResponse, QueryIsAnyLinkExistRequest, QueryNegentropyPartilceRequest, QueryNegentropyParticleResponse, QueryNegentropyRequest, QueryNegentropyResponse, QueryKarmaRequest, QueryKarmaResponse } from "./query";
export interface Query {
  params(request?: QueryParamsRequest): Promise<QueryParamsResponse>;
  rank(request: QueryRankRequest): Promise<QueryRankResponse>;
  search(request: QuerySearchRequest): Promise<QuerySearchResponse>;
  backlinks(request: QuerySearchRequest): Promise<QuerySearchResponse>;
  top(request?: QueryTopRequest): Promise<QuerySearchResponse>;
  isLinkExist(request: QueryIsLinkExistRequest): Promise<QueryLinkExistResponse>;
  isAnyLinkExist(request: QueryIsAnyLinkExistRequest): Promise<QueryLinkExistResponse>;
  particleNegentropy(request: QueryNegentropyPartilceRequest): Promise<QueryNegentropyParticleResponse>;
  negentropy(request?: QueryNegentropyRequest): Promise<QueryNegentropyResponse>;
  karma(request: QueryKarmaRequest): Promise<QueryKarmaResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.params = this.params.bind(this);
    this.rank = this.rank.bind(this);
    this.search = this.search.bind(this);
    this.backlinks = this.backlinks.bind(this);
    this.top = this.top.bind(this);
    this.isLinkExist = this.isLinkExist.bind(this);
    this.isAnyLinkExist = this.isAnyLinkExist.bind(this);
    this.particleNegentropy = this.particleNegentropy.bind(this);
    this.negentropy = this.negentropy.bind(this);
    this.karma = this.karma.bind(this);
  }
  params(request: QueryParamsRequest = {}): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Params", data);
    return promise.then(data => QueryParamsResponse.decode(new BinaryReader(data)));
  }
  rank(request: QueryRankRequest): Promise<QueryRankResponse> {
    const data = QueryRankRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Rank", data);
    return promise.then(data => QueryRankResponse.decode(new BinaryReader(data)));
  }
  search(request: QuerySearchRequest): Promise<QuerySearchResponse> {
    const data = QuerySearchRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Search", data);
    return promise.then(data => QuerySearchResponse.decode(new BinaryReader(data)));
  }
  backlinks(request: QuerySearchRequest): Promise<QuerySearchResponse> {
    const data = QuerySearchRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Backlinks", data);
    return promise.then(data => QuerySearchResponse.decode(new BinaryReader(data)));
  }
  top(request: QueryTopRequest = {
    pagination: undefined
  }): Promise<QuerySearchResponse> {
    const data = QueryTopRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Top", data);
    return promise.then(data => QuerySearchResponse.decode(new BinaryReader(data)));
  }
  isLinkExist(request: QueryIsLinkExistRequest): Promise<QueryLinkExistResponse> {
    const data = QueryIsLinkExistRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "IsLinkExist", data);
    return promise.then(data => QueryLinkExistResponse.decode(new BinaryReader(data)));
  }
  isAnyLinkExist(request: QueryIsAnyLinkExistRequest): Promise<QueryLinkExistResponse> {
    const data = QueryIsAnyLinkExistRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "IsAnyLinkExist", data);
    return promise.then(data => QueryLinkExistResponse.decode(new BinaryReader(data)));
  }
  particleNegentropy(request: QueryNegentropyPartilceRequest): Promise<QueryNegentropyParticleResponse> {
    const data = QueryNegentropyPartilceRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "ParticleNegentropy", data);
    return promise.then(data => QueryNegentropyParticleResponse.decode(new BinaryReader(data)));
  }
  negentropy(request: QueryNegentropyRequest = {}): Promise<QueryNegentropyResponse> {
    const data = QueryNegentropyRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Negentropy", data);
    return promise.then(data => QueryNegentropyResponse.decode(new BinaryReader(data)));
  }
  karma(request: QueryKarmaRequest): Promise<QueryKarmaResponse> {
    const data = QueryKarmaRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Karma", data);
    return promise.then(data => QueryKarmaResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    params(request?: QueryParamsRequest): Promise<QueryParamsResponse> {
      return queryService.params(request);
    },
    rank(request: QueryRankRequest): Promise<QueryRankResponse> {
      return queryService.rank(request);
    },
    search(request: QuerySearchRequest): Promise<QuerySearchResponse> {
      return queryService.search(request);
    },
    backlinks(request: QuerySearchRequest): Promise<QuerySearchResponse> {
      return queryService.backlinks(request);
    },
    top(request?: QueryTopRequest): Promise<QuerySearchResponse> {
      return queryService.top(request);
    },
    isLinkExist(request: QueryIsLinkExistRequest): Promise<QueryLinkExistResponse> {
      return queryService.isLinkExist(request);
    },
    isAnyLinkExist(request: QueryIsAnyLinkExistRequest): Promise<QueryLinkExistResponse> {
      return queryService.isAnyLinkExist(request);
    },
    particleNegentropy(request: QueryNegentropyPartilceRequest): Promise<QueryNegentropyParticleResponse> {
      return queryService.particleNegentropy(request);
    },
    negentropy(request?: QueryNegentropyRequest): Promise<QueryNegentropyResponse> {
      return queryService.negentropy(request);
    },
    karma(request: QueryKarmaRequest): Promise<QueryKarmaResponse> {
      return queryService.karma(request);
    }
  };
};
export interface UseParamsQuery<TData> extends ReactQueryParams<QueryParamsResponse, TData> {
  request?: QueryParamsRequest;
}
export interface UseRankQuery<TData> extends ReactQueryParams<QueryRankResponse, TData> {
  request: QueryRankRequest;
}
export interface UseSearchQuery<TData> extends ReactQueryParams<QuerySearchResponse, TData> {
  request: QuerySearchRequest;
}
export interface UseBacklinksQuery<TData> extends ReactQueryParams<QuerySearchResponse, TData> {
  request: QuerySearchRequest;
}
export interface UseTopQuery<TData> extends ReactQueryParams<QuerySearchResponse, TData> {
  request?: QueryTopRequest;
}
export interface UseIsLinkExistQuery<TData> extends ReactQueryParams<QueryLinkExistResponse, TData> {
  request: QueryIsLinkExistRequest;
}
export interface UseIsAnyLinkExistQuery<TData> extends ReactQueryParams<QueryLinkExistResponse, TData> {
  request: QueryIsAnyLinkExistRequest;
}
export interface UseParticleNegentropyQuery<TData> extends ReactQueryParams<QueryNegentropyParticleResponse, TData> {
  request: QueryNegentropyPartilceRequest;
}
export interface UseNegentropyQuery<TData> extends ReactQueryParams<QueryNegentropyResponse, TData> {
  request?: QueryNegentropyRequest;
}
export interface UseKarmaQuery<TData> extends ReactQueryParams<QueryKarmaResponse, TData> {
  request: QueryKarmaRequest;
}
const _queryClients: WeakMap<ProtobufRpcClient, QueryClientImpl> = new WeakMap();
const getQueryService = (rpc: ProtobufRpcClient | undefined): QueryClientImpl | undefined => {
  if (!rpc) return;
  if (_queryClients.has(rpc)) {
    return _queryClients.get(rpc);
  }
  const queryService = new QueryClientImpl(rpc);
  _queryClients.set(rpc, queryService);
  return queryService;
};
export const createRpcQueryHooks = (rpc: ProtobufRpcClient | undefined) => {
  const queryService = getQueryService(rpc);
  const useParams = <TData = QueryParamsResponse,>({
    request,
    options
  }: UseParamsQuery<TData>) => {
    return useQuery<QueryParamsResponse, Error, TData>(["paramsQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.params(request);
    }, options);
  };
  const useRank = <TData = QueryRankResponse,>({
    request,
    options
  }: UseRankQuery<TData>) => {
    return useQuery<QueryRankResponse, Error, TData>(["rankQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.rank(request);
    }, options);
  };
  const useSearch = <TData = QuerySearchResponse,>({
    request,
    options
  }: UseSearchQuery<TData>) => {
    return useQuery<QuerySearchResponse, Error, TData>(["searchQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.search(request);
    }, options);
  };
  const useBacklinks = <TData = QuerySearchResponse,>({
    request,
    options
  }: UseBacklinksQuery<TData>) => {
    return useQuery<QuerySearchResponse, Error, TData>(["backlinksQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.backlinks(request);
    }, options);
  };
  const useTop = <TData = QuerySearchResponse,>({
    request,
    options
  }: UseTopQuery<TData>) => {
    return useQuery<QuerySearchResponse, Error, TData>(["topQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.top(request);
    }, options);
  };
  const useIsLinkExist = <TData = QueryLinkExistResponse,>({
    request,
    options
  }: UseIsLinkExistQuery<TData>) => {
    return useQuery<QueryLinkExistResponse, Error, TData>(["isLinkExistQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.isLinkExist(request);
    }, options);
  };
  const useIsAnyLinkExist = <TData = QueryLinkExistResponse,>({
    request,
    options
  }: UseIsAnyLinkExistQuery<TData>) => {
    return useQuery<QueryLinkExistResponse, Error, TData>(["isAnyLinkExistQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.isAnyLinkExist(request);
    }, options);
  };
  const useParticleNegentropy = <TData = QueryNegentropyParticleResponse,>({
    request,
    options
  }: UseParticleNegentropyQuery<TData>) => {
    return useQuery<QueryNegentropyParticleResponse, Error, TData>(["particleNegentropyQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.particleNegentropy(request);
    }, options);
  };
  const useNegentropy = <TData = QueryNegentropyResponse,>({
    request,
    options
  }: UseNegentropyQuery<TData>) => {
    return useQuery<QueryNegentropyResponse, Error, TData>(["negentropyQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.negentropy(request);
    }, options);
  };
  const useKarma = <TData = QueryKarmaResponse,>({
    request,
    options
  }: UseKarmaQuery<TData>) => {
    return useQuery<QueryKarmaResponse, Error, TData>(["karmaQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.karma(request);
    }, options);
  };
  return {
    useParams,
    useRank,
    useSearch,
    useBacklinks,
    useTop,
    useIsLinkExist,
    useIsAnyLinkExist,
    useParticleNegentropy,
    useNegentropy,
    useKarma
  };
};