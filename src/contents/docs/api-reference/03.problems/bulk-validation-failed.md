---
title: "Kestra API Error: Bulk validation failed"
h1: Bulk validation failed
sidebarTitle: Bulk validation failed
description: The bulk-validation-failed problem type is returned when a Kestra API bulk endpoint rejects a request, with one errors entry per rejected item.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

A bulk endpoint rejected the request and reports one `errors` entry per rejected item.

- **HTTP status** — `400 Bad Request`
- **`type`** — `https://kestra.io/docs/api-reference/problems/bulk-validation-failed`

## When you get it

- One or more items in a bulk create, update, or delete cannot be accepted.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/bulk-validation-failed",
  "title": "Bulk validation failed",
  "status": 400,
  "detail": "Bulk validation failed",
  "instance": "/api/v1/main/executions/resume/by-ids",
  "errors": [
    {
      "detail": "Execution '4NFYr' is not paused.",
      "path": "4NFYr",
      "type": "https://kestra.io/docs/api-reference/problems/conflict"
    },
    {
      "detail": "Execution '7wKmQ' not found.",
      "path": "7wKmQ",
      "type": "https://kestra.io/docs/api-reference/problems/not-found"
    }
  ]
}
```

## How to handle it

Each entry names the item in `path` and carries its own `type`, so a missing item can be told apart from a conflicting one without parsing text. No item is partially applied: the whole request is rejected.

For the members every problem document carries, see [Problem Details](./index.md).
