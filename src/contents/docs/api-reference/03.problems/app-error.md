---
title: "Kestra API Error: App error"
h1: App error
sidebarTitle: App error
description: The app-error problem type is returned when an App rejects a Kestra API request because of its definition or its current runtime state.
icon: /src/contents/docs/icons/api.svg
editions: ["EE", "Cloud"]
---

An App rejected the request because of its definition or its current runtime state.

- **HTTP status** — `422 Unprocessable Content`
- **`type`** — `https://kestra.io/docs/api-reference/problems/app-error`

## When you get it

- An App request is submitted that its definition does not accept.
- An App is acted on in a state that does not allow that transition.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/app-error",
  "title": "App error",
  "status": 422,
  "detail": "App 'onboarding' is not in a state that accepts this request.",
  "instance": "/api/v1/main/apps/onboarding"
}
```

## How to handle it

The `detail` is the App's own explanation, and it decides whether the request or the App definition is what needs changing. See [Apps](../../07.enterprise/04.scalability/apps/index.md).

For the members every problem document carries, see [Problem Details](./index.md).
