//@ts-nocheck
import { PageRequest, PageRequestAmino, PageRequestSDKType, PageResponse, PageResponseAmino, PageResponseSDKType } from "../../../cosmos/base/query/v1beta1/pagination";
import { Params, ParamsAmino, ParamsSDKType, Route, RouteAmino, RouteSDKType } from "./types";
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
import { isSet } from "../../../helpers";
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.QueryParamsRequest";
  value: Uint8Array;
}
export interface QueryParamsRequestAmino {}
export interface QueryParamsRequestAminoMsg {
  type: "/cyber.grid.v1beta1.QueryParamsRequest";
  value: QueryParamsRequestAmino;
}
export interface QueryParamsRequestSDKType {}
export interface QueryParamsResponse {
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.QueryParamsResponse";
  value: Uint8Array;
}
export interface QueryParamsResponseAmino {
  params?: ParamsAmino;
}
export interface QueryParamsResponseAminoMsg {
  type: "/cyber.grid.v1beta1.QueryParamsResponse";
  value: QueryParamsResponseAmino;
}
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
export interface QuerySourceRequest {
  source: string;
}
export interface QuerySourceRequestProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.QuerySourceRequest";
  value: Uint8Array;
}
export interface QuerySourceRequestAmino {
  source?: string;
}
export interface QuerySourceRequestAminoMsg {
  type: "/cyber.grid.v1beta1.QuerySourceRequest";
  value: QuerySourceRequestAmino;
}
export interface QuerySourceRequestSDKType {
  source: string;
}
export interface QueryDestinationRequest {
  destination: string;
}
export interface QueryDestinationRequestProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.QueryDestinationRequest";
  value: Uint8Array;
}
export interface QueryDestinationRequestAmino {
  destination?: string;
}
export interface QueryDestinationRequestAminoMsg {
  type: "/cyber.grid.v1beta1.QueryDestinationRequest";
  value: QueryDestinationRequestAmino;
}
export interface QueryDestinationRequestSDKType {
  destination: string;
}
export interface QueryRoutedEnergyResponse {
  value: Coin[];
}
export interface QueryRoutedEnergyResponseProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.QueryRoutedEnergyResponse";
  value: Uint8Array;
}
export interface QueryRoutedEnergyResponseAmino {
  value?: CoinAmino[];
}
export interface QueryRoutedEnergyResponseAminoMsg {
  type: "/cyber.grid.v1beta1.QueryRoutedEnergyResponse";
  value: QueryRoutedEnergyResponseAmino;
}
export interface QueryRoutedEnergyResponseSDKType {
  value: CoinSDKType[];
}
export interface QueryRouteRequest {
  source: string;
  destination: string;
}
export interface QueryRouteRequestProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.QueryRouteRequest";
  value: Uint8Array;
}
export interface QueryRouteRequestAmino {
  source?: string;
  destination?: string;
}
export interface QueryRouteRequestAminoMsg {
  type: "/cyber.grid.v1beta1.QueryRouteRequest";
  value: QueryRouteRequestAmino;
}
export interface QueryRouteRequestSDKType {
  source: string;
  destination: string;
}
export interface QueryRouteResponse {
  route: Route;
}
export interface QueryRouteResponseProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.QueryRouteResponse";
  value: Uint8Array;
}
export interface QueryRouteResponseAmino {
  route?: RouteAmino;
}
export interface QueryRouteResponseAminoMsg {
  type: "/cyber.grid.v1beta1.QueryRouteResponse";
  value: QueryRouteResponseAmino;
}
export interface QueryRouteResponseSDKType {
  route: RouteSDKType;
}
export interface QueryRoutesRequest {
  pagination?: PageRequest;
}
export interface QueryRoutesRequestProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.QueryRoutesRequest";
  value: Uint8Array;
}
export interface QueryRoutesRequestAmino {
  pagination?: PageRequestAmino;
}
export interface QueryRoutesRequestAminoMsg {
  type: "/cyber.grid.v1beta1.QueryRoutesRequest";
  value: QueryRoutesRequestAmino;
}
export interface QueryRoutesRequestSDKType {
  pagination?: PageRequestSDKType;
}
export interface QueryRoutesResponse {
  routes: Route[];
  pagination?: PageResponse;
}
export interface QueryRoutesResponseProtoMsg {
  typeUrl: "/cyber.grid.v1beta1.QueryRoutesResponse";
  value: Uint8Array;
}
export interface QueryRoutesResponseAmino {
  routes?: RouteAmino[];
  pagination?: PageResponseAmino;
}
export interface QueryRoutesResponseAminoMsg {
  type: "/cyber.grid.v1beta1.QueryRoutesResponse";
  value: QueryRoutesResponseAmino;
}
export interface QueryRoutesResponseSDKType {
  routes: RouteSDKType[];
  pagination?: PageResponseSDKType;
}
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.grid.v1beta1.QueryParamsRequest",
  is(o: any): o is QueryParamsRequest {
    return o && o.$typeUrl === QueryParamsRequest.typeUrl;
  },
  isSDK(o: any): o is QueryParamsRequestSDKType {
    return o && o.$typeUrl === QueryParamsRequest.typeUrl;
  },
  isAmino(o: any): o is QueryParamsRequestAmino {
    return o && o.$typeUrl === QueryParamsRequest.typeUrl;
  },
  encode(_: QueryParamsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
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
    return {};
  },
  toJSON(_: QueryParamsRequest): JsonSafe<QueryParamsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryParamsRequest>): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
  fromAmino(_: QueryParamsRequestAmino): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
  toAmino(_: QueryParamsRequest): QueryParamsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryParamsRequestAminoMsg): QueryParamsRequest {
    return QueryParamsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryParamsRequestProtoMsg): QueryParamsRequest {
    return QueryParamsRequest.decode(message.value);
  },
  toProto(message: QueryParamsRequest): Uint8Array {
    return QueryParamsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryParamsRequest): QueryParamsRequestProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.QueryParamsRequest",
      value: QueryParamsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryParamsRequest.typeUrl, QueryParamsRequest);
