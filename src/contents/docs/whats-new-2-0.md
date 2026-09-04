---
title: "What's New in Kestra 2.0"
h1: What's New in Kestra 2.0
sidebarTitle: What's New in 2.0
icon: /src/contents/docs/icons/admin.svg
description: Overview of every major feature, capability, and behavior change in Kestra 2.0.
version: ">= 2.0.0"
---

Kestra 2.0 is a major release introducing AI-native orchestration, redesigned governance, and significant infrastructure improvements.

For breaking changes and migration steps, see the [2.0 migration guide](./11.migration-guide/v2.0.0/index.mdx).

## AI

Native AI capabilities built into the platform for flow authoring, agent orchestration, and external tool integration.

### AI Copilot

The [AI Copilot](./ai-tools/01.ai-copilot/index.md) has been redesigned as a persistent sidebar with three modes:

- **Ask** — answers questions about Kestra using docs-grounded responses
- **Edit** — generates and iteratively refines flow YAML with a confirmation step before applying changes
- **Plan** — proposes a step-by-step execution plan; each step requires individual approval

Context pills attach the resource you are viewing automatically. The Copilot reads Namespace metadata (Policies, Variables, Secrets, KV pairs) so it can reuse your configured credentials in suggestions.

### AI Agents

[AI Agents](./ai-tools/05.ai-agents/index.md) let you build agentic pipelines using LLM task orchestration within flows. Agents emit usage metrics so you can track token consumption per execution.

### AI RAG Workflows

[RAG Workflows](./ai-tools/07.ai-rag-workflows/index.md) provide native support for retrieval-augmented generation pipelines, including vector store integration and chunking tasks.

### MCP Server and MCP Tool Trigger

The [Kestra MCP server](./ai-tools/03.mcp-server/index.md) exposes flows as tools AI agents can call. The complementary [MCP Tool Trigger](./05.workflow-components/07.triggers/06.mcp-tool-trigger/index.md) lets flows be invoked directly by MCP-compatible agents. [Agent Skills](./ai-tools/04.agent-skills/index.md) extend this with reusable tool definitions.

---

## Workflow components

Updates to the core primitives used to build flows.

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

### Draft flows

