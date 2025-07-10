---
title: Benchmark
icon: TODO
---

Kestra is an orchestration platform, you write a flow, and Kestra does the orchestration for you.

But a flow can execute any type of tasks, from tiny tasks that execute in a few milliseconds to complex scripts that start a container and runs for tens of minutes.

To benchmark Kestra, we would want to benchmark the **orchestration capability**, including dispatching to the Kestra Worker, not the ability to execute a workload, which are different for each use case.
For this, we will use typical workflows with tasks that are quick to execute like the `io.kestra.plugin.core.log.Log` task that log a single message or the `io.kestra.plugin.core.output.OutputValues` task that create a single output to mimic data-oriented workflow.

Test results are with a Google Cloud VM instance **e2-standard-4** (4 vCPUs, 16 GB RAM) with two different Kestra installations:
1. Kestra Open Source Edition (OSS) with a Postgres 16 backend (4 vCPUs, 16 GB RAM). Note that the database is not run locally to be closer to what you would typically do in production.
2. Kestra Enterprise Edition (EE) with a Kafka backend (4vCPU, 16GB RAM). Again, we start Kafka and Elasticsearch on a separate VMs.

::alert{type="info"}
Benchmark results are for Kestra 0.23.4.
::

## A simple flow

This flow will be triggered by a Webhook, it has two tasks: one that outputs a variable and another one that uses this variable and logs it.

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
- At 250 executions or 500 tasks per minute, execution latency is around 300ms. This is more or less the duration of the execution when launched unitary.
- Kestra OSS with the JDBC backend can sustain up to 1500 executions or 3000 tasks per minute with an execution duration of less than 1s which is what we could realistically target for such workflow.
- Kestra EE with the Kafka backend can sustain up to 2000 executions or 4000 tasks per minute.
- Kestra EE performance degradation under load is less than Kestra OSS until it reaches 2500 executions or 5000 tasks per minute.

## A complex flow

This flow will be triggered by a Webhook, it has 5 `If` tasks, each one having two `Log` as subtasks, only one will be executed on each run.
This is an example of a flow with a lot of orchestration tasks in it that will put pressure on the Kestra Executor.
It will create 10 task runs (5 `If` and 5 `Log`) for each execution.

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
- At 250 executions or 500 tasks per minute, execution latency is around 300ms. This is more or less the duration of the execution when launched unitary.
- Kestra OSS with the JDBC backend can sustain up to 300 executions or 3000 tasks per minute with an execution duration of less than 3s which is what we could realistically target for such workflow.
- Kestra EE with the Kafka backend can sustain up to 400 executions or 4000 tasks per minute.
- The Kestra Executor processing capability is independent of the type of tasks to process, the number of tasks per minute sustained in this benchmark is the same as in the first benchmark.,

## A big `ForEach` loop

This flow will execute 100 iterations of a ForEach loop with unbounded concurrency.

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

On average, the execution time for the OSS JDBC backend is around 11s, and for the EE Kafka is around 10s.
That is about 20 tasks/s as the `ForEach` task itself is executed on each iteration so we will ends up with 200 task execution.

This may seem less that what was sustained by Kestra in the previous benchmarks.
This is because a single flow with a lot of task runs creates a big execution context which is costly to orchestrate.

## A realtime trigger with JSON transformation

This flow will consume a Kafka topic and create executions in realtime for each message received in this topic.
Each message will then be process but the JSONata `TransformValue` task that will map it to a different JSON format and be used in an `OutputValues` task to create a new output. Doing this will triple the size of the data inside the execution context.

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

Here we will use different message sizes to evaluate how Kestra behaves with different execution sizes: 1.6k, 16k and 160k.

**Results for Kestra OSS**

With small messages of 1,6k.

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


With medium messages of 16k.

![Kestra OSS - Benchmark04 - Medium messages](/docs/performance/bench04-OSS-medium.png "Kestra OSS Benchmark04 with medium messages results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 500	| 1000	| 0,4 |
| 750	| 1500	| 0,49 |
| 1000	| 2000	| 0,63 |
| 1250	| 2500	| 1 |
| 1500	| 3000	| 9,8 |

With big messages of 160k.

![Kestra OSS - Benchmark04 - Big messages](/docs/performance/bench04-OSS-big.png "Kestra OSS Benchmark04 with big messages results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 250	| 500 |	0,72 |
| 375	| 750	| 1,3 |
| 500	| 1000	| 8.6 |
| 625	| 1250	| 34 |

**Results for Kestra EE**

With small messages of 1,6k.

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


With medium messages of 16k.

![Kestra EE - Benchmark04 - Meidum messages](/docs/performance/bench04-EE-medium.png "Kestra OSS Benchmark04 with medium messages results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 500	| 1000	| 0,26 |
| 750	| 1500	| 0,27 |
| 1000	| 2000	| 0,41 |
| 1250	| 2500	| 0,34 |
| 1500	| 3000	| 8 |

With big messages of 160k.

![Kestra EE - Benchmark04 - Big messages](/docs/performance/bench04-OSS-big.png "Kestra OSS Benchmark04 with big messages results")

| Executions(per minutes)	| Tasks (per minutes) |	Execution Latency (in seconds)|
|:--|:--|:--|
| 250	| 500	| 0,31 |
| 375	| 750	| 0,33 |
| 500	| 1000	| 0,48 |
| 625	| 1250	| 104 |

**Key takeaways**
- With small messages, we have approximately the same results as the one of the first benchmark which is expected.
- With medium messages, Kestra can sustain up to 1250 executions or 2500 tasks per minute with an execution duration of less than 1s which is what we could realistically target for such workflow.
- With big messages, performance starts to degrade vastly which is expected as the Worker would have more work to do, and the Executor is sensible to the size of the execution message.
- Realtime triggers will create executions at a high rate, we see here that Kestra EE particularly shine in such scenario as it could sustain way more tasks per minutes (4000) than Kestra OSS (2500) for small messages.

## Conclusion

Kestra is a platform not a framework, it comes bundled with logs, metrics, retry, SLA, error handling, a rich UI, governance, observability, ... This of course has a cost if you compare it with a framework or a lighter tool but we try to balance a rich features platform with good workflow execution performance.

Kestra has been designed from the ground up with performance in mind, and the engineering team keep investing in performance optimization, this made Kestra one of the most performant workflow orchestrators.

Kestra performance focuses on workflow orchestration and task dispatching so your workflow would not loose time inside the orchestrator but spent most time inside your own workflow: the task execution.

Keep in mind that Kestra has been designed to scale horizontally, this means that you could expect Kestra's performance to increase nicely by adding more nodes (Executor or Worker) to your deployment.

::alert{type="info"}
We will try to make our best to align this page with each new Kestra release.
You can find details on how to run this benchmark by yourself in our [benchmarks](https://github.com/kestra-io/benchmarks) repository on GitHub.
::