---
title: "What's New in Kestra 2.0"
h1: What's New in Kestra 2.0
sidebarTitle: What's New in 2.0
icon: /src/contents/docs/icons/admin.svg
description: Overview of every major feature, capability, and behavior change in Kestra 2.0 for Early Access Program participants.
version: ">= 2.0.0"
---

Kestra 2.0 is a major release. This page orients Early Access Program participants on what's new and what to explore. As you test, use the feedback channels your EAP contact provided.

For a full list of breaking changes and migration steps, see the [2.0 migration guide](./11.migration-guide/v2.0.0/index.mdx).

## AI

### AI Copilot

The [AI Copilot](./ai-tools/ai-copilot/index.md) has been redesigned as a persistent sidebar with three modes:

- **Ask** — answers questions about Kestra using docs-grounded responses
- **Edit** — generates and iteratively refines flow YAML with a confirmation step before applying changes
- **Plan** — proposes a step-by-step execution plan; each step requires individual approval

Context pills attach the resource you are viewing automatically. The Copilot reads Namespace metadata (Policies, Variables, Secrets, KV pairs) so it can reuse your configured credentials in suggestions.

### AI Agents

[AI Agents](./ai-tools/ai-agents/index.md) let you build agentic pipelines using LLM task orchestration within flows. Agents emit usage metrics so you can track token consumption per execution.

### AI RAG Workflows

[RAG Workflows](./ai-tools/ai-rag-workflows/index.md) provide native support for retrieval-augmented generation pipelines, including vector store integration and chunking tasks.

### MCP Server and MCP Tool Trigger

The [Kestra MCP server](./ai-tools/mcp-server/index.md) exposes flows as tools AI agents can call. The complementary [MCP Tool Trigger](./05.workflow-components/07.triggers/06.mcp-tool-trigger/index.md) lets flows be invoked directly by MCP-compatible agents. [Agent Skills](./ai-tools/agent-skills/index.md) extend this with reusable tool definitions.

---

## Workflow components

### Loop task

The `ForEach` and `ForEachItem` tasks are replaced by a unified [Loop](./05.workflow-components/01.tasks/00.flowable-tasks/index.md) task with a cleaner API and improved output expressions. See the [migration guide](./11.migration-guide/v2.0.0/foreach-loop/index.md) for the mapping from old to new syntax.

### Trigger conditions renamed to `when`

Trigger `conditions` blocks are now written as `when`. The [trigger redesign migration guide](./11.migration-guide/v2.0.0/trigger-conditions-redesign/index.md) covers the exact rename and any structural changes.

### Reusable Inputs

[Reusable Inputs](./05.workflow-components/05.inputs/index.md) (EE) let you define typed input schemas at namespace scope and reference them across multiple flows, eliminating repeated input definitions.

### Quotas

[Quotas](./05.workflow-components/21.quotas/index.md) cap how many executions can be created within a time window at flow, namespace, or tenant scope. Quota counters appear in the **Quota Limits** page immediately on flow creation.

### `subflow()` Pebble function

The new [`subflow()`](./expressions/04.functions/04.workflow/index.mdx) Pebble function lets you invoke a subflow and retrieve its outputs inline within an expression, without a dedicated subflow task.

### Execution labels from triggers

Triggers can now attach labels directly to the executions they create, making it easier to filter and group executions in dashboards.

### Input enhancements

[Inputs](./05.workflow-components/05.inputs/index.md) have two notable additions:

- **SELECT/MULTISELECT label/value pairs** — each option can now be a `{label, value}` object. The UI shows the label; the expression `{{ inputs.x }}` resolves to the value. Useful for user-friendly dropdowns that map display names to IDs or codes.
- **JSON schema validation** — a `jsonSchema` property accepts a JSON Schema Draft 2020-12 string. Kestra validates the input at execution creation time and rejects the execution before any task runs if the input is invalid.

### Date helper functions

New [Pebble date functions](./expressions/04.functions/06.dates/index.mdx) make schedule-based `when` conditions more expressive without string manipulation:

- `isWeekend()` — true on Saturday and Sunday
- `isPublicHoliday(date, countryCode[, subDivision])` — checks against a country's public holiday calendar
- `isDayWeekInMonth(date, dayOfWeek, position)` — matches patterns like "second Tuesday of the month"
- `isLastWorkingDay(date)` — true on the last working day of the month

