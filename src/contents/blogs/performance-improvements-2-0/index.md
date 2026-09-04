---
title: "Performance Upgrades in Kestra 2.0"
description: "TODO"
date: 2026-09-09T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  linkedin: https://www.linkedin.com/in/lo%C3%AFc-mathieu-475b144/
  image: lmathieu
  role: Lead Developer
image: ./main.jpg
---

It's been a long time since I didn't talk to you about Kestra performance improvements; this is because I was very busy re-architecting kestra for 2.0. Read the blog post if you want to know more. TODO link to the 2.0 architecture

Kestra 2.0 brings so many performance improvements that I don't really know how to introduce them, so the first thing is to compare it against 1.3, I'll then dig into the details of some interesting improvements for those always curious about how we achieve the level of performance our orchestrator meets.

:::alert{type="info"}
We now switch to from `e2-standard-4` to `n2-standard-4` VMs for our [reference benchmarks](../../docs/performance/benchmark).
:::

## Kestra 1.3 vs. 2.0 -- Benchmark 1 -- simple flow

**Description**
Triggered by a Webhook. Contains two tasks:
1. Outputs a variable.
2. Logs that variable.

### Kestra 1.3

| step | rate | avg ms | p99 ms | kestra cpu | infra cpu |
|--:|--:|--:|--:|--:|--:|
| 1 | 1000 | 158 | 239 | 23.8% | 36.4% |
| 2 | 1500 | 171 | 377 | 32.5% | 44.7% |
| 3 | 2000 | 244 | 694 | 38.5% | 57.7% |
| 4 | 2500 | 3526 | 7624 | 42.9% | 64% |
| 5 | 3000 | 20718 | 37166 | 49.2% | 68.8% |
| 6 | 3500 | 23662 | 59735 | 46.7% | 66.2% |
| 7 | 4000 | 27490 | 58624 | 45.6% | 68% |
| 8 | 4500 | 28065 | 59210 | 24.8% | 57.4% |
| 9 | 5000 | 32219 | 59701 | 13.6% | 47.9% |

### Kestra 2.0

| step | rate | avg ms | p99 ms | kestra cpu | infra cpu |
|--:|--:|--:|--:|--:|--:|
| 1 | 1000 | 126 | 174 | 22.3% | 30.6% |
| 2 | 1500 | 121 | 169 | 26.2% | 38.7% |
| 3 | 2000 | 113 | 159 | 34.7% | 42.1% |
| 4 | 2500 | 118 | 171 | 37.1% | 51.2% |
| 5 | 3000 | 130 | 205 | 45.9% | 56.8% |
| 6 | 3500 | 148 | 297 | 48% | 58.1% |
| 7 | 4000 | 181 | 474 | 51.2%| 68.9% |
| 8 | 4500 | 1113 | 2079 | 57.9% | 68.8% |
| 9 | 5000 | 53540 | 145112 | 33.1% | 58% |

### 1.3 vs. 2.0

In 1.3, Kestra supports up to 2000 exec/min, 4000 task/min, with a latency under 1s.
Executions launched individually execute two tasks in around 150ms.

In 2.0, Kestra supports up to 4000 exec/min, 8000 task/min, with a latency under 1s which is a **2x throughput improvement!**
Executions launched individually execute two tasks in around 120ms which is a **20% latency improvement**!

We can also notice that p99 latency improves a lot and that resource consumption improves a little at high throughput.

## Kestra 1.3 vs. 2.0 -- Benchmark 2 -- complex flow

**Description**
Triggered by a Webhook. Contains 5 `If` tasks with 2 subtasks each (only one executes per run).
This creates 10 task runs per execution and stresses the Executor.

### Kestra 1.3

| step | rate | avg ms | p99 ms | kestra cpu | infra cpu |
|--:|--:|--:|--:|--:|--:|
| 1 | 100 | 570 | 641 | 13.6% | 20.8% |
| 2 | 200 | 601 | 741 | 19.3% | 30.8% |
| 3 | 300 | 647 | 781 | 26.3% | 40.7% |
| 4 | 400 | 867 | 1130 | 31.7%| 48.1% |
| 5 | 500 | 1659 | 2215 | 39.7% | 58.8% |
| 6 | 600 | 10069 | 19253 | 44.2% | 65.5% |
| 7 | 700 | 24501 | 46018 | 45.1% | 66.9% |


### Kestra 2.0

| step | rate | avg ms | p99 ms | kestra cpu | infra cpu |
|--:|--:|--:|--:|--:|--:|
| 1 | 100 | 461 | 541 | 11.5% | 15.4% |
| 2 | 200 | 445 | 527 | 15.3% | 23.7% |
| 3 | 300 | 454 | 544 | 20.1% | 28.9% |
| 4 | 400 | 467 | 583 | 24.1%| 38.3% |
| 5 | 500 | 617 | 1010 | 29.1% | 46.5% |
| 6 | 600 | 730 | 1461 | 11.5% | 17.2% |
| 7 | 700 | 1253 | 3441 | 39.7% | 53.5% |

