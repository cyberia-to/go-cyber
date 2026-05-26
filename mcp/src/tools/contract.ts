import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, WRITE_ANNOTATIONS } from "../util.js";
import * as svc from "../services/contract-exec.js";

export function registerContractTools(server: McpServer) {
  server.registerTool(
    "contract_execute",
    {
      description:
        "Execute a CosmWasm smart contract message. " +
        "Use this for generic contract interactions not covered by specialized tools.",
      inputSchema: {
        contract: z.string().describe("Contract address (bostrom1...)"),
        msg: z.record(z.unknown()).describe("Execute message as JSON object"),
        funds: z
          .array(z.object({
            denom: z.string(),
            amount: z.string(),
          }))
          .default([])
          .describe("Coins to send with the message"),
        memo: z.string().optional().describe("Transaction memo"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ contract, msg, funds, memo }) =>
      ok(await svc.executeContract(contract, msg, funds, memo)),
    ),
  );

  server.registerTool(
    "contract_execute_multi",
    {
      description:
        "Execute multiple contract messages in a single transaction. " +
        "More gas-efficient and atomic — all succeed or all fail.",
      inputSchema: {
        operations: z
          .array(z.object({
            contract: z.string().describe("Contract address"),
            msg: z.record(z.unknown()).describe("Execute message"),
            funds: z
              .array(z.object({ denom: z.string(), amount: z.string() }))
              .optional()
              .describe("Coins to send"),
          }))
          .min(1)
          .max(32)
          .describe("Array of contract operations"),
        memo: z.string().optional().describe("Transaction memo"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ operations, memo }) =>
      ok(await svc.executeContractMulti(operations, memo)),
    ),
  );

  server.registerTool(
    "wasm_upload",
    {
      description:
        "Upload CosmWasm contract bytecode (.wasm file) to the chain. " +
        "Returns a code_id for instantiation. Provide a local file path to the .wasm file.",
      inputSchema: {
        file_path: z.string().describe("Absolute path to the .wasm file on local filesystem"),
        memo: z.string().optional().describe("Transaction memo"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ file_path, memo }) =>
      ok(await svc.uploadCodeFromFile(file_path, memo)),
    ),
  );

  server.registerTool(
    "wasm_instantiate",
    {
      description:
        "Instantiate a CosmWasm contract from a code ID. " +
        "Creates a new contract instance with the given initialization message. " +
        "Set admin to your address to allow future migrations.",
      inputSchema: {
        code_id: z.number().min(1).describe("Code ID from wasm_upload"),
        msg: z.record(z.unknown()).describe("Instantiation message (JSON)"),
        label: z.string().describe("Human-readable label for the contract"),
        funds: z
          .array(z.object({ denom: z.string(), amount: z.string() }))
          .default([])
          .describe("Initial funds to send to the contract"),
        admin: z.string().optional().describe("Admin address (for migrations). If omitted, contract is immutable."),
        memo: z.string().optional().describe("Transaction memo"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ code_id, msg, label, funds, admin, memo }) =>
      ok(await svc.instantiateContract(code_id, msg, label, funds, admin, memo)),
    ),
  );

  server.registerTool(
    "wasm_migrate",
    {
      description:
        "Migrate a CosmWasm contract to a new code ID. " +
        "Only the contract admin can migrate. Runs the migrate entry point.",
      inputSchema: {
        contract: z.string().describe("Contract address to migrate"),
        new_code_id: z.number().min(1).describe("New code ID to migrate to"),
        msg: z.record(z.unknown()).describe("Migration message (JSON)"),
        memo: z.string().optional().describe("Transaction memo"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ contract, new_code_id, msg, memo }) =>
      ok(await svc.migrateContract(contract, new_code_id, msg, memo)),
    ),
  );

  server.registerTool(
    "wasm_update_admin",
    {
      description:
        "Update the admin of a CosmWasm contract. " +
        "Only the current admin can update it.",
      inputSchema: {
        contract: z.string().describe("Contract address"),
        new_admin: z.string().describe("New admin address (bostrom1...)"),
        memo: z.string().optional().describe("Transaction memo"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ contract, new_admin, memo }) =>
      ok(await svc.updateContractAdmin(contract, new_admin, memo)),
    ),
  );

  server.registerTool(
    "wasm_clear_admin",
    {
      description:
        "Clear the admin of a CosmWasm contract, making it immutable. " +
        "WARNING: This is irreversible — no future migrations possible.",
      inputSchema: {
        contract: z.string().describe("Contract address"),
        memo: z.string().optional().describe("Transaction memo"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ contract, memo }) =>
      ok(await svc.clearContractAdmin(contract, memo)),
    ),
  );
}
