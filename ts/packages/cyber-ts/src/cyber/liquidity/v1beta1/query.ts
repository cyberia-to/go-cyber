//@ts-nocheck
import { PageRequest, PageRequestAmino, PageRequestSDKType, PageResponse, PageResponseAmino, PageResponseSDKType } from "../../../cosmos/base/query/v1beta1/pagination";
import { Pool, PoolAmino, PoolSDKType, PoolBatch, PoolBatchAmino, PoolBatchSDKType, Params, ParamsAmino, ParamsSDKType, SwapMsgState, SwapMsgStateAmino, SwapMsgStateSDKType, DepositMsgState, DepositMsgStateAmino, DepositMsgStateSDKType, WithdrawMsgState, WithdrawMsgStateAmino, WithdrawMsgStateSDKType } from "./liquidity";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
/**
 * the request type for the QueryLiquidityPool RPC method. requestable specified
 * pool_id.
 */
export interface QueryLiquidityPoolRequest {
  poolId: bigint;
}
export interface QueryLiquidityPoolRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryLiquidityPool RPC method. requestable specified
 * pool_id.
 */
export interface QueryLiquidityPoolRequestAmino {
  pool_id?: string;
}
export interface QueryLiquidityPoolRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryLiquidityPoolRequest";
  value: QueryLiquidityPoolRequestAmino;
}
/**
 * the request type for the QueryLiquidityPool RPC method. requestable specified
 * pool_id.
 */
export interface QueryLiquidityPoolRequestSDKType {
  pool_id: bigint;
}
/**
 * the response type for the QueryLiquidityPoolResponse RPC method. Returns the
 * liquidity pool that corresponds to the requested pool_id.
 */
export interface QueryLiquidityPoolResponse {
  pool: Pool;
}
export interface QueryLiquidityPoolResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolResponse";
  value: Uint8Array;
}
/**
 * the response type for the QueryLiquidityPoolResponse RPC method. Returns the
 * liquidity pool that corresponds to the requested pool_id.
 */
export interface QueryLiquidityPoolResponseAmino {
  pool?: PoolAmino;
}
export interface QueryLiquidityPoolResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryLiquidityPoolResponse";
  value: QueryLiquidityPoolResponseAmino;
}
/**
 * the response type for the QueryLiquidityPoolResponse RPC method. Returns the
 * liquidity pool that corresponds to the requested pool_id.
 */
export interface QueryLiquidityPoolResponseSDKType {
  pool: PoolSDKType;
}
/**
 * the request type for the QueryLiquidityByPoolCoinDenomPool RPC method.
 * Requestable specified pool_coin_denom.
 */
export interface QueryLiquidityPoolByPoolCoinDenomRequest {
  poolCoinDenom: string;
}
export interface QueryLiquidityPoolByPoolCoinDenomRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolByPoolCoinDenomRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryLiquidityByPoolCoinDenomPool RPC method.
 * Requestable specified pool_coin_denom.
 */
export interface QueryLiquidityPoolByPoolCoinDenomRequestAmino {
  pool_coin_denom?: string;
}
export interface QueryLiquidityPoolByPoolCoinDenomRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryLiquidityPoolByPoolCoinDenomRequest";
  value: QueryLiquidityPoolByPoolCoinDenomRequestAmino;
}
/**
 * the request type for the QueryLiquidityByPoolCoinDenomPool RPC method.
 * Requestable specified pool_coin_denom.
 */
export interface QueryLiquidityPoolByPoolCoinDenomRequestSDKType {
  pool_coin_denom: string;
}
/**
 * the request type for the QueryLiquidityByReserveAcc RPC method. Requestable
 * specified reserve_acc.
 */
export interface QueryLiquidityPoolByReserveAccRequest {
  reserveAcc: string;
}
export interface QueryLiquidityPoolByReserveAccRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolByReserveAccRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryLiquidityByReserveAcc RPC method. Requestable
 * specified reserve_acc.
 */
export interface QueryLiquidityPoolByReserveAccRequestAmino {
  reserve_acc?: string;
}
export interface QueryLiquidityPoolByReserveAccRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryLiquidityPoolByReserveAccRequest";
  value: QueryLiquidityPoolByReserveAccRequestAmino;
}
/**
 * the request type for the QueryLiquidityByReserveAcc RPC method. Requestable
 * specified reserve_acc.
 */
export interface QueryLiquidityPoolByReserveAccRequestSDKType {
  reserve_acc: string;
}
/**
 * the request type for the QueryLiquidityPoolBatch RPC method. requestable
 * including specified pool_id.
 */
export interface QueryLiquidityPoolBatchRequest {
  /** id of the target pool for query */
  poolId: bigint;
}
export interface QueryLiquidityPoolBatchRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolBatchRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryLiquidityPoolBatch RPC method. requestable
 * including specified pool_id.
 */
export interface QueryLiquidityPoolBatchRequestAmino {
  /** id of the target pool for query */
  pool_id?: string;
}
export interface QueryLiquidityPoolBatchRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryLiquidityPoolBatchRequest";
  value: QueryLiquidityPoolBatchRequestAmino;
}
/**
 * the request type for the QueryLiquidityPoolBatch RPC method. requestable
 * including specified pool_id.
 */
export interface QueryLiquidityPoolBatchRequestSDKType {
  pool_id: bigint;
}
/**
 * the response type for the QueryLiquidityPoolBatchResponse RPC method. Returns
 * the liquidity pool batch that corresponds to the requested pool_id.
 */
export interface QueryLiquidityPoolBatchResponse {
  batch: PoolBatch;
}
export interface QueryLiquidityPoolBatchResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolBatchResponse";
  value: Uint8Array;
}
/**
 * the response type for the QueryLiquidityPoolBatchResponse RPC method. Returns
 * the liquidity pool batch that corresponds to the requested pool_id.
 */
export interface QueryLiquidityPoolBatchResponseAmino {
  batch?: PoolBatchAmino;
}
export interface QueryLiquidityPoolBatchResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryLiquidityPoolBatchResponse";
  value: QueryLiquidityPoolBatchResponseAmino;
}
/**
 * the response type for the QueryLiquidityPoolBatchResponse RPC method. Returns
 * the liquidity pool batch that corresponds to the requested pool_id.
 */
export interface QueryLiquidityPoolBatchResponseSDKType {
  batch: PoolBatchSDKType;
}
/**
 * the request type for the QueryLiquidityPools RPC method. Requestable
 * including pagination offset, limit, key.
 */
export interface QueryLiquidityPoolsRequest {
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest;
}
export interface QueryLiquidityPoolsRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolsRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryLiquidityPools RPC method. Requestable
 * including pagination offset, limit, key.
 */
export interface QueryLiquidityPoolsRequestAmino {
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequestAmino;
}
export interface QueryLiquidityPoolsRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryLiquidityPoolsRequest";
  value: QueryLiquidityPoolsRequestAmino;
}
/**
 * the request type for the QueryLiquidityPools RPC method. Requestable
 * including pagination offset, limit, key.
 */
export interface QueryLiquidityPoolsRequestSDKType {
  pagination?: PageRequestSDKType;
}
/**
 * the response type for the QueryLiquidityPoolsResponse RPC method. This
 * includes a list of all existing liquidity pools and paging results that
 * contain next_key and total count.
 */
export interface QueryLiquidityPoolsResponse {
  pools: Pool[];
  /**
   * pagination defines the pagination in the response. not working on this
   * version.
   */
  pagination?: PageResponse;
}
export interface QueryLiquidityPoolsResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolsResponse";
  value: Uint8Array;
}
/**
 * the response type for the QueryLiquidityPoolsResponse RPC method. This
 * includes a list of all existing liquidity pools and paging results that
 * contain next_key and total count.
 */
export interface QueryLiquidityPoolsResponseAmino {
  pools?: PoolAmino[];
  /**
   * pagination defines the pagination in the response. not working on this
   * version.
   */
  pagination?: PageResponseAmino;
}
export interface QueryLiquidityPoolsResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryLiquidityPoolsResponse";
  value: QueryLiquidityPoolsResponseAmino;
}
/**
 * the response type for the QueryLiquidityPoolsResponse RPC method. This
 * includes a list of all existing liquidity pools and paging results that
 * contain next_key and total count.
 */
export interface QueryLiquidityPoolsResponseSDKType {
  pools: PoolSDKType[];
  pagination?: PageResponseSDKType;
}
/** QueryParamsRequest is request type for the QueryParams RPC method. */
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryParamsRequest";
  value: Uint8Array;
}
/** QueryParamsRequest is request type for the QueryParams RPC method. */
export interface QueryParamsRequestAmino {}
export interface QueryParamsRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryParamsRequest";
  value: QueryParamsRequestAmino;
}
/** QueryParamsRequest is request type for the QueryParams RPC method. */
export interface QueryParamsRequestSDKType {}
/**
 * the response type for the QueryParamsResponse RPC method. This includes
 * current parameter of the liquidity module.
 */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryParamsResponse";
  value: Uint8Array;
}
/**
 * the response type for the QueryParamsResponse RPC method. This includes
 * current parameter of the liquidity module.
 */
export interface QueryParamsResponseAmino {
  /** params holds all the parameters of this module. */
  params?: ParamsAmino;
}
export interface QueryParamsResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryParamsResponse";
  value: QueryParamsResponseAmino;
}
/**
 * the response type for the QueryParamsResponse RPC method. This includes
 * current parameter of the liquidity module.
 */
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
/**
 * the request type for the QueryPoolBatchSwapMsgs RPC method. Requestable
 * including specified pool_id and pagination offset, limit, key.
 */
export interface QueryPoolBatchSwapMsgsRequest {
  /** id of the target pool for query */
  poolId: bigint;
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest;
}
export interface QueryPoolBatchSwapMsgsRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgsRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryPoolBatchSwapMsgs RPC method. Requestable
 * including specified pool_id and pagination offset, limit, key.
 */
export interface QueryPoolBatchSwapMsgsRequestAmino {
  /** id of the target pool for query */
  pool_id?: string;
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequestAmino;
}
export interface QueryPoolBatchSwapMsgsRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgsRequest";
  value: QueryPoolBatchSwapMsgsRequestAmino;
}
/**
 * the request type for the QueryPoolBatchSwapMsgs RPC method. Requestable
 * including specified pool_id and pagination offset, limit, key.
 */
