---
title: "Kestra API Error: Unsupported media type"
h1: Unsupported media type
sidebarTitle: Unsupported media type
description: The unsupported-media-type problem type is returned when a Kestra API endpoint does not accept the Content-Type of the request body.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The endpoint does not accept the `Content-Type` of the request body.

- **HTTP status** — `415 Unsupported Media Type`
- **`type`** — `https://kestra.io/docs/api-reference/problems/unsupported-media-type`

## When you get it

- A body is sent as `text/plain` to an endpoint that consumes JSON.
- A request that has a body is sent with no `Content-Type`.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/unsupported-media-type",
  "title": "Unsupported media type",
  "status": 415,
  "detail": "Unsupported media type",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Set `Content-Type` to what the endpoint consumes: `application/json` for most, `multipart/form-data` for file uploads.

For the members every problem document carries, see [Problem Details](./index.md).
