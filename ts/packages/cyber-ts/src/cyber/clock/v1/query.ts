//@ts-nocheck
import { PageRequest, PageRequestAmino, PageRequestSDKType, PageResponse, PageResponseAmino, PageResponseSDKType } from "../../../cosmos/base/query/v1beta1/pagination";
import { ClockContract, ClockContractAmino, ClockContractSDKType } from "./clock";
import { Params, ParamsAmino, ParamsSDKType } from "./genesis";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
/** QueryClockContracts is the request type to get all contracts. */
export interface QueryClockContracts {
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest;
}
export interface QueryClockContractsProtoMsg {
  typeUrl: "/cyber.clock.v1.QueryClockContracts";
  value: Uint8Array;
}
/** QueryClockContracts is the request type to get all contracts. */
export interface QueryClockContractsAmino {
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequestAmino;
}
export interface QueryClockContractsAminoMsg {
  type: "/cyber.clock.v1.QueryClockContracts";
  value: QueryClockContractsAmino;
}
/** QueryClockContracts is the request type to get all contracts. */
export interface QueryClockContractsSDKType {
  pagination?: PageRequestSDKType;
}
/**
 * QueryClockContractsResponse is the response type for the Query/ClockContracts
 * RPC method.
 */
export interface QueryClockContractsResponse {
  /** clock_contracts are the clock contracts. */
  clockContracts: ClockContract[];
  /** pagination defines the pagination in the response. */
  pagination?: PageResponse;
}
export interface QueryClockContractsResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.QueryClockContractsResponse";
  value: Uint8Array;
}
/**
 * QueryClockContractsResponse is the response type for the Query/ClockContracts
 * RPC method.
 */
export interface QueryClockContractsResponseAmino {
  /** clock_contracts are the clock contracts. */
  clock_contracts?: ClockContractAmino[];
  /** pagination defines the pagination in the response. */
  pagination?: PageResponseAmino;
}
export interface QueryClockContractsResponseAminoMsg {
  type: "/cyber.clock.v1.QueryClockContractsResponse";
  value: QueryClockContractsResponseAmino;
}
/**
 * QueryClockContractsResponse is the response type for the Query/ClockContracts
 * RPC method.
 */
export interface QueryClockContractsResponseSDKType {
  clock_contracts: ClockContractSDKType[];
  pagination?: PageResponseSDKType;
}
/** QueryClockContract is the request type to get a single contract. */
export interface QueryClockContract {
  /** contract_address is the address of the contract to query. */
  contractAddress: string;
}
export interface QueryClockContractProtoMsg {
  typeUrl: "/cyber.clock.v1.QueryClockContract";
  value: Uint8Array;
}
/** QueryClockContract is the request type to get a single contract. */
export interface QueryClockContractAmino {
  /** contract_address is the address of the contract to query. */
  contract_address?: string;
}
export interface QueryClockContractAminoMsg {
  type: "/cyber.clock.v1.QueryClockContract";
  value: QueryClockContractAmino;
}
/** QueryClockContract is the request type to get a single contract. */
export interface QueryClockContractSDKType {
  contract_address: string;
}
/**
 * QueryClockContractResponse is the response type for the Query/ClockContract
 * RPC method.
 */
export interface QueryClockContractResponse {
  /** contract is the clock contract. */
  clockContract: ClockContract;
}
export interface QueryClockContractResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.QueryClockContractResponse";
  value: Uint8Array;
}
/**
 * QueryClockContractResponse is the response type for the Query/ClockContract
 * RPC method.
 */
export interface QueryClockContractResponseAmino {
  /** contract is the clock contract. */
  clock_contract?: ClockContractAmino;
}
export interface QueryClockContractResponseAminoMsg {
  type: "/cyber.clock.v1.QueryClockContractResponse";
  value: QueryClockContractResponseAmino;
}
/**
 * QueryClockContractResponse is the response type for the Query/ClockContract
 * RPC method.
 */
