---
title: Workflow Errors in Kestra – Handling Strategies
description: Master error handling in Kestra. Explore strategies like global and local error handlers, allowing failures, and configuring alerts for robust workflows.
sidebarTitle: Errors
icon: /src/contents/docs/icons/flow.svg
---

Kestra provides multiple ways to handle errors, helping you both identify issues and decide whether your flows should stop or continue running after an error.

## Workflow errors – handling strategies

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/VdVNqrL5aPI?si=4U749DR14cUV12P6" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## `errors` Component

`errors` is a list of tasks set at the flow level that are executed when an error occurs. You can add multiple tasks, and they are executed sequentially. This is useful for sending alerts when errors occur.

The example below sends a flow-level failure alert via Slack using the [SlackIncomingWebhook](/plugins/plugin-slack/io.kestra.plugin.slack.slackincomingwebhook) task defined using the `errors` property.

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
    url: secret('SLACK_WEBHOOK')
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

Pros of `errors`:

- Failure-specific by design.
- Available at the flow level and locally inside flowable tasks.
- Well suited for remediation, cleanup, or alerts tied to a failure path.

Cons of `errors`:

- It is focused on error paths, not success paths.
- It is less convenient when you want one block that branches on multiple final states.

Two kinds of error handlers can be defined:
- **Global**: error handling for the entire flow, defined at the root level
- **Local**: error handling for a Flowable Task and its children

## Global error handler

This example shows a global error handler. The first task fails immediately, triggering the handler, which then logs the ID of the failed task using the `errorLogs()` function.

```yaml
id: errors
namespace: company.team

tasks:
  - id: failed
    type: io.kestra.plugin.core.execution.Fail

errors:
  - id: 2nd
    type: io.kestra.plugin.core.log.Log
    message: I'm failing {{ errorLogs()[0]['taskId'] }} # Because errorLogs() is an array, the first taskId to fail is retrieved.
    level: INFO
```

## Local error handler

This example demonstrates a local error handler that applies only to the children of `t2`. Errors from other tasks, like `t1`, are not handled here.

This can be useful to restrict error handling for a specific part of the flow and perform specific tasks like resource cleanup.

```yaml
id: errors
namespace: company.team

tasks:
  - id: parent-seq
    type: io.kestra.plugin.core.flow.Sequential
    tasks:
      - id: t1
        type: io.kestra.plugin.core.debug.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
      - id: t2
        type: io.kestra.plugin.core.flow.Sequential
        tasks:
          - id: t2-t1
            type: io.kestra.plugin.core.execution.Fail
        errors:
          - id: error-t1
            type: io.kestra.plugin.core.debug.Return
            format: "Error Trigger ! {{task.id}}"
```

## `allowFailure` and `allowWarning` Property

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/WY6G_AONU_E?si=rEFrP-ButAkc9Ndf" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

When you execute a flow and one of its tasks fails, downstream tasks are not executed. This may not always be desirable, especially for non-critical tasks. You can resolve this by adding the `allowFailure` property to the task, which allows downstream tasks to continue despite an error. In this case, the execution will finish in a `WARNING` state.

```yaml
id: allow_failure
namespace: company.team

description: This flow will allow a failure of a task (imagine a flaky unit test) and will continue processing downstream tasks, but the execution will finish in a `WARNING` state.

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

There is also the `allowWarning` property, which works similarly to `allowFailure`, but the execution finishes in a `SUCCESS` state even if warnings occur.

```yaml
id: allow_warning
namespace: company.team

description: This flow will allow a warning of a task (imagine a notification task) and will continue processing downstream tasks, with the execution finishing in a `SUCCESS` state even if warnings occurred.

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
