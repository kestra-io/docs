---
title: Server Components Liveness
icon: /docs/icons/admin.svg
---

Kestra is separated into several components which can be deployed independently or inside a single process (what we call a standalone deployment).

We refer to these components as **server components** or just **servers**.

See the [server components](../07.architecture/02.server-components.md) and [deployment](../07.architecture/03.deployment-architecture.md) sections for more information.

Kestra has a built-in liveness mechanism. Each server will send a periodical heartbeat stored inside the database, and other servers will check if the server is still alive.

When a server is not alive, some maintenance tasks will be executed, including [worker job resubmission](#worker-job-resubmission).

## The liveness mechanism

When a server starts, it will send a heartbeat to the database with a `RUNNING` status.
When it stops, it will first transition to `TERMINATING` then if the server has pending tasks to execute, it will wait up to the configured `kestra.server.terminationGracePeriod` for pending tasks to complete.
If the server completes before the termination grace period, it will send a `TERMINATED_GRACEFULLY` heartbeat.
It the termination grace period is reached, the server will be terminated immediately with a status `TERMINATED_FORCED`.

After some time, the other servers will detect that the server is not alive and will execute maintenance tasks:
- If the server is a Worker, it will resubmit all its pending jobs to another Worker then set its status to `NOT_RUNNING`.
- Other servers will directly be transitioned to `NOT_RUNNING`

By default, liveness checks will be done each 10s

`NOT_RUNNING` servers will be transitioned to `INACTIVE` at the next liveness check.

If a server didn't send any heartbeat during the configured `kestra.server.liveness.timeout` period, it will be considered as dead and will be transitioned to `DISCONNECTED`.
At the next liveness check, it will be considered as `NOT_RUNNING`.
If a server detected as `DISCONNECTED` is still alive, it will itself detect that other servers transitioned it to `NOT_RUNNING` and will stop itself, ensuring no server can __resurrect__.

For configuration details, see the [server configuration](../configuration/index.md#server-liveness--heartbeats).

## Worker Job resubmission

The Worker has a special behavior that allows it to resubmit jobs that were not completed due to a server termination or any kind of failures.

What we call a **worker job** is a task or a trigger that was being executed by a Worker.

When the Executor sends a task to a Worker, it will first store the task in a dedicated worker job running storage.
When a Worker completes a task, it will remove the job from the storage.
The same happens when a Scheduler sends a trigger to a Worker for evaluation.

The liveness mechanism will detect that a terminating worker has pending jobs and will resubmit them to another Worker.
Ensuring that the job will be executed at least once.

This behavior is configurable via the `kestra.server.workerTaskRestartStrategy` configuration:
- `AFTER_TERMINATION_GRACE_PERIOD` (default): resubmit jobs after the termination grace period. The lifecycle mechanism will wait another grace period after a worker has been detected as terminated before resubmitting jobs, ensuring a worker would never __resurrect__ from a terminated state.
- `IMMEDIATELY`: resubmit jobs immediately.
- `NEVER`: never resubmit jobs. Warning: this will prevent the task to complete, so the flow will be running forever.

From the UI, you can see that a resubmitted task run will have two attempts.

![resubmitted task run](/public/docs/server/taskrun-resubmitted-attempts.png)

And when looking at its different states, you will see that it has been `RESUBMITTED`.

![resubmitted task run states](/public/docs/server/taskrun-resubmitted-states.png)

## Instance view (EE only)

TODO add a small description and a screenshot of the SUPERADMIN EE only Administation -> Instance page.