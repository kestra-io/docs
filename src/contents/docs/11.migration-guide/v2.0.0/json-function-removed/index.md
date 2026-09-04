---
title: json() Function Removed
sidebarTitle: json() → fromJson()
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The json() Pebble function has been removed in Kestra 2.0.0. Replace all calls to json() with fromJson() — the signature is identical.
---

The `json()` Pebble function has been removed in Kestra 2.0.0. Replace every call to `json(...)` with `fromJson(...)`. The function signature and behavior are identical.

## Before

```twig
{{ json(outputs.request.body).products[0].id }}
{{ json(kv('my_json_key')).field }}
```

## After

```twig
{{ fromJson(outputs.request.body).products[0].id }}
{{ fromJson(kv('my_json_key')).field }}
```

## What to update

Search your flows and templates for `json(` and replace each occurrence with `fromJson(`. The `json` Pebble test (`{% if x is json %}`) is unrelated and still works — only the function call form changes.
