//@ts-nocheck
import { Trigger, TriggerAmino, TriggerSDKType, Load, LoadAmino, LoadSDKType, Params, ParamsAmino, ParamsSDKType } from "./types";
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
export interface MsgCreateThought {
  program: string;
  trigger: Trigger;
  load: Load;
  name: string;
  particle: string;
}
export interface MsgCreateThoughtProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought";
  value: Uint8Array;
}
export interface MsgCreateThoughtAmino {
  program?: string;
  trigger?: TriggerAmino;
  load?: LoadAmino;
  name?: string;
  particle?: string;
}
export interface MsgCreateThoughtAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgCreateThought";
  value: MsgCreateThoughtAmino;
}
export interface MsgCreateThoughtSDKType {
  program: string;
  trigger: TriggerSDKType;
  load: LoadSDKType;
  name: string;
  particle: string;
}
export interface MsgForgetThought {
  program: string;
  name: string;
}
export interface MsgForgetThoughtProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought";
  value: Uint8Array;
}
export interface MsgForgetThoughtAmino {
  program?: string;
  name?: string;
}
export interface MsgForgetThoughtAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgForgetThought";
  value: MsgForgetThoughtAmino;
}
export interface MsgForgetThoughtSDKType {
  program: string;
  name: string;
}
export interface MsgChangeThoughtParticle {
  program: string;
  name: string;
  particle: string;
}
export interface MsgChangeThoughtParticleProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle";
  value: Uint8Array;
}
export interface MsgChangeThoughtParticleAmino {
  program?: string;
  name?: string;
  particle?: string;
}
export interface MsgChangeThoughtParticleAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle";
  value: MsgChangeThoughtParticleAmino;
}
export interface MsgChangeThoughtParticleSDKType {
  program: string;
  name: string;
  particle: string;
}
export interface MsgChangeThoughtName {
  program: string;
  name: string;
  newName: string;
}
export interface MsgChangeThoughtNameProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName";
  value: Uint8Array;
}
export interface MsgChangeThoughtNameAmino {
  program?: string;
  name?: string;
  new_name?: string;
}
export interface MsgChangeThoughtNameAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtName";
  value: MsgChangeThoughtNameAmino;
}
export interface MsgChangeThoughtNameSDKType {
  program: string;
  name: string;
  new_name: string;
}
export interface MsgChangeThoughtInput {
  program: string;
  name: string;
  input: string;
}
export interface MsgChangeThoughtInputProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput";
  value: Uint8Array;
}
export interface MsgChangeThoughtInputAmino {
  program?: string;
  name?: string;
  input?: string;
}
export interface MsgChangeThoughtInputAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtInput";
  value: MsgChangeThoughtInputAmino;
}
export interface MsgChangeThoughtInputSDKType {
  program: string;
  name: string;
  input: string;
}
export interface MsgChangeThoughtGasPrice {
  program: string;
  name: string;
  gasPrice: Coin;
}
export interface MsgChangeThoughtGasPriceProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice";
  value: Uint8Array;
}
export interface MsgChangeThoughtGasPriceAmino {
  program?: string;
  name?: string;
  gas_price?: CoinAmino;
}
export interface MsgChangeThoughtGasPriceAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice";
  value: MsgChangeThoughtGasPriceAmino;
}
export interface MsgChangeThoughtGasPriceSDKType {
  program: string;
  name: string;
  gas_price: CoinSDKType;
}
export interface MsgChangeThoughtPeriod {
  program: string;
  name: string;
  period: bigint;
}
export interface MsgChangeThoughtPeriodProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod";
  value: Uint8Array;
}
export interface MsgChangeThoughtPeriodAmino {
  program?: string;
  name?: string;
  period?: string;
}
export interface MsgChangeThoughtPeriodAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod";
  value: MsgChangeThoughtPeriodAmino;
}
export interface MsgChangeThoughtPeriodSDKType {
  program: string;
  name: string;
  period: bigint;
}
export interface MsgChangeThoughtBlock {
  program: string;
  name: string;
  block: bigint;
}
export interface MsgChangeThoughtBlockProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock";
  value: Uint8Array;
}
export interface MsgChangeThoughtBlockAmino {
  program?: string;
  name?: string;
  block?: string;
}
export interface MsgChangeThoughtBlockAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock";
  value: MsgChangeThoughtBlockAmino;
}
export interface MsgChangeThoughtBlockSDKType {
  program: string;
  name: string;
  block: bigint;
}
export interface MsgUpdateParams {
  authority: string;
  params: Params;
}
export interface MsgUpdateParamsProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams";
  value: Uint8Array;
}
export interface MsgUpdateParamsAmino {
  authority?: string;
  params?: ParamsAmino;
}
export interface MsgUpdateParamsAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgUpdateParams";
  value: MsgUpdateParamsAmino;
}
export interface MsgUpdateParamsSDKType {
  authority: string;
  params: ParamsSDKType;
}
export interface MsgCreateThoughtResponse {}
export interface MsgCreateThoughtResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgCreateThoughtResponse";
  value: Uint8Array;
}
export interface MsgCreateThoughtResponseAmino {}
export interface MsgCreateThoughtResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgCreateThoughtResponse";
  value: MsgCreateThoughtResponseAmino;
}
export interface MsgCreateThoughtResponseSDKType {}
export interface MsgForgetThoughtResponse {}
export interface MsgForgetThoughtResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgForgetThoughtResponse";
  value: Uint8Array;
}
export interface MsgForgetThoughtResponseAmino {}
export interface MsgForgetThoughtResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgForgetThoughtResponse";
  value: MsgForgetThoughtResponseAmino;
}
export interface MsgForgetThoughtResponseSDKType {}
export interface MsgChangeThoughtParticleResponse {}
export interface MsgChangeThoughtParticleResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticleResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtParticleResponseAmino {}
export interface MsgChangeThoughtParticleResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtParticleResponse";
  value: MsgChangeThoughtParticleResponseAmino;
}
export interface MsgChangeThoughtParticleResponseSDKType {}
export interface MsgChangeThoughtNameResponse {}
export interface MsgChangeThoughtNameResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtNameResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtNameResponseAmino {}
export interface MsgChangeThoughtNameResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtNameResponse";
  value: MsgChangeThoughtNameResponseAmino;
}
export interface MsgChangeThoughtNameResponseSDKType {}
export interface MsgChangeThoughtInputResponse {}
export interface MsgChangeThoughtInputResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInputResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtInputResponseAmino {}
export interface MsgChangeThoughtInputResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtInputResponse";
  value: MsgChangeThoughtInputResponseAmino;
}
export interface MsgChangeThoughtInputResponseSDKType {}
export interface MsgChangeThoughtGasPriceResponse {}
export interface MsgChangeThoughtGasPriceResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPriceResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtGasPriceResponseAmino {}
export interface MsgChangeThoughtGasPriceResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPriceResponse";
  value: MsgChangeThoughtGasPriceResponseAmino;
}
export interface MsgChangeThoughtGasPriceResponseSDKType {}
export interface MsgChangeThoughtPeriodResponse {}
export interface MsgChangeThoughtPeriodResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriodResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtPeriodResponseAmino {}
export interface MsgChangeThoughtPeriodResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriodResponse";
  value: MsgChangeThoughtPeriodResponseAmino;
}
export interface MsgChangeThoughtPeriodResponseSDKType {}
export interface MsgChangeThoughtBlockResponse {}
export interface MsgChangeThoughtBlockResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlockResponse";
  value: Uint8Array;
}
export interface MsgChangeThoughtBlockResponseAmino {}
export interface MsgChangeThoughtBlockResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgChangeThoughtBlockResponse";
  value: MsgChangeThoughtBlockResponseAmino;
}
export interface MsgChangeThoughtBlockResponseSDKType {}
export interface MsgUpdateParamsResponse {}
export interface MsgUpdateParamsResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParamsResponse";
  value: Uint8Array;
}
export interface MsgUpdateParamsResponseAmino {}
export interface MsgUpdateParamsResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.MsgUpdateParamsResponse";
  value: MsgUpdateParamsResponseAmino;
}
export interface MsgUpdateParamsResponseSDKType {}
function createBaseMsgCreateThought(): MsgCreateThought {
  return {
    program: "",
    trigger: Trigger.fromPartial({}),
    load: Load.fromPartial({}),
    name: "",
    particle: ""
  };
}
export const MsgCreateThought = {
  typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought",
  is(o: any): o is MsgCreateThought {
    return o && (o.$typeUrl === MsgCreateThought.typeUrl || typeof o.program === "string" && Trigger.is(o.trigger) && Load.is(o.load) && typeof o.name === "string" && typeof o.particle === "string");
  },
  isSDK(o: any): o is MsgCreateThoughtSDKType {
    return o && (o.$typeUrl === MsgCreateThought.typeUrl || typeof o.program === "string" && Trigger.isSDK(o.trigger) && Load.isSDK(o.load) && typeof o.name === "string" && typeof o.particle === "string");
  },
  isAmino(o: any): o is MsgCreateThoughtAmino {
    return o && (o.$typeUrl === MsgCreateThought.typeUrl || typeof o.program === "string" && Trigger.isAmino(o.trigger) && Load.isAmino(o.load) && typeof o.name === "string" && typeof o.particle === "string");
  },
  encode(message: MsgCreateThought, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.trigger !== undefined) {
      Trigger.encode(message.trigger, writer.uint32(18).fork()).ldelim();
    }
    if (message.load !== undefined) {
      Load.encode(message.load, writer.uint32(26).fork()).ldelim();
    }
    if (message.name !== "") {
      writer.uint32(34).string(message.name);
    }
    if (message.particle !== "") {
      writer.uint32(42).string(message.particle);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateThought {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateThought();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.trigger = Trigger.decode(reader, reader.uint32());
          break;
        case 3:
          message.load = Load.decode(reader, reader.uint32());
          break;
        case 4:
          message.name = reader.string();
          break;
        case 5:
          message.particle = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgCreateThought {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      trigger: isSet(object.trigger) ? Trigger.fromJSON(object.trigger) : undefined,
      load: isSet(object.load) ? Load.fromJSON(object.load) : undefined,
      name: isSet(object.name) ? String(object.name) : "",
      particle: isSet(object.particle) ? String(object.particle) : ""
    };
  },
  toJSON(message: MsgCreateThought): JsonSafe<MsgCreateThought> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.trigger !== undefined && (obj.trigger = message.trigger ? Trigger.toJSON(message.trigger) : undefined);
    message.load !== undefined && (obj.load = message.load ? Load.toJSON(message.load) : undefined);
    message.name !== undefined && (obj.name = message.name);
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },
  fromPartial(object: Partial<MsgCreateThought>): MsgCreateThought {
    const message = createBaseMsgCreateThought();
    message.program = object.program ?? "";
    message.trigger = object.trigger !== undefined && object.trigger !== null ? Trigger.fromPartial(object.trigger) : undefined;
    message.load = object.load !== undefined && object.load !== null ? Load.fromPartial(object.load) : undefined;
    message.name = object.name ?? "";
    message.particle = object.particle ?? "";
    return message;
  },
  fromAmino(object: MsgCreateThoughtAmino): MsgCreateThought {
    const message = createBaseMsgCreateThought();
    if (object.program !== undefined && object.program !== null) {
      message.program = object.program;
    }
    if (object.trigger !== undefined && object.trigger !== null) {
      message.trigger = Trigger.fromAmino(object.trigger);
    }
    if (object.load !== undefined && object.load !== null) {
      message.load = Load.fromAmino(object.load);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.particle !== undefined && object.particle !== null) {
      message.particle = object.particle;
    }
    return message;
  },
  toAmino(message: MsgCreateThought): MsgCreateThoughtAmino {
    const obj: any = {};
    obj.program = message.program === "" ? undefined : message.program;
    obj.trigger = message.trigger ? Trigger.toAmino(message.trigger) : undefined;
    obj.load = message.load ? Load.toAmino(message.load) : undefined;
    obj.name = message.name === "" ? undefined : message.name;
    obj.particle = message.particle === "" ? undefined : message.particle;
    return obj;
  },
  fromAminoMsg(object: MsgCreateThoughtAminoMsg): MsgCreateThought {
    return MsgCreateThought.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgCreateThoughtProtoMsg): MsgCreateThought {
    return MsgCreateThought.decode(message.value);
  },
  toProto(message: MsgCreateThought): Uint8Array {
    return MsgCreateThought.encode(message).finish();
  },
  toProtoMsg(message: MsgCreateThought): MsgCreateThoughtProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought",
      value: MsgCreateThought.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgCreateThought.typeUrl, MsgCreateThought);
