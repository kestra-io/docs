---
title: Flow trigger
---

```yaml
type: "io.kestra.core.models.triggers.types.Flow"
```

> Kestra is able to trigger one flow after another one. This allows the chaining of flows without the need to update the base flows.
  With this capacity, you can break responsibility between different flows to different teams.

## Example
> This flow will be triggered after each successful execution of the flow `io.kestra.tests.trigger-flow` and forward the `uri` output of the `my-task` task.
```yaml
id: trigger-flow-listener
namespace: io.kestra.tests
revision: 1

inputs:
  - name: fromParent
    type: STRING

tasks:
  - id: onlyNoInput
    type: io.kestra.core.tasks.debugs.Return
    format: "v1: {{trigger.executionId}}"

triggers:
  - id: listenFlow
    type: io.kestra.core.models.triggers.types.Flow
    inputs:
      fromParent: '{{ outputs.myTask.uri }}'
    conditions:
      - type: io.kestra.core.models.conditions.types.ExecutionFlowCondition
        namespace: io.kestra.tests
        flowId: trigger-flow
      - type: io.kestra.core.models.conditions.types.ExecutionStatusCondition
        in:
          - SUCCESS
```

> This flow will be triggered after the successful execution of both flows `flow-a` and `flow-b` during the current day. When the conditions are met, the counter is reset and can be re-triggered during the same day. See [MultipleCondition](../../../plugins/core/conditions/io.kestra.core.models.conditions.types.MultipleCondition.md) for more details
```yaml
id: trigger-multiplecondition-listener
namespace: io.kestra.tests

tasks:
  - id: onlyListener
    type: io.kestra.core.tasks.debugs.Return
    format: "let's go "

triggers:
  - id: multipleListenFlow
    type: io.kestra.core.models.triggers.types.Flow
    conditions:
      - id: multiple
        type: io.kestra.core.models.conditions.types.MultipleCondition
        window: P1D
        windowAdvance: P0D
        conditions:
          flow-a:
            type: io.kestra.core.models.conditions.types.ExecutionFlowCondition
            namespace: io.kestra.tests
            flowId: trigger-multiplecondition-flow-a
          flow-b:
            type: io.kestra.core.models.conditions.types.ExecutionFlowCondition
            namespace: io.kestra.tests
            flowId: trigger-multiplecondition-flow-b

```

## Properties and Outputs

Check the [Flow trigger](../../../plugins/core/triggers/io.kestra.core.models.triggers.types.Flow.md) documentation for the list of all properties.

## Variables

When another flow triggers the flow, some context variables will be injected to allow flow customization.

| Parameter | Description |
| ---------- | ----------- |
|  `{{ trigger.executionId }}` | the ID of the execution that triggers the current flow. |
|  `{{ trigger.namespace }}` | the namespace of the flow that triggers the current flow. |
|  `{{ trigger.flowId }}` | the ID of the flow that triggers the current flow. |
|  `{{ trigger.flowRevision }}` | the revision of the flow that triggers the current flow. |
