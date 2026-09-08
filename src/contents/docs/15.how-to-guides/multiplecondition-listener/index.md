---
title: "MultipleCondition Listener in Kestra: How It Works"
h1: Trigger Flows When Multiple Conditions Are Met
description: Configure MultipleCondition triggers in Kestra to start flows only when multiple conditions are met for precise event-driven orchestration.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Workflow Components
---

How to set up a flow that only triggers when multiple upstream flows have all succeeded.

In this guide, we’ll create a flow that only executes if two other flows, `multiplecondition_flow_a` and `multiplecondition_flow_b`, have each completed successfully within the last 24 hours. This pattern uses the `dependsOn` property on the Flow trigger.

## When to use this pattern

Use multiple upstream dependencies when a downstream process should only run after several independent upstream flows all succeed. For example, if you have separate ingestion flows for different data sources and want to run a transformation only after all sources have completed, `dependsOn` with a time window is the right tool.

## How it works

1. Both `multiplecondition_flow_a` and `multiplecondition_flow_b` must complete successfully.
2. Both must complete within the same 24-hour window (`window.every: P1D`).
3. Once both conditions are satisfied, the listener flow triggers.
4. The window resets each day, so both flows must succeed again within the next window to re-trigger the listener.

## First Flow: `multiplecondition_flow_a`

This is the first flow that the listener will check for success.

```yaml
id: multiplecondition_flow_a
namespace: company.team

description: |
  This flow will start `multiplecondition_listener` if `MultipleCondition` is validated

tasks:
  - id: only
    type: io.kestra.plugin.core.log.Log
    message: "from parents: {{ execution.id }}"
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
    type: io.kestra.plugin.core.log.Log
    message: "from parents: {{ execution.id }}"
```

Just like `multiplecondition_flow_a`, this flow also returns its execution ID. The listener will wait for both this and the first flow to succeed before activating the final flow.

## Final Flow with Trigger: `multiplecondition_listener`

The final flow is where we define the trigger that listens to both `multiplecondition_flow_a` and `multiplecondition_flow_b`.

```yaml
id: multiplecondition_listener
namespace: company.team

description: |
  This flow starts only if `multiplecondition_flow_a` and `multiplecondition_flow_b` both succeed within the same 24-hour window.

tasks:
  - id: only_listener
    type: io.kestra.plugin.core.log.Log
    message: "children"

triggers:
  - id: multiple_listen_flow
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: multiplecondition_flow_a
        namespace: company.team
        states: [SUCCESS]
      - flowId: multiplecondition_flow_b
        namespace: company.team
        states: [SUCCESS]
    window:
      every: P1D
```

## Explanation of the flow

1. **Tasks** — `only_listener` outputs a static value when the trigger fires. Replace this with whatever downstream logic you need.

2. **`dependsOn`** — declares two upstream flow dependencies. Both entries must be satisfied before the trigger fires. `states: [SUCCESS]` means only successful executions count.

3. **`window.every: P1D`** — defines a 24-hour evaluation window. Kestra accumulates upstream executions within this window and fires the trigger once all `dependsOn` entries are satisfied within the same window period.

## Expected Output

When both multiplecondition_flow_a and multiplecondition_flow_b succeed within 24 hours, the listener will trigger multiplecondition_listener, and you will see output similar to this:

 `only listener > children`

## Common Pitfalls and Troubleshooting

  1. **Conditions Not Met**:
    If the flow doesn't trigger, ensure both `multiplecondition_flow_a` and `multiplecondition_flow_b` have completed successfully within the time window.

  2. **Incorrect Output Reference**:
    Verify the flow IDs and namespaces to ensure the trigger is referencing the correct flows.

## Conclusion

This guide demonstrated how to use `dependsOn` with a time window to trigger a flow only when multiple upstream flows all succeed within the same period. Use this pattern whenever a downstream process must wait on several independent upstream flows before running.
