---
title: "Kestra Deployment Architectures: Postgres, AMQP, and Kafka"
h1: Choose a Deployment Architecture for Kestra
description: Choose your Kestra deployment architecture. Compare standalone vs distributed deployments and Postgres, AMQP/Redis, and Kafka backends.
sidebarTitle: Deployment architecture
icon: /src/contents/docs/icons/architecture.svg
---

Choosing a Kestra deployment architecture involves two decisions: how server roles are deployed (standalone vs distributed), and which queue and repository backends they use.

**Open Source** deployments use a single JDBC database for queue, repository, and logs. **Enterprise** deployments can configure each independently, including AMQP, Redis, Kafka, and Elasticsearch.

## Standalone vs distributed

### Standalone

In standalone mode, all server roles — Executor, Scheduler, Worker Controller, Worker, Webserver, and Indexer — run as cooperating threads inside a single process. A single database is the only external dependency. Behavior is identical to a distributed cluster, so moving to distributed requires only deployment changes.

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

## Choosing a backend

The queue and repository are independent choices, so you can mix and match backends to match your latency, throughput, and operational requirements. The same executor, scheduler, and indexer run regardless of which backends you select.

### Postgres (recommended)

For most deployments, a single PostgreSQL or MySQL database acts as both the queue and the repository. This is the simplest architecture to operate and covers the majority of production use cases.

- **Dependencies**: PostgreSQL or MySQL
- Works in both standalone and distributed deployments
- High availability through standard Postgres HA patterns

### AMQP / Redis (Enterprise)

When queue latency matters, replace the database queue with an AMQP broker or Redis, while keeping PostgreSQL or MySQL as the repository.

- **Dependencies**: RabbitMQ (recommended) or Redis + PostgreSQL or MySQL
- Can reduce queue latency significantly compared to a database queue, depending on workload
- Does not raise the throughput ceiling; use Kafka if throughput is the bottleneck
- RabbitMQ is recommended over Redis for simpler operation and fewer edge cases

### Kafka (Enterprise)

For high throughput and full horizontal scaling, use Kafka as the queue backend. The Executor, Scheduler, Worker Controller, Webserver, and Indexer emit to and subscribe from named Kafka topics.

- **Dependencies**: Kafka + PostgreSQL, MySQL, or Elasticsearch as the repository
- PostgreSQL is the recommended repository, as execution state now lives in the repository rather than Kafka state stores
- Each server role scales independently, removing single points of failure
- Available only in the [Enterprise Edition](../../07.enterprise/01.overview/01.enterprise-edition/index.md)

#### Elasticsearch as repository

[Elasticsearch](https://www.elastic.co/elasticsearch) can replace PostgreSQL as the repository backend in Kafka deployments, providing fast search and aggregation of flows, executions, and logs for the API and UI. Because Elasticsearch uses asynchronous indexing, it trades insertion atomicity for analytical and search performance. Use it when query capabilities outweigh the consistency trade-off.

The Indexer subscribes to Kafka topics and writes to Elasticsearch, keeping the search index in sync. Executions continue processing even if Elasticsearch is temporarily unavailable.

## Comparison

| | Postgres | AMQP / Redis | Kafka |
|---|---|---|---|
| Latency | Baseline | Lower | Moderate |
| Throughput | Single-instance ceiling | Marginal gain | Highest |
| Operational complexity | Lowest | Low | Highest |
| Edition | OSS + Enterprise | Enterprise | Enterprise |
