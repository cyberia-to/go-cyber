import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, READ_ONLY_ANNOTATIONS, WRITE_ANNOTATIONS } from "../util.js";
import * as svc from "../services/wallet.js";

export function registerWalletTools(server: McpServer) {
  server.registerTool(
    "wallet_info",
    {
      description:
        "Get agent wallet address and all token balances. Works only when BOSTROM_MNEMONIC is set.",
      inputSchema: {},
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async () => ok(await svc.getWalletInfo())),
  );

  server.registerTool(
    "wallet_send",
    {
      description:
        "Send tokens to a recipient address. Requires BOSTROM_MNEMONIC. " +
        "Subject to BOSTROM_MAX_SEND_AMOUNT circuit breaker if set.",
      inputSchema: {
        to: z.string().describe("Recipient address (bostrom1...)"),
        amount: z.string().describe("Amount in base units (e.g. '1000000' for 1 BOOT)"),
        denom: z.string().default("boot").describe("Token denom (default: boot)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ to, amount, denom }) =>
      ok(await svc.sendTokens(to, amount, denom)),
    ),
  );

  server.registerTool(
    "wallet_delegate",
    {
      description:
        "Delegate (stake) tokens to a validator. Delegated tokens earn staking rewards.",
      inputSchema: {
        validator: z.string().describe("Validator address (bostromvaloper1...)"),
        amount: z.string().describe("Amount in base units"),
        denom: z.string().default("boot").describe("Token denom (default: boot)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ validator, amount, denom }) =>
      ok(await svc.delegate(validator, amount, denom)),
    ),
  );

  server.registerTool(
    "wallet_undelegate",
    {
      description:
        "Undelegate (unstake) tokens from a validator. Unbonding takes ~21 days.",
      inputSchema: {
        validator: z.string().describe("Validator address (bostromvaloper1...)"),
        amount: z.string().describe("Amount in base units"),
        denom: z.string().default("boot").describe("Token denom (default: boot)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ validator, amount, denom }) =>
      ok(await svc.undelegate(validator, amount, denom)),
    ),
  );

  server.registerTool(
    "wallet_redelegate",
    {
      description:
        "Redelegate tokens from one validator to another without unbonding.",
      inputSchema: {
        src_validator: z.string().describe("Source validator (bostromvaloper1...)"),
        dst_validator: z.string().describe("Destination validator (bostromvaloper1...)"),
        amount: z.string().describe("Amount in base units"),
        denom: z.string().default("boot").describe("Token denom (default: boot)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ src_validator, dst_validator, amount, denom }) =>
      ok(await svc.redelegate(src_validator, dst_validator, amount, denom)),
    ),
  );

  server.registerTool(
    "wallet_claim_rewards",
    {
      description:
        "Claim staking rewards. If no validator specified, claims from all delegations.",
      inputSchema: {
        validator: z.string().optional().describe("Specific validator to claim from (optional — claims all if omitted)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ validator }) =>
      ok(await svc.claimRewards(validator)),
    ),
  );

  server.registerTool(
    "wallet_vote",
    {
      description:
        "Vote on a governance proposal. Options: yes, no, abstain, no_with_veto.",
      inputSchema: {
        proposal_id: z.number().min(1).describe("Proposal ID"),
        option: z.enum(["yes", "no", "abstain", "no_with_veto"]).describe("Vote option"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ proposal_id, option }) =>
      ok(await svc.vote(proposal_id, option)),
    ),
  );
}
