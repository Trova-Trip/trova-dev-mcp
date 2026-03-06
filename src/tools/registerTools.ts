import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerReadSchemaTool } from "./readSchemaTool";
import { registerListCollectionsTool } from "./listCollectionsTool";
import { registerExecuteAggregationTool } from "./executeAggregationTool";

export const registerAllTools = (server: McpServer): void => {
  registerReadSchemaTool(server);
  registerListCollectionsTool(server);
  registerExecuteAggregationTool(server);
};