function createBaseMsgForgetThought(): MsgForgetThought {
  return {
    program: "",
    name: ""
  };
}
export const MsgForgetThought = {
  typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought",
  is(o: any): o is MsgForgetThought {
    return o && (o.$typeUrl === MsgForgetThought.typeUrl || typeof o.program === "string" && typeof o.name === "string");
  },
  isSDK(o: any): o is MsgForgetThoughtSDKType {
    return o && (o.$typeUrl === MsgForgetThought.typeUrl || typeof o.program === "string" && typeof o.name === "string");
  },
  isAmino(o: any): o is MsgForgetThoughtAmino {
    return o && (o.$typeUrl === MsgForgetThought.typeUrl || typeof o.program === "string" && typeof o.name === "string");
  },
  encode(message: MsgForgetThought, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgForgetThought {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgForgetThought();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgForgetThought {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : ""
    };
  },
  toJSON(message: MsgForgetThought): JsonSafe<MsgForgetThought> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
  fromPartial(object: Partial<MsgForgetThought>): MsgForgetThought {
    const message = createBaseMsgForgetThought();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    return message;
  },
  fromAmino(object: MsgForgetThoughtAmino): MsgForgetThought {
    const message = createBaseMsgForgetThought();
    if (object.program !== undefined && object.program !== null) {
      message.program = object.program;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    return message;
  },
  toAmino(message: MsgForgetThought): MsgForgetThoughtAmino {
    const obj: any = {};
    obj.program = message.program === "" ? undefined : message.program;
    obj.name = message.name === "" ? undefined : message.name;
    return obj;
  },
  fromAminoMsg(object: MsgForgetThoughtAminoMsg): MsgForgetThought {
    return MsgForgetThought.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgForgetThoughtProtoMsg): MsgForgetThought {
    return MsgForgetThought.decode(message.value);
  },
  toProto(message: MsgForgetThought): Uint8Array {
    return MsgForgetThought.encode(message).finish();
  },
  toProtoMsg(message: MsgForgetThought): MsgForgetThoughtProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought",
      value: MsgForgetThought.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgForgetThought.typeUrl, MsgForgetThought);
function createBaseMsgChangeThoughtParticle(): MsgChangeThoughtParticle {
  return {
    program: "",
    name: "",
    particle: ""
  };
}
export const MsgChangeThoughtParticle = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle",
  is(o: any): o is MsgChangeThoughtParticle {
    return o && (o.$typeUrl === MsgChangeThoughtParticle.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.particle === "string");
  },
  isSDK(o: any): o is MsgChangeThoughtParticleSDKType {
    return o && (o.$typeUrl === MsgChangeThoughtParticle.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.particle === "string");
  },
  isAmino(o: any): o is MsgChangeThoughtParticleAmino {
    return o && (o.$typeUrl === MsgChangeThoughtParticle.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.particle === "string");
  },
  encode(message: MsgChangeThoughtParticle, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.particle !== "") {
      writer.uint32(26).string(message.particle);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtParticle {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtParticle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.particle = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtParticle {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      particle: isSet(object.particle) ? String(object.particle) : ""
    };
  },
  toJSON(message: MsgChangeThoughtParticle): JsonSafe<MsgChangeThoughtParticle> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtParticle>): MsgChangeThoughtParticle {
    const message = createBaseMsgChangeThoughtParticle();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.particle = object.particle ?? "";
    return message;
  },
  fromAmino(object: MsgChangeThoughtParticleAmino): MsgChangeThoughtParticle {
    const message = createBaseMsgChangeThoughtParticle();
    if (object.program !== undefined && object.program !== null) {
      message.program = object.program;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.particle !== undefined && object.particle !== null) {
      message.particle = object.particle;
    }
    return message;
  },
  toAmino(message: MsgChangeThoughtParticle): MsgChangeThoughtParticleAmino {
    const obj: any = {};
    obj.program = message.program === "" ? undefined : message.program;
    obj.name = message.name === "" ? undefined : message.name;
    obj.particle = message.particle === "" ? undefined : message.particle;
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtParticleAminoMsg): MsgChangeThoughtParticle {
    return MsgChangeThoughtParticle.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtParticleProtoMsg): MsgChangeThoughtParticle {
    return MsgChangeThoughtParticle.decode(message.value);
  },
  toProto(message: MsgChangeThoughtParticle): Uint8Array {
    return MsgChangeThoughtParticle.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtParticle): MsgChangeThoughtParticleProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle",
      value: MsgChangeThoughtParticle.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtParticle.typeUrl, MsgChangeThoughtParticle);
function createBaseMsgChangeThoughtName(): MsgChangeThoughtName {
  return {
    program: "",
    name: "",
    newName: ""
  };
}
export const MsgChangeThoughtName = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName",
  is(o: any): o is MsgChangeThoughtName {
    return o && (o.$typeUrl === MsgChangeThoughtName.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.newName === "string");
  },
  isSDK(o: any): o is MsgChangeThoughtNameSDKType {
    return o && (o.$typeUrl === MsgChangeThoughtName.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.new_name === "string");
  },
  isAmino(o: any): o is MsgChangeThoughtNameAmino {
    return o && (o.$typeUrl === MsgChangeThoughtName.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.new_name === "string");
  },
  encode(message: MsgChangeThoughtName, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.newName !== "") {
      writer.uint32(26).string(message.newName);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtName {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtName();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.newName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtName {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      newName: isSet(object.newName) ? String(object.newName) : ""
    };
  },
  toJSON(message: MsgChangeThoughtName): JsonSafe<MsgChangeThoughtName> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.newName !== undefined && (obj.newName = message.newName);
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtName>): MsgChangeThoughtName {
    const message = createBaseMsgChangeThoughtName();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.newName = object.newName ?? "";
    return message;
  },
  fromAmino(object: MsgChangeThoughtNameAmino): MsgChangeThoughtName {
    const message = createBaseMsgChangeThoughtName();
    if (object.program !== undefined && object.program !== null) {
      message.program = object.program;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.new_name !== undefined && object.new_name !== null) {
      message.newName = object.new_name;
    }
    return message;
  },
  toAmino(message: MsgChangeThoughtName): MsgChangeThoughtNameAmino {
    const obj: any = {};
    obj.program = message.program === "" ? undefined : message.program;
    obj.name = message.name === "" ? undefined : message.name;
    obj.new_name = message.newName === "" ? undefined : message.newName;
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtNameAminoMsg): MsgChangeThoughtName {
    return MsgChangeThoughtName.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtNameProtoMsg): MsgChangeThoughtName {
    return MsgChangeThoughtName.decode(message.value);
  },
  toProto(message: MsgChangeThoughtName): Uint8Array {
    return MsgChangeThoughtName.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtName): MsgChangeThoughtNameProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName",
      value: MsgChangeThoughtName.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtName.typeUrl, MsgChangeThoughtName);
