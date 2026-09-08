---
title: "Kestra API Error: Invalid argument"
h1: Invalid argument
sidebarTitle: Invalid argument
description: The invalid-argument problem type is returned when a Kestra API endpoint receives an argument it cannot accept, outside of whole-entity validation.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

An argument the endpoint received is not acceptable. This is the general-purpose type for a rejected argument that is not a whole-entity validation failure.

- **HTTP status** — `422 Unprocessable Content`
- **`type`** — `https://kestra.io/docs/api-reference/problems/invalid-argument`

## When you get it

- A value falls outside the set the endpoint accepts.
- An identifier is not well formed.
- A path variable or query value cannot be converted to the type the route declares.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/invalid-argument",
  "title": "Invalid argument",
  "status": 422,
  "detail": "Namespace 'My Namespace' is not a valid namespace identifier.",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Correct the argument named in the `detail`. When the failure came from binding a path variable or a query value, the `detail` is the fixed title instead, because the underlying message names internal Java classes; the parameter's declared type is then in the OpenAPI schema for the endpoint.

For the members every problem document carries, see [Problem Details](./index.md).
