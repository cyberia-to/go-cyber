import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, paginationHint, READ_ONLY_ANNOTATIONS } from "../util.js";
import * as svc from "../services/governance.js";

export function registerGovernanceTools(server: McpServer) {
  server.registerTool(
    "gov_proposals",
    {
      description: "List governance proposals. Filter by status: active (voting), passed, rejected, or all.",
      inputSchema: {
        status: z
          .enum([
            "PROPOSAL_STATUS_VOTING_PERIOD",
            "PROPOSAL_STATUS_PASSED",
            "PROPOSAL_STATUS_REJECTED",
            "PROPOSAL_STATUS_DEPOSIT_PERIOD",
            "all",
          ])
          .default("all")
          .describe("Filter by proposal status"),
        limit: z.number().min(1).max(50).default(10),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ status, limit }) => {
      const proposals = await svc.getProposals(status, limit);
      const pagination = paginationHint("gov_proposals", 0, limit, proposals);
      return ok({ proposals, ...(pagination && { pagination }) });
    }),
  );

  server.registerTool(
    "gov_proposal_detail",
    {
      description: "Get full proposal details including vote tally",
      inputSchema: {
        proposal_id: z.string().describe("Proposal ID number"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ proposal_id }) => ok(await svc.getProposalDetail(proposal_id))),
  );

  server.registerTool(
    "gov_validators",
    {
      description: "Get the active validator set with moniker, commission, and voting power",
      inputSchema: {
        status: z
          .enum(["BOND_STATUS_BONDED", "BOND_STATUS_UNBONDED", "BOND_STATUS_UNBONDING"])
          .default("BOND_STATUS_BONDED")
          .describe("Validator bond status"),
        limit: z.number().min(1).max(200).default(50),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ status, limit }) => {
      const validators = await svc.getValidators(status, limit);
      const pagination = paginationHint("gov_validators", 0, limit, validators);
      return ok({ validators, ...(pagination && { pagination }) });
    }),
  );

  server.registerTool(
    "gov_params",
    {
      description: "Get chain parameters: staking, slashing, governance, distribution, or minting params",
      inputSchema: {
        module: z
          .enum(["staking", "slashing", "gov", "distribution", "mint"])
          .describe("Module to get params for"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ module }) => ok(await svc.getParams(module))),
  );
}
