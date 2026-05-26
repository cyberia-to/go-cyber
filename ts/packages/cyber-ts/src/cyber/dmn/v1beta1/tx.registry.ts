//@ts-nocheck
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgCreateThought, MsgForgetThought, MsgChangeThoughtParticle, MsgChangeThoughtName, MsgChangeThoughtInput, MsgChangeThoughtGasPrice, MsgChangeThoughtPeriod, MsgChangeThoughtBlock, MsgUpdateParams } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cyber.dmn.v1beta1.MsgCreateThought", MsgCreateThought], ["/cyber.dmn.v1beta1.MsgForgetThought", MsgForgetThought], ["/cyber.dmn.v1beta1.MsgChangeThoughtParticle", MsgChangeThoughtParticle], ["/cyber.dmn.v1beta1.MsgChangeThoughtName", MsgChangeThoughtName], ["/cyber.dmn.v1beta1.MsgChangeThoughtInput", MsgChangeThoughtInput], ["/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice", MsgChangeThoughtGasPrice], ["/cyber.dmn.v1beta1.MsgChangeThoughtPeriod", MsgChangeThoughtPeriod], ["/cyber.dmn.v1beta1.MsgChangeThoughtBlock", MsgChangeThoughtBlock], ["/cyber.dmn.v1beta1.MsgUpdateParams", MsgUpdateParams]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    createThought(value: MsgCreateThought) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought",
        value: MsgCreateThought.encode(value).finish()
      };
    },
    forgetThought(value: MsgForgetThought) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought",
        value: MsgForgetThought.encode(value).finish()
      };
    },
    changeThoughtParticle(value: MsgChangeThoughtParticle) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle",
        value: MsgChangeThoughtParticle.encode(value).finish()
      };
    },
    changeThoughtName(value: MsgChangeThoughtName) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName",
        value: MsgChangeThoughtName.encode(value).finish()
      };
    },
    changeThoughtInput(value: MsgChangeThoughtInput) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput",
        value: MsgChangeThoughtInput.encode(value).finish()
      };
    },
    changeThoughtGasPrice(value: MsgChangeThoughtGasPrice) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice",
        value: MsgChangeThoughtGasPrice.encode(value).finish()
      };
    },
    changeThoughtPeriod(value: MsgChangeThoughtPeriod) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod",
        value: MsgChangeThoughtPeriod.encode(value).finish()
      };
    },
    changeThoughtBlock(value: MsgChangeThoughtBlock) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock",
        value: MsgChangeThoughtBlock.encode(value).finish()
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    createThought(value: MsgCreateThought) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought",
        value
      };
    },
    forgetThought(value: MsgForgetThought) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought",
        value
      };
    },
    changeThoughtParticle(value: MsgChangeThoughtParticle) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle",
        value
      };
    },
    changeThoughtName(value: MsgChangeThoughtName) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName",
        value
      };
    },
    changeThoughtInput(value: MsgChangeThoughtInput) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput",
        value
      };
    },
    changeThoughtGasPrice(value: MsgChangeThoughtGasPrice) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice",
        value
      };
    },
    changeThoughtPeriod(value: MsgChangeThoughtPeriod) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod",
        value
      };
    },
    changeThoughtBlock(value: MsgChangeThoughtBlock) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock",
        value
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams",
        value
      };
    }
  },
  toJSON: {
    createThought(value: MsgCreateThought) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought",
        value: MsgCreateThought.toJSON(value)
      };
    },
    forgetThought(value: MsgForgetThought) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought",
        value: MsgForgetThought.toJSON(value)
      };
    },
    changeThoughtParticle(value: MsgChangeThoughtParticle) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle",
        value: MsgChangeThoughtParticle.toJSON(value)
      };
    },
    changeThoughtName(value: MsgChangeThoughtName) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName",
        value: MsgChangeThoughtName.toJSON(value)
      };
    },
    changeThoughtInput(value: MsgChangeThoughtInput) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput",
        value: MsgChangeThoughtInput.toJSON(value)
      };
    },
    changeThoughtGasPrice(value: MsgChangeThoughtGasPrice) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice",
        value: MsgChangeThoughtGasPrice.toJSON(value)
      };
    },
    changeThoughtPeriod(value: MsgChangeThoughtPeriod) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod",
        value: MsgChangeThoughtPeriod.toJSON(value)
      };
    },
    changeThoughtBlock(value: MsgChangeThoughtBlock) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock",
        value: MsgChangeThoughtBlock.toJSON(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.toJSON(value)
      };
    }
  },
  fromJSON: {
    createThought(value: any) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought",
        value: MsgCreateThought.fromJSON(value)
      };
    },
    forgetThought(value: any) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought",
        value: MsgForgetThought.fromJSON(value)
      };
    },
    changeThoughtParticle(value: any) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle",
        value: MsgChangeThoughtParticle.fromJSON(value)
      };
    },
    changeThoughtName(value: any) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName",
        value: MsgChangeThoughtName.fromJSON(value)
      };
    },
    changeThoughtInput(value: any) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput",
        value: MsgChangeThoughtInput.fromJSON(value)
      };
    },
    changeThoughtGasPrice(value: any) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice",
        value: MsgChangeThoughtGasPrice.fromJSON(value)
      };
    },
    changeThoughtPeriod(value: any) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod",
        value: MsgChangeThoughtPeriod.fromJSON(value)
      };
    },
    changeThoughtBlock(value: any) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock",
        value: MsgChangeThoughtBlock.fromJSON(value)
      };
    },
    updateParams(value: any) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.fromJSON(value)
      };
    }
  },
  fromPartial: {
    createThought(value: MsgCreateThought) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgCreateThought",
        value: MsgCreateThought.fromPartial(value)
      };
    },
    forgetThought(value: MsgForgetThought) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgForgetThought",
        value: MsgForgetThought.fromPartial(value)
      };
    },
    changeThoughtParticle(value: MsgChangeThoughtParticle) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle",
        value: MsgChangeThoughtParticle.fromPartial(value)
      };
    },
    changeThoughtName(value: MsgChangeThoughtName) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtName",
        value: MsgChangeThoughtName.fromPartial(value)
      };
    },
    changeThoughtInput(value: MsgChangeThoughtInput) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtInput",
        value: MsgChangeThoughtInput.fromPartial(value)
      };
    },
    changeThoughtGasPrice(value: MsgChangeThoughtGasPrice) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice",
        value: MsgChangeThoughtGasPrice.fromPartial(value)
      };
    },
    changeThoughtPeriod(value: MsgChangeThoughtPeriod) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod",
        value: MsgChangeThoughtPeriod.fromPartial(value)
      };
    },
    changeThoughtBlock(value: MsgChangeThoughtBlock) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock",
        value: MsgChangeThoughtBlock.fromPartial(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/cyber.dmn.v1beta1.MsgUpdateParams",
        value: MsgUpdateParams.fromPartial(value)
      };
    }
  }
};