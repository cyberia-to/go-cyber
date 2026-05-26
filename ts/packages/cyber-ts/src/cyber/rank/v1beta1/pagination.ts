//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
export interface PageRequest {
  page: number;
  perPage: number;
}
export interface PageRequestProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.PageRequest";
  value: Uint8Array;
}
export interface PageRequestAmino {
  page?: number;
  per_page?: number;
}
export interface PageRequestAminoMsg {
  type: "/cyber.rank.v1beta1.PageRequest";
  value: PageRequestAmino;
}
export interface PageRequestSDKType {
  page: number;
  per_page: number;
}
export interface PageResponse {
  total: number;
}
export interface PageResponseProtoMsg {
  typeUrl: "/cyber.rank.v1beta1.PageResponse";
  value: Uint8Array;
}
export interface PageResponseAmino {
  total?: number;
}
export interface PageResponseAminoMsg {
  type: "/cyber.rank.v1beta1.PageResponse";
  value: PageResponseAmino;
}
export interface PageResponseSDKType {
  total: number;
}
function createBasePageRequest(): PageRequest {
  return {
    page: 0,
    perPage: 0
  };
}
export const PageRequest = {
  typeUrl: "/cyber.rank.v1beta1.PageRequest",
  is(o: any): o is PageRequest {
    return o && (o.$typeUrl === PageRequest.typeUrl || typeof o.page === "number" && typeof o.perPage === "number");
  },
  isSDK(o: any): o is PageRequestSDKType {
    return o && (o.$typeUrl === PageRequest.typeUrl || typeof o.page === "number" && typeof o.per_page === "number");
  },
  isAmino(o: any): o is PageRequestAmino {
    return o && (o.$typeUrl === PageRequest.typeUrl || typeof o.page === "number" && typeof o.per_page === "number");
  },
  encode(message: PageRequest, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.page !== 0) {
      writer.uint32(8).uint32(message.page);
    }
    if (message.perPage !== 0) {
      writer.uint32(16).uint32(message.perPage);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PageRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePageRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.page = reader.uint32();
          break;
        case 2:
          message.perPage = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PageRequest {
    return {
      page: isSet(object.page) ? Number(object.page) : 0,
      perPage: isSet(object.perPage) ? Number(object.perPage) : 0
    };
  },
  toJSON(message: PageRequest): JsonSafe<PageRequest> {
    const obj: any = {};
    message.page !== undefined && (obj.page = Math.round(message.page));
    message.perPage !== undefined && (obj.perPage = Math.round(message.perPage));
    return obj;
  },
  fromPartial(object: Partial<PageRequest>): PageRequest {
    const message = createBasePageRequest();
    message.page = object.page ?? 0;
    message.perPage = object.perPage ?? 0;
    return message;
  },
  fromAmino(object: PageRequestAmino): PageRequest {
    const message = createBasePageRequest();
    if (object.page !== undefined && object.page !== null) {
      message.page = object.page;
    }
    if (object.per_page !== undefined && object.per_page !== null) {
      message.perPage = object.per_page;
    }
    return message;
  },
  toAmino(message: PageRequest): PageRequestAmino {
    const obj: any = {};
    obj.page = message.page === 0 ? undefined : message.page;
    obj.per_page = message.perPage === 0 ? undefined : message.perPage;
    return obj;
  },
  fromAminoMsg(object: PageRequestAminoMsg): PageRequest {
    return PageRequest.fromAmino(object.value);
  },
  fromProtoMsg(message: PageRequestProtoMsg): PageRequest {
    return PageRequest.decode(message.value);
  },
  toProto(message: PageRequest): Uint8Array {
    return PageRequest.encode(message).finish();
  },
  toProtoMsg(message: PageRequest): PageRequestProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.PageRequest",
      value: PageRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(PageRequest.typeUrl, PageRequest);
function createBasePageResponse(): PageResponse {
  return {
    total: 0
  };
}
export const PageResponse = {
  typeUrl: "/cyber.rank.v1beta1.PageResponse",
  is(o: any): o is PageResponse {
    return o && (o.$typeUrl === PageResponse.typeUrl || typeof o.total === "number");
  },
  isSDK(o: any): o is PageResponseSDKType {
    return o && (o.$typeUrl === PageResponse.typeUrl || typeof o.total === "number");
  },
  isAmino(o: any): o is PageResponseAmino {
    return o && (o.$typeUrl === PageResponse.typeUrl || typeof o.total === "number");
  },
  encode(message: PageResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.total !== 0) {
      writer.uint32(8).uint32(message.total);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PageResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePageResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.total = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PageResponse {
    return {
      total: isSet(object.total) ? Number(object.total) : 0
    };
  },
  toJSON(message: PageResponse): JsonSafe<PageResponse> {
    const obj: any = {};
    message.total !== undefined && (obj.total = Math.round(message.total));
    return obj;
  },
  fromPartial(object: Partial<PageResponse>): PageResponse {
    const message = createBasePageResponse();
    message.total = object.total ?? 0;
    return message;
  },
  fromAmino(object: PageResponseAmino): PageResponse {
    const message = createBasePageResponse();
    if (object.total !== undefined && object.total !== null) {
      message.total = object.total;
    }
    return message;
  },
  toAmino(message: PageResponse): PageResponseAmino {
    const obj: any = {};
    obj.total = message.total === 0 ? undefined : message.total;
    return obj;
  },
  fromAminoMsg(object: PageResponseAminoMsg): PageResponse {
    return PageResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: PageResponseProtoMsg): PageResponse {
    return PageResponse.decode(message.value);
  },
  toProto(message: PageResponse): Uint8Array {
    return PageResponse.encode(message).finish();
  },
  toProtoMsg(message: PageResponse): PageResponseProtoMsg {
    return {
      typeUrl: "/cyber.rank.v1beta1.PageResponse",
      value: PageResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(PageResponse.typeUrl, PageResponse);