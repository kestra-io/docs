---
title: Performance Tuning
icon: TODO
---

Not all workloads are the same, so Kestra is configured to balance throughput (the ability to process a lot of executions in parallel) and latency (the ability to process executions quickly) without using too many resources.

On this page, we will introduce some performance tuning that may be done to improve the performance of the Kestra orchestrator, all of which come with tradeoffs, so be sure to understand them before applying them.

Before you read more, please be sure to understand the [Kestra architecture](../07.architecture).

## The Worker

The Worker is responsible for executing your tasks, so how to tune it depends on what you execute.

The most useful configuration is the number of Worker threads, which is 4 times the number of available cores by default.

You can increase it to increase parallelism task execution, depending on how you start Kestra, this would be:
- If using the standalone, set `--worker-thread` in the standalone command line.
- If using separate component processes, set `--thread` in the Worker command line.
- If using our Helm chart, set `deployments.worker.workerThreads` in the values.

## The JDBC backend

### The JDBC queue

The JDBC queue is the most performance-sensitive component of the JDBC backend.

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

How does it work? The JDBC queue polls a database table for new messages; this poll is made every 25ms by default and has a limit of 100 records.
This default setup allows good latency (25ms) and batch for reasonable throughput.
To avoid wasting resources when there are no messages, the queue will switch (progressively) to polling every 500ms if there is no message to process during 60 seconds.

You can configure:
- `minPollInterval`: Reducing it will reduce latency, but increase the load on the database.
- `maxPollInterval`: Reducing it will reduce latency when a workflow is executed on an idle instance, but it will increase the load on the database on an idle instance.
- `pollSwitchInterval`: Increasing it may avoid the queue from going to the idle state too aggressively, so when a new execution is triggered, it is processed more eagerly.
- `pollSize`: Reducing it may reduce latency, but also reduce throughput. Increasing it will do the opposite; it may increase latency, but it will also increase throughput.

## The JDBC Executor

The performance of the JDBC executor will be tightly coupled with the performance of the JDBC queue.

You can configure the number of threads used by the Executor with the following configuration:

```yaml
kestra:
  jdbc:
    executor:
      thread-count: 0
```

By default, it's 0, which means half the number of available CPUs. You may ask why half, which seems counterproductive?
It's because we start two thread pools, so overall we use all available CPUs by default.

## The Kafka backend

First, we set the Kafka partition count to 16 with a replication factor of 1 by default. As Kafka is not the primary storage, it's not mandatory to increase the replication factor, as everything can be re-created from Elasticsearch if needed. It's worth noting that as the partition count is 16, starting more than 16 instances of a Kestra component (16 Workers, 16 Executors, ...) would not provide any benefits. If you plan to do so, please increase the partition counts.

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

We see that the most impactful properties are `poll.ms` and `commit.interval.ms`; we reduce them by default from 100ms to 25ms. You can decrease them further at the cost of more resources used by the broker.

This is the default properties configuration:
```yaml
kestra:
  kafka:
    defaults:
      stream:
        properties:
          poll.ms: 25 # default 100
          commit.interval.ms: 25 # default 100
```

You can also set those properties on a topic basis.

