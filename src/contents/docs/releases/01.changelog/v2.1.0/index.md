---
title: Kestra 2.1.0 Changelog
h1: Kestra 2.1.0 Changelog
sidebarTitle: 2.1.0
icon: /src/contents/docs/icons/admin.svg
description: Notable changes in Kestra 2.1.0, including new features, behavior changes, and breaking changes.
---

Infrastructure self-service in a dedicated tenant type, searchable execution values, custom webhook responses, new queue backends, and keyless cloud access.

## Infrastructure and assets

- **Infrastructure tenants (EE)**: a tenant type with a self-service catalog, requests, deployments, inventory, and approvals. [Docs](../../../07.enterprise/02.governance/tenants/infrastructure/index.md)
- **App templates (EE)**: one template creates a flow and the app that runs it, with guardrails set by the platform team. [Docs](../../../07.enterprise/02.governance/tenants/infrastructure/app-templates/index.md)
- **Inventory import (EE)**: import Terraform state, CSV, JSON, or YAML into the asset inventory. [Docs](../../../07.enterprise/02.governance/tenants/infrastructure/index.md#import-an-existing-inventory)
- **Asset leases and day-2 actions (EE, Cloud)**: `ttl`, `owner`, and `status` fields on assets, the `TtlTrigger`, and asset actions with `when` conditions. [Docs](../../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#ttltrigger)
- **ASSET input and output (EE, Cloud)**: let users pick assets from a searchable list filtered by type, ID, namespace, status, or metadata, and read them in tasks with the new `asset()` function. [Docs](../../../05.workflow-components/05.inputs/index.md#asset-inputs)
- **Asset relations (EE, Cloud)**: `partOf` and `related` model deployments and their resources, and replace lineage events. [Migration guide](../../../11.migration-guide/v2.1.0/asset-relations/index.md)

<!-- TODO(GA): Data Orchestration Artifacts (dbt, Airbyte, Fivetran, JDBC) are changelog-only for 2.1 (no blog or social mention). Add one bullet once their plugin releases are confirmed for GA; dbt asset types and the Airbyte asset row depend on unreleased plugin versions. -->

## Workflow components

- **Approval task**: pause an execution until a reviewer approves or denies it, with tasks for each decision, review comments and inputs, automatic approval, and expiry. In EE and Cloud, assign reviewers, track requests on the **Approvals** page, and chain sign-offs. [Docs](../../../05.workflow-components/23.approvals/index.md)
- **Searchable inputs and outputs**: mark an input or flow output `searchable: true` to find executions by a business value such as an order ID, from the **Inputs & Outputs** filter or the `searchableData` API filter. [Docs](../../../05.workflow-components/06.outputs/index.md#searchable-outputs)
- **Reusable Inputs editor (EE, Cloud)**: edit a set of reusable inputs in its own editor, in No Code or YAML, with `TABLE` defaults in a grid, drafts, and revisions. New `Set`, `List`, and `Delete` tasks manage sets from a flow. [Docs](../../../05.workflow-components/22.reusable-inputs/index.md#edit-a-set-in-the-ui)
- **TABLE input (EE, Cloud)**: collect rows of typed records in a grid, validated per cell. [Docs](../../../05.workflow-components/05.inputs/index.md#table-inputs)
- **Webhook responses**: set the headers and body returned to the caller, and set the status code without `wait`. [Docs](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md#customize-the-webhook-response)
- **Webhook signatures**: verify HMAC request signatures. Also in 2.0.10. [Docs](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md#verify-the-request-signature)
- **Script checkpoints (beta)**: resume a script from its last checkpoint after a retry or restart. [Docs](../../../16.scripts/10.checkpoints/index.md)
- **`AVG_DURATION` SLA**: breach when an execution is slower than the flow's recent average. [Docs](../../../05.workflow-components/18.sla/index.md#avg_duration)
- **Flow trigger `waitForAllRetries`**: skip the intermediate `FAILED` states between flow-level retries. [Docs](../../../05.workflow-components/07.triggers/02.flow-trigger/index.md)
- **Reschedule an execution**: move the `scheduleDate` of an execution that hasn't started with `POST /executions/{id}/actions/reschedule`. [Docs](../../../05.workflow-components/03.execution/index.md)
- **`isLastDayOfMonth()`**: a Pebble function for month-end logic. [Docs](../../../expressions/04.functions/06.dates/index.mdx)
- **Input `descriptionDisplayMode`**: show an input's description as a tooltip to keep long forms compact. [Docs](../../../05.workflow-components/05.inputs/index.md)
- **Docker `tmpfs` mounts**: give a task container an in-memory scratch directory. [Docs](../../../task-runners/04.types/02.docker-task-runner/index.md#in-memory-mounts-tmpfs)

## UI

- **Execution timeline**: a time-axis view of executions grouped by namespace and flow. [Docs](../../../09.ui/02.executions/index.md#timeline)
- **Loop iterations in the Gantt**: expand a `Loop` to its iterations in place and step between failures. [Docs](../../../09.ui/02.executions/index.md#loop-iterations)
- **Notifications**: the notifications bell comes to the open-source edition, and bulk actions on executions, triggers, and backfills report their progress there. A new `Notify` task sends notifications to users from a flow. [Docs](../../../09.ui/index.mdx#notifications)
- **Bulk resume of breakpoints**: the **Resume** bulk action and the `resume/by-ids` and `resume/by-query` endpoints also resume executions stopped at a breakpoint. [Docs](../../../15.how-to-guides/pause-resume/index.md)
- **Context panel (EE)**: the flow editor's context panel is redesigned as one searchable tree of inputs, variables, KV pairs, and secrets across the namespace hierarchy. [Docs](../../../09.ui/01.flows/index.md)
- **Change password in OSS**: users with database-stored Basic Auth credentials can change their password from the user menu. [Docs](../../../10.administrator-guide/basic-auth-troubleshooting/index.md)
- **One plugins page**: the catalog lists each plugin once, as a card or a table row. In EE, it also shows each plugin's installed versions, their source, and available updates, and the Instance Owner installs, updates, and uninstalls versions from it, with installs running in the background. [Docs](../../../07.enterprise/05.instance/versioned-plugins/index.md#from-the-ui)
- **Dashboard charts from flow outputs (EE)**: the `Outputs` data source charts an ION file that a flow returns as an output, read from the flow's latest successful execution. [Docs](../../../09.ui/00.dashboard/index.md#outputs-ee-and-cloud-only)
- **Sign in again without losing work**: when a session ends, the UI asks you to sign in again and retries the failed request, so unsaved changes stay. [Docs](../../../09.ui/index.mdx#expired-sessions)

## AI

- **Kestra MCP Server**: expose the AI Copilot's tools for flows and executions to external MCP clients at `/api/v1/mcp`. [Docs](../../../develop-with-ai/05.kestra-mcp-server/index.md)
- **Copilot unit tests (EE, Cloud)**: generate a unit test for an existing flow. [Docs](../../../develop-with-ai/01.ai-copilot/index.md#generate-a-unit-test)
- **Copilot free tier (OSS)**: an instance with no LLM provider uses a free Copilot hosted by Kestra. Turn it off with `kestra.ai.free-tier.enabled: false`. [Docs](../../../develop-with-ai/01.ai-copilot/index.md#free-tier)
- **Copilot usage limits**: cap each provider's spend for the whole instance and per user, by day, week, or month. Copilot shows the share left. [Docs](../../../develop-with-ai/01.ai-copilot/index.md#set-usage-limits)
- **`thinking-effort: none` (EE)**: AI Copilot works with OpenAI and Azure OpenAI reasoning deployments that reject tool calls unless reasoning is off. [Docs](../../../configuration/06.enterprise-and-advanced/index.md)

## Security and governance

- **OIDC issuer (EE, Cloud)**: exchange a short-lived Kestra token for AWS or Google Cloud credentials, with no stored keys. [Docs](../../../07.enterprise/03.auth/oidc-issuer/index.md)
- **SAML 2.0 SSO (EE)**: SP-initiated SAML login with group sync and Single Logout. [Docs](../../../07.enterprise/03.auth/sso/saml/index.md)
- **Password expiration and reuse prevention (EE)**: Basic Auth password policies. [Docs](../../../07.enterprise/03.auth/rbac/index.md#password-expiration-and-reuse)
- **One session per sign-in (EE, Cloud)**: signing in on another browser or device no longer ends your other sessions. [Docs](../../../07.enterprise/03.auth/04.authentication/index.md#sessions)
- **Default retention policy (EE)**: choose how long to keep executions and logs when you set up the instance or create a tenant, and get the purge flow generated. [Docs](../../../10.administrator-guide/purge/index.md#default-retention-flow)
- **Cases tickets and events (EE, Cloud)**: link external tickets to cases and trigger flows on case events. [Docs](../../../07.enterprise/02.governance/cases/index.md#external-tickets)
- **Bulk invitations (EE)**: invite up to 25 users at once. Accepting an invitation with an SSO provider is also in 2.0.10. [Docs](../../../07.enterprise/03.auth/invitations/index.md)
- **Impersonate service accounts (EE)**: Instance Owners can impersonate a service account, and impersonation is now reserved to Instance Owners. [Docs](../../../07.enterprise/03.auth/rbac/index.md#impersonate)
- **LDAP user attributes (EE)**: the `user-attributes` mapping now sets new users' email, first name, and last name. Earlier versions accepted the setting but ignored it. [Docs](../../../07.enterprise/03.auth/sso/ldap/index.md)
- **Execution labels in test fixtures (EE)**: `fixtures.labels` sets the labels a flow gets in production. [Docs](../../../07.enterprise/02.governance/unit-tests/index.md#set-execution-labels-in-fixtures)
- **Dedicated storage and secrets manager form (EE)**: a namespace or tenant's dedicated internal storage and secrets manager are set in a form built from the plugin's properties, and saved values are kept when you edit them. [Docs](../../../07.enterprise/02.governance/tenants/index.md#dedicated-storage-and-secrets-backend-per-tenant)

## Infrastructure

- **New queue backends (EE)**: Google Cloud Pub/Sub, NATS JetStream, Amazon SQS/SNS, and Azure Event Hubs, configured under `kestra.queue.<type>`. [Docs](../../../configuration/06.enterprise-and-advanced/index.md#message-broker-queue-backends)
- **Dedicated queue database**: run the JDBC queue in its own database. [Docs](../../../configuration/02.runtime-and-storage/index.md#dedicated-queue-database)
- **PEM certificates for gRPC (EE)**: controller and worker mTLS can use PEM files directly, with hot reload. [Docs](../../../configuration/06.enterprise-and-advanced/index.md#pem-certificates)
- **Executor loop intervals**: tune how often the executor checks SLA deadlines and delayed executions. [Docs](../../../configuration/04.plugins-and-execution/index.md)
- **`PurgeMetrics`**: bulk-delete execution metrics without going through `PurgeExecutions`. [Docs](../../../10.administrator-guide/purge/index.md)
- **Plugin downloads through an authenticating proxy**: plugin downloads send `http(s).proxyUser` and `http(s).proxyPassword` to the proxy, and skip it for hosts in `http.nonProxyHosts`. [Docs](../../../10.administrator-guide/mitm-proxy-configuration/index.md#authenticate-plugin-downloads-with-the-proxy)
- **HTTP tasks through the JVM proxy**: opt-in `kestra.tasks.http.use-system-proxy` makes HTTP tasks without `options.proxy` use `http(s).proxyHost`, `http.nonProxyHosts` and the proxy credentials. [Docs](../../../configuration/04.plugins-and-execution/index.md#http-tasks-behind-a-forward-proxy)
- **Installed plugins API (EE)**: `GET /api/v1/plugins/installed` lists every plugin loaded on the instance and whether a newer version is available. [Docs](../../../07.enterprise/05.instance/versioned-plugins/index.md)
- **Task runner details (EE)**: the Kubernetes, AWS Batch, Azure Batch, Azure VM, Google Batch, and Cloud Run task runners add a **Runner details** artifact with the configuration the run used. [Docs](../../../task-runners/04.types/03.kubernetes-task-runner/index.md)
- **Plugin endpoints (preview)**: plugin UI components can call server-side logic defined in the plugin. [Docs](../../../plugin-developer-guide/10.plugin-ui/index.md)

## Plugins

- **Microsoft Defender XDR**: list, get, and update alerts and incidents, run advanced hunting queries, and trigger flows on new or updated alerts and incidents, in the Microsoft 365 plugin from version 1.11.0. [Docs](/plugins/plugin-microsoft365)

## Behavior changes

Smaller changes to existing behavior that don't need a migration guide.

- **`assets()` function (EE)**: returns only assets the flow's namespace can reach under allowed namespaces, and `namespace` matches that namespace and its child namespaces instead of any namespace starting with the same characters. [Docs](../../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#assets-pebble-function)
- **API sort direction**: the `sort` query parameter accepts `asc` and `desc` in any case, and any other direction returns `422` instead of silently sorting descending. Also in 2.0.x.
- **`distinct` filter**: `{{ null | distinct }}` returns null instead of the string `"null"`, so `??`, `is null`, and `if` conditions behave as expected.
- **Execution live view**: the execution page reconnects its live stream after a dropped connection. The `GET /executions/{id}/follow` stream sends a heartbeat every 30 seconds and always ends after one hour.
- **MCP Flows**: the **Tenant → MCP Servers** page is renamed **MCP Flows**, so it isn't confused with the Kestra MCP Server. Server IDs, the `/api/v1/{tenant}/mcp-servers` API, and the `kestractl mcp-servers` commands don't change. [Docs](../../../ai-orchestration/03.mcp-server/index.md)
- **Triggers list**: Webhook, MCP Tool, Flow, and asset event triggers now appear in **Tenant → Triggers** and the triggers API with the type `UNSCHEDULED`, including on existing flows after the upgrade. Disable them in the flow source, since they can't be toggled there. [Docs](../../../05.workflow-components/07.triggers/index.mdx#disabling-a-trigger-from-the-ui)
- **Versioned Plugins screen (EE)**: the Instance Owner menu no longer has a Versioned Plugins entry. Plugin versions are managed from the **Plugins** page, and links to the former screen redirect there.

## Breaking changes

Each breaking change has a dedicated migration guide. See the [2.1 migration guide](../../../11.migration-guide/v2.1.0/index.mdx) for the full overview.

| Change | Guide |
|---|---|
| Concurrency limit API | [Guide](../../../11.migration-guide/v2.1.0/concurrency-limit-api/index.md) |
| `SYSTEM_SETTINGS` and `TENANT_SETTINGS` removed (EE) | [Guide](../../../11.migration-guide/v2.1.0/settings-permissions-removed/index.md) |
| `USER: IMPERSONATE` removed (EE) | [Guide](../../../11.migration-guide/v2.1.0/impersonate-permission-removed/index.md) |
| Namespace binding scope (EE) | [Guide](../../../11.migration-guide/v2.1.0/namespace-binding-scope/index.md) |
| Server CLI commands deprecated | [Guide](../../../11.migration-guide/v2.1.0/server-cli-commands-deprecated/index.md) |
| Queue configuration keys (EE) | [Guide](../../../11.migration-guide/v2.1.0/queue-backend-configuration/index.md) |
| POST-only logout (EE) | [Guide](../../../11.migration-guide/v2.1.0/sso-logout-post-only/index.md) |
| Asset lineage events replaced by relations (EE) | [Guide](../../../11.migration-guide/v2.1.0/asset-relations/index.md) |
| dbt asset types (EE) | [Guide](../../../11.migration-guide/v2.1.0/dbt-asset-types/index.md) |
| Asset write timing (EE) | [Guide](../../../11.migration-guide/v2.1.0/asset-write-timing/index.md) |
| Webhook responses without `wait` | [Guide](../../../11.migration-guide/v2.1.0/webhook-response-without-wait/index.md) |
