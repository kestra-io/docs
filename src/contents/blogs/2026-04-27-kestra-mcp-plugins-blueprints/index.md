---
title: "Kestra MCP: A Live Plugin and Blueprint Catalog for AI Coding Agents"
description: "The Kestra MCP server exposes the full plugin registry and Blueprint catalog as Model Context Protocol tools. Connect any AI coding agent to it once, and it can discover plugins, inspect task schemas, and fetch ready-made flow YAML without leaving the conversation."
date: 2026-04-27T09:00:00
category: Solutions
author:
  name: François Delbrayelle
  linkedin: https://www.linkedin.com/in/fdelbrayelle/
  image: fdelbrayelle
  role: Lead Software Engineer
image: ./main.png
schema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity:
    - "@type": "Question"
      name: "What is the Kestra MCP server?"
      acceptedAnswer:
        "@type": "Answer"
        text: "The Kestra MCP server is a remote HTTP endpoint at https://api.kestra.io/v1/mcp that implements the Model Context Protocol. It exposes Kestra's full plugin registry and blueprint catalog as 13 read-only callable tools, so AI coding agents can discover plugins, list tasks, fetch task schemas, and retrieve blueprint templates without leaving their environment."
    - "@type": "Question"
      name: "How do I connect Claude Code to the Kestra MCP server?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Run: claude mcp add --transport http kestra https://api.kestra.io/v1/mcp. This registers the MCP server for the current project. Add --scope user to make it available globally across all projects."
    - "@type": "Question"
      name: "What tools does the Kestra MCP server expose?"
      acceptedAnswer:
        "@type": "Answer"
        text: "It provides 13 tools: list_plugins, plugin_tasks, versions, list_task_runners, list_triggers, list_storages, list_secret_managers, list_log_exporters, plugin_versions, blueprints, get_blueprint_flow, search, and task_schema. Together they let an agent explore the full plugin ecosystem, inspect task schemas, and retrieve ready-made flow templates."
    - "@type": "Question"
      name: "Does the Kestra MCP server require authentication?"
      acceptedAnswer:
        "@type": "Answer"
        text: "No. The public endpoint at https://api.kestra.io/v1/mcp is open and requires no API key or login. All 13 tools are read-only."
    - "@type": "Question"
      name: "Can I use the Kestra MCP server with AI agents other than Claude Code?"
      acceptedAnswer:
        "@type": "Answer"
        text: "Yes. Any MCP-compatible client works: Codex CLI, Gemini CLI, OpenCode, or any agent framework that supports MCP over HTTP. The endpoint is the same for all clients: https://api.kestra.io/v1/mcp."
---

Writing a Kestra flow from scratch means knowing what [plugins](/plugins) exist, which tasks they expose, and what properties each task accepts. For simple, familiar workflows this is fine. For anything more complex — choosing the right S3 trigger variant, checking what secret managers are supported, or confirming whether a [Blueprint](../../docs/06.concepts/07.blueprints/index.md) already covers your use case — you end up context-switching to the docs browser mid-task.

The Kestra MCP server eliminates that friction. It is a remote HTTP server at `https://api.kestra.io/v1/mcp` that speaks the [Model Context Protocol](https://modelcontextprotocol.io), exposing the full Kestra plugin registry and Blueprint catalog as callable tools. Connect it to your AI coding agent once; from that point, the agent can discover plugins, inspect task schemas, and fetch Blueprint YAML without ever leaving the conversation.

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io) is an open standard for connecting AI agents to external tools over a well-defined interface. An MCP server declares a set of tools; a compatible client (your AI agent) invokes them by name and receives structured results. Because MCP is transport-agnostic, the Kestra server uses HTTP with Server-Sent Events — no local process to install or manage, just a URL.

## Connecting Claude Code

Add the Kestra MCP server to Claude Code with a single command:

```bash
# Project-scoped (stores in .claude/settings.json in current repo)
claude mcp add --transport http kestra https://api.kestra.io/v1/mcp

# User-scoped (global, available in every project)
claude mcp add --transport http --scope user kestra https://api.kestra.io/v1/mcp
```

Or add it manually to `.claude/settings.json`:

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

Once connected, the 13 tools are immediately available in every Claude Code session. You can verify with `/mcp`, or simply start a flow-writing task — Claude will invoke the relevant tools automatically.

## What the server exposes

All 13 tools carry `readOnlyHint: true`. The server is a pure catalog; it never modifies state.

### Plugin discovery

| Tool | What it returns |
|------|-----------------|
| `list_plugins` | All loaded plugins with name, categories, and counts per element type (tasks, triggers, task runners, storages, secret managers, log exporters). Optional `category` filter: `AI`, `ALERTING`, `BUSINESS`, `CLOUD`, `CORE`, `DATA`, `INFRASTRUCTURE`. |
| `plugin_tasks` | All tasks, triggers, conditions, and task runners for one plugin, grouped by subpackage. Accepts a plugin name (`plugin-aws`) or group (`io.kestra.plugin.aws`). |
| `versions` | Installed version of every plugin. Optional name filter. |
| `list_task_runners` | All [task runner backends](../../docs/task-runners/index.mdx) across all plugins (Docker, Kubernetes, GCP Batch, AWS Batch, …). |
| `list_triggers` | All [trigger types](../../docs/05.workflow-components/07.triggers/index.mdx) across all plugins (Schedule, Webhook, [Kafka](/plugins/plugin-kafka), JDBC, …). |
| `list_storages` | All internal [storage backends](../../docs/06.concepts/11.storage/index.md) (GCS, S3, Azure Blob Storage, MinIO, …). |
| `list_secret_managers` | All [secret manager](../../docs/06.concepts/04.secret/index.md) integrations (HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, 1Password, …). |
| `list_log_exporters` | All log shipper backends. |

