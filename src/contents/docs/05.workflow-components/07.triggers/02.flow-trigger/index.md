---
title: Flow Trigger in Kestra – Chain Flow Executions
h1: Automate Workflow Dependencies by Chaining Flows
description: Chain workflows in Kestra using the Flow Trigger. Automate dependencies by triggering flows upon the completion, success, or failure of other flows.
sidebarTitle: Flow Trigger
icon: /src/contents/docs/icons/flow.svg
---

Trigger one flow based on the execution of another flow.

```yaml
type: io.kestra.plugin.core.trigger.Flow
```

A Flow trigger runs a flow after another flow completes, enabling event-driven workflows and dependencies across teams. This allows you to create dependencies between flows, even when those flows are owned by different teams.

Check the [Flow trigger](/plugins/core/trigger/io.kestra.plugin.core.trigger.flow) documentation for the list of all properties.

## Upstream flow dependencies

The `dependsOn` property is a list of upstream flow entries that must all complete in matching states before the trigger fires.

### Basic single upstream flow

The example below triggers `flow_b` when `flow_a` from the `company.team` namespace completes successfully:

```yaml
id: flow_b
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "Hello World!"

triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: extract
        namespace: company.team
        states: [SUCCESS]
```

### Multiple upstream flows

List multiple entries under `dependsOn`. All entries must be satisfied before the trigger fires:

```yaml
triggers:
  - id: after_staging
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: stg_sales
        namespace: company.team
      - flowId: stg_marketing
        namespace: company.team
```

### Entry properties

| Property    | Type                  | Description                                                                                                          |
|-------------|-----------------------|----------------------------------------------------------------------------------------------------------------------|
| `flowId`    | `String`              | The ID of the upstream flow to match. Omit to match any flow (combine with `when` to narrow the scope).             |
| `namespace` | `String`              | The namespace of the upstream flow. Exact match only — use `when` for prefix or pattern matching.                    |
| `states`    | `List<State>`         | States that satisfy this entry. Defaults to `[SUCCESS, WARNING]`.                                                    |
| `labels`    | `Map<String, String>` | Key-value pairs that must all be present on the upstream execution's labels.                                         |
| `when`      | `String`              | A Pebble expression evaluated against the upstream execution. The entry is satisfied only when this evaluates to true.|

### Prefix and pattern matching

When `namespace` is set, Kestra matches it exactly. To match a range of namespaces or flows, omit `namespace` and use `when` with a Pebble expression:

```yaml
triggers:
  - id: alert_on_failure
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - states: [FAILED, WARNING]
        when: "{{ namespace | startsWith('company') }}"
```

## Conditional guard with `when`

Like all triggers, the Flow trigger supports a top-level `when` Pebble expression. It is evaluated before `dependsOn` — if it returns a falsy value, the trigger does not fire regardless of upstream state:

```yaml
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
    when: "{{ labels.env == 'production' }}"
    dependsOn:
      - flowId: extract
        namespace: company.team
```

## Time window

The `window` property controls how long Kestra accumulates upstream executions before evaluating whether all `dependsOn` entries are satisfied.

### Deadline

All upstream flows must complete before a fixed time each day. The deadline string must include a timezone offset:

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

### Daily time range

Only executions that completed within a specific time range each day are counted:

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
      from: "06:00:00"
      to: "12:00:00"
```

### Fixed interval

`every` defines the window size and `offset` shifts its start relative to midnight:

```yaml
triggers:
  - id: after_staging
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: stg_sales
        namespace: company.team
    window:
      every: PT1H
      offset: PT30M
```

### Lookback

Count executions that completed within the past duration, relative to the current evaluation time:

```yaml
triggers:
  - id: after_staging
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: stg_sales
        namespace: company.team
    window:
      lookback: PT1H
```

### Fire once per window

Set `fireOnce: true` to ensure the trigger fires at most once per window, even if conditions are satisfied multiple times:

```yaml
window:
  deadline: "09:00:00+01:00"
  fireOnce: true
```

## Scoped trigger outputs

When a Flow trigger fires, upstream execution outputs are available under `trigger.outputs`. Outputs are scoped by flow ID to avoid key collisions when multiple upstream flows are involved:

```
trigger.outputs.<flowId>.<outputKey>
```

For example, to pass an output from an upstream flow named `extract`:

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

:::alert{type="warning"}
The output scoping format changed in Kestra 2.0. If you previously used `trigger.outputs.<key>` (a flat map), update your expressions to the new `trigger.outputs.<flowId>.<key>` format.
:::

## Label-based filtering

Use the `labels` map on a `dependsOn` entry to restrict which upstream executions are counted. All specified labels must be present on the upstream execution:

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

## Filtering with `when` expressions

Use `when` on a `dependsOn` entry to apply arbitrary Pebble conditions against the upstream execution context.

Filter on an output value:

```yaml
triggers:
  - id: after_extract
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: extract
        namespace: company.team
        when: "{{ outputs.row_count > 0 }}"
```

Filter on retry attempts:

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

## Example: data pipeline with SLA deadline

This example triggers the `silver_layer` flow once the `bronze_layer` flow finishes successfully by 9 AM:

```yaml
id: silver_layer
namespace: company.team

tasks:
  - id: transform_data
    type: io.kestra.plugin.core.log.Log
    message: deduplication, cleaning, and minor aggregations

triggers:
  - id: flow_trigger
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - flowId: bronze_layer
        namespace: company.team
        states: [SUCCESS]
    window:
      deadline: "09:00:00+01:00"
```

## Example: alerting on failure

This example creates a system flow that sends a Slack alert on any failure or warning state within the `company` namespace:

```yaml
id: alert
namespace: system

tasks:
  - id: send_alert
    type: io.kestra.plugin.slack.notifications.SlackExecution
    url: "{{secret('SLACK_WEBHOOK')}}"
    channel: "#general"
    executionId: "{{trigger.executionId}}"

triggers:
  - id: alert_on_failure
    type: io.kestra.plugin.core.trigger.Flow
    dependsOn:
      - states: [FAILED, WARNING]
        when: "{{ namespace | startsWith('company') }}"
```

## Example: mixed success and failure triggers

You can define multiple Flow triggers on the same flow to react differently to upstream success vs. failure:

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

## Example: passing upstream outputs downstream

Reference upstream outputs using the scoped path `trigger.outputs.<flowId>.<key>`:

```yaml
id: flow_b
namespace: company.team

inputs:
  - id: value_from_a
    type: STRING

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "{{ inputs.value_from_a }}"

triggers:
  - id: upstream_dep
    type: io.kestra.plugin.core.trigger.Flow
    inputs:
      value_from_a: "{{ trigger.outputs.flow_a.return_value }}"
    dependsOn:
      - flowId: flow_a
        namespace: company.team
        states: [SUCCESS]
```

:::alert{type="info"}
`dependsOn` condition IDs are derived from a stable hash of each entry's `namespace`, `flowId`, `when`, `states`, and `labels`. Reordering entries in the list does not reset accumulated window state.
:::

## Input rendering failures create FAILED executions

If an `inputs` expression on a Flow trigger fails to render — for example, because an upstream output key does not exist — Kestra creates a `FAILED` execution instead of silently dropping the event. This makes failures visible in the UI and actionable via alerting.

## Removed: `preconditions` and `conditions`

The `preconditions` and `conditions` properties are removed in Kestra 2.0. Flows that still use them will fail to parse after upgrading. Migrate to `dependsOn`.

See the [trigger conditions migration guide](../../../11.migration-guide/v2.0.0/trigger-conditions-redesign/index.md) for a complete before/after reference.
