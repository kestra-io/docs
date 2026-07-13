---
title: pluginDefaults Removed
sidebarTitle: pluginDefaults Removed
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: The pluginDefaults keyword is removed in Kestra 2.0 at all scopes. Replace flow-level and namespace-level defaults with Policies in Enterprise Edition, or inline task values in OSS.
---

The `pluginDefaults` keyword is removed in Kestra 2.0 in all editions and at all scopes — flow level, namespace level (EE), and global server configuration.

:::alert{type="warning"}
Flows that contain a `pluginDefaults` block fail to parse after upgrading to 2.0.0. Remove or migrate all `pluginDefaults` entries before upgrading.
:::

## What changed

In Kestra 1.x, plugin defaults could be defined at three levels:

| Level | 1.x location |
|-------|-------------|
| Flow | `pluginDefaults:` block inside the flow YAML |
| Namespace (EE) | **Plugin Defaults** tab in the Kestra UI |
| Global | `kestra.plugins.defaults` in the server configuration file |

All three are removed in 2.0.0. In **Enterprise Edition**, they are replaced by [Policies](../../../07.enterprise/02.governance/policies/index.md) — a governance layer that covers injection, enforcement, and validation in one place. Policies also extend `pluginDefaults` with the ability to target **flow-level properties** (`retry`, `concurrency`, `labels`) in addition to plugin properties. In **OSS**, there is no direct replacement; move default values inline onto each task or use flow-level variables.

## Migration — Enterprise Edition

Each `pluginDefaults` entry maps to a `mutate.Add` rule inside a Policy.

### Flow-level pluginDefaults

Lift the entries to a namespace-scoped Policy, or convert them to a [reference Policy](../../../07.enterprise/02.governance/policies/index.md#reference-policies) that flows opt into with `policyRefs:`.

**Before (1.x flow):**

```yaml
pluginDefaults:
  - type: io.kestra.plugin.scripts.python.Script
    values:
      containerImage: python:slim
      taskRunner:
        type: io.kestra.plugin.scripts.runner.docker.Docker
```

**After (2.0 namespace-scoped Policy):**

```yaml
id: python-defaults
description: "Default container image and runner for Python script tasks."
enforcement: active
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: plugin
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.scripts.python
    values:
      containerImage: python:slim
      taskRunner:
        type: io.kestra.plugin.scripts.runner.docker.Docker
```

### Namespace-level Plugin Defaults

Recreate each entry as a `mutate.Add` rule in a namespace-scoped Policy.

**Before (1.x namespace Plugin Default):**

```yaml
- type: io.kestra.plugin.aws
  values:
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    region: "us-east-1"
```

**After (2.0 namespace-scoped Policy):**

```yaml
id: aws-credentials
description: "Central AWS credentials for all AWS plugin tasks."
enforcement: active
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: plugin
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.aws
    values:
      accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
      region: "us-east-1"
```

### Global plugin defaults

Entries from `kestra.plugins.defaults` in the server configuration map to tenant-scoped Policies — Policies attached to the tenant root rather than a specific namespace.

### Forced defaults

`forced: true` on a `pluginDefaults` entry becomes `override: true` on the corresponding `mutate.Add` rule.

**Before:**

```yaml
pluginDefaults:
  - type: io.kestra.plugin.scripts.runner.docker.Docker
    forced: true
    values:
      pullPolicy: NEVER
```

**After:**

```yaml
id: docker-pull-policy
description: "Force Docker pull policy to NEVER across all script tasks."
enforcement: active
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: plugin
    where:
      - field: type
        operator: EQUAL_TO
        value: io.kestra.plugin.scripts.runner.docker.Docker
    override: true
    values:
      pullPolicy: NEVER
```

## Migration — OSS

OSS does not include Policies. There is no centralized replacement for `pluginDefaults` in OSS.

Your options are:

- **Inline values** — move the default values directly onto each task that used them.
- **Flow variables** — define a variable at the flow level and reference it in each task with `{{ vars.myVariable }}`.
- **Upgrade to Enterprise Edition** — use Policies for centralized, enforced defaults across namespaces.

## Migration steps

1. Search all flows for `pluginDefaults` blocks:

```bash
grep -rl "pluginDefaults:" flows/
```

2. Remove the `pluginDefaults` block from each flow.
3. Move default values inline onto affected tasks (OSS), or create a namespace-scoped Policy (EE).
4. For namespace-level Plugin Defaults, recreate them as namespace-scoped Policies in the UI or via the API.
5. For global `kestra.plugins.defaults` entries, create tenant-scoped Policies.
6. Verify flows parse correctly by running `kestra flow validate` before deploying.

:::alert{type="info"}
See [Policies](../../../07.enterprise/02.governance/policies/index.md) for the full Policy DSL reference, enforcement modes, inheritance behavior, and examples.
:::
