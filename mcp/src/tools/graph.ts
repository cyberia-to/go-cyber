import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, paginationHint, READ_ONLY_ANNOTATIONS } from "../util.js";
import * as svc from "../services/graph.js";

export function registerGraphTools(server: McpServer) {
  server.registerTool(
    "graph_search",
    {
      description: "Search cyberlinks by particle CID or neuron address. Returns linked particles and their creators.",
      inputSchema: {
        particle: z.string().optional().describe("CID of a particle to find links from/to"),
        neuron: z.string().optional().describe("Neuron address (bostrom1...) to find their links"),
        limit: z.number().min(1).max(100).default(20).describe("Max results"),
        offset: z.number().min(0).default(0).describe("Pagination offset"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ particle, neuron, limit, offset }) => {
      const result = await svc.searchCyberlinks({ particle, neuron, limit, offset });
      const pagination = paginationHint("graph_search", offset, limit, result.links);
      return ok({ ...result, ...(pagination && { pagination }) });
    }),
  );

  server.registerTool(
    "graph_rank",
    {
      description: "Get the cyberank score for a particle (CID). Higher rank = more important in the knowledge graph.",
      inputSchema: {
        particle: z.string().describe("CID of the particle"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ particle }) => ok(await svc.getRank(particle))),
  );

  server.registerTool(
    "graph_neuron",
    {
      description: "Get neuron profile: number of cyberlinks created",
      inputSchema: {
        address: z.string().describe("Neuron address (bostrom1...)"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address }) => ok(await svc.getNeuron(address))),
  );

  server.registerTool(
    "graph_particle",
    {
      description: "Fetch particle content by CID from IPFS. Returns text content (truncated at 50KB).",
      inputSchema: {
        cid: z.string().describe("IPFS CID of the particle"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ cid }) => {
      const content = await svc.getParticle(cid);
      return { content: [{ type: "text" as const, text: content }] };
    }),
  );

  server.registerTool(
    "graph_recent_links",
    {
      description: "Get the most recent cyberlinks created on Bostrom",
      inputSchema: {
        limit: z.number().min(1).max(100).default(20).describe("Max results"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ limit }) => {
      const links = await svc.getRecentLinks(limit);
      return ok(links);
    }),
  );

  server.registerTool(
    "graph_stats",
    {
      description: "Get knowledge graph statistics: total cyberlinks and active neurons",
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async () => ok(await svc.getGraphStats())),
  );
}
