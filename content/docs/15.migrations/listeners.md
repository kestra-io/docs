---
title: Deprecation of Listeners
---

Listeners are marked as deprecated and disabled by default starting from the 0.12.0 release. Please use [Flow triggers](../05.developer-guide/08.triggers/02.flow.md) instead. 

---

## Why listeners are deprecated

1. The listener is a **redundant** concept. Flow triggers allow you to do all that listeners can accomplish and more. The only difference between listeners and triggers is that listeners are defined inline within the same flow code and are, therefore, more tightly coupled with the flow. In contrast, a Flow trigger is defined in a separate independent flow that can simultaneously listen to the condition of multiple flows that satisfy specific `conditions`. This gives you more flexibility.
2. It is an extra concept that you, as a user, would need to learn even though you may not have to if you already know Flow triggers.
3. It's a hard-to-grasp concept — listeners can launch tasks *outside* of the flow, i.e., tasks that will not be considered part of the flow but are defined *within* it. Additionally, the results of listeners will not change the execution status of the flow, so having them defined within the flow has caused some confusion in the past.
4. Currently, listeners are mainly used to send failure (or success) notifications, and Kestra already has two concepts allowing you to do that: `triggers` and `errors`. Having **three** choices for such a standard use case has led to confusion about when to use which of them.


If you are using listeners and you are not ready to migrate to Flow triggers yet, add the following Kestra configuration option to still be able to use listeners:

```yaml
kestra:
  listeners:
    enabled: true
```

---

## Listeners :warning:

Here is an example of a fairly typical listener used to implement error notifications:

```yaml
id: alert_to_slack
namespace: prod.monitoring

tasks:
  - id: fail
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - exit 1


listeners:
  - tasks:
      - id: slack
        type: io.kestra.plugin.notifications.slack.SlackExecution
        url: "{{ secret('SLACK_WEBHOOK') }}"
        channel: "#general"
        executionId: "{{ execution.id }}"
    conditions:
      - type: io.kestra.core.models.conditions.types.ExecutionStatusCondition
        in:
          - FAILED
          - WARNING
```

This flow will fail and the listener tasks will be triggered anytime the flow reaches the specified execution status condition — here, the `FAILED` status. 

The next section shows how you can accomplish the same using Flow triggers.

---

## Flow trigger ✅

To migrate from a listener to a Flow trigger, create a new flow. Add a trigger of type `io.kestra.core.models.triggers.types.Flow` and move the condition e.g. `ExecutionStatusCondition` to the trigger conditions. Finally, move the list of tasks from listeners to `tasks` in the flow. 

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
    type: io.kestra.core.models.triggers.types.Flow
    conditions:
      - type: io.kestra.core.models.conditions.types.ExecutionStatusCondition
        in:
          - FAILED
          - WARNING

      - type: io.kestra.core.models.conditions.types.ExecutionFlowCondition
        namespace: prod
        flowId: demo
```

That flow trigger listens to the execution status of the following flow:

```yaml
id: demo
namespace: prod

tasks:
  - id: fail
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - exit 1
```

Anytime you execute that `demo` flow, the Slack notification will be sent, thanks to the Flow trigger. Additionally, the **Dependencies** tab of both flows will make it clear that they depend on each other.

---

## Side-by-side comparison

You can look at both a flow with a listener and a flow with a Flow trigger side by side to see the syntax difference:


![listeners-vs-flow-triggers](/docs/migrations/listeners-vs-flow-triggers.png)

If you still have questions about migrating from listeners to flow triggers, reach out via our [Community Slack](https://kestra.io/slack).

