//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { MsgRegisterClockContract, MsgRegisterClockContractResponse, MsgUnregisterClockContract, MsgUnregisterClockContractResponse, MsgUnjailClockContract, MsgUnjailClockContractResponse, MsgUpdateParams, MsgUpdateParamsResponse } from "./tx";
/** Msg defines the Msg service. */
export interface Msg {
  /**
   * RegisterClockContract defines the endpoint for
   * registering a new clock contract.
   */
  registerClockContract(request: MsgRegisterClockContract): Promise<MsgRegisterClockContractResponse>;
  /**
   * UnregisterClockContract defines the endpoint for
   * unregistering a clock contract.
   */
  unregisterClockContract(request: MsgUnregisterClockContract): Promise<MsgUnregisterClockContractResponse>;
  /**
   * UnjailClockContract defines the endpoint for
   * unjailing a clock contract.
   */
  unjailClockContract(request: MsgUnjailClockContract): Promise<MsgUnjailClockContractResponse>;
  /**
   * UpdateParams defines a governance operation for updating the x/clock module
   * parameters. The authority is hard-coded to the x/gov module account.
   * 
   * Since: cosmos-sdk 0.47
   */
  updateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.registerClockContract = this.registerClockContract.bind(this);
    this.unregisterClockContract = this.unregisterClockContract.bind(this);
    this.unjailClockContract = this.unjailClockContract.bind(this);
    this.updateParams = this.updateParams.bind(this);
  }
  registerClockContract(request: MsgRegisterClockContract): Promise<MsgRegisterClockContractResponse> {
    const data = MsgRegisterClockContract.encode(request).finish();
    const promise = this.rpc.request("cyber.clock.v1.Msg", "RegisterClockContract", data);
    return promise.then(data => MsgRegisterClockContractResponse.decode(new BinaryReader(data)));
  }
  unregisterClockContract(request: MsgUnregisterClockContract): Promise<MsgUnregisterClockContractResponse> {
    const data = MsgUnregisterClockContract.encode(request).finish();
    const promise = this.rpc.request("cyber.clock.v1.Msg", "UnregisterClockContract", data);
    return promise.then(data => MsgUnregisterClockContractResponse.decode(new BinaryReader(data)));
  }
  unjailClockContract(request: MsgUnjailClockContract): Promise<MsgUnjailClockContractResponse> {
    const data = MsgUnjailClockContract.encode(request).finish();
    const promise = this.rpc.request("cyber.clock.v1.Msg", "UnjailClockContract", data);
    return promise.then(data => MsgUnjailClockContractResponse.decode(new BinaryReader(data)));
  }
  updateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse> {
    const data = MsgUpdateParams.encode(request).finish();
    const promise = this.rpc.request("cyber.clock.v1.Msg", "UpdateParams", data);
    return promise.then(data => MsgUpdateParamsResponse.decode(new BinaryReader(data)));
  }
}