//@ts-nocheck
import { MsgRegisterClockContract, MsgUnregisterClockContract, MsgUnjailClockContract, MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/cyber.clock.v1.MsgRegisterClockContract": {
    aminoType: "/cyber.clock.v1.MsgRegisterClockContract",
    toAmino: MsgRegisterClockContract.toAmino,
    fromAmino: MsgRegisterClockContract.fromAmino
  },
  "/cyber.clock.v1.MsgUnregisterClockContract": {
    aminoType: "/cyber.clock.v1.MsgUnregisterClockContract",
    toAmino: MsgUnregisterClockContract.toAmino,
    fromAmino: MsgUnregisterClockContract.fromAmino
  },
  "/cyber.clock.v1.MsgUnjailClockContract": {
    aminoType: "/cyber.clock.v1.MsgUnjailClockContract",
    toAmino: MsgUnjailClockContract.toAmino,
    fromAmino: MsgUnjailClockContract.fromAmino
  },
  "/cyber.clock.v1.MsgUpdateParams": {
    aminoType: "/cyber.clock.v1.MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};