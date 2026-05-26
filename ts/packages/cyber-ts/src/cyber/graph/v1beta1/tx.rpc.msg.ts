//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { MsgCyberlink, MsgCyberlinkResponse } from "./tx";
export interface Msg {
  cyberlink(request: MsgCyberlink): Promise<MsgCyberlinkResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.cyberlink = this.cyberlink.bind(this);
  }
  cyberlink(request: MsgCyberlink): Promise<MsgCyberlinkResponse> {
    const data = MsgCyberlink.encode(request).finish();
    const promise = this.rpc.request("cyber.graph.v1beta1.Msg", "Cyberlink", data);
    return promise.then(data => MsgCyberlinkResponse.decode(new BinaryReader(data)));
  }
}