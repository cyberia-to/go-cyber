/* eslint-disable */
import { Coin } from "../../../cosmos/base/v1beta1/coin";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "cyber.resources.v1beta1";

export interface MsgInvestmint {
  neuron: string;
  amount?: Coin;
  resource: string;
  length: Long;
}

export interface MsgInvestmintResponse {}

function createBaseMsgInvestmint(): MsgInvestmint {
  return { neuron: "", amount: undefined, resource: "", length: Long.UZERO };
}

export const MsgInvestmint = {
  encode(message: MsgInvestmint, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.neuron !== "") {
      writer.uint32(10).string(message.neuron);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(18).fork()).ldelim();
    }
    if (message.resource !== "") {
      writer.uint32(26).string(message.resource);
    }
    if (!message.length.isZero()) {
      writer.uint32(32).uint64(message.length);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgInvestmint {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgInvestmint();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.neuron = reader.string();
          break;
        case 2:
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        case 3:
          message.resource = reader.string();
          break;
        case 4:
          message.length = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgInvestmint {
    return {
      neuron: isSet(object.neuron) ? String(object.neuron) : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      resource: isSet(object.resource) ? String(object.resource) : "",
      length: isSet(object.length) ? Long.fromValue(object.length) : Long.UZERO,
    };
  },

  toJSON(message: MsgInvestmint): unknown {
    const obj: any = {};
    message.neuron !== undefined && (obj.neuron = message.neuron);
    message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    message.resource !== undefined && (obj.resource = message.resource);
    message.length !== undefined && (obj.length = (message.length || Long.UZERO).toString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgInvestmint>, I>>(object: I): MsgInvestmint {
    const message = createBaseMsgInvestmint();
    message.neuron = object.neuron ?? "";
    message.amount =
      object.amount !== undefined && object.amount !== null ? Coin.fromPartial(object.amount) : undefined;
    message.resource = object.resource ?? "";
    message.length =
      object.length !== undefined && object.length !== null ? Long.fromValue(object.length) : Long.UZERO;
    return message;
  },
};

function createBaseMsgInvestmintResponse(): MsgInvestmintResponse {
  return {};
}

export const MsgInvestmintResponse = {
  encode(_: MsgInvestmintResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgInvestmintResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgInvestmintResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgInvestmintResponse {
    return {};
  },

  toJSON(_: MsgInvestmintResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgInvestmintResponse>, I>>(_: I): MsgInvestmintResponse {
    const message = createBaseMsgInvestmintResponse();
    return message;
  },
};

export interface Msg {
  Investmint(request: MsgInvestmint): Promise<MsgInvestmintResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Investmint = this.Investmint.bind(this);
  }
  Investmint(request: MsgInvestmint): Promise<MsgInvestmintResponse> {
    const data = MsgInvestmint.encode(request).finish();
    const promise = this.rpc.request("cyber.resources.v1beta1.Msg", "Investmint", data);
    return promise.then((data) => MsgInvestmintResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
