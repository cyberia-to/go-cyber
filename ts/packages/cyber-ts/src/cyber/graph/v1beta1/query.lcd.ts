//@ts-nocheck
import { LCDClient } from "@cosmology/lcd";
import { QueryGraphStatsRequest, QueryGraphStatsResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.graphStats = this.graphStats.bind(this);
  }
  /* GraphStats */
  async graphStats(_params: QueryGraphStatsRequest = {}): Promise<QueryGraphStatsResponseSDKType> {
    const endpoint = `cyber/graph/v1beta1/graph_stats`;
    return await this.req.get<QueryGraphStatsResponseSDKType>(endpoint);
  }
}