/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";
import {
  Pool,
  PoolBatch,
  Params,
  SwapMsgState,
  DepositMsgState,
  WithdrawMsgState,
} from "../../../tendermint/liquidity/v1beta1/liquidity";
import { PageRequest, PageResponse } from "../../../cosmos/base/query/v1beta1/pagination";

export const protobufPackage = "tendermint.liquidity.v1beta1";

/** the request type for the QueryLiquidityPool RPC method. requestable specified pool_id. */
export interface QueryLiquidityPoolRequest {
  poolId: number;
}

/** the response type for the QueryLiquidityPoolResponse RPC method. Returns the liquidity pool that corresponds to the requested pool_id. */
export interface QueryLiquidityPoolResponse {
  pool: Pool | undefined;
}

/** the request type for the QueryLiquidityByPoolCoinDenomPool RPC method. Requestable specified pool_coin_denom. */
export interface QueryLiquidityPoolByPoolCoinDenomRequest {
  poolCoinDenom: string;
}

/** the request type for the QueryLiquidityByReserveAcc RPC method. Requestable specified reserve_acc. */
export interface QueryLiquidityPoolByReserveAccRequest {
  reserveAcc: string;
}

/** the request type for the QueryLiquidityPoolBatch RPC method. requestable including specified pool_id. */
export interface QueryLiquidityPoolBatchRequest {
  /** id of the target pool for query */
  poolId: number;
}

/** the response type for the QueryLiquidityPoolBatchResponse RPC method. Returns the liquidity pool batch that corresponds to the requested pool_id. */
export interface QueryLiquidityPoolBatchResponse {
  batch: PoolBatch | undefined;
}

/** the request type for the QueryLiquidityPools RPC method. Requestable including pagination offset, limit, key. */
export interface QueryLiquidityPoolsRequest {
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest;
}

/** the response type for the QueryLiquidityPoolsResponse RPC method. This includes a list of all existing liquidity pools and paging results that contain next_key and total count. */
export interface QueryLiquidityPoolsResponse {
  pools: Pool[];
  /** pagination defines the pagination in the response. not working on this version. */
  pagination?: PageResponse;
}

/** QueryParamsRequest is request type for the QueryParams RPC method. */
export interface QueryParamsRequest {}

/** the response type for the QueryParamsResponse RPC method. This includes current parameter of the liquidity module. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

/** the request type for the QueryPoolBatchSwapMsgs RPC method. Requestable including specified pool_id and pagination offset, limit, key. */
export interface QueryPoolBatchSwapMsgsRequest {
  /** id of the target pool for query */
  poolId: number;
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest;
}

/** the request type for the QueryPoolBatchSwap RPC method. Requestable including specified pool_id and msg_index. */
export interface QueryPoolBatchSwapMsgRequest {
  /** id of the target pool for query */
  poolId: number;
  /** target msg_index of the pool */
  msgIndex: number;
}

/** the response type for the QueryPoolBatchSwapMsgs RPC method. This includes list of all currently existing swap messages of the batch and paging results that contain next_key and total count. */
export interface QueryPoolBatchSwapMsgsResponse {
  swaps: SwapMsgState[];
  /** pagination defines the pagination in the response. not working on this version. */
  pagination?: PageResponse;
}

/** the response type for the QueryPoolBatchSwapMsg RPC method. This includes a batch swap message of the batch. */
export interface QueryPoolBatchSwapMsgResponse {
  swap: SwapMsgState | undefined;
}

/** the request type for the QueryPoolBatchDeposit RPC method. Requestable including specified pool_id and pagination offset, limit, key. */
export interface QueryPoolBatchDepositMsgsRequest {
  /** id of the target pool for query */
  poolId: number;
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest;
}

/** the request type for the QueryPoolBatchDeposit RPC method. requestable including specified pool_id and msg_index. */
export interface QueryPoolBatchDepositMsgRequest {
  /** id of the target pool for query */
  poolId: number;
  /** target msg_index of the pool */
  msgIndex: number;
}

/** the response type for the QueryPoolBatchDeposit RPC method. This includes a list of all currently existing deposit messages of the batch and paging results that contain next_key and total count. */
export interface QueryPoolBatchDepositMsgsResponse {
  deposits: DepositMsgState[];
  /** pagination defines the pagination in the response. not working on this version. */
  pagination?: PageResponse;
}

/** the response type for the QueryPoolBatchDepositMsg RPC method. This includes a batch swap message of the batch. */
export interface QueryPoolBatchDepositMsgResponse {
  deposit: DepositMsgState | undefined;
}

/** the request type for the QueryPoolBatchWithdraw RPC method. Requestable including specified pool_id and pagination offset, limit, key. */
export interface QueryPoolBatchWithdrawMsgsRequest {
  /** id of the target pool for query */
  poolId: number;
  /** pagination defines an optional pagination for the request. */
  pagination: PageRequest | undefined;
}

