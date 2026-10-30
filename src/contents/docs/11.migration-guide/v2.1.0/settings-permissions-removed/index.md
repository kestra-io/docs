---
title: SYSTEM_SETTINGS and TENANT_SETTINGS Permissions Removed
h1: Remove the SYSTEM_SETTINGS and TENANT_SETTINGS Permissions from Your Roles
sidebarTitle: Settings Permissions Removed
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: In 2.1.0, the SYSTEM_SETTINGS and TENANT_SETTINGS RBAC permissions are removed. They never granted access to anything. Existing roles ignore them, and API calls or Terraform role definitions that still send them must be updated.
---

Kestra 2.1.0 removes the `SYSTEM_SETTINGS` and `TENANT_SETTINGS` permissions from the [RBAC model](../../../07.enterprise/03.auth/rbac/index.md).

These permissions never granted access to anything: no endpoint checked them. Instance and tenant settings are managed by the [Instance Owner](../../../07.enterprise/05.instance/00.instance-owner/index.md) only, and the **Settings** page holds each user's own preferences. Because a role that held them could do nothing more, removing them doesn't take access away from anyone.

## What changed

- **Role editor and managed roles**: both permissions no longer appear in the role editor, and the managed roles (Viewer, Launcher, Editor, Developer, Admin) no longer carry them.
- **Existing roles**: no migration is needed. A stored role that still holds either permission is read without it, and the permission disappears from the database the next time the role is saved.
- **API**: creating or updating a role with either permission is rejected with a `400` error, like any unknown or non-assignable permission.
- **Audit logs**: past entries that use these names stay readable. Setting changes are still recorded under the `SYSTEM_SETTINGS` resource type, and only the Instance Owner can view the diff of these entries.

## Update Terraform role definitions

A `kestra_role` that still lists either permission fails to apply. Remove the blocks from your configuration:

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

Scripts that call the role API directly must remove the permissions from their payloads too.

## Related

- [RBAC](../../../07.enterprise/03.auth/rbac/index.md)
- [Permissions reference](../../../07.enterprise/03.auth/rbac/permissions-reference/index.md)
