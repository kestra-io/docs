---
title: "Kestra API Error: Payload too large"
h1: Payload too large
sidebarTitle: Payload too large
description: The payload-too-large problem type is returned when a Kestra API request body exceeds a configured size limit, including the internal queue message limit.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The request body exceeds a configured size limit.

- **HTTP status** — `413 Content Too Large`
- **`type`** — `https://kestra.io/docs/api-reference/problems/payload-too-large`

## When you get it

- The body is over `micronaut.server.max-request-size`.
- A message the request would place on the internal queue is over the queue's maximum message size, for example an execution whose inputs or outputs are too large.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/payload-too-large",
  "title": "Payload too large",
  "status": 413,
  "detail": "Message is too big.",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Split the request, or move the bulk of the data into internal storage and pass a URI. Raising `micronaut.server.max-request-size` addresses the first cause only; the queue limit is separate and belongs to the queue backend's configuration.

For the members every problem document carries, see [Problem Details](./index.md).
