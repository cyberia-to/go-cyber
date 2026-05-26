//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
import { Decimal } from "@cosmjs/math";
/**
 * MsgCreatePool defines an sdk.Msg type that supports submitting a create
 * liquidity pool tx.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgCreatePool {
  poolCreatorAddress: string;
  /**
   * id of the target pool type, must match the value in the pool. Only
   * pool-type-id 1 is supported.
   */
  poolTypeId: number;
  /** reserve coin pair of the pool to deposit. */
  depositCoins: Coin[];
}
export interface MsgCreatePoolProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool";
  value: Uint8Array;
}
/**
 * MsgCreatePool defines an sdk.Msg type that supports submitting a create
 * liquidity pool tx.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgCreatePoolAmino {
  pool_creator_address?: string;
  /**
   * id of the target pool type, must match the value in the pool. Only
   * pool-type-id 1 is supported.
   */
  pool_type_id?: number;
  /** reserve coin pair of the pool to deposit. */
  deposit_coins?: CoinAmino[];
}
export interface MsgCreatePoolAminoMsg {
  type: "/cyber.liquidity.v1beta1.MsgCreatePool";
  value: MsgCreatePoolAmino;
}
/**
 * MsgCreatePool defines an sdk.Msg type that supports submitting a create
 * liquidity pool tx.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgCreatePoolSDKType {
  pool_creator_address: string;
  pool_type_id: number;
  deposit_coins: CoinSDKType[];
}
/** MsgCreatePoolResponse defines the Msg/CreatePool response type. */
export interface MsgCreatePoolResponse {}
export interface MsgCreatePoolResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePoolResponse";
  value: Uint8Array;
}
/** MsgCreatePoolResponse defines the Msg/CreatePool response type. */
export interface MsgCreatePoolResponseAmino {}
export interface MsgCreatePoolResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.MsgCreatePoolResponse";
  value: MsgCreatePoolResponseAmino;
}
/** MsgCreatePoolResponse defines the Msg/CreatePool response type. */
export interface MsgCreatePoolResponseSDKType {}
/**
 * `MsgDepositWithinBatch defines` an `sdk.Msg` type that supports submitting
 * a deposit request to the batch of the liquidity pool.
 * Deposit is submitted to the batch of the Liquidity pool with the specified
 * `pool_id`, `deposit_coins` for reserve.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other
 * requests.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgDepositWithinBatch {
  depositorAddress: string;
  /** id of the target pool */
  poolId: bigint;
  /** reserve coin pair of the pool to deposit */
  depositCoins: Coin[];
}
export interface MsgDepositWithinBatchProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch";
  value: Uint8Array;
}
/**
 * `MsgDepositWithinBatch defines` an `sdk.Msg` type that supports submitting
 * a deposit request to the batch of the liquidity pool.
 * Deposit is submitted to the batch of the Liquidity pool with the specified
 * `pool_id`, `deposit_coins` for reserve.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other
 * requests.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgDepositWithinBatchAmino {
  depositor_address?: string;
  /** id of the target pool */
  pool_id?: string;
  /** reserve coin pair of the pool to deposit */
  deposit_coins?: CoinAmino[];
}
export interface MsgDepositWithinBatchAminoMsg {
  type: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch";
  value: MsgDepositWithinBatchAmino;
}
/**
 * `MsgDepositWithinBatch defines` an `sdk.Msg` type that supports submitting
 * a deposit request to the batch of the liquidity pool.
 * Deposit is submitted to the batch of the Liquidity pool with the specified
 * `pool_id`, `deposit_coins` for reserve.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other
 * requests.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgDepositWithinBatchSDKType {
  depositor_address: string;
  pool_id: bigint;
  deposit_coins: CoinSDKType[];
}
/**
 * MsgDepositWithinBatchResponse defines the Msg/DepositWithinBatch response
 * type.
 */
export interface MsgDepositWithinBatchResponse {}
export interface MsgDepositWithinBatchResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatchResponse";
  value: Uint8Array;
}
/**
 * MsgDepositWithinBatchResponse defines the Msg/DepositWithinBatch response
 * type.
 */
export interface MsgDepositWithinBatchResponseAmino {}
export interface MsgDepositWithinBatchResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.MsgDepositWithinBatchResponse";
  value: MsgDepositWithinBatchResponseAmino;
}
/**
 * MsgDepositWithinBatchResponse defines the Msg/DepositWithinBatch response
 * type.
 */
