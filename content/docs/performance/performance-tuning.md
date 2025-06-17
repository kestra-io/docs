---
title: Performance Tuning
icon: TODO
---

Not all workloads are the same, so Kestra is configured to balance throughput (the ability to process a lot of executions in parallel) and latency (the ability to process executions quickly) without using too much resource.

On this page, we will introduce some performance tuning that may be done to improve the performance of the Kestra orchestrator, all comes with tradeoff so be sure to understand them before applying them.

Before reading further, be sure to understand the [Kestra architecture](../07.architecture).

## The Worker

The Worker is responsible for executing your tasks, so the way to tune it is dependent on what you execute.

The most useful configuration is the number of Worker threads, this is by default 4 times the number of available cores.

You can increase it to increase parallelism task execution, depending on how you start Kestra, this would be:
- If using the standalone: setting `--worker-thread` in the standalone command line.
- If using separate component processes: setting `--thread` in the Worker command line.
- If using our Helm chart, setting `deployments.worker.workerThreads` in the values.

## The JDBC backend

### The JDBC queue

The JDBC queue is the most performant-sensitive component of the JDBC backend.

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

How does it works? The JDBC queue will poll a database table for new messages; this poll is made each 25ms by default, with a limit of 100 records.
This default setup allows good latency (25ms) and batch for good throughput.
To avoid wasting resources when there are no messages, the queue will switch (progressively) to polling each 500ms if there is no message to process during 60s.

You can configure:
- `minPollInterval`: reducing it will reduce latency, but increase the load on the database.
- `maxPollInterval`: reducing it will reduce latency when a workflow is executed on an idle instance, but increase the load on the database on an idle instance.
- `pollSwitchInterval`: increasing it may avoid the queue to go to the idle state too aggressively so when a new execution is triggered it is processed more eagerly.
- `pollSize`: reducing it may reduce latency, but also reduce throughput. Increasing it will do the opposite, it may increase latency but increase throughput as well.

## The JDBC Executor

The performance of the JDBC executor will be tightly coupled with the performance of the JDBC queue.

You can configure the number of threads used the Executor with the following configuration:

```yaml
kestra:
  jdbc:
    executor:
      thread-count: 0
```

By default, it's 0, which means half-time the number of available CPUs. You may ask why half-time which seems counterproductive?
It's because we start two thread pools, so overall we use all available CPUs by default.

## The Kafka backend

First, we set by default the Kafka partition counts to 16 with a replication factor of 1. As Kafka is not the primary storage, it's not mandatory to increase the replication factor as everything can be re-created from Elasticsearch if needed. It's worth notting that as the partition counts is 16, starting more than 16 instances of a Kestra component (16 Workers, 16 Executors, ...) would not provide any benefits. If you plan to do so, please increase the partition counts.

This is the default topic configuration:
```yaml
kestra:
  kafka:
    defaults:
      topic:
        partitions: 16
        replication-factor: 1
```

To improve performance, you can configure any Kafka producer and consumer properties recommanded in standard Kafka application tuning.
They are configurable via `kestra.kafka.defaults.consumer.properties` and `kestra.kafka.defaults.producer.properties` for the standard consumer and producer properties, and `kestra.kafka.defaults.stream.properties` for Kafka Stream.

What we see is that the most impactful properties are `poll.ms` and `commit.interval.ms`, we do reduce them by default from 100ms to 25ms, you can decrease them further in the cost of more resources used in the broker.

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

