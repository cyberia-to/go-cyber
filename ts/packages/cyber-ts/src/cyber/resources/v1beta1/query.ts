//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { Params, ParamsAmino, ParamsSDKType } from "./types";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
import { isSet } from "../../../helpers";
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.QueryParamsRequest";
  value: Uint8Array;
}
export interface QueryParamsRequestAmino {}
export interface QueryParamsRequestAminoMsg {
  type: "/cyber.resources.v1beta1.QueryParamsRequest";
  value: QueryParamsRequestAmino;
}
export interface QueryParamsRequestSDKType {}
export interface QueryParamsResponse {
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.QueryParamsResponse";
  value: Uint8Array;
}
export interface QueryParamsResponseAmino {
  params?: ParamsAmino;
}
export interface QueryParamsResponseAminoMsg {
  type: "/cyber.resources.v1beta1.QueryParamsResponse";
  value: QueryParamsResponseAmino;
}
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
export interface QueryInvestmintRequest {
  amount: Coin;
  resource: string;
  length: bigint;
}
export interface QueryInvestmintRequestProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.QueryInvestmintRequest";
  value: Uint8Array;
}
export interface QueryInvestmintRequestAmino {
  amount?: CoinAmino;
  resource?: string;
  length?: string;
}
export interface QueryInvestmintRequestAminoMsg {
  type: "/cyber.resources.v1beta1.QueryInvestmintRequest";
  value: QueryInvestmintRequestAmino;
}
export interface QueryInvestmintRequestSDKType {
  amount: CoinSDKType;
  resource: string;
  length: bigint;
}
export interface QueryInvestmintResponse {
  amount: Coin;
}
export interface QueryInvestmintResponseProtoMsg {
  typeUrl: "/cyber.resources.v1beta1.QueryInvestmintResponse";
  value: Uint8Array;
}
export interface QueryInvestmintResponseAmino {
  amount?: CoinAmino;
}
export interface QueryInvestmintResponseAminoMsg {
  type: "/cyber.resources.v1beta1.QueryInvestmintResponse";
  value: QueryInvestmintResponseAmino;
}
export interface QueryInvestmintResponseSDKType {
  amount: CoinSDKType;
}
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.resources.v1beta1.QueryParamsRequest",
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
      typeUrl: "/cyber.resources.v1beta1.QueryParamsRequest",
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
  typeUrl: "/cyber.resources.v1beta1.QueryParamsResponse",
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
      typeUrl: "/cyber.resources.v1beta1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryParamsResponse.typeUrl, QueryParamsResponse);
