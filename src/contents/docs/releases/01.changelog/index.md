---
title: Kestra Changelog
h1: Changelog
sidebarTitle: Changelog
icon: /src/contents/docs/icons/admin.svg
description: A record of notable changes in each Kestra release, organized by version.
---

Notable changes by release. For a complete list of every release including patch versions, see the [full changelog](/docs/changelog) or the [GitHub releases](https://github.com/kestra-io/kestra/releases).

---

## 2.0.0

A major release introducing AI-native orchestration, a redesigned trigger model, new enterprise governance features, and significant infrastructure improvements.

### AI

- **AI Copilot redesign** — persistent sidebar with Ask, Edit, and Plan modes; context pills; reads namespace metadata for credential-aware suggestions. [Docs](../../ai-tools/01.ai-copilot/index.md)
- **AI Agents** — build agentic pipelines with LLM task orchestration; token usage metrics per execution. [Docs](../../ai-tools/05.ai-agents/index.md)
- **AI RAG Workflows** — native retrieval-augmented generation support with vector store integration. [Docs](../../ai-tools/07.ai-rag-workflows/index.md)
- **MCP Server** — expose flows as MCP tools; connect from Claude Desktop, Claude Code, Cursor, and Codex. [Docs](../../ai-tools/03.mcp-server/index.md)
- **MCP Tool Trigger** — invoke flows directly from MCP-compatible agents. [Docs](../../05.workflow-components/07.triggers/06.mcp-tool-trigger/index.md)

### Workflow components

Core primitives for building flows have been updated and extended.

- **Loop task** — unified replacement for `ForEach` and `ForEachItem` with cleaner expressions and output handling. [Migration guide](../../11.migration-guide/v2.0.0/foreach-loop/index.md)
- **Trigger `when`** — trigger `conditions` renamed to `when` Pebble expression across all trigger types. [Migration guide](../../11.migration-guide/v2.0.0/trigger-conditions-redesign/index.md)
- **Reusable Inputs (EE)** — define typed input schemas at namespace scope and reference them across flows. [Docs](../../05.workflow-components/05.inputs/index.md)
- **Quotas** — cap executions per time window at flow, namespace, or tenant scope. [Docs](../../05.workflow-components/21.quotas/index.md)
- **`subflow()` Pebble function** — invoke a subflow and retrieve its outputs inline in an expression. [Docs](../../expressions/04.functions/04.workflow/index.mdx)
- **Draft flows** — save flows as drafts to stage changes without affecting running executions; triggers and manual runs continue using the last published revision until you publish. [Docs](../../06.concepts/03.revision/index.md#draft-revisions)
- **Execution labels from triggers** — triggers can attach labels to the executions they create. [Docs](../../05.workflow-components/07.triggers/index.mdx)
- **Input enhancements** — SELECT/MULTISELECT support `{label, value}` pairs; JSON inputs accept `jsonSchema` for pre-execution validation. [Docs](../../05.workflow-components/05.inputs/index.md)
- **Date helper functions** — new Pebble functions for schedule logic: `isWeekend()`, `isPublicHoliday()`, `isDayWeekInMonth()`, `isLastWorkingDay()`. [Docs](../../expressions/04.functions/06.dates/index.mdx)

### Security

New controls for locking down what flows can do and how they are governed.

- **RBAC action model (EE)** — CRUD replaced by resource-plus-action permissions (`EXECUTION: ACCESS_LOGS`, `TRIGGER: BACKFILL`, etc.). New resources: `TRIGGER`, `SYSTEM_SETTINGS`, `TENANT_SETTINGS`, `COPILOT`, `MCP_SERVER`. Five managed roles ship with 2.0; existing roles migrate automatically. [Docs](../../07.enterprise/01.auth/rbac/index.md) [Migration guide](../../11.migration-guide/v2.0.0/rbac-action-model/index.md)
- **Policies (EE)** — enforce governance rules on flows at save and execution time, per namespace. [Docs](../../07.enterprise/02.governance/policies/index.md)
- **Management endpoint hardening** — `/env` disabled by default, health details require authentication, logger writes protected, `/worker` and `/scheduler` now sensitive, docker-compose no longer exposes port `8081`. [Migration guide](../../11.migration-guide/v2.0.0/management-endpoint-hardening/index.md)
- **HTTP task URL filtering** — allow-list and deny-list for URLs reachable by HTTP plugin tasks. [Docs](../../10.administrator-guide/security-hardening/index.md#http-task-url-filtering)
- **ZIP bomb protection** — opt-in protection on flow import and namespace file upload via `kestra.security.zip-bomb-protection`. [Docs](../../10.administrator-guide/security-hardening/index.md#zip-bomb-protection)
- **Multi-field secrets** — secrets can now store structured objects with multiple fields, not just single string values.
- **Instance Owner (formerly Super Admin)** — the Super Admin privilege is renamed to Instance Owner across the UI, CLI, config, and API. Deprecated aliases are retained; HTTP API responses emit `instanceOwner` instead of `superAdmin`. [Migration guide](../../11.migration-guide/v2.0.0/superadmin-renamed-instance-owner/index.md)

### Enterprise

New features available in the Enterprise Edition.

- **Cases** — track and resolve execution failures as incidents with automatic creation, deduplication, SLA targets, and a kanban board. [Docs](../../07.enterprise/02.governance/cases/index.md)
- **Promote** — copy flows between Kestra instances from the UI with a diff review, optional confirmation gate, drift detection across the flows list, and full promotion history. No Git pipeline required. [Docs](../../07.enterprise/02.governance/promote/index.md)
- **Custom Blueprints** — Pebble-templated flow skeletons with form fields, published to your organization's Blueprint library. [Docs](../../07.enterprise/02.governance/custom-blueprints/index.md)

### Developer experience

Improvements to the tools and workflows used to build and manage flows.

- **No-code Editor** — canvas-based flow editor alongside the YAML editor; Form and Source tabs per block; upstream output browser in the form panel; synced with the AI Copilot in real time. New `FORM` input type groups inputs into a multi-step wizard.
- **VS Code namespace files** — Open namespace (VFS mount), Upload file, and Sync folder commands; `kestra.namespaceFiles.exclude` setting. [Docs](../../version-control-cicd/05.vscode/index.md)
- **Plugin Artifacts** — plugins can ship Vue.js frontend components (Module Federation) that load into named slots in the execution topology view, task side drawer, or task detail modal without changes to the core application. [Docs](../../plugin-developer-guide/develop-plugin-artifacts/index.md)
- **Plugin file renderers** — plugins can register format-specific renderers for inline output file preview. [Docs](../../plugin-developer-guide/09.file-renderer/index.md)
- **Dynamic Apps content blocks** — Apps support content blocks that update based on execution state. [Docs](../../07.enterprise/04.scalability/apps/index.md)
- **`kestractl` IAM commands** — roles, role bindings, service accounts, and invitations via CLI. [Docs](../../kestra-cli/kestractl/index.md)

### Infrastructure

Changes to deployment, storage, and runtime behavior.

- **gRPC worker-controller** — JDBC queue replaced by gRPC; separates control plane (executor, scheduler, webserver) from data plane (workers). Workers connect to the controller rather than the database directly, enabling cross-region and restricted-network deployments. Task run outputs stored in dedicated storage rather than inline in the execution record.
- **New VM task runners** — AWS EC2 (SSM Run Command, no SSH, Spot support), Azure Virtual Machine (Run Command API, no SSH or public IP), Google Compute Engine (startup script, no SSH), Huawei Cloud CCI (bare Pods, OBS staging, AK/SK or temp credentials). [Docs](../../task-runners/04.types/index.md)
- **Worker Groups 2.0 (EE)** — tag-based routing via `workerSelector.tags` replaces `workerGroup.key`; Worker Queues as routing lanes; per-subscription capacity reservation (STRICT/ELASTIC modes); JWT worker authentication; declarative topology bootstrap via `kestra.ee.setup`. [Docs](../../07.enterprise/04.scalability/worker-group/index.md)
- **PurgeStorage** — storage-driven file cleanup by last-modified date, independent of execution records. Defaults to `dryRun: true`. [Docs](../../10.administrator-guide/purge/index.md)
- **Slim image + plugin auto-install** — `kestra/kestra:*-slim` ships without bundled plugins; set `KESTRA_PLUGINS_AUTO_INSTALL_ENABLED=true` to auto-fetch from Maven Central. Renamed from `-no-plugins`. [Docs](../../02.installation/02.docker/index.md)
- **External Log Data Store (EE)** — route execution logs to a separate JDBC database or Elasticsearch, keeping the main database lean and reducing schema migration time. [Docs](../../10.administrator-guide/log-data-store/index.md)
- **ION binary format** — task output files in ION format stored as binary (~20–40% smaller). [Migration guide](../../11.migration-guide/v2.0.0/ion-binary-format/index.md)

### Additional

- **Execution API performance** — task run outputs moved to dedicated storage; `GET /executions/search` responses are significantly lighter. Integrations reading `taskRunList[*].outputs` should switch to `GET /outputs/{executionId}/{taskRunId}`. [Migration guide](../../11.migration-guide/v2.0.0/execution-api-response/index.md)
- **TRACEPARENT propagation** — pass `{{ trace.parent }}` as the `TRACEPARENT` environment variable in script tasks to parent OpenTelemetry spans under the Kestra task span.
- **mTLS on the worker channel** — worker-to-controller communication supports mutual TLS with per-worker client certificates. [Docs](../../configuration/06.enterprise-and-advanced/index.md#grpc-tlsmtls-ee-only)
- **Syslog CEF log exporter (EE)** — Log Shipper and Audit Log Shipper gain a Syslog CEF destination over TCP, UDP, or TLS for SIEM integration.
- **LDAP group-sync-only mode (EE)** — `mode: GROUP_SYNC_ONLY` uses LDAP exclusively for group membership resolution while keeping an existing SSO provider for login. [Docs](../../07.enterprise/01.auth/sso/ldap/index.md)
- **Unit test `expectedState`** — flow unit tests can assert that a test case ends in `FAILED`, `WARNING`, or `KILLED`. [Docs](../../07.enterprise/02.governance/unit-tests/index.md)

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
| `execution-data.internal-storage` config removed (EE) | [Guide](../../11.migration-guide/v2.0.0/execution-data-internal-storage/index.md) |
| Super Admin renamed to Instance Owner (EE, Cloud) | [Guide](../../11.migration-guide/v2.0.0/superadmin-renamed-instance-owner/index.md) |
| SDK auth required for internal tasks | [Guide](../../11.migration-guide/v2.0.0/sdk-authentication/index.md) |
| `workerGroup.key` removed | Migrate to `workerSelector.tags`. Check `fallback` default change (WAIT → FAIL). [Guide](../../11.migration-guide/v2.0.0/helm-grpc-worker-controller/index.md) |
| `CANCELED` enum alias removed | Replace with `CANCELLED` in flow expressions, API consumers, and tooling. |
| Four core tasks removed | `io.kestra.plugin.core.execution.Count`, `Resume`, `trigger.Toggle`, `log.Fetch` — replace with equivalents in `plugin-kestra`. |
