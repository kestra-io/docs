---
title: "Kestra 2.1: Infrastructure Self-Service, Searchable Executions, and Durable Scripts"
description: "Infrastructure tenants give platform teams a self-service catalog with leases and day-2 actions. Executions can be found by business values, scripts can resume from checkpoints, and SAML 2.0 and three new queue backends join the Enterprise Edition."
date: 2026-12-02T10:00:00
category: News & Product Updates
authors:
  - name: "AJ Emerich"
    linkedin: https://www.linkedin.com/in/alex-emerich/
    image: aemerich
    role: Technical Writer
# TODO: add header image, then uncomment
# image: ./kestra-2-1-header.jpg
---

<!--
DRAFT NOTES (remove before publishing)
- Sources: Release=2.1 + kind/highlight issues (project 15) and docs/release-2-1 branch content.
- Embargoed: Data Orchestration Artifacts (dbt/Airbyte/Fivetran/JDBC) stay out of this post (changelog only). Plugin endpoints are described generically for that reason.
- Left out on purpose: Bring Your Own Worker (Cloud, PoC Q1 2027), auto-emitted Terraform/OpenTofu assets (not shipped, ee#9222 not planned), plugin auto-install on EE (ee#11724 not planned), Failure Debug panel (kestra#19317 still open; add if it lands), Health Center/Diagnostics (open), Source Search (shipped in 2.0).
- Items marked "VERIFY" in comments need confirmation before publishing.
-->

Kestra 2.1 is available today. 2.0 split Kestra into a control plane and a data plane and made the queue a choice independent of the database. 2.1 builds on that in two directions: platform teams get a dedicated tenant type for running infrastructure as a self-service product, and flow authors get ways to find, resume, and respond to executions that previously needed custom code.

The table below lists the main features in this release and the edition they belong to.

| Feature | What | Edition |
|---|---|---|
| Infrastructure tenants | Self-service catalog, requests, deployments, inventory, and approvals in a dedicated tenant type | EE |
| App templates | One template creates a flow and the app that runs it, with guardrails set by the platform team | EE |
| Inventory import | Import Terraform state, CSV, JSON, or YAML into the asset inventory | EE |
| Asset leases and day-2 actions | `ttl`, `owner`, and `status` fields, `TtlTrigger`, and conditional actions on assets | EE, Cloud |
| Asset relations | `partOf` and `related` to model deployments and their resources | EE, Cloud |
| Searchable inputs and outputs | Find executions by a business value such as an order ID | OSS, EE, Cloud |
| TABLE input | Collect rows of typed records in a grid | EE, Cloud |
| Webhook custom responses | Set the status code, headers, and body returned to the caller | OSS, EE, Cloud |
| Script checkpoints (beta) | Resume a script from its last checkpoint after a retry or restart | OSS, EE, Cloud |
| Execution timeline | A time-axis view of executions grouped by namespace and flow | OSS, EE, Cloud |
| `AVG_DURATION` SLA | Breach when a run is slower than the flow's recent average | OSS, EE, Cloud |
| Cases tickets and events | Link external tickets to cases and trigger flows on case events | EE, Cloud |
| Apps: Grid and Chart blocks | Multi-column layouts and dashboard charts inside apps | EE, Cloud |
| AI Copilot unit tests | Generate a unit test for an existing flow | EE, Cloud |
| SAML 2.0 SSO | SP-initiated SAML login with group sync and Single Logout | EE |
| Password expiration and reuse prevention | Basic Auth password policies | EE |
| New queue backends | Google Cloud Pub/Sub, NATS JetStream, and Amazon SQS/SNS | EE |
| Dedicated queue database | Run the JDBC queue in its own database | OSS, EE |

<!-- VERIFY: edition for checkpoints (no edition marker on the page), execution timeline (kestra#19334, OSS per PR), and AVG_DURATION SLA. -->

:::alert{type="info"}
**Upgrading from 2.0?** A few API and configuration changes need attention, including the concurrency limit API, removed settings permissions, and stricter `by-query` filters. See [Upgrade and Migration](#upgrade-and-migration) and the [v2.1.0 migration hub](/docs/migration-guide/v2.1.0).
:::

## Infrastructure Tenants

Platform teams using Kestra for provisioning tend to build the same things on top of it: a catalog of approved requests, a list of what's deployed and who owns it, and a way to clean up what nobody uses anymore. In 2.1 that set of screens ships as a tenant type.

Each tenant now has a `type`, either `DEFAULT` or `INFRASTRUCTURE`. An Infrastructure tenant opens on a **Catalog** and adds a Self-Service section to the sidebar with Requests, Deployments, Inventory, Approvals, Cases, and Dashboards. No feature is removed by choosing a type; the Infrastructure type changes the home page and navigation around the day-2 operations use case. The type is set in the tenant creation wizard, in tenant settings, or with `"type": "INFRASTRUCTURE"` on the tenants API.

A new Infrastructure tenant comes with a working example environment (catalog apps, flows, an overview dashboard, and an app template) and a product tour, so the moving parts can be explored before anything is built. The examples can be removed in one call, and seeding can be disabled with `kestra.ee.tenant-examples.enabled: false`.

<!-- TODO: screenshot of the Infrastructure tenant Catalog -->

### App templates

An app template creates a flow and the app that runs it in one step, in a namespace picked by whoever uses the template. The platform team fixes the guardrails (allowed regions, repository, database versions), and other teams fill in a short form and get a new entry in the App Catalog.

```yaml
id: << arg.name >>-provision
inputs:
  - id: region
    type: SELECT
    values: << arg.allowed_regions >>
```

Templates can start from a working example or be generated from an existing flow. They are managed under **Templates** in Infrastructure tenants and through the `/app-templates` API in any tenant. See [App templates](/docs/enterprise/governance/tenants/infrastructure/app-templates).

### Inventory import

Most teams adopting Kestra for infrastructure already have resources that Kestra didn't provision. The **Import** button on the Deployments and Inventory pages accepts Terraform state files, CSV or TSV, and JSON, JSONL, or YAML. Each resource becomes an asset, grouped under a single deployment. A preview shows which resources are new, which will be updated, and which belong to another deployment before anything is written, and the import is all-or-nothing.

For scripted imports, the same thing is available through `POST /api/v1/<tenant>/assets/bulk`, with `dryRun=true` for a preview. See [Import an existing inventory](/docs/enterprise/governance/tenants/infrastructure#import-an-existing-inventory).

<!-- VERIFY: inventory import is source-verified only, not runtime-tested. -->

### Leases, owners, and expiry

Assets gain three top-level fields: `status`, `ttl`, and `owner`.

```yaml
- id: staging-cluster-eu
  type: io.kestra.plugin.ee.assets.VM
  status: active
  ttl: "2026-12-01T00:00:00.000Z"
  owner: group:platform
```

The new `TtlTrigger` fires when an asset is about to expire or has expired, which is enough to warn an owner a week ahead and tear the resource down when the lease ends:

```yaml
triggers:
  - id: warn_7_days
    type: io.kestra.plugin.ee.assets.TtlTrigger
    on: EXPIRING
    expiresWithin: P7D
```

From the **TTL & Lease** card on a deployment, the expiry can be extended with a preset or a date picker, and expiry handling flows can be generated at the asset, namespace, or tenant level (only the most specific one runs). Owners also get in-app notifications when their assets expire. See [TtlTrigger](/docs/enterprise/governance/assets/tasks-and-triggers#ttltrigger).

<!-- VERIFY: TTL runtime test plan pending; TTL & Lease card screenshots outstanding. -->

### Day-2 actions with conditions

Asset actions attach flows that users run from the asset page, such as resize, snapshot, or decommission. In 2.1 each action can carry `when` conditions, so an action is only available when the resource is in the right state:

```yaml
- namespace: company.infra
  flowId: decommission_vm
  label: Decommission
  when:
    - field: status
      operator: EQUAL_TO
      value: active
```

When a condition isn't met, the UI says why (for example, "status must equal active (currently decommissioned)"), and the API returns a 409 instead of starting the run. Conditions can check any field, including `metadata.<key>`, with 16 operators. See [Asset actions](/docs/enterprise/governance/assets/declare-assets#asset-actions).

### Asset relations

`partOf` sets an asset's parent and `related` links up to 50 other assets without a direction. Together they model a deployment and the resources inside it, or a VM and the load balancer in front of it, without encoding relationships in metadata. Both appear as edges on the asset graph, and deleting a parent either detaches or deletes its parts.

```yaml
partOf:
  id: deploy-prod-eu
  role: primary
related:
  - id: lb-prod-eu
    role: backend
```

Relations replace the lineage-events API, which is removed in 2.1. Read the [asset relations migration guide](/docs/migration-guide/v2.1.0/asset-relations) before upgrading; the migration drops the old tables.

## Searchable Inputs and Outputs

Finding the execution that processed a specific order or customer used to mean copying the value into a label or searching logs. In 2.1, any flow input or output can be marked `searchable: true`, and its value is indexed for search.

```yaml
outputs:
  - id: orderIds
    type: ARRAY
    value: "{{ outputs.parse.values.orderIds }}"
    searchable: true
```

A searchable `ARRAY` stores each item separately, so one execution can be found by any of the order IDs it handled, which labels can't do. Values are filtered from the **Inputs & Outputs** filter on the Executions page or with `filters[searchableData][EQUALS][orderIds]=ORD-8841` on the executions API. Input values are indexed when the execution is created and output values when it ends. Matching is exact and case-sensitive, and only new executions are indexed. See [Searchable outputs](/docs/workflow-components/outputs#searchable-outputs) and [Searchable inputs](/docs/workflow-components/inputs#searchable-inputs).

## TABLE Input

The `TABLE` input collects a list of typed records in a grid, for cases like a set of disks, firewall rules, or users to onboard, where a JSON input would push the formatting work onto the person filling the form.

```yaml
- id: disks
  type: TABLE
  minRows: 1
  maxRows: 8
  columns:
    - id: size_gb
      type: INT
      min: 10
      max: 2048
```

Every cell is validated and all errors are shown at once. Rows are referenced as `{{ inputs.disks[0].size_gb }}` and can be iterated with `Loop` and the new `parseValues: true` property, which turns JSON object values into maps so `item.value.size_gb` works without `fromJson()`. See [TABLE inputs](/docs/workflow-components/inputs#table-inputs).

<!-- VERIFY: TABLE input Cloud availability (TODO in source). -->

## Webhook Custom Responses

Several providers verify a webhook URL before sending events to it, and expect a specific response: Meta echoes `hub.challenge`, Microsoft Graph sends a `validationToken`, and Asana sends an `X-Hook-Secret` header. The Webhook trigger now accepts `responseCode`, `responseHeaders`, and `responseBody`, all of which support expressions:

```yaml
triggers:
  - id: meta
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('META_WEBHOOK_KEY') }}"
    responseCode: 200
    responseHeaders:
      Content-Type: text/plain
    responseBody: "{{ trigger.parameters['hub.challenge'][0] ?? 'EVENT_RECEIVED' }}"
```

Reading flow `outputs` in the response requires `wait: true`, and `responseBody` can't be combined with `returnOutputs`. See [Customize the webhook response](/docs/workflow-components/triggers/webhook-trigger#customize-the-webhook-response).

<!-- VERIFY: Asana handshake not confirmed; check responseCode-without-wait behavior and body serialization without Content-Type. Example trigger id/key lines are mine, not from the docs page. -->

## Script Checkpoints (Beta)

A script that fails at batch 300 of 400 used to start again from batch 1 on retry. With `durable: true`, a script task can save key-value checkpoints, and retries, restarts, and worker resubmissions resume from the last one.

```yaml
- id: process
  type: io.kestra.plugin.scripts.shell.Script
  durable: true
  retry:
    type: constant
    interval: PT5S
    maxAttempts: 3
  script: |
    start=${CHECKPOINTS_NEXT_BATCH:-0}
    for batch in $(seq "$start" 9); do
      echo "Processing batch $batch"
      echo "::{\"checkpoints\": {\"next_batch\": \"$((batch + 1))\"}}::"
    done
```

Checkpoints are read back as `{{ checkpoints.next_batch }}`, as `CHECKPOINTS_*` environment variables, or from the execution context file. They work with any script language and task runner. Values are stored as strings, and a replay starts fresh. Checkpoints are in beta, and the syntax may change. See [Checkpoints](/docs/scripts/checkpoints).

<!-- VERIFY: Confirm checkpoint storage on the Elasticsearch/Kafka EE backend. -->

## Execution Timeline

The Executions page has a **Timeline** view next to the table. Each execution is drawn as a bar on a time axis, grouped by namespace and flow, so overlapping runs, gaps in a schedule, and the run that held a concurrency slot for too long are visible at a glance.

<!-- VERIFY: kestra#19334 merged to develop 2026-10-30, not in RC cut. No docs yet. Add screenshot. -->

## SLA and Concurrency

The new `AVG_DURATION` SLA breaches when an execution runs longer than the flow's recent average plus a margin, so slow runs are caught without maintaining a fixed ceiling per flow:

```yaml
sla:
  - id: slowerThanUsual
    type: AVG_DURATION
    lookbackPeriod: P30D
    percentageThreshold: 0.5
    minExecutions: 10
    behavior: NONE
```

Time spent queued counts toward the duration, and the SLA is skipped until `minExecutions` matching runs exist. See [AVG_DURATION](/docs/workflow-components/sla#avg_duration).

Concurrency gets a `queueLimit` property that caps how many executions can wait in the queue; anything beyond it is cancelled immediately. The Concurrency Limits page moves from the Instance Owner console to **Tenant > Concurrency Limits**, shows a **Queued** count, and lets tenant users reset namespace and tenant counters. The concurrency limit API changed with it; see the [migration guide](/docs/migration-guide/v2.1.0/concurrency-limit-api).

```yaml
concurrency:
  behavior: QUEUE
  limit: 1
  queueLimit: 1
```

## Cases: Tickets and Events

Cases in 2.0 tracked incidents inside Kestra. In 2.1 they connect to the ticketing systems teams already use. A case can be linked to one external ticket, from the UI, the API, or the new `SetTicket` task. **Cases > Settings > External ticket automation** generates a flow that opens a ticket in GitHub, GitLab, Jira, Linear, ServiceNow, Zendesk, and several others when a case is created.

The new `CaseEvent` trigger starts a flow on case events, filtered by event type and severity:

```yaml
triggers:
  - id: on_case_created
    type: io.kestra.plugin.kestra.ee.cases.CaseEvent
    events: [CREATED]
    severities: [CRITICAL]
```

Ticket sync is one-way, and events are delivered at least once, so tasks that must not repeat should be guarded with `runIf`. See [External tickets](/docs/enterprise/governance/cases#external-tickets).

## Apps

Apps get layout and data blocks that make them usable as internal dashboards and request portals:

- The `Grid` block lays out other blocks in up to 12 columns, can be nested, and collapses to a single column on narrow screens.
- The `Chart` block embeds any dashboard chart definition in an app, read with the viewer's permissions.
- The `Assets` block shows the assets an execution emitted or updated, grouped by their parent deployment with status, lease, and owner.
- `watermark` removes the Kestra watermark or replaces it with your own Markdown.
- The new `dataURL()` function inlines a namespace file as a `data:` URI, so PNG and SVG images can be shown without external hosting.

See [Apps](/docs/enterprise/scalability/apps).

<!-- VERIFY: Assets block docs are already on main (ee#9958 is 2.1); add a version badge there. A PUBLIC app's Chart shows no data from protected sources; worth a note? -->

## AI Copilot: Generate a Unit Test

From a flow's menu, **Generate a unit test** asks Copilot to draft a test with fixtures, mocks, and assertions based on the flow definition. The draft can be applied directly or opened in the editor for review. Unit test fixtures also now render `dependsOn` and `defaults` expressions the same way a live run does, so tests exercise the real input logic. See [Generate a unit test](/docs/develop-with-ai/ai-copilot#generate-a-unit-test).

## SAML 2.0 and Password Policies

SAML 2.0 joins OIDC and LDAP as an SSO option in the Enterprise Edition, for organizations whose identity provider is SAML-only. Users are created on first login, IdP groups are synced to Kestra groups at every login, and Single Logout is supported. It works across multiple webservers without sticky sessions. See [SAML](/docs/enterprise/auth/sso/saml).

For Basic Auth, passwords can now expire after a set age, with a warning banner ahead of time, and recent passwords can be blocked from reuse:

```yaml
kestra:
  security:
    basic-auth:
      password-max-age: P90D
      password-expiry-warning: P7D
      prevent-reuse-of-last-passwords: 5
```

Both are off by default and apply to users, not service accounts or API tokens. On upgrade, every existing password is treated as changed at upgrade time, so nobody is locked out on day one. See [Password expiration and reuse](/docs/enterprise/auth/rbac#password-expiration-and-reuse).

## Queue Backends

2.0 made the queue independent of the repository. 2.1 adds three managed brokers to the Enterprise Edition alongside Kafka, Redis, and AMQP: Google Cloud Pub/Sub, NATS JetStream, and Amazon SQS/SNS. Teams already running one of these don't need to operate Kafka to get a broker-backed queue.

```yaml
kestra:
  queue:
    type: gcp-pubsub   # or nats, aws
    gcp-pubsub:
      project-id: my-gcp-project
```

Kestra creates and deletes its own topics, queues, and subscriptions, so the identity it runs as needs the permissions listed in the docs. See [Message broker queue backends](/docs/configuration/enterprise-and-advanced#message-broker-queue-backends).

For JDBC deployments, the queue can now run in its own database, even on a different engine from the repository, to split load across two database servers. Moving the queue of an existing instance to an empty database isn't supported yet. See [Dedicated queue database](/docs/configuration/runtime-and-storage#dedicated-queue-database).

<!-- VERIFY: are the new backends packaged as plugins? Docs don't say so. SQS/SNS missing from several backend lists (EE overview, oss-vs-paid, deployment architecture). -->

## Additional Improvements

- [Flow trigger `waitForAllRetries`](/docs/workflow-components/triggers/flow-trigger#suppressing-intermediate-failure-alerts-during-retries): skip the intermediate `FAILED` states between flow-level retries, so alerting flows don't fire for runs that recover.
- [Reschedule an execution](/docs/workflow-components/execution#schedule-and-reschedule-an-execution): move the `scheduleDate` of an execution that hasn't started yet with `POST /executions/{id}/actions/reschedule`, instead of deleting and recreating it.
- [`isLastDayOfMonth()`](/docs/expressions/functions/dates#islastdayofmonth): a Pebble function for month-end logic in `runIf` and trigger conditions.
- [`descriptionDisplayMode`](/docs/workflow-components/inputs#description-display-mode): set `TOOLTIP` to show an input's description as a help icon, keeping long forms compact.
- [Reusable Inputs audit logs](/docs/workflow-components/reusable-inputs#audit-logs): every change to a shared input set is recorded with its revision.
- [Context panel](/docs/ui/flows#context-panel-enterprise) (EE): the flow editor's Context panel shows inputs, variables, KV pairs, and secrets across the namespace hierarchy in one searchable tree, with click-to-copy expressions.
- Bulk operation notifications: bulk actions on executions, such as replaying a selection, now report completion in the notifications bell.
- [PEM certificates for gRPC](/docs/configuration/enterprise-and-advanced#pem-certificates) (EE): controller and worker mTLS can use PEM files directly, with hot reload, so cert-manager and Kubernetes `tls` Secrets work without conversion.
- [Executor loop intervals](/docs/configuration/plugins-and-execution#executor-loop-intervals): tune how often the executor checks SLA deadlines and delayed executions.
- [`PurgeMetrics`](/docs/administrator-guide/purge#purge-metrics): a dedicated task to bulk-delete execution metrics, much cheaper than cleaning them through `PurgeExecutions`.
- [Invitations](/docs/enterprise/auth/invitations) (EE): invite up to 25 users at once with the same groups and roles.
- [Change password in OSS](/docs/administrator-guide/basic-auth-troubleshooting#change-password): users with database-stored Basic Auth credentials can change their password from the user menu.
- Task runner details: the topology views for Kubernetes, AWS Batch, Azure Batch, Google Batch, and Cloud Run task runners show the configuration a run actually used.
- [Plugin endpoints](/docs/plugin-developer-guide/plugin-ui#running-backend-logic-with-plugin-endpoints) (preview): plugin UI components can call server-side logic defined in the plugin, with RBAC checks in the Enterprise Edition.

<!--
VERIFY before publishing:
- Bulk notifications: only execution bulk ops confirmed (ee#7453); no docs.
- Plugin endpoints: fetchEndpoint (kestra#21653) and execution-artifact slot (kestra#21611) not in RC per source TODOs. Keep generic (embargo).
- Image digest pinning for containerImage: possibly 2.0.x; left out.
- Instance-plugins endpoint (ee#11203): small; left out.
-->

## Upgrade and Migration

Upgrading from 2.0 to 2.1 needs no flow rewrites, but some API, CLI, and configuration changes need attention. Each one has a guide in the [v2.1.0 migration hub](/docs/migration-guide/v2.1.0).

| Change | What to update |
|---|---|
| [Concurrency limit API](/docs/migration-guide/v2.1.0/concurrency-limit-api) | `PUT /concurrency-limit/{namespace}/{flowId}` is replaced by `PUT /concurrency-limit` with the scope in the body. The search endpoint is now paged. |
| [`SYSTEM_SETTINGS` and `TENANT_SETTINGS` removed](/docs/migration-guide/v2.1.0/settings-permissions-removed) | Role definitions that include them now fail with a 422 in the API, `kestractl`, and Terraform. Remove them; stored roles need no change. |
| [Flat parameters on `by-query` endpoints](/docs/api-reference/problems/invalid-query-filters) | Mutating `by-query` endpoints reject flat parameters with a 400. Rewrite `?namespace=x` as `?filters[namespace][EQUALS]=x`. |
| [Server CLI commands deprecated](/docs/migration-guide/v2.1.0/server-cli-commands-deprecated) | Seven `kestra` server commands are deprecated in favor of `kestractl`, and now print a deprecation line to stdout. Scripts that capture their output need updating. |
| [Queue configuration keys](/docs/migration-guide/v2.1.0/queue-backend-configuration) | Kafka, Redis, and AMQP settings move under `kestra.queue.<type>`. The old keys still work but log a warning. |
| [Asset lineage events removed](/docs/migration-guide/v2.1.0/asset-relations) | The lineage-events API, `kestractl assets lineage-events`, and `PurgeAssets` lineage options are removed. Back up before upgrading; the migration drops the old tables. |

<!--
VERIFY:
- by-query flat params: no v2.1.0 migration page exists yet; one is recommended.
- SSO logout: docs now drop micronaut get-allowed and change post-logout redirect to /ui (Keycloak, Okta). Add a row if engineering confirms it's a user-facing change.
- Migration hub index description still says "TBD".
-->

## Get Started

2.1 is an LTS release, with bug and security fixes backported until December 2027. The [quickstart](/docs/quickstart) and [Docker Compose setup](/docs/installation/docker-compose) are updated for 2.1, and the full list of changes is in the [GitHub release notes](https://github.com/kestra-io/kestra/releases/tag/v2.1.0).

As always, find us on [GitHub](https://github.com/kestra-io/kestra/issues) or [Slack](https://kestra.io/slack) with questions, feature requests, and what you're orchestrating.
