---
title: High Availability
icon: /docs/icons/admin.svg
editions: ["EE"]
---

Kestra is designed for high availability and fault tolerance. This page explains how to configure your deployment to ensure continuous operation.

## Overview

First, let's define what we mean by high availability.

Highly available systems are built to keep running even in the event of component or infrastructure failures. This is achieved by eliminating single points of failure and introducing redundancy across critical services.

In Kestra, high availability is achieved by running multiple instances of each core component — including the `webserver` (API), `scheduler`, `executor`, `indexer`, and `workers`. This ensures that if one instance fails, the system can continue to operate without interruption.

:::alert{type="info"}
Note that you need to deploy Kestra using the [Kafka and Elasticsearch architecture](../08.architecture/index.md#architecture-with-kafka-and-elasticsearch-backend). This architecture is designed to be highly available and fault-tolerant.
:::

## Scaling the components

The following components can be scaled horizontally by increasing the number of replicas in your [Helm chart values](https://github.com/kestra-io/helm-charts/blob/57e23342bdc430b16326ad04d55e23d796e71721/charts/kestra/values.yaml#L29):

- Webserver
- Scheduler
- Executor
- Worker
- Indexer

Additionally, the Elasticsearch and Kafka clusters can be scaled out as needed to handle large volumes of data.

Finally, the internal storage (such as e.g. S3) is highly available and fault-tolerant by design.

:::alert{type="info"}
Ensure that the underlying host system is also tuned for high availability and fault tolerance. For example, adjusting the Linux kernel parameter `net.ipv4.tcp_retries2` can reduce [TCP retransmission times](https://access.redhat.com/solutions/726753).
:::

## Load balancing

To guarantee high availability, deploy a load balancer to distribute incoming requests across multiple `webserver` instances. This prevents downtime if any single instance fails, allowing the system to continue operating seamlessly.
