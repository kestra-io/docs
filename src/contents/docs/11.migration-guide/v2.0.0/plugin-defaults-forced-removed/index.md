---
title: pluginDefaults.forced Removed from Flows
sidebarTitle: pluginDefaults.forced Removed from Flows
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The forced property is removed from flow-level pluginDefaults in Kestra 2.0. In 2.0, pluginDefaults is removed entirely — migrate to Policies (EE) or inline task values (OSS).
---

The `forced` property is removed from flow-level `pluginDefaults` in Kestra 2.0.

:::alert{type="warning"}
Flows that include `forced: true` inside a `pluginDefaults` block fail to parse after upgrading to 2.0.0. Remove this property before upgrading.
:::

:::alert{type="info"}
**`pluginDefaults` is removed entirely in 2.0.0** — not just `forced: true`. After removing `forced: true`, migrate the remaining `pluginDefaults` entries. See the full [pluginDefaults Removed migration guide](../plugin-defaults-removed/index.md).
:::

## Why the change

`forced: true` in a flow's `pluginDefaults` let a flow author override any value a task explicitly set. This created a security problem: a regular user editing a flow could use `forced: true` to override plugin defaults that a platform administrator had configured at the namespace or tenant level.

In 2.0, `pluginDefaults` is removed in favor of [Policies](../../../07.enterprise/02.governance/policies/index.md) (EE), which give platform administrators centralized, enforceable control over plugin configuration.

## Migration steps

1. Search all flows for `pluginDefaults` blocks that include `forced: true`:

```bash
grep -rl "forced:" flows/
```

2. Remove the `forced: true` line from each flow.

**Before:**

```yaml
pluginDefaults:
  - type: io.kestra.plugin.scripts.runner.docker.Docker
    forced: true
    values:
      pullPolicy: NEVER
```

**After (as an interim step):**

```yaml
pluginDefaults:
  - type: io.kestra.plugin.scripts.runner.docker.Docker
    values:
      pullPolicy: NEVER
```

3. Migrate the remaining `pluginDefaults` entries. See [pluginDefaults Removed](../plugin-defaults-removed/index.md) for the complete guide covering all scopes (flow-level, namespace-level, and global configuration) and the equivalent Policy DSL for Enterprise Edition.
