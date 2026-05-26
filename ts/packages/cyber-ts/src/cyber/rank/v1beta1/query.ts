//@ts-nocheck
import { PageRequest, PageRequestAmino, PageRequestSDKType, PageResponse, PageResponseAmino, PageResponseSDKType } from "./pagination";
import { Params, ParamsAmino, ParamsSDKType, RankedParticle, RankedParticleAmino, RankedParticleSDKType } from "./types";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
import { isSet } from "../../../helpers";
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryParamsRequest";
  value: Uint8Array;
}
export interface QueryParamsRequestAmino {}
export interface QueryParamsRequestAminoMsg {
  type: "/cyber.rank.v1beta1.QueryParamsRequest";
  value: QueryParamsRequestAmino;
}
export interface QueryParamsRequestSDKType {}
export interface QueryParamsResponse {
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryParamsResponse";
  value: Uint8Array;
}
export interface QueryParamsResponseAmino {
  params?: ParamsAmino;
}
export interface QueryParamsResponseAminoMsg {
  type: "/cyber.rank.v1beta1.QueryParamsResponse";
  value: QueryParamsResponseAmino;
}
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
export interface QueryRankRequest {
  particle: string;
}
export interface QueryRankRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryRankRequest";
  value: Uint8Array;
}
export interface QueryRankRequestAmino {
  particle?: string;
}
export interface QueryRankRequestAminoMsg {
  type: "/cyber.rank.v1beta1.QueryRankRequest";
  value: QueryRankRequestAmino;
}
export interface QueryRankRequestSDKType {
  particle: string;
}
export interface QueryRankResponse {
  rank: bigint;
}
export interface QueryRankResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryRankResponse";
  value: Uint8Array;
}
export interface QueryRankResponseAmino {
  rank?: string;
}
export interface QueryRankResponseAminoMsg {
  type: "/cyber.rank.v1beta1.QueryRankResponse";
  value: QueryRankResponseAmino;
}
export interface QueryRankResponseSDKType {
  rank: bigint;
}
export interface QuerySearchRequest {
  particle: string;
  pagination?: PageRequest;
}
export interface QuerySearchRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QuerySearchRequest";
  value: Uint8Array;
}
export interface QuerySearchRequestAmino {
  particle?: string;
  pagination?: PageRequestAmino;
}
export interface QuerySearchRequestAminoMsg {
  type: "/cyber.rank.v1beta1.QuerySearchRequest";
  value: QuerySearchRequestAmino;
}
export interface QuerySearchRequestSDKType {
  particle: string;
  pagination?: PageRequestSDKType;
}
export interface QuerySearchResponse {
  result: RankedParticle[];
  pagination?: PageResponse;
}
export interface QuerySearchResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QuerySearchResponse";
  value: Uint8Array;
}
export interface QuerySearchResponseAmino {
  result?: RankedParticleAmino[];
  pagination?: PageResponseAmino;
}
export interface QuerySearchResponseAminoMsg {
  type: "/cyber.rank.v1beta1.QuerySearchResponse";
  value: QuerySearchResponseAmino;
}
export interface QuerySearchResponseSDKType {
  result: RankedParticleSDKType[];
  pagination?: PageResponseSDKType;
}
export interface QueryTopRequest {
  pagination?: PageRequest;
}
export interface QueryTopRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryTopRequest";
  value: Uint8Array;
}
export interface QueryTopRequestAmino {
  pagination?: PageRequestAmino;
}
export interface QueryTopRequestAminoMsg {
  type: "/cyber.rank.v1beta1.QueryTopRequest";
  value: QueryTopRequestAmino;
}
export interface QueryTopRequestSDKType {
  pagination?: PageRequestSDKType;
}
export interface QueryIsLinkExistRequest {
  from: string;
  to: string;
  address: string;
}
export interface QueryIsLinkExistRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryIsLinkExistRequest";
  value: Uint8Array;
}
export interface QueryIsLinkExistRequestAmino {
  from?: string;
  to?: string;
  address?: string;
}
export interface QueryIsLinkExistRequestAminoMsg {
  type: "/cyber.rank.v1beta1.QueryIsLinkExistRequest";
  value: QueryIsLinkExistRequestAmino;
}
export interface QueryIsLinkExistRequestSDKType {
  from: string;
  to: string;
  address: string;
}
export interface QueryIsAnyLinkExistRequest {
  from: string;
  to: string;
}
export interface QueryIsAnyLinkExistRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryIsAnyLinkExistRequest";
  value: Uint8Array;
}
export interface QueryIsAnyLinkExistRequestAmino {
  from?: string;
  to?: string;
}
export interface QueryIsAnyLinkExistRequestAminoMsg {
  type: "/cyber.rank.v1beta1.QueryIsAnyLinkExistRequest";
  value: QueryIsAnyLinkExistRequestAmino;
}
export interface QueryIsAnyLinkExistRequestSDKType {
  from: string;
  to: string;
}
export interface QueryLinkExistResponse {
  exist: boolean;
}
export interface QueryLinkExistResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryLinkExistResponse";
  value: Uint8Array;
}
export interface QueryLinkExistResponseAmino {
  exist?: boolean;
}
export interface QueryLinkExistResponseAminoMsg {
  type: "/cyber.rank.v1beta1.QueryLinkExistResponse";
  value: QueryLinkExistResponseAmino;
}
export interface QueryLinkExistResponseSDKType {
  exist: boolean;
}
export interface QueryNegentropyPartilceRequest {
  particle: string;
}
export interface QueryNegentropyPartilceRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyPartilceRequest";
  value: Uint8Array;
}
export interface QueryNegentropyPartilceRequestAmino {
  particle?: string;
}
export interface QueryNegentropyPartilceRequestAminoMsg {
  type: "/cyber.rank.v1beta1.QueryNegentropyPartilceRequest";
  value: QueryNegentropyPartilceRequestAmino;
}
export interface QueryNegentropyPartilceRequestSDKType {
  particle: string;
}
export interface QueryNegentropyParticleResponse {
  entropy: bigint;
}
export interface QueryNegentropyParticleResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyParticleResponse";
  value: Uint8Array;
}
export interface QueryNegentropyParticleResponseAmino {
  entropy?: string;
}
export interface QueryNegentropyParticleResponseAminoMsg {
  type: "/cyber.rank.v1beta1.QueryNegentropyParticleResponse";
  value: QueryNegentropyParticleResponseAmino;
}
export interface QueryNegentropyParticleResponseSDKType {
  entropy: bigint;
}
export interface QueryNegentropyRequest {}
export interface QueryNegentropyRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyRequest";
  value: Uint8Array;
}
export interface QueryNegentropyRequestAmino {}
export interface QueryNegentropyRequestAminoMsg {
  type: "/cyber.rank.v1beta1.QueryNegentropyRequest";
  value: QueryNegentropyRequestAmino;
}
export interface QueryNegentropyRequestSDKType {}
export interface QueryNegentropyResponse {
  negentropy: bigint;
}
export interface QueryNegentropyResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyResponse";
  value: Uint8Array;
}
export interface QueryNegentropyResponseAmino {
  negentropy?: string;
}
export interface QueryNegentropyResponseAminoMsg {
  type: "/cyber.rank.v1beta1.QueryNegentropyResponse";
  value: QueryNegentropyResponseAmino;
}
export interface QueryNegentropyResponseSDKType {
  negentropy: bigint;
}
export interface QueryKarmaRequest {
  neuron: string;
}
export interface QueryKarmaRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryKarmaRequest";
  value: Uint8Array;
}
export interface QueryKarmaRequestAmino {
  neuron?: string;
}
export interface QueryKarmaRequestAminoMsg {
  type: "/cyber.rank.v1beta1.QueryKarmaRequest";
  value: QueryKarmaRequestAmino;
}
export interface QueryKarmaRequestSDKType {
  neuron: string;
}
export interface QueryKarmaResponse {
  karma: bigint;
}
export interface QueryKarmaResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.QueryKarmaResponse";
  value: Uint8Array;
}
export interface QueryKarmaResponseAmino {
  karma?: string;
}
export interface QueryKarmaResponseAminoMsg {
  type: "/cyber.rank.v1beta1.QueryKarmaResponse";
  value: QueryKarmaResponseAmino;
}
export interface QueryKarmaResponseSDKType {
  karma: bigint;
}
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryParamsRequest",
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
      typeUrl: "/cyber.rank.v1beta1.QueryParamsRequest",
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
  typeUrl: "/cyber.rank.v1beta1.QueryParamsResponse",
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
      typeUrl: "/cyber.rank.v1beta1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryParamsResponse.typeUrl, QueryParamsResponse);
