---
title: Trigger Conditions Redesign
sidebarTitle: Trigger Conditions Redesign
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The conditions list on triggers and the preconditions block on Flow triggers are removed in Kestra 2.0. All trigger types use a top-level when Pebble expression. Flow triggers also use dependsOn and window.
---

Kestra 2.0 replaces the `conditions` and `preconditions` system across all trigger types.

- **All trigger types (Schedule, Webhook, HTTP, Flow, and others)** — the `conditions` list is removed in favor of a top-level `when` Pebble expression.
- **Flow triggers** — both `conditions` and `preconditions` are removed in favor of `dependsOn` (upstream flow entries) and `window` (time window configuration).
- **Flow trigger outputs** — scoped by flow ID: `trigger.outputs.<flowId>.<key>`.
- **Input rendering failures** — now create a `FAILED` execution instead of silently dropping the event.

Both `conditions` and `preconditions` are removed in Kestra 2.0. Flows that still use them will fail to parse after upgrading.

## `conditions` → `when` on all triggers

All trigger types gain a top-level `when` property containing a Pebble expression. When the expression evaluates to `true`, the trigger fires; when `false`, it is skipped. This replaces the `conditions` list, which required a fully qualified Java type for every filtering need and did not compose cleanly across trigger types.

### `when` expression context

The variables available in a `when` expression depend on the trigger type:

| Trigger type | Available variables |
|---|---|
| Schedule | `trigger.date`, `trigger.timestamp` |
| Webhook | `trigger.body`, `trigger.headers` |
| Flow | `namespace`, `flowId`, `state`, `labels`, `outputs`, `hasRetryAttempt` |

:::alert{type="info"}
**Schedule date skipping:** When a Schedule trigger has a `when` expression, the scheduler evaluates it against each candidate date. If `when` evaluates to `false`, the scheduler skips that date and advances to the next cron-matching date. This is the same behavior as the previous `conditions` on Schedule triggers — `when` controls which scheduled dates fire, not just whether a single date fires.
:::

### New Pebble helper functions

These functions are introduced specifically for `when` expressions to replace verbose date formatting patterns:

| Function | Signature | Description |
|---|---|---|
| `isPublicHoliday` | `isPublicHoliday(date, countryCode[, subDivision])` | Returns `true` if the date is a public holiday. Backed by Jollyday. Optional third argument for sub-divisions (e.g. `'IDF'`). |
| `isDayWeekInMonth` | `isDayWeekInMonth(date, dayOfWeek, position)` | Returns `true` if the date is the Nth occurrence of a weekday in its month. `position` accepts `FIRST`, `SECOND`, `THIRD`, `FOURTH`, or `LAST`. |
| `isWeekend` | `isWeekend(date)` | Returns `true` if the date falls on Saturday or Sunday. |
| `isLastWorkingDay` | `isLastWorkingDay(date[, workingDays])` | Returns `true` if the date is the last working day of its month. Working days default to Monday–Friday. Optional second argument overrides which days count as working days. |
| `dayOfWeek` | `dayOfWeek(date)` | Returns the day name as a string (`MONDAY`, `TUESDAY`, …, `SUNDAY`). |
| `hourOfDay` | `hourOfDay(date)` | Returns the hour as an integer (0–23). |
| `dayOfMonth` | `dayOfMonth(date)` | Returns the day of the month as an integer (1–31). |
| `monthOfYear` | `monthOfYear(date)` | Returns the month as an integer (1–12). |

Existing Pebble filters (`startsWith`, `endsWith`, `date`) and operators (`and`, `or`, `not`, `==`, `!=`, `>`, `<`, `>=`, `<=`) cover the remaining use cases.

### Schedule: specific day of week

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

### Schedule: weekends only

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

### Schedule: weekdays only (exclude weekends)

**Before**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.Not
        conditions:
          - type: io.kestra.plugin.core.condition.Weekend
```

**After**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
    when: "{{ not isWeekend(trigger.date) }}"
```

### Schedule: exclude Sundays

**Before**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.Not
        conditions:
          - type: io.kestra.plugin.core.condition.DayWeek
            dayOfWeek: SUNDAY
```

**After**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
    when: "{{ dayOfWeek(trigger.date) != 'SUNDAY' }}"
```

### Schedule: public holidays

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

With a sub-division: `{{ isPublicHoliday(trigger.date, 'FR', 'IDF') }}`.

### Schedule: workdays only (not weekend, not public holiday)

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

### Schedule: first Monday of the month

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

### Schedule: date range

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

