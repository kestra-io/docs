---
title: "Kestra Cloud Task Runs: What Is Counted and When"
h1: How Task Runs Are Counted on Kestra Cloud
sidebarTitle: Task runs
icon: /src/contents/docs/icons/admin.svg
editions: ["Cloud"]
description: Understand what a task run is, which ones are counted toward your Kestra Cloud usage, and how loops, subflows, and retries affect the count.
---

This page explains what a task run is and which ones are counted toward your Kestra Cloud usage. Task runs are counted separately from runner time: every task that finishes in a billable state counts, whether or not it uses the Cloud task runner. See [Cloud compute](../02.cloud-compute/index.md) for how runner time is measured.

:::alert{type="warning"}
A task run is not an execution. One execution of a flow produces one task run for every task that does work, once per loop iteration and once per retry attempt. A flow with a dozen tasks and a loop can produce well over a hundred task runs from a single execution. Estimating from execution counts can be off by two orders of magnitude.
:::

## What a task run is

A task run is one attempt of one task inside one execution. Three tasks in a flow, run once, are three task runs. The same flow with a `Loop` over 500 items around one of those tasks is 502 task runs: two plain tasks plus one task run per iteration. If one of those iterations fails and retries once, that is 503.

## What counts

A task run is counted when it finishes in one of four states: `SUCCESS`, `WARNING`, `FAILED`, or `KILLED`. A task that fails counts the same as one that succeeds. A task killed part-way through counts.

**Retries count per attempt.** A task that fails, retries, and succeeds is two task runs: one `FAILED`, one `SUCCESS`.

**Every task type counts.** A `gcp.bigquery.Query`, a Slack notification, an HTTP request, a Python script: each is one task run when it finishes.

**`WorkingDirectory` counts.** It looks like a flow-control task, but it is the one that also does real work: it runs on a worker to set up the shared directory and to move namespace files, input files, and output files. That work is a task run of its own, counted once per `WorkingDirectory`, on top of the tasks inside it. A `WorkingDirectory` wrapping one Python task is two task runs, not one.

## What does not count

**Flow-control tasks.** `Parallel`, `Sequential`, `Loop`, `LoopUntil`, `Subflow`, `If`, `Switch`, `Dag`, `AllowFailure`, and `Pause` are handled by the orchestrator. They are not counted; only the tasks inside them are. Nesting flow-control tasks adds nothing on its own. `WorkingDirectory` is the exception: it is counted, see above.

**Execution-level tasks.** `core.execution.Labels`, `SetVariables`, `UnsetVariables`, and `Exit` are handled by the orchestrator and are not counted.

**Tasks that never finish in a counted state.** A task skipped by `runIf` (`SKIPPED`), cancelled before it started (`CANCELLED`), or retried as a new execution (`RETRIED`) is not counted. Any attempt that did run is counted under the rule above.

**Triggers.** A schedule or polling trigger firing is not a task run. The tasks in the execution it starts are.

## Loops and subflows

`Loop` runs each iteration as its own sub-execution. Those sub-executions appear in the executions list, so a loop over 500 items adds 500 entries there. Each iteration contributes exactly the tasks inside it, nothing more.

`LoopUntil` repeats its inner tasks in the same execution until a condition holds. Every repetition counts the inner tasks again.

The `Subflow` task itself is not counted. Every task inside the child execution it starts is counted under the normal rules. A parent flow that calls a subflow with five tasks produces five task runs per call, not six. Calling it from a `Loop` over 100 items produces 500.

## How to estimate your task runs

There are two ways, depending on whether the flow has run yet.

**If it is already running, read it.** In your Kestra instance, go to **Tenant → System Overview → Usage** and set the period to 7 or 30 days. The **task runs** card gives you a real count over that window. Treat it as an upper bound: it counts every task, including the flow-control tasks Cloud does not bill. A loop-heavy flow reads well above its bill, a flat one reads close to it.

**If it does not exist yet, or you are changing it, estimate it.** Work from loops, not from executions:

1. Count the tasks that do work (skip flow-control and execution-level tasks), then add one for each `WorkingDirectory`.
2. For each task inside a `Loop`, multiply by the number of items. For nested loops, multiply again.
3. For each subflow call, add the child flow's count, multiplied by how often it is called.
4. Multiply by the number of executions you expect, then add a margin for retries.

Where it fits the work, process a list inside one task instead of one task per item. That is one task run instead of hundreds, and it is also the main way to reduce time on the Cloud runner.

## FAQ

**My flow has 12 tasks and a `Loop` over 50 rows around 3 of them. How many task runs per execution?**

9 plain tasks plus 3 × 50 in the loop: 159. The `Loop` itself is not counted. If that number is higher than you want, the lever is the loop: passing the 50 rows into a single task that iterates internally turns 150 task runs into 3.

**I wrap every Python task in a `WorkingDirectory`. Does that double my count?**

Close to it: a flow of 10 scripts each in its own `WorkingDirectory` is 20 task runs. You probably do not need one per task. `WorkingDirectory` exists so that several tasks can share one filesystem; a single script task does not need it, because `namespaceFiles`, `inputFiles` and `outputFiles` work directly on the task. Drop the wrapper where a task stands alone, and where tasks genuinely do share files, put them inside one `WorkingDirectory` rather than one each: that adds a single task run for the whole group.

**Does a task killed before it started count?**

It depends how far it got. A task that had already been handed to a worker when the kill arrived is recorded as `KILLED` and counted once, even if its code never ran. Tasks the execution had not yet dispatched are not counted.

**Does the size of the task or how long it ran matter for the task run count?**

No. A task run is a task run whether it took a second or an hour. Duration matters only for tasks on the Cloud runner, which is measured separately.

**Where can I see how many task runs I produce?**

Go to **Tenant → System Overview → Usage** and set the period to 7 or 30 days: the **task runs** card counts them over that window. It counts flow-control tasks too, which Cloud does not bill, so read it as an upper bound. For a single execution, open it: every task run is listed with its state, including one per retry attempt, and each `Loop` iteration appears as its own sub-execution. On Kestra Cloud, your invoice is the authoritative total.
