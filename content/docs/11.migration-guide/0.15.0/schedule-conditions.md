---
title: Schedule Conditions
icon: /docs/icons/migration-guide.svg
release: 0.15.0
---

The `scheduleConditions` property of `Schedule` trigger is deprecated. Instead, use `conditions` to define custom scheduling conditions.

This change is implemented in a non-breaking way, so you don't need to immediately change your existing flows in order to successfully migrate to 0.15.0. However, we recommend using the `conditions` property at least for new flows. The `scheduleConditions` property will be removed in the future.

::alert{type="info"}
All you need to do is to rename `scheduleConditions` to `conditions` in your flow configuration — no other changes are required.
::

## Behavior before Kestra 0.15.0

To make the change clear, here is how scheduling conditions were defined before Kestra 0.15.0:

```yaml
id: beverage_order
namespace: company.team

inputs:
  - name: beverage
    type: STRING
    defaults: coffee

tasks:
  - id: order_beverage
    type: io.kestra.plugin.core.http.Request
    uri: https://reqres.in/api/products
    method: POST
    contentType: application/json
    formData:
      beverage: "{{inputs.beverage}}"

  - id: set_labels
    type: io.kestra.plugin.core.execution.Labels
    labels:
      date: "{{trigger.date ?? execution.startDate | date('yyyy-MM-dd')}}"
      beverage: "{{inputs.beverage}}"

triggers:
  - id: workday
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
    scheduleConditions:
      - type: io.kestra.plugin.core.condition.NotCondition
        conditions:
          - type: io.kestra.plugin.core.condition.WeekendCondition
  - id: weekend
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 20 * * *"
    scheduleConditions:
      - type: io.kestra.plugin.core.condition.WeekendCondition
    inputs:
      beverage: beer
```

The above flow has two triggers, `workday` and `weekend`.
1. The `workday` trigger is scheduled to run on workdays to order a coffee at 9 am.
2. The `weekend` trigger is scheduled to run on weekends to order a beer at 8 pm.


## Behavior after Kestra 0.15.0

Here is the same flow with the `scheduleConditions` property replaced by `conditions`:

```yaml
id: beverage_order
namespace: company.team

inputs:
  - id: beverage
    type: STRING
    defaults: coffee

tasks:
  - id: order_beverage
    type: io.kestra.plugin.core.http.Request
    uri: https://reqres.in/api/products
    method: POST
    contentType: application/json
    formData:
      beverage: "{{inputs.beverage}}"

  - id: set_labels
    type: io.kestra.plugin.core.execution.Labels
    labels:
      date: "{{trigger.date ?? execution.startDate | date('yyyy-MM-dd')}}"
      beverage: "{{inputs.beverage}}"

triggers:
  - id: workday
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.NotCondition
        conditions:
          - type: io.kestra.plugin.core.condition.WeekendCondition

  - id: weekend
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 20 * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.WeekendCondition
    inputs:
      beverage: beer
```
