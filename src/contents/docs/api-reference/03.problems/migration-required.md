---
title: "Kestra API Error: Migration required"
h1: Migration required
sidebarTitle: Migration required
description: The migration-required problem type is returned when a Kestra instance cannot serve requests until a pending data migration has run.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The instance cannot serve the request until a data migration has run.

- **HTTP status** — `503 Service Unavailable`
- **`type`** — `https://kestra.io/docs/api-reference/problems/migration-required`

## When you get it

- A migration is required and has not been started.
- A migration is in progress.
- The migration lock is held by another instance.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/migration-required",
  "title": "Migration required",
  "status": 503,
  "detail": "An unexpected error occurred. Quote the traceId when contacting support.",
  "instance": "/api/v1/main/flows",
  "traceId": "9c1f2b0a7e8d4a5cb1e6f30d2a94c7b1"
}
```

## How to handle it

Retrying will keep failing until the migration completes: this needs an operator, not a client change. See the [migration guide](../../11.migration-guide/index.mdx) for the release being upgraded to.

For the members every problem document carries, see [Problem Details](./index.md).
