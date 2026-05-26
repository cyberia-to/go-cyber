//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { QueryClient, createProtobufRpcClient, ProtobufRpcClient } from "@cosmjs/stargate";
import { ReactQueryParams } from "../../../react-query";
import { useQuery } from "@tanstack/react-query";
import { QueryClockContracts, QueryClockContractsResponse, QueryClockContract, QueryClockContractResponse, QueryParamsRequest, QueryParamsResponse } from "./query";
/** Query defines the gRPC querier service. */
export interface Query {
  /** ClockContracts */
  clockContracts(request?: QueryClockContracts): Promise<QueryClockContractsResponse>;
  /** ClockContract */
  clockContract(request: QueryClockContract): Promise<QueryClockContractResponse>;
  /** Params */
  params(request?: QueryParamsRequest): Promise<QueryParamsResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.clockContracts = this.clockContracts.bind(this);
    this.clockContract = this.clockContract.bind(this);
    this.params = this.params.bind(this);
  }
  clockContracts(request: QueryClockContracts = {
    pagination: undefined
  }): Promise<QueryClockContractsResponse> {
    const data = QueryClockContracts.encode(request).finish();
    const promise = this.rpc.request("cyber.clock.v1.Query", "ClockContracts", data);
    return promise.then(data => QueryClockContractsResponse.decode(new BinaryReader(data)));
  }
  clockContract(request: QueryClockContract): Promise<QueryClockContractResponse> {
    const data = QueryClockContract.encode(request).finish();
    const promise = this.rpc.request("cyber.clock.v1.Query", "ClockContract", data);
    return promise.then(data => QueryClockContractResponse.decode(new BinaryReader(data)));
  }
  params(request: QueryParamsRequest = {}): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.clock.v1.Query", "Params", data);
    return promise.then(data => QueryParamsResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    clockContracts(request?: QueryClockContracts): Promise<QueryClockContractsResponse> {
      return queryService.clockContracts(request);
    },
    clockContract(request: QueryClockContract): Promise<QueryClockContractResponse> {
      return queryService.clockContract(request);
    },
    params(request?: QueryParamsRequest): Promise<QueryParamsResponse> {
      return queryService.params(request);
    }
  };
};
export interface UseClockContractsQuery<TData> extends ReactQueryParams<QueryClockContractsResponse, TData> {
  request?: QueryClockContracts;
}
export interface UseClockContractQuery<TData> extends ReactQueryParams<QueryClockContractResponse, TData> {
  request: QueryClockContract;
}
export interface UseParamsQuery<TData> extends ReactQueryParams<QueryParamsResponse, TData> {
  request?: QueryParamsRequest;
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
  const useClockContracts = <TData = QueryClockContractsResponse,>({
    request,
    options
  }: UseClockContractsQuery<TData>) => {
    return useQuery<QueryClockContractsResponse, Error, TData>(["clockContractsQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.clockContracts(request);
    }, options);
  };
  const useClockContract = <TData = QueryClockContractResponse,>({
    request,
    options
  }: UseClockContractQuery<TData>) => {
    return useQuery<QueryClockContractResponse, Error, TData>(["clockContractQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.clockContract(request);
    }, options);
  };
  const useParams = <TData = QueryParamsResponse,>({
    request,
    options
  }: UseParamsQuery<TData>) => {
    return useQuery<QueryParamsResponse, Error, TData>(["paramsQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.params(request);
    }, options);
  };
  return {
    /** ClockContracts */useClockContracts,
    /** ClockContract */useClockContract,
    /** Params */useParams
  };
};