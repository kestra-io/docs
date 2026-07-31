---
title: "Cases in Kestra: Incident Management for Executions"
h1: Track and Resolve Incidents with Cases
description: Use Cases in Kestra Enterprise to track and resolve incidents directly in Kestra. Create cases automatically from failed executions, deduplicate alerts, and manage SLAs.
sidebarTitle: Cases
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 2.0.0"
---

Track and resolve incidents directly in Kestra, next to the executions that caused them.

When an Execution fails, this often means an **incident**. Instead of relying on an extra tool for incident management, Cases can be used to track and resolve incidents directly in Kestra.

Cases can be created not only for failed executions but also, for example, for executions that need **approvals**, as well as for successful executions that produced unexpected outputs.

A dedicated `CreateCase` task in the Kestra YAML flow definition allows creating cases automatically:

- in the `errors`, `finally`, or `afterExecution` blocks, to auto-create custom cases when the execution moves to a terminal state like Failed, Killed, Warning, or Success
- anywhere in the regular `tasks` block, to create cases based on custom conditions within the flow, for example if a given output is bad (error status code on some API request).

Not every execution needs to be treated as an independent case, though. Often a single production issue (e.g. an external API that is temporarily unreachable) can easily create 10 to 100 failed executions within an hour. Sending Slack alerts for each failed execution can quickly get so noisy that users mute the channel, making the alerting useless. Cases solve this with **deduplication**: with `linkMatchingExecutions: true`, new failing executions are attached to the already-open case for the same flow and task instead of opening a new one.

This page covers the case model, the `CreateCase` task, deduplication and auto-attach, the UI, templates, notifications, permissions, and the API.

