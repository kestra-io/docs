---
title: "Benchmarks: Orchestration Throughput & Latency"
h1: "Kestra Orchestration Benchmark Results: Throughput and Latency"
sidebarTitle: Benchmarks
icon: /src/contents/docs/icons/admin.svg
description: View performance benchmarks for Kestra's orchestration throughput and latency across Open Source and Enterprise editions.
---

Kestra is an orchestration platform: you define a flow, and Kestra orchestrates it.
Flows can range from lightweight tasks running in milliseconds to complex scripts in containers that run for tens of minutes.

## See Kestra orchestration benchmark results

This benchmark focuses on **orchestration performance**, including dispatching to the Kestra Worker, rather than workload execution, which varies by use case.
To isolate orchestration performance, we use workflows with fast tasks, such as:

- `io.kestra.plugin.core.log.Log` — logs a single message.
- `io.kestra.plugin.core.output.OutputValues` — produces a single output (simulating a data-oriented workflow).

## Test environment

Benchmarks were run on a Google Cloud **n2-standard-4** VM (4 vCPUs, 16 GB RAM) with three setups:

1. **Kestra Open Source (OSS)** — Postgres 16 backend (4 vCPUs, 16 GB RAM). Database runs remotely to simulate production.
2. **Kestra Enterprise Edition (EE)** — RabbitMQ and Postgres 16 (4 vCPUs, 16 GB RAM). Both run on separate VMs. Target low-latency and high-throughput use cases.

