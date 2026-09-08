---
title: "Kestra Deployment Architectures: Postgres, AMQP, and Kafka"
h1: Choose a Deployment Architecture for Kestra
description: Choose your Kestra deployment architecture. Compare Postgres, AMQP/Redis, and Kafka backends for standalone, distributed, and high-availability deployments.
sidebarTitle: Deployment architecture
icon: /src/contents/docs/icons/architecture.svg
---

Kestra is a Java application distributed as an executable. It supports multiple deployment options:

- [Docker](../../02.installation/02.docker/index.md)
- [Kubernetes](../../02.installation/03.kubernetes/index.md)
- Manual deployment

The queue and repository are independent choices, so you can mix and match backends to match your latency, throughput, and operational requirements. The same executor, scheduler, and indexer run regardless of which backends you select.

**Open Source** deployments use a single JDBC database for queue, repository, and logs. **Enterprise** deployments can configure each independently, including AMQP, Redis, Kafka, and Elasticsearch.

## Postgres (recommended)

For most deployments, a single PostgreSQL or MySQL database acts as both the queue and the repository. This is the simplest architecture to operate and covers the majority of production use cases.

- **Dependencies**: PostgreSQL or MySQL
- Workers connect to the Worker Controller via gRPC and never access the database directly
- All server components can run as a single process (standalone) or as separate scaled processes
- High availability through standard Postgres HA patterns

For quick local experimentation, `server local` mode uses an embedded H2 database with no external dependencies.

:::alert{type="info"}
H2 is not recommended for distributed or production deployments.
:::

## AMQP / Redis (Enterprise)

When queue latency matters, replace the database queue with an AMQP broker or Redis, while keeping PostgreSQL or MySQL as the repository.

- **Dependencies**: RabbitMQ (recommended) or Redis + PostgreSQL or MySQL
- Can reduce queue latency significantly compared to a database queue, depending on workload
- Does not raise the throughput ceiling; use Kafka if throughput is the bottleneck
- RabbitMQ is recommended over Redis for simpler operation and fewer edge cases

## Kafka (Enterprise)

For high throughput and full horizontal scaling, use Kafka as the queue backend. The Executor, Scheduler, Worker Controller, Webserver, and Indexer emit to and subscribe from named Kafka topics.

- **Dependencies**: Kafka + PostgreSQL, MySQL, or Elasticsearch as the repository
- PostgreSQL is the recommended repository, as execution state now lives in the repository rather than Kafka state stores
- Removes single points of failure and enables independent scaling of all server components
- Available only in the [Enterprise Edition](../../07.enterprise/01.overview/01.enterprise-edition/index.md)

Workers do not subscribe to Kafka topics. They connect to the Worker Controller via gRPC, enabling cross-region and air-gapped deployments with outbound-only connectivity.

### Elasticsearch as repository

[Elasticsearch](https://www.elastic.co/elasticsearch) can replace PostgreSQL as the repository backend in Kafka deployments, providing fast search and aggregation of flows, executions, and logs for the API and UI. Because Elasticsearch uses asynchronous indexing, it trades insertion atomicity for analytical and search performance. Use it when query capabilities outweigh the consistency trade-off.

The Indexer subscribes to Kafka topics and writes to Elasticsearch, keeping the search index in sync. Executions continue processing even if Elasticsearch is temporarily unavailable.

## Choosing a backend

| | Postgres | AMQP / Redis | Kafka |
|---|---|---|---|
| Latency | Baseline | Lower | Moderate |
| Throughput | Single-instance ceiling | Marginal gain | Highest |
| Operational complexity | Lowest | Low | Highest |
| Edition | OSS + Enterprise | Enterprise | Enterprise |

## Distributed deployments

When server components run on separate hosts, use a shared [internal storage](../data-components/index.md#internal-storage) implementation such as [Google Cloud Storage](../../02.installation/09.gcp-vm/index.md), [AWS S3](../../02.installation/08.aws-ec2/index.md), or [Azure Blob Storage](../../02.installation/10.azure-vm/index.md).
