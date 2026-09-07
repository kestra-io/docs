# Namespace Migration Guide

Kestra 2.0 removed two settings from the namespace and tenant APIs. This provider line drops them from `kestra_namespace` and `kestra_tenant` to match:

| Removed | Replaced by |
| --- | --- |
| `kestra_namespace.plugin_defaults` | a `kestra_policy` with `Add` rules, created for you by the instance upgrade |
| `kestra_namespace.worker_group` | `kestra_namespace.default_worker_selector` |
| `kestra_tenant.worker_group` | `kestra_tenant.default_worker_selector` |

## Why This Is Not Just A Cleanup

The 2.0 API ignores fields it does not know rather than rejecting them. A configuration that still sets `plugin_defaults` against a 2.0 instance therefore **applies successfully and changes nothing** — the provider sends the field, the API drops it, and because the field never comes back in the response no drift is ever reported. The setting is silently dead.

Removing the attributes turns that silence into a plan-time error, which is the point of this change: once you upgrade, `plugin_defaults` and `worker_group` fail with `Unsupported argument` instead of pretending to work.

## What Changed

1. **`plugin_defaults` is gone from `kestra_namespace`.** Plugin defaults are now expressed as governance Policies. The 2.0 instance upgrade migrates them for you (see below) — you do not re-author them, but you do have to adopt the result into Terraform.
2. **`worker_group` became `default_worker_selector`** on both `kestra_namespace` and `kestra_tenant`. Routing is now a tag set matched against Worker Queues rather than a reference to a single worker group. See the [Worker Group Migration Guide](worker-group-migration.md) for the block-level before/after and for the Worker Queue resources it depends on.
3. **The `kestra_namespace` schema version moved to 2.** The provider's state upgrader drops both attributes from your `.tfstate` on the next `terraform plan`; no `terraform state` surgery is required.
4. **The data sources followed**: `data.kestra_namespace` no longer exposes `plugin_defaults`, and both `data.kestra_namespace` and `data.kestra_tenant` expose `default_worker_selector` instead of `worker_group`.

## Migration Steps

### 1. Back up your state

```bash
terraform state pull > backup.tfstate.json
```

### 2. Upgrade the instance, then the provider

The instance upgrade to 2.0 runs a data migration that converts each namespace's stored `pluginDefaults` into a NAMESPACE-scope Policy with the id `plugin-defaults`, named *Migrated plugin defaults*. Every `{type, forced, values}` entry becomes one `io.kestra.plugin.ee.rules.Add` mutate rule on `PLUGIN`, matching the plugin type by prefix (`STARTS_WITH`, reproducing the old matching) and carrying the old `forced` flag as `override`.

Nothing is lost, but the resulting policy is created by the server and is **not** in your Terraform state.

### 3. Update your `.tf` files

Delete every `plugin_defaults` argument, and replace every `worker_group` block with a `default_worker_selector` one:

```hcl
# Before
resource "kestra_namespace" "team" {
  namespace_id    = "company.team"
  plugin_defaults = <<EOT
- type: io.kestra.plugin.core.log.Log
  forced: false
  values:
    level: WARN
EOT

  worker_group {
    key      = "gpu-workers"
    fallback = "WAIT"
  }
}

# After
resource "kestra_namespace" "team" {
  namespace_id = "company.team"

  default_worker_selector {
    tags     = kestra_worker_queue.gpu.tags
    fallback = "WAIT"
  }
}
```

### 4. Adopt the migrated policy

To keep managing your plugin defaults from Terraform, import the policy the migration created — once per namespace that had them:

```hcl
resource "kestra_policy" "team_plugin_defaults" {
  scope     = "NAMESPACE"
  namespace = "company.team"
  policy_id = "plugin-defaults"

  content = <<EOT
id: plugin-defaults
displayName: Migrated plugin defaults
rules:
  - type: io.kestra.plugin.ee.rules.Add
    on: PLUGIN
    where:
      - field: type
        operator: STARTS_WITH
        value: io.kestra.plugin.core.log.Log
    values:
      level: WARN
    override: false
EOT
}
```

```bash
terraform import kestra_policy.team_plugin_defaults NAMESPACE/main/company.team/plugin-defaults
```

The policies API round-trips its source verbatim, so the simplest way to get the `content` exactly right is to import first and read the value back out of the state:

```bash
terraform state show kestra_policy.team_plugin_defaults
```

If you would rather not adopt it, leave the policy alone — it keeps working, unmanaged — or delete it in the UI and express the defaults however you prefer. What you cannot do is keep them in `kestra_namespace`.

### 5. Verify

```bash
terraform plan
```

Expect no changes on the namespaces themselves beyond the settings you edited. `default_worker_selector` is repopulated from the instance by the refresh, so if the plan wants to remove one, the instance genuinely has no selector on that namespace and your configuration is adding it.

## Notes

- The removal is provider-side only. Nothing here deletes data on your instance: the migrated `plugin-defaults` policies stay whether or not you import them.
- `default_worker_selector` requires a non-empty `tags` list — the API rejects `match` and `fallback` without one, so the provider requires it at plan time.
- All of these settings are only available on the [Enterprise Edition](https://kestra.io/enterprise).
