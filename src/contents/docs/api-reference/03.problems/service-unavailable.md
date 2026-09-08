---
title: "Kestra API Error: Service unavailable"
h1: Service unavailable
sidebarTitle: Service unavailable
description: The service-unavailable problem type is returned when a Kestra instance is running but temporarily unable to serve the request.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The instance is running but is not currently able to serve the request.

- **HTTP status** — `503 Service Unavailable`
- **`type`** — `https://kestra.io/docs/api-reference/problems/service-unavailable`

## When you get it

- A component the endpoint depends on is starting, shutting down, or unreachable.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/service-unavailable",
  "title": "Service unavailable",
  "status": 503,
  "detail": "An unexpected error occurred. Quote the traceId when contacting support.",
  "instance": "/api/v1/main/flows",
  "traceId": "1d8e4c7a5b2f4e6d9a0c3b7f1e5d8a24"
}
```

## How to handle it

Retry with backoff. Unlike `internal-error`, this type says the failure is expected to be transient.

For the members every problem document carries, see [Problem Details](./index.md).
