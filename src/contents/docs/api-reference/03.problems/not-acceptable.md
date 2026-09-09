---
title: "Kestra API Error: Not acceptable"
h1: Not acceptable
sidebarTitle: Not acceptable
description: The not-acceptable problem type is returned when a Kestra API endpoint cannot produce any media type the request's Accept header allows.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The endpoint cannot produce any of the media types your `Accept` header allows.

- **HTTP status** — `406 Not Acceptable`
- **`type`** — `https://kestra.io/docs/api-reference/problems/not-acceptable`

## When you get it

- The `Accept` header excludes the type the endpoint produces.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/not-acceptable",
  "title": "Not acceptable",
  "status": 406,
  "detail": "Not acceptable",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Send `Accept: application/json`, or drop the header. Error responses themselves are always served as `application/problem+json`.

For the members every problem document carries, see [Problem Details](./index.md).
