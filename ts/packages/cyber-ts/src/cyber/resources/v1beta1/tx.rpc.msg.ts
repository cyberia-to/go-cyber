//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { MsgInvestmint, MsgInvestmintResponse, MsgUpdateParams, MsgUpdateParamsResponse } from "./tx";
export interface Msg {
  investmint(request: MsgInvestmint): Promise<MsgInvestmintResponse>;
  updateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.investmint = this.investmint.bind(this);
    this.updateParams = this.updateParams.bind(this);
  }
  investmint(request: MsgInvestmint): Promise<MsgInvestmintResponse> {
    const data = MsgInvestmint.encode(request).finish();
    const promise = this.rpc.request("cyber.resources.v1beta1.Msg", "Investmint", data);
    return promise.then(data => MsgInvestmintResponse.decode(new BinaryReader(data)));
  }
  updateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse> {
    const data = MsgUpdateParams.encode(request).finish();
    const promise = this.rpc.request("cyber.resources.v1beta1.Msg", "UpdateParams", data);
    return promise.then(data => MsgUpdateParamsResponse.decode(new BinaryReader(data)));
  }
}