export interface QueryPoolBatchSwapMsgsRequestSDKType {
  pool_id: bigint;
  pagination?: PageRequestSDKType;
}
/**
 * the request type for the QueryPoolBatchSwap RPC method. Requestable including
 * specified pool_id and msg_index.
 */
export interface QueryPoolBatchSwapMsgRequest {
  /** id of the target pool for query */
  poolId: bigint;
  /** target msg_index of the pool */
  msgIndex: bigint;
}
export interface QueryPoolBatchSwapMsgRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryPoolBatchSwap RPC method. Requestable including
 * specified pool_id and msg_index.
 */
export interface QueryPoolBatchSwapMsgRequestAmino {
  /** id of the target pool for query */
  pool_id?: string;
  /** target msg_index of the pool */
  msg_index?: string;
}
export interface QueryPoolBatchSwapMsgRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgRequest";
  value: QueryPoolBatchSwapMsgRequestAmino;
}
/**
 * the request type for the QueryPoolBatchSwap RPC method. Requestable including
 * specified pool_id and msg_index.
 */
export interface QueryPoolBatchSwapMsgRequestSDKType {
  pool_id: bigint;
  msg_index: bigint;
}
/**
 * the response type for the QueryPoolBatchSwapMsgs RPC method. This includes
 * list of all currently existing swap messages of the batch and paging results
 * that contain next_key and total count.
 */
export interface QueryPoolBatchSwapMsgsResponse {
  swaps: SwapMsgState[];
  /**
   * pagination defines the pagination in the response. not working on this
   * version.
   */
  pagination?: PageResponse;
}
export interface QueryPoolBatchSwapMsgsResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgsResponse";
  value: Uint8Array;
}
/**
 * the response type for the QueryPoolBatchSwapMsgs RPC method. This includes
 * list of all currently existing swap messages of the batch and paging results
 * that contain next_key and total count.
 */
export interface QueryPoolBatchSwapMsgsResponseAmino {
  swaps?: SwapMsgStateAmino[];
  /**
   * pagination defines the pagination in the response. not working on this
   * version.
   */
  pagination?: PageResponseAmino;
}
export interface QueryPoolBatchSwapMsgsResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgsResponse";
  value: QueryPoolBatchSwapMsgsResponseAmino;
}
/**
 * the response type for the QueryPoolBatchSwapMsgs RPC method. This includes
 * list of all currently existing swap messages of the batch and paging results
 * that contain next_key and total count.
 */
export interface QueryPoolBatchSwapMsgsResponseSDKType {
  swaps: SwapMsgStateSDKType[];
  pagination?: PageResponseSDKType;
}
/**
 * the response type for the QueryPoolBatchSwapMsg RPC method. This includes a
 * batch swap message of the batch.
 */
export interface QueryPoolBatchSwapMsgResponse {
  swap: SwapMsgState;
}
export interface QueryPoolBatchSwapMsgResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgResponse";
  value: Uint8Array;
}
/**
 * the response type for the QueryPoolBatchSwapMsg RPC method. This includes a
 * batch swap message of the batch.
 */
export interface QueryPoolBatchSwapMsgResponseAmino {
  swap?: SwapMsgStateAmino;
}
export interface QueryPoolBatchSwapMsgResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgResponse";
  value: QueryPoolBatchSwapMsgResponseAmino;
}
/**
 * the response type for the QueryPoolBatchSwapMsg RPC method. This includes a
 * batch swap message of the batch.
 */
export interface QueryPoolBatchSwapMsgResponseSDKType {
  swap: SwapMsgStateSDKType;
}
/**
 * the request type for the QueryPoolBatchDeposit RPC method. Requestable
 * including specified pool_id and pagination offset, limit, key.
 */
export interface QueryPoolBatchDepositMsgsRequest {
  /** id of the target pool for query */
  poolId: bigint;
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest;
}
export interface QueryPoolBatchDepositMsgsRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgsRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryPoolBatchDeposit RPC method. Requestable
 * including specified pool_id and pagination offset, limit, key.
 */
export interface QueryPoolBatchDepositMsgsRequestAmino {
  /** id of the target pool for query */
  pool_id?: string;
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequestAmino;
}
export interface QueryPoolBatchDepositMsgsRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgsRequest";
  value: QueryPoolBatchDepositMsgsRequestAmino;
}
/**
 * the request type for the QueryPoolBatchDeposit RPC method. Requestable
 * including specified pool_id and pagination offset, limit, key.
 */
export interface QueryPoolBatchDepositMsgsRequestSDKType {
  pool_id: bigint;
  pagination?: PageRequestSDKType;
}
/**
 * the request type for the QueryPoolBatchDeposit RPC method. requestable
 * including specified pool_id and msg_index.
 */
export interface QueryPoolBatchDepositMsgRequest {
  /** id of the target pool for query */
  poolId: bigint;
  /** target msg_index of the pool */
  msgIndex: bigint;
}
export interface QueryPoolBatchDepositMsgRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryPoolBatchDeposit RPC method. requestable
 * including specified pool_id and msg_index.
 */
export interface QueryPoolBatchDepositMsgRequestAmino {
  /** id of the target pool for query */
  pool_id?: string;
  /** target msg_index of the pool */
  msg_index?: string;
}
export interface QueryPoolBatchDepositMsgRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgRequest";
  value: QueryPoolBatchDepositMsgRequestAmino;
}
/**
 * the request type for the QueryPoolBatchDeposit RPC method. requestable
 * including specified pool_id and msg_index.
 */
export interface QueryPoolBatchDepositMsgRequestSDKType {
  pool_id: bigint;
  msg_index: bigint;
}
/**
 * the response type for the QueryPoolBatchDeposit RPC method. This includes a
 * list of all currently existing deposit messages of the batch and paging
 * results that contain next_key and total count.
 */
export interface QueryPoolBatchDepositMsgsResponse {
  deposits: DepositMsgState[];
  /**
   * pagination defines the pagination in the response. not working on this
   * version.
   */
  pagination?: PageResponse;
}
export interface QueryPoolBatchDepositMsgsResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgsResponse";
  value: Uint8Array;
}
/**
 * the response type for the QueryPoolBatchDeposit RPC method. This includes a
 * list of all currently existing deposit messages of the batch and paging
 * results that contain next_key and total count.
 */
export interface QueryPoolBatchDepositMsgsResponseAmino {
  deposits?: DepositMsgStateAmino[];
  /**
   * pagination defines the pagination in the response. not working on this
   * version.
   */
  pagination?: PageResponseAmino;
}
export interface QueryPoolBatchDepositMsgsResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgsResponse";
  value: QueryPoolBatchDepositMsgsResponseAmino;
}
/**
 * the response type for the QueryPoolBatchDeposit RPC method. This includes a
 * list of all currently existing deposit messages of the batch and paging
 * results that contain next_key and total count.
 */
export interface QueryPoolBatchDepositMsgsResponseSDKType {
  deposits: DepositMsgStateSDKType[];
  pagination?: PageResponseSDKType;
}
/**
 * the response type for the QueryPoolBatchDepositMsg RPC method. This includes
 * a batch swap message of the batch.
 */
export interface QueryPoolBatchDepositMsgResponse {
  deposit: DepositMsgState;
}
export interface QueryPoolBatchDepositMsgResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgResponse";
  value: Uint8Array;
}
/**
 * the response type for the QueryPoolBatchDepositMsg RPC method. This includes
 * a batch swap message of the batch.
 */
export interface QueryPoolBatchDepositMsgResponseAmino {
  deposit?: DepositMsgStateAmino;
}
export interface QueryPoolBatchDepositMsgResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgResponse";
  value: QueryPoolBatchDepositMsgResponseAmino;
}
/**
 * the response type for the QueryPoolBatchDepositMsg RPC method. This includes
 * a batch swap message of the batch.
 */
export interface QueryPoolBatchDepositMsgResponseSDKType {
  deposit: DepositMsgStateSDKType;
}
/**
 * the request type for the QueryPoolBatchWithdraw RPC method. Requestable
 * including specified pool_id and pagination offset, limit, key.
 */
export interface QueryPoolBatchWithdrawMsgsRequest {
  /** id of the target pool for query */
  poolId: bigint;
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest;
}
export interface QueryPoolBatchWithdrawMsgsRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgsRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryPoolBatchWithdraw RPC method. Requestable
 * including specified pool_id and pagination offset, limit, key.
 */
export interface QueryPoolBatchWithdrawMsgsRequestAmino {
  /** id of the target pool for query */
  pool_id?: string;
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequestAmino;
}
export interface QueryPoolBatchWithdrawMsgsRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgsRequest";
  value: QueryPoolBatchWithdrawMsgsRequestAmino;
}
/**
 * the request type for the QueryPoolBatchWithdraw RPC method. Requestable
 * including specified pool_id and pagination offset, limit, key.
 */
export interface QueryPoolBatchWithdrawMsgsRequestSDKType {
  pool_id: bigint;
  pagination?: PageRequestSDKType;
}
/**
 * the request type for the QueryPoolBatchWithdraw RPC method. requestable
 * including specified pool_id and msg_index.
 */
export interface QueryPoolBatchWithdrawMsgRequest {
  /** id of the target pool for query */
  poolId: bigint;
  /** target msg_index of the pool */
  msgIndex: bigint;
}
export interface QueryPoolBatchWithdrawMsgRequestProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgRequest";
  value: Uint8Array;
}
/**
 * the request type for the QueryPoolBatchWithdraw RPC method. requestable
 * including specified pool_id and msg_index.
 */
export interface QueryPoolBatchWithdrawMsgRequestAmino {
  /** id of the target pool for query */
  pool_id?: string;
  /** target msg_index of the pool */
  msg_index?: string;
}
export interface QueryPoolBatchWithdrawMsgRequestAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgRequest";
  value: QueryPoolBatchWithdrawMsgRequestAmino;
}
/**
 * the request type for the QueryPoolBatchWithdraw RPC method. requestable
 * including specified pool_id and msg_index.
 */
export interface QueryPoolBatchWithdrawMsgRequestSDKType {
  pool_id: bigint;
  msg_index: bigint;
}
/**
 * the response type for the QueryPoolBatchWithdraw RPC method. This includes a
 * list of all currently existing withdraw messages of the batch and paging
 * results that contain next_key and total count.
 */
