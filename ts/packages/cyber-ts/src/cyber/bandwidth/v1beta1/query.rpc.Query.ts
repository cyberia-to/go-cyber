//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { QueryClient, createProtobufRpcClient, ProtobufRpcClient } from "@cosmjs/stargate";
import { ReactQueryParams } from "../../../react-query";
import { useQuery } from "@tanstack/react-query";
import { QueryLoadRequest, QueryLoadResponse, QueryPriceRequest, QueryPriceResponse, QueryTotalBandwidthRequest, QueryTotalBandwidthResponse, QueryNeuronBandwidthRequest, QueryNeuronBandwidthResponse, QueryParamsRequest, QueryParamsResponse } from "./query";
export interface Query {
  load(request?: QueryLoadRequest): Promise<QueryLoadResponse>;
  price(request?: QueryPriceRequest): Promise<QueryPriceResponse>;
  totalBandwidth(request?: QueryTotalBandwidthRequest): Promise<QueryTotalBandwidthResponse>;
  neuronBandwidth(request: QueryNeuronBandwidthRequest): Promise<QueryNeuronBandwidthResponse>;
  params(request?: QueryParamsRequest): Promise<QueryParamsResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.load = this.load.bind(this);
    this.price = this.price.bind(this);
    this.totalBandwidth = this.totalBandwidth.bind(this);
    this.neuronBandwidth = this.neuronBandwidth.bind(this);
    this.params = this.params.bind(this);
  }
  load(request: QueryLoadRequest = {}): Promise<QueryLoadResponse> {
    const data = QueryLoadRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.bandwidth.v1beta1.Query", "Load", data);
    return promise.then(data => QueryLoadResponse.decode(new BinaryReader(data)));
  }
  price(request: QueryPriceRequest = {}): Promise<QueryPriceResponse> {
    const data = QueryPriceRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.bandwidth.v1beta1.Query", "Price", data);
    return promise.then(data => QueryPriceResponse.decode(new BinaryReader(data)));
  }
  totalBandwidth(request: QueryTotalBandwidthRequest = {}): Promise<QueryTotalBandwidthResponse> {
    const data = QueryTotalBandwidthRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.bandwidth.v1beta1.Query", "TotalBandwidth", data);
    return promise.then(data => QueryTotalBandwidthResponse.decode(new BinaryReader(data)));
  }
  neuronBandwidth(request: QueryNeuronBandwidthRequest): Promise<QueryNeuronBandwidthResponse> {
    const data = QueryNeuronBandwidthRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.bandwidth.v1beta1.Query", "NeuronBandwidth", data);
    return promise.then(data => QueryNeuronBandwidthResponse.decode(new BinaryReader(data)));
  }
  params(request: QueryParamsRequest = {}): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.bandwidth.v1beta1.Query", "Params", data);
    return promise.then(data => QueryParamsResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    load(request?: QueryLoadRequest): Promise<QueryLoadResponse> {
      return queryService.load(request);
    },
    price(request?: QueryPriceRequest): Promise<QueryPriceResponse> {
      return queryService.price(request);
    },
    totalBandwidth(request?: QueryTotalBandwidthRequest): Promise<QueryTotalBandwidthResponse> {
      return queryService.totalBandwidth(request);
    },
    neuronBandwidth(request: QueryNeuronBandwidthRequest): Promise<QueryNeuronBandwidthResponse> {
      return queryService.neuronBandwidth(request);
    },
    params(request?: QueryParamsRequest): Promise<QueryParamsResponse> {
      return queryService.params(request);
    }
  };
};
export interface UseLoadQuery<TData> extends ReactQueryParams<QueryLoadResponse, TData> {
  request?: QueryLoadRequest;
}
export interface UsePriceQuery<TData> extends ReactQueryParams<QueryPriceResponse, TData> {
  request?: QueryPriceRequest;
}
export interface UseTotalBandwidthQuery<TData> extends ReactQueryParams<QueryTotalBandwidthResponse, TData> {
  request?: QueryTotalBandwidthRequest;
}
export interface UseNeuronBandwidthQuery<TData> extends ReactQueryParams<QueryNeuronBandwidthResponse, TData> {
  request: QueryNeuronBandwidthRequest;
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
  const useLoad = <TData = QueryLoadResponse,>({
    request,
    options
  }: UseLoadQuery<TData>) => {
    return useQuery<QueryLoadResponse, Error, TData>(["loadQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.load(request);
    }, options);
  };
  const usePrice = <TData = QueryPriceResponse,>({
    request,
    options
  }: UsePriceQuery<TData>) => {
    return useQuery<QueryPriceResponse, Error, TData>(["priceQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.price(request);
    }, options);
  };
  const useTotalBandwidth = <TData = QueryTotalBandwidthResponse,>({
    request,
    options
  }: UseTotalBandwidthQuery<TData>) => {
    return useQuery<QueryTotalBandwidthResponse, Error, TData>(["totalBandwidthQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.totalBandwidth(request);
    }, options);
  };
  const useNeuronBandwidth = <TData = QueryNeuronBandwidthResponse,>({
    request,
    options
  }: UseNeuronBandwidthQuery<TData>) => {
    return useQuery<QueryNeuronBandwidthResponse, Error, TData>(["neuronBandwidthQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.neuronBandwidth(request);
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
    useLoad,
    usePrice,
    useTotalBandwidth,
    useNeuronBandwidth,
    useParams
  };
};