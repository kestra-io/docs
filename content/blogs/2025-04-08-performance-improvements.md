---
title: "How Kestra engineers optimized orchestrator performance in 0.22"
description: "Performance is a critical aspect of an orchestrator. Discover how Kestra 0.22 significantly enhances execution speed, reduces resource consumption, and improves overall system performance."
date: 2025-04-08T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: /blogs/optimized-performance.png
---

Kestra's engineering team is continuously improving orchestrator performance to make it more resource efficient. In versions 0.22, they addressed inefficiencies in output processing, JDBC backend parallelization, execution processing improvements, Kafka backend latency configuration, and database cleaning. Below is an overview of these recent enhancements.

## Output processing improvements

The Kestra Executor merges all tasks run outputs before executing a new task so the new task can access previous task outputs via our expression language.

For that, it merges the map of all outputs in a method that clones the map, which is a costly operation.

We made multiple enhancements in this area; the most prominent one was to only merge outputs on the same task identifier (so only for outputs of ForEach tasks) as they are the ones that really need to be merged.

Preliminary tests based on a flow with 2100 taskruns using 3-levels `ForEach` task shows both CPU and memory improvements:
- merging outputs lowers from 15.3% of CPU profiling samples down to 11.8%
- merging outputs lowers from 44% of memory allocation profiling samples down to 38%

For more details, you can have a look at these two pull requests:
- https://github.com/kestra-io/kestra/pull/7612
- https://github.com/kestra-io/kestra/pull/7160

## JDBC backend parallelization

The Kestra Executor listens to multiple messages in our internal queue to orchestrate your flows: execution update, worker task result, subflow execution result, killing events, ...

When using our JDBC backend, each queue was consumed using a single thread.

Of all those queues, two are the most important and receive a lot of messages:
- Execution update queue: one message each time an execution is updated
- Worker task result queue: one message each time the Worker finished a task execution

We decided to consume both of them with multiple threads, by default, half the available CPU count with a minimum of 2.
As we do it for both queues, this means we use by default the number of available CPUs for the Executor.

This can be customized by the configuration property `kestra.jdbc.executor.thread-count`.

This change would not change the performance of an executor when there is not a high number of concurrent executions and tasks, at low __throughput__ (number of executions or tasks processed by seconds), the execution __latency__ will not be improved.
But it will greatly improve the execution __latency__ at hight __throughput__!

Before this change, on a benchmark that starts 10k executions in 5 minutes (throughput of 33 executions/s), execution latency goes up to 9mn50s. This has been measured by taking into account the time taken to execute the last executions.
As a single execution took 100ms, it means the Kestra Executor was not capable of handling such high load and execution latency increased.

After the change, execution latency goes down to 100ms! It means that executions are now processed at the same speed the benchmark injects them!

We plan to do more tests later to show how many executions can be processed by seconds with Kestra, keep posted!

For more details, you can have a look at this pull request: https://github.com/kestra-io/kestra/pull/7382

## Execution processing improvements

When you start an execution from the UI, you will see the execution processing in realtime from the UI.

To do so, we use a Server-Set-Event socket that connects to our API, which consumes the execution queue and filters all execution messages to only send the ones related to the current execution to the UI.

This was creating a new consumer for each socket.

We switch to a one consumer for all sockets with a fan out mechanism to send all execution messages to the correct SSE socket.
This should lower the load on the queue backend (database or Kafka) in case a lot of users are creating executions concurrently.

For more details, you can have a look at this pull request: https://github.com/kestra-io/kestra/issues/6777

When the Kestra Executor executes an execution, it can handle two types of tasks: runnable tasks that are sent to the Worker for processing, and flowable tasks that are executed directly inside the Executor (those are workflow logic like loops, conditional processing, ...).

Previously, flowable tasks processing creates a Worker Task Result (to mimic a task execution from the Worker) and send them to the Worker Task Result queue so it would go inside the queue and be re-processed later by the Executor. We avoid this roundtrip inside our internal queue and process them immediately, avoiding an unnecessary load on our internal queue and improving flowable tasks latency.

For more details, you can have a look at this pull request: https://github.com/kestra-io/kestra/pull/7250

## Kafka backend latency configuration

During some benchmarking, we discover that our default Kafka configuration was designed for throughout and not latency. Kafka, by default, is optimized to process messages in batch.

After testing multiple different configurations, we decided to reduce both `poll.ms` and `commit.interval.ms` from 100ms to 25ms.

On our benchmark (a flow with two tasks, one doing JSON processing), this reduces latency:
- At 10 execution/s, latency is reduced from 1s to 200ms per execution
- At 100 execution/s, latency is reduced from 8s to 250ms

## JDBC `queues` table cleaning