function createBaseMsgChangeThoughtInput(): MsgChangeThoughtInput {
  return {
    program: "",
    name: "",
    input: ""
  };
}
export const MsgChangeThoughtInput = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput",
  is(o: any): o is MsgChangeThoughtInput {
    return o && (o.$typeUrl === MsgChangeThoughtInput.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.input === "string");
  },
  isSDK(o: any): o is MsgChangeThoughtInputSDKType {
    return o && (o.$typeUrl === MsgChangeThoughtInput.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.input === "string");
  },
  isAmino(o: any): o is MsgChangeThoughtInputAmino {
    return o && (o.$typeUrl === MsgChangeThoughtInput.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.input === "string");
  },
  encode(message: MsgChangeThoughtInput, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.input !== "") {
      writer.uint32(26).string(message.input);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtInput {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtInput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.input = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtInput {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      input: isSet(object.input) ? String(object.input) : ""
    };
  },
  toJSON(message: MsgChangeThoughtInput): JsonSafe<MsgChangeThoughtInput> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.input !== undefined && (obj.input = message.input);
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtInput>): MsgChangeThoughtInput {
    const message = createBaseMsgChangeThoughtInput();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.input = object.input ?? "";
    return message;
  },
  fromAmino(object: MsgChangeThoughtInputAmino): MsgChangeThoughtInput {
    const message = createBaseMsgChangeThoughtInput();
    if (object.program !== undefined && object.program !== null) {
      message.program = object.program;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.input !== undefined && object.input !== null) {
      message.input = object.input;
    }
    return message;
  },
  toAmino(message: MsgChangeThoughtInput): MsgChangeThoughtInputAmino {
    const obj: any = {};
    obj.program = message.program === "" ? undefined : message.program;
    obj.name = message.name === "" ? undefined : message.name;
    obj.input = message.input === "" ? undefined : message.input;
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtInputAminoMsg): MsgChangeThoughtInput {
    return MsgChangeThoughtInput.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtInputProtoMsg): MsgChangeThoughtInput {
    return MsgChangeThoughtInput.decode(message.value);
  },
  toProto(message: MsgChangeThoughtInput): Uint8Array {
    return MsgChangeThoughtInput.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtInput): MsgChangeThoughtInputProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput",
      value: MsgChangeThoughtInput.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtInput.typeUrl, MsgChangeThoughtInput);
