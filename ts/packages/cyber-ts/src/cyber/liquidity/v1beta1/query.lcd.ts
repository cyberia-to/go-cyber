//@ts-nocheck
import { setPaginationParams } from "../../../helpers";
import { LCDClient } from "@cosmology/lcd";
import { QueryLiquidityPoolsRequest, QueryLiquidityPoolsResponseSDKType, QueryLiquidityPoolRequest, QueryLiquidityPoolResponseSDKType, QueryLiquidityPoolByPoolCoinDenomRequest, QueryLiquidityPoolByReserveAccRequest, QueryLiquidityPoolBatchRequest, QueryLiquidityPoolBatchResponseSDKType, QueryPoolBatchSwapMsgsRequest, QueryPoolBatchSwapMsgsResponseSDKType, QueryPoolBatchSwapMsgRequest, QueryPoolBatchSwapMsgResponseSDKType, QueryPoolBatchDepositMsgsRequest, QueryPoolBatchDepositMsgsResponseSDKType, QueryPoolBatchDepositMsgRequest, QueryPoolBatchDepositMsgResponseSDKType, QueryPoolBatchWithdrawMsgsRequest, QueryPoolBatchWithdrawMsgsResponseSDKType, QueryPoolBatchWithdrawMsgRequest, QueryPoolBatchWithdrawMsgResponseSDKType, QueryParamsRequest, QueryParamsResponseSDKType } from "./query";
export class LCDQueryClient {
  req: LCDClient;
  constructor({
    requestClient
  }: {
    requestClient: LCDClient;
  }) {
    this.req = requestClient;
    this.liquidityPools = this.liquidityPools.bind(this);
    this.liquidityPool = this.liquidityPool.bind(this);
    this.liquidityPoolByPoolCoinDenom = this.liquidityPoolByPoolCoinDenom.bind(this);
    this.liquidityPoolByReserveAcc = this.liquidityPoolByReserveAcc.bind(this);
    this.liquidityPoolBatch = this.liquidityPoolBatch.bind(this);
    this.poolBatchSwapMsgs = this.poolBatchSwapMsgs.bind(this);
    this.poolBatchSwapMsg = this.poolBatchSwapMsg.bind(this);
    this.poolBatchDepositMsgs = this.poolBatchDepositMsgs.bind(this);
    this.poolBatchDepositMsg = this.poolBatchDepositMsg.bind(this);
    this.poolBatchWithdrawMsgs = this.poolBatchWithdrawMsgs.bind(this);
    this.poolBatchWithdrawMsg = this.poolBatchWithdrawMsg.bind(this);
    this.params = this.params.bind(this);
  }
  /* Get existing liquidity pools. */
  async liquidityPools(params: QueryLiquidityPoolsRequest = {
    pagination: undefined
  }): Promise<QueryLiquidityPoolsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `cosmos/liquidity/v1beta1/pools`;
    return await this.req.get<QueryLiquidityPoolsResponseSDKType>(endpoint, options);
  }
  /* Get specific liquidity pool. */
  async liquidityPool(params: QueryLiquidityPoolRequest): Promise<QueryLiquidityPoolResponseSDKType> {
    const endpoint = `cosmos/liquidity/v1beta1/pools/${params.poolId}`;
    return await this.req.get<QueryLiquidityPoolResponseSDKType>(endpoint);
  }
  /* Get specific liquidity pool corresponding to the pool_coin_denom. */
  async liquidityPoolByPoolCoinDenom(params: QueryLiquidityPoolByPoolCoinDenomRequest): Promise<QueryLiquidityPoolResponseSDKType> {
    const endpoint = `cosmos/liquidity/v1beta1/pools/pool_coin_denom/${params.poolCoinDenom}`;
    return await this.req.get<QueryLiquidityPoolResponseSDKType>(endpoint);
  }
  /* Get specific liquidity pool corresponding to the reserve account. */
  async liquidityPoolByReserveAcc(params: QueryLiquidityPoolByReserveAccRequest): Promise<QueryLiquidityPoolResponseSDKType> {
    const endpoint = `cosmos/liquidity/v1beta1/pools/reserve_acc/${params.reserveAcc}`;
    return await this.req.get<QueryLiquidityPoolResponseSDKType>(endpoint);
  }
  /* Get the pool's current batch. */
  async liquidityPoolBatch(params: QueryLiquidityPoolBatchRequest): Promise<QueryLiquidityPoolBatchResponseSDKType> {
    const endpoint = `cosmos/liquidity/v1beta1/pools/${params.poolId}/batch`;
    return await this.req.get<QueryLiquidityPoolBatchResponseSDKType>(endpoint);
  }
  /* Get all swap messages in the pool's current batch. */
  async poolBatchSwapMsgs(params: QueryPoolBatchSwapMsgsRequest): Promise<QueryPoolBatchSwapMsgsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `cosmos/liquidity/v1beta1/pools/${params.poolId}/batch/swaps`;
    return await this.req.get<QueryPoolBatchSwapMsgsResponseSDKType>(endpoint, options);
  }
  /* Get a specific swap message in the pool's current batch. */
  async poolBatchSwapMsg(params: QueryPoolBatchSwapMsgRequest): Promise<QueryPoolBatchSwapMsgResponseSDKType> {
    const endpoint = `cosmos/liquidity/v1beta1/pools/${params.poolId}/batch/swaps/${params.msgIndex}`;
    return await this.req.get<QueryPoolBatchSwapMsgResponseSDKType>(endpoint);
  }
  /* Get all deposit messages in the pool's current batch. */
  async poolBatchDepositMsgs(params: QueryPoolBatchDepositMsgsRequest): Promise<QueryPoolBatchDepositMsgsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `cosmos/liquidity/v1beta1/pools/${params.poolId}/batch/deposits`;
    return await this.req.get<QueryPoolBatchDepositMsgsResponseSDKType>(endpoint, options);
  }
  /* Get a specific deposit message in the pool's current batch. */
  async poolBatchDepositMsg(params: QueryPoolBatchDepositMsgRequest): Promise<QueryPoolBatchDepositMsgResponseSDKType> {
    const endpoint = `cosmos/liquidity/v1beta1/pools/${params.poolId}/batch/deposits/${params.msgIndex}`;
    return await this.req.get<QueryPoolBatchDepositMsgResponseSDKType>(endpoint);
  }
  /* Get all withdraw messages in the pool's current batch. */
  async poolBatchWithdrawMsgs(params: QueryPoolBatchWithdrawMsgsRequest): Promise<QueryPoolBatchWithdrawMsgsResponseSDKType> {
    const options: any = {
      params: {}
    };
    if (typeof params?.pagination !== "undefined") {
      setPaginationParams(options, params.pagination);
    }
    const endpoint = `cosmos/liquidity/v1beta1/pools/${params.poolId}/batch/withdraws`;
    return await this.req.get<QueryPoolBatchWithdrawMsgsResponseSDKType>(endpoint, options);
  }
  /* Get a specific withdraw message in the pool's current batch. */
  async poolBatchWithdrawMsg(params: QueryPoolBatchWithdrawMsgRequest): Promise<QueryPoolBatchWithdrawMsgResponseSDKType> {
    const endpoint = `cosmos/liquidity/v1beta1/pools/${params.poolId}/batch/withdraws/${params.msgIndex}`;
    return await this.req.get<QueryPoolBatchWithdrawMsgResponseSDKType>(endpoint);
  }
  /* Get all parameters of the liquidity module. */
  async params(_params: QueryParamsRequest = {}): Promise<QueryParamsResponseSDKType> {
    const endpoint = `cosmos/liquidity/v1beta1/params`;
    return await this.req.get<QueryParamsResponseSDKType>(endpoint);
  }
}