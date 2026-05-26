//@ts-nocheck
import { Params, ParamsAmino, ParamsSDKType } from "./genesis";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
/** MsgRegisterClockContract is the Msg/RegisterClockContract request type. */
export interface MsgRegisterClockContract {
  /** The address of the sender. */
  senderAddress: string;
  /** The address of the contract to register. */
  contractAddress: string;
}
export interface MsgRegisterClockContractProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgRegisterClockContract";
  value: Uint8Array;
}
/** MsgRegisterClockContract is the Msg/RegisterClockContract request type. */
export interface MsgRegisterClockContractAmino {
  /** The address of the sender. */
  sender_address?: string;
  /** The address of the contract to register. */
  contract_address?: string;
}
export interface MsgRegisterClockContractAminoMsg {
  type: "/cyber.clock.v1.MsgRegisterClockContract";
  value: MsgRegisterClockContractAmino;
}
/** MsgRegisterClockContract is the Msg/RegisterClockContract request type. */
export interface MsgRegisterClockContractSDKType {
  sender_address: string;
  contract_address: string;
}
/**
 * MsgRegisterClockContractResponse defines the response structure for executing
 * a MsgRegisterClockContract message.
 */
export interface MsgRegisterClockContractResponse {}
export interface MsgRegisterClockContractResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgRegisterClockContractResponse";
  value: Uint8Array;
}
/**
 * MsgRegisterClockContractResponse defines the response structure for executing
 * a MsgRegisterClockContract message.
 */
export interface MsgRegisterClockContractResponseAmino {}
export interface MsgRegisterClockContractResponseAminoMsg {
  type: "/cyber.clock.v1.MsgRegisterClockContractResponse";
  value: MsgRegisterClockContractResponseAmino;
}
/**
 * MsgRegisterClockContractResponse defines the response structure for executing
 * a MsgRegisterClockContract message.
 */
export interface MsgRegisterClockContractResponseSDKType {}
/** MsgUnregisterClockContract is the Msg/UnregisterClockContract request type. */
export interface MsgUnregisterClockContract {
  /** The address of the sender. */
  senderAddress: string;
  /** The address of the contract to unregister. */
  contractAddress: string;
}
export interface MsgUnregisterClockContractProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUnregisterClockContract";
  value: Uint8Array;
}
/** MsgUnregisterClockContract is the Msg/UnregisterClockContract request type. */
export interface MsgUnregisterClockContractAmino {
  /** The address of the sender. */
  sender_address?: string;
  /** The address of the contract to unregister. */
  contract_address?: string;
}
export interface MsgUnregisterClockContractAminoMsg {
  type: "/cyber.clock.v1.MsgUnregisterClockContract";
  value: MsgUnregisterClockContractAmino;
}
/** MsgUnregisterClockContract is the Msg/UnregisterClockContract request type. */
export interface MsgUnregisterClockContractSDKType {
  sender_address: string;
  contract_address: string;
}
/**
 * MsgUnregisterClockContractResponse defines the response structure for
 * executing a MsgUnregisterClockContract message.
 */
export interface MsgUnregisterClockContractResponse {}
export interface MsgUnregisterClockContractResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUnregisterClockContractResponse";
  value: Uint8Array;
}
/**
 * MsgUnregisterClockContractResponse defines the response structure for
 * executing a MsgUnregisterClockContract message.
 */
export interface MsgUnregisterClockContractResponseAmino {}
export interface MsgUnregisterClockContractResponseAminoMsg {
  type: "/cyber.clock.v1.MsgUnregisterClockContractResponse";
  value: MsgUnregisterClockContractResponseAmino;
}
/**
 * MsgUnregisterClockContractResponse defines the response structure for
 * executing a MsgUnregisterClockContract message.
 */
