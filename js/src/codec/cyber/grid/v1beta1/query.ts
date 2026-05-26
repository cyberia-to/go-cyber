/* eslint-disable */
import { Params, Route } from "./types";
import { PageRequest, PageResponse } from "../../../cosmos/base/query/v1beta1/pagination";
import Long from "long";
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "cyber.grid.v1beta1";

export interface QueryParamsRequest {}

export interface QueryParamsResponse {
  params?: Params;
}

export interface QuerySourceRequest {
  source: string;
}

export interface QueryDestinationRequest {
  destination: string;
}

export interface QueryRoutedEnergyResponse {
  value: Coin[];
}

export interface QueryRouteRequest {
  source: string;
  destination: string;
}

export interface QueryRouteResponse {
  route?: Route;
}

export interface QueryRoutesRequest {
  pagination?: PageRequest;
}

export interface QueryRoutesResponse {
  routes: Route[];
  pagination?: PageResponse;
}

function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}

export const QueryParamsRequest = {
  encode(_: QueryParamsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(_: I): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
};

function createBaseQueryParamsResponse(): QueryParamsResponse {
  return { params: undefined };
}

export const QueryParamsResponse = {
  encode(message: QueryParamsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
    };
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(object: I): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params =
      object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
};

function createBaseQuerySourceRequest(): QuerySourceRequest {
  return { source: "" };
}

export const QuerySourceRequest = {
  encode(message: QuerySourceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.source !== "") {
      writer.uint32(10).string(message.source);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QuerySourceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      source: isSet(object.source) ? String(object.source) : "",
    };
  },

  toJSON(message: QuerySourceRequest): unknown {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QuerySourceRequest>, I>>(object: I): QuerySourceRequest {
    const message = createBaseQuerySourceRequest();
    message.source = object.source ?? "";
    return message;
  },
};

function createBaseQueryDestinationRequest(): QueryDestinationRequest {
  return { destination: "" };
}

export const QueryDestinationRequest = {
  encode(message: QueryDestinationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.destination !== "") {
      writer.uint32(10).string(message.destination);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDestinationRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      destination: isSet(object.destination) ? String(object.destination) : "",
    };
  },

  toJSON(message: QueryDestinationRequest): unknown {
    const obj: any = {};
    message.destination !== undefined && (obj.destination = message.destination);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryDestinationRequest>, I>>(object: I): QueryDestinationRequest {
    const message = createBaseQueryDestinationRequest();
    message.destination = object.destination ?? "";
    return message;
  },
};

function createBaseQueryRoutedEnergyResponse(): QueryRoutedEnergyResponse {
  return { value: [] };
}

export const QueryRoutedEnergyResponse = {
  encode(message: QueryRoutedEnergyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.value) {
      Coin.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRoutedEnergyResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      value: Array.isArray(object?.value) ? object.value.map((e: any) => Coin.fromJSON(e)) : [],
    };
  },

  toJSON(message: QueryRoutedEnergyResponse): unknown {
    const obj: any = {};
    if (message.value) {
      obj.value = message.value.map((e) => (e ? Coin.toJSON(e) : undefined));
    } else {
      obj.value = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryRoutedEnergyResponse>, I>>(
    object: I,
  ): QueryRoutedEnergyResponse {
    const message = createBaseQueryRoutedEnergyResponse();
    message.value = object.value?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

function createBaseQueryRouteRequest(): QueryRouteRequest {
  return { source: "", destination: "" };
}

export const QueryRouteRequest = {
  encode(message: QueryRouteRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.source !== "") {
      writer.uint32(10).string(message.source);
    }
    if (message.destination !== "") {
      writer.uint32(18).string(message.destination);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRouteRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      destination: isSet(object.destination) ? String(object.destination) : "",
    };
  },

  toJSON(message: QueryRouteRequest): unknown {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source);
    message.destination !== undefined && (obj.destination = message.destination);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryRouteRequest>, I>>(object: I): QueryRouteRequest {
    const message = createBaseQueryRouteRequest();
    message.source = object.source ?? "";
    message.destination = object.destination ?? "";
    return message;
  },
};

function createBaseQueryRouteResponse(): QueryRouteResponse {
  return { route: undefined };
}

export const QueryRouteResponse = {
  encode(message: QueryRouteResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.route !== undefined) {
      Route.encode(message.route, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRouteResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      route: isSet(object.route) ? Route.fromJSON(object.route) : undefined,
    };
  },

  toJSON(message: QueryRouteResponse): unknown {
    const obj: any = {};
    message.route !== undefined && (obj.route = message.route ? Route.toJSON(message.route) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryRouteResponse>, I>>(object: I): QueryRouteResponse {
    const message = createBaseQueryRouteResponse();
    message.route =
      object.route !== undefined && object.route !== null ? Route.fromPartial(object.route) : undefined;
    return message;
  },
};

function createBaseQueryRoutesRequest(): QueryRoutesRequest {
  return { pagination: undefined };
}

export const QueryRoutesRequest = {
  encode(message: QueryRoutesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRoutesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryRoutesRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined &&
      (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryRoutesRequest>, I>>(object: I): QueryRoutesRequest {
    const message = createBaseQueryRoutesRequest();
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageRequest.fromPartial(object.pagination)
        : undefined;
    return message;
  },
};

function createBaseQueryRoutesResponse(): QueryRoutesResponse {
  return { routes: [], pagination: undefined };
}

export const QueryRoutesResponse = {
  encode(message: QueryRoutesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.routes) {
      Route.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRoutesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryRoutesResponse): unknown {
    const obj: any = {};
    if (message.routes) {
      obj.routes = message.routes.map((e) => (e ? Route.toJSON(e) : undefined));
    } else {
      obj.routes = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryRoutesResponse>, I>>(object: I): QueryRoutesResponse {
    const message = createBaseQueryRoutesResponse();
    message.routes = object.routes?.map((e) => Route.fromPartial(e)) || [];
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageResponse.fromPartial(object.pagination)
        : undefined;
    return message;
  },
};

export interface Query {
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  SourceRoutes(request: QuerySourceRequest): Promise<QueryRoutesResponse>;
  DestinationRoutes(request: QueryDestinationRequest): Promise<QueryRoutesResponse>;
  DestinationRoutedEnergy(request: QueryDestinationRequest): Promise<QueryRoutedEnergyResponse>;
  SourceRoutedEnergy(request: QuerySourceRequest): Promise<QueryRoutedEnergyResponse>;
  Route(request: QueryRouteRequest): Promise<QueryRouteResponse>;
  Routes(request: QueryRoutesRequest): Promise<QueryRoutesResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
    this.SourceRoutes = this.SourceRoutes.bind(this);
    this.DestinationRoutes = this.DestinationRoutes.bind(this);
    this.DestinationRoutedEnergy = this.DestinationRoutedEnergy.bind(this);
    this.SourceRoutedEnergy = this.SourceRoutedEnergy.bind(this);
    this.Route = this.Route.bind(this);
    this.Routes = this.Routes.bind(this);
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new _m0.Reader(data)));
  }

  SourceRoutes(request: QuerySourceRequest): Promise<QueryRoutesResponse> {
    const data = QuerySourceRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "SourceRoutes", data);
    return promise.then((data) => QueryRoutesResponse.decode(new _m0.Reader(data)));
  }

  DestinationRoutes(request: QueryDestinationRequest): Promise<QueryRoutesResponse> {
    const data = QueryDestinationRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "DestinationRoutes", data);
    return promise.then((data) => QueryRoutesResponse.decode(new _m0.Reader(data)));
  }

  DestinationRoutedEnergy(request: QueryDestinationRequest): Promise<QueryRoutedEnergyResponse> {
    const data = QueryDestinationRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "DestinationRoutedEnergy", data);
    return promise.then((data) => QueryRoutedEnergyResponse.decode(new _m0.Reader(data)));
  }

  SourceRoutedEnergy(request: QuerySourceRequest): Promise<QueryRoutedEnergyResponse> {
    const data = QuerySourceRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "SourceRoutedEnergy", data);
    return promise.then((data) => QueryRoutedEnergyResponse.decode(new _m0.Reader(data)));
  }

  Route(request: QueryRouteRequest): Promise<QueryRouteResponse> {
    const data = QueryRouteRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "Route", data);
    return promise.then((data) => QueryRouteResponse.decode(new _m0.Reader(data)));
  }

  Routes(request: QueryRoutesRequest): Promise<QueryRoutesResponse> {
    const data = QueryRoutesRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.grid.v1beta1.Query", "Routes", data);
    return promise.then((data) => QueryRoutesResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

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