Last but not least, we review the way we clean the JDBC `queues` table.

This table is central in our JDBC backend, it contains all our internal queue messages.

It was previously only cleaned periodically via the [JDBC Cleaner](/docs/configuration#jdbc-cleaner). The default configuration was to clean the table each hour, and to keep 7 days of messages.

Our internal queue is a multiple producer / multiple consumer queue; this means that the JDBC cleaner has no way to know if a message has been read by all consumers as not all components read the same message. In our Kafka backend, we rely on Kafka topic and consumer group so it didn't suffer from the same issue.

We had feedback from users processing a lot of executions per day that this `queues` table can grow big (in tens or even hundreds of gibabytes) and sometimes induce a very high load on the database.

We decided to improve our `queues` table cleaning in two ways:
- Purging all execution related messages at the end of the execution, keeping only the last execution message so late consumers can still be updated with the execution terminal state.
- Purging earlier than the default of 7 days messages that are known to be of high cardinality (logs, metrics and audit logs) but are only consumed by a single consumer, so we are sure that if it has been processed, we can clean them. They are now cleaned after 1 hour instead of 7 days.

With these two changes, on contrived benchmarks, the number of records of the `queues` table was reduced to 95%!

For more details, you can have a look at these two pull requests:
- https://github.com/kestra-io/kestra/pull/7286
- https://github.com/kestra-io/kestra/pull/7363

## Sneak peak of 0.22 versus 0.21

We plan to go deeper into the performance of Kestra in a later blog post, but here is a performance comparison of 0.22 versus 0.21. What's important here are not the raw numbers but the difference between the two sets.

The benchmark scenario is a flow triggered by a Kafka Realtime Trigger that, for each message, do a JSON transformation and return the output in a second task.
We will generate 1000 executions by publishing messages to a Kafka topic at 10, 25, 50,75 and 100 messages per second, then check the latency of the execution by looking at the last execution of the scenario run.

```yaml
id: realtime-kafka-json
namespace: company.team

triggers:
  - id: kafka-logs
    type: io.kestra.plugin.kafka.RealtimeTrigger
    topic: test_kestra
    properties:
      bootstrap.servers: localhost:9092
    groupId: myGroup

tasks:
  - id: transform
    type: io.kestra.plugin.transform.jsonata.TransformValue
    from:  "{{trigger.value}}"
    expression: |
      {
        "order_id": order_id,
        "customer_name": first_name & ' ' & last_name,
        "address": address.city & ', ' & address.country,
        "total_price": $sum(items.(quantity * price_per_unit))
      }
  - id: hello
    type: io.kestra.plugin.core.output.OutputValues
    values:
      log: "{{outputs.transform.value}}"
```

TODO hide the flow by default

### JDBC backend

| JDBC 0.21 - throughput  | JDBC 0.21 - latency | JDBC 0.22 - throughput | JDBC 0.22 - latency |
|-------------------------|---------------------|------------------------|---------------------|
| 10 exec/s               | 400ms               | 10 exec/s              | 150ms               |
| 25 exec/s               | 26s                 | 25 exec/s              | 2.6s                |
| 50 exec/s               | 43s                 | 50 exec/s              | 15s                 |
| 75 exec/s               | 49s                 | 75 exec/s              | 22s                 |
| 100 exec/s              | 59s                 | 100 exec/s             | 25s                 |

**Key takeaways**:
- Performance has been greatly improved in 0.22, even when executions are not run concurrently (which is almost the case at 10 executions/s).
- At high throughput performance starts to degrade vastly around 50 executions/s.

### Kafka backend

| Kafka 0.21 - throughput | Kafka 0.21 - latency | Kafka 0.22 - throughput | Kafka 0.22 - latency |
|-------------------------|----------------------|-------------------------|----------------------|
| 10 exec/s               | 800ms                | 10 exec/s               | 200ms                |
| 25 exec/s               | 800ms                | 25 exec/s               | 225ms                |
| 50 exec/s               | 900ms                | 50 exec/s               | 225ms                |
| 75 exec/s               | 1s                   | 75 exec/s               | 300ms                |
| 100 exec/s              | 1s                   | 100 exec/s              | 300ms                |
| 150 exec/s              | 1.2s                 | 150 exec/s              | 750ms                |
| 200 exec/s              | 2s                   | 200 exec/s              | 1.9s                 |

**Key takeaways**:
- In 0.21, our Kafka backend is capable of sustaining higher throughput than our JDBC backend, but on low throughput, latency is more than the JDBC backend.
- In 0.22, our Kafka backend achieves almost the same latency at low throughput than our JDBC backend. At up to 100 executions per second, latency didn't increase much, and in all cases it stayed under the latency achieved in 0.21.


## Conclusion

TODO final words
