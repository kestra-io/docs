---
title: RBAC in Kestra Enterprise – Manage Roles and Permissions
description: Implement Role-Based Access Control (RBAC) in Kestra. Define granular permissions for users, groups, and service accounts to secure your platform.
sidebarTitle: Role-Based Access Control (RBAC)
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
docId: iam
---

How to manage access and permissions to your instance.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/9I87QZJPl1Y?si=n0Izt0lK6BQ20Wfy" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## RBAC – manage roles and permissions

Kestra Enterprise supports Role-Based Access Control (RBAC), allowing you to manage access to Tenants, Namespaces, Flows and resources.

In Kestra you will find three types of entities:

* Users: Represents a **person**. To add users to your Kestra instance, you can do one of the following:
  - [Invite users](../invitations/index.md) to your instance or tenant from the UI
  - Sync users from an external identity provider using [SCIM](../scim/index.mdx)
  - Create users directly using [Terraform](../../../13.terraform/index.mdx)

* Groups: Represent a collection of **Users** and **Service Accounts**. Groups are a useful mechanism for providing the same roles to multiple Users or Service Accounts at once by binding a role to a Group.
* Service Accounts: Represents an **application**. They are considered Users when binding Role assignments.

All theses entities can be assigned to a Role, which define what resources the User, Group, or Service Account can access. Note that these entities don’t belong to Namespaces, but their permissions can be limited to specific namespaces via Bindings (**IAM** page).

The image below shows the relationship between Users, Groups, Service Accounts, Roles, and Bindings:

![bindings](./rbac.png)

## Roles and Bindings

A Role is a collection of permissions that can be assigned to Users, Service Accounts, or Groups. These permissions are defined by a combination of a **Permission** (e.g., `FLOWS`, `NAMESPACE`, `SECRET`, etc.) and an **Action** (
e.g., `CREATE`). The **Role** itself does not grant any permissions. Through the **IAM** page, you are able to assign a Role to a User, Service Account, or Group, which creates a **Binding**.