export interface MsgDepositWithinBatchResponseSDKType {}
/**
 * `MsgWithdrawWithinBatch` defines an `sdk.Msg` type that supports submitting
 * a withdraw request to the batch of the liquidity pool.
 * Withdraw is submitted to the batch from the Liquidity pool with the
 * specified `pool_id`, `pool_coin` of the pool.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other
 * requests.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgWithdrawWithinBatch {
  withdrawerAddress: string;
  /** id of the target pool */
  poolId: bigint;
  poolCoin: Coin;
}
export interface MsgWithdrawWithinBatchProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch";
  value: Uint8Array;
}
/**
 * `MsgWithdrawWithinBatch` defines an `sdk.Msg` type that supports submitting
 * a withdraw request to the batch of the liquidity pool.
 * Withdraw is submitted to the batch from the Liquidity pool with the
 * specified `pool_id`, `pool_coin` of the pool.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other
 * requests.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgWithdrawWithinBatchAmino {
  withdrawer_address?: string;
  /** id of the target pool */
  pool_id?: string;
  pool_coin?: CoinAmino;
}
export interface MsgWithdrawWithinBatchAminoMsg {
  type: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch";
  value: MsgWithdrawWithinBatchAmino;
}
/**
 * `MsgWithdrawWithinBatch` defines an `sdk.Msg` type that supports submitting
 * a withdraw request to the batch of the liquidity pool.
 * Withdraw is submitted to the batch from the Liquidity pool with the
 * specified `pool_id`, `pool_coin` of the pool.
 * This request is stacked in the batch of the liquidity pool, is not processed
 * immediately, and is processed in the `endblock` at the same time as other
 * requests.
 * 
 * See:
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgWithdrawWithinBatchSDKType {
  withdrawer_address: string;
  pool_id: bigint;
  pool_coin: CoinSDKType;
}
/**
 * MsgWithdrawWithinBatchResponse defines the Msg/WithdrawWithinBatch response
 * type.
 */
export interface MsgWithdrawWithinBatchResponse {}
export interface MsgWithdrawWithinBatchResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatchResponse";
  value: Uint8Array;
}
/**
 * MsgWithdrawWithinBatchResponse defines the Msg/WithdrawWithinBatch response
 * type.
 */
export interface MsgWithdrawWithinBatchResponseAmino {}
export interface MsgWithdrawWithinBatchResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatchResponse";
  value: MsgWithdrawWithinBatchResponseAmino;
}
/**
 * MsgWithdrawWithinBatchResponse defines the Msg/WithdrawWithinBatch response
 * type.
 */
export interface MsgWithdrawWithinBatchResponseSDKType {}
/**
 * `MsgSwapWithinBatch` defines an sdk.Msg type that supports submitting a swap
 * offer request to the batch of the liquidity pool. Submit swap offer to the
 * liquidity pool batch with the specified the `pool_id`, `swap_type_id`,
 * `demand_coin_denom` with the coin and the price you're offering
 * and `offer_coin_fee` must be half of offer coin amount * current
 * `params.swap_fee_rate` and ceil for reservation to pay fees. This request is
 * stacked in the batch of the liquidity pool, is not processed immediately, and
 * is processed in the `endblock` at the same time as other requests. You must
 * request the same fields as the pool. Only the default `swap_type_id` 1 is
 * supported.
 * 
 * See: https://github.com/gravity-devs/liquidity/tree/develop/doc
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgSwapWithinBatch {
  /** address of swap requester */
  swapRequesterAddress: string;
  /**
   * id of swap type, must match the value in the pool. Only `swap_type_id` 1 is
   * supported.
   */
  poolId: bigint;
  /** id of swap type. Must match the value in the pool. */
  swapTypeId: number;
  /** offer sdk.coin for the swap request, must match the denom in the pool. */
  offerCoin: Coin;
  /**
   * denom of demand coin to be exchanged on the swap request, must match the
   * denom in the pool.
   */
  demandCoinDenom: string;
  /**
   * half of offer coin amount * params.swap_fee_rate and ceil for reservation
   * to pay fees.
   */
  offerCoinFee: Coin;
  /**
   * limit order price for the order, the price is the exchange ratio of X/Y
   * where X is the amount of the first coin and Y is the amount
   * of the second coin when their denoms are sorted alphabetically.
   */
  orderPrice: string;
}
export interface MsgSwapWithinBatchProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch";
  value: Uint8Array;
}
/**
 * `MsgSwapWithinBatch` defines an sdk.Msg type that supports submitting a swap
 * offer request to the batch of the liquidity pool. Submit swap offer to the
 * liquidity pool batch with the specified the `pool_id`, `swap_type_id`,
 * `demand_coin_denom` with the coin and the price you're offering
 * and `offer_coin_fee` must be half of offer coin amount * current
 * `params.swap_fee_rate` and ceil for reservation to pay fees. This request is
 * stacked in the batch of the liquidity pool, is not processed immediately, and
 * is processed in the `endblock` at the same time as other requests. You must
 * request the same fields as the pool. Only the default `swap_type_id` 1 is
 * supported.
 * 
 * See: https://github.com/gravity-devs/liquidity/tree/develop/doc
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgSwapWithinBatchAmino {
  /** address of swap requester */
  swap_requester_address?: string;
  /**
   * id of swap type, must match the value in the pool. Only `swap_type_id` 1 is
   * supported.
   */
  pool_id?: string;
  /** id of swap type. Must match the value in the pool. */
  swap_type_id?: number;
  /** offer sdk.coin for the swap request, must match the denom in the pool. */
  offer_coin?: CoinAmino;
  /**
   * denom of demand coin to be exchanged on the swap request, must match the
   * denom in the pool.
   */
  demand_coin_denom?: string;
  /**
   * half of offer coin amount * params.swap_fee_rate and ceil for reservation
   * to pay fees.
   */
  offer_coin_fee?: CoinAmino;
  /**
   * limit order price for the order, the price is the exchange ratio of X/Y
   * where X is the amount of the first coin and Y is the amount
   * of the second coin when their denoms are sorted alphabetically.
   */
  order_price?: string;
}
export interface MsgSwapWithinBatchAminoMsg {
  type: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch";
  value: MsgSwapWithinBatchAmino;
}
/**
 * `MsgSwapWithinBatch` defines an sdk.Msg type that supports submitting a swap
 * offer request to the batch of the liquidity pool. Submit swap offer to the
 * liquidity pool batch with the specified the `pool_id`, `swap_type_id`,
 * `demand_coin_denom` with the coin and the price you're offering
 * and `offer_coin_fee` must be half of offer coin amount * current
 * `params.swap_fee_rate` and ceil for reservation to pay fees. This request is
 * stacked in the batch of the liquidity pool, is not processed immediately, and
 * is processed in the `endblock` at the same time as other requests. You must
 * request the same fields as the pool. Only the default `swap_type_id` 1 is
 * supported.
 * 
 * See: https://github.com/gravity-devs/liquidity/tree/develop/doc
 * https://github.com/gravity-devs/liquidity/blob/develop/x/liquidity/spec/04_messages.md
 */