### Schedule: specific hours only

**Before**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 * * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.TimeBetween
        after: "08:00:00"
        before: "17:00:00"
```

**After**

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 * * * *"
    when: "{{ hourOfDay(trigger.date) >= 8 and hourOfDay(trigger.date) < 17 }}"
```

### Schedule: combining multiple conditions

**Before** (first Monday of the month, skip public holidays in France)

```yaml
triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 11 * * *"
    conditions:
      - type: io.kestra.plugin.core.condition.DayWeekInMonth
        dayOfWeek: MONDAY
        dayInMonth: FIRST
      - type: io.kestra.plugin.core.condition.Not
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
    when: "{{ isDayWeekInMonth(trigger.date, 'MONDAY', 'FIRST') and not isPublicHoliday(trigger.date, 'FR') }}"
```

### Webhook: filter by body

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

### Webhook: filter by header and body

**Before**

```yaml
triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: myKey
    conditions:
      - type: io.kestra.plugin.core.condition.Expression
        expression: "{{ trigger.headers['X-Event-Type'] == 'deploy' }}"
      - type: io.kestra.plugin.core.condition.Expression
        expression: "{{ trigger.body.environment == 'production' }}"
```

**After**

```yaml
triggers:
  - id: webhook
    type: io.kestra.plugin.core.trigger.Webhook
    key: myKey
    when: "{{ trigger.headers['X-Event-Type'] == 'deploy' and trigger.body.environment == 'production' }}"
```

Multiple `Expression` conditions combine into a single `when` expression using `and` / `or`.

### What replaces what

| Old condition type | New `when` expression |
|---|---|
| `DayWeek` (e.g. MONDAY) | `{{ dayOfWeek(trigger.date) == 'MONDAY' }}` |
| `Weekend` | `{{ isWeekend(trigger.date) }}` |
| `Not` > `Weekend` (weekdays only) | `{{ not isWeekend(trigger.date) }}` |
| `Not` > `DayWeek` SUNDAY (exclude Sundays) | `{{ dayOfWeek(trigger.date) != 'SUNDAY' }}` |
| `PublicHoliday` (country: FR) | `{{ isPublicHoliday(trigger.date, 'FR') }}` |
| `Not` > `PublicHoliday` + `Weekend` (workdays) | `{{ not isWeekend(trigger.date) and not isPublicHoliday(trigger.date, 'FR') }}` |
| `DayWeekInMonth` (MONDAY, FIRST) | `{{ isDayWeekInMonth(trigger.date, 'MONDAY', 'FIRST') }}` |
| `DateTimeBetween` (after/before) | `{{ trigger.date > '2025-12-31T23:59:59Z' and trigger.date < '2026-06-30T23:59:59Z' }}` |
| `TimeBetween` (08:00-17:00) | `{{ hourOfDay(trigger.date) >= 8 and hourOfDay(trigger.date) < 17 }}` |
| `Expression` (custom Pebble) | Direct `when` expression, no wrapper needed |
| `Expression` on webhook body/headers | `{{ trigger.body.field == 'value' }}` or `{{ trigger.headers['X-Key'] == 'value' }}` |
| Multiple `Expression` conditions | Combined with `and` / `or` in a single `when` |