The flow editor now supports [saving flows as drafts](./06.concepts/03.revision/index.md#draft-revisions). Use **Save as draft** to stage changes without affecting running executions; any trigger or manual run continues to use the last published revision until you explicitly publish. This lets you iterate on a flow that is already in production without disrupting live executions. When you're ready, click **Publish** in the run panel's draft warning banner to make the draft active.

### Execution labels from triggers

[Triggers](./05.workflow-components/07.triggers/index.mdx) can now attach labels directly to the executions they create, making it easier to filter and group executions in dashboards.

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

New controls for what flows can access and how they are governed.

### HTTP task URL filtering

[HTTP task filtering](./10.administrator-guide/security-hardening/index.md#http-task-url-filtering) lets operators configure allow-lists and deny-lists for URLs reachable by HTTP plugin tasks, blocking access to metadata endpoints and internal services.

---

## Enterprise

New capabilities available in Enterprise Edition.

### RBAC: action-based permissions (EE)

The CRUD permission model (READ, CREATE, UPDATE, DELETE on generic resources) is replaced by a resource-plus-action model. Each resource exposes only the actions that make sense for it, for example `EXECUTION: ACCESS_LOGS`, `EXECUTION: FOLLOW`, and `TRIGGER: BACKFILL`. New resources in 2.0 include `TRIGGER`, `SYSTEM_SETTINGS`, `TENANT_SETTINGS`, `COPILOT`, and `MCP_SERVER`. Five managed roles ship with 2.0: Viewer, Launcher, Editor, Developer, and Admin. Existing custom roles and bindings migrate automatically on upgrade. See the [RBAC reference](./07.enterprise/03.auth/rbac/index.md) and [migration guide](./11.migration-guide/v2.0.0/rbac-action-model/index.md).

### Instance Owner (formerly Super Admin)

The Super Admin privilege is renamed to [Instance Owner](./07.enterprise/05.instance/00.instance-owner/index.md). The privilege itself is unchanged. Instance Owners retain the same instance-wide authority over tenants, IAM, infrastructure, and governance. Deprecated aliases are retained for the CLI, config, and HTTP request bodies. HTTP API responses now emit `instanceOwner` instead of `superAdmin`.

### Policies (EE)

[Policies](./07.enterprise/02.governance/policies/index.md) enforce governance rules on flows at save time and execution time. Rules can require specific task types, block others, or validate property values, applied per namespace.

### Cases (EE)

[Cases](./07.enterprise/02.governance/cases/index.md) is a full incident management system built into Kestra. When an execution fails, it becomes an incident you can track without leaving the platform.

The `CreateCase` task opens a case automatically from your flow's `errors`, `finally`, or `afterExecution` block. With `linkMatchingExecutions: true`, repeated failures of the same flow and task attach to the already-open case rather than creating a new one, keeping alert volume under control when a single outage generates dozens of executions. Cases track severity, status (`Open`, `Acknowledged`, `Investigating`, `Resolved`), SLA targets with live countdowns, assignees and watchers, linked executions and assets, and one-click remediation actions. A kanban board and list view surface all open incidents across the tenant.

### Promote (EE)

[Promote](./07.enterprise/02.governance/promote/index.md) copies a flow from one Kestra instance to another directly from the UI, with no Git pipeline required.

From the **Promote** tab on any flow, select a target environment, review a source-to-target diff, and confirm. A **Deploy** column in the flows list shows the drift state of every flow (`IN_SYNC`, `OUT_OF_SYNC`, `NOT_PROMOTED`) so you can see at a glance what needs to be deployed. Production targets can require an explicit confirmation gate before any promotion lands. Promotion history is recorded per flow and surfaced in the audit log.

Promote is the right path for teams that author flows in the Kestra UI and run separate instances per environment but do not want to maintain a CI/CD pipeline. Teams already using Git as the source of truth should continue with [Git-based deployment](./version-control-cicd/04.git/index.md).

### Custom Blueprints (EE)

[Custom Blueprints](./07.enterprise/02.governance/custom-blueprints/index.md) let you publish Pebble-templated flow skeletons to your organization's Blueprint library. Each blueprint defines form fields using standard input types; when a user instantiates it, Kestra renders the template into a ready-to-use flow. Useful for standardizing common flow patterns across teams.

---

## Developer experience

Improvements to the tools and workflows used to build and manage flows.

### VS Code extension: Namespace files

The [VS Code extension](./version-control-cicd/05.vscode/index.md) now supports three namespace file commands: **Open namespace** (mounts a namespace as a live folder), **Upload file to namespace**, and **Sync folder to namespace**. The `kestra.namespaceFiles.exclude` setting controls which files are skipped during upload and sync.

### Plugin file renderers

[Plugin file renderers](./plugin-developer-guide/09.file-renderer/index.md) allow plugins to register custom renderers so task output files are previewed inline in the Kestra UI with format-specific rendering.

### Dynamic Apps content blocks

[Apps](./07.enterprise/04.scalability/apps/index.md) support dynamic content blocks that update based on execution state, enabling richer interactive UIs built on flow outputs.

### No-code Editor

The [No-code editor](./09.ui/01.flows/index.md) is a visual flow builder that sits alongside the YAML editor. Each flow section (Triggers, Tasks, Errors, Finally, After Execution) renders as a list of blocks. Clicking a block opens a side panel with a **Form** tab (guided fields with inline documentation) and a **Source** tab (raw YAML for that block). The left panel lists every upstream task output and execution context variable available at that point in the flow.

All three views (YAML editor, No-code editor, and AI Copilot) stay in sync. Changes made in any view reflect immediately in the others.

A new `FORM` input type groups related inputs into a labeled multi-step wizard in the Execute modal.

### `kestractl` IAM commands

The `kestractl` CLI now supports IAM management: roles, role bindings, service accounts, and invitations. See the [kestractl reference](./kestra-cli/kestractl/index.md).

### Plugin Artifacts

Plugins can ship Vue.js frontend components that load into the Kestra UI at runtime without changes to the core application. Components target named slots in the execution topology view, task side drawer, or task detail modal. They are compiled as Module Federation micro-frontends using `@kestra-io/artifact-sdk` and bundled into the plugin JAR. See the [plugin artifact developer guide](./plugin-developer-guide/10.plugin-ui/index.md).

---

## Infrastructure

Changes to deployment, storage, and runtime behavior.

### New VM task runners

Four new task runners ship in 2.0 for workloads that require direct VM control:

- [AWS EC2 Task Runner](./task-runners/04.types/05.aws-ec2-task-runner/index.md) — runs commands on EC2 via AWS Systems Manager Run Command; no SSH required. Supports Spot instances and reattaches mid-run if the Kestra Worker restarts.
- [Azure Virtual Machine Task Runner](./task-runners/04.types/07.azure-virtualmachine-task-runner/index.md) — runs commands on Azure VMs via the Azure Run Command API; no SSH and no public IP required.
- [Google Compute Engine Task Runner](./task-runners/04.types/09.google-computeengine-task-runner/index.md) — runs commands directly on a Compute Engine VM as a startup script; no SSH or IAP tunnel.
- [Huawei Cloud CCI Task Runner](./task-runners/04.types/11.huawei-cci-task-runner/index.md) (EE) — runs tasks as bare Pods on Huawei Cloud CCI with OBS file staging, flavor-tier resource sizing, and AK/SK or temporary credential authentication.

### Worker Groups 2.0 (EE)

Worker Groups 2.0 separates three concerns the previous model conflated: Workers (compute units), Worker Groups (pools of workers), and Worker Queues (tag-based routing lanes).

Tasks declare routing requirements with `workerSelector.tags` instead of the removed `workerGroup.key`:

- `match: ALL` requires all tags to be present; `match: ANY` requires at least one
- `fallback` controls behavior when a matching queue exists but has no live workers: `FAIL` (new default), `WAIT`, `CANCEL`, or `IGNORE`

**Capacity reservation**: each Worker Group subscription supports a `reservedPercent` floor on its thread pool. Two modes control idle slot behavior: `STRICT` keeps reserved capacity exclusive; `ELASTIC` lends idle slots to other queues and reclaims them on demand. Reservations update live without restarting workers.

**Worker authentication**: workers authenticate via JWT. A registration token is created in the UI or via `kestractl`; the worker exchanges it on first connect for a short-lived access token and rotating refresh token. Revoking a token cuts off that worker at the next refresh.

**Declarative topology bootstrap**: `kestra.ee.setup` in `application.yml` lets you declare the full topology (queues, groups, subscriptions, registration tokens) at startup. Provisioning uses create-if-not-exists semantics, so restarts are safe and the database remains the source of truth once an entity exists.

See the [Worker Groups reference](./07.enterprise/04.scalability/worker-group/index.md) and [migration guide](./11.migration-guide/v2.0.0/helm-grpc-worker-controller/index.md).

### External Log Data Store (EE)

[External Log Data Store](./10.administrator-guide/log-data-store/index.md) routes execution logs to a dedicated JDBC database or Elasticsearch, separate from the main backend, to reduce database size and speed up migrations.

### ION output files are binary

Task output files in ION format are now stored as binary ION rather than text. Existing text ION files remain readable. See the [migration guide](./11.migration-guide/v2.0.0/ion-binary-format/index.md).

### Architecture: gRPC worker-controller

The JDBC queue that handled all worker communication in 1.x is replaced by a gRPC-based controller. Workers connect to the controller over gRPC instead of directly to the database, which separates the control plane (executor, scheduler, webserver) from the data plane (workers). Workers are independently deployable across regions, inside restricted networks, or within infrastructure you control.

This also enables a leaner execution context: task run outputs are stored in dedicated storage rather than inline in the execution record, reducing database size and improving execution list load time on large instances.

See the [Architecture](./08.architecture/index.mdx) page for the current model.

### PurgeStorage

[`PurgeStorage`](./10.administrator-guide/purge/index.md) walks the internal storage tree and deletes files based on last-modified date, regardless of whether a matching execution record exists. This fills a gap left by `PurgeExecutions`, which is database-driven and cannot clean files whose execution records are already gone. The task defaults to `dryRun: true`. Use `workerSelector.tags` to target a specific worker group's isolated storage.

### Slim image and plugin auto-install

The `kestra/kestra:*-slim` image ships without bundled plugins. Set `KESTRA_PLUGINS_AUTO_INSTALL_ENABLED=true` to have Kestra fetch plugins from Maven Central before execution and cache them for subsequent runs. The suffix was renamed from `-no-plugins` to `-slim` in 2.0. See the [Docker installation guide](./02.installation/02.docker/index.md).

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
| `execution-data.internal-storage` config removed (EE) | [Guide](./11.migration-guide/v2.0.0/execution-data-internal-storage/index.md) |
| Super Admin renamed to Instance Owner (EE, Cloud) | [Guide](./11.migration-guide/v2.0.0/superadmin-renamed-instance-owner/index.md) |
| SDK auth required for internal tasks | [Guide](./11.migration-guide/v2.0.0/sdk-authentication/index.md) |
| `workerGroup.key` removed | [Guide](./11.migration-guide/v2.0.0/helm-grpc-worker-controller/index.md) |
| Management endpoint hardening | [Guide](./11.migration-guide/v2.0.0/management-endpoint-hardening/index.md) |
| `condition` → `when` on flow checks | [Guide](./11.migration-guide/v2.0.0/checks-condition-renamed-when/index.md) |
| `CANCELED` enum alias removed | Replace with `CANCELLED` in expressions, API consumers, and tooling |
| Four core tasks removed | `Count`, `Resume`, `trigger.Toggle`, `log.Fetch`: use `plugin-kestra` equivalents |
| Terraform provider `~> 2.0` | [Guide](./11.migration-guide/v2.0.0/terraform-provider/index.md) |
