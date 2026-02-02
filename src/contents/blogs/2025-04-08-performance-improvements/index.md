---
title: "Optimizing Performance in Kestra in Version 0.22"
description: "Performance is a critical aspect of an orchestrator. Discover how Kestra 0.22 significantly enhances execution speed, reduces resource consumption, and improves overall system performance."
date: 2025-04-04T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: ./main.png
---

The engineering team focused on improving Kestra's performance in version 0.22. Here’s a clear overview of the optimizations we've made:

- Smarter output processing for better CPU and memory efficiency
- Parallelization of execution queues in the JDBC backend
- More efficient execution processing
- Reduced latency in the Kafka backend
- Improved database table cleaning for long-running systems

## Smarter Output Processing

The Kestra Executor merges task outputs so that subsequent tasks can access previous task outputs via our expression language. This operation clones the entire output map, incurring high CPU and memory costs.

With 0.22, we optimized this by only merging outputs for tasks that require it (e.g., ForEach tasks as they produce outputs from the same task identifier) among other enhancements.

Preliminary benchmark tests conducted on a flow with 2,100 task runs using a 3-level `ForEach` task showed both CPU and memory improvements:
- CPU usage for merging outputs dropped from **15.3%** to **11.8%**
- Memory allocation for merging dropped from **44%** to **38%**

