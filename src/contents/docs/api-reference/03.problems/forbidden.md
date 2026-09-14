---
title: "Kestra API Error: Access denied"
h1: Access denied
sidebarTitle: Access denied
description: The forbidden problem type is returned when a Kestra API caller is authenticated but is not allowed to perform the operation.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The caller is authenticated but is not allowed to perform this operation.

- **HTTP status** — `403 Forbidden`
- **`type`** — `https://kestra.io/docs/api-reference/problems/forbidden`

## When you get it

- The caller's role does not grant the required permission.
- The resource is in a namespace outside the caller's granted namespaces.
- An AI Copilot tool call is one the caller is not permitted to make.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/forbidden",
  "title": "Access denied",
  "status": 403,
  "detail": "Access denied",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Do not retry: the outcome will not change without a permission change. Cloud and Enterprise instances report `feature-disabled`, `license-limit-exceeded`, or `policy-violation` instead when one of those is the actual reason.

For the members every problem document carries, see [Problem Details](./index.md).
