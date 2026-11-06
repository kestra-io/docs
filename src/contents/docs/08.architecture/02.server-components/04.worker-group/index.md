---
title: "Worker Groups in Kestra: How Tasks Are Routed"
h1: How Kestra Worker Groups Route Tasks and Triggers at Runtime
description: Understand how Kestra routes tasks and triggers to worker groups. Learn how selectors, fallbacks, and capacity reservations behave at runtime.
sidebarTitle: Worker Group
icon: /src/contents/docs/icons/architecture.svg
editions: ["EE"]
---

Worker groups decide which Workers run which tasks and triggers.

A task or trigger declares the kind of Worker it needs with a `workerSelector`. Kestra matches that selector to a worker queue, and the worker groups subscribed to that queue supply the Workers that run it. To create queues, groups, and tokens, see [Worker Groups](../../../07.enterprise/04.scalability/worker-group/index.md).

## Building blocks

| Building block | What it is |
|---|---|
| **Worker queue** | A routing lane with an id and a set of tags, such as `gpu` or `eu`. A queue can be restricted to specific tenants. |
| **Worker group** | A pool of [Workers](../03.worker/index.md) that subscribes to one or more worker queues and holds capacity reservation settings. |
| **`workerSelector`** | The tags, match mode, and fallback that a task, trigger, or flow declares to target a queue. Namespaces and tenants declare a default selector. |
| **Default queue and group** | The `default` queue receives all work without a selector. The `default` group always subscribes to it. |
| **System queue** | The reserved `system` queue for system tasks, served by the [Executor's](../01.executor/index.md) embedded system Worker. |

The [Executor](../01.executor/index.md) resolves the queue for each task, and the [Scheduler](../05.scheduler/index.md) resolves it for each trigger that runs on a Worker. The [Worker Controller](../02.worker-controller/index.md) then delivers the job to a Worker subscribed to that queue.

## How a task or trigger is routed

Kestra looks for a selector at each level and stops at the first one that declares tags:

1. The task or trigger.
2. The flow.
3. The namespace, starting with the closest one and walking up its parent namespaces.
4. The tenant.

A selector with an empty `tags` list counts as no selector, so resolution continues to the next level. If no level declares tags, the work goes to the default queue.

System tasks, such as the purge tasks and log shippers, always go to the `system` queue. A `workerSelector` on a system task is ignored, and Kestra logs a warning.

To match a queue, Kestra lowercases the selector tags and compares them with each queue the tenant can use:

- `ALL` (the default): the queue's tags must include every selector tag.
- `ANY`: the queue's tags must include at least one selector tag.

When several queues match, Kestra prefers queues restricted to the current tenant, then the closest tag match. With `ANY`, it uses the best match that has a live Worker.

To set selectors on tasks and flows, see [using `workerSelector` in tasks](../../../07.enterprise/04.scalability/worker-group/index.md#using-workerselector-in-tasks). For namespace and tenant defaults, see [namespace and tenant-level routing defaults](../../../07.enterprise/04.scalability/worker-group/index.md#namespace-and-tenant-level-routing-defaults).

## When no Worker can take the work

Two different situations stop a task or trigger from reaching a Worker.

**No queue matches the selector.** This is a configuration error, and the `fallback` doesn't apply. A task run fails with the error `No worker queue matches required tags [...]`. A trigger evaluation is skipped, and the same message is logged with `ignoring the trigger`.

**A queue matches, but none of its Workers is live.** The selector's [`fallback`](../../../07.enterprise/04.scalability/worker-group/index.md#fallback-options) decides what happens:

| Fallback | Task | Trigger |
|---|---|---|
| `FAIL` (default) | The task run fails, and an error is logged. | The evaluation is skipped, and an error is logged. |
| `WAIT` | The task is sent to the queue as `SUBMITTED` and waits for a Worker. An info message is logged. | The evaluation is sent to the queue and waits for a Worker. |
| `CANCEL` | The task run is set to `CANCELLED`. | The evaluation is skipped, and a warning is logged. |
| `IGNORE` | The task runs on the default queue instead, with no log entry. | The evaluation runs on the default queue instead. |

A queue counts as live when at least one Worker in a subscribed group is in the `CREATED`, `RUNNING`, `DISCONNECTED`, or `TERMINATING` state. A Worker that briefly loses its connection doesn't trigger the fallback. The default and system queues always count as live.

Work that waits stays in the durable queue for its worker queue. When a Worker subscribed to that queue connects, the Worker Controller starts delivering the waiting work. If every subscribed Worker is busy, the Worker Controller holds the work back and resumes delivery when a Worker has free capacity.

## Capacity reservation

A worker group can reserve a share of each Worker's capacity for each queue it subscribes to. The Worker Controller enforces the reservation for every connected Worker. The slots that aren't reserved form a shared pool for all of that Worker's queues.

When a job arrives for a queue, the Worker Controller takes a slot in this order:

1. A slot reserved for that queue.
2. A slot from the shared pool.
3. An idle slot reserved for another queue whose subscription is in `ELASTIC` mode.

In `STRICT` mode, the default, reserved slots stay exclusive to their queue even when idle. In `ELASTIC` mode, other queues can borrow idle reserved slots. Borrowed slots aren't taken back while their jobs run, so an `ELASTIC` queue can temporarily run below its reservation.

To configure reservations, see [capacity reservation](../../../07.enterprise/04.scalability/worker-group/index.md#capacity-reservation) and [interaction modes](../../../07.enterprise/04.scalability/worker-group/index.md#interaction-modes).

## How Workers join a group

A Worker joins a group through its registration token, which identifies the group. Group membership requires worker authentication (`kestra.ee.worker.auth.enabled: true`):

- With authentication disabled, every Worker joins the `default` group. If other groups exist, the Worker Controller logs a warning, because no Worker can serve them.
- With authentication enabled, a Worker without a token is rejected.
- When a token is revoked or deleted, or its group is deleted, Workers using it are disconnected immediately and can't reconnect with it.
- A Worker that requests more threads than the license allows is rejected.

Changes to a group's subscriptions take effect immediately. The Worker Controller re-registers the group's connected Workers with the new subscriptions, without restarting them. Deleting a group that still has running Workers is refused unless you force it.

To set up authentication and tokens, see [worker authentication](../../../07.enterprise/04.scalability/worker-group/index.md#worker-authentication).

## The default group and queue

The `default` queue isn't stored or created. It receives all work that has no selector, and work routed there by the `IGNORE` fallback. The `default` group can't be deleted, and it always keeps its subscription to the `default` queue. Other groups can subscribe to the `default` queue too.

In the open-source edition, Kestra reads `workerSelector` but ignores it. All work runs on the default queue, and every Worker belongs to a single default group that shares one capacity pool.

## Running worker groups

### Monitoring

The Worker Controller publishes capacity metrics per group and per queue, including reserved and shared slots in use and jobs in flight. Workers publish their own capacity, such as threads, running jobs, and buffered jobs. See [controller metrics](../../../07.enterprise/04.scalability/worker-group/index.md#controller-metrics), [worker metrics](../../../07.enterprise/04.scalability/worker-group/index.md#worker-metrics), and the [Prometheus reference](../../../10.administrator-guide/prometheus-metrics/index.md#kestra-worker-controller-metrics).

### Troubleshooting

When you save a flow, Kestra warns about selectors that can't be routed:

- `No Worker Queue matches the tags [...] declared on task '...'.` (or on the flow or a trigger)
- `The task '...' cannot use the 'workerSelector' property as it's only relevant for runnable tasks.`

At runtime, these messages explain why a task or trigger didn't reach a Worker:

| Message | Meaning |
|---|---|
| `No worker queue matches required tags [...]` | No queue matches the selector. Create a queue with those tags or fix the selector. |
| `No workers are available for ..., waiting for one to be available.` | The `WAIT` fallback applied. Start a Worker in a group subscribed to the queue. |
| `No workers are available for ..., failing the task.` | The `FAIL` fallback applied to a task. |
| `No workers are available for ..., canceling the task.` | The `CANCEL` fallback applied to a task. |
| `No workers are available for ..., ignoring the trigger.` | The `FAIL` or `CANCEL` fallback applied to a trigger evaluation. |
| `Task ... is a SystemTask; ignoring workerSelector.tags=...` | A selector on a system task was ignored. |

If a Worker can't connect, its logs show why. `UNAUTHENTICATED` means authentication is enabled but the Worker has no token. `PERMISSION_DENIED` means its token was revoked or deleted, or its group was deleted. Issue a new token and restart the Worker with it.
