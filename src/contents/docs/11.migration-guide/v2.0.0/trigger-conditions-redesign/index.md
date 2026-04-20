---
title: Trigger Conditions Redesign
sidebarTitle: Trigger Conditions Redesign
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The conditions list on triggers is deprecated in Kestra 2.0 in favor of a when Pebble expression. The preconditions property on Flow triggers is replaced by dependsOn and window.
---

Kestra 2.0 simplifies and unifies how trigger conditions are expressed.

- The `conditions` list on all triggers is **deprecated** in favor of a single `when` Pebble expression string.
- The `preconditions` property on Flow triggers is **deprecated** in favor of `dependsOn` (for upstream flow entries) and `window` (for time windows).
- Flow trigger outputs are now **scoped** by namespace and flow ID: `trigger.outputs.<namespace>.<flowId>.<key>`.
- Input rendering failures on Flow triggers now create a **`FAILED` execution** instead of silently dropping the event.

All deprecated properties remain functional in 2.0.0. Migrate at your earliest convenience to avoid a hard break when they are removed in a future release.

## `conditions` → `when` on all trigger types

### Schedule trigger: specific day of week

**Before**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.DayWeek
        dayOfWeek: MONDAY
```

**After**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
    when: "{{ dayOfWeek(trigger.date) == 'MONDAY' }}"
```

### Schedule trigger: weekends only

**Before**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 11 * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.Weekend
```

**After**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 11 * * *"
    when: "{{ isWeekend(trigger.date) }}"
```

### Schedule trigger: public holidays

**Before**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 11 * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.PublicHoliday
        country: FR
```

**After**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 11 * * *"
    when: "{{ isPublicHoliday(trigger.date, 'FR') }}"
```

### Schedule trigger: workdays only (not weekend, not public holiday)

**Before**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 11 * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.Not
        conditions:
          - type: io.kestra.plugin.core.condition.PublicHoliday
            country: FR
          - type: io.kestra.plugin.core.condition.Weekend
```

**After**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 11 * * *"
    when: "{{ not isWeekend(trigger.date) and not isPublicHoliday(trigger.date, 'FR') }}"
```

### Schedule trigger: first Monday of the month

**Before**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 11 * * 1"
    conditions:
      - type: io.kestra.plugin.core.condition.DayWeekInMonth
        dayOfWeek: MONDAY
        dayInMonth: FIRST
```

**After**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 11 * * 1"
    when: "{{ isDayWeekInMonth(trigger.date, 'MONDAY', 'FIRST') }}"
```

### Schedule trigger: date range

**Before**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/5 * * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.DateTimeBetween
        after: "2025-12-31T23:59:59Z"
        before: "2026-06-30T23:59:59Z"
```

**After**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/5 * * * *"
    when: "{{ trigger.date > '2025-12-31T23:59:59Z' and trigger.date < '2026-06-30T23:59:59Z' }}"
```

### Webhook trigger: filter by body or headers

**Before**

```yaml
triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: 4wjtkzwVGBM9yKnjm3yv8r
    conditions:
      - type: io.kestra.plugin.core.condition.Expression
        expression: "{{ trigger.body.hello == 'world' }}"
```

**After**

```yaml
triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: 4wjtkzwVGBM9yKnjm3yv8r
    when: "{{ trigger.body.hello == 'world' }}"
```

