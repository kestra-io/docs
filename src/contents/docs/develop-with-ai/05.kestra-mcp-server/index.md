---
title: "Kestra MCP Server: Operate Kestra from Your AI Agent"
h1: Operate Kestra from Claude, Cursor, and Other MCP Clients
sidebarTitle: Kestra MCP Server
icon: /src/contents/docs/icons/ai.svg
description: Connect Claude Code, Cursor, or another MCP client to your Kestra instance to list and read flows and executions, validate YAML, and restart executions.
version: ">= 2.1.0"
editions: ["OSS", "EE"]
---

The Kestra MCP Server lets an external AI agent operate your Kestra instance: list and read flows, validate flow YAML, inspect executions and their logs, and restart failed executions.

This page is for administrators who enable the server and for developers who connect Claude Code, Cursor, Codex, or another MCP client to it. Kestra has two other MCP features:

| You want an agent to… | Use |
| --- | --- |
| Operate your Kestra instance: read flows and executions, restart executions | Kestra MCP Server (this page) |
| Run your own flows as tools | [MCP Flows](../../ai-orchestration/03.mcp-server/index.md) |
| Look up plugin schemas, blueprints, and docs while it writes flows | [Docs MCP Server](../02.kestra-mcp-resources/index.md) |

The Kestra MCP Server exposes the tools of the [AI Copilot](../01.ai-copilot/index.md) over the [Model Context Protocol](https://modelcontextprotocol.io). It is defined in the Kestra configuration rather than in the UI, belongs to no tenant, and doesn't appear on the **MCP Flows** page or in the `/api/v1/{tenant}/mcp-servers` API.

## Enable the server

The server is disabled by default. Enable it in the [configuration](../../configuration/06.enterprise-and-advanced/index.md#kestra-mcp-server):

```yaml
kestra:
  mcp:
    platform-server:
      enabled: true
      tenants: []           # empty: every tenant the caller can access
      instructions: "Only restart executions in the dev tenant."
      # Enterprise Edition only
      auth-methods: []      # BASIC, API_TOKEN, OAUTH; empty: all three
      oauth-provider: my-oidc-provider
```

The server is served at `<kestra-url>/api/v1/mcp`, with no tenant or server ID in the path. While it's disabled, the URL returns `404`.

`instructions` is sent to MCP clients when they connect. Use it to guide the agent, for example to restrict which tenants it may restart executions in.

## Connect a client

Point your MCP client at `<kestra-url>/api/v1/mcp` over HTTP. For example, with basic authentication in Claude Code:

```bash
claude mcp add kestra <kestra-url>/api/v1/mcp \
  --transport http \
  --header "Authorization: Basic $(echo -n 'username:password' | base64)"
```

Other clients use the same configuration as an MCP server in MCP Flows, with this URL in place of the server URL. See [Connect an AI agent client](../../ai-orchestration/03.mcp-server/index.md#connect-an-ai-agent-client) for Claude Desktop, Cursor, and Codex snippets.

## Authentication

Every request must be authenticated. The server can't be made public.

- In the open-source edition, use basic authentication.
- In the Enterprise Edition, `auth-methods` lists the accepted methods. When it's empty, basic authentication, API tokens, and OAuth are all accepted. A request that uses a method not in the list gets a `403`.
- An unauthenticated request gets a `401`. When OAuth is accepted, the response includes a `WWW-Authenticate: Bearer` challenge whose `resource_metadata` parameter points MCP clients to OAuth discovery.
- With OAuth, MCP clients discover the identity provider from `<kestra-url>/.well-known/oauth-protected-resource/api/v1/mcp`, as described in [Configuring OAuth authentication](../../ai-orchestration/03.mcp-server/index.md#configuring-oauth-authentication). `oauth-provider` restricts tokens to one configured OIDC provider. When it's unset, tokens from any configured provider are accepted.

## Tools

| Tool | Annotation | What it does |
|---|---|---|
| `list_flows` | Read-only | Lists flows matching filters. |
| `read_flow` | Read-only | Reads a flow's YAML source. |
| `validate_flow` | Read-only | Validates flow YAML without saving it, and reports errors, warnings, and deprecations. |
| `list_executions` | Read-only | Lists the most recent executions matching filters. |
| `read_execution` | Read-only | Reads an execution's state, duration, and task runs. |
| `read_execution_logs` | Read-only | Reads an execution's logs. |
| `search_plugins` | Read-only | Searches the installed plugins by keyword. |
| `get_plugin_schema` | Read-only | Reads the JSON schema of a plugin type. |
| `restart_execution` | Destructive | Restarts a failed or paused execution. |

MCP clients use the annotations for their approval prompts, typically asking before a destructive call. Kestra doesn't ask for confirmation itself, even for `restart_execution`, which the in-app Copilot asks you to confirm.

## Tenants and permissions

Every tool takes an optional `tenant` argument. When the caller can act on a single tenant, it's used by default. Otherwise, the call fails with a message listing the tenants to choose from. The tenants a caller can act on are those they have access to, limited to the `tenants` list when it's set.

In the Enterprise Edition, each call runs as the caller in the requested tenant, so their [RBAC](../../07.enterprise/03.auth/rbac/index.md) permissions apply to both the tool and the namespace. A caller only sees the tools they can use in at least one of the tenants they can act on. Calling a tool that isn't in their list returns a `Tool not found` error. When a listed tool is denied for a namespace, the call returns an error result instead, for example `Execution not found`.

<!-- TODO(runtime test): live-verified on 2026-11-11 except OAuth (no identity provider on the test instance) and a real MCP client such as Claude Code (tested with raw JSON-RPC requests). -->
