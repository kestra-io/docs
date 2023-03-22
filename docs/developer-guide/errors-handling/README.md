---
order: 7
---
# Errors and retries

## Errors handling
Errors are special branches of your flow where you can define how to handle task failures.

Two kinds of error handlers can be defined:
* **Global**: error handling global to a flow that must be at the root of the flow.
* **Local**: error handling local to a [Flowable Task](../tasks/README.md#flowable-tasks), will handle errors for the flowable task and its children.


### Global Error Handler

This flow example has a single Bash task that fails immediately.
The global error handler will then be called so the `2nd` task will run.

```yaml
id: errors
namespace: io.kestra.tests

tasks:
  - id: failed
    type: io.kestra.core.tasks.scripts.Bash
    commands:
      - exit 1
errors:
  - id: 2nd
    type: io.kestra.core.tasks.log.Log
    message: I'm failing {{task.id}}
    level: INFO
```


### Local Error Handler

In this flow example, the error branch will be used **only** if a child of the task `t2` has an error. If the task `t1` failed, the error branch would not be used. 

This can be useful to restrict error handling for a specific part of the flow and perform specific tasks like resource cleanup. 

```yaml
id: errors
namespace: io.kestra.tests

tasks:
  - id: parent-seq
    type: io.kestra.core.tasks.flows.Sequential
    tasks:
      - id: t1
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
      - id: t2
        type: io.kestra.core.tasks.flows.Sequential
        tasks:
          - id: t2-t1
            type: io.kestra.core.tasks.scripts.Bash
            commands:
              - 'exit 1'
        errors:
          - id: error-t1
            type: io.kestra.core.tasks.debugs.Return
            format: "Error Trigger ! {{task.id}}"
```

## Retries

Kestra provides a task retry feature. This makes it possible to add retry behavior for any task **failed run** based on configurations in the flow description.

A retry on a task run will create a new task attempt.

### Example

The following example defines a retry for the `retry-sample` task with a maximum of 5 attempts every 15 minutes:

```yaml
- id: retry-sample
  type: io.kestra.core.tasks.log.Log
  message: my output for task {{task.id}}
  timeout: PT10M
  retry:
    maxAttempt: 5
    type: constant
    interval: PT15M
```

### Retry options for all retry types

| name | type | description |
| ---------- | ----------- | ----------- |
|`type`|`string`|Retry behavior to apply. Can be one of `constant`, `exponential`, `random`.|
|`maxAttempt`|`integer`|Number of retries performed before the system stops retrying.|
|`maxDuration`|`Duration`|Maximum delay the execution is retried. Once passed, the task is no more processed.|
|`warningOnRetry`|`Boolean`|Flag the execution as warning if any retry was done on this task. Default `false`.|

### Duration

Some options above have to be filled with a duration notation.
Durations are expressed in [ISO 8601 Durations](https://en.wikipedia.org/wiki/ISO_8601#Durations), here are some examples :

| name | description |
| ---------- | ----------- |
|PT0.250S|250 milliseconds delay|
|PT2S|2 seconds delay|
|PT1M|1 minute delay|
|PT3.5H|3 hours and a half delay|


### Retry types


#### `constant`
This establishes constant retry times: if the `interval` property is set to 10 minutes, it retries every 10 minutes.

| name | type | description |
| ---------- | ----------- | ----------- |
|`interval`|`Duration`|Duration between each retry.|

#### `exponential`
This establishes retry behavior that waits longer between each retry e.g. 1s, 5s, 15s, ...

| name | type | description |
| ---------- | ----------- | ----------- |
|`interval`|`Duration`|Duration between each retry.|
|`maxInterval`|`Duration`|Max Duration between each retry.|
|`delayFactor`|`Double`|Multiplier for the `interval` on between retry, default is 2. For example, with an interval of 30s and a delay factor of 2, retry will append at 30s, 1m30, 3m30, ... |

#### `random`
This establishes retries with a random delay within minimum and maximum limits.

| name | type | description |
| ---------- | ----------- | ----------- |
|`minInterval`|`Duration`|Minimal duration between each retry.|
|`maxInterval`|`Duration`|Maximum duration between each retry.|
