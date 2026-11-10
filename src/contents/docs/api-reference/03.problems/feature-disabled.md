---
title: "Kestra API Error: Feature disabled by license"
h1: Feature disabled by license
sidebarTitle: Feature disabled by license
description: The feature-disabled problem type is returned when a Kestra API endpoint belongs to a feature the instance's license does not include.
icon: /src/contents/docs/icons/api.svg
editions: ["EE", "Cloud"]
---

The endpoint belongs to a feature that this instance's license does not include.

- **HTTP status** — `403 Forbidden`
- **`type`** — `https://kestra.io/docs/api-reference/problems/feature-disabled`

## When you get it

- An Enterprise endpoint is called whose feature is not in the license.
- The license has expired.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/feature-disabled",
  "title": "Feature disabled by license",
  "status": 403,
  "detail": "Feature 'AUDIT_LOGS' is not enabled by the current license.",
  "instance": "/api/v1/main/auditlogs/search"
}
```

## How to handle it

Do not retry. This differs from [`forbidden`](./forbidden.md): no permission change will make it succeed, because the feature is not available on the instance at all.

For the members every problem document carries, see [Problem Details](./index.md).
