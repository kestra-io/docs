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

| Before (1.x) | After (2.x) |
|---|---|
| Flow-level `pluginDefaults:` block | Values inlined onto tasks (OSS), or a `reference` Policy attached via `policyRefs:` (EE) |
| Namespace-level Plugin Defaults (EE) | Namespace-scoped Policy (UI / API) — existing namespace-level defaults are migrated automatically |
| Tenant-level plugin defaults (EE) | Tenant-scoped Policy (UI / API) |
| `kestra.plugins.defaults` in server config | Static policy under `kestra.policies` in server config |
| `forced: false` (fill only when unset) | `Add` rule with `override: false` (the default) |
| `forced: true` (policy value always wins) | `Add` rule with `override: true` |

All are removed in 2.0.0. In **Enterprise Edition**, they are replaced by [Policies](../../../07.enterprise/02.governance/policies/index.md) — a governance layer that covers injection, enforcement, and validation in one place. Policies also extend `pluginDefaults` with the ability to target **flow-level properties** (`retry`, `concurrency`, `labels`) in addition to plugin properties. In **OSS**, there is no direct replacement; move default values inline onto each task or use flow-level variables.

Precedence is preserved. Policies apply along a scope chain `STATIC → INSTANCE → TENANT → NAMESPACE`:

- **Non-overriding** (`override: false`) values fill properties the flow author left unset; the innermost scope wins — the same "task > flow > namespace > global" precedence as 1.x non-forced defaults.
- **Overriding** (`override: true`) values replace the author's value; the outermost scope wins — the same "global beats namespace" precedence as 1.x forced defaults.

## Before you migrate — build your inventory

Collect every place plugin defaults are defined **before** upgrading. The 1.x UI for namespace and tenant defaults does not exist in 2.x.

1. **Server configuration**: every entry under `kestra.plugins.defaults` in your `application.yml` or Helm values.
2. **Tenant and namespace defaults** (EE): export them from each tenant's and namespace's **Plugin Defaults** settings page, or via the 1.x API.
3. **Flow-level blocks**: search your flow sources for `pluginDefaults:`:

```bash
grep -rl "pluginDefaults:" flows/
```

## Migration — Enterprise Edition

Each `pluginDefaults` entry maps to an `Add` rule inside a Policy.

### Step 1 — global server config → static policy

Entries from `kestra.plugins.defaults` map to a static policy declared under `kestra.policies` in server configuration — not a tenant-scoped or namespace-scoped Policy. Static policies are cross-tenant, form the outermost scope, and are read-only through the API.

**Before (`application.yml`):**

```yaml
kestra:
  plugins:
    defaults:
      - type: io.kestra.plugin.scripts.shell.Commands
        values:
          containerImage: ubuntu:24.04
      - type: io.kestra.plugin.aws
        forced: true
        values:
          region: eu-west-1
```

**After (`application.yml`):**

```yaml
kestra:
  policies:
    - id: instance-plugin-defaults
      description: "Migrated from kestra.plugins.defaults."
      rules:
        - type: io.kestra.plugin.ee.rules.Add
          on: plugin
          where:
            - field: type
              operator: EQUAL_TO
              value: io.kestra.plugin.scripts.shell.Commands
          values:
            containerImage: ubuntu:24.04
        - type: io.kestra.plugin.ee.rules.Add
          on: plugin
          override: true
          where:
            - field: type
              operator: STARTS_WITH
              value: io.kestra.plugin.aws
          values:
            region: eu-west-1
```

- `id` is required (lowercase alphanumeric and hyphens).
- Do not set `scope`, `tenantId`, or `namespace` — static policies are always installation-wide.
- A malformed static policy prevents server startup. Validate in staging first.

### Step 2 — namespace-level Plugin Defaults → namespace Policy

Recreate each entry as an `Add` rule in a namespace-scoped Policy, via the **Policies** UI or the API:

```
POST /api/v1/{tenant}/namespaces/{namespace}/policies
```

Namespace policies apply to the namespace and all its child namespaces, matching 1.x namespace-default inheritance.

