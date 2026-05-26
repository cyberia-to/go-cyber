//@ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgInvestmint, MsgUpdateParams } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cyber.resources.v1beta1.MsgInvestmint", MsgInvestmint], ["/cyber.resources.v1beta1.MsgUpdateParams", MsgUpdateParams]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    investmint(value: MsgInvestmint) {
      return {
        typeUrl: "/cyber.resources.v1beta1.MsgInvestmint",
        value: MsgInvestmint.encode(value).finish()
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.resources.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    investmint(value: MsgInvestmint) {
      return {
        typeUrl: "/cyber.resources.v1beta1.MsgInvestmint",
        value
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.resources.v1beta1.MsgUpdateParams",
        value
      };
    }
  },
  toJSON: {
    investmint(value: MsgInvestmint) {
      return {
        typeUrl: "/cyber.resources.v1beta1.MsgInvestmint",
        value: MsgInvestmint.toJSON(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.resources.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.toJSON(value)
      };
    }
  },
  fromJSON: {
    investmint(value: any) {
      return {
        typeUrl: "/cyber.resources.v1beta1.MsgInvestmint",
        value: MsgInvestmint.fromJSON(value)
      };
    },
    updateParams(value: any) {
      return {
        typeUrl: "/cyber.resources.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.fromJSON(value)
      };
    }
  },
  fromPartial: {
    investmint(value: MsgInvestmint) {
      return {
        typeUrl: "/cyber.resources.v1beta1.MsgInvestmint",
        value: MsgInvestmint.fromPartial(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.resources.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.fromPartial(value)
      };
    }
  }
};