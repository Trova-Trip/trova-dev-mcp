import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { container } from "tsyringe";
import { SchemaService } from "../services";

export const registerReadSchemaTool = (server: McpServer): void => {
  server.registerTool(
    "read_schema",
    {
      description:
        "Get the JSON schema for a MongoDB collection. USE THIS TOOL when writing MongoDB queries, aggregations, or working with Trova data models to understand available fields, types, relationships, and enums. Collection names are lowercase and plural (e.g., 'trips', 'users', 'bookings'). Use list_collections to see available names.",
      inputSchema: {
        collectionName: z
          .string()
          .describe(
            "Name of the MongoDB collection (lowercase, plural - e.g., 'trips', 'users', 'bookings')",
          ),
      },
    },
    async ({ collectionName }) => {
      try {
        const schemaService = container.resolve(SchemaService);
        const schema = schemaService.getSchema(collectionName);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(schema, null, 2),
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
