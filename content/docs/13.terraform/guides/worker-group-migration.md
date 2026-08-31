# Worker Group Migration Guide

The `kestra_worker_group` resource and data source have been reimplemented on the modern Terraform plugin framework for the worker groups of Kestra 2.0 Enterprise Edition.

Read this as a move to a new resource rather than a rename. The Kestra 2.0 worker group shares its name with the 1.x one but is a different thing: routing is driven by Worker Queues and their tag sets, tenant scoping moved to the queue, and the upgrade of a Kestra instance to 2.0 removes the worker groups that predate it. Your Terraform configuration therefore describes worker groups that will be **created** on the 2.0 instance, not carried over from the 1.x ones.

This guide explains how to update your Terraform configurations, and what to expect from the first plan.

## Which Provider Version

This provider line targets Kestra 2.0 Enterprise Edition. If your instance is still on the 1.x line, stay on the provider's 1.3.x releases — they keep receiving fixes on their own release branch — and pin them:

```hcl
terraform {
  required_providers {
    kestra = {
      source  = "kestra-io/kestra"
      version = "~> 1.3.0"
    }
  }
}
```

Upgrade the provider when you upgrade the instance, not before: the 1.x and 2.0 worker group APIs differ in both their endpoints and their payloads, and this line only speaks the 2.0 one.

## What Changed

1. **A different underlying resource**: `kestra_worker_group` now manages a Kestra 2.0 worker group. Worker groups created on a 1.x instance do not survive its upgrade to 2.0, so they are recreated from your configuration — with the same ids — rather than migrated in place.
2. **Resource attribute rename**: `kestra_worker_group.key` is now `kestra_worker_group.group_id`.
3. **Data source attribute rename**: `data.kestra_worker_group` is now looked up by `group_id` instead of `id`. `id` is now a read-only attribute, and the former `key` attribute is gone.
4. **The identifier is immutable**: changing `group_id` replaces the worker group, matching the API where the id is fixed at creation and used on the worker authentication path.
5. **New `subscriptions` blocks**: a worker group can now subscribe to Worker Queues, with an optional slot reservation. See the [`kestra_worker_group`](../resources/worker_group.md) resource documentation.
6. **New `kestra_worker_queue` resource and data source**: Worker Queues route tasks to worker groups through their tag set. A Worker Queue must have a unique id, and a unique combination of `tags` and `allowed_tenants`.
7. **`allowed_tenants` is gone from `kestra_worker_group`** (it was published up to provider 1.3.2): tenant scoping now lives on `kestra_worker_queue.allowed_tenants`. The state upgrader drops the attribute, so no manual state edit is needed.

## Migration Steps

### 1. Back up your state

```bash
terraform state pull > backup.tfstate.json
```

### 2. Upgrade the provider

The provider's built-in state upgrader rewrites the worker group identifier from `key` to `group_id` in your `.tfstate` file when you next run `terraform plan`, so the provider can read state written by the previous implementation. No `terraform state` surgery or re-import is required: entries whose worker group no longer exists on the instance are reconciled by the refresh, not by hand.

### 3. Update your `.tf` files

The state is migrated automatically, but your `.tf` source files must be updated manually.

Resources:

```hcl
# Before
resource "kestra_worker_group" "gpu" {
  key  = "gpu-workers"
  name = "GPU Workers"
}

# After
resource "kestra_worker_group" "gpu" {
  group_id = "gpu-workers"
  name     = "GPU Workers"
}
```

Data sources:

```hcl
# Before
data "kestra_worker_group" "gpu" {
  id = "gpu-workers"
}

# After
data "kestra_worker_group" "gpu" {
  group_id = "gpu-workers"
}
```

References to the renamed attribute must be updated too.

The `worker_group` blocks of the `kestra_namespace` and `kestra_tenant` resources are a special case: they are gone, replaced by `default_worker_selector`. A namespace or tenant no longer points at one worker group by key — it declares the tags its tasks route with, and the Worker Queue whose tag set matches picks the work up:

```hcl
# Before
worker_group {
  key      = kestra_worker_group.gpu.key
  fallback = "WAIT"
}

# After
default_worker_selector {
  tags     = kestra_worker_queue.gpu.tags
  match    = "ALL"
  fallback = "WAIT"
}
```

There is no automatic translation for this one: a worker group key is not a tag set, so the state upgrader drops the old block and the refresh repopulates `default_worker_selector` from the instance. `match` accepts `ALL` (default — the queue tags must be a superset of yours) or `ANY`, and `fallback` gained `IGNORE` alongside `FAIL`, `WAIT` and `CANCEL`. See the [Namespace Migration Guide](namespace-migration.md) for the rest of the namespace changes.

### 4. Verify

```bash
terraform plan
```

`terraform plan` reports your worker groups as being **created**: the upgrade of the instance to Kestra 2.0 removed the ones that predate it, so the refresh no longer finds them and drops them from the state. The next `terraform apply` recreates them from your configuration, with the same `group_id`. This is expected — check that the plan creates the worker groups you expect and touches nothing else, then apply.

The state upgrade is not optional even though the worker groups themselves are recreated: without it this provider cannot read state written by the previous implementation at all, and every command fails with `Unable to Upgrade Resource State`. If you see that error, the provider in use is not the one that ships this guide — upgrade the provider, and restore your backup if the state was edited by hand in the meantime.

## Notes

- Because the worker groups are recreated rather than migrated, they come back with exactly what your configuration declares — including no Worker Queue subscription at all unless you add `subscriptions` blocks. The ids are preserved, so any worker started with that group id stays valid.
- Routing from a namespace or tenant no longer names a worker group at all: `default_worker_selector` names tags, which a Worker Queue matches, which a worker group subscribes to. Declare the `kestra_worker_queue` before the namespaces and tenants that select its tags.
- Worker groups and Worker Queues are instance-level resources managed by a SuperAdmin: they are not tenant-scoped, and the provider's `tenant_id` does not apply to them.
- Both are only available on the [Enterprise Edition](https://kestra.io/enterprise), and Worker Queues additionally require Kestra 2.0 or later.