export interface MsgSwapWithinBatchSDKType {
  swap_requester_address: string;
  pool_id: bigint;
  swap_type_id: number;
  offer_coin: CoinSDKType;
  demand_coin_denom: string;
  offer_coin_fee: CoinSDKType;
  order_price: string;
}
/** MsgSwapWithinBatchResponse defines the Msg/Swap response type. */
export interface MsgSwapWithinBatchResponse {}
export interface MsgSwapWithinBatchResponseProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatchResponse";
  value: Uint8Array;
}
/** MsgSwapWithinBatchResponse defines the Msg/Swap response type. */
export interface MsgSwapWithinBatchResponseAmino {}
export interface MsgSwapWithinBatchResponseAminoMsg {
  type: "/cyber.liquidity.v1beta1.MsgSwapWithinBatchResponse";
  value: MsgSwapWithinBatchResponseAmino;
}
/** MsgSwapWithinBatchResponse defines the Msg/Swap response type. */
export interface MsgSwapWithinBatchResponseSDKType {}
function createBaseMsgCreatePool(): MsgCreatePool {
  return {
    poolCreatorAddress: "",
    poolTypeId: 0,
    depositCoins: []
  };
}
export const MsgCreatePool = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool",
  is(o: any): o is MsgCreatePool {
    return o && (o.$typeUrl === MsgCreatePool.typeUrl || typeof o.poolCreatorAddress === "string" && typeof o.poolTypeId === "number" && Array.isArray(o.depositCoins) && (!o.depositCoins.length || Coin.is(o.depositCoins[0])));
  },
  isSDK(o: any): o is MsgCreatePoolSDKType {
    return o && (o.$typeUrl === MsgCreatePool.typeUrl || typeof o.pool_creator_address === "string" && typeof o.pool_type_id === "number" && Array.isArray(o.deposit_coins) && (!o.deposit_coins.length || Coin.isSDK(o.deposit_coins[0])));
  },
  isAmino(o: any): o is MsgCreatePoolAmino {
    return o && (o.$typeUrl === MsgCreatePool.typeUrl || typeof o.pool_creator_address === "string" && typeof o.pool_type_id === "number" && Array.isArray(o.deposit_coins) && (!o.deposit_coins.length || Coin.isAmino(o.deposit_coins[0])));
  },
  encode(message: MsgCreatePool, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
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
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreatePool {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreatePool();
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
    return {
      poolCreatorAddress: isSet(object.poolCreatorAddress) ? String(object.poolCreatorAddress) : "",
      poolTypeId: isSet(object.poolTypeId) ? Number(object.poolTypeId) : 0,
      depositCoins: Array.isArray(object?.depositCoins) ? object.depositCoins.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: MsgCreatePool): JsonSafe<MsgCreatePool> {
    const obj: any = {};
    message.poolCreatorAddress !== undefined && (obj.poolCreatorAddress = message.poolCreatorAddress);
    message.poolTypeId !== undefined && (obj.poolTypeId = Math.round(message.poolTypeId));
    if (message.depositCoins) {
      obj.depositCoins = message.depositCoins.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.depositCoins = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgCreatePool>): MsgCreatePool {
    const message = createBaseMsgCreatePool();
    message.poolCreatorAddress = object.poolCreatorAddress ?? "";
    message.poolTypeId = object.poolTypeId ?? 0;
    message.depositCoins = object.depositCoins?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: MsgCreatePoolAmino): MsgCreatePool {
    const message = createBaseMsgCreatePool();
    if (object.pool_creator_address !== undefined && object.pool_creator_address !== null) {
      message.poolCreatorAddress = object.pool_creator_address;
    }
    if (object.pool_type_id !== undefined && object.pool_type_id !== null) {
      message.poolTypeId = object.pool_type_id;
    }
    message.depositCoins = object.deposit_coins?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: MsgCreatePool): MsgCreatePoolAmino {
    const obj: any = {};
    obj.pool_creator_address = message.poolCreatorAddress === "" ? undefined : message.poolCreatorAddress;
    obj.pool_type_id = message.poolTypeId === 0 ? undefined : message.poolTypeId;
    if (message.depositCoins) {
      obj.deposit_coins = message.depositCoins.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.deposit_coins = message.depositCoins;
    }
    return obj;
  },
  fromAminoMsg(object: MsgCreatePoolAminoMsg): MsgCreatePool {
    return MsgCreatePool.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgCreatePoolProtoMsg): MsgCreatePool {
    return MsgCreatePool.decode(message.value);
  },
  toProto(message: MsgCreatePool): Uint8Array {
    return MsgCreatePool.encode(message).finish();
  },
  toProtoMsg(message: MsgCreatePool): MsgCreatePoolProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePool",
      value: MsgCreatePool.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgCreatePool.typeUrl, MsgCreatePool);
function createBaseMsgCreatePoolResponse(): MsgCreatePoolResponse {
  return {};
}
export const MsgCreatePoolResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePoolResponse",
  is(o: any): o is MsgCreatePoolResponse {
    return o && o.$typeUrl === MsgCreatePoolResponse.typeUrl;
  },
  isSDK(o: any): o is MsgCreatePoolResponseSDKType {
    return o && o.$typeUrl === MsgCreatePoolResponse.typeUrl;
  },
  isAmino(o: any): o is MsgCreatePoolResponseAmino {
    return o && o.$typeUrl === MsgCreatePoolResponse.typeUrl;
  },
  encode(_: MsgCreatePoolResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreatePoolResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreatePoolResponse();
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
    return {};
  },
  toJSON(_: MsgCreatePoolResponse): JsonSafe<MsgCreatePoolResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgCreatePoolResponse>): MsgCreatePoolResponse {
    const message = createBaseMsgCreatePoolResponse();
    return message;
  },
  fromAmino(_: MsgCreatePoolResponseAmino): MsgCreatePoolResponse {
    const message = createBaseMsgCreatePoolResponse();
    return message;
  },
  toAmino(_: MsgCreatePoolResponse): MsgCreatePoolResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgCreatePoolResponseAminoMsg): MsgCreatePoolResponse {
    return MsgCreatePoolResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgCreatePoolResponseProtoMsg): MsgCreatePoolResponse {
    return MsgCreatePoolResponse.decode(message.value);
  },
  toProto(message: MsgCreatePoolResponse): Uint8Array {
    return MsgCreatePoolResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgCreatePoolResponse): MsgCreatePoolResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgCreatePoolResponse",
      value: MsgCreatePoolResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgCreatePoolResponse.typeUrl, MsgCreatePoolResponse);
