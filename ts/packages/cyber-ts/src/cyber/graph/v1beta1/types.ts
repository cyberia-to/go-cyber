//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
export interface Link {
  from: string;
  to: string;
}
export interface LinkProtoMsg {
  typeUrl: "/cyber.graph.v1beta1.Link";
  value: Uint8Array;
}
export interface LinkAmino {
  from?: string;
  to?: string;
}
export interface LinkAminoMsg {
  type: "/cyber.graph.v1beta1.Link";
  value: LinkAmino;
}
export interface LinkSDKType {
  from: string;
  to: string;
}
function createBaseLink(): Link {
  return {
    from: "",
    to: ""
  };
}
export const Link = {
  typeUrl: "/cyber.graph.v1beta1.Link",
  is(o: any): o is Link {
    return o && (o.$typeUrl === Link.typeUrl || typeof o.from === "string" && typeof o.to === "string");
  },
  isSDK(o: any): o is LinkSDKType {
    return o && (o.$typeUrl === Link.typeUrl || typeof o.from === "string" && typeof o.to === "string");
  },
  isAmino(o: any): o is LinkAmino {
    return o && (o.$typeUrl === Link.typeUrl || typeof o.from === "string" && typeof o.to === "string");
  },
  encode(message: Link, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(18).string(message.to);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Link {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLink();
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
  fromJSON(object: any): Link {
    return {
      from: isSet(object.from) ? String(object.from) : "",
      to: isSet(object.to) ? String(object.to) : ""
    };
  },
  toJSON(message: Link): JsonSafe<Link> {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    return obj;
  },
  fromPartial(object: Partial<Link>): Link {
    const message = createBaseLink();
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    return message;
  },
  fromAmino(object: LinkAmino): Link {
    const message = createBaseLink();
    if (object.from !== undefined && object.from !== null) {
      message.from = object.from;
    }
    if (object.to !== undefined && object.to !== null) {
      message.to = object.to;
    }
    return message;
  },
  toAmino(message: Link): LinkAmino {
    const obj: any = {};
    obj.from = message.from === "" ? undefined : message.from;
    obj.to = message.to === "" ? undefined : message.to;
    return obj;
  },
  fromAminoMsg(object: LinkAminoMsg): Link {
    return Link.fromAmino(object.value);
  },
  fromProtoMsg(message: LinkProtoMsg): Link {
    return Link.decode(message.value);
  },
  toProto(message: Link): Uint8Array {
    return Link.encode(message).finish();
  },
  toProtoMsg(message: Link): LinkProtoMsg {
    return {
      typeUrl: "/cyber.graph.v1beta1.Link",
      value: Link.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(Link.typeUrl, Link);