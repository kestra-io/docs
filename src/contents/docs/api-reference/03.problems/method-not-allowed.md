---
title: "Kestra API Error: Method not allowed"
h1: Method not allowed
sidebarTitle: Method not allowed
description: The method-not-allowed problem type is returned when a Kestra API path exists but does not accept the HTTP method used.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The path exists but does not accept the HTTP method used.

- **HTTP status** — `405 Method Not Allowed`
- **`type`** — `https://kestra.io/docs/api-reference/problems/method-not-allowed`

## When you get it

- A `POST` is sent to a read-only route, or a `GET` to a route that only accepts `POST`.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/method-not-allowed",
  "title": "Method not allowed",
  "status": 405,
  "detail": "Method not allowed",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

The response carries an `Allow` header listing the methods that would have worked, as required by RFC 9110.

For the members every problem document carries, see [Problem Details](./index.md).
