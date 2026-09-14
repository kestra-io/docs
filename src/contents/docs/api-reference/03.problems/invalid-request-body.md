---
title: "Kestra API Error: Invalid request body"
h1: Invalid request body
sidebarTitle: Invalid request body
description: The invalid-request-body problem type is returned when a Kestra API endpoint requires a request body and the one it received is missing or unusable.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The endpoint requires a body and the one it received cannot be used.

- **HTTP status** — `422 Unprocessable Content`
- **`type`** — `https://kestra.io/docs/api-reference/problems/invalid-request-body`

## When you get it

- A `POST` or `PUT` is sent with no body at all.
- A required part of a multipart request is missing.
- A webhook trigger's inputs could not be rendered from the request that fired it.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/invalid-request-body",
  "title": "Invalid request body",
  "status": 422,
  "detail": "Required body is missing.",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Send the body the endpoint documents. For webhooks the failure happens while rendering the trigger's own input expressions against the request, so the flow definition is what needs fixing, not the caller.

For the members every problem document carries, see [Problem Details](./index.md).
