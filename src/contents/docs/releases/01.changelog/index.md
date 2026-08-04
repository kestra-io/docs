---
title: Kestra Changelog
h1: Changelog
sidebarTitle: Changelog
icon: /src/contents/docs/icons/admin.svg
description: A record of notable changes in each Kestra release, organized by version.
---

Notable changes by release. For full details, see the [GitHub releases](https://github.com/kestra-io/kestra/releases).

---

## 2.0.0

A major release introducing AI-native orchestration, a redesigned trigger model, new enterprise governance features, and significant infrastructure improvements.

### AI

- **AI Copilot redesign** — persistent sidebar with Ask, Edit, and Plan modes; context pills; reads namespace metadata for credential-aware suggestions. [Docs](../../ai-tools/ai-copilot/index.md)
- **AI Agents** — build agentic pipelines with LLM task orchestration; token usage metrics per execution. [Docs](../../ai-tools/ai-agents/index.md)
- **AI RAG Workflows** — native retrieval-augmented generation support with vector store integration. [Docs](../../ai-tools/ai-rag-workflows/index.md)
- **MCP Server** — expose flows as MCP tools; connect from Claude Desktop, Claude Code, Cursor, and Codex. [Docs](../../ai-tools/mcp-server/index.md)
- **MCP Tool Trigger** — invoke flows directly from MCP-compatible agents. [Docs](../../05.workflow-components/07.triggers/06.mcp-tool-trigger/index.md)

### Workflow components

Core primitives for building flows have been updated and extended.

- **Loop task** — unified replacement for `ForEach` and `ForEachItem` with cleaner expressions and output handling. [Migration guide](../../11.migration-guide/v2.0.0/foreach-loop/index.md)
- **Trigger `when`** — trigger `conditions` renamed to `when` Pebble expression across all trigger types. [Migration guide](../../11.migration-guide/v2.0.0/trigger-conditions-redesign/index.md)
- **Reusable Inputs (EE)** — define typed input schemas at namespace scope and reference them across flows. [Docs](../../05.workflow-components/05.inputs/index.md)
- **Quotas** — cap executions per time window at flow, namespace, or tenant scope. [Docs](../../05.workflow-components/21.quotas/index.md)
- **`subflow()` Pebble function** — invoke a subflow and retrieve its outputs inline in an expression. [Docs](../../expressions/04.functions/04.workflow/index.mdx)
- **Execution labels from triggers** — triggers can attach labels to the executions they create. [Docs](../../05.workflow-components/07.triggers/index.mdx)
- **Input enhancements** — SELECT/MULTISELECT support `{label, value}` pairs; JSON inputs accept `jsonSchema` for pre-execution validation. [Docs](../../05.workflow-components/05.inputs/index.md)
- **Date helper functions** — new Pebble functions for schedule logic: `isWeekend()`, `isPublicHoliday()`, `isDayWeekInMonth()`, `isLastWorkingDay()`. [Docs](../../expressions/04.functions/06.dates/index.mdx)

### Security

New controls for locking down what flows can do and how they are governed.

- **Policies (EE)** — enforce governance rules on flows at save and execution time, per namespace. [Docs](../../07.enterprise/02.governance/policies/index.md)
- **Management endpoint hardening** — `/env` disabled by default, health details require authentication, logger writes protected, `/worker` and `/scheduler` now sensitive, docker-compose no longer exposes port `8081`. [Migration guide](../../11.migration-guide/v2.0.0/management-endpoint-hardening/index.md)
- **HTTP task URL filtering** — allow-list and deny-list for URLs reachable by HTTP plugin tasks. [Docs](../../10.administrator-guide/security-hardening/index.md#http-task-url-filtering)
- **ZIP bomb protection** — opt-in protection on flow import and namespace file upload via `kestra.security.zip-bomb-protection`. [Docs](../../10.administrator-guide/security-hardening/index.md#zip-bomb-protection)
- **Multi-field secrets** — secrets can now store structured objects with multiple fields, not just single string values.

### Enterprise

New features available in the Enterprise Edition.

- **Cases** — track and resolve execution failures as incidents with automatic creation, deduplication, SLA targets, and a Kanban board. [Docs](../../07.enterprise/02.governance/cases/index.md)
- **Custom Blueprints** — Pebble-templated flow skeletons with form fields, published to your organization's Blueprint library. [Docs](../../07.enterprise/02.governance/custom-blueprints/index.md)

### Developer experience

Improvements to the tools and workflows used to build and manage flows.

- **VS Code namespace files** — Open namespace (VFS mount), Upload file, and Sync folder commands; `kestra.namespaceFiles.exclude` setting. [Docs](../../version-control-cicd/05.vscode/index.md)
- **Plugin file renderers** — plugins can register format-specific renderers for inline output file preview. [Docs](../../plugin-developer-guide/09.file-renderer/index.md)
- **Dynamic Apps content blocks** — Apps support content blocks that update based on execution state. [Docs](../../07.enterprise/04.scalability/apps/index.md)
- **`kestractl` IAM commands** — roles, role bindings, service accounts, and invitations via CLI. [Docs](../../kestra-cli/kestractl/index.md)

### Infrastructure

Changes to deployment, storage, and runtime behavior.

- **GCE Task Runner** — ephemeral Google Compute Engine VMs per task execution. [Docs](../../task-runners/04.types/09.google-computeengine-task-runner/index.md)
- **Worker Groups** — `key` property removed; groups now identified by label selectors. [Docs](../../07.enterprise/04.scalability/worker-group/index.md)
- **External Log Data Store** — route execution logs to a separate JDBC database or Elasticsearch. [Docs](../../10.administrator-guide/log-data-store/index.md)
- **ION binary format** — task output files in ION format stored as binary (~20–40% smaller). [Migration guide](../../11.migration-guide/v2.0.0/ion-binary-format/index.md)

### Breaking changes

Each breaking change has a dedicated migration guide. See the [2.0 migration guide](../../11.migration-guide/v2.0.0/index.mdx) for the full overview.

| Change | Guide |
|---|---|
| `pluginDefaults` removed | [Guide](../../11.migration-guide/v2.0.0/plugin-defaults-removed/index.md) |
| `pluginDefaults.forced` removed from flows | [Guide](../../11.migration-guide/v2.0.0/plugin-defaults-forced-removed/index.md) |
| `ForEach` / `ForEachItem` → `Loop` | [Guide](../../11.migration-guide/v2.0.0/foreach-loop/index.md) |
| Trigger `conditions` → `when` | [Guide](../../11.migration-guide/v2.0.0/trigger-conditions-redesign/index.md) |
| RBAC action model | [Guide](../../11.migration-guide/v2.0.0/rbac-action-model/index.md) |
| Execution API response shape | [Guide](../../11.migration-guide/v2.0.0/execution-api-response/index.md) |
| ION binary output format | [Guide](../../11.migration-guide/v2.0.0/ion-binary-format/index.md) |
| `json()` function removed | [Guide](../../11.migration-guide/v2.0.0/json-function-removed/index.md) |
| `local.Delete` recursive default changed | [Guide](../../11.migration-guide/v2.0.0/local-delete-recursive-default/index.md) |
| Helm gRPC worker-controller changes | [Guide](../../11.migration-guide/v2.0.0/helm-grpc-worker-controller/index.md) |
| Management endpoint hardening | [Guide](../../11.migration-guide/v2.0.0/management-endpoint-hardening/index.md) |
| Database migrations (EE) | [Guide](../../11.migration-guide/v2.0.0/database-migrations/index.md) |
