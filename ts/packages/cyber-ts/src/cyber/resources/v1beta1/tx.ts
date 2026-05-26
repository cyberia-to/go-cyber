//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { Params, ParamsAmino, ParamsSDKType } from "./types";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
export interface MsgInvestmint {
  neuron: string;
  amount: Coin;
  resource: string;
  length: bigint;
}
export interface MsgInvestmintProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.MsgInvestmint";
  value: Uint8Array;
}
export interface MsgInvestmintAmino {
  neuron?: string;
  amount?: CoinAmino;
  resource?: string;
  length?: string;
}
export interface MsgInvestmintAminoMsg {
  type: "/cyber.resources.v1beta1.MsgInvestmint";
  value: MsgInvestmintAmino;
}
export interface MsgInvestmintSDKType {
  neuron: string;
  amount: CoinSDKType;
  resource: string;
  length: bigint;
}
export interface MsgUpdateParams {
  authority: string;
  params: Params;
}
export interface MsgUpdateParamsProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.MsgUpdateParams";
  value: Uint8Array;
}
export interface MsgUpdateParamsAmino {
  authority?: string;
  params?: ParamsAmino;
}
export interface MsgUpdateParamsAminoMsg {
  type: "/cyber.resources.v1beta1.MsgUpdateParams";
  value: MsgUpdateParamsAmino;
}
export interface MsgUpdateParamsSDKType {
  authority: string;
  params: ParamsSDKType;
}
export interface MsgInvestmintResponse {}
export interface MsgInvestmintResponseProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.MsgInvestmintResponse";
  value: Uint8Array;
}
export interface MsgInvestmintResponseAmino {}
export interface MsgInvestmintResponseAminoMsg {
  type: "/cyber.resources.v1beta1.MsgInvestmintResponse";
  value: MsgInvestmintResponseAmino;
}
export interface MsgInvestmintResponseSDKType {}
export interface MsgUpdateParamsResponse {}
export interface MsgUpdateParamsResponseProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.MsgUpdateParamsResponse";
  value: Uint8Array;
}
export interface MsgUpdateParamsResponseAmino {}
export interface MsgUpdateParamsResponseAminoMsg {
  type: "/cyber.resources.v1beta1.MsgUpdateParamsResponse";
  value: MsgUpdateParamsResponseAmino;
}
export interface MsgUpdateParamsResponseSDKType {}
function createBaseMsgInvestmint(): MsgInvestmint {
  return {
    neuron: "",
    amount: Coin.fromPartial({}),
    resource: "",
    length: BigInt(0)
  };
}
export const MsgInvestmint = {
  typeUrl: "/cyber.resources.v1beta1.MsgInvestmint",
  is(o: any): o is MsgInvestmint {
    return o && (o.$typeUrl === MsgInvestmint.typeUrl || typeof o.neuron === "string" && Coin.is(o.amount) && typeof o.resource === "string" && typeof o.length === "bigint");
  },
  isSDK(o: any): o is MsgInvestmintSDKType {
    return o && (o.$typeUrl === MsgInvestmint.typeUrl || typeof o.neuron === "string" && Coin.isSDK(o.amount) && typeof o.resource === "string" && typeof o.length === "bigint");
  },
  isAmino(o: any): o is MsgInvestmintAmino {
    return o && (o.$typeUrl === MsgInvestmint.typeUrl || typeof o.neuron === "string" && Coin.isAmino(o.amount) && typeof o.resource === "string" && typeof o.length === "bigint");
  },
  encode(message: MsgInvestmint, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.neuron !== "") {
      writer.uint32(10).string(message.neuron);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(18).fork()).ldelim();
    }
    if (message.resource !== "") {
      writer.uint32(26).string(message.resource);
    }
    if (message.length !== BigInt(0)) {
      writer.uint32(32).uint64(message.length);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgInvestmint {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgInvestmint();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.neuron = reader.string();
          break;
        case 2:
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        case 3:
          message.resource = reader.string();
          break;
        case 4:
          message.length = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgInvestmint {
    return {
      neuron: isSet(object.neuron) ? String(object.neuron) : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      resource: isSet(object.resource) ? String(object.resource) : "",
      length: isSet(object.length) ? BigInt(object.length.toString()) : BigInt(0)
    };
  },
  toJSON(message: MsgInvestmint): JsonSafe<MsgInvestmint> {
    const obj: any = {};
    message.neuron !== undefined && (obj.neuron = message.neuron);
    message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    message.resource !== undefined && (obj.resource = message.resource);
    message.length !== undefined && (obj.length = (message.length || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<MsgInvestmint>): MsgInvestmint {
    const message = createBaseMsgInvestmint();
    message.neuron = object.neuron ?? "";
    message.amount = object.amount !== undefined && object.amount !== null ? Coin.fromPartial(object.amount) : undefined;
    message.resource = object.resource ?? "";
    message.length = object.length !== undefined && object.length !== null ? BigInt(object.length.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: MsgInvestmintAmino): MsgInvestmint {
    const message = createBaseMsgInvestmint();
    if (object.neuron !== undefined && object.neuron !== null) {
      message.neuron = object.neuron;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Coin.fromAmino(object.amount);
    }
    if (object.resource !== undefined && object.resource !== null) {
      message.resource = object.resource;
    }
    if (object.length !== undefined && object.length !== null) {
      message.length = BigInt(object.length);
    }
    return message;
  },
  toAmino(message: MsgInvestmint): MsgInvestmintAmino {
    const obj: any = {};
    obj.neuron = message.neuron === "" ? undefined : message.neuron;
    obj.amount = message.amount ? Coin.toAmino(message.amount) : undefined;
    obj.resource = message.resource === "" ? undefined : message.resource;
    obj.length = message.length !== BigInt(0) ? message.length.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgInvestmintAminoMsg): MsgInvestmint {
    return MsgInvestmint.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgInvestmintProtoMsg): MsgInvestmint {
    return MsgInvestmint.decode(message.value);
  },
  toProto(message: MsgInvestmint): Uint8Array {
    return MsgInvestmint.encode(message).finish();
  },
  toProtoMsg(message: MsgInvestmint): MsgInvestmintProtoMsg {
    return {
      typeUrl: "/cyber.resources.v1beta1.MsgInvestmint",
      value: MsgInvestmint.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgInvestmint.typeUrl, MsgInvestmint);
function createBaseMsgUpdateParams(): MsgUpdateParams {
  return {
    authority: "",
    params: Params.fromPartial({})
  };
}
export const MsgUpdateParams = {
  typeUrl: "/cyber.resources.v1beta1.MsgUpdateParams",
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
      typeUrl: "/cyber.resources.v1beta1.MsgUpdateParams",
      value: MsgUpdateParams.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUpdateParams.typeUrl, MsgUpdateParams);
function createBaseMsgInvestmintResponse(): MsgInvestmintResponse {
  return {};
}
export const MsgInvestmintResponse = {
  typeUrl: "/cyber.resources.v1beta1.MsgInvestmintResponse",
  is(o: any): o is MsgInvestmintResponse {
    return o && o.$typeUrl === MsgInvestmintResponse.typeUrl;
  },
  isSDK(o: any): o is MsgInvestmintResponseSDKType {
    return o && o.$typeUrl === MsgInvestmintResponse.typeUrl;
  },
  isAmino(o: any): o is MsgInvestmintResponseAmino {
    return o && o.$typeUrl === MsgInvestmintResponse.typeUrl;
  },
  encode(_: MsgInvestmintResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgInvestmintResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgInvestmintResponse();
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
  fromJSON(_: any): MsgInvestmintResponse {
    return {};
  },
  toJSON(_: MsgInvestmintResponse): JsonSafe<MsgInvestmintResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgInvestmintResponse>): MsgInvestmintResponse {
    const message = createBaseMsgInvestmintResponse();
    return message;
  },
  fromAmino(_: MsgInvestmintResponseAmino): MsgInvestmintResponse {
    const message = createBaseMsgInvestmintResponse();
    return message;
  },
  toAmino(_: MsgInvestmintResponse): MsgInvestmintResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgInvestmintResponseAminoMsg): MsgInvestmintResponse {
    return MsgInvestmintResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgInvestmintResponseProtoMsg): MsgInvestmintResponse {
    return MsgInvestmintResponse.decode(message.value);
  },
  toProto(message: MsgInvestmintResponse): Uint8Array {
    return MsgInvestmintResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgInvestmintResponse): MsgInvestmintResponseProtoMsg {
    return {
      typeUrl: "/cyber.resources.v1beta1.MsgInvestmintResponse",
      value: MsgInvestmintResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgInvestmintResponse.typeUrl, MsgInvestmintResponse);
function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}
export const MsgUpdateParamsResponse = {
  typeUrl: "/cyber.resources.v1beta1.MsgUpdateParamsResponse",
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
      typeUrl: "/cyber.resources.v1beta1.MsgUpdateParamsResponse",
      value: MsgUpdateParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUpdateParamsResponse.typeUrl, MsgUpdateParamsResponse);