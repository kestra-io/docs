---
title: MCP Server in Kestra – Expose Flows as AI Tools
h1: Configure Kestra MCP Servers and Connect AI Agents
description: Configure Kestra MCP servers to expose flows as tools for AI agents. Learn how to create servers, set authentication, and connect Claude Desktop, Claude Code, and Cursor.
sidebarTitle: MCP Server
icon: /src/contents/docs/icons/ai.svg
version: "2.0.0"
editions: ["OSS", "EE"]
---

A Kestra MCP server exposes flows as named tools over HTTP for AI agents to discover and call.

A Kestra MCP server is a tenant-scoped entity that uses the [Model Context Protocol](https://modelcontextprotocol.io). Any flow with an [`McpToolTrigger`](../../05.workflow-components/07.triggers/06.mcp-tool-trigger/index.md) is automatically registered as a named tool on its target server. AI agents discover the tool list at connection time, so adding or removing triggers takes effect without restarting clients.

## Two directions: Kestra as server vs. Kestra as client

Kestra supports MCP in both directions:

| Direction | How | When to use |
|---|---|---|
| **Kestra as MCP server** | `McpToolTrigger` + MCP server entity | AI agents (Claude, Cursor) call your flows as tools |
| **Kestra as MCP client** | MCP client tasks (`SseMcpClient`, `StreamableHttpMcpClient`, `StdioMcpClient`, `DockerMcpClient`) | Your flows call external MCP servers as part of an AI Agent task |

This page covers Kestra as an MCP server. For using external MCP servers from within flows, see [AI Agents](../ai-agents/index.md).

## Default server

A `default` MCP server is automatically provisioned for every tenant on startup. You can use it immediately — no setup needed. The `McpToolTrigger`'s `mcpServer` property defaults to `"default"`, so a minimal trigger requires no explicit server reference.

## Managing MCP servers

Navigate to **Tenant → MCP Servers** in the left sidebar to view, create, edit, and manage MCP servers.

Each server has the following fields:

| Field | Description |
|---|---|
| `name` | Display name for the server. |
| `description` | Optional description shown in the UI. |
| `systemPrompt` | Instructions prepended to every AI agent session connected to this server. Use this to guide agent behavior — for example, to restrict which tools to call or define the agent's persona. |
| `serverType` | `PRIVATE` (default) or `PUBLIC`. A private server requires authentication; a public server accepts unauthenticated connections. |
| `authType` | `BASIC` (username/password, available in OSS and EE), `API_TOKEN` (EE only), or `OAUTH` (EE only). |

### Authentication types

| Auth type | Available in | Notes |
|---|---|---|
| `BASIC` | OSS, EE | Username and password required on connect. |
| `API_TOKEN` | EE only | API token required on connect. Rejected on OSS. |
| `OAUTH` | EE only | OAuth 2.0 flow. Required for browser-based MCP clients such as Claude web. Configure the OAuth provider name via `oauthProvider`. |

Keep servers private unless you have a specific reason to expose them publicly. A public server allows any MCP client to call any flow registered on it without authentication.

### Configuring OAuth authentication

`OAUTH` auth requires an OIDC provider configured in your Kestra instance — the same configuration used for SSO. See [SSO configuration](../../07.enterprise/03.auth/sso/index.md) for how to set up an OIDC provider under `micronaut.security.oauth2.clients`.

Once a provider is configured, set `authType` to `OAUTH` on the MCP server. The `oauthProvider` field specifies which provider to use by its configured name:

```yaml
# kestra.yml
micronaut:
  security:
    oauth2:
      clients:
        my-oidc-provider:
          client-id: <client-id>
          client-secret: <client-secret>
          openid:
            issuer: https://accounts.example.com
```

When a client connects to an `OAUTH`-protected MCP server and presents no token, the server responds with a `WWW-Authenticate` header pointing to the OAuth Protected Resource Metadata endpoint (RFC 9728). MCP-compliant clients such as Claude web discover the OIDC provider from this automatically and initiate the authorization code + PKCE flow — no manual client configuration is needed beyond the MCP server URL.

:::alert{type="info"}
The authenticating user must already have a Kestra account. The OAuth token's `email` or `preferred_username` claim is matched against existing Kestra users. If no matching user is found, the connection is rejected.
:::

If multiple OIDC providers are configured, set `oauthProvider` to the name of the specific provider (e.g. `my-oidc-provider` from the example above). If `oauthProvider` is omitted, the provider is matched automatically by the JWT's issuer claim.

## Connecting an AI agent client

Open a server in the UI and click the **Connect** tab:

- The SSE endpoint URL for the server
- Ready-to-paste configuration snippets for:
  - **Claude Desktop** — JSON block to add to `claude_desktop_config.json`
  - **Claude Code** — `claude mcp add` command to run in your terminal
  - **Cursor** — server URL to paste into Cursor Settings → MCP → Add new MCP server
  - **Codex** — connection configuration

## Viewing registered tools

The **Tool Flows** tab on each server lists all flows that have an `McpToolTrigger` pointing at that server. Use this to audit which flows are exposed and to navigate directly to a flow's trigger configuration.

## RBAC (Enterprise)

In the Enterprise Edition, `MCP_SERVER` is a first-class RBAC resource. See [RBAC](../../07.enterprise/03.auth/rbac/index.md#mcp-server-permissions) for the default role assignments.

Access to a private server is also flow-scoped: a user can connect to a private MCP server only if they have `FLOW: EXECUTE` permission on at least one namespace that has a flow with an `McpToolTrigger` pointing at that server.

## MCP server cache configuration

By default, each webserver node caches MCP server configuration in memory and hot-reloads it when a server is created, updated, or deleted. Two optional properties control the cache behavior:

| Property | Default | Description |
|---|---|---|
| `kestra.mcp.server-cache-config.maximum-size` | `500` | Maximum number of MCP server entries to cache. |
| `kestra.mcp.server-cache-config.expire-after-access` | `PT5M` | How long a cache entry remains valid after last access. |

Example configuration:

```yaml
kestra:
  mcp:
    server-cache-config:
      maximum-size: 200
      expire-after-access: PT10M
```

Adjust these only if you have a large number of MCP servers or tight memory constraints. The defaults are sufficient for most deployments.
