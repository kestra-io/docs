---
title: Kestra Architecture – Server Components Explained
description: Explore Kestra server components. Learn about the Executor, Worker, Scheduler, Webserver, and Indexer roles in the orchestration engine.
sidebarTitle: Server components
icon: /src/contents/docs/icons/architecture.svg
---

Detailed breakdown of the server components behind Kestra.

Kestra consists of multiple server components that can be scaled independently.

## Understand Kestra server components

Each server component interacts with internal components ([Internal Storage](../data-components/index.md#internal-storage), [Queue](../01.main-components/index.md#queue), and [Repository](../01.main-components/index.md#repository)).

## Executor

The **Executor** is a lightweight server component responsible for processing all executions and orchestrating the next tasks to run. It does not perform heavy computations itself, instead deferring actual task execution to [Workers](#worker).

The Executor plays a central role in coordinating workflows based on the information it receives from the [Scheduler](#scheduler) and the [Queue](../01.main-components/index.md#queue). It handles specific types of tasks, such as:

- [Flowable Tasks](../../05.workflow-components/01.tasks/00.flowable-tasks/index.md)
- [Flow Triggers](../../05.workflow-components/07.triggers/02.flow-trigger/index.md)
- Templates *(deprecated)*
- Listeners *(deprecated)*

Although the Executor oversees all executions, it generally never interacts directly with your data.

Because of its low resource usage, the Executor rarely needs to be scaled. However, in deployments with a very large number of executions, you can scale Executors horizontally to meet demand.

## Worker

The **Worker** is a server component responsible for executing all [runnable tasks](../../05.workflow-components/01.tasks/01.runnable-tasks/index.md) and [Polling Triggers](../../05.workflow-components/07.triggers/04.polling-trigger/index.md). These are received from the [Executor](#executor) and the [Scheduler](#scheduler), respectively.

Workers are highly configurable and designed to handle a wide range of workloads — from simple API calls to heavy computational tasks. Internally, each Worker functions as a configurable thread pool, allowing you to define the number of threads per instance based on your workload requirements.

You can deploy multiple Worker instances across different servers to scale horizontally. This flexibility enables efficient handling of parallel executions, especially in high-throughput environments.

Because Workers directly execute tasks and triggers, they are the **only** server components that require access to external systems — such as databases, REST APIs, message brokers, and any other services your flows interact with.

:::alert{type="info"}
Looking for runtime status? The **Instance – Services** view shows live health for each component. See [Instance – services](../../07.enterprise/05.instance/index.mdx#services).
:::

## Worker Group (EE)

In the [Enterprise Edition](../../07.enterprise/01.overview/01.enterprise-edition/index.md), [Worker Groups](../../07.enterprise/04.scalability/worker-group/index.md) allow tasks and [Polling Triggers](../../05.workflow-components/07.triggers/04.polling-trigger/index.md) to be executed on specific worker sets. They can be beneficial in various scenarios, such as using compute instances with GPUs, executing tasks on a specific OS, restricting backend access, and region-specific execution. A default worker group is recommended per [tenant](../10.multi-tenancy/index.md) or namespace.

To specify a worker group for a task, use the `workerGroup.key` property in the task definition to point the task to a specific worker group key. If no worker group is specified, the task will be executed on the default worker group.

:::alert{type="info"}
Please note that Worker Groups are not yet available in Kestra Cloud, only in Kestra Enterprise Edition.
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
**Note:** By default, Kestra handles all date and time values using your system's timezone. You can override this behavior using [JVM options](../../configuration/index.md)
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
**Note:** As long as the [Queue](../01.main-components/index.md#queue) is operational, most server components — including the Webserver — will continue to function. While the Repository is essential for rendering the UI, workloads can still be processed even if the Repository is temporarily unavailable.
:::