function createBaseMsgChangeThoughtGasPrice(): MsgChangeThoughtGasPrice {
  return {
    program: "",
    name: "",
    gasPrice: Coin.fromPartial({})
  };
}
export const MsgChangeThoughtGasPrice = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice",
  is(o: any): o is MsgChangeThoughtGasPrice {
    return o && (o.$typeUrl === MsgChangeThoughtGasPrice.typeUrl || typeof o.program === "string" && typeof o.name === "string" && Coin.is(o.gasPrice));
  },
  isSDK(o: any): o is MsgChangeThoughtGasPriceSDKType {
    return o && (o.$typeUrl === MsgChangeThoughtGasPrice.typeUrl || typeof o.program === "string" && typeof o.name === "string" && Coin.isSDK(o.gas_price));
  },
  isAmino(o: any): o is MsgChangeThoughtGasPriceAmino {
    return o && (o.$typeUrl === MsgChangeThoughtGasPrice.typeUrl || typeof o.program === "string" && typeof o.name === "string" && Coin.isAmino(o.gas_price));
  },
  encode(message: MsgChangeThoughtGasPrice, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.gasPrice !== undefined) {
      Coin.encode(message.gasPrice, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtGasPrice {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtGasPrice();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.gasPrice = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtGasPrice {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      gasPrice: isSet(object.gasPrice) ? Coin.fromJSON(object.gasPrice) : undefined
    };
  },
  toJSON(message: MsgChangeThoughtGasPrice): JsonSafe<MsgChangeThoughtGasPrice> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.gasPrice !== undefined && (obj.gasPrice = message.gasPrice ? Coin.toJSON(message.gasPrice) : undefined);
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtGasPrice>): MsgChangeThoughtGasPrice {
    const message = createBaseMsgChangeThoughtGasPrice();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.gasPrice = object.gasPrice !== undefined && object.gasPrice !== null ? Coin.fromPartial(object.gasPrice) : undefined;
    return message;
  },
  fromAmino(object: MsgChangeThoughtGasPriceAmino): MsgChangeThoughtGasPrice {
    const message = createBaseMsgChangeThoughtGasPrice();
    if (object.program !== undefined && object.program !== null) {
      message.program = object.program;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.gas_price !== undefined && object.gas_price !== null) {
      message.gasPrice = Coin.fromAmino(object.gas_price);
    }
    return message;
  },
  toAmino(message: MsgChangeThoughtGasPrice): MsgChangeThoughtGasPriceAmino {
    const obj: any = {};
    obj.program = message.program === "" ? undefined : message.program;
    obj.name = message.name === "" ? undefined : message.name;
    obj.gas_price = message.gasPrice ? Coin.toAmino(message.gasPrice) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtGasPriceAminoMsg): MsgChangeThoughtGasPrice {
    return MsgChangeThoughtGasPrice.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtGasPriceProtoMsg): MsgChangeThoughtGasPrice {
    return MsgChangeThoughtGasPrice.decode(message.value);
  },
  toProto(message: MsgChangeThoughtGasPrice): Uint8Array {
    return MsgChangeThoughtGasPrice.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtGasPrice): MsgChangeThoughtGasPriceProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice",
      value: MsgChangeThoughtGasPrice.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtGasPrice.typeUrl, MsgChangeThoughtGasPrice);
