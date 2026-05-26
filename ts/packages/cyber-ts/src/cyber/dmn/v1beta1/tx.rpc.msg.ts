//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { MsgCreateThought, MsgCreateThoughtResponse, MsgForgetThought, MsgForgetThoughtResponse, MsgChangeThoughtParticle, MsgChangeThoughtParticleResponse, MsgChangeThoughtName, MsgChangeThoughtNameResponse, MsgChangeThoughtInput, MsgChangeThoughtInputResponse, MsgChangeThoughtGasPrice, MsgChangeThoughtGasPriceResponse, MsgChangeThoughtPeriod, MsgChangeThoughtPeriodResponse, MsgChangeThoughtBlock, MsgChangeThoughtBlockResponse, MsgUpdateParams, MsgUpdateParamsResponse } from "./tx";
export interface Msg {
  createThought(request: MsgCreateThought): Promise<MsgCreateThoughtResponse>;
  forgetThought(request: MsgForgetThought): Promise<MsgForgetThoughtResponse>;
  changeThoughtParticle(request: MsgChangeThoughtParticle): Promise<MsgChangeThoughtParticleResponse>;
  changeThoughtName(request: MsgChangeThoughtName): Promise<MsgChangeThoughtNameResponse>;
  changeThoughtInput(request: MsgChangeThoughtInput): Promise<MsgChangeThoughtInputResponse>;
  changeThoughtGasPrice(request: MsgChangeThoughtGasPrice): Promise<MsgChangeThoughtGasPriceResponse>;
  changeThoughtPeriod(request: MsgChangeThoughtPeriod): Promise<MsgChangeThoughtPeriodResponse>;
  changeThoughtBlock(request: MsgChangeThoughtBlock): Promise<MsgChangeThoughtBlockResponse>;
  updateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.createThought = this.createThought.bind(this);
    this.forgetThought = this.forgetThought.bind(this);
    this.changeThoughtParticle = this.changeThoughtParticle.bind(this);
    this.changeThoughtName = this.changeThoughtName.bind(this);
    this.changeThoughtInput = this.changeThoughtInput.bind(this);
    this.changeThoughtGasPrice = this.changeThoughtGasPrice.bind(this);
    this.changeThoughtPeriod = this.changeThoughtPeriod.bind(this);
    this.changeThoughtBlock = this.changeThoughtBlock.bind(this);
    this.updateParams = this.updateParams.bind(this);
  }
  createThought(request: MsgCreateThought): Promise<MsgCreateThoughtResponse> {
    const data = MsgCreateThought.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Msg", "CreateThought", data);
    return promise.then(data => MsgCreateThoughtResponse.decode(new BinaryReader(data)));
  }
  forgetThought(request: MsgForgetThought): Promise<MsgForgetThoughtResponse> {
    const data = MsgForgetThought.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Msg", "ForgetThought", data);
    return promise.then(data => MsgForgetThoughtResponse.decode(new BinaryReader(data)));
  }
  changeThoughtParticle(request: MsgChangeThoughtParticle): Promise<MsgChangeThoughtParticleResponse> {
    const data = MsgChangeThoughtParticle.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Msg", "ChangeThoughtParticle", data);
    return promise.then(data => MsgChangeThoughtParticleResponse.decode(new BinaryReader(data)));
  }
  changeThoughtName(request: MsgChangeThoughtName): Promise<MsgChangeThoughtNameResponse> {
    const data = MsgChangeThoughtName.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Msg", "ChangeThoughtName", data);
    return promise.then(data => MsgChangeThoughtNameResponse.decode(new BinaryReader(data)));
  }
  changeThoughtInput(request: MsgChangeThoughtInput): Promise<MsgChangeThoughtInputResponse> {
    const data = MsgChangeThoughtInput.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Msg", "ChangeThoughtInput", data);
    return promise.then(data => MsgChangeThoughtInputResponse.decode(new BinaryReader(data)));
  }
  changeThoughtGasPrice(request: MsgChangeThoughtGasPrice): Promise<MsgChangeThoughtGasPriceResponse> {
    const data = MsgChangeThoughtGasPrice.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Msg", "ChangeThoughtGasPrice", data);
    return promise.then(data => MsgChangeThoughtGasPriceResponse.decode(new BinaryReader(data)));
  }
  changeThoughtPeriod(request: MsgChangeThoughtPeriod): Promise<MsgChangeThoughtPeriodResponse> {
    const data = MsgChangeThoughtPeriod.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Msg", "ChangeThoughtPeriod", data);
    return promise.then(data => MsgChangeThoughtPeriodResponse.decode(new BinaryReader(data)));
  }
  changeThoughtBlock(request: MsgChangeThoughtBlock): Promise<MsgChangeThoughtBlockResponse> {
    const data = MsgChangeThoughtBlock.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Msg", "ChangeThoughtBlock", data);
    return promise.then(data => MsgChangeThoughtBlockResponse.decode(new BinaryReader(data)));
  }
  updateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse> {
    const data = MsgUpdateParams.encode(request).finish();
    const promise = this.rpc.request("cyber.dmn.v1beta1.Msg", "UpdateParams", data);
    return promise.then(data => MsgUpdateParamsResponse.decode(new BinaryReader(data)));
  }
}