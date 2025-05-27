---
title: Architecture
---

Kestra's architecture is designed to be scalable, flexible, and fault-tolerant. Depending on your needs, you can choose between two different architectures: **JDBC** and **Kafka**.

## Architecture with JDBC backend

The following diagram shows the main components of Kestra using the JDBC backend.

![Kestra JDBC Architecture](/docs/architecture/jdbc.png "Kestra Architecture")

::alert{type="info"}
While it's not captured in the diagram above, the JDBC backend in the [Enterprise Edition](../06.enterprise/01.overview/01.enterprise-edition.md) also supports Microsoft SQL Server starting from Kestra 0.18.0.
::

Here are the components and their interactions:

1. **JDBC Backend**: the data storage layer used for orchestration metadata

2. **Server**: the central part of the system, composed of:
   - [**Webserver**](./08.webserver.md): serves both the [API](../api-reference/index.md) and the [User Interface](../08.ui/index.md)
   - [**Scheduler**](./06.scheduler.md): schedules [workflows](../04.workflow-components/01.flow.md) and handles all [triggers](../04.workflow-components/07.triggers/index.md) except for the flow triggers (see below)
   - [**Executor**](./04.executor.md): responsible for the orchestration logic including [flow triggers](../04.workflow-components/07.triggers/02.flow-trigger.md)
   - [**Worker**](./05.worker.md): one or multiple processes that carry out the heavy computation of [runnable tasks](../04.workflow-components/01.tasks/01.runnable-tasks.md) and [Polling Triggers](../04.workflow-components/07.triggers/04.polling-trigger.md). For privacy reasons, workers are the only components that interact with the user's infrastructure, including the [Internal Storage](./09.internal-storage.md) and external services.

3. **User**: interacts with the system via [UI](../08.ui/index.md) and [API](../api-reference/index.md)

4. **User's Infrastructure**: private infrastructure components that are part of the user's environment, which Kestra interacts with:
   - [**Internal Storage**](./09.internal-storage.md): object storage system within the user's infrastructure (e.g. AWS S3, Google Cloud Storage, or Azure Blob Storage)
   - **External Services**: third-party APIs or services outside of Kestra which Workers might interact with to process data within a given task

