//@ts-nocheck
import { MsgCreateRoute, MsgEditRoute, MsgDeleteRoute, MsgEditRouteName, MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/cyber.grid.v1beta1.MsgCreateRoute": {
    aminoType: "/cyber.grid.v1beta1.MsgCreateRoute",
    toAmino: MsgCreateRoute.toAmino,
    fromAmino: MsgCreateRoute.fromAmino
  },
  "/cyber.grid.v1beta1.MsgEditRoute": {
    aminoType: "/cyber.grid.v1beta1.MsgEditRoute",
    toAmino: MsgEditRoute.toAmino,
    fromAmino: MsgEditRoute.fromAmino
  },
  "/cyber.grid.v1beta1.MsgDeleteRoute": {
    aminoType: "/cyber.grid.v1beta1.MsgDeleteRoute",
    toAmino: MsgDeleteRoute.toAmino,
    fromAmino: MsgDeleteRoute.fromAmino
  },
  "/cyber.grid.v1beta1.MsgEditRouteName": {
    aminoType: "/cyber.grid.v1beta1.MsgEditRouteName",
    toAmino: MsgEditRouteName.toAmino,
    fromAmino: MsgEditRouteName.fromAmino
  },
  "/cyber.grid.v1beta1.MsgUpdateParams": {
    aminoType: "/cyber.grid.v1beta1.MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};