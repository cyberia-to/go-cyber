/* eslint-disable */
import { Params, RankedParticle } from "./types";
import { PageRequest, PageResponse } from "../../base/query/v1beta1/pagination";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "cyber.rank.v1beta1";

export interface QueryParamsRequest {}

export interface QueryParamsResponse {
  params?: Params;
}

export interface QueryRankRequest {
  particle: string;
}

export interface QueryRankResponse {
  rank: Long;
}

export interface QuerySearchRequest {
  particle: string;
  pagination?: PageRequest;
}

export interface QuerySearchResponse {
  result: RankedParticle[];
  pagination?: PageResponse;
}

export interface QueryTopRequest {}

export interface QueryIsLinkExistRequest {
  from: string;
  to: string;
  address: string;
}

export interface QueryIsAnyLinkExistRequest {
  from: string;
  to: string;
}

export interface QueryLinkExistResponse {
  exist: boolean;
}

export interface QueryNegentropyPartilceRequest {
  particle: string;
}

export interface QueryNegentropyParticleResponse {
  entropy: Long;
}

export interface QueryNegentropyRequest {}

export interface QueryNegentropyResponse {
  negentropy: Long;
}

export interface QueryKarmaRequest {
  neuron: string;
}

export interface QueryKarmaResponse {
  karma: Long;
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

function createBaseQueryRankRequest(): QueryRankRequest {
  return { particle: "" };
}

export const QueryRankRequest = {
  encode(message: QueryRankRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.particle !== "") {
      writer.uint32(10).string(message.particle);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRankRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      particle: isSet(object.particle) ? String(object.particle) : "",
    };
  },

  toJSON(message: QueryRankRequest): unknown {
    const obj: any = {};
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryRankRequest>, I>>(object: I): QueryRankRequest {
    const message = createBaseQueryRankRequest();
    message.particle = object.particle ?? "";
    return message;
  },
};

function createBaseQueryRankResponse(): QueryRankResponse {
  return { rank: Long.UZERO };
}

export const QueryRankResponse = {
  encode(message: QueryRankResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.rank.isZero()) {
      writer.uint32(8).uint64(message.rank);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryRankResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryRankResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rank = reader.uint64() as Long;
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
      rank: isSet(object.rank) ? Long.fromValue(object.rank) : Long.UZERO,
    };
  },

