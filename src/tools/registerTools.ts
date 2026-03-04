import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerReadSchemaTool } from "./readSchemaTool";
import { registerListCollectionsTool } from "./listCollectionsTool";

export const registerAllTools = (server: McpServer): void => {
  registerReadSchemaTool(server);
  registerListCollectionsTool(server);
};
