import { AminoMsg } from "@cosmjs/amino";
import { AminoConverters } from "@cosmjs/stargate";
import { assertDefinedAndNotNull, isNonNullObject } from "@cosmjs/utils";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import Long from "long";

import { MsgCyberlink } from "./codec/cyber/graph/v1beta1/tx";
import {
  MsgCreateRoute,
  MsgDeleteRoute,
  MsgEditRoute,
  MsgEditRouteName,
} from "./codec/cyber/grid/v1beta1/tx";
import { MsgInvestmint } from "./codec/cyber/resources/v1beta1/tx";
import {
  MsgCreatePool,
  MsgDepositWithinBatch,
  MsgSwapWithinBatch,
  MsgWithdrawWithinBatch,
} from "./codec/tendermint/liquidity/v1beta1/tx";
import { Link } from "./types";

// Graph module

export interface AminoMsgCyberlink extends AminoMsg {
  readonly type: "cyber/MsgCyberlink";
  readonly value: {
    readonly neuron: string;
    readonly links: readonly Link[];
  };
}

export function isAminoMsgCyberlink(msg: AminoMsg): msg is AminoMsgCyberlink {
  return msg.type === "cyber/MsgCyberlink";
}

// Resources module

export interface AminoMsgInvestmint extends AminoMsg {
  readonly type: "cyber/MsgInvestmint";
  readonly value: {
    readonly neuron: string;
    readonly amount: Coin;
    readonly resource: string;
    readonly length: string;
  };
}

export function isAminoMsgInvestmint(msg: AminoMsg): msg is AminoMsgInvestmint {
  return msg.type === "cyber/MsgInvestmint";
}

// Grid module

export interface AminoMsgCreateRoute extends AminoMsg {
  readonly type: "cyber/MsgCreateRoute";
  readonly value: {
    readonly source: string;
    readonly destination: string;
    readonly name: string;
  };
}

export function isAminoMsgCreateRoute(msg: AminoMsg): msg is AminoMsgCreateRoute {
  return msg.type === "cyber/MsgCreateRoute";
}

export interface AminoMsgEditRoute extends AminoMsg {
  readonly type: "cyber/MsgEditRoute";
  readonly value: {
    readonly source: string;
    readonly destination: string;
    readonly value: Coin;
  };
}

export function isAminoMsgEditRoute(msg: AminoMsg): msg is AminoMsgEditRoute {
  return msg.type === "cyber/MsgEditRoute";
}

export interface AminoMsgDeleteRoute extends AminoMsg {
  readonly type: "cyber/MsgDeleteRoute";
  readonly value: {
    readonly source: string;
    readonly destination: string;
  };
}

export function isAminoMsgDeleteRoute(msg: AminoMsg): msg is AminoMsgDeleteRoute {
  return msg.type === "cyber/MsgDeleteRoute";
}

export interface AminoMsgEditRouteName extends AminoMsg {
  readonly type: "cyber/MsgEditRouteName";
  readonly value: {
    readonly source: string;
    readonly destination: string;
    readonly name: string;
  };
}

export function isAminoMsgEditRouteName(msg: AminoMsg): msg is AminoMsgEditRouteName {
  return msg.type === "cyber/MsgEditRouteName";
}

// Liquidity module

export interface AminoMsgCreatePool extends AminoMsg {
  readonly type: "liquidity/MsgCreatePool";
  readonly value: {
    /** Bech32 account address */
    readonly pool_creator_address: string;
    readonly pool_type_id: number;
    readonly deposit_coins: readonly Coin[];
  };
}

export function isAminoMsgCreatePool(msg: AminoMsg): msg is AminoMsgCreatePool {
  return msg.type === "liquidity/MsgCreatePool";
}

export interface AminoMsgSwapWithinBatch extends AminoMsg {
  readonly type: "liquidity/MsgSwapWithinBatch";
  readonly value: {
    /** Bech32 account address */
    readonly swap_requester_address: string;
    readonly pool_id: string;
    readonly swap_type_id: number;
    readonly offer_coin: Coin;
    readonly demand_coin_denom: string;
    readonly offer_coin_fee: Coin;
    readonly order_price: string;
  };
}

export function isAminoMsgSwapWithinBatch(msg: AminoMsg): msg is AminoMsgSwapWithinBatch {
  return msg.type === "liquidity/MsgSwapWithinBatch";
}

export interface AminoMsgDepositWithinBatch extends AminoMsg {
  readonly type: "liquidity/MsgDepositWithinBatch";
  readonly value: {
    /** Bech32 account address */
    readonly depositor_address: string;
    readonly pool_id: string;
    readonly deposit_coins: readonly Coin[];
  };
}

