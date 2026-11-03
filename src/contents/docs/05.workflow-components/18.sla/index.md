---
title: Workflow SLAs in Kestra – Assert Duration Targets
h1: Enforce SLAs and Alert When Workflows Miss Performance Targets
description: Enforce Service Level Agreements (SLAs) in Kestra. Monitor workflow duration and assertions, triggering alerts or actions when performance targets are missed.
sidebarTitle: SLA
icon: /src/contents/docs/icons/flow.svg
version: ">= 0.20.0"
---

SLAs define time or assertion-based checks on flow executions and trigger corrective actions when those checks fail.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/FlkyPIWPLSk?si=KH3Aa7oqKcBBNuo1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

The `sla` property at the root of a flow declares one or more SLA checks. Each SLA specifies a `type`, the condition to check, and a `behavior` to trigger when the condition is violated.

## SLA types

Kestra supports three SLA types:

1. **MAX_DURATION**: the maximum allowed execution duration before the SLA is breached
2. **AVG_DURATION**: the flow's average execution duration, plus an optional margin, before the SLA is breached
3. **EXECUTION_ASSERTION**: a Pebble expression that must evaluate to `true` during execution. If it evaluates to `false`, the SLA is breached.

### MAX_DURATION

The duration counts from the moment the execution is created, including any time it waits in `QUEUED` because of a [concurrency limit](../14.concurrency/index.md). The following SLA cancels an execution that hasn't finished 8 hours after it was created:

```yaml
id: sla_example
namespace: company.team

sla:
  - id: maxDuration
    type: MAX_DURATION
    duration: PT8H
    behavior: CANCEL
    labels:
      sla: miss
      reason: durationExceeded

tasks:
  - id: punctual
    type: io.kestra.plugin.core.log.Log
    message: Workflow started, monitoring SLA compliance

  - id: sleepyhead
    type: io.kestra.plugin.core.flow.Sleep
    duration: PT9H

  - id: never_executed_task
    type: io.kestra.plugin.core.log.Log
    message: This task will never start because the SLA was breached
```

### AVG_DURATION

`AVG_DURATION` breaches when an execution runs longer than the flow's recent average duration. Use it to catch executions that are slower than usual when you have no fixed ceiling to set with `MAX_DURATION`.

When an execution is created, Kestra averages the durations of the flow's executions that ended within the `lookbackPeriod` and whose final state is listed in `averageOverStates`. The SLA deadline is that average plus the threshold, counted from the moment the execution is created, like `MAX_DURATION`. Kestra computes the deadline once per execution, so it does not change while the execution runs.

The following SLA labels any execution that runs 50% longer than the average of the last 30 days, without stopping it:

```yaml
id: sla_avg_duration
namespace: company.team

sla:
  - id: slowerThanUsual
    type: AVG_DURATION
    lookbackPeriod: P30D
    percentageThreshold: 0.5
    minExecutions: 10
    behavior: NONE
    labels:
      sla: miss
      reason: slowerThanUsual

tasks:
  - id: extract
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv
```

`AVG_DURATION` accepts the following properties in addition to `id`, `type`, `behavior`, and `labels`:

| Property | Required | Default | Description |
|---|---|---|---|
| `lookbackPeriod` | Yes | | ISO 8601 duration, such as `P30D`. Executions that ended within this period before the new execution was created count towards the average. |
| `percentageThreshold` | No | | Margin as a fraction of the average. For example, `0.2` breaches at 120% of the average. Must be greater than `0`. |
| `durationThreshold` | No | | Fixed margin added to the average, as an ISO 8601 duration such as `PT5M`. Must be positive. |
| `minExecutions` | No | `5` | Minimum number of matching executions in the lookback period. Below this number, the SLA does not apply to the new execution. Must be at least `1`. |
| `averageOverStates` | No | `[SUCCESS, WARNING]` | Final execution states that count towards the average. |

Set `percentageThreshold` or `durationThreshold`, not both; a flow that sets both fails validation. Without either, the SLA is breached as soon as an execution runs longer than the average.

The average is based on the following executions:

- Only executions of the same flow that have ended count. Executions created by tests or the Playground don't count.
- An execution's duration runs from its creation to its end, so time spent in `QUEUED` is included.
- The default `averageOverStates` leaves out `FAILED`, `KILLED`, and `CANCELLED` executions. These often end early, such as executions cancelled by a concurrency limit, and would lower the average. It also leaves out executions that this SLA failed or cancelled, so slow executions don't raise later averages.

When the flow has fewer than `minExecutions` matching executions, for example a new flow or one that rarely runs, Kestra skips the SLA for that execution without logging a message.

### EXECUTION_ASSERTION

`EXECUTION_ASSERTION` evaluates a Pebble expression against the execution at runtime. The following SLA fails the execution if `mytask` does not return `expected output`:

```yaml
id: sla_demo
namespace: company.team

sla:
  - id: assert_output
    type: EXECUTION_ASSERTION
    assert: "{{ outputs.mytask.values.result == 'expected output' }}"
    behavior: FAIL
    labels:
      sla: miss
      reason: outputMismatch

tasks:
  - id: mytask
    type: io.kestra.plugin.core.output.OutputValues
    values:
      result: expected output
```

## SLA behavior

The `behavior` property controls what happens when the SLA is breached:

1. **CANCEL**: cancels the execution
2. **FAIL**: fails the execution
3. **NONE**: logs a message without stopping the execution

Each SLA can also set `labels` on the breached execution, making it easy to filter affected executions or trigger follow-up actions.

## Alerts on SLA breaches

The following example uses a Flow trigger on the `sla: miss` label to send an alert on SLA breaches:

```yaml
id: sla_miss_alert
namespace: system

tasks:
  - id: send_alert
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "SLA breached for flow `{{ trigger.namespace }}.{{ trigger.flowId }}` with ID `{{ trigger.executionId }}`"

triggers:
  - id: alert_on_failure
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - labels:
          sla: miss
        states: [FAILED, WARNING, CANCELLED]
```

An SLA with `behavior: NONE` adds its labels without changing the execution state, so the execution can still end `SUCCESS`. To alert on these breaches, add `SUCCESS` to `states`.

The interval at which the executor checks for SLA breaches is configurable via [`kestra.executor.monitor-sla-loop-periodicity-ms`](../../configuration/04.plugins-and-execution/index.md#executor-loop-intervals) (default: 1000ms).
