---
title: pluginDefaults.forced Removed from Flows
sidebarTitle: pluginDefaults.forced Removed from Flows
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The forced property is removed from flow-level pluginDefaults in Kestra 2.0. Use namespace-level Plugin Defaults or global configuration to enforce defaults that tasks cannot override.
---

The `forced` property is removed from flow-level `pluginDefaults` in Kestra 2.0.

:::alert{type="warning"}
Flows that include `forced: true` inside a `pluginDefaults` block will fail to parse after upgrading to 2.0.0. Remove this property before upgrading.
:::

## Why the change

`forced: true` in a flow's `pluginDefaults` let a flow author override any value a task explicitly set. This created a security problem: a regular user editing a flow could use `forced: true` to override plugin defaults that a platform administrator had configured at the namespace or tenant level. Platform administrators are now solely responsible for enforcing defaults, and must do so at the namespace or global configuration level.

Flow-level `pluginDefaults` continue to work for setting convenient defaults — they just can no longer override what a task explicitly declares.

## Migration steps

1. Search all flows for `pluginDefaults` blocks that include `forced: true`.
2. Remove the `forced: true` line from each flow.
3. If you need to prevent tasks from overriding a default, move that default to the namespace **Plugin Defaults** tab (Enterprise Edition) or to the `kestra.plugins.defaults` section of your global Kestra configuration.

**Before**

```yaml
pluginDefaults:
  - type: io.kestra.plugin.scripts.runner.docker.Docker
    forced: true
    values:
      pullPolicy: NEVER
```

**After**

```yaml
pluginDefaults:
  - type: io.kestra.plugin.scripts.runner.docker.Docker
    values:
      pullPolicy: NEVER
```

To enforce the value so tasks cannot override it, configure `forced: true` at the global or namespace level instead:

```yaml
# kestra.yml — global configuration
kestra:
  plugins:
    defaults:
      - type: io.kestra.plugin.scripts.runner.docker.Docker
        forced: true
        values:
          pullPolicy: NEVER
```
