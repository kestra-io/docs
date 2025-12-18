---
title: Performance Tuning
icon: /docs/icons/admin.svg
---

Not all workloads are the same, so Kestra is configured to balance throughput (the ability to process a lot of executions in parallel) and latency (the ability to process executions quickly) without using too many resources.

This page introduces performance tuning options for the Kestra orchestrator. Each comes with trade-offs, so ensure you understand them before applying.

Before you read on, please familiarize yourself with the [Kestra architecture](../08.architecture).

## Worker

The [Worker](../08.architecture/02.server-components.md#worker) executes your tasks, and tuning it depends on the type of workloads you run.

The most useful configuration is the number of Worker threads, which is 8 times the number of available cores by default.

You can increase it to boost parallel task execution. Depending on how you start Kestra, use one of the following methods:

- If using the standalone, set `--worker-thread` in the standalone command line.
- If using separate component processes, set `--thread` in the Worker command line.
- If using our Helm chart, set `deployments.worker.workerThreads` in the values.

## JDBC backend

The JDBC backend is composed of main components such as the JDBC queue and JDBC executor.

### JDBC queue

The JDBC queue is the most performance-critical component of the JDBC backend.

It may be configured using the following configuration options:

```yaml
kestra:
  jdbc:
    queues:
      minPollInterval: 25ms
      maxPollInterval: 500ms
      pollSwitchInterval: 60s
      pollSize: 100
```

The JDBC queue polls a database table for new messages; this poll is made every 25 ms by default and has a limit of 100 records.
This default setup provides low latency (25 ms) and batching for reasonable throughput.
To avoid wasting resources when there are no messages, the queue will switch (progressively) to polling every 500 ms if no messages are processed for 60 seconds.

You can configure:
- `minPollInterval`: Lowering it reduces latency but increases database load.
- `maxPollInterval`: Lowering it reduces latency when a workflow is executed on an idle instance, but it will increase the load on the database on an idle instance.
- `pollSwitchInterval`: Increasing this value helps prevent the queue from entering an idle state too quickly, ensuring that new executions are picked up promptly when they arrive.
- `pollSize`: Lowering it may reduce latency, but also reduces throughput. Increasing it will do the opposite; it may increase latency, but it will also increase throughput.

## The JDBC executor

The performance of the JDBC executor will be tightly coupled with the performance of the JDBC queue.

You can configure the number of threads used by the Executor with the following configuration:

```yaml
kestra:
  jdbc:
    executor:
      thread-count: 0
```

By default, it's 0, which means the number of available CPUs. Two thread pools are started, effectively using 2 times the number of available CPUs by default.

## The Kafka backend

First, we set the Kafka partition count to 16 with a replication factor of 1 by default. Because Kafka is not the primary storage, increasing the replication factor is optional; all data can be re-created from Elasticsearch if needed. It's worth noting that as the partition count is 16, starting more than 16 instances of a Kestra component (16 Workers, 16 Executors, etc.) would not provide any benefits. If you plan to exceed this, increase the partition count.

This is the default topic configuration:

```yaml
kestra:
  kafka:
    defaults:
      topic:
        partitions: 16
        replication-factor: 1
```

You can configure any Kafka producer and consumer properties recommended in standard Kafka application tuning to improve performance.
They are configurable via `kestra.kafka.defaults.consumer.properties` and `kestra.kafka.defaults.producer.properties` for the standard consumer and producer properties, and `kestra.kafka.defaults.stream.properties` for Kafka Streams.

The most impactful properties are `poll.ms` and `commit.interval.ms`, which are reduced by default from 100 ms to 25 ms. You can decrease them further at the cost of more resources used by the broker.

This is the default properties configuration:

```yaml
kestra:
  kafka:
    defaults:
      stream:
        properties:
          poll.ms: 25 # Kafka default 100
          commit.interval.ms: 25 # Kafka default 100
```

You can also set those properties on a topic basis.

We also configure the number of threads used by Kafka Stream (`num.stream.threads`). In Kafka Stream default, it uses only one processing thread, we configure it by default to the number of available CPU cores for better resource utilization.
However, if you process a lot of big executions, this can incur an increase in memory usage, in this case you can lower it.
On the opposite, you can increase it for better resource utilization if you process a high number of small executions.

```yaml
kestra:
  kafka:
  executor:
    stream-threads: 2 # Default 0 which means the number of available CPU cores
```