function createBaseQueryParamsResponse(): QueryParamsResponse {
  return {
    params: Params.fromPartial({})
  };
}
export const QueryParamsResponse = {
  typeUrl: "/cyber.grid.v1beta1.QueryParamsResponse",
  is(o: any): o is QueryParamsResponse {
    return o && (o.$typeUrl === QueryParamsResponse.typeUrl || Params.is(o.params));
  },
  isSDK(o: any): o is QueryParamsResponseSDKType {
    return o && (o.$typeUrl === QueryParamsResponse.typeUrl || Params.isSDK(o.params));
  },
  isAmino(o: any): o is QueryParamsResponseAmino {
    return o && (o.$typeUrl === QueryParamsResponse.typeUrl || Params.isAmino(o.params));
  },
  encode(message: QueryParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
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
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined
    };
  },
  toJSON(message: QueryParamsResponse): JsonSafe<QueryParamsResponse> {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryParamsResponse>): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: QueryParamsResponseAmino): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: QueryParamsResponse): QueryParamsResponseAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryParamsResponseAminoMsg): QueryParamsResponse {
    return QueryParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryParamsResponseProtoMsg): QueryParamsResponse {
    return QueryParamsResponse.decode(message.value);
  },
  toProto(message: QueryParamsResponse): Uint8Array {
    return QueryParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryParamsResponse): QueryParamsResponseProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryParamsResponse.typeUrl, QueryParamsResponse);
