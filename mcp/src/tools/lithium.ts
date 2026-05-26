import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, paginationHint, READ_ONLY_ANNOTATIONS } from "../util.js";
import * as svc from "../services/lithium.js";
import {
  LITIUM_CORE,
  LITIUM_MINE,
  LITIUM_STAKE,
  LITIUM_REFER,
} from "../services/lithium.js";

export function registerLithiumTools(server: McpServer) {
  // ── litium-core ──────────────────────────────────────────────

  server.registerTool(
    "li_core_config",
    {
      description: "Get litium-core config: token_denom, admin, paused",
      inputSchema: {
        contract: z.string().default(LITIUM_CORE).describe("litium-core contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getCoreConfig(contract))),
  );

  server.registerTool(
    "li_burn_stats",
    {
      description: "Get LI burn stats: total_burned via contract-mediated transfers",
      inputSchema: {
        contract: z.string().default(LITIUM_CORE).describe("litium-core contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getBurnStats(contract))),
  );

  server.registerTool(
    "li_total_minted",
    {
      description: "Get total LI minted and supply cap",
      inputSchema: {
        contract: z.string().default(LITIUM_CORE).describe("litium-core contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getTotalMinted(contract))),
  );

  // ── litium-mine ──────────────────────────────────────────────

  server.registerTool(
    "li_mine_state",
    {
      description:
        "Get full litium-mine state: config, window_status, stats, emission breakdown",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getMineState(contract))),
  );

  server.registerTool(
    "li_mine_config",
    {
      description:
        "Get litium-mine config: max_proof_age, estimated_gas_cost_uboot, window_size, pid_interval, min_profitable_difficulty, alpha, beta, fee_bucket_duration, fee_num_buckets, warmup_base_rate, core/stake/refer/token contracts",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getMineConfig(contract))),
  );

  server.registerTool(
    "li_window_status",
    {
      description:
        "Get sliding window status: proof_count, window_d_rate, window_entries, base_rate, min_profitable_difficulty, alpha, beta",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getWindowStatus(contract))),
  );

  server.registerTool(
    "li_emission",
    {
      description:
        "Get Lithium emission breakdown: alpha, beta, emission_rate, gross_rate, mining_rate, staking_rate, windowed_fees",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getEmissionInfo(contract))),
  );

  server.registerTool(
    "li_reward_estimate",
    {
      description:
        "Estimate LI reward for a given difficulty: gross_reward, estimated_gas_cost_uboot, earns_reward",
      inputSchema: {
        difficulty_bits: z.number().min(1).describe("Difficulty in bits (leading zero bits)"),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ difficulty_bits, contract }) =>
      ok(await svc.calculateReward(contract, difficulty_bits)),
    ),
  );

  server.registerTool(
    "li_mine_stats",
    {
      description: "Get aggregate mining stats: total_proofs, total_rewards, unique_miners, avg_difficulty",
      inputSchema: {
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getMineStats(contract))),
  );

  server.registerTool(
    "li_miner_stats",
    {
      description:
        "Get per-miner stats: proofs_submitted, total_rewards, last_proof_time",
      inputSchema: {
        address: z.string().describe("Miner address (bostrom1...)"),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address, contract }) =>
      ok(await svc.getMinerStats(contract, address)),
    ),
  );

  server.registerTool(
    "li_recent_proofs",
    {
      description: "Get recent proof submission transactions for the mine contract",
      inputSchema: {
        limit: z.number().min(1).max(50).default(10),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ limit, contract }) => {
      const proofs = await svc.getRecentProofs(contract, limit);
      const pagination = paginationHint("li_recent_proofs", 0, limit, proofs);
      return ok({ proofs, ...(pagination && { pagination }) });
    }),
  );

  // ── litium-stake ─────────────────────────────────────────────

  server.registerTool(
    "li_stake_config",
    {
      description:
        "Get litium-stake config: core_contract, mine_contract, token_contract, unbonding_period_seconds, admin, paused",
      inputSchema: {
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getStakeConfig(contract))),
  );

  server.registerTool(
    "li_total_staked",
    {
      description: "Get total LI staked across all stakers",
      inputSchema: {
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getTotalStaked(contract))),
  );

  server.registerTool(
    "li_stake_info",
    {
      description:
        "Get staking state for an address: staked_amount, pending_unbonding, pending_unbonding_until, claimable_rewards",
      inputSchema: {
        address: z.string().describe("Staker address (bostrom1...)"),
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address, contract }) =>
      ok(await svc.getStakeInfo(contract, address)),
    ),
  );

  server.registerTool(
    "li_staking_stats",
    {
      description: "Get aggregate staking stats: reserve, total_staked, reward_index",
      inputSchema: {
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getStakingStats(contract))),
  );

  server.registerTool(
    "li_total_pending_rewards",
    {
      description:
        "Get total accrued-but-unminted staking rewards. Used to compute effective circulating supply (minted - burned + pending).",
      inputSchema: {
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getStakeTotalPendingRewards(contract))),
  );

  // ── litium-refer ─────────────────────────────────────────────

  server.registerTool(
    "li_refer_config",
    {
      description:
        "Get litium-refer config: core_contract, mine_contract, community_pool_addr, admin, paused",
      inputSchema: {
        contract: z.string().default(LITIUM_REFER).describe("litium-refer contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getReferConfig(contract))),
  );

  server.registerTool(
    "li_referrer_of",
    {
      description: "Get who referred a specific miner",
      inputSchema: {
        miner: z.string().describe("Miner address (bostrom1...)"),
        contract: z.string().default(LITIUM_REFER).describe("litium-refer contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ miner, contract }) =>
      ok(await svc.getReferrerOf(contract, miner)),
    ),
  );

  server.registerTool(
    "li_referral_info",
    {
      description: "Get referral stats for a referrer: referral_rewards, referrals_count",
      inputSchema: {
        address: z.string().describe("Referrer address (bostrom1...)"),
        contract: z.string().default(LITIUM_REFER).describe("litium-refer contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address, contract }) =>
      ok(await svc.getReferralInfo(contract, address)),
    ),
  );

  server.registerTool(
    "li_community_pool",
    {
      description: "Get unclaimed community pool balance (referral rewards for miners without referrer)",
      inputSchema: {
        contract: z.string().default(LITIUM_REFER).describe("litium-refer contract address"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ contract }) => ok(await svc.getCommunityPoolBalance(contract))),
  );

  // ── cross-contract: miner TX history ─────────────────────────

  server.registerTool(
    "li_miner_tx_history",
    {
      description: "Get a miner's recent contract execution TX history and total count",
      inputSchema: {
        address: z.string().describe("Miner address (bostrom1...)"),
        limit: z.number().min(1).max(50).default(20),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address, limit }) => {
      const result = await svc.getMinerTxHistory(address, limit);
      const pagination = paginationHint("li_miner_tx_history", 0, limit, result.recent_txs);
      return ok({ ...result, ...(pagination && { pagination }) });
    }),
  );
}
