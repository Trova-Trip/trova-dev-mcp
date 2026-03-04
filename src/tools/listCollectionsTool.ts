import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { container } from "tsyringe";
import { SchemaService } from "../services";

export const registerListCollectionsTool = (server: McpServer): void => {
  server.registerTool(
    "list_collections",
    {
      description:
        "List all available MongoDB collections. Returns collection names in lowercase plural format (e.g., 'trips', 'users', 'bookings'). Use these names with read_schema. Call this first when you need to discover what collections exist.",
      inputSchema: {},
    },
    async () => {
      try {
        const schemaService = container.resolve(SchemaService);
        const collections = schemaService.listCollections();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(collections, null, 2),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
};
