//@ts-nocheck
import { NeuronBandwidth, NeuronBandwidthAmino, NeuronBandwidthSDKType, Params, ParamsAmino, ParamsSDKType } from "./types";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
import { Decimal } from "@cosmjs/math";
import { isSet } from "../../../helpers";
export interface QueryLoadRequest {}
export interface QueryLoadRequestProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadRequest";
  value: Uint8Array;
}
export interface QueryLoadRequestAmino {}
export interface QueryLoadRequestAminoMsg {
  type: "/cyber.bandwidth.v1beta1.QueryLoadRequest";
  value: QueryLoadRequestAmino;
}
export interface QueryLoadRequestSDKType {}
export interface QueryLoadResponse {
  load: string;
}
export interface QueryLoadResponseProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadResponse";
  value: Uint8Array;
}
export interface QueryLoadResponseAmino {
  load?: string;
}
export interface QueryLoadResponseAminoMsg {
  type: "/cyber.bandwidth.v1beta1.QueryLoadResponse";
  value: QueryLoadResponseAmino;
}
export interface QueryLoadResponseSDKType {
  load: string;
}
export interface QueryPriceRequest {}
export interface QueryPriceRequestProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceRequest";
  value: Uint8Array;
}
export interface QueryPriceRequestAmino {}
export interface QueryPriceRequestAminoMsg {
  type: "/cyber.bandwidth.v1beta1.QueryPriceRequest";
  value: QueryPriceRequestAmino;
}
export interface QueryPriceRequestSDKType {}
export interface QueryPriceResponse {
  price: string;
}
export interface QueryPriceResponseProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceResponse";
  value: Uint8Array;
}
export interface QueryPriceResponseAmino {
  price?: string;
}
export interface QueryPriceResponseAminoMsg {
  type: "/cyber.bandwidth.v1beta1.QueryPriceResponse";
  value: QueryPriceResponseAmino;
}
export interface QueryPriceResponseSDKType {
  price: string;
}
export interface QueryTotalBandwidthRequest {}
export interface QueryTotalBandwidthRequestProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthRequest";
  value: Uint8Array;
}
export interface QueryTotalBandwidthRequestAmino {}
export interface QueryTotalBandwidthRequestAminoMsg {
  type: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthRequest";
  value: QueryTotalBandwidthRequestAmino;
}
export interface QueryTotalBandwidthRequestSDKType {}
export interface QueryTotalBandwidthResponse {
  totalBandwidth: bigint;
}
export interface QueryTotalBandwidthResponseProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthResponse";
  value: Uint8Array;
}
export interface QueryTotalBandwidthResponseAmino {
  total_bandwidth?: string;
}
export interface QueryTotalBandwidthResponseAminoMsg {
  type: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthResponse";
  value: QueryTotalBandwidthResponseAmino;
}
export interface QueryTotalBandwidthResponseSDKType {
  total_bandwidth: bigint;
}
export interface QueryNeuronBandwidthRequest {
  neuron: string;
}
export interface QueryNeuronBandwidthRequestProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthRequest";
  value: Uint8Array;
}
export interface QueryNeuronBandwidthRequestAmino {
  neuron?: string;
}
export interface QueryNeuronBandwidthRequestAminoMsg {
  type: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthRequest";
  value: QueryNeuronBandwidthRequestAmino;
}
export interface QueryNeuronBandwidthRequestSDKType {
  neuron: string;
}
export interface QueryNeuronBandwidthResponse {
  neuronBandwidth: NeuronBandwidth;
}
export interface QueryNeuronBandwidthResponseProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthResponse";
  value: Uint8Array;
}
export interface QueryNeuronBandwidthResponseAmino {
  neuron_bandwidth?: NeuronBandwidthAmino;
}
export interface QueryNeuronBandwidthResponseAminoMsg {
  type: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthResponse";
  value: QueryNeuronBandwidthResponseAmino;
}
export interface QueryNeuronBandwidthResponseSDKType {
  neuron_bandwidth: NeuronBandwidthSDKType;
}
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsRequest";
  value: Uint8Array;
}
export interface QueryParamsRequestAmino {}
export interface QueryParamsRequestAminoMsg {
  type: "/cyber.bandwidth.v1beta1.QueryParamsRequest";
  value: QueryParamsRequestAmino;
}
export interface QueryParamsRequestSDKType {}
export interface QueryParamsResponse {
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsResponse";
  value: Uint8Array;
}
export interface QueryParamsResponseAmino {
  params?: ParamsAmino;
}
export interface QueryParamsResponseAminoMsg {
  type: "/cyber.bandwidth.v1beta1.QueryParamsResponse";
  value: QueryParamsResponseAmino;
}
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
function createBaseQueryLoadRequest(): QueryLoadRequest {
  return {};
}
export const QueryLoadRequest = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadRequest",
  is(o: any): o is QueryLoadRequest {
    return o && o.$typeUrl === QueryLoadRequest.typeUrl;
  },
  isSDK(o: any): o is QueryLoadRequestSDKType {
    return o && o.$typeUrl === QueryLoadRequest.typeUrl;
  },
  isAmino(o: any): o is QueryLoadRequestAmino {
    return o && o.$typeUrl === QueryLoadRequest.typeUrl;
  },
  encode(_: QueryLoadRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLoadRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLoadRequest();
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
  fromJSON(_: any): QueryLoadRequest {
    return {};
  },
  toJSON(_: QueryLoadRequest): JsonSafe<QueryLoadRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryLoadRequest>): QueryLoadRequest {
    const message = createBaseQueryLoadRequest();
    return message;
  },
  fromAmino(_: QueryLoadRequestAmino): QueryLoadRequest {
    const message = createBaseQueryLoadRequest();
    return message;
  },
  toAmino(_: QueryLoadRequest): QueryLoadRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryLoadRequestAminoMsg): QueryLoadRequest {
    return QueryLoadRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLoadRequestProtoMsg): QueryLoadRequest {
    return QueryLoadRequest.decode(message.value);
  },
  toProto(message: QueryLoadRequest): Uint8Array {
    return QueryLoadRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryLoadRequest): QueryLoadRequestProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadRequest",
      value: QueryLoadRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLoadRequest.typeUrl, QueryLoadRequest);