function createBaseMsgDepositWithinBatch(): MsgDepositWithinBatch {
  return {
    depositorAddress: "",
    poolId: BigInt(0),
    depositCoins: []
  };
}
export const MsgDepositWithinBatch = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
  is(o: any): o is MsgDepositWithinBatch {
    return o && (o.$typeUrl === MsgDepositWithinBatch.typeUrl || typeof o.depositorAddress === "string" && typeof o.poolId === "bigint" && Array.isArray(o.depositCoins) && (!o.depositCoins.length || Coin.is(o.depositCoins[0])));
  },
  isSDK(o: any): o is MsgDepositWithinBatchSDKType {
    return o && (o.$typeUrl === MsgDepositWithinBatch.typeUrl || typeof o.depositor_address === "string" && typeof o.pool_id === "bigint" && Array.isArray(o.deposit_coins) && (!o.deposit_coins.length || Coin.isSDK(o.deposit_coins[0])));
  },
  isAmino(o: any): o is MsgDepositWithinBatchAmino {
    return o && (o.$typeUrl === MsgDepositWithinBatch.typeUrl || typeof o.depositor_address === "string" && typeof o.pool_id === "bigint" && Array.isArray(o.deposit_coins) && (!o.deposit_coins.length || Coin.isAmino(o.deposit_coins[0])));
  },
  encode(message: MsgDepositWithinBatch, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.depositorAddress !== "") {
      writer.uint32(10).string(message.depositorAddress);
    }
    if (message.poolId !== BigInt(0)) {
      writer.uint32(16).uint64(message.poolId);
    }
    for (const v of message.depositCoins) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDepositWithinBatch {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDepositWithinBatch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.depositorAddress = reader.string();
          break;
        case 2:
          message.poolId = reader.uint64();
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
    return {
      depositorAddress: isSet(object.depositorAddress) ? String(object.depositorAddress) : "",
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      depositCoins: Array.isArray(object?.depositCoins) ? object.depositCoins.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: MsgDepositWithinBatch): JsonSafe<MsgDepositWithinBatch> {
    const obj: any = {};
    message.depositorAddress !== undefined && (obj.depositorAddress = message.depositorAddress);
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    if (message.depositCoins) {
      obj.depositCoins = message.depositCoins.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.depositCoins = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgDepositWithinBatch>): MsgDepositWithinBatch {
    const message = createBaseMsgDepositWithinBatch();
    message.depositorAddress = object.depositorAddress ?? "";
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.depositCoins = object.depositCoins?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: MsgDepositWithinBatchAmino): MsgDepositWithinBatch {
    const message = createBaseMsgDepositWithinBatch();
    if (object.depositor_address !== undefined && object.depositor_address !== null) {
      message.depositorAddress = object.depositor_address;
    }
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    message.depositCoins = object.deposit_coins?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: MsgDepositWithinBatch): MsgDepositWithinBatchAmino {
    const obj: any = {};
    obj.depositor_address = message.depositorAddress === "" ? undefined : message.depositorAddress;
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    if (message.depositCoins) {
      obj.deposit_coins = message.depositCoins.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.deposit_coins = message.depositCoins;
    }
    return obj;
  },
  fromAminoMsg(object: MsgDepositWithinBatchAminoMsg): MsgDepositWithinBatch {
    return MsgDepositWithinBatch.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgDepositWithinBatchProtoMsg): MsgDepositWithinBatch {
    return MsgDepositWithinBatch.decode(message.value);
  },
  toProto(message: MsgDepositWithinBatch): Uint8Array {
    return MsgDepositWithinBatch.encode(message).finish();
  },
  toProtoMsg(message: MsgDepositWithinBatch): MsgDepositWithinBatchProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatch",
      value: MsgDepositWithinBatch.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgDepositWithinBatch.typeUrl, MsgDepositWithinBatch);
function createBaseMsgDepositWithinBatchResponse(): MsgDepositWithinBatchResponse {
  return {};
}
export const MsgDepositWithinBatchResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatchResponse",
  is(o: any): o is MsgDepositWithinBatchResponse {
    return o && o.$typeUrl === MsgDepositWithinBatchResponse.typeUrl;
  },
  isSDK(o: any): o is MsgDepositWithinBatchResponseSDKType {
    return o && o.$typeUrl === MsgDepositWithinBatchResponse.typeUrl;
  },
  isAmino(o: any): o is MsgDepositWithinBatchResponseAmino {
    return o && o.$typeUrl === MsgDepositWithinBatchResponse.typeUrl;
  },
  encode(_: MsgDepositWithinBatchResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDepositWithinBatchResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDepositWithinBatchResponse();
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
    return {};
  },
  toJSON(_: MsgDepositWithinBatchResponse): JsonSafe<MsgDepositWithinBatchResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgDepositWithinBatchResponse>): MsgDepositWithinBatchResponse {
    const message = createBaseMsgDepositWithinBatchResponse();
    return message;
  },
  fromAmino(_: MsgDepositWithinBatchResponseAmino): MsgDepositWithinBatchResponse {
    const message = createBaseMsgDepositWithinBatchResponse();
    return message;
  },
  toAmino(_: MsgDepositWithinBatchResponse): MsgDepositWithinBatchResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgDepositWithinBatchResponseAminoMsg): MsgDepositWithinBatchResponse {
    return MsgDepositWithinBatchResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgDepositWithinBatchResponseProtoMsg): MsgDepositWithinBatchResponse {
    return MsgDepositWithinBatchResponse.decode(message.value);
  },
  toProto(message: MsgDepositWithinBatchResponse): Uint8Array {
    return MsgDepositWithinBatchResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgDepositWithinBatchResponse): MsgDepositWithinBatchResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgDepositWithinBatchResponse",
      value: MsgDepositWithinBatchResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgDepositWithinBatchResponse.typeUrl, MsgDepositWithinBatchResponse);
