//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { MsgDepositWithinBatch, MsgDepositWithinBatchAmino, MsgDepositWithinBatchSDKType, MsgWithdrawWithinBatch, MsgWithdrawWithinBatchAmino, MsgWithdrawWithinBatchSDKType, MsgSwapWithinBatch, MsgSwapWithinBatchAmino, MsgSwapWithinBatchSDKType } from "./tx";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
import { Decimal } from "@cosmjs/math";
/**
 * Structure for the pool type to distinguish the characteristics of the reserve
 * pools.
 */
export interface PoolType {
  /**
   * This is the id of the pool_type that is used as pool_type_id for pool
   * creation. In this version, only pool-type-id 1 is supported.
   * {"id":1,"name":"ConstantProductLiquidityPool","min_reserve_coin_num":2,"max_reserve_coin_num":2,"description":""}
   */
  id: number;
  /** name of the pool type. */
  name: string;
  /**
   * minimum number of reserveCoins for LiquidityPoolType, only 2 reserve coins
   * are supported.
   */
  minReserveCoinNum: number;
  /**
   * maximum number of reserveCoins for LiquidityPoolType, only 2 reserve coins
   * are supported.
   */
  maxReserveCoinNum: number;
  /** description of the pool type. */
  description: string;
}
export interface PoolTypeProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.PoolType";
  value: Uint8Array;
}
/**
 * Structure for the pool type to distinguish the characteristics of the reserve
 * pools.
 */
export interface PoolTypeAmino {
  /**
   * This is the id of the pool_type that is used as pool_type_id for pool
   * creation. In this version, only pool-type-id 1 is supported.
   * {"id":1,"name":"ConstantProductLiquidityPool","min_reserve_coin_num":2,"max_reserve_coin_num":2,"description":""}
   */
  id?: number;
  /** name of the pool type. */
  name?: string;
  /**
   * minimum number of reserveCoins for LiquidityPoolType, only 2 reserve coins
   * are supported.
   */
  min_reserve_coin_num?: number;
  /**
   * maximum number of reserveCoins for LiquidityPoolType, only 2 reserve coins
   * are supported.
   */
  max_reserve_coin_num?: number;
  /** description of the pool type. */
  description?: string;
}
export interface PoolTypeAminoMsg {
  type: "/cyber.liquidity.v1beta1.PoolType";
  value: PoolTypeAmino;
}
/**
 * Structure for the pool type to distinguish the characteristics of the reserve
 * pools.
 */
export interface PoolTypeSDKType {
  id: number;
  name: string;
  min_reserve_coin_num: number;
  max_reserve_coin_num: number;
  description: string;
}
/** Params defines the parameters for the liquidity module. */
export interface Params {
  /** list of available pool types */
  poolTypes: PoolType[];
  /**
   * Minimum number of coins to be deposited to the liquidity pool on pool
   * creation.
   */
  minInitDepositAmount: string;
  /** Initial mint amount of pool coins upon pool creation. */
  initPoolCoinMintAmount: string;
  /**
   * Limit the size of each liquidity pool to minimize risk. In development, set
   * to 0 for no limit. In production, set a limit.
   */
  maxReserveCoinAmount: string;
  /** Fee paid to create a Liquidity Pool. Set a fee to prevent spamming. */
  poolCreationFee: Coin[];
  /** Swap fee rate for every executed swap. */
  swapFeeRate: string;
  /** Reserve coin withdrawal with less proportion by withdrawFeeRate. */
  withdrawFeeRate: string;
  /** Maximum ratio of reserve coins that can be ordered at a swap order. */
  maxOrderAmountRatio: string;
  /** The smallest unit batch height for every liquidity pool. */
  unitBatchHeight: number;
  /**
   * Circuit breaker enables or disables transaction messages in liquidity
   * module.
   */
  circuitBreakerEnabled: boolean;
}
export interface ParamsProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.Params";
  value: Uint8Array;
}
/** Params defines the parameters for the liquidity module. */
export interface ParamsAmino {
  /** list of available pool types */
  pool_types?: PoolTypeAmino[];
  /**
   * Minimum number of coins to be deposited to the liquidity pool on pool
   * creation.
   */
  min_init_deposit_amount?: string;
  /** Initial mint amount of pool coins upon pool creation. */
  init_pool_coin_mint_amount?: string;
  /**
   * Limit the size of each liquidity pool to minimize risk. In development, set
   * to 0 for no limit. In production, set a limit.
   */
  max_reserve_coin_amount?: string;
  /** Fee paid to create a Liquidity Pool. Set a fee to prevent spamming. */
  pool_creation_fee?: CoinAmino[];
  /** Swap fee rate for every executed swap. */
  swap_fee_rate?: string;
  /** Reserve coin withdrawal with less proportion by withdrawFeeRate. */
  withdraw_fee_rate?: string;
  /** Maximum ratio of reserve coins that can be ordered at a swap order. */
  max_order_amount_ratio?: string;
  /** The smallest unit batch height for every liquidity pool. */
  unit_batch_height?: number;
  /**
   * Circuit breaker enables or disables transaction messages in liquidity
   * module.
   */
  circuit_breaker_enabled?: boolean;
}
export interface ParamsAminoMsg {
  type: "/cyber.liquidity.v1beta1.Params";
  value: ParamsAmino;
}
/** Params defines the parameters for the liquidity module. */
export interface ParamsSDKType {
  pool_types: PoolTypeSDKType[];
  min_init_deposit_amount: string;
  init_pool_coin_mint_amount: string;
  max_reserve_coin_amount: string;
  pool_creation_fee: CoinSDKType[];
  swap_fee_rate: string;
  withdraw_fee_rate: string;
  max_order_amount_ratio: string;
  unit_batch_height: number;
  circuit_breaker_enabled: boolean;
}
/** Pool defines the liquidity pool that contains pool information. */
export interface Pool {
  /** id of the pool */
  id: bigint;
  /** id of the pool_type */
  typeId: number;
  /** denoms of reserve coin pair of the pool */
  reserveCoinDenoms: string[];
  /** reserve account address of the pool */
  reserveAccountAddress: string;
  /** denom of pool coin of the pool */
  poolCoinDenom: string;
}
export interface PoolProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.Pool";
  value: Uint8Array;
}
/** Pool defines the liquidity pool that contains pool information. */
export interface PoolAmino {
  /** id of the pool */
  id: string;
  /** id of the pool_type */
  type_id?: number;
  /** denoms of reserve coin pair of the pool */
  reserve_coin_denoms?: string[];
  /** reserve account address of the pool */
  reserve_account_address?: string;
  /** denom of pool coin of the pool */
  pool_coin_denom?: string;
}
export interface PoolAminoMsg {
  type: "/cyber.liquidity.v1beta1.Pool";
  value: PoolAmino;
}
/** Pool defines the liquidity pool that contains pool information. */
export interface PoolSDKType {
  id: bigint;
  type_id: number;
  reserve_coin_denoms: string[];
  reserve_account_address: string;
  pool_coin_denom: string;
}
/**
 * Metadata for the state of each pool for invariant checking after genesis
 * export or import.
 */
export interface PoolMetadata {
  /** id of the pool */
  poolId: bigint;
  /** pool coin issued at the pool */
  poolCoinTotalSupply: Coin;
  /** reserve coins deposited in the pool */
  reserveCoins: Coin[];
}
export interface PoolMetadataProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.PoolMetadata";
  value: Uint8Array;
}
/**
 * Metadata for the state of each pool for invariant checking after genesis
 * export or import.
 */
export interface PoolMetadataAmino {
  /** id of the pool */
  pool_id: string;
  /** pool coin issued at the pool */
  pool_coin_total_supply?: CoinAmino;
  /** reserve coins deposited in the pool */
  reserve_coins?: CoinAmino[];
}
export interface PoolMetadataAminoMsg {
  type: "/cyber.liquidity.v1beta1.PoolMetadata";
  value: PoolMetadataAmino;
}
/**
 * Metadata for the state of each pool for invariant checking after genesis
 * export or import.
 */
export interface PoolMetadataSDKType {
  pool_id: bigint;
  pool_coin_total_supply: CoinSDKType;
  reserve_coins: CoinSDKType[];
}
/**
 * PoolBatch defines the batch or batches of a given liquidity pool that
 * contains indexes of deposit, withdraw, and swap messages. Index param
 * increments by 1 if the pool id is same.
 */
export interface PoolBatch {
  /** id of the pool */
  poolId: bigint;
  /** index of this batch */
  index: bigint;
  /** height where this batch is started */
  beginHeight: bigint;
  /** last index of DepositMsgStates */
  depositMsgIndex: bigint;
  /** last index of WithdrawMsgStates */
  withdrawMsgIndex: bigint;
  /** last index of SwapMsgStates */
  swapMsgIndex: bigint;
  /** true if executed, false if not executed */
  executed: boolean;
}
export interface PoolBatchProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.PoolBatch";
  value: Uint8Array;
}
/**
 * PoolBatch defines the batch or batches of a given liquidity pool that
 * contains indexes of deposit, withdraw, and swap messages. Index param
 * increments by 1 if the pool id is same.
 */
export interface PoolBatchAmino {
  /** id of the pool */
  pool_id: string;
  /** index of this batch */
  index?: string;
  /** height where this batch is started */
  begin_height?: string;
  /** last index of DepositMsgStates */
  deposit_msg_index?: string;
  /** last index of WithdrawMsgStates */
  withdraw_msg_index?: string;
  /** last index of SwapMsgStates */
  swap_msg_index?: string;
  /** true if executed, false if not executed */
  executed?: boolean;
}
export interface PoolBatchAminoMsg {
  type: "/cyber.liquidity.v1beta1.PoolBatch";
  value: PoolBatchAmino;
}
/**
 * PoolBatch defines the batch or batches of a given liquidity pool that
 * contains indexes of deposit, withdraw, and swap messages. Index param
 * increments by 1 if the pool id is same.
 */
