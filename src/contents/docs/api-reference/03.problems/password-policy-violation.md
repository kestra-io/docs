---
title: "Kestra API Error: Password policy not met"
h1: Password policy not met
sidebarTitle: Password policy not met
description: The password-policy-violation problem type is returned when a submitted password does not satisfy the instance's configured password policy.
icon: /src/contents/docs/icons/api.svg
editions: ["EE", "Cloud"]
---

The submitted password does not satisfy the instance's configured password policy.

- **HTTP status** — `422 Unprocessable Content`
- **`type`** — `https://kestra.io/docs/api-reference/problems/password-policy-violation`

## When you get it

- A password is set or changed in a way that breaks one or more policy rules.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/password-policy-violation",
  "title": "Password policy not met",
  "status": 422,
  "detail": "Password policy not met",
  "instance": "/api/v1/users/5Dv3JXqPzT/password",
  "errors": [
    {
      "detail": "must be at least 12 characters long"
    },
    {
      "detail": "must contain at least one digit"
    }
  ]
}
```

## How to handle it

One `errors` entry is reported per unmet rule, so the whole list can be shown at once instead of one rule per attempt.

For the members every problem document carries, see [Problem Details](./index.md).
