//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../base/v1beta1/coin";
import { Input, InputAmino, InputSDKType, Output, OutputAmino, OutputSDKType } from "./bank";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
/** MsgSend represents a message to send coins from one account to another. */
export interface MsgSend {
  fromAddress: string;
  toAddress: string;
  amount: Coin[];
}
export interface MsgSendProtoMsg {
  typeUrl: "/cosmos.bank.v1beta1.MsgSend";
  value: Uint8Array;
}
/** MsgSend represents a message to send coins from one account to another. */
export interface MsgSendAmino {
  from_address?: string;
  to_address?: string;
  amount?: CoinAmino[];
}
export interface MsgSendAminoMsg {
  type: "cosmos-sdk/MsgSend";
  value: MsgSendAmino;
}
/** MsgSend represents a message to send coins from one account to another. */
export interface MsgSendSDKType {
  from_address: string;
  to_address: string;
  amount: CoinSDKType[];
}
/** MsgSendResponse defines the Msg/Send response type. */
export interface MsgSendResponse {}
export interface MsgSendResponseProtoMsg {
  typeUrl: "/cosmos.bank.v1beta1.MsgSendResponse";
  value: Uint8Array;
}
/** MsgSendResponse defines the Msg/Send response type. */
export interface MsgSendResponseAmino {}
export interface MsgSendResponseAminoMsg {
  type: "cosmos-sdk/MsgSendResponse";
  value: MsgSendResponseAmino;
}
/** MsgSendResponse defines the Msg/Send response type. */
export interface MsgSendResponseSDKType {}
/** MsgMultiSend represents an arbitrary multi-in, multi-out send message. */
export interface MsgMultiSend {
  inputs: Input[];
  outputs: Output[];
}
export interface MsgMultiSendProtoMsg {
  typeUrl: "/cosmos.bank.v1beta1.MsgMultiSend";
  value: Uint8Array;
}
/** MsgMultiSend represents an arbitrary multi-in, multi-out send message. */
export interface MsgMultiSendAmino {
  inputs?: InputAmino[];
  outputs?: OutputAmino[];
}
export interface MsgMultiSendAminoMsg {
  type: "cosmos-sdk/MsgMultiSend";
  value: MsgMultiSendAmino;
}
/** MsgMultiSend represents an arbitrary multi-in, multi-out send message. */
export interface MsgMultiSendSDKType {
  inputs: InputSDKType[];
  outputs: OutputSDKType[];
}
/** MsgMultiSendResponse defines the Msg/MultiSend response type. */
export interface MsgMultiSendResponse {}
export interface MsgMultiSendResponseProtoMsg {
  typeUrl: "/cosmos.bank.v1beta1.MsgMultiSendResponse";
  value: Uint8Array;
}
/** MsgMultiSendResponse defines the Msg/MultiSend response type. */
export interface MsgMultiSendResponseAmino {}
export interface MsgMultiSendResponseAminoMsg {
  type: "cosmos-sdk/MsgMultiSendResponse";
  value: MsgMultiSendResponseAmino;
}
/** MsgMultiSendResponse defines the Msg/MultiSend response type. */
export interface MsgMultiSendResponseSDKType {}
function createBaseMsgSend(): MsgSend {
  return {
    fromAddress: "",
    toAddress: "",
    amount: []
  };
}
export const MsgSend = {
  typeUrl: "/cosmos.bank.v1beta1.MsgSend",
  aminoType: "cosmos-sdk/MsgSend",
  is(o: any): o is MsgSend {
    return o && (o.$typeUrl === MsgSend.typeUrl || typeof o.fromAddress === "string" && typeof o.toAddress === "string" && Array.isArray(o.amount) && (!o.amount.length || Coin.is(o.amount[0])));
  },
  isSDK(o: any): o is MsgSendSDKType {
    return o && (o.$typeUrl === MsgSend.typeUrl || typeof o.from_address === "string" && typeof o.to_address === "string" && Array.isArray(o.amount) && (!o.amount.length || Coin.isSDK(o.amount[0])));
  },
  isAmino(o: any): o is MsgSendAmino {
    return o && (o.$typeUrl === MsgSend.typeUrl || typeof o.from_address === "string" && typeof o.to_address === "string" && Array.isArray(o.amount) && (!o.amount.length || Coin.isAmino(o.amount[0])));
  },
  encode(message: MsgSend, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.fromAddress !== "") {
      writer.uint32(10).string(message.fromAddress);
    }
    if (message.toAddress !== "") {
      writer.uint32(18).string(message.toAddress);
    }
    for (const v of message.amount) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSend {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSend();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fromAddress = reader.string();
          break;
        case 2:
          message.toAddress = reader.string();
          break;
        case 3:
          message.amount.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgSend {
    return {
      fromAddress: isSet(object.fromAddress) ? String(object.fromAddress) : "",
      toAddress: isSet(object.toAddress) ? String(object.toAddress) : "",
      amount: Array.isArray(object?.amount) ? object.amount.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: MsgSend): JsonSafe<MsgSend> {
    const obj: any = {};
    message.fromAddress !== undefined && (obj.fromAddress = message.fromAddress);
    message.toAddress !== undefined && (obj.toAddress = message.toAddress);
    if (message.amount) {
      obj.amount = message.amount.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.amount = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgSend>): MsgSend {
    const message = createBaseMsgSend();
    message.fromAddress = object.fromAddress ?? "";
    message.toAddress = object.toAddress ?? "";
    message.amount = object.amount?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: MsgSendAmino): MsgSend {
    const message = createBaseMsgSend();
    if (object.from_address !== undefined && object.from_address !== null) {
      message.fromAddress = object.from_address;
    }
    if (object.to_address !== undefined && object.to_address !== null) {
      message.toAddress = object.to_address;
    }
    message.amount = object.amount?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: MsgSend): MsgSendAmino {
    const obj: any = {};
    obj.from_address = message.fromAddress === "" ? undefined : message.fromAddress;
    obj.to_address = message.toAddress === "" ? undefined : message.toAddress;
    if (message.amount) {
      obj.amount = message.amount.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.amount = message.amount;
    }
    return obj;
  },
  fromAminoMsg(object: MsgSendAminoMsg): MsgSend {
    return MsgSend.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSend): MsgSendAminoMsg {
    return {
      type: "cosmos-sdk/MsgSend",
      value: MsgSend.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSendProtoMsg): MsgSend {
    return MsgSend.decode(message.value);
  },
  toProto(message: MsgSend): Uint8Array {
    return MsgSend.encode(message).finish();
  },
  toProtoMsg(message: MsgSend): MsgSendProtoMsg {
    return {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: MsgSend.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgSend.typeUrl, MsgSend);
GlobalDecoderRegistry.registerAminoProtoMapping(MsgSend.aminoType, MsgSend.typeUrl);
function createBaseMsgSendResponse(): MsgSendResponse {
  return {};
}
export const MsgSendResponse = {
  typeUrl: "/cosmos.bank.v1beta1.MsgSendResponse",
  aminoType: "cosmos-sdk/MsgSendResponse",
  is(o: any): o is MsgSendResponse {
    return o && o.$typeUrl === MsgSendResponse.typeUrl;
  },
  isSDK(o: any): o is MsgSendResponseSDKType {
    return o && o.$typeUrl === MsgSendResponse.typeUrl;
  },
  isAmino(o: any): o is MsgSendResponseAmino {
    return o && o.$typeUrl === MsgSendResponse.typeUrl;
  },
  encode(_: MsgSendResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgSendResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSendResponse();
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
  fromJSON(_: any): MsgSendResponse {
    return {};
  },
  toJSON(_: MsgSendResponse): JsonSafe<MsgSendResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgSendResponse>): MsgSendResponse {
    const message = createBaseMsgSendResponse();
    return message;
  },
  fromAmino(_: MsgSendResponseAmino): MsgSendResponse {
    const message = createBaseMsgSendResponse();
    return message;
  },
  toAmino(_: MsgSendResponse): MsgSendResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgSendResponseAminoMsg): MsgSendResponse {
    return MsgSendResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgSendResponse): MsgSendResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgSendResponse",
      value: MsgSendResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgSendResponseProtoMsg): MsgSendResponse {
    return MsgSendResponse.decode(message.value);
  },
  toProto(message: MsgSendResponse): Uint8Array {
    return MsgSendResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgSendResponse): MsgSendResponseProtoMsg {
    return {
      typeUrl: "/cosmos.bank.v1beta1.MsgSendResponse",
      value: MsgSendResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgSendResponse.typeUrl, MsgSendResponse);
GlobalDecoderRegistry.registerAminoProtoMapping(MsgSendResponse.aminoType, MsgSendResponse.typeUrl);
function createBaseMsgMultiSend(): MsgMultiSend {
  return {
    inputs: [],
    outputs: []
  };
}
export const MsgMultiSend = {
  typeUrl: "/cosmos.bank.v1beta1.MsgMultiSend",
  aminoType: "cosmos-sdk/MsgMultiSend",
  is(o: any): o is MsgMultiSend {
    return o && (o.$typeUrl === MsgMultiSend.typeUrl || Array.isArray(o.inputs) && (!o.inputs.length || Input.is(o.inputs[0])) && Array.isArray(o.outputs) && (!o.outputs.length || Output.is(o.outputs[0])));
  },
  isSDK(o: any): o is MsgMultiSendSDKType {
    return o && (o.$typeUrl === MsgMultiSend.typeUrl || Array.isArray(o.inputs) && (!o.inputs.length || Input.isSDK(o.inputs[0])) && Array.isArray(o.outputs) && (!o.outputs.length || Output.isSDK(o.outputs[0])));
  },
  isAmino(o: any): o is MsgMultiSendAmino {
    return o && (o.$typeUrl === MsgMultiSend.typeUrl || Array.isArray(o.inputs) && (!o.inputs.length || Input.isAmino(o.inputs[0])) && Array.isArray(o.outputs) && (!o.outputs.length || Output.isAmino(o.outputs[0])));
  },
  encode(message: MsgMultiSend, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    for (const v of message.inputs) {
      Input.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.outputs) {
      Output.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgMultiSend {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgMultiSend();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.inputs.push(Input.decode(reader, reader.uint32()));
          break;
        case 2:
          message.outputs.push(Output.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgMultiSend {
    return {
      inputs: Array.isArray(object?.inputs) ? object.inputs.map((e: any) => Input.fromJSON(e)) : [],
      outputs: Array.isArray(object?.outputs) ? object.outputs.map((e: any) => Output.fromJSON(e)) : []
    };
  },
  toJSON(message: MsgMultiSend): JsonSafe<MsgMultiSend> {
    const obj: any = {};
    if (message.inputs) {
      obj.inputs = message.inputs.map(e => e ? Input.toJSON(e) : undefined);
    } else {
      obj.inputs = [];
    }
    if (message.outputs) {
      obj.outputs = message.outputs.map(e => e ? Output.toJSON(e) : undefined);
    } else {
      obj.outputs = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgMultiSend>): MsgMultiSend {
    const message = createBaseMsgMultiSend();
    message.inputs = object.inputs?.map(e => Input.fromPartial(e)) || [];
    message.outputs = object.outputs?.map(e => Output.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: MsgMultiSendAmino): MsgMultiSend {
    const message = createBaseMsgMultiSend();
    message.inputs = object.inputs?.map(e => Input.fromAmino(e)) || [];
    message.outputs = object.outputs?.map(e => Output.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: MsgMultiSend): MsgMultiSendAmino {
    const obj: any = {};
    if (message.inputs) {
      obj.inputs = message.inputs.map(e => e ? Input.toAmino(e) : undefined);
    } else {
      obj.inputs = message.inputs;
    }
    if (message.outputs) {
      obj.outputs = message.outputs.map(e => e ? Output.toAmino(e) : undefined);
    } else {
      obj.outputs = message.outputs;
    }
    return obj;
  },
  fromAminoMsg(object: MsgMultiSendAminoMsg): MsgMultiSend {
    return MsgMultiSend.fromAmino(object.value);
  },
  toAminoMsg(message: MsgMultiSend): MsgMultiSendAminoMsg {
    return {
      type: "cosmos-sdk/MsgMultiSend",
      value: MsgMultiSend.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgMultiSendProtoMsg): MsgMultiSend {
    return MsgMultiSend.decode(message.value);
  },
  toProto(message: MsgMultiSend): Uint8Array {
    return MsgMultiSend.encode(message).finish();
  },
  toProtoMsg(message: MsgMultiSend): MsgMultiSendProtoMsg {
    return {
      typeUrl: "/cosmos.bank.v1beta1.MsgMultiSend",
      value: MsgMultiSend.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgMultiSend.typeUrl, MsgMultiSend);
GlobalDecoderRegistry.registerAminoProtoMapping(MsgMultiSend.aminoType, MsgMultiSend.typeUrl);
function createBaseMsgMultiSendResponse(): MsgMultiSendResponse {
  return {};
}
export const MsgMultiSendResponse = {
  typeUrl: "/cosmos.bank.v1beta1.MsgMultiSendResponse",
  aminoType: "cosmos-sdk/MsgMultiSendResponse",
  is(o: any): o is MsgMultiSendResponse {
    return o && o.$typeUrl === MsgMultiSendResponse.typeUrl;
  },
  isSDK(o: any): o is MsgMultiSendResponseSDKType {
    return o && o.$typeUrl === MsgMultiSendResponse.typeUrl;
  },
  isAmino(o: any): o is MsgMultiSendResponseAmino {
    return o && o.$typeUrl === MsgMultiSendResponse.typeUrl;
  },
  encode(_: MsgMultiSendResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgMultiSendResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgMultiSendResponse();
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
  fromJSON(_: any): MsgMultiSendResponse {
    return {};
  },
  toJSON(_: MsgMultiSendResponse): JsonSafe<MsgMultiSendResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgMultiSendResponse>): MsgMultiSendResponse {
    const message = createBaseMsgMultiSendResponse();
    return message;
  },
  fromAmino(_: MsgMultiSendResponseAmino): MsgMultiSendResponse {
    const message = createBaseMsgMultiSendResponse();
    return message;
  },
  toAmino(_: MsgMultiSendResponse): MsgMultiSendResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgMultiSendResponseAminoMsg): MsgMultiSendResponse {
    return MsgMultiSendResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgMultiSendResponse): MsgMultiSendResponseAminoMsg {
    return {
      type: "cosmos-sdk/MsgMultiSendResponse",
      value: MsgMultiSendResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgMultiSendResponseProtoMsg): MsgMultiSendResponse {
    return MsgMultiSendResponse.decode(message.value);
  },
  toProto(message: MsgMultiSendResponse): Uint8Array {
    return MsgMultiSendResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgMultiSendResponse): MsgMultiSendResponseProtoMsg {
    return {
      typeUrl: "/cosmos.bank.v1beta1.MsgMultiSendResponse",
      value: MsgMultiSendResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgMultiSendResponse.typeUrl, MsgMultiSendResponse);
GlobalDecoderRegistry.registerAminoProtoMapping(MsgMultiSendResponse.aminoType, MsgMultiSendResponse.typeUrl);