export interface MsgUnregisterClockContractResponseSDKType {}
/** MsgUnjailClockContract is the Msg/UnjailClockContract request type. */
export interface MsgUnjailClockContract {
  /** The address of the sender. */
  senderAddress: string;
  /** The address of the contract to unjail. */
  contractAddress: string;
}
export interface MsgUnjailClockContractProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUnjailClockContract";
  value: Uint8Array;
}
/** MsgUnjailClockContract is the Msg/UnjailClockContract request type. */
export interface MsgUnjailClockContractAmino {
  /** The address of the sender. */
  sender_address?: string;
  /** The address of the contract to unjail. */
  contract_address?: string;
}
export interface MsgUnjailClockContractAminoMsg {
  type: "/cyber.clock.v1.MsgUnjailClockContract";
  value: MsgUnjailClockContractAmino;
}
/** MsgUnjailClockContract is the Msg/UnjailClockContract request type. */
export interface MsgUnjailClockContractSDKType {
  sender_address: string;
  contract_address: string;
}
/**
 * MsgUnjailClockContractResponse defines the response structure for executing a
 * MsgUnjailClockContract message.
 */
export interface MsgUnjailClockContractResponse {}
export interface MsgUnjailClockContractResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUnjailClockContractResponse";
  value: Uint8Array;
}
/**
 * MsgUnjailClockContractResponse defines the response structure for executing a
 * MsgUnjailClockContract message.
 */
export interface MsgUnjailClockContractResponseAmino {}
export interface MsgUnjailClockContractResponseAminoMsg {
  type: "/cyber.clock.v1.MsgUnjailClockContractResponse";
  value: MsgUnjailClockContractResponseAmino;
}
/**
 * MsgUnjailClockContractResponse defines the response structure for executing a
 * MsgUnjailClockContract message.
 */
export interface MsgUnjailClockContractResponseSDKType {}
/**
 * MsgUpdateParams is the Msg/UpdateParams request type.
 * 
 * Since: cosmos-sdk 0.47
 */
export interface MsgUpdateParams {
  /** authority is the address of the governance account. */
  authority: string;
  /**
   * params defines the x/clock parameters to update.
   * 
   * NOTE: All parameters must be supplied.
   */
  params: Params;
}
export interface MsgUpdateParamsProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUpdateParams";
  value: Uint8Array;
}
/**
 * MsgUpdateParams is the Msg/UpdateParams request type.
 * 
 * Since: cosmos-sdk 0.47
 */
export interface MsgUpdateParamsAmino {
  /** authority is the address of the governance account. */
  authority?: string;
  /**
   * params defines the x/clock parameters to update.
   * 
   * NOTE: All parameters must be supplied.
   */
  params?: ParamsAmino;
}
export interface MsgUpdateParamsAminoMsg {
  type: "/cyber.clock.v1.MsgUpdateParams";
  value: MsgUpdateParamsAmino;
}
/**
 * MsgUpdateParams is the Msg/UpdateParams request type.
 * 
 * Since: cosmos-sdk 0.47
 */
export interface MsgUpdateParamsSDKType {
  authority: string;
  params: ParamsSDKType;
}
/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 * 
 * Since: cosmos-sdk 0.47
 */
export interface MsgUpdateParamsResponse {}
export interface MsgUpdateParamsResponseProtoMsg {
  typeUrl: "/cyber.clock.v1.MsgUpdateParamsResponse";
  value: Uint8Array;
}
/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 * 
 * Since: cosmos-sdk 0.47
 */
export interface MsgUpdateParamsResponseAmino {}
export interface MsgUpdateParamsResponseAminoMsg {
  type: "/cyber.clock.v1.MsgUpdateParamsResponse";
  value: MsgUpdateParamsResponseAmino;
}
/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 * 
 * Since: cosmos-sdk 0.47
 */