:::alert{type="warning"}
Cases require the [Kestra plugin](https://kestra.io/plugins/plugin-kestra) to be installed on your Kestra EE instance, because the `CreateCase` task used under the hood by Cases comes from this plugin. The default Docker image with plugins included already contains it. If you manage plugins yourself, install the Kestra plugin through [Versioned Plugins](../../05.instance/versioned-plugins/index.md) to use Cases reliably.
:::

## What a case contains

- **Title and description** - the description supports Markdown
- **Severity** - `Critical`, `High`, `Medium`, or `Low`; defaults to `Medium`
- **Status** - `Open`, `Acknowledged`, `Investigating`, `Resolved`, or `Cancelled`; `Resolved` and `Cancelled` are terminal
- **Namespace** - every case belongs to a namespace, and all permission checks are scoped to it
- **Assignees and watchers** - both accept users and groups; assignees are responsible for the case, watchers only receive notifications. The same user or group cannot be both at once: assigning them as an assignee removes them from the watchers
- **Custom fields** - typed fields (Text, Select, Multi-select) defined per case or inherited from a template; cases use custom fields instead of labels
- **SLAs** - optional acknowledgement and resolution targets
- **Linked executions and assets** - the executions and [assets](../01.assets/index.md) affected by the incident
- **Case actions** - flows attached to the case as one-click remediation buttons
- **Origin** - the flow, task, and execution that created the case (set only when created by the `CreateCase` task); this is the deduplication key
- **Template reference** - the case template the case was created from, if any

## Case lifecycle

There is no restrictive state machine: any status can be changed to any other, including reopening a resolved or cancelled case. A few rules apply:

1. Resolving requires a **resolution reason**; the note is optional. When the case was created from a template, the template can restrict the allowed reasons and make the note mandatory. Without a template, the built-in reasons are offered: Fixed, Workaround applied, Configuration change, Duplicate, No action needed, Won't fix.
2. Cancelling accepts an optional reason and note.
3. The first time the case moves from `Open` to any other status, the acknowledgement time is recorded (this satisfies the acknowledgement SLA and is kept even if the case is later reopened).
4. Reopening a terminal case clears the resolution, and the case's auto-attach flow (if any) is recreated.

## SLAs

Each case can have two optional SLA targets, set directly or inherited from a template:

1. **Acknowledgement** - met the first time the case moves from `Open` to any other status
2. **Resolution** - met when the case is resolved

Both clocks start at case creation. Each of the two SLAs can be in one of six states: `Not started`, `Running`, `Overdue`, `Met`, `Missed`, or `Voided` (cancelling a case voids its pending SLAs). States are computed at read time and never persisted. The UI shows a live countdown ("Due in 2h", "Due 30m ago") on the case detail page, board cards, and the list's Resolution SLA column.

Currently, SLA breaches are only visible in the UI. No alert is sent when a target is missed; the `SLA_ACKNOWLEDGEMENT_BREACHED` and `SLA_RESOLUTION_BREACHED` timeline events are reserved for a future background monitor.

## The CreateCase task

The task type is `io.kestra.plugin.kestra.ee.cases.CreateCase`. It is an SDK-based task that calls the Kestra API, so it can be placed in any task block: `tasks`, `errors`, `finally`, or `afterExecution`.

```yaml
id: orders_sync
namespace: company.team

tasks:
  - id: sync
    type: io.kestra.plugin.core.http.Request
    uri: https://api.example.com/orders

errors:
  - id: open_case
    type: io.kestra.plugin.kestra.ee.cases.CreateCase
    kestraUrl: http://localhost:8080
    auth:
      apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
    title: "Orders sync failed: {{ flow.id }}"
    severity: HIGH
    linkMatchingExecutions: true
    sla:
      acknowledgement: PT1H
      resolution: PT8H
```

The task calls the Kestra API, so it needs an endpoint and credentials. `kestraUrl` defaults to the URL of the current instance, and `auth` accepts either an `apiToken` or a `username` and `password` pair. Both can also be omitted: an administrator can set **Default authentication credentials** when editing a namespace or tenant, and those credentials are then used automatically (the instance configuration `kestra.tasks.sdk.authentication` works as a global fallback). Without `auth` on the task and without such defaults, the task fails at runtime.

For condition-based cases inside the regular `tasks` block, combine it with `runIf`:

```yaml
tasks:
  - id: check
    type: io.kestra.plugin.core.http.Request
    uri: https://api.example.com/health
    allowFailed: true

  - id: open_case
    type: io.kestra.plugin.kestra.ee.cases.CreateCase
    kestraUrl: http://localhost:8080
    auth:
      apiToken: "{{ secret('KESTRA_API_TOKEN') }}"
    runIf: "{{ outputs.check.code != 200 }}"
    title: "Health check returned {{ outputs.check.code }}"
    severity: CRITICAL
```

### Properties

| Property | Description |
|---|---|
| `title` | Case title; required unless `caseId` is set. Supports expressions. |
| `caseDescription` | Markdown description (named this way because `description` is reserved for the task itself). |
| `severity` | `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`; defaults to `MEDIUM`. |
| `status` | Initial status; defaults to `OPEN`. |
| `namespace` | Namespace the case belongs to; defaults to the flow's namespace. |
| `sla` | `acknowledgement` and `resolution` durations (ISO-8601, e.g. `PT1H`). |
| `linkMatchingExecutions` | When `true`, the execution is attached to an already-open case with the same origin instead of creating a new one; defaults to `false`. |
| `caseId` | Attach the execution to this exact case instead of creating one (used by generated auto-attach flows). |
| `executionId` | Execution to link; defaults to the current execution. |
| `assignees` / `watchers` | User emails and group names, resolved to stable IDs on the server. |
| `labels` | Key/value pairs, stored as Text custom fields on the case. |
| `assetIds` | Assets to link to the case. |
| `actions` | Case actions to attach, each with `label`, `namespace`, and `flowId`. |

Connection properties (`kestraUrl`, `auth`, `tenantId`) are shared by all tasks from the Kestra plugin; `tenantId` defaults to the execution's tenant. Authentication is resolved as described above: `auth` set on the task takes precedence, then the namespace's default authentication credentials, then the tenant's, then the instance configuration.

### Outputs

The task returns `caseId` and `created`. `created: false` means the execution was attached to an existing case (via deduplication or `caseId`) rather than opening a new one.

Note that the task cannot reference a case template. Case templates are mainly helpers to make it easier to configure cases from the UI; when creating cases from code, all properties such as severity or SLAs are declared explicitly on the task, following Kestra's declarative nature.

## Deduplication

With `linkMatchingExecutions: true`, the server first looks for an active case with the same **origin**: the combination of flow namespace, flow ID, and task ID (within the tenant). The title is not part of the key. A case counts as active when its status is `Open`, `Acknowledged`, or `Investigating`.

- **On a match** - the triggering execution is appended to the existing case's linked executions (visible in the timeline as an `EXECUTION_LINKED` event), no new case is created, and the task returns `created: false`. Fields such as title or severity are not merged, and no new "created" notification is sent.
- **On no match** - a new case is created with the origin recorded, and the execution is linked to it.

The same behavior can also be enabled from the UI on an existing case with [auto-attach](#auto-attach).

One caveat: the deduplication check is not atomic. The server first checks for an existing case and then creates one, so two executions of the same task failing at exactly the same moment can each create their own case.

## Auto-attach

Auto-attach allows you to avoid getting a new case and a new notification for every single failed execution. A case is created for the first failure, and all following executions matching the same flow and state are automatically attached to that same case until the case is resolved or cancelled.

Deduplication with `linkMatchingExecutions` achieves the same from the flow YAML; auto-attach is its UI counterpart, configured on an existing case. It can be enabled when attaching an execution to a case, from the case detail page or in the Create Case modal, using the checkbox "Also keep attaching future executions matching this flow and state".

Under the hood, enabling it generates a flow named `attach_executions_<caseId>` in the system namespace, with one Flow trigger per (namespace, flow, states) rule and a single `CreateCase` task that passes the `caseId`. Multiple rules accumulate on the same generated flow. The flow is deleted when the case reaches a terminal status or is deleted, and recreated on reopen. These generated flows are visible on the [System Flows](../../../06.concepts/system-flows/index.md) page.

Enabling auto-attach is gated by RBAC: it requires the `UPDATE` action on the `CASE` permission in the case's namespace, plus the `EXECUTE` action on the `FLOW` permission in the namespace of the flow whose executions will be attached.

## Creating cases from the UI

Besides the task, cases can be created in four places:

1. **The Cases page** - the Create button opens a modal with template selection, title, severity, initial status, namespace, assignees and watchers, both SLA targets (presets from 1 hour to 72 hours, or a custom duration), description, custom fields, and executions to link.
2. **The Executions page (bulk)** - select executions and use "Create case from selection" or "Add to existing case". Both also work with "select all matching filter", so a case can be created from everything matching the current query.
3. **An execution's Overview tab** - a "Linked cases" panel lists the cases the execution belongs to and offers a Create case button pre-linked to that execution.
4. **An asset page** - the same panel exists on the asset overview; a case created there is linked to the asset automatically.

## Cases in the UI

Cases sit in the left menu between Executions and System Flows.

- **Board view (default)** - a kanban board grouped by status, severity, or assignee. Dragging a card between columns updates the case; dropping onto Resolved opens the resolve modal, because a reason is mandatory. Cards show the case ID, severity, title, assignees, and a live SLA countdown.
- **List view** - columns for Case, Title, Severity, Status, Resolution SLA, and Assignee, with an inline next-step button per row (Acknowledge, Investigating, Resolve) and bulk Acknowledge/Delete.
- **Toolbar** - full-text search; filters on namespace, status, severity, assignee, and time range; an "Assigned to me" toggle; and one chip per status with live counts.

The case detail page shows the editable header (title, severity, status, quick transitions, Resolve/Reopen), the Markdown description, custom fields, a resolution card once resolved, SLA countdowns, assignees and watchers (with a Watch/Unwatch toggle and "Assign with note"), case actions, linked executions, linked assets, and the activity timeline.

## Comments and activity timeline

Every change to a case is recorded as a timeline event: creation, field updates, status and severity changes, assignments (with optional note), execution and asset links, action runs, and auto-attach changes. Comments support **Markdown** and up to 5 file attachments of 10 MB each (drag-and-drop and clipboard paste work).

## Case actions

A case action is a flow attached to the case as a one-click button, intended for remediation or diagnostics (e.g. "Restart service"). Running one starts an execution that is automatically linked back to the case and labeled with `system.case: <caseId>`, and the run is recorded in the timeline. Attaching or running an action requires the `EXECUTE` action on the `FLOW` permission in the target flow's namespace.

## Linked executions and assets

- **Executions** can be linked by the task, by auto-attach, manually from the case detail page, or in bulk by ID or by filter query. The linked-executions card shows each execution's live state and keeps a row (marked as no longer existing) even if the execution was purged.
- **Assets** come in two kinds: explicitly attached ones, and derived ones (assets used by the case's linked executions, shown with an "Auto-detected" tag). Derived assets cannot be unlinked; they disappear when the executions that reference them are unlinked.

## Case templates

Templates standardize how cases are created. A template can define a default severity, default assignees and watchers, a title pattern (supporting the same expressions as the task title), a description, both SLA targets, custom field definitions, default case actions, allowed resolution reasons, and whether a resolution note is required. One template per tenant can be marked as the default; it is preselected in the Create Case modal.

Templates are managed in **Cases → Settings** and require the `TEMPLATE` action on the `CASE` permission. A template can be scoped to a namespace or left tenant-wide (tenant-wide templates and the default flag require a global grant).

Every tenant is seeded with a built-in "Execution failure incident" template: severity High, title pattern `{{ execution.id }} failed for {{ flow.id }}`, 1 hour acknowledgement and 8 hour resolution SLA, and the built-in resolution reasons.

Template defaults apply when creating cases via the UI or the API; they cannot be used by the `CreateCase` task, where all properties are declared explicitly in the flow YAML.

## Notifications

Case events are wired into the in-app notification system (the bell icon). Five events send notifications: case created, assigned, status changed, severity changed, and commented. Recipients are the case's assignees and watchers, with groups expanded to their members; assignment notifications go only to the users whose assignment actually changed, with the assignment note included. Each notification contains a link to the case.

## Permissions and audit

- **RBAC** - a new `CASE` permission resource with actions `VIEW`, `LIST`, `CREATE`, `UPDATE`, `DELETE`, `FOLLOW`, and `TEMPLATE`, optionally scoped to a namespace (_creating a case requires `CREATE` on its namespace, transitions and linking require `UPDATE`, commenting only requires `VIEW`_).
- **Audit** - create, update, and delete of cases and case templates are recorded in the [audit log](../06.audit-logs/index.md) (resource types `CASE` and `CASE_TEMPLATE`). Timeline events and comments are not separately audited.
- **Backup** - cases, templates, timeline events, and execution links are included in backup and restore.

## Current limitations

- **In-app notifications only** - case events show up in the notification bell, but no Slack message or email is sent by cases themselves. External alerting can still be added with standard notification tasks next to `CreateCase`, or as a case action.
- **Deduplication is not atomic** - concurrent failures of the same task can occasionally create duplicate cases.
