//@ts-nocheck
import { MsgInvestmint, MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/cyber.resources.v1beta1.MsgInvestmint": {
    aminoType: "/cyber.resources.v1beta1.MsgInvestmint",
    toAmino: MsgInvestmint.toAmino,
    fromAmino: MsgInvestmint.fromAmino
  },
  "/cyber.resources.v1beta1.MsgUpdateParams": {
    aminoType: "/cyber.resources.v1beta1.MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};