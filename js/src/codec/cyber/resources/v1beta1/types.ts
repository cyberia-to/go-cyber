/* eslint-disable */
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "cyber.resources.v1beta1";

export interface Params {
  maxSlots: number;
  halvingPeriodVoltBlocks: number;
  halvingPeriodAmpereBlocks: number;
  baseInvestmintPeriodVolt: number;
  baseInvestmintPeriodAmpere: number;
  minInvestmintPeriod: number;
  baseInvestmintAmountVolt?: Coin;
  baseInvestmintAmountAmpere?: Coin;
}

function createBaseParams(): Params {
  return {
    maxSlots: 0,
    halvingPeriodVoltBlocks: 0,
    halvingPeriodAmpereBlocks: 0,
    baseInvestmintPeriodVolt: 0,
    baseInvestmintPeriodAmpere: 0,
    minInvestmintPeriod: 0,
    baseInvestmintAmountVolt: undefined,
    baseInvestmintAmountAmpere: undefined,
  };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      halvingPeriodVoltBlocks: isSet(object.halvingPeriodVoltBlocks)
        ? Number(object.halvingPeriodVoltBlocks)
        : 0,
      halvingPeriodAmpereBlocks: isSet(object.halvingPeriodAmpereBlocks)
        ? Number(object.halvingPeriodAmpereBlocks)
        : 0,
      baseInvestmintPeriodVolt: isSet(object.baseInvestmintPeriodVolt)
        ? Number(object.baseInvestmintPeriodVolt)
        : 0,
      baseInvestmintPeriodAmpere: isSet(object.baseInvestmintPeriodAmpere)
        ? Number(object.baseInvestmintPeriodAmpere)
        : 0,
      minInvestmintPeriod: isSet(object.minInvestmintPeriod) ? Number(object.minInvestmintPeriod) : 0,
      baseInvestmintAmountVolt: isSet(object.baseInvestmintAmountVolt)
        ? Coin.fromJSON(object.baseInvestmintAmountVolt)
        : undefined,
      baseInvestmintAmountAmpere: isSet(object.baseInvestmintAmountAmpere)
        ? Coin.fromJSON(object.baseInvestmintAmountAmpere)
        : undefined,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.maxSlots !== undefined && (obj.maxSlots = Math.round(message.maxSlots));
    message.halvingPeriodVoltBlocks !== undefined &&
      (obj.halvingPeriodVoltBlocks = Math.round(message.halvingPeriodVoltBlocks));
    message.halvingPeriodAmpereBlocks !== undefined &&
      (obj.halvingPeriodAmpereBlocks = Math.round(message.halvingPeriodAmpereBlocks));
    message.baseInvestmintPeriodVolt !== undefined &&
      (obj.baseInvestmintPeriodVolt = Math.round(message.baseInvestmintPeriodVolt));
    message.baseInvestmintPeriodAmpere !== undefined &&
      (obj.baseInvestmintPeriodAmpere = Math.round(message.baseInvestmintPeriodAmpere));
    message.minInvestmintPeriod !== undefined &&
      (obj.minInvestmintPeriod = Math.round(message.minInvestmintPeriod));
    message.baseInvestmintAmountVolt !== undefined &&
      (obj.baseInvestmintAmountVolt = message.baseInvestmintAmountVolt
        ? Coin.toJSON(message.baseInvestmintAmountVolt)
        : undefined);
    message.baseInvestmintAmountAmpere !== undefined &&
      (obj.baseInvestmintAmountAmpere = message.baseInvestmintAmountAmpere
        ? Coin.toJSON(message.baseInvestmintAmountAmpere)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.maxSlots = object.maxSlots ?? 0;
    message.halvingPeriodVoltBlocks = object.halvingPeriodVoltBlocks ?? 0;
    message.halvingPeriodAmpereBlocks = object.halvingPeriodAmpereBlocks ?? 0;
    message.baseInvestmintPeriodVolt = object.baseInvestmintPeriodVolt ?? 0;
    message.baseInvestmintPeriodAmpere = object.baseInvestmintPeriodAmpere ?? 0;
    message.minInvestmintPeriod = object.minInvestmintPeriod ?? 0;
    message.baseInvestmintAmountVolt =
      object.baseInvestmintAmountVolt !== undefined && object.baseInvestmintAmountVolt !== null
        ? Coin.fromPartial(object.baseInvestmintAmountVolt)
        : undefined;
    message.baseInvestmintAmountAmpere =
      object.baseInvestmintAmountAmpere !== undefined && object.baseInvestmintAmountAmpere !== null
        ? Coin.fromPartial(object.baseInvestmintAmountAmpere)
        : undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
