---
title: USER IMPERSONATE Permission Removed
h1: Remove the USER IMPERSONATE Permission from Your Roles
sidebarTitle: Impersonate Permission Removed
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: In 2.1.0, the USER IMPERSONATE action is removed and impersonation is reserved to Instance Owners. Existing roles ignore the action, and API calls or Terraform role definitions that still send it must be updated.
---

Kestra 2.1.0 removes the `IMPERSONATE` action from the `USER` resource in the [RBAC model](../../../07.enterprise/03.auth/rbac/index.md). [Impersonation](../../../07.enterprise/03.auth/rbac/index.md#impersonate) is reserved to [Instance Owners](../../../07.enterprise/05.instance/00.instance-owner/index.md), and no role permission grants it.

In 2.0, the action didn't let anyone impersonate from the UI or the impersonate endpoint, which were already Instance Owner only. It was only checked for API requests that send the `X-Kestra-Impersonate` header with basic authentication, and the managed Admin role held it, so a tenant admin could impersonate any user that way.

## What changed

- **Role editor and managed roles**: `IMPERSONATE` no longer appears in the role editor, and the managed Admin role no longer carries it.
- **Existing roles**: no migration is needed. A stored role that still holds the action is read without it, and stays editable.
- **API**: creating or updating a role with `USER` `IMPERSONATE` is rejected with a `422` error.
- **`X-Kestra-Impersonate` header**: a basic-auth request that sends the header now fails authentication unless the credentials belong to an Instance Owner.
- **Service accounts**: Instance Owners can now impersonate a service account, from **Instance IAM → Service Accounts** or with `POST /api/v1/users/{id}/impersonate`.

If you followed the [2.0 RBAC migration](../../v2.0.0/rbac-action-model/index.md) and granted `USER` `IMPERSONATE` to some roles, remove it now.

For administration tasks that don't need an Instance Owner, use a [service account](../../../07.enterprise/03.auth/service-accounts/index.md) with its own role and API token.

## Update role definitions

### Terraform

A `kestra_role` that still lists the action fails to apply. Remove `IMPERSONATE` from the `USER` actions:

```hcl
resource "kestra_role" "admin" {
  name = "Platform admin"

  resources {
    type    = "USER"
    actions = ["VIEW", "LIST", "UPDATE", "MANAGE_GROUP_MEMBERSHIP"] # was: [..., "IMPERSONATE"]
  }
}
```

### kestractl and the API

[`kestractl roles create` and `roles update`](../../../kestra-cli/kestractl/index.md) fail the same way. Remove `IMPERSONATE` from `--permission` flags and from the files passed to `--permissions-file`. Scripts that call the role API directly must remove it from their payloads too.

## Related

- [RBAC](../../../07.enterprise/03.auth/rbac/index.md)
- [Permissions reference](../../../07.enterprise/03.auth/rbac/permissions-reference/index.md)