function createBaseQueryLoadResponse(): QueryLoadResponse {
  return {
    load: ""
  };
}
export const QueryLoadResponse = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadResponse",
  is(o: any): o is QueryLoadResponse {
    return o && (o.$typeUrl === QueryLoadResponse.typeUrl || typeof o.load === "string");
  },
  isSDK(o: any): o is QueryLoadResponseSDKType {
    return o && (o.$typeUrl === QueryLoadResponse.typeUrl || typeof o.load === "string");
  },
  isAmino(o: any): o is QueryLoadResponseAmino {
    return o && (o.$typeUrl === QueryLoadResponse.typeUrl || typeof o.load === "string");
  },
  encode(message: QueryLoadResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.load !== "") {
      writer.uint32(10).string(Decimal.fromUserInput(message.load, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLoadResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLoadResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.load = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLoadResponse {
    return {
      load: isSet(object.load) ? String(object.load) : ""
    };
  },
  toJSON(message: QueryLoadResponse): JsonSafe<QueryLoadResponse> {
    const obj: any = {};
    message.load !== undefined && (obj.load = message.load);
    return obj;
  },
  fromPartial(object: Partial<QueryLoadResponse>): QueryLoadResponse {
    const message = createBaseQueryLoadResponse();
    message.load = object.load ?? "";
    return message;
  },
  fromAmino(object: QueryLoadResponseAmino): QueryLoadResponse {
    const message = createBaseQueryLoadResponse();
    if (object.load !== undefined && object.load !== null) {
      message.load = object.load;
    }
    return message;
  },
  toAmino(message: QueryLoadResponse): QueryLoadResponseAmino {
    const obj: any = {};
    obj.load = message.load === "" ? undefined : message.load;
    return obj;
  },
  fromAminoMsg(object: QueryLoadResponseAminoMsg): QueryLoadResponse {
    return QueryLoadResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLoadResponseProtoMsg): QueryLoadResponse {
    return QueryLoadResponse.decode(message.value);
  },
  toProto(message: QueryLoadResponse): Uint8Array {
    return QueryLoadResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryLoadResponse): QueryLoadResponseProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryLoadResponse",
      value: QueryLoadResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLoadResponse.typeUrl, QueryLoadResponse);
function createBaseQueryPriceRequest(): QueryPriceRequest {
  return {};
}
export const QueryPriceRequest = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceRequest",
  is(o: any): o is QueryPriceRequest {
    return o && o.$typeUrl === QueryPriceRequest.typeUrl;
  },
  isSDK(o: any): o is QueryPriceRequestSDKType {
    return o && o.$typeUrl === QueryPriceRequest.typeUrl;
  },
  isAmino(o: any): o is QueryPriceRequestAmino {
    return o && o.$typeUrl === QueryPriceRequest.typeUrl;
  },
  encode(_: QueryPriceRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPriceRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPriceRequest();
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
  fromJSON(_: any): QueryPriceRequest {
    return {};
  },
  toJSON(_: QueryPriceRequest): JsonSafe<QueryPriceRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryPriceRequest>): QueryPriceRequest {
    const message = createBaseQueryPriceRequest();
    return message;
  },
  fromAmino(_: QueryPriceRequestAmino): QueryPriceRequest {
    const message = createBaseQueryPriceRequest();
    return message;
  },
  toAmino(_: QueryPriceRequest): QueryPriceRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryPriceRequestAminoMsg): QueryPriceRequest {
    return QueryPriceRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPriceRequestProtoMsg): QueryPriceRequest {
    return QueryPriceRequest.decode(message.value);
  },
  toProto(message: QueryPriceRequest): Uint8Array {
    return QueryPriceRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPriceRequest): QueryPriceRequestProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceRequest",
      value: QueryPriceRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPriceRequest.typeUrl, QueryPriceRequest);
