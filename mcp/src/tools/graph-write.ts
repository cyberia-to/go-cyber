import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, WRITE_ANNOTATIONS } from "../util.js";
import * as svc from "../services/graph-write.js";

export function registerGraphWriteTools(server: McpServer) {
  server.registerTool(
    "graph_create_cyberlink",
    {
      description:
        "Create a cyberlink between two CIDs in the knowledge graph. " +
        "Requires VOLT and AMPERE energy (use graph_investmint to get them).",
      inputSchema: {
        from_cid: z.string().describe("Source particle CID"),
        to_cid: z.string().describe("Destination particle CID"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ from_cid, to_cid }) =>
      ok(await svc.createCyberlink(from_cid, to_cid)),
    ),
  );

  server.registerTool(
    "graph_create_cyberlinks",
    {
      description:
        "Create multiple cyberlinks in a single transaction (batch). " +
        "More gas-efficient than individual calls.",
      inputSchema: {
        links: z
          .array(z.object({
            from: z.string().describe("Source CID"),
            to: z.string().describe("Destination CID"),
          }))
          .min(1)
          .max(64)
          .describe("Array of {from, to} CID pairs"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ links }) =>
      ok(await svc.createCyberlinks(links)),
    ),
  );

  server.registerTool(
    "graph_investmint",
    {
      description:
        "Convert HYDROGEN into millivolt or milliampere energy. " +
        "VOLT powers cyberlink creation, AMPERE powers bandwidth. " +
        "Length = number of base periods (~5 days each).",
      inputSchema: {
        amount: z.string().describe("Amount of HYDROGEN to investmint (base units)"),
        resource: z.enum(["millivolt", "milliampere"]).describe("Resource type"),
        length: z.number().min(1).describe("Number of base periods"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ amount, resource, length }) =>
      ok(await svc.investmint(amount, resource, length)),
    ),
  );

  server.registerTool(
    "graph_pin_content",
    {
      description:
        "Pin text content to IPFS and return the CID. " +
        "Use the returned CID with graph_create_cyberlink to add to knowledge graph.",
      inputSchema: {
        content: z.string().min(1).max(100_000).describe("Text content to pin"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ content }) =>
      ok(await svc.pinContent(content)),
    ),
  );

  server.registerTool(
    "graph_create_knowledge",
    {
      description:
        "Compound: pin content to IPFS then create cyberlink(s). " +
        "Provide from_cid to link FROM an existing particle TO the new content, " +
        "and/or to_cid to link FROM the new content TO an existing particle.",
      inputSchema: {
        content: z.string().min(1).max(100_000).describe("Text content to pin"),
        from_cid: z.string().optional().describe("Existing CID to link FROM (→ new content)"),
        to_cid: z.string().optional().describe("Existing CID to link TO (new content →)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ content, from_cid, to_cid }) =>
      ok(await svc.createKnowledge(content, from_cid, to_cid)),
    ),
  );
}
