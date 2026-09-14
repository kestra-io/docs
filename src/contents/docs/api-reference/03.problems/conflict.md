---
title: "Kestra API Error: Conflict"
h1: Conflict
sidebarTitle: Conflict
description: The conflict problem type is returned when the current state of a Kestra resource does not allow the operation requested.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The resource's current state does not allow the operation.

- **HTTP status** — `409 Conflict`
- **`type`** — `https://kestra.io/docs/api-reference/problems/conflict`

## When you get it

- The execution is not in a state that allows the action: restarting one that is not terminated, resuming one that is not paused, or acting on one that was killed.
- The flow, or the trigger the request targets, is disabled.
- A trigger is unlocked when it was not locked, or a backfill action does not apply to its current state.
- An AI Copilot turn is already in flight on the thread.
- A lock is held by another in-flight operation on the same resource.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/conflict",
  "title": "Conflict",
  "status": 409,
  "detail": "Cannot restart execution: current state is 'RUNNING', expected terminated.",
  "instance": "/api/v1/main/executions/4NFYrJfMEBQpLNDsGwXWZg/actions/restart"
}
```

## How to handle it

Re-read the resource before deciding what to do. Some conflicts clear on their own, such as a lock or an execution that is still running; others, such as a disabled flow, need a change before the request can succeed.

For the members every problem document carries, see [Problem Details](./index.md).
