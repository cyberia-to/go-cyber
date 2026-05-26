import { lcdGet } from "../clients/lcd.js";

export async function getBalances(address: string) {
  const result = await lcdGet<{
    balances: Array<{ denom: string; amount: string }>;
  }>(`/cosmos/bank/v1beta1/balances/${address}`);
  return result.balances;
}

export async function getSupply(denom: string) {
  const result = await lcdGet<{
    amount: { denom: string; amount: string };
  }>(`/cosmos/bank/v1beta1/supply/by_denom?denom=${encodeURIComponent(denom)}`);
  return result.amount;
}

export async function getMintPrice() {
  try {
    return await lcdGet("/cyber/resources/v1beta1/resources/params");
  } catch {
    try {
      return await lcdGet("/cyber/resources/v1beta1/params");
    } catch {
      return { error: "Resources endpoint not available on this LCD node" };
    }
  }
}

export async function getStaking(address: string) {
  const [delegations, rewards, unbonding] = await Promise.all([
    lcdGet<{
      delegation_responses: Array<{
        delegation: { validator_address: string; shares: string };
        balance: { denom: string; amount: string };
      }>;
    }>(`/cosmos/staking/v1beta1/delegations/${address}`).catch(() => ({
      delegation_responses: [],
    })),
    lcdGet<{
      total: Array<{ denom: string; amount: string }>;
      rewards: Array<{
        validator_address: string;
        reward: Array<{ denom: string; amount: string }>;
      }>;
    }>(
      `/cosmos/distribution/v1beta1/delegators/${address}/rewards`,
    ).catch(() => ({ total: [], rewards: [] })),
    lcdGet<{
      unbonding_responses: Array<{
        validator_address: string;
        entries: Array<{ balance: string; completion_time: string }>;
      }>;
    }>(
      `/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`,
    ).catch(() => ({ unbonding_responses: [] })),
  ]);

  return {
    delegations: delegations.delegation_responses.map((d) => ({
      validator: d.delegation.validator_address,
      amount: d.balance,
    })),
    total_rewards: rewards.total,
    rewards_by_validator: rewards.rewards?.map((r) => ({
      validator: r.validator_address,
      reward: r.reward,
    })),
    unbonding: unbonding.unbonding_responses,
  };
}

export async function getPools() {
  try {
    return await lcdGet("/cosmos/liquidity/v1beta1/pools");
  } catch {
    try {
      return await lcdGet("/osmosis/gamm/v1beta1/pools");
    } catch {
      return { error: "Liquidity pools endpoint not available" };
    }
  }
}

export async function getInflation() {
  const [inflation, params] = await Promise.all([
    lcdGet<{ inflation: string }>("/cosmos/mint/v1beta1/inflation").catch(
      () => ({ inflation: "unknown" }),
    ),
    lcdGet("/cosmos/mint/v1beta1/params").catch(() => null),
  ]);
  return { inflation: inflation.inflation, params };
}