function createBaseMsgWithdrawWithinBatch(): MsgWithdrawWithinBatch {
  return {
    withdrawerAddress: "",
    poolId: BigInt(0),
    poolCoin: Coin.fromPartial({})
  };
}
export const MsgWithdrawWithinBatch = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
  is(o: any): o is MsgWithdrawWithinBatch {
    return o && (o.$typeUrl === MsgWithdrawWithinBatch.typeUrl || typeof o.withdrawerAddress === "string" && typeof o.poolId === "bigint" && Coin.is(o.poolCoin));
  },
  isSDK(o: any): o is MsgWithdrawWithinBatchSDKType {
    return o && (o.$typeUrl === MsgWithdrawWithinBatch.typeUrl || typeof o.withdrawer_address === "string" && typeof o.pool_id === "bigint" && Coin.isSDK(o.pool_coin));
  },
  isAmino(o: any): o is MsgWithdrawWithinBatchAmino {
    return o && (o.$typeUrl === MsgWithdrawWithinBatch.typeUrl || typeof o.withdrawer_address === "string" && typeof o.pool_id === "bigint" && Coin.isAmino(o.pool_coin));
  },
  encode(message: MsgWithdrawWithinBatch, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.withdrawerAddress !== "") {
      writer.uint32(10).string(message.withdrawerAddress);
    }
    if (message.poolId !== BigInt(0)) {
      writer.uint32(16).uint64(message.poolId);
    }
    if (message.poolCoin !== undefined) {
      Coin.encode(message.poolCoin, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgWithdrawWithinBatch {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgWithdrawWithinBatch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withdrawerAddress = reader.string();
          break;
        case 2:
          message.poolId = reader.uint64();
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
    return {
      withdrawerAddress: isSet(object.withdrawerAddress) ? String(object.withdrawerAddress) : "",
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      poolCoin: isSet(object.poolCoin) ? Coin.fromJSON(object.poolCoin) : undefined
    };
  },
  toJSON(message: MsgWithdrawWithinBatch): JsonSafe<MsgWithdrawWithinBatch> {
    const obj: any = {};
    message.withdrawerAddress !== undefined && (obj.withdrawerAddress = message.withdrawerAddress);
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.poolCoin !== undefined && (obj.poolCoin = message.poolCoin ? Coin.toJSON(message.poolCoin) : undefined);
    return obj;
  },
  fromPartial(object: Partial<MsgWithdrawWithinBatch>): MsgWithdrawWithinBatch {
    const message = createBaseMsgWithdrawWithinBatch();
    message.withdrawerAddress = object.withdrawerAddress ?? "";
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.poolCoin = object.poolCoin !== undefined && object.poolCoin !== null ? Coin.fromPartial(object.poolCoin) : undefined;
    return message;
  },
  fromAmino(object: MsgWithdrawWithinBatchAmino): MsgWithdrawWithinBatch {
    const message = createBaseMsgWithdrawWithinBatch();
    if (object.withdrawer_address !== undefined && object.withdrawer_address !== null) {
      message.withdrawerAddress = object.withdrawer_address;
    }
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    if (object.pool_coin !== undefined && object.pool_coin !== null) {
      message.poolCoin = Coin.fromAmino(object.pool_coin);
    }
    return message;
  },
  toAmino(message: MsgWithdrawWithinBatch): MsgWithdrawWithinBatchAmino {
    const obj: any = {};
    obj.withdrawer_address = message.withdrawerAddress === "" ? undefined : message.withdrawerAddress;
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    obj.pool_coin = message.poolCoin ? Coin.toAmino(message.poolCoin) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgWithdrawWithinBatchAminoMsg): MsgWithdrawWithinBatch {
    return MsgWithdrawWithinBatch.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgWithdrawWithinBatchProtoMsg): MsgWithdrawWithinBatch {
    return MsgWithdrawWithinBatch.decode(message.value);
  },
  toProto(message: MsgWithdrawWithinBatch): Uint8Array {
    return MsgWithdrawWithinBatch.encode(message).finish();
  },
  toProtoMsg(message: MsgWithdrawWithinBatch): MsgWithdrawWithinBatchProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatch",
      value: MsgWithdrawWithinBatch.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgWithdrawWithinBatch.typeUrl, MsgWithdrawWithinBatch);
function createBaseMsgWithdrawWithinBatchResponse(): MsgWithdrawWithinBatchResponse {
  return {};
}
export const MsgWithdrawWithinBatchResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatchResponse",
  is(o: any): o is MsgWithdrawWithinBatchResponse {
    return o && o.$typeUrl === MsgWithdrawWithinBatchResponse.typeUrl;
  },
  isSDK(o: any): o is MsgWithdrawWithinBatchResponseSDKType {
    return o && o.$typeUrl === MsgWithdrawWithinBatchResponse.typeUrl;
  },
  isAmino(o: any): o is MsgWithdrawWithinBatchResponseAmino {
    return o && o.$typeUrl === MsgWithdrawWithinBatchResponse.typeUrl;
  },
  encode(_: MsgWithdrawWithinBatchResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgWithdrawWithinBatchResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgWithdrawWithinBatchResponse();
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
    return {};
  },
  toJSON(_: MsgWithdrawWithinBatchResponse): JsonSafe<MsgWithdrawWithinBatchResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgWithdrawWithinBatchResponse>): MsgWithdrawWithinBatchResponse {
    const message = createBaseMsgWithdrawWithinBatchResponse();
    return message;
  },
  fromAmino(_: MsgWithdrawWithinBatchResponseAmino): MsgWithdrawWithinBatchResponse {
    const message = createBaseMsgWithdrawWithinBatchResponse();
    return message;
  },
  toAmino(_: MsgWithdrawWithinBatchResponse): MsgWithdrawWithinBatchResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgWithdrawWithinBatchResponseAminoMsg): MsgWithdrawWithinBatchResponse {
    return MsgWithdrawWithinBatchResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgWithdrawWithinBatchResponseProtoMsg): MsgWithdrawWithinBatchResponse {
    return MsgWithdrawWithinBatchResponse.decode(message.value);
  },
  toProto(message: MsgWithdrawWithinBatchResponse): Uint8Array {
    return MsgWithdrawWithinBatchResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgWithdrawWithinBatchResponse): MsgWithdrawWithinBatchResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgWithdrawWithinBatchResponse",
      value: MsgWithdrawWithinBatchResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgWithdrawWithinBatchResponse.typeUrl, MsgWithdrawWithinBatchResponse);
