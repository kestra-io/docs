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

Use a `kestra_policy` resource to apply plugin defaults as a namespace-scoped `Add` rule:

```hcl
resource "kestra_policy" "log_defaults" {
  scope     = "NAMESPACE"
  policy_id = "log-defaults"
  namespace = "company.team"

  content = <<EOT
id: log-defaults
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: PLUGIN
    where:
      - field: type
        operator: EQUAL_TO
        value: io.kestra.plugin.core.log.Log
    values:
      level: INFO
EOT
}
```

See [Policies](../../../07.enterprise/02.governance/policies/index.md) for the full rule syntax and available rule types.

### `worker_group` block removed

The `worker_group` block on `kestra_namespace` is replaced by `default_worker_selector`. Instead of routing by worker group key, the namespace now declares a tag set matched against Worker Queues. Note that `fallback` defaults to `FAIL` instead of `WAIT`.

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

  default_worker_selector {
    tags     = ["gpu"]        # must match the tag set of the target Worker Queue
    fallback = "WAIT"         # set explicitly if you relied on the old default
  }
}
```

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

## New resources: `kestra_worker_queue` and `kestra_worker_group`

Worker Queues and Worker Groups are now first-class Terraform resources. Define queues with a tag set, then subscribe worker groups to them with optional capacity reservation.

```hcl
resource "kestra_worker_queue" "gpu" {
  queue_id    = "gpu-queue"
  name        = "GPU Queue"
  tags        = ["gpu", "high-memory"]
}

resource "kestra_worker_group" "gpu_workers" {
  group_id    = "gpu-workers"
  name        = "GPU Workers"

  # Subscribe to the default queue with no reservation
  subscriptions {
    worker_queue_id = "default"
  }

  # Reserve 50% of slots for GPU workloads; lend idle slots to other queues
  subscriptions {
    worker_queue_id  = kestra_worker_queue.gpu.queue_id
    reserved_percent = 50
    mode             = "ELASTIC"
  }
}
```

`mode` is `STRICT` (reserved slots are exclusive) or `ELASTIC` (idle reserved slots may be lent to other subscriptions). `reserved_percent` accepts `-1` (no reservation, the default) or a value from 1 to 100; the sum across all subscriptions on a group must not exceed 100.

See the [Worker Groups reference](../../../07.enterprise/04.scalability/worker-group/index.md) for the full routing model.

## New resource: `kestra_policy`

Policies are now a first-class Terraform resource at `INSTANCE`, `TENANT`, or `NAMESPACE` scope. The `content` attribute takes the raw policy YAML:

```hcl
resource "kestra_policy" "deny_shell" {
  scope     = "TENANT"
  policy_id = "deny-shell-commands"

  content = <<EOT
id: deny-shell-commands
displayName: Deny shell commands
enforcement: ACTIVE
target:
  namespaces:
    - company.team
rules:
  - type: io.kestra.plugin.ee.rules.Deny
    on: PLUGIN
    action: BLOCK
    errorMessage: Shell commands are not allowed
    where:
      - field: type
        operator: EQUAL_TO
        value: io.kestra.plugin.scripts.shell.Commands
EOT
}
```

Import syntax: `INSTANCE/<id>`, `TENANT/<tenant_id>/<id>`, or `NAMESPACE/<tenant_id>/<namespace>/<id>`.

See [Policies](../../../07.enterprise/02.governance/policies/index.md) for available rule types and enforcement options.

## Migration steps

1. **Pin the provider** to `~> 2.0` in `required_providers`.
2. **Update `kestra_role` resources** — rename `permissions` blocks to `resources`, rename the inner `permissions` list to `actions`, replace CRUD verbs with new action names, and update any renamed or removed resource types.
3. **Remove `plugin_defaults`** from `kestra_namespace` resources. Add `kestra_policy` resources with `Add` rules as the replacement (EE).
4. **Replace `worker_group`** on `kestra_namespace` with `default_worker_selector` using tags. Set `fallback` explicitly if you relied on the old `WAIT` default (the new default is `FAIL`).
5. **Add `kestra_worker_queue` and `kestra_worker_group` resources** for any worker routing topology you previously managed through the UI.
6. **Remove `pluginDefaults`** from flow content strings in `kestra_flow` resources.
7. **Delete `kestra_template` resources** and data sources.
8. **Run `terraform plan`** against the upgraded 2.0 server to review changes before applying.

## Related

- [RBAC action model](../rbac-action-model) — full CRUD-to-action mapping table
- [pluginDefaults removed](../plugin-defaults-removed) — migration options for flow and namespace plugin defaults
- [Policies](../../../07.enterprise/02.governance/policies/index.md) — the replacement for plugin defaults in EE
- [Worker Groups](../../../07.enterprise/04.scalability/worker-group/index.md) — tag-based routing, capacity reservation, and JWT auth
- [Helm gRPC worker-controller](../helm-grpc-worker-controller) — `workerGroup.key` removal and `fallback` default change
