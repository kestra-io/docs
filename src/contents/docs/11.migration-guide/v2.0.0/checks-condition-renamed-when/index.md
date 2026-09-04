---
title: Check.condition Renamed to when
sidebarTitle: condition → when (Checks)
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The condition property on flow-level checks has been renamed to when in Kestra 2.0.0, aligning it with the when property used across tasks and triggers.
---

Kestra 2.0.0 unifies all Pebble conditional expressions under a single property name: `when`.

The `condition` property on flow-level `checks` is renamed to `when`. A deprecated alias keeps `condition` functional in 2.0.0 so existing flows continue to parse without changes. The alias is scheduled for removal in a future version — update your flows now to avoid a hard break later.

## Before

```yaml
checks:
  - condition: "{{ inputs.environment == 'production' }}"
    message: "This flow can only run in production"
    behavior: BLOCK_EXECUTION
    style: ERROR
```

## After

```yaml
checks:
  - when: "{{ inputs.environment == 'production' }}"
    message: "This flow can only run in production"
    behavior: BLOCK_EXECUTION
    style: ERROR
```

The behavior is identical — the same Pebble rendering and `BLOCK_EXECUTION` / `FAIL_EXECUTION` / `CREATE_EXECUTION` logic apply.

## Migration steps

1. **Search your flows** for `condition:` inside `checks` blocks and replace each occurrence with `when:`. The property value and any Pebble expressions stay the same.
2. **Validate** by saving the updated flows in the Kestra UI or via the API.

:::alert{type="warning"}
The `condition` alias will be removed in a future release. Flows that still use `condition` inside `checks` will fail to parse after the alias is dropped.
:::
