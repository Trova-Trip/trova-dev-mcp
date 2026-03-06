import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { container } from "tsyringe";
import { QueryService } from "../services";

export const registerExecuteAggregationTool = (server: McpServer): void => {
  server.registerTool(
    "execute_aggregation",
    {
      description:
        "Execute a MongoDB aggregation pipeline on a collection. Use MongoDB shell syntax for each stage. Returns aggregated results based on the pipeline stages provided.",
      inputSchema: {
        collectionName: z
          .string()
          .describe("The MongoDB collection name to run the aggregation on"),
        pipeline: z
          .array(z.string())
          .describe(
            'Array of aggregation stages in MongoDB shell syntax. Examples: ["{\\"$match\\": {\\"status\\": \\"active\\"}}", "{\\"$group\\": {\\"_id\\": \\"$category\\", \\"count\\": {\\"$sum\\": 1}}}"]',
          ),
      },
    },
    async ({ collectionName, pipeline }) => {
      const queryService = container.resolve(QueryService);
      const result = await queryService.executeAggregation(
        collectionName,
        pipeline,
      );

      if (!result.success) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: result.error,
                  message: result.message,
                  hint: result.hint,
                  stageIndex: result.stageIndex,
                },
                null,
                2,
              ),
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.results, null, 2),
          },
        ],
      };
    },
  );
};