function createBaseQuerySourceRequest(): QuerySourceRequest {
  return {
    source: ""
  };
}
export const QuerySourceRequest = {
  typeUrl: "/cyber.grid.v1beta1.QuerySourceRequest",
  is(o: any): o is QuerySourceRequest {
    return o && (o.$typeUrl === QuerySourceRequest.typeUrl || typeof o.source === "string");
  },
  isSDK(o: any): o is QuerySourceRequestSDKType {
    return o && (o.$typeUrl === QuerySourceRequest.typeUrl || typeof o.source === "string");
  },
  isAmino(o: any): o is QuerySourceRequestAmino {
    return o && (o.$typeUrl === QuerySourceRequest.typeUrl || typeof o.source === "string");
  },
  encode(message: QuerySourceRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.source !== "") {
      writer.uint32(10).string(message.source);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QuerySourceRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuerySourceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.source = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QuerySourceRequest {
    return {
      source: isSet(object.source) ? String(object.source) : ""
    };
  },
  toJSON(message: QuerySourceRequest): JsonSafe<QuerySourceRequest> {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    return obj;
  },
  fromPartial(object: Partial<QuerySourceRequest>): QuerySourceRequest {
    const message = createBaseQuerySourceRequest();
    message.source = object.source ?? "";
    return message;
  },
  fromAmino(object: QuerySourceRequestAmino): QuerySourceRequest {
    const message = createBaseQuerySourceRequest();
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    }
    return message;
  },
  toAmino(message: QuerySourceRequest): QuerySourceRequestAmino {
    const obj: any = {};
    obj.source = message.source === "" ? undefined : message.source;
    return obj;
  },
  fromAminoMsg(object: QuerySourceRequestAminoMsg): QuerySourceRequest {
    return QuerySourceRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QuerySourceRequestProtoMsg): QuerySourceRequest {
    return QuerySourceRequest.decode(message.value);
  },
  toProto(message: QuerySourceRequest): Uint8Array {
    return QuerySourceRequest.encode(message).finish();
  },
  toProtoMsg(message: QuerySourceRequest): QuerySourceRequestProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.QuerySourceRequest",
      value: QuerySourceRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QuerySourceRequest.typeUrl, QuerySourceRequest);
