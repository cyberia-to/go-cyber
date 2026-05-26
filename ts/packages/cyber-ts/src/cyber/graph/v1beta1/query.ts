//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../../binary";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
import { isSet } from "../../../helpers";
export interface QueryGraphStatsRequest {}
export interface QueryGraphStatsRequestProtoMsg {
  typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsRequest";
  value: Uint8Array;
}
export interface QueryGraphStatsRequestAmino {}
export interface QueryGraphStatsRequestAminoMsg {
  type: "/cyber.graph.v1beta1.QueryGraphStatsRequest";
  value: QueryGraphStatsRequestAmino;
}
export interface QueryGraphStatsRequestSDKType {}
export interface QueryGraphStatsResponse {
  cyberlinks: bigint;
  particles: bigint;
}
export interface QueryGraphStatsResponseProtoMsg {
  typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsResponse";
  value: Uint8Array;
}
export interface QueryGraphStatsResponseAmino {
  cyberlinks?: string;
  particles?: string;
}
export interface QueryGraphStatsResponseAminoMsg {
  type: "/cyber.graph.v1beta1.QueryGraphStatsResponse";
  value: QueryGraphStatsResponseAmino;
}
export interface QueryGraphStatsResponseSDKType {
  cyberlinks: bigint;
  particles: bigint;
}
function createBaseQueryGraphStatsRequest(): QueryGraphStatsRequest {
  return {};
}
export const QueryGraphStatsRequest = {
  typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsRequest",
  is(o: any): o is QueryGraphStatsRequest {
    return o && o.$typeUrl === QueryGraphStatsRequest.typeUrl;
  },
  isSDK(o: any): o is QueryGraphStatsRequestSDKType {
    return o && o.$typeUrl === QueryGraphStatsRequest.typeUrl;
  },
  isAmino(o: any): o is QueryGraphStatsRequestAmino {
    return o && o.$typeUrl === QueryGraphStatsRequest.typeUrl;
  },
  encode(_: QueryGraphStatsRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryGraphStatsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGraphStatsRequest();
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
  fromJSON(_: any): QueryGraphStatsRequest {
    return {};
  },
  toJSON(_: QueryGraphStatsRequest): JsonSafe<QueryGraphStatsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryGraphStatsRequest>): QueryGraphStatsRequest {
    const message = createBaseQueryGraphStatsRequest();
    return message;
  },
  fromAmino(_: QueryGraphStatsRequestAmino): QueryGraphStatsRequest {
    const message = createBaseQueryGraphStatsRequest();
    return message;
  },
  toAmino(_: QueryGraphStatsRequest): QueryGraphStatsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryGraphStatsRequestAminoMsg): QueryGraphStatsRequest {
    return QueryGraphStatsRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryGraphStatsRequestProtoMsg): QueryGraphStatsRequest {
    return QueryGraphStatsRequest.decode(message.value);
  },
  toProto(message: QueryGraphStatsRequest): Uint8Array {
    return QueryGraphStatsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryGraphStatsRequest): QueryGraphStatsRequestProtoMsg {
    return {
      typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsRequest",
      value: QueryGraphStatsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryGraphStatsRequest.typeUrl, QueryGraphStatsRequest);
function createBaseQueryGraphStatsResponse(): QueryGraphStatsResponse {
  return {
    cyberlinks: BigInt(0),
    particles: BigInt(0)
  };
}
export const QueryGraphStatsResponse = {
  typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsResponse",
  is(o: any): o is QueryGraphStatsResponse {
    return o && (o.$typeUrl === QueryGraphStatsResponse.typeUrl || typeof o.cyberlinks === "bigint" && typeof o.particles === "bigint");
  },
  isSDK(o: any): o is QueryGraphStatsResponseSDKType {
    return o && (o.$typeUrl === QueryGraphStatsResponse.typeUrl || typeof o.cyberlinks === "bigint" && typeof o.particles === "bigint");
  },
  isAmino(o: any): o is QueryGraphStatsResponseAmino {
    return o && (o.$typeUrl === QueryGraphStatsResponse.typeUrl || typeof o.cyberlinks === "bigint" && typeof o.particles === "bigint");
  },
  encode(message: QueryGraphStatsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.cyberlinks !== BigInt(0)) {
      writer.uint32(8).uint64(message.cyberlinks);
    }
    if (message.particles !== BigInt(0)) {
      writer.uint32(16).uint64(message.particles);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryGraphStatsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGraphStatsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cyberlinks = reader.uint64();
          break;
        case 2:
          message.particles = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryGraphStatsResponse {
    return {
      cyberlinks: isSet(object.cyberlinks) ? BigInt(object.cyberlinks.toString()) : BigInt(0),
      particles: isSet(object.particles) ? BigInt(object.particles.toString()) : BigInt(0)
    };
  },
  toJSON(message: QueryGraphStatsResponse): JsonSafe<QueryGraphStatsResponse> {
    const obj: any = {};
    message.cyberlinks !== undefined && (obj.cyberlinks = (message.cyberlinks || BigInt(0)).toString());
    message.particles !== undefined && (obj.particles = (message.particles || BigInt(0)).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryGraphStatsResponse>): QueryGraphStatsResponse {
    const message = createBaseQueryGraphStatsResponse();
    message.cyberlinks = object.cyberlinks !== undefined && object.cyberlinks !== null ? BigInt(object.cyberlinks.toString()) : BigInt(0);
    message.particles = object.particles !== undefined && object.particles !== null ? BigInt(object.particles.toString()) : BigInt(0);
    return message;
  },
  fromAmino(object: QueryGraphStatsResponseAmino): QueryGraphStatsResponse {
    const message = createBaseQueryGraphStatsResponse();
    if (object.cyberlinks !== undefined && object.cyberlinks !== null) {
      message.cyberlinks = BigInt(object.cyberlinks);
    }
    if (object.particles !== undefined && object.particles !== null) {
      message.particles = BigInt(object.particles);
    }
    return message;
  },
  toAmino(message: QueryGraphStatsResponse): QueryGraphStatsResponseAmino {
    const obj: any = {};
    obj.cyberlinks = message.cyberlinks !== BigInt(0) ? message.cyberlinks.toString() : undefined;
    obj.particles = message.particles !== BigInt(0) ? message.particles.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryGraphStatsResponseAminoMsg): QueryGraphStatsResponse {
    return QueryGraphStatsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryGraphStatsResponseProtoMsg): QueryGraphStatsResponse {
    return QueryGraphStatsResponse.decode(message.value);
  },
  toProto(message: QueryGraphStatsResponse): Uint8Array {
    return QueryGraphStatsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryGraphStatsResponse): QueryGraphStatsResponseProtoMsg {
    return {
      typeUrl: "/cyber.graph.v1beta1.QueryGraphStatsResponse",
      value: QueryGraphStatsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryGraphStatsResponse.typeUrl, QueryGraphStatsResponse);