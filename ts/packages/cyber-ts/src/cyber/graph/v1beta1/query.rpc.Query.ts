//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { QueryClient, createProtobufRpcClient, ProtobufRpcClient } from "@cosmjs/stargate";
import { ReactQueryParams } from "../../../react-query";
import { useQuery } from "@tanstack/react-query";
import { QueryGraphStatsRequest, QueryGraphStatsResponse } from "./query";
export interface Query {
  graphStats(request?: QueryGraphStatsRequest): Promise<QueryGraphStatsResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.graphStats = this.graphStats.bind(this);
  }
  graphStats(request: QueryGraphStatsRequest = {}): Promise<QueryGraphStatsResponse> {
    const data = QueryGraphStatsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.graph.v1beta1.Query", "GraphStats", data);
    return promise.then(data => QueryGraphStatsResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    graphStats(request?: QueryGraphStatsRequest): Promise<QueryGraphStatsResponse> {
      return queryService.graphStats(request);
    }
  };
};
export interface UseGraphStatsQuery<TData> extends ReactQueryParams<QueryGraphStatsResponse, TData> {
  request?: QueryGraphStatsRequest;
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
  const useGraphStats = <TData = QueryGraphStatsResponse,>({
    request,
    options
  }: UseGraphStatsQuery<TData>) => {
    return useQuery<QueryGraphStatsResponse, Error, TData>(["graphStatsQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.graphStats(request);
    }, options);
  };
  return {
    useGraphStats
  };
};