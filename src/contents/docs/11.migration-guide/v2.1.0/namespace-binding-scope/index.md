---
title: Namespace Bindings Limited to Namespace-Level Permissions
h1: Namespace Bindings Can Only Grant Namespace-Level Permissions
sidebarTitle: Namespace Binding Scope
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: In 2.1.0, a binding restricted to a namespace can only grant namespace-level permissions. Existing namespace bindings of roles with tenant-level permissions move to a namespace-only copy of the role at upgrade, and managing bindings requires the BINDING permission on the whole tenant.
---

Kestra 2.1.0 gives every [RBAC](../../../07.enterprise/03.auth/rbac/index.md) permission a scope: namespace-level or tenant-level. A binding restricted to a namespace can only grant namespace-level permissions.

Before 2.1.0, a namespace binding could carry a role with tenant-level permissions, and those permissions applied to the whole tenant. For example, the Admin role bound to `company.team` let its holder create roles and manage users in every namespace of the tenant.

## What changed

- **Permission scopes**: see [Namespace bindings](../../../07.enterprise/03.auth/rbac/index.md#namespace-bindings) for the namespace-level and tenant-level permissions.
- **Rejected requests**: the following are rejected with a `422` error that lists the tenant-level permissions involved:
  - creating a namespace binding whose role holds a tenant-level permission, including in bulk, where no binding is created;
  - creating an invitation with such a namespace binding;
  - adding a tenant-level permission to a role that is bound to a namespace, or that a pending invitation binds to a namespace.
- **Managed roles**: Admin, Developer, Editor and Viewer hold tenant-level permissions, so they can only be bound to the whole tenant. Launcher only holds namespace-level permissions and can still be bound to a namespace.
- **Managing bindings**: creating or deleting a binding, and creating an invitation that carries bindings, requires the `BINDING` permission on the whole tenant. A `BINDING` permission granted on a namespace is no longer enough. To let someone give access to a team without tenant-wide rights, make them [owner of a group](../../../07.enterprise/03.auth/rbac/index.md#groups) bound to that team's namespace.
- **API**: `GET /api/v1/{tenant}/acls/scopes` returns the scope of each resource and action.

## What the upgrade does

The upgrade changes the namespace bindings that break the rule, in every tenant:

1. For each role that holds both tenant-level and namespace-level permissions, it creates a role named `<Role name> (namespace)`, with the id `<role id>_namespace`, that holds only the namespace-level permissions. The copy is created for every custom role, and for a managed role only when that role is bound to a namespace. For example, Developer bound to a namespace in the `main` tenant gets a `Developer (namespace)` role with the id `developer_main_namespace`. These roles are created even when your license does not include custom roles.
2. Each namespace binding of such a role moves to its copy, for the same user, group or service account and the same namespace. Tenant-wide bindings are not changed.
3. A namespace binding whose role holds only tenant-level permissions grants nothing on the namespace, and is deleted.
4. Namespace bindings in pending invitations that have not expired are changed the same way.

Each change is recorded in the [audit logs](../../../07.enterprise/02.governance/06.audit-logs/index.md): a `CREATE` entry for each new role, an `UPDATE` entry for each moved binding and changed invitation, and a `DELETE` entry for each deleted binding. The binding entries list the tenant-level permissions the binding no longer grants under `revokedPermissions`. Filter the audit logs by the `BINDING` resource type to review them.

Restoring a [backup](../../../10.administrator-guide/backup-and-restore/index.md) taken before 2.1.0 applies the same change to the restored roles, bindings and invitations. On a restore, a copy is only created when a restored binding or invitation needs it.

:::alert{type="warning"}
Keep the `(namespace)` roles free of tenant-level permissions. The upgrade and the restore reuse an existing `<role id>_namespace` role as is, so if you add a tenant-level permission to one after the upgrade, restoring a backup taken before 2.1.0 binds it to a namespace again.
:::

## What users lose

Users keep their access to the namespaces they were bound to. They lose the tenant-level permissions their namespace bindings granted. For example:

- A namespace-bound Admin can no longer manage users, groups, roles, bindings, service accounts or invitations, or read the audit logs.
- A namespace-bound Developer or Editor can no longer create, update or delete dashboards, and loses the blueprint and MCP server permissions of the role.

To give back a tenant-level permission, create a role with it and bind that role to the whole tenant.

## Update binding definitions

### Terraform

After the upgrade, a `kestra_binding` restricted to a namespace whose role holds tenant-level permissions no longer matches the binding stored in Kestra, and recreating it fails with a `422` error. Point it to the role the upgrade created, or to a custom role that only holds namespace-level permissions:

```hcl
data "kestra_role" "developer_namespace" {
  name = "Developer (namespace)"
}

resource "kestra_binding" "team_developers" {
  type        = "GROUP"
  external_id = kestra_group.team.id
  role_id     = data.kestra_role.developer_namespace.id
  namespace   = "company.team"
}
```

Bindings without `namespace` are not affected.

### kestractl and the API

Scripts that create namespace bindings or invitations with roles holding tenant-level permissions fail the same way. Bind those roles to the whole tenant, or use a role that only holds namespace-level permissions. Call `GET /api/v1/{tenant}/acls/scopes` to check the scope of a permission.

## Related

- [RBAC](../../../07.enterprise/03.auth/rbac/index.md)
- [Permissions reference](../../../07.enterprise/03.auth/rbac/permissions-reference/index.md)
