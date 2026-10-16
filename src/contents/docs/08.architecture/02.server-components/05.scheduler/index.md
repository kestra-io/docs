---
title: "Scheduler in Kestra: How Triggers Are Evaluated"
h1: How the Kestra Scheduler Evaluates Triggers
description: Understand how the Kestra Scheduler evaluates Schedule, polling, and realtime triggers. Learn how it locks triggers and recovers missed schedules.
sidebarTitle: Scheduler
icon: /src/contents/docs/icons/architecture.svg
---

The Scheduler is the server component that decides when time-based and event-polling triggers fire.

It evaluates [Schedule](../../../05.workflow-components/07.triggers/01.schedule-trigger/index.md) triggers itself, sends [polling](../../../05.workflow-components/07.triggers/04.polling-trigger/index.md) and [realtime](../../../05.workflow-components/07.triggers/05.realtime-trigger/index.md) triggers to [Workers](../03.worker/index.md) to run, and hands every execution a trigger creates to the [Executor](../01.executor/index.md). Each section below links to the page that documents how to configure the trigger feature it describes.

## What the Scheduler does

The Scheduler keeps a state for each trigger it handles: when it should next be evaluated, whether it is locked, and which execution or Worker currently holds it. It handles these triggers:

- `Schedule` and `ScheduleOnDates`, which it evaluates itself.
- Polling triggers, such as the HTTP trigger or a database query trigger, which run on a Worker.
- Realtime triggers, which run continuously on a Worker.

Other triggers don't go through the Scheduler. The Executor evaluates [Flow triggers](../../../05.workflow-components/07.triggers/02.flow-trigger/index.md) when an upstream execution changes state, and the [Webserver](../07.webserver/index.md) evaluates [Webhook triggers](../../../05.workflow-components/07.triggers/03.webhook-trigger/index.md) when a request arrives.

## How triggers are evaluated

The Scheduler checks its triggers on a one-second loop. A trigger is evaluated when its next evaluation date is reached:

- If the trigger's [`when`](../../../05.workflow-components/07.triggers/index.mdx#when-pebble-expression-all-triggers) expression is false, the Scheduler moves to the next evaluation date without firing.
- A `Schedule` trigger fires inside the Scheduler, which sends the new execution to the Executor and computes the next date from the cron expression.
- A polling or realtime trigger is sent to a Worker as a job. The Worker runs the poll and reports the result back through the [Worker Controller](../02.worker-controller/index.md). If the poll found something, the Scheduler sends the resulting execution to the Executor.

A polling trigger without an `interval` isn't evaluated, and an error appears in the trigger's logs.

If one pass of the loop takes longer than about one second, the Scheduler logs a warning that the loop `cannot keep up with its trigger load`. The loop doesn't replay the seconds it missed; it continues from the next one.

## Trigger locking

