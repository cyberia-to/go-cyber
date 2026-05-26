import { lcdGet } from "../clients/lcd.js";

export async function getProposals(status: string, limit: number) {
  const params = new URLSearchParams({
    "pagination.limit": String(limit),
    "pagination.reverse": "true",
  });
  if (status !== "all") {
    params.set("proposal_status", status);
  }

  const result = await lcdGet<{
    proposals: Array<{
      id: string;
      title: string;
      status: string;
      submit_time: string;
      voting_end_time: string;
      total_deposit: Array<{ denom: string; amount: string }>;
    }>;
  }>(`/cosmos/gov/v1/proposals?${params}`);

  return (result.proposals ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    submit_time: p.submit_time,
    voting_end_time: p.voting_end_time,
    total_deposit: p.total_deposit,
  }));
}

export async function getProposalDetail(proposalId: string) {
  const [proposal, tally] = await Promise.all([
    lcdGet<{ proposal: unknown }>(`/cosmos/gov/v1/proposals/${proposalId}`),
    lcdGet<{ tally: unknown }>(
      `/cosmos/gov/v1/proposals/${proposalId}/tally`,
    ).catch(() => ({ tally: null })),
  ]);
  return { proposal: proposal.proposal, tally: tally.tally };
}

export async function getValidators(status: string, limit: number) {
  const result = await lcdGet<{
    validators: Array<{
      operator_address: string;
      description: { moniker: string; website: string; details: string };
      commission: {
        commission_rates: { rate: string; max_rate: string };
      };
      tokens: string;
      status: string;
      jailed: boolean;
    }>;
  }>(
    `/cosmos/staking/v1beta1/validators?status=${status}&pagination.limit=${limit}`,
  );

  return (result.validators ?? [])
    .map((v) => ({
      operator_address: v.operator_address,
      moniker: v.description.moniker,
      website: v.description.website,
      commission_rate: v.commission.commission_rates.rate,
      tokens: v.tokens,
      jailed: v.jailed,
    }))
    .sort((a, b) => Number(BigInt(b.tokens) - BigInt(a.tokens)));
}

export async function getParams(module: string) {
  const paths: Record<string, string> = {
    staking: "/cosmos/staking/v1beta1/params",
    slashing: "/cosmos/slashing/v1beta1/params",
    gov: "/cosmos/gov/v1/params/tallying",
    distribution: "/cosmos/distribution/v1beta1/params",
    mint: "/cosmos/mint/v1beta1/params",
  };
  return lcdGet(paths[module]);
}