  toJSON(message: QueryRankResponse): unknown {
    const obj: any = {};
    message.rank !== undefined && (obj.rank = (message.rank || Long.UZERO).toString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryRankResponse>, I>>(object: I): QueryRankResponse {
    const message = createBaseQueryRankResponse();
    message.rank =
      object.rank !== undefined && object.rank !== null ? Long.fromValue(object.rank) : Long.UZERO;
    return message;
  },
};

function createBaseQuerySearchRequest(): QuerySearchRequest {
  return { particle: "", pagination: undefined };
}

export const QuerySearchRequest = {
  encode(message: QuerySearchRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.particle !== "") {
      writer.uint32(10).string(message.particle);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QuerySearchRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QuerySearchRequest): unknown {
    const obj: any = {};
    message.particle !== undefined && (obj.particle = message.particle);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QuerySearchRequest>, I>>(object: I): QuerySearchRequest {
    const message = createBaseQuerySearchRequest();
    message.particle = object.particle ?? "";
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageRequest.fromPartial(object.pagination)
        : undefined;
    return message;
  },
};

function createBaseQuerySearchResponse(): QuerySearchResponse {
  return { result: [], pagination: undefined };
}

export const QuerySearchResponse = {
  encode(message: QuerySearchResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.result) {
      RankedParticle.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QuerySearchResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QuerySearchResponse): unknown {
    const obj: any = {};
    if (message.result) {
      obj.result = message.result.map((e) => (e ? RankedParticle.toJSON(e) : undefined));
    } else {
      obj.result = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QuerySearchResponse>, I>>(object: I): QuerySearchResponse {
    const message = createBaseQuerySearchResponse();
    message.result = object.result?.map((e) => RankedParticle.fromPartial(e)) || [];
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageResponse.fromPartial(object.pagination)
        : undefined;
    return message;
  },
};

function createBaseQueryTopRequest(): QueryTopRequest {
  return {};
}

export const QueryTopRequest = {
  encode(_: QueryTopRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryTopRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryTopRequest();
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

  fromJSON(_: any): QueryTopRequest {
    return {};
  },

  toJSON(_: QueryTopRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryTopRequest>, I>>(_: I): QueryTopRequest {
    const message = createBaseQueryTopRequest();
    return message;
  },
};

function createBaseQueryIsLinkExistRequest(): QueryIsLinkExistRequest {
  return { from: "", to: "", address: "" };
}

export const QueryIsLinkExistRequest = {
  encode(message: QueryIsLinkExistRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryIsLinkExistRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      address: isSet(object.address) ? String(object.address) : "",
    };
  },

  toJSON(message: QueryIsLinkExistRequest): unknown {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryIsLinkExistRequest>, I>>(object: I): QueryIsLinkExistRequest {
    const message = createBaseQueryIsLinkExistRequest();
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseQueryIsAnyLinkExistRequest(): QueryIsAnyLinkExistRequest {
  return { from: "", to: "" };
}

export const QueryIsAnyLinkExistRequest = {
  encode(message: QueryIsAnyLinkExistRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(18).string(message.to);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryIsAnyLinkExistRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      to: isSet(object.to) ? String(object.to) : "",
    };
  },

  toJSON(message: QueryIsAnyLinkExistRequest): unknown {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryIsAnyLinkExistRequest>, I>>(
    object: I,
  ): QueryIsAnyLinkExistRequest {
    const message = createBaseQueryIsAnyLinkExistRequest();
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    return message;
  },
};

function createBaseQueryLinkExistResponse(): QueryLinkExistResponse {
  return { exist: false };
}

export const QueryLinkExistResponse = {
  encode(message: QueryLinkExistResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.exist === true) {
      writer.uint32(8).bool(message.exist);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryLinkExistResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      exist: isSet(object.exist) ? Boolean(object.exist) : false,
    };
  },

  toJSON(message: QueryLinkExistResponse): unknown {
    const obj: any = {};
    message.exist !== undefined && (obj.exist = message.exist);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryLinkExistResponse>, I>>(object: I): QueryLinkExistResponse {
    const message = createBaseQueryLinkExistResponse();
    message.exist = object.exist ?? false;
    return message;
  },
};

function createBaseQueryNegentropyPartilceRequest(): QueryNegentropyPartilceRequest {
  return { particle: "" };
}

export const QueryNegentropyPartilceRequest = {
  encode(message: QueryNegentropyPartilceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.particle !== "") {
      writer.uint32(10).string(message.particle);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryNegentropyPartilceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      particle: isSet(object.particle) ? String(object.particle) : "",
    };
  },

  toJSON(message: QueryNegentropyPartilceRequest): unknown {
    const obj: any = {};
    message.particle !== undefined && (obj.particle = message.particle);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryNegentropyPartilceRequest>, I>>(
    object: I,
  ): QueryNegentropyPartilceRequest {
    const message = createBaseQueryNegentropyPartilceRequest();
    message.particle = object.particle ?? "";
    return message;
  },
};

function createBaseQueryNegentropyParticleResponse(): QueryNegentropyParticleResponse {
  return { entropy: Long.UZERO };
}

export const QueryNegentropyParticleResponse = {
  encode(message: QueryNegentropyParticleResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.entropy.isZero()) {
      writer.uint32(8).uint64(message.entropy);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryNegentropyParticleResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNegentropyParticleResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.entropy = reader.uint64() as Long;
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
      entropy: isSet(object.entropy) ? Long.fromValue(object.entropy) : Long.UZERO,
    };
  },

  toJSON(message: QueryNegentropyParticleResponse): unknown {
    const obj: any = {};
    message.entropy !== undefined && (obj.entropy = (message.entropy || Long.UZERO).toString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryNegentropyParticleResponse>, I>>(
    object: I,
  ): QueryNegentropyParticleResponse {
    const message = createBaseQueryNegentropyParticleResponse();
    message.entropy =
      object.entropy !== undefined && object.entropy !== null ? Long.fromValue(object.entropy) : Long.UZERO;
    return message;
  },
};

function createBaseQueryNegentropyRequest(): QueryNegentropyRequest {
  return {};
}

export const QueryNegentropyRequest = {
  encode(_: QueryNegentropyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryNegentropyRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  toJSON(_: QueryNegentropyRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryNegentropyRequest>, I>>(_: I): QueryNegentropyRequest {
    const message = createBaseQueryNegentropyRequest();
    return message;
  },
};

function createBaseQueryNegentropyResponse(): QueryNegentropyResponse {
  return { negentropy: Long.UZERO };
}

export const QueryNegentropyResponse = {
  encode(message: QueryNegentropyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.negentropy.isZero()) {
      writer.uint32(8).uint64(message.negentropy);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryNegentropyResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryNegentropyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.negentropy = reader.uint64() as Long;
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
      negentropy: isSet(object.negentropy) ? Long.fromValue(object.negentropy) : Long.UZERO,
    };
  },

  toJSON(message: QueryNegentropyResponse): unknown {
    const obj: any = {};
    message.negentropy !== undefined && (obj.negentropy = (message.negentropy || Long.UZERO).toString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryNegentropyResponse>, I>>(object: I): QueryNegentropyResponse {
    const message = createBaseQueryNegentropyResponse();
    message.negentropy =
      object.negentropy !== undefined && object.negentropy !== null
        ? Long.fromValue(object.negentropy)
        : Long.UZERO;
    return message;
  },
};

function createBaseQueryKarmaRequest(): QueryKarmaRequest {
  return { neuron: "" };
}

export const QueryKarmaRequest = {
  encode(message: QueryKarmaRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.neuron !== "") {
      writer.uint32(10).string(message.neuron);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryKarmaRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
      neuron: isSet(object.neuron) ? String(object.neuron) : "",
    };
  },

  toJSON(message: QueryKarmaRequest): unknown {
    const obj: any = {};
    message.neuron !== undefined && (obj.neuron = message.neuron);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryKarmaRequest>, I>>(object: I): QueryKarmaRequest {
    const message = createBaseQueryKarmaRequest();
    message.neuron = object.neuron ?? "";
    return message;
  },
};

function createBaseQueryKarmaResponse(): QueryKarmaResponse {
  return { karma: Long.UZERO };
}

export const QueryKarmaResponse = {
  encode(message: QueryKarmaResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.karma.isZero()) {
      writer.uint32(8).uint64(message.karma);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryKarmaResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryKarmaResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.karma = reader.uint64() as Long;
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
      karma: isSet(object.karma) ? Long.fromValue(object.karma) : Long.UZERO,
    };
  },

  toJSON(message: QueryKarmaResponse): unknown {
    const obj: any = {};
    message.karma !== undefined && (obj.karma = (message.karma || Long.UZERO).toString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryKarmaResponse>, I>>(object: I): QueryKarmaResponse {
    const message = createBaseQueryKarmaResponse();
    message.karma =
      object.karma !== undefined && object.karma !== null ? Long.fromValue(object.karma) : Long.UZERO;
    return message;
  },
};

export interface Query {
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  Rank(request: QueryRankRequest): Promise<QueryRankResponse>;
  Search(request: QuerySearchRequest): Promise<QuerySearchResponse>;
  Backlinks(request: QuerySearchRequest): Promise<QuerySearchResponse>;
  Top(request: PageRequest): Promise<QuerySearchResponse>;
  IsLinkExist(request: QueryIsLinkExistRequest): Promise<QueryLinkExistResponse>;
  IsAnyLinkExist(request: QueryIsAnyLinkExistRequest): Promise<QueryLinkExistResponse>;
  ParticleNegentropy(request: QueryNegentropyPartilceRequest): Promise<QueryNegentropyParticleResponse>;
  Negentropy(request: QueryNegentropyRequest): Promise<QueryNegentropyResponse>;
  Karma(request: QueryKarmaRequest): Promise<QueryKarmaResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
    this.Rank = this.Rank.bind(this);
    this.Search = this.Search.bind(this);
    this.Backlinks = this.Backlinks.bind(this);
    this.Top = this.Top.bind(this);
    this.IsLinkExist = this.IsLinkExist.bind(this);
    this.IsAnyLinkExist = this.IsAnyLinkExist.bind(this);
    this.ParticleNegentropy = this.ParticleNegentropy.bind(this);
    this.Negentropy = this.Negentropy.bind(this);
    this.Karma = this.Karma.bind(this);
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new _m0.Reader(data)));
  }

  Rank(request: QueryRankRequest): Promise<QueryRankResponse> {
    const data = QueryRankRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Rank", data);
    return promise.then((data) => QueryRankResponse.decode(new _m0.Reader(data)));
  }

  Search(request: QuerySearchRequest): Promise<QuerySearchResponse> {
    const data = QuerySearchRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Search", data);
    return promise.then((data) => QuerySearchResponse.decode(new _m0.Reader(data)));
  }

  Backlinks(request: QuerySearchRequest): Promise<QuerySearchResponse> {
    const data = QuerySearchRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Backlinks", data);
    return promise.then((data) => QuerySearchResponse.decode(new _m0.Reader(data)));
  }

  Top(request: PageRequest): Promise<QuerySearchResponse> {
    const data = PageRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Top", data);
    return promise.then((data) => QuerySearchResponse.decode(new _m0.Reader(data)));
  }

  IsLinkExist(request: QueryIsLinkExistRequest): Promise<QueryLinkExistResponse> {
    const data = QueryIsLinkExistRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "IsLinkExist", data);
    return promise.then((data) => QueryLinkExistResponse.decode(new _m0.Reader(data)));
  }

  IsAnyLinkExist(request: QueryIsAnyLinkExistRequest): Promise<QueryLinkExistResponse> {
    const data = QueryIsAnyLinkExistRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "IsAnyLinkExist", data);
    return promise.then((data) => QueryLinkExistResponse.decode(new _m0.Reader(data)));
  }

  ParticleNegentropy(request: QueryNegentropyPartilceRequest): Promise<QueryNegentropyParticleResponse> {
    const data = QueryNegentropyPartilceRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "ParticleNegentropy", data);
    return promise.then((data) => QueryNegentropyParticleResponse.decode(new _m0.Reader(data)));
  }

  Negentropy(request: QueryNegentropyRequest): Promise<QueryNegentropyResponse> {
    const data = QueryNegentropyRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Negentropy", data);
    return promise.then((data) => QueryNegentropyResponse.decode(new _m0.Reader(data)));
  }

  Karma(request: QueryKarmaRequest): Promise<QueryKarmaResponse> {
    const data = QueryKarmaRequest.encode(request).finish();
    const promise = this.rpc.request("cyber.rank.v1beta1.Query", "Karma", data);
    return promise.then((data) => QueryKarmaResponse.decode(new _m0.Reader(data)));
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
