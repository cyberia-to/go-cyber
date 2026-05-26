import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, READ_ONLY_ANNOTATIONS } from "../util.js";
import * as svc from "../services/economy.js";

export function registerEconomyTools(server: McpServer) {
  server.registerTool(
    "economy_balances",
    {
      description: "Get all token balances for an address (BOOT, HYDROGEN, VOLT, AMPERE, LI, etc.)",
      inputSchema: {
        address: z.string().describe("Bostrom address (bostrom1...)"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address }) => ok(await svc.getBalances(address))),
  );

  server.registerTool(
    "economy_supply",
    {
      description: "Get total supply for a token denom. Use 'boot' for BOOT, full factory path for LI, etc.",
      inputSchema: {
        denom: z.string().describe("Token denom, e.g. 'boot', 'hydrogen', or full factory denom for LI"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ denom }) => ok(await svc.getSupply(denom))),
  );

  server.registerTool(
    "economy_mint_price",
    {
      description: "Get current Volt and Ampere mint prices (resources module)",
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async () => ok(await svc.getMintPrice())),
  );

  server.registerTool(
    "economy_staking",
    {
      description: "Get staking info for an address: delegations, rewards, and unbonding",
      inputSchema: {
        address: z.string().describe("Delegator address (bostrom1...)"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address }) => ok(await svc.getStaking(address))),
  );

  server.registerTool(
    "economy_pools",
    {
      description: "Get liquidity pool stats from the pools module",
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async () => ok(await svc.getPools())),
  );

  server.registerTool(
    "economy_inflation",
    {
      description: "Get current inflation rate and minting parameters",
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async () => ok(await svc.getInflation())),
  );
}
