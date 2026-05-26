//@ts-nocheck
import { Params, ParamsAmino, ParamsSDKType, Thought, ThoughtAmino, ThoughtSDKType, ThoughtStats, ThoughtStatsAmino, ThoughtStatsSDKType } from "./types";
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
import { isSet } from "../../../helpers";
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryParamsRequest";
  value: Uint8Array;
}
export interface QueryParamsRequestAmino {}
export interface QueryParamsRequestAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryParamsRequest";
  value: QueryParamsRequestAmino;
}
export interface QueryParamsRequestSDKType {}
export interface QueryParamsResponse {
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryParamsResponse";
  value: Uint8Array;
}
export interface QueryParamsResponseAmino {
  params?: ParamsAmino;
}
export interface QueryParamsResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryParamsResponse";
  value: QueryParamsResponseAmino;
}
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
export interface QueryThoughtParamsRequest {
  program: string;
  name: string;
}
export interface QueryThoughtParamsRequestProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtParamsRequest";
  value: Uint8Array;
}
export interface QueryThoughtParamsRequestAmino {
  program?: string;
  name?: string;
}
export interface QueryThoughtParamsRequestAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryThoughtParamsRequest";
  value: QueryThoughtParamsRequestAmino;
}
export interface QueryThoughtParamsRequestSDKType {
  program: string;
  name: string;
}
export interface QueryThoughtResponse {
  thought: Thought;
}
export interface QueryThoughtResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtResponse";
  value: Uint8Array;
}
export interface QueryThoughtResponseAmino {
  thought?: ThoughtAmino;
}
export interface QueryThoughtResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryThoughtResponse";
  value: QueryThoughtResponseAmino;
}
export interface QueryThoughtResponseSDKType {
  thought: ThoughtSDKType;
}
export interface QueryThoughtStatsResponse {
  thoughtStats: ThoughtStats;
}
export interface QueryThoughtStatsResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtStatsResponse";
  value: Uint8Array;
}
export interface QueryThoughtStatsResponseAmino {
  thought_stats?: ThoughtStatsAmino;
}
export interface QueryThoughtStatsResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryThoughtStatsResponse";
  value: QueryThoughtStatsResponseAmino;
}
export interface QueryThoughtStatsResponseSDKType {
  thought_stats: ThoughtStatsSDKType;
}
export interface QueryThoughtsRequest {}
export interface QueryThoughtsRequestProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsRequest";
  value: Uint8Array;
}
export interface QueryThoughtsRequestAmino {}
export interface QueryThoughtsRequestAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryThoughtsRequest";
  value: QueryThoughtsRequestAmino;
}
export interface QueryThoughtsRequestSDKType {}
export interface QueryThoughtsResponse {
  thoughts: Thought[];
}
export interface QueryThoughtsResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsResponse";
  value: Uint8Array;
}
export interface QueryThoughtsResponseAmino {
  thoughts?: ThoughtAmino[];
}
export interface QueryThoughtsResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryThoughtsResponse";
  value: QueryThoughtsResponseAmino;
}
export interface QueryThoughtsResponseSDKType {
  thoughts: ThoughtSDKType[];
}
export interface QueryThoughtsStatsRequest {}
export interface QueryThoughtsStatsRequestProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsRequest";
  value: Uint8Array;
}
export interface QueryThoughtsStatsRequestAmino {}
export interface QueryThoughtsStatsRequestAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryThoughtsStatsRequest";
  value: QueryThoughtsStatsRequestAmino;
}
export interface QueryThoughtsStatsRequestSDKType {}
export interface QueryThoughtsStatsResponse {
  thoughtsStats: ThoughtStats[];
}
export interface QueryThoughtsStatsResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsResponse";
  value: Uint8Array;
}
export interface QueryThoughtsStatsResponseAmino {
  thoughts_stats?: ThoughtStatsAmino[];
}
export interface QueryThoughtsStatsResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryThoughtsStatsResponse";
  value: QueryThoughtsStatsResponseAmino;
}
export interface QueryThoughtsStatsResponseSDKType {
  thoughts_stats: ThoughtStatsSDKType[];
}
export interface QueryThoughtsFeesRequest {}
export interface QueryThoughtsFeesRequestProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesRequest";
  value: Uint8Array;
}
export interface QueryThoughtsFeesRequestAmino {}
export interface QueryThoughtsFeesRequestAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryThoughtsFeesRequest";
  value: QueryThoughtsFeesRequestAmino;
}
export interface QueryThoughtsFeesRequestSDKType {}
export interface QueryThoughtsFeesResponse {
  fees: Coin[];
}
export interface QueryThoughtsFeesResponseProtoMsg {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesResponse";
  value: Uint8Array;
}
export interface QueryThoughtsFeesResponseAmino {
  fees?: CoinAmino[];
}
export interface QueryThoughtsFeesResponseAminoMsg {
  type: "/cyber.dmn.v1beta1.QueryThoughtsFeesResponse";
  value: QueryThoughtsFeesResponseAmino;
}
export interface QueryThoughtsFeesResponseSDKType {
  fees: CoinSDKType[];
}
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.dmn.v1beta1.QueryParamsRequest",
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
      typeUrl: "/cyber.dmn.v1beta1.QueryParamsRequest",
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
  typeUrl: "/cyber.dmn.v1beta1.QueryParamsResponse",
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
      typeUrl: "/cyber.dmn.v1beta1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryParamsResponse.typeUrl, QueryParamsResponse);
