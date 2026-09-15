---
title: "Kestra API Error: Invalid JSON"
h1: Invalid JSON
sidebarTitle: Invalid JSON
description: The invalid-json problem type is returned when a Kestra API request body cannot be parsed as JSON or cannot be mapped onto the shape the endpoint expects.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The request body could not be read, either because it is not valid JSON or because it does not map onto the shape the endpoint expects.

- **HTTP status** — `422 Unprocessable Content`
- **`type`** — `https://kestra.io/docs/api-reference/problems/invalid-json`

## When you get it

- The body is syntactically broken, such as an unclosed brace, a trailing comma, or an unquoted key.
- The body parses, but a member has the wrong shape, such as an object where a string is expected.

:::alert{type="info"}
Endpoints that take a flow, a policy, or a dashboard receive it as source text and parse it themselves, so a malformed document there is reported as [`validation-failed`](./validation-failed.md) rather than here. This type covers the request bodies the API binds onto a typed object.
:::

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/invalid-json",
  "title": "Invalid JSON",
  "status": 422,
  "detail": "Invalid JSON",
  "instance": "/api/v1/main/triggers/backfill/delete",
  "errors": [
    {
      "path": "namespace"
    }
  ]
}
```

## How to handle it

Fix the payload and resend. The `detail` is the fixed title rather than the parser's own message, because that message names internal Java classes. When the parser knew where the problem was, a single `errors` entry carries the `path` to it, and no entry is reported when it did not.

For the members every problem document carries, see [Problem Details](./index.md).
