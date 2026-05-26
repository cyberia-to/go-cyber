//@ts-nocheck
import { BinaryReader, BinaryWriter } from "../../../binary";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { GlobalDecoderRegistry } from "../../../registry";
/**
 * This object is used to store the contract address and the
 * jail status of the contract.
 */
export interface ClockContract {
  /** The address of the contract. */
  contractAddress: string;
  /** The jail status of the contract. */
  isJailed: boolean;
}
export interface ClockContractProtoMsg {
  typeUrl: "/cyber.clock.v1.ClockContract";
  value: Uint8Array;
}
/**
 * This object is used to store the contract address and the
 * jail status of the contract.
 */
export interface ClockContractAmino {
  /** The address of the contract. */
  contract_address?: string;
  /** The jail status of the contract. */
  is_jailed?: boolean;
}
export interface ClockContractAminoMsg {
  type: "/cyber.clock.v1.ClockContract";
  value: ClockContractAmino;
}
/**
 * This object is used to store the contract address and the
 * jail status of the contract.
 */
export interface ClockContractSDKType {
  contract_address: string;
  is_jailed: boolean;
}
function createBaseClockContract(): ClockContract {
  return {
    contractAddress: "",
    isJailed: false
  };
}
export const ClockContract = {
  typeUrl: "/cyber.clock.v1.ClockContract",
  is(o: any): o is ClockContract {
    return o && (o.$typeUrl === ClockContract.typeUrl || typeof o.contractAddress === "string" && typeof o.isJailed === "boolean");
  },
  isSDK(o: any): o is ClockContractSDKType {
    return o && (o.$typeUrl === ClockContract.typeUrl || typeof o.contract_address === "string" && typeof o.is_jailed === "boolean");
  },
  isAmino(o: any): o is ClockContractAmino {
    return o && (o.$typeUrl === ClockContract.typeUrl || typeof o.contract_address === "string" && typeof o.is_jailed === "boolean");
  },
  encode(message: ClockContract, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.contractAddress !== "") {
      writer.uint32(10).string(message.contractAddress);
    }
    if (message.isJailed === true) {
      writer.uint32(16).bool(message.isJailed);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ClockContract {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClockContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contractAddress = reader.string();
          break;
        case 2:
          message.isJailed = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ClockContract {
    return {
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
      isJailed: isSet(object.isJailed) ? Boolean(object.isJailed) : false
    };
  },
  toJSON(message: ClockContract): JsonSafe<ClockContract> {
    const obj: any = {};
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    message.isJailed !== undefined && (obj.isJailed = message.isJailed);
    return obj;
  },
  fromPartial(object: Partial<ClockContract>): ClockContract {
    const message = createBaseClockContract();
    message.contractAddress = object.contractAddress ?? "";
    message.isJailed = object.isJailed ?? false;
    return message;
  },
  fromAmino(object: ClockContractAmino): ClockContract {
    const message = createBaseClockContract();
    if (object.contract_address !== undefined && object.contract_address !== null) {
      message.contractAddress = object.contract_address;
    }
    if (object.is_jailed !== undefined && object.is_jailed !== null) {
      message.isJailed = object.is_jailed;
    }
    return message;
  },
  toAmino(message: ClockContract): ClockContractAmino {
    const obj: any = {};
    obj.contract_address = message.contractAddress === "" ? undefined : message.contractAddress;
    obj.is_jailed = message.isJailed === false ? undefined : message.isJailed;
    return obj;
  },
  fromAminoMsg(object: ClockContractAminoMsg): ClockContract {
    return ClockContract.fromAmino(object.value);
  },
  fromProtoMsg(message: ClockContractProtoMsg): ClockContract {
    return ClockContract.decode(message.value);
  },
  toProto(message: ClockContract): Uint8Array {
    return ClockContract.encode(message).finish();
  },
  toProtoMsg(message: ClockContract): ClockContractProtoMsg {
    return {
      typeUrl: "/cyber.clock.v1.ClockContract",
      value: ClockContract.encode(message).finish()
    };
  }
};
GlobalDecoderRegistry.register(ClockContract.typeUrl, ClockContract);