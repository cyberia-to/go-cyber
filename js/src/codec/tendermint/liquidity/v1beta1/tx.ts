/* eslint-disable */
import { Reader, util, configure, Writer } from "protobufjs/minimal";
import * as Long from "long";
import { Coin } from "../../../cosmos/base/v1beta1/coin";

export const protobufPackage = "tendermint.liquidity.v1beta1";

/**
 * MsgCreatePool defines an sdk.Msg type that supports submitting a create liquidity pool tx.
 *
 * See: https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgCreatePool {
  poolCreatorAddress: string;
  /** id of the target pool type, must match the value in the pool. Only pool-type-id 1 is supported. */
  poolTypeId: number;
  /** reserve coin pair of the pool to deposit. */
  depositCoins: Coin[];
}

/** MsgCreatePoolResponse defines the Msg/CreatePool response type. */
export interface MsgCreatePoolResponse {}

/**
 * `MsgDepositWithinBatch defines` an `sdk.Msg` type that supports submitting
 * a deposit request to the batch of the liquidity pool.
 * Deposit is submitted to the batch of the Liquidity pool with the specified
 * `pool_id`, `deposit_coins` for reserve.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other requests.
 *
 * See: https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgDepositWithinBatch {
  depositorAddress: string;
  /** id of the target pool */
  poolId: number;
  /** reserve coin pair of the pool to deposit */
  depositCoins: Coin[];
}

/** MsgDepositWithinBatchResponse defines the Msg/DepositWithinBatch response type. */
export interface MsgDepositWithinBatchResponse {}

/**
 * `MsgWithdrawWithinBatch` defines an `sdk.Msg` type that supports submitting
 * a withdraw request to the batch of the liquidity pool.
 * Withdraw is submitted to the batch from the Liquidity pool with the
 * specified `pool_id`, `pool_coin` of the pool.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other requests.
 *
 * See: https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgWithdrawWithinBatch {
  withdrawerAddress: string;
  /** id of the target pool */
  poolId: number;
  poolCoin: Coin | undefined;
}

/** MsgWithdrawWithinBatchResponse defines the Msg/WithdrawWithinBatch response type. */
export interface MsgWithdrawWithinBatchResponse {}

/**
 * `MsgSwapWithinBatch` defines an sdk.Msg type that supports submitting a swap offer request to the batch of the liquidity pool.
 * Submit swap offer to the liquidity pool batch with the specified the `pool_id`, `swap_type_id`,
 * `demand_coin_denom` with the coin and the price you're offering
 * and `offer_coin_fee` must be half of offer coin amount * current `params.swap_fee_rate` and ceil for reservation to pay fees.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other requests.
 * You must request the same fields as the pool.
 * Only the default `swap_type_id` 1 is supported.
 *
 * See: https://github.com/gravity-devs/liquidity/tree/develop/doc
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgSwapWithinBatch {
  /** address of swap requester */
  swapRequesterAddress: string;
  /** id of swap type, must match the value in the pool. Only `swap_type_id` 1 is supported. */
  poolId: number;
  /** id of swap type. Must match the value in the pool. */
  swapTypeId: number;
  /** offer sdk.coin for the swap request, must match the denom in the pool. */
  offerCoin: Coin | undefined;
  /** denom of demand coin to be exchanged on the swap request, must match the denom in the pool. */
  demandCoinDenom: string;
  /** half of offer coin amount * params.swap_fee_rate and ceil for reservation to pay fees. */
  offerCoinFee: Coin | undefined;
  /**
   * limit order price for the order, the price is the exchange ratio of X/Y
   * where X is the amount of the first coin and Y is the amount
   * of the second coin when their denoms are sorted alphabetically.
   */
  orderPrice: string;
}

/** MsgSwapWithinBatchResponse defines the Msg/Swap response type. */
export interface MsgSwapWithinBatchResponse {}

const baseMsgCreatePool: object = { poolCreatorAddress: "", poolTypeId: 0 };

