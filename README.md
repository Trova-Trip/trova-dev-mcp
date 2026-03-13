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

### 1. [Install Bun](https://bun.com/docs/installation)

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

Create a .env file following environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URI` | MongoDB connection URI |
| `DATABASE_USERNAME` | Database username |
| `DATABASE_PASSWORD` | Database password |

## Generating the MCP Config

Run the config generator to get a ready-to-paste JSON config with your resolved paths and credentials:

```sh
bun run generate-config
```

This resolves the absolute path to your `bun` binary and entry file automatically. If no `.env` file exists, it falls back to `.env.example` placeholders.

## Connecting to Claude Desktop

1. Generate the config: `bun run generate-config`
2. Open **Claude Desktop** > **Settings** (`Cmd + ,`) > **Developer** > **Edit Config**
3. Merge the generated output into the `mcpServers` key in `claude_desktop_config.json`
4. Restart Claude Desktop

After restarting, the trova-dev tools should appear in your Claude Desktop chat.

## Connecting to ChatGPT Desktop

1. Generate the config: `bun run generate-config`
2. Open **ChatGPT Desktop** > **Settings** (`Cmd + ,`) > **Tools & integrations** > **Add MCP tool** > **Add manually**
3. Enter a name (e.g., `trova-dev`) and paste the generated config values:
   - **Command**: the `command` value from the generated config (path to `bun`)
   - **Args**: the `args` values (e.g., `run /absolute/path/to/src/index.ts`)
   - **Env vars**: add each key-value pair from the `env` object
4. Click **Add** and the trova-dev tools should appear in your ChatGPT chat

## Connecting to Claude Code (CLI)

1. Generate the config: `bun run generate-config`
2. Merge the generated output into the `mcpServers` key in `~/.claude.json`

## Running standalone

```sh
DATABASE_URI=... DATABASE_USERNAME=... DATABASE_PASSWORD=... bun run src/index.ts
```

## Development

```sh
DATABASE_URI=... DATABASE_USERNAME=... DATABASE_PASSWORD=... bun run dev
```

This starts the server with `--watch` for automatic restarts on file changes.
