---
title: "Flow Quotas in Kestra: Rate-Limit Execution Creation"
h1: Limit How Many Executions a Flow Can Create in a Time Window
description: Use flow-level quotas in Kestra Enterprise to cap how many executions a flow can create within a time period. Set CANCEL or FAIL behavior when the limit is exceeded.
sidebarTitle: Quotas
icon: /src/contents/docs/icons/flow.svg
editions: ["EE", "Cloud"]
---

Cap the number of executions a flow can create within a time window.

Use the flow-level `quotas` property to define one or more rate limits on execution creation. Each quota specifies a `duration` (the time window), a `limit` (the maximum number of executions allowed in that window), and a `behavior` (what happens when the limit is exceeded).

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
`QUEUE` behavior is not yet supported for quotas. To hold executions until capacity is available rather than dropping them, use [`concurrency`](../14.concurrency/index.md) with `behavior: QUEUE`.
:::

## Examples

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

The **Administration > Quotas** page lists active quota counters across all flows in the tenant. Each row shows the flow namespace, flow ID, the quota duration, the start of the current window, and the current execution count within that window. This page is visible to super admins only.

## When to use quotas

- Cap how often a flow can be triggered by external events or webhooks to prevent runaway execution chains.
- Enforce a cost or rate-limit policy on flows that call expensive external APIs.
- Complement concurrency limits: quotas cap the creation rate; concurrency caps simultaneous parallelism.
