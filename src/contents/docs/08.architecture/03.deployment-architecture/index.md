---
title: "Kestra Deployment Architectures: Postgres, AMQP, and Kafka"
h1: Choose a Deployment Architecture for Kestra
description: Choose your Kestra deployment architecture. Compare standalone vs distributed deployments and Postgres, AMQP/Redis, and Kafka backends.
sidebarTitle: Deployment architecture
icon: /src/contents/docs/icons/architecture.svg
---

Choosing a Kestra deployment architecture involves two decisions: how server roles are deployed (standalone vs distributed), and which queue and repository backends they use.

The queue and repository are independent choices. **Open Source** deployments use a single JDBC database for both. **Enterprise** deployments can configure each independently, including AMQP, Redis, Kafka, and Elasticsearch.

## Standalone vs distributed

### Standalone

In standalone mode, all server roles (Executor, Scheduler, Worker Controller, Worker, Webserver, and Indexer) run inside a single process. A single database is the only external dependency. Behavior is identical to a distributed cluster, so moving to distributed requires only deployment changes.

Use standalone when:
- You are running a single-node deployment
- High availability is not required
- Operational simplicity is the priority

For local experimentation, `server local` mode uses an embedded H2 database with no external dependencies (not compatible with production or distributed architecture).

### Distributed

In distributed mode, each server role runs as its own process and scales independently. Workers connect to the Worker Controller over a single outbound gRPC stream and never access the queue or database directly. This enables workers to be deployed in another region, a different cloud, or a network that only allows outbound connections.

Use distributed when:
- You need to scale roles independently
- Workers must run in isolated or remote networks
- High availability is required

When components run on separate hosts, use a shared [internal storage](../data-components/index.md#internal-storage) implementation such as [Google Cloud Storage](../../02.installation/09.gcp-vm/index.md), [AWS S3](../../02.installation/08.aws-ec2/index.md), or [Azure Blob Storage](../../02.installation/10.azure-vm/index.md).

## Queue backend

The queue is the asynchronous message backbone between server roles. One backend satisfies the full set of queues for a deployment.

### Database

A PostgreSQL or MySQL database drives the queue by default. This is the simplest option and covers the majority of production use cases.

- **Dependencies**: PostgreSQL or MySQL
- Available in Open Source and Enterprise

### AMQP / Redis (Enterprise)

When queue latency matters, replace the database queue with an AMQP broker or Redis.

- **Dependencies**: RabbitMQ or Redis
- Can reduce queue latency significantly compared to a database queue, depending on workload
- Also raises the throughput ceiling; use Kafka for the highest throughput requirements
- RabbitMQ is recommended for simpler operation and fewer edge cases

### Kafka (Enterprise)

For high throughput and full horizontal scaling, use Kafka as the queue backend. The Executor, Scheduler, Worker Controller, Webserver, and Indexer emit to and subscribe from named Kafka topics.

- **Dependencies**: Kafka
- Each server role scales independently, removing single points of failure
- PostgreSQL is the recommended repository pairing, as execution state now lives in the repository rather than Kafka state stores
- Available only in the [Enterprise Edition](../../07.enterprise/01.overview/01.enterprise-edition/index.md)

## Repository backend

The repository persists all domain entities: flows, executions, logs, triggers, and metrics. One backend satisfies all repository contracts for a deployment.

### Database

A PostgreSQL or MySQL database is the default repository backend and works with any queue backend.

- **Dependencies**: PostgreSQL or MySQL
- Available in Open Source and Enterprise

In Enterprise Edition, execution logs can be routed to a dedicated [Log Data Store](../../10.administrator-guide/log-data-store/index.md), a separate backend from the main repository, supporting PostgreSQL, MySQL, H2, Elasticsearch, Splunk, and Datadog. This keeps the main database lean and reduces schema migration time.

### Elasticsearch (Enterprise)

Elasticsearch can serve as the repository backend in Kafka deployments, providing fast search and aggregation of flows, executions, and logs for the API and UI.

- **Dependencies**: Elasticsearch + Kafka queue
- Uses asynchronous indexing, trading insertion atomicity for analytical and search performance
- Suited for deployments where query capabilities outweigh consistency requirements
- The Indexer subscribes to Kafka topics and writes to Elasticsearch, keeping the index in sync
- Executions continue processing even if Elasticsearch is temporarily unavailable
- Available only in the [Enterprise Edition](../../07.enterprise/01.overview/01.enterprise-edition/index.md)

## Comparison

| | Database + Database | AMQP/Redis + Database | Kafka + Database | Kafka + Elasticsearch |
|---|---|---|---|---|
| Latency | Baseline | Lower | Moderate | Moderate |
| Throughput | Single-instance ceiling | Higher | Highest | Highest |
| Operational complexity | Lowest | Low | High | Highest |
| Edition | OSS + Enterprise | Enterprise | Enterprise | Enterprise |
