---
title: runIf Renamed to when on Tasks
sidebarTitle: runIf → when (Tasks)
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The task-level runIf property is renamed to when in Kestra 2.0, aligning it with the when property introduced on all triggers.
---

Kestra 2.0 introduces a `when` property on all triggers to replace the `conditions` list. To unify conditional execution under a single property name, the task-level `runIf` is renamed to `when` in the same release.

No behavioral change. The Pebble expression is rendered at runtime and the task is set to `SKIPPED` if the result is falsy (`false`, `0`, `-0`, or an empty string) — identical to the existing `runIf` behavior.

:::alert{type="warning"}
`runIf` is kept as a deprecated alias in 2.0 so existing flows continue to parse. The alias will be removed in a future release. Update your flows now to avoid a hard break later.
:::

## Before

```yaml
tasks:
  - id: conditional_task
    type: io.kestra.plugin.core.debug.Return
    format: "Hello World!"
    runIf: "{{ inputs.run_task }}"
```

## After

```yaml
tasks:
  - id: conditional_task
    type: io.kestra.plugin.core.debug.Return
    format: "Hello World!"
    when: "{{ inputs.run_task }}"
```

## Migration steps

1. **Search your flows** for `runIf:` and replace each occurrence with `when:`. The property value and any Pebble expressions stay the same.
2. **Validate** by saving the updated flows in the Kestra UI or via the API.

For trigger condition changes (`conditions` → `when` on Schedule and Webhook triggers, `conditions`/`preconditions` → `dependsOn` on Flow triggers), see the [trigger conditions redesign guide](../trigger-conditions-redesign/index.md).
