---
title: Server Components Liveness
icon: /docs/icons/admin.svg
---

Kestra is separated into several components that can be deployed independently or inside a single process (a standalone deployment).

We refer to these components as **server components** or just **servers**.

See the [server components](../08.architecture/02.server-components.md) and [deployment](../08.architecture/03.deployment-architecture.md) sections for more information.

Kestra has a built-in liveness mechanism. Each server will send a periodical heartbeat stored inside the database, and other servers will check if the server is still alive.

When a server is not alive, Kestra runs maintenance routines such as [worker job resubmission](#worker-job-resubmission).

## The liveness mechanism

When a server starts, it will send a heartbeat to the database with a `RUNNING` status.
When it stops, it first transitions to `TERMINATING`. If the server has pending tasks, it waits up to the configured `kestra.server.terminationGracePeriod` for them to finish. If it completes within that window, it sends a `TERMINATED_GRACEFULLY` heartbeat; otherwise the process is terminated with status `TERMINATED_FORCED`.

Other servers detect missing heartbeats and run maintenance tasks:
- Workers resubmit pending jobs to another worker before transitioning to `NOT_RUNNING`.
- Other server types transition to `NOT_RUNNING` immediately.

By default, liveness checks run every 10 seconds.

`NOT_RUNNING` servers will be transitioned to `INACTIVE` at the next liveness check.

If a server does not send a heartbeat within `kestra.server.liveness.timeout`, it is marked `DISCONNECTED` and then `NOT_RUNNING` at the next check. If that server is still alive, it self-terminates after detecting that other components classified it as `NOT_RUNNING`, preventing “resurrection.”

For configuration details, see the [server configuration](../configuration/index.md#server-liveness--heartbeats).

## Worker job resubmission

The Worker has a special behavior that allows it to resubmit jobs that were not completed due to a server termination or any kind of failures.

**Worker jobs** are tasks or triggers currently executing on a worker.

When the Executor sends a task to a worker, it creates an entry in the worker job store. Workers remove the entry once they complete the task. The same logic applies to triggers evaluated by the Scheduler.

The liveness mechanism resubmits pending jobs from a terminating worker to another worker, ensuring each job runs at least once.

Configure this behavior via `kestra.server.workerTaskRestartStrategy`:
- `AFTER_TERMINATION_GRACE_PERIOD` (default): wait another grace period before resubmitting jobs, preventing a terminated worker from returning.
- `IMMEDIATELY`: resubmit jobs right away.
- `NEVER`: never resubmit jobs (tasks remain incomplete and flows stay `RUNNING`).

Resubmitted task runs show multiple attempts in the UI.

![resubmitted task run](/docs/server/taskrun-resubmitted-attempts.png)

In the timeline, one of the states will be `RESUBMITTED`.

![resubmitted task run states](/docs/server/taskrun-resubmitted-states.png)

## Instance view (EE only)

Kestra Enterprise exposes an instance dashboard (**Administration → Instance**) that summarizes heartbeats, liveness status, and maintenance activity across clusters. See the [instance dashboard documentation](../07.enterprise/05.instance/dashboard.md) for a walkthrough.
