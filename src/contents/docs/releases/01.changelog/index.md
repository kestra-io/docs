---
title: Kestra Changelog
h1: Changelog
sidebarTitle: Changelog
icon: /src/contents/docs/icons/admin.svg
description: A record of notable changes in each Kestra release, organized by version.
---

Notable changes by release. For a complete list of every release including patch versions, see the [full changelog](/docs/changelog) or the [GitHub releases](https://github.com/kestra-io/kestra/releases).

---

## 2.1.0

Infrastructure self-service in a dedicated tenant type, searchable execution values, custom webhook responses, new queue backends, and keyless cloud access.

### Infrastructure and assets

- **Infrastructure tenants (EE)**: a tenant type with a self-service catalog, requests, deployments, inventory, and approvals. [Docs](../../07.enterprise/02.governance/tenants/infrastructure/index.md)
- **App templates (EE)**: one template creates a flow and the app that runs it, with guardrails set by the platform team. [Docs](../../07.enterprise/02.governance/tenants/infrastructure/app-templates/index.md)
- **Inventory import (EE)**: import Terraform state, CSV, JSON, or YAML into the asset inventory. [Docs](../../07.enterprise/02.governance/tenants/infrastructure/index.md#import-an-existing-inventory)
- **Asset leases and day-2 actions (EE, Cloud)**: `ttl`, `owner`, and `status` fields on assets, the `TtlTrigger`, and asset actions with `when` conditions. [Docs](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#ttltrigger)
- **Asset relations (EE, Cloud)**: `partOf` and `related` model deployments and their resources, and replace lineage events. [Migration guide](../../11.migration-guide/v2.1.0/asset-relations/index.md)

<!-- TODO(GA): Data Orchestration Artifacts (dbt, Airbyte, Fivetran, JDBC) are changelog-only for 2.1 (no blog or social mention). Add one bullet once their plugin releases are confirmed for GA; dbt asset types and the Airbyte asset row depend on unreleased plugin versions. -->

### Workflow components

- **Searchable inputs and outputs**: mark an input or flow output `searchable: true` to find executions by a business value such as an order ID, from the **Inputs & Outputs** filter or the `searchableData` API filter. [Docs](../../05.workflow-components/06.outputs/index.md#searchable-outputs)
- **TABLE input (EE, Cloud)**: collect rows of typed records in a grid, validated per cell. [Docs](../../05.workflow-components/05.inputs/index.md#table-inputs)
- **Webhook responses and signatures**: set the status code, headers, and body returned to the caller, with or without `wait`, and verify HMAC request signatures. [Docs](../../05.workflow-components/07.triggers/03.webhook-trigger/index.md#customize-the-webhook-response)
- **Script checkpoints (beta)**: resume a script from its last checkpoint after a retry or restart. [Docs](../../16.scripts/10.checkpoints/index.md)
- **`AVG_DURATION` SLA**: breach when an execution is slower than the flow's recent average. [Docs](../../05.workflow-components/18.sla/index.md#avg_duration)
- **Flow trigger `waitForAllRetries`**: skip the intermediate `FAILED` states between flow-level retries. [Docs](../../05.workflow-components/07.triggers/02.flow-trigger/index.md)
- **Reschedule an execution**: move the `scheduleDate` of an execution that hasn't started with `POST /executions/{id}/actions/reschedule`. [Docs](../../05.workflow-components/03.execution/index.md)
- **Replay with modified inputs**: a whole-execution replay can reuse the original inputs or open the input form prefilled with them. [Docs](../../15.how-to-guides/replay/index.md#replay-with-modified-inputs)
- **`isLastDayOfMonth()`**: a Pebble function for month-end logic. [Docs](../../expressions/04.functions/06.dates/index.mdx)
- **Input `descriptionDisplayMode`**: show an input's description as a tooltip to keep long forms compact. [Docs](../../05.workflow-components/05.inputs/index.md)
- **Docker `tmpfs` mounts**: give a task container an in-memory scratch directory. [Docs](../../task-runners/04.types/02.docker-task-runner/index.md#in-memory-mounts-tmpfs)

### UI

- **Execution timeline**: a time-axis view of executions grouped by namespace and flow. [Docs](../../09.ui/02.executions/index.md#timeline)
- **Loop iterations in the Gantt**: expand a `Loop` to its iterations in place and step between failures. [Docs](../../09.ui/02.executions/index.md#loop-iterations)
- **Notifications**: the notifications bell comes to the open-source edition, and bulk actions on executions, triggers, and backfills report their progress there. [Docs](../../09.ui/index.mdx)
- **Bulk resume of breakpoints**: the **Resume** bulk action and the `resume/by-ids` and `resume/by-query` endpoints also resume executions stopped at a breakpoint. [Docs](../../15.how-to-guides/pause-resume/index.md)
- **Context panel (EE)**: the flow editor shows inputs, variables, KV pairs, and secrets across the namespace hierarchy in one searchable tree. [Docs](../../09.ui/01.flows/index.md)
- **Change password in OSS**: users with database-stored Basic Auth credentials can change their password from the user menu. [Docs](../../10.administrator-guide/basic-auth-troubleshooting/index.md)
- **One plugins page**: the catalog lists each plugin once, as a card or a table row. In EE, it also shows each plugin's installed versions, their source, and available updates, and the Instance Owner installs, updates, and uninstalls versions from it, with installs running in the background. [Docs](../../07.enterprise/05.instance/versioned-plugins/index.md#from-the-ui)
- **Sign in again without losing work**: when a session ends, the UI asks you to sign in again and retries the failed request, so unsaved changes stay. [Docs](../../09.ui/index.mdx#expired-sessions)

### AI

- **Platform MCP server**: expose the AI Copilot's tools for flows and executions to external MCP clients at `/api/v1/mcp`. [Docs](../../ai-orchestration/03.mcp-server/index.md#platform-mcp-server)
- **Copilot unit tests (EE, Cloud)**: generate a unit test for an existing flow. [Docs](../../develop-with-ai/01.ai-copilot/index.md#generate-a-unit-test)
- **`thinking-effort: none` (EE)**: AI Copilot works with OpenAI and Azure OpenAI reasoning deployments that reject tool calls unless reasoning is off. [Docs](../../configuration/06.enterprise-and-advanced/index.md)

### Security and governance

- **OIDC issuer (EE, Cloud)**: exchange a short-lived Kestra token for AWS or Google Cloud credentials, with no stored keys. [Docs](../../07.enterprise/03.auth/oidc-issuer/index.md)
- **SAML 2.0 SSO (EE)**: SP-initiated SAML login with group sync and Single Logout. [Docs](../../07.enterprise/03.auth/sso/saml/index.md)
- **Password expiration and reuse prevention (EE)**: Basic Auth password policies. [Docs](../../07.enterprise/03.auth/rbac/index.md#password-expiration-and-reuse)
- **One session per sign-in (EE, Cloud)**: signing in on another browser or device no longer ends your other sessions. [Docs](../../07.enterprise/03.auth/04.authentication/index.md#sessions)
- **Default retention policy (EE)**: choose how long to keep executions and logs when you set up the instance or create a tenant, and get the purge flow generated. [Docs](../../10.administrator-guide/purge/index.md#default-retention-flow)
- **Cases tickets and events (EE, Cloud)**: link external tickets to cases and trigger flows on case events. [Docs](../../07.enterprise/02.governance/cases/index.md#external-tickets)
- **Bulk invitations (EE)**: invite up to 25 users at once, and let invited users accept with their SSO provider. [Docs](../../07.enterprise/03.auth/invitations/index.md)
- **Impersonate service accounts (EE)**: Instance Owners can impersonate a service account, and impersonation is now reserved to Instance Owners. [Docs](../../07.enterprise/03.auth/rbac/index.md#impersonate)
- **LDAP user attributes (EE)**: the `user-attributes` mapping sets new users' email, first name, and last name. [Docs](../../07.enterprise/03.auth/sso/ldap/index.md)
- **Execution labels in test fixtures (EE)**: `fixtures.labels` sets the labels a flow gets in production. [Docs](../../07.enterprise/02.governance/unit-tests/index.md#set-execution-labels-in-fixtures)

### Infrastructure

- **New queue backends (EE)**: Google Cloud Pub/Sub, NATS JetStream, Amazon SQS/SNS, and Azure Event Hubs, configured under `kestra.queue.<type>`. [Docs](../../configuration/06.enterprise-and-advanced/index.md#message-broker-queue-backends)
- **Dedicated queue database**: run the JDBC queue in its own database. [Docs](../../configuration/02.runtime-and-storage/index.md#dedicated-queue-database)
- **PEM certificates for gRPC (EE)**: controller and worker mTLS can use PEM files directly, with hot reload. [Docs](../../configuration/06.enterprise-and-advanced/index.md#pem-certificates)
- **Executor loop intervals**: tune how often the executor checks SLA deadlines and delayed executions. [Docs](../../configuration/04.plugins-and-execution/index.md)
- **`PurgeMetrics`**: bulk-delete execution metrics without going through `PurgeExecutions`. [Docs](../../10.administrator-guide/purge/index.md)
- **Installed plugins API (EE)**: `GET /api/v1/plugins/installed` lists every plugin loaded on the instance and whether a newer version is available. [Docs](../../07.enterprise/05.instance/versioned-plugins/index.md)
- **Task runner details (EE)**: the Kubernetes, AWS Batch, Azure Batch, Azure VM, Google Batch, and Cloud Run task runners add a **Runner details** artifact with the configuration the run used. [Docs](../../task-runners/04.types/03.kubernetes-task-runner/index.md)
- **Plugin endpoints (preview)**: plugin UI components can call server-side logic defined in the plugin. [Docs](../../plugin-developer-guide/10.plugin-ui/index.md)

### Behavior changes

Smaller changes to existing behavior that don't need a migration guide.

- **API sort direction**: the `sort` query parameter accepts `asc` and `desc` in any case, and any other direction returns `422` instead of silently sorting descending. Also in 2.0.x.
- **`distinct` filter**: `{{ null | distinct }}` returns null instead of the string `"null"`, so `??`, `is null`, and `if` conditions behave as expected.
- **Execution live view**: the execution page reconnects its live stream after a dropped connection. The `GET /executions/{id}/follow` stream sends a heartbeat every 30 seconds and always ends after one hour.
- **Versioned Plugins screen (EE)**: the Instance Owner menu no longer has a Versioned Plugins entry. Plugin versions are managed from the **Plugins** page, and links to the former screen redirect there.

### Breaking changes

Each breaking change has a dedicated migration guide. See the [2.1 migration guide](../../11.migration-guide/v2.1.0/index.mdx) for the full overview.

| Change | Guide |
|---|---|
| Concurrency limit API | [Guide](../../11.migration-guide/v2.1.0/concurrency-limit-api/index.md) |
| `SYSTEM_SETTINGS` and `TENANT_SETTINGS` removed (EE) | [Guide](../../11.migration-guide/v2.1.0/settings-permissions-removed/index.md) |
| `USER: IMPERSONATE` removed (EE) | [Guide](../../11.migration-guide/v2.1.0/impersonate-permission-removed/index.md) |
| Namespace binding scope (EE) | [Guide](../../11.migration-guide/v2.1.0/namespace-binding-scope/index.md) |
| Server CLI commands deprecated | [Guide](../../11.migration-guide/v2.1.0/server-cli-commands-deprecated/index.md) |
| Queue configuration keys (EE) | [Guide](../../11.migration-guide/v2.1.0/queue-backend-configuration/index.md) |
| POST-only logout (EE) | [Guide](../../11.migration-guide/v2.1.0/sso-logout-post-only/index.md) |
| Asset lineage events replaced by relations (EE) | [Guide](../../11.migration-guide/v2.1.0/asset-relations/index.md) |
| dbt asset types (EE) | [Guide](../../11.migration-guide/v2.1.0/dbt-asset-types/index.md) |
| Webhook responses without `wait` | [Guide](../../11.migration-guide/v2.1.0/webhook-response-without-wait/index.md) |

---

## 2.0.0

A major release introducing AI-native orchestration, a redesigned trigger model, new enterprise governance features, and significant infrastructure improvements.

### AI

- **AI Copilot redesign** — persistent sidebar with Ask, Edit, and Plan modes; context pills; reads namespace metadata for credential-aware suggestions. [Docs](../../develop-with-ai/01.ai-copilot/index.md)
- **AI Agents** — build agentic pipelines with LLM task orchestration; token usage metrics per execution. [Docs](../../ai-orchestration/01.ai-agents/index.md)
- **AI RAG Workflows** — native retrieval-augmented generation support with vector store integration. [Docs](../../ai-orchestration/02.ai-rag-workflows/index.md)
- **MCP Server** — expose flows as MCP tools; connect from Claude Desktop, Claude Code, Cursor, and Codex. [Docs](../../ai-orchestration/03.mcp-server/index.md)
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

- **RBAC action model (EE)** — CRUD replaced by resource-plus-action permissions (`EXECUTION: ACCESS_LOGS`, `TRIGGER: BACKFILL`, etc.). New resources: `TRIGGER`, `SYSTEM_SETTINGS`, `TENANT_SETTINGS`, `COPILOT`, `MCP_SERVER`. Five managed roles ship with 2.0; existing roles migrate automatically. [Docs](../../07.enterprise/03.auth/rbac/index.md) [Migration guide](../../11.migration-guide/v2.0.0/rbac-action-model/index.md)
- **Policies (EE)** — enforce governance rules on flows at save and execution time, per namespace. [Docs](../../07.enterprise/02.governance/policies/index.md)
- **Management endpoint hardening** — `/env` disabled by default, health details require authentication, logger writes protected, `/worker` and `/scheduler` now sensitive, docker-compose no longer exposes port `8081`. [Migration guide](../../11.migration-guide/v2.0.0/management-endpoint-hardening/index.md)
- **HTTP task URL filtering** — allow-list and deny-list for URLs reachable by HTTP plugin tasks. [Docs](../../security-hardening/index.md#http-task-url-filtering)
- **ZIP bomb protection** — opt-in protection on flow import and namespace file upload via `kestra.security.zip-bomb-protection`. [Docs](../../security-hardening/index.md#zip-bomb-protection)
- **Multi-field secrets** — secrets can now store structured objects with multiple fields, not just single string values.
- **Instance Owner (formerly Super Admin)** — the Super Admin privilege is renamed to Instance Owner across the UI, CLI, config, and API. Deprecated aliases are retained; HTTP API responses emit `instanceOwner` instead of `superAdmin`. [Migration guide](../../11.migration-guide/v2.0.0/superadmin-renamed-instance-owner/index.md)

### Enterprise

New features available in the Enterprise Edition.

- **Cases** — track and resolve execution failures as incidents with automatic creation, deduplication, SLA targets, and a kanban board. [Docs](../../07.enterprise/02.governance/cases/index.md)
- **Promote** — copy flows between Kestra instances from the UI with a diff review, optional confirmation gate, drift detection across the flows list, and full promotion history. No Git pipeline required. [Docs](../../07.enterprise/02.governance/promote/index.md)
- **Custom Blueprints** — Pebble-templated flow skeletons with form fields, published to your organization's Blueprint library. [Docs](../../07.enterprise/02.governance/custom-blueprints/index.md)

### Developer experience

Improvements to the tools and workflows used to build and manage flows.

- **No-code Editor** — canvas-based flow editor alongside the YAML editor; Form and Source tabs per block; upstream output browser in the form panel; synced with the AI Copilot in real time. New `FORM` input type groups inputs into a multi-step wizard. [Docs](../../09.ui/01.flows/index.md)
- **VS Code namespace files** — Open namespace (VFS mount), Upload file, and Sync folder commands; `kestra.namespaceFiles.exclude` setting. [Docs](../../version-control-cicd/05.vscode/index.md)
- **Plugin Artifacts** — plugins can ship Vue.js frontend components (Module Federation) that load into named slots in the execution topology view, task side drawer, or task detail modal without changes to the core application. [Docs](../../plugin-developer-guide/10.plugin-ui/index.md)
- **Plugin file renderers** — plugins can register format-specific renderers for inline output file preview. [Docs](../../plugin-developer-guide/09.file-renderer/index.md)
- **Dynamic Apps content blocks** — Apps support content blocks that update based on execution state. [Docs](../../07.enterprise/04.scalability/apps/index.md)
- **`kestractl` IAM commands** — roles, role bindings, service accounts, and invitations via CLI. [Docs](../../kestra-cli/kestractl/index.md)
- **`flows bulk-update --delete` default changed to `false`** — deletion of flows absent from the file is now opt-in. Scripts relying on the previous default must pass `--delete` explicitly.

### Infrastructure

Changes to deployment, storage, and runtime behavior.

- **gRPC worker-controller** — JDBC queue replaced by gRPC; separates control plane (executor, scheduler, webserver) from data plane (workers). Workers connect to the controller rather than the database directly, enabling cross-region and restricted-network deployments. Task run outputs stored in dedicated storage rather than inline in the execution record.
- **New VM task runners** — AWS EC2 (SSM Run Command, no SSH, Spot support), Azure Virtual Machine (Run Command API, no SSH or public IP), Google Compute Engine (startup script, no SSH), Huawei Cloud CCI (bare Pods, OBS staging, AK/SK or temp credentials). [Docs](../../task-runners/04.types/index.mdx)
- **Worker Groups 2.0 (EE)** — tag-based routing via `workerSelector.tags` replaces `workerGroup.key`; Worker Queues as routing lanes; per-subscription capacity reservation (STRICT/ELASTIC modes); JWT worker authentication; declarative topology bootstrap via `kestra.ee.setup`. [Docs](../../07.enterprise/04.scalability/worker-group/index.md)
- **PurgeStorage** — storage-driven file cleanup by last-modified date, independent of execution records. Defaults to `dryRun: true`. [Docs](../../10.administrator-guide/purge/index.md)
- **Slim image + plugin auto-install** — `kestra/kestra:*-slim` ships without bundled plugins; set `KESTRA_PLUGINS_AUTO_INSTALL_ENABLED=true` to auto-fetch from Maven Central; this is the default configuration for the `-slim` image running locally. Renamed from `-no-plugins`. [Docs](../../02.installation/02.docker/index.md)
- **External Log Data Store (EE)** — route execution logs to a separate JDBC database or Elasticsearch, keeping the main database lean and reducing schema migration time. [Docs](../../10.administrator-guide/log-data-store/index.md)
- **ION binary format** — task output files in ION format stored as binary (~20–40% smaller). [Migration guide](../../11.migration-guide/v2.0.0/ion-binary-format/index.md)

### Additional

- **Execution API performance** — task run outputs moved to dedicated storage; `GET /executions/search` responses are significantly lighter. Integrations reading `taskRunList[*].outputs` should switch to `GET /outputs/{executionId}/{taskRunId}`. [Migration guide](../../11.migration-guide/v2.0.0/execution-api-response/index.md)
- **TRACEPARENT propagation** — pass `{{ trace.parent }}` as the `TRACEPARENT` environment variable in script tasks to parent OpenTelemetry spans under the Kestra task span.
- **mTLS on the worker channel** — worker-to-controller communication supports mutual TLS with per-worker client certificates. [Docs](../../configuration/06.enterprise-and-advanced/index.md#grpc-tlsmtls-ee-only)
- **Syslog CEF log exporter (EE)** — Log Shipper and Audit Log Shipper gain a Syslog CEF destination over TCP, UDP, or TLS for SIEM integration.
- **LDAP group-sync-only mode (EE)** — `mode: GROUP_SYNC_ONLY` uses LDAP exclusively for group membership resolution while keeping an existing SSO provider for login. [Docs](../../07.enterprise/03.auth/sso/ldap/index.md)
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
| `condition` → `when` on flow checks | [Guide](../../11.migration-guide/v2.0.0/checks-condition-renamed-when/index.md) |
| `CANCELED` enum alias removed | Replace with `CANCELLED` in flow expressions, API consumers, and tooling. |
| Four core tasks removed | `io.kestra.plugin.core.execution.Count`, `Resume`, `trigger.Toggle`, `log.Fetch` — replace with equivalents in `plugin-kestra`. |
| Terraform provider `~> 2.0` | [Guide](../../11.migration-guide/v2.0.0/terraform-provider/index.md) |
| `kestractl flows bulk-update --delete` default changed | Pass `--delete` explicitly; the flag now defaults to `false`. [Guide](../../11.migration-guide/v2.0.0/bulk-update-delete-default/index.md) |