function createBaseQueryInvestmintRequest(): QueryInvestmintRequest {
  return {
    amount: Coin.fromPartial({}),
    resource: "",
    length: BigInt(0)
  };
}
export const QueryInvestmintRequest = {
  typeUrl: "/cyber.resources.v1beta1.QueryInvestmintRequest",
  is(o: any): o is QueryInvestmintRequest {
    return o && (o.$typeUrl === QueryInvestmintRequest.typeUrl || Coin.is(o.amount) && typeof o.resource === "string" && typeof o.length === "bigint");
  },
  isSDK(o: any): o is QueryInvestmintRequestSDKType {
    return o && (o.$typeUrl === QueryInvestmintRequest.typeUrl || Coin.isSDK(o.amount) && typeof o.resource === "string" && typeof o.length === "bigint");
  },
  isAmino(o: any): o is QueryInvestmintRequestAmino {
    return o && (o.$typeUrl === QueryInvestmintRequest.typeUrl || Coin.isAmino(o.amount) && typeof o.resource === "string" && typeof o.length === "bigint");
  },
  encode(message: QueryInvestmintRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(10).fork()).ldelim();
    }
    if (message.resource !== "") {
      writer.uint32(18).string(message.resource);
    }
    if (message.length !== BigInt(0)) {
      writer.uint32(24).uint64(message.length);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryInvestmintRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryInvestmintRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        case 2:
          message.resource = reader.string();
          break;
        case 3:
          message.length = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryInvestmintRequest {
    return {
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      resource: isSet(object.resource) ? String(object.resource) : "",
      length: isSet(object.length) ? BigInt(object.length.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryInvestmintRequest): JsonSafe<QueryInvestmintRequest> {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    message.resource !== undefined && (obj.resource = message.resource);
    message.length !== undefined && (obj.length = (message.length || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryInvestmintRequest>): QueryInvestmintRequest {
    const message = createBaseQueryInvestmintRequest();
    message.amount = object.amount !== undefined && object.amount !== null ? Coin.fromPartial(object.amount) : undefined;
    message.resource = object.resource ?? "";
    message.length = object.length !== undefined && object.length !== null ? BigInt(object.length.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryInvestmintRequestAmino): QueryInvestmintRequest {
    const message = createBaseQueryInvestmintRequest();
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
  toAmino(message: QueryInvestmintRequest): QueryInvestmintRequestAmino {
    const obj: any = {};
    obj.amount = message.amount ? Coin.toAmino(message.amount) : undefined;
    obj.resource = message.resource === "" ? undefined : message.resource;
    obj.length = message.length !== BigInt(0) ? message.length.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryInvestmintRequestAminoMsg): QueryInvestmintRequest {
    return QueryInvestmintRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryInvestmintRequestProtoMsg): QueryInvestmintRequest {
    return QueryInvestmintRequest.decode(message.value);
  },
  toProto(message: QueryInvestmintRequest): Uint8Array {
    return QueryInvestmintRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryInvestmintRequest): QueryInvestmintRequestProtoMsg {
    return {
      typeUrl: "/cyber.resources.v1beta1.QueryInvestmintRequest",
      value: QueryInvestmintRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryInvestmintRequest.typeUrl, QueryInvestmintRequest);
function createBaseQueryInvestmintResponse(): QueryInvestmintResponse {
  return {
    amount: Coin.fromPartial({})
  };
}
export const QueryInvestmintResponse = {
  typeUrl: "/cyber.resources.v1beta1.QueryInvestmintResponse",
  is(o: any): o is QueryInvestmintResponse {
    return o && (o.$typeUrl === QueryInvestmintResponse.typeUrl || Coin.is(o.amount));
  },
  isSDK(o: any): o is QueryInvestmintResponseSDKType {
    return o && (o.$typeUrl === QueryInvestmintResponse.typeUrl || Coin.isSDK(o.amount));
  },
  isAmino(o: any): o is QueryInvestmintResponseAmino {
    return o && (o.$typeUrl === QueryInvestmintResponse.typeUrl || Coin.isAmino(o.amount));
  },
  encode(message: QueryInvestmintResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryInvestmintResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryInvestmintResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryInvestmintResponse {
    return {
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined
    };
  },
  toJSON(message: QueryInvestmintResponse): JsonSafe<QueryInvestmintResponse> {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryInvestmintResponse>): QueryInvestmintResponse {
    const message = createBaseQueryInvestmintResponse();
    message.amount = object.amount !== undefined && object.amount !== null ? Coin.fromPartial(object.amount) : undefined;
    return message;
  },
  fromAmino(object: QueryInvestmintResponseAmino): QueryInvestmintResponse {
    const message = createBaseQueryInvestmintResponse();
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Coin.fromAmino(object.amount);
    }
    return message;
  },
  toAmino(message: QueryInvestmintResponse): QueryInvestmintResponseAmino {
    const obj: any = {};
    obj.amount = message.amount ? Coin.toAmino(message.amount) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryInvestmintResponseAminoMsg): QueryInvestmintResponse {
    return QueryInvestmintResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryInvestmintResponseProtoMsg): QueryInvestmintResponse {
    return QueryInvestmintResponse.decode(message.value);
  },
  toProto(message: QueryInvestmintResponse): Uint8Array {
    return QueryInvestmintResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryInvestmintResponse): QueryInvestmintResponseProtoMsg {
    return {
      typeUrl: "/cyber.resources.v1beta1.QueryInvestmintResponse",
      value: QueryInvestmintResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryInvestmintResponse.typeUrl, QueryInvestmintResponse);