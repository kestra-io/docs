---
title: "High Availability in Kestra: Scale Workers and Webservers"
h1: Design and configure a fault-tolerant highly available cluster
sidebarTitle: High Availability
icon: /src/contents/docs/icons/admin.svg
editions: ["OSS", "EE", "Cloud"]
description: Design and configure Kestra for High Availability (HA) to ensure fault tolerance and continuous operation in production.
---

High availability in Kestra is achieved by running each server role as its own independently scaled process in a distributed deployment. If one instance fails, the cluster continues operating: other instances pick up the work and the liveness model releases any orphaned jobs back onto the queue.

High availability does not require a specific queue backend. Any distributed deployment (database queue, AMQP/Redis, or Kafka) is eligible. The choice of backend affects throughput and latency, not fault tolerance. See [Deployment Architecture](../../08.architecture/03.deployment-architecture/index.md) for guidance on choosing a backend.

## Distributed deployment

In a distributed deployment, each server role runs as its own process and scales independently:

- **Executor**: owns the execution state machine; decides which task runs next and joins results
- **Scheduler**: watches schedules and event triggers, emits executions onto the queue
- **Worker Controller**: brokers worker availability, routes jobs to worker pools via gRPC
- **Worker**: runs task code in an isolated working directory; scales horizontally
- **Webserver**: the only network-facing surface; hosts the REST API and UI
- **Indexer**: records execution data (except the execution itself) that is sent asynchronously (logs, metrics, statistics, ...)

Workers connect to the Worker Controller over a single outbound gRPC stream. They never access the queue or the database directly. This means workers can run in an isolated network, a different region, or behind a firewall that allows only outbound connections, and still participate in the cluster.

To run each role as a dedicated process, launch it with the corresponding server command:

```bash
kestra server executor
kestra server scheduler
kestra server controller
kestra server worker
kestra server webserver
kestra server indexer
```

## Scaling components

Scale each role independently by increasing the number of replicas in your Helm chart. See the [Kubernetes deployment guide](../../02.installation/03.kubernetes/index.md) for a full setup walkthrough and the [chart values reference](https://github.com/kestra-io/kestra/blob/develop/charts/kestra/values.yaml) for all available options.

Workers are the primary horizontal scaling target. Add replicas to increase task throughput. The Worker Controller routes jobs across all connected workers automatically.

The Executor and Scheduler are coordinating roles; two or three replicas provide redundancy. Both are idempotent: if one fails, queue messages are redelivered and picked up by a healthy instance automatically.

Run at least two Webserver replicas behind a load balancer so the API and UI remain available if one instance fails.

:::alert{type="info"}
Ensure the underlying host system is tuned for high availability. For example, adjusting the Linux kernel parameter `net.ipv4.tcp_retries2` can reduce [TCP retransmission times](https://access.redhat.com/solutions/726753).
:::

## Liveness and fault tolerance

Every running server registers itself with the cluster and emits a heartbeat on a fixed interval (default: every 3 seconds). The Executor reviews all registered instances on a scheduled tick (default: every 10 seconds). See [Server lifecycle](../server-lifecycle/index.md) for the full state machine and recovery behavior.

When a Worker misses its heartbeats beyond the configured timeout (default: 1 minute), the Executor marks it as failed and releases its in-flight jobs back onto the queue for a healthy Worker to pick up. For other server roles (Executor, Scheduler, Webserver), recovery works differently: these components are idempotent, so queue messages are redelivered and reprocessed by a healthy instance without explicit orphan recovery.

To tune the liveness model:

```yaml
kestra:
  server:
    liveness:
      enabled: true
      interval: 10s
      timeout: 1m
      heartbeat-interval: 3s
```

## Shared internal storage

In a distributed deployment, all server roles must have access to the same internal storage backend. Local filesystem storage is not suitable. Use a shared object store instead:

- [Google Cloud Storage](../../02.installation/09.gcp-vm/index.md)
- [AWS S3](../../02.installation/08.aws-ec2/index.md)
- [Azure Blob Storage](../../02.installation/10.azure-vm/index.md)

Without shared storage, task outputs written by a Worker on one host are not reachable by the Executor or Webserver on another.

For a full list of supported backends (including Cloudflare R2, Huawei OBS, Ceph, MinIO, and others), see [Internal Storage](../../08.architecture/data-components/index.md).

## Load balancing

Deploy a load balancer in front of multiple Webserver replicas. The Webserver is the only network-facing role; the Executor, Scheduler, Worker Controller, and Workers are never reachable from outside the cluster.

Configure your load balancer's health checks against the Webserver's [`/health` endpoint](../03.monitoring/index.md#kestra-endpoints).

## Queue backend and scale

All queue backends support high availability in a distributed deployment. Choose based on throughput and latency requirements:

- **Database** (PostgreSQL or MySQL): simplest option; covers most production use cases. Deploy PostgreSQL in HA mode (PGPool or a managed cloud service) so the database itself does not become a single point of failure.
- **AMQP / Redis**: lower queue latency than a database queue; also raises the throughput ceiling
- **Kafka**: highest throughput; each server role scales independently

For Kafka deployments, PostgreSQL is the recommended repository pairing. Elasticsearch can serve as the repository for the highest search and aggregation throughput.

See [Deployment Architecture](../../08.architecture/03.deployment-architecture/index.md) for a full comparison.
