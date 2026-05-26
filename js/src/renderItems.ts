import { toUtf8 } from "@cosmjs/encoding";
import { Uint53 } from "@cosmjs/math";
import { longify } from "@cosmjs/stargate/build/queryclient";
// import { MsgExec, MsgGrant, MsgRevoke } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { MsgDeposit, MsgSubmitProposal, MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { MsgBeginRedelegate, MsgDelegate, MsgUndelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import {
  MsgClearAdmin,
  MsgExecuteContract,
  MsgInstantiateContract,
  MsgMigrateContract,
  MsgStoreCode,
  MsgUpdateAdmin,
} from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";
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

const testAddress = "bostrom1frk9k38pvp70vheezhdfd4nvqnlsm9dw3j8hlq";
const testAddress2 = "bostrom1frk9k38pvp70vheezhdfd4nvqnlsm9dw3j8hlw";
const testContract = "bostrom1nwnejwsdpqktusvh8qhxe5arsznjd5asdwutmaz9n5qcpl3dcmhsujhemd";
const testValidatorAddress = "bostromvaloper135ca8hdpy9sk0ntwqzpzsvatyl48ptx52tn60p";

const depositCoin = { denom: "boot", amount: "1000000" };

const depositCoins = [
  { denom: "boot", amount: "1000000" },
  { denom: "hydrogen", amount: "1000000" },
];

interface RenderItem {
  typeUrl: string;
  value: Partial<any>;
  data: any;
}

interface RenderItems extends Array<RenderItem> {}

export const renderItems: RenderItems = [
  {
    typeUrl: "/cyber.graph.v1beta1.MsgCyberlink",
    value: MsgCyberlink,
    data: {
      neuron: testAddress,
      links: [
        {
          from: "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4",
          to: "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4",
        },
      ],
    },
  },
  {
    typeUrl: "/cyber.resources.v1beta1.MsgInvestmint",
    value: MsgInvestmint,
    data: {
      neuron: testAddress,
      amount: { denom: "boot", amount: "1000000000" },
      resource: "millivolt",
      length: 86400,
    },
  },
  {
    typeUrl: "/cyber.grid.v1beta1.MsgCreateRoute",
    value: MsgCreateRoute,
    data: {
      source: testAddress,
      destination: testAddress2,
      name: "nameTitle",
    },
  },
  {
    typeUrl: "/cyber.grid.v1beta1.MsgEditRoute",
    value: MsgEditRoute,
    data: {
      source: testAddress,
      destination: testAddress2,
      value: { denom: "millivolt", amount: "1000" },
    },
  },
  {
    typeUrl: "/cyber.grid.v1beta1.MsgDeleteRoute",
    value: MsgDeleteRoute,
    data: {
      source: testAddress,
      destination: testAddress2,
    },
  },
  {
    typeUrl: "/cyber.grid.v1beta1.MsgEditRouteName",
    value: MsgEditRouteName,
    data: {
      source: testAddress,
      destination: testAddress2,
      name: "nameTitle2",
    },
  },
  {
    typeUrl: "/tendermint.liquidity.v1beta1.MsgCreatePool",
    value: MsgCreatePool,
    data: {
      poolCreatorAddress: testAddress,
      poolTypeId: 1,
      depositCoins: depositCoins,
    },
  },
  {
    typeUrl: "/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch",
    value: MsgWithdrawWithinBatch,
    data: {
      withdrawerAddress: testAddress,
      poolId: 1,
      poolCoin: {
        denom: "pool70D7610CBA8E94B27BAD7806EBD826F5626C486BBF5C490D1463D72314353C66",
        amount: "1",
      },
    },
  },
  {
    typeUrl: "/tendermint.liquidity.v1beta1.MsgDepositWithinBatch",
    value: MsgDepositWithinBatch,
    data: {
      depositorAddress: testAddress,
      poolId: 1,
      depositCoins: depositCoins,
    },
  },
  {
    typeUrl: "/tendermint.liquidity.v1beta1.MsgSwapWithinBatch",
    value: MsgSwapWithinBatch,
    data: {
      swapRequesterAddress: testAddress,
      poolId: 1,
      swapTypeId: 1,
      offerCoin: depositCoin,
      demandCoinDenom: "hydrogen",
      offerCoinFee: { denom: "boot", amount: "1" },
      orderPrice: "10000000000000000",
    },
  },
  {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: MsgSend,
    data: {
      fromAddress: testAddress,
      toAddress: testAddress2,
      amount: [depositCoin],
    },
  },
  {
    typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
    value: MsgDelegate,
    data: {
      delegatorAddress: testAddress,
      validatorAddress: testValidatorAddress,
      amount: depositCoin,
    },
  },
  {
    typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
    value: MsgBeginRedelegate,
    data: {
      delegatorAddress: testAddress,
      validatorSrcAddress: testValidatorAddress,
      validatorDstAddress: testValidatorAddress,
      amount: depositCoin,
    },
  },
  {
    typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
    value: MsgUndelegate,
    data: {
      delegatorAddress: testAddress,
      validatorAddress: testValidatorAddress,
      amount: depositCoin,
    },
  },
  {
    typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
    value: MsgWithdrawDelegatorReward,
    data: {
      delegatorAddress: testAddress,
      validatorAddress: testValidatorAddress,
    },
  },
  {
    typeUrl: "/cosmos.gov.v1beta1.MsgVote",
    value: MsgVote,
    data: {
      proposalId: longify(1),
      voter: testAddress,
      option: 1,
    },
  },
  {
    typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
    value: MsgSubmitProposal,
    data: {
      proposer: testAddress,
      initialDeposit: [depositCoin],
      content: {
        typeUrl: "/cosmos.gov.v1beta1.TextProposal",
        value: {
          title: "title",
          description: "description",
        },
      },
    },
  },
  {
    typeUrl: "/cosmos.gov.v1beta1.MsgDeposit",
    value: MsgDeposit,
    data: {
      depositor: testAddress,
      proposalId: longify(1),
      amount: [depositCoin],
    },
  },
  {
    typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
    value: MsgTransfer,
    data: {
      sourcePort: "transfer",
      sourceChannel: "channel-95",
      sender: testAddress,
      receiver: "osmo1snkhz3snfeyxkmyw6zutwjlarkf9pq5vfrla7w",
      token: depositCoin,
      timeoutHeight: "0-0",
      timeoutTimestamp: "1645655169591000000",
    },
  },
  {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
    value: MsgStoreCode,
    data: {
      sender: testAddress,
      wasmByteCode: "",
    },
  },
  {
    typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin",
    value: MsgClearAdmin,
    data: {
      sender: testAddress,
      contract: testContract,
    },
  },
  {
    typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
    value: MsgUpdateAdmin,
    data: {
      sender: testAddress,
      contract: testContract,
      newAdmin: testAddress2,
    },
  },
  {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: MsgExecuteContract,
    data: {
      sender: testAddress,
      contract: testContract,
      msg: toUtf8(JSON.stringify({})),
      funds: [depositCoin],
    },
  },
  {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
    value: MsgInstantiateContract,
    data: {
      sender: testAddress,
      codeId: Long.fromString(new Uint53(1).toString()),
      msg: toUtf8(JSON.stringify({})),
      label: "labelname",
      funds: [depositCoin],
      admin: testAddress,
    },
  },
  {
    typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract",
    value: MsgMigrateContract,
    data: {
      sender: testAddress,
      contract: testContract,
      codeId: Long.fromString(new Uint53(1).toString()),
      msg: toUtf8(JSON.stringify({})),
    },
  },
];