export interface PoolBatchSDKType {
  pool_id: bigint;
  index: bigint;
  begin_height: bigint;
  deposit_msg_index: bigint;
  withdraw_msg_index: bigint;
  swap_msg_index: bigint;
  executed: boolean;
}
/**
 * DepositMsgState defines the state of deposit message that contains state
 * information as it is processed in the next batch or batches.
 */
export interface DepositMsgState {
  /** height where this message is appended to the batch */
  msgHeight: bigint;
  /** index of this deposit message in this liquidity pool */
  msgIndex: bigint;
  /** true if executed on this batch, false if not executed */
  executed: boolean;
  /** true if executed successfully on this batch, false if failed */
  succeeded: boolean;
  /** true if ready to be deleted on kvstore, false if not ready to be deleted */
  toBeDeleted: boolean;
  /** MsgDepositWithinBatch */
  msg?: MsgDepositWithinBatch;
}
export interface DepositMsgStateProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.DepositMsgState";
  value: Uint8Array;
}
/**
 * DepositMsgState defines the state of deposit message that contains state
 * information as it is processed in the next batch or batches.
 */
export interface DepositMsgStateAmino {
  /** height where this message is appended to the batch */
  msg_height?: string;
  /** index of this deposit message in this liquidity pool */
  msg_index?: string;
  /** true if executed on this batch, false if not executed */
  executed?: boolean;
  /** true if executed successfully on this batch, false if failed */
  succeeded?: boolean;
  /** true if ready to be deleted on kvstore, false if not ready to be deleted */
  to_be_deleted?: boolean;
  /** MsgDepositWithinBatch */
  msg?: MsgDepositWithinBatchAmino;
}
export interface DepositMsgStateAminoMsg {
  type: "/cyber.liquidity.v1beta1.DepositMsgState";
  value: DepositMsgStateAmino;
}
/**
 * DepositMsgState defines the state of deposit message that contains state
 * information as it is processed in the next batch or batches.
 */
export interface DepositMsgStateSDKType {
  msg_height: bigint;
  msg_index: bigint;
  executed: boolean;
  succeeded: boolean;
  to_be_deleted: boolean;
  msg?: MsgDepositWithinBatchSDKType;
}
/**
 * WithdrawMsgState defines the state of the withdraw message that contains
 * state information as the message is processed in the next batch or batches.
 */
export interface WithdrawMsgState {
  /** height where this message is appended to the batch */
  msgHeight: bigint;
  /** index of this withdraw message in this liquidity pool */
  msgIndex: bigint;
  /** true if executed on this batch, false if not executed */
  executed: boolean;
  /** true if executed successfully on this batch, false if failed */
  succeeded: boolean;
  /** true if ready to be deleted on kvstore, false if not ready to be deleted */
  toBeDeleted: boolean;
  /** MsgWithdrawWithinBatch */
  msg?: MsgWithdrawWithinBatch;
}
export interface WithdrawMsgStateProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.WithdrawMsgState";
  value: Uint8Array;
}
/**
 * WithdrawMsgState defines the state of the withdraw message that contains
 * state information as the message is processed in the next batch or batches.
 */
export interface WithdrawMsgStateAmino {
  /** height where this message is appended to the batch */
  msg_height?: string;
  /** index of this withdraw message in this liquidity pool */
  msg_index?: string;
  /** true if executed on this batch, false if not executed */
  executed?: boolean;
  /** true if executed successfully on this batch, false if failed */
  succeeded?: boolean;
  /** true if ready to be deleted on kvstore, false if not ready to be deleted */
  to_be_deleted?: boolean;
  /** MsgWithdrawWithinBatch */
  msg?: MsgWithdrawWithinBatchAmino;
}
export interface WithdrawMsgStateAminoMsg {
  type: "/cyber.liquidity.v1beta1.WithdrawMsgState";
  value: WithdrawMsgStateAmino;
}
/**
 * WithdrawMsgState defines the state of the withdraw message that contains
 * state information as the message is processed in the next batch or batches.
 */
export interface WithdrawMsgStateSDKType {
  msg_height: bigint;
  msg_index: bigint;
  executed: boolean;
  succeeded: boolean;
  to_be_deleted: boolean;
  msg?: MsgWithdrawWithinBatchSDKType;
}
/**
 * SwapMsgState defines the state of the swap message that contains state
 * information as the message is processed in the next batch or batches.
 */
export interface SwapMsgState {
  /** height where this message is appended to the batch */
  msgHeight: bigint;
  /** index of this swap message in this liquidity pool */
  msgIndex: bigint;
  /** true if executed on this batch, false if not executed */
  executed: boolean;
  /** true if executed successfully on this batch, false if failed */
  succeeded: boolean;
  /** true if ready to be deleted on kvstore, false if not ready to be deleted */
  toBeDeleted: boolean;
  /**
   * swap orders are cancelled when current height is equal to or higher than
   * ExpiryHeight
   */
  orderExpiryHeight: bigint;
  /** offer coin exchanged until now */
  exchangedOfferCoin: Coin;
  /** offer coin currently remaining to be exchanged */
  remainingOfferCoin: Coin;
  /** reserve fee for pays fee in half offer coin */
  reservedOfferCoinFee: Coin;
  /** MsgSwapWithinBatch */
  msg?: MsgSwapWithinBatch;
}
export interface SwapMsgStateProtoMsg {
  typeUrl: "/cyber.liquidity.v1beta1.SwapMsgState";
  value: Uint8Array;
}
/**
 * SwapMsgState defines the state of the swap message that contains state
 * information as the message is processed in the next batch or batches.
 */
export interface SwapMsgStateAmino {
  /** height where this message is appended to the batch */
  msg_height?: string;
  /** index of this swap message in this liquidity pool */
  msg_index?: string;
  /** true if executed on this batch, false if not executed */
  executed?: boolean;
  /** true if executed successfully on this batch, false if failed */
  succeeded?: boolean;
  /** true if ready to be deleted on kvstore, false if not ready to be deleted */
  to_be_deleted?: boolean;
  /**
   * swap orders are cancelled when current height is equal to or higher than
   * ExpiryHeight
   */
  order_expiry_height?: string;
  /** offer coin exchanged until now */
  exchanged_offer_coin?: CoinAmino;
  /** offer coin currently remaining to be exchanged */
  remaining_offer_coin?: CoinAmino;
  /** reserve fee for pays fee in half offer coin */
  reserved_offer_coin_fee?: CoinAmino;
  /** MsgSwapWithinBatch */
  msg?: MsgSwapWithinBatchAmino;
}
export interface SwapMsgStateAminoMsg {
  type: "/cyber.liquidity.v1beta1.SwapMsgState";
  value: SwapMsgStateAmino;
}
/**
 * SwapMsgState defines the state of the swap message that contains state
 * information as the message is processed in the next batch or batches.
 */
