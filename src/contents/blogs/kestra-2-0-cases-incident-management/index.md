---
title: "Cases in Kestra 2.0: one record and owners per incident"
description: "Cases in Kestra 2.0 turn repeated failures into one owned incident, with an SLA, the evidence attached, and the fix as a button. What it gives you, and how to run it in production."
date: 2026-09-11T10:00:00
category: News & Product Updates
author:
  name: Martin-Pierre Roset
  linkedin: https://www.linkedin.com/in/martin-pierre-roset/
  image: mproset
  role: Developer Marketing
image: ./main.png
---

Every orchestrator can tell you that something failed. Almost none of them can tell you who is dealing with it.


Kestra 2.0 takes a position on that. **A failed execution is usually an incident, and the platform that ran it is the right place to manage it.** Cases is the result.


## Before and after

| | Without Cases | With Cases |
|---|---|---|
| An API is down for 40 minutes | 80 failed executions, 80 alerts, a muted channel | 1 case, 1 notification, 80 executions attached |
| Who's on it? | Whoever answers in the thread | A named assignee, watchers, an acknowledgement clock |
| Where's the evidence? | Execution ids pasted into a ticket elsewhere | The executions are the case; live state, kept even after purge |
| How do we fix it? | Find the runbook, run it, remember to say you did | A button on the case; the run is linked and labelled |
| What happened, afterwards? | Read the thread | Resolution reason, timeline, SLA met or missed, queryable |
| An approval before a prod change | An @-mention and hope | A case assigned to the approver, counting down in public |

## What changes when incidents live in the orchestrator

**One incident instead of a hundred alerts.** The first failure opens a case and the next ninety-nine attach to it. One notification.

**Someone owns it.** Assignee, watchers, and two SLAs: time to acknowledge, time to resolve. Both count down on the board. A missed deadline is an event on the timeline and a notification to the people who need to know.

**The fix is next to the evidence.** Remediation flows attach to a case as buttons. Press one and it runs as a normal Kestra execution, linked back to the case, labelled with its id, governed by the same RBAC as everything else. The runbook step became a button, and pressing it left a trail.

**Resolution is a fact.** Closing a case requires a reason: Fixed, Workaround applied, Configuration change, Duplicate, No action needed, Won't fix. You can always ask how many incidents were configuration changes versus dependency outages.

**Approvals get the same treatment.** Who gave it, and when, sit on the same record as the execution it unblocked.

None of this needed a second tool, a sync job, or another permissions model. The failing execution, the incident, the remediation, the approval and the audit entry are all things happening in the same engine.

## How cases work in Kestra

A GitHub issue is opened: *Payment service returning 500 on checkout*. A webhook flow receives it and opens a case. High severity, assigned, thirty minutes to acknowledge, four hours to resolve.

![The flow: a webhook trigger and a CreateCase task with title, description, severity, deduplication, assignee and SLA](./01-flow.png)

A second report arrives with a different title, *Payment service 500 — second alert. 47 users affected in the last 10 minutes.* No second case. The existing one now shows two linked executions. The person assigned got exactly one notification.

![The case detail: two linked executions, both SLA clocks running](./05-case-two-executions.png)

They attach `restart-payment-service` as a case action and run it with a reason. The execution starts, linked to the case, and the case moves to Acknowledged.

![Running the remediation flow from the case, with its input](./07-run-action.png)

![Case Acknowledged, action attached, execution started, acknowledgement SLA on time](./08-acknowledged.png)

Then Resolve, reason Fixed, note "Restarted payment service within SLA."

![Resolved: resolution card, both SLAs on time](./10-resolved.png)

Two reports, one case, one remediation, one resolution. Every step of it is either an execution or an event on one. And back on the Executions page there is now a **Cases column**: every execution shows which incident it belongs to.

![Executions list with the new Cases column](./02-executions-cases-column.png)

## Five ways to use it

