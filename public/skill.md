---
name: kestra
description: Generate valid Kestra flow YAML and operate Kestra environments using kestractl
compatibility:
  - claude-code
  - cursor
  - windsurf
  - codex
  - opencode
---

# Kestra Agent Skill

## When to use

Use this skill whenever you are asked to:
- Write, modify, or debug a Kestra flow (YAML)
- Validate or deploy flows using kestractl
- Trigger executions and check status
- Manage namespaces, namespace files, or KV store entries
- Look up plugin types, task schemas, or blueprint templates

## Required inputs

- **For flow authoring**: description of the desired flow behavior, target namespace (default: `company.team`)
- **For operations**: a running Kestra instance with kestractl configured (`kestractl config show` should succeed)

## Workflow

### Generating a flow

1. Fetch the live flow schema: `curl -s https://api.kestra.io/v1/plugins/schemas/flow`
2. Identify the correct plugin types — use the Kestra MCP server if available (`list_plugins`, `plugin_tasks`, `task_schema`), or check [kestra.io/plugins](https://kestra.io/plugins)
3. Draft the YAML using the schema — validate every `type` against the live schema before emitting
4. Return complete, deployable YAML

### Operating Kestra via kestractl

1. Verify context: `kestractl config show`
2. For deploy: validate first with `kestractl flows validate <path> --fail-fast`, then deploy with `kestractl flows deploy <path> --override`
3. For executions: `kestractl executions run <namespace> <flowId> --wait`
4. For namespace files: list with `kestractl namespaces files list <namespace>`, upload with `kestractl namespaces files upload`

## Guardrails

- **Never invent task types.** Every `type` must exist in the live Kestra plugin registry. Verify with `task_schema` or the plugin docs before using.
- **Never hardcode secrets.** Use `{{ secret('SECRET_NAME') }}` expressions.
- **Validate before deploy.** Always run `kestractl flows validate` before deploying to any environment.
- **Confirm destructive actions.** Prompt the user before running commands that modify or delete existing flows or namespace files.
- **No recursive Pebble.** Pebble expressions are not evaluated inside other Pebble expressions.
- **Use `| toJson` not `| json`** for JSON serialization in Pebble expressions.

## Connecting the Kestra MCP server

For the richest plugin discovery, add the Kestra MCP server to your AI agent:

```bash
# Claude Code
claude mcp add --transport http kestra https://api.kestra.io/v1/mcp

# Available tools: list_plugins, plugin_tasks, task_schema, blueprints,
#   get_blueprint_flow, versions, list_task_runners, list_triggers,
#   list_storages, list_secret_managers, list_log_exporters, plugin_versions, search
```

## Example prompts

```
Write a flow in namespace company.data that fetches https://api.example.com/metrics
every 30 minutes and stores the JSON response in KV store under "latest_metrics".
```

```
Validate and deploy all flows in ./flows to prod.pipelines namespace
with --override and --fail-fast.
```

```
Run analytics.jobs.nightly-refresh, wait for completion, and report the execution status.
```

## Key references

- Flow schema (live): `https://api.kestra.io/v1/plugins/schemas/flow`
- Plugin catalog: `https://kestra.io/plugins`
- MCP server: `https://api.kestra.io/v1/mcp`
- Documentation index: `https://kestra.io/llms.txt`
- Agent Skills repo: `https://github.com/kestra-io/agent-skills`
- Full docs: `https://kestra.io/docs/ai-tools/agent-skills`
