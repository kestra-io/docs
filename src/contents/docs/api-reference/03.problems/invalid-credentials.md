---
title: "Kestra API Error: Invalid credentials"
h1: Invalid credentials
sidebarTitle: Invalid credentials
description: The invalid-credentials problem type is returned when a Kestra API request submits a credential, such as an existing password, that does not match the one on record.
icon: /src/contents/docs/icons/api.svg
editions: ["EE", "Cloud"]
---

A credential submitted inside the request does not match the one on record.

- **HTTP status** — `400 Bad Request`
- **`type`** — `https://kestra.io/docs/api-reference/problems/invalid-credentials`

## When you get it

- A password change supplies an old password that is not the current one.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/invalid-credentials",
  "title": "Invalid credentials",
  "status": 400,
  "detail": "The old password is incorrect.",
  "instance": "/api/v1/users/5Dv3JXqPzT/password"
}
```

## How to handle it

This is not the type for a failed sign-in. A request carrying no credentials, or credentials the server rejects while authenticating it, is reported as [`unauthenticated`](./unauthenticated.md). This type means the request was authenticated, and then submitted a further credential that did not match.

For the members every problem document carries, see [Problem Details](./index.md).