function createBaseQueryThoughtParamsRequest(): QueryThoughtParamsRequest {
  return {
    program: "",
    name: ""
  };
}
export const QueryThoughtParamsRequest = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtParamsRequest",
  is(o: any): o is QueryThoughtParamsRequest {
    return o && (o.$typeUrl === QueryThoughtParamsRequest.typeUrl || typeof o.program === "string" && typeof o.name === "string");
  },
  isSDK(o: any): o is QueryThoughtParamsRequestSDKType {
    return o && (o.$typeUrl === QueryThoughtParamsRequest.typeUrl || typeof o.program === "string" && typeof o.name === "string");
  },
  isAmino(o: any): o is QueryThoughtParamsRequestAmino {
    return o && (o.$typeUrl === QueryThoughtParamsRequest.typeUrl || typeof o.program === "string" && typeof o.name === "string");
  },
  encode(message: QueryThoughtParamsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.program !== "") {
      writer.uint32(10).string(message.program);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtParamsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtParamsRequest();
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
  fromJSON(object: any): QueryThoughtParamsRequest {
    return {
      program: isSet(object.program) ? String(object.program) : "",
      name: isSet(object.name) ? String(object.name) : ""
    };
  },
  toJSON(message: QueryThoughtParamsRequest): JsonSafe<QueryThoughtParamsRequest> {
    const obj: any = {};
    message.program !== undefined && (obj.program = message.program);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtParamsRequest>): QueryThoughtParamsRequest {
    const message = createBaseQueryThoughtParamsRequest();
    message.program = object.program ?? "";
    message.name = object.name ?? "";
    return message;
  },
  fromAmino(object: QueryThoughtParamsRequestAmino): QueryThoughtParamsRequest {
    const message = createBaseQueryThoughtParamsRequest();
    if (object.program !== undefined && object.program !== null) {
      message.program = object.program;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    return message;
  },
  toAmino(message: QueryThoughtParamsRequest): QueryThoughtParamsRequestAmino {
    const obj: any = {};
    obj.program = message.program === "" ? undefined : message.program;
    obj.name = message.name === "" ? undefined : message.name;
    return obj;
  },
  fromAminoMsg(object: QueryThoughtParamsRequestAminoMsg): QueryThoughtParamsRequest {
    return QueryThoughtParamsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryThoughtParamsRequestProtoMsg): QueryThoughtParamsRequest {
    return QueryThoughtParamsRequest.decode(message.value);
  },
  toProto(message: QueryThoughtParamsRequest): Uint8Array {
    return QueryThoughtParamsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtParamsRequest): QueryThoughtParamsRequestProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtParamsRequest",
      value: QueryThoughtParamsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryThoughtParamsRequest.typeUrl, QueryThoughtParamsRequest);
function createBaseQueryThoughtResponse(): QueryThoughtResponse {
  return {
    thought: Thought.fromPartial({})
  };
}
export const QueryThoughtResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtResponse",
  is(o: any): o is QueryThoughtResponse {
    return o && (o.$typeUrl === QueryThoughtResponse.typeUrl || Thought.is(o.thought));
  },
  isSDK(o: any): o is QueryThoughtResponseSDKType {
    return o && (o.$typeUrl === QueryThoughtResponse.typeUrl || Thought.isSDK(o.thought));
  },
  isAmino(o: any): o is QueryThoughtResponseAmino {
    return o && (o.$typeUrl === QueryThoughtResponse.typeUrl || Thought.isAmino(o.thought));
  },
  encode(message: QueryThoughtResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.thought !== undefined) {
      Thought.encode(message.thought, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.thought = Thought.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryThoughtResponse {
    return {
      thought: isSet(object.thought) ? Thought.fromJSON(object.thought) : undefined
    };
  },
  toJSON(message: QueryThoughtResponse): JsonSafe<QueryThoughtResponse> {
    const obj: any = {};
    message.thought !== undefined && (obj.thought = message.thought ? Thought.toJSON(message.thought) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtResponse>): QueryThoughtResponse {
    const message = createBaseQueryThoughtResponse();
    message.thought = object.thought !== undefined && object.thought !== null ? Thought.fromPartial(object.thought) : undefined;
    return message;
  },
  fromAmino(object: QueryThoughtResponseAmino): QueryThoughtResponse {
    const message = createBaseQueryThoughtResponse();
    if (object.thought !== undefined && object.thought !== null) {
      message.thought = Thought.fromAmino(object.thought);
    }
    return message;
  },
  toAmino(message: QueryThoughtResponse): QueryThoughtResponseAmino {
    const obj: any = {};
    obj.thought = message.thought ? Thought.toAmino(message.thought) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryThoughtResponseAminoMsg): QueryThoughtResponse {
    return QueryThoughtResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryThoughtResponseProtoMsg): QueryThoughtResponse {
    return QueryThoughtResponse.decode(message.value);
  },
  toProto(message: QueryThoughtResponse): Uint8Array {
    return QueryThoughtResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtResponse): QueryThoughtResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtResponse",
      value: QueryThoughtResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryThoughtResponse.typeUrl, QueryThoughtResponse);
function createBaseQueryThoughtStatsResponse(): QueryThoughtStatsResponse {
  return {
    thoughtStats: ThoughtStats.fromPartial({})
  };
}
export const QueryThoughtStatsResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtStatsResponse",
  is(o: any): o is QueryThoughtStatsResponse {
    return o && (o.$typeUrl === QueryThoughtStatsResponse.typeUrl || ThoughtStats.is(o.thoughtStats));
  },
  isSDK(o: any): o is QueryThoughtStatsResponseSDKType {
    return o && (o.$typeUrl === QueryThoughtStatsResponse.typeUrl || ThoughtStats.isSDK(o.thought_stats));
  },
  isAmino(o: any): o is QueryThoughtStatsResponseAmino {
    return o && (o.$typeUrl === QueryThoughtStatsResponse.typeUrl || ThoughtStats.isAmino(o.thought_stats));
  },
  encode(message: QueryThoughtStatsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.thoughtStats !== undefined) {
      ThoughtStats.encode(message.thoughtStats, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtStatsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtStatsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.thoughtStats = ThoughtStats.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryThoughtStatsResponse {
    return {
      thoughtStats: isSet(object.thoughtStats) ? ThoughtStats.fromJSON(object.thoughtStats) : undefined
    };
  },
  toJSON(message: QueryThoughtStatsResponse): JsonSafe<QueryThoughtStatsResponse> {
    const obj: any = {};
    message.thoughtStats !== undefined && (obj.thoughtStats = message.thoughtStats ? ThoughtStats.toJSON(message.thoughtStats) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtStatsResponse>): QueryThoughtStatsResponse {
    const message = createBaseQueryThoughtStatsResponse();
    message.thoughtStats = object.thoughtStats !== undefined && object.thoughtStats !== null ? ThoughtStats.fromPartial(object.thoughtStats) : undefined;
    return message;
  },
  fromAmino(object: QueryThoughtStatsResponseAmino): QueryThoughtStatsResponse {
    const message = createBaseQueryThoughtStatsResponse();
    if (object.thought_stats !== undefined && object.thought_stats !== null) {
      message.thoughtStats = ThoughtStats.fromAmino(object.thought_stats);
    }
    return message;
  },
  toAmino(message: QueryThoughtStatsResponse): QueryThoughtStatsResponseAmino {
    const obj: any = {};
    obj.thought_stats = message.thoughtStats ? ThoughtStats.toAmino(message.thoughtStats) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryThoughtStatsResponseAminoMsg): QueryThoughtStatsResponse {
    return QueryThoughtStatsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryThoughtStatsResponseProtoMsg): QueryThoughtStatsResponse {
    return QueryThoughtStatsResponse.decode(message.value);
  },
  toProto(message: QueryThoughtStatsResponse): Uint8Array {
    return QueryThoughtStatsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtStatsResponse): QueryThoughtStatsResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtStatsResponse",
      value: QueryThoughtStatsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryThoughtStatsResponse.typeUrl, QueryThoughtStatsResponse);
function createBaseQueryThoughtsRequest(): QueryThoughtsRequest {
  return {};
}
export const QueryThoughtsRequest = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsRequest",
  is(o: any): o is QueryThoughtsRequest {
    return o && o.$typeUrl === QueryThoughtsRequest.typeUrl;
  },
  isSDK(o: any): o is QueryThoughtsRequestSDKType {
    return o && o.$typeUrl === QueryThoughtsRequest.typeUrl;
  },
  isAmino(o: any): o is QueryThoughtsRequestAmino {
    return o && o.$typeUrl === QueryThoughtsRequest.typeUrl;
  },
  encode(_: QueryThoughtsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsRequest();
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
  fromJSON(_: any): QueryThoughtsRequest {
    return {};
  },
  toJSON(_: QueryThoughtsRequest): JsonSafe<QueryThoughtsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryThoughtsRequest>): QueryThoughtsRequest {
    const message = createBaseQueryThoughtsRequest();
    return message;
  },
  fromAmino(_: QueryThoughtsRequestAmino): QueryThoughtsRequest {
    const message = createBaseQueryThoughtsRequest();
    return message;
  },
  toAmino(_: QueryThoughtsRequest): QueryThoughtsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryThoughtsRequestAminoMsg): QueryThoughtsRequest {
    return QueryThoughtsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryThoughtsRequestProtoMsg): QueryThoughtsRequest {
    return QueryThoughtsRequest.decode(message.value);
  },
  toProto(message: QueryThoughtsRequest): Uint8Array {
    return QueryThoughtsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsRequest): QueryThoughtsRequestProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsRequest",
      value: QueryThoughtsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryThoughtsRequest.typeUrl, QueryThoughtsRequest);
function createBaseQueryThoughtsResponse(): QueryThoughtsResponse {
  return {
    thoughts: []
  };
}
export const QueryThoughtsResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsResponse",
  is(o: any): o is QueryThoughtsResponse {
    return o && (o.$typeUrl === QueryThoughtsResponse.typeUrl || Array.isArray(o.thoughts) && (!o.thoughts.length || Thought.is(o.thoughts[0])));
  },
  isSDK(o: any): o is QueryThoughtsResponseSDKType {
    return o && (o.$typeUrl === QueryThoughtsResponse.typeUrl || Array.isArray(o.thoughts) && (!o.thoughts.length || Thought.isSDK(o.thoughts[0])));
  },
  isAmino(o: any): o is QueryThoughtsResponseAmino {
    return o && (o.$typeUrl === QueryThoughtsResponse.typeUrl || Array.isArray(o.thoughts) && (!o.thoughts.length || Thought.isAmino(o.thoughts[0])));
  },
  encode(message: QueryThoughtsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.thoughts) {
      Thought.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.thoughts.push(Thought.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryThoughtsResponse {
    return {
      thoughts: Array.isArray(object?.thoughts) ? object.thoughts.map((e: any) => Thought.fromJSON(e)) : []
    };
  },
  toJSON(message: QueryThoughtsResponse): JsonSafe<QueryThoughtsResponse> {
    const obj: any = {};
    if (message.thoughts) {
      obj.thoughts = message.thoughts.map(e => e ? Thought.toJSON(e) : undefined);
    } else {
      obj.thoughts = [];
    }
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtsResponse>): QueryThoughtsResponse {
    const message = createBaseQueryThoughtsResponse();
    message.thoughts = object.thoughts?.map(e => Thought.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: QueryThoughtsResponseAmino): QueryThoughtsResponse {
    const message = createBaseQueryThoughtsResponse();
    message.thoughts = object.thoughts?.map(e => Thought.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: QueryThoughtsResponse): QueryThoughtsResponseAmino {
    const obj: any = {};
    if (message.thoughts) {
      obj.thoughts = message.thoughts.map(e => e ? Thought.toAmino(e) : undefined);
    } else {
      obj.thoughts = message.thoughts;
    }
    return obj;
  },
  fromAminoMsg(object: QueryThoughtsResponseAminoMsg): QueryThoughtsResponse {
    return QueryThoughtsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryThoughtsResponseProtoMsg): QueryThoughtsResponse {
    return QueryThoughtsResponse.decode(message.value);
  },
  toProto(message: QueryThoughtsResponse): Uint8Array {
    return QueryThoughtsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsResponse): QueryThoughtsResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsResponse",
      value: QueryThoughtsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryThoughtsResponse.typeUrl, QueryThoughtsResponse);
function createBaseQueryThoughtsStatsRequest(): QueryThoughtsStatsRequest {
  return {};
}
export const QueryThoughtsStatsRequest = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsRequest",
  is(o: any): o is QueryThoughtsStatsRequest {
    return o && o.$typeUrl === QueryThoughtsStatsRequest.typeUrl;
  },
  isSDK(o: any): o is QueryThoughtsStatsRequestSDKType {
    return o && o.$typeUrl === QueryThoughtsStatsRequest.typeUrl;
  },
  isAmino(o: any): o is QueryThoughtsStatsRequestAmino {
    return o && o.$typeUrl === QueryThoughtsStatsRequest.typeUrl;
  },
  encode(_: QueryThoughtsStatsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsStatsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsStatsRequest();
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
  fromJSON(_: any): QueryThoughtsStatsRequest {
    return {};
  },
  toJSON(_: QueryThoughtsStatsRequest): JsonSafe<QueryThoughtsStatsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryThoughtsStatsRequest>): QueryThoughtsStatsRequest {
    const message = createBaseQueryThoughtsStatsRequest();
    return message;
  },
  fromAmino(_: QueryThoughtsStatsRequestAmino): QueryThoughtsStatsRequest {
    const message = createBaseQueryThoughtsStatsRequest();
    return message;
  },
  toAmino(_: QueryThoughtsStatsRequest): QueryThoughtsStatsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryThoughtsStatsRequestAminoMsg): QueryThoughtsStatsRequest {
    return QueryThoughtsStatsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryThoughtsStatsRequestProtoMsg): QueryThoughtsStatsRequest {
    return QueryThoughtsStatsRequest.decode(message.value);
  },
  toProto(message: QueryThoughtsStatsRequest): Uint8Array {
    return QueryThoughtsStatsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsStatsRequest): QueryThoughtsStatsRequestProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsRequest",
      value: QueryThoughtsStatsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryThoughtsStatsRequest.typeUrl, QueryThoughtsStatsRequest);
function createBaseQueryThoughtsStatsResponse(): QueryThoughtsStatsResponse {
  return {
    thoughtsStats: []
  };
}
export const QueryThoughtsStatsResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsResponse",
  is(o: any): o is QueryThoughtsStatsResponse {
    return o && (o.$typeUrl === QueryThoughtsStatsResponse.typeUrl || Array.isArray(o.thoughtsStats) && (!o.thoughtsStats.length || ThoughtStats.is(o.thoughtsStats[0])));
  },
  isSDK(o: any): o is QueryThoughtsStatsResponseSDKType {
    return o && (o.$typeUrl === QueryThoughtsStatsResponse.typeUrl || Array.isArray(o.thoughts_stats) && (!o.thoughts_stats.length || ThoughtStats.isSDK(o.thoughts_stats[0])));
  },
  isAmino(o: any): o is QueryThoughtsStatsResponseAmino {
    return o && (o.$typeUrl === QueryThoughtsStatsResponse.typeUrl || Array.isArray(o.thoughts_stats) && (!o.thoughts_stats.length || ThoughtStats.isAmino(o.thoughts_stats[0])));
  },
  encode(message: QueryThoughtsStatsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.thoughtsStats) {
      ThoughtStats.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsStatsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsStatsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.thoughtsStats.push(ThoughtStats.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryThoughtsStatsResponse {
    return {
      thoughtsStats: Array.isArray(object?.thoughtsStats) ? object.thoughtsStats.map((e: any) => ThoughtStats.fromJSON(e)) : []
    };
  },
  toJSON(message: QueryThoughtsStatsResponse): JsonSafe<QueryThoughtsStatsResponse> {
    const obj: any = {};
    if (message.thoughtsStats) {
      obj.thoughtsStats = message.thoughtsStats.map(e => e ? ThoughtStats.toJSON(e) : undefined);
    } else {
      obj.thoughtsStats = [];
    }
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtsStatsResponse>): QueryThoughtsStatsResponse {
    const message = createBaseQueryThoughtsStatsResponse();
    message.thoughtsStats = object.thoughtsStats?.map(e => ThoughtStats.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: QueryThoughtsStatsResponseAmino): QueryThoughtsStatsResponse {
    const message = createBaseQueryThoughtsStatsResponse();
    message.thoughtsStats = object.thoughts_stats?.map(e => ThoughtStats.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: QueryThoughtsStatsResponse): QueryThoughtsStatsResponseAmino {
    const obj: any = {};
    if (message.thoughtsStats) {
      obj.thoughts_stats = message.thoughtsStats.map(e => e ? ThoughtStats.toAmino(e) : undefined);
    } else {
      obj.thoughts_stats = message.thoughtsStats;
    }
    return obj;
  },
  fromAminoMsg(object: QueryThoughtsStatsResponseAminoMsg): QueryThoughtsStatsResponse {
    return QueryThoughtsStatsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryThoughtsStatsResponseProtoMsg): QueryThoughtsStatsResponse {
    return QueryThoughtsStatsResponse.decode(message.value);
  },
  toProto(message: QueryThoughtsStatsResponse): Uint8Array {
    return QueryThoughtsStatsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsStatsResponse): QueryThoughtsStatsResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsStatsResponse",
      value: QueryThoughtsStatsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryThoughtsStatsResponse.typeUrl, QueryThoughtsStatsResponse);
function createBaseQueryThoughtsFeesRequest(): QueryThoughtsFeesRequest {
  return {};
}
export const QueryThoughtsFeesRequest = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesRequest",
  is(o: any): o is QueryThoughtsFeesRequest {
    return o && o.$typeUrl === QueryThoughtsFeesRequest.typeUrl;
  },
  isSDK(o: any): o is QueryThoughtsFeesRequestSDKType {
    return o && o.$typeUrl === QueryThoughtsFeesRequest.typeUrl;
  },
  isAmino(o: any): o is QueryThoughtsFeesRequestAmino {
    return o && o.$typeUrl === QueryThoughtsFeesRequest.typeUrl;
  },
  encode(_: QueryThoughtsFeesRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsFeesRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsFeesRequest();
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
  fromJSON(_: any): QueryThoughtsFeesRequest {
    return {};
  },
  toJSON(_: QueryThoughtsFeesRequest): JsonSafe<QueryThoughtsFeesRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryThoughtsFeesRequest>): QueryThoughtsFeesRequest {
    const message = createBaseQueryThoughtsFeesRequest();
    return message;
  },
  fromAmino(_: QueryThoughtsFeesRequestAmino): QueryThoughtsFeesRequest {
    const message = createBaseQueryThoughtsFeesRequest();
    return message;
  },
  toAmino(_: QueryThoughtsFeesRequest): QueryThoughtsFeesRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryThoughtsFeesRequestAminoMsg): QueryThoughtsFeesRequest {
    return QueryThoughtsFeesRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryThoughtsFeesRequestProtoMsg): QueryThoughtsFeesRequest {
    return QueryThoughtsFeesRequest.decode(message.value);
  },
  toProto(message: QueryThoughtsFeesRequest): Uint8Array {
    return QueryThoughtsFeesRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsFeesRequest): QueryThoughtsFeesRequestProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesRequest",
      value: QueryThoughtsFeesRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryThoughtsFeesRequest.typeUrl, QueryThoughtsFeesRequest);
function createBaseQueryThoughtsFeesResponse(): QueryThoughtsFeesResponse {
  return {
    fees: []
  };
}
export const QueryThoughtsFeesResponse = {
  typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesResponse",
  is(o: any): o is QueryThoughtsFeesResponse {
    return o && (o.$typeUrl === QueryThoughtsFeesResponse.typeUrl || Array.isArray(o.fees) && (!o.fees.length || Coin.is(o.fees[0])));
  },
  isSDK(o: any): o is QueryThoughtsFeesResponseSDKType {
    return o && (o.$typeUrl === QueryThoughtsFeesResponse.typeUrl || Array.isArray(o.fees) && (!o.fees.length || Coin.isSDK(o.fees[0])));
  },
  isAmino(o: any): o is QueryThoughtsFeesResponseAmino {
    return o && (o.$typeUrl === QueryThoughtsFeesResponse.typeUrl || Array.isArray(o.fees) && (!o.fees.length || Coin.isAmino(o.fees[0])));
  },
  encode(message: QueryThoughtsFeesResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.fees) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryThoughtsFeesResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryThoughtsFeesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          message.fees.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryThoughtsFeesResponse {
    return {
      fees: Array.isArray(object?.fees) ? object.fees.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: QueryThoughtsFeesResponse): JsonSafe<QueryThoughtsFeesResponse> {
    const obj: any = {};
    if (message.fees) {
      obj.fees = message.fees.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.fees = [];
    }
    return obj;
  },
  fromPartial(object: Partial<QueryThoughtsFeesResponse>): QueryThoughtsFeesResponse {
    const message = createBaseQueryThoughtsFeesResponse();
    message.fees = object.fees?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: QueryThoughtsFeesResponseAmino): QueryThoughtsFeesResponse {
    const message = createBaseQueryThoughtsFeesResponse();
    message.fees = object.fees?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: QueryThoughtsFeesResponse): QueryThoughtsFeesResponseAmino {
    const obj: any = {};
    if (message.fees) {
      obj.fees = message.fees.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.fees = message.fees;
    }
    return obj;
  },
  fromAminoMsg(object: QueryThoughtsFeesResponseAminoMsg): QueryThoughtsFeesResponse {
    return QueryThoughtsFeesResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryThoughtsFeesResponseProtoMsg): QueryThoughtsFeesResponse {
    return QueryThoughtsFeesResponse.decode(message.value);
  },
  toProto(message: QueryThoughtsFeesResponse): Uint8Array {
    return QueryThoughtsFeesResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryThoughtsFeesResponse): QueryThoughtsFeesResponseProtoMsg {
    return {
      typeUrl: "/cyber.dmn.v1beta1.QueryThoughtsFeesResponse",
      value: QueryThoughtsFeesResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryThoughtsFeesResponse.typeUrl, QueryThoughtsFeesResponse);