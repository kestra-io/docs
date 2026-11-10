---
title: "Kestra API Error: Entity already exists"
h1: Entity already exists
sidebarTitle: Entity already exists
description: The entity-already-exists problem type is returned when a Kestra API create request uses an identifier that is already taken.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The identifier you are trying to create is already taken.

- **HTTP status** — `409 Conflict`
- **`type`** — `https://kestra.io/docs/api-reference/problems/entity-already-exists`

## When you get it

- A flow, namespace, user, role, or service account is created with an id that exists.
- A create request that had already succeeded is sent again.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/entity-already-exists",
  "title": "Entity already exists",
  "status": 409,
  "detail": "A flow with id 'my-flow' already exists in namespace 'company.team'.",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Use the update endpoint to change the existing resource, or pick a different id. Create is not idempotent, so a retried create reporting this often means the first attempt succeeded.

For the members every problem document carries, see [Problem Details](./index.md).