function createBaseQueryPriceResponse(): QueryPriceResponse {
  return {
    price: ""
  };
}
export const QueryPriceResponse = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceResponse",
  is(o: any): o is QueryPriceResponse {
    return o && (o.$typeUrl === QueryPriceResponse.typeUrl || typeof o.price === "string");
  },
  isSDK(o: any): o is QueryPriceResponseSDKType {
    return o && (o.$typeUrl === QueryPriceResponse.typeUrl || typeof o.price === "string");
  },
  isAmino(o: any): o is QueryPriceResponseAmino {
    return o && (o.$typeUrl === QueryPriceResponse.typeUrl || typeof o.price === "string");
  },
  encode(message: QueryPriceResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.price !== "") {
      writer.uint32(10).string(Decimal.fromUserInput(message.price, 18).atomics);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryPriceResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPriceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.price = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPriceResponse {
    return {
      price: isSet(object.price) ? String(object.price) : ""
    };
  },
  toJSON(message: QueryPriceResponse): JsonSafe<QueryPriceResponse> {
    const obj: any = {};
    message.price !== undefined && (obj.price = message.price);
    return obj;
  },
  fromPartial(object: Partial<QueryPriceResponse>): QueryPriceResponse {
    const message = createBaseQueryPriceResponse();
    message.price = object.price ?? "";
    return message;
  },
  fromAmino(object: QueryPriceResponseAmino): QueryPriceResponse {
    const message = createBaseQueryPriceResponse();
    if (object.price !== undefined && object.price !== null) {
      message.price = object.price;
    }
    return message;
  },
  toAmino(message: QueryPriceResponse): QueryPriceResponseAmino {
    const obj: any = {};
    obj.price = message.price === "" ? undefined : message.price;
    return obj;
  },
  fromAminoMsg(object: QueryPriceResponseAminoMsg): QueryPriceResponse {
    return QueryPriceResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryPriceResponseProtoMsg): QueryPriceResponse {
    return QueryPriceResponse.decode(message.value);
  },
  toProto(message: QueryPriceResponse): Uint8Array {
    return QueryPriceResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPriceResponse): QueryPriceResponseProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryPriceResponse",
      value: QueryPriceResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryPriceResponse.typeUrl, QueryPriceResponse);
