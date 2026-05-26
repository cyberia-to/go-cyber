//@ts-nocheck
import { LCDClient } from "@cosmology/lcd";
import { QueryLoadRequest, QueryLoadResponseSDKType, QueryPriceRequest, QueryPriceResponseSDKType, QueryTotalBandwidthRequest, QueryTotalBandwidthResponseSDKType, QueryNeuronBandwidthRequest, QueryNeuronBandwidthResponseSDKType, QueryParamsRequest, QueryParamsResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.load = this.load.bind(this);
    this.price = this.price.bind(this);
    this.totalBandwidth = this.totalBandwidth.bind(this);
    this.neuronBandwidth = this.neuronBandwidth.bind(this);
    this.params = this.params.bind(this);
  }
  /* Load */
  async load(_params: QueryLoadRequest = {}): Promise<QueryLoadResponseSDKType> {
    const endpoint = `cyber/bandwidth/v1beta1/bandwidth/load`;
    return await this.req.get<QueryLoadResponseSDKType>(endpoint);
  }
  /* Price */
  async price(_params: QueryPriceRequest = {}): Promise<QueryPriceResponseSDKType> {
    const endpoint = `cyber/bandwidth/v1beta1/bandwidth/price`;
    return await this.req.get<QueryPriceResponseSDKType>(endpoint);
  }
  /* TotalBandwidth */
  async totalBandwidth(_params: QueryTotalBandwidthRequest = {}): Promise<QueryTotalBandwidthResponseSDKType> {
    const endpoint = `cyber/bandwidth/v1beta1/bandwidth/total`;
    return await this.req.get<QueryTotalBandwidthResponseSDKType>(endpoint);
  }
  /* NeuronBandwidth */
  async neuronBandwidth(params: QueryNeuronBandwidthRequest): Promise<QueryNeuronBandwidthResponseSDKType> {
    const endpoint = `cyber/bandwidth/v1beta1/bandwidth/neuron/${params.neuron}`;
    return await this.req.get<QueryNeuronBandwidthResponseSDKType>(endpoint);
  }
  /* Params */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `cyber/bandwidth/v1beta1/bandwidth/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
}