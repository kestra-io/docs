---
title: "Kestra API Error: Too many requests"
h1: Too many requests
sidebarTitle: Too many requests
description: The too-many-requests problem type is returned when a Kestra API request is rejected because a capacity or usage cap has been reached.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The request was rejected because a capacity or usage cap has been reached.

- **HTTP status** — `429 Too Many Requests`
- **`type`** — `https://kestra.io/docs/api-reference/problems/too-many-requests`

## When you get it

- AI Copilot is already running its maximum number of concurrent turns.
- An AI Copilot thread has reached the maximum number of turns it may hold.
- A rate limit in front of the instance has been reached.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/too-many-requests",
  "title": "Too many requests",
  "status": 429,
  "detail": "AI Copilot is at capacity (8 concurrent turns); retry shortly.",
  "instance": "/api/v1/main/ai/threads/4NFYrJfMEBQ/chat"
}
```

## How to handle it

Back off before retrying, honouring `Retry-After` when the response carries it. The two AI Copilot caps differ: capacity is transient and worth retrying, while a thread that has reached its turn limit will not accept more, so start a new thread instead.

For the members every problem document carries, see [Problem Details](./index.md).
