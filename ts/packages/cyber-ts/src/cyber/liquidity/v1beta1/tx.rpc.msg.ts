//@ts-nocheck
import { Rpc } from "../../../helpers";
import { BinaryReader } from "../../../binary";
import { MsgCreatePool, MsgCreatePoolResponse, MsgDepositWithinBatch, MsgDepositWithinBatchResponse, MsgWithdrawWithinBatch, MsgWithdrawWithinBatchResponse, MsgSwapWithinBatch, MsgSwapWithinBatchResponse } from "./tx";
/** Msg defines the liquidity Msg service. */
export interface Msg {
  /** Submit a create liquidity pool message. */
  createPool(request: MsgCreatePool): Promise<MsgCreatePoolResponse>;
  /** Submit a deposit to the liquidity pool batch. */
  depositWithinBatch(request: MsgDepositWithinBatch): Promise<MsgDepositWithinBatchResponse>;
  /** Submit a withdraw from the liquidity pool batch. */
  withdrawWithinBatch(request: MsgWithdrawWithinBatch): Promise<MsgWithdrawWithinBatchResponse>;
  /** Submit a swap to the liquidity pool batch. */
  swap(request: MsgSwapWithinBatch): Promise<MsgSwapWithinBatchResponse>;
}
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.createPool = this.createPool.bind(this);
    this.depositWithinBatch = this.depositWithinBatch.bind(this);
    this.withdrawWithinBatch = this.withdrawWithinBatch.bind(this);
    this.swap = this.swap.bind(this);
  }
  createPool(request: MsgCreatePool): Promise<MsgCreatePoolResponse> {
    const data = MsgCreatePool.encode(request).finish();
    const promise = this.rpc.request("cyber.liquidity.v1beta1.Msg", "CreatePool", data);
    return promise.then(data => MsgCreatePoolResponse.decode(new BinaryReader(data)));
  }
  depositWithinBatch(request: MsgDepositWithinBatch): Promise<MsgDepositWithinBatchResponse> {
    const data = MsgDepositWithinBatch.encode(request).finish();
    const promise = this.rpc.request("cyber.liquidity.v1beta1.Msg", "DepositWithinBatch", data);
    return promise.then(data => MsgDepositWithinBatchResponse.decode(new BinaryReader(data)));
  }
  withdrawWithinBatch(request: MsgWithdrawWithinBatch): Promise<MsgWithdrawWithinBatchResponse> {
    const data = MsgWithdrawWithinBatch.encode(request).finish();
    const promise = this.rpc.request("cyber.liquidity.v1beta1.Msg", "WithdrawWithinBatch", data);
    return promise.then(data => MsgWithdrawWithinBatchResponse.decode(new BinaryReader(data)));
  }
  swap(request: MsgSwapWithinBatch): Promise<MsgSwapWithinBatchResponse> {
    const data = MsgSwapWithinBatch.encode(request).finish();
    const promise = this.rpc.request("cyber.liquidity.v1beta1.Msg", "Swap", data);
    return promise.then(data => MsgSwapWithinBatchResponse.decode(new BinaryReader(data)));
  }
}