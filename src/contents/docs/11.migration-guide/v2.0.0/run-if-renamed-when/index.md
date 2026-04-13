---
title: runIf Renamed to when on Tasks
sidebarTitle: runIf → when (Tasks)
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The task-level runIf property has been renamed to when in Kestra 2.0.0, aligning it with the when property introduced on triggers.
---

Kestra 2.0.0 unifies conditional execution under a single property name: `when`.

- **Tasks** — `runIf` is renamed to `when`.
- **Triggers** — the `conditions` list is deprecated in favor of a new `when` Pebble expression string.

Both properties behave the same way: the Pebble expression is rendered at runtime, and if the result is falsy (`false`, `0`, `-0`, or an empty string), the task is set to `SKIPPED` or the trigger does not fire.

A deprecated alias keeps `runIf` functional in 2.0.0 so existing flows continue to parse without changes. The alias is scheduled for removal in a future version — update your flows now to avoid a hard break later.

## Tasks: runIf → when

### Before

```yaml
tasks:
  - id: conditional_task
    type: io.kestra.plugin.core.debug.Return
    format: "Hello World!"
    runIf: "{{ inputs.run_task }}"
```

### After

```yaml
tasks:
  - id: conditional_task
    type: io.kestra.plugin.core.debug.Return
    format: "Hello World!"
    when: "{{ inputs.run_task }}"
```

The behavior is identical — the same Pebble rendering and `SKIPPED` state logic apply.

## Triggers: conditions → when

The `conditions` list on triggers is deprecated. Replace it with a single `when` Pebble expression.

### Before

```yaml
triggers:
  - id: on_success
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatus
        in:
          - SUCCESS
```

### After

```yaml
triggers:
  - id: on_success
    type: io.kestra.plugin.core.trigger.Flow
    when: "{{ trigger.executionStatus == 'SUCCESS' }}"
```

## Migration steps

1. **Search your flows** for `runIf:` and replace each occurrence with `when:`. The property value and any Pebble expressions stay the same.
2. **Search your flows** for `conditions:` on trigger blocks and replace them with an equivalent `when:` Pebble expression.
3. **Validate** by saving the updated flows in the Kestra UI or via the API.

:::alert{type="warning"}
The `runIf` alias will be removed in a future release. Flows that still use `runIf` will fail to parse after the alias is dropped.
:::
