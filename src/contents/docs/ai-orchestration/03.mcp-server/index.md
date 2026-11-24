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

The platform MCP server exposes the tools of the [AI Copilot](../../develop-with-ai/01.ai-copilot/index.md) to external MCP clients, so an agent can read and change flows, executions, namespace files, KV entries, and other resources on your instance without any flow of yours. Unlike flow MCP servers, it is defined in the Kestra configuration rather than in the UI, belongs to no tenant, and doesn't appear on the **MCP Servers** page or in the `/api/v1/{tenant}/mcp-servers` API.

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

In this demo, Claude Code is connected to the platform MCP server. It finds out why an execution failed, creates the missing KV entry, and restarts the execution:

<div style="position: relative; padding-bottom: calc(64.2857% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/IArRp3Gt6ocLCQtAbOIT?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Fix a Failed Execution with Claude Code and the Kestra MCP Server" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write; autoplay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

### Authentication

Every request must be authenticated. The server can't be made public.

- In the open-source edition, use basic authentication.
- In the Enterprise Edition, `auth-methods` lists the accepted methods. When it's empty, basic authentication, API tokens, and OAuth are all accepted. A request that uses a method not in the list gets a `403`.
- An unauthenticated request gets a `401`. When OAuth is accepted, the response includes a `WWW-Authenticate: Bearer` challenge whose `resource_metadata` parameter points MCP clients to OAuth discovery.
- With OAuth, MCP clients discover the identity provider from `<kestra-url>/.well-known/oauth-protected-resource/api/v1/mcp`, as described in [Configuring OAuth authentication](#configuring-oauth-authentication). `oauth-provider` restricts tokens to one configured OIDC provider. When it's unset, tokens from any configured provider are accepted.

### Tools

The server exposes up to 49 tools in the open-source edition and up to 78 in the Enterprise Edition. Each tool has an MCP annotation: **Read-only** tools change nothing, **Write** tools create or change resources, and **Destructive** tools delete data, overwrite state, or start executions with their side effects.

#### Flows

| Tool | Annotation | What it does |
|---|---|---|
| `list_flows` | Read-only | Lists flows matching filters. |
| `read_flow` | Read-only | Reads a flow's YAML source. |
| `search_flow_sources` | Read-only | Searches the YAML source of flows for text or a regular expression. |
| `list_flow_revisions` | Read-only | Lists a flow's revisions, newest first. |
| `list_flow_dependencies` | Read-only | Lists the dependencies between a flow and other flows. |
| `list_namespace_dependencies` | Read-only | Lists the flows that depend on a namespace's flows, child namespaces included. |
| `list_flow_triggers` | Read-only | Lists flow triggers with their runtime state. |
| `author_flow` | Read-only | Drafts a flow, or a revision of one, from a description. Nothing is saved. |
| `create_flow` | Write | Creates a flow from its YAML source. |
| `update_flow` | Write | Replaces a flow's source and saves it as a new revision. |
| `enable_flow` | Write | Enables a disabled flow. |
| `disable_flow` | Write | Disables a flow so its triggers stop. Running executions aren't stopped. |
| `delete_flow` | Destructive | Deletes a flow. |
| `backfill_flow` | Destructive | Backfills a flow's Schedule trigger over a past time window. |
| `execute_flow` | Destructive | Starts a new execution of a flow. |

#### Executions

| Tool | Annotation | What it does |
|---|---|---|
| `list_executions` | Read-only | Lists the most recent executions matching filters. |
| `read_execution` | Read-only | Reads an execution's state, duration, and task runs. |
| `read_execution_outputs` | Read-only | Reads the flow outputs of an execution and what each task run returned. |
| `restart_execution` | Destructive | Restarts a failed or paused execution from its failed tasks. |
| `replay_execution` | Destructive | Replays an ended execution as a new execution, from the start or from a task run, optionally on another flow revision. |
| `resume_execution` | Destructive | Resumes a paused execution. |
| `pause_execution` | Write | Pauses a running execution. Running tasks finish, and no new task starts. |
| `kill_execution` | Destructive | Kills a running, paused, or queued execution, and its subflow executions by default. |
| `force_run_execution` | Destructive | Runs an execution that is created, queued, or paused now, bypassing its concurrency limit, schedule, or pause. |
| `change_execution_state` | Destructive | Overwrites the final state of an ended execution. |
| `change_task_run_state` | Destructive | Changes the state of one task run in an ended execution, which reruns the execution from that point. |
| `update_execution_labels` | Destructive | Adds, updates, or removes labels on an ended execution. |
| `delete_execution` | Destructive | Deletes an ended execution with its logs, metrics, and stored files. |

#### Logs

| Tool | Annotation | What it does |
|---|---|---|
| `read_execution_logs` | Read-only | Reads an execution's logs. |
| `search_logs` | Read-only | Searches logs across flows, executions, and triggers. |
| `delete_execution_logs` | Destructive | Deletes an execution's logs and keeps the execution. |
| `delete_flow_logs` | Destructive | Deletes the logs of every execution and trigger of a flow. |

#### Namespaces, namespace files, and the KV store

| Tool | Annotation | What it does |
|---|---|---|
| `list_namespaces` | Read-only | Lists the namespaces of the tenant. |
| `list_namespace_files` | Read-only | Lists the files and directories of a namespace. |
| `read_namespace_file` | Read-only | Reads a namespace file as text, optionally at a given revision. |
| `write_namespace_file` | Write | Writes a text file to a namespace, creating missing parent directories. |
| `create_namespace_directory` | Write | Creates a directory in a namespace. |
| `move_namespace_file` | Destructive | Moves or renames a namespace file or directory. |
| `delete_namespace_file` | Destructive | Deletes a namespace file, or a directory with its content. |
| `list_kv_entries` | Read-only | Lists KV entries matching filters. |
| `read_kv_entry` | Read-only | Reads one KV entry. |
| `create_kv_entry` | Write | Creates a KV entry in a namespace's KV store. |
| `update_kv_entry` | Write | Replaces the value of an existing KV entry. |
| `delete_kv_entry` | Destructive | Deletes a KV entry. |

#### Plugins and the instance

| Tool | Annotation | What it does |
|---|---|---|
| `search_plugins` | Read-only | Searches the installed plugin types by keyword and kind. |
| `list_installed_plugins` | Read-only | Lists the plugins installed on the instance. |
| `get_plugin_schema` | Read-only | Reads the JSON schema of a plugin type. |
| `read_plugin_documentation` | Read-only | Reads a plugin type's documentation as Markdown. |
| `read_instance_info` | Read-only | Reads the instance's version, edition, and public URL. |

#### Apps and dashboards (Enterprise Edition)

| Tool | Annotation | What it does |
|---|---|---|
| `author_app` | Read-only | Drafts an app, or a revision of one, from a description. Nothing is saved. |
| `list_apps` | Read-only | Lists apps matching filters. |
| `read_app` | Read-only | Reads an app's source. |
| `create_app` | Write | Creates an app from its YAML source. |
| `update_app` | Write | Replaces an app's source. |
| `enable_app` | Write | Enables a disabled app. |
| `disable_app` | Write | Disables an app and keeps its definition. |
| `delete_app` | Destructive | Deletes an app. |
| `author_dashboard` | Read-only | Drafts a custom dashboard, or a revision of one, from a description. Nothing is saved. |

#### Test suites (Enterprise Edition)

| Tool | Annotation | What it does |
|---|---|---|
| `author_test_suite` | Read-only | Drafts a test suite for a flow, or a revision of one, from a description. Nothing is saved. |
| `list_test_suites` | Read-only | Lists test suites, optionally for one namespace or flow. |
| `read_test_suite` | Read-only | Reads a test suite's source. |
| `create_test_suite` | Write | Creates a test suite from its YAML source. |
| `update_test_suite` | Write | Replaces a test suite's source and saves a new revision. |
| `delete_test_suite` | Destructive | Deletes a test suite. |
| `run_test_suite` | Destructive | Runs a test suite. Each test case executes the flow under test, with the flow's side effects. |
| `read_test_suite_run` | Read-only | Reads the result of a test suite run. |

#### Users, groups, and the instance (Enterprise Edition)

| Tool | Annotation | What it does |
|---|---|---|
| `list_groups` | Read-only | Lists the groups of the tenant. |
| `create_group` | Write | Creates an empty group. |
| `update_group` | Write | Renames a group or changes its description. |
| `delete_group` | Destructive | Deletes a group with its role bindings and memberships. |
| `list_invitations` | Read-only | Lists the invitations of the tenant. |
| `invite_user` | Write | Invites a user to the tenant by email, optionally with roles and groups. |
| `delete_invitation` | Destructive | Deletes an invitation so its link stops working. |
| `list_banners` | Read-only | Lists the announcement banners of the instance. |
| `create_banner` | Write | Publishes an announcement banner to every user of every tenant. |
| `update_banner` | Write | Changes a banner's message, severity, dates, or whether it's active. |
| `delete_banner` | Destructive | Deletes an announcement banner. |
| `read_license` | Read-only | Reads the instance's Enterprise license: type, expiry, and limits. |

The `author_*` tools use the AI provider configured for the [AI Copilot](../../develop-with-ai/01.ai-copilot/index.md). They return the generated YAML for review without saving it. To save a draft, the agent calls the matching `create_*` or `update_*` tool.

<!-- TODO(eng): ValidateFlowTool implements McpPlatformTool on develop, but `validate_flow` isn't in the live tool list (EE develop image 2026-11-23). Possibly shadowed by the docs MCP tool of the same name in ToolCatalog. Confirm whether it should be exposed. -->

MCP clients can use the annotations in their approval prompts. Kestra doesn't ask for confirmation itself, even for tools that the in-app Copilot asks you to confirm.

Every tool takes an optional `tenant` argument. When the caller can act on a single tenant, it's used by default. Otherwise, the call fails with a message listing the tenants to choose from. The tenants a caller can act on are those they have access to, limited to the `tenants` list when it's set. Each tool's `tenant` parameter lists, as allowed values, the tenants where the caller can use that tool, so MCP clients can offer them instead of guessing.

In the Enterprise Edition, each call runs as the caller in the requested tenant, so their [RBAC](../../07.enterprise/03.auth/rbac/index.md) permissions apply to both the tool and the namespace. A caller only sees the tools they can use in at least one of the tenants they can act on. Calling a tool that isn't in their list returns a `Tool not found` error. When a listed tool is denied for a namespace, the call returns an error result instead, for example `Execution not found`. Changes made through the server are recorded in the [audit log](../../07.enterprise/02.governance/06.audit-logs/index.md) under the caller, like changes made in the UI.

<!-- TODO(runtime test): live-verified on 2026-11-11 with raw JSON-RPC requests, and on 2026-11-24 with Claude Code (78 tools listed; list/read tools, create_kv_entry, and restart_execution called; audit log entries checked). OAuth is still untested (no identity provider on the test instance). -->


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
