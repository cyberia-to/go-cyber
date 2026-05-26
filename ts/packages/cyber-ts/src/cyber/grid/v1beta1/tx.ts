//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { Params, ParamsAmino, ParamsSDKType } from "./types";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
export interface MsgCreateRoute {
  source: string;
  destination: string;
  name: string;
}
export interface MsgCreateRouteProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute";
  value: Uint8Array;
}
export interface MsgCreateRouteAmino {
  source?: string;
  destination?: string;
  name?: string;
}
export interface MsgCreateRouteAminoMsg {
  type: "/cyber.grid.v1beta1.MsgCreateRoute";
  value: MsgCreateRouteAmino;
}
export interface MsgCreateRouteSDKType {
  source: string;
  destination: string;
  name: string;
}
export interface MsgEditRoute {
  source: string;
  destination: string;
  value: Coin;
}
export interface MsgEditRouteProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.MsgEditRoute";
  value: Uint8Array;
}
export interface MsgEditRouteAmino {
  source?: string;
  destination?: string;
  value?: CoinAmino;
}
export interface MsgEditRouteAminoMsg {
  type: "/cyber.grid.v1beta1.MsgEditRoute";
  value: MsgEditRouteAmino;
}
export interface MsgEditRouteSDKType {
  source: string;
  destination: string;
  value: CoinSDKType;
}
export interface MsgDeleteRoute {
  source: string;
  destination: string;
}
export interface MsgDeleteRouteProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute";
  value: Uint8Array;
}
export interface MsgDeleteRouteAmino {
  source?: string;
  destination?: string;
}
export interface MsgDeleteRouteAminoMsg {
  type: "/cyber.grid.v1beta1.MsgDeleteRoute";
  value: MsgDeleteRouteAmino;
}
export interface MsgDeleteRouteSDKType {
  source: string;
  destination: string;
}
export interface MsgEditRouteName {
  source: string;
  destination: string;
  name: string;
}
export interface MsgEditRouteNameProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName";
  value: Uint8Array;
}
export interface MsgEditRouteNameAmino {
  source?: string;
  destination?: string;
  name?: string;
}
export interface MsgEditRouteNameAminoMsg {
  type: "/cyber.grid.v1beta1.MsgEditRouteName";
  value: MsgEditRouteNameAmino;
}
export interface MsgEditRouteNameSDKType {
  source: string;
  destination: string;
  name: string;
}
export interface MsgUpdateParams {
  authority: string;
  params: Params;
}
export interface MsgUpdateParamsProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.MsgUpdateParams";
  value: Uint8Array;
}
export interface MsgUpdateParamsAmino {
  authority?: string;
  params?: ParamsAmino;
}
export interface MsgUpdateParamsAminoMsg {
  type: "/cyber.grid.v1beta1.MsgUpdateParams";
  value: MsgUpdateParamsAmino;
}
export interface MsgUpdateParamsSDKType {
  authority: string;
  params: ParamsSDKType;
}
export interface MsgCreateRouteResponse {}
export interface MsgCreateRouteResponseProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.MsgCreateRouteResponse";
  value: Uint8Array;
}
export interface MsgCreateRouteResponseAmino {}
export interface MsgCreateRouteResponseAminoMsg {
  type: "/cyber.grid.v1beta1.MsgCreateRouteResponse";
  value: MsgCreateRouteResponseAmino;
}
export interface MsgCreateRouteResponseSDKType {}
export interface MsgEditRouteResponse {}
export interface MsgEditRouteResponseProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.MsgEditRouteResponse";
  value: Uint8Array;
}
export interface MsgEditRouteResponseAmino {}
export interface MsgEditRouteResponseAminoMsg {
  type: "/cyber.grid.v1beta1.MsgEditRouteResponse";
  value: MsgEditRouteResponseAmino;
}
export interface MsgEditRouteResponseSDKType {}
export interface MsgDeleteRouteResponse {}
export interface MsgDeleteRouteResponseProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.MsgDeleteRouteResponse";
  value: Uint8Array;
}
export interface MsgDeleteRouteResponseAmino {}
export interface MsgDeleteRouteResponseAminoMsg {
  type: "/cyber.grid.v1beta1.MsgDeleteRouteResponse";
  value: MsgDeleteRouteResponseAmino;
}
export interface MsgDeleteRouteResponseSDKType {}
export interface MsgEditRouteNameResponse {}
export interface MsgEditRouteNameResponseProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.MsgEditRouteNameResponse";
  value: Uint8Array;
}
export interface MsgEditRouteNameResponseAmino {}
export interface MsgEditRouteNameResponseAminoMsg {
  type: "/cyber.grid.v1beta1.MsgEditRouteNameResponse";
  value: MsgEditRouteNameResponseAmino;
}
export interface MsgEditRouteNameResponseSDKType {}
export interface MsgUpdateParamsResponse {}
export interface MsgUpdateParamsResponseProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.MsgUpdateParamsResponse";
  value: Uint8Array;
}
export interface MsgUpdateParamsResponseAmino {}
export interface MsgUpdateParamsResponseAminoMsg {
  type: "/cyber.grid.v1beta1.MsgUpdateParamsResponse";
  value: MsgUpdateParamsResponseAmino;
}
export interface MsgUpdateParamsResponseSDKType {}
function createBaseMsgCreateRoute(): MsgCreateRoute {
  return {
    source: "",
    destination: "",
    name: ""
  };
}
export const MsgCreateRoute = {
  typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute",
  is(o: any): o is MsgCreateRoute {
    return o && (o.$typeUrl === MsgCreateRoute.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && typeof o.name === "string");
  },
  isSDK(o: any): o is MsgCreateRouteSDKType {
    return o && (o.$typeUrl === MsgCreateRoute.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && typeof o.name === "string");
  },
  isAmino(o: any): o is MsgCreateRouteAmino {
    return o && (o.$typeUrl === MsgCreateRoute.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && typeof o.name === "string");
  },
  encode(message: MsgCreateRoute, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.source !== "") {
      writer.uint32(10).string(message.source);
    }
    if (message.destination !== "") {
      writer.uint32(18).string(message.destination);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateRoute {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.source = reader.string();
          break;
        case 2:
          message.destination = reader.string();
          break;
        case 3:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgCreateRoute {
    return {
      source: isSet(object.source) ? String(object.source) : "",
      destination: isSet(object.destination) ? String(object.destination) : "",
      name: isSet(object.name) ? String(object.name) : ""
    };
  },
  toJSON(message: MsgCreateRoute): JsonSafe<MsgCreateRoute> {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    message.destination !== undefined && (obj.destination = message.destination);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
  fromPartial(object: Partial<MsgCreateRoute>): MsgCreateRoute {
    const message = createBaseMsgCreateRoute();
    message.source = object.source ?? "";
    message.destination = object.destination ?? "";
    message.name = object.name ?? "";
    return message;
  },
  fromAmino(object: MsgCreateRouteAmino): MsgCreateRoute {
    const message = createBaseMsgCreateRoute();
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    }
    if (object.destination !== undefined && object.destination !== null) {
      message.destination = object.destination;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    return message;
  },
  toAmino(message: MsgCreateRoute): MsgCreateRouteAmino {
    const obj: any = {};
    obj.source = message.source === "" ? undefined : message.source;
    obj.destination = message.destination === "" ? undefined : message.destination;
    obj.name = message.name === "" ? undefined : message.name;
    return obj;
  },
  fromAminoMsg(object: MsgCreateRouteAminoMsg): MsgCreateRoute {
    return MsgCreateRoute.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgCreateRouteProtoMsg): MsgCreateRoute {
    return MsgCreateRoute.decode(message.value);
  },
  toProto(message: MsgCreateRoute): Uint8Array {
    return MsgCreateRoute.encode(message).finish();
  },
  toProtoMsg(message: MsgCreateRoute): MsgCreateRouteProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute",
      value: MsgCreateRoute.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgCreateRoute.typeUrl, MsgCreateRoute);
function createBaseMsgEditRoute(): MsgEditRoute {
  return {
    source: "",
    destination: "",
    value: Coin.fromPartial({})
  };
}
export const MsgEditRoute = {
  typeUrl: "/cyber.grid.v1beta1.MsgEditRoute",
  is(o: any): o is MsgEditRoute {
    return o && (o.$typeUrl === MsgEditRoute.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && Coin.is(o.value));
  },
  isSDK(o: any): o is MsgEditRouteSDKType {
    return o && (o.$typeUrl === MsgEditRoute.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && Coin.isSDK(o.value));
  },
  isAmino(o: any): o is MsgEditRouteAmino {
    return o && (o.$typeUrl === MsgEditRoute.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && Coin.isAmino(o.value));
  },
  encode(message: MsgEditRoute, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.source !== "") {
      writer.uint32(10).string(message.source);
    }
    if (message.destination !== "") {
      writer.uint32(18).string(message.destination);
    }
    if (message.value !== undefined) {
      Coin.encode(message.value, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgEditRoute {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgEditRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.source = reader.string();
          break;
        case 2:
          message.destination = reader.string();
          break;
        case 3:
          message.value = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgEditRoute {
    return {
      source: isSet(object.source) ? String(object.source) : "",
      destination: isSet(object.destination) ? String(object.destination) : "",
      value: isSet(object.value) ? Coin.fromJSON(object.value) : undefined
    };
  },
  toJSON(message: MsgEditRoute): JsonSafe<MsgEditRoute> {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    message.destination !== undefined && (obj.destination = message.destination);
    message.value !== undefined && (obj.value = message.value ? Coin.toJSON(message.value) : undefined);
    return obj;
  },
  fromPartial(object: Partial<MsgEditRoute>): MsgEditRoute {
    const message = createBaseMsgEditRoute();
    message.source = object.source ?? "";
    message.destination = object.destination ?? "";
    message.value = object.value !== undefined && object.value !== null ? Coin.fromPartial(object.value) : undefined;
    return message;
  },
  fromAmino(object: MsgEditRouteAmino): MsgEditRoute {
    const message = createBaseMsgEditRoute();
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    }
    if (object.destination !== undefined && object.destination !== null) {
      message.destination = object.destination;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Coin.fromAmino(object.value);
    }
    return message;
  },
  toAmino(message: MsgEditRoute): MsgEditRouteAmino {
    const obj: any = {};
    obj.source = message.source === "" ? undefined : message.source;
    obj.destination = message.destination === "" ? undefined : message.destination;
    obj.value = message.value ? Coin.toAmino(message.value) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgEditRouteAminoMsg): MsgEditRoute {
    return MsgEditRoute.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgEditRouteProtoMsg): MsgEditRoute {
    return MsgEditRoute.decode(message.value);
  },
  toProto(message: MsgEditRoute): Uint8Array {
    return MsgEditRoute.encode(message).finish();
  },
  toProtoMsg(message: MsgEditRoute): MsgEditRouteProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.MsgEditRoute",
      value: MsgEditRoute.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgEditRoute.typeUrl, MsgEditRoute);
function createBaseMsgDeleteRoute(): MsgDeleteRoute {
  return {
    source: "",
    destination: ""
  };
}
export const MsgDeleteRoute = {
  typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute",
  is(o: any): o is MsgDeleteRoute {
    return o && (o.$typeUrl === MsgDeleteRoute.typeUrl || typeof o.source === "string" && typeof o.destination === "string");
  },
  isSDK(o: any): o is MsgDeleteRouteSDKType {
    return o && (o.$typeUrl === MsgDeleteRoute.typeUrl || typeof o.source === "string" && typeof o.destination === "string");
  },
  isAmino(o: any): o is MsgDeleteRouteAmino {
    return o && (o.$typeUrl === MsgDeleteRoute.typeUrl || typeof o.source === "string" && typeof o.destination === "string");
  },
  encode(message: MsgDeleteRoute, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.source !== "") {
      writer.uint32(10).string(message.source);
    }
    if (message.destination !== "") {
      writer.uint32(18).string(message.destination);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDeleteRoute {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeleteRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.source = reader.string();
          break;
        case 2:
          message.destination = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgDeleteRoute {
    return {
      source: isSet(object.source) ? String(object.source) : "",
      destination: isSet(object.destination) ? String(object.destination) : ""
    };
  },
  toJSON(message: MsgDeleteRoute): JsonSafe<MsgDeleteRoute> {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    message.destination !== undefined && (obj.destination = message.destination);
    return obj;
  },
  fromPartial(object: Partial<MsgDeleteRoute>): MsgDeleteRoute {
    const message = createBaseMsgDeleteRoute();
    message.source = object.source ?? "";
    message.destination = object.destination ?? "";
    return message;
  },
  fromAmino(object: MsgDeleteRouteAmino): MsgDeleteRoute {
    const message = createBaseMsgDeleteRoute();
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    }
    if (object.destination !== undefined && object.destination !== null) {
      message.destination = object.destination;
    }
    return message;
  },
  toAmino(message: MsgDeleteRoute): MsgDeleteRouteAmino {
    const obj: any = {};
    obj.source = message.source === "" ? undefined : message.source;
    obj.destination = message.destination === "" ? undefined : message.destination;
    return obj;
  },
  fromAminoMsg(object: MsgDeleteRouteAminoMsg): MsgDeleteRoute {
    return MsgDeleteRoute.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgDeleteRouteProtoMsg): MsgDeleteRoute {
    return MsgDeleteRoute.decode(message.value);
  },
  toProto(message: MsgDeleteRoute): Uint8Array {
    return MsgDeleteRoute.encode(message).finish();
  },
  toProtoMsg(message: MsgDeleteRoute): MsgDeleteRouteProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute",
      value: MsgDeleteRoute.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgDeleteRoute.typeUrl, MsgDeleteRoute);
function createBaseMsgEditRouteName(): MsgEditRouteName {
  return {
    source: "",
    destination: "",
    name: ""
  };
}
export const MsgEditRouteName = {
  typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName",
  is(o: any): o is MsgEditRouteName {
    return o && (o.$typeUrl === MsgEditRouteName.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && typeof o.name === "string");
  },
  isSDK(o: any): o is MsgEditRouteNameSDKType {
    return o && (o.$typeUrl === MsgEditRouteName.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && typeof o.name === "string");
  },
  isAmino(o: any): o is MsgEditRouteNameAmino {
    return o && (o.$typeUrl === MsgEditRouteName.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && typeof o.name === "string");
  },
  encode(message: MsgEditRouteName, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.source !== "") {
      writer.uint32(10).string(message.source);
    }
    if (message.destination !== "") {
      writer.uint32(18).string(message.destination);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgEditRouteName {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgEditRouteName();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.source = reader.string();
          break;
        case 2:
          message.destination = reader.string();
          break;
        case 3:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgEditRouteName {
    return {
      source: isSet(object.source) ? String(object.source) : "",
      destination: isSet(object.destination) ? String(object.destination) : "",
      name: isSet(object.name) ? String(object.name) : ""
    };
  },
  toJSON(message: MsgEditRouteName): JsonSafe<MsgEditRouteName> {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    message.destination !== undefined && (obj.destination = message.destination);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
  fromPartial(object: Partial<MsgEditRouteName>): MsgEditRouteName {
    const message = createBaseMsgEditRouteName();
    message.source = object.source ?? "";
    message.destination = object.destination ?? "";
    message.name = object.name ?? "";
    return message;
  },
  fromAmino(object: MsgEditRouteNameAmino): MsgEditRouteName {
    const message = createBaseMsgEditRouteName();
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    }
    if (object.destination !== undefined && object.destination !== null) {
      message.destination = object.destination;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    return message;
  },
  toAmino(message: MsgEditRouteName): MsgEditRouteNameAmino {
    const obj: any = {};
    obj.source = message.source === "" ? undefined : message.source;
    obj.destination = message.destination === "" ? undefined : message.destination;
    obj.name = message.name === "" ? undefined : message.name;
    return obj;
  },
  fromAminoMsg(object: MsgEditRouteNameAminoMsg): MsgEditRouteName {
    return MsgEditRouteName.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgEditRouteNameProtoMsg): MsgEditRouteName {
    return MsgEditRouteName.decode(message.value);
  },
  toProto(message: MsgEditRouteName): Uint8Array {
    return MsgEditRouteName.encode(message).finish();
  },
  toProtoMsg(message: MsgEditRouteName): MsgEditRouteNameProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName",
      value: MsgEditRouteName.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgEditRouteName.typeUrl, MsgEditRouteName);
function createBaseMsgUpdateParams(): MsgUpdateParams {
  return {
    authority: "",
    params: Params.fromPartial({})
  };
}
export const MsgUpdateParams = {
  typeUrl: "/cyber.grid.v1beta1.MsgUpdateParams",
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
      typeUrl: "/cyber.grid.v1beta1.MsgUpdateParams",
      value: MsgUpdateParams.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUpdateParams.typeUrl, MsgUpdateParams);
function createBaseMsgCreateRouteResponse(): MsgCreateRouteResponse {
  return {};
}
export const MsgCreateRouteResponse = {
  typeUrl: "/cyber.grid.v1beta1.MsgCreateRouteResponse",
  is(o: any): o is MsgCreateRouteResponse {
    return o && o.$typeUrl === MsgCreateRouteResponse.typeUrl;
  },
  isSDK(o: any): o is MsgCreateRouteResponseSDKType {
    return o && o.$typeUrl === MsgCreateRouteResponse.typeUrl;
  },
  isAmino(o: any): o is MsgCreateRouteResponseAmino {
    return o && o.$typeUrl === MsgCreateRouteResponse.typeUrl;
  },
  encode(_: MsgCreateRouteResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateRouteResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateRouteResponse();
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
  fromJSON(_: any): MsgCreateRouteResponse {
    return {};
  },
  toJSON(_: MsgCreateRouteResponse): JsonSafe<MsgCreateRouteResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgCreateRouteResponse>): MsgCreateRouteResponse {
    const message = createBaseMsgCreateRouteResponse();
    return message;
  },
  fromAmino(_: MsgCreateRouteResponseAmino): MsgCreateRouteResponse {
    const message = createBaseMsgCreateRouteResponse();
    return message;
  },
  toAmino(_: MsgCreateRouteResponse): MsgCreateRouteResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgCreateRouteResponseAminoMsg): MsgCreateRouteResponse {
    return MsgCreateRouteResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgCreateRouteResponseProtoMsg): MsgCreateRouteResponse {
    return MsgCreateRouteResponse.decode(message.value);
  },
  toProto(message: MsgCreateRouteResponse): Uint8Array {
    return MsgCreateRouteResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgCreateRouteResponse): MsgCreateRouteResponseProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.MsgCreateRouteResponse",
      value: MsgCreateRouteResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgCreateRouteResponse.typeUrl, MsgCreateRouteResponse);
function createBaseMsgEditRouteResponse(): MsgEditRouteResponse {
  return {};
}
export const MsgEditRouteResponse = {
  typeUrl: "/cyber.grid.v1beta1.MsgEditRouteResponse",
  is(o: any): o is MsgEditRouteResponse {
    return o && o.$typeUrl === MsgEditRouteResponse.typeUrl;
  },
  isSDK(o: any): o is MsgEditRouteResponseSDKType {
    return o && o.$typeUrl === MsgEditRouteResponse.typeUrl;
  },
  isAmino(o: any): o is MsgEditRouteResponseAmino {
    return o && o.$typeUrl === MsgEditRouteResponse.typeUrl;
  },
  encode(_: MsgEditRouteResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgEditRouteResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgEditRouteResponse();
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
  fromJSON(_: any): MsgEditRouteResponse {
    return {};
  },
  toJSON(_: MsgEditRouteResponse): JsonSafe<MsgEditRouteResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgEditRouteResponse>): MsgEditRouteResponse {
    const message = createBaseMsgEditRouteResponse();
    return message;
  },
  fromAmino(_: MsgEditRouteResponseAmino): MsgEditRouteResponse {
    const message = createBaseMsgEditRouteResponse();
    return message;
  },
  toAmino(_: MsgEditRouteResponse): MsgEditRouteResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgEditRouteResponseAminoMsg): MsgEditRouteResponse {
    return MsgEditRouteResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgEditRouteResponseProtoMsg): MsgEditRouteResponse {
    return MsgEditRouteResponse.decode(message.value);
  },
  toProto(message: MsgEditRouteResponse): Uint8Array {
    return MsgEditRouteResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgEditRouteResponse): MsgEditRouteResponseProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.MsgEditRouteResponse",
      value: MsgEditRouteResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgEditRouteResponse.typeUrl, MsgEditRouteResponse);
function createBaseMsgDeleteRouteResponse(): MsgDeleteRouteResponse {
  return {};
}
export const MsgDeleteRouteResponse = {
  typeUrl: "/cyber.grid.v1beta1.MsgDeleteRouteResponse",
  is(o: any): o is MsgDeleteRouteResponse {
    return o && o.$typeUrl === MsgDeleteRouteResponse.typeUrl;
  },
  isSDK(o: any): o is MsgDeleteRouteResponseSDKType {
    return o && o.$typeUrl === MsgDeleteRouteResponse.typeUrl;
  },
  isAmino(o: any): o is MsgDeleteRouteResponseAmino {
    return o && o.$typeUrl === MsgDeleteRouteResponse.typeUrl;
  },
  encode(_: MsgDeleteRouteResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgDeleteRouteResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeleteRouteResponse();
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
  fromJSON(_: any): MsgDeleteRouteResponse {
    return {};
  },
  toJSON(_: MsgDeleteRouteResponse): JsonSafe<MsgDeleteRouteResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgDeleteRouteResponse>): MsgDeleteRouteResponse {
    const message = createBaseMsgDeleteRouteResponse();
    return message;
  },
  fromAmino(_: MsgDeleteRouteResponseAmino): MsgDeleteRouteResponse {
    const message = createBaseMsgDeleteRouteResponse();
    return message;
  },
  toAmino(_: MsgDeleteRouteResponse): MsgDeleteRouteResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgDeleteRouteResponseAminoMsg): MsgDeleteRouteResponse {
    return MsgDeleteRouteResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgDeleteRouteResponseProtoMsg): MsgDeleteRouteResponse {
    return MsgDeleteRouteResponse.decode(message.value);
  },
  toProto(message: MsgDeleteRouteResponse): Uint8Array {
    return MsgDeleteRouteResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgDeleteRouteResponse): MsgDeleteRouteResponseProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.MsgDeleteRouteResponse",
      value: MsgDeleteRouteResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgDeleteRouteResponse.typeUrl, MsgDeleteRouteResponse);
function createBaseMsgEditRouteNameResponse(): MsgEditRouteNameResponse {
  return {};
}
export const MsgEditRouteNameResponse = {
  typeUrl: "/cyber.grid.v1beta1.MsgEditRouteNameResponse",
  is(o: any): o is MsgEditRouteNameResponse {
    return o && o.$typeUrl === MsgEditRouteNameResponse.typeUrl;
  },
  isSDK(o: any): o is MsgEditRouteNameResponseSDKType {
    return o && o.$typeUrl === MsgEditRouteNameResponse.typeUrl;
  },
  isAmino(o: any): o is MsgEditRouteNameResponseAmino {
    return o && o.$typeUrl === MsgEditRouteNameResponse.typeUrl;
  },
  encode(_: MsgEditRouteNameResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgEditRouteNameResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgEditRouteNameResponse();
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
  fromJSON(_: any): MsgEditRouteNameResponse {
    return {};
  },
  toJSON(_: MsgEditRouteNameResponse): JsonSafe<MsgEditRouteNameResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgEditRouteNameResponse>): MsgEditRouteNameResponse {
    const message = createBaseMsgEditRouteNameResponse();
    return message;
  },
  fromAmino(_: MsgEditRouteNameResponseAmino): MsgEditRouteNameResponse {
    const message = createBaseMsgEditRouteNameResponse();
    return message;
  },
  toAmino(_: MsgEditRouteNameResponse): MsgEditRouteNameResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgEditRouteNameResponseAminoMsg): MsgEditRouteNameResponse {
    return MsgEditRouteNameResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgEditRouteNameResponseProtoMsg): MsgEditRouteNameResponse {
    return MsgEditRouteNameResponse.decode(message.value);
  },
  toProto(message: MsgEditRouteNameResponse): Uint8Array {
    return MsgEditRouteNameResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgEditRouteNameResponse): MsgEditRouteNameResponseProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.MsgEditRouteNameResponse",
      value: MsgEditRouteNameResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgEditRouteNameResponse.typeUrl, MsgEditRouteNameResponse);
function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}
export const MsgUpdateParamsResponse = {
  typeUrl: "/cyber.grid.v1beta1.MsgUpdateParamsResponse",
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
      typeUrl: "/cyber.grid.v1beta1.MsgUpdateParamsResponse",
      value: MsgUpdateParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUpdateParamsResponse.typeUrl, MsgUpdateParamsResponse);