export interface SwapMsgStateSDKType {
  msg_height: bigint;
  msg_index: bigint;
  executed: boolean;
  succeeded: boolean;
  to_be_deleted: boolean;
  order_expiry_height: bigint;
  exchanged_offer_coin: CoinSDKType;
  remaining_offer_coin: CoinSDKType;
  reserved_offer_coin_fee: CoinSDKType;
  msg?: MsgSwapWithinBatchSDKType;
}
function createBasePoolType(): PoolType {
  return {
    id: 0,
    name: "",
    minReserveCoinNum: 0,
    maxReserveCoinNum: 0,
    description: ""
  };
}
export const PoolType = {
  typeUrl: "/cyber.liquidity.v1beta1.PoolType",
  is(o: any): o is PoolType {
    return o && (o.$typeUrl === PoolType.typeUrl || typeof o.id === "number" && typeof o.name === "string" && typeof o.minReserveCoinNum === "number" && typeof o.maxReserveCoinNum === "number" && typeof o.description === "string");
  },
  isSDK(o: any): o is PoolTypeSDKType {
    return o && (o.$typeUrl === PoolType.typeUrl || typeof o.id === "number" && typeof o.name === "string" && typeof o.min_reserve_coin_num === "number" && typeof o.max_reserve_coin_num === "number" && typeof o.description === "string");
  },
  isAmino(o: any): o is PoolTypeAmino {
    return o && (o.$typeUrl === PoolType.typeUrl || typeof o.id === "number" && typeof o.name === "string" && typeof o.min_reserve_coin_num === "number" && typeof o.max_reserve_coin_num === "number" && typeof o.description === "string");
  },
  encode(message: PoolType, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.minReserveCoinNum !== 0) {
      writer.uint32(24).uint32(message.minReserveCoinNum);
    }
    if (message.maxReserveCoinNum !== 0) {
      writer.uint32(32).uint32(message.maxReserveCoinNum);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PoolType {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoolType();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint32();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.minReserveCoinNum = reader.uint32();
          break;
        case 4:
          message.maxReserveCoinNum = reader.uint32();
          break;
        case 5:
          message.description = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PoolType {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      name: isSet(object.name) ? String(object.name) : "",
      minReserveCoinNum: isSet(object.minReserveCoinNum) ? Number(object.minReserveCoinNum) : 0,
      maxReserveCoinNum: isSet(object.maxReserveCoinNum) ? Number(object.maxReserveCoinNum) : 0,
      description: isSet(object.description) ? String(object.description) : ""
    };
  },
  toJSON(message: PoolType): JsonSafe<PoolType> {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.name !== undefined && (obj.name = message.name);
    message.minReserveCoinNum !== undefined && (obj.minReserveCoinNum = Math.round(message.minReserveCoinNum));
    message.maxReserveCoinNum !== undefined && (obj.maxReserveCoinNum = Math.round(message.maxReserveCoinNum));
    message.description !== undefined && (obj.description = message.description);
    return obj;
  },
  fromPartial(object: Partial<PoolType>): PoolType {
    const message = createBasePoolType();
    message.id = object.id ?? 0;
    message.name = object.name ?? "";
    message.minReserveCoinNum = object.minReserveCoinNum ?? 0;
    message.maxReserveCoinNum = object.maxReserveCoinNum ?? 0;
    message.description = object.description ?? "";
    return message;
  },
  fromAmino(object: PoolTypeAmino): PoolType {
    const message = createBasePoolType();
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.min_reserve_coin_num !== undefined && object.min_reserve_coin_num !== null) {
      message.minReserveCoinNum = object.min_reserve_coin_num;
    }
    if (object.max_reserve_coin_num !== undefined && object.max_reserve_coin_num !== null) {
      message.maxReserveCoinNum = object.max_reserve_coin_num;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    return message;
  },
  toAmino(message: PoolType): PoolTypeAmino {
    const obj: any = {};
    obj.id = message.id === 0 ? undefined : message.id;
    obj.name = message.name === "" ? undefined : message.name;
    obj.min_reserve_coin_num = message.minReserveCoinNum === 0 ? undefined : message.minReserveCoinNum;
    obj.max_reserve_coin_num = message.maxReserveCoinNum === 0 ? undefined : message.maxReserveCoinNum;
    obj.description = message.description === "" ? undefined : message.description;
    return obj;
  },
  fromAminoMsg(object: PoolTypeAminoMsg): PoolType {
    return PoolType.fromAmino(object.value);
  },
  fromProtoMsg(message: PoolTypeProtoMsg): PoolType {
    return PoolType.decode(message.value);
  },
  toProto(message: PoolType): Uint8Array {
    return PoolType.encode(message).finish();
  },
  toProtoMsg(message: PoolType): PoolTypeProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.PoolType",
      value: PoolType.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(PoolType.typeUrl, PoolType);
function createBaseParams(): Params {
  return {
    poolTypes: [],
    minInitDepositAmount: "",
    initPoolCoinMintAmount: "",
    maxReserveCoinAmount: "",
    poolCreationFee: [],
    swapFeeRate: "",
    withdrawFeeRate: "",
    maxOrderAmountRatio: "",
    unitBatchHeight: 0,
    circuitBreakerEnabled: false
  };
}
export const Params = {
  typeUrl: "/cyber.liquidity.v1beta1.Params",
  is(o: any): o is Params {
    return o && (o.$typeUrl === Params.typeUrl || Array.isArray(o.poolTypes) && (!o.poolTypes.length || PoolType.is(o.poolTypes[0])) && typeof o.minInitDepositAmount === "string" && typeof o.initPoolCoinMintAmount === "string" && typeof o.maxReserveCoinAmount === "string" && Array.isArray(o.poolCreationFee) && (!o.poolCreationFee.length || Coin.is(o.poolCreationFee[0])) && typeof o.swapFeeRate === "string" && typeof o.withdrawFeeRate === "string" && typeof o.maxOrderAmountRatio === "string" && typeof o.unitBatchHeight === "number" && typeof o.circuitBreakerEnabled === "boolean");
  },
  isSDK(o: any): o is ParamsSDKType {
    return o && (o.$typeUrl === Params.typeUrl || Array.isArray(o.pool_types) && (!o.pool_types.length || PoolType.isSDK(o.pool_types[0])) && typeof o.min_init_deposit_amount === "string" && typeof o.init_pool_coin_mint_amount === "string" && typeof o.max_reserve_coin_amount === "string" && Array.isArray(o.pool_creation_fee) && (!o.pool_creation_fee.length || Coin.isSDK(o.pool_creation_fee[0])) && typeof o.swap_fee_rate === "string" && typeof o.withdraw_fee_rate === "string" && typeof o.max_order_amount_ratio === "string" && typeof o.unit_batch_height === "number" && typeof o.circuit_breaker_enabled === "boolean");
  },
  isAmino(o: any): o is ParamsAmino {
    return o && (o.$typeUrl === Params.typeUrl || Array.isArray(o.pool_types) && (!o.pool_types.length || PoolType.isAmino(o.pool_types[0])) && typeof o.min_init_deposit_amount === "string" && typeof o.init_pool_coin_mint_amount === "string" && typeof o.max_reserve_coin_amount === "string" && Array.isArray(o.pool_creation_fee) && (!o.pool_creation_fee.length || Coin.isAmino(o.pool_creation_fee[0])) && typeof o.swap_fee_rate === "string" && typeof o.withdraw_fee_rate === "string" && typeof o.max_order_amount_ratio === "string" && typeof o.unit_batch_height === "number" && typeof o.circuit_breaker_enabled === "boolean");
  },
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.poolTypes) {
      PoolType.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.minInitDepositAmount !== "") {
      writer.uint32(18).string(message.minInitDepositAmount);
    }
    if (message.initPoolCoinMintAmount !== "") {
      writer.uint32(26).string(message.initPoolCoinMintAmount);
    }
    if (message.maxReserveCoinAmount !== "") {
      writer.uint32(34).string(message.maxReserveCoinAmount);
    }
    for (const v of message.poolCreationFee) {
      Coin.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.swapFeeRate !== "") {
      writer.uint32(50).string(Decimal.fromUserInput(message.swapFeeRate, 18).atomics);
    }
    if (message.withdrawFeeRate !== "") {
      writer.uint32(58).string(Decimal.fromUserInput(message.withdrawFeeRate, 18).atomics);
    }
    if (message.maxOrderAmountRatio !== "") {
      writer.uint32(66).string(Decimal.fromUserInput(message.maxOrderAmountRatio, 18).atomics);
    }
    if (message.unitBatchHeight !== 0) {
      writer.uint32(72).uint32(message.unitBatchHeight);
    }
    if (message.circuitBreakerEnabled === true) {
      writer.uint32(80).bool(message.circuitBreakerEnabled);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Params {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolTypes.push(PoolType.decode(reader, reader.uint32()));
          break;
        case 2:
          message.minInitDepositAmount = reader.string();
          break;
        case 3:
          message.initPoolCoinMintAmount = reader.string();
          break;
        case 4:
          message.maxReserveCoinAmount = reader.string();
          break;
        case 5:
          message.poolCreationFee.push(Coin.decode(reader, reader.uint32()));
          break;
        case 6:
          message.swapFeeRate = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 7:
          message.withdrawFeeRate = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 8:
          message.maxOrderAmountRatio = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 9:
          message.unitBatchHeight = reader.uint32();
          break;
        case 10:
          message.circuitBreakerEnabled = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Params {
    return {
      poolTypes: Array.isArray(object?.poolTypes) ? object.poolTypes.map((e: any) => PoolType.fromJSON(e)) : [],
      minInitDepositAmount: isSet(object.minInitDepositAmount) ? String(object.minInitDepositAmount) : "",
      initPoolCoinMintAmount: isSet(object.initPoolCoinMintAmount) ? String(object.initPoolCoinMintAmount) : "",
      maxReserveCoinAmount: isSet(object.maxReserveCoinAmount) ? String(object.maxReserveCoinAmount) : "",
      poolCreationFee: Array.isArray(object?.poolCreationFee) ? object.poolCreationFee.map((e: any) => Coin.fromJSON(e)) : [],
      swapFeeRate: isSet(object.swapFeeRate) ? String(object.swapFeeRate) : "",
      withdrawFeeRate: isSet(object.withdrawFeeRate) ? String(object.withdrawFeeRate) : "",
      maxOrderAmountRatio: isSet(object.maxOrderAmountRatio) ? String(object.maxOrderAmountRatio) : "",
      unitBatchHeight: isSet(object.unitBatchHeight) ? Number(object.unitBatchHeight) : 0,
      circuitBreakerEnabled: isSet(object.circuitBreakerEnabled) ? Boolean(object.circuitBreakerEnabled) : false
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    if (message.poolTypes) {
      obj.poolTypes = message.poolTypes.map(e => e ? PoolType.toJSON(e) : undefined);
    } else {
      obj.poolTypes = [];
    }
    message.minInitDepositAmount !== undefined && (obj.minInitDepositAmount = message.minInitDepositAmount);
    message.initPoolCoinMintAmount !== undefined && (obj.initPoolCoinMintAmount = message.initPoolCoinMintAmount);
    message.maxReserveCoinAmount !== undefined && (obj.maxReserveCoinAmount = message.maxReserveCoinAmount);
    if (message.poolCreationFee) {
      obj.poolCreationFee = message.poolCreationFee.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.poolCreationFee = [];
    }
    message.swapFeeRate !== undefined && (obj.swapFeeRate = message.swapFeeRate);
    message.withdrawFeeRate !== undefined && (obj.withdrawFeeRate = message.withdrawFeeRate);
    message.maxOrderAmountRatio !== undefined && (obj.maxOrderAmountRatio = message.maxOrderAmountRatio);
    message.unitBatchHeight !== undefined && (obj.unitBatchHeight = Math.round(message.unitBatchHeight));
    message.circuitBreakerEnabled !== undefined && (obj.circuitBreakerEnabled = message.circuitBreakerEnabled);
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.poolTypes = object.poolTypes?.map(e => PoolType.fromPartial(e)) || [];
    message.minInitDepositAmount = object.minInitDepositAmount ?? "";
    message.initPoolCoinMintAmount = object.initPoolCoinMintAmount ?? "";
    message.maxReserveCoinAmount = object.maxReserveCoinAmount ?? "";
    message.poolCreationFee = object.poolCreationFee?.map(e => Coin.fromPartial(e)) || [];
    message.swapFeeRate = object.swapFeeRate ?? "";
    message.withdrawFeeRate = object.withdrawFeeRate ?? "";
    message.maxOrderAmountRatio = object.maxOrderAmountRatio ?? "";
    message.unitBatchHeight = object.unitBatchHeight ?? 0;
    message.circuitBreakerEnabled = object.circuitBreakerEnabled ?? false;
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    message.poolTypes = object.pool_types?.map(e => PoolType.fromAmino(e)) || [];
    if (object.min_init_deposit_amount !== undefined && object.min_init_deposit_amount !== null) {
      message.minInitDepositAmount = object.min_init_deposit_amount;
    }
    if (object.init_pool_coin_mint_amount !== undefined && object.init_pool_coin_mint_amount !== null) {
      message.initPoolCoinMintAmount = object.init_pool_coin_mint_amount;
    }
    if (object.max_reserve_coin_amount !== undefined && object.max_reserve_coin_amount !== null) {
      message.maxReserveCoinAmount = object.max_reserve_coin_amount;
    }
    message.poolCreationFee = object.pool_creation_fee?.map(e => Coin.fromAmino(e)) || [];
    if (object.swap_fee_rate !== undefined && object.swap_fee_rate !== null) {
      message.swapFeeRate = object.swap_fee_rate;
    }
    if (object.withdraw_fee_rate !== undefined && object.withdraw_fee_rate !== null) {
      message.withdrawFeeRate = object.withdraw_fee_rate;
    }
    if (object.max_order_amount_ratio !== undefined && object.max_order_amount_ratio !== null) {
      message.maxOrderAmountRatio = object.max_order_amount_ratio;
    }
    if (object.unit_batch_height !== undefined && object.unit_batch_height !== null) {
      message.unitBatchHeight = object.unit_batch_height;
    }
    if (object.circuit_breaker_enabled !== undefined && object.circuit_breaker_enabled !== null) {
      message.circuitBreakerEnabled = object.circuit_breaker_enabled;
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    if (message.poolTypes) {
      obj.pool_types = message.poolTypes.map(e => e ? PoolType.toAmino(e) : undefined);
    } else {
      obj.pool_types = message.poolTypes;
    }
    obj.min_init_deposit_amount = message.minInitDepositAmount === "" ? undefined : message.minInitDepositAmount;
    obj.init_pool_coin_mint_amount = message.initPoolCoinMintAmount === "" ? undefined : message.initPoolCoinMintAmount;
    obj.max_reserve_coin_amount = message.maxReserveCoinAmount === "" ? undefined : message.maxReserveCoinAmount;
    if (message.poolCreationFee) {
      obj.pool_creation_fee = message.poolCreationFee.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.pool_creation_fee = message.poolCreationFee;
    }
    obj.swap_fee_rate = message.swapFeeRate === "" ? undefined : message.swapFeeRate;
    obj.withdraw_fee_rate = message.withdrawFeeRate === "" ? undefined : message.withdrawFeeRate;
    obj.max_order_amount_ratio = message.maxOrderAmountRatio === "" ? undefined : message.maxOrderAmountRatio;
    obj.unit_batch_height = message.unitBatchHeight === 0 ? undefined : message.unitBatchHeight;
    obj.circuit_breaker_enabled = message.circuitBreakerEnabled === false ? undefined : message.circuitBreakerEnabled;
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  fromProtoMsg(message: ParamsProtoMsg): Params {
    return Params.decode(message.value);
  },
  toProto(message: Params): Uint8Array {
    return Params.encode(message).finish();
  },
  toProtoMsg(message: Params): ParamsProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.Params",
      value: Params.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(Params.typeUrl, Params);
function createBasePool(): Pool {
  return {
    id: BigInt(0),
    typeId: 0,
    reserveCoinDenoms: [],
    reserveAccountAddress: "",
    poolCoinDenom: ""
  };
}
export const Pool = {
  typeUrl: "/cyber.liquidity.v1beta1.Pool",
  is(o: any): o is Pool {
    return o && (o.$typeUrl === Pool.typeUrl || typeof o.id === "bigint" && typeof o.typeId === "number" && Array.isArray(o.reserveCoinDenoms) && (!o.reserveCoinDenoms.length || typeof o.reserveCoinDenoms[0] === "string") && typeof o.reserveAccountAddress === "string" && typeof o.poolCoinDenom === "string");
  },
  isSDK(o: any): o is PoolSDKType {
    return o && (o.$typeUrl === Pool.typeUrl || typeof o.id === "bigint" && typeof o.type_id === "number" && Array.isArray(o.reserve_coin_denoms) && (!o.reserve_coin_denoms.length || typeof o.reserve_coin_denoms[0] === "string") && typeof o.reserve_account_address === "string" && typeof o.pool_coin_denom === "string");
  },
  isAmino(o: any): o is PoolAmino {
    return o && (o.$typeUrl === Pool.typeUrl || typeof o.id === "bigint" && typeof o.type_id === "number" && Array.isArray(o.reserve_coin_denoms) && (!o.reserve_coin_denoms.length || typeof o.reserve_coin_denoms[0] === "string") && typeof o.reserve_account_address === "string" && typeof o.pool_coin_denom === "string");
  },
  encode(message: Pool, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.id !== BigInt(0)) {
      writer.uint32(8).uint64(message.id);
    }
    if (message.typeId !== 0) {
      writer.uint32(16).uint32(message.typeId);
    }
    for (const v of message.reserveCoinDenoms) {
      writer.uint32(26).string(v!);
    }
    if (message.reserveAccountAddress !== "") {
      writer.uint32(34).string(message.reserveAccountAddress);
    }
    if (message.poolCoinDenom !== "") {
      writer.uint32(42).string(message.poolCoinDenom);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Pool {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePool();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint64();
          break;
        case 2:
          message.typeId = reader.uint32();
          break;
        case 3:
          message.reserveCoinDenoms.push(reader.string());
          break;
        case 4:
          message.reserveAccountAddress = reader.string();
          break;
        case 5:
          message.poolCoinDenom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Pool {
    return {
      id: isSet(object.id) ? BigInt(object.id.toString()) : BigInt(0),
      typeId: isSet(object.typeId) ? Number(object.typeId) : 0,
      reserveCoinDenoms: Array.isArray(object?.reserveCoinDenoms) ? object.reserveCoinDenoms.map((e: any) => String(e)) : [],
      reserveAccountAddress: isSet(object.reserveAccountAddress) ? String(object.reserveAccountAddress) : "",
      poolCoinDenom: isSet(object.poolCoinDenom) ? String(object.poolCoinDenom) : ""
    };
  },
  toJSON(message: Pool): JsonSafe<Pool> {
    const obj: any = {};
    message.id !== undefined && (obj.id = (message.id || BigInt(0)).toString());
    message.typeId !== undefined && (obj.typeId = Math.round(message.typeId));
    if (message.reserveCoinDenoms) {
      obj.reserveCoinDenoms = message.reserveCoinDenoms.map(e => e);
    } else {
      obj.reserveCoinDenoms = [];
    }
    message.reserveAccountAddress !== undefined && (obj.reserveAccountAddress = message.reserveAccountAddress);
    message.poolCoinDenom !== undefined && (obj.poolCoinDenom = message.poolCoinDenom);
    return obj;
  },
  fromPartial(object: Partial<Pool>): Pool {
    const message = createBasePool();
    message.id = object.id !== undefined && object.id !== null ? BigInt(object.id.toString()) : BigInt(0);
    message.typeId = object.typeId ?? 0;
    message.reserveCoinDenoms = object.reserveCoinDenoms?.map(e => e) || [];
    message.reserveAccountAddress = object.reserveAccountAddress ?? "";
    message.poolCoinDenom = object.poolCoinDenom ?? "";
    return message;
  },
  fromAmino(object: PoolAmino): Pool {
    const message = createBasePool();
    if (object.id !== undefined && object.id !== null) {
      message.id = BigInt(object.id);
    }
    if (object.type_id !== undefined && object.type_id !== null) {
      message.typeId = object.type_id;
    }
    message.reserveCoinDenoms = object.reserve_coin_denoms?.map(e => e) || [];
    if (object.reserve_account_address !== undefined && object.reserve_account_address !== null) {
      message.reserveAccountAddress = object.reserve_account_address;
    }
    if (object.pool_coin_denom !== undefined && object.pool_coin_denom !== null) {
      message.poolCoinDenom = object.pool_coin_denom;
    }
    return message;
  },
  toAmino(message: Pool): PoolAmino {
    const obj: any = {};
    obj.id = message.id ? message.id.toString() : "0";
    obj.type_id = message.typeId === 0 ? undefined : message.typeId;
    if (message.reserveCoinDenoms) {
      obj.reserve_coin_denoms = message.reserveCoinDenoms.map(e => e);
    } else {
      obj.reserve_coin_denoms = message.reserveCoinDenoms;
    }
    obj.reserve_account_address = message.reserveAccountAddress === "" ? undefined : message.reserveAccountAddress;
    obj.pool_coin_denom = message.poolCoinDenom === "" ? undefined : message.poolCoinDenom;
    return obj;
  },
  fromAminoMsg(object: PoolAminoMsg): Pool {
    return Pool.fromAmino(object.value);
  },
  fromProtoMsg(message: PoolProtoMsg): Pool {
    return Pool.decode(message.value);
  },
  toProto(message: Pool): Uint8Array {
    return Pool.encode(message).finish();
  },
  toProtoMsg(message: Pool): PoolProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.Pool",
      value: Pool.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(Pool.typeUrl, Pool);
function createBasePoolMetadata(): PoolMetadata {
  return {
    poolId: BigInt(0),
    poolCoinTotalSupply: Coin.fromPartial({}),
    reserveCoins: []
  };
}
export const PoolMetadata = {
  typeUrl: "/cyber.liquidity.v1beta1.PoolMetadata",
  is(o: any): o is PoolMetadata {
    return o && (o.$typeUrl === PoolMetadata.typeUrl || typeof o.poolId === "bigint" && Coin.is(o.poolCoinTotalSupply) && Array.isArray(o.reserveCoins) && (!o.reserveCoins.length || Coin.is(o.reserveCoins[0])));
  },
  isSDK(o: any): o is PoolMetadataSDKType {
    return o && (o.$typeUrl === PoolMetadata.typeUrl || typeof o.pool_id === "bigint" && Coin.isSDK(o.pool_coin_total_supply) && Array.isArray(o.reserve_coins) && (!o.reserve_coins.length || Coin.isSDK(o.reserve_coins[0])));
  },
  isAmino(o: any): o is PoolMetadataAmino {
    return o && (o.$typeUrl === PoolMetadata.typeUrl || typeof o.pool_id === "bigint" && Coin.isAmino(o.pool_coin_total_supply) && Array.isArray(o.reserve_coins) && (!o.reserve_coins.length || Coin.isAmino(o.reserve_coins[0])));
  },
  encode(message: PoolMetadata, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolId !== BigInt(0)) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.poolCoinTotalSupply !== undefined) {
      Coin.encode(message.poolCoinTotalSupply, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.reserveCoins) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PoolMetadata {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoolMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64();
          break;
        case 2:
          message.poolCoinTotalSupply = Coin.decode(reader, reader.uint32());
          break;
        case 3:
          message.reserveCoins.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PoolMetadata {
    return {
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      poolCoinTotalSupply: isSet(object.poolCoinTotalSupply) ? Coin.fromJSON(object.poolCoinTotalSupply) : undefined,
      reserveCoins: Array.isArray(object?.reserveCoins) ? object.reserveCoins.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: PoolMetadata): JsonSafe<PoolMetadata> {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.poolCoinTotalSupply !== undefined && (obj.poolCoinTotalSupply = message.poolCoinTotalSupply ? Coin.toJSON(message.poolCoinTotalSupply) : undefined);
    if (message.reserveCoins) {
      obj.reserveCoins = message.reserveCoins.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.reserveCoins = [];
    }
    return obj;
  },
  fromPartial(object: Partial<PoolMetadata>): PoolMetadata {
    const message = createBasePoolMetadata();
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.poolCoinTotalSupply = object.poolCoinTotalSupply !== undefined && object.poolCoinTotalSupply !== null ? Coin.fromPartial(object.poolCoinTotalSupply) : undefined;
    message.reserveCoins = object.reserveCoins?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: PoolMetadataAmino): PoolMetadata {
    const message = createBasePoolMetadata();
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    if (object.pool_coin_total_supply !== undefined && object.pool_coin_total_supply !== null) {
      message.poolCoinTotalSupply = Coin.fromAmino(object.pool_coin_total_supply);
    }
    message.reserveCoins = object.reserve_coins?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: PoolMetadata): PoolMetadataAmino {
    const obj: any = {};
    obj.pool_id = message.poolId ? message.poolId.toString() : "0";
    obj.pool_coin_total_supply = message.poolCoinTotalSupply ? Coin.toAmino(message.poolCoinTotalSupply) : undefined;
    if (message.reserveCoins) {
      obj.reserve_coins = message.reserveCoins.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.reserve_coins = message.reserveCoins;
    }
    return obj;
  },
  fromAminoMsg(object: PoolMetadataAminoMsg): PoolMetadata {
    return PoolMetadata.fromAmino(object.value);
  },
  fromProtoMsg(message: PoolMetadataProtoMsg): PoolMetadata {
    return PoolMetadata.decode(message.value);
  },
  toProto(message: PoolMetadata): Uint8Array {
    return PoolMetadata.encode(message).finish();
  },
  toProtoMsg(message: PoolMetadata): PoolMetadataProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.PoolMetadata",
      value: PoolMetadata.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(PoolMetadata.typeUrl, PoolMetadata);
function createBasePoolBatch(): PoolBatch {
  return {
    poolId: BigInt(0),
    index: BigInt(0),
    beginHeight: BigInt(0),
    depositMsgIndex: BigInt(0),
    withdrawMsgIndex: BigInt(0),
    swapMsgIndex: BigInt(0),
    executed: false
  };
}
export const PoolBatch = {
  typeUrl: "/cyber.liquidity.v1beta1.PoolBatch",
  is(o: any): o is PoolBatch {
    return o && (o.$typeUrl === PoolBatch.typeUrl || typeof o.poolId === "bigint" && typeof o.index === "bigint" && typeof o.beginHeight === "bigint" && typeof o.depositMsgIndex === "bigint" && typeof o.withdrawMsgIndex === "bigint" && typeof o.swapMsgIndex === "bigint" && typeof o.executed === "boolean");
  },
  isSDK(o: any): o is PoolBatchSDKType {
    return o && (o.$typeUrl === PoolBatch.typeUrl || typeof o.pool_id === "bigint" && typeof o.index === "bigint" && typeof o.begin_height === "bigint" && typeof o.deposit_msg_index === "bigint" && typeof o.withdraw_msg_index === "bigint" && typeof o.swap_msg_index === "bigint" && typeof o.executed === "boolean");
  },
  isAmino(o: any): o is PoolBatchAmino {
    return o && (o.$typeUrl === PoolBatch.typeUrl || typeof o.pool_id === "bigint" && typeof o.index === "bigint" && typeof o.begin_height === "bigint" && typeof o.deposit_msg_index === "bigint" && typeof o.withdraw_msg_index === "bigint" && typeof o.swap_msg_index === "bigint" && typeof o.executed === "boolean");
  },
  encode(message: PoolBatch, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.poolId !== BigInt(0)) {
      writer.uint32(8).uint64(message.poolId);
    }
    if (message.index !== BigInt(0)) {
      writer.uint32(16).uint64(message.index);
    }
    if (message.beginHeight !== BigInt(0)) {
      writer.uint32(24).int64(message.beginHeight);
    }
    if (message.depositMsgIndex !== BigInt(0)) {
      writer.uint32(32).uint64(message.depositMsgIndex);
    }
    if (message.withdrawMsgIndex !== BigInt(0)) {
      writer.uint32(40).uint64(message.withdrawMsgIndex);
    }
    if (message.swapMsgIndex !== BigInt(0)) {
      writer.uint32(48).uint64(message.swapMsgIndex);
    }
    if (message.executed === true) {
      writer.uint32(56).bool(message.executed);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PoolBatch {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoolBatch();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poolId = reader.uint64();
          break;
        case 2:
          message.index = reader.uint64();
          break;
        case 3:
          message.beginHeight = reader.int64();
          break;
        case 4:
          message.depositMsgIndex = reader.uint64();
          break;
        case 5:
          message.withdrawMsgIndex = reader.uint64();
          break;
        case 6:
          message.swapMsgIndex = reader.uint64();
          break;
        case 7:
          message.executed = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PoolBatch {
    return {
      poolId: isSet(object.poolId) ? BigInt(object.poolId.toString()) : BigInt(0),
      index: isSet(object.index) ? BigInt(object.index.toString()) : BigInt(0),
      beginHeight: isSet(object.beginHeight) ? BigInt(object.beginHeight.toString()) : BigInt(0),
      depositMsgIndex: isSet(object.depositMsgIndex) ? BigInt(object.depositMsgIndex.toString()) : BigInt(0),
      withdrawMsgIndex: isSet(object.withdrawMsgIndex) ? BigInt(object.withdrawMsgIndex.toString()) : BigInt(0),
      swapMsgIndex: isSet(object.swapMsgIndex) ? BigInt(object.swapMsgIndex.toString()) : BigInt(0),
      executed: isSet(object.executed) ? Boolean(object.executed) : false
    };
  },
  toJSON(message: PoolBatch): JsonSafe<PoolBatch> {
    const obj: any = {};
    message.poolId !== undefined && (obj.poolId = (message.poolId || BigInt(0)).toString());
    message.index !== undefined && (obj.index = (message.index || BigInt(0)).toString());
    message.beginHeight !== undefined && (obj.beginHeight = (message.beginHeight || BigInt(0)).toString());
    message.depositMsgIndex !== undefined && (obj.depositMsgIndex = (message.depositMsgIndex || BigInt(0)).toString());
    message.withdrawMsgIndex !== undefined && (obj.withdrawMsgIndex = (message.withdrawMsgIndex || BigInt(0)).toString());
    message.swapMsgIndex !== undefined && (obj.swapMsgIndex = (message.swapMsgIndex || BigInt(0)).toString());
    message.executed !== undefined && (obj.executed = message.executed);
    return obj;
  },
  fromPartial(object: Partial<PoolBatch>): PoolBatch {
    const message = createBasePoolBatch();
    message.poolId = object.poolId !== undefined && object.poolId !== null ? BigInt(object.poolId.toString()) : BigInt(0);
    message.index = object.index !== undefined && object.index !== null ? BigInt(object.index.toString()) : BigInt(0);
    message.beginHeight = object.beginHeight !== undefined && object.beginHeight !== null ? BigInt(object.beginHeight.toString()) : BigInt(0);
    message.depositMsgIndex = object.depositMsgIndex !== undefined && object.depositMsgIndex !== null ? BigInt(object.depositMsgIndex.toString()) : BigInt(0);
    message.withdrawMsgIndex = object.withdrawMsgIndex !== undefined && object.withdrawMsgIndex !== null ? BigInt(object.withdrawMsgIndex.toString()) : BigInt(0);
    message.swapMsgIndex = object.swapMsgIndex !== undefined && object.swapMsgIndex !== null ? BigInt(object.swapMsgIndex.toString()) : BigInt(0);
    message.executed = object.executed ?? false;
    return message;
  },
  fromAmino(object: PoolBatchAmino): PoolBatch {
    const message = createBasePoolBatch();
    if (object.pool_id !== undefined && object.pool_id !== null) {
      message.poolId = BigInt(object.pool_id);
    }
    if (object.index !== undefined && object.index !== null) {
      message.index = BigInt(object.index);
    }
    if (object.begin_height !== undefined && object.begin_height !== null) {
      message.beginHeight = BigInt(object.begin_height);
    }
    if (object.deposit_msg_index !== undefined && object.deposit_msg_index !== null) {
      message.depositMsgIndex = BigInt(object.deposit_msg_index);
    }
    if (object.withdraw_msg_index !== undefined && object.withdraw_msg_index !== null) {
      message.withdrawMsgIndex = BigInt(object.withdraw_msg_index);
    }
    if (object.swap_msg_index !== undefined && object.swap_msg_index !== null) {
      message.swapMsgIndex = BigInt(object.swap_msg_index);
    }
    if (object.executed !== undefined && object.executed !== null) {
      message.executed = object.executed;
    }
    return message;
  },
  toAmino(message: PoolBatch): PoolBatchAmino {
    const obj: any = {};
    obj.pool_id = message.poolId ? message.poolId.toString() : "0";
    obj.index = message.index !== BigInt(0) ? message.index.toString() : undefined;
    obj.begin_height = message.beginHeight !== BigInt(0) ? message.beginHeight.toString() : undefined;
    obj.deposit_msg_index = message.depositMsgIndex !== BigInt(0) ? message.depositMsgIndex.toString() : undefined;
    obj.withdraw_msg_index = message.withdrawMsgIndex !== BigInt(0) ? message.withdrawMsgIndex.toString() : undefined;
    obj.swap_msg_index = message.swapMsgIndex !== BigInt(0) ? message.swapMsgIndex.toString() : undefined;
    obj.executed = message.executed === false ? undefined : message.executed;
    return obj;
  },
  fromAminoMsg(object: PoolBatchAminoMsg): PoolBatch {
    return PoolBatch.fromAmino(object.value);
  },
  fromProtoMsg(message: PoolBatchProtoMsg): PoolBatch {
    return PoolBatch.decode(message.value);
  },
  toProto(message: PoolBatch): Uint8Array {
    return PoolBatch.encode(message).finish();
  },
  toProtoMsg(message: PoolBatch): PoolBatchProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.PoolBatch",
      value: PoolBatch.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(PoolBatch.typeUrl, PoolBatch);
function createBaseDepositMsgState(): DepositMsgState {
  return {
    msgHeight: BigInt(0),
    msgIndex: BigInt(0),
    executed: false,
    succeeded: false,
    toBeDeleted: false,
    msg: undefined
  };
}
export const DepositMsgState = {
  typeUrl: "/cyber.liquidity.v1beta1.DepositMsgState",
  is(o: any): o is DepositMsgState {
    return o && (o.$typeUrl === DepositMsgState.typeUrl || typeof o.msgHeight === "bigint" && typeof o.msgIndex === "bigint" && typeof o.executed === "boolean" && typeof o.succeeded === "boolean" && typeof o.toBeDeleted === "boolean");
  },
  isSDK(o: any): o is DepositMsgStateSDKType {
    return o && (o.$typeUrl === DepositMsgState.typeUrl || typeof o.msg_height === "bigint" && typeof o.msg_index === "bigint" && typeof o.executed === "boolean" && typeof o.succeeded === "boolean" && typeof o.to_be_deleted === "boolean");
  },
  isAmino(o: any): o is DepositMsgStateAmino {
    return o && (o.$typeUrl === DepositMsgState.typeUrl || typeof o.msg_height === "bigint" && typeof o.msg_index === "bigint" && typeof o.executed === "boolean" && typeof o.succeeded === "boolean" && typeof o.to_be_deleted === "boolean");
  },
  encode(message: DepositMsgState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.msgHeight !== BigInt(0)) {
      writer.uint32(8).int64(message.msgHeight);
    }
    if (message.msgIndex !== BigInt(0)) {
      writer.uint32(16).uint64(message.msgIndex);
    }
    if (message.executed === true) {
      writer.uint32(24).bool(message.executed);
    }
    if (message.succeeded === true) {
      writer.uint32(32).bool(message.succeeded);
    }
    if (message.toBeDeleted === true) {
      writer.uint32(40).bool(message.toBeDeleted);
    }
    if (message.msg !== undefined) {
      MsgDepositWithinBatch.encode(message.msg, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): DepositMsgState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDepositMsgState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.msgHeight = reader.int64();
          break;
        case 2:
          message.msgIndex = reader.uint64();
          break;
        case 3:
          message.executed = reader.bool();
          break;
        case 4:
          message.succeeded = reader.bool();
          break;
        case 5:
          message.toBeDeleted = reader.bool();
          break;
        case 6:
          message.msg = MsgDepositWithinBatch.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DepositMsgState {
    return {
      msgHeight: isSet(object.msgHeight) ? BigInt(object.msgHeight.toString()) : BigInt(0),
      msgIndex: isSet(object.msgIndex) ? BigInt(object.msgIndex.toString()) : BigInt(0),
      executed: isSet(object.executed) ? Boolean(object.executed) : false,
      succeeded: isSet(object.succeeded) ? Boolean(object.succeeded) : false,
      toBeDeleted: isSet(object.toBeDeleted) ? Boolean(object.toBeDeleted) : false,
      msg: isSet(object.msg) ? MsgDepositWithinBatch.fromJSON(object.msg) : undefined
    };
  },
  toJSON(message: DepositMsgState): JsonSafe<DepositMsgState> {
    const obj: any = {};
    message.msgHeight !== undefined && (obj.msgHeight = (message.msgHeight || BigInt(0)).toString());
    message.msgIndex !== undefined && (obj.msgIndex = (message.msgIndex || BigInt(0)).toString());
    message.executed !== undefined && (obj.executed = message.executed);
    message.succeeded !== undefined && (obj.succeeded = message.succeeded);
    message.toBeDeleted !== undefined && (obj.toBeDeleted = message.toBeDeleted);
    message.msg !== undefined && (obj.msg = message.msg ? MsgDepositWithinBatch.toJSON(message.msg) : undefined);
    return obj;
  },
  fromPartial(object: Partial<DepositMsgState>): DepositMsgState {
    const message = createBaseDepositMsgState();
    message.msgHeight = object.msgHeight !== undefined && object.msgHeight !== null ? BigInt(object.msgHeight.toString()) : BigInt(0);
    message.msgIndex = object.msgIndex !== undefined && object.msgIndex !== null ? BigInt(object.msgIndex.toString()) : BigInt(0);
    message.executed = object.executed ?? false;
    message.succeeded = object.succeeded ?? false;
    message.toBeDeleted = object.toBeDeleted ?? false;
    message.msg = object.msg !== undefined && object.msg !== null ? MsgDepositWithinBatch.fromPartial(object.msg) : undefined;
    return message;
  },
  fromAmino(object: DepositMsgStateAmino): DepositMsgState {
    const message = createBaseDepositMsgState();
    if (object.msg_height !== undefined && object.msg_height !== null) {
      message.msgHeight = BigInt(object.msg_height);
    }
    if (object.msg_index !== undefined && object.msg_index !== null) {
      message.msgIndex = BigInt(object.msg_index);
    }
    if (object.executed !== undefined && object.executed !== null) {
      message.executed = object.executed;
    }
    if (object.succeeded !== undefined && object.succeeded !== null) {
      message.succeeded = object.succeeded;
    }
    if (object.to_be_deleted !== undefined && object.to_be_deleted !== null) {
      message.toBeDeleted = object.to_be_deleted;
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = MsgDepositWithinBatch.fromAmino(object.msg);
    }
    return message;
  },
  toAmino(message: DepositMsgState): DepositMsgStateAmino {
    const obj: any = {};
    obj.msg_height = message.msgHeight !== BigInt(0) ? message.msgHeight.toString() : undefined;
    obj.msg_index = message.msgIndex !== BigInt(0) ? message.msgIndex.toString() : undefined;
    obj.executed = message.executed === false ? undefined : message.executed;
    obj.succeeded = message.succeeded === false ? undefined : message.succeeded;
    obj.to_be_deleted = message.toBeDeleted === false ? undefined : message.toBeDeleted;
    obj.msg = message.msg ? MsgDepositWithinBatch.toAmino(message.msg) : undefined;
    return obj;
  },
  fromAminoMsg(object: DepositMsgStateAminoMsg): DepositMsgState {
    return DepositMsgState.fromAmino(object.value);
  },
  fromProtoMsg(message: DepositMsgStateProtoMsg): DepositMsgState {
    return DepositMsgState.decode(message.value);
  },
  toProto(message: DepositMsgState): Uint8Array {
    return DepositMsgState.encode(message).finish();
  },
  toProtoMsg(message: DepositMsgState): DepositMsgStateProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.DepositMsgState",
      value: DepositMsgState.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(DepositMsgState.typeUrl, DepositMsgState);
function createBaseWithdrawMsgState(): WithdrawMsgState {
  return {
    msgHeight: BigInt(0),
    msgIndex: BigInt(0),
    executed: false,
    succeeded: false,
    toBeDeleted: false,
    msg: undefined
  };
}
export const WithdrawMsgState = {
  typeUrl: "/cyber.liquidity.v1beta1.WithdrawMsgState",
  is(o: any): o is WithdrawMsgState {
    return o && (o.$typeUrl === WithdrawMsgState.typeUrl || typeof o.msgHeight === "bigint" && typeof o.msgIndex === "bigint" && typeof o.executed === "boolean" && typeof o.succeeded === "boolean" && typeof o.toBeDeleted === "boolean");
  },
  isSDK(o: any): o is WithdrawMsgStateSDKType {
    return o && (o.$typeUrl === WithdrawMsgState.typeUrl || typeof o.msg_height === "bigint" && typeof o.msg_index === "bigint" && typeof o.executed === "boolean" && typeof o.succeeded === "boolean" && typeof o.to_be_deleted === "boolean");
  },
  isAmino(o: any): o is WithdrawMsgStateAmino {
    return o && (o.$typeUrl === WithdrawMsgState.typeUrl || typeof o.msg_height === "bigint" && typeof o.msg_index === "bigint" && typeof o.executed === "boolean" && typeof o.succeeded === "boolean" && typeof o.to_be_deleted === "boolean");
  },
  encode(message: WithdrawMsgState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.msgHeight !== BigInt(0)) {
      writer.uint32(8).int64(message.msgHeight);
    }
    if (message.msgIndex !== BigInt(0)) {
      writer.uint32(16).uint64(message.msgIndex);
    }
    if (message.executed === true) {
      writer.uint32(24).bool(message.executed);
    }
    if (message.succeeded === true) {
      writer.uint32(32).bool(message.succeeded);
    }
    if (message.toBeDeleted === true) {
      writer.uint32(40).bool(message.toBeDeleted);
    }
    if (message.msg !== undefined) {
      MsgWithdrawWithinBatch.encode(message.msg, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): WithdrawMsgState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWithdrawMsgState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.msgHeight = reader.int64();
          break;
        case 2:
          message.msgIndex = reader.uint64();
          break;
        case 3:
          message.executed = reader.bool();
          break;
        case 4:
          message.succeeded = reader.bool();
          break;
        case 5:
          message.toBeDeleted = reader.bool();
          break;
        case 6:
          message.msg = MsgWithdrawWithinBatch.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): WithdrawMsgState {
    return {
      msgHeight: isSet(object.msgHeight) ? BigInt(object.msgHeight.toString()) : BigInt(0),
      msgIndex: isSet(object.msgIndex) ? BigInt(object.msgIndex.toString()) : BigInt(0),
      executed: isSet(object.executed) ? Boolean(object.executed) : false,
      succeeded: isSet(object.succeeded) ? Boolean(object.succeeded) : false,
      toBeDeleted: isSet(object.toBeDeleted) ? Boolean(object.toBeDeleted) : false,
      msg: isSet(object.msg) ? MsgWithdrawWithinBatch.fromJSON(object.msg) : undefined
    };
  },
  toJSON(message: WithdrawMsgState): JsonSafe<WithdrawMsgState> {
    const obj: any = {};
    message.msgHeight !== undefined && (obj.msgHeight = (message.msgHeight || BigInt(0)).toString());
    message.msgIndex !== undefined && (obj.msgIndex = (message.msgIndex || BigInt(0)).toString());
    message.executed !== undefined && (obj.executed = message.executed);
    message.succeeded !== undefined && (obj.succeeded = message.succeeded);
    message.toBeDeleted !== undefined && (obj.toBeDeleted = message.toBeDeleted);
    message.msg !== undefined && (obj.msg = message.msg ? MsgWithdrawWithinBatch.toJSON(message.msg) : undefined);
    return obj;
  },
  fromPartial(object: Partial<WithdrawMsgState>): WithdrawMsgState {
    const message = createBaseWithdrawMsgState();
    message.msgHeight = object.msgHeight !== undefined && object.msgHeight !== null ? BigInt(object.msgHeight.toString()) : BigInt(0);
    message.msgIndex = object.msgIndex !== undefined && object.msgIndex !== null ? BigInt(object.msgIndex.toString()) : BigInt(0);
    message.executed = object.executed ?? false;
    message.succeeded = object.succeeded ?? false;
    message.toBeDeleted = object.toBeDeleted ?? false;
    message.msg = object.msg !== undefined && object.msg !== null ? MsgWithdrawWithinBatch.fromPartial(object.msg) : undefined;
    return message;
  },
  fromAmino(object: WithdrawMsgStateAmino): WithdrawMsgState {
    const message = createBaseWithdrawMsgState();
    if (object.msg_height !== undefined && object.msg_height !== null) {
      message.msgHeight = BigInt(object.msg_height);
    }
    if (object.msg_index !== undefined && object.msg_index !== null) {
      message.msgIndex = BigInt(object.msg_index);
    }
    if (object.executed !== undefined && object.executed !== null) {
      message.executed = object.executed;
    }
    if (object.succeeded !== undefined && object.succeeded !== null) {
      message.succeeded = object.succeeded;
    }
    if (object.to_be_deleted !== undefined && object.to_be_deleted !== null) {
      message.toBeDeleted = object.to_be_deleted;
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = MsgWithdrawWithinBatch.fromAmino(object.msg);
    }
    return message;
  },
  toAmino(message: WithdrawMsgState): WithdrawMsgStateAmino {
    const obj: any = {};
    obj.msg_height = message.msgHeight !== BigInt(0) ? message.msgHeight.toString() : undefined;
    obj.msg_index = message.msgIndex !== BigInt(0) ? message.msgIndex.toString() : undefined;
    obj.executed = message.executed === false ? undefined : message.executed;
    obj.succeeded = message.succeeded === false ? undefined : message.succeeded;
    obj.to_be_deleted = message.toBeDeleted === false ? undefined : message.toBeDeleted;
    obj.msg = message.msg ? MsgWithdrawWithinBatch.toAmino(message.msg) : undefined;
    return obj;
  },
  fromAminoMsg(object: WithdrawMsgStateAminoMsg): WithdrawMsgState {
    return WithdrawMsgState.fromAmino(object.value);
  },
  fromProtoMsg(message: WithdrawMsgStateProtoMsg): WithdrawMsgState {
    return WithdrawMsgState.decode(message.value);
  },
  toProto(message: WithdrawMsgState): Uint8Array {
    return WithdrawMsgState.encode(message).finish();
  },
  toProtoMsg(message: WithdrawMsgState): WithdrawMsgStateProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.WithdrawMsgState",
      value: WithdrawMsgState.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(WithdrawMsgState.typeUrl, WithdrawMsgState);
function createBaseSwapMsgState(): SwapMsgState {
  return {
    msgHeight: BigInt(0),
    msgIndex: BigInt(0),
    executed: false,
    succeeded: false,
    toBeDeleted: false,
    orderExpiryHeight: BigInt(0),
    exchangedOfferCoin: Coin.fromPartial({}),
    remainingOfferCoin: Coin.fromPartial({}),
    reservedOfferCoinFee: Coin.fromPartial({}),
    msg: undefined
  };
}
export const SwapMsgState = {
  typeUrl: "/cyber.liquidity.v1beta1.SwapMsgState",
  is(o: any): o is SwapMsgState {
    return o && (o.$typeUrl === SwapMsgState.typeUrl || typeof o.msgHeight === "bigint" && typeof o.msgIndex === "bigint" && typeof o.executed === "boolean" && typeof o.succeeded === "boolean" && typeof o.toBeDeleted === "boolean" && typeof o.orderExpiryHeight === "bigint" && Coin.is(o.exchangedOfferCoin) && Coin.is(o.remainingOfferCoin) && Coin.is(o.reservedOfferCoinFee));
  },
  isSDK(o: any): o is SwapMsgStateSDKType {
    return o && (o.$typeUrl === SwapMsgState.typeUrl || typeof o.msg_height === "bigint" && typeof o.msg_index === "bigint" && typeof o.executed === "boolean" && typeof o.succeeded === "boolean" && typeof o.to_be_deleted === "boolean" && typeof o.order_expiry_height === "bigint" && Coin.isSDK(o.exchanged_offer_coin) && Coin.isSDK(o.remaining_offer_coin) && Coin.isSDK(o.reserved_offer_coin_fee));
  },
  isAmino(o: any): o is SwapMsgStateAmino {
    return o && (o.$typeUrl === SwapMsgState.typeUrl || typeof o.msg_height === "bigint" && typeof o.msg_index === "bigint" && typeof o.executed === "boolean" && typeof o.succeeded === "boolean" && typeof o.to_be_deleted === "boolean" && typeof o.order_expiry_height === "bigint" && Coin.isAmino(o.exchanged_offer_coin) && Coin.isAmino(o.remaining_offer_coin) && Coin.isAmino(o.reserved_offer_coin_fee));
  },
  encode(message: SwapMsgState, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.msgHeight !== BigInt(0)) {
      writer.uint32(8).int64(message.msgHeight);
    }
    if (message.msgIndex !== BigInt(0)) {
      writer.uint32(16).uint64(message.msgIndex);
    }
    if (message.executed === true) {
      writer.uint32(24).bool(message.executed);
    }
    if (message.succeeded === true) {
      writer.uint32(32).bool(message.succeeded);
    }
    if (message.toBeDeleted === true) {
      writer.uint32(40).bool(message.toBeDeleted);
    }
    if (message.orderExpiryHeight !== BigInt(0)) {
      writer.uint32(48).int64(message.orderExpiryHeight);
    }
    if (message.exchangedOfferCoin !== undefined) {
      Coin.encode(message.exchangedOfferCoin, writer.uint32(58).fork()).ldelim();
    }
    if (message.remainingOfferCoin !== undefined) {
      Coin.encode(message.remainingOfferCoin, writer.uint32(66).fork()).ldelim();
    }
    if (message.reservedOfferCoinFee !== undefined) {
      Coin.encode(message.reservedOfferCoinFee, writer.uint32(74).fork()).ldelim();
    }
    if (message.msg !== undefined) {
      MsgSwapWithinBatch.encode(message.msg, writer.uint32(82).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): SwapMsgState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapMsgState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.msgHeight = reader.int64();
          break;
        case 2:
          message.msgIndex = reader.uint64();
          break;
        case 3:
          message.executed = reader.bool();
          break;
        case 4:
          message.succeeded = reader.bool();
          break;
        case 5:
          message.toBeDeleted = reader.bool();
          break;
        case 6:
          message.orderExpiryHeight = reader.int64();
          break;
        case 7:
          message.exchangedOfferCoin = Coin.decode(reader, reader.uint32());
          break;
        case 8:
          message.remainingOfferCoin = Coin.decode(reader, reader.uint32());
          break;
        case 9:
          message.reservedOfferCoinFee = Coin.decode(reader, reader.uint32());
          break;
        case 10:
          message.msg = MsgSwapWithinBatch.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SwapMsgState {
    return {
      msgHeight: isSet(object.msgHeight) ? BigInt(object.msgHeight.toString()) : BigInt(0),
      msgIndex: isSet(object.msgIndex) ? BigInt(object.msgIndex.toString()) : BigInt(0),
      executed: isSet(object.executed) ? Boolean(object.executed) : false,
      succeeded: isSet(object.succeeded) ? Boolean(object.succeeded) : false,
      toBeDeleted: isSet(object.toBeDeleted) ? Boolean(object.toBeDeleted) : false,
      orderExpiryHeight: isSet(object.orderExpiryHeight) ? BigInt(object.orderExpiryHeight.toString()) : BigInt(0),
      exchangedOfferCoin: isSet(object.exchangedOfferCoin) ? Coin.fromJSON(object.exchangedOfferCoin) : undefined,
      remainingOfferCoin: isSet(object.remainingOfferCoin) ? Coin.fromJSON(object.remainingOfferCoin) : undefined,
      reservedOfferCoinFee: isSet(object.reservedOfferCoinFee) ? Coin.fromJSON(object.reservedOfferCoinFee) : undefined,
      msg: isSet(object.msg) ? MsgSwapWithinBatch.fromJSON(object.msg) : undefined
    };
  },
  toJSON(message: SwapMsgState): JsonSafe<SwapMsgState> {
    const obj: any = {};
    message.msgHeight !== undefined && (obj.msgHeight = (message.msgHeight || BigInt(0)).toString());
    message.msgIndex !== undefined && (obj.msgIndex = (message.msgIndex || BigInt(0)).toString());
    message.executed !== undefined && (obj.executed = message.executed);
    message.succeeded !== undefined && (obj.succeeded = message.succeeded);
    message.toBeDeleted !== undefined && (obj.toBeDeleted = message.toBeDeleted);
    message.orderExpiryHeight !== undefined && (obj.orderExpiryHeight = (message.orderExpiryHeight || BigInt(0)).toString());
    message.exchangedOfferCoin !== undefined && (obj.exchangedOfferCoin = message.exchangedOfferCoin ? Coin.toJSON(message.exchangedOfferCoin) : undefined);
    message.remainingOfferCoin !== undefined && (obj.remainingOfferCoin = message.remainingOfferCoin ? Coin.toJSON(message.remainingOfferCoin) : undefined);
    message.reservedOfferCoinFee !== undefined && (obj.reservedOfferCoinFee = message.reservedOfferCoinFee ? Coin.toJSON(message.reservedOfferCoinFee) : undefined);
    message.msg !== undefined && (obj.msg = message.msg ? MsgSwapWithinBatch.toJSON(message.msg) : undefined);
    return obj;
  },
  fromPartial(object: Partial<SwapMsgState>): SwapMsgState {
    const message = createBaseSwapMsgState();
    message.msgHeight = object.msgHeight !== undefined && object.msgHeight !== null ? BigInt(object.msgHeight.toString()) : BigInt(0);
    message.msgIndex = object.msgIndex !== undefined && object.msgIndex !== null ? BigInt(object.msgIndex.toString()) : BigInt(0);
    message.executed = object.executed ?? false;
    message.succeeded = object.succeeded ?? false;
    message.toBeDeleted = object.toBeDeleted ?? false;
    message.orderExpiryHeight = object.orderExpiryHeight !== undefined && object.orderExpiryHeight !== null ? BigInt(object.orderExpiryHeight.toString()) : BigInt(0);
    message.exchangedOfferCoin = object.exchangedOfferCoin !== undefined && object.exchangedOfferCoin !== null ? Coin.fromPartial(object.exchangedOfferCoin) : undefined;
    message.remainingOfferCoin = object.remainingOfferCoin !== undefined && object.remainingOfferCoin !== null ? Coin.fromPartial(object.remainingOfferCoin) : undefined;
    message.reservedOfferCoinFee = object.reservedOfferCoinFee !== undefined && object.reservedOfferCoinFee !== null ? Coin.fromPartial(object.reservedOfferCoinFee) : undefined;
    message.msg = object.msg !== undefined && object.msg !== null ? MsgSwapWithinBatch.fromPartial(object.msg) : undefined;
    return message;
  },
  fromAmino(object: SwapMsgStateAmino): SwapMsgState {
    const message = createBaseSwapMsgState();
    if (object.msg_height !== undefined && object.msg_height !== null) {
      message.msgHeight = BigInt(object.msg_height);
    }
    if (object.msg_index !== undefined && object.msg_index !== null) {
      message.msgIndex = BigInt(object.msg_index);
    }
    if (object.executed !== undefined && object.executed !== null) {
      message.executed = object.executed;
    }
    if (object.succeeded !== undefined && object.succeeded !== null) {
      message.succeeded = object.succeeded;
    }
    if (object.to_be_deleted !== undefined && object.to_be_deleted !== null) {
      message.toBeDeleted = object.to_be_deleted;
    }
    if (object.order_expiry_height !== undefined && object.order_expiry_height !== null) {
      message.orderExpiryHeight = BigInt(object.order_expiry_height);
    }
    if (object.exchanged_offer_coin !== undefined && object.exchanged_offer_coin !== null) {
      message.exchangedOfferCoin = Coin.fromAmino(object.exchanged_offer_coin);
    }
    if (object.remaining_offer_coin !== undefined && object.remaining_offer_coin !== null) {
      message.remainingOfferCoin = Coin.fromAmino(object.remaining_offer_coin);
    }
    if (object.reserved_offer_coin_fee !== undefined && object.reserved_offer_coin_fee !== null) {
      message.reservedOfferCoinFee = Coin.fromAmino(object.reserved_offer_coin_fee);
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = MsgSwapWithinBatch.fromAmino(object.msg);
    }
    return message;
  },
  toAmino(message: SwapMsgState): SwapMsgStateAmino {
    const obj: any = {};
    obj.msg_height = message.msgHeight !== BigInt(0) ? message.msgHeight.toString() : undefined;
    obj.msg_index = message.msgIndex !== BigInt(0) ? message.msgIndex.toString() : undefined;
    obj.executed = message.executed === false ? undefined : message.executed;
    obj.succeeded = message.succeeded === false ? undefined : message.succeeded;
    obj.to_be_deleted = message.toBeDeleted === false ? undefined : message.toBeDeleted;
    obj.order_expiry_height = message.orderExpiryHeight !== BigInt(0) ? message.orderExpiryHeight.toString() : undefined;
    obj.exchanged_offer_coin = message.exchangedOfferCoin ? Coin.toAmino(message.exchangedOfferCoin) : undefined;
    obj.remaining_offer_coin = message.remainingOfferCoin ? Coin.toAmino(message.remainingOfferCoin) : undefined;
    obj.reserved_offer_coin_fee = message.reservedOfferCoinFee ? Coin.toAmino(message.reservedOfferCoinFee) : undefined;
    obj.msg = message.msg ? MsgSwapWithinBatch.toAmino(message.msg) : undefined;
    return obj;
  },
  fromAminoMsg(object: SwapMsgStateAminoMsg): SwapMsgState {
    return SwapMsgState.fromAmino(object.value);
  },
  fromProtoMsg(message: SwapMsgStateProtoMsg): SwapMsgState {
    return SwapMsgState.decode(message.value);
  },
  toProto(message: SwapMsgState): Uint8Array {
    return SwapMsgState.encode(message).finish();
  },
  toProtoMsg(message: SwapMsgState): SwapMsgStateProtoMsg {
    return {
      typeUrl: "/cyber.liquidity.v1beta1.SwapMsgState",
      value: SwapMsgState.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(SwapMsgState.typeUrl, SwapMsgState);