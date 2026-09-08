---
title: Finally Tasks in Kestra – Always-Run Cleanup
h1: Guarantee Cleanup at Flow End with Finally Tasks
description: Ensure cleanup with Finally tasks in Kestra. Execute specific tasks at the end of a flow regardless of success or failure, perfect for resource teardown.
sidebarTitle: Finally
icon: /src/contents/docs/icons/flow.svg
version: "0.21.0"
---

The `finally` block defines tasks that always run at the end of a flow — whether the execution succeeds, fails, or is killed — making it the right place for cleanup and resource teardown.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/os9_WY4-9o8?si=cB0c1HksxZtDQ5GB" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## `finally` vs `errors`

`finally` and `errors` both run near the end of a flow, but serve different purposes:

- Use `finally` for cleanup and teardown that must happen every time, regardless of outcome.
- Use `errors` for failure-specific handling such as alerts, remediation, or fallback actions.

`finally` tasks run while the execution is still `RUNNING`. If you need to react to a specific terminal state (`SUCCESS`, `FAILED`, etc.), use [`afterExecution`](../20.afterexecution/index.md) instead. For failure-specific handling including local handlers inside flowable tasks, see the [`errors` documentation](../11.errors/index.md).

## Examples

### Cleanup after a failed task

One task is designed to fail and the `errors` block sends an alert. The `finally` task runs regardless — here it logs a message, but in practice it would shut down any resources the flow started:

```yaml
id: finally_example
namespace: company.team

tasks:
  - id: fail
    type: io.kestra.plugin.core.execution.Fail
    errorMessage: Test downstream tasks

errors:
  - id: send_alert
    type: io.kestra.plugin.core.log.Log
    message: alert on failure

finally:
  - id: cleanup_task
    type: io.kestra.plugin.core.log.Log
    message: cleaning up resources
```

### Cleanup after a successful task

When the task succeeds, `errors` is skipped but `finally` still runs:

```yaml
id: finally_example
namespace: company.team

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "This flow executes successfully!"

errors:
  - id: send_alert
    type: io.kestra.plugin.core.log.Log
    message: alert on failure

finally:
  - id: cleanup_task
    type: io.kestra.plugin.core.log.Log
    message: cleaning up resources
```

### Managing an external service

Use `finally` to guarantee a service is stopped even if the flow fails mid-run. The following flow starts a Redis container, runs operations against it, and stops the container in the `finally` block:

```yaml
id: dockerRedis
namespace: company.team

variables:
  host: host.docker.internal

tasks:
  - id: start
    type: io.kestra.plugin.docker.Run
    containerImage: redis
    wait: false
    portBindings:
      - "6379:6379"

  - id: sleep
    type: io.kestra.plugin.core.flow.Sleep
    duration: PT1S
    description: Wait for the Redis container to start

  - id: set
    type: io.kestra.plugin.redis.string.Set
    url: "redis://:redis@{{ vars.host }}:6379/0"
    key: "key_string_{{ execution.id }}"
    value: "{{ flow.id }}"
    serdeType: STRING

  - id: get
    type: io.kestra.plugin.redis.string.Get
    url: "redis://:redis@{{ vars.host }}:6379/0"
    key: "key_string_{{ execution.id }}"
    serdeType: STRING

  - id: assert
    type: io.kestra.plugin.core.execution.Assert
    errorMessage: "Invalid get data {{ outputs.get }}"
    conditions:
      - "{{ outputs.get.data == flow.id }}"

  - id: delete
    type: io.kestra.plugin.redis.string.Delete
    url: "redis://:redis@{{ vars.host }}:6379/0"
    keys:
      - "key_string_{{ execution.id }}"

  - id: getAfterDelete
    type: io.kestra.plugin.redis.string.Get
    url: "redis://:redis@{{ vars.host }}:6379/0"
    key: "key_string_{{ execution.id }}"
    serdeType: STRING

  - id: assertAfterDelete
    type: io.kestra.plugin.core.execution.Assert
    errorMessage: "Invalid get data {{ outputs.getAfterDelete }}"
    conditions:
      - "{{ (outputs.getAfterDelete contains 'data') == false }}"

finally:
  - id: stop
    type: io.kestra.plugin.docker.Stop
    containerId: "{{ outputs.start.taskRunner.containerId }}"
```
