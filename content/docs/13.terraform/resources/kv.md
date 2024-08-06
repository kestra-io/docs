---
title: kestra_kv
editLink: false
description: |-
  Manages a Kestra KV Pair.
---

# kestra_flow (Resource)

Manages a Kestra KV Pair.

## Example Usage

```hcl
resource "kestra_kv" "new" {
  namespace = "company.team"
  key       = "my_key"
  value     = "Hello World"
  type      = "STRING"
}
```

## Schema

### Required

- `namespace` (String) The flow namespace.
- `key` (String) The key of the KV pair.
- `value` (Multiple) the value of the KV pair.
- `type` (String) the type of the value. Can be a string, number, boolean, datetime, date, duration, or JSON.
