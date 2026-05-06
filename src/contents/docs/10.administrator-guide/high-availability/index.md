---
title: "High Availability in Kestra: Scale Workers and Webservers"
h1: Design and configure a fault-tolerant highly available cluster
sidebarTitle: High Availability
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
description: Design and configure Kestra for High Availability (HA) to ensure fault tolerance and continuous operation in production.
---

Kestra is designed for high availability and fault tolerance. This page explains how to configure your deployment to ensure continuous operation.

Highly available systems are built to keep running even in the event of component or infrastructure failures. This is achieved by eliminating single points of failure and introducing redundancy across critical services.

In Kestra, high availability is achieved by running multiple instances of each core component — including the `webserver` (API), `scheduler`, `executor`, `indexer`, and `workers`. This ensures that if one instance fails, the system can continue to operate without interruption.

:::alert{type="info"}
This architecture requires a [Kafka and Elasticsearch deployment](../../08.architecture/index.mdx#architecture-with-kafka-and-elasticsearch-backend), which is designed to be highly available and fault-tolerant.
:::

## Scaling the components

The following components can be scaled horizontally by increasing the number of replicas in your [Helm chart values](https://github.com/kestra-io/kestra/blob/develop/charts/kestra/values.yaml):

- Webserver
- Scheduler
- Executor
- Worker
- Indexer

Additionally, the Elasticsearch and Kafka clusters can be scaled out as needed to handle large volumes of data.

Finally, internal storage (such as S3) is highly available and fault-tolerant by design.

:::alert{type="info"}
Ensure that the underlying host system is also tuned for high availability and fault tolerance. For example, adjusting the Linux kernel parameter `net.ipv4.tcp_retries2` can reduce [TCP retransmission times](https://access.redhat.com/solutions/726753).
:::

## Load balancing

To guarantee high availability, deploy a load balancer to distribute incoming requests across multiple `webserver` instances. This prevents downtime if any single instance fails, allowing the system to continue operating without interruption.
