---
title: "Kestra 2.1: Introducing Kestra for Infrastructure, with Approvals and Searchable Executions"
description: "Kestra 2.1 launches Kestra for Infrastructure, the first product built on the Kestra platform, so platform and IT teams can make infrastructure available to the whole company without losing control. The release also adds an Approval task, an ASSET input, searchable executions, and durable scripts."
date: 2026-12-01T10:00:00
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
- Sources: Release=2.1 + kind/highlight issues (project 15), the docs/release-2-1 branch, the CEO/CTO positioning note for Kestra for Infrastructure, the marketing positioning artifact, and the Verticals product enablement deck.
- Kestra for Infrastructure wording follows the positioning note: always the full name, presented as a product built on the Kestra platform. Never "tenant", "tenant type", "mode", "workspace", or "a setting you turn on" in this post; setup stays in the docs. No customer names, no roadmap, no dates beyond launch, no names of next products, no Cloud availability. Don't claim every request is approved, that expired leases are decommissioned automatically, or that the open-source Terraform/OpenTofu/Ansible tasks fill the Inventory on their own. Governed provisioning (EE beta) stays out until it ships.
- Embargoed: Data Orchestration Artifacts (dbt/Airbyte/Fivetran/JDBC artifacts) and the deep dbt integration stay out of this post (changelog only, kept for a later announcement). Plugin endpoints are described generically for that reason. The dbt asset types migration guide is left out of the upgrade table.
- Left out on purpose: Bring Your Own Worker, asset health (ee#11937 open), dataURL() (2.0.8), by-query flat-param rejection (2.0.7), Replay with modified inputs (2.0.0), auto-emitted Terraform/OpenTofu assets (ee#9222 not planned), plugin auto-install on EE (ee#11724 not planned), Failure Debug panel (closed as duplicate), Health Center/Diagnostics (open), Source Search (2.0), EmbeddedSubflow (ee#3501, no work done).
- TODO markers: TODO(arcade, priority N) for interactive demos, TODO(screenshot) for static images, VERIFY for facts to confirm before publishing.
-->

Kestra 2.1 is available today, and it's a special one for us. With this release, we're launching **Kestra for Infrastructure**, the first product built on the Kestra platform. It's made for platform and IT teams who want to make infrastructure available to the whole company without losing control of what gets created.

Kestra stays the general-purpose orchestration platform you know, and everything in 2.1 is available to every team. Flows can now pause for a real approve-or-deny decision, request forms can offer existing assets to pick from, executions can be found by the business values they processed, and long scripts can pick up where they left off after a failure.

The table below lists the main features in this release and the edition they belong to.

| Feature | What | Edition |
|---|---|---|
| Kestra for Infrastructure | Self-service provisioning for platform and IT teams: a Catalog, Requests, Deployments with leases, Inventory, and Day 2 actions | EE |
| Approval task | Pause a flow until someone approves or denies it, with a branch for each decision | OSS, EE, Cloud |
| Approvals page | Assign reviewers, track every request, and chain sign-offs | EE, Cloud |
| ASSET input | Let users pick existing assets in a form, filtered by type, namespace, status, or metadata | EE, Cloud |
| Asset leases and Day 2 actions | An owner, a status, and a lease on every asset, with actions offered only where they apply | EE, Cloud |
| Asset relations | Model a deployment and the resources inside it | EE, Cloud |
| Searchable inputs and outputs | Find executions by a business value such as an order ID | OSS, EE, Cloud |
| TABLE input | Collect rows of typed records in a grid | EE, Cloud |
| Reusable Inputs editor | Edit a set of reusable inputs with drafts and revisions, and update it from a flow | EE, Cloud |
| Webhook responses | Choose the status code, headers, and body returned to the caller | OSS, EE, Cloud |
| Script checkpoints (beta) | Resume a script from its last checkpoint after a retry or restart | OSS, EE, Cloud |
| Execution timeline | See executions on a time axis, grouped by namespace and flow | OSS, EE, Cloud |
| Loop iterations in the Gantt | Expand a `Loop` in place and jump between failed iterations | OSS, EE, Cloud |
| Notifications | The notifications bell in every edition, and a `Notify` task to message users from a flow | OSS, EE, Cloud |
| Dashboard charts from flow outputs | Chart a file that a flow returns as an output | EE, Cloud |
| `AVG_DURATION` SLA | Catch executions slower than the flow's recent average | OSS, EE, Cloud |
| Cases tickets and events | Link cases to Jira, ServiceNow, and other ticketing tools, and trigger flows on case events | EE, Cloud |
| Apps: Grid, Chart, and Assets blocks | Layouts, charts, and asset lists inside apps | EE, Cloud |
| AI Copilot unit tests | Generate a unit test for an existing flow | EE, Cloud |
| Platform MCP server | Give AI agents Kestra's own tools for flows and executions | OSS, EE |
| OIDC issuer | Reach AWS and Google Cloud without storing keys | EE, Cloud |
| Default retention policy | Choose how long to keep executions and logs at setup | EE |
| SAML 2.0 SSO | Sign in through a SAML identity provider | EE |
| Password expiration and reuse prevention | Password policies for Basic Auth | EE |
| New queue backends | Google Cloud Pub/Sub, NATS JetStream, Amazon SQS/SNS, and Azure Event Hubs | EE |
| Dedicated queue database | Run the JDBC queue in its own database | OSS, EE |

:::alert{type="info"}
**Upgrading from 2.0?** A few changes need attention, including the concurrency limit API, removed role permissions, POST-only logout for SSO, webhook responses without `wait`, and flow outputs that use an input-only type. See [Upgrade and Migration](#upgrade-and-migration) and the [v2.1.0 migration guide](/docs/migration-guide/v2.1.0).
:::

## Kestra for Infrastructure

In most large companies, more and more people need infrastructure: developers testing a branch, data teams who need a database for a week, and now AI agents too. Direct access to the cloud is usually restricted, so each of those needs turns into a ticket that a platform team handles by hand, and environments nobody uses anymore are rarely cleaned up. Many teams are also rebuilding the self-service portal they had on VMware vRA and vRO, or looking for an alternative to Ansible Automation Platform and AWX.

Infrastructure automation has become one of the two largest ways teams use Kestra, alongside data. Kestra for Infrastructure turns what those teams built into a product, with their words, their workflows, and examples ready to use. It starts with **self-service provisioning**: everyone requests what they need from a catalog, and the platform team stays in control of what gets created and how long it lives, with the Terraform, OpenTofu, and Ansible code it already uses.

<!-- TODO(screenshot): The Catalog home page with the Self-Service menu (Catalog, Requests, Deployments, Inventory, Approvals, Cases, Dashboards) and request cards for a VM, object storage, a database, and an environment. The Verticals enablement deck has one we can reuse. -->

Here's what a platform team gets:

- The home page is the **Catalog**. Each entry is a request form with a flow behind it, so anyone can ask for a VM, a database, or a whole environment without opening a ticket or reading Terraform code. A form can be split into steps, and a flow can pause for an approval before anything is provisioned.
- Every request shows up under **Requests**, with who made it, the values they entered, and what it created. Each request is a Kestra execution, so it has the same logs, retries, RBAC, secrets, and audit logs as any other flow.
- A deployment groups the resources of one project, application, or environment, each with a status, an owner, and a lease. Leases that expire within a week, or have already expired, are flagged at the top of the **Deployments** page. A lease can be extended in a couple of clicks, and flows can run when it's about to expire and once it has.
- Any flow can be attached to a deployment or a resource as a **Day 2 action**, such as resize, snapshot, or decommission, and existing runbooks work as they are. An action can be limited to the resources it applies to, for example only active VMs in staging or production.
- The **Inventory** lists every resource with the deployment it belongs to. A flow adds a resource by declaring it as an asset, and resources Kestra didn't create can be imported from a Terraform state file, a CSV table, or JSON and YAML records, with a preview before anything is written.
- A template describes a whole setup, such as an application with its database and its machine. Fill in its arguments, and the flow and its Catalog entry are created for you. Templates can start from scratch or from a flow you already have.
- An overview dashboard shows deployments by environment, inventory by type, and resources by owner, and any metadata written on a resource can be charted.

<!-- TODO(screenshot): A deployment page with its owner, metadata, TTL & Lease card, Inventory card, and Actions card. Reuse from the Verticals deck if possible. -->

Nobody starts from an empty page. Example catalog entries, flows, deployments, and a dashboard are there on the first visit, and a short product tour walks through requesting a sandbox, seeing the flow behind it, extending its lease, and decommissioning it. The examples only declare assets, so no cloud resource is created while you explore.

AI agents follow the same rules as people. A catalog flow can be exposed to an agent with the [MCP Tool trigger](/docs/workflow-components/triggers/mcp-tool-trigger), and a request from an agent goes through the same flow, the same approval step, and the same audit trail as a request from the Catalog.

Because it's built on the Kestra platform, Kestra for Infrastructure comes with everything else Kestra does. [Cases](/docs/enterprise/governance/cases) track failed requests as incidents with linked Jira or ServiceNow tickets, [Assets](/docs/enterprise/governance/assets) make every resource known to other teams and flows, and [Apps](/docs/enterprise/scalability/apps) put a form in front of any flow. Flows are YAML, versioned in Git, and run your Terraform, OpenTofu, Ansible, Shell, Python, and PowerShell code as is, including VMware PowerCLI scripts. Enterprise governance comes along too: RBAC, SSO, secrets, audit logs, and isolated workers for on-premises and air-gapped environments. The resources your platform team provisions can then be used by data teams on the same platform.

Kestra for Infrastructure is part of Kestra Enterprise Edition, self-hosted. This is the first step: it starts with provisioning and Day 2 operations, and it will grow with every release of the Kestra platform. To set it up, see [Kestra for Infrastructure in the docs](/docs/enterprise/governance/tenants/infrastructure), and to see it with your own use cases, [talk to our team](/demo).

<!-- VERIFY: confirm the sales/demo link marketing wants here (product page on kestra.io, or /demo). -->

<!-- TODO(arcade, priority 1): Kestra for Infrastructure end to end, told as the requester and then the platform team: pick an entry in the Catalog, fill the form, follow the request under Requests, open the resulting deployment, extend its lease, and run a Day 2 action. Record on the starter content so no cloud resource is needed. Keep the product name on screen; avoid showing the tenant switcher or tenant settings. -->

<!-- TODO(arcade, priority 2): Templates: create a template From a flow, define its arguments, click Use, and land on the new Catalog entry. Shows the handoff between the platform team and the teams it serves. -->

<!-- TODO(arcade, priority 3): Inventory import: upload a .tfstate file, walk through the preview (new, updated, outside this deployment), import, and open the grouped deployment in Inventory. -->

## Approvals

Asking a person for a decision used to mean a `Pause` task, where the only way to say no was to kill the execution. The new `Approval` task gives a flow a real decision: it pauses until a reviewer approves or denies the request, and then runs the tasks for that decision. Reviewers can leave a comment, fill in a few review inputs, and a request can approve itself when a condition is met or expire after a while.

```yaml
- id: approve_deploy
  type: io.kestra.plugin.core.flow.Approval
  timeout: P1D
  commentRequired: ON_DENY
  onApprove:
    - id: deploy
      type: io.kestra.plugin.core.log.Log
      message: "Approved by {{ outputs.approve_deploy.by }}"
  onDeny:
    - id: report_denial
      type: io.kestra.plugin.core.log.Log
      message: "Stopped by {{ outputs.approve_deploy.by }}: {{ outputs.approve_deploy.comment }}"
```

In the Enterprise Edition, a request can be assigned to specific users or groups, and every request is tracked on the new **Approvals** page, with notifications for reviewers and requesters. Several approvals can be chained into one multi-step sign-off, and reviewers can decide from an App without opening Kestra. `Pause` and `HumanTask` keep working as before. See the [Approval task](/docs/workflow-components/approvals) and [Approvals in Kestra Enterprise](/docs/enterprise/governance/approvals).

<!-- TODO(screenshot): The Approvals page with a few pending and resolved requests, the Resolution column, and the Review button. -->

## Assets

Assets got a lot of attention in this release. Kestra for Infrastructure is built on them, and every team using assets in the Enterprise Edition and Cloud gets the same improvements.

- Every asset can now have an owner, a status, and a lease. The new `TtlTrigger` starts a flow when a lease is about to expire or has expired, for example to warn the owner a week ahead and clean up when the lease ends. Owners also get a notification in Kestra. See [TtlTrigger](/docs/enterprise/governance/assets/tasks-and-triggers#ttltrigger).
- An asset action can carry conditions on the status, the namespace, or any metadata, so an action like Decommission only shows up where it makes sense, and the UI explains why when it doesn't. See [Asset actions](/docs/enterprise/governance/assets/declare-assets#asset-actions).
- New relations model a deployment and the resources inside it, or a VM and the load balancer in front of it, and both appear on the asset graph. They replace lineage events, so read the [asset relations migration guide](/docs/migration-guide/v2.1.0/asset-relations) before upgrading.

The new **ASSET input** lets the person running a flow pick existing assets from a searchable list, such as the VM to snapshot or the deployment a new database belongs to. The list can be narrowed by type, namespace, status, or metadata, and only shows assets that person is allowed to see. Tasks then read the picked asset, with its current metadata, using the new `asset()` function:

```yaml
inputs:
  - id: vm
    type: ASSET
    assetType: io.kestra.plugin.ee.assets.VM
    namespace: infra.compute
    status: active

tasks:
  - id: snapshot
    type: io.kestra.plugin.core.log.Log
    message: "Snapshot of {{ asset(inputs.vm).displayName }} in {{ asset(inputs.vm).metadata.region }}"
```

Inputs can depend on each other, so a form can ask for a deployment first and then only offer the VMs that belong to it. Flows can return assets as outputs too. See [ASSET inputs](/docs/workflow-components/inputs#asset-inputs).

<!-- TODO(screenshot): The Execute modal with an ASSET input open, showing the search box and a few VMs with their type, namespace, and status. -->

## Searchable Inputs and Outputs

Finding the execution that processed a specific order or customer usually meant copying the value into a label, or digging through logs. In 2.1, mark a flow input or output with `searchable: true`, and you can find executions by its value from the Executions page.

```yaml
outputs:
  - id: orderIds
    type: ARRAY
    value: "{{ outputs.parse.values.orderIds }}"
    searchable: true
```

A searchable list stores each item separately, so one execution can be found by any of the order IDs it handled, something labels can't do. See [Searchable outputs](/docs/workflow-components/outputs#searchable-outputs) and [Searchable inputs](/docs/workflow-components/inputs#searchable-inputs).

<!-- TODO(arcade, priority 5): Searchable values: run a flow with a searchable output, then find the execution from the Executions page with the Inputs & Outputs filter by typing an order ID. Short, and shows the payoff of one YAML line. -->

## TABLE Input

The `TABLE` input collects a list of records in a grid, for things like a set of disks, firewall rules, or users to onboard. Each column has a type and its own rules, every cell is checked, and all the errors show up at once, so nobody has to format a JSON list by hand. Rows can be pasted from a spreadsheet, too. See [TABLE inputs](/docs/workflow-components/inputs#table-inputs).

<!-- TODO(screenshot): Reuse table-input-execute-modal.png from the inputs docs page (the Execute modal with a TABLE input grid and per-cell errors). -->

<!-- VERIFY: TABLE input Cloud availability (TODO in source). -->

## Reusable Inputs Editor

Reusable Inputs, added in 2.0, define a set of inputs once per namespace and use it in any flow. Some of those sets have grown into real reference lists, like the bill of materials of an application, so in 2.1 each set gets its own editor. Edit it in No Code or YAML, with `TABLE` defaults in a grid that takes rows pasted from a spreadsheet. Save unfinished work as a draft without affecting the flows that use the set, and compare or restore earlier revisions.

Sets can also be kept up to date from a flow. The new `Set` task can, for example, refresh a table's rows from a CSV export every night:

```yaml
- id: set_servers
  type: io.kestra.plugin.kestra.ee.reusableinputs.Set
  reusableInputsId: bom
  defaults:
    servers: "{{ inputs.servers }}"
```

See [Reusable Inputs](/docs/workflow-components/reusable-inputs#edit-a-set-in-the-ui).

<!-- TODO(screenshot): Reuse reusable-inputs-editor.png from the Reusable Inputs docs page (the editor with the Code panel, the No Code panel, and a TABLE defaults grid). -->

<!-- VERIFY: the Set, List, and Delete tasks ship in the plugin-kestra release for 2.1 (merged to next/v2.1 in plugin-kestra#215, not released as of 2026-11-17). Drop the second paragraph and the example if they don't make GA. -->

## Webhook Responses

Several providers check a webhook URL before sending events to it, and expect a specific answer: Meta echoes a challenge, and Microsoft Graph sends a validation token. The Webhook trigger can now set the status code, headers, and body it returns, with expressions, so those handshakes work without a proxy in front of Kestra.

```yaml
triggers:
  - id: meta
    type: io.kestra.plugin.core.trigger.Webhook
    key: "{{ secret('META_WEBHOOK_KEY') }}"
    responseHeaders:
      Content-Type: text/plain
    responseBody: "{{ trigger.parameters['hub.challenge'][0] ?? 'EVENT_RECEIVED' }}"
```

The trigger can also verify HMAC signatures, such as the ones GitHub sends, and reject unsigned requests before any execution is created. Signature checks also shipped in 2.0.10. See [Customize the webhook response](/docs/workflow-components/triggers/webhook-trigger#customize-the-webhook-response) and [Verify the request signature](/docs/workflow-components/triggers/webhook-trigger#verify-the-request-signature).

<!-- VERIFY: Asana handshake not confirmed; check body serialization without Content-Type. -->

## Script Checkpoints (Beta)

A script that fails at batch 300 of 400 shouldn't have to start again from batch 1. With `durable: true`, a script task can save checkpoints as it goes, and a retry, a restart, or a worker restart picks up from the last one.

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

Checkpoints work with any script language and task runner. They're in beta, so the syntax may still change, and we'd love your feedback. See [Checkpoints](/docs/scripts/checkpoints).

<!-- VERIFY: Confirm checkpoint storage on the Elasticsearch/Kafka EE backend. -->

## Following Executions

The Executions page has a new **Timeline** view next to the table. Each execution is a bar on a time axis, grouped by namespace and flow, so overlapping runs, gaps in a schedule, and the run that held a concurrency slot for too long stand out right away. Click a bar to open the execution, or drill down from a namespace into its flows. See [Timeline](/docs/ui/executions#timeline).

<!-- TODO(arcade, priority 4): Execution timeline: switch Counts to Timeline, zoom and pan, drill from a namespace into its flows, click a bar and use Show only this flow. OSS, so it can be recorded on any instance. -->

Each `Loop` iteration runs as its own execution, which meant opening iterations one by one to find the one that failed. The **Gantt** tab now shows each Loop with its iteration count and how many failed. Expand it to see the iterations in place, and step from one failure to the next without leaving the page. See [Loop iterations](/docs/ui/executions#loop-iterations).

<!-- TODO(screenshot): The Gantt tab with a Loop expanded to its iterations, one failed iteration expanded to its task runs, and the side panel open on the failed task. -->

## Notifications

The notifications bell is now in every edition. Bulk actions on executions, triggers, and backfills, such as kill, replay, or restart, run in the background and report their progress there, so you can keep working while they finish.

Flows can send notifications too. The new `Notify` task sends a message to the bell of the users you choose, for example to tell a requester their environment is ready, with a link to open it. See [Notifications](/docs/ui#notifications).

<!-- TODO(screenshot): The notifications bell open, with a bulk action in progress and a notification sent by the Notify task. -->

## Dashboards: Chart a Flow's Output

Some numbers come from outside Kestra: a weekly cost report, a list of open vulnerabilities, a count from a warehouse query. The new `Outputs` data source charts a file that a flow returns as an output, read from the flow's latest successful execution. Let the flow do the heavy lifting on a schedule, and the dashboard always shows its latest result. See [Outputs](/docs/ui/dashboard#outputs-ee-and-cloud-only).

<!-- TODO(screenshot): A dashboard with a chart built on the Outputs data source and its "Updated" caption. -->

## SLA and Concurrency

The new `AVG_DURATION` SLA flags an execution that runs longer than the flow's recent average plus a margin, so slow runs get caught without picking a fixed limit for every flow. See [AVG_DURATION](/docs/workflow-components/sla#avg_duration).

```yaml
sla:
  - id: slowerThanUsual
    type: AVG_DURATION
    lookbackPeriod: P30D
    percentageThreshold: 0.5
    minExecutions: 10
    behavior: NONE
```

Concurrency gets a `queueLimit`, which caps how many executions can wait in line. The Concurrency Limits page moves to the tenant, with a count of queued executions, and tenant users can reset counters themselves. See [Concurrency](/docs/workflow-components/concurrency).

## Cases: Tickets and Events

Cases in 2.0 tracked incidents inside Kestra. In 2.1, they connect to the ticketing tools teams already use. A case can be linked to a ticket in Jira, ServiceNow, GitHub, GitLab, Linear, Zendesk, and others, and Kestra can generate the flow that opens a ticket whenever a case is created. The new `CaseEvent` trigger starts a flow on case events, filtered by event type and severity. See [External tickets](/docs/enterprise/governance/cases#external-tickets).

## Apps

Apps get new blocks that make them work well as internal dashboards and request portals:

- A `Grid` block arranges other blocks in columns and stacks them on small screens.
- A `Chart` block shows any dashboard chart inside an app.
- An `Assets` block lists the assets an execution created or updated, grouped by deployment.
- `window.width` picks how wide the app renders, narrow for a form and wide for tables and charts.

See [Apps](/docs/enterprise/scalability/apps).

## AI

**Generate a unit test** in a flow's menu asks the AI Copilot to draft a test for that flow, with fixtures, mocks, and assertions. Apply it directly or review it in the editor first. See [Generate a unit test](/docs/develop-with-ai/ai-copilot#generate-a-unit-test).

<!-- TODO(arcade, priority 6): Copilot unit test: flow menu > Generate a unit test, review the drafted fixtures and assertions, Apply, then run the test. -->

In 2.0, MCP servers let AI agents call your flows as tools. The new platform MCP server gives them Kestra's own tools instead, the same ones the AI Copilot uses, so Claude, Cursor, or another MCP client can look at flows and executions or restart a failed run. It's off by default, and in the Enterprise Edition every call runs with the caller's permissions. See [Platform MCP server](/docs/ai-orchestration/mcp-server#platform-mcp-server).

## Keyless Cloud Access with an OIDC Issuer

Flows that call AWS or Google Cloud usually carry an access key in a secret. In 2.1, the Enterprise Edition can act as an OpenID Connect issuer, the same approach GitHub Actions uses: the `oidcToken()` function signs a short-lived token for the running execution, and the cloud provider exchanges it for temporary credentials. No long-lived key to store or rotate, and a cloud trust policy can allow one flow or a whole namespace.

```yaml
- id: list_objects
  type: io.kestra.plugin.aws.s3.List
  region: eu-west-1
  bucket: my-bucket
  stsRoleArn: arn:aws:iam::123456789012:role/kestra-data
  webIdentityToken: "{{ oidcToken(audience='sts.amazonaws.com') }}"
```

See [OIDC issuer](/docs/enterprise/auth/oidc-issuer).

<!-- VERIFY: Cloud setup for the OIDC issuer (who enables it, issuer URL) is still open on the docs page. -->

## Default Retention Policy

Executions and logs pile up until someone writes a purge flow, which is usually after the database has slowed down. The Enterprise Edition setup and the creation of a new tenant now ask how long to keep executions and logs, with an option to keep failed executions, and generate a retention flow that runs every night. The flow is the policy, so you change it the same way as any other flow. See [Default retention flow](/docs/administrator-guide/purge#default-retention-flow).

<!-- VERIFY: Cloud behavior of the default retention flow. -->

## SAML 2.0 and Password Policies

SAML 2.0 joins OIDC and LDAP as a sign-in option in the Enterprise Edition, for organizations whose identity provider only speaks SAML. Users are created on their first sign-in, their groups are synced at every sign-in, and Single Logout is supported. See [SAML](/docs/enterprise/auth/sso/saml).

For Basic Auth, passwords can now expire after a set time, with a heads-up before they do, and recent passwords can be blocked from reuse. Both are off by default, and nobody gets locked out on the day you upgrade. See [Password expiration and reuse](/docs/enterprise/auth/rbac#password-expiration-and-reuse).

## Queue Backends

2.0 made the queue independent of the database. 2.1 adds four brokers to the Enterprise Edition, alongside Kafka, Redis, and AMQP: Google Cloud Pub/Sub, NATS JetStream, Amazon SQS/SNS, and Azure Event Hubs. If your team already runs one of them, you don't need to operate Kafka to get a broker-backed queue. See [Message broker queue backends](/docs/configuration/enterprise-and-advanced#message-broker-queue-backends).

For JDBC deployments, the queue can now run in its own database, even on a different engine, to split the load across two database servers. See [Dedicated queue database](/docs/configuration/runtime-and-storage#dedicated-queue-database).

## Plugins

The Plugins page now lists each plugin once, as a card or a table row. In the Enterprise Edition, it also shows the versions installed on your instance and the ones available, and Instance Owners install, update, and uninstall versions from the same page. See [Plugins page](/docs/enterprise/instance/versioned-plugins#from-the-ui).

<!-- TODO(screenshot): The Plugins page in the Enterprise Edition, with a plugin card showing its installed versions and an available update. -->

A few plugin additions from this cycle:

- [Microsoft Defender XDR](/plugins/plugin-microsoft365): list and update alerts and incidents, run advanced hunting queries, and start flows on new alerts and incidents.
- [Microsoft Sentinel](/plugins/plugin-azure): new tasks in the Azure plugin.
- [Snyk](/plugins/plugin-snyk): list security issues, and start a flow when new ones appear.
- JDBC `Queries`: run several SQL statements in one task, with parameters, transactions, and an output for each statement.
- [Task runner monitoring](/docs/task-runners/types/kubernetes-task-runner) (EE): the Kubernetes, AWS, Azure, Google Cloud, and Huawei Cloud task runners can report CPU, memory, and network usage as task metrics, and forward traces from the task.

<!-- VERIFY: Sentinel task scope (plugin-azure#347, released in v3.7.1), the JDBC plugin docs link for Queries (plugin-jdbc v3.1.0), and the monitoring anchor on each task runner page. -->

## Additional Improvements

- [Flow trigger `waitForAllRetries`](/docs/workflow-components/triggers/flow-trigger#suppressing-intermediate-failure-alerts-during-retries): skip the intermediate failures between flow-level retries, so alerting flows don't fire for runs that recover.
- [Reschedule an execution](/docs/workflow-components/execution#schedule-and-reschedule-an-execution): move a scheduled execution that hasn't started yet, instead of deleting and recreating it.
- [`isLastDayOfMonth()`](/docs/expressions/functions/dates#islastdayofmonth): a function for month-end logic in conditions.
- [Input descriptions as tooltips](/docs/workflow-components/inputs#description-display-mode): keep long forms compact by showing descriptions behind a help icon.
- [Bulk resume of breakpoints](/docs/how-to-guides/pause-resume#bulk-resuming-paused-workflows): the **Resume** bulk action now also resumes executions stopped at a debug breakpoint.
- [Docker `tmpfs` mounts](/docs/task-runners/types/docker-task-runner#in-memory-mounts-tmpfs): give a task container a fast, in-memory scratch directory.
- [Labels in test fixtures](/docs/enterprise/governance/unit-tests#set-execution-labels-in-fixtures) (EE): test flows that branch on execution labels.
- [Context panel](/docs/ui/flows#context-panel-enterprise) (EE): the flow editor's Context panel is redesigned as one searchable tree of inputs, variables, KV pairs, and secrets, with click-to-copy expressions.
- [Sessions](/docs/enterprise/auth/authentication#sessions) (EE): signing in on another browser or device no longer signs you out elsewhere.
- [Expired sessions](/docs/ui#expired-sessions): when a session ends, sign in again and pick up where you were, without losing unsaved changes.
- [Invitations](/docs/enterprise/auth/invitations) (EE): invite up to 25 users at once with the same groups and roles.
- [Impersonate service accounts](/docs/enterprise/auth/rbac#impersonate) (EE): Instance Owners can check what a service account can access, as they already could for users.
- [LDAP user attributes](/docs/enterprise/auth/sso/ldap) (EE): new LDAP users get their email and name from your directory.
- [Dedicated storage and secrets settings](/docs/enterprise/governance/tenants#dedicated-storage-and-secrets-backend-per-tenant) (EE): set a namespace's own storage or secrets manager in a form, and saved values are kept when you edit them.
- [Change password in OSS](/docs/administrator-guide/basic-auth-troubleshooting#change-password): users with database-stored credentials can change their password from the user menu.
- [Task runner details](/docs/task-runners/types/kubernetes-task-runner) (EE): cloud task runners add a **Runner details** artifact with the configuration each run actually used.
- [PEM certificates for gRPC](/docs/configuration/enterprise-and-advanced#pem-certificates) (EE): use cert-manager and Kubernetes `tls` Secrets for worker mTLS without converting them.
- [Plugin downloads through a proxy](/docs/administrator-guide/mitm-proxy-configuration#authenticate-plugin-downloads-with-the-proxy): install plugins behind a proxy that requires a username and password.
- [`PurgeMetrics`](/docs/administrator-guide/purge#purge-metrics): clean up execution metrics on their own, much faster than through `PurgeExecutions`.
- [Executor loop intervals](/docs/configuration/plugins-and-execution#executor-loop-intervals): tune how often the executor checks SLA deadlines and delayed executions.
- [`thinking-effort: none`](/docs/configuration/enterprise-and-advanced) (EE): use AI Copilot with OpenAI and Azure OpenAI reasoning deployments.
- [Plugin endpoints](/docs/plugin-developer-guide/plugin-ui#running-backend-logic-with-plugin-endpoints) (preview): plugin UI components can call server-side logic defined in the plugin.

## Upgrade and Migration

Most flows need no changes, but a few API, configuration, and flow changes need attention before upgrading from 2.0. Each one has a guide in the [v2.1.0 migration guide](/docs/migration-guide/v2.1.0).

| Change | What to update |
|---|---|
| [Concurrency limit API](/docs/migration-guide/v2.1.0/concurrency-limit-api) | Use `PUT /concurrency-limit` with the scope in the body. The search endpoint is now paged. |
| [`SYSTEM_SETTINGS` and `TENANT_SETTINGS` removed](/docs/migration-guide/v2.1.0/settings-permissions-removed) (EE) | Remove them from role definitions in the API, `kestractl`, and Terraform. Stored roles need no change. |
| [`USER: IMPERSONATE` removed](/docs/migration-guide/v2.1.0/impersonate-permission-removed) (EE) | Impersonation is for Instance Owners only. Remove the action from role definitions. |
| [Namespace binding scope](/docs/migration-guide/v2.1.0/namespace-binding-scope) (EE) | A role bound to a namespace can only grant namespace-level permissions. Existing bindings are moved for you on upgrade. |
| [Server CLI commands deprecated](/docs/migration-guide/v2.1.0/server-cli-commands-deprecated) | Move scripts to the `kestractl` equivalents. |
| [Queue configuration keys](/docs/migration-guide/v2.1.0/queue-backend-configuration) (EE) | Move Kafka, Redis, and AMQP settings under `kestra.queue.<type>`. The old keys still work for now. |
| [POST-only logout](/docs/migration-guide/v2.1.0/sso-logout-post-only) (EE) | Register `<your Kestra URL>/ui` as the post-logout redirect URI in your identity provider. |
| [Asset relations](/docs/migration-guide/v2.1.0/asset-relations) (EE) | Lineage events are replaced by relations. Back up your database before upgrading. |
| [Webhook responses without `wait`](/docs/migration-guide/v2.1.0/webhook-response-without-wait) | A `responseCode` now applies without `wait`. If it reads `outputs`, add `wait: true`. |
| [Flow output types](/docs/migration-guide/v2.1.0/flow-output-types) | Flow outputs typed `SELECT`, `MULTISELECT`, or `EMAIL` keep running, but saving them fails. Change them to `STRING` or `ARRAY`. |

The `assets()` function also changed in the Enterprise Edition: it only returns assets your flow's namespace can reach, and its `namespace` argument now matches child namespaces instead of any namespace starting with the same characters. See the [`assets()` function](/docs/enterprise/governance/assets/tasks-and-triggers#assets-pebble-function).

## Get Started

The [quickstart](/docs/quickstart) and [Docker Compose setup](/docs/installation/docker-compose) are updated for 2.1, and the full list of changes is in the [changelog](/docs/releases/changelog/v2.1.0) and the [GitHub release notes](https://github.com/kestra-io/kestra/releases/tag/v2.1.0).

Thank you to everyone who tried the release candidates and shared feedback along the way. As always, find us on [GitHub](https://github.com/kestra-io/kestra/issues) or [Slack](https://kestra.io/slack) with questions, feature requests, and what you're orchestrating.