:::alert{type="info"}
Existing namespace-level Plugin Defaults are migrated to Policies automatically during the 2.0 upgrade. Review the migrated Policies and adjust if needed.
:::

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

Scope, tenant, and namespace come from the URL — not from the policy body.

### Step 3 — flow-level pluginDefaults

Flow-level `pluginDefaults` never supported `forced` in 1.x (it was stripped with a warning). Two migration options:

**Option A — inline the values (recommended for one or two flows).** Copy each default's `values` onto the matching tasks and delete the `pluginDefaults:` block.

**Option B — reference Policy (recommended when many flows share the same block).** Create a Policy with `enforcement: reference` at the namespace or tenant scope. Each flow opts in with `policyRefs:`.

**Before (1.x flow):**

```yaml
id: daily-report
namespace: company.team

pluginDefaults:
  - type: io.kestra.plugin.scripts.python.Script
    values:
      containerImage: ghcr.io/kestra-io/pydata:latest

tasks:
  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    script: ...
```

**After — the shared reference Policy (created once, on `company.team`):**

```yaml
id: pydata-defaults
description: "Python data science container image default."
enforcement: reference
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: plugin
    where:
      - field: type
        operator: EQUAL_TO
        value: io.kestra.plugin.scripts.python.Script
    values:
      containerImage: ghcr.io/kestra-io/pydata:latest
```

**After — the flow:**

```yaml
id: daily-report
namespace: company.team

policyRefs:
  - pydata-defaults

tasks:
  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    script: ...
```

A `reference` Policy applies only to flows that list it in `policyRefs`. `active` Policies apply automatically to every flow in scope.

### Forced defaults

`forced: true` on a `pluginDefaults` entry becomes `override: true` on the corresponding `Add` rule.

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

## Behavioral differences

A few behaviors differ from 1.x `pluginDefaults`:

- **Lists are replaced, not merged.** Map-valued properties deep-merge as before, but if a Policy injects a list (for example, a list of environment variables), it replaces the author's list entirely when `override: true`. Check any default whose `values` contain lists.
- **Plugin aliases are not resolved.** 1.x resolved deprecated plugin aliases through the plugin registry. Policy conditions match the `type` string literally. If your flows use an alias, cover both the alias and the canonical name — or migrate all flows to the canonical name first.
- **`evaluate` mode does not inject values.** Only `active` and attached `reference` Policies mutate flows. Do not leave a migrated Policy in `evaluate` in production — tasks run without their former defaults.
- **`Add` + `Delete` conflicts are rejected at save time.** 1.x had no `Delete` concept, so this only matters if you also adopt new validation rules. If one Policy injects a property and another removes it, saving any affected flow fails with an error citing both policies.

## Verify the migration

**Preview the effective policy chain for a flow:**

```
POST /api/v1/{tenant}/flows/policies/preview
```

Send the flow source; the response shows the mutated source with per-property attribution of which Policy injected what.

**Dry-run a single policy against existing flows:**

```
GET /api/v1/{tenant}/policies/{id}/evaluate
GET /api/v1/{tenant}/namespaces/{namespace}/policies/{id}/evaluate
```

**Smoke test**: run one execution per critical flow and inspect the task configuration used (container image, region, task runner) in the execution view.

## Migration checklist

1. Inventory all plugin defaults before upgrading — server config, namespace/tenant UI, and flow YAML files.
2. Remove `kestra.plugins.defaults` from server config and add equivalent static policies under `kestra.policies`.
3. For each namespace that had Plugin Defaults, review the auto-migrated Policies and adjust if needed.
4. For each flow with a `pluginDefaults:` block, either inline the values onto tasks or create a reference Policy and add `policyRefs:` to the flow.
5. Verify flows parse correctly: `kestra flow validate /path/to/flow.yml`
6. Grant teams that managed namespace defaults the `POLICY` permission (`VIEW`, `CREATE`, `UPDATE`, `DELETE`) — it is separate from namespace edit rights.

:::alert{type="info"}
See [Policies](../../../07.enterprise/02.governance/policies/index.md) for the full Policy DSL reference, enforcement modes, inheritance behavior, and examples.
:::
