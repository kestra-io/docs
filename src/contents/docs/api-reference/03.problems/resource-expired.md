---
title: "Kestra API Error: Resource has expired"
h1: Resource has expired
sidebarTitle: Resource has expired
description: The resource-expired problem type is returned when a Kestra resource existed but its lifetime has passed, such as a KV Store value read after its TTL.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

The resource existed, but its lifetime has passed.

- **HTTP status** — `410 Gone`
- **`type`** — `https://kestra.io/docs/api-reference/problems/resource-expired`

## When you get it

- A KV Store value is read after its TTL has elapsed.

## Example response

A response reporting this problem:

```json
{
  "type": "https://kestra.io/docs/api-reference/problems/resource-expired",
  "title": "Resource has expired",
  "status": 410,
  "detail": "The requested value has expired",
  "instance": "/api/v1/main/namespaces/company.team/kv/my-key"
}
```

## How to handle it

Write the value again rather than retrying the read. The expired entry is deleted as part of the read that reports it, so reading the same key again reports [`not-found`](./not-found.md): this response is the one chance to tell an expired value apart from a key that was never set.

For the members every problem document carries, see [Problem Details](./index.md).