For more details, you can have a look at these two pull requests:
- [PR #7612](https://github.com/kestra-io/kestra/pull/7612)
- [PR #7160](https://github.com/kestra-io/kestra/pull/7160)

## Parallelized JDBC Backend Queues

The Kestra Executor listens to multiple internal queues, including execution updates, task results, and killing events. Previously, when using a JDBC backend, each queue was processed by a single thread, creating a bottleneck.


Of all those queues, two are the most important and receive a lot of messages:
- **Execution updates** (triggers on every execution update)
- **Worker task results** (triggers when the Worker finishes a task execution)

In 0.22, we've enabled parallel processing for these two most critical queues. By default, both queues now use half of the available CPU cores for the Executor (minimum of 2 threads per queue).

This can be customized by the configuration property `kestra.jdbc.executor.thread-count`.

This change would not impact the performance of an executor when there is not a high number of concurrent executions and tasks; at low __throughput__ (number of executions or tasks processed per second), the execution __latency__ will not be improved. However, it will significantly improve the execution __latency__ at high __throughput__!

In a benchmark running 10,000 executions over 5 minutes (**33 executions/s** throughput):

- **Before**: Execution latency peaked at **9m 50s** (Takes into account the time to execute the last executions)
- **After**: Execution latency dropped to **100ms** (executions processed in real-time!)

Previously a single execution took 100ms, the Kestra Executor could not handle such a high load, and execution latency increased.
Executions are now processed at the same speed the benchmark injects them!

We plan to do more tests later to show how many executions can be processed in seconds with Kestra; keep posted!

For more details on the work to achieve these results, have a look at this pull request: [PR #7382](https://github.com/kestra-io/kestra/pull/7382).

## Optimized Execution Processing

When you start an execution from the UI, Kestra’s web interface updates in real time using a Server-Sent Event (SSE) socket. This socket connects to our API, which consumes the execution queue and filters all execution messages to send only those related to the current execution to the UI. Thus, each connection spawned a new consumer on the execution queue, adding unnecessary load.

In 0.22, we switched to a **shared consumer with a fan-out mechanism**, reducing queue backend (database or Kafka) stress when multiple users trigger executions simultaneously.

For more details, you can have a look at this pull request: [PR #6777](https://github.com/kestra-io/kestra/issues/6777).

### Improvements to Flowable Task Executions

When the Kestra Executor executes an execution, it can handle two types of tasks:
- **runnable tasks** that are sent to the Worker for processing.
- **flowable tasks** that are executed directly inside the Executor (e.g., loops, conditionals).

Previously, flowable task processing created a Worker Task Result (to mimic a task execution from the Worker) and sent it to the Worker Task Result queue so it would go inside the queue and be re-processed later by the Executor.

With Kestra 0.22, flowable tasks are no longer queued for later processing but handled immediately, eliminating unnecessary queue operations and reducing execution latency.

Further details in this pull request: [PR #7250](https://github.com/kestra-io/kestra/pull/7250).

## Reduced Kafka Backend Latency

During benchmarking, we discovered that our default Kafka configuration was designed for throughput, not latency. By default, Kafka is optimized to process messages in batch.

By fine-tuning our configuration (`poll.ms` and `commit.interval.ms` reduced from **100ms → 25ms**), we significantly improved execution speed.

In a benchmark (a flow with two tasks, one processing JSON), this configuration update significantly reduces latency:

- At **10 executions/s**, latency dropped from **1s → 200ms**
- At **100 executions/s**, latency dropped from **8s → 250ms**

## JDBC `queues` Table Cleaning

Last but not least, we reviewed how we clean the JDBC `queues` table.

The JDBC queues table stores internal queue messages. Previously, the [JDBC Cleaner](../../docs/configuration/index.md#jdbc-cleaner) only periodically cleaned the table. The default configuration was to clean the table each hour and keep 7 days of messages.

Our internal queue is a multiple producer / multiple consumer queue; this means that the JDBC cleaner cannot know if all consumers have read a message, as not all components read the same message. In our Kafka backend, we rely on the Kafka topic and consumer group, so it doesn't suffer from the same issue.

We received feedback from users processing a large number of executions per day that this `queues` table can grow big (tens or even hundreds of gigabytes) and sometimes induce a very high load on the database.

To mitigate this user issue, we decided to improve our `queues` table cleaning in two ways:
- **On-execution purge**: Purging all execution-related messages at the end of the execution, keeping only the last execution message so late consumers can still be updated on the execution terminal state.
- **Early cleanup of high-volume logs**: High cardinality messages such as logs, metrics, and audit logs (consumed by a single consumer) are now purged after 1 hour instead of 7 days.

With these two changes, the number of records in the `queues` table was reduced a staggering **95%** on contrived benchmarks!

For more details, you can have a look at these two pull requests:
- [PR #7286](https://github.com/kestra-io/kestra/pull/7286)
- [PR #7363](https://github.com/kestra-io/kestra/pull/7363)

## Sneak Peek of 0.22 vs. 0.21

We plan to discuss Kestra's performance further in a later blog post, but here is a performance comparison of 0.22 versus 0.21. What's important here is not the raw numbers but the difference between the two sets.

The benchmark scenario is a flow triggered by a Kafka Realtime Trigger that performs a JSON transformation for each message and returns the output in a second task.
We generate 1000 executions by publishing messages to a Kafka topic at 10, 25, 50, 75, and 100 messages per second, then check the execution latency by looking at the last execution of the scenario run.

:::collapse{title="Expand to see the Benchmark Flow"}
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
:::

### JDBC backend

| Throughput (exec/s) | Latency in 0.21 | Latency in 0.22 | Improvement |
|--------------------|---------------|-----------------|-------------|
| 10               | 400ms         | 150ms           | 62% faster  |
| 25               | 26s           | 200ms            | 99% faster  |
| 50               | 43s           | 5s              | 88% faster  |
| 75               | 49s           | 10s             | 80% faster  |
| 100              | 59s           | 12s             | 80% faster  |

**Key takeaways**:
- Performance has improved dramatically in 0.22, even when executions are not run concurrently (which is almost the case at 10 executions/s).
- Performance starts to degrade vastly around throughput of 50 executions/s.

### Kafka backend

| Throughput (exec/s) | Latency in 0.21 | Latency in 0.22 | Improvement |
|--------------------|---------------|---------------|-------------|
| 10               | 800ms         | 200ms         | 75% faster  |
| 25               | 800ms         | 225ms         | 72% faster  |
| 50               | 900ms         | 225ms         | 75% faster  |
| 75               | 1s            | 300ms         | 70% faster  |
| 100              | 1s            | 300ms         | 70% faster  |
| 150              | 1.2s          | 750ms         | 38% faster  |
| 200              | 2s            | 1.9s          | 5% faster   |

**Key takeaways**:
- In 0.21, our Kafka backend can sustain higher throughput than our JDBC backend, but on low throughput, latency is more than the JDBC backend.
- In 0.22, our Kafka backend achieves almost the same latency at low throughput as our JDBC backend. At up to 100 executions per second, latency didn't increase much, and in all cases, it stayed under the latency seen in 0.21.


## Conclusion

Version 0.22 brings major efficiency improvements, making Kestra faster and more scalable. As we continue to optimize performance, stay tuned for more updates on how far we can push Kestra’s execution capabilities in upcoming versions.

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
