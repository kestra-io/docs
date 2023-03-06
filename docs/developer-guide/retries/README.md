---
order: 8
---
# Retries

Kestra provides a task retry feature. This makes it possible to add retry behavior for any task **failed run** based on configurations in the flow description.

A retry on a task run will create a new task attempt.


## Example

The following example defines a retry for the `retry-sample` task with a maximum of 5 attempts every 15 minutes:

```yaml
- id: retry-sample
  type: io.kestra.core.tasks.debugs.Echo
  format: my output for task {{task.id}}
  timeout: PT10M
  retry:
    maxAttempt: 5
    type: constant
    interval: PT15M
```
## Retry options for all retry types

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
