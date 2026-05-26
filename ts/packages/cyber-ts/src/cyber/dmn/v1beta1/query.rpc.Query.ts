//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { QueryClient, createProtobufRpcClient, ProtobufRpcClient } from "@cosmjs/stargate";
import { ReactQueryParams } from "../../../react-query";
import { useQuery } from "@tanstack/react-query";
import { QueryParamsRequest, QueryParamsResponse, QueryThoughtParamsRequest, QueryThoughtResponse, QueryThoughtStatsResponse, QueryThoughtsRequest, QueryThoughtsResponse, QueryThoughtsStatsRequest, QueryThoughtsStatsResponse, QueryThoughtsFeesRequest, QueryThoughtsFeesResponse } from "./query";
export interface Query {
  params(request?: QueryParamsRequest): Promise<QueryParamsResponse>;
  thought(request: QueryThoughtParamsRequest): Promise<QueryThoughtResponse>;
  thoughtStats(request: QueryThoughtParamsRequest): Promise<QueryThoughtStatsResponse>;
  thoughts(request?: QueryThoughtsRequest): Promise<QueryThoughtsResponse>;
  thoughtsStats(request?: QueryThoughtsStatsRequest): Promise<QueryThoughtsStatsResponse>;
  thoughtsFees(request?: QueryThoughtsFeesRequest): Promise<QueryThoughtsFeesResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.params = this.params.bind(this);
    this.thought = this.thought.bind(this);
    this.thoughtStats = this.thoughtStats.bind(this);
    this.thoughts = this.thoughts.bind(this);
    this.thoughtsStats = this.thoughtsStats.bind(this);
    this.thoughtsFees = this.thoughtsFees.bind(this);
  }
  params(request: QueryParamsRequest = {}): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Query", "Params", data);
    return promise.then(data => QueryParamsResponse.decode(new BinaryReader(data)));
  }
  thought(request: QueryThoughtParamsRequest): Promise<QueryThoughtResponse> {
    const data = QueryThoughtParamsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Query", "Thought", data);
    return promise.then(data => QueryThoughtResponse.decode(new BinaryReader(data)));
  }
  thoughtStats(request: QueryThoughtParamsRequest): Promise<QueryThoughtStatsResponse> {
    const data = QueryThoughtParamsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Query", "ThoughtStats", data);
    return promise.then(data => QueryThoughtStatsResponse.decode(new BinaryReader(data)));
  }
  thoughts(request: QueryThoughtsRequest = {}): Promise<QueryThoughtsResponse> {
    const data = QueryThoughtsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Query", "Thoughts", data);
    return promise.then(data => QueryThoughtsResponse.decode(new BinaryReader(data)));
  }
  thoughtsStats(request: QueryThoughtsStatsRequest = {}): Promise<QueryThoughtsStatsResponse> {
    const data = QueryThoughtsStatsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Query", "ThoughtsStats", data);
    return promise.then(data => QueryThoughtsStatsResponse.decode(new BinaryReader(data)));
  }
  thoughtsFees(request: QueryThoughtsFeesRequest = {}): Promise<QueryThoughtsFeesResponse> {
    const data = QueryThoughtsFeesRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Query", "ThoughtsFees", data);
    return promise.then(data => QueryThoughtsFeesResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    params(request?: QueryParamsRequest): Promise<QueryParamsResponse> {
      return queryService.params(request);
    },
    thought(request: QueryThoughtParamsRequest): Promise<QueryThoughtResponse> {
      return queryService.thought(request);
    },
    thoughtStats(request: QueryThoughtParamsRequest): Promise<QueryThoughtStatsResponse> {
      return queryService.thoughtStats(request);
    },
    thoughts(request?: QueryThoughtsRequest): Promise<QueryThoughtsResponse> {
      return queryService.thoughts(request);
    },
    thoughtsStats(request?: QueryThoughtsStatsRequest): Promise<QueryThoughtsStatsResponse> {
      return queryService.thoughtsStats(request);
    },
    thoughtsFees(request?: QueryThoughtsFeesRequest): Promise<QueryThoughtsFeesResponse> {
      return queryService.thoughtsFees(request);
    }
  };
};
export interface UseParamsQuery<TData> extends ReactQueryParams<QueryParamsResponse, TData> {
  request?: QueryParamsRequest;
}
export interface UseThoughtQuery<TData> extends ReactQueryParams<QueryThoughtResponse, TData> {
  request: QueryThoughtParamsRequest;
}
export interface UseThoughtStatsQuery<TData> extends ReactQueryParams<QueryThoughtStatsResponse, TData> {
  request: QueryThoughtParamsRequest;
}
export interface UseThoughtsQuery<TData> extends ReactQueryParams<QueryThoughtsResponse, TData> {
  request?: QueryThoughtsRequest;
}
export interface UseThoughtsStatsQuery<TData> extends ReactQueryParams<QueryThoughtsStatsResponse, TData> {
  request?: QueryThoughtsStatsRequest;
}
export interface UseThoughtsFeesQuery<TData> extends ReactQueryParams<QueryThoughtsFeesResponse, TData> {
  request?: QueryThoughtsFeesRequest;
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
  const useThought = <TData = QueryThoughtResponse,>({
    request,
    options
  }: UseThoughtQuery<TData>) => {
    return useQuery<QueryThoughtResponse, Error, TData>(["thoughtQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.thought(request);
    }, options);
  };
  const useThoughtStats = <TData = QueryThoughtStatsResponse,>({
    request,
    options
  }: UseThoughtStatsQuery<TData>) => {
    return useQuery<QueryThoughtStatsResponse, Error, TData>(["thoughtStatsQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.thoughtStats(request);
    }, options);
  };
  const useThoughts = <TData = QueryThoughtsResponse,>({
    request,
    options
  }: UseThoughtsQuery<TData>) => {
    return useQuery<QueryThoughtsResponse, Error, TData>(["thoughtsQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.thoughts(request);
    }, options);
  };
  const useThoughtsStats = <TData = QueryThoughtsStatsResponse,>({
    request,
    options
  }: UseThoughtsStatsQuery<TData>) => {
    return useQuery<QueryThoughtsStatsResponse, Error, TData>(["thoughtsStatsQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.thoughtsStats(request);
    }, options);
  };
  const useThoughtsFees = <TData = QueryThoughtsFeesResponse,>({
    request,
    options
  }: UseThoughtsFeesQuery<TData>) => {
    return useQuery<QueryThoughtsFeesResponse, Error, TData>(["thoughtsFeesQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.thoughtsFees(request);
    }, options);
  };
  return {
    useParams,
    useThought,
    useThoughtStats,
    useThoughts,
    useThoughtsStats,
    useThoughtsFees
  };
};