function createBaseQueryTotalBandwidthRequest(): QueryTotalBandwidthRequest {
  return {};
}
export const QueryTotalBandwidthRequest = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthRequest",
  is(o: any): o is QueryTotalBandwidthRequest {
    return o && o.$typeUrl === QueryTotalBandwidthRequest.typeUrl;
  },
  isSDK(o: any): o is QueryTotalBandwidthRequestSDKType {
    return o && o.$typeUrl === QueryTotalBandwidthRequest.typeUrl;
  },
  isAmino(o: any): o is QueryTotalBandwidthRequestAmino {
    return o && o.$typeUrl === QueryTotalBandwidthRequest.typeUrl;
  },
  encode(_: QueryTotalBandwidthRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryTotalBandwidthRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryTotalBandwidthRequest();
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
  fromJSON(_: any): QueryTotalBandwidthRequest {
    return {};
  },
  toJSON(_: QueryTotalBandwidthRequest): JsonSafe<QueryTotalBandwidthRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryTotalBandwidthRequest>): QueryTotalBandwidthRequest {
    const message = createBaseQueryTotalBandwidthRequest();
    return message;
  },
  fromAmino(_: QueryTotalBandwidthRequestAmino): QueryTotalBandwidthRequest {
    const message = createBaseQueryTotalBandwidthRequest();
    return message;
  },
  toAmino(_: QueryTotalBandwidthRequest): QueryTotalBandwidthRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryTotalBandwidthRequestAminoMsg): QueryTotalBandwidthRequest {
    return QueryTotalBandwidthRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryTotalBandwidthRequestProtoMsg): QueryTotalBandwidthRequest {
    return QueryTotalBandwidthRequest.decode(message.value);
  },
  toProto(message: QueryTotalBandwidthRequest): Uint8Array {
    return QueryTotalBandwidthRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryTotalBandwidthRequest): QueryTotalBandwidthRequestProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthRequest",
      value: QueryTotalBandwidthRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryTotalBandwidthRequest.typeUrl, QueryTotalBandwidthRequest);
