---
title: Kestra 2.1.0 Changelog
h1: Kestra 2.1.0 Changelog
sidebarTitle: 2.1.0
icon: /src/contents/docs/icons/admin.svg
description: Notable changes in Kestra 2.1.0, including new features, behavior changes, and breaking changes.
---

Approvals, asset leases and the ASSET input, searchable execution values, custom webhook responses, new queue backends, and keyless cloud access.

## Assets

- **Asset leases and day-2 actions (EE, Cloud)**: `ttl`, `owner`, and `status` fields on assets, the `TtlTrigger`, and asset actions with `when` conditions. [Docs](../../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#ttltrigger)
- **ASSET input and output (EE, Cloud)**: let users pick assets from a searchable list filtered by type, ID, namespace, status, or metadata, and read them in tasks with the new `asset()` function. [Docs](../../../05.workflow-components/05.inputs/index.md#asset-inputs)
- **Asset relations (EE, Cloud)**: `partOf` and `related` model deployments and their resources, and replace lineage events. [Migration guide](../../../11.migration-guide/v2.1.0/asset-relations/index.md)
- **Bulk asset API (EE, Cloud)**: create or update many assets in one request, with a dry run to preview the result. [Docs](../../../07.enterprise/02.governance/01.assets/03.manage-assets/index.md#create-or-update-assets-in-bulk)

<!-- TODO(GA): dbt artifacts and asset types (plugin-dbt#350, #351, #362, #364) are held for a plugin release after core 2.1. Add dbt to the Artifacts bullet under UI once they ship. -->

## Workflow components

- **Approval task**: pause an execution until a reviewer approves or denies it, with tasks for each decision, review comments and inputs, automatic approval, and expiry. In EE and Cloud, assign reviewers, track requests on the **Approvals** page, and chain sign-offs. [Docs](../../../05.workflow-components/23.approvals/index.md)
- **Searchable inputs and outputs**: mark an input or flow output `searchable: true` to find executions by a business value such as an order ID, from the **Inputs & Outputs** filter or the `searchableData` API filter. [Docs](../../../05.workflow-components/06.outputs/index.md#searchable-outputs)
- **Reusable Inputs editor (EE, Cloud)**: edit a set of reusable inputs in its own editor, in No Code or YAML, with `TABLE` defaults in a grid, drafts, and revisions. New `Set`, `List`, and `Delete` tasks manage sets from a flow. [Docs](../../../05.workflow-components/22.reusable-inputs/index.md#edit-a-set-in-the-ui)
- **TABLE input (EE, Cloud)**: collect rows of typed records in a grid, validated per cell. [Docs](../../../05.workflow-components/05.inputs/index.md#table-inputs)
- **Webhook responses**: set the headers and body returned to the caller, and set the status code without `wait`. [Docs](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md#customize-the-webhook-response)
- **Webhook signatures**: verify HMAC request signatures. Also in 2.0.10. [Docs](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md#verify-the-request-signature)
- **Flowable tasks in `WorkingDirectory`**: nest `Parallel`, `If`, `Switch`, and other flowable tasks in a `WorkingDirectory`; all their tasks run in its directory on one worker. Each `WorkingDirectory` now shows `<id>_open` and `<id>_close` task runs, a task's own `retry` reruns it in place, and other retries, restarts, and replays rerun the whole `WorkingDirectory`. [Docs](../../../05.workflow-components/01.tasks/00.flowable-tasks/index.md#workingdirectory)
- **Script checkpoints (beta)**: resume a script from its last checkpoint after a retry or restart. [Docs](../../../16.scripts/10.checkpoints/index.md)
- **`AVG_DURATION` SLA**: breach when an execution is slower than the flow's recent average. [Docs](../../../05.workflow-components/18.sla/index.md#avg_duration)
- **Flow trigger `waitForAllRetries`**: skip the intermediate `FAILED` states between flow-level retries. [Docs](../../../05.workflow-components/07.triggers/02.flow-trigger/index.md)
- **Reschedule an execution**: move the `scheduleDate` of an execution that hasn't started with `POST /executions/{id}/actions/reschedule`. [Docs](../../../05.workflow-components/03.execution/index.md)
- **`isLastDayOfMonth()`**: a Pebble function for month-end logic. [Docs](../../../expressions/04.functions/06.dates/index.mdx)
- **Input `descriptionDisplayMode`**: show an input's description as a tooltip to keep long forms compact. [Docs](../../../05.workflow-components/05.inputs/index.md)
- **Docker `tmpfs` mounts**: give a task container an in-memory scratch directory. [Docs](../../../task-runners/04.types/02.docker-task-runner/index.md#in-memory-mounts-tmpfs)
- **Loop `parseValues`**: read the fields of JSON object values as `item.value.field` instead of parsing them with `fromJson`. [Docs](../../../05.workflow-components/01.tasks/00.flowable-tasks/index.md#read-object-fields-with-parsevalues)
- **Loop `breakWhen`**: stop a `Loop` from starting new iterations once a condition is true after an iteration ends. Also in 2.0.4. [Docs](../../../05.workflow-components/01.tasks/00.flowable-tasks/index.md#stop-early-with-breakwhen)
- **Concurrency `queueLimit`**: with `behavior: QUEUE`, cap how many executions wait in the queue. Incoming executions beyond the cap are `CANCELLED`. [Docs](../../../05.workflow-components/14.concurrency/index.md#behavior-property)

## UI

- **Restarting a subflow execution**: the restart dialog warns that restarting an execution created by a parent leaves the parent `FAILED`, and links to the parent execution to restart from there. [Docs](../../../15.how-to-guides/subflow-executions/index.md)
- **Execution artifacts**: an execution's **Artifacts** tab, and an artifact button on the task nodes that have one, show what data tasks did: the SQL a JDBC task ran and the tables it read and wrote, an Airbyte job's per-stream sync stats, or a Fivetran connector's freshness and per-table breakdown. [Docs](../../../09.ui/02.executions/index.md#artifacts)
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

- **Kestra MCP Server**: give external MCP clients the AI Copilot's tools at `/api/v1/mcp`, up to 78 of them, to read and change flows, executions, logs, namespace files, and KV entries, plus apps, test suites, groups, and banners in EE, where every call runs with the caller's permissions. [Docs](../../../develop-with-ai/05.kestra-mcp-server/index.md)
- **Copilot unit tests (EE, Cloud)**: generate a unit test for an existing flow. [Docs](../../../develop-with-ai/01.ai-copilot/index.md#generate-a-unit-test)
- **Review Copilot flow changes on the graph**: a flow draft's Graph tab marks each task as added, changed, renamed, moved, or removed, and the apply confirmation counts each kind of change. [Docs](../../../develop-with-ai/01.ai-copilot/index.md#review-a-flow-change)
- **All Copilot providers in Open Source**: the open-source edition supports every AI Copilot provider (Amazon Bedrock, Anthropic, Azure OpenAI, DeepSeek, Google Gemini, Google Vertex AI, Mistral, OpenAI, OpenRouter, and Ollama) and several providers with a default, not only Gemini. A provider entry with an unknown `type` is now logged and skipped instead of stopping startup. [Docs](../../../develop-with-ai/01.ai-copilot/index.md#configure-an-llm-provider)
- **Copilot free tier (OSS)**: an instance with no LLM provider uses a free Copilot hosted by Kestra. Turn it off with `kestra.ai.free-tier.enabled: false`. [Docs](../../../develop-with-ai/01.ai-copilot/index.md#free-tier)
- **Copilot usage limits**: cap each provider's spend for the whole instance and per user, by day, week, or month. Copilot shows the share left. [Docs](../../../develop-with-ai/01.ai-copilot/index.md#set-usage-limits)
- **`thinking-effort: none`**: AI Copilot works with OpenAI and Azure OpenAI reasoning deployments that reject tool calls unless reasoning is off. [Docs](../../../configuration/06.enterprise-and-advanced/index.md)

## Security and governance

- **OIDC issuer (EE)**: exchange a short-lived Kestra token for AWS, Google Cloud, or JFrog credentials, with no stored keys, per instance, tenant, or namespace. [Docs](../../../07.enterprise/03.auth/oidc-issuer/index.md)
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
- **Audit log for concurrency counter resets (EE)**: changing a running counter on the **Concurrency Limits** page or through the API writes an audit log entry. [Docs](../../../05.workflow-components/14.concurrency/index.md#reset-a-stuck-running-counter)

## Infrastructure

- **`kestra.state` span attribute**: OpenTelemetry spans of the Executor and Worker carry the execution or task run state. Also in 2.0.7. [Docs](../../../10.administrator-guide/open-telemetry/index.md#span-attributes)
- **New queue backends (EE)**: Google Cloud Pub/Sub, NATS JetStream, Amazon SQS/SNS, and Azure Event Hubs, configured under `kestra.queue.<type>`. [Docs](../../../configuration/06.enterprise-and-advanced/index.md#message-broker-queue-backends)
- **Expressions in `workerSelector` tags (EE)**: route a task, trigger, or flow from an input or an earlier output, as `workerGroup.key` allowed in 1.x. A blank tag falls through to the next routing level. Also in 2.0.11. [Docs](../../../07.enterprise/04.scalability/worker-group/index.md#choose-tags-at-runtime)
- **Dedicated queue database**: run the JDBC queue in its own database. [Docs](../../../configuration/02.runtime-and-storage/index.md#dedicated-queue-database)
- **PEM certificates for gRPC (EE)**: controller and worker mTLS can use PEM files directly, with hot reload. [Docs](../../../configuration/06.enterprise-and-advanced/index.md#pem-certificates)
- **Executor loop intervals**: tune how often the executor checks SLA deadlines and delayed executions. [Docs](../../../configuration/04.plugins-and-execution/index.md)
- **`PurgeMetrics`**: bulk-delete execution metrics without going through `PurgeExecutions`. [Docs](../../../10.administrator-guide/purge/index.md)
- **Plugin downloads through an authenticating proxy**: plugin downloads send `http(s).proxyUser` and `http(s).proxyPassword` to the proxy, and skip it for hosts in `http.nonProxyHosts`. [Docs](../../../10.administrator-guide/mitm-proxy-configuration/index.md#authenticate-plugin-downloads-with-the-proxy)
- **Installed plugins API (EE)**: `GET /api/v1/plugins/installed` lists every plugin loaded on the instance and whether a newer version is available. [Docs](../../../07.enterprise/05.instance/versioned-plugins/index.md)
- **Task runner details (EE)**: the Kubernetes, AWS Batch, Azure Batch, Azure VM, Google Batch, and Cloud Run task runners add a **Runner details** artifact with the configuration the run used. [Docs](../../../task-runners/04.types/03.kubernetes-task-runner/index.md)
- **Plugin endpoints (preview)**: plugin UI components can call server-side logic defined in the plugin. [Docs](../../../plugin-developer-guide/10.plugin-ui/index.md)

## Plugins

- **Microsoft Defender XDR**: list, get, and update alerts and incidents, run advanced hunting queries, and trigger flows on new or updated alerts and incidents, in the Microsoft 365 plugin from version 1.11.0. [Docs](/plugins/plugin-microsoft365)
- **Proofpoint TAP (EE)**: a new plugin that fetches URL clicks, threat messages, and the events that reached users from the TAP SIEM API, gets threat summaries and forensic evidence, lists Very Attacked People, and triggers flows on new SIEM events. [Docs](/plugins/plugin-ee-proofpoint)
- **Torq (EE)**: a new plugin that runs Torq workflows through their webhook, lists and reads workflows and their executions, queries, reads, updates, and comments on cases, and triggers flows on new or updated cases. [Docs](/plugins/plugin-ee-torq)

## Behavior changes

Smaller changes to existing behavior that don't need a migration guide.

- **`assets()` function (EE)**: returns only assets the flow's namespace can reach under allowed namespaces, and `namespace` matches that namespace and its child namespaces instead of any namespace starting with the same characters. [Docs](../../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#assets-pebble-function)
- **Metadata backup of namespace files (EE)**: a backup keeps the latest revision of each namespace file and empty folders, and a restore no longer creates `run.py.v2`-style copies. Archives from earlier versions still restore each revision as a separate file, so take a new backup after upgrading. [Docs](../../../10.administrator-guide/backup-and-restore/index.md#what-is-included)
- **API sort direction**: the `sort` query parameter accepts `asc` and `desc` in any case, and any other direction returns `422` instead of silently sorting descending. Also in 2.0.x.
- **`distinct` filter**: `{{ null | distinct }}` returns null instead of the string `"null"`, so `??`, `is null`, and `if` conditions behave as expected.
- **Execution live view**: the execution page reconnects its live stream after a dropped connection. The `GET /executions/{id}/follow` stream sends a heartbeat every 30 seconds and always ends after one hour.
- **MCP Flows**: the **Tenant → MCP Servers** page is renamed **MCP Flows**, so it isn't confused with the Kestra MCP Server. Server IDs, the `/api/v1/{tenant}/mcp-servers` API, and the `kestractl mcp-servers` commands don't change. [Docs](../../../ai-orchestration/03.mcp-server/index.md)
- **Schedule trigger and daylight saving time**: when clocks spring forward and the cron time falls in the skipped hour, the schedule runs once that day at the time moved forward by the gap, such as `03:00` instead of `02:00`. Before, that day's run was skipped. [Docs](../../../05.workflow-components/07.triggers/01.schedule-trigger/index.md#daylight-saving-time)
- **Triggers list**: Webhook, MCP Tool, Flow, and asset event triggers now appear in **Tenant → Triggers** and the triggers API, with the `kind` `UNSCHEDULED` in the API, including on existing flows after the upgrade. Disable them in the flow source, since they can't be toggled there. [Docs](../../../05.workflow-components/07.triggers/index.mdx#disabling-a-trigger-from-the-ui)
- **HTTPS behind a reverse proxy**: Kestra treats a request forwarded with `X-Forwarded-Proto: https` or `Forwarded: proto=https` as HTTPS, so it marks its cookies `Secure` and sends a configured `Strict-Transport-Security` header behind a TLS-terminating proxy. The new `kestra.webserver.cookies.secure` setting forces the cookie attribute on or off. [Docs](../../../configuration/03.observability-and-networking/index.md#secure-cookies)
- **Helm chart and autoscalers**: the chart no longer sets the replica count of a component whose `autoscaler` is enabled, so `helm upgrade` stops failing on a field conflict (Helm 4) or resetting the pod count (Helm 3). For KEDA or your own HPA, set the new `autoscaler.external`. With Helm 3, the upgrade that turns either setting on can drop the component to one pod once. [Docs](../../../10.administrator-guide/high-availability/index.md#autoscale-components)
- **RFC 1123 labels (EE)**: worker selector tags, Worker Queue ids and tags, Worker Group ids, and policy ids accept at most 63 characters, the RFC 1123 limit, instead of 64. A 64-character value is rejected. [Docs](../../../07.enterprise/04.scalability/worker-group/index.md)
- **`Dag` interrupts running tasks when one fails**: `onChildFailure` now defaults to `FAIL`, like `Parallel`. Set it to `CONTINUE` to let the other tasks finish. Also in 2.0.8. [Migration guide](../../../11.migration-guide/v2.0.0/parallel-dag-on-child-failure/index.md)
- **`BOOL` inputs**: a value other than `true` or `false`, in any letter case, is rejected instead of being read as `false`. For example, `yes` and `1` are rejected. Also in 2.0.1. [Docs](../../../05.workflow-components/05.inputs/index.md)
- **Killing an ended execution**: `DELETE /executions/{executionId}/actions/kill` returns `409` when the execution has ended and has no running task or subflow execution left, instead of `200` with nothing done.
- **`system` label key reserved**: a label with the bare key `system` is refused like other system labels, with `System labels can only be set by Kestra itself`. Rename any such label before you save the flow again. [Docs](../../../06.concepts/system-labels/index.md#system-labels)
- **Replay on another revision**: replaying from a task run on another flow revision is refused when a task before it, an input, or a variable changed, since Kestra would reuse results the original revision produced. [Docs](../../../15.how-to-guides/replay/index.md#replay-on-another-flow-revision)
- **Versioned Plugins screen (EE)**: the Instance Owner menu no longer has a Versioned Plugins entry. Plugin versions are managed from the **Plugins** page, and links to the former screen redirect there.

## Breaking changes

Each breaking change has a dedicated migration guide. See the [2.1 migration guide](../../../11.migration-guide/v2.1.0/index.mdx) for the full overview.

| Change | Guide |
|---|---|
| Concurrency limit API | [Guide](../../../11.migration-guide/v2.1.0/concurrency-limit-api/index.md) |
| `SYSTEM_SETTINGS` and `TENANT_SETTINGS` removed (EE) | [Guide](../../../11.migration-guide/v2.1.0/settings-permissions-removed/index.md) |
| `USER: IMPERSONATE` removed (EE) | [Guide](../../../11.migration-guide/v2.1.0/impersonate-permission-removed/index.md) |
| Namespace binding scope (EE) | [Guide](../../../11.migration-guide/v2.1.0/namespace-binding-scope/index.md) |
| Allowed Namespaces for internal storage URIs (EE) | [Guide](../../../11.migration-guide/v2.1.0/storage-uri-allowed-namespaces/index.md) |
| Server CLI commands deprecated | [Guide](../../../11.migration-guide/v2.1.0/server-cli-commands-deprecated/index.md) |
| Queue configuration keys (EE) | [Guide](../../../11.migration-guide/v2.1.0/queue-backend-configuration/index.md) |
| POST-only logout (EE) | [Guide](../../../11.migration-guide/v2.1.0/sso-logout-post-only/index.md) |
| Asset lineage events replaced by relations (EE) | [Guide](../../../11.migration-guide/v2.1.0/asset-relations/index.md) |
| dbt asset types (EE) | [Guide](../../../11.migration-guide/v2.1.0/dbt-asset-types/index.md) |
| Asset write timing (EE) | [Guide](../../../11.migration-guide/v2.1.0/asset-write-timing/index.md) |
| Webhook responses without `wait` | [Guide](../../../11.migration-guide/v2.1.0/webhook-response-without-wait/index.md) |
| Namespace IDs with an empty segment | [Guide](../../../11.migration-guide/v2.1.0/namespace-id-empty-segment/index.md) |
| Helm worker group selector (EE) | [Guide](../../../11.migration-guide/v2.1.0/helm-worker-group-selector/index.md) |
| Flow output types | [Guide](../../../11.migration-guide/v2.1.0/flow-output-types/index.md) |
| Restart on another revision deprecated | [Guide](../../../11.migration-guide/v2.1.0/restart-revision-deprecated/index.md) |
