---
title: "Kestra API Error: Invalid query filters"
h1: Invalid query filters
sidebarTitle: Invalid query filters
description: The invalid-query-filters problem type is returned when the filters on a Kestra API list endpoint cannot be parsed or reference a field that cannot be filtered.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The `filters` on a list endpoint could not be parsed, or they reference something that cannot be filtered on.

- **HTTP status** — `400 Bad Request`
- **`type`** — `https://kestra.io/docs/api-reference/problems/invalid-query-filters`

## When you get it

- The `filters[...]` syntax is malformed.
- The field is one the endpoint does not support filtering on.
- The operator does not apply to that field's type.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/invalid-query-filters",
  "title": "Invalid query filters",
  "status": 400,
  "detail": "Unknown filter field 'stat'.",
  "instance": "/api/v1/main/executions/search"
}
```

## How to handle it

Check the field and the operator against the filters the endpoint documents. An unrecognised filter is rejected rather than ignored, so that a query never silently returns unfiltered results.

For the members every problem document carries, see [Problem Details](./index.md).
