---
title: "Kestra API Error: Internal server error"
h1: Internal server error
sidebarTitle: Internal server error
description: The internal-error problem type is returned when a Kestra API request fails for a reason the caller cannot fix, and carries a traceId for support.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The request failed for a reason that is not the caller's to fix.

- **HTTP status** — `500 Internal Server Error`
- **`type`** — `https://kestra.io/docs/api-reference/problems/internal-error`

## When you get it

- An unhandled failure occurs anywhere in the server.
- A secret backend, internal storage, or the database cannot be reached.
- A flow cannot be processed for reasons beyond validation.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/internal-error",
  "title": "Internal server error",
  "status": 500,
  "detail": "An unexpected error occurred. Quote the traceId when contacting support.",
  "instance": "/api/v1/main/flows",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

## How to handle it

The `detail` is the same fixed string on every server error and never carries the exception message, so an internal message can never reach the caller. The real cause is in the server log under the same `traceId`, which is what to quote when contacting support. `errors` is never populated on a server error.

For the members every problem document carries, see [Problem Details](./index.md).
