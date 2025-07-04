---
title: Benchmark
icon: TODO
---

Kestra is an orchestration platform, you write a flow, and Kestra does the orchestration for you.
But a flow can execute any type of tasks, from tiny tasks that execute in a few milliseconds to complex scripts that start a container and runs for tens of minutes.

To benchmark Kestra, we would want to benchmark the **orchestration capability**, including dispatching to the Kestra Worker, not the ability to execute a workload, which are different for each use case.
For this, we will use typical workflows with tasks that are quick to execute like the `io.kestra.plugin.core.log.Log` task that log a single message or te `io.kestra.plugin.core.output.OutputValues` task that create a single output to mimic data-oriented workflow.

Test results are with a Google Cloud VM instance **e2-standard-4** (4 vCPUs, 16 GB RAM) using Kestra OSS with a Postgres 16 backend (4 vCPUs, 16 GB RAM). Note that the database is not run locally to be closer to what you would typically do in production.

::alert{type="info"}
Benchmark results are for Kestra 0.22.13.
::

## A simple flow with a Webhook

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

Results:
- 5 executions/s - 10 tasks/s: 247ms
- 10 executions/s - 20 tasks/s: 440ms
- 15 executions/s - 30 tasks/s: 524ms
- 20 executions/s - 40 tasks/s: 765ms
- 25 executions/s - 50 tasks/s: 1.2s
- 30 executions/s - 60 tasks/s: 8.3s

## A complex flow

This flow will execute 100 iterations of a ForEach loop.

```yaml
id: benchmark02
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

On average, the execution time is around 19s that is about 20 tasks/s.

This may seem less that what was sustained by Kestra in the first benchmark, this is because a single flow with a lot of task run creates a big execution context which is costly to orchestrate.

## A realtime trigger with JSON transformation

This flow will consume a Kafka topic and create executions in realtime for each message received in this topic.
Each message will then be process but the JSONata `TransformValue` task that will map it to a different JSON format and be used in an `OutputValues` task to create a new output. Doing this will triple the size of the data inside the execution context.

```yaml
id: benchmark03
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

Result for messages with 1 item (1.6KB)
- 10 executions/s - 20 tasks/s: 465ms
- 20 executions/s - 40 tasks/s: 1s
- 30 executions/s - 60 tasks/s: 12s

Result for messages with 10 items (16KB)
- 10 executions/s - 20 tasks/s: 707ms
- 20 executions/s - 40 tasks/s: 5s
- 30 executions/s - 60 tasks/s: 26s

Result for messages with 100 items (164KB)
- 5 executions/s - 10 tasks/s: 1.2s
- 10 executions/s - 20 tasks/s: 22s
- 15 executions/s - 30 tasks/s: 26s

We can see here that the size of the message greatly impact the execution time which is expected as the `TransformValue` task will take longer to execute if there are more items, and the size of the execution context will grow linearly.