This Binding grants the permissions defined by that Role to the User, Service Account, or Group. Select any IAM entity (User, Group, etc.), and assign the desired Role. There is no limit to the number of Roles that can be bound to an entity. They can have zero, one, or more Roles attached, giving specific permissions, optionally tied to one or more namespaces; make sure to test their access with the [Impersonate](../rbac/index.md#impersonate) feature.

Once a Role has been created, you can assign that Role to Users and Groups. Optionally, when you assign the Role to an entity (User, Group, or Service Account), you can specify the Binding to a specific Namespace(s). A Binding can be optionally limited to specific namespaces. When a Binding is tied to a namespace, it automatically grants permissions to all child namespaces. For example, a User assigned to a Role specifying the `prod` namespace automatically grants access to the `prod.engineering` namespace as well. Note that you can [configure a default role](../../../configuration/index.md#default-role) so that all new Users are automatically assigned that Role. This is especially useful to grant a default set of permissions to all new Users who join your Kestra instance via [SSO](../sso/index.md).

## Impersonate

After assigning permissions to a User, Superadmins can impersonate Users to ensure their access is as intended. Impersonation switches your view immediately to that User's perspective and can be easily closed back to Superadmin view – a seamless way to test RBAC in one context.

![Impersonate](./impersonate-user.png)

![Stop Impersonating User](./stop-impersonate-user.png)

### Permissions

A Permission is a resource that can be accessed by a User or Group. Open the following to view all supported permissions:

:::collapse{title="Permissions"}
- `FLOW`
- `EXECUTION`
- `TEMPLATE`
- `NAMESPACE`
- `KVSTORE`
- `DASHBOARD`
- `SECRET`
- `CREDENTIAL`
- `GROUP`
- `ROLE`
- `BINDING`
- `AUDITLOG`
- `BLUEPRINT`
- `IMPERSONATE`
- `SETTING`
- `APP`
- `AI_COPILOT`
- `APPEXECUTION`
- `TEST`
- `ASSET`
- `USER`
- `SERVICE_ACCOUNT`
- `TENANT_ACCESS`
- `INVITATION`
- `GROUP_MEMBERSHIP`
- `CREDENTIALS`
- `AI_COPILOT`

:::alert{type="warning"}
The `ME` and `APITOKEN` are removed in [Kestra 0.24](../../../11.migration-guide/v0.24.0/endpoint-changes/index.md#rbac-updates)
:::

### Actions

An Action is the CRUD verb allowed on a given resource (Flow, Execution, Secret, KV, Namespace, etc.). Supported Actions map directly to HTTP operations:

- `CREATE` → typically `POST` the resource (e.g., create a flow, secret, KV entry).
- `READ`   → `GET` to list or view the resource; no writes.
- `UPDATE` → `PUT`/`PATCH` to modify an existing resource; cannot create new ones.
- `DELETE` → `DELETE` to remove the resource.

Example (Flows):
- `CREATE` lets you `POST /api/v1/{tenant}/flows`
- `READ` lets you `GET /api/v1/{tenant}/flows/*`
- `UPDATE` lets you `PUT /api/v1/{tenant}/flows/{flowId}`
- `DELETE` lets you `DELETE /api/v1/{tenant}/flows/delete/by-ids`

:::alert{type="info"}
For a complete CRUD-to-endpoint mapping for every permission, see the [Permissions Reference](./permissions-reference/index.md).
:::

### Currently supported roles

Currently, Kestra only creates an **Admin** role by default. That role grants full access to **all resources**.

Apart from **Admin**, Kestra has the managed Roles: Developer, Editor, Launcher, and Viewer. Each Role's permissions can be viewed from **IAM - Roles**. Superadmins can create additional Roles with custom permission combinations in addition to Kestra-managed roles. Users can be assigned multiple Roles.

## Superadmin and Admin

Kestra provides two roles for managing your instance: Superadmin and Admin.

- Superadmin is a user type with elevated privileges for global control
- Admin is a customizable role that grants full access to all resources (scoped to a tenant if multi-tenancy is enabled).

:::collapse{title="Summary"}
Here's a table summarizing the key differences between an Admin and a Super Admin:

| Feature                             | Admin (scoped to a tenant if enabled)              | Super Admin                                          |
|-------------------------------------|----------------------------------------------------|------------------------------------------------------|
| Access Level                        | By default as all permissions, depends on the Role | Manages tenants and IAM across all tenants           |
| Tenant Management                   | No                                                 | Create/Update/Read/Delete tenants across all tenants |
| User/Role/Group/Bindings Management | Has the permission by default                      | Create/Update/Read/Delete across all tenants         |
| Flow/Execution Management           | Has the permission by default                      | No                                                   |
| Set Super Admin privilege           | No                                                 | Yes                                                  |
:::

## Super Admin

Super Admin is a powerful type of user. Use the role sparingly and only for use cases that require it, such as creating a new tenant, troubleshooting tenant issues, or helping a user with a problem.

Without any Role or Binding, Super Admin has access to manage tenants, users, roles, and groups within a Kestra Enterprise instance. There are multiple methods to create a Superadmin user.

### Through the UI

When you launch Kestra for the first time, if no prior action has been made through the CLI, you will be invited to setup Kestra through the [Setup Page](../../01.overview/02.setup/index.md).

This interface invites you to create your first User which will be automatically assigned the `Superadmin` privilege.

### Through the CLI

To create a User with a Superadmin privilege from the [CLI](../../../server-cli/index.md), use the `--superadmin` option:

```bash
kestra auths users create admin@kestra.io TopSecret42 --superadmin

## schema:
kestra auths users create <username> <password> \
--tenant=<tenant-id> --superadmin
```

To set or revoke Superadmin privileges, use the following in the CLI:

```bash
kestra auths users set-superadmin user@email.com true # (use false to revoke)
```

### Configuration

A Super Admin can also be created from the configuration file using the configuration below:

```yaml
kestra:
  security:
    superAdmin:
      username: <username>
      password: <password>
      tenantAdminAccess:
        - <optional>
```

For more details, check the [Enterprise Edition Configuration](../../../configuration/index.md#super-admin) page.

## Grant/Revoke Super Admin permissions

:::alert{type="info"}
Note that you need to be a Superadmin yourself.
:::

### Through the UI

You can grant or revoke the Superadmin privilege using the switch in the User Edit page.

![superadmin switch](./superadmin_switch.png)

### Through the CLI

To set an existing User with a Superadmin privilege from the [CLI](../../../server-cli/index.md), use the dedicated command:

```bash
## Set a user as Super Admin
kestra auths users set-superadmin admin@kestra.io true

## Revoke Super Admin privilege
kestra auths users set-superadmin admin@kestra.io false
```

## Admin

In Kestra, the notion of Admin user does not exist; instead we create an **Admin** Role with all permissions.

This role can be assigned to any User, Service Account, or Group. This allows you to have different types of admins, to grant admin permissions to a whole group, and to revoke those admin permissions at any time without having to delete any group or user.

When using multi-tenancy, Kestra assigns the Admin Role to the user who created the tenant by default.

:::alert{type="info"}
If you see an error when creating a new User or Service Account, it might be caused by a limit on your license. In that case, [reach out to us](/contact-us) to validate and optionally upgrade your license.
:::

## Creating a User with an Admin Role

### Through the UI

When launching Kestra for the first time, if no prior action has been made through the CLI, you will be invited to setup Kestra through the [Setup Page](../../01.overview/02.setup/index.md).

This interface invites you to create the first User which will automatically create the role Admin and bind the User to the role.

Later, you can create a new User or pick an existing User and assign the Admin role to it from the Access page.

### Through the CLI

To create a User with an Admin Role from the CLI, use the `--admin` option:

```bash
kestra auths users create prod.admin@kestra.io TopSecret42 --admin

## schema:
kestra auths users create <username> <password> --admin
```
## User lockout

Use the following configuration to change the lockout behavior after too many failed login attempts. By default, Kestra >= 0.22 will lock the user for the `lock-duration` period after a `threshold` number of failed attempts performed within the `monitoring-window` duration. The snippet below lists the default values for those properties — you can adjust them based on your preferences:

```yaml
kestra:
  security:
    login:
      failed-attempts:
        threshold: 10
        monitoring-window: PT5M
        lock-duration: PT30M
```

The key attributes are:

- `threshold`: Sets the number of allowed failed attempts before a user is locked out.
- `monitoring-window`: Defines the period during which failed login attempts are counted before triggering a lock. Super Admin can unlock the user manually by resetting their password from the user's detail page.
- `lock-duration`: Defines how long the account remains locked.

In the above configuration, a user is allotted 10 failed login attempts in a 5-minute window before they are locked out. They must wait 30 minutes to try again, be unlocked by an Admin, or reset their password by clicking on the "Forgot password" link and following the instructions in the email.

## Change password

If a user wants to change their password, they can do it on their profile. This page can be accessed through the profile in the bottom left corner of the UI. "Forgot Password" settings can be configured in your Kestra configuration under `basic-auth.password-reset`. Settings to consider are the cooldown time between reset requests and how many requests can be made in a given time window.

```yaml
kestra:
  security:
    basic-auth:
      password-reset:
        cooldown: PT5M         # Minimum time required between two password reset emails for the same user
        rate-limit:
          max-requests: 10     # Maximum number of password reset requests allowed per client within the time window
          window: PT1H         # Time window during which password reset requests are counted for rate limiting
```

### Reset password (by a Super Admin)

Kestra provides a "forgot password" functionality that your users can leverage to reset their password. This functionality is available on the login page, where users can click on the "Forgot password?" link. On top of that, a Super Admin can reset a user's password from the User Edit page by going to **Instance** - **IAM - Users**.

![Reset Password](./forgot-password.png)

![Superadmin Change Password](./create-user-password.png)

## RBAC FAQ

:::collapse{title="Why is Admin a Role rather than User type?"}

The Admin role is a collection of permissions that can be assigned to Users, Service Accounts, or Groups. This allows you to
grant multiple users with admin permissions if needed, and you can revoke only specific admin permissions at any time
without having to delete the user.

Admin roles can be assumed by multiple users or groups, and some user may later be granted a lower or a higher
permission boundary. In the same way, some users may initially be Admins but then their permission may be revoked. The
Admin role enables all these patterns in a flexible way.

You can think of Users as **authentication** mechanism (who you are), and Roles as **authorization** mechanism (what you
are allowed to do). Decoupling authentication from authorization allows you to grant permissions to multiple users or
groups at once by attaching a single Role to a Group.
:::

:::collapse{title="Why can't I edit an existing Binding?"}

A Binding is an immutable object. If a Binding no longer reflects the desired permissions, you can delete the existing
Binding and create a new one for the same User, Service Account, or Group but with different Roles and/or namespaces.
This is a safety feature to prevent accidental changes to existing permissions.
:::

:::collapse{title="What happens if you delete a Group?"}

All Users and Service Accounts assigned to that Group will lose permissions that were binds to the groups. However, Users and Services Accounts will still exist.
:::
