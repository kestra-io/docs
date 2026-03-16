---
title: Finally Tasks in Kestra – Always-Run Cleanup
description: Ensure cleanup with Finally tasks in Kestra. Execute specific tasks at the end of a flow regardless of success or failure, perfect for resource teardown.
sidebarTitle: Finally
icon: /src/contents/docs/icons/flow.svg
version: "0.21.0"
---

Define a block of tasks that always run at the end of a flow, regardless of task status.

## Finally tasks – always-run cleanup

`finally` tasks are useful for cleanup operations that must run at the end of your flow, whether the execution ends in success or failure.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/os9_WY4-9o8?si=cB0c1HksxZtDQ5GB" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## `finally` component

`finally` is a block of tasks that execute at the end of your workflow, regardless of the status of prior tasks. This ensures cleanup or teardown steps always occur, no matter how the flow ends.

For example, you might use a `finally` block to turn off a cloud service when the flow finishes, regardless of the outcome.

:::alert{type="info"}
Note that `finally` tasks run while the execution is still `RUNNING`. If you need to trigger tasks after an execution finishes with a specific status (`SUCCESS` or `FAILED`), use the [`afterExecution` property](../20.afterexecution/index.md).
:::

## `finally` vs `errors`

`finally` and `errors` can both run near the end of a flow, but they are meant for different jobs.

- Use `finally` for cleanup and teardown that must happen every time.
- Use `errors` for failure-specific handling such as alerts, remediation, or fallback actions.

Unlike `errors`, `finally` is not tied to a failure path. It runs whether the flow succeeds or fails, and it runs while the execution is still in the `RUNNING` state.

For failure-specific handling, including local handlers inside flowable tasks, see the [`errors` documentation](../11.errors/index.md). For post-run actions based on the final execution state, see the [`afterExecution` documentation](../20.afterexecution/index.md).


## `finally` example

In the example below, one task is designed to fail, and an `errors` task logs a message to signal the failure. The `finally` task still runs after the other tasks finish. Here it logs another message, but in practice it could be used to shut down resources started for the flow.

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

If you change the example so the first task succeeds, as shown below, the `finally` task still runs in the same way:

```yaml

id: finally_example
namespace: company.team

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    errorMessage: "This flow executes successfully!"

errors:
  - id: send_alert
    type: io.kestra.plugin.core.log.Log
    message: alert on failure

finally:
- id: cleanup_task
  type: io.kestra.plugin.core.log.Log
  message: cleaning up resources
```

As in the first example, the `finally` task runs at the end even though the `errors` task does not send an alert, ensuring cleanup still happens regardless of status.

Beyond simple cleanup, `finally` can manage external services. For example, you might spin up Redis, Elasticsearch, or Kafka to run queries or QA checks, and then ensure the service is stopped when the flow ends. The following example shows how to start a Redis Docker container, run some database operations, and then stop the container when the flow finishes.

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
    url: "redis://:redis@{{vars.host}}:6379/0"
    key: "key_string_{{execution.id}}"
    value: "{{flow.id}}"
    serdeType: STRING

  - id: get
    type: io.kestra.plugin.redis.string.Get
    url: "redis://:redis@{{vars.host}}:6379/0"
    key: "key_string_{{execution.id}}"
    serdeType: STRING

  - id: assert
    type: io.kestra.plugin.core.execution.Assert
    errorMessage: "Invalid get data {{outputs.get}}"
    conditions:
      - "{{outputs.get.data == flow.id}}"

  - id: delete
    type: io.kestra.plugin.redis.string.Delete
    url: "redis://:redis@{{vars.host}}:6379/0"
    keys:
      - "key_string_{{execution.id}}"

  - id: getAfterDelete
    type: io.kestra.plugin.redis.string.Get
    url: "redis://:redis@{{vars.host}}:6379/0"
    key: "key_string_{{execution.id}}"
    serdeType: STRING

  - id: assertAfterDelete
    type: io.kestra.plugin.core.execution.Assert
    errorMessage: "Invalid get data {{outputs.getAfterDelete}}"
    conditions:
      - "{{(outputs.getAfterDelete contains 'data') == false}}"

finally:
  - id: stop
    type: io.kestra.plugin.docker.Stop
    containerId: "{{outputs.start.taskRunner.containerId}}"
```

:::alert{type="info"}
Best practice: Use `finally` for cleanup and resource teardown, not for critical business logic. Business logic dependent on execution outcomes should use `errors` or `afterExecution`.
:::