function createBaseQueryDestinationRequest(): QueryDestinationRequest {
  return {
    destination: ""
  };
}
export const QueryDestinationRequest = {
  typeUrl: "/cyber.grid.v1beta1.QueryDestinationRequest",
  is(o: any): o is QueryDestinationRequest {
    return o && (o.$typeUrl === QueryDestinationRequest.typeUrl || typeof o.destination === "string");
  },
  isSDK(o: any): o is QueryDestinationRequestSDKType {
    return o && (o.$typeUrl === QueryDestinationRequest.typeUrl || typeof o.destination === "string");
  },
  isAmino(o: any): o is QueryDestinationRequestAmino {
    return o && (o.$typeUrl === QueryDestinationRequest.typeUrl || typeof o.destination === "string");
  },
  encode(message: QueryDestinationRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.destination !== "") {
      writer.uint32(10).string(message.destination);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryDestinationRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDestinationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.destination = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryDestinationRequest {
    return {
      destination: isSet(object.destination) ? String(object.destination) : ""
    };
  },
  toJSON(message: QueryDestinationRequest): JsonSafe<QueryDestinationRequest> {
    const obj: any = {};
    message.destination !== undefined && (obj.destination = message.destination);
    return obj;
  },
  fromPartial(object: Partial<QueryDestinationRequest>): QueryDestinationRequest {
    const message = createBaseQueryDestinationRequest();
    message.destination = object.destination ?? "";
    return message;
  },
  fromAmino(object: QueryDestinationRequestAmino): QueryDestinationRequest {
    const message = createBaseQueryDestinationRequest();
    if (object.destination !== undefined && object.destination !== null) {
      message.destination = object.destination;
    }
    return message;
  },
  toAmino(message: QueryDestinationRequest): QueryDestinationRequestAmino {
    const obj: any = {};
    obj.destination = message.destination === "" ? undefined : message.destination;
    return obj;
  },
  fromAminoMsg(object: QueryDestinationRequestAminoMsg): QueryDestinationRequest {
    return QueryDestinationRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryDestinationRequestProtoMsg): QueryDestinationRequest {
    return QueryDestinationRequest.decode(message.value);
  },
  toProto(message: QueryDestinationRequest): Uint8Array {
    return QueryDestinationRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryDestinationRequest): QueryDestinationRequestProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.QueryDestinationRequest",
      value: QueryDestinationRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryDestinationRequest.typeUrl, QueryDestinationRequest);
function createBaseQueryRoutedEnergyResponse(): QueryRoutedEnergyResponse {
  return {
    value: []
  };
}
export const QueryRoutedEnergyResponse = {
  typeUrl: "/cyber.grid.v1beta1.QueryRoutedEnergyResponse",
  is(o: any): o is QueryRoutedEnergyResponse {
    return o && (o.$typeUrl === QueryRoutedEnergyResponse.typeUrl || Array.isArray(o.value) && (!o.value.length || Coin.is(o.value[0])));
  },
  isSDK(o: any): o is QueryRoutedEnergyResponseSDKType {
    return o && (o.$typeUrl === QueryRoutedEnergyResponse.typeUrl || Array.isArray(o.value) && (!o.value.length || Coin.isSDK(o.value[0])));
  },
  isAmino(o: any): o is QueryRoutedEnergyResponseAmino {
    return o && (o.$typeUrl === QueryRoutedEnergyResponse.typeUrl || Array.isArray(o.value) && (!o.value.length || Coin.isAmino(o.value[0])));
  },
  encode(message: QueryRoutedEnergyResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.value) {
      Coin.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryRoutedEnergyResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRoutedEnergyResponse();
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
  fromJSON(object: any): QueryRoutedEnergyResponse {
    return {
      value: Array.isArray(object?.value) ? object.value.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: QueryRoutedEnergyResponse): JsonSafe<QueryRoutedEnergyResponse> {
    const obj: any = {};
    if (message.value) {
      obj.value = message.value.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.value = [];
    }
    return obj;
  },
  fromPartial(object: Partial<QueryRoutedEnergyResponse>): QueryRoutedEnergyResponse {
    const message = createBaseQueryRoutedEnergyResponse();
    message.value = object.value?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: QueryRoutedEnergyResponseAmino): QueryRoutedEnergyResponse {
    const message = createBaseQueryRoutedEnergyResponse();
    message.value = object.value?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: QueryRoutedEnergyResponse): QueryRoutedEnergyResponseAmino {
    const obj: any = {};
    if (message.value) {
      obj.value = message.value.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.value = message.value;
    }
    return obj;
  },
  fromAminoMsg(object: QueryRoutedEnergyResponseAminoMsg): QueryRoutedEnergyResponse {
    return QueryRoutedEnergyResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryRoutedEnergyResponseProtoMsg): QueryRoutedEnergyResponse {
    return QueryRoutedEnergyResponse.decode(message.value);
  },
  toProto(message: QueryRoutedEnergyResponse): Uint8Array {
    return QueryRoutedEnergyResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryRoutedEnergyResponse): QueryRoutedEnergyResponseProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.QueryRoutedEnergyResponse",
      value: QueryRoutedEnergyResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryRoutedEnergyResponse.typeUrl, QueryRoutedEnergyResponse);
function createBaseQueryRouteRequest(): QueryRouteRequest {
  return {
    source: "",
    destination: ""
  };
}
export const QueryRouteRequest = {
  typeUrl: "/cyber.grid.v1beta1.QueryRouteRequest",
  is(o: any): o is QueryRouteRequest {
    return o && (o.$typeUrl === QueryRouteRequest.typeUrl || typeof o.source === "string" && typeof o.destination === "string");
  },
  isSDK(o: any): o is QueryRouteRequestSDKType {
    return o && (o.$typeUrl === QueryRouteRequest.typeUrl || typeof o.source === "string" && typeof o.destination === "string");
  },
  isAmino(o: any): o is QueryRouteRequestAmino {
    return o && (o.$typeUrl === QueryRouteRequest.typeUrl || typeof o.source === "string" && typeof o.destination === "string");
  },
  encode(message: QueryRouteRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.source !== "") {
      writer.uint32(10).string(message.source);
    }
    if (message.destination !== "") {
      writer.uint32(18).string(message.destination);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryRouteRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRouteRequest();
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
  fromJSON(object: any): QueryRouteRequest {
    return {
      source: isSet(object.source) ? String(object.source) : "",
      destination: isSet(object.destination) ? String(object.destination) : ""
    };
  },
  toJSON(message: QueryRouteRequest): JsonSafe<QueryRouteRequest> {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    message.destination !== undefined && (obj.destination = message.destination);
    return obj;
  },
  fromPartial(object: Partial<QueryRouteRequest>): QueryRouteRequest {
    const message = createBaseQueryRouteRequest();
    message.source = object.source ?? "";
    message.destination = object.destination ?? "";
    return message;
  },
  fromAmino(object: QueryRouteRequestAmino): QueryRouteRequest {
    const message = createBaseQueryRouteRequest();
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    }
    if (object.destination !== undefined && object.destination !== null) {
      message.destination = object.destination;
    }
    return message;
  },
  toAmino(message: QueryRouteRequest): QueryRouteRequestAmino {
    const obj: any = {};
    obj.source = message.source === "" ? undefined : message.source;
    obj.destination = message.destination === "" ? undefined : message.destination;
    return obj;
  },
  fromAminoMsg(object: QueryRouteRequestAminoMsg): QueryRouteRequest {
    return QueryRouteRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryRouteRequestProtoMsg): QueryRouteRequest {
    return QueryRouteRequest.decode(message.value);
  },
  toProto(message: QueryRouteRequest): Uint8Array {
    return QueryRouteRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryRouteRequest): QueryRouteRequestProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.QueryRouteRequest",
      value: QueryRouteRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryRouteRequest.typeUrl, QueryRouteRequest);
function createBaseQueryRouteResponse(): QueryRouteResponse {
  return {
    route: Route.fromPartial({})
  };
}
export const QueryRouteResponse = {
  typeUrl: "/cyber.grid.v1beta1.QueryRouteResponse",
  is(o: any): o is QueryRouteResponse {
    return o && (o.$typeUrl === QueryRouteResponse.typeUrl || Route.is(o.route));
  },
  isSDK(o: any): o is QueryRouteResponseSDKType {
    return o && (o.$typeUrl === QueryRouteResponse.typeUrl || Route.isSDK(o.route));
  },
  isAmino(o: any): o is QueryRouteResponseAmino {
    return o && (o.$typeUrl === QueryRouteResponse.typeUrl || Route.isAmino(o.route));
  },
  encode(message: QueryRouteResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.route !== undefined) {
      Route.encode(message.route, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryRouteResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRouteResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.route = Route.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryRouteResponse {
    return {
      route: isSet(object.route) ? Route.fromJSON(object.route) : undefined
    };
  },
  toJSON(message: QueryRouteResponse): JsonSafe<QueryRouteResponse> {
    const obj: any = {};
    message.route !== undefined && (obj.route = message.route ? Route.toJSON(message.route) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryRouteResponse>): QueryRouteResponse {
    const message = createBaseQueryRouteResponse();
    message.route = object.route !== undefined && object.route !== null ? Route.fromPartial(object.route) : undefined;
    return message;
  },
  fromAmino(object: QueryRouteResponseAmino): QueryRouteResponse {
    const message = createBaseQueryRouteResponse();
    if (object.route !== undefined && object.route !== null) {
      message.route = Route.fromAmino(object.route);
    }
    return message;
  },
  toAmino(message: QueryRouteResponse): QueryRouteResponseAmino {
    const obj: any = {};
    obj.route = message.route ? Route.toAmino(message.route) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryRouteResponseAminoMsg): QueryRouteResponse {
    return QueryRouteResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryRouteResponseProtoMsg): QueryRouteResponse {
    return QueryRouteResponse.decode(message.value);
  },
  toProto(message: QueryRouteResponse): Uint8Array {
    return QueryRouteResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryRouteResponse): QueryRouteResponseProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.QueryRouteResponse",
      value: QueryRouteResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryRouteResponse.typeUrl, QueryRouteResponse);
function createBaseQueryRoutesRequest(): QueryRoutesRequest {
  return {
    pagination: undefined
  };
}
export const QueryRoutesRequest = {
  typeUrl: "/cyber.grid.v1beta1.QueryRoutesRequest",
  is(o: any): o is QueryRoutesRequest {
    return o && o.$typeUrl === QueryRoutesRequest.typeUrl;
  },
  isSDK(o: any): o is QueryRoutesRequestSDKType {
    return o && o.$typeUrl === QueryRoutesRequest.typeUrl;
  },
  isAmino(o: any): o is QueryRoutesRequestAmino {
    return o && o.$typeUrl === QueryRoutesRequest.typeUrl;
  },
  encode(message: QueryRoutesRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryRoutesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRoutesRequest();
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
  fromJSON(object: any): QueryRoutesRequest {
    return {
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryRoutesRequest): JsonSafe<QueryRoutesRequest> {
    const obj: any = {};
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryRoutesRequest>): QueryRoutesRequest {
    const message = createBaseQueryRoutesRequest();
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryRoutesRequestAmino): QueryRoutesRequest {
    const message = createBaseQueryRoutesRequest();
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryRoutesRequest): QueryRoutesRequestAmino {
    const obj: any = {};
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryRoutesRequestAminoMsg): QueryRoutesRequest {
    return QueryRoutesRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryRoutesRequestProtoMsg): QueryRoutesRequest {
    return QueryRoutesRequest.decode(message.value);
  },
  toProto(message: QueryRoutesRequest): Uint8Array {
    return QueryRoutesRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryRoutesRequest): QueryRoutesRequestProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.QueryRoutesRequest",
      value: QueryRoutesRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryRoutesRequest.typeUrl, QueryRoutesRequest);
function createBaseQueryRoutesResponse(): QueryRoutesResponse {
  return {
    routes: [],
    pagination: undefined
  };
}
export const QueryRoutesResponse = {
  typeUrl: "/cyber.grid.v1beta1.QueryRoutesResponse",
  is(o: any): o is QueryRoutesResponse {
    return o && (o.$typeUrl === QueryRoutesResponse.typeUrl || Array.isArray(o.routes) && (!o.routes.length || Route.is(o.routes[0])));
  },
  isSDK(o: any): o is QueryRoutesResponseSDKType {
    return o && (o.$typeUrl === QueryRoutesResponse.typeUrl || Array.isArray(o.routes) && (!o.routes.length || Route.isSDK(o.routes[0])));
  },
  isAmino(o: any): o is QueryRoutesResponseAmino {
    return o && (o.$typeUrl === QueryRoutesResponse.typeUrl || Array.isArray(o.routes) && (!o.routes.length || Route.isAmino(o.routes[0])));
  },
  encode(message: QueryRoutesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.routes) {
      Route.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryRoutesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRoutesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.routes.push(Route.decode(reader, reader.uint32()));
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
  fromJSON(object: any): QueryRoutesResponse {
    return {
      routes: Array.isArray(object?.routes) ? object.routes.map((e: any) => Route.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryRoutesResponse): JsonSafe<QueryRoutesResponse> {
    const obj: any = {};
    if (message.routes) {
      obj.routes = message.routes.map(e => e ? Route.toJSON(e) : undefined);
    } else {
      obj.routes = [];
    }
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryRoutesResponse>): QueryRoutesResponse {
    const message = createBaseQueryRoutesResponse();
    message.routes = object.routes?.map(e => Route.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryRoutesResponseAmino): QueryRoutesResponse {
    const message = createBaseQueryRoutesResponse();
    message.routes = object.routes?.map(e => Route.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryRoutesResponse): QueryRoutesResponseAmino {
    const obj: any = {};
    if (message.routes) {
      obj.routes = message.routes.map(e => e ? Route.toAmino(e) : undefined);
    } else {
      obj.routes = message.routes;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryRoutesResponseAminoMsg): QueryRoutesResponse {
    return QueryRoutesResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryRoutesResponseProtoMsg): QueryRoutesResponse {
    return QueryRoutesResponse.decode(message.value);
  },
  toProto(message: QueryRoutesResponse): Uint8Array {
    return QueryRoutesResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryRoutesResponse): QueryRoutesResponseProtoMsg {
    return {
      typeUrl: "/cyber.grid.v1beta1.QueryRoutesResponse",
      value: QueryRoutesResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryRoutesResponse.typeUrl, QueryRoutesResponse);