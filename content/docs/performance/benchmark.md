---
title: Benchmarks
icon: /docs/icons/admin.svg
---

Kestra is an orchestration platform: you define a flow, and Kestra orchestrates it.  
Flows can range from lightweight tasks running in milliseconds to complex scripts in containers that run for tens of minutes.

This benchmark focuses on **orchestration performance**, including dispatching to the Kestra Worker, rather than workload execution, which varies by use case.  
To isolate orchestration performance, we use workflows with fast tasks, such as:

- `io.kestra.plugin.core.log.Log` — logs a single message.
- `io.kestra.plugin.core.output.OutputValues` — produces a single output (simulating a data-oriented workflow).

## Test Environment

Benchmarks were run on a Google Cloud **e2-standard-4** VM (4 vCPUs, 16 GB RAM) with two setups:

1. **Kestra Open Source (OSS)** — Postgres 16 backend (4 vCPUs, 16 GB RAM). Database runs remotely to simulate production.
2. **Kestra Enterprise Edition (EE)** — Kafka backend (4 vCPUs, 16 GB RAM). Kafka and Elasticsearch run on separate VMs.

::alert{type="info"}
Benchmark results are for Kestra 0.23.4.
::

---

## Benchmark 1 -- Simple flow

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

**Results for Kestra OSS**

![Kestra OSS - Benchmark01](/docs/performance/bench01-OSS.png "Kestra OSS Benchmark01 results")

| Executions(per minutes)	| Tasks (per minutes) | 	Execution Latency (in seconds) |
|:--|:--|:--------------------------------|
| 250 |	500 | 	0,31                           |
| 500	| 1000	| 0,35                            |
| 1000	| 2000	| 0,47                            |
| 1500	| 3000	| 0,9                             |
| 2000	| 4000	| 24                              |

**Results for Kestra EE**

