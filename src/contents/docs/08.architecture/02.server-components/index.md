---
title: Server Components in Kestra Architecture Explained
h1: Executor, Worker, Scheduler, Webserver, and Indexer Roles
description: Explore Kestra server components. Learn about the Executor, Worker, Scheduler, Webserver, and Indexer roles in the orchestration engine.
sidebarTitle: Server components
icon: /src/contents/docs/icons/architecture.svg
---

Kestra runs six server roles that can be deployed as a single process or as independent, separately scaled services. Every role communicates exclusively through the [Queue](../01.main-components/index.md#queue) and reads shared state from the [Repository](../01.main-components/index.md#repository). Workers are the only role that accesses [Internal Storage](../data-components/index.md#internal-storage) and user infrastructure directly.

## Executor

The **Executor** is a lightweight server component responsible for driving the execution state machine. Given a flow and an execution, it decides which task runs next, what state the execution is in, what to dispatch, what to retry, and when an execution terminates. It does not perform heavy computation itself — runnable tasks are dispatched to [Workers](#worker) via the [Worker Controller](#worker-controller).

The Executor subscribes to the queue and handles:

- [Flowable Tasks](../../05.workflow-components/01.tasks/00.flowable-tasks/index.md)
- [Flow Triggers](../../05.workflow-components/07.triggers/02.flow-trigger/index.md)
- Subflow and loop coordination
- Concurrency limits, retries, SLA monitoring, and kill signals

The Executor never interacts directly with user data or infrastructure.

Because of its low resource usage, the Executor rarely needs to be scaled. In deployments with very high execution volume, Executors can scale horizontally.

## Worker Controller

The **Worker Controller** is the sole communication point between the cluster and its workers. Workers never subscribe to the job queue or access the database directly — all job dispatch and result intake are funnelled through the Worker Controller.

Each worker opens a persistent bidirectional gRPC stream to a Worker Controller and uses that stream for its lifetime:

- The Worker Controller dispatches jobs from the queue onto the stream.
- Workers return results, logs, and metrics over the same stream.
- Kill signals and metadata changes are broadcast to all connected workers.

Multiple Worker Controller instances can run in parallel. Workers discover available controllers through static endpoint lists, DNS, or self-registration in internal storage.

gRPC transport is available in all editions. TLS, mTLS, and JWT-based worker authentication are Enterprise Edition features.

## Worker

The **Worker** is a server component responsible for executing all [runnable tasks](../../05.workflow-components/01.tasks/01.runnable-tasks/index.md) and [Polling Triggers](../../05.workflow-components/07.triggers/04.polling-trigger/index.md). Jobs are dispatched from the [Worker Controller](#worker-controller) over a gRPC stream.

Internally, each Worker runs as a configurable thread pool. Set the thread count per instance based on your workload — more threads for I/O-bound tasks, fewer for memory-intensive ones.

Deploy multiple Worker instances across different servers to scale horizontally. Each instance handles its assigned tasks independently, so adding workers increases throughput without coordination overhead.

Because Workers directly execute tasks and triggers, they are the **only** server components that require access to external systems — such as databases, REST APIs, message brokers, and any other services your flows interact with.

:::alert{type="info"}
Looking for runtime status? The **Instance – Services** view shows live health for each component. See [Instance – services](../../07.enterprise/05.instance/index.mdx#services).
:::

## Worker Group (EE)

In the [Enterprise Edition](../../07.enterprise/01.overview/01.enterprise-edition/index.md), [Worker Groups](../../07.enterprise/04.scalability/worker-group/index.md) allow tasks and [Polling Triggers](../../05.workflow-components/07.triggers/04.polling-trigger/index.md) to be executed on specific worker sets. They can be beneficial in various scenarios, such as using compute instances with GPUs, executing tasks on a specific OS, restricting backend access, and region-specific execution. A default worker group is recommended per [tenant](../10.multi-tenancy/index.md) or namespace.

To route a task to a specific Worker Group, add `workerSelector.tags` to the task definition with the tags matching the target Worker Queue. Tasks without a `workerSelector` run on the default Worker Group.

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

The **Indexer** is responsible for reading content from Kafka topics — such as flows and executions — and indexing it into Elasticsearch. This component enables [low-latency querying](../../11.migration-guide/v0.20.0/elasticsearch-indexer/index.md) when using Kafka and Elasticsearch together.

By default, the Indexer runs as part of the [Web Server](#webserver). However, you can choose to run the Web Server independently without the Indexer by using the `server webserver --no-indexer` CLI option.

The Indexer is required for deployments that rely on Kafka and Elasticsearch, particularly in **Kestra Enterprise Edition** and **Kestra Cloud**.

## Webserver

The **Webserver** is the entry point for all external communications with Kestra. It is responsible for serving both the [User Interface (UI)](../../09.ui/index.mdx) and the [REST API](../../api-reference/index.mdx).

It consists of two main modules:

- **API**: Exposes all [REST endpoints](../../api-reference/index.mdx) for interacting with Kestra — including triggering executions, retrieving flow data, managing tasks, and more.
- **UI**: Serves the [Kestra web interface](../../09.ui/index.mdx), enabling users to design, monitor, and manage workflows visually.

The Webserver primarily interacts with the [Repository](../01.main-components/index.md#repository) to serve content through the API and UI. It also connects to the [Queue](../01.main-components/index.md#queue) to submit new executions and stream real-time updates on flow progress.

:::alert{type="info"}
As long as the [Queue](../01.main-components/index.md#queue) is operational, most server components — including the Webserver — will continue to function. While the Repository is essential for rendering the UI, workloads can still be processed even if the Repository is temporarily unavailable.
:::
