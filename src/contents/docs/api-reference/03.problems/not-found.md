---
title: "Kestra API Error: Resource not found"
h1: Resource not found
sidebarTitle: Resource not found
description: The not-found problem type is returned when no Kestra resource exists at the identifier given, and when a request matches no API route at all.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

There is no resource at the identifier given. This is also returned when the request matched no route at all.

- **HTTP status** — `404 Not Found`
- **`type`** — `https://kestra.io/docs/api-reference/problems/not-found`

## When you get it

- The flow, execution, namespace, or user id is unknown.
- The id is correct but belongs to another tenant.
- The resource has since been deleted.
- The secret or namespace file does not exist.
- The path is not an endpoint of this API.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/not-found",
  "title": "Resource not found",
  "status": 404,
  "detail": "Flow 'my-flow' not found in namespace 'company.team'.",
  "instance": "/api/v1/main/flows/company.team/my-flow"
}
```

## How to handle it

A 404 deliberately says nothing about whether the resource ever existed. Reporting that difference would let an unauthorized caller probe for names.

For the members every problem document carries, see [Problem Details](./index.md).