export interface QueryPoolBatchWithdrawMsgsResponse {
  withdraws: WithdrawMsgState[];
  /**
   * pagination defines the pagination in the response. Not supported on this
   * version.
   */
  pagination?: PageResponse;
}
export interface QueryPoolBatchWithdrawMsgsResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgsResponse";
  value: Uint8Array;
}
/**
 * the response type for the QueryPoolBatchWithdraw RPC method. This includes a
 * list of all currently existing withdraw messages of the batch and paging
 * results that contain next_key and total count.
 */
export interface QueryPoolBatchWithdrawMsgsResponseAmino {
  withdraws?: WithdrawMsgStateAmino[];
  /**
   * pagination defines the pagination in the response. Not supported on this
   * version.
   */
  pagination?: PageResponseAmino;
}
export interface QueryPoolBatchWithdrawMsgsResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgsResponse";
  value: QueryPoolBatchWithdrawMsgsResponseAmino;
}
/**
 * the response type for the QueryPoolBatchWithdraw RPC method. This includes a
 * list of all currently existing withdraw messages of the batch and paging
 * results that contain next_key and total count.
 */
export interface QueryPoolBatchWithdrawMsgsResponseSDKType {
  withdraws: WithdrawMsgStateSDKType[];
  pagination?: PageResponseSDKType;
}
/**
 * the response type for the QueryPoolBatchWithdrawMsg RPC method. This includes
 * a batch swap message of the batch.
 */
export interface QueryPoolBatchWithdrawMsgResponse {
  withdraw: WithdrawMsgState;
}
export interface QueryPoolBatchWithdrawMsgResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgResponse";
  value: Uint8Array;
}
/**
 * the response type for the QueryPoolBatchWithdrawMsg RPC method. This includes
 * a batch swap message of the batch.
 */
export interface QueryPoolBatchWithdrawMsgResponseAmino {
  withdraw?: WithdrawMsgStateAmino;
}
export interface QueryPoolBatchWithdrawMsgResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgResponse";
  value: QueryPoolBatchWithdrawMsgResponseAmino;
}
/**
 * the response type for the QueryPoolBatchWithdrawMsg RPC method. This includes
 * a batch swap message of the batch.
 */
