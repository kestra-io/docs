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

Use the `sla` property at the root of a flow to declare one or more SLA checks. Each SLA specifies a `type`, the condition to check, and a `behavior` to trigger when the condition is violated.

## SLA types

Kestra supports two SLA types:

1. **MAX_DURATION** — the maximum allowed execution duration before the SLA is breached
2. **EXECUTION_ASSERTION** — a Pebble expression that must evaluate to `true` during execution. If it evaluates to `false`, the SLA is breached.

### MAX_DURATION

The following SLA cancels an execution if it runs for more than 8 hours:

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

### EXECUTION_ASSERTION

`EXECUTION_ASSERTION` evaluates a Pebble expression against the execution at runtime. The following SLA fails the execution if `mytask` does not return `expected output`:

```yaml
id: sla_demo
namespace: company.team

sla:
  - id: assert_output
    type: EXECUTION_ASSERTION
    assert: "{{ outputs.mytask.value == 'expected output' }}"
    behavior: FAIL
    labels:
      sla: miss
      reason: outputMismatch

tasks:
  - id: mytask
    type: io.kestra.plugin.core.debug.Return
    format: expected output
```

## SLA behavior

The `behavior` property controls what happens when the SLA is breached:

1. **CANCEL** — cancels the execution
2. **FAIL** — fails the execution
3. **NONE** — logs a message without stopping the execution

Each SLA can also set `labels` on the breached execution, making it easy to filter affected executions or trigger follow-up actions.

## Alerts on SLA breaches

Use a Flow trigger on the `sla: miss` label to send an alert whenever an SLA is breached:

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
