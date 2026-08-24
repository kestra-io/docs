---
title: Terraform Provider Changes in Kestra 2.0
sidebarTitle: Terraform provider
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["EE", "Cloud"]
description: Breaking changes in the Kestra Terraform provider for 2.0 — role permissions renamed, plugin defaults removed, templates removed, and worker group changes.
---

The Kestra 2.0 Terraform provider introduces several breaking changes. Terraform state is not affected — resources migrate automatically in the database — but `.tf` files must be updated by hand before you apply against a 2.0 server.

:::alert{type="warning"}
**You cannot use the 1.3.x provider against a 2.0 server.** Pin to `~> 2.0` when upgrading:

```hcl
terraform {
  required_providers {
    kestra = {
      source  = "kestra-io/kestra"
      version = "~> 2.0"
    }
  }
}
```
:::

## `kestra_role` — permissions renamed to resources and actions

The `permissions` block is renamed to `resources`, and the inner `permissions` list is renamed to `actions`. CRUD verbs (`READ`, `CREATE`, `UPDATE`, `DELETE`) are replaced by per-resource action names.

```hcl
# Before
resource "kestra_role" "operator" {
  name = "Operator"

  permissions {
    type        = "FLOW"
    permissions = ["READ", "UPDATE"]
  }

  permissions {
    type        = "EXECUTION"
    permissions = ["READ", "UPDATE"]
  }

  permissions {
    type        = "SETTING"
    permissions = ["READ"]
  }
}

# After
resource "kestra_role" "operator" {
  name = "Operator"

  resources {
    type    = "FLOW"
    actions = ["VIEW", "LIST", "EXECUTE", "DISABLE", "ENABLE"]
  }

  resources {
    type    = "EXECUTION"
    # READ expands to: VIEW, LIST, ACCESS_LOGS, ACCESS_OUTPUTS, ACCESS_FILES, EXPORT, FOLLOW
    # UPDATE expands to: UPDATE, RESTART, KILL, REPLAY, PAUSE, RESUME, CHANGE_LABELS, UNQUEUE, FORCE_RUN
    actions = ["VIEW", "LIST", "ACCESS_LOGS", "ACCESS_OUTPUTS", "ACCESS_FILES", "EXPORT", "FOLLOW", "UPDATE", "RESTART", "KILL", "REPLAY", "PAUSE", "RESUME", "CHANGE_LABELS", "UNQUEUE", "FORCE_RUN"]
  }

  resources {
    type    = "SYSTEM_SETTINGS"
    actions = ["VIEW"]
  }

  resources {
    type    = "TENANT_SETTINGS"
    actions = ["VIEW"]
  }
}
```

### Resource type renames

| Old type | New type | Notes |
|---|---|---|
| `SETTING` | `SYSTEM_SETTINGS` + `TENANT_SETTINGS` | Split into two resources; add a block for each |
| `AI_COPILOT` | `COPILOT` | Renamed |
| `TEST` | `TESTSUITE` | Renamed |
| `APPEXECUTION` | `APP` | Merged; app execution actions are now on `APP` |

### Blocks to remove

| Old block | Action |
|---|---|
| `permissions { type = "TEMPLATE" ... }` | Delete — templates are removed in 2.0 |
| `permissions { type = "IMPERSONATE" ... }` | Delete — impersonate is now an action on `USER`: add `"IMPERSONATE"` to your `USER` actions block instead |

### CRUD → action mapping

Use the [RBAC action model migration guide](../rbac-action-model) for the complete mapping of each CRUD verb to its new action names. The same mapping applies to Terraform `actions` values.

:::alert{type="info"}
Existing role permissions in the database are migrated automatically. You only need to update `.tf` files — `terraform apply` will show a plan that reflects the renamed attributes.
:::

## `kestra_namespace` — plugin_defaults and worker_group removed

### `plugin_defaults` removed

The `plugin_defaults` attribute is dropped from `kestra_namespace`. Namespace-level plugin defaults are migrated to Policies during the upgrade. Remove the attribute from your namespace resources:

```hcl
# Before
resource "kestra_namespace" "company_team" {
  namespace_id = "company.team"

  plugin_defaults = <<EOT
- type: io.kestra.plugin.core.log.Log
  values:
    level: INFO
EOT
}

# After
resource "kestra_namespace" "company_team" {
  namespace_id = "company.team"
}
```

A `kestra_policy` resource is the replacement for managing plugin defaults as code. The exact Terraform syntax for `kestra_policy` is not yet available — it will be documented once the resource is released in the 2.x provider.

### `worker_group` block removed

The `worker_group` block on `kestra_namespace` is dropped. Worker groups and worker queues are now managed separately with tag-based routing. Remove the block from your namespace resources:

```hcl
# Before
resource "kestra_namespace" "company_team" {
  namespace_id = "company.team"

  worker_group {
    key      = "gpu-workers"
    fallback = "WAIT"
  }
}

# After
resource "kestra_namespace" "company_team" {
  namespace_id = "company.team"
}
```

New Terraform resources for worker groups and worker queues will be documented once they are available in the 2.x provider. For now, manage worker group assignments through the Kestra UI or API.

## `kestra_flow` — pluginDefaults in flow content

The `pluginDefaults` keyword is no longer parsed inside flow YAML in Kestra 2.0. If your `kestra_flow` resources embed a `pluginDefaults` block in their `content`, remove it:

```hcl
# Before
resource "kestra_flow" "example" {
  namespace = "company.team"
  flow_id   = "my_flow"

  content = <<EOT
id: my_flow
namespace: company.team

pluginDefaults:
  - type: io.kestra.plugin.core.log.Log
    values:
      level: DEBUG

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: Hello
EOT
}

# After
resource "kestra_flow" "example" {
  namespace = "company.team"
  flow_id   = "my_flow"

  content = <<EOT
id: my_flow
namespace: company.team

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    level: DEBUG
    message: Hello
EOT
}
```

Inline the values directly on the task, or use a `kestra_policy` with an `Add` rule to apply defaults across a namespace. See [pluginDefaults removed](../plugin-defaults-removed) for the full migration options.

## `kestra_template` — remove

Templates are removed in 2.0. Delete all `kestra_template` resources and any `data "kestra_template"` data sources from your configuration before applying against a 2.0 server.

```hcl
# Remove entirely
resource "kestra_template" "my_template" { ... }
data "kestra_template" "my_template" { ... }
```

## Migration steps

1. **Pin the provider** to `~> 2.0` in `required_providers`.
2. **Update `kestra_role` resources** — rename `permissions` blocks to `resources`, rename the inner `permissions` list to `actions`, replace CRUD verbs with new action names, and update any renamed or removed resource types.
3. **Remove `plugin_defaults`** from `kestra_namespace` resources.
4. **Remove `worker_group`** from `kestra_namespace` resources.
5. **Remove `pluginDefaults`** from flow content strings in `kestra_flow` resources.
6. **Delete `kestra_template` resources** and data sources.
7. **Run `terraform plan`** against the upgraded 2.0 server to review changes before applying.

## Related

- [RBAC action model](../rbac-action-model) — full CRUD-to-action mapping table
- [pluginDefaults removed](../plugin-defaults-removed) — migration options for flow and namespace plugin defaults
- [Policies](../../../07.enterprise/02.governance/policies/index.md) — the replacement for plugin defaults in EE
