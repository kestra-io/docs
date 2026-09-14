---
title: "Kestra API Error: Validation failed"
h1: Validation failed
sidebarTitle: Validation failed
description: The validation-failed problem type is returned when a Kestra API request is well formed but the entity it carries breaks one or more constraints.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The request is well formed, but the entity it carries breaks one or more constraints. One `errors` entry is reported per violated constraint.

- **HTTP status** — `422 Unprocessable Content`
- **`type`** — `https://kestra.io/docs/api-reference/problems/validation-failed`

## When you get it

- A required property is absent, empty, or out of range.
- A flow, trigger, or input definition fails its own validation rules.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/validation-failed",
  "title": "Validation failed",
  "status": 422,
  "detail": "Validation failed",
  "instance": "/api/v1/main/flows",
  "errors": [
    {
      "detail": "must not be null",
      "pointer": "/tasks/0/type",
      "path": "tasks[my-task].type"
    },
    {
      "detail": "must not be empty",
      "pointer": "/id",
      "path": "id"
    }
  ]
}
```

## How to handle it

Render the `errors` array against your form. Each entry carries two locators because neither is sufficient alone: `pointer` is a valid RFC 6901 JSON Pointer for machine use, and `path` names tasks and inputs by their id for display. Entries are ordered deterministically, so the same input always produces the same document.

For the members every problem document carries, see [Problem Details](./index.md).
