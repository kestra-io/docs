---
title: "Kestra API Error: Resource is leased"
h1: Resource is leased
sidebarTitle: Resource is leased
description: The resource-leased problem type is returned when another user holds an edit lease on a Kestra resource, so it cannot be changed or deleted yet.
icon: /src/contents/docs/icons/api.svg
editions: ["EE", "Cloud"]
---

Someone else holds an edit lease on the resource, so it cannot be changed or deleted yet.

- **HTTP status** — `423 Locked`
- **`type`** — `https://kestra.io/docs/api-reference/problems/resource-leased`

## When you get it

- A resource another user has open is edited or deleted.
- A lease is acquired on a resource that is already leased.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/resource-leased",
  "title": "Resource is leased",
  "status": 423,
  "detail": "Lease on 'ASSET'.'my-asset' is held until 2026-09-08T14:32:10Z by USER 'alice@example.com'.",
  "instance": "/api/v1/main/assets/my-asset"
}
```

## How to handle it

The `detail` names the current holder and when the lease expires, so a client can show who to ask and when to retry. This is the Cloud and Enterprise counterpart of [`locked`](./locked.md).

For the members every problem document carries, see [Problem Details](./index.md).
