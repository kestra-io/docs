---
order: 10
---
# Listeners

Listeners are special branches of a flow that can listen to the current flow and launch tasks *outside the flow*.
The result of a listener's tasks will not change the execution status of a flow.
The listener's tasks are run at the end of the flow.

Listeners are usually used to send notifications or handle special end-task behavior that should not be considered part of the main flow.


## Example

> A listener that sends a Slack notification for a failed task (this would require the slack plugin).

```yaml
listeners:
  - tasks:
      - id: mail
        type: io.kestra.plugin.notifications.slack.SlackExecution
        url: https://hooks.slack.com/services/XXX/YYY/ZZZ
    conditions:
      - type: io.kestra.core.models.conditions.types.ExecutionStatusCondition
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
> You can use every tasks you need here, even [Flowable](../tasks/README.md#flowable-tasks).
> All task `id` must be unique for the whole flow even for main `tasks` and `errors`.


### `description`
* **Type:** ==string==
* **Required:** ❌

> Description for documentation, more details [here](../documentation/).
