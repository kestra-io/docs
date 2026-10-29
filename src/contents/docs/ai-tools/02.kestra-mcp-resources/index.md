---
title: "Kestra Docs MCP Server for AI Coding Agents"
h1: Connect Your Coding Agent to Kestra Docs and Plugin Schemas
sidebarTitle: Docs MCP Server
icon: /src/contents/docs/icons/ai.svg
description: Connect Claude Code, Cursor, or another coding agent to the hosted Kestra MCP server for live plugin schemas, blueprints, and docs while you write flows.
---

Give your coding agent live access to Kestra plugin schemas, blueprints, and documentation through a hosted MCP server.

This page is for developers who write flows in Claude Code, Cursor, Codex, or another coding agent. The server is public, read-only, and hosted by Kestra; it doesn't connect to your Kestra instance. To let AI agents run *your* flows as tools, see [Flow MCP servers](../07.mcp-server/index.md).

## What the server provides

The Docs MCP server implements the [Model Context Protocol](https://modelcontextprotocol.io/), a standard that lets AI tools query external data sources at runtime. Once connected, your agent can look up:

- **Plugin reference**: task schemas, properties, inputs, outputs, and version history for every Kestra plugin
- **Blueprints**: ready-to-use flow templates for common integration patterns
- **Documentation**: searchable product docs, including concepts, how-to guides, and reference pages

With the server connected, the agent checks current plugin properties instead of guessing them from training data.

## Connect the MCP server

The server URL is:

```plaintext
https://api.kestra.io/v1/mcp
```

### Claude Code

Add the server with the Claude Code CLI:

```bash
claude mcp add kestra --transport http https://api.kestra.io/v1/mcp
```

Or add it directly to `~/.claude.json`:

```json
{
  "mcpServers": {
    "kestra": {
      "type": "http",
      "url": "https://api.kestra.io/v1/mcp"
    }
  }
}
```

### Cursor

Add the following to your Cursor MCP configuration (`.cursor/mcp.json` in your project or `~/.cursor/mcp.json` globally):

```json
{
  "mcpServers": {
    "kestra": {
      "url": "https://api.kestra.io/v1/mcp"
    }
  }
}
```

### Other AI tools

Any MCP-compatible tool can connect using the HTTP transport and the URL above. Refer to your tool's documentation for the exact configuration format.

## Available tools

Once connected, the server exposes these tools to your agent:

| Category | Tools |
| --- | --- |
| Plugins | List plugins, browse tasks by plugin, retrieve task schemas, check plugin versions |
| Blueprints | Search and browse blueprints, retrieve full blueprint flow YAML |
| Docs | Search documentation, retrieve pages, navigate doc hierarchy |
| Reference | List task runners, triggers, secret managers, storage backends, log exporters |

## Example usage

### Plugin schema lookup

Ask your agent about a specific task's properties:

> "What properties does the `io.kestra.plugin.jdbc.postgresql.Query` task accept?"

The agent retrieves the live task schema and returns a summary similar to this:

```text
io.kestra.plugin.jdbc.postgresql.Query — key properties:

- url (string, required): JDBC connection string, e.g. jdbc:postgresql://host:5432/db
- username (string, required)
- password (string, required): use {{ secret('KEY') }} to avoid storing credentials in plain text
- sql (string, required): the SQL query to execute
- fetchType (enum): FETCH, FETCH_ONE, STORE, or NONE — controls how results are returned
- fetchSize (integer): rows per fetch batch, default 1000
```

### Blueprint retrieval

Ask your agent to find a blueprint by use case:

> "Find a blueprint for triggering a flow when a file lands in S3."

The agent searches the blueprints library and returns matching flow YAML. The excerpt below shows the shape of a result; the full blueprint includes every task property:

```yaml
id: s3_trigger
namespace: company.team

tasks:
  - id: process
    type: io.kestra.plugin.scripts.python.Script
    # ...

triggers:
  - id: watch
    type: io.kestra.plugin.aws.s3.Trigger
    bucket: your-bucket
    prefix: incoming/
    interval: PT1M
```

### Documentation lookup

For prose questions, such as _"What does the `whenMissingInSource` property do in NamespaceSync?"_, the agent retrieves and summarizes the relevant docs page.

## Next steps

- [Agent Skills](../03.agent-skills/index.md): teach your coding agent how to write, harden, and deploy flows. Skills and this server work together.
- [`kestractl`](../../kestra-cli/kestractl/index.md): let the agent validate and deploy flows to your instance.
- [Docs for Agents](../04.docs-for-agents/index.md): every other machine-readable Kestra resource, such as `llms.txt`, Markdown docs, and OpenAPI specs.
