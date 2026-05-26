//@ts-nocheck
import { setPaginationParams } from "../../../helpers";
import { LCDClient } from "@cosmology/lcd";
import { QueryClockContracts, QueryClockContractsResponseSDKType, QueryClockContract, QueryClockContractResponseSDKType, QueryParamsRequest, QueryParamsResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.clockContracts = this.clockContracts.bind(this);
    this.clockContract = this.clockContract.bind(this);
    this.params = this.params.bind(this);
  }
  /* ClockContracts */
  async clockContracts(params: QueryClockContracts = {
    pagination: undefined
  }): Promise<QueryClockContractsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `cyber/clock/v1/contracts`;
    return await this.req.get<QueryClockContractsResponseSDKType>(endpoint, options);
  }
  /* ClockContract */
  async clockContract(params: QueryClockContract): Promise<QueryClockContractResponseSDKType> {
    const endpoint = `cyber/clock/v1/contracts/${params.contractAddress}`;
    return await this.req.get<QueryClockContractResponseSDKType>(endpoint);
  }
  /* Params */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `cyber/clock/v1/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
}