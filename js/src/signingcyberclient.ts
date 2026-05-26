import {
  AminoMsg,
  encodeSecp256k1Pubkey,
  isSecp256k1Pubkey,
  makeSignDoc as makeSignDocAmino,
  makeStdTx,
  rawSecp256k1PubkeyToRawAddress,
  serializeSignDoc,
  StdTx,
} from "@cosmjs/amino";
import { OfflineAminoSigner } from "@cosmjs/amino";
import {
  createWasmAminoConverters,
  InstantiateOptions,
  MsgClearAdminEncodeObject,
  MsgExecuteContractEncodeObject,
  MsgInstantiateContractEncodeObject,
  MsgMigrateContractEncodeObject,
  MsgStoreCodeEncodeObject,
  MsgUpdateAdminEncodeObject,
} from "@cosmjs/cosmwasm-stargate";
import { Secp256k1, Secp256k1Signature, sha256 } from "@cosmjs/crypto";
import { fromBase64, fromBech32, toBase64, toUtf8 } from "@cosmjs/encoding";
import { Int53, Uint53 } from "@cosmjs/math";
import {
  AccountData,
  EncodeObject,
  encodePubkey,
  GeneratedType,
  makeAuthInfoBytes,
  makeSignDoc,
  OfflineDirectSigner,
  Registry,
  TxBodyEncodeObject,
} from "@cosmjs/proto-signing";
import {
  AminoConverters,
  AminoTypes,
  Coin,
  createAuthzAminoConverters,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createGovAminoConverters,
  createIbcAminoConverters,
  createStakingAminoConverters,
  defaultRegistryTypes,
  DeliverTxResponse,
  MsgDelegateEncodeObject,
  MsgSendEncodeObject,
  MsgTransferEncodeObject,
  MsgUndelegateEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
  SignerData,
  StdFee,
} from "@cosmjs/stargate";
import { longify } from "@cosmjs/stargate/build/queryclient";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { arrayContentEquals, assert, assertDefined } from "@cosmjs/utils";
import { Grant } from "cosmjs-types/cosmos/authz/v1beta1/authz";
import { MsgExec, MsgGrant, MsgRevoke } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { TextProposal, VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { MsgDeposit, MsgSubmitProposal, MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { MsgBeginRedelegate, MsgDelegate, MsgUndelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {
  MsgClearAdmin,
  MsgExecuteContract,
  MsgInstantiateContract,
  MsgMigrateContract,
  MsgStoreCode,
  MsgUpdateAdmin,
} from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { Any } from "cosmjs-types/google/protobuf/any";
import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";
import { Height } from "cosmjs-types/ibc/core/client/v1/client";
import equals from "fast-deep-equal";
import Long from "long";
import pako from "pako";

import { createCyberAminoConverters, isMsgSignData, MsgSignData } from "./aminomsgs";
import { MsgCyberlink } from "./codec/cyber/graph/v1beta1/tx";
// import { Link } from "./codec/cyber/graph/v1beta1/types";
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
import { CyberClient } from "./cyberclient";
import {
  MsgBeginRedelegateEncodeObject,
  MsgCreatePoolEncodeObject,
  MsgCreateRouteEncodeObject,
  MsgCyberlinkEncodeObject,
  MsgDeleteRouteEncodeObject,
  MsgDepositEncodeObject,
  MsgDepositWithinBatchEncodeObject,
  MsgEditRouteEncodeObject,
  MsgEditRouteNameEncodeObject,
  MsgExecEncodeObject,
  MsgGrantEncodeObject,
  MsgInvestmintEncodeObject,
  MsgRevokeEncodeObject,
  MsgSubmitProposalEncodeObject,
  MsgSwapWithinBatchEncodeObject,
  MsgVoteEncodeObject,
  MsgWithdrawWithinBatchEncodeObject,
} from "./encodeobjects";
import {
  CosmosRegistryTypes,
  CosmwasmRegistryTypes,
  CyberRegistryTypes,
  TendermintRegistryTypes,
} from "./registryTypes";
import { renderItems } from "./renderItems";
import { Link } from "./types";

export function link(from: string, to: string): Link {
  return { from: from, to: to };
}

export function links(from: string, to: string): Link[] {
  return [link(from, to)];
}

export function chain(particles: string[]): Link[] {
  const chainResult = [];
  for (let i = 0; i < particles.length - 1; i++) {
    chainResult.push({
      from: particles[i],
      to: particles[i + 1],
    });
  }
  return chainResult;
}

// Experimental for remote dapps with cyb's signer integration
export type OfflineSigner = OfflineAminoSigner | OfflineDirectSigner | OfflineDappSigner;

export function isOfflineAminoSigner(signer: OfflineSigner): signer is OfflineAminoSigner {
  return (signer as OfflineAminoSigner).signAmino !== undefined;
}
export function isOfflineDirectSigner(signer: OfflineSigner): signer is OfflineDirectSigner {
  return (signer as OfflineDirectSigner).signDirect !== undefined;
}
export function isOfflineDappSigner(signer: OfflineSigner): signer is OfflineDappSigner {
  return (signer as OfflineDappSigner).getAccounts !== undefined;
}

export interface OfflineDappSigner {
  readonly getAccounts: () => Promise<readonly AccountData[]>;
}
export class OfflineDappWallet implements OfflineDappSigner {
  // export class  OfflineDappSigner {
  public async getAccounts(): Promise<readonly AccountData[]> {
    return [
      {
        algo: "secp256k1",
        address: "",
        pubkey: new Uint8Array(),
      },
    ];
  }
}

export const cyberRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
  [CyberRegistryTypes.MsgCyberlink, MsgCyberlink],
  [CyberRegistryTypes.MsgInvestmint, MsgInvestmint],
  [CyberRegistryTypes.MsgCreateRoute, MsgCreateRoute],
  [CyberRegistryTypes.MsgEditRoute, MsgEditRoute],
  [CyberRegistryTypes.MsgEditRouteName, MsgEditRouteName],
  [CyberRegistryTypes.MsgDeleteRoute, MsgDeleteRoute],

  [CosmosRegistryTypes.MsgDeposit, MsgDeposit],
  [CosmosRegistryTypes.MsgExec, MsgExec],
  [CosmosRegistryTypes.MsgGrant, MsgGrant],
  [CosmosRegistryTypes.MsgRevoke, MsgRevoke],

  [CosmwasmRegistryTypes.MsgClearAdmin, MsgClearAdmin],
  [CosmwasmRegistryTypes.MsgMigrateContract, MsgMigrateContract],
  [CosmwasmRegistryTypes.MsgUpdateAdmin, MsgUpdateAdmin],
  [CosmwasmRegistryTypes.MsgExecuteContract, MsgExecuteContract],
  [CosmwasmRegistryTypes.MsgInstantiateContract, MsgInstantiateContract],
  [CosmwasmRegistryTypes.MsgStoreCode, MsgStoreCode],

  [TendermintRegistryTypes.MsgSwapWithinBatch, MsgSwapWithinBatch],
  [TendermintRegistryTypes.MsgDepositWithinBatch, MsgDepositWithinBatch],
  [TendermintRegistryTypes.MsgWithdrawWithinBatch, MsgWithdrawWithinBatch],
  [TendermintRegistryTypes.MsgCreatePool, MsgCreatePool],
];

function createDefaultRegistry(): Registry {
  return new Registry([...defaultRegistryTypes, ...cyberRegistryTypes]);
}

export interface SigningCyberClientOptions {
  readonly registry?: Registry;
  readonly aminoTypes?: AminoTypes;
  readonly broadcastTimeoutMs?: number;
  readonly broadcastPollIntervalMs?: number;
}

function createAminoTypes(): AminoConverters {
  return {
    ...createCyberAminoConverters(),
    ...createWasmAminoConverters(),
    ...createBankAminoConverters(),
    ...createDistributionAminoConverters(),
    ...createStakingAminoConverters(),
    ...createGovAminoConverters(),
    ...createIbcAminoConverters(),
    ...createAuthzAminoConverters(),
  };
}

export class SigningCyberClient extends CyberClient {
  public readonly registry: Registry;
  public readonly broadcastTimeoutMs: number | undefined;
  public readonly broadcastPollIntervalMs: number | undefined;

  private readonly signer: OfflineSigner;
  private readonly aminoTypes: AminoTypes;

  public static async connectWithSigner(
    endpoint: string,
    signer: OfflineSigner,
    options: SigningCyberClientOptions = {},
  ): Promise<SigningCyberClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new SigningCyberClient(tmClient, signer, options);
  }

  /**
   * Creates a client in offline mode.
   *
   * This should only be used in niche cases where you know exactly what you're doing,
   * e.g. when building an offline signing application.
   *
   * When you try to use online functionality with such a signer, an
   * exception will be raised.
   */
  public static async offline(
    signer: OfflineSigner,
    options: SigningCyberClientOptions = {},
  ): Promise<SigningCyberClient> {
    return new SigningCyberClient(undefined, signer, options);
  }

  public render(): string {
    const arr: Array<Record<string, any>> = [];

    renderItems.forEach((i) => {
      arr.push({
        [i.typeUrl.toString()]: {
          proto: {
            type: i.typeUrl,
            value: i.value.fromPartial(i.data),
          },
          amino: {
            type: this.aminoTypes.toAmino({ typeUrl: i.typeUrl, value: i.value.fromPartial(i.data) }).type,
            value: this.aminoTypes.toAmino({ typeUrl: i.typeUrl, value: i.value.fromPartial(i.data) }).value,
          },
        },
      });
    });

    return JSON.stringify(arr);
  }

  public static async remotedapp(
    signer: OfflineSigner,
    options: SigningCyberClientOptions = {},
  ): Promise<SigningCyberClient> {
    return new SigningCyberClient(undefined, signer, options);
  }

  protected constructor(
    tmClient: Tendermint34Client | undefined,
    signer: OfflineSigner,
    options: SigningCyberClientOptions,
  ) {
    super(tmClient);
    const { registry = createDefaultRegistry(), aminoTypes = new AminoTypes(createAminoTypes()) } = options;
    this.registry = registry;
    this.aminoTypes = aminoTypes;
    this.signer = signer;
  }

  public async simulate(
    signerAddress: string,
    messages: readonly EncodeObject[],
    memo: string | undefined,
  ): Promise<number> {
    const anyMsgs = messages.map((m) => this.registry.encodeAsAny(m));
    const accountFromSigner = (await this.signer.getAccounts()).find(
      (account) => account.address === signerAddress,
    );
    if (!accountFromSigner) {
      throw new Error("Failed to retrieve account from signer");
    }
    const pubkey = encodeSecp256k1Pubkey(accountFromSigner.pubkey);
    const { sequence } = await this.getSequence(signerAddress);
    const { gasInfo } = await this.forceGetQueryClient().tx.simulate(anyMsgs, memo, pubkey, sequence);
    assertDefined(gasInfo);
    return Uint53.fromString(gasInfo.gasUsed.toString()).toNumber();
  }

  // Graph module

  public async cyberlink(
    neuron: string,
    from: string,
    to: string,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const cyberlinkMsg: MsgCyberlinkEncodeObject = {
      typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
      value: MsgCyberlink.fromPartial({
        neuron: neuron,
        links: links(from, to),
      }),
    };

    return this.signAndBroadcast(neuron, [cyberlinkMsg], fee, memo);
  }

  public async motif(
    neuron: string,
    linkchain: Link[],
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const cyberlinkMsg: MsgCyberlinkEncodeObject = {
      typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
      value: MsgCyberlink.fromPartial({
        neuron: neuron,
        links: linkchain,
      }),
    };

    return this.signAndBroadcast(neuron, [cyberlinkMsg], fee, memo);
  }

  public async linkchain(
    neuron: string,
    particles: string[],
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const cyberlinkMsg: MsgCyberlinkEncodeObject = {
      typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
      value: MsgCyberlink.fromPartial({
        neuron: neuron,
        links: chain(particles),
      }),
    };

    return this.signAndBroadcast(neuron, [cyberlinkMsg], fee, memo);
  }

  // Resources module

  public async investmint(
    senderAddress: string,
    amount: Coin,
    resource: string,
    length: number,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const investmintMsg: MsgInvestmintEncodeObject = {
      typeUrl: "/cyber.resources.v1beta1.MsgInvestmint",
      value: MsgInvestmint.fromPartial({
        neuron: senderAddress,
        amount: amount,
        resource: resource,
        length: Long.fromString(new Uint53(length).toString()),
      }),
    };
    return this.signAndBroadcast(senderAddress, [investmintMsg], fee, memo);
  }

  // Energy module

  public async createEnergyRoute(
    senderAddress: string,
    destination: string,
    name: string,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const createEnergyRouteMsg: MsgCreateRouteEncodeObject = {
      typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute",
      value: MsgCreateRoute.fromPartial({
        source: senderAddress,
        destination: destination,
        name: name,
      }),
    };
    return this.signAndBroadcast(senderAddress, [createEnergyRouteMsg], fee, memo);
  }

  public async editEnergyRoute(
    senderAddress: string,
    destination: string,
    value: Coin,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const editEnergyRouteMsg: MsgEditRouteEncodeObject = {
      typeUrl: "/cyber.grid.v1beta1.MsgEditRoute",
      value: MsgEditRoute.fromPartial({
        source: senderAddress,
        destination: destination,
        value: value,
      }),
    };
    return this.signAndBroadcast(senderAddress, [editEnergyRouteMsg], fee, memo);
  }

  public async deleteEnergyRoute(
    senderAddress: string,
    destination: string,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const deleteEnergyRouteMsg: MsgDeleteRouteEncodeObject = {
      typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute",
      value: MsgDeleteRoute.fromPartial({
        source: senderAddress,
        destination: destination,
      }),
    };
    return this.signAndBroadcast(senderAddress, [deleteEnergyRouteMsg], fee, memo);
  }

  public async editEnergyRouteName(
    senderAddress: string,
    destination: string,
    name: string,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const editEnergyRouteNameMsg: MsgEditRouteNameEncodeObject = {
      typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName",
      value: MsgEditRouteName.fromPartial({
        source: senderAddress,
        destination: destination,
        name: name,
      }),
    };

    return this.signAndBroadcast(senderAddress, [editEnergyRouteNameMsg], fee, memo);
  }

  // Wasm module

  /** Uploads code and returns a receipt, including the code ID */
  public async upload(
    senderAddress: string,
    wasmCode: Uint8Array,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const compressed = pako.gzip(wasmCode, { level: 9 });
    const storeCodeMsg: MsgStoreCodeEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
      value: MsgStoreCode.fromPartial({
        sender: senderAddress,
        wasmByteCode: compressed,
      }),
    };

    return this.signAndBroadcast(senderAddress, [storeCodeMsg], fee, memo);
  }

  public async instantiate(
    senderAddress: string,
    codeId: number,
    msg: Record<string, unknown>,
    label: string,
    fee: StdFee | "auto" | number,
    options: InstantiateOptions = {},
  ): Promise<DeliverTxResponse | string[]> {
    const instantiateContractMsg: MsgInstantiateContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
      value: MsgInstantiateContract.fromPartial({
        sender: senderAddress,
        codeId: Long.fromString(new Uint53(codeId).toString()),
        label: label,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [...(options.funds || [])],
        admin: options.admin,
      }),
    };
    return this.signAndBroadcast(senderAddress, [instantiateContractMsg], fee, options.memo);
  }

  public async updateAdmin(
    senderAddress: string,
    contractAddress: string,
    newAdmin: string,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const updateAdminMsg: MsgUpdateAdminEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
      value: MsgUpdateAdmin.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
        newAdmin: newAdmin,
      }),
    };
    return this.signAndBroadcast(senderAddress, [updateAdminMsg], fee, memo);
  }

  public async clearAdmin(
    senderAddress: string,
    contractAddress: string,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const clearAdminMsg: MsgClearAdminEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin",
      value: MsgClearAdmin.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
      }),
    };
    return this.signAndBroadcast(senderAddress, [clearAdminMsg], fee, memo);
  }

  public async migrate(
    senderAddress: string,
    contractAddress: string,
    codeId: number,
    migrateMsg: Record<string, unknown>,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const migrateContractMsg: MsgMigrateContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract",
      value: MsgMigrateContract.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
        codeId: Long.fromString(new Uint53(codeId).toString()),
        msg: toUtf8(JSON.stringify(migrateMsg)),
      }),
    };
    return this.signAndBroadcast(senderAddress, [migrateContractMsg], fee, memo);
  }

  public async execute(
    senderAddress: string,
    contractAddress: string,
    msg: Record<string, unknown>,
    fee: StdFee | "auto" | number,
    memo = "",
    funds?: readonly Coin[],
  ): Promise<DeliverTxResponse | string[]> {
    const executeContractMsg: MsgExecuteContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [...(funds || [])],
      }),
    };

    return this.signAndBroadcast(senderAddress, [executeContractMsg], fee, memo);
  }

  public async executeArray(
    senderAddress: string,
    contractAddress: string,
    msg: string[],
    fee: StdFee | "auto" | number,
    memo = "",
    funds?: readonly Coin[],
  ): Promise<DeliverTxResponse | string[]> {
    const msgs = msg.map((item) => ({
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: senderAddress,
        contract: contractAddress,
        msg: toUtf8(JSON.stringify(item)),
        funds: [...(funds || [])],
      }),
    }));

    return this.signAndBroadcast(senderAddress, msgs, fee, memo);
  }

  // Bank module

  public async sendTokens(
    senderAddress: string,
    recipientAddress: string,
    amount: readonly Coin[],
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const sendMsg: MsgSendEncodeObject = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: senderAddress,
        toAddress: recipientAddress,
        amount: [...amount],
      },
    };
    return this.signAndBroadcast(senderAddress, [sendMsg], fee, memo);
  }

  // Distribution module

  public async delegateTokens(
    delegatorAddress: string,
    validatorAddress: string,
    amount: Coin,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const delegateMsg: MsgDelegateEncodeObject = {
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: MsgDelegate.fromPartial({
        delegatorAddress: delegatorAddress,
        validatorAddress,
        amount,
      }),
    };
    return this.signAndBroadcast(delegatorAddress, [delegateMsg], fee, memo);
  }

  public async redelegateTokens(
    delegatorAddress: string,
    validatorSrcAddress: string,
    validatorDstAddress: string,
    amount: Coin,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const redelegateMsg: MsgBeginRedelegateEncodeObject = {
      typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
      value: MsgBeginRedelegate.fromPartial({
        delegatorAddress: delegatorAddress,
        validatorSrcAddress,
        validatorDstAddress,
        amount,
      }),
    };
    return this.signAndBroadcast(delegatorAddress, [redelegateMsg], fee, memo);
  }

  public async undelegateTokens(
    delegatorAddress: string,
    validatorAddress: string,
    amount: Coin,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const undelegateMsg: MsgUndelegateEncodeObject = {
      typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
      value: MsgUndelegate.fromPartial({
        delegatorAddress: delegatorAddress,
        validatorAddress,
        amount,
      }),
    };
    return this.signAndBroadcast(delegatorAddress, [undelegateMsg], fee, memo);
  }

  public async withdrawRewards(
    delegatorAddress: string,
    validatorAddress: string,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const withdrawDelegatorRewardMsg: MsgWithdrawDelegatorRewardEncodeObject = {
      typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
      value: MsgWithdrawDelegatorReward.fromPartial({ delegatorAddress: delegatorAddress, validatorAddress }),
    };
    return this.signAndBroadcast(delegatorAddress, [withdrawDelegatorRewardMsg], fee, memo);
  }

  public async withdrawAllRewards(
    delegatorAddress: string,
    validatorAddresses: string[],
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const msgs = validatorAddresses.map((validatorAddress) => {
      return {
        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
        value: MsgWithdrawDelegatorReward.fromPartial({
          delegatorAddress: delegatorAddress,
          validatorAddress: validatorAddress,
        }),
      };
    });

    return this.signAndBroadcast(delegatorAddress, msgs, fee, memo);
  }

  // Gov module

  public async voteProposal(
    voter: string,
    proposalId: number,
    option: number,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const voteMsg: MsgVoteEncodeObject = {
      typeUrl: "/cosmos.gov.v1beta1.MsgVote",
      value: MsgVote.fromPartial({
        proposalId: longify(proposalId),
        voter: voter,
        option: option as VoteOption | undefined,
      }),
    };
    return this.signAndBroadcast(voter, [voteMsg], fee, memo);
  }

  public async submitProposal(
    proposer: string,
    content: {
      typeUrl: string;
      value: TextProposal;
    },
    initialDeposit: Coin[],
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const sumbitProposalMsg: MsgSubmitProposalEncodeObject = {
      typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
      value: MsgSubmitProposal.fromPartial({
        content: Any.fromPartial({
          typeUrl: content.typeUrl,
          value: Uint8Array.from(TextProposal.encode(content.value).finish()),
        }),
        initialDeposit: initialDeposit,
        proposer: proposer,
      }),
    };
    return this.signAndBroadcast(proposer, [sumbitProposalMsg], fee, memo);
  }

  public async depositProposal(
    depositor: string,
    proposalId: number,
    amount: Coin[],
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const depositMsg: MsgDepositEncodeObject = {
      typeUrl: "/cosmos.gov.v1beta1.MsgDeposit",
      value: MsgDeposit.fromPartial({
        depositor: depositor,
        proposalId: longify(proposalId),
        amount: amount,
      }),
    };
    return this.signAndBroadcast(depositor, [depositMsg], fee, memo);
  }

  // IBC module

  public async sendIbcTokens(
    senderAddress: string,
    recipientAddress: string,
    transferAmount: Coin,
    sourcePort: string,
    sourceChannel: string,
    timeoutHeight: Height | undefined,
    /** timeout in seconds */
    timeoutTimestamp: number | undefined,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const timeoutTimestampNanoseconds = timeoutTimestamp
      ? Long.fromNumber(timeoutTimestamp).multiply(1_000_000_000)
      : undefined;
    const transferMsg: MsgTransferEncodeObject = {
      typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      value: MsgTransfer.fromPartial({
        sourcePort: sourcePort,
        sourceChannel: sourceChannel,
        sender: senderAddress,
        receiver: recipientAddress,
        token: transferAmount,
        timeoutHeight: timeoutHeight,
        timeoutTimestamp: timeoutTimestampNanoseconds,
      }),
    };
    return this.signAndBroadcast(senderAddress, [transferMsg], fee, memo);
  }

  // Liquidity module

  public async swapWithinBatch(
    swapRequesterAddress: string,
    poolId: number,
    swapTypeId: number,
    offerCoin: Coin,
    demandCoinDenom: string,
    offerCoinFee: Coin,
    orderPrice: string,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const swapWithinBatchMsg: MsgSwapWithinBatchEncodeObject = {
      typeUrl: "/tendermint.liquidity.v1beta1.MsgSwapWithinBatch",
      value: MsgSwapWithinBatch.fromPartial({
        swapRequesterAddress: swapRequesterAddress,
        poolId: poolId,
        swapTypeId: swapTypeId,
        offerCoin: offerCoin,
        demandCoinDenom: demandCoinDenom,
        offerCoinFee: offerCoinFee,
        orderPrice: orderPrice,
      }),
    };
    return this.signAndBroadcast(swapRequesterAddress, [swapWithinBatchMsg], fee, memo);
  }

  public async depositWithinBatch(
    depositorAddress: string,
    poolId: number,
    depositCoins: Coin[],
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const depositWithinBatchMsg: MsgDepositWithinBatchEncodeObject = {
      typeUrl: "/tendermint.liquidity.v1beta1.MsgDepositWithinBatch",
      value: MsgDepositWithinBatch.fromPartial({
        depositorAddress: depositorAddress,
        poolId: poolId,
        depositCoins: depositCoins,
      }),
    };
    return this.signAndBroadcast(depositorAddress, [depositWithinBatchMsg], fee, memo);
  }

  public async withdwawWithinBatch(
    withdrawerAddress: string,
    poolId: number,
    poolCoin: Coin,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const withdrawWithinBatchMsg: MsgWithdrawWithinBatchEncodeObject = {
      typeUrl: "/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch",
      value: MsgWithdrawWithinBatch.fromPartial({
        withdrawerAddress: withdrawerAddress,
        poolId: poolId,
        poolCoin: poolCoin,
      }),
    };
    return this.signAndBroadcast(withdrawerAddress, [withdrawWithinBatchMsg], fee, memo);
  }

  public async createPool(
    poolCreatorAddress: string,
    poolTypeId: number,
    depositCoins: Coin[],
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const createPoolMsg: MsgCreatePoolEncodeObject = {
      typeUrl: "/tendermint.liquidity.v1beta1.MsgCreatePool",
      value: MsgCreatePool.fromPartial({
        poolCreatorAddress: poolCreatorAddress,
        poolTypeId: poolTypeId,
        depositCoins: depositCoins,
      }),
    };
    return this.signAndBroadcast(poolCreatorAddress, [createPoolMsg], fee, memo);
  }

  public async exec(
    granteeAddress: string,
    msgs: Any[],
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const execMsg: MsgExecEncodeObject = {
      typeUrl: "/cosmos.authz.v1beta1.MsgExec",
      value: MsgExec.fromPartial({
        grantee: granteeAddress,
        msgs: msgs,
      }),
    };
    return this.signAndBroadcast(granteeAddress, [execMsg], fee, memo);
  }

  public async grant(
    granterAddress: string,
    granteeAddress: string,
    grant: Grant,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const grantMsg: MsgGrantEncodeObject = {
      typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
      value: MsgGrant.fromPartial({
        granter: granterAddress,
        grantee: granteeAddress,
        grant: grant,
      }),
    };
    return this.signAndBroadcast(granterAddress, [grantMsg], fee, memo);
  }

  public async revoke(
    granterAddress: string,
    granteeAddress: string,
    urlMsgType: string,
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    const revokeMsg: MsgRevokeEncodeObject = {
      typeUrl: "/cosmos.authz.v1beta1.MsgRevoke",
      value: MsgRevoke.fromPartial({
        granter: granterAddress,
        grantee: granteeAddress,
        msgTypeUrl: urlMsgType,
      }),
    };
    return this.signAndBroadcast(granterAddress, [revokeMsg], fee, memo);
  }

  /**
   * Creates a transaction with the given messages, fee and memo. Then signs and broadcasts the transaction.
   *
   * @param signerAddress The address that will sign transactions using this instance. The signer must be able to sign with this address.
   * @param messages
   * @param fee
   * @param memo
   */
  public async signAndBroadcast(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee | "auto" | number,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    // Experimental for remote dapps with cyb's signer integration
    // if (isOfflineDappSigner(this.signer)) {
    //   return messages.map((m) => toBase64(Buffer.from(JSON.stringify(m), "utf-8")));
    // }

    let usedFee: StdFee;
    if (fee == "auto" || typeof fee === "number") {
      const gasEstimation = await this.simulate(signerAddress, messages, memo);
      const multiplier = typeof fee === "number" ? fee : 1.3;
      usedFee = {
        amount: [],
        gas: Math.round(gasEstimation * multiplier).toString(),
      };
    } else {
      usedFee = fee;
    }

    const txRaw = await this.sign(signerAddress, messages, usedFee, memo);
    const txBytes = TxRaw.encode(txRaw).finish();
    return this.broadcastTx(txBytes);
  }

  // Experimental
  // Allows to pass not EncodeObject[] but AminoMsg[]
  // Converts amino to proto
  public async signAndBroadcastWithAmino(
    signerAddress: string,
    messages: readonly AminoMsg[],
    fee: StdFee,
    memo = "",
  ): Promise<DeliverTxResponse | string[]> {
    // Experimental for remote dapps with cyb's signer integration
    const msgs = messages.map((msg) => this.aminoTypes.fromAmino({ type: msg.type, value: msg.value }));
    if (isOfflineDappSigner(this.signer)) {
      return msgs.map((m) => toBase64(Buffer.from(JSON.stringify(m), "utf-8")));
    }
    const txRaw = await this.sign(signerAddress, msgs, fee, memo);
    const txBytes = TxRaw.encode(txRaw).finish();
    return this.broadcastTx(txBytes);
  }

  public async sign(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    explicitSignerData?: SignerData,
  ): Promise<TxRaw> {
    let signerData: SignerData;
    if (explicitSignerData) {
      signerData = explicitSignerData;
    } else {
      const { accountNumber, sequence } = await this.getSequence(signerAddress);
      const chainId = await this.getChainId();
      signerData = {
        accountNumber: accountNumber,
        sequence: sequence,
        chainId: chainId,
      };
    }

    return isOfflineDirectSigner(this.signer)
      ? this.signDirect(signerAddress, messages, fee, memo, signerData)
      : this.signAmino(signerAddress, messages, fee, memo, signerData);
  }

  private async signAmino(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
  ): Promise<TxRaw> {
    assert(isOfflineAminoSigner(this.signer));
    const accountFromSigner = (await this.signer.getAccounts()).find(
      (account) => account.address === signerAddress,
    );
    if (!accountFromSigner) {
      throw new Error("Failed to retrieve account from signer");
    }
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey));
    const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;

    const msgs = messages.map((msg) => this.aminoTypes.toAmino(msg));
    const signDoc = makeSignDocAmino(msgs, fee, chainId, memo, accountNumber, sequence);
    const { signature, signed } = await this.signer.signAmino(signerAddress, signDoc);

    const signedTxBody = {
      messages: signed.msgs.map((msg) => this.aminoTypes.fromAmino(msg)),
      memo: signed.memo,
    };

    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: "/cosmos.tx.v1beta1.TxBody",
      value: signedTxBody,
    };
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject);
    const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
    const signedSequence = Int53.fromString(signed.sequence).toNumber();
    const signedAuthInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence: signedSequence }],
      signed.fee.amount,
      signedGasLimit,
      fee.granter,
      fee.payer,
      signMode,
    );
    return TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
  }

  private async signDirect(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
  ): Promise<TxRaw> {
    assert(isOfflineDirectSigner(this.signer));
    const accountFromSigner = (await this.signer.getAccounts()).find(
      (account) => account.address === signerAddress,
    );
    if (!accountFromSigner) {
      throw new Error("Failed to retrieve account from signer");
    }
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey));
    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: "/cosmos.tx.v1beta1.TxBody",
      value: {
        messages: messages,
        memo: memo,
      },
    };
    const txBodyBytes = this.registry.encode(txBodyEncodeObject);
    const gasLimit = Int53.fromString(fee.gas).toNumber();
    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence }],
      fee.amount,
      gasLimit,
      fee.granter,
      fee.payer,
    );
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);
    const { signature, signed } = await this.signer.signDirect(signerAddress, signDoc);
    return TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
  }

  public async signData(signerAddress: string, data: Uint8Array | Uint8Array[]): Promise<StdTx> {
    const accountNumber = 0;
    const sequence = 0;
    const chainId = "";
    const fee: StdFee = {
      gas: "0",
      amount: [],
    };
    const memo = "";

    const datas = Array.isArray(data) ? data : [data];

    const msgs: MsgSignData[] = datas.map(
      (d): MsgSignData => ({
        type: "sign/MsgSignData",
        value: {
          signer: signerAddress,
          data: toBase64(d),
        },
      }),
    );

    assert(isOfflineAminoSigner(this.signer));
    const accountFromSigner = (await this.signer.getAccounts()).find(
      (account) => account.address === signerAddress,
    );
    if (!accountFromSigner) {
      throw new Error("Failed to retrieve account from signer");
    }
    const signDoc = makeSignDocAmino(msgs, fee, chainId, memo, accountNumber, sequence);
    const { signature, signed } = await this.signer.signAmino(signerAddress, signDoc);
    if (!equals(signDoc, signed)) {
      throw new Error(
        "The signed document differs from the signing instruction. This is not supported for ADR-036.",
      );
    }

    return makeStdTx(signDoc, signature);
  }

  public static async verifySignedData(signed: StdTx): Promise<boolean> {
    // Restrictions from ADR-036
    if (signed.memo !== "") throw new Error("Memo must be empty.");
    if (signed.fee.gas !== "0") throw new Error("Fee gas must 0.");
    if (signed.fee.amount.length !== 0) throw new Error("Fee amount must be an empty array.");

    const accountNumber = 0;
    const sequence = 0;
    const chainId = "";

    // Check `msg` array
    const signedMessages = signed.msg;
    if (!signedMessages.every(isMsgSignData)) {
      throw new Error(`Found message that is not the expected type.`);
    }
    if (signedMessages.length === 0) {
      throw new Error("No message found. Without messages we cannot determine the signer address.");
    }
    // TODO: restrict number of messages?

    const signatures = signed.signatures;
    if (signatures.length !== 1) throw new Error("Must have exactly one signature to be supported.");
    const signature = signatures[0];
    if (!isSecp256k1Pubkey(signature.pub_key)) {
      throw new Error("Only secp256k1 signatures are supported.");
    }

    const signBytes = serializeSignDoc(
      makeSignDocAmino(signed.msg, signed.fee, chainId, signed.memo, accountNumber, sequence),
    );
    const prehashed = sha256(signBytes);

    const secpSignature = Secp256k1Signature.fromFixedLength(fromBase64(signature.signature));
    const rawSecp256k1Pubkey = fromBase64(signature.pub_key.value);
    const rawSignerAddress = rawSecp256k1PubkeyToRawAddress(rawSecp256k1Pubkey);

    if (
      signedMessages.some((msg) => !arrayContentEquals(fromBech32(msg.value.signer).data, rawSignerAddress))
    ) {
      throw new Error("Found mismatch between signer in message and public key");
    }

    const ok = await Secp256k1.verifySignature(secpSignature, prehashed, rawSecp256k1Pubkey);
    return ok;
  }
}
