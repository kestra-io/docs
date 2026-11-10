---
title: "Kestra API Error: Resource is locked"
h1: Resource is locked
sidebarTitle: Resource is locked
description: The locked problem type is returned when a Kestra resource is locked against the operation attempted. Leased resources report resource-leased instead.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The resource is locked against the operation you attempted.

- **HTTP status** — `423 Locked`
- **`type`** — `https://kestra.io/docs/api-reference/problems/locked`

## When you get it

- An endpoint answers `423` because the resource is held against the operation requested.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/locked",
  "title": "Resource is locked",
  "status": 423,
  "detail": "Resource is locked",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Retry once the lock clears. On Cloud and Enterprise instances, a resource held by another user's lease reports [`resource-leased`](./resource-leased.md) instead, whose `detail` names the holder and the expiry.

For the members every problem document carries, see [Problem Details](./index.md).
