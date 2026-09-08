# RBAC Permission Migration Guide

Kestra has reworked its RBAC system to replace generic CRUD actions (`READ`, `CREATE`, `UPDATE`, `DELETE`) with fine-grained, per-resource actions (`VIEW`, `LIST`, `EXECUTE`, `KILL`, etc.). Some permission types have also been renamed or split.

This guide explains how to update your Terraform configurations.

## What Changed

1. **Schema field rename**: The `permissions` block is now called `resources`, and the inner `permissions` list is now called `actions`.
2. **Actions are now fine-grained**: `READ` has been replaced by `VIEW`, `LIST`, and resource-specific actions like `ACCESS_LOGS`, `EXPORT`, etc. `UPDATE` has been replaced by specific lifecycle actions like `EXECUTE`, `KILL`, `RESTART`, `DISABLE`, etc.
3. **Some resource types were renamed**: `SETTING` was split into `SYSTEM_SETTINGS` and `TENANT_SETTINGS`, `AI_COPILOT` became `COPILOT`, `TEST` became `TESTSUITE`, etc.
4. **Some resource types were merged or dropped**: `APPEXECUTION` merged into `APP`, `TEMPLATE` was removed entirely.
5. **Tenant access is now a prerequisite**: adding a user to a group no longer grants that user access to the tenant as a side effect. See [Tenant Access Is Now a Prerequisite](#tenant-access-is-now-a-prerequisite).

## Migration Steps

### 1. Back up your state

```bash
terraform state pull > backup.tfstate.json
```

### 2. Upgrade the provider

Update your provider version constraint to the version that includes RBAC migration support. The provider's built-in state upgrader will automatically migrate your `.tfstate` file when you next run `terraform plan`.

### 3. Update your `.tf` files

The state is migrated automatically, but your `.tf` source files must be updated manually. Use the mapping tables below.

### 4. Verify

```bash
terraform plan
```

After updating your `.tf` files, `terraform plan` should show no changes.

## Tenant Access Is Now a Prerequisite

On Kestra 2.0 and above, a user must already have access to a tenant before any
tenant-scoped resource can refer to them. Group membership resolves the user
through a tenant access check and rejects it otherwise, so
`kestra_user_group_membership` now fails with a 404 (`User does not exist for
id ...`) for a user without access — where on 1.x the membership itself granted
it implicitly.

Declare a `kestra_user_tenant_access` for each such user and make the
tenant-scoped resources depend on it:

```hcl
resource "kestra_user" "alice" {
  email = "alice@example.com"
}

resource "kestra_user_tenant_access" "alice" {
  user_id = kestra_user.alice.id
}

resource "kestra_user_group_membership" "alice_platform" {
  user_id  = kestra_user.alice.id
  group_id = kestra_group.platform.id

  depends_on = [kestra_user_tenant_access.alice]
}
```

For users that already have access, import the existing grant instead of
creating it, so the first apply does not report a change:

```bash
terraform import kestra_user_tenant_access.alice 4by6NvSLcPXFhCj8nwbZOM
```

Destroying a `kestra_user_tenant_access` revokes the access. Removing a
`kestra_user_group_membership` does not, since other memberships and API tokens
may still rely on it.

## Resource Type Renames

| Old Type | New Type(s) | Notes |
|----------|-------------|-------|
| `SETTING` | `SYSTEM_SETTINGS` + `TENANT_SETTINGS` | One block becomes two |
| `AI_COPILOT` | `COPILOT` | |
| `TEST` | `TESTSUITE` | |
| `APPEXECUTION` | `APP` | Merge into existing `APP` block if you have one |
| `TENANT_ACCESS` | `USER` | Merge into existing `USER` block if you have one |
| `GROUP_MEMBERSHIP` | `GROUP` | Merge into existing `GROUP` block if you have one |
| `TEMPLATE` | _(removed)_ | Delete the block entirely |
| `IMPERSONATE` | _(removed)_ | Delete the block entirely |

## Action Expansion Tables

### FLOW

| Old | New |
|-----|-----|
| `READ` | `VIEW`, `LIST`, `EXPORT` |
| `CREATE` | `CREATE`, `IMPORT` |
| `UPDATE` | `UPDATE`, `EXECUTE`, `DISABLE`, `ENABLE`, `VALIDATE` |
| `DELETE` | `DELETE` |

### EXECUTION

| Old | New |
|-----|-----|
| `READ` | `VIEW`, `LIST`, `ACCESS_LOGS`, `ACCESS_OUTPUTS`, `ACCESS_FILES`, `EXPORT`, `FOLLOW` |
| `UPDATE` | `UPDATE`, `RESTART`, `KILL`, `REPLAY`, `PAUSE`, `RESUME`, `CHANGE_LABELS`, `UNQUEUE`, `FORCE_RUN` |
| `DELETE` | `DELETE` |

### TRIGGER (new standalone resource)

| Old | New |
|-----|-----|
| `READ` | `VIEW`, `LIST`, `EXPORT` |
| `CREATE` | `CREATE` |
| `UPDATE` | `UNLOCK`, `RESTART`, `DISABLE`, `ENABLE`, `BACKFILL` |
| `DELETE` | `DELETE` |

### NAMESPACE

| Old | New |
|-----|-----|
| `READ` | `VIEW`, `LIST`, `EXPORT_PLUGIN_DEFAULTS` |
| `CREATE` | `CREATE` |
| `UPDATE` | `UPDATE`, `MANAGE_FILES`, `IMPORT_PLUGIN_DEFAULTS` |
| `DELETE` | `DELETE` |

### APP (includes merged APPEXECUTION)

| Old | New |
|-----|-----|
| `READ` | `VIEW`, `LIST` |
| `CREATE` | `CREATE` |
| `UPDATE` | `UPDATE`, `EXECUTE`, `ACCESS_FILES`, `ACCESS_LOGS` |
| `DELETE` | `DELETE` |

### AUDITLOG

| Old | New |
|-----|-----|
| `READ` | `VIEW`, `LIST`, `EXPORT` |
| `CREATE` | _(dropped)_ |
| `UPDATE` | _(dropped)_ |
| `DELETE` | _(dropped)_ |

### SYSTEM_SETTINGS / TENANT_SETTINGS (split from SETTING)

| Old (SETTING) | New |
|-----|-----|
| `READ` | `VIEW` |
| `CREATE` | _(dropped)_ |
| `UPDATE` | `UPDATE` |
| `DELETE` | _(dropped)_ |

### COPILOT (renamed from AI_COPILOT)

| Old (AI_COPILOT) | New |
|-----|-----|
| `READ` | `USE` |
| `CREATE` | _(dropped)_ |
| `UPDATE` | _(dropped)_ |
| `DELETE` | _(dropped)_ |

### USER

| Old | New |
|-----|-----|
| `READ` | `VIEW`, `LIST` |
| `CREATE` | `CREATE` |
| `UPDATE` | `UPDATE`, `MANAGE_GROUP_MEMBERSHIP` |
| `DELETE` | `DELETE` |

### GROUP

| Old | New |
|-----|-----|
| `READ` | `VIEW`, `LIST` |
| `CREATE` | `CREATE` |
| `UPDATE` | `UPDATE`, `MANAGE_MEMBERS` |
| `DELETE` | `DELETE` |

### Default (KVSTORE, DASHBOARD, SECRET, CREDENTIAL, BLUEPRINT, TESTSUITE, ASSET, ROLE, BINDING, SERVICE_ACCOUNT, INVITATION)

| Old | New |
|-----|-----|
| `READ` | `VIEW`, `LIST` |
| `CREATE` | `CREATE` |
| `UPDATE` | `UPDATE` |
| `DELETE` | `DELETE` |

## Example Migration

### Before

```hcl
resource "kestra_role" "developer" {
  name = "Developer"

  permissions {
    type        = "FLOW"
    permissions = ["READ", "CREATE", "UPDATE", "DELETE"]
  }

  permissions {
    type        = "EXECUTION"
    permissions = ["READ", "UPDATE"]
  }

  permissions {
    type        = "SETTING"
    permissions = ["READ", "UPDATE"]
  }

  permissions {
    type        = "TEMPLATE"
    permissions = ["READ", "UPDATE"]
  }
}
```

### After

```hcl
resource "kestra_role" "developer" {
  name = "Developer"

  resources {
    type    = "FLOW"
    actions = ["VIEW", "LIST", "EXPORT", "CREATE", "IMPORT", "UPDATE", "EXECUTE", "DISABLE", "ENABLE", "VALIDATE", "DELETE"]
  }

  resources {
    type    = "EXECUTION"
    actions = ["VIEW", "LIST", "ACCESS_LOGS", "ACCESS_OUTPUTS", "ACCESS_FILES", "EXPORT", "FOLLOW", "UPDATE", "RESTART", "KILL", "REPLAY", "PAUSE", "RESUME", "CHANGE_LABELS", "UNQUEUE", "FORCE_RUN"]
  }

  resources {
    type    = "SYSTEM_SETTINGS"
    actions = ["VIEW", "UPDATE"]
  }

  resources {
    type    = "TENANT_SETTINGS"
    actions = ["VIEW", "UPDATE"]
  }

  # TEMPLATE block removed (resource no longer exists)
}
```

## Special Cases

### SETTING split

Replace one `SETTING` block with two blocks: `SYSTEM_SETTINGS` and `TENANT_SETTINGS`. Both get the same expanded actions.

### Merging resources

If you have both `APP` and `APPEXECUTION` blocks, combine them into a single `APP` block with the union of all expanded actions. Similarly for `USER` + `TENANT_ACCESS` and `GROUP` + `GROUP_MEMBERSHIP`.

### Fine-grained control

The migration expands old CRUD actions to all equivalent fine-grained actions. After migration, you can remove specific actions to restrict access more precisely. For example, you might want to grant `EXECUTION.VIEW` and `EXECUTION.LIST` but not `EXECUTION.ACCESS_LOGS`.