For the full list of Pebble calendar helper functions (`isWeekend`, `isPublicHoliday`, `isDayWeekInMonth`, `isLastWorkingDay`, `hourOfDay`, etc.), see the [date and calendar helpers](../../../expressions/index.mdx#date-and-calendar-helpers) reference.

## `conditions` and `preconditions` → `dependsOn` on Flow triggers

Both `conditions` (execution-level types such as `ExecutionStatus`, `ExecutionFlow`, `ExecutionNamespace`) and `preconditions` (upstream flow lists with time windows) are replaced by a single `dependsOn` list. Each entry declares one upstream dependency with typed properties.

### `dependsOn` entry properties

| Property | Type | Default | Description |
|---|---|---|---|
| `flowId` | string | — | Exact flow ID to match. Omit to match any flow. |
| `namespace` | string | — | Exact namespace to match. Use `when` for prefix or pattern matching. |
| `states` | list | `[SUCCESS, WARNING]` | Execution states that satisfy this entry. |
| `labels` | map | — | Labels the upstream execution must carry (all must match). |
| `when` | string | — | Pebble expression for additional filtering on the upstream execution context. |

Both `flowId` and `namespace` use exact matching: `namespace: company.team` matches only `company.team`, not `company.team.project`. For prefix or pattern matching, use `when` with `startsWith` or `endsWith`.

:::alert{type="warning"}
The default `states` changed from `[SUCCESS, WARNING, PAUSED]` to `[SUCCESS, WARNING]`. If your flows relied on `PAUSED` being included by default, add it explicitly: `states: [SUCCESS, WARNING, PAUSED]`.
:::

### Single upstream flow

The `preconditions` block and the `conditions`-based approach both map to a single `dependsOn` entry.

**Before (from `preconditions`)**

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

**Before (from `conditions`)**

```yaml
triggers:
  - id: on_completion
    type: io.kestra.plugin.core.trigger.Flow
    states: [SUCCESS]
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionFlow
        namespace: company.team
        flowId: extract
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

`states` defaults to `[SUCCESS, WARNING]`. `window` moves to the trigger level. See [Window configuration](#window-configuration) for all window types and the `onMiss` property.

### Multiple upstream flows (from `multipleConditions`)

**Before**

```yaml
triggers:
  - id: multiple_listen_flow
    type: io.kestra.plugin.core.trigger.Flow
    multipleConditions:
      - id: multiple
        window: P1D
        windowAdvance: P0D
        conditions:
          flow_a:
            type: io.kestra.plugin.core.condition.ExecutionFlow
            namespace: company.team
            flowId: multiplecondition_flow_a
          flow_b:
            type: io.kestra.plugin.core.condition.ExecutionFlow
            namespace: company.team
            flowId: multiplecondition_flow_b
```

**After**

```yaml
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

The arbitrary string keys (`flow_a`, `flow_b`) are dropped — `dependsOn` is always a list. The `windowAdvance` property is removed with no direct equivalent.

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

`namespace` in `dependsOn` is an exact match. Use `when` with `startsWith` for prefix matching.

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
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
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
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - when: "{{ namespace | startsWith('io.kestra.tests') }}"
        states: [SUCCESS]
        labels:
          some: label
```

`labels` handles exact key-value matching declaratively. `when` handles everything else.

### Filtering on upstream execution outputs

**Before**

```yaml
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionOutputs
        expression: "{{ outputs.row_count > 0 }}"
```

**After**

```yaml
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
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

### Negation: trigger on any state except SUCCESS

**Before**

```yaml
triggers:
  - id: on_non_success
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.Not
        conditions:
          - type: io.kestra.plugin.core.condition.ExecutionStatus
            in: [SUCCESS]
```

**After (option 1 — explicit states)**

```yaml
triggers:
  - id: on_non_success
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: extract
        namespace: company.team
        states: [FAILED, WARNING, KILLED, CANCELLED]
```

**After (option 2 — `when` expression)**

```yaml
triggers:
  - id: on_non_success
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: extract
        namespace: company.team
        when: "{{ state != 'SUCCESS' }}"
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

Same `dependsOn` syntax regardless of whether the original used `conditions` or `preconditions`.

### Passing outputs downstream

Flow trigger outputs are now scoped by flow ID. The path format is `trigger.outputs.<flowId>.<outputKey>`.

**Before** (flat map — all upstream outputs merged together)

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

**After** (scoped by flow ID)

```yaml
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
    inputs:
      date: "{{ trigger.outputs.extract.date }}"
    dependsOn:
      - flowId: extract
        namespace: company.team
```

For multi-flow triggers, each upstream flow's outputs are accessed under its own key:

```yaml
dependsOn:
  - flowId: stg_sales
    namespace: company.team
  - flowId: stg_marketing
    namespace: company.team
```

Access as `{{ trigger.outputs.stg_sales.row_count }}` and `{{ trigger.outputs.stg_marketing.row_count }}`.

:::alert{type="warning"}
**Breaking change for multi-flow triggers.** Update all `trigger.outputs.<key>` references to `trigger.outputs.<flowId>.<key>`. For triggers with a single `dependsOn` entry, the unscoped form `{{ trigger.outputs.<key> }}` still works as a shorthand — no update required.
:::

#### ForEachItem chain

When using Flow triggers to chain `ForEachItem` child flows, reference the child flow's outputs using its `flowId`:

**Before**

```yaml
triggers:
  - id: 01_complete
    type: io.kestra.plugin.core.trigger.Flow
    inputs:
      testFile: "{{ trigger.outputs.myFile }}"
    preconditions:
      id: output_01_success
      flows:
        - namespace: io.kestra.tests.trigger.foreachitem
          flowId: flow-trigger-for-each-item-child
          states: [SUCCESS]
```

**After**

```yaml
triggers:
  - id: 01_complete
    type: io.kestra.plugin.core.trigger.Flow
    inputs:
      testFile: "{{ trigger.outputs.flow-trigger-for-each-item-child.myFile }}"
    dependsOn:
      - flowId: flow-trigger-for-each-item-child
        namespace: io.kestra.tests.trigger.foreachitem
```

### `mode`: OR and N-of-M logic

The `mode` property controls how `dependsOn` entries are combined when evaluating whether to fire.

| Value | Behavior | Required properties |
|---|---|---|
| `ALL` (default) | Fires when all `dependsOn` entries are satisfied | — |
| `ANY` | Fires as soon as any one entry is satisfied | — |
| `AT_LEAST` | Fires when at least `minSatisfied` entries are satisfied | `minSatisfied` (integer ≥ 1, ≤ entry count) |

#### OR logic: fire when any upstream completes

Previously, OR logic required N separate Flow triggers. `mode: ANY` consolidates them into one.

**Before** (two separate triggers)

```yaml
triggers:
  - id: on_salesforce
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionFlow
        namespace: company.sources
        flowId: ingest_salesforce
      - type: io.kestra.plugin.core.condition.ExecutionStatus
        in: [SUCCESS]
  - id: on_hubspot
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionFlow
        namespace: company.sources
        flowId: ingest_hubspot
      - type: io.kestra.plugin.core.condition.ExecutionStatus
        in: [SUCCESS]
```

**After**

```yaml
triggers:
  - id: react_to_any_source
    type: io.kestra.plugin.core.trigger.Flow
    mode: ANY
    dependsOn:
      - flowId: ingest_salesforce
        namespace: company.sources
        states: [SUCCESS]
      - flowId: ingest_hubspot
        namespace: company.sources
        states: [SUCCESS]
```

`mode: ANY` fires as soon as either dependency is satisfied. The default `mode: ALL` requires every entry to be satisfied before the trigger fires.

#### OR logic with a time window

```yaml
triggers:
  - id: daily_any_source
    type: io.kestra.plugin.core.trigger.Flow
    mode: ANY
    dependsOn:
      - flowId: ingest_salesforce
        namespace: company.sources
      - flowId: ingest_hubspot
        namespace: company.sources
    window:
      deadline: "09:00:00"
```

Fire before 9 AM when either source completes.

#### N of M: at least 2 out of 3

```yaml
triggers:
  - id: partial_success
    type: io.kestra.plugin.core.trigger.Flow
    mode: AT_LEAST
    minSatisfied: 2
    dependsOn:
      - flowId: ingest_salesforce
        namespace: company.sources
        states: [SUCCESS]
      - flowId: ingest_hubspot
        namespace: company.sources
        states: [SUCCESS]
      - flowId: ingest_zendesk
        namespace: company.sources
        states: [SUCCESS]
    window:
      deadline: "09:00:00"
```

`mode: AT_LEAST` fires when `minSatisfied` entries are satisfied. `minSatisfied` must be ≥ 1 and ≤ the number of `dependsOn` entries.

### What replaces what

| Old property / condition type | New equivalent |
|---|---|
| `conditions` list on Flow trigger | `dependsOn` list |
| `preconditions` block | `dependsOn` list + `window` |
| `multipleConditions` block | `dependsOn` list + `window.every` |
| `ExecutionStatus` (`in: [SUCCESS]`) | `states: [SUCCESS]` on the `dependsOn` entry |
| `ExecutionFlow` (`flowId`, `namespace`) | `flowId` + `namespace` on the `dependsOn` entry |
| `ExecutionNamespace` (exact) | `namespace` on the `dependsOn` entry |
| `ExecutionNamespace` (`comparison: PREFIX`) | `when: "{{ namespace \| startsWith('...') }}"` on the entry |
| `ExecutionLabels` (`labels: {k: v}`) | `labels: {k: v}` on the `dependsOn` entry |
| `ExecutionOutputs` (`expression`) | `when` with `outputs.<key>` on the entry |
| `HasRetryAttempt` | `when: "{{ hasRetryAttempt == true }}"` on the entry |
| `Not` > `ExecutionStatus` | Explicit `states` list or `when: "{{ state != 'SUCCESS' }}"` |
| Multiple triggers for OR logic | `mode: ANY` with `dependsOn` entries |
| `preconditions.resetOnSuccess: true` | `window.fireOnce: true` |
| `timeWindow.type: DAILY_TIME_DEADLINE` | `window.deadline` |
| `timeWindow.type: DAILY_TIME_WINDOW` | `window.from` + `window.to` |
| `timeWindow.type: DURATION_WINDOW` | `window.every` |
| `timeWindow.type: SLIDING_WINDOW` | `window.lookback` |

## Window configuration

The `window` property applies to Flow triggers and controls how Kestra accumulates upstream executions before evaluating `dependsOn` entries. Set exactly one property group per window; combining groups is a validation error.

| Window type | Properties | Behavior |
|---|---|---|
| Deadline | `deadline: "09:00:00+01:00"` | Upstream flows must complete by a fixed time each day |
| Daily time range | `from: "06:00:00"` + `to: "12:00:00"` | Only executions within a daily time range count |
| Fixed interval | `every: P1D` + optional `offset: PT6H` | Recurring window of a fixed size, offset from midnight |
| Lookback | `lookback: PT1H` | Rolling window looking back from the current evaluation time |

`fireOnce: true` can be added to any window type to limit the trigger to firing once per window period rather than every time conditions are met.

### Deadline

```yaml
window:
  deadline: "09:00:00+01:00"
```

### Daily time range

```yaml
window:
  from: "06:00:00"
  to: "12:00:00"
```

### Fixed interval

```yaml
window:
  every: P1D
  offset: PT6H
```

### Lookback

```yaml
window:
  lookback: PT1H
```

### Fire once per window

```yaml
window:
  deadline: "09:00:00+01:00"
  fireOnce: true
```

Default is `false` — the trigger fires every time conditions are met within the window.

### SLA misses with `onMiss`

`onMiss` is a trigger-level property (peer to `window`) that declares what happens when the deadline passes without all dependencies being satisfied:

```yaml
onMiss:
  behavior: FAIL
  labels:
    sla: miss
    reason: upstreamNotFinishedOnTime
```

`behavior: FAIL` creates a `FAILED` execution when the deadline passes. Labels are applied to that execution for downstream alerting.

### Replacing `timeWindow` types

| Old `timeWindow.type` | New `window` property |
|---|---|
| `DAILY_TIME_DEADLINE` | `deadline: "09:00:00+01:00"` |
| `DAILY_TIME_WINDOW` | `from: "06:00:00"` + `to: "12:00:00"` |
| `DURATION_WINDOW` | `every: P1D` + optional `offset: PT6H` |
| `SLIDING_WINDOW` | `lookback: PT1H` |

`preconditions.resetOnSuccess: true` maps to `window.fireOnce: true`.

## Behavior changes after upgrading

### Silent failures → FAILED executions

Previously, if an expression on a Flow trigger failed to render (for example, because an upstream output key did not exist), the trigger silently dropped the event and no execution was created. In Kestra 2.0, a `FAILED` execution is created instead, making failures visible in the UI and actionable via downstream alerting.

No migration action is required. Review your Flow trigger `inputs` expressions to ensure they reference valid output keys and avoid unexpected `FAILED` executions after upgrading.

### State store reset and in-flight events

Previously, auto-generated condition keys (`condition_1`, `condition_2`, …) meant that reordering entries could reset accumulated window state. In Kestra 2.0, `dependsOn` entry keys are derived from each entry's `namespace` and `flowId`, making them order-independent.

The trigger-level state store key also changes: the old scheme used `preconditions.id`; the new scheme uses `{flowId}/{triggerId}`. Existing accumulated state from `preconditions` will not be found after upgrading — in-flight multi-flow triggers re-evaluate from scratch. For most deployments this means at most one missed trigger cycle.

Old-format events in the async queue are discarded gracefully (logged as a warning). No user action is required.

## Migration steps

1. **Replace `conditions:` on all triggers** with a `when:` Pebble expression. This applies to Schedule, Webhook, HTTP, and any other trigger type that used `conditions`.
2. **Replace `conditions:` and `preconditions:` on Flow triggers** with `dependsOn:` entries and (if applicable) `window:`.
3. **Check for `PAUSED` state dependencies.** The default `states` changed from `[SUCCESS, WARNING, PAUSED]` to `[SUCCESS, WARNING]`. Add `PAUSED` explicitly if your flows depended on it: `states: [SUCCESS, WARNING, PAUSED]`.
4. **Update `trigger.outputs` references** in multi-flow triggers from `trigger.outputs.<key>` to `trigger.outputs.<flowId>.<key>`. Single-flow triggers can keep the unscoped form.
5. **Update `timeWindow` to `window`** using the property mapping table above.
6. **Validate** by saving updated flows in the Kestra UI or via the API and confirming they parse without errors.
