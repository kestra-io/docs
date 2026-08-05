---
title: Workflow Errors in Kestra – Handling Strategies
h1: Handle Workflow Errors with Global and Local Strategies
description: Master error handling in Kestra. Explore strategies like global and local error handlers, allowing failures, and configuring alerts for robust workflows.
sidebarTitle: Errors
icon: /src/contents/docs/icons/flow.svg
---

Kestra provides multiple ways to handle errors, helping you both identify issues and decide whether your flows should stop or continue running after an error.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/VdVNqrL5aPI?si=4U749DR14cUV12P6" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## `errors` Component

`errors` is a list of tasks executed at the flow level when an error occurs. Tasks run sequentially.

The following flow fails immediately and sends an alert via Slack:

```yaml
id: errors
namespace: company.team

description: This will always fail

tasks:
  - id: failed_task
    type: io.kestra.plugin.core.execution.Fail

errors:
  - id: alert_on_failure
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "Failure alert for flow {{ flow.namespace }}.{{ flow.id }} with ID {{ execution.id }}"
```

## `errors` vs `afterExecution`

Both `errors` and `afterExecution` can be used for post-run actions, but they solve different problems.

Use `errors` when you want failure handling to happen as part of the execution lifecycle when a task or flow errors. Use `afterExecution` when you want to react to the final execution state once the run has already finished.

For post-run actions based on the final execution state, see the [`afterExecution` documentation](../20.afterexecution/index.md).

| Use case | Prefer |
| --- | --- |
| Send an alert only when the flow fails | `errors` |
| Handle errors only inside one flowable task and its children | `errors` |
| Run different tasks for `SUCCESS`, `FAILED`, or `WARNING` | `afterExecution` |
| Run reports or notifications that depend on the final execution state | `afterExecution` |


## Global error handler

The first task fails immediately, triggering the handler, which logs the ID of the failed task using the `tasksWithState()` function:

```yaml
id: errors
namespace: company.team

tasks:
  - id: failed
    type: io.kestra.plugin.core.execution.Fail

errors:
  - id: error_handler
    type: io.kestra.plugin.core.log.Log
    message: I'm failing task '{{ tasksWithState('FAILED')[0]['taskId'] }}' # tasksWithState() returns an array; [0] gets the first failed task.
    level: INFO
```

## Local error handler

A local error handler applies only to the children of the flowable task it is defined on — `t2` in this example. Errors from `t1` are not caught here, making it useful for targeted cleanup within a specific subtree:

```yaml
id: errors
namespace: company.team

tasks:
  - id: parent-seq
    type: io.kestra.plugin.core.flow.Sequential
    tasks:
      - id: t1
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ taskrun.startDate }}"
      - id: t2
        type: io.kestra.plugin.core.flow.Sequential
        tasks:
          - id: t2-t1
            type: io.kestra.plugin.core.execution.Fail
        errors:
          - id: error-t1
            type: io.kestra.plugin.core.debug.Return
            format: "Error in {{ task.id }}"
```

## `allowFailure` and `allowWarning` properties

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/WY6G_AONU_E?si=rEFrP-ButAkc9Ndf" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

By default, a failed task stops all downstream tasks. Adding `allowFailure: true` lets downstream tasks continue despite the error — the execution finishes in a `WARNING` state.

```yaml
id: allow_failure
namespace: company.team

description: Allows a task failure and continues downstream; execution finishes in WARNING state.

tasks:
  - id: first
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"

  - id: allow_failure
    type: io.kestra.plugin.core.execution.Fail
    allowFailure: true

  - id: last
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"
```

`allowWarning` works the same way, but the execution finishes in a `SUCCESS` state even if warnings occur:

```yaml
id: allow_warning
namespace: company.team

description: Allows a task warning and continues downstream; execution finishes in SUCCESS state.

tasks:
  - id: first
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"

  - id: allow_warning
    type: io.kestra.plugin.scripts.python.Script
    allowWarning: true
    beforeCommands:
      - pip install kestra
    script: |
      from kestra import Kestra

      logger = Kestra.logger()
      logger.warning("WARNING signals something unexpected.")
```

## Best practices for error handling

- Use **global handlers** for alerts and monitoring across the whole flow.
- Use **local handlers** for targeted cleanup or retries.
- Add `allowFailure` for **non-critical tasks** that shouldn’t block execution.
- Use `allowWarning` when warnings should not mark the execution as failed.