:::alert{type="info"}
Benchmark results are for Kestra 2.0.0.
Compared to previous benchmarks, we now run with `n2-standard-4` instead of `e2-standard-4`.
We now also run at higher throughput as [Kestra 2.0 delivers close to a **2x** throughput improvement compared to 1.3](https://kestra.io/blogs/performance-improvements-2-0).
:::

---

## Benchmark 1 -- simple flow

**Description**
Triggered by a Webhook. Contains two tasks:
1. Outputs a variable.
2. Logs that variable.

```yaml
id: benchmark01
namespace: benchmarks

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: benchmark

inputs:
  - id: name
    type: STRING
    defaults: World

tasks:
  - id: concatenate
    type: io.kestra.plugin.core.output.OutputValues
    values:
      message: Hello {{ inputs.name }}
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.concatenate.values.message }}"
```

**Results for Kestra OSS (Postgres)**

| step | rate | avg ms | p99 ms | kestra cpu | postgres cpu |
|--:|--:|--:|--:|--:|--:|
| 1 | 1000 | 115 | 151 | 18%  | 26.5% |
| 2 | 2000 | 111 | 159 | 29.9%  | 42.5% |
| 3 | 3000 | 122 | 188 | 38.3% | 53.5% |
| 4 | 4000 | 150 | 370 | 46.3% | 68.1% |
| 5 | 5000 | 10833 | 40504 | 48.1% | 71% |
| 6 | 6000 | 129542 | 217552 | 28.5% | 56.7% |
| 7 | 7000 | 186826 | 340071 | 26.2% | 54.8% |


**Results for Kestra EE (RabbitMQ + Postgres)**

| step | rate | avg ms | p99 ms | kestra cpu | rabbitmq cpu | postgres cpu |
|--:|--:|--:|--:|--:|--:|--:|
| 1 | 1000 | 50 | 60 | 16.2% | 25.3% | 15.1% |
| 2 | 2000 | 54 | 75 | 26.2% | 36.7% | 25.5% |
| 3 | 3000 | 60 | 85 | 38.3% | 39.5% | 37.1% |
| 4 | 4000 | 67 | 90 | 43% | 46.3% | 47.7% |
| 5 | 5000 | 68 | 102 | 48.2% | 44.3% | 45% |
| 6 | 6000 | 69 | 107 | 48.5% | 45.6% | 46.3% |
| 7 | 7000 | 68 | 106 | 48.9% | 46.6% | 46.2% |


**Key takeaways**
- At 1000 executions/min (2000 tasks/min), execution latency is approximately 115ms — similar to a single execution time.
- Kestra OSS (Postgres backend) sustains up to 4000 executions/min (8000 tasks/min) with an execution duration of less than 1s, which is what we could realistically target for such a workflow.
- Kestra EE (RabbitMQ + Postgres backend) sustains up to 7000 executions/min (14000 tasks/min), maybe more as our backend harness cannot saturate it at the moment!
- Kestra EE has 55% lower latency and supports way higher throughput than Kestra OSS.
- At sustained throughput, p99 latency stays way under 1s.

## Benchmark 2 -- complex flow

**Description**
Triggered by a Webhook. Contains 5 `If` tasks with 2 subtasks each (only one executes per run).
This creates 10 task runs per execution and stresses the Executor.

```yaml
id: benchmark02
namespace: benchmarks

inputs:
  - id: condition
    type: BOOL
    defaults: true

triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: benchmark

tasks:
  - id: if1
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.condition}}"
    then:
      - id: hello-true-1
        type: io.kestra.plugin.core.log.Log
        message: Hello True 1
    else:
      - id: hello-false-1
        type: io.kestra.plugin.core.log.Log
        message: Hello False 1
  - id: if2
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.condition}}"
    then:
      - id: hello-true-2
        type: io.kestra.plugin.core.log.Log
        message: Hello True 2
    else:
      - id: hello-false-2
        type: io.kestra.plugin.core.log.Log
        message: Hello False 2
  - id: if1-3
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.condition}}"
    then:
      - id: hello-true-3
        type: io.kestra.plugin.core.log.Log
        message: Hello True 3
    else:
      - id: hello-false-3
        type: io.kestra.plugin.core.log.Log
        message: Hello False 3
  - id: if4
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.condition}}"
    then:
      - id: hello-true-4
        type: io.kestra.plugin.core.log.Log
        message: Hello True 4
    else:
      - id: hello-false-4
        type: io.kestra.plugin.core.log.Log
        message: Hello False 4
  - id: if5
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.condition}}"
    then:
      - id: hello-true-5
        type: io.kestra.plugin.core.log.Log
        message: Hello True 5
    else:
      - id: hello-false-5
        type: io.kestra.plugin.core.log.Log
        message: Hello False 5
```

**Results for Kestra OSS (Postgres)**

| step | rate | avg ms | p99 ms | kestra cpu | infra cpu |
|--:|--:|--:|--:|--:|--:|
| 1 | 200 | 367 | 433 | 12.4% | 16.7% |
| 2 | 400 | 366 | 441 | 18.5% | 27.4% |
| 3 | 600 | 374 | 473 | 26.2% | 34.5% |
| 4 | 800 | 400 | 508 | 30.6% | 45.8% |
| 5 | 1000 | 476 | 662 | 34.3% | 49.6% |
| 6 | 1200 | 863 | 1320 | 41.9% | 61.9% |
| 7 | 1400 | 31967 | 102474 | 30% | 50% |


**Results for Kestra EE (RabbitMQ + Postgres)**

| step | rate | avg ms | p99 ms | kestra cpu | rmq cpu | pg cpu |
|--:|--:|--:|--:|--:|--:|--:|
| 1 | 200 | 177 | 263 | 9% | 14.5%| 7.9% |
| 2 | 400 | 186 | 228 | 14.4% | 21.2% | 14% |
| 3 | 600 | 211 | 279 | 22.3% | 27.2% | 21% |
| 4 | 800 | 252 | 327 | 26.4% | 30.9% | 25.1% |
| 5 | 1000 | 336 | 480 | 36.2% | 35.1% | 33.2% |
| 6 | 1200 | 1181 | 1944 | 38.1% | 35.7% | 37.3% |
| 7 | 1400 | 11639 | 25300 | 42.3% | 37.2% | 45.4% |


**Key takeaways**
- At 200 executions/min (1000 tasks/min), execution latency is approximately 400ms — similar to a single execution time.
- Kestra OSS (Postgres backend) sustains up to 1200 executions/min (6000 tasks/min) with an execution duration of less than 2s, which is what we could realistically target for such a workflow.
- Kestra EE (RabbitMQ + Postgres backend) sustains the same throughput at lower latency.
- The Kestra Executor processing capability is independent of the type of tasks to process; the number of tasks per minute sustained in this benchmark is of the same level as in the first benchmark.

## Benchmark 3 -- large `Loop` task

**Description**
Executes 100 iterations of a Loop task with unbounded concurrency.

```yaml
id: benchmark03
namespace: benchmarks

tasks:
  - id: foreach
    type: io.kestra.plugin.core.flow.Loop
    values: "{{range(1, 100)}}"
    concurrencyLimit: 0
    tasks:
      - id: output
        type: io.kestra.plugin.core.output.OutputValues
        values:
          some: value
```

**Observations**
The `Loop` task is executed once, so the flow results in 101 task executions.

On average, the execution time for the both backends is around **1.5s**, that is about 67 tasks/s or 4020 tasks/mn, as each loop iteration runs inside dedicated sub-executions, the overhead is expected for an iteration with a single task.

## Benchmark 4 -- realtime trigger with JSON transformation

:::alert{type="info"}
This benchmark has not been run yet on 2.0.0 as we changed our benchmarking harness, we will publish results later.
:::


## Conclusion

Kestra is a platform, not just a framework. It provides orchestration plus logging, metrics, retries, SLAs, error handling, governance, and observability.
While this adds overhead compared to lightweight tools, performance is balanced with feature richness.

Kestra is designed for high performance in workflow orchestration and task dispatching, ensuring minimal time spent in the orchestrator and more time in actual task execution. Thanks to continuous performance tuning by the engineering team, Kestra remains among the fastest, most high-performing workflow orchestrators in every release.

Kestra is built to scale horizontally. When a use case demands it, add Executor/Worker nodes to increase throughput.

:::alert{type="info"}
This page is updated with each new Kestra release.
For more details on how to run this benchmark yourself, refer to our [Benchmarks](https://github.com/kestra-io/benchmarks) repository on GitHub.
:::
