import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ok,
  safe,
  WRITE_ANNOTATIONS,
  IDEMPOTENT_WRITE_ANNOTATIONS,
  READ_ONLY_ANNOTATIONS,
} from "../util.js";
import * as svc from "../services/tokenfactory.js";

export function registerTokenFactoryTools(server: McpServer) {
  server.registerTool(
    "token_create",
    {
      description:
        "Create a new TokenFactory denom. WARNING: costs ~10,000 BOOT. " +
        "Denom will be factory/{your_address}/{subdenom}.",
      inputSchema: {
        subdenom: z.string().min(1).max(44).describe("Subdenom name (e.g. 'mytoken')"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ subdenom }) =>
      ok(await svc.createDenom(subdenom)),
    ),
  );

  server.registerTool(
    "token_set_metadata",
    {
      description:
        "Set human-readable metadata for a TokenFactory denom (name, symbol, description). " +
        "Idempotent — safe to call again with updated values.",
      inputSchema: {
        denom: z.string().describe("Full denom (factory/{addr}/{subdenom})"),
        name: z.string().describe("Token display name"),
        symbol: z.string().describe("Token symbol (e.g. 'MYT')"),
        description: z.string().describe("Token description"),
        exponent: z.number().min(0).max(18).default(0).describe("Decimal exponent (0 for no decimals, 6 for micro-units)"),
      },
      annotations: IDEMPOTENT_WRITE_ANNOTATIONS,
    },
    safe(async ({ denom, name, symbol, description, exponent }) =>
      ok(await svc.setDenomMetadata(denom, name, symbol, description, exponent)),
    ),
  );

  server.registerTool(
    "token_mint",
    {
      description:
        "Mint new tokens to a specified address. Must be denom admin.",
      inputSchema: {
        denom: z.string().describe("Full denom (factory/{addr}/{subdenom})"),
        amount: z.string().describe("Amount to mint (base units)"),
        mint_to: z.string().describe("Recipient address (bostrom1...)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ denom, amount, mint_to }) =>
      ok(await svc.mintTokens(denom, amount, mint_to)),
    ),
  );

  server.registerTool(
    "token_burn",
    {
      description:
        "Burn tokens from a specified address. Must be denom admin.",
      inputSchema: {
        denom: z.string().describe("Full denom (factory/{addr}/{subdenom})"),
        amount: z.string().describe("Amount to burn (base units)"),
        burn_from: z.string().describe("Address to burn from (bostrom1...)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ denom, amount, burn_from }) =>
      ok(await svc.burnTokens(denom, amount, burn_from)),
    ),
  );

  server.registerTool(
    "token_change_admin",
    {
      description:
        "Transfer admin rights for a denom to a new address. Irreversible.",
      inputSchema: {
        denom: z.string().describe("Full denom (factory/{addr}/{subdenom})"),
        new_admin: z.string().describe("New admin address (bostrom1...)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ denom, new_admin }) =>
      ok(await svc.changeAdmin(denom, new_admin)),
    ),
  );

  server.registerTool(
    "token_list_created",
    {
      description:
        "List all TokenFactory denoms created by the agent wallet.",
      inputSchema: {},
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async () =>
      ok(await svc.listCreatedDenoms()),
    ),
  );
}
