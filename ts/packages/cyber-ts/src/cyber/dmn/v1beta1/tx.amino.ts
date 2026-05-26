//@ts-nocheck
import { MsgCreateThought, MsgForgetThought, MsgChangeThoughtParticle, MsgChangeThoughtName, MsgChangeThoughtInput, MsgChangeThoughtGasPrice, MsgChangeThoughtPeriod, MsgChangeThoughtBlock, MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/cyber.dmn.v1beta1.MsgCreateThought": {
    aminoType: "/cyber.dmn.v1beta1.MsgCreateThought",
    toAmino: MsgCreateThought.toAmino,
    fromAmino: MsgCreateThought.fromAmino
  },
  "/cyber.dmn.v1beta1.MsgForgetThought": {
    aminoType: "/cyber.dmn.v1beta1.MsgForgetThought",
    toAmino: MsgForgetThought.toAmino,
    fromAmino: MsgForgetThought.fromAmino
  },
  "/cyber.dmn.v1beta1.MsgChangeThoughtParticle": {
    aminoType: "/cyber.dmn.v1beta1.MsgChangeThoughtParticle",
    toAmino: MsgChangeThoughtParticle.toAmino,
    fromAmino: MsgChangeThoughtParticle.fromAmino
  },
  "/cyber.dmn.v1beta1.MsgChangeThoughtName": {
    aminoType: "/cyber.dmn.v1beta1.MsgChangeThoughtName",
    toAmino: MsgChangeThoughtName.toAmino,
    fromAmino: MsgChangeThoughtName.fromAmino
  },
  "/cyber.dmn.v1beta1.MsgChangeThoughtInput": {
    aminoType: "/cyber.dmn.v1beta1.MsgChangeThoughtInput",
    toAmino: MsgChangeThoughtInput.toAmino,
    fromAmino: MsgChangeThoughtInput.fromAmino
  },
  "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice": {
    aminoType: "/cyber.dmn.v1beta1.MsgChangeThoughtGasPrice",
    toAmino: MsgChangeThoughtGasPrice.toAmino,
    fromAmino: MsgChangeThoughtGasPrice.fromAmino
  },
  "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod": {
    aminoType: "/cyber.dmn.v1beta1.MsgChangeThoughtPeriod",
    toAmino: MsgChangeThoughtPeriod.toAmino,
    fromAmino: MsgChangeThoughtPeriod.fromAmino
  },
  "/cyber.dmn.v1beta1.MsgChangeThoughtBlock": {
    aminoType: "/cyber.dmn.v1beta1.MsgChangeThoughtBlock",
    toAmino: MsgChangeThoughtBlock.toAmino,
    fromAmino: MsgChangeThoughtBlock.fromAmino
  },
  "/cyber.dmn.v1beta1.MsgUpdateParams": {
    aminoType: "/cyber.dmn.v1beta1.MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};