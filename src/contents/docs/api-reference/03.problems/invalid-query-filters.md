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
- A mutating by-query endpoint (`DELETE`, `POST`, or `PUT` on a `.../by-query` path) received a filter as a flat query parameter, such as `?namespace=x`, instead of the `filters[...]` form.

The last case applies to bulk endpoints for executions, flows, and triggers (delete, kill, restart, replay, change-status, labels, pause/resume, unqueue, force-run, enable/disable, and similar). Read-only exports (`GET .../export/by-query`) are not affected.

## Example responses

A response for a malformed or unsupported filter field:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/invalid-query-filters",
  "title": "Invalid query filters",
  "status": 400,
  "detail": "Unknown filter field 'stat'.",
  "instance": "/api/v1/main/executions/search"
}
```

A response for a legacy flat parameter on a mutating by-query endpoint:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/invalid-query-filters",
  "title": "Invalid query filters",
  "status": 400,
  "detail": "'namespace' is not a supported query parameter on this endpoint, use filters[namespace][EQUALS]=<value>",
  "instance": "/api/v1/main/flows/delete/by-query"
}
```

## How to handle it

Check the field and the operator against the filters the endpoint documents. An unrecognised filter is rejected rather than ignored, so that a query never silently returns unfiltered results.

For the flat-parameter case, rewrite the call to use the `filters[<field>][<op>]=<value>` form. For example:

```
# Legacy form: rejected on mutating by-query endpoints
DELETE /api/v1/main/executions/delete/by-query?namespace=company.team

# Correct form
DELETE /api/v1/main/executions/delete/by-query?filters[namespace][EQUALS]=company.team
```

Multiple filters are passed as separate query parameters:

```
DELETE /api/v1/main/executions/delete/by-query?filters[namespace][EQUALS]=company.team&filters[flowId][EQUALS]=my_flow
```

:::alert{type="info"}
Unauthenticated requests to by-query endpoints return `401` before the filter check runs, so a `400 invalid-query-filters` response always means the request was authenticated.
:::

For the full list of available fields and operators per resource type, see [Query filter reference](../04.query-filters.md).

For the members every problem document carries, see [Problem Details](./index.md).