For the full list of Pebble calendar helper functions (`isWeekend`, `isPublicHoliday`, `isDayWeekInMonth`, etc.), see the [date and calendar helpers](../../../expressions/index.mdx#date-and-calendar-helpers) reference.

## `preconditions` → `dependsOn` on Flow triggers

The `preconditions` block is replaced by two top-level properties on the Flow trigger:

- `dependsOn` — a list of upstream flow entries that must all be satisfied.
- `window` — controls the time window over which upstream executions are accumulated.

### Single upstream flow

**Before**

```yaml
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
    preconditions:
      id: flows
      flows:
        - namespace: company.team
          flowId: extract
          states: [SUCCESS]
```

**After**

```yaml
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: extract
        namespace: company.team
        states: [SUCCESS]
```

### Multiple upstream flows with a deadline

**Before**

```yaml
triggers:
  - id: after_staging
    type: io.kestra.plugin.core.trigger.Flow
    preconditions:
      id: staging_deps
      timeWindow:
        type: DAILY_TIME_DEADLINE
        deadline: "09:00:00+01:00"
      flows:
        - namespace: company.team
          flowId: stg_sales
          states: [SUCCESS]
        - namespace: company.team
          flowId: stg_marketing
          states: [SUCCESS]
```

**After**

```yaml
triggers:
  - id: after_staging
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: stg_sales
        namespace: company.team
      - flowId: stg_marketing
        namespace: company.team
    window:
      deadline: "09:00:00+01:00"
```

The default `states` for a `dependsOn` entry is `[SUCCESS, WARNING]`. Specify `states` explicitly when you need a different set.

### Namespace-wide alerting (prefix matching)

**Before**

```yaml
triggers:
  - id: alert_on_failure
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatus
        in:
          - FAILED
          - WARNING
      - type: io.kestra.plugin.core.condition.ExecutionNamespace
        namespace: company
        comparison: PREFIX
```

**After**

```yaml
triggers:
  - id: alert_on_failure
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - states: [FAILED, WARNING]
        when: "{{ namespace | startsWith('company') }}"
```

### Label-based filtering

**Before**

```yaml
triggers:
  - id: after_prod
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatus
        in: [SUCCESS]
      - type: io.kestra.plugin.core.condition.ExecutionLabels
        labels:
          env: production
```

**After**

```yaml
triggers:
  - id: after_prod
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - namespace: company.team
        labels:
          env: production
        states: [SUCCESS]
```

### Conditional filtering with expressions

**Before**

```yaml
preconditions:
  id: my_filter
  where:
    - id: flow1
      filters:
        - field: NAMESPACE
          type: STARTS_WITH
          value: io.kestra.tests
        - field: EXPRESSION
          type: IS_TRUE
          value: "{{ labels.some == 'label' }}"
```

**After**

```yaml
dependsOn:
  - when: "{{ namespace | startsWith('io.kestra.tests') }}"
    states: [SUCCESS]
    labels:
      some: label
```

### Filtering on upstream execution outputs

**Before**

```yaml
conditions:
  - type: io.kestra.plugin.core.condition.ExecutionOutputs
    expression: "{{ outputs.row_count > 0 }}"
```

**After**

```yaml
dependsOn:
  - flowId: extract
    namespace: company.team
    when: "{{ outputs.row_count > 0 }}"
```

### Filtering on retry attempts

**Before**

```yaml
triggers:
  - id: after_flaky
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.HasRetryAttempt
```

**After**

```yaml
triggers:
  - id: after_flaky
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: flaky_pipeline
        namespace: company.team
        states: [SUCCESS]
        when: "{{ hasRetryAttempt == true }}"
```

### Mixed triggers: success and failure on the same upstream flow

**Before**

```yaml
triggers:
  - id: on_completion
    type: io.kestra.plugin.core.trigger.Flow
    states: [SUCCESS]
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionFlow
        namespace: company.team
        flowId: flow_a
  - id: on_failure
    type: io.kestra.plugin.core.trigger.Flow
    states: [FAILED]
    preconditions:
      id: flowsFailure
      flows:
        - namespace: company.team
          flowId: flow_a
          states: [FAILED]
```

**After**

```yaml
triggers:
  - id: on_completion
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: flow_a
        namespace: company.team
        states: [SUCCESS]
  - id: on_failure
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: flow_a
        namespace: company.team
        states: [FAILED]
```

## Scoped trigger outputs

In Kestra 2.0, Flow trigger outputs are scoped by namespace and flow ID to prevent key collisions when multiple upstream flows are involved.

**Before** (flat map, all upstream outputs merged together)

```yaml
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
    inputs:
      date: "{{ trigger.outputs.date }}"
    preconditions:
      id: flows
      flows:
        - namespace: company.team
          flowId: extract
          states: [SUCCESS]
```

**After** (scoped by namespace, then flow ID)

```yaml
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
    inputs:
      date: "{{ trigger.outputs.company.team.extract.date }}"
    dependsOn:
      - flowId: extract
        namespace: company.team
```

The new path format is: `trigger.outputs.<namespace>.<flowId>.<outputKey>`

:::alert{type="warning"}
This is a breaking change for any flow that reads from `trigger.outputs` without a namespace and flow ID prefix. Update all such expressions when migrating to Kestra 2.0.
:::

## Silent failures → FAILED executions

Previously, if the `inputs` expression on a Flow trigger failed to render (for example, because an upstream output key did not exist), the trigger silently dropped the event and no execution was created. In Kestra 2.0, a `FAILED` execution is created instead. This makes failures visible in the Kestra UI and allows you to configure downstream alerting.

No migration action is required. Review your Flow trigger `inputs` expressions and ensure they reference valid output keys to avoid unexpected `FAILED` executions after upgrading.

## Stable condition IDs

`dependsOn` condition IDs are now derived from a stable hash of each entry's `namespace`, `flowId`, `when`, `states`, and `labels`. Previously, condition IDs were auto-incremented (`condition_1`, `condition_2`, …) and reordering entries would reset the accumulated window state. No action is required.

## Migration steps

1. **Search your flows for `conditions:` on trigger blocks** and replace each with an equivalent `when:` Pebble expression. Use the before/after examples above as a reference.
2. **Search your flows for `preconditions:` on Flow triggers** and replace with `dependsOn:` and (if applicable) `window:`.
3. **Update `trigger.outputs` references** from `trigger.outputs.<key>` to `trigger.outputs.<namespace>.<flowId>.<key>`.
4. **Validate** by saving the updated flows in the Kestra UI or via the API and confirming that they parse without warnings.

:::alert{type="warning"}
Both `conditions` and `preconditions` will be removed in a future release. Flows that still use them will fail to parse after the aliases are dropped.
:::