function createBaseMsgChangeThoughtPeriod(): MsgChangeThoughtPeriod {
  return {
    program: "",
    name: "",
    period: BigInt(0)
  };
}
export const MsgChangeThoughtPeriod = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod",
  is(o: any): o is MsgChangeThoughtPeriod {
    return o && (o.$typeUrl === MsgChangeThoughtPeriod.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.period === "bigint");
  },
  isSDK(o: any): o is MsgChangeThoughtPeriodSDKType {
    return o && (o.$typeUrl === MsgChangeThoughtPeriod.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.period === "bigint");
  },
  isAmino(o: any): o is MsgChangeThoughtPeriodAmino {
    return o && (o.$typeUrl === MsgChangeThoughtPeriod.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.period === "bigint");
  },
  encode(message: MsgChangeThoughtPeriod, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.period !== BigInt(0)) {
      writer.uint32(24).uint64(message.period);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtPeriod {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtPeriod();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.period = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtPeriod {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      period: isSet(object.period) ? BigInt(object.period.toString()) : BigInt(0)
    };
  },
  toJSON(message: MsgChangeThoughtPeriod): JsonSafe<MsgChangeThoughtPeriod> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.period !== undefined && (obj.period = (message.period || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtPeriod>): MsgChangeThoughtPeriod {
    const message = createBaseMsgChangeThoughtPeriod();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.period = object.period !== undefined && object.period !== null ? BigInt(object.period.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: MsgChangeThoughtPeriodAmino): MsgChangeThoughtPeriod {
    const message = createBaseMsgChangeThoughtPeriod();
    if (object.program !== undefined && object.program !== null) {
      message.program = object.program;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.period !== undefined && object.period !== null) {
      message.period = BigInt(object.period);
    }
    return message;
  },
  toAmino(message: MsgChangeThoughtPeriod): MsgChangeThoughtPeriodAmino {
    const obj: any = {};
    obj.program = message.program === "" ? undefined : message.program;
    obj.name = message.name === "" ? undefined : message.name;
    obj.period = message.period !== BigInt(0) ? message.period.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtPeriodAminoMsg): MsgChangeThoughtPeriod {
    return MsgChangeThoughtPeriod.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtPeriodProtoMsg): MsgChangeThoughtPeriod {
    return MsgChangeThoughtPeriod.decode(message.value);
  },
  toProto(message: MsgChangeThoughtPeriod): Uint8Array {
    return MsgChangeThoughtPeriod.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtPeriod): MsgChangeThoughtPeriodProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod",
      value: MsgChangeThoughtPeriod.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtPeriod.typeUrl, MsgChangeThoughtPeriod);
function createBaseMsgChangeThoughtBlock(): MsgChangeThoughtBlock {
  return {
    program: "",
    name: "",
    block: BigInt(0)
  };
}
export const MsgChangeThoughtBlock = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock",
  is(o: any): o is MsgChangeThoughtBlock {
    return o && (o.$typeUrl === MsgChangeThoughtBlock.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.block === "bigint");
  },
  isSDK(o: any): o is MsgChangeThoughtBlockSDKType {
    return o && (o.$typeUrl === MsgChangeThoughtBlock.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.block === "bigint");
  },
  isAmino(o: any): o is MsgChangeThoughtBlockAmino {
    return o && (o.$typeUrl === MsgChangeThoughtBlock.typeUrl || typeof o.program === "string" && typeof o.name === "string" && typeof o.block === "bigint");
  },
  encode(message: MsgChangeThoughtBlock, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.block !== BigInt(0)) {
      writer.uint32(24).uint64(message.block);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtBlock {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtBlock();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.program = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.block = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgChangeThoughtBlock {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : "",
      block: isSet(object.block) ? BigInt(object.block.toString()) : BigInt(0)
    };
  },
  toJSON(message: MsgChangeThoughtBlock): JsonSafe<MsgChangeThoughtBlock> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    message.block !== undefined && (obj.block = (message.block || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<MsgChangeThoughtBlock>): MsgChangeThoughtBlock {
    const message = createBaseMsgChangeThoughtBlock();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    message.block = object.block !== undefined && object.block !== null ? BigInt(object.block.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: MsgChangeThoughtBlockAmino): MsgChangeThoughtBlock {
    const message = createBaseMsgChangeThoughtBlock();
    if (object.program !== undefined && object.program !== null) {
      message.program = object.program;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.block !== undefined && object.block !== null) {
      message.block = BigInt(object.block);
    }
    return message;
  },
  toAmino(message: MsgChangeThoughtBlock): MsgChangeThoughtBlockAmino {
    const obj: any = {};
    obj.program = message.program === "" ? undefined : message.program;
    obj.name = message.name === "" ? undefined : message.name;
    obj.block = message.block !== BigInt(0) ? message.block.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtBlockAminoMsg): MsgChangeThoughtBlock {
    return MsgChangeThoughtBlock.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtBlockProtoMsg): MsgChangeThoughtBlock {
    return MsgChangeThoughtBlock.decode(message.value);
  },
  toProto(message: MsgChangeThoughtBlock): Uint8Array {
    return MsgChangeThoughtBlock.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtBlock): MsgChangeThoughtBlockProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock",
      value: MsgChangeThoughtBlock.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtBlock.typeUrl, MsgChangeThoughtBlock);
function createBaseMsgUpdateParams(): MsgUpdateParams {
  return {
    authority: "",
    params: Params.fromPartial({})
  };
}
export const MsgUpdateParams = {
  typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams",
  is(o: any): o is MsgUpdateParams {
    return o && (o.$typeUrl === MsgUpdateParams.typeUrl || typeof o.authority === "string" && Params.is(o.params));
  },
  isSDK(o: any): o is MsgUpdateParamsSDKType {
    return o && (o.$typeUrl === MsgUpdateParams.typeUrl || typeof o.authority === "string" && Params.isSDK(o.params));
  },
  isAmino(o: any): o is MsgUpdateParamsAmino {
    return o && (o.$typeUrl === MsgUpdateParams.typeUrl || typeof o.authority === "string" && Params.isAmino(o.params));
  },
  encode(message: MsgUpdateParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgUpdateParams {
    return {
      authority: isSet(object.authority) ? String(object.authority) : "",
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined
    };
  },
  toJSON(message: MsgUpdateParams): JsonSafe<MsgUpdateParams> {
    const obj: any = {};
    message.authority !== undefined && (obj.authority = message.authority);
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },
  fromPartial(object: Partial<MsgUpdateParams>): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    message.authority = object.authority ?? "";
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: MsgUpdateParamsAmino): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: MsgUpdateParams): MsgUpdateParamsAmino {
    const obj: any = {};
    obj.authority = message.authority === "" ? undefined : message.authority;
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgUpdateParamsAminoMsg): MsgUpdateParams {
    return MsgUpdateParams.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUpdateParamsProtoMsg): MsgUpdateParams {
    return MsgUpdateParams.decode(message.value);
  },
  toProto(message: MsgUpdateParams): Uint8Array {
    return MsgUpdateParams.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateParams): MsgUpdateParamsProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams",
      value: MsgUpdateParams.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUpdateParams.typeUrl, MsgUpdateParams);
function createBaseMsgCreateThoughtResponse(): MsgCreateThoughtResponse {
  return {};
}
export const MsgCreateThoughtResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgCreateThoughtResponse",
  is(o: any): o is MsgCreateThoughtResponse {
    return o && o.$typeUrl === MsgCreateThoughtResponse.typeUrl;
  },
  isSDK(o: any): o is MsgCreateThoughtResponseSDKType {
    return o && o.$typeUrl === MsgCreateThoughtResponse.typeUrl;
  },
  isAmino(o: any): o is MsgCreateThoughtResponseAmino {
    return o && o.$typeUrl === MsgCreateThoughtResponse.typeUrl;
  },
  encode(_: MsgCreateThoughtResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateThoughtResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateThoughtResponse();
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
  fromJSON(_: any): MsgCreateThoughtResponse {
    return {};
  },
  toJSON(_: MsgCreateThoughtResponse): JsonSafe<MsgCreateThoughtResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgCreateThoughtResponse>): MsgCreateThoughtResponse {
    const message = createBaseMsgCreateThoughtResponse();
    return message;
  },
  fromAmino(_: MsgCreateThoughtResponseAmino): MsgCreateThoughtResponse {
    const message = createBaseMsgCreateThoughtResponse();
    return message;
  },
  toAmino(_: MsgCreateThoughtResponse): MsgCreateThoughtResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgCreateThoughtResponseAminoMsg): MsgCreateThoughtResponse {
    return MsgCreateThoughtResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgCreateThoughtResponseProtoMsg): MsgCreateThoughtResponse {
    return MsgCreateThoughtResponse.decode(message.value);
  },
  toProto(message: MsgCreateThoughtResponse): Uint8Array {
    return MsgCreateThoughtResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgCreateThoughtResponse): MsgCreateThoughtResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgCreateThoughtResponse",
      value: MsgCreateThoughtResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgCreateThoughtResponse.typeUrl, MsgCreateThoughtResponse);
function createBaseMsgForgetThoughtResponse(): MsgForgetThoughtResponse {
  return {};
}
export const MsgForgetThoughtResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgForgetThoughtResponse",
  is(o: any): o is MsgForgetThoughtResponse {
    return o && o.$typeUrl === MsgForgetThoughtResponse.typeUrl;
  },
  isSDK(o: any): o is MsgForgetThoughtResponseSDKType {
    return o && o.$typeUrl === MsgForgetThoughtResponse.typeUrl;
  },
  isAmino(o: any): o is MsgForgetThoughtResponseAmino {
    return o && o.$typeUrl === MsgForgetThoughtResponse.typeUrl;
  },
  encode(_: MsgForgetThoughtResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgForgetThoughtResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgForgetThoughtResponse();
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
  fromJSON(_: any): MsgForgetThoughtResponse {
    return {};
  },
  toJSON(_: MsgForgetThoughtResponse): JsonSafe<MsgForgetThoughtResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgForgetThoughtResponse>): MsgForgetThoughtResponse {
    const message = createBaseMsgForgetThoughtResponse();
    return message;
  },
  fromAmino(_: MsgForgetThoughtResponseAmino): MsgForgetThoughtResponse {
    const message = createBaseMsgForgetThoughtResponse();
    return message;
  },
  toAmino(_: MsgForgetThoughtResponse): MsgForgetThoughtResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgForgetThoughtResponseAminoMsg): MsgForgetThoughtResponse {
    return MsgForgetThoughtResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgForgetThoughtResponseProtoMsg): MsgForgetThoughtResponse {
    return MsgForgetThoughtResponse.decode(message.value);
  },
  toProto(message: MsgForgetThoughtResponse): Uint8Array {
    return MsgForgetThoughtResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgForgetThoughtResponse): MsgForgetThoughtResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgForgetThoughtResponse",
      value: MsgForgetThoughtResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgForgetThoughtResponse.typeUrl, MsgForgetThoughtResponse);