/** the request type for the QueryPoolBatchWithdraw RPC method. requestable including specified pool_id and msg_index. */
export interface QueryPoolBatchWithdrawMsgRequest {
  /** id of the target pool for query */
  poolId: number;
  /** target msg_index of the pool */
  msgIndex: number;
}

/** the response type for the QueryPoolBatchWithdraw RPC method. This includes a list of all currently existing withdraw messages of the batch and paging results that contain next_key and total count. */
export interface QueryPoolBatchWithdrawMsgsResponse {
  withdraws: WithdrawMsgState[];
  /** pagination defines the pagination in the response. Not supported on this version. */
  pagination: PageResponse | undefined;
}

/** the response type for the QueryPoolBatchWithdrawMsg RPC method. This includes a batch swap message of the batch. */
export interface QueryPoolBatchWithdrawMsgResponse {
  withdraw: WithdrawMsgState | undefined;
}

const baseQueryLiquidityPoolRequest: object = { poolId: 0 };

export const QueryLiquidityPoolRequest = {
  encode(
    message: QueryLiquidityPoolRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.poolId !== 0) {
      writer.uint32(8).uint64(message.poolId);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryLiquidityPoolRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryLiquidityPoolRequest,
    } as QueryLiquidityPoolRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryLiquidityPoolRequest {
    const message = {
      ...baseQueryLiquidityPoolRequest,
    } as QueryLiquidityPoolRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    return message;
  },

  toJSON(message: QueryLiquidityPoolRequest): unknown {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = message.poolId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryLiquidityPoolRequest>
  ): QueryLiquidityPoolRequest {
    const message = {
      ...baseQueryLiquidityPoolRequest,
    } as QueryLiquidityPoolRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    return message;
  },
};

const baseQueryLiquidityPoolResponse: object = {};

export const QueryLiquidityPoolResponse = {
  encode(
    message: QueryLiquidityPoolResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.pool !== undefined) {
      Pool.encode(message.pool, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryLiquidityPoolResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryLiquidityPoolResponse,
    } as QueryLiquidityPoolResponse;
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
    const message = {
      ...baseQueryLiquidityPoolResponse,
    } as QueryLiquidityPoolResponse;
    if (object.pool !== undefined && object.pool !== null) {
      message.pool = Pool.fromJSON(object.pool);
    } else {
      message.pool = undefined;
    }
    return message;
  },

  toJSON(message: QueryLiquidityPoolResponse): unknown {
    const obj: any = {};
    message.pool !== undefined &&
      (obj.pool = message.pool ? Pool.toJSON(message.pool) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryLiquidityPoolResponse>
  ): QueryLiquidityPoolResponse {
    const message = {
      ...baseQueryLiquidityPoolResponse,
    } as QueryLiquidityPoolResponse;
    if (object.pool !== undefined && object.pool !== null) {
      message.pool = Pool.fromPartial(object.pool);
    } else {
      message.pool = undefined;
    }
    return message;
  },
};

const baseQueryLiquidityPoolByPoolCoinDenomRequest: object = {
  poolCoinDenom: "",
};

export const QueryLiquidityPoolByPoolCoinDenomRequest = {
  encode(
    message: QueryLiquidityPoolByPoolCoinDenomRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.poolCoinDenom !== "") {
      writer.uint32(10).string(message.poolCoinDenom);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryLiquidityPoolByPoolCoinDenomRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryLiquidityPoolByPoolCoinDenomRequest,
    } as QueryLiquidityPoolByPoolCoinDenomRequest;
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
    const message = {
      ...baseQueryLiquidityPoolByPoolCoinDenomRequest,
    } as QueryLiquidityPoolByPoolCoinDenomRequest;
    if (object.poolCoinDenom !== undefined && object.poolCoinDenom !== null) {
      message.poolCoinDenom = String(object.poolCoinDenom);
    } else {
      message.poolCoinDenom = "";
    }
    return message;
  },

  toJSON(message: QueryLiquidityPoolByPoolCoinDenomRequest): unknown {
    const obj: any = {};
    message.poolCoinDenom !== undefined &&
      (obj.poolCoinDenom = message.poolCoinDenom);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryLiquidityPoolByPoolCoinDenomRequest>
  ): QueryLiquidityPoolByPoolCoinDenomRequest {
    const message = {
      ...baseQueryLiquidityPoolByPoolCoinDenomRequest,
    } as QueryLiquidityPoolByPoolCoinDenomRequest;
    if (object.poolCoinDenom !== undefined && object.poolCoinDenom !== null) {
      message.poolCoinDenom = object.poolCoinDenom;
    } else {
      message.poolCoinDenom = "";
    }
    return message;
  },
};

