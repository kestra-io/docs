---
title: "Flow Quotas in Kestra: Rate-Limit Execution Creation"
h1: Limit How Many Executions a Flow Can Create in a Time Window
description: Use flow-level quotas in Kestra Enterprise to cap how many executions a flow can create within a time period. Set CANCEL or FAIL behavior when the limit is exceeded.
sidebarTitle: Quotas
icon: /src/contents/docs/icons/flow.svg
editions: ["EE", "Cloud"]
---

Cap the number of executions created within a time window — at the flow, namespace, or tenant level.

Each quota specifies a `duration` (the time window), a `limit` (the maximum number of executions allowed in that window), and a `behavior` (what happens when the limit is exceeded). Quotas can be applied at three levels: on individual flows, on a namespace (applying to all flows in that namespace and any child namespace beneath it), or on a tenant (applying to all flows across the tenant).

:::alert{type="info"}
Quotas limit how many executions are **created** within a time period. This is different from [`concurrency`](../14.concurrency/index.md), which limits how many executions **run simultaneously**.
:::

:::alert{type="warning"}
Quotas are an Enterprise Edition feature. Adding a `quotas` block to a flow on an Open Source installation causes a validation error at save time.
:::

## Quota properties

Each entry in the `quotas` list requires three properties:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `duration` | string | Yes | ISO 8601 duration defining the time window, e.g. `PT1H` (one hour) or `P1D` (one day). Minimum: `PT1M`. Acts as the unique identifier — each duration value must appear at most once in the list. |
| `limit` | integer | Yes | Maximum number of executions allowed within the window. Must be `>= 1`. |
| `behavior` | enum | Yes | Action taken when the limit is reached. One of `CANCEL` or `FAIL`. |

:::alert{type="info"}
Windows are **fixed and UTC-aligned**, not rolling. `PT1H` covers the current UTC clock-hour (e.g. 14:00–15:00 UTC), not the preceding 60 minutes. Prefer durations that divide evenly into 24 hours (`PT1M`, `PT5M`, `PT15M`, `PT30M`, `PT1H`, `PT2H`, `PT3H`, `PT4H`, `PT6H`, `PT8H`, `PT12H`, `PT24H`). Durations that don't divide evenly (e.g. `PT7H`) produce a shorter final window each day.
:::

## Behavior options

- **`CANCEL`** — the execution is immediately marked as `CANCELLED` before any tasks run.
- **`FAIL`** — the execution is immediately marked as `FAILED` before any tasks run.

:::alert{type="info"}
`QUEUE` behavior is not supported for quotas. To hold executions until capacity is available rather than dropping them, use [`concurrency`](../14.concurrency/index.md) with `behavior: QUEUE`.
:::

## Quota levels

### Flow level

Define quotas directly on a flow using the `quotas` property in the flow YAML. These quotas apply only to that specific flow.

```yaml
id: my_flow
namespace: company.team

quotas:
  - behavior: CANCEL
    limit: 10
    duration: PT1H
```

### Namespace level

Define quotas on a namespace to apply limits to all flows within that namespace. Open the namespace, go to the **Quotas** section, and add one or more quota entries.

Namespace quotas apply to every flow whose namespace matches or is a child of the configured namespace.

### Tenant level

Define quotas on a tenant to apply limits across all flows in the entire tenant. Navigate to **Administration > Tenants**, edit the tenant, and add quota entries in the **Quotas** section.

## Evaluation order

When an execution is triggered, quotas are evaluated from the most specific level to the most general:

1. **Flow-level** quotas are checked first.
2. **Namespace-level** quotas are checked next, from the most general ancestor namespace down to the flow's own namespace.
3. **Tenant-level** quotas are checked last.

If a quota at a lower level is exceeded, the execution is cancelled or failed immediately and no slot is consumed at higher levels. This prevents a flow-level quota breach from also counting against shared namespace or tenant limits.

## Flow-level examples

The flow below defines two quotas: a short-window limit of 10 executions per hour and a longer-window limit of 100 executions per day. Executions that exceed either limit are cancelled immediately.

```yaml
id: quotas_flow
namespace: company.team

quotas:
  - behavior: CANCEL
    limit: 10
    duration: PT1H

  - behavior: CANCEL
    limit: 100
    duration: P1D

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World!
```

You can mix behaviors across quotas in the same flow — for example, cancel executions that exceed the hourly limit but fail those that exceed the daily limit:

```yaml
quotas:
  - behavior: CANCEL
    limit: 10
    duration: PT1H

  - behavior: FAIL
    limit: 100
    duration: P1D
```

Each `duration` value must be unique within the `quotas` list. Defining two quotas with the same `duration` string causes a validation error at save time.

## Monitoring quota state

The **Administration > Quota Limits** page lists active quota counters across the tenant. Each row shows the namespace, flow ID, quota duration, the start of the current window, and the current execution count. For namespace-level quotas the flow column shows **namespace level quota**; for tenant-level quotas both columns show **tenant level quota**.

Rows for expired windows are automatically hidden. Use the **Refresh** button to reload the current state. Columns are sortable by namespace and flow ID. This page is visible to super admins only.

## When to use quotas

- **Flow level** — cap how often a specific flow can be triggered by external events or webhooks to prevent runaway execution chains, or enforce a cost policy on flows that call expensive external APIs.
- **Namespace level** — apply a shared execution budget across all flows in a team or environment namespace, without configuring each flow individually.
- **Tenant level** — enforce an organization-wide ceiling on execution creation, for example to stay within an infrastructure or cost constraint that applies across all namespaces.
- Complement concurrency limits: quotas cap the creation rate; concurrency caps simultaneous parallelism.
