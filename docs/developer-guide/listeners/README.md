---
order: 8
---
# Listeners

Listeners are special tasks that can listen to the current flow and launch tasks from *outside the flow*.
The result of the tasks will not change the execution status. In most cases,  Listeners are used to send notifications or handle special end-task behavior that should not be considered as part of the main flow.


## Example

> A listener that sends a Slack notification for a failed task (this would require the slack plugin).

```yaml
listeners:
  - tasks:
      - id: mail
        type: org.kestra.task.notifications.slack.SlackExecution
        url: https://hooks.slack.com/services/XXX/YYY/ZZZ
    conditions:
      - type: org.kestra.core.models.listeners.types.ExecutionStatusCondition
        in:
          - FAILED
```


## Properties

### `conditions`
* **Type:** ==array==
* **SubType:** ==Condition==
* **Required:** ❌

> A list of [Conditions](../conditions) that must be validated in order to execute the listener `tasks`. If you don't provide any conditions, the listeners will always be executed.

### `tasks`
* **Type:** ==array==
* **SubType:** ==Task==
* **Required:** ❌

> A list of tasks that will be executed at the end of the flow. The status of these tasks will not impact the main execution and will not change the execution status even if they fail.
>
> You can use every tasks you need here, even [Flowable](../flowable).
> All task `id` must be unique for the whole flow even for main `tasks` and `errors`.


### `description`
* **Type:** ==string==
* **Required:** ❌

> Description for documentation, more details [here](../documentation/).
