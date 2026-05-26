import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, paginationHint, READ_ONLY_ANNOTATIONS } from "../util.js";
import * as svc from "../services/infra.js";

export function registerInfraTools(server: McpServer) {
  server.registerTool(
    "infra_chain_status",
    {
      description: "Get current Bostrom chain status: latest block height, time, chain ID, sync status",
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async () => ok(await svc.getChainStatus())),
  );

  server.registerTool(
    "infra_tx_search",
    {
      description: "Search transactions by sender address, contract address, or message type.",
      inputSchema: {
        sender: z.string().optional().describe("Filter by sender address (bostrom1...)"),
        contract: z.string().optional().describe("Filter by contract address"),
        message_type: z.string().optional().describe("Filter by message type, e.g. /cosmwasm.wasm.v1.MsgExecuteContract"),
        limit: z.number().min(1).max(50).default(10).describe("Max results"),
        offset: z.number().min(0).default(0).describe("Pagination offset"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ sender, contract, message_type, limit, offset }) => {
      const result = await svc.searchTxs({
        sender,
        contract,
        messageType: message_type,
        limit,
        offset,
      });
      const pagination = paginationHint("infra_tx_search", offset, limit, result.txs);
      return ok({ ...result, ...(pagination && { pagination }) });
    }),
  );

  server.registerTool(
    "infra_tx_detail",
    {
      description: "Get full decoded transaction by hash",
      inputSchema: {
        txhash: z.string().describe("Transaction hash"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ txhash }) => ok(await svc.getTxDetail(txhash))),
  );
}
