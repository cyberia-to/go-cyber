import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, WRITE_ANNOTATIONS, READ_ONLY_ANNOTATIONS } from "../util.js";
import * as svc from "../services/liquidity.js";

export function registerLiquidityTools(server: McpServer) {
  server.registerTool(
    "liquidity_create_pool",
    {
      description:
        "Create a new Gravity DEX liquidity pool. WARNING: costs ~1,000 BOOT. " +
        "Deposit coins are sorted alphabetically by denom automatically.",
      inputSchema: {
        denom_a: z.string().describe("First token denom"),
        amount_a: z.string().describe("First token amount (base units)"),
        denom_b: z.string().describe("Second token denom"),
        amount_b: z.string().describe("Second token amount (base units)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ denom_a, amount_a, denom_b, amount_b }) =>
      ok(await svc.createPool(denom_a, amount_a, denom_b, amount_b)),
    ),
  );

  server.registerTool(
    "liquidity_deposit",
    {
      description:
        "Deposit tokens into an existing liquidity pool. " +
        "Executes in batch at end of block.",
      inputSchema: {
        pool_id: z.number().min(1).describe("Pool ID"),
        denom_a: z.string().describe("First token denom"),
        amount_a: z.string().describe("First token amount"),
        denom_b: z.string().describe("Second token denom"),
        amount_b: z.string().describe("Second token amount"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ pool_id, denom_a, amount_a, denom_b, amount_b }) =>
      ok(await svc.deposit(pool_id, denom_a, amount_a, denom_b, amount_b)),
    ),
  );

  server.registerTool(
    "liquidity_withdraw",
    {
      description:
        "Withdraw LP tokens from a pool to receive underlying assets. " +
        "Executes in batch at end of block.",
      inputSchema: {
        pool_id: z.number().min(1).describe("Pool ID"),
        pool_coin_amount: z.string().describe("Amount of LP tokens to withdraw"),
        pool_coin_denom: z.string().describe("LP token denom (pool{id} format)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ pool_id, pool_coin_amount, pool_coin_denom }) =>
      ok(await svc.withdraw(pool_id, pool_coin_amount, pool_coin_denom)),
    ),
  );

  server.registerTool(
    "liquidity_swap",
    {
      description:
        "Swap tokens via a Gravity DEX pool. " +
        "Batched execution: swap executes at end of block, not immediately. " +
        "order_price is the limit price (use pool price for market swap).",
      inputSchema: {
        pool_id: z.number().min(1).describe("Pool ID"),
        offer_denom: z.string().describe("Denom you are selling"),
        offer_amount: z.string().describe("Amount you are selling (base units)"),
        demand_denom: z.string().describe("Denom you want to receive"),
        order_price: z.string().describe("Limit price (decimal string, e.g. '1.5')"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ pool_id, offer_denom, offer_amount, demand_denom, order_price }) =>
      ok(await svc.swap(pool_id, offer_denom, offer_amount, demand_denom, order_price)),
    ),
  );

  server.registerTool(
    "liquidity_pool_detail",
    {
      description:
        "Get pool details: reserves, parameters, current batch info.",
      inputSchema: {
        pool_id: z.number().min(1).describe("Pool ID"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ pool_id }) =>
      ok(await svc.getPoolDetail(pool_id)),
    ),
  );

  server.registerTool(
    "swap_tokens",
    {
      description:
        "Swap tokens using Gravity DEX. Auto-discovers the right pool and calculates market price. " +
        "Applies slippage tolerance (default 3%). Batched execution: swap executes at end of block. " +
        "Use swap_estimate first to preview the swap.",
      inputSchema: {
        offer_denom: z.string().describe("Denom you are selling (e.g. 'boot', 'hydrogen')"),
        offer_amount: z.string().describe("Amount you are selling (base units)"),
        demand_denom: z.string().describe("Denom you want to receive"),
        slippage_percent: z.number().min(0).max(50).default(3).describe("Slippage tolerance in percent (default 3)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ offer_denom, offer_amount, demand_denom, slippage_percent }) =>
      ok(await svc.swapTokens(offer_denom, offer_amount, demand_denom, slippage_percent)),
    ),
  );

  server.registerTool(
    "swap_estimate",
    {
      description:
        "Estimate a token swap: find the pool, get current price, and calculate expected output. " +
        "Does not execute any transaction — use swap_tokens to execute.",
      inputSchema: {
        offer_denom: z.string().describe("Denom you are selling"),
        offer_amount: z.string().describe("Amount you are selling (base units)"),
        demand_denom: z.string().describe("Denom you want to receive"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ offer_denom, offer_amount, demand_denom }) => {
      const found = await svc.findPool(offer_denom, demand_denom);
      if (!found) {
        return ok({
          error: `No pool found for ${offer_denom}/${demand_denom}`,
          hint: "Check available pools with economy_pools",
        });
      }
      const { pool, reserves } = found;
      const offerReserve = Number(reserves[offer_denom] || "0");
      const demandReserve = Number(reserves[demand_denom] || "0");
      const marketPrice = offerReserve / demandReserve;
      const estimatedOutput = Math.floor(Number(offer_amount) * demandReserve / offerReserve);
      // Swap fee (0.3% from params, half from each side)
      const feeAmount = Math.ceil(Number(offer_amount) * 0.003 / 2);
      return ok({
        poolId: parseInt(pool.id),
        poolDenoms: pool.reserve_coin_denoms,
        reserves,
        marketPrice: marketPrice.toFixed(8),
        estimatedOutput: String(estimatedOutput),
        offerCoinFee: String(feeAmount),
        note: "Estimates only — actual execution depends on batch settlement",
      });
    }),
  );
}