The arrows indicate the direction of communication. The JDBC Backend connects to the Server, which in turn interacts with the User's Infrastructure. The User interacts with the system through the API and UI.
(../api-reference/index.md)
For either database backend, the respective [PostgreSQL JDBC Driver](https://jdbc.postgresql.org/documentation/ssl/#configuring-the-client) and [Microsoft SQL Server JDBC Driver](https://learn.microsoft.com/en-us/sql/connect/jdbc/connecting-with-ssl-encryption?view=sql-server-ver16) can provide an encrypted connection with some configuration.

### Scalability with JDBC

The scalable design of the architecture allows you to run multiple instances of the [Webserver](./08.webserver.md), [Executor](./04.executor.md), [Worker](./05.worker.md), and [Scheduler](./06.scheduler.md) to handle increased load. As your workload increases, more instances of the required components can be added to the system to distribute the load and maintain performance.

The JDBC Backend can be scaled too, either through clustering or sharding, to handle larger volumes of data and a higher number of requests from the [Server components](./02.server-components.md). Most cloud providers offer managed database services that can be scaled up and down as needed.

---

## Architecture with Kafka and Elasticsearch backend

The following diagram shows the main components of Kestra using the [Kafka](https://kafka.apache.org/) and [Elasticsearch](https://www.elastic.co/elasticsearch) backend.

![Kestra OSS Architecture](/docs/architecture/kafka.png "Kestra Architecture")

::alert{type="info"}
Note that this architecture is only available in the [Enterprise Edition](../06.enterprise/01.overview/01.enterprise-edition.md) of Kestra.
::

This architecture is designed to provide the enhanced scalability, high availability, and fault tolerance required to meet the needs of large-scale enterprise deployments.

1. **Kafka**: serves as the messaging backend, which communicates between different components of the system and allows for robust scalability and fault tolerance

2. **Microservices**: This layer includes several services:
   - [**Webserver**](./08.webserver.md): serves the [API](../api-reference/index.md) and the [User Interface](../08.ui/index.md) for interaction with the system
   - [**Scheduler**](./06.scheduler.md): schedules [workflows](../04.workflow-components/01.flow.md) and processes all [triggers](../04.workflow-components/07.triggers/index.md) except for the flow triggers
   - [**Executor**](./04.executor.md): handles the orchestration logic, including [flow triggers](../04.workflow-components/07.triggers/02.flow-trigger.md)
   - [**Indexer**](./07.indexer.md): indexes data from Kafka to Elasticsearch for quick retrieval and search
   (optional component since [Kestra v0.20](../11.migration-guide/0.20.0/elasticsearch-indexer.md))
   - [**Worker**](./05.worker.md): runs [runnable tasks](../04.workflow-components/01.tasks/01.runnable-tasks.md) and interacts with the user's infrastructure

3. **User**: engages with the system through the Webserver's [UI](../08.ui/index.md) and [API](../api-reference/index.md)

4. **Elasticsearch**: acts as a search and UI backend, storing [logs](./data-components.md#logs), execution history, and enabling fast data retrieval

5. **User's Infrastructure**: private infrastructure components that are part of the user's environment, which Kestra interacts with:
   - [**Internal Storage**](./09.internal-storage.md): object storage system where user's data is stored (e.g. AWS S3, Google Cloud Storage, or Azure Blob Storage)
   - **External Services**: APIs or services that Workers might interact with during task processing

### Scalability with Kafka and Elasticsearch

Kafka's messaging backend allows handling large volumes of data with the ability to scale out as needed. You can run multiple (_horizontally scaled_) instances of services such as Workers, Schedulers, Webservers and Executors to ensure fault tolerance, distribute the load and maintain system performance as demand increases. 

Elasticsearch contributes to scalability by providing a robust, horizontally scalable UI backend that can efficiently search across large amounts of data.

---

## Comparison between JDBC and Kafka architectures

When comparing both diagrams, the main difference between the **JDBC** and an **Kafka** architectures is the data layer (_JDBC Database vs. Kafka and Elasticsearch_).

::alert{type="info"}
Note that it's possible to use the [Enterprise Edition](../06.enterprise/01.overview/01.enterprise-edition.md) with a JDBC database backend for smaller deployments. In fact, it's often easier to start with a JDBC backend and migrate to Kafka and Elasticsearch when your deployment grows.
::

The **Worker** is the only component communicating with your private data sources to extract and transform data. The Worker also interacts with [**Internal Storage**](./09.internal-storage.md) to persist intermediary results and store the final task run outputs.

All components of the **application layer** (including the Worker, Executor, and Scheduler) are decoupled and stateless, communicating with each other through the [**Queue**](./01.main-components.md#queue) (Kafka/JDBC). You can deploy and scale them independently.

The **Webserver** communicates with the (Elasticsearch/JDBC) [Repository](./01.main-components.md#repository) to serve data for Kestra UI and API.

The **data layer** is decoupled from the application layer and provides a separation between:
- storing your private data processing artifacts — **Internal Storage** is used to store outputs of your executions; you can think of Internal Storage as your own private AWS S3 bucket
- storing execution metadata — (Kafka/JDBC) [**Queue**](./01.main-components.md#queue) is used as the orchestration backend
- storing logs and user-facing data — the (Elasticsearch/JDBC) [**Repository**](./01.main-components.md#repository) is used to store data needed to serve Kestra UI and API.

The Indexer, available only in the [Enterprise Edition](../06.enterprise/01.overview/01.enterprise-edition.md), indexes content from Kafka topics (_such as the flows and executions topics_) to the Elasticsearch repositories. Thanks to the separation between Queue and Repository in the Kafka Architecture, even if your Elasticsearch instance experiences downtime, your executions will continue to work by relying on the Kafka backend.

## Components in detail

The following sections provide more details about the components of the architecture.

::ChildCard
::
