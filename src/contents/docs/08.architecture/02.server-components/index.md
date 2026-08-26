---
title: Server Components in Kestra Architecture Explained
h1: Executor, Worker, Scheduler, Webserver, and Indexer Roles
description: Explore Kestra server components. Learn about the Executor, Worker, Scheduler, Webserver, and Indexer roles in the orchestration engine.
sidebarTitle: Server components
icon: /src/contents/docs/icons/architecture.svg
---

Kestra runs six server roles that can be deployed as a single process or as independent, separately scaled services. Every role communicates exclusively through the [Queue](../01.main-components/index.md#queue) and reads shared state from the [Repository](../01.main-components/index.md#repository). Workers are the only role that accesses [Internal Storage](../data-components/index.md#internal-storage) and user infrastructure directly.

The Webserver is the only role reachable from outside the cluster. The orchestration roles — Executor, Worker Controller, Scheduler, Indexer, and Workers — cannot be reached from the network; they only produce and consume queue messages. All external actors reach the platform through the Webserver's authenticated API.

## Executor

The **Executor** is a lightweight server component responsible for driving the execution state machine. Given a flow and an execution, it decides which task runs next, what state the execution is in, what to dispatch, what to retry, and when an execution terminates. It does not perform heavy computation itself — runnable tasks are dispatched to [Workers](#worker) via the [Worker Controller](#worker-controller).

The Executor subscribes to the queue and handles:

- [Flowable Tasks](../../05.workflow-components/01.tasks/00.flowable-tasks/index.md)
- [Flow Triggers](../../05.workflow-components/07.triggers/02.flow-trigger/index.md)
- Subflow and loop coordination
- Concurrency limits, retries, SLA monitoring, and kill signals

Before dispatching a task, the Executor consults a worker-queue resolver that returns one of four decisions: `DISPATCH` (send immediately), `WAIT_AND_DISPATCH` (enqueue for a worker not yet connected), `FAIL` (fail the task run), or `CANCEL` (cancel it). The resolver — not the Executor — performs the worker availability check.

A one-second delay loop re-injects executions when their scheduled wakeup arrives, driving task retries, paused-flow resumption, and `LoopUntil` iterations.

The Executor also runs the cluster-wide **service liveness coordinator**: it periodically reviews every registered service instance — workers, schedulers, and peer executors — drives state transitions on missed heartbeats, and releases orphaned worker jobs back to the queue for reprocessing. See [Cluster liveness model](#cluster-liveness-model).

The Executor never interacts directly with user data or infrastructure. Because of its low resource usage, it rarely needs to be scaled. In deployments with very high execution volume, Executors can scale horizontally.

## Worker Controller

The **Worker Controller** is the sole communication point between the cluster and its workers. Workers never subscribe to the job queue or access the database directly — all job dispatch and result intake are funnelled through the Worker Controller.

Each worker opens a persistent bidirectional gRPC stream to a Worker Controller and uses that stream for its lifetime:

- The Worker Controller dispatches jobs from the queue onto the stream.
- Workers return results, logs, and metrics over the same stream.
- Kill signals and metadata changes are broadcast to all connected workers.

Dispatch is partitioned by **Worker Queue** — a stable identifier derived from the tag set a task or trigger declares through its worker selector. Two queues are always reserved: the **default queue** carries untagged work; the **system queue** carries platform-internal tasks and is served exclusively by the [system worker](#worker). A worker connects under a **worker group** that maps it to one or more Worker Queue subscriptions. Each subscription carries a reserved-capacity percentage so a busy queue cannot starve one to which the group has committed capacity. In the open-source build, there is a single implicit default group subscribed only to the default queue; in Enterprise Edition, groups are persisted entities with their own authorization tokens.

Before dispatching a job, the Worker Controller writes it to a durable **running state store**. If the controller crashes after persisting but before the worker receives the job, the Executor recovers and re-dispatches from that store. The capacity slot reserved for a dispatched job is held for its entire lifetime — not just until delivery — so the permit count accurately reflects in-flight load.

Multiple Worker Controller instances can run in parallel. Workers discover available controllers through static endpoint lists, DNS, or self-registration in internal storage. The controller periodically recycles long-lived streams so that newly deployed controller instances pick up traffic without requiring worker restarts.

gRPC transport is available in all editions. TLS and mTLS secure the connection in all editions; JWT-based worker authentication is an Enterprise Edition feature.

## Worker

The **Worker** is the server component responsible for executing all [runnable tasks](../../05.workflow-components/01.tasks/01.runnable-tasks/index.md) and [Polling Triggers](../../05.workflow-components/07.triggers/04.polling-trigger/index.md). Workers are the only roles that load user plugins, access user infrastructure, and consume CPU on user code.

Workers come in two shapes:

- **Worker agent** — a dedicated process that connects to a Worker Controller over gRPC. This is the standard deployment unit.
- **System worker** — an in-process variant embedded in the Executor (or the standalone server). It serves the reserved system queue for platform-internal tasks and starts automatically; it does not require separate deployment.

Internally, each worker agent runs as a configurable thread pool. Between the gRPC stream fetcher and the thread pool sits a bounded in-memory **buffer queue**. When the buffer fills, the worker stops pulling new jobs from the stream, letting the distributed queue's lag metric reflect a saturated worker rather than silently overloading it. Set the thread count based on your workload — more threads for I/O-bound tasks, fewer for memory-intensive ones.

A task can declare a **worker selector**: a set of tags, a match strategy (`all` tags must match, or `any`), and a fallback policy for when no matching worker is available (`fail`, `wait`, `cancel`, or fall back to the default queue). The Worker Controller routes the task to the Worker Queue whose tags match the selector.

Workers optionally support a **task output cache**: task outputs are stored in internal storage keyed by a hash of the task definition and its inputs. On a cache hit, the worker emits the cached outputs without running the task.

Worker shutdown is two-phase: the worker stops fetching new jobs and waits up to the configured grace period for in-flight jobs to finish, then drains the outbound result senders before exiting.

Deploy multiple worker agent instances to scale horizontally. Each handles its assigned tasks independently, so adding workers increases throughput without coordination overhead.

:::alert{type="info"}
Looking for runtime status? The **Instance – Services** view shows live health for each component. See [Instance – services](../../07.enterprise/05.instance/index.mdx#services).
:::

## Worker Group (EE)

In the [Enterprise Edition](../../07.enterprise/01.overview/01.enterprise-edition/index.md), [Worker Groups](../../07.enterprise/04.scalability/worker-group/index.md) are persisted entities that define which Worker Queues a connected worker serves and how much of its capacity each queue is guaranteed. Each subscription in a group pairs a Worker Queue with a reserved-capacity percentage and a reservation mode — **strict** (reserved slots are exclusive to that queue) or **elastic** (reserved slots can be borrowed by other subscriptions when idle).

Worker Groups enable scenarios such as GPU workloads, OS-specific execution, infrastructure access restrictions, and region-based routing. Every worker agent connects under a group; the group determines its Worker Queue subscriptions and carries its own authorization tokens.

To route a task to a specific queue, set `workerSelector.tags` on the task definition with the tags matching the target Worker Queue. Tasks without a `workerSelector` run on the default queue.

:::alert{type="info"}
Worker Groups are available in Kestra Enterprise Edition only, not in Kestra Cloud.
:::

## Scheduler

The **Scheduler** is a server component responsible for managing all [triggers](../../05.workflow-components/07.triggers/index.mdx) — except for [Flow Triggers](../../05.workflow-components/07.triggers/02.flow-trigger/index.md), which are handled by the [Executor](#executor).

The Scheduler continuously evaluates trigger conditions and determines when a flow should start. When a trigger is satisfied, the Scheduler submits the flow to the Executor for execution.

For [Polling Triggers](../../05.workflow-components/07.triggers/04.polling-trigger/index.md), the Scheduler checks them at their configured evaluation interval. If the polling conditions are met, it sends the execution — along with trigger metadata — to the [Worker](#worker) for execution.

Polling Triggers have specific constraints:
- They cannot be evaluated concurrently.
- They cannot be reevaluated while a previous execution from the same trigger is still running.

Internally, the Scheduler checks every second to determine whether any trigger needs evaluation.

:::alert{type="info"}
By default, Kestra handles all date and time values using your system's timezone. You can override this behavior using [JVM options](../../configuration/02.runtime-and-storage/index.md)
:::

## Indexer

The **Indexer** reads content from the queue — flows, executions, logs, metrics, and audit logs — and writes it to the repository backend. It is required in all deployments.

By default, the Indexer runs embedded in the [Webserver](#webserver). You can disable it there with the `server webserver --no-indexer` CLI option and run it as a standalone process — useful when the Webserver and Indexer need access to different infrastructure, or when you want to isolate the Webserver behind a bastion host.

## Webserver

The **Webserver** is the entry point for all external communications with Kestra. It is responsible for serving both the [User Interface (UI)](../../09.ui/index.mdx) and the [REST API](../../api-reference/index.mdx).

It consists of two main modules:

- **API**: Exposes all [REST endpoints](../../api-reference/index.mdx) for interacting with Kestra — including triggering executions, retrieving flow data, managing tasks, and more.
- **UI**: Serves the [Kestra web interface](../../09.ui/index.mdx), enabling users to design, monitor, and manage workflows visually.

The Webserver primarily interacts with the [Repository](../01.main-components/index.md#repository) to serve content through the API and UI. It also connects to the [Queue](../01.main-components/index.md#queue) to submit new executions and stream real-time updates on flow progress.

:::alert{type="info"}
As long as the [Queue](../01.main-components/index.md#queue) is operational, most server components — including the Webserver — will continue to function. While the Repository is essential for rendering the UI, workloads can still be processed even if the Repository is temporarily unavailable.
:::

## Cluster liveness model

Every running server registers itself as a service and sends heartbeats at a fixed interval. The Executor runs the cluster-wide liveness coordinator: on a scheduled tick it reviews every registered service instance, drives state transitions when heartbeats are missed (`running → disconnected → not-running`), and releases any work orphaned by a vanished server — such as a worker's in-flight jobs — back onto the queue so a healthy server picks it up.

The same model coordinates **maintenance mode**: on maintenance entry, every server pauses its queue subscribers while in-flight work drains, then resumes when maintenance exits. Old service rows are purged on a schedule to keep the registry bounded.
