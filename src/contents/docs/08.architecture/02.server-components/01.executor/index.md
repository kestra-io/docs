---
title: "Executor in Kestra: How Executions Move Forward"
h1: How the Kestra Executor Orchestrates Executions
description: Understand how the Kestra Executor drives each execution. Learn how it applies concurrency limits, retries, and SLAs, and how to run it in production.
sidebarTitle: Executor
icon: /src/contents/docs/icons/architecture.svg
---

The Executor is the server component that moves every execution from start to finish.

It decides which task runs next, sends runnable tasks to [Workers](../03.worker/index.md) through the [Worker Controller](../02.worker-controller/index.md), runs flowable tasks itself, and applies the rules a flow declares: concurrency limits, retries, pauses, SLAs, and kills. Each section below links to the page that documents how to configure the feature.

## What the Executor does

Every change to an execution reaches the Executor as a message on the [queue](../../01.main-components/index.md#queue): a new execution, a task result from a Worker, a kill request, a child execution ending. For each message, the Executor loads the execution, works out its next state, and publishes what must happen next.

The Executor treats the two kinds of [tasks](../../../05.workflow-components/01.tasks/index.mdx) differently:

- **Runnable tasks**, such as a script or a query, are sent to a Worker. Their task run moves to `SUBMITTED` until a Worker picks it up.
- **Flowable tasks**, such as `Parallel`, `If`, or `Subflow`, run inside the Executor. They only decide which tasks run next, so their task run moves straight to `RUNNING`.

Messages for the same execution are applied one at a time, in order, while different executions are processed in parallel. A duplicate task result is ignored.

Each Executor process also runs an embedded **system Worker**. It serves a reserved queue that system tasks always use: the `PurgeExecutions`, `PurgeFlows`, `PurgeLogs`, and `PurgeStorage` tasks, and the Enterprise Edition `PurgeAuditLogs`, log shipper, and `AssetShipper` tasks.

## How an execution moves forward

When an execution is created, the Executor checks it before running anything:

- An execution with a future `scheduleDate` stays `CREATED` until that date, then starts.
- If the flow can't be parsed, or a governance rule blocks it, the execution fails immediately and the reason appears in its logs.
- An execution created in a final state, for example because its trigger inputs failed to render, is saved in that state and not processed further.

As tasks complete, the Executor picks the next ones:

- A task whose `runIf` evaluates to false becomes `SKIPPED` and never reaches a Worker. If `runIf` can't be rendered, the task run fails.
- When a [breakpoint](../../../05.workflow-components/17.states/index.md) matches a task, that task run and the execution move to `BREAKPOINT` and nothing more is dispatched until you resume.

:::alert{type="info"}
In Enterprise Edition, the Executor routes each runnable task to a [worker group](../04.worker-group/index.md), resolving the selector from the task, then the flow, its namespaces, and the tenant. If no worker group matches, the task fails. If the worker group has no running Workers, its [fallback](../../../07.enterprise/04.scalability/worker-group/index.md#fallback-options) decides whether the task waits, fails, is canceled, or runs on the default Workers.
:::

A single update can move an execution through several states at once, for example from `PAUSED` to `RUNNING` to `SUCCESS`. A [Flow trigger](../../../05.workflow-components/07.triggers/02.flow-trigger/index.md) that listens for any of those states fires once for each.

## Concurrency limits and quotas

Before a new or restarted execution runs, the Executor admits it in this order:

1. It registers the execution's [SLAs](../../../05.workflow-components/18.sla/index.md).
2. It checks [quotas](../../../05.workflow-components/21.quotas/index.md).
3. It checks [concurrency limits](../../../05.workflow-components/14.concurrency/index.md).

For concurrency, the Executor checks the flow's limit first, then any namespace and tenant limits, as described in [evaluation order](../../../05.workflow-components/14.concurrency/index.md#evaluation-order). The first limit that is full decides the outcome with its `behavior`: `QUEUE` moves the execution to `QUEUED`, `CANCEL` cancels it, and `FAIL` fails it. An admitted execution holds one slot at every level that has a limit, and releases those slots when it ends.

When a slot frees up, the oldest queued execution starts first. When the freed slot belongs to a namespace or tenant limit, the next execution can come from any flow under that limit, not only the flow that just finished. Executions you start with **Unqueue** or **Force run** skip admission and don't take a slot.

Quotas count executions in fixed time windows aligned to UTC. For example, a `PT1H` window starts on the hour. When an execution exceeds a quota, it fails or is canceled according to the quota's `behavior`.

:::alert{type="info"}
Quotas, and namespace and tenant concurrency limits, are available in Enterprise Edition. In the open-source edition, concurrency limits apply per flow, and a flow that declares `quotas` is rejected when you save it.
:::

[Loop](../../../05.workflow-components/01.tasks/00.flowable-tasks/index.md#loop) iterations skip SLA registration and concurrency limits.

## Retries, pauses, and waits

Anything that must happen later, such as a retry, the end of a pause, or the next `LoopUntil` check, is stored as a delay. The Executor checks for due delays about once per second.

For a failed task, the Executor looks for a [retry](../../../05.workflow-components/12.retries/index.md) policy on the task, then on its parent tasks, then on the flow:

- `RETRY_FAILED_TASK` (the default) retries the task in the same execution. The task run shows `RETRYING` while it waits.
- `CREATE_NEW_EXECUTION` marks the execution `RETRIED` and starts a new one.
- A task inside a `WorkingDirectory` is retried by running the whole `WorkingDirectory` again.

Retry policies apply to runnable tasks and to `Subflow`. If the execution is being killed or has already ended when a retry comes due, the retry is skipped.

A [`Pause`](../../../05.workflow-components/01.tasks/00.flowable-tasks/index.md#pause) task with a `pauseDuration` moves the execution to the state set by its `behavior` when the duration ends. With only a `timeout`, the task fails when the timeout ends. A pause that was already resumed or killed isn't resumed again by its timer.

## Subflows, loops, and Flow triggers

The Executor coordinates executions that start other executions.

**[Subflows](../../../05.workflow-components/10.subflows/index.md).** A `Subflow` task moves to `RUNNING` when its child execution is created. With `wait: false`, it succeeds immediately and ignores the child's outcome. Otherwise, it waits for the child to end and takes the child's final state and outputs, adjusted by `transmitFailed`, `allowFailure`, and `allowWarning`. A killed child marks the `Subflow` task run, and the flowable tasks around it in the parent, as `KILLED`. A child that is retried with `CREATE_NEW_EXECUTION` doesn't report back; its replacement does.

**Execution depth.** Each `Subflow` task or Flow trigger in a chain adds one level of depth, up to `kestra.execution.depth.max-depth` (default `100`). Past the limit, a `Subflow` task fails with an error, and a Flow trigger is skipped with a warning in the upstream execution's logs. The limit stops chains that would otherwise trigger each other forever.

**[Loops](../../../05.workflow-components/01.tasks/00.flowable-tasks/index.md#loop).**

- A `Loop` runs one iteration per value, up to `concurrencyLimit` at a time (`0`, the default, means no limit). An empty list of values succeeds immediately.
- Iterations have no flow outputs, run no `afterExecution` tasks, and don't fire Flow triggers.
- With `transmitFailed: true` (the default), the first iteration that fails ends the loop.
- `breakWhen` stops the loop early, and the iterations it never started are counted as `SKIPPED`.
- A pause inside an iteration pauses the parent `Loop` task.
- Restarting a failed loop restarts only the iteration that failed.
- If the list of values shrinks between iterations, the parent execution fails.

**[Flow triggers](../../../05.workflow-components/07.triggers/02.flow-trigger/index.md).** When an execution changes state, the Executor evaluates every Flow trigger against the latest revision of each flow. It skips disabled flows and triggers, draft revisions, flows that can't be parsed, test and playground executions, and loop iterations. A flow never triggers itself. If a trigger's condition can't be rendered, the trigger doesn't fire: a warning appears in the upstream execution's logs and an error in the downstream flow's logs.

## Kills and fail-fast

When you kill an execution, it moves to `KILLING`:

- Task runs that haven't started, or are waiting to retry, become `KILLED` immediately.
- A `QUEUED` execution leaves the queue and never starts.
- A `PAUSED` execution is resumed and then killed.
- The Executor tells Workers to stop the task runs they are running. The execution moves to `KILLED` once every task run has finished.

A kill also stops the executions that the killed execution started: subflows, running or paused loop iterations, and running executions started by a Flow trigger that listens to it.

:::alert{type="info"}
In Enterprise Edition, executions stopped by the [kill switch](../../../07.enterprise/05.instance/kill-switch/index.md#kill-switch-types) are labeled with `system.killSwitch`.
:::

`Parallel` and `Dag` can also stop their own tasks early with `onChildFailure`. When a child fails with no retry left, `CANCEL` or `FAIL` interrupts every task still running under that `Parallel` or `Dag`, at any depth, and gives them that state. The `Parallel` or `Dag` itself still ends `FAILED`, and its `errors` and `finally` tasks still run. The accepted values are `CONTINUE`, `CANCEL`, and `FAIL`:

| Task | Default `onChildFailure` | Effect |
|---|---|---|
| `Parallel` | `FAIL` | The first failure stops the other branches. |
| `Dag` | `CONTINUE` | Other tasks keep running after a failure. |

## SLAs

The Executor evaluates [SLAs](../../../05.workflow-components/18.sla/index.md) in two ways:

- `MAX_DURATION` is measured from the start of the execution and checked about once per second.
- `EXECUTION_ASSERTION` is checked each time the execution's state changes.

An SLA that can't be evaluated counts as violated, and the reason is logged. When an SLA is violated, its [`behavior`](../../../05.workflow-components/18.sla/index.md#sla-behavior) applies: `FAIL` or `CANCEL` sets the last running task run and the execution to `FAILED` or `CANCELLED` and kills the rest of the execution, including its children. `NONE` only adds the SLA's labels. If several SLAs are violated in the same update, only the first changes the execution. Loop iterations are exempt from SLAs.

## When an execution ends

When an execution reaches a final state, the Executor finishes it in this order:

1. Fires the Flow triggers that listen for that state.
2. Releases the execution's concurrency slots and starts the next queued execution.
3. Reports the result to the parent execution, for a subflow or a loop iteration.
4. Clears the execution's pending SLA checks.
5. Releases the trigger lock, so a [Schedule trigger](../../../05.workflow-components/07.triggers/01.schedule-trigger/index.md) can start its next execution.
6. Publishes the final state to the UI and to notifications.

If the flow's `outputs` can't be rendered, the execution ends `FAILED`, unless it was killed.

## Running the Executor

### Scaling

You can run several Executors side by side for availability or higher execution volume. With a JDBC backend, each execution is locked while an Executor processes it, so only one Executor works on a given execution at a time. See [high availability](../../../10.administrator-guide/high-availability/index.md#scaling-components) for deployment patterns.

Each Executor starts two thread pools, one for execution messages and one for task results. Set their size with `kestra.executor.thread-count`. The default, `0`, sizes each pool to the number of [allocated CPU cores](../../../configuration/02.runtime-and-storage/index.md#allocated-cpu-cores), with a minimum of 4.

### Liveness

Every Executor also coordinates [server liveness](../../../10.administrator-guide/server-lifecycle/index.md#the-liveness-mechanism) for the whole cluster. On each check, it marks servers that missed their heartbeats as disconnected, resubmits the tasks of Workers that stopped responding, reclaims tasks orphaned by Workers that left the cluster, and rebalances scheduling work across schedulers. How resubmission works is described in [worker job resubmission](../../../10.administrator-guide/server-lifecycle/index.md#worker-job-resubmission).

### Maintenance mode

:::alert{type="info"}
Maintenance mode is available in Enterprise Edition.
:::

[Maintenance mode](../../../07.enterprise/05.instance/maintenance-mode/index.md) pauses the Executor:

- Requests to create or restart executions are held, and running executions don't move to their next task.
- Retry, pause, and SLA timers wait.
- Liveness checks wait, so no tasks are resubmitted.

When you exit maintenance mode, the Executor resumes where it stopped. An Executor that starts while the instance is in maintenance mode starts paused.

### Configuration

| Property | Default | Purpose |
|---|---|---|
| `kestra.executor.thread-count` | `0` | Size of each Executor thread pool. `0` means the number of allocated CPU cores, with a minimum of 4. |
| `kestra.execution.depth.max-depth` | `100` | Maximum depth of a chain of subflows and Flow triggers. |
| `kestra.task.outputs.limit` | `-1` | Size above which task run outputs are stored in [internal storage](../../01.main-components/index.md#internal-storage) instead of the database. `-1` disables the limit. |
| `kestra.execution.outputs.limit` | `-1` | The same limit for flow outputs. |

### Monitoring and troubleshooting

The Executor publishes metrics under `kestra.executor.*`, including executions started and ended, executions queued by concurrency limits, SLA violations, kills, and worker tasks resubmitted. See the [Executor metrics](../../../10.administrator-guide/03.monitoring/index.md#executor) for the full list.

To trace Executor activity with OpenTelemetry, use the `io.kestra.executor.DefaultExecutor` category. See [OpenTelemetry](../../../10.administrator-guide/open-telemetry/index.md#supported-categories).

When a specific execution, flow, namespace, or tenant blocks the Executor, start it with the `--ignore-*` flags to skip that work while you investigate. See the [kill switch CLI flags](../../../07.enterprise/05.instance/kill-switch/index.md#cli-compatibility).