function createBaseMsgChangeThoughtParticleResponse(): MsgChangeThoughtParticleResponse {
  return {};
}
export const MsgChangeThoughtParticleResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticleResponse",
  is(o: any): o is MsgChangeThoughtParticleResponse {
    return o && o.$typeUrl === MsgChangeThoughtParticleResponse.typeUrl;
  },
  isSDK(o: any): o is MsgChangeThoughtParticleResponseSDKType {
    return o && o.$typeUrl === MsgChangeThoughtParticleResponse.typeUrl;
  },
  isAmino(o: any): o is MsgChangeThoughtParticleResponseAmino {
    return o && o.$typeUrl === MsgChangeThoughtParticleResponse.typeUrl;
  },
  encode(_: MsgChangeThoughtParticleResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtParticleResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtParticleResponse();
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
  fromJSON(_: any): MsgChangeThoughtParticleResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtParticleResponse): JsonSafe<MsgChangeThoughtParticleResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtParticleResponse>): MsgChangeThoughtParticleResponse {
    const message = createBaseMsgChangeThoughtParticleResponse();
    return message;
  },
  fromAmino(_: MsgChangeThoughtParticleResponseAmino): MsgChangeThoughtParticleResponse {
    const message = createBaseMsgChangeThoughtParticleResponse();
    return message;
  },
  toAmino(_: MsgChangeThoughtParticleResponse): MsgChangeThoughtParticleResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtParticleResponseAminoMsg): MsgChangeThoughtParticleResponse {
    return MsgChangeThoughtParticleResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtParticleResponseProtoMsg): MsgChangeThoughtParticleResponse {
    return MsgChangeThoughtParticleResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtParticleResponse): Uint8Array {
    return MsgChangeThoughtParticleResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtParticleResponse): MsgChangeThoughtParticleResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticleResponse",
      value: MsgChangeThoughtParticleResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtParticleResponse.typeUrl, MsgChangeThoughtParticleResponse);