function createBaseQueryRankRequest(): QueryRankRequest {
  return {
    particle: ""
  };
}
export const QueryRankRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryRankRequest",
  is(o: any): o is QueryRankRequest {
    return o && (o.$typeUrl === QueryRankRequest.typeUrl || typeof o.particle === "string");
  },
  isSDK(o: any): o is QueryRankRequestSDKType {
    return o && (o.$typeUrl === QueryRankRequest.typeUrl || typeof o.particle === "string");
  },
  isAmino(o: any): o is QueryRankRequestAmino {
    return o && (o.$typeUrl === QueryRankRequest.typeUrl || typeof o.particle === "string");
  },
  encode(message: QueryRankRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.particle !== "") {
      writer.uint32(10).string(message.particle);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryRankRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRankRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.particle = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryRankRequest {
    return {
      particle: isSet(object.particle) ? String(object.particle) : ""
    };
  },
  toJSON(message: QueryRankRequest): JsonSafe<QueryRankRequest> {
    const obj: any = {};
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },
  fromPartial(object: Partial<QueryRankRequest>): QueryRankRequest {
    const message = createBaseQueryRankRequest();
    message.particle = object.particle ?? "";
    return message;
  },
  fromAmino(object: QueryRankRequestAmino): QueryRankRequest {
    const message = createBaseQueryRankRequest();
    if (object.particle !== undefined && object.particle !== null) {
      message.particle = object.particle;
    }
    return message;
  },
  toAmino(message: QueryRankRequest): QueryRankRequestAmino {
    const obj: any = {};
    obj.particle = message.particle === "" ? undefined : message.particle;
    return obj;
  },
  fromAminoMsg(object: QueryRankRequestAminoMsg): QueryRankRequest {
    return QueryRankRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryRankRequestProtoMsg): QueryRankRequest {
    return QueryRankRequest.decode(message.value);
  },
  toProto(message: QueryRankRequest): Uint8Array {
    return QueryRankRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryRankRequest): QueryRankRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryRankRequest",
      value: QueryRankRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryRankRequest.typeUrl, QueryRankRequest);
