#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// Read tools
import { registerGraphTools } from "./tools/graph.js";
import { registerEconomyTools } from "./tools/economy.js";
import { registerLithiumTools } from "./tools/lithium.js";
import { registerGovernanceTools } from "./tools/governance.js";
import { registerInfraTools } from "./tools/infra.js";
// Write tools
import { registerWalletTools } from "./tools/wallet.js";
import { registerGraphWriteTools } from "./tools/graph-write.js";
import { registerContractTools } from "./tools/contract.js";
import { registerLithiumWriteTools } from "./tools/lithium-write.js";
import { registerTokenFactoryTools } from "./tools/tokenfactory.js";
import { registerLiquidityTools } from "./tools/liquidity.js";
import { registerGridTools } from "./tools/grid.js";
import { registerIbcTools } from "./tools/ibc.js";

export function createServer() {
  const server = new McpServer({
    name: "bostrom",
    version: "0.5.0",
  });

  // Read tools (42)
  registerGraphTools(server);
  registerEconomyTools(server);
  registerLithiumTools(server);
  registerGovernanceTools(server);
  registerInfraTools(server);

  // Write tools (44)
  registerWalletTools(server);
  registerGraphWriteTools(server);
  registerContractTools(server);
  registerLithiumWriteTools(server);
  registerTokenFactoryTools(server);
  registerLiquidityTools(server);
  registerGridTools(server);
  registerIbcTools(server);

  return server;
}

export const createSandboxServer = createServer;

const isDirectRun = (() => {
  try {
    return import.meta.url && process.argv[1] === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
})();

if (isDirectRun) {
  const server = createServer();
  const transport = new StdioServerTransport();
  server.connect(transport).catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  });
}
