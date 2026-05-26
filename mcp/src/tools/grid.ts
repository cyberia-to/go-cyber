import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safe, WRITE_ANNOTATIONS, READ_ONLY_ANNOTATIONS } from "../util.js";
import * as svc from "../services/grid.js";

export function registerGridTools(server: McpServer) {
  server.registerTool(
    "grid_create_route",
    {
      description:
        "Create an energy route to allocate VOLT/AMPERE to another address.",
      inputSchema: {
        destination: z.string().describe("Destination address (bostrom1...)"),
        name: z.string().describe("Route name/label"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ destination, name }) =>
      ok(await svc.createRoute(destination, name)),
    ),
  );

  server.registerTool(
    "grid_edit_route",
    {
      description:
        "Edit an existing energy route's allocated value.",
      inputSchema: {
        destination: z.string().describe("Route destination address"),
        amount: z.string().describe("Amount to allocate (base units)"),
        denom: z.string().describe("Resource denom (millivolt or milliampere)"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ destination, amount, denom }) =>
      ok(await svc.editRoute(destination, amount, denom)),
    ),
  );

  server.registerTool(
    "grid_delete_route",
    {
      description:
        "Delete an energy route.",
      inputSchema: {
        destination: z.string().describe("Route destination address to delete"),
      },
      annotations: WRITE_ANNOTATIONS,
    },
    safe(async ({ destination }) =>
      ok(await svc.deleteRoute(destination)),
    ),
  );

  server.registerTool(
    "grid_list_routes",
    {
      description:
        "List all energy routes from an address. If no address, uses agent wallet.",
      inputSchema: {
        address: z.string().optional().describe("Source address (optional — defaults to agent wallet)"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    safe(async ({ address }) =>
      ok(await svc.listRoutes(address)),
    ),
  );
}
