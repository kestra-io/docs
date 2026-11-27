---
title: "Kestra MCP Server: Operate Kestra from Your AI Agent"
h1: Operate Kestra from Claude, Cursor, and Other MCP Clients
sidebarTitle: Kestra MCP Server
icon: /src/contents/docs/icons/ai.svg
description: Connect Claude Code, Cursor, or another MCP client to your Kestra instance to read and change flows, executions, namespace files, and KV entries with your permissions.
version: ">= 2.1.0"
editions: ["OSS", "EE"]
---

The Kestra MCP Server lets an external AI agent operate your Kestra instance: read and change flows, executions, logs, namespace files, KV entries, and other resources, with your permissions.

This page is for administrators who enable the server and for developers who connect Claude Code, Cursor, Codex, or another MCP client to it. Kestra has two other MCP features:

| You want an agent to… | Use |
| --- | --- |
| Operate your Kestra instance: read and change flows, executions, and other resources | Kestra MCP Server (this page) |
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

In this demo, Claude Code is connected to the Kestra MCP Server. It finds out why an execution failed, creates the missing KV entry, and restarts the execution:

<div style="position: relative; padding-bottom: calc(64.2857% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/IArRp3Gt6ocLCQtAbOIT?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Fix a Failed Execution with Claude Code and the Kestra MCP Server" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write; autoplay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

## Authentication

Every request must be authenticated. The server can't be made public.

- In the open-source edition, use basic authentication.
- In the Enterprise Edition, `auth-methods` lists the accepted methods. When it's empty, basic authentication, API tokens, and OAuth are all accepted. A request that uses a method not in the list gets a `403`.
- An unauthenticated request gets a `401`. When OAuth is accepted, the response includes a `WWW-Authenticate: Bearer` challenge whose `resource_metadata` parameter points MCP clients to OAuth discovery.
- With OAuth, MCP clients discover the identity provider from `<kestra-url>/.well-known/oauth-protected-resource/api/v1/mcp`, as described in [Configuring OAuth authentication](../../ai-orchestration/03.mcp-server/index.md#configuring-oauth-authentication). `oauth-provider` restricts tokens to one configured OIDC provider. When it's unset, tokens from any configured provider are accepted.

## Tools

The server exposes up to 50 tools in the open-source edition and up to 79 in the Enterprise Edition. Each tool has an MCP annotation: **Read-only** tools change nothing, **Write** tools create or change resources, and **Destructive** tools delete data, overwrite state, or start executions with their side effects.

### Flows

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
| `validate_flow` | Read-only | Validates a flow's YAML source without saving or executing it, and returns its errors, warnings, and deprecated properties. |
| `create_flow` | Write | Creates a flow from its YAML source. |
| `update_flow` | Write | Replaces a flow's source and saves it as a new revision. |
| `enable_flow` | Write | Enables a disabled flow. |
| `disable_flow` | Write | Disables a flow so its triggers stop. Running executions aren't stopped. |
| `delete_flow` | Destructive | Deletes a flow. |
| `backfill_flow` | Destructive | Backfills a flow's Schedule trigger over a past time window. |
| `execute_flow` | Destructive | Starts a new execution of a flow. |

### Executions

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

### Logs

| Tool | Annotation | What it does |
|---|---|---|
| `read_execution_logs` | Read-only | Reads an execution's logs. |
| `search_logs` | Read-only | Searches logs across flows, executions, and triggers. |
| `delete_execution_logs` | Destructive | Deletes an execution's logs and keeps the execution. |
| `delete_flow_logs` | Destructive | Deletes the logs of every execution and trigger of a flow. |

### Namespaces, namespace files, and the KV store

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

### Plugins and the instance

| Tool | Annotation | What it does |
|---|---|---|
| `search_plugins` | Read-only | Searches the installed plugin types by keyword and kind. |
| `list_installed_plugins` | Read-only | Lists the plugins installed on the instance. |
| `get_plugin_schema` | Read-only | Reads the JSON schema of a plugin type. |
| `read_plugin_documentation` | Read-only | Reads a plugin type's documentation as Markdown. |
| `read_instance_info` | Read-only | Reads the instance's version, edition, and public URL. |

### Apps and dashboards (Enterprise Edition)

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

### Test suites (Enterprise Edition)

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

### Users, groups, and the instance (Enterprise Edition)

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

The `author_*` tools use the AI provider configured for the [AI Copilot](../01.ai-copilot/index.md). They return the generated YAML for review without saving it. To save a draft, the agent calls the matching `create_*` or `update_*` tool.

MCP clients can use the annotations in their approval prompts. Kestra doesn't ask for confirmation itself, even for tools that the in-app Copilot asks you to confirm.

## Tenants and permissions

Every tool takes an optional `tenant` argument. When the caller can act on a single tenant, it's used by default. Otherwise, the call fails with a message listing the tenants to choose from. The tenants a caller can act on are those they have access to, limited to the `tenants` list when it's set. Each tool's `tenant` parameter lists, as allowed values, the tenants where the caller can use that tool, so MCP clients can offer them instead of guessing.

In the Enterprise Edition, each call runs as the caller in the requested tenant, so their [RBAC](../../07.enterprise/03.auth/rbac/index.md) permissions apply to both the tool and the namespace. A caller only sees the tools they can use in at least one of the tenants they can act on. Calling a tool that isn't in their list returns a `Tool not found` error. When a listed tool is denied for a namespace, the call returns an error result instead, for example `Execution not found`. Changes made through the server are recorded in the [audit log](../../07.enterprise/02.governance/06.audit-logs/index.md) under the caller, like changes made in the UI.

<!-- TODO(runtime test): live-verified on 2026-11-11 with raw JSON-RPC requests, and on 2026-11-24 with Claude Code (78 tools listed, before kestra#23044 restored `validate_flow`; re-check that 79 are listed; list/read tools, create_kv_entry, and restart_execution called; audit log entries checked). OAuth is still untested (no identity provider on the test instance). -->