export function isAminoMsgDepositWithinBatch(msg: AminoMsg): msg is AminoMsgDepositWithinBatch {
  return msg.type === "liquidity/MsgDepositWithinBatch";
}

export interface AminoMsgWithdrawWithinBatch extends AminoMsg {
  readonly type: "liquidity/MsgWithdrawWithinBatch";
  readonly value: {
    /** Bech32 account address */
    readonly withdrawer_address: string;
    readonly pool_id: string;
    readonly pool_coin: Coin;
  };
}

export function isAminoMsgWithdrawWithinBatch(msg: AminoMsg): msg is AminoMsgWithdrawWithinBatch {
  return msg.type === "liquidity/MsgWithdrawWithinBatch";
}

export interface MsgSignData extends AminoMsg {
  readonly type: "sign/MsgSignData";
  readonly value: {
    /** Bech32 account address */
    signer: string;
    /** Base64 encoded data */
    data: string;
  };
}

export function isMsgSignData(msg: AminoMsg): msg is MsgSignData {
  const castedMsg = msg as MsgSignData;
  if (castedMsg.type !== "sign/MsgSignData") return false;
  if (!isNonNullObject(castedMsg.value)) return false;
  if (typeof castedMsg.value.signer !== "string") return false;
  if (typeof castedMsg.value.data !== "string") return false;
  return true;
}

function omitDefault<T extends string | number | Long>(input: T): T | undefined {
  if (typeof input === "string") {
    return input === "" ? undefined : input;
  }

  if (typeof input === "number") {
    return input === 0 ? undefined : input;
  }

  if (Long.isLong(input)) {
    return input.isZero() ? undefined : input;
  }

  throw new Error(`Got unsupported type '${typeof input}'`);
}

