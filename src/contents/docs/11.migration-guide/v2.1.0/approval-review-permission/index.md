---
title: REVIEW Permission Required for Approvals
h1: Grant the REVIEW Permission to Roles That Decide Approvals
sidebarTitle: REVIEW Permission for Approvals
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: In 2.1.0, approving, denying, or cancelling an Approval task requires the new EXECUTION REVIEW permission. Managed roles get it automatically; custom roles must be updated by a tenant admin.
---

Kestra 2.1.0 adds a `REVIEW` action to the `EXECUTION` permission of the [RBAC model](../../../07.enterprise/03.auth/rbac/index.md). It is required to approve, deny, or cancel an `Approval` task.

An execution paused only on an `Approval` task cannot be resumed with the `RESUME` action. Users decide it with the **Review** button, which checks `REVIEW` on the execution's namespace. The same check applies on the execution page, on the **Approvals** page (including bulk cancellation), and in the `ApprovalReview` block of [Apps](../../../07.enterprise/04.scalability/apps/index.md). When the `Approval` defines assignees, the user must also be one of them.

The **Approvals** page lists approval cases, and the in-app notifications sent for an approval case link to that case. Reviewers therefore also need `LIST` and `VIEW` on the `CASE` permission.

## What changed

- **Managed roles**: the Editor and Developer roles, which can resume executions, now hold `EXECUTION: REVIEW` and `CASE: VIEW, LIST`. The Admin role holds every action. Kestra updates the managed roles of every tenant the next time it starts after the upgrade, with no manual step.
- **Custom roles**: Kestra does not change them. A user whose only roles are custom roles cannot review approvals or open the **Approvals** page until a tenant admin adds the permissions below.

## Update custom roles

For each custom role that holds `EXECUTION: RESUME` and whose users should review approvals, add the following permissions to the same role, so they apply to the same namespaces as `RESUME`:

- `EXECUTION`: `REVIEW`
- `CASE`: `VIEW` and `LIST`

Add them under **IAM → Roles**, or in your role definitions. The following Terraform role adds both permissions next to an existing `RESUME`:

```hcl
resource "kestra_role" "operator" {
  name = "Operator"

  resources {
    type    = "EXECUTION"
    actions = ["VIEW", "LIST", "RESUME", "REVIEW"]
  }

  resources {
    type    = "CASE"
    actions = ["VIEW", "LIST"]
  }
}
```

Once the role is updated, its users can open the **Approvals** page and see the **Review** button on the `Approval` tasks they are allowed to decide.

## Related

- [RBAC](../../../07.enterprise/03.auth/rbac/index.md)
- [Permissions reference](../../../07.enterprise/03.auth/rbac/permissions-reference/index.md)
