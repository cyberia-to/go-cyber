//@ts-nocheck
import { Link, LinkAmino, LinkSDKType } from "./types";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
export interface MsgCyberlink {
  neuron: string;
  links: Link[];
}
export interface MsgCyberlinkProtoMsg {
  typeUrl: "/cyber.graph.v1beta1.MsgCyberlink";
  value: Uint8Array;
}
export interface MsgCyberlinkAmino {
  neuron?: string;
  links?: LinkAmino[];
}
export interface MsgCyberlinkAminoMsg {
  type: "/cyber.graph.v1beta1.MsgCyberlink";
  value: MsgCyberlinkAmino;
}
export interface MsgCyberlinkSDKType {
  neuron: string;
  links: LinkSDKType[];
}
export interface MsgCyberlinkResponse {}
export interface MsgCyberlinkResponseProtoMsg {
  typeUrl: "/cyber.graph.v1beta1.MsgCyberlinkResponse";
  value: Uint8Array;
}
export interface MsgCyberlinkResponseAmino {}
export interface MsgCyberlinkResponseAminoMsg {
  type: "/cyber.graph.v1beta1.MsgCyberlinkResponse";
  value: MsgCyberlinkResponseAmino;
}
export interface MsgCyberlinkResponseSDKType {}
function createBaseMsgCyberlink(): MsgCyberlink {
  return {
    neuron: "",
    links: []
  };
}
export const MsgCyberlink = {
  typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
  is(o: any): o is MsgCyberlink {
    return o && (o.$typeUrl === MsgCyberlink.typeUrl || typeof o.neuron === "string" && Array.isArray(o.links) && (!o.links.length || Link.is(o.links[0])));
  },
  isSDK(o: any): o is MsgCyberlinkSDKType {
    return o && (o.$typeUrl === MsgCyberlink.typeUrl || typeof o.neuron === "string" && Array.isArray(o.links) && (!o.links.length || Link.isSDK(o.links[0])));
  },
  isAmino(o: any): o is MsgCyberlinkAmino {
    return o && (o.$typeUrl === MsgCyberlink.typeUrl || typeof o.neuron === "string" && Array.isArray(o.links) && (!o.links.length || Link.isAmino(o.links[0])));
  },
  encode(message: MsgCyberlink, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.neuron !== "") {
      writer.uint32(10).string(message.neuron);
    }
    for (const v of message.links) {
      Link.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCyberlink {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCyberlink();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.neuron = reader.string();
          break;
        case 2:
          message.links.push(Link.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgCyberlink {
    return {
      neuron: isSet(object.neuron) ? String(object.neuron) : "",
      links: Array.isArray(object?.links) ? object.links.map((e: any) => Link.fromJSON(e)) : []
    };
  },
  toJSON(message: MsgCyberlink): JsonSafe<MsgCyberlink> {
    const obj: any = {};
    message.neuron !== undefined && (obj.neuron = message.neuron);
    if (message.links) {
      obj.links = message.links.map(e => e ? Link.toJSON(e) : undefined);
    } else {
      obj.links = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgCyberlink>): MsgCyberlink {
    const message = createBaseMsgCyberlink();
    message.neuron = object.neuron ?? "";
    message.links = object.links?.map(e => Link.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: MsgCyberlinkAmino): MsgCyberlink {
    const message = createBaseMsgCyberlink();
    if (object.neuron !== undefined && object.neuron !== null) {
      message.neuron = object.neuron;
    }
    message.links = object.links?.map(e => Link.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: MsgCyberlink): MsgCyberlinkAmino {
    const obj: any = {};
    obj.neuron = message.neuron === "" ? undefined : message.neuron;
    if (message.links) {
      obj.links = message.links.map(e => e ? Link.toAmino(e) : undefined);
    } else {
      obj.links = message.links;
    }
    return obj;
  },
  fromAminoMsg(object: MsgCyberlinkAminoMsg): MsgCyberlink {
    return MsgCyberlink.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgCyberlinkProtoMsg): MsgCyberlink {
    return MsgCyberlink.decode(message.value);
  },
  toProto(message: MsgCyberlink): Uint8Array {
    return MsgCyberlink.encode(message).finish();
  },
  toProtoMsg(message: MsgCyberlink): MsgCyberlinkProtoMsg {
    return {
      typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
      value: MsgCyberlink.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgCyberlink.typeUrl, MsgCyberlink);
function createBaseMsgCyberlinkResponse(): MsgCyberlinkResponse {
  return {};
}
export const MsgCyberlinkResponse = {
  typeUrl: "/cyber.graph.v1beta1.MsgCyberlinkResponse",
  is(o: any): o is MsgCyberlinkResponse {
    return o && o.$typeUrl === MsgCyberlinkResponse.typeUrl;
  },
  isSDK(o: any): o is MsgCyberlinkResponseSDKType {
    return o && o.$typeUrl === MsgCyberlinkResponse.typeUrl;
  },
  isAmino(o: any): o is MsgCyberlinkResponseAmino {
    return o && o.$typeUrl === MsgCyberlinkResponse.typeUrl;
  },
  encode(_: MsgCyberlinkResponse, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgCyberlinkResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCyberlinkResponse();
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
  fromJSON(_: any): MsgCyberlinkResponse {
    return {};
  },
  toJSON(_: MsgCyberlinkResponse): JsonSafe<MsgCyberlinkResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgCyberlinkResponse>): MsgCyberlinkResponse {
    const message = createBaseMsgCyberlinkResponse();
    return message;
  },
  fromAmino(_: MsgCyberlinkResponseAmino): MsgCyberlinkResponse {
    const message = createBaseMsgCyberlinkResponse();
    return message;
  },
  toAmino(_: MsgCyberlinkResponse): MsgCyberlinkResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgCyberlinkResponseAminoMsg): MsgCyberlinkResponse {
    return MsgCyberlinkResponse.fromAmino(object.value);
  },
  fromProtoMsg(message: MsgCyberlinkResponseProtoMsg): MsgCyberlinkResponse {
    return MsgCyberlinkResponse.decode(message.value);
  },
  toProto(message: MsgCyberlinkResponse): Uint8Array {
    return MsgCyberlinkResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgCyberlinkResponse): MsgCyberlinkResponseProtoMsg {
    return {
      typeUrl: "/cyber.graph.v1beta1.MsgCyberlinkResponse",
      value: MsgCyberlinkResponse.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(MsgCyberlinkResponse.typeUrl, MsgCyberlinkResponse);