export function createCyberAminoConverters(): AminoConverters {
  return {
    "/cyber.graph.v1beta1.MsgCyberlink": {
      aminoType: "cyber/MsgCyberlink",
      toAmino: ({ neuron, links }: MsgCyberlink): AminoMsgCyberlink["value"] => {
        return {
          neuron: neuron,
          links: links,
        };
      },
      fromAmino: ({ neuron, links }: AminoMsgCyberlink["value"]): MsgCyberlink => {
        return {
          neuron: neuron,
          links: links as Link[], // need to refactor other ...
        };
      },
    },
    "/cyber.resources.v1beta1.MsgInvestmint": {
      aminoType: "cyber/MsgInvestmint",
      toAmino: ({ neuron, amount, resource, length }: MsgInvestmint): AminoMsgInvestmint["value"] => {
        assertDefinedAndNotNull(amount, "missing amount");
        return {
          neuron: neuron,
          amount: amount,
          resource: resource,
          length: length.toString(),
        };
      },
      fromAmino: ({ neuron, amount, resource, length }: AminoMsgInvestmint["value"]): MsgInvestmint => ({
        neuron: neuron,
        amount: amount,
        resource: resource,
        length: Long.fromString(length),
      }),
    },
    "/cyber.grid.v1beta1.MsgCreateRoute": {
      aminoType: "cyber/MsgCreateRoute",
      toAmino: ({ source, destination, name }: MsgCreateRoute): AminoMsgCreateRoute["value"] => ({
        source: source,
        destination: destination,
        name: name,
      }),
      fromAmino: ({ source, destination, name }: AminoMsgCreateRoute["value"]): MsgCreateRoute => ({
        source: source,
        destination: destination,
        name: name,
      }),
    },
    "/cyber.grid.v1beta1.MsgEditRoute": {
      aminoType: "cyber/MsgEditRoute",
      toAmino: ({ source, destination, value }: MsgEditRoute): AminoMsgEditRoute["value"] => {
        assertDefinedAndNotNull(value, "missing value");
        return {
          source: source,
          destination: destination,
          value: value,
        };
      },
      fromAmino: ({ source, destination, value }: AminoMsgEditRoute["value"]): MsgEditRoute => ({
        source: source,
        destination: destination,
        value: value,
      }),
    },
    "/cyber.grid.v1beta1.MsgDeleteRoute": {
      aminoType: "cyber/MsgDeleteRoute",
      toAmino: ({ source, destination }: MsgDeleteRoute): AminoMsgDeleteRoute["value"] => ({
        source: source,
        destination: destination,
      }),
      fromAmino: ({ source, destination }: AminoMsgDeleteRoute["value"]): MsgDeleteRoute => ({
        source: source,
        destination: destination,
      }),
    },
    "/cyber.grid.v1beta1.MsgEditRouteName": {
      aminoType: "cyber/MsgEditRouteName",
      toAmino: ({ source, destination, name }: MsgEditRouteName): AminoMsgEditRouteName["value"] => ({
        source: source,
        destination: destination,
        name: name,
      }),
      fromAmino: ({ source, destination, name }: AminoMsgEditRouteName["value"]): MsgEditRouteName => ({
        source: source,
        destination: destination,
        name: name,
      }),
    },
    "/tendermint.liquidity.v1beta1.MsgCreatePool": {
      aminoType: "liquidity/MsgCreatePool",
      toAmino: ({
        poolCreatorAddress,
        poolTypeId,
        depositCoins,
      }: MsgCreatePool): AminoMsgCreatePool["value"] => ({
        pool_creator_address: poolCreatorAddress,
        pool_type_id: poolTypeId,
        deposit_coins: [...depositCoins],
      }),
      fromAmino: ({
        pool_creator_address,
        pool_type_id,
        deposit_coins,
      }: AminoMsgCreatePool["value"]): MsgCreatePool => ({
        poolCreatorAddress: pool_creator_address,
        poolTypeId: pool_type_id,
        depositCoins: [...deposit_coins],
      }),
    },
    "/tendermint.liquidity.v1beta1.MsgSwapWithinBatch": {
      aminoType: "liquidity/MsgSwapWithinBatch",
      toAmino: ({
        swapRequesterAddress,
        poolId,
        swapTypeId,
        offerCoin,
        demandCoinDenom,
        offerCoinFee,
        orderPrice,
      }: MsgSwapWithinBatch): AminoMsgSwapWithinBatch["value"] => {
        const order_price = orderPrice.split("");
        while (order_price.length < 19) {
          order_price.unshift("0");
        }
        order_price.splice(order_price.length - 18, 0, ".");
        return {
          swap_requester_address: swapRequesterAddress,
          pool_id: "" + omitDefault(poolId)?.toString(),
          swap_type_id: swapTypeId,
          offer_coin: offerCoin!,
          demand_coin_denom: demandCoinDenom,
          offer_coin_fee: offerCoinFee!,
          order_price: order_price.join(""),
        };
      },
      fromAmino: ({
        swap_requester_address,
        pool_id,
        swap_type_id,
        offer_coin,
        demand_coin_denom,
        offer_coin_fee,
        order_price,
      }: AminoMsgSwapWithinBatch["value"]): MsgSwapWithinBatch => {
        return {
          swapRequesterAddress: swap_requester_address,
          poolId: parseInt(pool_id) || 0,
          swapTypeId: swap_type_id,
          offerCoin: offer_coin,
          demandCoinDenom: demand_coin_denom,
          offerCoinFee: offer_coin_fee,
          orderPrice: order_price.replace(".", "").replace(/^0+/, ""),
        };
      },
    },
    "/tendermint.liquidity.v1beta1.MsgDepositWithinBatch": {
      aminoType: "liquidity/MsgDepositWithinBatch",
      toAmino: ({
        depositorAddress,
        poolId,
        depositCoins,
      }: MsgDepositWithinBatch): AminoMsgDepositWithinBatch["value"] => ({
        depositor_address: depositorAddress,
        pool_id: "" + omitDefault(poolId)?.toString(),
        deposit_coins: [...depositCoins],
      }),
      fromAmino: ({
        depositor_address,
        pool_id,
        deposit_coins,
      }: AminoMsgDepositWithinBatch["value"]): MsgDepositWithinBatch => ({
        depositorAddress: depositor_address,
        poolId: parseInt(pool_id) || 0,
        depositCoins: [...deposit_coins],
      }),
    },
    "/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch": {
      aminoType: "liquidity/MsgWithdrawWithinBatch",
      toAmino: ({
        withdrawerAddress,
        poolId,
        poolCoin,
      }: MsgWithdrawWithinBatch): AminoMsgWithdrawWithinBatch["value"] => ({
        withdrawer_address: withdrawerAddress,
        pool_id: "" + omitDefault(poolId)?.toString(),
        pool_coin: poolCoin!,
      }),
      fromAmino: ({
        withdrawer_address,
        pool_id,
        pool_coin,
      }: AminoMsgWithdrawWithinBatch["value"]): MsgWithdrawWithinBatch => ({
        withdrawerAddress: withdrawer_address,
        poolId: parseInt(pool_id) || 0,
        poolCoin: pool_coin,
      }),
    },
  };
}