function createBaseQueryTotalBandwidthResponse(): QueryTotalBandwidthResponse {
  return {
    totalBandwidth: BigInt(0)
  };
}
export const QueryTotalBandwidthResponse = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthResponse",
  is(o: any): o is QueryTotalBandwidthResponse {
    return o && (o.$typeUrl === QueryTotalBandwidthResponse.typeUrl || typeof o.totalBandwidth === "bigint");
  },
  isSDK(o: any): o is QueryTotalBandwidthResponseSDKType {
    return o && (o.$typeUrl === QueryTotalBandwidthResponse.typeUrl || typeof o.total_bandwidth === "bigint");
  },
  isAmino(o: any): o is QueryTotalBandwidthResponseAmino {
    return o && (o.$typeUrl === QueryTotalBandwidthResponse.typeUrl || typeof o.total_bandwidth === "bigint");
  },
  encode(message: QueryTotalBandwidthResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.totalBandwidth !== BigInt(0)) {
      writer.uint32(8).uint64(message.totalBandwidth);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryTotalBandwidthResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryTotalBandwidthResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.totalBandwidth = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryTotalBandwidthResponse {
    return {
      totalBandwidth: isSet(object.totalBandwidth) ? BigInt(object.totalBandwidth.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryTotalBandwidthResponse): JsonSafe<QueryTotalBandwidthResponse> {
    const obj: any = {};
    message.totalBandwidth !== undefined && (obj.totalBandwidth = (message.totalBandwidth || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryTotalBandwidthResponse>): QueryTotalBandwidthResponse {
    const message = createBaseQueryTotalBandwidthResponse();
    message.totalBandwidth = object.totalBandwidth !== undefined && object.totalBandwidth !== null ? BigInt(object.totalBandwidth.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryTotalBandwidthResponseAmino): QueryTotalBandwidthResponse {
    const message = createBaseQueryTotalBandwidthResponse();
    if (object.total_bandwidth !== undefined && object.total_bandwidth !== null) {
      message.totalBandwidth = BigInt(object.total_bandwidth);
    }
    return message;
  },
  toAmino(message: QueryTotalBandwidthResponse): QueryTotalBandwidthResponseAmino {
    const obj: any = {};
    obj.total_bandwidth = message.totalBandwidth !== BigInt(0) ? message.totalBandwidth.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryTotalBandwidthResponseAminoMsg): QueryTotalBandwidthResponse {
    return QueryTotalBandwidthResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryTotalBandwidthResponseProtoMsg): QueryTotalBandwidthResponse {
    return QueryTotalBandwidthResponse.decode(message.value);
  },
  toProto(message: QueryTotalBandwidthResponse): Uint8Array {
    return QueryTotalBandwidthResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryTotalBandwidthResponse): QueryTotalBandwidthResponseProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryTotalBandwidthResponse",
      value: QueryTotalBandwidthResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryTotalBandwidthResponse.typeUrl, QueryTotalBandwidthResponse);
function createBaseQueryNeuronBandwidthRequest(): QueryNeuronBandwidthRequest {
  return {
    neuron: ""
  };
}
export const QueryNeuronBandwidthRequest = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthRequest",
  is(o: any): o is QueryNeuronBandwidthRequest {
    return o && (o.$typeUrl === QueryNeuronBandwidthRequest.typeUrl || typeof o.neuron === "string");
  },
  isSDK(o: any): o is QueryNeuronBandwidthRequestSDKType {
    return o && (o.$typeUrl === QueryNeuronBandwidthRequest.typeUrl || typeof o.neuron === "string");
  },
  isAmino(o: any): o is QueryNeuronBandwidthRequestAmino {
    return o && (o.$typeUrl === QueryNeuronBandwidthRequest.typeUrl || typeof o.neuron === "string");
  },
  encode(message: QueryNeuronBandwidthRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.neuron !== "") {
      writer.uint32(10).string(message.neuron);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNeuronBandwidthRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNeuronBandwidthRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.neuron = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryNeuronBandwidthRequest {
    return {
      neuron: isSet(object.neuron) ? String(object.neuron) : ""
    };
  },
  toJSON(message: QueryNeuronBandwidthRequest): JsonSafe<QueryNeuronBandwidthRequest> {
    const obj: any = {};
    message.neuron !== undefined && (obj.neuron = message.neuron);
    return obj;
  },
  fromPartial(object: Partial<QueryNeuronBandwidthRequest>): QueryNeuronBandwidthRequest {
    const message = createBaseQueryNeuronBandwidthRequest();
    message.neuron = object.neuron ?? "";
    return message;
  },
  fromAmino(object: QueryNeuronBandwidthRequestAmino): QueryNeuronBandwidthRequest {
    const message = createBaseQueryNeuronBandwidthRequest();
    if (object.neuron !== undefined && object.neuron !== null) {
      message.neuron = object.neuron;
    }
    return message;
  },
  toAmino(message: QueryNeuronBandwidthRequest): QueryNeuronBandwidthRequestAmino {
    const obj: any = {};
    obj.neuron = message.neuron === "" ? undefined : message.neuron;
    return obj;
  },
  fromAminoMsg(object: QueryNeuronBandwidthRequestAminoMsg): QueryNeuronBandwidthRequest {
    return QueryNeuronBandwidthRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryNeuronBandwidthRequestProtoMsg): QueryNeuronBandwidthRequest {
    return QueryNeuronBandwidthRequest.decode(message.value);
  },
  toProto(message: QueryNeuronBandwidthRequest): Uint8Array {
    return QueryNeuronBandwidthRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryNeuronBandwidthRequest): QueryNeuronBandwidthRequestProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthRequest",
      value: QueryNeuronBandwidthRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryNeuronBandwidthRequest.typeUrl, QueryNeuronBandwidthRequest);
function createBaseQueryNeuronBandwidthResponse(): QueryNeuronBandwidthResponse {
  return {
    neuronBandwidth: NeuronBandwidth.fromPartial({})
  };
}
export const QueryNeuronBandwidthResponse = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthResponse",
  is(o: any): o is QueryNeuronBandwidthResponse {
    return o && (o.$typeUrl === QueryNeuronBandwidthResponse.typeUrl || NeuronBandwidth.is(o.neuronBandwidth));
  },
  isSDK(o: any): o is QueryNeuronBandwidthResponseSDKType {
    return o && (o.$typeUrl === QueryNeuronBandwidthResponse.typeUrl || NeuronBandwidth.isSDK(o.neuron_bandwidth));
  },
  isAmino(o: any): o is QueryNeuronBandwidthResponseAmino {
    return o && (o.$typeUrl === QueryNeuronBandwidthResponse.typeUrl || NeuronBandwidth.isAmino(o.neuron_bandwidth));
  },
  encode(message: QueryNeuronBandwidthResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.neuronBandwidth !== undefined) {
      NeuronBandwidth.encode(message.neuronBandwidth, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNeuronBandwidthResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNeuronBandwidthResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.neuronBandwidth = NeuronBandwidth.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryNeuronBandwidthResponse {
    return {
      neuronBandwidth: isSet(object.neuronBandwidth) ? NeuronBandwidth.fromJSON(object.neuronBandwidth) : undefined
    };
  },
  toJSON(message: QueryNeuronBandwidthResponse): JsonSafe<QueryNeuronBandwidthResponse> {
    const obj: any = {};
    message.neuronBandwidth !== undefined && (obj.neuronBandwidth = message.neuronBandwidth ? NeuronBandwidth.toJSON(message.neuronBandwidth) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryNeuronBandwidthResponse>): QueryNeuronBandwidthResponse {
    const message = createBaseQueryNeuronBandwidthResponse();
    message.neuronBandwidth = object.neuronBandwidth !== undefined && object.neuronBandwidth !== null ? NeuronBandwidth.fromPartial(object.neuronBandwidth) : undefined;
    return message;
  },
  fromAmino(object: QueryNeuronBandwidthResponseAmino): QueryNeuronBandwidthResponse {
    const message = createBaseQueryNeuronBandwidthResponse();
    if (object.neuron_bandwidth !== undefined && object.neuron_bandwidth !== null) {
      message.neuronBandwidth = NeuronBandwidth.fromAmino(object.neuron_bandwidth);
    }
    return message;
  },
  toAmino(message: QueryNeuronBandwidthResponse): QueryNeuronBandwidthResponseAmino {
    const obj: any = {};
    obj.neuron_bandwidth = message.neuronBandwidth ? NeuronBandwidth.toAmino(message.neuronBandwidth) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryNeuronBandwidthResponseAminoMsg): QueryNeuronBandwidthResponse {
    return QueryNeuronBandwidthResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryNeuronBandwidthResponseProtoMsg): QueryNeuronBandwidthResponse {
    return QueryNeuronBandwidthResponse.decode(message.value);
  },
  toProto(message: QueryNeuronBandwidthResponse): Uint8Array {
    return QueryNeuronBandwidthResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryNeuronBandwidthResponse): QueryNeuronBandwidthResponseProtoMsg {
    return {
      typeUrl: "/cyber.bandwidth.v1beta1.QueryNeuronBandwidthResponse",
      value: QueryNeuronBandwidthResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryNeuronBandwidthResponse.typeUrl, QueryNeuronBandwidthResponse);
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsRequest",
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
      typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsRequest",
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
  typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsResponse",
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
      typeUrl: "/cyber.bandwidth.v1beta1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryParamsResponse.typeUrl, QueryParamsResponse);