### 1.3 vs. 2.0

In 1.3, Kestra supports up to 400 exec/min, 4000 task/min, with a latency under 1s.
An execution launched individually executes 10 tasks in around 570ms.

In 2.0, Kestra supports up to 600 exec/min, 6000 task/min, with a latency under 1s which is a **50% throughput improvement!**
An execution launched individually executes 10 tasks in around 450ms which is a **25% latency improvement**!

We can also notice that p99 latency improves a lot and that resource consumption improves noticeably.

## Kestra 1.3 vs. 2.0 -- Benchmark 3 -- large `Loop` task

**Description**
Executes 100 iterations of a Loop task with unbounded concurrency.

### Kestra 1.3

Minimum execution time of 5 runs: 4.54s

### Kestra 2.0

Minimum execution time of 5 runs: 1.42s

## Kestra 1.3 vs. 2.0

In 1.3, 100 taskruns are executed in 4.54s which is 45ms per task run.
In 1.3, 100 taskruns are executed in 1.42s which is 15ms per task run.

This is a **3x latency improvement!**

In 2.0, Loop are runs as sub-executions, which means 100 executions has been created and run concurrently for this benchmark.
This new loop architecture might be thought as sub-performant, but it proves to be the opposite. Execution overhead is small in Kestra, and using sub-executions lower the work to do on the Executor to process each loop iteration providing a nice performance boost.
In 1.3 each loop iteration creates a taskrun added inside the execution context, in 2.0 we only track iteration counters (one per state) so the execution context is smaller, putting less load on the executor and our queuing system.

## Simpler queuing mechanism

In 2.0, our queuing mechanism is simpler and more efficient.
We support only a single consumer group, so we can remove the message when it's consumed.

In JDBC, it allows deleting the message on the same transaction, which reduces the number of database calls as before that we had to update then delete the message. It also implies other improvements like fewer and smaller indices needed, which reduces the resource usage on the database.

It also opens to message broker that didn't support multiple consumer groups natively like RabbitMQ.

TODO performance comparison between JDBC and RabbitMQ

## Lightweight messages

All queue messages are now designed to be lightweight: we didn't include the execution inside it anymore.

Where applicable, we use a **Command** pattern. For example, restarting an execution was done by sending the whole execution message inside the queue in 1.3, now only a **Restart** command is sent.
Thanks to that, we implement a single writer principle: only the executor writes the execution and only the scheduler writes the trigger. This closes races and subtle issues on both the Executor and the Scheduler.

Another important changes is that outputs are now stored outside the execution.
In Kestra, each task can compute outputs that are then stored inside the execution, or inside the internal storage, in this case only the URI of the internal storage file is stored.

In 2.0, we decided to store those outputs in a separate table, these reliefs the executor memory and allows to only load those outputs when actually needed (this is still a work in progress, more optimization will follow).


## Various improvements

It's hard to list all improvements we did, and they all adds up one on top of the other allowing us to reach a new level of performance.

Some I remember and are worth listing:
- We remove some indices on the `logs` table which is the table which receives the highest number of inserts.
- Inside the Executor, we now update the execution via an UPDATE query, we previously use an `INSERT ON CONFLICT UPDATE` which doubles the cost for each execution update, but as inside the Executor we know whether the execution must be created (INSERT) or updated (UPDATE) we can use directly the correct query which saves database resources as it avoids the cost of checking for the presence of the key.
- We increase the default size of the database pool from 10 to 20 which allow us to increase the maximum supported throughput (it now defaults to 20 if not configured). This is based on the feedback of most of our customers that already configure a bigger pool size.
- We cache flow after resolving their plugin default / policies (which no replaces plugin defaults) which for complex flows was a costly operation done each time the Executor process a message.
- We optimize Instant deserialization, as we own the serialization format, we add a quick path for that format which shows a nice performance improvement. Such low-level improvement was discovered when running with our low-latency infrastructure with an AMQP queue. Having a low-latency queue allow us to find new areas of improvements previously hidden under the noise of the more costly JDBC queue.

## gRPC worker

The Worker is now based on a SEDA architecture.

The Worker pull the new Controller for jobs to execute via gRPC then send them in an in-memory queue, an event loop prefetches jobs and send them to platform threads for processing. Using a prefetcher and batching job reception allow for better worker thread utilization and overall throughput improvements.

We now also send logs and metrics in batch which can greatly improve resource usage and latency for executions that generates a lot of them.

## Conclusion

TODO

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
