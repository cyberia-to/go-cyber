import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, WRITE_ANNOTATIONS, READ_ONLY_ANNOTATIONS } from "../util.js";
import * as svc from "../services/ibc.js";

export function registerIbcTools(server: McpServer) {
  server.registerTool(
    "ibc_transfer",
    {
      description:
        "Transfer tokens to another chain via IBC. " +
        "Use ibc_channels to find the correct channel ID.",
      inputSchema: {
        channel: z.string().describe("IBC channel ID (e.g. 'channel-2')"),
        denom: z.string().describe("Token denom to transfer"),
        amount: z.string().describe("Amount (base units)"),
        receiver: z.string().describe("Receiver address on destination chain"),
        timeout_minutes: z.number().min(1).max(1440).default(10).describe("Timeout in minutes (default: 10)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ channel, denom, amount, receiver, timeout_minutes }) =>
      ok(await svc.ibcTransfer(channel, denom, amount, receiver, timeout_minutes)),
    ),
  );

  server.registerTool(
    "ibc_channels",
    {
      description:
        "List active IBC channels with counterparty info.",
      inputSchema: {},
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async () =>
      ok(await svc.listChannels()),
    ),
  );
}
