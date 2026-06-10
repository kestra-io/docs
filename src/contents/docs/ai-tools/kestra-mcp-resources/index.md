---
title: "Kestra MCP Server: Plugins, Blueprints & Docs for AI Tools"
h1: Connect AI Tools to Kestra with the MCP Server
sidebarTitle: MCP Server
icon: /src/contents/docs/icons/ai.svg
description: Use the Kestra MCP server to give AI tools like Claude Code and Cursor live access to Kestra plugin documentation, blueprints, and product docs.
---

Give AI tools direct access to Kestra's plugin reference, blueprints library, and product documentation through a single MCP server.

## What is the Kestra MCP server

The Kestra MCP server implements the [Model Context Protocol](https://modelcontextprotocol.io/), a standard that lets AI tools query external data sources at runtime. Connect an AI coding agent to the Kestra MCP server to access:

- **Plugin reference**: task schemas, properties, inputs, outputs, and version history for all 1,400+ Kestra plugins
- **Blueprints**: ready-to-use flow templates for common integration patterns
- **Documentation**: searchable product docs — concepts, how-to guides, and reference pages

An agent configured with the Kestra MCP server retrieves current information about plugin behavior, configuration options, and usage patterns — rather than relying on static training data.

## Connect the MCP server

The Kestra MCP server is available at:

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

The Kestra MCP server exposes the following tools to your agent once connected:

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

The agent retrieves the live task schema and returns a structured summary:

```
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

The agent searches the blueprints library and returns matching flow YAML you can paste directly into the Kestra editor:

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

For prose questions — such as _"What does the `whenMissingInSource` property do in NamespaceSync?"_ — the agent retrieves and summarizes the relevant docs page directly.

## Relationship to other AI tools

The Kestra MCP server complements the other AI tools in this section:

- **[AI Copilot](../ai-copilot/index.md)**: generates and refines flows from natural language inside the Kestra UI.
- **[AI Agents](../ai-agents/index.md)**: autonomous task execution inside Kestra flows.
- **[Agent Skills](../agent-skills/index.md)**: structured knowledge files that teach coding agents how to build Kestra flows and operate environments.

If you primarily work in an AI coding agent like Claude Code or Cursor, the MCP server gives you current Kestra context while building flows.