export interface MsgUpdateParamsResponseSDKType {}
function createBaseMsgRegisterClockContract(): MsgRegisterClockContract {
  return {
    senderAddress: "",
    contractAddress: ""
  };
}
export const MsgRegisterClockContract = {
  typeUrl: "/cyber.clock.v1.MsgRegisterClockContract",
  is(o: any): o is MsgRegisterClockContract {
    return o && (o.$typeUrl === MsgRegisterClockContract.typeUrl || typeof o.senderAddress === "string" && typeof o.contractAddress === "string");
  },
  isSDK(o: any): o is MsgRegisterClockContractSDKType {
    return o && (o.$typeUrl === MsgRegisterClockContract.typeUrl || typeof o.sender_address === "string" && typeof o.contract_address === "string");
  },
  isAmino(o: any): o is MsgRegisterClockContractAmino {
    return o && (o.$typeUrl === MsgRegisterClockContract.typeUrl || typeof o.sender_address === "string" && typeof o.contract_address === "string");
  },
  encode(message: MsgRegisterClockContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.senderAddress !== "") {
      writer.uint32(10).string(message.senderAddress);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgRegisterClockContract {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterClockContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.senderAddress = reader.string();
          break;
        case 2:
          message.contractAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgRegisterClockContract {
    return {
      senderAddress: isSet(object.senderAddress) ? String(object.senderAddress) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : ""
    };
  },
  toJSON(message: MsgRegisterClockContract): JsonSafe<MsgRegisterClockContract> {
    const obj: any = {};
    message.senderAddress !== undefined && (obj.senderAddress = message.senderAddress);
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    return obj;
  },
  fromPartial(object: Partial<MsgRegisterClockContract>): MsgRegisterClockContract {
    const message = createBaseMsgRegisterClockContract();
    message.senderAddress = object.senderAddress ?? "";
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
  fromAmino(object: MsgRegisterClockContractAmino): MsgRegisterClockContract {
    const message = createBaseMsgRegisterClockContract();
    if (object.sender_address !== undefined && object.sender_address !== null) {
      message.senderAddress = object.sender_address;
    }
    if (object.contract_address !== undefined && object.contract_address !== null) {
      message.contractAddress = object.contract_address;
    }
    return message;
  },
  toAmino(message: MsgRegisterClockContract): MsgRegisterClockContractAmino {
    const obj: any = {};
    obj.sender_address = message.senderAddress === "" ? undefined : message.senderAddress;
    obj.contract_address = message.contractAddress === "" ? undefined : message.contractAddress;
    return obj;
  },
  fromAminoMsg(object: MsgRegisterClockContractAminoMsg): MsgRegisterClockContract {
    return MsgRegisterClockContract.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgRegisterClockContractProtoMsg): MsgRegisterClockContract {
    return MsgRegisterClockContract.decode(message.value);
  },
  toProto(message: MsgRegisterClockContract): Uint8Array {
    return MsgRegisterClockContract.encode(message).finish();
  },
  toProtoMsg(message: MsgRegisterClockContract): MsgRegisterClockContractProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgRegisterClockContract",
      value: MsgRegisterClockContract.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgRegisterClockContract.typeUrl, MsgRegisterClockContract);
function createBaseMsgRegisterClockContractResponse(): MsgRegisterClockContractResponse {
  return {};
}
export const MsgRegisterClockContractResponse = {
  typeUrl: "/cyber.clock.v1.MsgRegisterClockContractResponse",
  is(o: any): o is MsgRegisterClockContractResponse {
    return o && o.$typeUrl === MsgRegisterClockContractResponse.typeUrl;
  },
  isSDK(o: any): o is MsgRegisterClockContractResponseSDKType {
    return o && o.$typeUrl === MsgRegisterClockContractResponse.typeUrl;
  },
  isAmino(o: any): o is MsgRegisterClockContractResponseAmino {
    return o && o.$typeUrl === MsgRegisterClockContractResponse.typeUrl;
  },
  encode(_: MsgRegisterClockContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgRegisterClockContractResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterClockContractResponse();
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
  fromJSON(_: any): MsgRegisterClockContractResponse {
    return {};
  },
  toJSON(_: MsgRegisterClockContractResponse): JsonSafe<MsgRegisterClockContractResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgRegisterClockContractResponse>): MsgRegisterClockContractResponse {
    const message = createBaseMsgRegisterClockContractResponse();
    return message;
  },
  fromAmino(_: MsgRegisterClockContractResponseAmino): MsgRegisterClockContractResponse {
    const message = createBaseMsgRegisterClockContractResponse();
    return message;
  },
  toAmino(_: MsgRegisterClockContractResponse): MsgRegisterClockContractResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgRegisterClockContractResponseAminoMsg): MsgRegisterClockContractResponse {
    return MsgRegisterClockContractResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgRegisterClockContractResponseProtoMsg): MsgRegisterClockContractResponse {
    return MsgRegisterClockContractResponse.decode(message.value);
  },
  toProto(message: MsgRegisterClockContractResponse): Uint8Array {
    return MsgRegisterClockContractResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgRegisterClockContractResponse): MsgRegisterClockContractResponseProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgRegisterClockContractResponse",
      value: MsgRegisterClockContractResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgRegisterClockContractResponse.typeUrl, MsgRegisterClockContractResponse);
function createBaseMsgUnregisterClockContract(): MsgUnregisterClockContract {
  return {
    senderAddress: "",
    contractAddress: ""
  };
}
export const MsgUnregisterClockContract = {
  typeUrl: "/cyber.clock.v1.MsgUnregisterClockContract",
  is(o: any): o is MsgUnregisterClockContract {
    return o && (o.$typeUrl === MsgUnregisterClockContract.typeUrl || typeof o.senderAddress === "string" && typeof o.contractAddress === "string");
  },
  isSDK(o: any): o is MsgUnregisterClockContractSDKType {
    return o && (o.$typeUrl === MsgUnregisterClockContract.typeUrl || typeof o.sender_address === "string" && typeof o.contract_address === "string");
  },
  isAmino(o: any): o is MsgUnregisterClockContractAmino {
    return o && (o.$typeUrl === MsgUnregisterClockContract.typeUrl || typeof o.sender_address === "string" && typeof o.contract_address === "string");
  },
  encode(message: MsgUnregisterClockContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.senderAddress !== "") {
      writer.uint32(10).string(message.senderAddress);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUnregisterClockContract {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUnregisterClockContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.senderAddress = reader.string();
          break;
        case 2:
          message.contractAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgUnregisterClockContract {
    return {
      senderAddress: isSet(object.senderAddress) ? String(object.senderAddress) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : ""
    };
  },
  toJSON(message: MsgUnregisterClockContract): JsonSafe<MsgUnregisterClockContract> {
    const obj: any = {};
    message.senderAddress !== undefined && (obj.senderAddress = message.senderAddress);
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    return obj;
  },
  fromPartial(object: Partial<MsgUnregisterClockContract>): MsgUnregisterClockContract {
    const message = createBaseMsgUnregisterClockContract();
    message.senderAddress = object.senderAddress ?? "";
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
  fromAmino(object: MsgUnregisterClockContractAmino): MsgUnregisterClockContract {
    const message = createBaseMsgUnregisterClockContract();
    if (object.sender_address !== undefined && object.sender_address !== null) {
      message.senderAddress = object.sender_address;
    }
    if (object.contract_address !== undefined && object.contract_address !== null) {
      message.contractAddress = object.contract_address;
    }
    return message;
  },
  toAmino(message: MsgUnregisterClockContract): MsgUnregisterClockContractAmino {
    const obj: any = {};
    obj.sender_address = message.senderAddress === "" ? undefined : message.senderAddress;
    obj.contract_address = message.contractAddress === "" ? undefined : message.contractAddress;
    return obj;
  },
  fromAminoMsg(object: MsgUnregisterClockContractAminoMsg): MsgUnregisterClockContract {
    return MsgUnregisterClockContract.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUnregisterClockContractProtoMsg): MsgUnregisterClockContract {
    return MsgUnregisterClockContract.decode(message.value);
  },
  toProto(message: MsgUnregisterClockContract): Uint8Array {
    return MsgUnregisterClockContract.encode(message).finish();
  },
  toProtoMsg(message: MsgUnregisterClockContract): MsgUnregisterClockContractProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUnregisterClockContract",
      value: MsgUnregisterClockContract.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUnregisterClockContract.typeUrl, MsgUnregisterClockContract);
function createBaseMsgUnregisterClockContractResponse(): MsgUnregisterClockContractResponse {
  return {};
}
export const MsgUnregisterClockContractResponse = {
  typeUrl: "/cyber.clock.v1.MsgUnregisterClockContractResponse",
  is(o: any): o is MsgUnregisterClockContractResponse {
    return o && o.$typeUrl === MsgUnregisterClockContractResponse.typeUrl;
  },
  isSDK(o: any): o is MsgUnregisterClockContractResponseSDKType {
    return o && o.$typeUrl === MsgUnregisterClockContractResponse.typeUrl;
  },
  isAmino(o: any): o is MsgUnregisterClockContractResponseAmino {
    return o && o.$typeUrl === MsgUnregisterClockContractResponse.typeUrl;
  },
  encode(_: MsgUnregisterClockContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUnregisterClockContractResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUnregisterClockContractResponse();
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
  fromJSON(_: any): MsgUnregisterClockContractResponse {
    return {};
  },
  toJSON(_: MsgUnregisterClockContractResponse): JsonSafe<MsgUnregisterClockContractResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgUnregisterClockContractResponse>): MsgUnregisterClockContractResponse {
    const message = createBaseMsgUnregisterClockContractResponse();
    return message;
  },
  fromAmino(_: MsgUnregisterClockContractResponseAmino): MsgUnregisterClockContractResponse {
    const message = createBaseMsgUnregisterClockContractResponse();
    return message;
  },
  toAmino(_: MsgUnregisterClockContractResponse): MsgUnregisterClockContractResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgUnregisterClockContractResponseAminoMsg): MsgUnregisterClockContractResponse {
    return MsgUnregisterClockContractResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUnregisterClockContractResponseProtoMsg): MsgUnregisterClockContractResponse {
    return MsgUnregisterClockContractResponse.decode(message.value);
  },
  toProto(message: MsgUnregisterClockContractResponse): Uint8Array {
    return MsgUnregisterClockContractResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUnregisterClockContractResponse): MsgUnregisterClockContractResponseProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUnregisterClockContractResponse",
      value: MsgUnregisterClockContractResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUnregisterClockContractResponse.typeUrl, MsgUnregisterClockContractResponse);
function createBaseMsgUnjailClockContract(): MsgUnjailClockContract {
  return {
    senderAddress: "",
    contractAddress: ""
  };
}
export const MsgUnjailClockContract = {
  typeUrl: "/cyber.clock.v1.MsgUnjailClockContract",
  is(o: any): o is MsgUnjailClockContract {
    return o && (o.$typeUrl === MsgUnjailClockContract.typeUrl || typeof o.senderAddress === "string" && typeof o.contractAddress === "string");
  },
  isSDK(o: any): o is MsgUnjailClockContractSDKType {
    return o && (o.$typeUrl === MsgUnjailClockContract.typeUrl || typeof o.sender_address === "string" && typeof o.contract_address === "string");
  },
  isAmino(o: any): o is MsgUnjailClockContractAmino {
    return o && (o.$typeUrl === MsgUnjailClockContract.typeUrl || typeof o.sender_address === "string" && typeof o.contract_address === "string");
  },
  encode(message: MsgUnjailClockContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.senderAddress !== "") {
      writer.uint32(10).string(message.senderAddress);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUnjailClockContract {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUnjailClockContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.senderAddress = reader.string();
          break;
        case 2:
          message.contractAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgUnjailClockContract {
    return {
      senderAddress: isSet(object.senderAddress) ? String(object.senderAddress) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : ""
    };
  },
  toJSON(message: MsgUnjailClockContract): JsonSafe<MsgUnjailClockContract> {
    const obj: any = {};
    message.senderAddress !== undefined && (obj.senderAddress = message.senderAddress);
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    return obj;
  },
  fromPartial(object: Partial<MsgUnjailClockContract>): MsgUnjailClockContract {
    const message = createBaseMsgUnjailClockContract();
    message.senderAddress = object.senderAddress ?? "";
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
  fromAmino(object: MsgUnjailClockContractAmino): MsgUnjailClockContract {
    const message = createBaseMsgUnjailClockContract();
    if (object.sender_address !== undefined && object.sender_address !== null) {
      message.senderAddress = object.sender_address;
    }
    if (object.contract_address !== undefined && object.contract_address !== null) {
      message.contractAddress = object.contract_address;
    }
    return message;
  },
  toAmino(message: MsgUnjailClockContract): MsgUnjailClockContractAmino {
    const obj: any = {};
    obj.sender_address = message.senderAddress === "" ? undefined : message.senderAddress;
    obj.contract_address = message.contractAddress === "" ? undefined : message.contractAddress;
    return obj;
  },
  fromAminoMsg(object: MsgUnjailClockContractAminoMsg): MsgUnjailClockContract {
    return MsgUnjailClockContract.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUnjailClockContractProtoMsg): MsgUnjailClockContract {
    return MsgUnjailClockContract.decode(message.value);
  },
  toProto(message: MsgUnjailClockContract): Uint8Array {
    return MsgUnjailClockContract.encode(message).finish();
  },
  toProtoMsg(message: MsgUnjailClockContract): MsgUnjailClockContractProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUnjailClockContract",
      value: MsgUnjailClockContract.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUnjailClockContract.typeUrl, MsgUnjailClockContract);
function createBaseMsgUnjailClockContractResponse(): MsgUnjailClockContractResponse {
  return {};
}
export const MsgUnjailClockContractResponse = {
  typeUrl: "/cyber.clock.v1.MsgUnjailClockContractResponse",
  is(o: any): o is MsgUnjailClockContractResponse {
    return o && o.$typeUrl === MsgUnjailClockContractResponse.typeUrl;
  },
  isSDK(o: any): o is MsgUnjailClockContractResponseSDKType {
    return o && o.$typeUrl === MsgUnjailClockContractResponse.typeUrl;
  },
  isAmino(o: any): o is MsgUnjailClockContractResponseAmino {
    return o && o.$typeUrl === MsgUnjailClockContractResponse.typeUrl;
  },
  encode(_: MsgUnjailClockContractResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUnjailClockContractResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUnjailClockContractResponse();
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
  fromJSON(_: any): MsgUnjailClockContractResponse {
    return {};
  },
  toJSON(_: MsgUnjailClockContractResponse): JsonSafe<MsgUnjailClockContractResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgUnjailClockContractResponse>): MsgUnjailClockContractResponse {
    const message = createBaseMsgUnjailClockContractResponse();
    return message;
  },
  fromAmino(_: MsgUnjailClockContractResponseAmino): MsgUnjailClockContractResponse {
    const message = createBaseMsgUnjailClockContractResponse();
    return message;
  },
  toAmino(_: MsgUnjailClockContractResponse): MsgUnjailClockContractResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgUnjailClockContractResponseAminoMsg): MsgUnjailClockContractResponse {
    return MsgUnjailClockContractResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUnjailClockContractResponseProtoMsg): MsgUnjailClockContractResponse {
    return MsgUnjailClockContractResponse.decode(message.value);
  },
  toProto(message: MsgUnjailClockContractResponse): Uint8Array {
    return MsgUnjailClockContractResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUnjailClockContractResponse): MsgUnjailClockContractResponseProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUnjailClockContractResponse",
      value: MsgUnjailClockContractResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUnjailClockContractResponse.typeUrl, MsgUnjailClockContractResponse);
function createBaseMsgUpdateParams(): MsgUpdateParams {
  return {
    authority: "",
    params: Params.fromPartial({})
  };
}
export const MsgUpdateParams = {
  typeUrl: "/cyber.clock.v1.MsgUpdateParams",
  is(o: any): o is MsgUpdateParams {
    return o && (o.$typeUrl === MsgUpdateParams.typeUrl || typeof o.authority === "string" && Params.is(o.params));
  },
  isSDK(o: any): o is MsgUpdateParamsSDKType {
    return o && (o.$typeUrl === MsgUpdateParams.typeUrl || typeof o.authority === "string" && Params.isSDK(o.params));
  },
  isAmino(o: any): o is MsgUpdateParamsAmino {
    return o && (o.$typeUrl === MsgUpdateParams.typeUrl || typeof o.authority === "string" && Params.isAmino(o.params));
  },
  encode(message: MsgUpdateParams, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgUpdateParams {
    return {
      authority: isSet(object.authority) ? String(object.authority) : "",
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined
    };
  },
  toJSON(message: MsgUpdateParams): JsonSafe<MsgUpdateParams> {
    const obj: any = {};
    message.authority !== undefined && (obj.authority = message.authority);
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },
  fromPartial(object: Partial<MsgUpdateParams>): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    message.authority = object.authority ?? "";
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: MsgUpdateParamsAmino): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    }
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: MsgUpdateParams): MsgUpdateParamsAmino {
    const obj: any = {};
    obj.authority = message.authority === "" ? undefined : message.authority;
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: MsgUpdateParamsAminoMsg): MsgUpdateParams {
    return MsgUpdateParams.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUpdateParamsProtoMsg): MsgUpdateParams {
    return MsgUpdateParams.decode(message.value);
  },
  toProto(message: MsgUpdateParams): Uint8Array {
    return MsgUpdateParams.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateParams): MsgUpdateParamsProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUpdateParams",
      value: MsgUpdateParams.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUpdateParams.typeUrl, MsgUpdateParams);
function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}
export const MsgUpdateParamsResponse = {
  typeUrl: "/cyber.clock.v1.MsgUpdateParamsResponse",
  is(o: any): o is MsgUpdateParamsResponse {
    return o && o.$typeUrl === MsgUpdateParamsResponse.typeUrl;
  },
  isSDK(o: any): o is MsgUpdateParamsResponseSDKType {
    return o && o.$typeUrl === MsgUpdateParamsResponse.typeUrl;
  },
  isAmino(o: any): o is MsgUpdateParamsResponseAmino {
    return o && o.$typeUrl === MsgUpdateParamsResponse.typeUrl;
  },
  encode(_: MsgUpdateParamsResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParamsResponse();
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
  fromJSON(_: any): MsgUpdateParamsResponse {
    return {};
  },
  toJSON(_: MsgUpdateParamsResponse): JsonSafe<MsgUpdateParamsResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgUpdateParamsResponse>): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
  fromAmino(_: MsgUpdateParamsResponseAmino): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
  toAmino(_: MsgUpdateParamsResponse): MsgUpdateParamsResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgUpdateParamsResponseAminoMsg): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgUpdateParamsResponseProtoMsg): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.decode(message.value);
  },
  toProto(message: MsgUpdateParamsResponse): Uint8Array {
    return MsgUpdateParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateParamsResponse): MsgUpdateParamsResponseProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.MsgUpdateParamsResponse",
      value: MsgUpdateParamsResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgUpdateParamsResponse.typeUrl, MsgUpdateParamsResponse);