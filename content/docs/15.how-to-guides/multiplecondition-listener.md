---
title: Multiple Condition Listener
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Workflow Components
---

Use multiple condition listeners together.

This flow will start only if `multiplecondition-flow-a` and `multiplecondition-flow-b` are successful during the last 24h.

## Activation Process

* Both `multiplecondition-flow-a` and `multiplecondition-flow-b` must have executions in a success state.
* The trigger condition checks for these successful executions within the defined time window (P1D or 24 hours).
* If both flow executions meet the success condition within the time window, the flow is triggered.
* Once triggered, the conditions reset.
  * If `multiplecondition-flow-a` succeeds again, the trigger will not be reactivated immediately.
  The trigger will wait for a new execution of `multiplecondition-flow-b` within the next 24 hours following the success of `multiplecondition-flow-a`.
  Only when both conditions are met again within the specified time window will the flow be triggered once more.

You need the two flows for it to work:

```yaml
id: multiplecondition_flow_a
namespace: company.team

description: |
  This flow will start `multiplecondition_listener` if `MultipleCondition` is validated

tasks:
  - id: only
    type: io.kestra.plugin.core.debug.Return
    format: "from parents: {{ execution.id }}"
```

And the second one:

```yaml
id: multiplecondition_flow_b
namespace: company.team

description: |
  This flow will start `multiplecondition_listener` if `MultipleCondition` is validated

tasks:
  - id: only
    type: io.kestra.plugin.core.debug.Return
    format: "from parents: {{ execution.id }}"
```

Finally, the flow with a trigger that listens to the two flows:~~~~

```yaml
id: multiplecondition_listener
namespace: company.team

description: |
  This flow will start only if `multiplecondition_flow_a` and `multiplecondition_flow_b` are successful during the last 24h.

tasks:
  - id: only_listener
    type: io.kestra.plugin.core.debug.Return
    format: "children"

triggers:
  - id: multiple_listen_flow
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatusCondition
        in:
          - SUCCESS
      - id: multiple
        type: io.kestra.plugin.core.condition.MultipleCondition
        window: P1D
        windowAdvance: P0D
        conditions:
          flow_a:
            type: io.kestra.plugin.core.condition.ExecutionFlowCondition
            namespace: company.team
            flowId: multiplecondition_flow_a
          flow_b:
            type: io.kestra.plugin.core.condition.ExecutionFlowCondition
            namespace: company.team
            flowId: multiplecondition_flow_b
```