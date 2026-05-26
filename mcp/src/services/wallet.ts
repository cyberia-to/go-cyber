import {
  getWalletAddress,
  getStargateClient,
  signAndBroadcast,
  formatTxResult,
  checkAmountLimit,
} from "../clients/signing.js";
import { lcdGet } from "../clients/lcd.js";

/** Get wallet info: address + all balances */
export async function getWalletInfo() {
  const address = await getWalletAddress();
  const { balances } = await lcdGet<{ balances: Array<{ denom: string; amount: string }> }>(
    `/cosmos/bank/v1beta1/balances/${address}`,
  );
  return { address, balances };
}

/** Send tokens to a recipient */
export async function sendTokens(
  to: string,
  amount: string,
  denom: string,
) {
  checkAmountLimit(amount, denom);
  const from = await getWalletAddress();
  const msg = {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: {
      fromAddress: from,
      toAddress: to,
      amount: [{ denom, amount }],
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), from, to, amount, denom };
}

/** Delegate tokens to a validator */
export async function delegate(
  validatorAddress: string,
  amount: string,
  denom: string = "boot",
) {
  const delegator = await getWalletAddress();
  const msg = {
    typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
    value: {
      delegatorAddress: delegator,
      validatorAddress,
      amount: { denom, amount },
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), delegator, validatorAddress, amount, denom };
}

/** Undelegate tokens from a validator */
export async function undelegate(
  validatorAddress: string,
  amount: string,
  denom: string = "boot",
) {
  const delegator = await getWalletAddress();
  const msg = {
    typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
    value: {
      delegatorAddress: delegator,
      validatorAddress,
      amount: { denom, amount },
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), delegator, validatorAddress, amount, denom };
}

/** Redelegate tokens between validators */
export async function redelegate(
  srcValidator: string,
  dstValidator: string,
  amount: string,
  denom: string = "boot",
) {
  const delegator = await getWalletAddress();
  const msg = {
    typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
    value: {
      delegatorAddress: delegator,
      validatorSrcAddress: srcValidator,
      validatorDstAddress: dstValidator,
      amount: { denom, amount },
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), delegator, srcValidator, dstValidator, amount, denom };
}

/** Claim staking rewards from a validator (or all validators) */
export async function claimRewards(validatorAddress?: string) {
  const delegator = await getWalletAddress();

  let validators: string[];
  if (validatorAddress) {
    validators = [validatorAddress];
  } else {
    const { delegation_responses } = await lcdGet<{
      delegation_responses: Array<{ delegation: { validator_address: string } }>;
    }>(`/cosmos/staking/v1beta1/delegators/${delegator}/delegations`);
    validators = delegation_responses.map((d) => d.delegation.validator_address);
  }

  if (validators.length === 0) {
    throw new Error("No delegations found to claim rewards from");
  }

  const msgs = validators.map((val) => ({
    typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
    value: {
      delegatorAddress: delegator,
      validatorAddress: val,
    },
  }));

  const result = await signAndBroadcast(msgs);
  return { ...formatTxResult(result), delegator, validators };
}

/** Vote on a governance proposal */
export async function vote(
  proposalId: number,
  option: "yes" | "no" | "abstain" | "no_with_veto",
) {
  const voter = await getWalletAddress();
  const optionMap: Record<string, number> = {
    yes: 1,
    abstain: 2,
    no: 3,
    no_with_veto: 4,
  };
  const msg = {
    typeUrl: "/cosmos.gov.v1beta1.MsgVote",
    value: {
      proposalId: BigInt(proposalId),
      voter,
      option: optionMap[option],
    },
  };
  const result = await signAndBroadcast([msg]);
  return { ...formatTxResult(result), voter, proposalId, option };
}
