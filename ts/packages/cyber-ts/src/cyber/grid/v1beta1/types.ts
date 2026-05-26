//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
export interface Params {
  maxRoutes: number;
}
export interface ParamsProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.Params";
  value: Uint8Array;
}
export interface ParamsAmino {
  max_routes?: number;
}
export interface ParamsAminoMsg {
  type: "/cyber.grid.v1beta1.Params";
  value: ParamsAmino;
}
export interface ParamsSDKType {
  max_routes: number;
}
export interface Route {
  source: string;
  destination: string;
  name: string;
  value: Coin[];
}
export interface RouteProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.Route";
  value: Uint8Array;
}
export interface RouteAmino {
  source?: string;
  destination?: string;
  name?: string;
  value?: CoinAmino[];
}
export interface RouteAminoMsg {
  type: "/cyber.grid.v1beta1.Route";
  value: RouteAmino;
}
export interface RouteSDKType {
  source: string;
  destination: string;
  name: string;
  value: CoinSDKType[];
}
export interface Value {
  value: Coin[];
}
export interface ValueProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.Value";
  value: Uint8Array;
}
export interface ValueAmino {
  value?: CoinAmino[];
}
export interface ValueAminoMsg {
  type: "/cyber.grid.v1beta1.Value";
  value: ValueAmino;
}
export interface ValueSDKType {
  value: CoinSDKType[];
}
function createBaseParams(): Params {
  return {
    maxRoutes: 0
  };
}
export const Params = {
  typeUrl: "/cyber.grid.v1beta1.Params",
  is(o: any): o is Params {
    return o && (o.$typeUrl === Params.typeUrl || typeof o.maxRoutes === "number");
  },
  isSDK(o: any): o is ParamsSDKType {
    return o && (o.$typeUrl === Params.typeUrl || typeof o.max_routes === "number");
  },
  isAmino(o: any): o is ParamsAmino {
    return o && (o.$typeUrl === Params.typeUrl || typeof o.max_routes === "number");
  },
  encode(message: Params, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.maxRoutes !== 0) {
      writer.uint32(8).uint32(message.maxRoutes);
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
          message.maxRoutes = reader.uint32();
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
      maxRoutes: isSet(object.maxRoutes) ? Number(object.maxRoutes) : 0
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.maxRoutes !== undefined && (obj.maxRoutes = Math.round(message.maxRoutes));
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.maxRoutes = object.maxRoutes ?? 0;
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.max_routes !== undefined && object.max_routes !== null) {
      message.maxRoutes = object.max_routes;
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.max_routes = message.maxRoutes === 0 ? undefined : message.maxRoutes;
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
      typeUrl: "/cyber.grid.v1beta1.Params",
      value: Params.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(Params.typeUrl, Params);
function createBaseRoute(): Route {
  return {
    source: "",
    destination: "",
    name: "",
    value: []
  };
}
export const Route = {
  typeUrl: "/cyber.grid.v1beta1.Route",
  is(o: any): o is Route {
    return o && (o.$typeUrl === Route.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && typeof o.name === "string" && Array.isArray(o.value) && (!o.value.length || Coin.is(o.value[0])));
  },
  isSDK(o: any): o is RouteSDKType {
    return o && (o.$typeUrl === Route.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && typeof o.name === "string" && Array.isArray(o.value) && (!o.value.length || Coin.isSDK(o.value[0])));
  },
  isAmino(o: any): o is RouteAmino {
    return o && (o.$typeUrl === Route.typeUrl || typeof o.source === "string" && typeof o.destination === "string" && typeof o.name === "string" && Array.isArray(o.value) && (!o.value.length || Coin.isAmino(o.value[0])));
  },
  encode(message: Route, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.source !== "") {
      writer.uint32(10).string(message.source);
    }
    if (message.destination !== "") {
      writer.uint32(18).string(message.destination);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    for (const v of message.value) {
      Coin.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Route {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoute();
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
        case 4:
          message.value.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Route {
    return {
      source: isSet(object.source) ? String(object.source) : "",
      destination: isSet(object.destination) ? String(object.destination) : "",
      name: isSet(object.name) ? String(object.name) : "",
      value: Array.isArray(object?.value) ? object.value.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: Route): JsonSafe<Route> {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    message.destination !== undefined && (obj.destination = message.destination);
    message.name !== undefined && (obj.name = message.name);
    if (message.value) {
      obj.value = message.value.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.value = [];
    }
    return obj;
  },
  fromPartial(object: Partial<Route>): Route {
    const message = createBaseRoute();
    message.source = object.source ?? "";
    message.destination = object.destination ?? "";
    message.name = object.name ?? "";
    message.value = object.value?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: RouteAmino): Route {
    const message = createBaseRoute();
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    }
    if (object.destination !== undefined && object.destination !== null) {
      message.destination = object.destination;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    message.value = object.value?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: Route): RouteAmino {
    const obj: any = {};
    obj.source = message.source === "" ? undefined : message.source;
    obj.destination = message.destination === "" ? undefined : message.destination;
    obj.name = message.name === "" ? undefined : message.name;
    if (message.value) {
      obj.value = message.value.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.value = message.value;
    }
    return obj;
  },
  fromAminoMsg(object: RouteAminoMsg): Route {
    return Route.fromAmino(object.value);
  },
  fromProtoMsg(message: RouteProtoMsg): Route {
    return Route.decode(message.value);
  },
  toProto(message: Route): Uint8Array {
    return Route.encode(message).finish();
  },
  toProtoMsg(message: Route): RouteProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.Route",
      value: Route.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(Route.typeUrl, Route);
function createBaseValue(): Value {
  return {
    value: []
  };
}
export const Value = {
  typeUrl: "/cyber.grid.v1beta1.Value",
  is(o: any): o is Value {
    return o && (o.$typeUrl === Value.typeUrl || Array.isArray(o.value) && (!o.value.length || Coin.is(o.value[0])));
  },
  isSDK(o: any): o is ValueSDKType {
    return o && (o.$typeUrl === Value.typeUrl || Array.isArray(o.value) && (!o.value.length || Coin.isSDK(o.value[0])));
  },
  isAmino(o: any): o is ValueAmino {
    return o && (o.$typeUrl === Value.typeUrl || Array.isArray(o.value) && (!o.value.length || Coin.isAmino(o.value[0])));
  },
  encode(message: Value, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.value) {
      Coin.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Value {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.value.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Value {
    return {
      value: Array.isArray(object?.value) ? object.value.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: Value): JsonSafe<Value> {
    const obj: any = {};
    if (message.value) {
      obj.value = message.value.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.value = [];
    }
    return obj;
  },
  fromPartial(object: Partial<Value>): Value {
    const message = createBaseValue();
    message.value = object.value?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: ValueAmino): Value {
    const message = createBaseValue();
    message.value = object.value?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: Value): ValueAmino {
    const obj: any = {};
    if (message.value) {
      obj.value = message.value.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.value = message.value;
    }
    return obj;
  },
  fromAminoMsg(object: ValueAminoMsg): Value {
    return Value.fromAmino(object.value);
  },
  fromProtoMsg(message: ValueProtoMsg): Value {
    return Value.decode(message.value);
  },
  toProto(message: Value): Uint8Array {
    return Value.encode(message).finish();
  },
  toProtoMsg(message: Value): ValueProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.Value",
      value: Value.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(Value.typeUrl, Value);