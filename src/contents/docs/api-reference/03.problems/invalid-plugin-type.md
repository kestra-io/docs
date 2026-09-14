---
title: "Kestra API Error: Invalid plugin type"
h1: Invalid plugin type
sidebarTitle: Invalid plugin type
description: The invalid-plugin-type problem type is returned when a request binds a plugin object straight from JSON and its type field names a class the instance cannot resolve.
icon: /src/contents/docs/icons/api.svg
editions: ["OSS", "EE", "Cloud"]
---

A `type` field in the payload names a plugin class this instance cannot resolve.

- **HTTP status** — `422 Unprocessable Content`
- **`type`** — `https://kestra.io/docs/api-reference/problems/invalid-plugin-type`

## When you get it

- A request binds a task, trigger, or condition object straight from JSON, and the plugin class it names is misspelt or not installed on the instance you are calling.

:::alert{type="info"}
A misspelt or missing plugin type inside a **flow** does not produce this response. Flows, policies, and dashboards are submitted as source text and validated after parsing, so an unresolvable type there is reported as [`validation-failed`](./validation-failed.md), with the offending type named in an `errors` entry. That is how you will meet this failure from the current API; no endpoint binds a plugin object directly today, and the type stays published for the ones that will.
:::

## The `errors` entry

When this type is reported, a single `errors` entry names the unresolved class and where it sits in the submitted document:

```json
{
  "detail": "Unknown type 'io.kestra.plugin.scripts.python.Comands'.",
  "path": "tasks[0].type"
}
```

Every other member is the same as on any problem document.

## How to handle it

Check the spelling first, then whether the plugin is installed. `GET /api/v1/plugins` lists what the instance has.

For the members every problem document carries, see [Problem Details](./index.md).
