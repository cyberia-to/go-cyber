//@ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgCyberlink } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cyber.graph.v1beta1.MsgCyberlink", MsgCyberlink]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    cyberlink(value: MsgCyberlink) {
      return {
        typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
        value: MsgCyberlink.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    cyberlink(value: MsgCyberlink) {
      return {
        typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
        value
      };
    }
  },
  toJSON: {
    cyberlink(value: MsgCyberlink) {
      return {
        typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
        value: MsgCyberlink.toJSON(value)
      };
    }
  },
  fromJSON: {
    cyberlink(value: any) {
      return {
        typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
        value: MsgCyberlink.fromJSON(value)
      };
    }
  },
  fromPartial: {
    cyberlink(value: MsgCyberlink) {
      return {
        typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
        value: MsgCyberlink.fromPartial(value)
      };
    }
  }
};