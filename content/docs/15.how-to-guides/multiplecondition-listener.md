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

You need the two flows [multiplecondition-flow-a](/examples/flows_multiplecondition-flow-a.yml) and [multiplecondition-flow-b](/examples/flows_multiplecondition-flow-b.yml) for it to work.

```yaml file=public/examples/flows_multiplecondition-listeners.yml
```