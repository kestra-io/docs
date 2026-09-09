---
title: "Kestra API Error: Invalid query parameter"
h1: Invalid query parameter
sidebarTitle: Invalid query parameter
description: The invalid-query-parameter problem type is returned when a Kestra API request omits a query parameter the route requires.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

A query parameter the route requires is missing.

- **HTTP status** — `400 Bad Request`
- **`type`** — `https://kestra.io/docs/api-reference/problems/invalid-query-parameter`

## When you get it

- A required query parameter is not sent.

A parameter that is present but carries a value the route cannot convert to its declared type is reported as [`invalid-argument`](./invalid-argument.md) instead: the conversion failure is raised before the parameter is judged missing.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/invalid-query-parameter",
  "title": "Invalid query parameter",
  "status": 400,
  "detail": "Required query parameter 'namespace' is missing.",
  "instance": "/api/v1/main/flows/search"
}
```

## How to handle it

Add or correct the parameter. The parameters each endpoint accepts, and their types, are in the OpenAPI schema.

For the members every problem document carries, see [Problem Details](./index.md).
