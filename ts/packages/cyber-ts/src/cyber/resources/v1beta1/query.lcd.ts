//@ts-nocheck
import { LCDClient } from "@cosmology/lcd";
import { QueryParamsRequest, QueryParamsResponseSDKType, QueryInvestmintRequest, QueryInvestmintResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.params = this.params.bind(this);
    this.investmint = this.investmint.bind(this);
  }
  /* Params */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `cyber/resources/v1beta1/resources/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
  /* Investmint */
  async investmint(params: QueryInvestmintRequest): Promise<QueryInvestmintResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.amount !== "undefined") {
      options.params.amount = params.amount;
    }
    if (typeof params?.resource !== "undefined") {
      options.params.resource = params.resource;
    }
    if (typeof params?.length !== "undefined") {
      options.params.length = params.length;
    }
    const endpoint = `cyber/resources/v1beta1/resources/investmint`;
    return await this.req.get<QueryInvestmintResponseSDKType>(endpoint, options);
  }
}