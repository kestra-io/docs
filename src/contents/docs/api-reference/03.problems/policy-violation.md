---
title: "Kestra API Error: Policy violation"
h1: Policy violation
sidebarTitle: Policy violation
description: The policy-violation problem type is returned when a governance policy blocks an execution of the flow the request asked to run.
icon: /src/contents/docs/icons/api.svg
editions: ["EE", "Cloud"]
---

A governance policy blocks the flow from running, so no execution is created.

- **HTTP status** — `403 Forbidden`
- **`type`** — `https://kestra.io/docs/api-reference/problems/policy-violation`

## When you get it

- An execution is requested for a flow that the policies applying to it block.

The policy chain is resolved again at execution time, because a policy can postdate the flow. A flow that was accepted when it was saved can therefore still be blocked here.

:::alert{type="info"}
A policy that rejects a flow **as it is saved** is reported as [`validation-failed`](./validation-failed.md), with one `errors` entry per blocking rule: the request is not forbidden, the flow is not valid. This type covers execution only.
:::

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/policy-violation",
  "title": "Policy violation",
  "status": 403,
  "detail": "Execution blocked by governance policy: task type 'io.kestra.plugin.scripts.shell.Commands' is forbidden [policy=no-shell-tasks, task=run-script]",
  "instance": "/api/v1/main/executions/company.team/my-flow"
}
```

The `detail` names each blocking rule, the policy it came from, and the task it was raised on.

## How to handle it

This is a 403 rather than a 409 by design: a 409 would suggest transient state the caller can retry past, and a policy denial is not one. Either the flow changes, or the policy does. See [Policies](../../07.enterprise/02.governance/policies/index.md).

For the members every problem document carries, see [Problem Details](./index.md).
