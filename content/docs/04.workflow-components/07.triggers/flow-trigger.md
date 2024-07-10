---
title: Flow Trigger
icon: /docs/icons/flow.svg
---

Trigger flows from another flow execution.

Flow triggers allows you to trigger a flow after another flow execution, enabling event-driven patterns.

```yaml
type: "io.kestra.plugin.core.trigger.Flow"
```

Kestra is able to trigger one flow after another one. This allows the chaining of flows without the need to update the base flows. With this capacity, you can break responsibility between different flows to different teams.

Check the [Flow trigger](/plugins/core/triggers/io.kestra.plugin.core.trigger.Flow) documentation for the list of all properties.

## Conditions

You can provide conditions to determine when your Flow should be executed. Along with the [core trigger conditions](index.md#conditions), you can use the following:

- [ExecutionFlowCondition](/plugins/core/conditions/io.kestra.plugin.core.condition.ExecutionFlowCondition)
- [ExecutionNamespaceCondition](/plugins/core/conditions/io.kestra.plugin.core.condition.ExecutionNamespaceCondition)
- [ExecutionLabelsCondition](/plugins/core/conditions/io.kestra.plugin.core.condition.executionlabelscondition)
- [ExecutionStatusCondition](/plugins/core/conditions/io.kestra.plugin.core.condition.ExecutionStatusCondition)
- [ExecutionOutputsCondition](/plugins/core/conditions/io.kestra.plugin.core.condition.executionoutputscondition)
- [ExpressionCondition](/plugins/core/conditions/io.kestra.plugin.core.condition.ExpressionCondition)

## Example

This flow will be triggered after each successful execution of the flow `io.kestra.tests.trigger-flow` and forward the `uri` output of the `my-task` task.
```yaml
id: trigger-flow-listener
namespace: company.team
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
        namespace: company.team
        flowId: trigger-flow
      - type: io.kestra.plugin.core.condition.ExecutionStatusCondition
        in:
          - SUCCESS
```
Parent flow:
```yaml
id: trigger-flow
namespace: company.team

tasks:
  - id: myTask
    type: io.kestra.plugin.core.http.Download
    uri: https://dummyjson.com/products
```



This flow will be triggered after the successful execution of both flows `flow-a` and `flow-b` during the current day. When the conditions are met, the counter is reset and can be re-triggered during the same day. See [MultipleCondition](/plugins/core/conditions/io.kestra.plugin.core.condition.MultipleCondition) for more details

```yaml
id: trigger-multiplecondition-listener
namespace: company.team

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
            namespace: company.team
            flowId: trigger-multiplecondition-flow-a
          flow-b:
            type: io.kestra.plugin.core.condition.ExecutionFlowCondition
            namespace: company.team
            flowId: trigger-multiplecondition-flow-b
```

Simply execute the two flows below to trigger `trigger-multiplecondition-listener`:
```yaml
id: trigger-multiplecondition-flow-a
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Trigger A
```

```yaml
id: trigger-multiplecondition-flow-b
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Trigger B
```