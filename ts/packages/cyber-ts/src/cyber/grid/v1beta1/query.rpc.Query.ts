//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { QueryClient, createProtobufRpcClient, ProtobufRpcClient } from "@cosmjs/stargate";
import { ReactQueryParams } from "../../../react-query";
import { useQuery } from "@tanstack/react-query";
import { QueryParamsRequest, QueryParamsResponse, QuerySourceRequest, QueryRoutesResponse, QueryDestinationRequest, QueryRoutedEnergyResponse, QueryRouteRequest, QueryRouteResponse, QueryRoutesRequest } from "./query";
export interface Query {
  params(request?: QueryParamsRequest): Promise<QueryParamsResponse>;
  sourceRoutes(request: QuerySourceRequest): Promise<QueryRoutesResponse>;
  destinationRoutes(request: QueryDestinationRequest): Promise<QueryRoutesResponse>;
  destinationRoutedEnergy(request: QueryDestinationRequest): Promise<QueryRoutedEnergyResponse>;
  sourceRoutedEnergy(request: QuerySourceRequest): Promise<QueryRoutedEnergyResponse>;
  route(request: QueryRouteRequest): Promise<QueryRouteResponse>;
  routes(request?: QueryRoutesRequest): Promise<QueryRoutesResponse>;
}
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.params = this.params.bind(this);
    this.sourceRoutes = this.sourceRoutes.bind(this);
    this.destinationRoutes = this.destinationRoutes.bind(this);
    this.destinationRoutedEnergy = this.destinationRoutedEnergy.bind(this);
    this.sourceRoutedEnergy = this.sourceRoutedEnergy.bind(this);
    this.route = this.route.bind(this);
    this.routes = this.routes.bind(this);
  }
  params(request: QueryParamsRequest = {}): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "Params", data);
    return promise.then(data => QueryParamsResponse.decode(new BinaryReader(data)));
  }
  sourceRoutes(request: QuerySourceRequest): Promise<QueryRoutesResponse> {
    const data = QuerySourceRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "SourceRoutes", data);
    return promise.then(data => QueryRoutesResponse.decode(new BinaryReader(data)));
  }
  destinationRoutes(request: QueryDestinationRequest): Promise<QueryRoutesResponse> {
    const data = QueryDestinationRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "DestinationRoutes", data);
    return promise.then(data => QueryRoutesResponse.decode(new BinaryReader(data)));
  }
  destinationRoutedEnergy(request: QueryDestinationRequest): Promise<QueryRoutedEnergyResponse> {
    const data = QueryDestinationRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "DestinationRoutedEnergy", data);
    return promise.then(data => QueryRoutedEnergyResponse.decode(new BinaryReader(data)));
  }
  sourceRoutedEnergy(request: QuerySourceRequest): Promise<QueryRoutedEnergyResponse> {
    const data = QuerySourceRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "SourceRoutedEnergy", data);
    return promise.then(data => QueryRoutedEnergyResponse.decode(new BinaryReader(data)));
  }
  route(request: QueryRouteRequest): Promise<QueryRouteResponse> {
    const data = QueryRouteRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "Route", data);
    return promise.then(data => QueryRouteResponse.decode(new BinaryReader(data)));
  }
  routes(request: QueryRoutesRequest = {
    pagination: undefined
  }): Promise<QueryRoutesResponse> {
    const data = QueryRoutesRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "Routes", data);
    return promise.then(data => QueryRoutesResponse.decode(new BinaryReader(data)));
  }
}
export const createRpcQueryExtension = (base: QueryClient) => {
  const rpc = createProtobufRpcClient(base);
  const queryService = new QueryClientImpl(rpc);
  return {
    params(request?: QueryParamsRequest): Promise<QueryParamsResponse> {
      return queryService.params(request);
    },
    sourceRoutes(request: QuerySourceRequest): Promise<QueryRoutesResponse> {
      return queryService.sourceRoutes(request);
    },
    destinationRoutes(request: QueryDestinationRequest): Promise<QueryRoutesResponse> {
      return queryService.destinationRoutes(request);
    },
    destinationRoutedEnergy(request: QueryDestinationRequest): Promise<QueryRoutedEnergyResponse> {
      return queryService.destinationRoutedEnergy(request);
    },
    sourceRoutedEnergy(request: QuerySourceRequest): Promise<QueryRoutedEnergyResponse> {
      return queryService.sourceRoutedEnergy(request);
    },
    route(request: QueryRouteRequest): Promise<QueryRouteResponse> {
      return queryService.route(request);
    },
    routes(request?: QueryRoutesRequest): Promise<QueryRoutesResponse> {
      return queryService.routes(request);
    }
  };
};
export interface UseParamsQuery<TData> extends ReactQueryParams<QueryParamsResponse, TData> {
  request?: QueryParamsRequest;
}
export interface UseSourceRoutesQuery<TData> extends ReactQueryParams<QueryRoutesResponse, TData> {
  request: QuerySourceRequest;
}
export interface UseDestinationRoutesQuery<TData> extends ReactQueryParams<QueryRoutesResponse, TData> {
  request: QueryDestinationRequest;
}
export interface UseDestinationRoutedEnergyQuery<TData> extends ReactQueryParams<QueryRoutedEnergyResponse, TData> {
  request: QueryDestinationRequest;
}
export interface UseSourceRoutedEnergyQuery<TData> extends ReactQueryParams<QueryRoutedEnergyResponse, TData> {
  request: QuerySourceRequest;
}
export interface UseRouteQuery<TData> extends ReactQueryParams<QueryRouteResponse, TData> {
  request: QueryRouteRequest;
}
export interface UseRoutesQuery<TData> extends ReactQueryParams<QueryRoutesResponse, TData> {
  request?: QueryRoutesRequest;
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
  const useSourceRoutes = <TData = QueryRoutesResponse,>({
    request,
    options
  }: UseSourceRoutesQuery<TData>) => {
    return useQuery<QueryRoutesResponse, Error, TData>(["sourceRoutesQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.sourceRoutes(request);
    }, options);
  };
  const useDestinationRoutes = <TData = QueryRoutesResponse,>({
    request,
    options
  }: UseDestinationRoutesQuery<TData>) => {
    return useQuery<QueryRoutesResponse, Error, TData>(["destinationRoutesQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.destinationRoutes(request);
    }, options);
  };
  const useDestinationRoutedEnergy = <TData = QueryRoutedEnergyResponse,>({
    request,
    options
  }: UseDestinationRoutedEnergyQuery<TData>) => {
    return useQuery<QueryRoutedEnergyResponse, Error, TData>(["destinationRoutedEnergyQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.destinationRoutedEnergy(request);
    }, options);
  };
  const useSourceRoutedEnergy = <TData = QueryRoutedEnergyResponse,>({
    request,
    options
  }: UseSourceRoutedEnergyQuery<TData>) => {
    return useQuery<QueryRoutedEnergyResponse, Error, TData>(["sourceRoutedEnergyQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.sourceRoutedEnergy(request);
    }, options);
  };
  const useRoute = <TData = QueryRouteResponse,>({
    request,
    options
  }: UseRouteQuery<TData>) => {
    return useQuery<QueryRouteResponse, Error, TData>(["routeQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.route(request);
    }, options);
  };
  const useRoutes = <TData = QueryRoutesResponse,>({
    request,
    options
  }: UseRoutesQuery<TData>) => {
    return useQuery<QueryRoutesResponse, Error, TData>(["routesQuery", request], () => {
      if (!queryService) throw new Error("Query Service not initialized");
      return queryService.routes(request);
    }, options);
  };
  return {
    useParams,
    useSourceRoutes,
    useDestinationRoutes,
    useDestinationRoutedEnergy,
    useSourceRoutedEnergy,
    useRoute,
    useRoutes
  };
};