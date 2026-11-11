---
title: "Flow MCP Servers: Expose Kestra Flows as AI Tools"
h1: Expose Your Flows as Tools for External AI Agents
description: Expose Kestra flows as MCP tools that Claude, Cursor, and other AI agents can call. Create MCP servers, choose authentication, and connect clients.
sidebarTitle: Flow MCP Servers
icon: /src/contents/docs/icons/ai.svg
version: ">= 2.0.0"
editions: ["OSS", "EE", "Cloud"]
docId: mcp-servers
---

Expose your Kestra flows as named tools that external AI agents discover and call over MCP.

This page is for Kestra administrators and flow authors who want Claude, Cursor, or another AI agent to run their flows. If you want your coding agent to look up Kestra plugin schemas and docs while you write flows, use the [Docs MCP server](../../develop-with-ai/02.kestra-mcp-resources/index.md) instead.

To give an agent Kestra's own tools instead, such as reading flows and executions or restarting an execution, enable the [platform MCP server](#platform-mcp-server).

A flow MCP server is a tenant-scoped entity that uses the [Model Context Protocol](https://modelcontextprotocol.io). Any flow with an [`McpToolTrigger`](../../05.workflow-components/07.triggers/06.mcp-tool-trigger/index.md) is registered as a named tool on its target server. AI agents discover the tool list at connection time, so adding or removing triggers takes effect without restarting clients.

## Two directions: Kestra as server vs. Kestra as client

Kestra supports MCP in both directions:

| Direction | How | When to use |
|---|---|---|
| **Kestra as MCP server** | `McpToolTrigger` and a flow MCP server | External AI agents (Claude, Cursor) call your flows as tools |
| **Kestra as MCP client** | MCP client tasks (`SseMcpClient`, `StreamableHttpMcpClient`, `StdioMcpClient`, `DockerMcpClient`) | Your flows call external MCP servers as part of an `AIAgent` task |

This page covers Kestra as an MCP server. To call external MCP servers from a flow, see [MCP clients](../01.ai-agents/index.md#mcp-clients).

## Default server

A `default` MCP server is automatically provisioned for every tenant on startup. You can use it immediately with no setup needed. The `McpToolTrigger`'s `mcpServer` property defaults to `"default"`, so a minimal trigger requires no explicit server reference. The `default` server cannot be deleted, and you cannot create another server with the ID `default`.

## Managing MCP servers

Navigate to **Tenant → MCP Servers** in the left sidebar to view, create, edit, and manage MCP servers.

To script the same tasks, [install `kestractl`](../../kestra-cli/kestractl/index.md#installation) and use its [`mcp-servers` commands](../../kestra-cli/kestractl/index.md#mcp-servers), or call the REST API at `/api/v1/{tenant}/mcp-servers`.

Each server has the following fields:

| Field | Description |
|---|---|
| `id` | Server ID, shown as **Server ID** in the UI. Must start with a lowercase letter or digit and contain only lowercase letters, digits, hyphens, and underscores. |
| `description` | Optional description shown in the UI. |
| `instructions` | Optional instructions that the server sends to MCP clients when they connect. Use them to guide agent behavior, for example to restrict which tools to call. |
| `serverType` | `PRIVATE` (default) or `PUBLIC`. A private server requires authentication; a public server accepts unauthenticated connections. |
| `authType` | `BASIC` (default), `API_TOKEN`, or `OAUTH`. See [Authentication types](#authentication-types). |
| `oauthProvider` | Name of the OIDC provider to accept tokens from. Required when `authType` is `OAUTH`, and must not be set otherwise. |
| `oauthScopesSupported` | Scopes advertised in the server's OAuth Protected Resource Metadata document, for example `openid`, `profile`, `email`. Required when `authType` is `OAUTH`, and must not be set otherwise. |
| `disabled` | Whether the server is disabled. |

### Authentication types

| Auth type | Available in | Notes |
|---|---|---|
| `BASIC` | OSS, EE | Username and password required on connect. |
| `API_TOKEN` | EE and Cloud | API token required on connect. Rejected on OSS with a `403` error. |
| `OAUTH` | EE and Cloud | OAuth 2.0 flow. Required for browser-based MCP clients such as Claude web. Rejected on OSS with a `403` error. Requires `oauthProvider` and `oauthScopesSupported`. |

Keep servers private unless you have a specific reason to expose them publicly. A public server allows any MCP client to call any flow registered on it without authentication.

### Configuring OAuth authentication

`OAUTH` auth requires an OIDC provider configured in your Kestra instance (the same configuration used for SSO). See [SSO configuration](../../07.enterprise/03.auth/sso/index.md) for how to set up an OIDC provider under `micronaut.security.oauth2.clients`.

Once a provider is configured, set `authType` to `OAUTH` on the MCP server and set `oauthProvider` to the provider's configured name, `my-oidc-provider` in the following example. Kestra rejects a name that doesn't match a configured provider.

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

When a client connects to an `OAUTH`-protected MCP server and presents no token, the server responds with a `WWW-Authenticate` header pointing to the OAuth Protected Resource Metadata endpoint (RFC 9728). MCP-compliant clients such as Claude web discover the OIDC provider from this automatically and initiate the authorization code + PKCE flow; no manual client configuration is needed beyond the MCP server URL.

:::alert{type="info"}
The authenticating user must already have a Kestra account. The OAuth token's `email` or `preferred_username` claim is matched against existing Kestra users. If no matching user is found, the connection is rejected.
:::

Kestra accepts a token only if its issuer matches the provider named in `oauthProvider`. Also set `oauthScopesSupported` to the scopes MCP clients should request, for example `openid`, `profile`, and `email`. Kestra advertises them in the Protected Resource Metadata document.

## Connect an AI agent client

Open a server in the UI and click the **Connect** tab. It shows the server URL, `<kestra-url>/api/v1/<tenant>/mcp/<server-id>`, and ready-to-paste configuration snippets for each supported client:

- **Claude Desktop**: a JSON block to add to `claude_desktop_config.json`. Claude Desktop does not support HTTP MCP servers natively, so the snippet uses `npx mcp-remote` as a bridge.
- **Claude Code**: a `claude mcp add` command that uses `--transport http`.
- **Cursor**: a JSON block to add to `~/.cursor/mcp.json`.
- **Codex (OpenAI)**: a TOML block to add to `~/.codex/config.toml`.

For Basic Auth, the snippets contain a `${KESTRA_BASIC_AUTH}` placeholder. MCP clients store this text literally and do not expand it when they connect, so replace it with the base64-encoded `username:password` value. In Claude Code, let your shell compute the value when you add the server:

```bash
claude mcp add <server-id> <server-url> \
  --transport http \
  --header "Authorization: Basic $(echo -n 'username:password' | base64)"
```

## Viewing registered tools

The **Tool Flows** tab on each server lists all flows that have an `McpToolTrigger` pointing at that server. Use this to audit which flows are exposed and to navigate directly to a flow's trigger configuration.

To list the same tools from the command line, run `kestractl mcp-servers tools <server-id>`.

## RBAC (Enterprise)

In the Enterprise Edition, `MCP_SERVER` is a first-class RBAC resource. See [RBAC](../../07.enterprise/03.auth/rbac/index.md#mcp-server-permissions) for the default role assignments.

Access to a private server is also flow-scoped: a user can connect to a private MCP server only if they have `FLOW: EXECUTE` permission on at least one namespace that has a flow with an `McpToolTrigger` pointing at that server. If no flow points at the server yet, any authenticated user can connect.

## Platform MCP server

:::badge{version=">=2.1" editions="OSS,EE"}
:::

The platform MCP server exposes the tools of the [AI Copilot](../../develop-with-ai/01.ai-copilot/index.md) to external MCP clients, so an agent can inspect flows and executions on your instance without any flow of yours. Unlike flow MCP servers, it is defined in the Kestra configuration rather than in the UI, belongs to no tenant, and doesn't appear on the **MCP Servers** page or in the `/api/v1/{tenant}/mcp-servers` API.

It is disabled by default. Enable it in the [configuration](../../configuration/06.enterprise-and-advanced/index.md#platform-mcp-server):

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

The server is served at `<kestra-url>/api/v1/mcp`, with no tenant or server ID in the path. While it's disabled, the URL returns `404`. Connect a client the same way as to a [flow MCP server](#connect-an-ai-agent-client), with that URL.

### Authentication

Every request must be authenticated. The server can't be made public.

- In the open-source edition, use basic authentication.
- In the Enterprise Edition, `auth-methods` lists the accepted methods. When it's empty, basic authentication, API tokens, and OAuth are all accepted. A request that uses a method not in the list gets a `403`.
- An unauthenticated request gets a `401`. When OAuth is accepted, the response includes a `WWW-Authenticate: Bearer` challenge whose `resource_metadata` parameter points MCP clients to OAuth discovery.
- With OAuth, MCP clients discover the identity provider from `<kestra-url>/.well-known/oauth-protected-resource/api/v1/mcp`, as described in [Configuring OAuth authentication](#configuring-oauth-authentication). `oauth-provider` restricts tokens to one configured OIDC provider. When it's unset, tokens from any configured provider are accepted.

### Tools

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

Every tool takes an optional `tenant` argument. When the caller can act on a single tenant, it's used by default. Otherwise, the call fails with a message listing the tenants to choose from. The tenants a caller can act on are those they have access to, limited to the `tenants` list when it's set.

In the Enterprise Edition, each call runs as the caller in the requested tenant, so their [RBAC](../../07.enterprise/03.auth/rbac/index.md) permissions apply to both the tool and the namespace. A caller only sees the tools they can use in at least one of the tenants they can act on. Calling a tool that isn't in their list returns a `Tool not found` error. When a listed tool is denied for a namespace, the call returns an error result instead, for example `Execution not found`.

<!-- TODO(eng): with no X-Forwarded-Host header, the 401 challenge's resource_metadata URL is "https://null/.well-known/oauth-protected-resource/api/v1/mcp" (McpOAuthChallengeFilter reads request.getUri().getAuthority(), which is null). OAuth discovery from the challenge only works behind a proxy that sets X-Forwarded-Host. -->
<!-- TODO(runtime test): live-verified on 2026-11-11 except OAuth (no identity provider on the test instance) and a real MCP client such as Claude Code (tested with raw JSON-RPC requests). -->


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
