import { lcdGet, lcdSmartQuery } from "../clients/lcd.js";
import { graphql } from "../clients/graphql.js";

// Litium modular contract addresses (deployed on Bostrom 2026-03-04)
export const LITIUM_CORE = "bostrom1y9dqawhtk0m3sgglh2jgeu9y5zq5vmh5udmnw2unsm6j0j2nrskqe00ulm";
export const LITIUM_MINE = "bostrom123wr6faa62xxrft6t5wmpqmh9g0chvu7ddedggx0lkecmgef7thsls9my2";
export const LITIUM_STAKE = "bostrom1yagpj5dmr9fxj7qs08kdz2cpptf9va7jqwgx5257qjul2z6yq46sslqruy";
export const LITIUM_REFER = "bostrom1yvf9a2w6ydr79c4ufaj6wmk6sdw6xmct6ztn600chadjzek8639s34qxft";
export const LITIUM_WRAP = "bostrom1r5e285vff6mdyzhnh2aprcf3k9dujtjk5qqg30mqpd09cqde7tds3ue902";
// LI token denom: factory/{wrap_contract}/li (v2 uses wrap contract as issuer)
export const LI_DENOM = `factory/${LITIUM_WRAP}/li`;

// --- litium-core queries ---

export async function getCoreConfig(contract: string) {
  return lcdSmartQuery(contract, { config: {} });
}

export async function getBurnStats(contract: string) {
  return lcdSmartQuery(contract, { burn_stats: {} });
}

export async function getTotalMinted(contract: string) {
  return lcdSmartQuery(contract, { total_minted: {} });
}

// --- litium-mine queries ---

export async function getMineConfig(contract: string) {
  return lcdSmartQuery(contract, { config: {} });
}

export async function getWindowStatus(contract: string) {
  return lcdSmartQuery(contract, { window_status: {} });
}

export async function getEmissionInfo(contract: string) {
  return lcdSmartQuery(contract, { emission_info: {} });
}

export async function getMineStats(contract: string) {
  return lcdSmartQuery(contract, { stats: {} });
}

export async function getMinerStats(contract: string, address: string) {
  return lcdSmartQuery(contract, { miner_stats: { address } });
}

export async function calculateReward(contract: string, difficultyBits: number) {
  return lcdSmartQuery(contract, {
    calculate_reward: { difficulty_bits: difficultyBits },
  });
}

/** Composite: full mine contract state */
export async function getMineState(contract: string) {
  const [config, windowStatus, stats, emission] =
    await Promise.all([
      lcdSmartQuery(contract, { config: {} }),
      lcdSmartQuery(contract, { window_status: {} }),
      lcdSmartQuery(contract, { stats: {} }),
      lcdSmartQuery(contract, { emission_info: {} }),
    ]);
  return { config, window_status: windowStatus, stats, emission };
}

// --- litium-stake queries ---

export async function getStakeConfig(contract: string) {
  return lcdSmartQuery(contract, { config: {} });
}

export async function getTotalStaked(contract: string) {
  return lcdSmartQuery(contract, { total_staked: {} });
}

export async function getStakeInfo(contract: string, address: string) {
  return lcdSmartQuery(contract, { stake_info: { address } });
}

export async function getStakingStats(contract: string) {
  return lcdSmartQuery(contract, { staking_stats: {} });
}

export async function getStakeTotalPendingRewards(contract: string) {
  return lcdSmartQuery(contract, { total_pending_rewards: {} });
}

// --- litium-refer queries ---

export async function getReferConfig(contract: string) {
  return lcdSmartQuery(contract, { config: {} });
}

export async function getReferrerOf(contract: string, miner: string) {
  return lcdSmartQuery(contract, { referrer_of: { miner } });
}

export async function getReferralInfo(contract: string, address: string) {
  return lcdSmartQuery(contract, { referral_info: { address } });
}

export async function getCommunityPoolBalance(contract: string) {
  return lcdSmartQuery(contract, { community_pool_balance: {} });
}

export async function getReferTotalPendingRewards(contract: string) {
  return lcdSmartQuery(contract, { total_pending_rewards: {} });
}

// --- TX history (via graphql, works for any contract) ---

interface TxMessage {
  transaction_hash: string;
  value: unknown;
  transaction: {
    block: { height: number; timestamp: string };
    success: boolean;
  };
}

export async function getRecentProofs(contract: string, limit: number) {
  const result = await graphql<{
    messages_by_address: TxMessage[];
  }>(`{
    messages_by_address(
      args: {
        addresses: "{${contract}}",
        types: "{cosmwasm.wasm.v1.MsgExecuteContract}"
      },
      limit: ${limit},
      order_by: {transaction_hash: desc}
    ) {
      transaction_hash
      value
      transaction { block { height timestamp } success }
    }
  }`);
  return result.messages_by_address;
}

export async function getMinerTxHistory(address: string, limit: number) {
  const result = await graphql<{
    messages_by_address: TxMessage[];
    messages_by_address_aggregate: { aggregate: { count: number } };
  }>(`{
    messages_by_address(
      args: {
        addresses: "{${address}}",
        types: "{cosmwasm.wasm.v1.MsgExecuteContract}"
      },
      limit: ${limit},
      order_by: {transaction_hash: desc}
    ) {
      transaction_hash
      value
      transaction { block { height timestamp } success }
    }
    messages_by_address_aggregate(
      args: {
        addresses: "{${address}}",
        types: "{cosmwasm.wasm.v1.MsgExecuteContract}"
      }
    ) { aggregate { count } }
  }`);

  return {
    total_txs: result.messages_by_address_aggregate.aggregate.count,
    recent_txs: result.messages_by_address,
  };
}
