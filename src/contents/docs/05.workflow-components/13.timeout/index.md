---
title: Task Timeouts in Kestra – Limit Run Duration
h1: Prevent Hanging Tasks by Setting Maximum Execution Times
description: Control task duration with Timeouts in Kestra. Prevent hanging processes and manage costs by setting maximum execution times for your tasks.
sidebarTitle: Task Timeout
icon: /src/contents/docs/icons/flow.svg
---

A timeout defines the maximum duration a [runnable task](../01.tasks/01.runnable-tasks/index.md) is allowed to run. If a task run exceeds that duration, Kestra stops it and marks it as failed — preventing hangs and bounding costs for long-running cloud jobs like Snowflake queries or AWS Batch tasks.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/vvD3Jg5huiE?si=M7BX8vwp7JsdUrL1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Format

Timeouts use the [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) format. Week, month, and year designators are not supported. See also: [retries](../12.retries/index.md).

| Value    | Duration              |
|----------|-----------------------|
| PT0.250S | 250 milliseconds      |
| PT2S     | 2 seconds             |
| PT1M     | 1 minute              |
| PT3.5H   | 3 hours, 30 minutes   |
| P6DT4H   | 6 days, 4 hours       |


## Example

The `costly_query` task sleeps for 10 seconds, but the timeout is set to 5 seconds, causing the task to fail.

```yaml
id: timeout
namespace: company.team

tasks:
  - id: costly_query
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - sleep 10
    timeout: PT5S
```

## Flow-level timeout

There is no flow-level timeout. To cancel a workflow execution that exceeds a specific duration, use `MAX_DURATION`-type [SLA](../18.sla/index.md).
