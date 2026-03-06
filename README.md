# trova-dev MCP Server

An MCP (Model Context Protocol) server that exposes Trova development tools to AI assistants like Claude. It connects to the Trova MongoDB database and provides tools for exploring schemas and running aggregation queries.

## Available Tools

| Tool | Description |
|------|-------------|
| `list_collections` | List all available MongoDB collections |
| `read_schema` | Get the schema for a collection (fields, types, refs, enums) |
| `execute_aggregation` | Run a MongoDB aggregation pipeline on a collection |

## Prerequisites

- [Bun](https://bun.sh) runtime
- Access to the Trova MongoDB database

## Setup

### 1. Install Bun

```sh
curl -fsSL https://bun.sh/install | bash
```

### 2. Clone and install dependencies

```sh
git clone <repo-url>
cd trova-dev-mcp-server
bun install
```

### 3. Configure environment variables

The server requires the following environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URI` | MongoDB connection URI |
| `DATABASE_USERNAME` | Database username |
| `DATABASE_PASSWORD` | Database password |

## Connecting to Claude Desktop

1. Open **Claude Desktop**
2. Go to **Settings** (`Cmd + ,` on macOS)
3. Click **Developer** in the left sidebar
4. Click **Edit Config** to open `claude_desktop_config.json`
5. Add the following configuration:

```json
{
  "mcpServers": {
    "trova-dev": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/trova-dev-mcp-server/src/index.ts"],
      "env": {
        "DATABASE_URI": "your-database-uri",
        "DATABASE_USERNAME": "your-username",
        "DATABASE_PASSWORD": "your-password"
      }
    }
  }
}
```

6. Replace `/absolute/path/to/` with the actual path where you cloned the repo
7. Fill in the database credentials
8. Restart Claude Desktop

After restarting, the trova-dev tools should appear in your Claude Desktop chat.

## Connecting to Claude Code (CLI)

Add the same configuration to `~/.claude.json`:

```json
{
  "mcpServers": {
    "trova-dev": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/trova-dev-mcp-server/src/index.ts"],
      "env": {
        "DATABASE_URI": "your-database-uri",
        "DATABASE_USERNAME": "your-username",
        "DATABASE_PASSWORD": "your-password"
      }
    }
  }
}
```

## Running standalone

```sh
DATABASE_URI=... DATABASE_USERNAME=... DATABASE_PASSWORD=... bun run src/index.ts
```

## Development

```sh
DATABASE_URI=... DATABASE_USERNAME=... DATABASE_PASSWORD=... bun run dev
```

This starts the server with `--watch` for automatic restarts on file changes.