### Task documentation

| Tool | What it returns |
|------|-----------------|
| `task_schema` | Full JSON schema and documentation for a task class, including all properties and outputs. Accepts the fully-qualified class name (e.g. `io.kestra.plugin.aws.s3.Upload`) and an optional `all` flag to include inherited properties. |

### Blueprints

| Tool | What it returns |
|------|-----------------|
| `blueprints` | Search flow templates by text query and/or tags. Returns id, title, description, tags, and included task list. |
| `get_blueprint_flow` | Full YAML source for a Blueprint by id. Ready to paste into a flow. |

### Plugin release history

| Tool | What it returns |
|------|-----------------|
| `plugin_versions` | Full GitHub release history for a plugin, including the Kestra version each release targets. |

### Full-text search

| Tool | What it returns |
|------|-----------------|
| `search` | Full-text search across plugins, docs, blueprints, or blogs. Optional `type` filter: `PLUGINS` (default), `DOCS`, `BLUEPRINTS`, `BLOGS`. |

## Use cases

### Writing a flow from scratch

Ask Claude Code to write a flow that reads from S3 and loads into BigQuery. Instead of guessing task names or hallucinating property shapes, the agent calls `list_plugins` to discover [`plugin-aws`](/plugins/plugin-aws) and [`plugin-gcp`](/plugins/plugin-gcp), then `plugin_tasks` for each to enumerate available tasks, then `task_schema` on `io.kestra.plugin.aws.s3.Downloads` and `io.kestra.plugin.gcp.bigquery.Load` to get exact property names, types, and defaults. The resulting YAML is valid on the first attempt.

### Checking what plugins are available

_"Does Kestra support Vault for secrets?"_ — the agent calls `list_secret_managers` and returns the full list including the FQCN and description for the HashiCorp Vault implementation. The same pattern works for `list_task_runners` ("can I run tasks on GCP Batch?"), `list_storages` ("does Kestra support MinIO?"), and `list_triggers` ("is there a Kafka realtime trigger?"). No guessing, no docs tab, no stale answers.

### Bootstrapping with Blueprints

Before writing a flow from scratch, the agent calls `blueprints` with a query like `"dbt"` or `"slack notification"`, scans the matches, and calls `get_blueprint_flow` on the best result to retrieve the full YAML. This is faster than authoring from scratch and guarantees the output follows Kestra's own patterns and best practices.

### Investigating plugin compatibility

When a flow breaks after a plugin upgrade, the agent calls `plugin_versions` to retrieve the full release history with the target Kestra version for each tag. This surfaces the exact release where a change was introduced without leaving the conversation or opening GitHub.

## Connecting other AI clients

The same endpoint works with any MCP-compatible tool:

**Codex CLI** — `~/.codex/config.toml`:
```toml
[[mcp_servers]]
name = "kestra"
url  = "https://api.kestra.io/v1/mcp"
```

**Gemini CLI** — `~/.gemini/settings.json`:
```json
{
  "mcpServers": {
    "kestra": {
      "httpUrl": "https://api.kestra.io/v1/mcp"
    }
  }
}
```

**OpenCode** — `~/.config/opencode/config.json`:
```json
{
  "mcp": {
    "kestra": {
      "type": "remote",
      "url": "https://api.kestra.io/v1/mcp"
    }
  }
}
```

## Why a remote server?

Most MCP servers are local processes: install them, keep them updated, configure them per machine. A remote HTTP MCP server requires none of that. There is nothing to install, nothing to update locally, and no background process consuming memory. The catalog stays current because it mirrors the live plugin registry and Blueprint index that powers [kestra.io/plugins](/plugins) — updated on every Kestra release.

---

## Frequently asked questions

### What is the Kestra MCP server?
A remote HTTP endpoint at `https://api.kestra.io/v1/mcp` that implements the [Model Context Protocol](https://modelcontextprotocol.io). It gives AI coding agents live access to Kestra's plugin registry and Blueprint catalog through 13 read-only tools — with no installation required.

### How do I connect Claude Code to the Kestra MCP server?
Run `claude mcp add --transport http kestra https://api.kestra.io/v1/mcp` for project scope, or add `--scope user` for global availability. You can also add the `mcpServers` entry directly to `.claude/settings.json`.

### What tools does the Kestra MCP server expose?
13 tools covering plugin discovery (`list_plugins`, `plugin_tasks`, `versions`), element-type listing (`list_task_runners`, `list_triggers`, `list_storages`, `list_secret_managers`, `list_log_exporters`), task documentation (`task_schema`), Blueprint search and retrieval (`blueprints`, `get_blueprint_flow`), release history (`plugin_versions`), and full-text search (`search`).

### Does the Kestra MCP server require authentication?
No. The endpoint is public and requires no API key or login. All tools are read-only.

### Can I use it with AI agents other than Claude Code?
Yes. Codex CLI, Gemini CLI, OpenCode, or any framework that supports MCP over HTTP. Configuration snippets for each are in the post above.