function createBaseMsgChangeThoughtNameResponse(): MsgChangeThoughtNameResponse {
  return {};
}
export const MsgChangeThoughtNameResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtNameResponse",
  is(o: any): o is MsgChangeThoughtNameResponse {
    return o && o.$typeUrl === MsgChangeThoughtNameResponse.typeUrl;
  },
  isSDK(o: any): o is MsgChangeThoughtNameResponseSDKType {
    return o && o.$typeUrl === MsgChangeThoughtNameResponse.typeUrl;
  },
  isAmino(o: any): o is MsgChangeThoughtNameResponseAmino {
    return o && o.$typeUrl === MsgChangeThoughtNameResponse.typeUrl;
  },
  encode(_: MsgChangeThoughtNameResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtNameResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtNameResponse();
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
  fromJSON(_: any): MsgChangeThoughtNameResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtNameResponse): JsonSafe<MsgChangeThoughtNameResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtNameResponse>): MsgChangeThoughtNameResponse {
    const message = createBaseMsgChangeThoughtNameResponse();
    return message;
  },
  fromAmino(_: MsgChangeThoughtNameResponseAmino): MsgChangeThoughtNameResponse {
    const message = createBaseMsgChangeThoughtNameResponse();
    return message;
  },
  toAmino(_: MsgChangeThoughtNameResponse): MsgChangeThoughtNameResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtNameResponseAminoMsg): MsgChangeThoughtNameResponse {
    return MsgChangeThoughtNameResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtNameResponseProtoMsg): MsgChangeThoughtNameResponse {
    return MsgChangeThoughtNameResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtNameResponse): Uint8Array {
    return MsgChangeThoughtNameResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtNameResponse): MsgChangeThoughtNameResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtNameResponse",
      value: MsgChangeThoughtNameResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtNameResponse.typeUrl, MsgChangeThoughtNameResponse);
function createBaseMsgChangeThoughtInputResponse(): MsgChangeThoughtInputResponse {
  return {};
}
export const MsgChangeThoughtInputResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInputResponse",
  is(o: any): o is MsgChangeThoughtInputResponse {
    return o && o.$typeUrl === MsgChangeThoughtInputResponse.typeUrl;
  },
  isSDK(o: any): o is MsgChangeThoughtInputResponseSDKType {
    return o && o.$typeUrl === MsgChangeThoughtInputResponse.typeUrl;
  },
  isAmino(o: any): o is MsgChangeThoughtInputResponseAmino {
    return o && o.$typeUrl === MsgChangeThoughtInputResponse.typeUrl;
  },
  encode(_: MsgChangeThoughtInputResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtInputResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtInputResponse();
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
  fromJSON(_: any): MsgChangeThoughtInputResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtInputResponse): JsonSafe<MsgChangeThoughtInputResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtInputResponse>): MsgChangeThoughtInputResponse {
    const message = createBaseMsgChangeThoughtInputResponse();
    return message;
  },
  fromAmino(_: MsgChangeThoughtInputResponseAmino): MsgChangeThoughtInputResponse {
    const message = createBaseMsgChangeThoughtInputResponse();
    return message;
  },
  toAmino(_: MsgChangeThoughtInputResponse): MsgChangeThoughtInputResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtInputResponseAminoMsg): MsgChangeThoughtInputResponse {
    return MsgChangeThoughtInputResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtInputResponseProtoMsg): MsgChangeThoughtInputResponse {
    return MsgChangeThoughtInputResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtInputResponse): Uint8Array {
    return MsgChangeThoughtInputResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtInputResponse): MsgChangeThoughtInputResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInputResponse",
      value: MsgChangeThoughtInputResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtInputResponse.typeUrl, MsgChangeThoughtInputResponse);
function createBaseMsgChangeThoughtGasPriceResponse(): MsgChangeThoughtGasPriceResponse {
  return {};
}
export const MsgChangeThoughtGasPriceResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPriceResponse",
  is(o: any): o is MsgChangeThoughtGasPriceResponse {
    return o && o.$typeUrl === MsgChangeThoughtGasPriceResponse.typeUrl;
  },
  isSDK(o: any): o is MsgChangeThoughtGasPriceResponseSDKType {
    return o && o.$typeUrl === MsgChangeThoughtGasPriceResponse.typeUrl;
  },
  isAmino(o: any): o is MsgChangeThoughtGasPriceResponseAmino {
    return o && o.$typeUrl === MsgChangeThoughtGasPriceResponse.typeUrl;
  },
  encode(_: MsgChangeThoughtGasPriceResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtGasPriceResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtGasPriceResponse();
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
  fromJSON(_: any): MsgChangeThoughtGasPriceResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtGasPriceResponse): JsonSafe<MsgChangeThoughtGasPriceResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtGasPriceResponse>): MsgChangeThoughtGasPriceResponse {
    const message = createBaseMsgChangeThoughtGasPriceResponse();
    return message;
  },
  fromAmino(_: MsgChangeThoughtGasPriceResponseAmino): MsgChangeThoughtGasPriceResponse {
    const message = createBaseMsgChangeThoughtGasPriceResponse();
    return message;
  },
  toAmino(_: MsgChangeThoughtGasPriceResponse): MsgChangeThoughtGasPriceResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtGasPriceResponseAminoMsg): MsgChangeThoughtGasPriceResponse {
    return MsgChangeThoughtGasPriceResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtGasPriceResponseProtoMsg): MsgChangeThoughtGasPriceResponse {
    return MsgChangeThoughtGasPriceResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtGasPriceResponse): Uint8Array {
    return MsgChangeThoughtGasPriceResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtGasPriceResponse): MsgChangeThoughtGasPriceResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPriceResponse",
      value: MsgChangeThoughtGasPriceResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtGasPriceResponse.typeUrl, MsgChangeThoughtGasPriceResponse);
