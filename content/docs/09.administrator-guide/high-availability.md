---
title: High Availability
icon: /docs/icons/admin.svg
editions: ["EE"]
---

Kestra is designed to be highly available and fault-tolerant. This section describes how to configure Kestra for high availability.

## Overview

First, let's define what we mean by high availability.

Highly available systems are designed to guarantee continuous operation, even in the event of a failure. This is achieved by eliminating single points of failure and ensuring that there are redundant systems and components.

In Kestra, high availability is achieved by running multiple instances of all components, such as the `webserver` hosting the API, the `scheduler`, the `executor`, the `indexer` and the `workers`. This ensures that if one instance fails, the system can continue to operate without interruption.

::alert{type="info"}
Note that you need to deploy Kestra using the [Kafka and Elasticsearch architecture](../07.architecture/index.md#architecture-with-kafka-and-elasticsearch-backend). This architecture is designed to be highly available and fault-tolerant.
::

## Scaling the components

The following components can be scaled horizontally (e.g. by allocating more replicas in your [Helm chart values](https://github.com/kestra-io/helm-charts/blob/master/charts/kestra/values.yaml#L42-L45)):

- Webserver
- Scheduler
- Executor
- Worker
- Indexer

Additionally, the Elasticsearch and Kafka clusters can be scaled out as needed to handle large volumes of data.

Finally, the internal storage (such as e.g. S3) is highly available and fault-tolerant by design.

::alert{type="info"}
Ensure that the host system is configured for high availability and fault-tolerance. For instance, you can adjust the Linux kernel `net.ipv4.tcp_retries2` parameter to reduce [TCP retransmission times](https://access.redhat.com/solutions/726753).
::

## Load balancing

To ensure high availability, you should use a load balancer to distribute incoming requests across multiple instances of the webserver. This ensures that if one instance fails, the system can continue to operate without interruption.
