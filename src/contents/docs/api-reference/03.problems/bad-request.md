---
title: "Kestra API Error: Bad request"
h1: Bad request
sidebarTitle: Bad request
description: The bad-request problem type is returned when a Kestra API request is malformed, and for any 4xx status that has no more specific problem type.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The request is malformed. This is also the type reported for any 4xx status that has no more specific type of its own.

- **HTTP status** — `400 Bad Request`
- **`type`** — `https://kestra.io/docs/api-reference/problems/bad-request`

## When you get it

- A route's required binding cannot be satisfied by the request.
- A source-search query is not valid syntax.
- A search expression takes too long to evaluate and is abandoned.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/bad-request",
  "title": "Bad request",
  "status": 400,
  "detail": "Bad request",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Read the `detail`: on this type it is the only description of what the server could not make sense of.

For the members every problem document carries, see [Problem Details](./index.md).
