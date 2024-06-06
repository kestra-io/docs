---
title: Flow Trigger
icon: /docs/icons/flow.svg
---

## Flow Trigger

Flow triggers allows you to trigger a flow after another flow execution, enabling event-driven patterns.

```yaml
type: "io.kestra.plugin.core.trigger.Flow"
```

Kestra is able to trigger one flow after another one. This allows the chaining of flows without the need to update the base flows. With this capacity, you can break responsibility between different flows to different teams.

Check the [Flow trigger](/plugins/core/triggers/io.kestra.plugin.core.trigger.Flow) documentation for the list of all properties.

::collapse{title="Example"}

This flow will be triggered after each successful execution of the flow `io.kestra.tests.trigger-flow` and forward the `uri` output of the `my-task` task.
```yaml
id: trigger-flow-listener
namespace: io.kestra.tests
revision: 1

inputs:
  - id: fromParent
    type: STRING

tasks:
  - id: onlyNoInput
    type: io.kestra.plugin.core.debug.Return
    format: "v1: {{trigger.executionId}}"

triggers:
  - id: listenFlow
    type: io.kestra.plugin.core.trigger.Flow
    inputs:
      fromParent: '{{ outputs.myTask.uri }}'
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionFlowCondition
        namespace: io.kestra.tests
        flowId: trigger-flow
      - type: io.kestra.plugin.core.condition.ExecutionStatusCondition
        in:
          - SUCCESS
```

> This flow will be triggered after the successful execution of both flows `flow-a` and `flow-b` during the current day. When the conditions are met, the counter is reset and can be re-triggered during the same day. See [MultipleCondition](/plugins/core/conditions/io.kestra.plugin.core.condition.MultipleCondition) for more details
```yaml
id: trigger-multiplecondition-listener
namespace: io.kestra.tests

tasks:
  - id: onlyListener
    type: io.kestra.plugin.core.debug.Return
    format: "let's go "

triggers:
  - id: multipleListenFlow
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - id: multiple
        type: io.kestra.plugin.core.condition.MultipleCondition
        window: P1D
        windowAdvance: P0D
        conditions:
          flow-a:
            type: io.kestra.plugin.core.condition.ExecutionFlowCondition
            namespace: io.kestra.tests
            flowId: trigger-multiplecondition-flow-a
          flow-b:
            type: io.kestra.plugin.core.condition.ExecutionFlowCondition
            namespace: io.kestra.tests
            flowId: trigger-multiplecondition-flow-b

```
::