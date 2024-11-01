---
title: Multiple Condition Listener
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Workflow Components
---

How to set up a Flow to only trigger when multiple conditions are met.

## Introduction

In this tutorial, we’ll explore how to set up a flow in Kestra that only triggers when multiple conditions are met. Specifically, we will create a flow that only executes if two other flows, `multiplecondition-flow-a` and `multiplecondition-flow-b`, have executed successfully within the last 24 hours.

## Why Use Multiple Condition Listeners?

The `MultipleCondition` listener allows you to build more complex workflows that depend on the success of several flows. For example, if you have two dependent tasks or processes that need to succeed before triggering another process, this listener ensures that the next workflow is only executed when both conditions are met within a specific time window.

## Activation Process Overview

The listener will trigger under the following conditions:

1. Both `multiplecondition-flow-a` and `multiplecondition-flow-b` must have successful executions.
2. The listener checks if both flows succeeded within the last 24 hours.
3. If the conditions are met, the flow is activated, and the conditions reset.
4. Future executions will only re-trigger the flow if both flows succeed again within another 24-hour window.

## How the Process Works

1. Time Window (P1D or 24 hours):

   - The `MultipleCondition` listener checks if both flows (`multiplecondition-flow-a` and `multiplecondition-flow-b`) have been executed successfully within the past 24 hours.

2. Resetting Conditions:

   - Once the listener triggers, the conditions reset, meaning that even if one of the flows succeeds again, the listener won't trigger until both flows succeed within a new 24-hour period.

3. Flow Dependency:
   - This is particularly useful when you have flows that depend on each other or when the successful execution of multiple workflows is a prerequisite for a downstream task.

## First Flow: `multiplecondition_flow_a`

This is the first flow that the listener will check for success.

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

This flow is a simple one that returns the execution ID as output. The listener checks whether this flow has executed successfully within the past 24 hours.

## Second Flow: multiplecondition_flow_b

This is the second flow that the listener will check for success.

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

Just like `multiplecondition_flow_a`, this flow also returns its execution ID. The listener will wait for both this and the first flow to succeed before activating the final flow.

## Final Flow with Trigger: `multiplecondition_listener`

The final flow is where we define the trigger that listens to both `multiplecondition_flow_a` and `multiplecondition_flow_b`.

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

## Explanation of the Flow

1. Tasks Section:


    - The task `only_listener` simply outputs a static value (`children`) when the trigger conditions are met. This part can be customized to perform more complex tasks after the conditions are satisfied.

2. Triggers Section:


    - The `multiple_listen_flow` trigger listens for both `multiplecondition_flow_a` and `multiplecondition_flow_b`.
    - Execution Status Condition: Ensures that only successful executions (status `SUCCESS`) are considered.
    - MultipleCondition: This condition checks that both `flow_a` and `flow_b` have successfully completed within the last 24 hours (`P1D`).

3. Window:


    - The `window: P1D` ensures that the listener checks for executions within the past 24 hours.
    - The `windowAdvance: P0D` parameter ensures that the time window starts immediately, without any delay.

## Expected Output

When both multiplecondition_flow_a and multiplecondition_flow_b succeed within 24 hours, the listener will trigger multiplecondition_listener, and you will see output similar to this:

 `only listener > children`

## Common Pitfalls and Troubleshooting

  1. **Conditions Not Met**:  
    If the flow doesn't trigger, ensure both `multiplecondition_flow_a` and `multiplecondition_flow_b` have completed successfully within the time window.

  2. **Incorrect Output Reference**:  
    Double-check the flow IDs and namespaces to make sure the trigger is referencing the correct flows.

## Conclusion

In this tutorial, we’ve demonstrated how to set up a `MultipleCondition` listener that checks for the success of multiple flows within a specified time window. This is a powerful feature for managing complex workflows that depend on the successful execution of multiple tasks.

By using this listener, you can ensure that downstream processes are only triggered when all necessary upstream conditions are met.