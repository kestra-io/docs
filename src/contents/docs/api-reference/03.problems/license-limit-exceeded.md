---
title: "Kestra API Error: License limit reached"
h1: License limit reached
sidebarTitle: License limit reached
description: The license-limit-exceeded problem type is returned when a license check fails while serving a Kestra API request, for example an expired license or a configuration the license does not cover.
icon: /src/contents/docs/icons/api.svg
editions: ["EE", "Cloud"]
---

A license check failed while the request was being served.

- **HTTP status** — `403 Forbidden`
- **`type`** — `https://kestra.io/docs/api-reference/problems/license-limit-exceeded`

## When you get it

- The license has expired, or the instance is configured to use something the license does not cover.

Most license checks run when the instance starts, and a failing one stops it from starting rather than producing this response, so this type is rare in practice. A single feature that the license does not include is reported as [`feature-disabled`](./feature-disabled.md) instead.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/license-limit-exceeded",
  "title": "License limit reached",
  "status": 403,
  "detail": "The maximum number of Kestra Worker threads allowed by the license has been exceeded (64/32). Please reach out to sales@kestra.io.",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Do not retry. The `detail` names what the license does not allow, and resolving it needs a configuration or a licensing change, not a change to the request.

For the members every problem document carries, see [Problem Details](./index.md).