function createBaseMsgSwapWithinBatch(): MsgSwapWithinBatch {
  return {
    swapRequesterAddress: "",
    poolId: BigInt(0),
    swapTypeId: 0,
    offerCoin: Coin.fromPartial({}),
    demandCoinDenom: "",
    offerCoinFee: Coin.fromPartial({}),
    orderPrice: ""
  };
}
export const MsgSwapWithinBatch = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
  is(o: any): o is MsgSwapWithinBatch {
    return o && (o.$typeUrl === MsgSwapWithinBatch.typeUrl || typeof o.swapRequesterAddress === "string" && typeof o.poolId === "bigint" && typeof o.swapTypeId === "number" && Coin.is(o.offerCoin) && typeof o.demandCoinDenom === "string" && Coin.is(o.offerCoinFee) && typeof o.orderPrice === "string");
  },
  isSDK(o: any): o is MsgSwapWithinBatchSDKType {
    return o && (o.$typeUrl === MsgSwapWithinBatch.typeUrl || typeof o.swap_requester_address === "string" && typeof o.pool_id === "bigint" && typeof o.swap_type_id === "number" && Coin.isSDK(o.offer_coin) && typeof o.demand_coin_denom === "string" && Coin.isSDK(o.offer_coin_fee) && typeof o.order_price === "string");
  },
  isAmino(o: any): o is MsgSwapWithinBatchAmino {
    return o && (o.$typeUrl === MsgSwapWithinBatch.typeUrl || typeof o.swap_requester_address === "string" && typeof o.pool_id === "bigint" && typeof o.swap_type_id === "number" && Coin.isAmino(o.offer_coin) && typeof o.demand_coin_denom === "string" && Coin.isAmino(o.offer_coin_fee) && typeof o.order_price === "string");
  },
  encode(message: MsgSwapWithinBatch, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.swapRequesterAddress !== "") {
      writer.uint32(10).string(message.swapRequesterAddress);
    }
    if (message.poolId !== BigInt(0)) {
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
      writer.uint32(58).string(Decimal.fromUserInput(message.orderPrice, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapWithinBatch {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapWithinBatch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.swapRequesterAddress = reader.string();
          break;
        case 2:
          message.poolId = reader.uint64();
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
          message.orderPrice = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgSwapWithinBatch {
    return {
      swapRequesterAddress: isSet(object.swapRequesterAddress) ? String(object.swapRequesterAddress) : "",
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      swapTypeId: isSet(object.swapTypeId) ? Number(object.swapTypeId) : 0,
      offerCoin: isSet(object.offerCoin) ? Coin.fromJSON(object.offerCoin) : undefined,
      demandCoinDenom: isSet(object.demandCoinDenom) ? String(object.demandCoinDenom) : "",
      offerCoinFee: isSet(object.offerCoinFee) ? Coin.fromJSON(object.offerCoinFee) : undefined,
      orderPrice: isSet(object.orderPrice) ? String(object.orderPrice) : ""
    };
  },
  toJSON(message: MsgSwapWithinBatch): JsonSafe<MsgSwapWithinBatch> {
    const obj: any = {};
    message.swapRequesterAddress !== undefined && (obj.swapRequesterAddress = message.swapRequesterAddress);
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.swapTypeId !== undefined && (obj.swapTypeId = Math.round(message.swapTypeId));
    message.offerCoin !== undefined && (obj.offerCoin = message.offerCoin ? Coin.toJSON(message.offerCoin) : undefined);
    message.demandCoinDenom !== undefined && (obj.demandCoinDenom = message.demandCoinDenom);
    message.offerCoinFee !== undefined && (obj.offerCoinFee = message.offerCoinFee ? Coin.toJSON(message.offerCoinFee) : undefined);
    message.orderPrice !== undefined && (obj.orderPrice = message.orderPrice);
    return obj;
  },
  fromPartial(object: Partial<MsgSwapWithinBatch>): MsgSwapWithinBatch {
    const message = createBaseMsgSwapWithinBatch();
    message.swapRequesterAddress = object.swapRequesterAddress ?? "";
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.swapTypeId = object.swapTypeId ?? 0;
    message.offerCoin = object.offerCoin !== undefined && object.offerCoin !== null ? Coin.fromPartial(object.offerCoin) : undefined;
    message.demandCoinDenom = object.demandCoinDenom ?? "";
    message.offerCoinFee = object.offerCoinFee !== undefined && object.offerCoinFee !== null ? Coin.fromPartial(object.offerCoinFee) : undefined;
    message.orderPrice = object.orderPrice ?? "";
    return message;
  },
  fromAmino(object: MsgSwapWithinBatchAmino): MsgSwapWithinBatch {
    const message = createBaseMsgSwapWithinBatch();
    if (object.swap_requester_address !== undefined && object.swap_requester_address !== null) {
      message.swapRequesterAddress = object.swap_requester_address;
    }
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    if (object.swap_type_id !== undefined && object.swap_type_id !== null) {
      message.swapTypeId = object.swap_type_id;
    }
    if (object.offer_coin !== undefined && object.offer_coin !== null) {
      message.offerCoin = Coin.fromAmino(object.offer_coin);
    }
    if (object.demand_coin_denom !== undefined && object.demand_coin_denom !== null) {
      message.demandCoinDenom = object.demand_coin_denom;
    }
    if (object.offer_coin_fee !== undefined && object.offer_coin_fee !== null) {
      message.offerCoinFee = Coin.fromAmino(object.offer_coin_fee);
    }
    if (object.order_price !== undefined && object.order_price !== null) {
      message.orderPrice = object.order_price;
    }
    return message;
  },
  toAmino(message: MsgSwapWithinBatch): MsgSwapWithinBatchAmino {
    const obj: any = {};
    obj.swap_requester_address = message.swapRequesterAddress === "" ? undefined : message.swapRequesterAddress;
    obj.pool_id = message.poolId !== BigInt(0) ? message.poolId.toString() : undefined;
    obj.swap_type_id = message.swapTypeId === 0 ? undefined : message.swapTypeId;
    obj.offer_coin = message.offerCoin ? Coin.toAmino(message.offerCoin) : undefined;
    obj.demand_coin_denom = message.demandCoinDenom === "" ? undefined : message.demandCoinDenom;
    obj.offer_coin_fee = message.offerCoinFee ? Coin.toAmino(message.offerCoinFee) : undefined;
    obj.order_price = message.orderPrice === "" ? undefined : message.orderPrice;
    return obj;
  },
  fromAminoMsg(object: MsgSwapWithinBatchAminoMsg): MsgSwapWithinBatch {
    return MsgSwapWithinBatch.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSwapWithinBatchProtoMsg): MsgSwapWithinBatch {
    return MsgSwapWithinBatch.decode(message.value);
  },
  toProto(message: MsgSwapWithinBatch): Uint8Array {
    return MsgSwapWithinBatch.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapWithinBatch): MsgSwapWithinBatchProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatch",
      value: MsgSwapWithinBatch.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgSwapWithinBatch.typeUrl, MsgSwapWithinBatch);
function createBaseMsgSwapWithinBatchResponse(): MsgSwapWithinBatchResponse {
  return {};
}
export const MsgSwapWithinBatchResponse = {
  typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatchResponse",
  is(o: any): o is MsgSwapWithinBatchResponse {
    return o && o.$typeUrl === MsgSwapWithinBatchResponse.typeUrl;
  },
  isSDK(o: any): o is MsgSwapWithinBatchResponseSDKType {
    return o && o.$typeUrl === MsgSwapWithinBatchResponse.typeUrl;
  },
  isAmino(o: any): o is MsgSwapWithinBatchResponseAmino {
    return o && o.$typeUrl === MsgSwapWithinBatchResponse.typeUrl;
  },
  encode(_: MsgSwapWithinBatchResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSwapWithinBatchResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSwapWithinBatchResponse();
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
    return {};
  },
  toJSON(_: MsgSwapWithinBatchResponse): JsonSafe<MsgSwapWithinBatchResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgSwapWithinBatchResponse>): MsgSwapWithinBatchResponse {
    const message = createBaseMsgSwapWithinBatchResponse();
    return message;
  },
  fromAmino(_: MsgSwapWithinBatchResponseAmino): MsgSwapWithinBatchResponse {
    const message = createBaseMsgSwapWithinBatchResponse();
    return message;
  },
  toAmino(_: MsgSwapWithinBatchResponse): MsgSwapWithinBatchResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgSwapWithinBatchResponseAminoMsg): MsgSwapWithinBatchResponse {
    return MsgSwapWithinBatchResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgSwapWithinBatchResponseProtoMsg): MsgSwapWithinBatchResponse {
    return MsgSwapWithinBatchResponse.decode(message.value);
  },
  toProto(message: MsgSwapWithinBatchResponse): Uint8Array {
    return MsgSwapWithinBatchResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSwapWithinBatchResponse): MsgSwapWithinBatchResponseProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.MsgSwapWithinBatchResponse",
      value: MsgSwapWithinBatchResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgSwapWithinBatchResponse.typeUrl, MsgSwapWithinBatchResponse);