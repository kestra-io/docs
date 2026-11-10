---
title: "Kestra API Error: Invalid entity"
h1: Invalid entity
sidebarTitle: Invalid entity
description: The invalid-entity problem type is returned when a Kestra API request is rejected by a domain rule rather than a field constraint, and for any unmapped 422.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

A domain rule rejects the entity, rather than a field-level constraint. This is also the type reported for any 422 that has no more specific type.

- **HTTP status** — `422 Unprocessable Content`
- **`type`** — `https://kestra.io/docs/api-reference/problems/invalid-entity`

## When you get it

- A KV Store value cannot be stored as submitted.
- A trigger configuration is internally inconsistent.
- An execution's inputs or outputs fail validation.
- A task's worker group matches no configured Worker Queue.
- On Cloud and Enterprise instances, credentials cannot be used in the form they were submitted.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/invalid-entity",
  "title": "Invalid entity",
  "status": 422,
  "detail": "No worker queue matches worker group 'gpu'.",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Unlike `validation-failed`, there is usually no field to attribute this to, so the `detail` carries the whole explanation.

For the members every problem document carries, see [Problem Details](./index.md).
