//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
export interface Params {
  maxSlots: number;
  halvingPeriodVoltBlocks: number;
  halvingPeriodAmpereBlocks: number;
  baseInvestmintPeriodVolt: number;
  baseInvestmintPeriodAmpere: number;
  minInvestmintPeriod: number;
  baseInvestmintAmountVolt: Coin;
  baseInvestmintAmountAmpere: Coin;
}
export interface ParamsProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.Params";
  value: Uint8Array;
}
export interface ParamsAmino {
  max_slots?: number;
  halving_period_volt_blocks?: number;
  halving_period_ampere_blocks?: number;
  base_investmint_period_volt?: number;
  base_investmint_period_ampere?: number;
  min_investmint_period?: number;
  base_investmint_amount_volt?: CoinAmino;
  base_investmint_amount_ampere?: CoinAmino;
}
export interface ParamsAminoMsg {
  type: "/cyber.resources.v1beta1.Params";
  value: ParamsAmino;
}
export interface ParamsSDKType {
  max_slots: number;
  halving_period_volt_blocks: number;
  halving_period_ampere_blocks: number;
  base_investmint_period_volt: number;
  base_investmint_period_ampere: number;
  min_investmint_period: number;
  base_investmint_amount_volt: CoinSDKType;
  base_investmint_amount_ampere: CoinSDKType;
}
function createBaseParams(): Params {
  return {
    maxSlots: 0,
    halvingPeriodVoltBlocks: 0,
    halvingPeriodAmpereBlocks: 0,
    baseInvestmintPeriodVolt: 0,
    baseInvestmintPeriodAmpere: 0,
    minInvestmintPeriod: 0,
    baseInvestmintAmountVolt: Coin.fromPartial({}),
    baseInvestmintAmountAmpere: Coin.fromPartial({})
  };
}
export const Params = {
  typeUrl: "/cyber.resources.v1beta1.Params",
  is(o: any): o is Params {
    return o && (o.$typeUrl === Params.typeUrl || typeof o.maxSlots === "number" && typeof o.halvingPeriodVoltBlocks === "number" && typeof o.halvingPeriodAmpereBlocks === "number" && typeof o.baseInvestmintPeriodVolt === "number" && typeof o.baseInvestmintPeriodAmpere === "number" && typeof o.minInvestmintPeriod === "number" && Coin.is(o.baseInvestmintAmountVolt) && Coin.is(o.baseInvestmintAmountAmpere));
  },
  isSDK(o: any): o is ParamsSDKType {
    return o && (o.$typeUrl === Params.typeUrl || typeof o.max_slots === "number" && typeof o.halving_period_volt_blocks === "number" && typeof o.halving_period_ampere_blocks === "number" && typeof o.base_investmint_period_volt === "number" && typeof o.base_investmint_period_ampere === "number" && typeof o.min_investmint_period === "number" && Coin.isSDK(o.base_investmint_amount_volt) && Coin.isSDK(o.base_investmint_amount_ampere));
  },
  isAmino(o: any): o is ParamsAmino {
    return o && (o.$typeUrl === Params.typeUrl || typeof o.max_slots === "number" && typeof o.halving_period_volt_blocks === "number" && typeof o.halving_period_ampere_blocks === "number" && typeof o.base_investmint_period_volt === "number" && typeof o.base_investmint_period_ampere === "number" && typeof o.min_investmint_period === "number" && Coin.isAmino(o.base_investmint_amount_volt) && Coin.isAmino(o.base_investmint_amount_ampere));
  },
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.maxSlots !== 0) {
      writer.uint32(8).uint32(message.maxSlots);
    }
    if (message.halvingPeriodVoltBlocks !== 0) {
      writer.uint32(16).uint32(message.halvingPeriodVoltBlocks);
    }
    if (message.halvingPeriodAmpereBlocks !== 0) {
      writer.uint32(24).uint32(message.halvingPeriodAmpereBlocks);
    }
    if (message.baseInvestmintPeriodVolt !== 0) {
      writer.uint32(32).uint32(message.baseInvestmintPeriodVolt);
    }
    if (message.baseInvestmintPeriodAmpere !== 0) {
      writer.uint32(40).uint32(message.baseInvestmintPeriodAmpere);
    }
    if (message.minInvestmintPeriod !== 0) {
      writer.uint32(48).uint32(message.minInvestmintPeriod);
    }
    if (message.baseInvestmintAmountVolt !== undefined) {
      Coin.encode(message.baseInvestmintAmountVolt, writer.uint32(58).fork()).ldelim();
    }
    if (message.baseInvestmintAmountAmpere !== undefined) {
      Coin.encode(message.baseInvestmintAmountAmpere, writer.uint32(66).fork()).ldelim();
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
          message.maxSlots = reader.uint32();
          break;
        case 2:
          message.halvingPeriodVoltBlocks = reader.uint32();
          break;
        case 3:
          message.halvingPeriodAmpereBlocks = reader.uint32();
          break;
        case 4:
          message.baseInvestmintPeriodVolt = reader.uint32();
          break;
        case 5:
          message.baseInvestmintPeriodAmpere = reader.uint32();
          break;
        case 6:
          message.minInvestmintPeriod = reader.uint32();
          break;
        case 7:
          message.baseInvestmintAmountVolt = Coin.decode(reader, reader.uint32());
          break;
        case 8:
          message.baseInvestmintAmountAmpere = Coin.decode(reader, reader.uint32());
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
      maxSlots: isSet(object.maxSlots) ? Number(object.maxSlots) : 0,
      halvingPeriodVoltBlocks: isSet(object.halvingPeriodVoltBlocks) ? Number(object.halvingPeriodVoltBlocks) : 0,
      halvingPeriodAmpereBlocks: isSet(object.halvingPeriodAmpereBlocks) ? Number(object.halvingPeriodAmpereBlocks) : 0,
      baseInvestmintPeriodVolt: isSet(object.baseInvestmintPeriodVolt) ? Number(object.baseInvestmintPeriodVolt) : 0,
      baseInvestmintPeriodAmpere: isSet(object.baseInvestmintPeriodAmpere) ? Number(object.baseInvestmintPeriodAmpere) : 0,
      minInvestmintPeriod: isSet(object.minInvestmintPeriod) ? Number(object.minInvestmintPeriod) : 0,
      baseInvestmintAmountVolt: isSet(object.baseInvestmintAmountVolt) ? Coin.fromJSON(object.baseInvestmintAmountVolt) : undefined,
      baseInvestmintAmountAmpere: isSet(object.baseInvestmintAmountAmpere) ? Coin.fromJSON(object.baseInvestmintAmountAmpere) : undefined
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.maxSlots !== undefined && (obj.maxSlots = Math.round(message.maxSlots));
    message.halvingPeriodVoltBlocks !== undefined && (obj.halvingPeriodVoltBlocks = Math.round(message.halvingPeriodVoltBlocks));
    message.halvingPeriodAmpereBlocks !== undefined && (obj.halvingPeriodAmpereBlocks = Math.round(message.halvingPeriodAmpereBlocks));
    message.baseInvestmintPeriodVolt !== undefined && (obj.baseInvestmintPeriodVolt = Math.round(message.baseInvestmintPeriodVolt));
    message.baseInvestmintPeriodAmpere !== undefined && (obj.baseInvestmintPeriodAmpere = Math.round(message.baseInvestmintPeriodAmpere));
    message.minInvestmintPeriod !== undefined && (obj.minInvestmintPeriod = Math.round(message.minInvestmintPeriod));
    message.baseInvestmintAmountVolt !== undefined && (obj.baseInvestmintAmountVolt = message.baseInvestmintAmountVolt ? Coin.toJSON(message.baseInvestmintAmountVolt) : undefined);
    message.baseInvestmintAmountAmpere !== undefined && (obj.baseInvestmintAmountAmpere = message.baseInvestmintAmountAmpere ? Coin.toJSON(message.baseInvestmintAmountAmpere) : undefined);
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.maxSlots = object.maxSlots ?? 0;
    message.halvingPeriodVoltBlocks = object.halvingPeriodVoltBlocks ?? 0;
    message.halvingPeriodAmpereBlocks = object.halvingPeriodAmpereBlocks ?? 0;
    message.baseInvestmintPeriodVolt = object.baseInvestmintPeriodVolt ?? 0;
    message.baseInvestmintPeriodAmpere = object.baseInvestmintPeriodAmpere ?? 0;
    message.minInvestmintPeriod = object.minInvestmintPeriod ?? 0;
    message.baseInvestmintAmountVolt = object.baseInvestmintAmountVolt !== undefined && object.baseInvestmintAmountVolt !== null ? Coin.fromPartial(object.baseInvestmintAmountVolt) : undefined;
    message.baseInvestmintAmountAmpere = object.baseInvestmintAmountAmpere !== undefined && object.baseInvestmintAmountAmpere !== null ? Coin.fromPartial(object.baseInvestmintAmountAmpere) : undefined;
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.max_slots !== undefined && object.max_slots !== null) {
      message.maxSlots = object.max_slots;
    }
    if (object.halving_period_volt_blocks !== undefined && object.halving_period_volt_blocks !== null) {
      message.halvingPeriodVoltBlocks = object.halving_period_volt_blocks;
    }
    if (object.halving_period_ampere_blocks !== undefined && object.halving_period_ampere_blocks !== null) {
      message.halvingPeriodAmpereBlocks = object.halving_period_ampere_blocks;
    }
    if (object.base_investmint_period_volt !== undefined && object.base_investmint_period_volt !== null) {
      message.baseInvestmintPeriodVolt = object.base_investmint_period_volt;
    }
    if (object.base_investmint_period_ampere !== undefined && object.base_investmint_period_ampere !== null) {
      message.baseInvestmintPeriodAmpere = object.base_investmint_period_ampere;
    }
    if (object.min_investmint_period !== undefined && object.min_investmint_period !== null) {
      message.minInvestmintPeriod = object.min_investmint_period;
    }
    if (object.base_investmint_amount_volt !== undefined && object.base_investmint_amount_volt !== null) {
      message.baseInvestmintAmountVolt = Coin.fromAmino(object.base_investmint_amount_volt);
    }
    if (object.base_investmint_amount_ampere !== undefined && object.base_investmint_amount_ampere !== null) {
      message.baseInvestmintAmountAmpere = Coin.fromAmino(object.base_investmint_amount_ampere);
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.max_slots = message.maxSlots === 0 ? undefined : message.maxSlots;
    obj.halving_period_volt_blocks = message.halvingPeriodVoltBlocks === 0 ? undefined : message.halvingPeriodVoltBlocks;
    obj.halving_period_ampere_blocks = message.halvingPeriodAmpereBlocks === 0 ? undefined : message.halvingPeriodAmpereBlocks;
    obj.base_investmint_period_volt = message.baseInvestmintPeriodVolt === 0 ? undefined : message.baseInvestmintPeriodVolt;
    obj.base_investmint_period_ampere = message.baseInvestmintPeriodAmpere === 0 ? undefined : message.baseInvestmintPeriodAmpere;
    obj.min_investmint_period = message.minInvestmintPeriod === 0 ? undefined : message.minInvestmintPeriod;
    obj.base_investmint_amount_volt = message.baseInvestmintAmountVolt ? Coin.toAmino(message.baseInvestmintAmountVolt) : undefined;
    obj.base_investmint_amount_ampere = message.baseInvestmintAmountAmpere ? Coin.toAmino(message.baseInvestmintAmountAmpere) : undefined;
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
      typeUrl: "/cyber.resources.v1beta1.Params",
      value: Params.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(Params.typeUrl, Params);