![Kestra EE - Benchmark01](/docs/performance/bench01-EE.png "Kestra EE Benchmark01 results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 250	| 500	| 0,24 |
| 500	| 1000	| 0,28
| 1000	| 2000	| 0,26 |
| 1500	| 3000	| 0,27 |
| 2000	| 4000	| 0,45 |
| 2500	| 5000	| 18 |

**Key takeaways**
- At 250 executions/min (500 tasks/min), execution latency is approximately 300ms — similar to single execution time.
- Kestra OSS (JDBC backend) sustains up to 1500 executions/min (3000 tasks/min) with an execution duration of less than 1s, which is what we could realistically target for such a workflow.
- Kestra EE (Kafka backend) sustains up to 2000 executions/min (4000 tasks/min).
- Kestra EE performance degradates less under load than Kestra OSS until about 2500 executions/min (5000 tasks/min).

## Benchmark 2 -- Complex flow

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

**Results for Kestra OSS**

![Kestra OSS - Benchmark02](/docs/performance/bench02-OSS.png "Kestra OSS Benchmark02 results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 100 |	1000	| 1,4 |
| 200	| 2000	| 1,7 |
| 300	| 3000	| 2,5 |
| 400	| 4000	| 7,5 |
| 500	| 5000	| 25 |

**Results for Kestra EE**

![Kestra EE - Benchmark02](/docs/performance/bench02-OSS.png "Kestra OSS Benchmark02 results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 100 |	1000  | 1,4 |
| 200	| 2000  | 1,6 |
| 300	| 3000	| 1,7 |
| 400	| 4000	| 2,8 |
| 500	| 5000	| 32 |

**Key takeaways**
- At 250 executions/min (500 tasks/min), execution latency is approximately 300ms — similar to single execution time.
- Kestra OSS (JDBC backend) sustains up to 300 executions/min (3000 tasks/min) with an execution duration of less than 3s, which is what we could realistically target for such a workflow.
- Kestra EE (Kafka backend) sustains up to 400 executions/min (4000 tasks/min).
- The Kestra Executor processing capability is independent of the type of tasks to process; the number of tasks per minute sustained in this benchmark is the same as in the first benchmark.

## Benchmark 3 -- Large `ForEach` loop

**Description**
Executes 100 iterations of a ForEach loop with unbounded concurrency.

```yaml
id: benchmark03
namespace: benchmarks

tasks:
  - id: foreach
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{range(1, 100)}}"
    concurrencyLimit: 0
    tasks:
      - id: output
        type: io.kestra.plugin.core.output.OutputValues
        values:
          some: value
```

**Observations**
On average, the execution times for the OSS JDBC backend and EE Kafka are approximately 11s and 10s respectively.
That is about 20 tasks/s, as the `ForEach` task is executed on each iteration, so we will end up with 200 task executions.

This is lower than the throughput in the previous benchmarks because a single flow with many task runs creates a large execution context, which is costly to orchestrate.

## Benchmark 4 -- Realtime Trigger with JSON Transformation

**Description**
Consumes messages from a Kafka topic in real time, transforms them with JSONata `TransformValue` task, and outputs new data in the `OutputValues` task. This triples the size of the data in the execution context.

```yaml
id: benchmark04
namespace: benchmarks

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
      $.{
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

Benchmarked with:

- Small messages (~1.6 KB)
- Medium messages (~16 KB)
- Large messages (~160 KB)

**Results for Kestra OSS**

With 1.6 KB small-sized messages:

![Kestra OSS - Benchmark04 - Small messages](/docs/performance/bench04-OSS-small.png "Kestra OSS Benchmark04 with small messages results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 500 |	1000 |	0,36 |
| 750	| 1500	| 0,46 |
| 1000	| 2000	| 0,53 |
| 1250	| 2500	| 0,65 |
| 1500	| 3000	| 0,75 |
| 1750	| 3500	| 2,9 |
| 2000	| 4000	| 20 |


With 16 KB medium-sized messages:

![Kestra OSS - Benchmark04 - Medium messages](/docs/performance/bench04-OSS-medium.png "Kestra OSS Benchmark04 with medium messages results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 500	| 1000	| 0,4 |
| 750	| 1500	| 0,49 |
| 1000	| 2000	| 0,63 |
| 1250	| 2500	| 1 |
| 1500	| 3000	| 9,8 |

With 160 KB large-sized messages:

![Kestra OSS - Benchmark04 - Big messages](/docs/performance/bench04-OSS-big.png "Kestra OSS Benchmark04 with big messages results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 250	| 500 |	0,72 |
| 375	| 750	| 1,3 |
| 500	| 1000	| 8.6 |
| 625	| 1250	| 34 |

**Results for Kestra EE**

With 1.6 KB small-sized messages:

![Kestra EE - Benchmark04 - Small messages](/docs/performance/bench04-EE-small.png "Kestra EE Benchmark04 with small messages results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 500	| 1000	| 0,28 |
| 750	| 1500	| 0,26 |
| 1000	| 2000	| 0,3 |
| 1250	| 2500	| 0,3 |
| 1500	| 3000	| 0,32 |
| 2000	| 4000	| 0,57 |
| 2500 |	5000	| 27 |

With 16 KB medium-sized messages:

![Kestra EE - Benchmark04 - Meidum messages](/docs/performance/bench04-EE-medium.png "Kestra OSS Benchmark04 with medium messages results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 500	| 1000	| 0,26 |
| 750	| 1500	| 0,27 |
| 1000	| 2000	| 0,41 |
| 1250	| 2500	| 0,34 |
| 1500	| 3000	| 8 |

With 160 KB large-sized messages:

![Kestra EE - Benchmark04 - Big messages](/docs/performance/bench04-OSS-big.png "Kestra OSS Benchmark04 with big messages results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 250	| 500	| 0,31 |
| 375	| 750	| 0,33 |
| 500	| 1000	| 0,48 |
| 625	| 1250	| 104 |

**Key takeaways**
- Small messages: Similar performance to Benchmark 1, which is expected.
- Medium messages: Kestra sustains up to 1250 executions/min (2500 tasks/min) with an execution duration of less than 1s, which is what we could realistically target for such a workflow.
- Large messages: Performance starts to degrade significantly, which is expected due to the increased Worker workload and Executor sensitivity to execution size.
- EE sustains higher throughput than Kestra OSS (4000 tasks/min vs. 2500 tasks/min) in real-time scenarios for small messages.

## Conclusion

Kestra is a platform, not just a framework. It provides orchestration plus logging, metrics, retries, SLAs, error handling, governance, and observability.
While this adds overhead compared to lightweight tools, performance is balanced with feature richness.

Kestra is designed for high performance in workflow orchestration and task dispatching, ensuring minimal time spent in the orchestrator and more time in actual task execution. Thanks to continuous performance tuning by the engineering team, Kestra remains among the fastest, most high-performing workflow orchestrators in every release.

To further note, Kestra is built to scale horizontally. When a use case demands it, seamlessly add Executor/Worker nodes to further increase throughput.

::alert{type="info"}
We will try our best to keep this page up to date with each new Kestra release.
For more details on how to run this benchmark yourself, refer to our [Benchmarks](https://github.com/kestra-io/benchmarks) repository on GitHub.
::