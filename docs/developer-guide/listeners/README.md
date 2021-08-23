---
order: 8
---
# Listeners

Listeners are special task that can listen to the current flow and launch task *outside the flow*.
The result of the tasks will not change the execution status. Mostly Listeners are here to send notifications or handle special end task behaviour that you don't want to be considered as main workflow.


## Example

> A listeners that will send a Slack notification on failed tasks (you need to install the slack plugins)

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

> A list of [Conditions](../conditions) that must be validated in order to execute `tasks`. If you don't provide any conditions, the listeners will always be executed

### `tasks`
* **Type:** ==array==
* **SubType:** ==Task==
* **Required:** ❌

> A list of tasks that will be executed and the end of the flows. The status of this tasks will not impact the main execution and will not changed the execution status even if they failed.
>
> You can use every tasks you need here, even [Flowable](../flowable)
> All task `id` must be unique for the whole flow even for main `tasks` and `errors`.


### `description`
* **Type:** ==string==
* **Required:** ❌

> Description for documentation, more details [here](../documentation/)