Cases are opened by a task, `io.kestra.plugin.kestra.ee.cases.CreateCase`, and the task goes wherever a task goes: `errors`, `finally`, `afterExecution`, or inline with `runIf`. That one design choice is what makes everything below possible.

### 1. The failure that repeats

The default pattern. Put the task in `errors`, turn on deduplication, name an owner.

```yaml
errors:
  - id: open_case
    type: io.kestra.plugin.kestra.ee.cases.CreateCase
    title: "{{ flow.id }} failed"
    caseDescription: |
      Failed tasks: {{ tasksWithState('FAILED') }}
    severity: HIGH
    linkMatchingExecutions: true
    assignees:
      groups:
        - Data Platform
    sla:
      acknowledgement: PT1H
      resolution: PT8H
```

`linkMatchingExecutions: true` is the line that changes on-call. The deduplication key is the origin, flow namespace plus flow id plus task id. **The title is deliberately not part of it**, so `"{{ execution.id }} failed"` still groups. While a case is Open, Acknowledged or Investigating, every failure from that origin attaches to it and fires no new notification. Resolve it and the next failure opens a fresh case, which is what you want for a dependency that flaps.

We considered three designs. Disabling the rule when someone acknowledges was rejected: it blinds you to the next, unrelated incident of the same kind, and that is the "we turned off the alert and missed the real one" post-mortem. Snooze is a fine complement and a bad mechanism. Attaching to the open case is what PagerDuty, Opsgenie and Alertmanager all converged on. **Acknowledging changes notification. It never changes detection.**

### 2. The success that shouldn't have been

Nothing failed. The reconciliation finished green with a 38% variance, and the number sat in a dashboard.

```yaml
tasks:
  - id: reconcile
    type: io.kestra.plugin.scripts.python.Script
    # ... writes outputs.reconcile.vars.variance

  - id: flag_variance
    type: io.kestra.plugin.kestra.ee.cases.CreateCase
    runIf: "{{ outputs.reconcile.vars.variance > 0.05 }}"
    title: "Reconciliation variance {{ outputs.reconcile.vars.variance | numberFormat('#.#%') }}"
    severity: HIGH
    assignees:
      groups:
        - Finance Ops
```

The execution stays SUCCESS. The case is open. **Success and incident are not mutually exclusive**, and the orchestrator finally has a way to say so. The same shape covers a health check returning 200 with an empty body, a scrape that returns suspiciously few rows, or an AI agent's output that a human should see before anything acts on it.

### 3. The signal that comes from outside

A webhook trigger, a `CreateCase` task, and anything that can POST becomes a case: a GitHub issue, a monitoring alert, a form. The receiving flow can enrich first, looking up the owner, the environment and the last deploy, and put all of that into `caseDescription` so whoever picks it up starts with context.

```yaml
triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: gh-triage-key

tasks:
  - id: create_case
    type: io.kestra.plugin.kestra.ee.cases.CreateCase
    title: "{{ trigger.body.title }}"
    caseDescription: |
      **Reported by:** GitHub webhook

      {{ trigger.body.body }}
    severity: HIGH
    linkMatchingExecutions: true
    assignees:
      users:
        - oncall@company.com
    sla:
      acknowledgement: PT30M
      resolution: PT4H
```

This is also how Cases sits beside an incident tool you already run. The same flow can open a case for the execution-level evidence and a ticket elsewhere for the enterprise record.

### 4. The approval, on the record

An execution pauses ahead of a production change. The pause itself is a `Pause` task, resumed from the UI or an App. Open a case alongside it and the pending approval becomes visible on the board, counting down, with a named approver.

```yaml
tasks:
  - id: request_approval
    type: io.kestra.plugin.kestra.ee.cases.CreateCase
    title: "Approve: patch {{ inputs.hostname }}"
    caseDescription: "Patch window {{ inputs.window }}. Execution is paused until approved."
    severity: MEDIUM
    assignees:
      users:
        - "{{ inputs.approver }}"
    sla:
      acknowledgement: PT30M

  - id: wait_for_approval
    type: io.kestra.plugin.core.flow.Pause
```