const baseQueryLiquidityPoolByReserveAccRequest: object = { reserveAcc: "" };

export const QueryLiquidityPoolByReserveAccRequest = {
  encode(
    message: QueryLiquidityPoolByReserveAccRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.reserveAcc !== "") {
      writer.uint32(10).string(message.reserveAcc);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryLiquidityPoolByReserveAccRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryLiquidityPoolByReserveAccRequest,
    } as QueryLiquidityPoolByReserveAccRequest;
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
    const message = {
      ...baseQueryLiquidityPoolByReserveAccRequest,
    } as QueryLiquidityPoolByReserveAccRequest;
    if (object.reserveAcc !== undefined && object.reserveAcc !== null) {
      message.reserveAcc = String(object.reserveAcc);
    } else {
      message.reserveAcc = "";
    }
    return message;
  },

  toJSON(message: QueryLiquidityPoolByReserveAccRequest): unknown {
    const obj: any = {};
    message.reserveAcc !== undefined && (obj.reserveAcc = message.reserveAcc);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryLiquidityPoolByReserveAccRequest>
  ): QueryLiquidityPoolByReserveAccRequest {
    const message = {
      ...baseQueryLiquidityPoolByReserveAccRequest,
    } as QueryLiquidityPoolByReserveAccRequest;
    if (object.reserveAcc !== undefined && object.reserveAcc !== null) {
      message.reserveAcc = object.reserveAcc;
    } else {
      message.reserveAcc = "";
    }
    return message;
  },
};

const baseQueryLiquidityPoolBatchRequest: object = { poolId: 0 };

export const QueryLiquidityPoolBatchRequest = {
  encode(
    message: QueryLiquidityPoolBatchRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.poolId !== 0) {
      writer.uint32(8).uint64(message.poolId);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryLiquidityPoolBatchRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryLiquidityPoolBatchRequest,
    } as QueryLiquidityPoolBatchRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryLiquidityPoolBatchRequest {
    const message = {
      ...baseQueryLiquidityPoolBatchRequest,
    } as QueryLiquidityPoolBatchRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    return message;
  },

  toJSON(message: QueryLiquidityPoolBatchRequest): unknown {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = message.poolId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryLiquidityPoolBatchRequest>
  ): QueryLiquidityPoolBatchRequest {
    const message = {
      ...baseQueryLiquidityPoolBatchRequest,
    } as QueryLiquidityPoolBatchRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    return message;
  },
};

const baseQueryLiquidityPoolBatchResponse: object = {};

