---
order: 5
---
# Retries

Kestra provide some task retry feature. This sub system makes it convinient to add **failed executions** retry behavior depending on retry configuration in flow description.

::: tip note
When an execution is beeing retried, a new execution is generated with same exact input data that were used for current execution. It is entirely indemendent, however it is related to the retried execution with a `parentId` property in the new execution that references the retried execution id.
:::

## Exemple

Below a flow sample that retry execute a task on failure maximum 5 times each 15 minutes :

```yaml
- id: retry-sample
  type: org.kestra.core.tasks.debugs.Echo
  format: my output for task {{task.id}}
  timeout: 1000
  retry:
    maxAttempt: 5
    type: constant
    interval: PT15M
```

## Retry options

|name|type|description|
|-|-|-|
|maxAttempt|integer|Number of retries performed before the system stops retry.|
|maxDuration|duration|Maxium delay the execution is retried. Once passed, the task is no more processed|
|type|string|Retry behavior to apply. Can be one of `constant`, `exponential`, `random`.|
|interval|delay|Duration between each retry.|

### Duration

Some of the option above have to be filled with duration notation. Durations are expressed with the following forms:

|notation|description|
|-|-|
|PT0.250S|250 milliseconds delay|
|PT2S|2 seconds delay|
|PT1M|1 minute delay|
|PT3.5H|3 hours and a half delay|

### Retry types

|name|description|
|-|-|
|constant|Constant retry times, when time is set to 10 minutes it retries each 10 minutes|
|exponential|Retry behavior that waits longer between each retry e.g. 1s, 5s, 15s ...|
|random|Retry with random delay with min and max limits|