---
title: Deprecation of Listeners
icon: /docs/icons/migration-guide.svg
release: 0.12.0
---

Listeners are deprecated and disabled by default starting from the 0.12.0 release. Please use [Flow triggers](../../04.workflow-components/07.triggers/02.flow-trigger.md) instead.

## Why listeners are deprecated

1. The listener is a **redundant** concept. Flow triggers allow you to do all that listeners can accomplish and more. The only difference between listeners and triggers is that listeners are defined inline within the same flow code and are, therefore, more tightly coupled with the flow. In contrast, a Flow trigger is defined in a separate independent flow that can simultaneously listen to the condition of multiple flows that satisfy specific `conditions`. This gives you more flexibility.
2. It is an extra concept that you, as a user, would need to learn even though you may not have to if you already know Flow triggers.
3. It's a hard-to-grasp concept — listeners can launch tasks *outside* of the flow, i.e., tasks that will not be considered part of the flow but are defined *within* it. Additionally, the results of listeners will not change the execution status of the flow, so having them defined within the flow has caused some confusion in the past.
4. Currently, listeners are mainly used to send failure (or success) notifications, and Kestra already has two concepts allowing you to do that: `triggers` and `errors`. Having **three** choices for such a standard use case has led to confusion about when to use which of them.

If you are using listeners and you are not ready to migrate to Flow triggers yet, add the following Kestra configuration option to still be able to use listeners:

```yaml
kestra:
  listeners:
    enabled: true
```

Then, make sure to also add the following plugin defaults to your configuration to ensure that your conditions are working properly after the upgrade to any version after 0.12.0:

```yaml
kestra:
  tasks:
    defaults:
    - type: io.kestra.plugin.core.condition.DateTimeBetweenCondition
      values:
        date: "{{ now() }}"
    - type: io.kestra.plugin.core.condition.DayWeekCondition
      values:
        date: "{{ now(format="iso_local_date") }}"
    - type: io.kestra.plugin.core.condition.DayWeekInMonthCondition
      values:
        date: "{{ now(format="iso_local_date") }}"
    - type: io.kestra.plugin.core.condition.TimeBetweenCondition
      values:
        date: "{{ now(format='iso_offset_time') }}"
    - type: io.kestra.plugin.core.condition.WeekendCondition
      values:
        date: "{{ now(format='iso_local_date') }}"
```

Due to listeners' deprecation, we changed the default behavior of various `io.kestra.core.models.conditions`-type conditions to use the `{{trigger.date}}` as default value for the `date` property instead of using `"{{ now(format='iso_local_date') }}"`. To ensure that your conditions are working properly after the upgrade to any version after 0.12.0, you need to add the above plugin defaults to your Kestra configuration.

---

## Listeners :warning:

Here is an example of a fairly typical listener used to implement error notifications:

```yaml
id: alert_to_slack
namespace: prod.monitoring

tasks:
  - id: fail
    type: io.kestra.plugin.core.execution.Fail


listeners:
  - tasks:
      - id: slack
        type: io.kestra.plugin.notifications.slack.SlackExecution
        url: "{{ secret('SLACK_WEBHOOK') }}"
        channel: "#general"
        executionId: "{{ execution.id }}"
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatusCondition
        in:
          - FAILED
          - WARNING
```

This flow will fail and the listener tasks will be triggered anytime the flow reaches the specified execution status condition — here, the `FAILED` status.

The next section shows how you can accomplish the same using Flow triggers.

---

## Flow trigger ✅

To migrate from a listener to a Flow trigger, create a new flow. Add a trigger of type `io.kestra.plugin.core.trigger.Flow` and move the condition e.g. `ExecutionStatusCondition` to the trigger conditions. Finally, move the list of tasks from listeners to `tasks` in the flow.

The example below will explain it better than words:

```yaml
id: alert_to_slack
namespace: prod.monitoring

tasks:
  - id: slack
    type: io.kestra.plugin.notifications.slack.SlackExecution
    url: "{{ secret('SLACK_WEBHOOK') }}"
    channel: "#general"
    executionId: "{{trigger.executionId}}"


triggers:
  - id: execution_status_events
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatusCondition
        in:
          - FAILED
          - WARNING

      - type: io.kestra.plugin.core.condition.ExecutionFlowCondition
        namespace: prod
        flowId: demo
```

That flow trigger listens to the execution status of the following flow:

```yaml
id: demo
namespace: prod

tasks:
  - id: fail
    type: io.kestra.plugin.core.execution.Fail
```

Anytime you execute that `demo` flow, the Slack notification will be sent, thanks to the Flow trigger. Additionally, the **Dependencies** tab of both flows will make it clear that they depend on each other.

---

## Side-by-side comparison

You can look at both a flow with a listener and a flow with a Flow trigger side by side to see the syntax difference:

![listeners-vs-flow-triggers](/docs/migration-guide/listeners-vs-flow-triggers.png)

If you still have questions about migrating from listeners to flow triggers, reach out via our [Community Slack](/slack).

---

## Documentation of the deprecated feature

Listeners are special branches of a flow that can listen to the current flow and launch tasks *outside the flow*. The result of a listener's tasks will not change the execution status of a flow. The listener's tasks are run at the end of the flow.

Listeners are usually used to send notifications or handle special end-task behavior that should not be considered part of the main flow.

### Example listener

> A listener that sends a Slack notification for a failed task (this would require the Slack plugin).

```yaml
listeners:
  - tasks:
      - id: sendSlackAlert
        type: io.kestra.plugin.notifications.slack.SlackExecution
        url: https://hooks.slack.com/services/XXX/YYY/ZZZ
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatusCondition
        in:
          - FAILED
```

### Properties

**`conditions`**

* **Type:** ==array==
* **SubType:** ==Condition==
* **Required:** ❌

> A list of Conditions that must be validated in order to execute the listener `tasks`. If you don't provide any conditions, the listeners will always be executed.

**`tasks`**

* **Type:** ==array==
* **SubType:** ==Task==
* **Required:** ❌

> A list of tasks that will be executed at the end of the flow. The status of these tasks will not impact the main execution and will not change the execution status even if they fail.
>
> You can use every tasks you need here, even Flowable.
> All task `id` must be unique for the whole flow even for main `tasks` and `errors`.

**`description`**

* **Type:** ==string==
* **Required:** ❌

> Description for documentation.