function createBaseMsgChangeThoughtPeriodResponse(): MsgChangeThoughtPeriodResponse {
  return {};
}
export const MsgChangeThoughtPeriodResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriodResponse",
  is(o: any): o is MsgChangeThoughtPeriodResponse {
    return o && o.$typeUrl === MsgChangeThoughtPeriodResponse.typeUrl;
  },
  isSDK(o: any): o is MsgChangeThoughtPeriodResponseSDKType {
    return o && o.$typeUrl === MsgChangeThoughtPeriodResponse.typeUrl;
  },
  isAmino(o: any): o is MsgChangeThoughtPeriodResponseAmino {
    return o && o.$typeUrl === MsgChangeThoughtPeriodResponse.typeUrl;
  },
  encode(_: MsgChangeThoughtPeriodResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtPeriodResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtPeriodResponse();
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
  fromJSON(_: any): MsgChangeThoughtPeriodResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtPeriodResponse): JsonSafe<MsgChangeThoughtPeriodResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtPeriodResponse>): MsgChangeThoughtPeriodResponse {
    const message = createBaseMsgChangeThoughtPeriodResponse();
    return message;
  },
  fromAmino(_: MsgChangeThoughtPeriodResponseAmino): MsgChangeThoughtPeriodResponse {
    const message = createBaseMsgChangeThoughtPeriodResponse();
    return message;
  },
  toAmino(_: MsgChangeThoughtPeriodResponse): MsgChangeThoughtPeriodResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtPeriodResponseAminoMsg): MsgChangeThoughtPeriodResponse {
    return MsgChangeThoughtPeriodResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtPeriodResponseProtoMsg): MsgChangeThoughtPeriodResponse {
    return MsgChangeThoughtPeriodResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtPeriodResponse): Uint8Array {
    return MsgChangeThoughtPeriodResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtPeriodResponse): MsgChangeThoughtPeriodResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriodResponse",
      value: MsgChangeThoughtPeriodResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtPeriodResponse.typeUrl, MsgChangeThoughtPeriodResponse);
function createBaseMsgChangeThoughtBlockResponse(): MsgChangeThoughtBlockResponse {
  return {};
}
export const MsgChangeThoughtBlockResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlockResponse",
  is(o: any): o is MsgChangeThoughtBlockResponse {
    return o && o.$typeUrl === MsgChangeThoughtBlockResponse.typeUrl;
  },
  isSDK(o: any): o is MsgChangeThoughtBlockResponseSDKType {
    return o && o.$typeUrl === MsgChangeThoughtBlockResponse.typeUrl;
  },
  isAmino(o: any): o is MsgChangeThoughtBlockResponseAmino {
    return o && o.$typeUrl === MsgChangeThoughtBlockResponse.typeUrl;
  },
  encode(_: MsgChangeThoughtBlockResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgChangeThoughtBlockResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeThoughtBlockResponse();
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
  fromJSON(_: any): MsgChangeThoughtBlockResponse {
    return {};
  },
  toJSON(_: MsgChangeThoughtBlockResponse): JsonSafe<MsgChangeThoughtBlockResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgChangeThoughtBlockResponse>): MsgChangeThoughtBlockResponse {
    const message = createBaseMsgChangeThoughtBlockResponse();
    return message;
  },
  fromAmino(_: MsgChangeThoughtBlockResponseAmino): MsgChangeThoughtBlockResponse {
    const message = createBaseMsgChangeThoughtBlockResponse();
    return message;
  },
  toAmino(_: MsgChangeThoughtBlockResponse): MsgChangeThoughtBlockResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgChangeThoughtBlockResponseAminoMsg): MsgChangeThoughtBlockResponse {
    return MsgChangeThoughtBlockResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgChangeThoughtBlockResponseProtoMsg): MsgChangeThoughtBlockResponse {
    return MsgChangeThoughtBlockResponse.decode(message.value);
  },
  toProto(message: MsgChangeThoughtBlockResponse): Uint8Array {
    return MsgChangeThoughtBlockResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgChangeThoughtBlockResponse): MsgChangeThoughtBlockResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlockResponse",
      value: MsgChangeThoughtBlockResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgChangeThoughtBlockResponse.typeUrl, MsgChangeThoughtBlockResponse);
function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}
export const MsgUpdateParamsResponse = {
  typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParamsResponse",
  is(o: any): o is MsgUpdateParamsResponse {
    return o && o.$typeUrl === MsgUpdateParamsResponse.typeUrl;
  },
  isSDK(o: any): o is MsgUpdateParamsResponseSDKType {
    return o && o.$typeUrl === MsgUpdateParamsResponse.typeUrl;
  },
  isAmino(o: any): o is MsgUpdateParamsResponseAmino {
    return o && o.$typeUrl === MsgUpdateParamsResponse.typeUrl;
  },
  encode(_: MsgUpdateParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParamsResponse();
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
  fromJSON(_: any): MsgUpdateParamsResponse {
    return {};
  },
  toJSON(_: MsgUpdateParamsResponse): JsonSafe<MsgUpdateParamsResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgUpdateParamsResponse>): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
  fromAmino(_: MsgUpdateParamsResponseAmino): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
  toAmino(_: MsgUpdateParamsResponse): MsgUpdateParamsResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgUpdateParamsResponseAminoMsg): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUpdateParamsResponseProtoMsg): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.decode(message.value);
  },
  toProto(message: MsgUpdateParamsResponse): Uint8Array {
    return MsgUpdateParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateParamsResponse): MsgUpdateParamsResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParamsResponse",
      value: MsgUpdateParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUpdateParamsResponse.typeUrl, MsgUpdateParamsResponse);