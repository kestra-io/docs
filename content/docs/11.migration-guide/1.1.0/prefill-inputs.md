---
title: New prefill Property for Inputs
icon: /docs/icons/migration-guide.svg
release: 1.1.0
editions: ["OSS", "EE"]
---

## Overview

A new `prefill` property has been added to input definitions to let users start with an initial value that can be cleared or set to `null` when the input is not required.

**What changed:**
Inputs can now define a `prefill` value, which works like an editable default. Unlike `defaults`, a `prefill` value does not persist if the user removes it. This allows workflows to support optional inputs that start with a suggestion but can still be reset to `null` at runtime.

**Impact:**
While not a breaking change, this update clarifies how `required`, `defaults`, and `prefill` behave together:

* `prefill` and `defaults` cannot be used on the same input.
* Use `prefill` when `required: false` and the user should be able to clear the value.
* Use `defaults` when `required: true` or when the value must always have a non-null default.
* If `defaults` is used with `required: false`, the value will still reset to the default when cleared, which may not be desired; use `prefill` rather than `defaults` for those scenarios.

**Example:**

```yaml
inputs:
  - id: nullable_string_with_prefilled_default
    type: STRING
    prefill: "This is a prefilled value you can remove (set to null if needed)"
    required: false
```

**Migration:** No migration is required. For optional inputs that previously used `defaults` but need to allow clearing or null values, switch those definitions to `prefill` instead.