By default, a trigger has `allowConcurrent: false`. When it fires, the Scheduler locks it and records the execution it created. A locked trigger isn't evaluated, so it creates no new execution until that execution ends and the Executor reports the result. With `allowConcurrent: true`, the trigger isn't locked. See [concurrent trigger executions](../../../05.workflow-components/14.concurrency/index.md#concurrent-trigger-executions).

The same applies to polling triggers: the trigger stays locked while its poll runs on a Worker. If the poll finds nothing, the lock is released right away. If it creates an execution, the lock stays until that execution ends.

When the locked execution ends, the Scheduler applies [`stopAfter`](../../../05.workflow-components/07.triggers/index.mdx#stopafter): if the execution's final state is in the list, the trigger is disabled.

If a trigger stays locked but no execution can be found for it, the Scheduler logs a warning, checked every 10 seconds, once the trigger hasn't been updated for more than a minute: `No execution found, schedule is blocked since '...'`. You can release it from the UI, as described in [unlocking, enabling, and disabling triggers](../../../05.workflow-components/07.triggers/index.mdx#unlocking-enabling-and-disabling-triggers).

## Realtime triggers

A realtime trigger stays locked for as long as it runs on a Worker, so it isn't started twice. It's unlocked only if it fails to start. Unlocking it from the UI or API isn't allowed; restart it instead, which stops the running instance and starts a new one.

When you update, disable, or delete a realtime trigger, the Scheduler tells the Worker running it to stop.

## Missed schedules and backfills

When a Scheduler starts, or takes over triggers from another Scheduler, it creates a state for any new trigger. A new `Schedule` trigger is first evaluated at its next cron date, and a new polling or realtime trigger is evaluated immediately.

For existing `Schedule` triggers, `recoverMissedSchedules` decides what happens to the dates that passed while no Scheduler was running them:

- `ALL` (the default) runs every missed date.
- `LAST` runs only the most recent missed date.
- `NONE` skips the missed dates and continues from now.

When you re-enable a disabled trigger from the UI or API, the missed dates are skipped unless you choose to recover them, in which case the trigger's own `recoverMissedSchedules` applies. See [recover missed schedules](../../../05.workflow-components/07.triggers/01.schedule-trigger/index.md#recover-missed-schedules).

To replay a past period on purpose, create a [backfill](../../../05.workflow-components/07.triggers/01.schedule-trigger/index.md#using-backfill). A trigger can have one backfill at a time, and backfill runs follow the same locking rules as regular runs.

## When evaluation fails

- If a `Schedule` trigger can't be evaluated for a date, the error appears in the trigger's logs and the date is skipped.
- If any other error occurs while evaluating a trigger, the Scheduler creates a `FAILED` execution so the failure is visible, releases the lock, and moves to the next evaluation date. This includes a `when` expression that can't be rendered.
- If the trigger's configuration is invalid, such as a bad cron expression or timezone, the Scheduler disables the trigger and logs `Disabled: the trigger configuration is invalid`. Fix the flow, then enable the trigger again.
- If a flow can't be parsed and the Scheduler has no stored triggers for it, its triggers are disabled with `Disabled: the flow cannot be parsed on this version`.

:::alert{type="info"}
In Enterprise Edition, the triggers of a flow blocked by a governance [policy](../../../07.enterprise/02.governance/policies/index.md) are skipped, and the reason appears in each trigger's logs.
:::

## Timezones

A `Schedule` trigger evaluates its cron expression in its `timezone` property. When `timezone` isn't set, it uses the timezone of the Kestra server, so set it explicitly when the schedule must not depend on server configuration.

## Sharing work across Schedulers

You can run several Schedulers. They share the work by splitting flows across virtual nodes: each flow is assigned to one of 16 virtual nodes by default, and all the triggers of a flow follow it. Each running Scheduler owns a set of virtual nodes, so every trigger is evaluated by exactly one Scheduler.

The [Executor](../01.executor/index.md#liveness) assigns virtual nodes to the running Schedulers as part of its liveness checks, and reassigns them when a Scheduler joins or leaves. Because of this, Schedulers only receive virtual nodes, and so only fire triggers, once an Executor is running.

The number of virtual nodes is stored with each trigger's state. Don't change `kestra.scheduler.vnodes` on an existing installation without guidance.

When a Worker running a polling or realtime trigger stops responding, the Executor reports it to the Scheduler, which releases the trigger so another Worker can run it. See [server lifecycle](../../../10.administrator-guide/server-lifecycle/index.md).

## Maintenance mode

:::alert{type="info"}
Maintenance mode is available in Enterprise Edition.
:::

In [maintenance mode](../../../07.enterprise/05.instance/maintenance-mode/index.md), the Scheduler stops evaluating triggers. When maintenance mode ends, virtual nodes are reassigned and the Scheduler resumes.

## Running the Scheduler

### Scaling

Run more than one Scheduler for availability: if one stops, the Executor reassigns its virtual nodes to the others. See [high availability](../../../10.administrator-guide/high-availability/index.md#scaling-components).

Each Scheduler evaluates triggers on up to `max(4, allocated CPU cores)` threads, or the number set with `kestra server scheduler --max-threads`. See [allocated CPU cores](../../../configuration/02.runtime-and-storage/index.md#allocated-cpu-cores) and the [`kestra server scheduler`](../../../kestra-cli/kestra-server/index.md#kestra-server-scheduler) command.

### Configuration

| Property | Default | Purpose |
|---|---|---|
| `kestra.scheduler.vnodes` | `16` | Number of virtual nodes that flows are split across. Stored with trigger state, so don't change it on an existing installation. |
| `kestra.scheduler.vnodes-rebalance-timeout` | `PT5S` | How long to wait for Schedulers to reply when virtual nodes are reassigned. |
| `kestra.scheduler.cache-max-size-per-vnode` | `100` | Size of the Scheduler's per-virtual-node caches. A value below `1` disables them. |

### Monitoring and troubleshooting

The Scheduler publishes metrics under `kestra.scheduler.*`, including triggers fired, evaluation and scheduling-delay timers, how long triggers stay locked, and the number of virtual nodes each Scheduler owns. See the [Scheduler metrics](../../../10.administrator-guide/03.monitoring/index.md#scheduler) for the full list.

The `/scheduler` management endpoint, on port `8081` of a Scheduler or standalone server, lists the triggers due for evaluation. It is sensitive by default. See [management endpoint hardening](../../../11.migration-guide/v2.0.0/management-endpoint-hardening/index.md).

To find a trigger that has stopped firing, check its logs in the flow's **Triggers** tab, then check whether it is locked or disabled. See [troubleshooting a trigger from the UI](../../../05.workflow-components/07.triggers/index.mdx#troubleshooting-a-trigger-from-the-ui).