export const MsgCreatePool = {
  encode(message: MsgCreatePool, writer: Writer = Writer.create()): Writer {
    if (message.poolCreatorAddress !== "") {
      writer.uint32(10).string(message.poolCreatorAddress);
    }
    if (message.poolTypeId !== 0) {
      writer.uint32(16).uint32(message.poolTypeId);
    }
    for (const v of message.depositCoins) {
      Coin.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreatePool {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreatePool } as MsgCreatePool;
    message.depositCoins = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolCreatorAddress = reader.string();
          break;
        case 2:
          message.poolTypeId = reader.uint32();
          break;
        case 4:
          message.depositCoins.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreatePool {
    const message = { ...baseMsgCreatePool } as MsgCreatePool;
    message.depositCoins = [];
    if (
      object.poolCreatorAddress !== undefined &&
      object.poolCreatorAddress !== null
    ) {
      message.poolCreatorAddress = String(object.poolCreatorAddress);
    } else {
      message.poolCreatorAddress = "";
    }
    if (object.poolTypeId !== undefined && object.poolTypeId !== null) {
      message.poolTypeId = Number(object.poolTypeId);
    } else {
      message.poolTypeId = 0;
    }
    if (object.depositCoins !== undefined && object.depositCoins !== null) {
      for (const e of object.depositCoins) {
        message.depositCoins.push(Coin.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: MsgCreatePool): unknown {
    const obj: any = {};
    message.poolCreatorAddress !== undefined &&
      (obj.poolCreatorAddress = message.poolCreatorAddress);
    message.poolTypeId !== undefined && (obj.poolTypeId = message.poolTypeId);
    if (message.depositCoins) {
      obj.depositCoins = message.depositCoins.map((e) =>
        e ? Coin.toJSON(e) : undefined
      );
    } else {
      obj.depositCoins = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreatePool>): MsgCreatePool {
    const message = { ...baseMsgCreatePool } as MsgCreatePool;
    message.depositCoins = [];
    if (
      object.poolCreatorAddress !== undefined &&
      object.poolCreatorAddress !== null
    ) {
      message.poolCreatorAddress = object.poolCreatorAddress;
    } else {
      message.poolCreatorAddress = "";
    }
    if (object.poolTypeId !== undefined && object.poolTypeId !== null) {
      message.poolTypeId = object.poolTypeId;
    } else {
      message.poolTypeId = 0;
    }
    if (object.depositCoins !== undefined && object.depositCoins !== null) {
      for (const e of object.depositCoins) {
        message.depositCoins.push(Coin.fromPartial(e));
      }
    }
    return message;
  },
};

const baseMsgCreatePoolResponse: object = {};

export const MsgCreatePoolResponse = {
  encode(_: MsgCreatePoolResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgCreatePoolResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreatePoolResponse } as MsgCreatePoolResponse;
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

  fromJSON(_: any): MsgCreatePoolResponse {
    const message = { ...baseMsgCreatePoolResponse } as MsgCreatePoolResponse;
    return message;
  },

  toJSON(_: MsgCreatePoolResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgCreatePoolResponse>): MsgCreatePoolResponse {
    const message = { ...baseMsgCreatePoolResponse } as MsgCreatePoolResponse;
    return message;
  },
};

const baseMsgDepositWithinBatch: object = { depositorAddress: "", poolId: 0 };

export const MsgDepositWithinBatch = {
  encode(
    message: MsgDepositWithinBatch,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.depositorAddress !== "") {
      writer.uint32(10).string(message.depositorAddress);
    }
    if (message.poolId !== 0) {
      writer.uint32(16).uint64(message.poolId);
    }
    for (const v of message.depositCoins) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgDepositWithinBatch {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgDepositWithinBatch } as MsgDepositWithinBatch;
    message.depositCoins = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.depositorAddress = reader.string();
          break;
        case 2:
          message.poolId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.depositCoins.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDepositWithinBatch {
    const message = { ...baseMsgDepositWithinBatch } as MsgDepositWithinBatch;
    message.depositCoins = [];
    if (
      object.depositorAddress !== undefined &&
      object.depositorAddress !== null
    ) {
      message.depositorAddress = String(object.depositorAddress);
    } else {
      message.depositorAddress = "";
    }
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    if (object.depositCoins !== undefined && object.depositCoins !== null) {
      for (const e of object.depositCoins) {
        message.depositCoins.push(Coin.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: MsgDepositWithinBatch): unknown {
    const obj: any = {};
    message.depositorAddress !== undefined &&
      (obj.depositorAddress = message.depositorAddress);
    message.poolId !== undefined && (obj.poolId = message.poolId);
    if (message.depositCoins) {
      obj.depositCoins = message.depositCoins.map((e) =>
        e ? Coin.toJSON(e) : undefined
      );
    } else {
      obj.depositCoins = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgDepositWithinBatch>
  ): MsgDepositWithinBatch {
    const message = { ...baseMsgDepositWithinBatch } as MsgDepositWithinBatch;
    message.depositCoins = [];
    if (
      object.depositorAddress !== undefined &&
      object.depositorAddress !== null
    ) {
      message.depositorAddress = object.depositorAddress;
    } else {
      message.depositorAddress = "";
    }
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    if (object.depositCoins !== undefined && object.depositCoins !== null) {
      for (const e of object.depositCoins) {
        message.depositCoins.push(Coin.fromPartial(e));
      }
    }
    return message;
  },
};

const baseMsgDepositWithinBatchResponse: object = {};

export const MsgDepositWithinBatchResponse = {
  encode(
    _: MsgDepositWithinBatchResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgDepositWithinBatchResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgDepositWithinBatchResponse,
    } as MsgDepositWithinBatchResponse;
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

  fromJSON(_: any): MsgDepositWithinBatchResponse {
    const message = {
      ...baseMsgDepositWithinBatchResponse,
    } as MsgDepositWithinBatchResponse;
    return message;
  },

  toJSON(_: MsgDepositWithinBatchResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgDepositWithinBatchResponse>
  ): MsgDepositWithinBatchResponse {
    const message = {
      ...baseMsgDepositWithinBatchResponse,
    } as MsgDepositWithinBatchResponse;
    return message;
  },
};

const baseMsgWithdrawWithinBatch: object = { withdrawerAddress: "", poolId: 0 };

export const MsgWithdrawWithinBatch = {
  encode(
    message: MsgWithdrawWithinBatch,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.withdrawerAddress !== "") {
      writer.uint32(10).string(message.withdrawerAddress);
    }
    if (message.poolId !== 0) {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.poolCoin !== undefined) {
      Coin.encode(message.poolCoin, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgWithdrawWithinBatch {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgWithdrawWithinBatch } as MsgWithdrawWithinBatch;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawerAddress = reader.string();
          break;
        case 2:
          message.poolId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.poolCoin = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgWithdrawWithinBatch {
    const message = { ...baseMsgWithdrawWithinBatch } as MsgWithdrawWithinBatch;
    if (
      object.withdrawerAddress !== undefined &&
      object.withdrawerAddress !== null
    ) {
      message.withdrawerAddress = String(object.withdrawerAddress);
    } else {
      message.withdrawerAddress = "";
    }
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    if (object.poolCoin !== undefined && object.poolCoin !== null) {
      message.poolCoin = Coin.fromJSON(object.poolCoin);
    } else {
      message.poolCoin = undefined;
    }
    return message;
  },

  toJSON(message: MsgWithdrawWithinBatch): unknown {
    const obj: any = {};
    message.withdrawerAddress !== undefined &&
      (obj.withdrawerAddress = message.withdrawerAddress);
    message.poolId !== undefined && (obj.poolId = message.poolId);
    message.poolCoin !== undefined &&
      (obj.poolCoin = message.poolCoin
        ? Coin.toJSON(message.poolCoin)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgWithdrawWithinBatch>
  ): MsgWithdrawWithinBatch {
    const message = { ...baseMsgWithdrawWithinBatch } as MsgWithdrawWithinBatch;
    if (
      object.withdrawerAddress !== undefined &&
      object.withdrawerAddress !== null
    ) {
      message.withdrawerAddress = object.withdrawerAddress;
    } else {
      message.withdrawerAddress = "";
    }
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    if (object.poolCoin !== undefined && object.poolCoin !== null) {
      message.poolCoin = Coin.fromPartial(object.poolCoin);
    } else {
      message.poolCoin = undefined;
    }
    return message;
  },
};

const baseMsgWithdrawWithinBatchResponse: object = {};

export const MsgWithdrawWithinBatchResponse = {
  encode(
    _: MsgWithdrawWithinBatchResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgWithdrawWithinBatchResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgWithdrawWithinBatchResponse,
    } as MsgWithdrawWithinBatchResponse;
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

  fromJSON(_: any): MsgWithdrawWithinBatchResponse {
    const message = {
      ...baseMsgWithdrawWithinBatchResponse,
    } as MsgWithdrawWithinBatchResponse;
    return message;
  },

  toJSON(_: MsgWithdrawWithinBatchResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgWithdrawWithinBatchResponse>
  ): MsgWithdrawWithinBatchResponse {
    const message = {
      ...baseMsgWithdrawWithinBatchResponse,
    } as MsgWithdrawWithinBatchResponse;
    return message;
  },
};

const baseMsgSwapWithinBatch: object = {
  swapRequesterAddress: "",
  poolId: 0,
  swapTypeId: 0,
  demandCoinDenom: "",
  orderPrice: "",
};

export const MsgSwapWithinBatch = {
  encode(
    message: MsgSwapWithinBatch,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.swapRequesterAddress !== "") {
      writer.uint32(10).string(message.swapRequesterAddress);
    }
    if (message.poolId !== 0) {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.swapTypeId !== 0) {
      writer.uint32(24).uint32(message.swapTypeId);
    }
    if (message.offerCoin !== undefined) {
      Coin.encode(message.offerCoin, writer.uint32(34).fork()).ldelim();
    }
    if (message.demandCoinDenom !== "") {
      writer.uint32(42).string(message.demandCoinDenom);
    }
    if (message.offerCoinFee !== undefined) {
      Coin.encode(message.offerCoinFee, writer.uint32(50).fork()).ldelim();
    }
    if (message.orderPrice !== "") {
      writer.uint32(58).string(message.orderPrice);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MsgSwapWithinBatch {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgSwapWithinBatch } as MsgSwapWithinBatch;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.swapRequesterAddress = reader.string();
          break;
        case 2:
          message.poolId = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.swapTypeId = reader.uint32();
          break;
        case 4:
          message.offerCoin = Coin.decode(reader, reader.uint32());
          break;
        case 5:
          message.demandCoinDenom = reader.string();
          break;
        case 6:
          message.offerCoinFee = Coin.decode(reader, reader.uint32());
          break;
        case 7:
          message.orderPrice = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSwapWithinBatch {
    const message = { ...baseMsgSwapWithinBatch } as MsgSwapWithinBatch;
    if (
      object.swapRequesterAddress !== undefined &&
      object.swapRequesterAddress !== null
    ) {
      message.swapRequesterAddress = String(object.swapRequesterAddress);
    } else {
      message.swapRequesterAddress = "";
    }
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = Number(object.poolId);
    } else {
      message.poolId = 0;
    }
    if (object.swapTypeId !== undefined && object.swapTypeId !== null) {
      message.swapTypeId = Number(object.swapTypeId);
    } else {
      message.swapTypeId = 0;
    }
    if (object.offerCoin !== undefined && object.offerCoin !== null) {
      message.offerCoin = Coin.fromJSON(object.offerCoin);
    } else {
      message.offerCoin = undefined;
    }
    if (
      object.demandCoinDenom !== undefined &&
      object.demandCoinDenom !== null
    ) {
      message.demandCoinDenom = String(object.demandCoinDenom);
    } else {
      message.demandCoinDenom = "";
    }
    if (object.offerCoinFee !== undefined && object.offerCoinFee !== null) {
      message.offerCoinFee = Coin.fromJSON(object.offerCoinFee);
    } else {
      message.offerCoinFee = undefined;
    }
    if (object.orderPrice !== undefined && object.orderPrice !== null) {
      message.orderPrice = String(object.orderPrice);
    } else {
      message.orderPrice = "";
    }
    return message;
  },

  toJSON(message: MsgSwapWithinBatch): unknown {
    const obj: any = {};
    message.swapRequesterAddress !== undefined &&
      (obj.swapRequesterAddress = message.swapRequesterAddress);
    message.poolId !== undefined && (obj.poolId = message.poolId);
    message.swapTypeId !== undefined && (obj.swapTypeId = message.swapTypeId);
    message.offerCoin !== undefined &&
      (obj.offerCoin = message.offerCoin
        ? Coin.toJSON(message.offerCoin)
        : undefined);
    message.demandCoinDenom !== undefined &&
      (obj.demandCoinDenom = message.demandCoinDenom);
    message.offerCoinFee !== undefined &&
      (obj.offerCoinFee = message.offerCoinFee
        ? Coin.toJSON(message.offerCoinFee)
        : undefined);
    message.orderPrice !== undefined && (obj.orderPrice = message.orderPrice);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgSwapWithinBatch>): MsgSwapWithinBatch {
    const message = { ...baseMsgSwapWithinBatch } as MsgSwapWithinBatch;
    if (
      object.swapRequesterAddress !== undefined &&
      object.swapRequesterAddress !== null
    ) {
      message.swapRequesterAddress = object.swapRequesterAddress;
    } else {
      message.swapRequesterAddress = "";
    }
    if (object.poolId !== undefined && object.poolId !== null) {
      message.poolId = object.poolId;
    } else {
      message.poolId = 0;
    }
    if (object.swapTypeId !== undefined && object.swapTypeId !== null) {
      message.swapTypeId = object.swapTypeId;
    } else {
      message.swapTypeId = 0;
    }
    if (object.offerCoin !== undefined && object.offerCoin !== null) {
      message.offerCoin = Coin.fromPartial(object.offerCoin);
    } else {
      message.offerCoin = undefined;
    }
    if (
      object.demandCoinDenom !== undefined &&
      object.demandCoinDenom !== null
    ) {
      message.demandCoinDenom = object.demandCoinDenom;
    } else {
      message.demandCoinDenom = "";
    }
    if (object.offerCoinFee !== undefined && object.offerCoinFee !== null) {
      message.offerCoinFee = Coin.fromPartial(object.offerCoinFee);
    } else {
      message.offerCoinFee = undefined;
    }
    if (object.orderPrice !== undefined && object.orderPrice !== null) {
      message.orderPrice = object.orderPrice;
    } else {
      message.orderPrice = "";
    }
    return message;
  },
};

const baseMsgSwapWithinBatchResponse: object = {};

export const MsgSwapWithinBatchResponse = {
  encode(
    _: MsgSwapWithinBatchResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MsgSwapWithinBatchResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgSwapWithinBatchResponse,
    } as MsgSwapWithinBatchResponse;
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

  fromJSON(_: any): MsgSwapWithinBatchResponse {
    const message = {
      ...baseMsgSwapWithinBatchResponse,
    } as MsgSwapWithinBatchResponse;
    return message;
  },

  toJSON(_: MsgSwapWithinBatchResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<MsgSwapWithinBatchResponse>
  ): MsgSwapWithinBatchResponse {
    const message = {
      ...baseMsgSwapWithinBatchResponse,
    } as MsgSwapWithinBatchResponse;
    return message;
  },
};

/** Msg defines the liquidity Msg service. */
export interface Msg {
  /** Submit a create liquidity pool message. */
  CreatePool(request: MsgCreatePool): Promise<MsgCreatePoolResponse>;
  /** Submit a deposit to the liquidity pool batch. */
  DepositWithinBatch(
    request: MsgDepositWithinBatch
  ): Promise<MsgDepositWithinBatchResponse>;
  /** Submit a withdraw from the liquidity pool batch. */
  WithdrawWithinBatch(
    request: MsgWithdrawWithinBatch
  ): Promise<MsgWithdrawWithinBatchResponse>;
  /** Submit a swap to the liquidity pool batch. */
  Swap(request: MsgSwapWithinBatch): Promise<MsgSwapWithinBatchResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }
  CreatePool(request: MsgCreatePool): Promise<MsgCreatePoolResponse> {
    const data = MsgCreatePool.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Msg",
      "CreatePool",
      data
    );
    return promise.then((data) =>
      MsgCreatePoolResponse.decode(new Reader(data))
    );
  }

  DepositWithinBatch(
    request: MsgDepositWithinBatch
  ): Promise<MsgDepositWithinBatchResponse> {
    const data = MsgDepositWithinBatch.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Msg",
      "DepositWithinBatch",
      data
    );
    return promise.then((data) =>
      MsgDepositWithinBatchResponse.decode(new Reader(data))
    );
  }

  WithdrawWithinBatch(
    request: MsgWithdrawWithinBatch
  ): Promise<MsgWithdrawWithinBatchResponse> {
    const data = MsgWithdrawWithinBatch.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Msg",
      "WithdrawWithinBatch",
      data
    );
    return promise.then((data) =>
      MsgWithdrawWithinBatchResponse.decode(new Reader(data))
    );
  }

  Swap(request: MsgSwapWithinBatch): Promise<MsgSwapWithinBatchResponse> {
    const data = MsgSwapWithinBatch.encode(request).finish();
    const promise = this.rpc.request(
      "tendermint.liquidity.v1beta1.Msg",
      "Swap",
      data
    );
    return promise.then((data) =>
      MsgSwapWithinBatchResponse.decode(new Reader(data))
    );
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
