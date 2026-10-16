---
title: "Worker in Kestra: How Tasks and Triggers Run"
h1: How the Kestra Worker Runs Tasks and Triggers
description: Understand how the Kestra Worker runs tasks and triggers. Learn how it receives jobs, reports results, shuts down safely, and scales in production.
sidebarTitle: Worker
icon: /src/contents/docs/icons/architecture.svg
---

The Worker is the server component that runs your tasks and triggers.

It receives jobs from the [Worker Controller](../02.worker-controller/index.md), runs them, and sends the results, logs, and metrics back. Workers run your code, so they are the component you scale to add execution capacity. Each section below links to the page that documents how to configure the feature.

## What the Worker runs

A Worker runs three kinds of jobs:

- **[Runnable tasks](../../../05.workflow-components/01.tasks/index.mdx#runnable-tasks)**, such as scripts, queries, and API calls. [Flowable tasks](../../../05.workflow-components/01.tasks/index.mdx#flowable-tasks) never reach a Worker; the [Executor](../01.executor/index.md) runs them.
- **[Polling triggers](../../../05.workflow-components/07.triggers/04.polling-trigger/index.md)**, which check an external system on an interval.
- **[Realtime triggers](../../../05.workflow-components/07.triggers/05.realtime-trigger/index.md)**, which hold a connection open and react to events as they arrive.

The Worker decides nothing about what runs next. The Executor dispatches runnable tasks and the [Scheduler](../05.scheduler/index.md) dispatches trigger evaluations, both through the Worker Controller. A Worker never connects to the queue or the database for its work.

Kestra has two kinds of Workers:

- **Dedicated Workers**, started with `kestra server worker` (or as part of `kestra server standalone`). They run all user tasks and triggers.
- **The system Worker**, embedded in every Executor and standalone process. It serves a reserved queue that system tasks, such as the purge tasks, always use.

## How a Worker gets work

A Worker opens one long-lived gRPC connection to a Worker Controller and tells it how much work it can accept. The controller sends jobs only up to that capacity. If the connection drops, the Worker reconnects automatically, waiting between 500 ms and 30 seconds between attempts.

A Worker's capacity has two parts:

- **Threads.** Each thread runs one job at a time. The default is eight times the number of available processors, set with `-t, --thread`.
- **Job buffer.** Jobs the Worker has already received and holds while all its threads are busy. It defaults to the thread count, which is also its maximum. Set it with `kestra.worker.job-buffer-size`.

A smaller job buffer leaves more of the backlog with the Worker Controller, where a newly started Worker can pick it up instead of the work waiting on a saturated one. A buffer of `0` means the Worker only asks for a job when a thread is idle. A smaller buffer also lowers dispatch throughput for short tasks.

:::alert{type="info"}
In Enterprise Edition, a Worker joins a [Worker Group](../04.worker-group/index.md) through its registration token, and the Worker Controller sends it only jobs routed to that group's queues.
:::

## Running tasks

### Timeouts

A task's [`timeout`](../../../05.workflow-components/13.timeout/index.md) property bounds how long it can run. When the timeout ends, the Worker stops the task and the attempt fails.

Polling-trigger evaluations have their own bound, `kestra.worker.polling-trigger-timeout` (default `10m`). When an evaluation exceeds it, the Worker reports an error so the trigger is released and can be evaluated again. The plugin's code keeps its thread until it returns, so the Worker runs one thread short until then. The `worker.abandoned.count` metric shows how many threads are held this way. Realtime triggers are exempt, since they run for as long as the trigger is active.

### Kills

When an execution is killed, the Worker stops the matching tasks it is running. It remembers killed executions for 24 hours, so a task from a killed execution that arrives later is marked `KILLED` instead of running. Updating, disabling, or deleting a flow also stops its running realtime triggers.

### Working directory and cache

Each task runs in its own temporary working directory, which the Worker deletes when the task ends. Tasks inside a [`WorkingDirectory`](../../../16.scripts/working-directory/index.md) task share one directory instead. The location of these directories is set by the [task temporary directory](../../../configuration/04.plugins-and-execution/index.md#execution-behavior) configuration.

When a task uses [`taskCache`](../../../06.concepts/12.caching/index.md#cache-task-outputs-with-taskcache), the Worker checks for cached outputs before running it and skips the run on a hit.

### Results, logs, and metrics

The Worker sends task results, logs, and metrics to the Worker Controller as they are produced. Results are kept and resent if the controller is temporarily unreachable. Logs and metrics are best-effort: if the controller can't receive them, they can be dropped instead of slowing the Worker down.

A task with `logToFile: true` writes its logs to a file that is uploaded to internal storage when the task ends, instead of streaming them.

## Data access

By default, a Worker reads KV entries and namespace files directly from [internal storage](../../01.main-components/index.md#internal-storage). To keep storage credentials off Workers, set `kestra.kv.worker-access` and `kestra.namespace-files.worker-access` to `CONTROLLER` on dedicated Workers. Workers then read through the Worker Controller. The default for both is `STORAGE`.

:::alert{type="info"}
In Enterprise Edition, `kestra.secret.worker-access` controls how Workers reach the [secrets manager](../../../07.enterprise/02.governance/secrets-manager/index.md): `DIRECT` (the default) or through the Worker Controller with `CONTROLLER` or `CONTROLLER_ONLY`.
:::

## Task runners

A [task runner](../../../task-runners/01.overview/index.md) changes where a script task's code runs, for example in a Docker container or a cloud batch service, but the Worker still runs the task itself: it starts the runner, follows it, and reports the result. See [task runners vs. worker groups](../../../task-runners/03.task-runners-vs-worker-groups/index.md#key-differences) to choose between the two.

## Liveness and shutdown

A Worker sends its heartbeats to the Worker Controller. The [Executor](../01.executor/index.md) uses them to detect a Worker that stopped responding, as described in [server liveness](../../../10.administrator-guide/server-lifecycle/index.md#the-liveness-mechanism).

When a Worker stops gracefully, it:

1. Stops accepting new jobs.
2. Waits up to `kestra.server.termination-grace-period` (default `5m`) for running jobs to finish.
3. Stops any jobs still running.
4. Sends its remaining results to the Worker Controller, for up to 30 seconds.

If any result couldn't be delivered, the Worker reports `TERMINATED_FORCED` instead of `TERMINATED_GRACEFULLY`.

Tasks stopped at shutdown don't report a result, so the Executor resubmits them to another Worker, according to the Worker's `kestra.server.worker-task-restart-strategy`. With `NEVER`, those tasks aren't resubmitted. See [liveness and worker task restarts](../../../configuration/05.security-and-secrets/index.md#liveness-and-worker-task-restarts) for the options.

## Maintenance mode

:::alert{type="info"}
Maintenance mode is available in Enterprise Edition.
:::

In [maintenance mode](../../../07.enterprise/05.instance/maintenance-mode/index.md), a Worker stops accepting new jobs, lets running tasks finish, and stops its running realtime triggers so they can be started again after maintenance. A Worker that starts while the instance is in maintenance mode starts paused.

## Running the Worker

### Scaling

Add Workers to increase how many tasks run at once. Workers connect to the Worker Controller over gRPC (port `50051` by default), so they can run anywhere that can reach it, including other networks and regions. See [performance tuning](../../../performance/performance-tuning/index.md#worker) for sizing guidance.

The default thread count depends on the processors available to the JVM. `kestra.allocated-cpu-cores` doesn't change it.

### Configuration

| Property | Default | Purpose |
|---|---|---|
| `-t, --thread` (CLI) | 8 × available processors | Threads, each running one job at a time. For `kestra server standalone`, use `--worker-thread`; `0` starts no Worker. |
| `kestra.worker.job-buffer-size` | Thread count | Jobs held while all threads are busy. |
| `kestra.worker.polling-trigger-timeout` | `10m` | Maximum time for one polling-trigger evaluation. |
| `kestra.kv.worker-access` | `STORAGE` | Read KV entries from storage or through the Worker Controller (`CONTROLLER`). |
| `kestra.namespace-files.worker-access` | `STORAGE` | Read namespace files from storage or through the Worker Controller (`CONTROLLER`). |
| `kestra.server.termination-grace-period` | `5m` | How long a stopping Worker waits for running jobs. |
| `kestra.server.worker-task-restart-strategy` | `AFTER_TERMINATION_GRACE_PERIOD` | What happens to a stopped Worker's tasks. |

### Monitoring and troubleshooting

Workers publish metrics under `kestra.worker.*`, tagged with `worker_group`:

- **Capacity:** `worker.job.thread`, `worker.max.concurrency` (threads plus job buffer), `worker.running.count`, and `worker.pending.count`. When `worker.running.count` stays equal to `worker.job.thread`, the Worker is saturated.
- **Stuck work:** `worker.abandoned.count` and `worker.timeout.count`.
- **Triggers:** `worker.trigger.*` counters and timers.

See the [Worker metrics](../../../10.administrator-guide/03.monitoring/index.md#worker) for the full list.

Each Worker also serves a `/worker` endpoint on the management port (`8081`) that lists the jobs it is running. The endpoint is sensitive, so it requires authentication.
