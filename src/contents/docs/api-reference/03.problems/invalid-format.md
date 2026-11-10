---
title: "Kestra API Error: Invalid value format"
h1: Invalid value format
sidebarTitle: Invalid value format
description: The invalid-format problem type is returned when a value in a Kestra API request cannot be converted to the type its member requires.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

A value is in the right place but cannot be converted to the type that member requires.

- **HTTP status** — `422 Unprocessable Content`
- **`type`** — `https://kestra.io/docs/api-reference/problems/invalid-format`

## When you get it

- A non-numeric string is sent for a numeric field.
- A duration or timestamp is not valid ISO 8601.
- A value fails scalar coercion, for example an input whose declared type does not match what was submitted.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/invalid-format",
  "title": "Invalid value format",
  "status": 422,
  "detail": "Cannot convert 'yesterday' to an Instant.",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Correct the format of the value. The type each member expects is in the OpenAPI schema for the endpoint.

For the members every problem document carries, see [Problem Details](./index.md).
