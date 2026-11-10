---
title: "Kestra API Error: Authentication required"
h1: Authentication required
sidebarTitle: Authentication required
description: The unauthenticated problem type is returned when a Kestra API request carries no credentials, or credentials the server will not accept.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The request carried no credentials, or credentials the server would not accept.

- **HTTP status** — `401 Unauthorized`
- **`type`** — `https://kestra.io/docs/api-reference/problems/unauthenticated`

## When you get it

- No API token or session cookie is sent.
- The token or session has expired or been revoked.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/unauthenticated",
  "title": "Authentication required",
  "status": 401,
  "detail": "Authentication required",
  "instance": "/api/v1/main/flows"
}
```

## How to handle it

Authenticate and resend. A browser request to a UI route is redirected to the login page instead of receiving this document; API routes always receive the document.

For the members every problem document carries, see [Problem Details](./index.md).