---

## Security

### Policies (EE)

[Policies](./07.enterprise/02.governance/policies/index.md) enforce governance rules on flows at save time and execution time. Rules can require specific task types, block others, or validate property values — applied per namespace.

### HTTP task URL filtering

[HTTP task filtering](./10.administrator-guide/security-hardening/index.md#http-task-url-filtering) lets operators configure allow-lists and deny-lists for URLs reachable by HTTP plugin tasks, blocking access to metadata endpoints and internal services.

---

## Enterprise

### Custom Blueprints (EE)

[Custom Blueprints](./07.enterprise/02.governance/custom-blueprints/index.md) let you publish Pebble-templated flow skeletons to your organization's Blueprint library. Each blueprint defines form fields using standard input types; when a user instantiates it, Kestra renders the template into a ready-to-use flow. Useful for standardizing common flow patterns across teams.

---

## Developer experience

### VS Code extension: Namespace files

The [VS Code extension](./version-control-cicd/05.vscode/index.md) now supports three namespace file commands: **Open namespace** (mounts a namespace as a live folder), **Upload file to namespace**, and **Sync folder to namespace**. The `kestra.namespaceFiles.exclude` setting controls which files are skipped during upload and sync.

### Plugin file renderers

Plugins can now register custom file renderers, allowing task output files to be previewed inline in the Kestra UI with format-specific rendering.

### Dynamic Apps content blocks

[Apps](./07.enterprise/04.scalability/apps/index.md) support dynamic content blocks that update based on execution state, enabling richer interactive UIs built on flow outputs.

### `kestractl` IAM commands

The `kestractl` CLI now supports IAM management: roles, role bindings, service accounts, and invitations. See the [kestractl reference](./kestra-cli/kestractl/index.md).

---

## Infrastructure

### GCE Task Runner

A [Google Compute Engine Task Runner](./task-runners/04.types/09.google-computeengine-task-runner/index.md) provisions ephemeral VMs on GCE for each task execution, complementing the existing Cloud Run and Kubernetes runners.

### Worker Groups

Worker Group configuration no longer uses a `key` property. Groups are identified by label selectors. See the [Worker Groups](./07.enterprise/04.scalability/worker-group/index.md) page for the updated configuration.

### External Log Data Store

[External Log Data Store](./10.administrator-guide/log-data-store/index.md) routes execution logs to a dedicated JDBC database or Elasticsearch, separate from the main backend, to reduce database size and speed up migrations.

### ION output files are binary

Task output files in ION format are now stored as binary ION rather than text. Existing text ION files remain readable. See the [migration guide](./11.migration-guide/v2.0.0/ion-binary-format/index.md).

### Architecture updates

The internal architecture has been updated with improved executor metrics and distributed component communication. See the [Architecture](./08.architecture/index.mdx) page for the current model.

---

## Breaking changes summary

All breaking changes have migration guides:

| Change | Guide |
|---|---|
| `pluginDefaults` removed | [Guide](./11.migration-guide/v2.0.0/plugin-defaults-removed/index.md) |
| `pluginDefaults.forced` removed from flows | [Guide](./11.migration-guide/v2.0.0/plugin-defaults-forced-removed/index.md) |
| `ForEach` / `ForEachItem` → `Loop` | [Guide](./11.migration-guide/v2.0.0/foreach-loop/index.md) |
| Trigger `conditions` → `when` | [Guide](./11.migration-guide/v2.0.0/trigger-conditions-redesign/index.md) |
| RBAC action model | [Guide](./11.migration-guide/v2.0.0/rbac-action-model/index.md) |
| Execution API response shape | [Guide](./11.migration-guide/v2.0.0/execution-api-response/index.md) |
| ION binary output format | [Guide](./11.migration-guide/v2.0.0/ion-binary-format/index.md) |
| `json()` function removed | [Guide](./11.migration-guide/v2.0.0/json-function-removed/index.md) |
| `local.Delete` recursive default changed | [Guide](./11.migration-guide/v2.0.0/local-delete-recursive-default/index.md) |
| Helm gRPC worker-controller changes | [Guide](./11.migration-guide/v2.0.0/helm-grpc-worker-controller/index.md) |
| Database migrations (EE) | [Guide](./11.migration-guide/v2.0.0/database-migrations/index.md) |
