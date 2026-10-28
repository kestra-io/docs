---
title: SYSTEM_SETTINGS and TENANT_SETTINGS Permissions Removed
h1: Remove the SYSTEM_SETTINGS and TENANT_SETTINGS Permissions from Your Roles
sidebarTitle: Settings Permissions Removed
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: In 2.1.0, the SYSTEM_SETTINGS and TENANT_SETTINGS RBAC permissions are removed. They never granted access to anything. Existing roles are cleaned up at upgrade, and Terraform role definitions that still list them must be updated.
---

Kestra 2.1.0 removes the `SYSTEM_SETTINGS` and `TENANT_SETTINGS` permissions from the [RBAC model](../../../07.enterprise/03.auth/rbac/index.md).

These permissions never granted access to anything: no endpoint checked them. Instance and tenant settings are managed by the [Instance Owner](../../../07.enterprise/05.instance/00.instance-owner/index.md) only, and the **Settings** page holds each user's own preferences. Because a role that held them could do nothing more, removing them doesn't take access away from anyone.

## What changed

- **Role editor and managed roles**: both permissions no longer appear in the role editor, and the managed roles (Viewer, Launcher, Editor, Developer, Admin) no longer carry them.
- **Existing roles**: the `2.1.13-ee-remove-settings-permissions` database migration removes them from every stored role. Run it with the other 2.1.0 migrations, as described in [Database Migrations](../../v2.0.0/database-migrations/index.md).
- **API**: creating or updating a role with either permission still succeeds. The permission is ignored, and the response lists one deprecation message per ignored permission in its `warnings` field. Roles are returned without them.
- **Audit logs**: past entries that use these names stay readable. Setting changes are still recorded under the `SYSTEM_SETTINGS` resource type, and only the Instance Owner can view the diff of these entries.

## Update Terraform role definitions

A `kestra_role` that still lists either permission keeps working, but Kestra stores and returns the role without it. Terraform then shows a diff on every plan. Remove the blocks from your configuration:

```hcl
resource "kestra_role" "operator" {
  name = "Operator"

  resources {
    type    = "FLOW"
    actions = ["VIEW", "LIST", "EXECUTE"]
  }

  # Remove these blocks
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

Scripts that call the role API directly keep working without changes. Remove the permissions from their payloads to clear the warnings.

## Related

- [RBAC](../../../07.enterprise/03.auth/rbac/index.md)
- [Permissions reference](../../../07.enterprise/03.auth/rbac/permissions-reference/index.md)
