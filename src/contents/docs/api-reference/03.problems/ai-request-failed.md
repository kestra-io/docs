---
title: "Kestra API Error: AI request failed"
h1: AI request failed
sidebarTitle: AI request failed
description: The ai-request-failed problem type is returned when an AI Copilot request cannot be completed, usually because of the model provider or the prompt.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

An AI Copilot request could not be completed.

- **HTTP status** — `422 Unprocessable Content`
- **`type`** — `https://kestra.io/docs/api-reference/problems/ai-request-failed`

## When you get it

- The configured model provider rejects the call or returns an unusable response.
- The prompt, or the flow it was asked to work on, cannot be processed.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/ai-request-failed",
  "title": "AI request failed",
  "status": 422,
  "detail": "The model provider rejected the request: context length exceeded.",
  "instance": "/api/v1/main/ai/generate/flow"
}
```

## How to handle it

This is a client error rather than a server error because the cause is usually the request or the provider configuration, not a fault in Kestra. Retrying an identical prompt rarely helps.

For the members every problem document carries, see [Problem Details](./index.md).
