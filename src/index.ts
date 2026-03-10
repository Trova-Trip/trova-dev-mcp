import "reflect-metadata";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { container } from "./container";
import { MongoConnectionService } from "./services";
import { registerAllTools } from "./tools";

const server = new McpServer({
  name: "trova-dev",
  version: "1.0.0",
});

registerAllTools(server);

const main = async () => {
  try {
    const mongoConnection = container.resolve(MongoConnectionService);
    await mongoConnection.connect();

    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

main();