export interface QueryPoolBatchWithdrawMsgResponseSDKType {
  withdraw: WithdrawMsgStateSDKType;
}
function createBaseQueryLiquidityPoolRequest(): QueryLiquidityPoolRequest {
  return {
    poolId: BigInt(0)
  };
}
export const QueryLiquidityPoolRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolRequest",
  is(o: any): o is QueryLiquidityPoolRequest {
    return o && (o.$typeUrl === QueryLiquidityPoolRequest.typeUrl || typeof o.poolId === "bigint");
  },
  isSDK(o: any): o is QueryLiquidityPoolRequestSDKType {
    return o && (o.$typeUrl === QueryLiquidityPoolRequest.typeUrl || typeof o.pool_id === "bigint");
  },
  isAmino(o: any): o is QueryLiquidityPoolRequestAmino {
    return o && (o.$typeUrl === QueryLiquidityPoolRequest.typeUrl || typeof o.pool_id === "bigint");
  },
  encode(message: QueryLiquidityPoolRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolId !== BigInt(0)) {
      writer.uint32(8).uint64(message.poolId);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLiquidityPoolRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLiquidityPoolRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLiquidityPoolRequest {
    return {
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryLiquidityPoolRequest): JsonSafe<QueryLiquidityPoolRequest> {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryLiquidityPoolRequest>): QueryLiquidityPoolRequest {
    const message = createBaseQueryLiquidityPoolRequest();
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryLiquidityPoolRequestAmino): QueryLiquidityPoolRequest {
    const message = createBaseQueryLiquidityPoolRequest();
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    return message;
  },
  toAmino(message: QueryLiquidityPoolRequest): QueryLiquidityPoolRequestAmino {
    const obj: any = {};
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryLiquidityPoolRequestAminoMsg): QueryLiquidityPoolRequest {
    return QueryLiquidityPoolRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLiquidityPoolRequestProtoMsg): QueryLiquidityPoolRequest {
    return QueryLiquidityPoolRequest.decode(message.value);
  },
  toProto(message: QueryLiquidityPoolRequest): Uint8Array {
    return QueryLiquidityPoolRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryLiquidityPoolRequest): QueryLiquidityPoolRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolRequest",
      value: QueryLiquidityPoolRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLiquidityPoolRequest.typeUrl, QueryLiquidityPoolRequest);
function createBaseQueryLiquidityPoolResponse(): QueryLiquidityPoolResponse {
  return {
    pool: Pool.fromPartial({})
  };
}
export const QueryLiquidityPoolResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolResponse",
  is(o: any): o is QueryLiquidityPoolResponse {
    return o && (o.$typeUrl === QueryLiquidityPoolResponse.typeUrl || Pool.is(o.pool));
  },
  isSDK(o: any): o is QueryLiquidityPoolResponseSDKType {
    return o && (o.$typeUrl === QueryLiquidityPoolResponse.typeUrl || Pool.isSDK(o.pool));
  },
  isAmino(o: any): o is QueryLiquidityPoolResponseAmino {
    return o && (o.$typeUrl === QueryLiquidityPoolResponse.typeUrl || Pool.isAmino(o.pool));
  },
  encode(message: QueryLiquidityPoolResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pool !== undefined) {
      Pool.encode(message.pool, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLiquidityPoolResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLiquidityPoolResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pool = Pool.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLiquidityPoolResponse {
    return {
      pool: isSet(object.pool) ? Pool.fromJSON(object.pool) : undefined
    };
  },
  toJSON(message: QueryLiquidityPoolResponse): JsonSafe<QueryLiquidityPoolResponse> {
    const obj: any = {};
    message.pool !== undefined && (obj.pool = message.pool ? Pool.toJSON(message.pool) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryLiquidityPoolResponse>): QueryLiquidityPoolResponse {
    const message = createBaseQueryLiquidityPoolResponse();
    message.pool = object.pool !== undefined && object.pool !== null ? Pool.fromPartial(object.pool) : undefined;
    return message;
  },
  fromAmino(object: QueryLiquidityPoolResponseAmino): QueryLiquidityPoolResponse {
    const message = createBaseQueryLiquidityPoolResponse();
    if (object.pool !== undefined && object.pool !== null) {
      message.pool = Pool.fromAmino(object.pool);
    }
    return message;
  },
  toAmino(message: QueryLiquidityPoolResponse): QueryLiquidityPoolResponseAmino {
    const obj: any = {};
    obj.pool = message.pool ? Pool.toAmino(message.pool) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryLiquidityPoolResponseAminoMsg): QueryLiquidityPoolResponse {
    return QueryLiquidityPoolResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLiquidityPoolResponseProtoMsg): QueryLiquidityPoolResponse {
    return QueryLiquidityPoolResponse.decode(message.value);
  },
  toProto(message: QueryLiquidityPoolResponse): Uint8Array {
    return QueryLiquidityPoolResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryLiquidityPoolResponse): QueryLiquidityPoolResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolResponse",
      value: QueryLiquidityPoolResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLiquidityPoolResponse.typeUrl, QueryLiquidityPoolResponse);
function createBaseQueryLiquidityPoolByPoolCoinDenomRequest(): QueryLiquidityPoolByPoolCoinDenomRequest {
  return {
    poolCoinDenom: ""
  };
}
export const QueryLiquidityPoolByPoolCoinDenomRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolByPoolCoinDenomRequest",
  is(o: any): o is QueryLiquidityPoolByPoolCoinDenomRequest {
    return o && (o.$typeUrl === QueryLiquidityPoolByPoolCoinDenomRequest.typeUrl || typeof o.poolCoinDenom === "string");
  },
  isSDK(o: any): o is QueryLiquidityPoolByPoolCoinDenomRequestSDKType {
    return o && (o.$typeUrl === QueryLiquidityPoolByPoolCoinDenomRequest.typeUrl || typeof o.pool_coin_denom === "string");
  },
  isAmino(o: any): o is QueryLiquidityPoolByPoolCoinDenomRequestAmino {
    return o && (o.$typeUrl === QueryLiquidityPoolByPoolCoinDenomRequest.typeUrl || typeof o.pool_coin_denom === "string");
  },
  encode(message: QueryLiquidityPoolByPoolCoinDenomRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolCoinDenom !== "") {
      writer.uint32(10).string(message.poolCoinDenom);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLiquidityPoolByPoolCoinDenomRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLiquidityPoolByPoolCoinDenomRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolCoinDenom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLiquidityPoolByPoolCoinDenomRequest {
    return {
      poolCoinDenom: isSet(object.poolCoinDenom) ? String(object.poolCoinDenom) : ""
    };
  },
  toJSON(message: QueryLiquidityPoolByPoolCoinDenomRequest): JsonSafe<QueryLiquidityPoolByPoolCoinDenomRequest> {
    const obj: any = {};
    message.poolCoinDenom !== undefined && (obj.poolCoinDenom = message.poolCoinDenom);
    return obj;
  },
  fromPartial(object: Partial<QueryLiquidityPoolByPoolCoinDenomRequest>): QueryLiquidityPoolByPoolCoinDenomRequest {
    const message = createBaseQueryLiquidityPoolByPoolCoinDenomRequest();
    message.poolCoinDenom = object.poolCoinDenom ?? "";
    return message;
  },
  fromAmino(object: QueryLiquidityPoolByPoolCoinDenomRequestAmino): QueryLiquidityPoolByPoolCoinDenomRequest {
    const message = createBaseQueryLiquidityPoolByPoolCoinDenomRequest();
    if (object.pool_coin_denom !== undefined && object.pool_coin_denom !== null) {
      message.poolCoinDenom = object.pool_coin_denom;
    }
    return message;
  },
  toAmino(message: QueryLiquidityPoolByPoolCoinDenomRequest): QueryLiquidityPoolByPoolCoinDenomRequestAmino {
    const obj: any = {};
    obj.pool_coin_denom = message.poolCoinDenom === "" ? undefined : message.poolCoinDenom;
    return obj;
  },
  fromAminoMsg(object: QueryLiquidityPoolByPoolCoinDenomRequestAminoMsg): QueryLiquidityPoolByPoolCoinDenomRequest {
    return QueryLiquidityPoolByPoolCoinDenomRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLiquidityPoolByPoolCoinDenomRequestProtoMsg): QueryLiquidityPoolByPoolCoinDenomRequest {
    return QueryLiquidityPoolByPoolCoinDenomRequest.decode(message.value);
  },
  toProto(message: QueryLiquidityPoolByPoolCoinDenomRequest): Uint8Array {
    return QueryLiquidityPoolByPoolCoinDenomRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryLiquidityPoolByPoolCoinDenomRequest): QueryLiquidityPoolByPoolCoinDenomRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolByPoolCoinDenomRequest",
      value: QueryLiquidityPoolByPoolCoinDenomRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLiquidityPoolByPoolCoinDenomRequest.typeUrl, QueryLiquidityPoolByPoolCoinDenomRequest);
function createBaseQueryLiquidityPoolByReserveAccRequest(): QueryLiquidityPoolByReserveAccRequest {
  return {
    reserveAcc: ""
  };
}
export const QueryLiquidityPoolByReserveAccRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolByReserveAccRequest",
  is(o: any): o is QueryLiquidityPoolByReserveAccRequest {
    return o && (o.$typeUrl === QueryLiquidityPoolByReserveAccRequest.typeUrl || typeof o.reserveAcc === "string");
  },
  isSDK(o: any): o is QueryLiquidityPoolByReserveAccRequestSDKType {
    return o && (o.$typeUrl === QueryLiquidityPoolByReserveAccRequest.typeUrl || typeof o.reserve_acc === "string");
  },
  isAmino(o: any): o is QueryLiquidityPoolByReserveAccRequestAmino {
    return o && (o.$typeUrl === QueryLiquidityPoolByReserveAccRequest.typeUrl || typeof o.reserve_acc === "string");
  },
  encode(message: QueryLiquidityPoolByReserveAccRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.reserveAcc !== "") {
      writer.uint32(10).string(message.reserveAcc);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLiquidityPoolByReserveAccRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLiquidityPoolByReserveAccRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reserveAcc = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLiquidityPoolByReserveAccRequest {
    return {
      reserveAcc: isSet(object.reserveAcc) ? String(object.reserveAcc) : ""
    };
  },
  toJSON(message: QueryLiquidityPoolByReserveAccRequest): JsonSafe<QueryLiquidityPoolByReserveAccRequest> {
    const obj: any = {};
    message.reserveAcc !== undefined && (obj.reserveAcc = message.reserveAcc);
    return obj;
  },
  fromPartial(object: Partial<QueryLiquidityPoolByReserveAccRequest>): QueryLiquidityPoolByReserveAccRequest {
    const message = createBaseQueryLiquidityPoolByReserveAccRequest();
    message.reserveAcc = object.reserveAcc ?? "";
    return message;
  },
  fromAmino(object: QueryLiquidityPoolByReserveAccRequestAmino): QueryLiquidityPoolByReserveAccRequest {
    const message = createBaseQueryLiquidityPoolByReserveAccRequest();
    if (object.reserve_acc !== undefined && object.reserve_acc !== null) {
      message.reserveAcc = object.reserve_acc;
    }
    return message;
  },
  toAmino(message: QueryLiquidityPoolByReserveAccRequest): QueryLiquidityPoolByReserveAccRequestAmino {
    const obj: any = {};
    obj.reserve_acc = message.reserveAcc === "" ? undefined : message.reserveAcc;
    return obj;
  },
  fromAminoMsg(object: QueryLiquidityPoolByReserveAccRequestAminoMsg): QueryLiquidityPoolByReserveAccRequest {
    return QueryLiquidityPoolByReserveAccRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLiquidityPoolByReserveAccRequestProtoMsg): QueryLiquidityPoolByReserveAccRequest {
    return QueryLiquidityPoolByReserveAccRequest.decode(message.value);
  },
  toProto(message: QueryLiquidityPoolByReserveAccRequest): Uint8Array {
    return QueryLiquidityPoolByReserveAccRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryLiquidityPoolByReserveAccRequest): QueryLiquidityPoolByReserveAccRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolByReserveAccRequest",
      value: QueryLiquidityPoolByReserveAccRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLiquidityPoolByReserveAccRequest.typeUrl, QueryLiquidityPoolByReserveAccRequest);
function createBaseQueryLiquidityPoolBatchRequest(): QueryLiquidityPoolBatchRequest {
  return {
    poolId: BigInt(0)
  };
}
export const QueryLiquidityPoolBatchRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolBatchRequest",
  is(o: any): o is QueryLiquidityPoolBatchRequest {
    return o && (o.$typeUrl === QueryLiquidityPoolBatchRequest.typeUrl || typeof o.poolId === "bigint");
  },
  isSDK(o: any): o is QueryLiquidityPoolBatchRequestSDKType {
    return o && (o.$typeUrl === QueryLiquidityPoolBatchRequest.typeUrl || typeof o.pool_id === "bigint");
  },
  isAmino(o: any): o is QueryLiquidityPoolBatchRequestAmino {
    return o && (o.$typeUrl === QueryLiquidityPoolBatchRequest.typeUrl || typeof o.pool_id === "bigint");
  },
  encode(message: QueryLiquidityPoolBatchRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolId !== BigInt(0)) {
      writer.uint32(8).uint64(message.poolId);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLiquidityPoolBatchRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLiquidityPoolBatchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLiquidityPoolBatchRequest {
    return {
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryLiquidityPoolBatchRequest): JsonSafe<QueryLiquidityPoolBatchRequest> {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryLiquidityPoolBatchRequest>): QueryLiquidityPoolBatchRequest {
    const message = createBaseQueryLiquidityPoolBatchRequest();
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryLiquidityPoolBatchRequestAmino): QueryLiquidityPoolBatchRequest {
    const message = createBaseQueryLiquidityPoolBatchRequest();
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    return message;
  },
  toAmino(message: QueryLiquidityPoolBatchRequest): QueryLiquidityPoolBatchRequestAmino {
    const obj: any = {};
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryLiquidityPoolBatchRequestAminoMsg): QueryLiquidityPoolBatchRequest {
    return QueryLiquidityPoolBatchRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLiquidityPoolBatchRequestProtoMsg): QueryLiquidityPoolBatchRequest {
    return QueryLiquidityPoolBatchRequest.decode(message.value);
  },
  toProto(message: QueryLiquidityPoolBatchRequest): Uint8Array {
    return QueryLiquidityPoolBatchRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryLiquidityPoolBatchRequest): QueryLiquidityPoolBatchRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolBatchRequest",
      value: QueryLiquidityPoolBatchRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLiquidityPoolBatchRequest.typeUrl, QueryLiquidityPoolBatchRequest);
function createBaseQueryLiquidityPoolBatchResponse(): QueryLiquidityPoolBatchResponse {
  return {
    batch: PoolBatch.fromPartial({})
  };
}
export const QueryLiquidityPoolBatchResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolBatchResponse",
  is(o: any): o is QueryLiquidityPoolBatchResponse {
    return o && (o.$typeUrl === QueryLiquidityPoolBatchResponse.typeUrl || PoolBatch.is(o.batch));
  },
  isSDK(o: any): o is QueryLiquidityPoolBatchResponseSDKType {
    return o && (o.$typeUrl === QueryLiquidityPoolBatchResponse.typeUrl || PoolBatch.isSDK(o.batch));
  },
  isAmino(o: any): o is QueryLiquidityPoolBatchResponseAmino {
    return o && (o.$typeUrl === QueryLiquidityPoolBatchResponse.typeUrl || PoolBatch.isAmino(o.batch));
  },
  encode(message: QueryLiquidityPoolBatchResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.batch !== undefined) {
      PoolBatch.encode(message.batch, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLiquidityPoolBatchResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLiquidityPoolBatchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.batch = PoolBatch.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLiquidityPoolBatchResponse {
    return {
      batch: isSet(object.batch) ? PoolBatch.fromJSON(object.batch) : undefined
    };
  },
  toJSON(message: QueryLiquidityPoolBatchResponse): JsonSafe<QueryLiquidityPoolBatchResponse> {
    const obj: any = {};
    message.batch !== undefined && (obj.batch = message.batch ? PoolBatch.toJSON(message.batch) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryLiquidityPoolBatchResponse>): QueryLiquidityPoolBatchResponse {
    const message = createBaseQueryLiquidityPoolBatchResponse();
    message.batch = object.batch !== undefined && object.batch !== null ? PoolBatch.fromPartial(object.batch) : undefined;
    return message;
  },
  fromAmino(object: QueryLiquidityPoolBatchResponseAmino): QueryLiquidityPoolBatchResponse {
    const message = createBaseQueryLiquidityPoolBatchResponse();
    if (object.batch !== undefined && object.batch !== null) {
      message.batch = PoolBatch.fromAmino(object.batch);
    }
    return message;
  },
  toAmino(message: QueryLiquidityPoolBatchResponse): QueryLiquidityPoolBatchResponseAmino {
    const obj: any = {};
    obj.batch = message.batch ? PoolBatch.toAmino(message.batch) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryLiquidityPoolBatchResponseAminoMsg): QueryLiquidityPoolBatchResponse {
    return QueryLiquidityPoolBatchResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLiquidityPoolBatchResponseProtoMsg): QueryLiquidityPoolBatchResponse {
    return QueryLiquidityPoolBatchResponse.decode(message.value);
  },
  toProto(message: QueryLiquidityPoolBatchResponse): Uint8Array {
    return QueryLiquidityPoolBatchResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryLiquidityPoolBatchResponse): QueryLiquidityPoolBatchResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolBatchResponse",
      value: QueryLiquidityPoolBatchResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLiquidityPoolBatchResponse.typeUrl, QueryLiquidityPoolBatchResponse);
function createBaseQueryLiquidityPoolsRequest(): QueryLiquidityPoolsRequest {
  return {
    pagination: undefined
  };
}
export const QueryLiquidityPoolsRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolsRequest",
  is(o: any): o is QueryLiquidityPoolsRequest {
    return o && o.$typeUrl === QueryLiquidityPoolsRequest.typeUrl;
  },
  isSDK(o: any): o is QueryLiquidityPoolsRequestSDKType {
    return o && o.$typeUrl === QueryLiquidityPoolsRequest.typeUrl;
  },
  isAmino(o: any): o is QueryLiquidityPoolsRequestAmino {
    return o && o.$typeUrl === QueryLiquidityPoolsRequest.typeUrl;
  },
  encode(message: QueryLiquidityPoolsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLiquidityPoolsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLiquidityPoolsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLiquidityPoolsRequest {
    return {
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryLiquidityPoolsRequest): JsonSafe<QueryLiquidityPoolsRequest> {
    const obj: any = {};
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryLiquidityPoolsRequest>): QueryLiquidityPoolsRequest {
    const message = createBaseQueryLiquidityPoolsRequest();
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryLiquidityPoolsRequestAmino): QueryLiquidityPoolsRequest {
    const message = createBaseQueryLiquidityPoolsRequest();
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryLiquidityPoolsRequest): QueryLiquidityPoolsRequestAmino {
    const obj: any = {};
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryLiquidityPoolsRequestAminoMsg): QueryLiquidityPoolsRequest {
    return QueryLiquidityPoolsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLiquidityPoolsRequestProtoMsg): QueryLiquidityPoolsRequest {
    return QueryLiquidityPoolsRequest.decode(message.value);
  },
  toProto(message: QueryLiquidityPoolsRequest): Uint8Array {
    return QueryLiquidityPoolsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryLiquidityPoolsRequest): QueryLiquidityPoolsRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolsRequest",
      value: QueryLiquidityPoolsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLiquidityPoolsRequest.typeUrl, QueryLiquidityPoolsRequest);
function createBaseQueryLiquidityPoolsResponse(): QueryLiquidityPoolsResponse {
  return {
    pools: [],
    pagination: undefined
  };
}
export const QueryLiquidityPoolsResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolsResponse",
  is(o: any): o is QueryLiquidityPoolsResponse {
    return o && (o.$typeUrl === QueryLiquidityPoolsResponse.typeUrl || Array.isArray(o.pools) && (!o.pools.length || Pool.is(o.pools[0])));
  },
  isSDK(o: any): o is QueryLiquidityPoolsResponseSDKType {
    return o && (o.$typeUrl === QueryLiquidityPoolsResponse.typeUrl || Array.isArray(o.pools) && (!o.pools.length || Pool.isSDK(o.pools[0])));
  },
  isAmino(o: any): o is QueryLiquidityPoolsResponseAmino {
    return o && (o.$typeUrl === QueryLiquidityPoolsResponse.typeUrl || Array.isArray(o.pools) && (!o.pools.length || Pool.isAmino(o.pools[0])));
  },
  encode(message: QueryLiquidityPoolsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.pools) {
      Pool.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLiquidityPoolsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLiquidityPoolsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pools.push(Pool.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLiquidityPoolsResponse {
    return {
      pools: Array.isArray(object?.pools) ? object.pools.map((e: any) => Pool.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryLiquidityPoolsResponse): JsonSafe<QueryLiquidityPoolsResponse> {
    const obj: any = {};
    if (message.pools) {
      obj.pools = message.pools.map(e => e ? Pool.toJSON(e) : undefined);
    } else {
      obj.pools = [];
    }
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryLiquidityPoolsResponse>): QueryLiquidityPoolsResponse {
    const message = createBaseQueryLiquidityPoolsResponse();
    message.pools = object.pools?.map(e => Pool.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryLiquidityPoolsResponseAmino): QueryLiquidityPoolsResponse {
    const message = createBaseQueryLiquidityPoolsResponse();
    message.pools = object.pools?.map(e => Pool.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryLiquidityPoolsResponse): QueryLiquidityPoolsResponseAmino {
    const obj: any = {};
    if (message.pools) {
      obj.pools = message.pools.map(e => e ? Pool.toAmino(e) : undefined);
    } else {
      obj.pools = message.pools;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryLiquidityPoolsResponseAminoMsg): QueryLiquidityPoolsResponse {
    return QueryLiquidityPoolsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLiquidityPoolsResponseProtoMsg): QueryLiquidityPoolsResponse {
    return QueryLiquidityPoolsResponse.decode(message.value);
  },
  toProto(message: QueryLiquidityPoolsResponse): Uint8Array {
    return QueryLiquidityPoolsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryLiquidityPoolsResponse): QueryLiquidityPoolsResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryLiquidityPoolsResponse",
      value: QueryLiquidityPoolsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLiquidityPoolsResponse.typeUrl, QueryLiquidityPoolsResponse);
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryParamsRequest",
  is(o: any): o is QueryParamsRequest {
    return o && o.$typeUrl === QueryParamsRequest.typeUrl;
  },
  isSDK(o: any): o is QueryParamsRequestSDKType {
    return o && o.$typeUrl === QueryParamsRequest.typeUrl;
  },
  isAmino(o: any): o is QueryParamsRequestAmino {
    return o && o.$typeUrl === QueryParamsRequest.typeUrl;
  },
  encode(_: QueryParamsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(_: any): QueryParamsRequest {
    return {};
  },
  toJSON(_: QueryParamsRequest): JsonSafe<QueryParamsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryParamsRequest>): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
  fromAmino(_: QueryParamsRequestAmino): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
  toAmino(_: QueryParamsRequest): QueryParamsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryParamsRequestAminoMsg): QueryParamsRequest {
    return QueryParamsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryParamsRequestProtoMsg): QueryParamsRequest {
    return QueryParamsRequest.decode(message.value);
  },
  toProto(message: QueryParamsRequest): Uint8Array {
    return QueryParamsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryParamsRequest): QueryParamsRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryParamsRequest",
      value: QueryParamsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryParamsRequest.typeUrl, QueryParamsRequest);
function createBaseQueryParamsResponse(): QueryParamsResponse {
  return {
    params: Params.fromPartial({})
  };
}
export const QueryParamsResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryParamsResponse",
  is(o: any): o is QueryParamsResponse {
    return o && (o.$typeUrl === QueryParamsResponse.typeUrl || Params.is(o.params));
  },
  isSDK(o: any): o is QueryParamsResponseSDKType {
    return o && (o.$typeUrl === QueryParamsResponse.typeUrl || Params.isSDK(o.params));
  },
  isAmino(o: any): o is QueryParamsResponseAmino {
    return o && (o.$typeUrl === QueryParamsResponse.typeUrl || Params.isAmino(o.params));
  },
  encode(message: QueryParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryParamsResponse {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined
    };
  },
  toJSON(message: QueryParamsResponse): JsonSafe<QueryParamsResponse> {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryParamsResponse>): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: QueryParamsResponseAmino): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: QueryParamsResponse): QueryParamsResponseAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryParamsResponseAminoMsg): QueryParamsResponse {
    return QueryParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryParamsResponseProtoMsg): QueryParamsResponse {
    return QueryParamsResponse.decode(message.value);
  },
  toProto(message: QueryParamsResponse): Uint8Array {
    return QueryParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryParamsResponse): QueryParamsResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryParamsResponse.typeUrl, QueryParamsResponse);
function createBaseQueryPoolBatchSwapMsgsRequest(): QueryPoolBatchSwapMsgsRequest {
  return {
    poolId: BigInt(0),
    pagination: undefined
  };
}
export const QueryPoolBatchSwapMsgsRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgsRequest",
  is(o: any): o is QueryPoolBatchSwapMsgsRequest {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgsRequest.typeUrl || typeof o.poolId === "bigint");
  },
  isSDK(o: any): o is QueryPoolBatchSwapMsgsRequestSDKType {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgsRequest.typeUrl || typeof o.pool_id === "bigint");
  },
  isAmino(o: any): o is QueryPoolBatchSwapMsgsRequestAmino {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgsRequest.typeUrl || typeof o.pool_id === "bigint");
  },
  encode(message: QueryPoolBatchSwapMsgsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolId !== BigInt(0)) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchSwapMsgsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchSwapMsgsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchSwapMsgsRequest {
    return {
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryPoolBatchSwapMsgsRequest): JsonSafe<QueryPoolBatchSwapMsgsRequest> {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchSwapMsgsRequest>): QueryPoolBatchSwapMsgsRequest {
    const message = createBaseQueryPoolBatchSwapMsgsRequest();
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryPoolBatchSwapMsgsRequestAmino): QueryPoolBatchSwapMsgsRequest {
    const message = createBaseQueryPoolBatchSwapMsgsRequest();
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchSwapMsgsRequest): QueryPoolBatchSwapMsgsRequestAmino {
    const obj: any = {};
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchSwapMsgsRequestAminoMsg): QueryPoolBatchSwapMsgsRequest {
    return QueryPoolBatchSwapMsgsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchSwapMsgsRequestProtoMsg): QueryPoolBatchSwapMsgsRequest {
    return QueryPoolBatchSwapMsgsRequest.decode(message.value);
  },
  toProto(message: QueryPoolBatchSwapMsgsRequest): Uint8Array {
    return QueryPoolBatchSwapMsgsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchSwapMsgsRequest): QueryPoolBatchSwapMsgsRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgsRequest",
      value: QueryPoolBatchSwapMsgsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchSwapMsgsRequest.typeUrl, QueryPoolBatchSwapMsgsRequest);
function createBaseQueryPoolBatchSwapMsgRequest(): QueryPoolBatchSwapMsgRequest {
  return {
    poolId: BigInt(0),
    msgIndex: BigInt(0)
  };
}
export const QueryPoolBatchSwapMsgRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgRequest",
  is(o: any): o is QueryPoolBatchSwapMsgRequest {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgRequest.typeUrl || typeof o.poolId === "bigint" && typeof o.msgIndex === "bigint");
  },
  isSDK(o: any): o is QueryPoolBatchSwapMsgRequestSDKType {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgRequest.typeUrl || typeof o.pool_id === "bigint" && typeof o.msg_index === "bigint");
  },
  isAmino(o: any): o is QueryPoolBatchSwapMsgRequestAmino {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgRequest.typeUrl || typeof o.pool_id === "bigint" && typeof o.msg_index === "bigint");
  },
  encode(message: QueryPoolBatchSwapMsgRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolId !== BigInt(0)) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.msgIndex !== BigInt(0)) {
      writer.uint32(16).uint64(message.msgIndex);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchSwapMsgRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchSwapMsgRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64();
          break;
        case 2:
          message.msgIndex = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchSwapMsgRequest {
    return {
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      msgIndex: isSet(object.msgIndex) ? BigInt(object.msgIndex.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryPoolBatchSwapMsgRequest): JsonSafe<QueryPoolBatchSwapMsgRequest> {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.msgIndex !== undefined && (obj.msgIndex = (message.msgIndex || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchSwapMsgRequest>): QueryPoolBatchSwapMsgRequest {
    const message = createBaseQueryPoolBatchSwapMsgRequest();
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.msgIndex = object.msgIndex !== undefined && object.msgIndex !== null ? BigInt(object.msgIndex.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryPoolBatchSwapMsgRequestAmino): QueryPoolBatchSwapMsgRequest {
    const message = createBaseQueryPoolBatchSwapMsgRequest();
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    if (object.msg_index !== undefined && object.msg_index !== null) {
      message.msgIndex = BigInt(object.msg_index);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchSwapMsgRequest): QueryPoolBatchSwapMsgRequestAmino {
    const obj: any = {};
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    obj.msg_index = message.msgIndex !== BigInt(0) ? message.msgIndex.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchSwapMsgRequestAminoMsg): QueryPoolBatchSwapMsgRequest {
    return QueryPoolBatchSwapMsgRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchSwapMsgRequestProtoMsg): QueryPoolBatchSwapMsgRequest {
    return QueryPoolBatchSwapMsgRequest.decode(message.value);
  },
  toProto(message: QueryPoolBatchSwapMsgRequest): Uint8Array {
    return QueryPoolBatchSwapMsgRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchSwapMsgRequest): QueryPoolBatchSwapMsgRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgRequest",
      value: QueryPoolBatchSwapMsgRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchSwapMsgRequest.typeUrl, QueryPoolBatchSwapMsgRequest);
function createBaseQueryPoolBatchSwapMsgsResponse(): QueryPoolBatchSwapMsgsResponse {
  return {
    swaps: [],
    pagination: undefined
  };
}
export const QueryPoolBatchSwapMsgsResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgsResponse",
  is(o: any): o is QueryPoolBatchSwapMsgsResponse {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgsResponse.typeUrl || Array.isArray(o.swaps) && (!o.swaps.length || SwapMsgState.is(o.swaps[0])));
  },
  isSDK(o: any): o is QueryPoolBatchSwapMsgsResponseSDKType {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgsResponse.typeUrl || Array.isArray(o.swaps) && (!o.swaps.length || SwapMsgState.isSDK(o.swaps[0])));
  },
  isAmino(o: any): o is QueryPoolBatchSwapMsgsResponseAmino {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgsResponse.typeUrl || Array.isArray(o.swaps) && (!o.swaps.length || SwapMsgState.isAmino(o.swaps[0])));
  },
  encode(message: QueryPoolBatchSwapMsgsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.swaps) {
      SwapMsgState.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchSwapMsgsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchSwapMsgsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.swaps.push(SwapMsgState.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchSwapMsgsResponse {
    return {
      swaps: Array.isArray(object?.swaps) ? object.swaps.map((e: any) => SwapMsgState.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryPoolBatchSwapMsgsResponse): JsonSafe<QueryPoolBatchSwapMsgsResponse> {
    const obj: any = {};
    if (message.swaps) {
      obj.swaps = message.swaps.map(e => e ? SwapMsgState.toJSON(e) : undefined);
    } else {
      obj.swaps = [];
    }
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchSwapMsgsResponse>): QueryPoolBatchSwapMsgsResponse {
    const message = createBaseQueryPoolBatchSwapMsgsResponse();
    message.swaps = object.swaps?.map(e => SwapMsgState.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryPoolBatchSwapMsgsResponseAmino): QueryPoolBatchSwapMsgsResponse {
    const message = createBaseQueryPoolBatchSwapMsgsResponse();
    message.swaps = object.swaps?.map(e => SwapMsgState.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchSwapMsgsResponse): QueryPoolBatchSwapMsgsResponseAmino {
    const obj: any = {};
    if (message.swaps) {
      obj.swaps = message.swaps.map(e => e ? SwapMsgState.toAmino(e) : undefined);
    } else {
      obj.swaps = message.swaps;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchSwapMsgsResponseAminoMsg): QueryPoolBatchSwapMsgsResponse {
    return QueryPoolBatchSwapMsgsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchSwapMsgsResponseProtoMsg): QueryPoolBatchSwapMsgsResponse {
    return QueryPoolBatchSwapMsgsResponse.decode(message.value);
  },
  toProto(message: QueryPoolBatchSwapMsgsResponse): Uint8Array {
    return QueryPoolBatchSwapMsgsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchSwapMsgsResponse): QueryPoolBatchSwapMsgsResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgsResponse",
      value: QueryPoolBatchSwapMsgsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchSwapMsgsResponse.typeUrl, QueryPoolBatchSwapMsgsResponse);
function createBaseQueryPoolBatchSwapMsgResponse(): QueryPoolBatchSwapMsgResponse {
  return {
    swap: SwapMsgState.fromPartial({})
  };
}
export const QueryPoolBatchSwapMsgResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgResponse",
  is(o: any): o is QueryPoolBatchSwapMsgResponse {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgResponse.typeUrl || SwapMsgState.is(o.swap));
  },
  isSDK(o: any): o is QueryPoolBatchSwapMsgResponseSDKType {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgResponse.typeUrl || SwapMsgState.isSDK(o.swap));
  },
  isAmino(o: any): o is QueryPoolBatchSwapMsgResponseAmino {
    return o && (o.$typeUrl === QueryPoolBatchSwapMsgResponse.typeUrl || SwapMsgState.isAmino(o.swap));
  },
  encode(message: QueryPoolBatchSwapMsgResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.swap !== undefined) {
      SwapMsgState.encode(message.swap, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchSwapMsgResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchSwapMsgResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.swap = SwapMsgState.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchSwapMsgResponse {
    return {
      swap: isSet(object.swap) ? SwapMsgState.fromJSON(object.swap) : undefined
    };
  },
  toJSON(message: QueryPoolBatchSwapMsgResponse): JsonSafe<QueryPoolBatchSwapMsgResponse> {
    const obj: any = {};
    message.swap !== undefined && (obj.swap = message.swap ? SwapMsgState.toJSON(message.swap) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchSwapMsgResponse>): QueryPoolBatchSwapMsgResponse {
    const message = createBaseQueryPoolBatchSwapMsgResponse();
    message.swap = object.swap !== undefined && object.swap !== null ? SwapMsgState.fromPartial(object.swap) : undefined;
    return message;
  },
  fromAmino(object: QueryPoolBatchSwapMsgResponseAmino): QueryPoolBatchSwapMsgResponse {
    const message = createBaseQueryPoolBatchSwapMsgResponse();
    if (object.swap !== undefined && object.swap !== null) {
      message.swap = SwapMsgState.fromAmino(object.swap);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchSwapMsgResponse): QueryPoolBatchSwapMsgResponseAmino {
    const obj: any = {};
    obj.swap = message.swap ? SwapMsgState.toAmino(message.swap) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchSwapMsgResponseAminoMsg): QueryPoolBatchSwapMsgResponse {
    return QueryPoolBatchSwapMsgResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchSwapMsgResponseProtoMsg): QueryPoolBatchSwapMsgResponse {
    return QueryPoolBatchSwapMsgResponse.decode(message.value);
  },
  toProto(message: QueryPoolBatchSwapMsgResponse): Uint8Array {
    return QueryPoolBatchSwapMsgResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchSwapMsgResponse): QueryPoolBatchSwapMsgResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchSwapMsgResponse",
      value: QueryPoolBatchSwapMsgResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchSwapMsgResponse.typeUrl, QueryPoolBatchSwapMsgResponse);
function createBaseQueryPoolBatchDepositMsgsRequest(): QueryPoolBatchDepositMsgsRequest {
  return {
    poolId: BigInt(0),
    pagination: undefined
  };
}
export const QueryPoolBatchDepositMsgsRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgsRequest",
  is(o: any): o is QueryPoolBatchDepositMsgsRequest {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgsRequest.typeUrl || typeof o.poolId === "bigint");
  },
  isSDK(o: any): o is QueryPoolBatchDepositMsgsRequestSDKType {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgsRequest.typeUrl || typeof o.pool_id === "bigint");
  },
  isAmino(o: any): o is QueryPoolBatchDepositMsgsRequestAmino {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgsRequest.typeUrl || typeof o.pool_id === "bigint");
  },
  encode(message: QueryPoolBatchDepositMsgsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolId !== BigInt(0)) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchDepositMsgsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchDepositMsgsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchDepositMsgsRequest {
    return {
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryPoolBatchDepositMsgsRequest): JsonSafe<QueryPoolBatchDepositMsgsRequest> {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchDepositMsgsRequest>): QueryPoolBatchDepositMsgsRequest {
    const message = createBaseQueryPoolBatchDepositMsgsRequest();
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryPoolBatchDepositMsgsRequestAmino): QueryPoolBatchDepositMsgsRequest {
    const message = createBaseQueryPoolBatchDepositMsgsRequest();
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchDepositMsgsRequest): QueryPoolBatchDepositMsgsRequestAmino {
    const obj: any = {};
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchDepositMsgsRequestAminoMsg): QueryPoolBatchDepositMsgsRequest {
    return QueryPoolBatchDepositMsgsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchDepositMsgsRequestProtoMsg): QueryPoolBatchDepositMsgsRequest {
    return QueryPoolBatchDepositMsgsRequest.decode(message.value);
  },
  toProto(message: QueryPoolBatchDepositMsgsRequest): Uint8Array {
    return QueryPoolBatchDepositMsgsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchDepositMsgsRequest): QueryPoolBatchDepositMsgsRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgsRequest",
      value: QueryPoolBatchDepositMsgsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchDepositMsgsRequest.typeUrl, QueryPoolBatchDepositMsgsRequest);
function createBaseQueryPoolBatchDepositMsgRequest(): QueryPoolBatchDepositMsgRequest {
  return {
    poolId: BigInt(0),
    msgIndex: BigInt(0)
  };
}
export const QueryPoolBatchDepositMsgRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgRequest",
  is(o: any): o is QueryPoolBatchDepositMsgRequest {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgRequest.typeUrl || typeof o.poolId === "bigint" && typeof o.msgIndex === "bigint");
  },
  isSDK(o: any): o is QueryPoolBatchDepositMsgRequestSDKType {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgRequest.typeUrl || typeof o.pool_id === "bigint" && typeof o.msg_index === "bigint");
  },
  isAmino(o: any): o is QueryPoolBatchDepositMsgRequestAmino {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgRequest.typeUrl || typeof o.pool_id === "bigint" && typeof o.msg_index === "bigint");
  },
  encode(message: QueryPoolBatchDepositMsgRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolId !== BigInt(0)) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.msgIndex !== BigInt(0)) {
      writer.uint32(16).uint64(message.msgIndex);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchDepositMsgRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchDepositMsgRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64();
          break;
        case 2:
          message.msgIndex = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchDepositMsgRequest {
    return {
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      msgIndex: isSet(object.msgIndex) ? BigInt(object.msgIndex.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryPoolBatchDepositMsgRequest): JsonSafe<QueryPoolBatchDepositMsgRequest> {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.msgIndex !== undefined && (obj.msgIndex = (message.msgIndex || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchDepositMsgRequest>): QueryPoolBatchDepositMsgRequest {
    const message = createBaseQueryPoolBatchDepositMsgRequest();
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.msgIndex = object.msgIndex !== undefined && object.msgIndex !== null ? BigInt(object.msgIndex.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryPoolBatchDepositMsgRequestAmino): QueryPoolBatchDepositMsgRequest {
    const message = createBaseQueryPoolBatchDepositMsgRequest();
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    if (object.msg_index !== undefined && object.msg_index !== null) {
      message.msgIndex = BigInt(object.msg_index);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchDepositMsgRequest): QueryPoolBatchDepositMsgRequestAmino {
    const obj: any = {};
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    obj.msg_index = message.msgIndex !== BigInt(0) ? message.msgIndex.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchDepositMsgRequestAminoMsg): QueryPoolBatchDepositMsgRequest {
    return QueryPoolBatchDepositMsgRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchDepositMsgRequestProtoMsg): QueryPoolBatchDepositMsgRequest {
    return QueryPoolBatchDepositMsgRequest.decode(message.value);
  },
  toProto(message: QueryPoolBatchDepositMsgRequest): Uint8Array {
    return QueryPoolBatchDepositMsgRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchDepositMsgRequest): QueryPoolBatchDepositMsgRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgRequest",
      value: QueryPoolBatchDepositMsgRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchDepositMsgRequest.typeUrl, QueryPoolBatchDepositMsgRequest);
function createBaseQueryPoolBatchDepositMsgsResponse(): QueryPoolBatchDepositMsgsResponse {
  return {
    deposits: [],
    pagination: undefined
  };
}
export const QueryPoolBatchDepositMsgsResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgsResponse",
  is(o: any): o is QueryPoolBatchDepositMsgsResponse {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgsResponse.typeUrl || Array.isArray(o.deposits) && (!o.deposits.length || DepositMsgState.is(o.deposits[0])));
  },
  isSDK(o: any): o is QueryPoolBatchDepositMsgsResponseSDKType {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgsResponse.typeUrl || Array.isArray(o.deposits) && (!o.deposits.length || DepositMsgState.isSDK(o.deposits[0])));
  },
  isAmino(o: any): o is QueryPoolBatchDepositMsgsResponseAmino {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgsResponse.typeUrl || Array.isArray(o.deposits) && (!o.deposits.length || DepositMsgState.isAmino(o.deposits[0])));
  },
  encode(message: QueryPoolBatchDepositMsgsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.deposits) {
      DepositMsgState.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchDepositMsgsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchDepositMsgsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deposits.push(DepositMsgState.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchDepositMsgsResponse {
    return {
      deposits: Array.isArray(object?.deposits) ? object.deposits.map((e: any) => DepositMsgState.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryPoolBatchDepositMsgsResponse): JsonSafe<QueryPoolBatchDepositMsgsResponse> {
    const obj: any = {};
    if (message.deposits) {
      obj.deposits = message.deposits.map(e => e ? DepositMsgState.toJSON(e) : undefined);
    } else {
      obj.deposits = [];
    }
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchDepositMsgsResponse>): QueryPoolBatchDepositMsgsResponse {
    const message = createBaseQueryPoolBatchDepositMsgsResponse();
    message.deposits = object.deposits?.map(e => DepositMsgState.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryPoolBatchDepositMsgsResponseAmino): QueryPoolBatchDepositMsgsResponse {
    const message = createBaseQueryPoolBatchDepositMsgsResponse();
    message.deposits = object.deposits?.map(e => DepositMsgState.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchDepositMsgsResponse): QueryPoolBatchDepositMsgsResponseAmino {
    const obj: any = {};
    if (message.deposits) {
      obj.deposits = message.deposits.map(e => e ? DepositMsgState.toAmino(e) : undefined);
    } else {
      obj.deposits = message.deposits;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchDepositMsgsResponseAminoMsg): QueryPoolBatchDepositMsgsResponse {
    return QueryPoolBatchDepositMsgsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchDepositMsgsResponseProtoMsg): QueryPoolBatchDepositMsgsResponse {
    return QueryPoolBatchDepositMsgsResponse.decode(message.value);
  },
  toProto(message: QueryPoolBatchDepositMsgsResponse): Uint8Array {
    return QueryPoolBatchDepositMsgsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchDepositMsgsResponse): QueryPoolBatchDepositMsgsResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgsResponse",
      value: QueryPoolBatchDepositMsgsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchDepositMsgsResponse.typeUrl, QueryPoolBatchDepositMsgsResponse);
function createBaseQueryPoolBatchDepositMsgResponse(): QueryPoolBatchDepositMsgResponse {
  return {
    deposit: DepositMsgState.fromPartial({})
  };
}
export const QueryPoolBatchDepositMsgResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgResponse",
  is(o: any): o is QueryPoolBatchDepositMsgResponse {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgResponse.typeUrl || DepositMsgState.is(o.deposit));
  },
  isSDK(o: any): o is QueryPoolBatchDepositMsgResponseSDKType {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgResponse.typeUrl || DepositMsgState.isSDK(o.deposit));
  },
  isAmino(o: any): o is QueryPoolBatchDepositMsgResponseAmino {
    return o && (o.$typeUrl === QueryPoolBatchDepositMsgResponse.typeUrl || DepositMsgState.isAmino(o.deposit));
  },
  encode(message: QueryPoolBatchDepositMsgResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.deposit !== undefined) {
      DepositMsgState.encode(message.deposit, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchDepositMsgResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchDepositMsgResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deposit = DepositMsgState.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchDepositMsgResponse {
    return {
      deposit: isSet(object.deposit) ? DepositMsgState.fromJSON(object.deposit) : undefined
    };
  },
  toJSON(message: QueryPoolBatchDepositMsgResponse): JsonSafe<QueryPoolBatchDepositMsgResponse> {
    const obj: any = {};
    message.deposit !== undefined && (obj.deposit = message.deposit ? DepositMsgState.toJSON(message.deposit) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchDepositMsgResponse>): QueryPoolBatchDepositMsgResponse {
    const message = createBaseQueryPoolBatchDepositMsgResponse();
    message.deposit = object.deposit !== undefined && object.deposit !== null ? DepositMsgState.fromPartial(object.deposit) : undefined;
    return message;
  },
  fromAmino(object: QueryPoolBatchDepositMsgResponseAmino): QueryPoolBatchDepositMsgResponse {
    const message = createBaseQueryPoolBatchDepositMsgResponse();
    if (object.deposit !== undefined && object.deposit !== null) {
      message.deposit = DepositMsgState.fromAmino(object.deposit);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchDepositMsgResponse): QueryPoolBatchDepositMsgResponseAmino {
    const obj: any = {};
    obj.deposit = message.deposit ? DepositMsgState.toAmino(message.deposit) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchDepositMsgResponseAminoMsg): QueryPoolBatchDepositMsgResponse {
    return QueryPoolBatchDepositMsgResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchDepositMsgResponseProtoMsg): QueryPoolBatchDepositMsgResponse {
    return QueryPoolBatchDepositMsgResponse.decode(message.value);
  },
  toProto(message: QueryPoolBatchDepositMsgResponse): Uint8Array {
    return QueryPoolBatchDepositMsgResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchDepositMsgResponse): QueryPoolBatchDepositMsgResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchDepositMsgResponse",
      value: QueryPoolBatchDepositMsgResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchDepositMsgResponse.typeUrl, QueryPoolBatchDepositMsgResponse);
function createBaseQueryPoolBatchWithdrawMsgsRequest(): QueryPoolBatchWithdrawMsgsRequest {
  return {
    poolId: BigInt(0),
    pagination: undefined
  };
}
export const QueryPoolBatchWithdrawMsgsRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgsRequest",
  is(o: any): o is QueryPoolBatchWithdrawMsgsRequest {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgsRequest.typeUrl || typeof o.poolId === "bigint");
  },
  isSDK(o: any): o is QueryPoolBatchWithdrawMsgsRequestSDKType {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgsRequest.typeUrl || typeof o.pool_id === "bigint");
  },
  isAmino(o: any): o is QueryPoolBatchWithdrawMsgsRequestAmino {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgsRequest.typeUrl || typeof o.pool_id === "bigint");
  },
  encode(message: QueryPoolBatchWithdrawMsgsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolId !== BigInt(0)) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchWithdrawMsgsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchWithdrawMsgsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchWithdrawMsgsRequest {
    return {
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryPoolBatchWithdrawMsgsRequest): JsonSafe<QueryPoolBatchWithdrawMsgsRequest> {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchWithdrawMsgsRequest>): QueryPoolBatchWithdrawMsgsRequest {
    const message = createBaseQueryPoolBatchWithdrawMsgsRequest();
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryPoolBatchWithdrawMsgsRequestAmino): QueryPoolBatchWithdrawMsgsRequest {
    const message = createBaseQueryPoolBatchWithdrawMsgsRequest();
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchWithdrawMsgsRequest): QueryPoolBatchWithdrawMsgsRequestAmino {
    const obj: any = {};
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchWithdrawMsgsRequestAminoMsg): QueryPoolBatchWithdrawMsgsRequest {
    return QueryPoolBatchWithdrawMsgsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchWithdrawMsgsRequestProtoMsg): QueryPoolBatchWithdrawMsgsRequest {
    return QueryPoolBatchWithdrawMsgsRequest.decode(message.value);
  },
  toProto(message: QueryPoolBatchWithdrawMsgsRequest): Uint8Array {
    return QueryPoolBatchWithdrawMsgsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchWithdrawMsgsRequest): QueryPoolBatchWithdrawMsgsRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgsRequest",
      value: QueryPoolBatchWithdrawMsgsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchWithdrawMsgsRequest.typeUrl, QueryPoolBatchWithdrawMsgsRequest);
function createBaseQueryPoolBatchWithdrawMsgRequest(): QueryPoolBatchWithdrawMsgRequest {
  return {
    poolId: BigInt(0),
    msgIndex: BigInt(0)
  };
}
export const QueryPoolBatchWithdrawMsgRequest = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgRequest",
  is(o: any): o is QueryPoolBatchWithdrawMsgRequest {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgRequest.typeUrl || typeof o.poolId === "bigint" && typeof o.msgIndex === "bigint");
  },
  isSDK(o: any): o is QueryPoolBatchWithdrawMsgRequestSDKType {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgRequest.typeUrl || typeof o.pool_id === "bigint" && typeof o.msg_index === "bigint");
  },
  isAmino(o: any): o is QueryPoolBatchWithdrawMsgRequestAmino {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgRequest.typeUrl || typeof o.pool_id === "bigint" && typeof o.msg_index === "bigint");
  },
  encode(message: QueryPoolBatchWithdrawMsgRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolId !== BigInt(0)) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.msgIndex !== BigInt(0)) {
      writer.uint32(16).uint64(message.msgIndex);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchWithdrawMsgRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchWithdrawMsgRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64();
          break;
        case 2:
          message.msgIndex = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchWithdrawMsgRequest {
    return {
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      msgIndex: isSet(object.msgIndex) ? BigInt(object.msgIndex.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryPoolBatchWithdrawMsgRequest): JsonSafe<QueryPoolBatchWithdrawMsgRequest> {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.msgIndex !== undefined && (obj.msgIndex = (message.msgIndex || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchWithdrawMsgRequest>): QueryPoolBatchWithdrawMsgRequest {
    const message = createBaseQueryPoolBatchWithdrawMsgRequest();
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.msgIndex = object.msgIndex !== undefined && object.msgIndex !== null ? BigInt(object.msgIndex.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryPoolBatchWithdrawMsgRequestAmino): QueryPoolBatchWithdrawMsgRequest {
    const message = createBaseQueryPoolBatchWithdrawMsgRequest();
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    if (object.msg_index !== undefined && object.msg_index !== null) {
      message.msgIndex = BigInt(object.msg_index);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchWithdrawMsgRequest): QueryPoolBatchWithdrawMsgRequestAmino {
    const obj: any = {};
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    obj.msg_index = message.msgIndex !== BigInt(0) ? message.msgIndex.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchWithdrawMsgRequestAminoMsg): QueryPoolBatchWithdrawMsgRequest {
    return QueryPoolBatchWithdrawMsgRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchWithdrawMsgRequestProtoMsg): QueryPoolBatchWithdrawMsgRequest {
    return QueryPoolBatchWithdrawMsgRequest.decode(message.value);
  },
  toProto(message: QueryPoolBatchWithdrawMsgRequest): Uint8Array {
    return QueryPoolBatchWithdrawMsgRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchWithdrawMsgRequest): QueryPoolBatchWithdrawMsgRequestProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgRequest",
      value: QueryPoolBatchWithdrawMsgRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchWithdrawMsgRequest.typeUrl, QueryPoolBatchWithdrawMsgRequest);
function createBaseQueryPoolBatchWithdrawMsgsResponse(): QueryPoolBatchWithdrawMsgsResponse {
  return {
    withdraws: [],
    pagination: undefined
  };
}
export const QueryPoolBatchWithdrawMsgsResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgsResponse",
  is(o: any): o is QueryPoolBatchWithdrawMsgsResponse {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgsResponse.typeUrl || Array.isArray(o.withdraws) && (!o.withdraws.length || WithdrawMsgState.is(o.withdraws[0])));
  },
  isSDK(o: any): o is QueryPoolBatchWithdrawMsgsResponseSDKType {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgsResponse.typeUrl || Array.isArray(o.withdraws) && (!o.withdraws.length || WithdrawMsgState.isSDK(o.withdraws[0])));
  },
  isAmino(o: any): o is QueryPoolBatchWithdrawMsgsResponseAmino {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgsResponse.typeUrl || Array.isArray(o.withdraws) && (!o.withdraws.length || WithdrawMsgState.isAmino(o.withdraws[0])));
  },
  encode(message: QueryPoolBatchWithdrawMsgsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.withdraws) {
      WithdrawMsgState.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchWithdrawMsgsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchWithdrawMsgsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdraws.push(WithdrawMsgState.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchWithdrawMsgsResponse {
    return {
      withdraws: Array.isArray(object?.withdraws) ? object.withdraws.map((e: any) => WithdrawMsgState.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryPoolBatchWithdrawMsgsResponse): JsonSafe<QueryPoolBatchWithdrawMsgsResponse> {
    const obj: any = {};
    if (message.withdraws) {
      obj.withdraws = message.withdraws.map(e => e ? WithdrawMsgState.toJSON(e) : undefined);
    } else {
      obj.withdraws = [];
    }
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchWithdrawMsgsResponse>): QueryPoolBatchWithdrawMsgsResponse {
    const message = createBaseQueryPoolBatchWithdrawMsgsResponse();
    message.withdraws = object.withdraws?.map(e => WithdrawMsgState.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryPoolBatchWithdrawMsgsResponseAmino): QueryPoolBatchWithdrawMsgsResponse {
    const message = createBaseQueryPoolBatchWithdrawMsgsResponse();
    message.withdraws = object.withdraws?.map(e => WithdrawMsgState.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchWithdrawMsgsResponse): QueryPoolBatchWithdrawMsgsResponseAmino {
    const obj: any = {};
    if (message.withdraws) {
      obj.withdraws = message.withdraws.map(e => e ? WithdrawMsgState.toAmino(e) : undefined);
    } else {
      obj.withdraws = message.withdraws;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchWithdrawMsgsResponseAminoMsg): QueryPoolBatchWithdrawMsgsResponse {
    return QueryPoolBatchWithdrawMsgsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchWithdrawMsgsResponseProtoMsg): QueryPoolBatchWithdrawMsgsResponse {
    return QueryPoolBatchWithdrawMsgsResponse.decode(message.value);
  },
  toProto(message: QueryPoolBatchWithdrawMsgsResponse): Uint8Array {
    return QueryPoolBatchWithdrawMsgsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchWithdrawMsgsResponse): QueryPoolBatchWithdrawMsgsResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgsResponse",
      value: QueryPoolBatchWithdrawMsgsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchWithdrawMsgsResponse.typeUrl, QueryPoolBatchWithdrawMsgsResponse);
function createBaseQueryPoolBatchWithdrawMsgResponse(): QueryPoolBatchWithdrawMsgResponse {
  return {
    withdraw: WithdrawMsgState.fromPartial({})
  };
}
export const QueryPoolBatchWithdrawMsgResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgResponse",
  is(o: any): o is QueryPoolBatchWithdrawMsgResponse {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgResponse.typeUrl || WithdrawMsgState.is(o.withdraw));
  },
  isSDK(o: any): o is QueryPoolBatchWithdrawMsgResponseSDKType {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgResponse.typeUrl || WithdrawMsgState.isSDK(o.withdraw));
  },
  isAmino(o: any): o is QueryPoolBatchWithdrawMsgResponseAmino {
    return o && (o.$typeUrl === QueryPoolBatchWithdrawMsgResponse.typeUrl || WithdrawMsgState.isAmino(o.withdraw));
  },
  encode(message: QueryPoolBatchWithdrawMsgResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.withdraw !== undefined) {
      WithdrawMsgState.encode(message.withdraw, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPoolBatchWithdrawMsgResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPoolBatchWithdrawMsgResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdraw = WithdrawMsgState.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPoolBatchWithdrawMsgResponse {
    return {
      withdraw: isSet(object.withdraw) ? WithdrawMsgState.fromJSON(object.withdraw) : undefined
    };
  },
  toJSON(message: QueryPoolBatchWithdrawMsgResponse): JsonSafe<QueryPoolBatchWithdrawMsgResponse> {
    const obj: any = {};
    message.withdraw !== undefined && (obj.withdraw = message.withdraw ? WithdrawMsgState.toJSON(message.withdraw) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryPoolBatchWithdrawMsgResponse>): QueryPoolBatchWithdrawMsgResponse {
    const message = createBaseQueryPoolBatchWithdrawMsgResponse();
    message.withdraw = object.withdraw !== undefined && object.withdraw !== null ? WithdrawMsgState.fromPartial(object.withdraw) : undefined;
    return message;
  },
  fromAmino(object: QueryPoolBatchWithdrawMsgResponseAmino): QueryPoolBatchWithdrawMsgResponse {
    const message = createBaseQueryPoolBatchWithdrawMsgResponse();
    if (object.withdraw !== undefined && object.withdraw !== null) {
      message.withdraw = WithdrawMsgState.fromAmino(object.withdraw);
    }
    return message;
  },
  toAmino(message: QueryPoolBatchWithdrawMsgResponse): QueryPoolBatchWithdrawMsgResponseAmino {
    const obj: any = {};
    obj.withdraw = message.withdraw ? WithdrawMsgState.toAmino(message.withdraw) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPoolBatchWithdrawMsgResponseAminoMsg): QueryPoolBatchWithdrawMsgResponse {
    return QueryPoolBatchWithdrawMsgResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPoolBatchWithdrawMsgResponseProtoMsg): QueryPoolBatchWithdrawMsgResponse {
    return QueryPoolBatchWithdrawMsgResponse.decode(message.value);
  },
  toProto(message: QueryPoolBatchWithdrawMsgResponse): Uint8Array {
    return QueryPoolBatchWithdrawMsgResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPoolBatchWithdrawMsgResponse): QueryPoolBatchWithdrawMsgResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.QueryPoolBatchWithdrawMsgResponse",
      value: QueryPoolBatchWithdrawMsgResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPoolBatchWithdrawMsgResponse.typeUrl, QueryPoolBatchWithdrawMsgResponse);