export const QueryLiquidityPoolBatchResponse = {
  encode(
    message: QueryLiquidityPoolBatchResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.batch !== undefined) {
      PoolBatch.encode(message.batch, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryLiquidityPoolBatchResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryLiquidityPoolBatchResponse,
    } as QueryLiquidityPoolBatchResponse;
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
    const message = {
      ...baseQueryLiquidityPoolBatchResponse,
    } as QueryLiquidityPoolBatchResponse;
    if (object.batch !== undefined && object.batch !== null) {
      message.batch = PoolBatch.fromJSON(object.batch);
    } else {
      message.batch = undefined;
    }
    return message;
  },

  toJSON(message: QueryLiquidityPoolBatchResponse): unknown {
    const obj: any = {};
    message.batch !== undefined &&
      (obj.batch = message.batch ? PoolBatch.toJSON(message.batch) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryLiquidityPoolBatchResponse>
  ): QueryLiquidityPoolBatchResponse {
    const message = {
      ...baseQueryLiquidityPoolBatchResponse,
    } as QueryLiquidityPoolBatchResponse;
    if (object.batch !== undefined && object.batch !== null) {
      message.batch = PoolBatch.fromPartial(object.batch);
    } else {
      message.batch = undefined;
    }
    return message;
  },
};

const baseQueryLiquidityPoolsRequest: object = {};

export const QueryLiquidityPoolsRequest = {
  encode(
    message: QueryLiquidityPoolsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryLiquidityPoolsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryLiquidityPoolsRequest,
    } as QueryLiquidityPoolsRequest;
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
    const message = {
      ...baseQueryLiquidityPoolsRequest,
    } as QueryLiquidityPoolsRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryLiquidityPoolsRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryLiquidityPoolsRequest>
  ): QueryLiquidityPoolsRequest {
    const message = {
      ...baseQueryLiquidityPoolsRequest,
    } as QueryLiquidityPoolsRequest;
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryLiquidityPoolsResponse: object = {};

export const QueryLiquidityPoolsResponse = {
  encode(
    message: QueryLiquidityPoolsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.pools) {
      Pool.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryLiquidityPoolsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryLiquidityPoolsResponse,
    } as QueryLiquidityPoolsResponse;
    message.pools = [];
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
    const message = {
      ...baseQueryLiquidityPoolsResponse,
    } as QueryLiquidityPoolsResponse;
    message.pools = [];
    if (object.pools !== undefined && object.pools !== null) {
      for (const e of object.pools) {
        message.pools.push(Pool.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryLiquidityPoolsResponse): unknown {
    const obj: any = {};
    if (message.pools) {
      obj.pools = message.pools.map((e) => (e ? Pool.toJSON(e) : undefined));
    } else {
      obj.pools = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryLiquidityPoolsResponse>
  ): QueryLiquidityPoolsResponse {
    const message = {
      ...baseQueryLiquidityPoolsResponse,
    } as QueryLiquidityPoolsResponse;
    message.pools = [];
    if (object.pools !== undefined && object.pools !== null) {
      for (const e of object.pools) {
        message.pools.push(Pool.fromPartial(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryParamsRequest: object = {};

export const QueryParamsRequest = {
  encode(_: QueryParamsRequest, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
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
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    return message;
  },

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<QueryParamsRequest>): QueryParamsRequest {
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    return message;
  },
};

const baseQueryParamsResponse: object = {};

export const QueryParamsResponse = {
  encode(
    message: QueryParamsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
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
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    return message;
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryParamsResponse>): QueryParamsResponse {
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    return message;
  },
};

const baseQueryPoolBatchSwapMsgsRequest: object = { poolId: 0 };

export const QueryPoolBatchSwapMsgsRequest = {
  encode(
    message: QueryPoolBatchSwapMsgsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.poolId !== 0) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchSwapMsgsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchSwapMsgsRequest,
    } as QueryPoolBatchSwapMsgsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = longToNumber(reader.uint64() as Long);
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
    const message = {
      ...baseQueryPoolBatchSwapMsgsRequest,
    } as QueryPoolBatchSwapMsgsRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchSwapMsgsRequest): unknown {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = message.poolId);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchSwapMsgsRequest>
  ): QueryPoolBatchSwapMsgsRequest {
    const message = {
      ...baseQueryPoolBatchSwapMsgsRequest,
    } as QueryPoolBatchSwapMsgsRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryPoolBatchSwapMsgRequest: object = { poolId: 0, msgIndex: 0 };

export const QueryPoolBatchSwapMsgRequest = {
  encode(
    message: QueryPoolBatchSwapMsgRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.poolId !== 0) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.msgIndex !== 0) {
      writer.uint32(16).uint64(message.msgIndex);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchSwapMsgRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchSwapMsgRequest,
    } as QueryPoolBatchSwapMsgRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.msgIndex = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryPoolBatchSwapMsgRequest {
    const message = {
      ...baseQueryPoolBatchSwapMsgRequest,
    } as QueryPoolBatchSwapMsgRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    if (object.msgIndex !== undefined && object.msgIndex !== null) {
      message.msgIndex = Number(object.msgIndex);
    } else {
      message.msgIndex = 0;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchSwapMsgRequest): unknown {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = message.poolId);
    message.msgIndex !== undefined && (obj.msgIndex = message.msgIndex);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchSwapMsgRequest>
  ): QueryPoolBatchSwapMsgRequest {
    const message = {
      ...baseQueryPoolBatchSwapMsgRequest,
    } as QueryPoolBatchSwapMsgRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    if (object.msgIndex !== undefined && object.msgIndex !== null) {
      message.msgIndex = object.msgIndex;
    } else {
      message.msgIndex = 0;
    }
    return message;
  },
};

const baseQueryPoolBatchSwapMsgsResponse: object = {};

export const QueryPoolBatchSwapMsgsResponse = {
  encode(
    message: QueryPoolBatchSwapMsgsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.swaps) {
      SwapMsgState.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchSwapMsgsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchSwapMsgsResponse,
    } as QueryPoolBatchSwapMsgsResponse;
    message.swaps = [];
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
    const message = {
      ...baseQueryPoolBatchSwapMsgsResponse,
    } as QueryPoolBatchSwapMsgsResponse;
    message.swaps = [];
    if (object.swaps !== undefined && object.swaps !== null) {
      for (const e of object.swaps) {
        message.swaps.push(SwapMsgState.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchSwapMsgsResponse): unknown {
    const obj: any = {};
    if (message.swaps) {
      obj.swaps = message.swaps.map((e) =>
        e ? SwapMsgState.toJSON(e) : undefined
      );
    } else {
      obj.swaps = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchSwapMsgsResponse>
  ): QueryPoolBatchSwapMsgsResponse {
    const message = {
      ...baseQueryPoolBatchSwapMsgsResponse,
    } as QueryPoolBatchSwapMsgsResponse;
    message.swaps = [];
    if (object.swaps !== undefined && object.swaps !== null) {
      for (const e of object.swaps) {
        message.swaps.push(SwapMsgState.fromPartial(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryPoolBatchSwapMsgResponse: object = {};

export const QueryPoolBatchSwapMsgResponse = {
  encode(
    message: QueryPoolBatchSwapMsgResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.swap !== undefined) {
      SwapMsgState.encode(message.swap, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchSwapMsgResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchSwapMsgResponse,
    } as QueryPoolBatchSwapMsgResponse;
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
    const message = {
      ...baseQueryPoolBatchSwapMsgResponse,
    } as QueryPoolBatchSwapMsgResponse;
    if (object.swap !== undefined && object.swap !== null) {
      message.swap = SwapMsgState.fromJSON(object.swap);
    } else {
      message.swap = undefined;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchSwapMsgResponse): unknown {
    const obj: any = {};
    message.swap !== undefined &&
      (obj.swap = message.swap ? SwapMsgState.toJSON(message.swap) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchSwapMsgResponse>
  ): QueryPoolBatchSwapMsgResponse {
    const message = {
      ...baseQueryPoolBatchSwapMsgResponse,
    } as QueryPoolBatchSwapMsgResponse;
    if (object.swap !== undefined && object.swap !== null) {
      message.swap = SwapMsgState.fromPartial(object.swap);
    } else {
      message.swap = undefined;
    }
    return message;
  },
};

const baseQueryPoolBatchDepositMsgsRequest: object = { poolId: 0 };

export const QueryPoolBatchDepositMsgsRequest = {
  encode(
    message: QueryPoolBatchDepositMsgsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.poolId !== 0) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchDepositMsgsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchDepositMsgsRequest,
    } as QueryPoolBatchDepositMsgsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = longToNumber(reader.uint64() as Long);
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
    const message = {
      ...baseQueryPoolBatchDepositMsgsRequest,
    } as QueryPoolBatchDepositMsgsRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchDepositMsgsRequest): unknown {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = message.poolId);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchDepositMsgsRequest>
  ): QueryPoolBatchDepositMsgsRequest {
    const message = {
      ...baseQueryPoolBatchDepositMsgsRequest,
    } as QueryPoolBatchDepositMsgsRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryPoolBatchDepositMsgRequest: object = { poolId: 0, msgIndex: 0 };

export const QueryPoolBatchDepositMsgRequest = {
  encode(
    message: QueryPoolBatchDepositMsgRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.poolId !== 0) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.msgIndex !== 0) {
      writer.uint32(16).uint64(message.msgIndex);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchDepositMsgRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchDepositMsgRequest,
    } as QueryPoolBatchDepositMsgRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.msgIndex = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryPoolBatchDepositMsgRequest {
    const message = {
      ...baseQueryPoolBatchDepositMsgRequest,
    } as QueryPoolBatchDepositMsgRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    if (object.msgIndex !== undefined && object.msgIndex !== null) {
      message.msgIndex = Number(object.msgIndex);
    } else {
      message.msgIndex = 0;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchDepositMsgRequest): unknown {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = message.poolId);
    message.msgIndex !== undefined && (obj.msgIndex = message.msgIndex);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchDepositMsgRequest>
  ): QueryPoolBatchDepositMsgRequest {
    const message = {
      ...baseQueryPoolBatchDepositMsgRequest,
    } as QueryPoolBatchDepositMsgRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    if (object.msgIndex !== undefined && object.msgIndex !== null) {
      message.msgIndex = object.msgIndex;
    } else {
      message.msgIndex = 0;
    }
    return message;
  },
};

const baseQueryPoolBatchDepositMsgsResponse: object = {};

export const QueryPoolBatchDepositMsgsResponse = {
  encode(
    message: QueryPoolBatchDepositMsgsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.deposits) {
      DepositMsgState.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchDepositMsgsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchDepositMsgsResponse,
    } as QueryPoolBatchDepositMsgsResponse;
    message.deposits = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deposits.push(
            DepositMsgState.decode(reader, reader.uint32())
          );
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
    const message = {
      ...baseQueryPoolBatchDepositMsgsResponse,
    } as QueryPoolBatchDepositMsgsResponse;
    message.deposits = [];
    if (object.deposits !== undefined && object.deposits !== null) {
      for (const e of object.deposits) {
        message.deposits.push(DepositMsgState.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchDepositMsgsResponse): unknown {
    const obj: any = {};
    if (message.deposits) {
      obj.deposits = message.deposits.map((e) =>
        e ? DepositMsgState.toJSON(e) : undefined
      );
    } else {
      obj.deposits = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchDepositMsgsResponse>
  ): QueryPoolBatchDepositMsgsResponse {
    const message = {
      ...baseQueryPoolBatchDepositMsgsResponse,
    } as QueryPoolBatchDepositMsgsResponse;
    message.deposits = [];
    if (object.deposits !== undefined && object.deposits !== null) {
      for (const e of object.deposits) {
        message.deposits.push(DepositMsgState.fromPartial(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryPoolBatchDepositMsgResponse: object = {};

export const QueryPoolBatchDepositMsgResponse = {
  encode(
    message: QueryPoolBatchDepositMsgResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.deposit !== undefined) {
      DepositMsgState.encode(
        message.deposit,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchDepositMsgResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchDepositMsgResponse,
    } as QueryPoolBatchDepositMsgResponse;
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
    const message = {
      ...baseQueryPoolBatchDepositMsgResponse,
    } as QueryPoolBatchDepositMsgResponse;
    if (object.deposit !== undefined && object.deposit !== null) {
      message.deposit = DepositMsgState.fromJSON(object.deposit);
    } else {
      message.deposit = undefined;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchDepositMsgResponse): unknown {
    const obj: any = {};
    message.deposit !== undefined &&
      (obj.deposit = message.deposit
        ? DepositMsgState.toJSON(message.deposit)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchDepositMsgResponse>
  ): QueryPoolBatchDepositMsgResponse {
    const message = {
      ...baseQueryPoolBatchDepositMsgResponse,
    } as QueryPoolBatchDepositMsgResponse;
    if (object.deposit !== undefined && object.deposit !== null) {
      message.deposit = DepositMsgState.fromPartial(object.deposit);
    } else {
      message.deposit = undefined;
    }
    return message;
  },
};

const baseQueryPoolBatchWithdrawMsgsRequest: object = { poolId: 0 };

export const QueryPoolBatchWithdrawMsgsRequest = {
  encode(
    message: QueryPoolBatchWithdrawMsgsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.poolId !== 0) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchWithdrawMsgsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchWithdrawMsgsRequest,
    } as QueryPoolBatchWithdrawMsgsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = longToNumber(reader.uint64() as Long);
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
    const message = {
      ...baseQueryPoolBatchWithdrawMsgsRequest,
    } as QueryPoolBatchWithdrawMsgsRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchWithdrawMsgsRequest): unknown {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = message.poolId);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchWithdrawMsgsRequest>
  ): QueryPoolBatchWithdrawMsgsRequest {
    const message = {
      ...baseQueryPoolBatchWithdrawMsgsRequest,
    } as QueryPoolBatchWithdrawMsgsRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryPoolBatchWithdrawMsgRequest: object = { poolId: 0, msgIndex: 0 };

export const QueryPoolBatchWithdrawMsgRequest = {
  encode(
    message: QueryPoolBatchWithdrawMsgRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.poolId !== 0) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.msgIndex !== 0) {
      writer.uint32(16).uint64(message.msgIndex);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchWithdrawMsgRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchWithdrawMsgRequest,
    } as QueryPoolBatchWithdrawMsgRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.msgIndex = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryPoolBatchWithdrawMsgRequest {
    const message = {
      ...baseQueryPoolBatchWithdrawMsgRequest,
    } as QueryPoolBatchWithdrawMsgRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    if (object.msgIndex !== undefined && object.msgIndex !== null) {
      message.msgIndex = Number(object.msgIndex);
    } else {
      message.msgIndex = 0;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchWithdrawMsgRequest): unknown {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = message.poolId);
    message.msgIndex !== undefined && (obj.msgIndex = message.msgIndex);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchWithdrawMsgRequest>
  ): QueryPoolBatchWithdrawMsgRequest {
    const message = {
      ...baseQueryPoolBatchWithdrawMsgRequest,
    } as QueryPoolBatchWithdrawMsgRequest;
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    if (object.msgIndex !== undefined && object.msgIndex !== null) {
      message.msgIndex = object.msgIndex;
    } else {
      message.msgIndex = 0;
    }
    return message;
  },
};

const baseQueryPoolBatchWithdrawMsgsResponse: object = {};

export const QueryPoolBatchWithdrawMsgsResponse = {
  encode(
    message: QueryPoolBatchWithdrawMsgsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.withdraws) {
      WithdrawMsgState.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(
        message.pagination,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchWithdrawMsgsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchWithdrawMsgsResponse,
    } as QueryPoolBatchWithdrawMsgsResponse;
    message.withdraws = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdraws.push(
            WithdrawMsgState.decode(reader, reader.uint32())
          );
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
    const message = {
      ...baseQueryPoolBatchWithdrawMsgsResponse,
    } as QueryPoolBatchWithdrawMsgsResponse;
    message.withdraws = [];
    if (object.withdraws !== undefined && object.withdraws !== null) {
      for (const e of object.withdraws) {
        message.withdraws.push(WithdrawMsgState.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchWithdrawMsgsResponse): unknown {
    const obj: any = {};
    if (message.withdraws) {
      obj.withdraws = message.withdraws.map((e) =>
        e ? WithdrawMsgState.toJSON(e) : undefined
      );
    } else {
      obj.withdraws = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchWithdrawMsgsResponse>
  ): QueryPoolBatchWithdrawMsgsResponse {
    const message = {
      ...baseQueryPoolBatchWithdrawMsgsResponse,
    } as QueryPoolBatchWithdrawMsgsResponse;
    message.withdraws = [];
    if (object.withdraws !== undefined && object.withdraws !== null) {
      for (const e of object.withdraws) {
        message.withdraws.push(WithdrawMsgState.fromPartial(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryPoolBatchWithdrawMsgResponse: object = {};

export const QueryPoolBatchWithdrawMsgResponse = {
  encode(
    message: QueryPoolBatchWithdrawMsgResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.withdraw !== undefined) {
      WithdrawMsgState.encode(
        message.withdraw,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): QueryPoolBatchWithdrawMsgResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryPoolBatchWithdrawMsgResponse,
    } as QueryPoolBatchWithdrawMsgResponse;
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
    const message = {
      ...baseQueryPoolBatchWithdrawMsgResponse,
    } as QueryPoolBatchWithdrawMsgResponse;
    if (object.withdraw !== undefined && object.withdraw !== null) {
      message.withdraw = WithdrawMsgState.fromJSON(object.withdraw);
    } else {
      message.withdraw = undefined;
    }
    return message;
  },

  toJSON(message: QueryPoolBatchWithdrawMsgResponse): unknown {
    const obj: any = {};
    message.withdraw !== undefined &&
      (obj.withdraw = message.withdraw
        ? WithdrawMsgState.toJSON(message.withdraw)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryPoolBatchWithdrawMsgResponse>
  ): QueryPoolBatchWithdrawMsgResponse {
    const message = {
      ...baseQueryPoolBatchWithdrawMsgResponse,
    } as QueryPoolBatchWithdrawMsgResponse;
    if (object.withdraw !== undefined && object.withdraw !== null) {
      message.withdraw = WithdrawMsgState.fromPartial(object.withdraw);
    } else {
      message.withdraw = undefined;
    }
    return message;
  },
};

/** Query defines the gRPC query service for the liquidity module. */
export interface Query {
  /** Get existing liquidity pools. */
  LiquidityPools(
    request: QueryLiquidityPoolsRequest
  ): Promise<QueryLiquidityPoolsResponse>;
  /** Get specific liquidity pool. */
  LiquidityPool(
    request: QueryLiquidityPoolRequest
  ): Promise<QueryLiquidityPoolResponse>;
  /** Get specific liquidity pool corresponding to the pool_coin_denom. */
  LiquidityPoolByPoolCoinDenom(
    request: QueryLiquidityPoolByPoolCoinDenomRequest
  ): Promise<QueryLiquidityPoolResponse>;
  /** Get specific liquidity pool corresponding to the reserve account. */
  LiquidityPoolByReserveAcc(
    request: QueryLiquidityPoolByReserveAccRequest
  ): Promise<QueryLiquidityPoolResponse>;
  /** Get the pool's current batch. */
  LiquidityPoolBatch(
    request: QueryLiquidityPoolBatchRequest
  ): Promise<QueryLiquidityPoolBatchResponse>;
  /** Get all swap messages in the pool's current batch. */
  PoolBatchSwapMsgs(
    request: QueryPoolBatchSwapMsgsRequest
  ): Promise<QueryPoolBatchSwapMsgsResponse>;
  /** Get a specific swap message in the pool's current batch. */
  PoolBatchSwapMsg(
    request: QueryPoolBatchSwapMsgRequest
  ): Promise<QueryPoolBatchSwapMsgResponse>;
  /** Get all deposit messages in the pool's current batch. */
  PoolBatchDepositMsgs(
    request: QueryPoolBatchDepositMsgsRequest
  ): Promise<QueryPoolBatchDepositMsgsResponse>;
  /** Get a specific deposit message in the pool's current batch. */
  PoolBatchDepositMsg(
    request: QueryPoolBatchDepositMsgRequest
  ): Promise<QueryPoolBatchDepositMsgResponse>;
  /** Get all withdraw messages in the pool's current batch. */
  PoolBatchWithdrawMsgs(
    request: QueryPoolBatchWithdrawMsgsRequest
  ): Promise<QueryPoolBatchWithdrawMsgsResponse>;
  /** Get a specific withdraw message in the pool's current batch. */
  PoolBatchWithdrawMsg(
    request: QueryPoolBatchWithdrawMsgRequest
  ): Promise<QueryPoolBatchWithdrawMsgResponse>;
  /** Get all parameters of the liquidity module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  LiquidityPools(
    request: QueryLiquidityPoolsRequest
  ): Promise<QueryLiquidityPoolsResponse> {
    const data = QueryLiquidityPoolsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "LiquidityPools",
      data
    );
    return promise.then((data) =>
      QueryLiquidityPoolsResponse.decode(new Reader(data))
    );
  }

  LiquidityPool(
    request: QueryLiquidityPoolRequest
  ): Promise<QueryLiquidityPoolResponse> {
    const data = QueryLiquidityPoolRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "LiquidityPool",
      data
    );
    return promise.then((data) =>
      QueryLiquidityPoolResponse.decode(new Reader(data))
    );
  }

  LiquidityPoolByPoolCoinDenom(
    request: QueryLiquidityPoolByPoolCoinDenomRequest
  ): Promise<QueryLiquidityPoolResponse> {
    const data = QueryLiquidityPoolByPoolCoinDenomRequest.encode(
      request
    ).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "LiquidityPoolByPoolCoinDenom",
      data
    );
    return promise.then((data) =>
      QueryLiquidityPoolResponse.decode(new Reader(data))
    );
  }

  LiquidityPoolByReserveAcc(
    request: QueryLiquidityPoolByReserveAccRequest
  ): Promise<QueryLiquidityPoolResponse> {
    const data = QueryLiquidityPoolByReserveAccRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "LiquidityPoolByReserveAcc",
      data
    );
    return promise.then((data) =>
      QueryLiquidityPoolResponse.decode(new Reader(data))
    );
  }

  LiquidityPoolBatch(
    request: QueryLiquidityPoolBatchRequest
  ): Promise<QueryLiquidityPoolBatchResponse> {
    const data = QueryLiquidityPoolBatchRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "LiquidityPoolBatch",
      data
    );
    return promise.then((data) =>
      QueryLiquidityPoolBatchResponse.decode(new Reader(data))
    );
  }

  PoolBatchSwapMsgs(
    request: QueryPoolBatchSwapMsgsRequest
  ): Promise<QueryPoolBatchSwapMsgsResponse> {
    const data = QueryPoolBatchSwapMsgsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "PoolBatchSwapMsgs",
      data
    );
    return promise.then((data) =>
      QueryPoolBatchSwapMsgsResponse.decode(new Reader(data))
    );
  }

  PoolBatchSwapMsg(
    request: QueryPoolBatchSwapMsgRequest
  ): Promise<QueryPoolBatchSwapMsgResponse> {
    const data = QueryPoolBatchSwapMsgRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "PoolBatchSwapMsg",
      data
    );
    return promise.then((data) =>
      QueryPoolBatchSwapMsgResponse.decode(new Reader(data))
    );
  }

  PoolBatchDepositMsgs(
    request: QueryPoolBatchDepositMsgsRequest
  ): Promise<QueryPoolBatchDepositMsgsResponse> {
    const data = QueryPoolBatchDepositMsgsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "PoolBatchDepositMsgs",
      data
    );
    return promise.then((data) =>
      QueryPoolBatchDepositMsgsResponse.decode(new Reader(data))
    );
  }

  PoolBatchDepositMsg(
    request: QueryPoolBatchDepositMsgRequest
  ): Promise<QueryPoolBatchDepositMsgResponse> {
    const data = QueryPoolBatchDepositMsgRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "PoolBatchDepositMsg",
      data
    );
    return promise.then((data) =>
      QueryPoolBatchDepositMsgResponse.decode(new Reader(data))
    );
  }

  PoolBatchWithdrawMsgs(
    request: QueryPoolBatchWithdrawMsgsRequest
  ): Promise<QueryPoolBatchWithdrawMsgsResponse> {
    const data = QueryPoolBatchWithdrawMsgsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "PoolBatchWithdrawMsgs",
      data
    );
    return promise.then((data) =>
      QueryPoolBatchWithdrawMsgsResponse.decode(new Reader(data))
    );
  }

  PoolBatchWithdrawMsg(
    request: QueryPoolBatchWithdrawMsgRequest
  ): Promise<QueryPoolBatchWithdrawMsgResponse> {
    const data = QueryPoolBatchWithdrawMsgRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "PoolBatchWithdrawMsg",
      data
    );
    return promise.then((data) =>
      QueryPoolBatchWithdrawMsgResponse.decode(new Reader(data))
    );
  }

  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Query",
      "Params",
      data
    );
    return promise.then((data) => QueryParamsResponse.decode(new Reader(data)));
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}