function createBaseQueryRankResponse(): QueryRankResponse {
  return {
    rank: BigInt(0)
  };
}
export const QueryRankResponse = {
  typeUrl: "/cyber.rank.v1beta1.QueryRankResponse",
  is(o: any): o is QueryRankResponse {
    return o && (o.$typeUrl === QueryRankResponse.typeUrl || typeof o.rank === "bigint");
  },
  isSDK(o: any): o is QueryRankResponseSDKType {
    return o && (o.$typeUrl === QueryRankResponse.typeUrl || typeof o.rank === "bigint");
  },
  isAmino(o: any): o is QueryRankResponseAmino {
    return o && (o.$typeUrl === QueryRankResponse.typeUrl || typeof o.rank === "bigint");
  },
  encode(message: QueryRankResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.rank !== BigInt(0)) {
      writer.uint32(8).uint64(message.rank);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryRankResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRankResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rank = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryRankResponse {
    return {
      rank: isSet(object.rank) ? BigInt(object.rank.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryRankResponse): JsonSafe<QueryRankResponse> {
    const obj: any = {};
    message.rank !== undefined && (obj.rank = (message.rank || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryRankResponse>): QueryRankResponse {
    const message = createBaseQueryRankResponse();
    message.rank = object.rank !== undefined && object.rank !== null ? BigInt(object.rank.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryRankResponseAmino): QueryRankResponse {
    const message = createBaseQueryRankResponse();
    if (object.rank !== undefined && object.rank !== null) {
      message.rank = BigInt(object.rank);
    }
    return message;
  },
  toAmino(message: QueryRankResponse): QueryRankResponseAmino {
    const obj: any = {};
    obj.rank = message.rank !== BigInt(0) ? message.rank.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryRankResponseAminoMsg): QueryRankResponse {
    return QueryRankResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryRankResponseProtoMsg): QueryRankResponse {
    return QueryRankResponse.decode(message.value);
  },
  toProto(message: QueryRankResponse): Uint8Array {
    return QueryRankResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryRankResponse): QueryRankResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryRankResponse",
      value: QueryRankResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryRankResponse.typeUrl, QueryRankResponse);
function createBaseQuerySearchRequest(): QuerySearchRequest {
  return {
    particle: "",
    pagination: undefined
  };
}
export const QuerySearchRequest = {
  typeUrl: "/cyber.rank.v1beta1.QuerySearchRequest",
  is(o: any): o is QuerySearchRequest {
    return o && (o.$typeUrl === QuerySearchRequest.typeUrl || typeof o.particle === "string");
  },
  isSDK(o: any): o is QuerySearchRequestSDKType {
    return o && (o.$typeUrl === QuerySearchRequest.typeUrl || typeof o.particle === "string");
  },
  isAmino(o: any): o is QuerySearchRequestAmino {
    return o && (o.$typeUrl === QuerySearchRequest.typeUrl || typeof o.particle === "string");
  },
  encode(message: QuerySearchRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.particle !== "") {
      writer.uint32(10).string(message.particle);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QuerySearchRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuerySearchRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.particle = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QuerySearchRequest {
    return {
      particle: isSet(object.particle) ? String(object.particle) : "",
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QuerySearchRequest): JsonSafe<QuerySearchRequest> {
    const obj: any = {};
    message.particle !== undefined && (obj.particle = message.particle);
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QuerySearchRequest>): QuerySearchRequest {
    const message = createBaseQuerySearchRequest();
    message.particle = object.particle ?? "";
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QuerySearchRequestAmino): QuerySearchRequest {
    const message = createBaseQuerySearchRequest();
    if (object.particle !== undefined && object.particle !== null) {
      message.particle = object.particle;
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QuerySearchRequest): QuerySearchRequestAmino {
    const obj: any = {};
    obj.particle = message.particle === "" ? undefined : message.particle;
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QuerySearchRequestAminoMsg): QuerySearchRequest {
    return QuerySearchRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QuerySearchRequestProtoMsg): QuerySearchRequest {
    return QuerySearchRequest.decode(message.value);
  },
  toProto(message: QuerySearchRequest): Uint8Array {
    return QuerySearchRequest.encode(message).finish();
  },
  toProtoMsg(message: QuerySearchRequest): QuerySearchRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QuerySearchRequest",
      value: QuerySearchRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QuerySearchRequest.typeUrl, QuerySearchRequest);
function createBaseQuerySearchResponse(): QuerySearchResponse {
  return {
    result: [],
    pagination: undefined
  };
}
export const QuerySearchResponse = {
  typeUrl: "/cyber.rank.v1beta1.QuerySearchResponse",
  is(o: any): o is QuerySearchResponse {
    return o && (o.$typeUrl === QuerySearchResponse.typeUrl || Array.isArray(o.result) && (!o.result.length || RankedParticle.is(o.result[0])));
  },
  isSDK(o: any): o is QuerySearchResponseSDKType {
    return o && (o.$typeUrl === QuerySearchResponse.typeUrl || Array.isArray(o.result) && (!o.result.length || RankedParticle.isSDK(o.result[0])));
  },
  isAmino(o: any): o is QuerySearchResponseAmino {
    return o && (o.$typeUrl === QuerySearchResponse.typeUrl || Array.isArray(o.result) && (!o.result.length || RankedParticle.isAmino(o.result[0])));
  },
  encode(message: QuerySearchResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.result) {
      RankedParticle.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QuerySearchResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuerySearchResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result.push(RankedParticle.decode(reader, reader.uint32()));
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
  fromJSON(object: any): QuerySearchResponse {
    return {
      result: Array.isArray(object?.result) ? object.result.map((e: any) => RankedParticle.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QuerySearchResponse): JsonSafe<QuerySearchResponse> {
    const obj: any = {};
    if (message.result) {
      obj.result = message.result.map(e => e ? RankedParticle.toJSON(e) : undefined);
    } else {
      obj.result = [];
    }
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QuerySearchResponse>): QuerySearchResponse {
    const message = createBaseQuerySearchResponse();
    message.result = object.result?.map(e => RankedParticle.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QuerySearchResponseAmino): QuerySearchResponse {
    const message = createBaseQuerySearchResponse();
    message.result = object.result?.map(e => RankedParticle.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QuerySearchResponse): QuerySearchResponseAmino {
    const obj: any = {};
    if (message.result) {
      obj.result = message.result.map(e => e ? RankedParticle.toAmino(e) : undefined);
    } else {
      obj.result = message.result;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QuerySearchResponseAminoMsg): QuerySearchResponse {
    return QuerySearchResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QuerySearchResponseProtoMsg): QuerySearchResponse {
    return QuerySearchResponse.decode(message.value);
  },
  toProto(message: QuerySearchResponse): Uint8Array {
    return QuerySearchResponse.encode(message).finish();
  },
  toProtoMsg(message: QuerySearchResponse): QuerySearchResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QuerySearchResponse",
      value: QuerySearchResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QuerySearchResponse.typeUrl, QuerySearchResponse);
function createBaseQueryTopRequest(): QueryTopRequest {
  return {
    pagination: undefined
  };
}
export const QueryTopRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryTopRequest",
  is(o: any): o is QueryTopRequest {
    return o && o.$typeUrl === QueryTopRequest.typeUrl;
  },
  isSDK(o: any): o is QueryTopRequestSDKType {
    return o && o.$typeUrl === QueryTopRequest.typeUrl;
  },
  isAmino(o: any): o is QueryTopRequestAmino {
    return o && o.$typeUrl === QueryTopRequest.typeUrl;
  },
  encode(message: QueryTopRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryTopRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryTopRequest();
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
  fromJSON(object: any): QueryTopRequest {
    return {
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryTopRequest): JsonSafe<QueryTopRequest> {
    const obj: any = {};
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryTopRequest>): QueryTopRequest {
    const message = createBaseQueryTopRequest();
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryTopRequestAmino): QueryTopRequest {
    const message = createBaseQueryTopRequest();
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryTopRequest): QueryTopRequestAmino {
    const obj: any = {};
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryTopRequestAminoMsg): QueryTopRequest {
    return QueryTopRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryTopRequestProtoMsg): QueryTopRequest {
    return QueryTopRequest.decode(message.value);
  },
  toProto(message: QueryTopRequest): Uint8Array {
    return QueryTopRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryTopRequest): QueryTopRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryTopRequest",
      value: QueryTopRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryTopRequest.typeUrl, QueryTopRequest);
function createBaseQueryIsLinkExistRequest(): QueryIsLinkExistRequest {
  return {
    from: "",
    to: "",
    address: ""
  };
}
export const QueryIsLinkExistRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryIsLinkExistRequest",
  is(o: any): o is QueryIsLinkExistRequest {
    return o && (o.$typeUrl === QueryIsLinkExistRequest.typeUrl || typeof o.from === "string" && typeof o.to === "string" && typeof o.address === "string");
  },
  isSDK(o: any): o is QueryIsLinkExistRequestSDKType {
    return o && (o.$typeUrl === QueryIsLinkExistRequest.typeUrl || typeof o.from === "string" && typeof o.to === "string" && typeof o.address === "string");
  },
  isAmino(o: any): o is QueryIsLinkExistRequestAmino {
    return o && (o.$typeUrl === QueryIsLinkExistRequest.typeUrl || typeof o.from === "string" && typeof o.to === "string" && typeof o.address === "string");
  },
  encode(message: QueryIsLinkExistRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(18).string(message.to);
    }
    if (message.address !== "") {
      writer.uint32(26).string(message.address);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryIsLinkExistRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryIsLinkExistRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string();
          break;
        case 2:
          message.to = reader.string();
          break;
        case 3:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryIsLinkExistRequest {
    return {
      from: isSet(object.from) ? String(object.from) : "",
      to: isSet(object.to) ? String(object.to) : "",
      address: isSet(object.address) ? String(object.address) : ""
    };
  },
  toJSON(message: QueryIsLinkExistRequest): JsonSafe<QueryIsLinkExistRequest> {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },
  fromPartial(object: Partial<QueryIsLinkExistRequest>): QueryIsLinkExistRequest {
    const message = createBaseQueryIsLinkExistRequest();
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    message.address = object.address ?? "";
    return message;
  },
  fromAmino(object: QueryIsLinkExistRequestAmino): QueryIsLinkExistRequest {
    const message = createBaseQueryIsLinkExistRequest();
    if (object.from !== undefined && object.from !== null) {
      message.from = object.from;
    }
    if (object.to !== undefined && object.to !== null) {
      message.to = object.to;
    }
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    return message;
  },
  toAmino(message: QueryIsLinkExistRequest): QueryIsLinkExistRequestAmino {
    const obj: any = {};
    obj.from = message.from === "" ? undefined : message.from;
    obj.to = message.to === "" ? undefined : message.to;
    obj.address = message.address === "" ? undefined : message.address;
    return obj;
  },
  fromAminoMsg(object: QueryIsLinkExistRequestAminoMsg): QueryIsLinkExistRequest {
    return QueryIsLinkExistRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryIsLinkExistRequestProtoMsg): QueryIsLinkExistRequest {
    return QueryIsLinkExistRequest.decode(message.value);
  },
  toProto(message: QueryIsLinkExistRequest): Uint8Array {
    return QueryIsLinkExistRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryIsLinkExistRequest): QueryIsLinkExistRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryIsLinkExistRequest",
      value: QueryIsLinkExistRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryIsLinkExistRequest.typeUrl, QueryIsLinkExistRequest);
function createBaseQueryIsAnyLinkExistRequest(): QueryIsAnyLinkExistRequest {
  return {
    from: "",
    to: ""
  };
}
export const QueryIsAnyLinkExistRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryIsAnyLinkExistRequest",
  is(o: any): o is QueryIsAnyLinkExistRequest {
    return o && (o.$typeUrl === QueryIsAnyLinkExistRequest.typeUrl || typeof o.from === "string" && typeof o.to === "string");
  },
  isSDK(o: any): o is QueryIsAnyLinkExistRequestSDKType {
    return o && (o.$typeUrl === QueryIsAnyLinkExistRequest.typeUrl || typeof o.from === "string" && typeof o.to === "string");
  },
  isAmino(o: any): o is QueryIsAnyLinkExistRequestAmino {
    return o && (o.$typeUrl === QueryIsAnyLinkExistRequest.typeUrl || typeof o.from === "string" && typeof o.to === "string");
  },
  encode(message: QueryIsAnyLinkExistRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(18).string(message.to);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryIsAnyLinkExistRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryIsAnyLinkExistRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string();
          break;
        case 2:
          message.to = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryIsAnyLinkExistRequest {
    return {
      from: isSet(object.from) ? String(object.from) : "",
      to: isSet(object.to) ? String(object.to) : ""
    };
  },
  toJSON(message: QueryIsAnyLinkExistRequest): JsonSafe<QueryIsAnyLinkExistRequest> {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    return obj;
  },
  fromPartial(object: Partial<QueryIsAnyLinkExistRequest>): QueryIsAnyLinkExistRequest {
    const message = createBaseQueryIsAnyLinkExistRequest();
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    return message;
  },
  fromAmino(object: QueryIsAnyLinkExistRequestAmino): QueryIsAnyLinkExistRequest {
    const message = createBaseQueryIsAnyLinkExistRequest();
    if (object.from !== undefined && object.from !== null) {
      message.from = object.from;
    }
    if (object.to !== undefined && object.to !== null) {
      message.to = object.to;
    }
    return message;
  },
  toAmino(message: QueryIsAnyLinkExistRequest): QueryIsAnyLinkExistRequestAmino {
    const obj: any = {};
    obj.from = message.from === "" ? undefined : message.from;
    obj.to = message.to === "" ? undefined : message.to;
    return obj;
  },
  fromAminoMsg(object: QueryIsAnyLinkExistRequestAminoMsg): QueryIsAnyLinkExistRequest {
    return QueryIsAnyLinkExistRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryIsAnyLinkExistRequestProtoMsg): QueryIsAnyLinkExistRequest {
    return QueryIsAnyLinkExistRequest.decode(message.value);
  },
  toProto(message: QueryIsAnyLinkExistRequest): Uint8Array {
    return QueryIsAnyLinkExistRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryIsAnyLinkExistRequest): QueryIsAnyLinkExistRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryIsAnyLinkExistRequest",
      value: QueryIsAnyLinkExistRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryIsAnyLinkExistRequest.typeUrl, QueryIsAnyLinkExistRequest);
function createBaseQueryLinkExistResponse(): QueryLinkExistResponse {
  return {
    exist: false
  };
}
export const QueryLinkExistResponse = {
  typeUrl: "/cyber.rank.v1beta1.QueryLinkExistResponse",
  is(o: any): o is QueryLinkExistResponse {
    return o && (o.$typeUrl === QueryLinkExistResponse.typeUrl || typeof o.exist === "boolean");
  },
  isSDK(o: any): o is QueryLinkExistResponseSDKType {
    return o && (o.$typeUrl === QueryLinkExistResponse.typeUrl || typeof o.exist === "boolean");
  },
  isAmino(o: any): o is QueryLinkExistResponseAmino {
    return o && (o.$typeUrl === QueryLinkExistResponse.typeUrl || typeof o.exist === "boolean");
  },
  encode(message: QueryLinkExistResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.exist === true) {
      writer.uint32(8).bool(message.exist);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryLinkExistResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLinkExistResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.exist = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryLinkExistResponse {
    return {
      exist: isSet(object.exist) ? Boolean(object.exist) : false
    };
  },
  toJSON(message: QueryLinkExistResponse): JsonSafe<QueryLinkExistResponse> {
    const obj: any = {};
    message.exist !== undefined && (obj.exist = message.exist);
    return obj;
  },
  fromPartial(object: Partial<QueryLinkExistResponse>): QueryLinkExistResponse {
    const message = createBaseQueryLinkExistResponse();
    message.exist = object.exist ?? false;
    return message;
  },
  fromAmino(object: QueryLinkExistResponseAmino): QueryLinkExistResponse {
    const message = createBaseQueryLinkExistResponse();
    if (object.exist !== undefined && object.exist !== null) {
      message.exist = object.exist;
    }
    return message;
  },
  toAmino(message: QueryLinkExistResponse): QueryLinkExistResponseAmino {
    const obj: any = {};
    obj.exist = message.exist === false ? undefined : message.exist;
    return obj;
  },
  fromAminoMsg(object: QueryLinkExistResponseAminoMsg): QueryLinkExistResponse {
    return QueryLinkExistResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryLinkExistResponseProtoMsg): QueryLinkExistResponse {
    return QueryLinkExistResponse.decode(message.value);
  },
  toProto(message: QueryLinkExistResponse): Uint8Array {
    return QueryLinkExistResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryLinkExistResponse): QueryLinkExistResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryLinkExistResponse",
      value: QueryLinkExistResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryLinkExistResponse.typeUrl, QueryLinkExistResponse);
function createBaseQueryNegentropyPartilceRequest(): QueryNegentropyPartilceRequest {
  return {
    particle: ""
  };
}
export const QueryNegentropyPartilceRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyPartilceRequest",
  is(o: any): o is QueryNegentropyPartilceRequest {
    return o && (o.$typeUrl === QueryNegentropyPartilceRequest.typeUrl || typeof o.particle === "string");
  },
  isSDK(o: any): o is QueryNegentropyPartilceRequestSDKType {
    return o && (o.$typeUrl === QueryNegentropyPartilceRequest.typeUrl || typeof o.particle === "string");
  },
  isAmino(o: any): o is QueryNegentropyPartilceRequestAmino {
    return o && (o.$typeUrl === QueryNegentropyPartilceRequest.typeUrl || typeof o.particle === "string");
  },
  encode(message: QueryNegentropyPartilceRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.particle !== "") {
      writer.uint32(10).string(message.particle);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNegentropyPartilceRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNegentropyPartilceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.particle = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryNegentropyPartilceRequest {
    return {
      particle: isSet(object.particle) ? String(object.particle) : ""
    };
  },
  toJSON(message: QueryNegentropyPartilceRequest): JsonSafe<QueryNegentropyPartilceRequest> {
    const obj: any = {};
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },
  fromPartial(object: Partial<QueryNegentropyPartilceRequest>): QueryNegentropyPartilceRequest {
    const message = createBaseQueryNegentropyPartilceRequest();
    message.particle = object.particle ?? "";
    return message;
  },
  fromAmino(object: QueryNegentropyPartilceRequestAmino): QueryNegentropyPartilceRequest {
    const message = createBaseQueryNegentropyPartilceRequest();
    if (object.particle !== undefined && object.particle !== null) {
      message.particle = object.particle;
    }
    return message;
  },
  toAmino(message: QueryNegentropyPartilceRequest): QueryNegentropyPartilceRequestAmino {
    const obj: any = {};
    obj.particle = message.particle === "" ? undefined : message.particle;
    return obj;
  },
  fromAminoMsg(object: QueryNegentropyPartilceRequestAminoMsg): QueryNegentropyPartilceRequest {
    return QueryNegentropyPartilceRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryNegentropyPartilceRequestProtoMsg): QueryNegentropyPartilceRequest {
    return QueryNegentropyPartilceRequest.decode(message.value);
  },
  toProto(message: QueryNegentropyPartilceRequest): Uint8Array {
    return QueryNegentropyPartilceRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryNegentropyPartilceRequest): QueryNegentropyPartilceRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryNegentropyPartilceRequest",
      value: QueryNegentropyPartilceRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryNegentropyPartilceRequest.typeUrl, QueryNegentropyPartilceRequest);
function createBaseQueryNegentropyParticleResponse(): QueryNegentropyParticleResponse {
  return {
    entropy: BigInt(0)
  };
}
export const QueryNegentropyParticleResponse = {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyParticleResponse",
  is(o: any): o is QueryNegentropyParticleResponse {
    return o && (o.$typeUrl === QueryNegentropyParticleResponse.typeUrl || typeof o.entropy === "bigint");
  },
  isSDK(o: any): o is QueryNegentropyParticleResponseSDKType {
    return o && (o.$typeUrl === QueryNegentropyParticleResponse.typeUrl || typeof o.entropy === "bigint");
  },
  isAmino(o: any): o is QueryNegentropyParticleResponseAmino {
    return o && (o.$typeUrl === QueryNegentropyParticleResponse.typeUrl || typeof o.entropy === "bigint");
  },
  encode(message: QueryNegentropyParticleResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.entropy !== BigInt(0)) {
      writer.uint32(8).uint64(message.entropy);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNegentropyParticleResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNegentropyParticleResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.entropy = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryNegentropyParticleResponse {
    return {
      entropy: isSet(object.entropy) ? BigInt(object.entropy.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryNegentropyParticleResponse): JsonSafe<QueryNegentropyParticleResponse> {
    const obj: any = {};
    message.entropy !== undefined && (obj.entropy = (message.entropy || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryNegentropyParticleResponse>): QueryNegentropyParticleResponse {
    const message = createBaseQueryNegentropyParticleResponse();
    message.entropy = object.entropy !== undefined && object.entropy !== null ? BigInt(object.entropy.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryNegentropyParticleResponseAmino): QueryNegentropyParticleResponse {
    const message = createBaseQueryNegentropyParticleResponse();
    if (object.entropy !== undefined && object.entropy !== null) {
      message.entropy = BigInt(object.entropy);
    }
    return message;
  },
  toAmino(message: QueryNegentropyParticleResponse): QueryNegentropyParticleResponseAmino {
    const obj: any = {};
    obj.entropy = message.entropy !== BigInt(0) ? message.entropy.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryNegentropyParticleResponseAminoMsg): QueryNegentropyParticleResponse {
    return QueryNegentropyParticleResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryNegentropyParticleResponseProtoMsg): QueryNegentropyParticleResponse {
    return QueryNegentropyParticleResponse.decode(message.value);
  },
  toProto(message: QueryNegentropyParticleResponse): Uint8Array {
    return QueryNegentropyParticleResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryNegentropyParticleResponse): QueryNegentropyParticleResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryNegentropyParticleResponse",
      value: QueryNegentropyParticleResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryNegentropyParticleResponse.typeUrl, QueryNegentropyParticleResponse);
function createBaseQueryNegentropyRequest(): QueryNegentropyRequest {
  return {};
}
export const QueryNegentropyRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyRequest",
  is(o: any): o is QueryNegentropyRequest {
    return o && o.$typeUrl === QueryNegentropyRequest.typeUrl;
  },
  isSDK(o: any): o is QueryNegentropyRequestSDKType {
    return o && o.$typeUrl === QueryNegentropyRequest.typeUrl;
  },
  isAmino(o: any): o is QueryNegentropyRequestAmino {
    return o && o.$typeUrl === QueryNegentropyRequest.typeUrl;
  },
  encode(_: QueryNegentropyRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNegentropyRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNegentropyRequest();
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
  fromJSON(_: any): QueryNegentropyRequest {
    return {};
  },
  toJSON(_: QueryNegentropyRequest): JsonSafe<QueryNegentropyRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryNegentropyRequest>): QueryNegentropyRequest {
    const message = createBaseQueryNegentropyRequest();
    return message;
  },
  fromAmino(_: QueryNegentropyRequestAmino): QueryNegentropyRequest {
    const message = createBaseQueryNegentropyRequest();
    return message;
  },
  toAmino(_: QueryNegentropyRequest): QueryNegentropyRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryNegentropyRequestAminoMsg): QueryNegentropyRequest {
    return QueryNegentropyRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryNegentropyRequestProtoMsg): QueryNegentropyRequest {
    return QueryNegentropyRequest.decode(message.value);
  },
  toProto(message: QueryNegentropyRequest): Uint8Array {
    return QueryNegentropyRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryNegentropyRequest): QueryNegentropyRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryNegentropyRequest",
      value: QueryNegentropyRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryNegentropyRequest.typeUrl, QueryNegentropyRequest);
function createBaseQueryNegentropyResponse(): QueryNegentropyResponse {
  return {
    negentropy: BigInt(0)
  };
}
export const QueryNegentropyResponse = {
  typeUrl: "/cyber.rank.v1beta1.QueryNegentropyResponse",
  is(o: any): o is QueryNegentropyResponse {
    return o && (o.$typeUrl === QueryNegentropyResponse.typeUrl || typeof o.negentropy === "bigint");
  },
  isSDK(o: any): o is QueryNegentropyResponseSDKType {
    return o && (o.$typeUrl === QueryNegentropyResponse.typeUrl || typeof o.negentropy === "bigint");
  },
  isAmino(o: any): o is QueryNegentropyResponseAmino {
    return o && (o.$typeUrl === QueryNegentropyResponse.typeUrl || typeof o.negentropy === "bigint");
  },
  encode(message: QueryNegentropyResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.negentropy !== BigInt(0)) {
      writer.uint32(8).uint64(message.negentropy);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryNegentropyResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNegentropyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.negentropy = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryNegentropyResponse {
    return {
      negentropy: isSet(object.negentropy) ? BigInt(object.negentropy.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryNegentropyResponse): JsonSafe<QueryNegentropyResponse> {
    const obj: any = {};
    message.negentropy !== undefined && (obj.negentropy = (message.negentropy || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryNegentropyResponse>): QueryNegentropyResponse {
    const message = createBaseQueryNegentropyResponse();
    message.negentropy = object.negentropy !== undefined && object.negentropy !== null ? BigInt(object.negentropy.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryNegentropyResponseAmino): QueryNegentropyResponse {
    const message = createBaseQueryNegentropyResponse();
    if (object.negentropy !== undefined && object.negentropy !== null) {
      message.negentropy = BigInt(object.negentropy);
    }
    return message;
  },
  toAmino(message: QueryNegentropyResponse): QueryNegentropyResponseAmino {
    const obj: any = {};
    obj.negentropy = message.negentropy !== BigInt(0) ? message.negentropy.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryNegentropyResponseAminoMsg): QueryNegentropyResponse {
    return QueryNegentropyResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryNegentropyResponseProtoMsg): QueryNegentropyResponse {
    return QueryNegentropyResponse.decode(message.value);
  },
  toProto(message: QueryNegentropyResponse): Uint8Array {
    return QueryNegentropyResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryNegentropyResponse): QueryNegentropyResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryNegentropyResponse",
      value: QueryNegentropyResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryNegentropyResponse.typeUrl, QueryNegentropyResponse);
function createBaseQueryKarmaRequest(): QueryKarmaRequest {
  return {
    neuron: ""
  };
}
export const QueryKarmaRequest = {
  typeUrl: "/cyber.rank.v1beta1.QueryKarmaRequest",
  is(o: any): o is QueryKarmaRequest {
    return o && (o.$typeUrl === QueryKarmaRequest.typeUrl || typeof o.neuron === "string");
  },
  isSDK(o: any): o is QueryKarmaRequestSDKType {
    return o && (o.$typeUrl === QueryKarmaRequest.typeUrl || typeof o.neuron === "string");
  },
  isAmino(o: any): o is QueryKarmaRequestAmino {
    return o && (o.$typeUrl === QueryKarmaRequest.typeUrl || typeof o.neuron === "string");
  },
  encode(message: QueryKarmaRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.neuron !== "") {
      writer.uint32(10).string(message.neuron);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryKarmaRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryKarmaRequest();
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
  fromJSON(object: any): QueryKarmaRequest {
    return {
      neuron: isSet(object.neuron) ? String(object.neuron) : ""
    };
  },
  toJSON(message: QueryKarmaRequest): JsonSafe<QueryKarmaRequest> {
    const obj: any = {};
    message.neuron !== undefined && (obj.neuron = message.neuron);
    return obj;
  },
  fromPartial(object: Partial<QueryKarmaRequest>): QueryKarmaRequest {
    const message = createBaseQueryKarmaRequest();
    message.neuron = object.neuron ?? "";
    return message;
  },
  fromAmino(object: QueryKarmaRequestAmino): QueryKarmaRequest {
    const message = createBaseQueryKarmaRequest();
    if (object.neuron !== undefined && object.neuron !== null) {
      message.neuron = object.neuron;
    }
    return message;
  },
  toAmino(message: QueryKarmaRequest): QueryKarmaRequestAmino {
    const obj: any = {};
    obj.neuron = message.neuron === "" ? undefined : message.neuron;
    return obj;
  },
  fromAminoMsg(object: QueryKarmaRequestAminoMsg): QueryKarmaRequest {
    return QueryKarmaRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryKarmaRequestProtoMsg): QueryKarmaRequest {
    return QueryKarmaRequest.decode(message.value);
  },
  toProto(message: QueryKarmaRequest): Uint8Array {
    return QueryKarmaRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryKarmaRequest): QueryKarmaRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryKarmaRequest",
      value: QueryKarmaRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryKarmaRequest.typeUrl, QueryKarmaRequest);
function createBaseQueryKarmaResponse(): QueryKarmaResponse {
  return {
    karma: BigInt(0)
  };
}
export const QueryKarmaResponse = {
  typeUrl: "/cyber.rank.v1beta1.QueryKarmaResponse",
  is(o: any): o is QueryKarmaResponse {
    return o && (o.$typeUrl === QueryKarmaResponse.typeUrl || typeof o.karma === "bigint");
  },
  isSDK(o: any): o is QueryKarmaResponseSDKType {
    return o && (o.$typeUrl === QueryKarmaResponse.typeUrl || typeof o.karma === "bigint");
  },
  isAmino(o: any): o is QueryKarmaResponseAmino {
    return o && (o.$typeUrl === QueryKarmaResponse.typeUrl || typeof o.karma === "bigint");
  },
  encode(message: QueryKarmaResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.karma !== BigInt(0)) {
      writer.uint32(8).uint64(message.karma);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryKarmaResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryKarmaResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.karma = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryKarmaResponse {
    return {
      karma: isSet(object.karma) ? BigInt(object.karma.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryKarmaResponse): JsonSafe<QueryKarmaResponse> {
    const obj: any = {};
    message.karma !== undefined && (obj.karma = (message.karma || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryKarmaResponse>): QueryKarmaResponse {
    const message = createBaseQueryKarmaResponse();
    message.karma = object.karma !== undefined && object.karma !== null ? BigInt(object.karma.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryKarmaResponseAmino): QueryKarmaResponse {
    const message = createBaseQueryKarmaResponse();
    if (object.karma !== undefined && object.karma !== null) {
      message.karma = BigInt(object.karma);
    }
    return message;
  },
  toAmino(message: QueryKarmaResponse): QueryKarmaResponseAmino {
    const obj: any = {};
    obj.karma = message.karma !== BigInt(0) ? message.karma.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryKarmaResponseAminoMsg): QueryKarmaResponse {
    return QueryKarmaResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryKarmaResponseProtoMsg): QueryKarmaResponse {
    return QueryKarmaResponse.decode(message.value);
  },
  toProto(message: QueryKarmaResponse): Uint8Array {
    return QueryKarmaResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryKarmaResponse): QueryKarmaResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.QueryKarmaResponse",
      value: QueryKarmaResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryKarmaResponse.typeUrl, QueryKarmaResponse);