export interface QueryClockContractResponseSDKType {
  clock_contract: ClockContractSDKType;
}
/** QueryParams is the request type to get all module params. */
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/cyber.clock.v1.QueryParamsRequest";
  value: Uint8Array;
}
/** QueryParams is the request type to get all module params. */
export interface QueryParamsRequestAmino {}
export interface QueryParamsRequestAminoMsg {
  type: "/cyber.clock.v1.QueryParamsRequest";
  value: QueryParamsRequestAmino;
}
/** QueryParams is the request type to get all module params. */
export interface QueryParamsRequestSDKType {}
/**
 * QueryClockContractsResponse is the response type for the Query/ClockContracts
 * RPC method.
 */
export interface QueryParamsResponse {
  params?: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.QueryParamsResponse";
  value: Uint8Array;
}
/**
 * QueryClockContractsResponse is the response type for the Query/ClockContracts
 * RPC method.
 */
export interface QueryParamsResponseAmino {
  params: ParamsAmino;
}
export interface QueryParamsResponseAminoMsg {
  type: "/cyber.clock.v1.QueryParamsResponse";
  value: QueryParamsResponseAmino;
}
/**
 * QueryClockContractsResponse is the response type for the Query/ClockContracts
 * RPC method.
 */
export interface QueryParamsResponseSDKType {
  params?: ParamsSDKType;
}
function createBaseQueryClockContracts(): QueryClockContracts {
  return {
    pagination: undefined
  };
}
export const QueryClockContracts = {
  typeUrl: "/cyber.clock.v1.QueryClockContracts",
  is(o: any): o is QueryClockContracts {
    return o && o.$typeUrl === QueryClockContracts.typeUrl;
  },
  isSDK(o: any): o is QueryClockContractsSDKType {
    return o && o.$typeUrl === QueryClockContracts.typeUrl;
  },
  isAmino(o: any): o is QueryClockContractsAmino {
    return o && o.$typeUrl === QueryClockContracts.typeUrl;
  },
  encode(message: QueryClockContracts, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryClockContracts {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryClockContracts();
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
  fromJSON(object: any): QueryClockContracts {
    return {
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryClockContracts): JsonSafe<QueryClockContracts> {
    const obj: any = {};
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryClockContracts>): QueryClockContracts {
    const message = createBaseQueryClockContracts();
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageRequest.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryClockContractsAmino): QueryClockContracts {
    const message = createBaseQueryClockContracts();
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryClockContracts): QueryClockContractsAmino {
    const obj: any = {};
    obj.pagination = message.pagination ? PageRequest.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryClockContractsAminoMsg): QueryClockContracts {
    return QueryClockContracts.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryClockContractsProtoMsg): QueryClockContracts {
    return QueryClockContracts.decode(message.value);
  },
  toProto(message: QueryClockContracts): Uint8Array {
    return QueryClockContracts.encode(message).finish();
  },
  toProtoMsg(message: QueryClockContracts): QueryClockContractsProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.QueryClockContracts",
      value: QueryClockContracts.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryClockContracts.typeUrl, QueryClockContracts);
function createBaseQueryClockContractsResponse(): QueryClockContractsResponse {
  return {
    clockContracts: [],
    pagination: undefined
  };
}
export const QueryClockContractsResponse = {
  typeUrl: "/cyber.clock.v1.QueryClockContractsResponse",
  is(o: any): o is QueryClockContractsResponse {
    return o && (o.$typeUrl === QueryClockContractsResponse.typeUrl || Array.isArray(o.clockContracts) && (!o.clockContracts.length || ClockContract.is(o.clockContracts[0])));
  },
  isSDK(o: any): o is QueryClockContractsResponseSDKType {
    return o && (o.$typeUrl === QueryClockContractsResponse.typeUrl || Array.isArray(o.clock_contracts) && (!o.clock_contracts.length || ClockContract.isSDK(o.clock_contracts[0])));
  },
  isAmino(o: any): o is QueryClockContractsResponseAmino {
    return o && (o.$typeUrl === QueryClockContractsResponse.typeUrl || Array.isArray(o.clock_contracts) && (!o.clock_contracts.length || ClockContract.isAmino(o.clock_contracts[0])));
  },
  encode(message: QueryClockContractsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.clockContracts) {
      ClockContract.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryClockContractsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryClockContractsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clockContracts.push(ClockContract.decode(reader, reader.uint32()));
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
  fromJSON(object: any): QueryClockContractsResponse {
    return {
      clockContracts: Array.isArray(object?.clockContracts) ? object.clockContracts.map((e: any) => ClockContract.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined
    };
  },
  toJSON(message: QueryClockContractsResponse): JsonSafe<QueryClockContractsResponse> {
    const obj: any = {};
    if (message.clockContracts) {
      obj.clockContracts = message.clockContracts.map(e => e ? ClockContract.toJSON(e) : undefined);
    } else {
      obj.clockContracts = [];
    }
    message.pagination !== undefined && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryClockContractsResponse>): QueryClockContractsResponse {
    const message = createBaseQueryClockContractsResponse();
    message.clockContracts = object.clockContracts?.map(e => ClockContract.fromPartial(e)) || [];
    message.pagination = object.pagination !== undefined && object.pagination !== null ? PageResponse.fromPartial(object.pagination) : undefined;
    return message;
  },
  fromAmino(object: QueryClockContractsResponseAmino): QueryClockContractsResponse {
    const message = createBaseQueryClockContractsResponse();
    message.clockContracts = object.clock_contracts?.map(e => ClockContract.fromAmino(e)) || [];
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromAmino(object.pagination);
    }
    return message;
  },
  toAmino(message: QueryClockContractsResponse): QueryClockContractsResponseAmino {
    const obj: any = {};
    if (message.clockContracts) {
      obj.clock_contracts = message.clockContracts.map(e => e ? ClockContract.toAmino(e) : undefined);
    } else {
      obj.clock_contracts = message.clockContracts;
    }
    obj.pagination = message.pagination ? PageResponse.toAmino(message.pagination) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryClockContractsResponseAminoMsg): QueryClockContractsResponse {
    return QueryClockContractsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryClockContractsResponseProtoMsg): QueryClockContractsResponse {
    return QueryClockContractsResponse.decode(message.value);
  },
  toProto(message: QueryClockContractsResponse): Uint8Array {
    return QueryClockContractsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryClockContractsResponse): QueryClockContractsResponseProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.QueryClockContractsResponse",
      value: QueryClockContractsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryClockContractsResponse.typeUrl, QueryClockContractsResponse);
function createBaseQueryClockContract(): QueryClockContract {
  return {
    contractAddress: ""
  };
}
export const QueryClockContract = {
  typeUrl: "/cyber.clock.v1.QueryClockContract",
  is(o: any): o is QueryClockContract {
    return o && (o.$typeUrl === QueryClockContract.typeUrl || typeof o.contractAddress === "string");
  },
  isSDK(o: any): o is QueryClockContractSDKType {
    return o && (o.$typeUrl === QueryClockContract.typeUrl || typeof o.contract_address === "string");
  },
  isAmino(o: any): o is QueryClockContractAmino {
    return o && (o.$typeUrl === QueryClockContract.typeUrl || typeof o.contract_address === "string");
  },
  encode(message: QueryClockContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.contractAddress !== "") {
      writer.uint32(10).string(message.contractAddress);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryClockContract {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryClockContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contractAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryClockContract {
    return {
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : ""
    };
  },
  toJSON(message: QueryClockContract): JsonSafe<QueryClockContract> {
    const obj: any = {};
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    return obj;
  },
  fromPartial(object: Partial<QueryClockContract>): QueryClockContract {
    const message = createBaseQueryClockContract();
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
  fromAmino(object: QueryClockContractAmino): QueryClockContract {
    const message = createBaseQueryClockContract();
    if (object.contract_address !== undefined && object.contract_address !== null) {
      message.contractAddress = object.contract_address;
    }
    return message;
  },
  toAmino(message: QueryClockContract): QueryClockContractAmino {
    const obj: any = {};
    obj.contract_address = message.contractAddress === "" ? undefined : message.contractAddress;
    return obj;
  },
  fromAminoMsg(object: QueryClockContractAminoMsg): QueryClockContract {
    return QueryClockContract.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryClockContractProtoMsg): QueryClockContract {
    return QueryClockContract.decode(message.value);
  },
  toProto(message: QueryClockContract): Uint8Array {
    return QueryClockContract.encode(message).finish();
  },
  toProtoMsg(message: QueryClockContract): QueryClockContractProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.QueryClockContract",
      value: QueryClockContract.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryClockContract.typeUrl, QueryClockContract);
function createBaseQueryClockContractResponse(): QueryClockContractResponse {
  return {
    clockContract: ClockContract.fromPartial({})
  };
}
export const QueryClockContractResponse = {
  typeUrl: "/cyber.clock.v1.QueryClockContractResponse",
  is(o: any): o is QueryClockContractResponse {
    return o && (o.$typeUrl === QueryClockContractResponse.typeUrl || ClockContract.is(o.clockContract));
  },
  isSDK(o: any): o is QueryClockContractResponseSDKType {
    return o && (o.$typeUrl === QueryClockContractResponse.typeUrl || ClockContract.isSDK(o.clock_contract));
  },
  isAmino(o: any): o is QueryClockContractResponseAmino {
    return o && (o.$typeUrl === QueryClockContractResponse.typeUrl || ClockContract.isAmino(o.clock_contract));
  },
  encode(message: QueryClockContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.clockContract !== undefined) {
      ClockContract.encode(message.clockContract, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): QueryClockContractResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryClockContractResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clockContract = ClockContract.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryClockContractResponse {
    return {
      clockContract: isSet(object.clockContract) ? ClockContract.fromJSON(object.clockContract) : undefined
    };
  },
  toJSON(message: QueryClockContractResponse): JsonSafe<QueryClockContractResponse> {
    const obj: any = {};
    message.clockContract !== undefined && (obj.clockContract = message.clockContract ? ClockContract.toJSON(message.clockContract) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryClockContractResponse>): QueryClockContractResponse {
    const message = createBaseQueryClockContractResponse();
    message.clockContract = object.clockContract !== undefined && object.clockContract !== null ? ClockContract.fromPartial(object.clockContract) : undefined;
    return message;
  },
  fromAmino(object: QueryClockContractResponseAmino): QueryClockContractResponse {
    const message = createBaseQueryClockContractResponse();
    if (object.clock_contract !== undefined && object.clock_contract !== null) {
      message.clockContract = ClockContract.fromAmino(object.clock_contract);
    }
    return message;
  },
  toAmino(message: QueryClockContractResponse): QueryClockContractResponseAmino {
    const obj: any = {};
    obj.clock_contract = message.clockContract ? ClockContract.toAmino(message.clockContract) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryClockContractResponseAminoMsg): QueryClockContractResponse {
    return QueryClockContractResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: QueryClockContractResponseProtoMsg): QueryClockContractResponse {
    return QueryClockContractResponse.decode(message.value);
  },
  toProto(message: QueryClockContractResponse): Uint8Array {
    return QueryClockContractResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryClockContractResponse): QueryClockContractResponseProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.QueryClockContractResponse",
      value: QueryClockContractResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryClockContractResponse.typeUrl, QueryClockContractResponse);
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/cyber.clock.v1.QueryParamsRequest",
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
      typeUrl: "/cyber.clock.v1.QueryParamsRequest",
      value: QueryParamsRequest.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryParamsRequest.typeUrl, QueryParamsRequest);
function createBaseQueryParamsResponse(): QueryParamsResponse {
  return {
    params: undefined
  };
}
export const QueryParamsResponse = {
  typeUrl: "/cyber.clock.v1.QueryParamsResponse",
  is(o: any): o is QueryParamsResponse {
    return o && o.$typeUrl === QueryParamsResponse.typeUrl;
  },
  isSDK(o: any): o is QueryParamsResponseSDKType {
    return o && o.$typeUrl === QueryParamsResponse.typeUrl;
  },
  isAmino(o: any): o is QueryParamsResponseAmino {
    return o && o.$typeUrl === QueryParamsResponse.typeUrl;
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
    obj.params = message.params ? Params.toAmino(message.params) : Params.toAmino(Params.fromPartial({}));
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
      typeUrl: "/cyber.clock.v1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(QueryParamsResponse.typeUrl, QueryParamsResponse);