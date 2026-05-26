import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, WRITE_ANNOTATIONS } from "../util.js";
import * as svc from "../services/lithium-write.js";
import { LITIUM_MINE, LITIUM_STAKE, LITIUM_REFER } from "../services/lithium.js";

export function registerLithiumWriteTools(server: McpServer) {
  server.registerTool(
    "li_submit_proof",
    {
      description:
        "Submit a lithium mining proof with client-chosen difficulty. " +
        "Requires challenge (32-byte hex) and difficulty (leading zero bits). " +
        "First referrer submission also binds the referrer permanently.",
      inputSchema: {
        hash: z.string().describe("Computed hash (hex)"),
        nonce: z.number().describe("Nonce value"),
        miner_address: z.string().describe("Miner address (bostrom1...)"),
        challenge: z.string().describe("Challenge (hex, 32 bytes)"),
        difficulty: z.number().min(1).describe("Difficulty in bits (leading zero bits)"),
        timestamp: z.number().describe("Timestamp (unix seconds)"),
        referrer: z.string().optional().describe("Referrer address (optional, bound permanently on first proof)"),
        contract: z.string().default(LITIUM_MINE).describe("litium-mine contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ hash, nonce, miner_address, challenge, difficulty, timestamp, referrer, contract }) =>
      ok(await svc.submitProof(hash, nonce, miner_address, challenge, difficulty, timestamp, referrer, contract)),
    ),
  );

  server.registerTool(
    "li_stake",
    {
      description:
        "Stake LI tokens to earn staking rewards. " +
        "Sends CW-20 LI to the stake contract via litium-core Send.",
      inputSchema: {
        amount: z.string().describe("Amount of LI to stake (base units)"),
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ amount, contract }) =>
      ok(await svc.stakeLi(amount, contract)),
    ),
  );

  server.registerTool(
    "li_unstake",
    {
      description:
        "Unstake LI tokens. Subject to unbonding period.",
      inputSchema: {
        amount: z.string().describe("Amount of LI to unstake (base units)"),
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ amount, contract }) =>
      ok(await svc.unstakeLi(amount, contract)),
    ),
  );

  server.registerTool(
    "li_claim_rewards",
    {
      description:
        "Claim LI staking rewards from the stake contract.",
      inputSchema: {
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ contract }) =>
      ok(await svc.claimLiRewards(contract)),
    ),
  );

  server.registerTool(
    "li_claim_unbonding",
    {
      description:
        "Claim matured unbonding LI tokens from the stake contract. " +
        "Only succeeds after unbonding_period_seconds has elapsed since unstaking.",
      inputSchema: {
        contract: z.string().default(LITIUM_STAKE).describe("litium-stake contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ contract }) =>
      ok(await svc.claimUnbonding(contract)),
    ),
  );

  server.registerTool(
    "li_claim_referral_rewards",
    {
      description:
        "Claim accumulated referral rewards from the litium-refer contract. " +
        "Called by the referrer to collect earned referral share.",
      inputSchema: {
        contract: z.string().default(LITIUM_REFER).describe("litium-refer contract address"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ contract }) =>
      ok(await svc.claimReferralRewards(contract)),
    ),
  );
}
