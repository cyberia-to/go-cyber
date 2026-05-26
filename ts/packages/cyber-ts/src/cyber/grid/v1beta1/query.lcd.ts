//@ts-nocheck
import { setPaginationParams } from "../../../helpers";
import { LCDClient } from "@cosmology/lcd";
import { QueryParamsRequest, QueryParamsResponseSDKType, QuerySourceRequest, QueryRoutesResponseSDKType, QueryDestinationRequest, QueryRoutedEnergyResponseSDKType, QueryRouteRequest, QueryRouteResponseSDKType, QueryRoutesRequest } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.params = this.params.bind(this);
    this.sourceRoutes = this.sourceRoutes.bind(this);
    this.destinationRoutes = this.destinationRoutes.bind(this);
    this.destinationRoutedEnergy = this.destinationRoutedEnergy.bind(this);
    this.sourceRoutedEnergy = this.sourceRoutedEnergy.bind(this);
    this.route = this.route.bind(this);
    this.routes = this.routes.bind(this);
  }
  /* Params */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `cyber/grid/v1beta1/grid/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
  /* SourceRoutes */
  async sourceRoutes(params: QuerySourceRequest): Promise<QueryRoutesResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.source !== "undefined") {
      options.params.source = params.source;
    }
    const endpoint = `cyber/grid/v1beta1/grid/source_routes`;
    return await this.req.get<QueryRoutesResponseSDKType>(endpoint, options);
  }
  /* DestinationRoutes */
  async destinationRoutes(params: QueryDestinationRequest): Promise<QueryRoutesResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.destination !== "undefined") {
      options.params.destination = params.destination;
    }
    const endpoint = `cyber/grid/v1beta1/grid/destination_routes`;
    return await this.req.get<QueryRoutesResponseSDKType>(endpoint, options);
  }
  /* DestinationRoutedEnergy */
  async destinationRoutedEnergy(params: QueryDestinationRequest): Promise<QueryRoutedEnergyResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.destination !== "undefined") {
      options.params.destination = params.destination;
    }
    const endpoint = `cyber/grid/v1beta1/grid/destination_routed_energy`;
    return await this.req.get<QueryRoutedEnergyResponseSDKType>(endpoint, options);
  }
  /* SourceRoutedEnergy */
  async sourceRoutedEnergy(params: QuerySourceRequest): Promise<QueryRoutedEnergyResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.source !== "undefined") {
      options.params.source = params.source;
    }
    const endpoint = `cyber/grid/v1beta1/grid/source_routed_energy`;
    return await this.req.get<QueryRoutedEnergyResponseSDKType>(endpoint, options);
  }
  /* Route */
  async route(params: QueryRouteRequest): Promise<QueryRouteResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.source !== "undefined") {
      options.params.source = params.source;
    }
    if (typeof params?.destination !== "undefined") {
      options.params.destination = params.destination;
    }
    const endpoint = `cyber/grid/v1beta1/grid/route`;
    return await this.req.get<QueryRouteResponseSDKType>(endpoint, options);
  }
  /* Routes */
  async routes(params: QueryRoutesRequest = {
    pagination: undefined
  }): Promise<QueryRoutesResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `cyber/grid/v1beta1/grid/routes`;
    return await this.req.get<QueryRoutesResponseSDKType>(endpoint, options);
  }
}