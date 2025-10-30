---
title: Managing retries, restarts and replays with subflow executions
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Concepts
---

How to configure your flows so that failed subflow executions resume correctly without rerunning successful tasks.

---

When working with subflows, it’s important to understand the difference between retries at the **Subflow task level** and retries at the **flow level** within the subflow. This guide explains how to manage retries, restarts, and replays in subflow executions to avoid unnecessary re-execution of completed tasks.

## Flow-level vs. Subflow-level retries

### Subflow task-level retry

When you define a retry on the `Subflow` task, it controls how the **Subflow task** itself is retried within the parent flow. For example:

```yaml
id: parent_flow
namespace: company.team

tasks:
  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    namespace: company.team
    flowId: my_subflow
    wait: true
    retry:
      type: constant
      maxAttempts: 3
      interval: PT1S
````

In this case, the retry applies to the `Subflow` task in the parent flow. When the task fails, the entire subflow execution is retried from the beginning. This means all subflow tasks will re-run within each retried execution, including tasks that already succeeded.

### Flow-level retry inside the subflow

To retry the execution from **failed task** within a subflow (without rerunning tasks that already succeeded), configure the `retry` property **on the subflow flow definition**, not on the Subflow task. This allows the subflow execution to restart from the failed task rather than from the start.

Example:

```yaml
id: my_subflow
namespace: company.team

retry:
  maxAttempts: 3
  behavior: RETRY_FAILED_TASK
  type: constant
  interval: PT1S

tasks:
  - id: start
    type: io.kestra.plugin.core.log.Log
    message: This task will succeed and won't be retried

  - id: fail
    type: io.kestra.plugin.core.execution.Fail
    runIf: "{{ randomInt(lower=0, upper=2) == 1 }}"
    errorMessage: Bad value returned!

  - id: end
    type: io.kestra.plugin.core.log.Log
    message: This task will only run if the fail task succeeds
```

When this flow fails, only the failed task (`fail` in this example) will be retried. Tasks that already succeeded (`start`) will not run again.

## Recommended configuration

In most cases, you should:

* Define **`retry`** at the **flow level inside the subflow** (not on the Subflow task)
* Use **`behavior: RETRY_FAILED_TASK`** to resume from the failed task (recommended to avoid rerunning tasks that already succeeded)
* Use **`behavior: CREATE_NEW_EXECUTION`** ONLY if you want to always restart the subflow execution from the beginning.

### Example: Parent flow calling a subflow

```yaml
id: my_parent_flow
namespace: company.team

tasks:
  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    namespace: company.team
    flowId: my_subflow
    wait: true

  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Success
```

When `my_subflow` is configured with `behavior: RETRY_FAILED_TASK`, it automatically restarts from the failed task during retries. The parent flow does not need additional configuration.

## Replays and restarts

* **Replay**: You can replay the parent execution from the failed subflow task if the subflow defines `behavior: RETRY_FAILED_TASK`.
* **Restart**: When you restart the parent execution where a subflow task failed from the UI or API, this will restart the entire child execution from the beginning (regardless of the subflow task definition), unless the subflow YAML defines `behavior: RETRY_FAILED_TASK` as flow-level retry configuration.

## Summary

* Use **flow-level retry** inside the subflow for fine-grained restart control.
* Use **`behavior: RETRY_FAILED_TASK`** to continue from the failed task.
* Avoid configuring conflicting retry behaviors between parent and subflow.
* Use subflow task retries only if you want to **create an entirely new subflow execution** in each retry attempt - when `retry` is defined on the `Subflow`-task level, it will **always** create an entirely new execution from start rather than restarting the existing child execution from failed task, regardless of the `behavior` configured on the flow-level in the subflow.