### 5. The maintenance window

A cluster upgrade will fail one flow for four hours. Before the window, open a case by hand, turn on **Auto-link matching executions** for that flow in FAILED, and comment "cluster upgrade, expected until 14:00." Every failure during the window groups into it. Resolve it afterwards. If the flow fails again at 14:05, it become a new case.

Auto-link generates a flow named `attach_executions_<caseId>` in the `system` namespace, with a Flow trigger per rule and a `CreateCase` task passing the `caseId`. It is visible on the System Flows page and deleted when the case closes. **The incident feature is built from the orchestrator's own primitives.** It has no hidden state.

## Running it in production

**Decide your grouping before your first outage.** The dedup key is flow plus task. One `CreateCase` in `errors` groups every failure of that flow as one incident. Several inline with `runIf` group per failing step. Pick the one that answers your on-call's question.

**Start from the built-in template.** Every tenant ships with *Execution failure incident*: High, one hour to acknowledge, eight to resolve. Templates set defaults for cases created from the UI or API. From YAML you declare everything explicitly, so the flow file stays the whole truth. Add one template per team with its own SLAs, allowed resolution reasons and default actions.

**Pick SLAs you will meet.** Both clocks start at creation. Acknowledgement is met the first time a case leaves Open, and that timestamp survives a reopen, so reopening does not launder response time. SLA states are computed at read time. Breaches notify once, from a check every five minutes.

**Make remediation an action.** Any flow the operator can execute can be a case action. Running one needs `FLOW: EXECUTE` on its namespace and lands in the execution list labelled `system.caseId` and `system.from: case`. Everything that run against this incident become a label filter.

**Scope permissions to the job.** `CASE` is its own RBAC resource, scopable to a namespace. Creating needs `CREATE`, transitions and linking need `UPDATE`, commenting needs only `VIEW`, which is how you get context from people who aren't incident owners without giving them the keys.

**Get the notification out of the building.** Case notifications are in-app, on the bell. For Slack or email, put a notification task beside `CreateCase`, or make the notification a case action so it is itself an audited execution.

**Know what it isn't.** Cases is an incident record with remediation attached, living where the failures live. It is not a paging product: no on-call rotations, no escalation policies, no external ticket sync yet. And the deduplication check is not atomic, so two executions of the same task failing in the same instant can each open a case. In practice failures arrive milliseconds apart and group.

## Get started

1. **Get started to 2.0** on Enterprise or Cloud. `CreateCase` ships in `plugin-kestra`, included in the default image; with self-managed plugins, install it through Versioned Plugins.
2. **Pick one flow that fails noisily.** Add the pattern-1 block to its `errors`. Set the group that already gets paged.
3. **Break it on purpose.** Point it at a dead URL, run it three times. You should see one case with three linked executions and one notification.
4. **Attach the fix.** Whatever you'd normally run to recover, add it as a case action. Run it from the case.
5. **Resolve with a reason.** Then open the Cases board and look at what you just made: an incident record that wrote itself.

:::alert{type="info"}
**Availability.** Cases is available today in Kestra 2.0 Enterprise Edition and Kestra Cloud. Requires `plugin-kestra` 2.0.3 or later.
:::

## Why here

Cases has nothing to integrate because nothing left. The failing execution, the incident, the remediation, the approval and the audit trail are in the same engine. The label on the remediation execution is the link. The system flow that groups failures is a flow.

In other worlds **The place that ran the thing that failed is the right place to manage the failure.** 

---

[Click through the demo](https://app.arcade.software/share/n8XyY0b5qhqG92Q4zFCI) · [Cases docs](https://kestra.io/docs/enterprise/governance/cases) · [CreateCase task reference](https://kestra.io/plugins/plugin-kestra/kestra-cases/io.kestra.plugin.kestra.ee.cases.createcase) · [Release post](https://kestra.io/blogs/release-2-0) · [What changed in the engine](https://kestra.io/blogs/2026-09-01-kestra20-rebuild-engine)
