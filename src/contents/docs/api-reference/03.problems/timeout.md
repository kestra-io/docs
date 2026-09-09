---
title: "Kestra API Error: Operation timed out"
h1: Operation timed out
sidebarTitle: Operation timed out
description: The timeout problem type is returned when a Kestra API request, or a call it makes to another service, does not complete within its allowed time.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The request did not complete within the time allowed for it.

- **HTTP status** — `504 Gateway Timeout`
- **`type`** — `https://kestra.io/docs/api-reference/problems/timeout`

## When you get it

- A route, or a call it makes to another service, gives up on a request that took too long.

:::alert{type="info"}
A task that exceeds its own `timeout` inside a flow does not produce this response. It fails that task run, and the execution reports it like any other task failure.
:::

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/timeout",
  "title": "Operation timed out",
  "status": 504,
  "detail": "An unexpected error occurred. Quote the traceId when contacting support.",
  "instance": "/api/v1/main/flows",
  "traceId": "e7a1c93b5d2f48e6b0a7c1d4f9e2b503"
}
```

## How to handle it

Retry with backoff. Like every `5xx`, the `detail` is fixed and the real cause is in the server log under the same `traceId`.

For the members every problem document carries, see [Problem Details](./index.md).
