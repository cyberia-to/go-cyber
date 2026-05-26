//@ts-nocheck
import { LCDClient } from "@cosmology/lcd";
import { QueryParamsRequest, QueryParamsResponseSDKType, QueryThoughtParamsRequest, QueryThoughtResponseSDKType, QueryThoughtStatsResponseSDKType, QueryThoughtsRequest, QueryThoughtsResponseSDKType, QueryThoughtsStatsRequest, QueryThoughtsStatsResponseSDKType, QueryThoughtsFeesRequest, QueryThoughtsFeesResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.params = this.params.bind(this);
    this.thought = this.thought.bind(this);
    this.thoughtStats = this.thoughtStats.bind(this);
    this.thoughts = this.thoughts.bind(this);
    this.thoughtsStats = this.thoughtsStats.bind(this);
    this.thoughtsFees = this.thoughtsFees.bind(this);
  }
  /* Params */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `cyber/dmn/v1beta1/dmn/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
  /* Thought */
  async thought(params: QueryThoughtParamsRequest): Promise<QueryThoughtResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.program !== "undefined") {
      options.params.program = params.program;
    }
    if (typeof params?.name !== "undefined") {
      options.params.name = params.name;
    }
    const endpoint = `cyber/dmn/v1beta1/dmn/thought`;
    return await this.req.get<QueryThoughtResponseSDKType>(endpoint, options);
  }
  /* ThoughtStats */
  async thoughtStats(params: QueryThoughtParamsRequest): Promise<QueryThoughtStatsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.program !== "undefined") {
      options.params.program = params.program;
    }
    if (typeof params?.name !== "undefined") {
      options.params.name = params.name;
    }
    const endpoint = `cyber/dmn/v1beta1/dmn/thought_stats`;
    return await this.req.get<QueryThoughtStatsResponseSDKType>(endpoint, options);
  }
  /* Thoughts */
  async thoughts(_params: QueryThoughtsRequest = {}): Promise<QueryThoughtsResponseSDKType> {
    const endpoint = `cyber/dmn/v1beta1/dmn/thoughts`;
    return await this.req.get<QueryThoughtsResponseSDKType>(endpoint);
  }
  /* ThoughtsStats */
  async thoughtsStats(_params: QueryThoughtsStatsRequest = {}): Promise<QueryThoughtsStatsResponseSDKType> {
    const endpoint = `cyber/dmn/v1beta1/dmn/thoughts_stats`;
    return await this.req.get<QueryThoughtsStatsResponseSDKType>(endpoint);
  }
  /* ThoughtsFees */
  async thoughtsFees(_params: QueryThoughtsFeesRequest = {}): Promise<QueryThoughtsFeesResponseSDKType> {
    const endpoint = `cyber/dmn/v1beta1/dmn/thoughts_fees`;
    return await this.req.get<QueryThoughtsFeesResponseSDKType>(endpoint);
  }
}