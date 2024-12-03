---
title: Role-Based Access Control (RBAC)
icon: /docs/icons/admin.svg
editions: ["EE"]
---

How to manage access and permissions to your instance.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/9I87QZJPl1Y?si=n0Izt0lK6BQ20Wfy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Overview

Kestra Enterprise supports Role-Based Access Control (RBAC), allowing you to manage access to workflows and resources by
assigning Roles to Users, Groups and Service Accounts.

The image below shows the relationship between Users, Groups, Service Accounts, Roles, and Bindings (visible on the
Access page in the UI).

![bindings](/docs/enterprise/rbac.png)

## Roles and Bindings

A Role is a collection of permissions that can be assigned to Users, Service Accounts or Groups.\
Theses permissions are defined by a combination of a **Permission** (e.g. `FLOWS`) and an **Action** (
e.g. `CREATE`).

::collapse{title="More information"}

The **Role** itself does not grant any permissions to anyone.

Through the **Access** UI page, you will be able to attach a Role to a User, Service Account or Group, which will create a **Binding**.

This Binding will grant the permissions defined by that Role to the User, Service Account, or Group.

A Binding can be optionally limited to a specific namespaces. When a Binding is tied to a namespace, it also automatically grants permissions to all child namespaces. For example, a Role attached to the `prod` namespace will automatically grant access to the `prod.engineering` namespace as well.

Note that you can [configure a default role](../configuration/index.md#default-role) so that all new Users are automatically assigned that Role. This is especially useful to grant a default set of permissions to all new Users who join your Kestra instance via [SSO](./05.sso.md).

In short, Roles encapsulate permission boundaries that can be attached to Users, Service Accounts or Groups across tenants and namespaces.
::

### Permissions

A Permission is a resource that can be accessed by a User or Group. Supported Permissions:
- `FLOW`
- `BLUEPRINT`
- `TEMPLATE`
- `NAMESPACE`
- `EXECUTION`
- `USER`
- `GROUP`
- `ROLE`
- `BINDING`
- `AUDITLOG`
- `SECRET`
- `IMPERSONATE`
- `SETTING`
- `INFRASTRUCTURE`

### Actions

An Action is a specific operation that can be performed on a Permission. Supported Actions:

- `CREATE`
- `READ`
- `UPDATE`
- `DELETE`

### Currently Supported Roles

Currently, Kestra creates only an **Admin** role by default. That role grants full access to **all resources**.

Apart from that, you can create additional Roles with custom permissions.

## Super Admin and Admin

Kestra provides two way for managing your instance: super admin and admin.

- Super Admin is a user type with elevated privileges for global control
- Admin is a customizable role that grants full access to all resources (scoped to a tenant if multi-tenancy is enabled).

::collapse{title="Summary"}
Here's a table summarizing the key differences between an Admin and a Super Admin:

| Feature                             | Admin (scoped to a tenant if enabled)              | Super Admin                                          |
|-------------------------------------|----------------------------------------------------|------------------------------------------------------|
| Access Level                        | By default as all permissions, depends on the Role | Manages tenants and IAM across all tenants           |
| Tenant Management                   | No                                                 | Create/Update/Read/Delete tenants across all tenants |
| User/Role/Group/Bindings Management | Has the permission by default                      | Create/Update/Read/Delete across all tenants         |
| Flow/Execution Management           | Has the permission by default                      | No                                                   |
| Set Super Admin privilege           | No                                                 | Yes                                                  |

::

### Super Admin

Without any Role or Binding, Super Admin has access to manage tenants, users, roles, groups and access within a Kestra Enterprise instance.


::collapse{title="More information"}

#### Use Cases

Super Admin is a powerful type of user. Use that role sparingly and only for use cases that require it, such as creating
a new tenant, troubleshooting tenant issues, or helping a user with a problem.

However, you should use Kestra through the role system.
::

::collapse{title="Creating a Super Admin"}

#### Through the UI

First time you launch Kestra, if no prior action has been made through the CLI, you will be invited to setup Kestra through the [Setup Page](../06.enterprise/02.setup.md).

This interface will offer you to create your first User which will be automatically assigned the `Super Admin` privilege.

#### Through the CLI

To create a User with a Super Admin privilege from the [CLI](../06.enterprise/cli.md), use the `--superadmin` option:

```bash
kestra auths users create admin@kestra.io TopSecret42 --superadmin

# schema:
kestra auths users create <username> <password> \
--tenant=<tenant-id> --superadmin
```

#### Through the Configuration

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

For more detail, check the [Enterprise Edition Configuration](../configuration/index.md#super-admin) page.

::

::collapse{title="Grant/Revoke Super Admin permissions"}

::alert{type="info"}
Note that you need to be a super admin yourself.
::

#### Through the UI

You can grant or revoke the Super Admin privilege using the switch in the User Edit page.

![superadmin switch](/docs/enterprise/superadmin_switch.png)

#### Through the CLI

To set an existing User with a Super Admin privilege from the [CLI](./cli.md), use the dedicated command:

```bash
# Set a user as Super Admin
kestra auths users set-type admin@kestra.io SUPER_ADMIN

# Revoke Super Admin privilege
kestra auths users set-type admin@kestra.io STANDARD
```

::

### Admin

In Kestra, the notion of Admin user does not exist; instead we create an **Admin** role with all permissions.

This role can be assigned to any User, Service Account or Group. This allows you to have different types of admin, to grant admin permissions to a whole group, and to revoke those admin permissions at any time without having to delete any group or user.

When using multi-tenancy, Kestra assigns by default the Admin Role to the user who created the tenant.

::alert{type="info"}
If you see an error when creating a new User or Service Account, it might be caused by a limit of your license. In that case, [reach out to us](/contact-us) to validate and optionally upgrade your license.
::

::collapse{title="Creating a User with an Admin Role"}

####  Through the UI

First time you launch Kestra, if no prior action has been made through the CLI, you will be invited to setup Kestra through the [Setup Page](../06.enterprise/02.setup.md).

This interface will offer you to create the first User which will automatically create the role Admin and bind the User to the role.

Later, you can create a new User or pick an existing User and assign the Admin role to it from the Access page.

#### Through the CLI

To create a User with an Admin Role from the CLI, use the `--admin` option:

```bash
kestra auths users create prod.admin@kestra.io TopSecret42 --admin

# schema:
kestra auths users create <username> <password> --admin
```

::

## Users, Groups and Service Accounts

In Kestra you will find three types of entities:

* Users: represents a **person**
* Groups: represents a collection of **Users** and **Service Accounts**
* Service Accounts: represents an **application**

All theses entities can be assigned to a Role, which define what resources the User, Group or Service Account can access.

Note that these entities don’t belong to namespaces, but their permissions can be limited to specific namespaces via Bindings (Access page).

::collapse{title="How to bind a role to a User, a Service Accounts or a Group?"}
Once you have created your first role. You can attach that role to an entity through the Access page. You can also limit that Role to one or more namespaces.

The following example show the creation of a Binding for a User. We are defining the User `john@doe.com` as an Admin for the `team.customer` namespace.

![create a binding](/docs/enterprise/create_binding.png)
::alert{type="info"}
**Note:** Service Accounts are considered as Users when bindings
::

::

::collapse{title="How many Roles can a User, a Service Account or Group have?"}
There is no limit to the number of Role that can be bind to an entity. They can have zero, one or more Roles attached, giving specific permissions, optionally tied to one or more namespaces.
::

### Users

A User represents a **person** who can access Kestra, identified by an email address. Each user might have personal
information attached to it, such as the first name or last name.

They can change their own password, and adjust other settings such as theme, editor preferences,
timezone, and a default namespace.

To add users to your Kestra instance, you can do one of the following:
- [Invite users](./invitations.md) to your instance or tenant from the UI
- Sync users from an external identity provider using SCIM
- Create users directly using Terraform

#### Change password

If a user wants to change their password, they can do it on their profile. This page can be accessed through the top right corner of the UI.
::collapse{title="Change password in the UI"}
![change_password](/docs/enterprise/change_password.png)
::

#### Reset password (by a Super Admin)

Kestra does not provide any forgot password feature yet. Currently only a super admin can update a user password through its User Edit page.

### Groups

Each `Group` is a collection of `Users` or `Service Accounts`.

- Each `User` can be assigned to zero, one or more `Groups`.
- Each `Service Account` can also be assigned to zero, one or more `Groups`.

Groups are a useful mechanism for providing the same roles to multiple Users or Service Accounts at once by binding a role to a Group.

#### What happens if you delete a Group?

All Users and Service Accounts assigned to that Group will lose permissions that were binds to the groups. However Users and Services Accounts will still exist.

## RBAC FAQ

::collapse{title="Why is Admin a Role rather than User type?"}

Admin role is a collection of permissions that can be assigned to Users, Service Accounts or Groups. This allows you to
grant multiple users with admin permissions if needed, and you can revoke only specific admin permissions at any time
without having to delete the user.

Admin roles can be assumed by multiple users or groups, and some user may be later granted a lower or a higher
permission boundary. In the same way, some user may initially be an Admin but then their permission may be revoked. The
Admin role enables all these patterns in a flexible way.

You can think of Users as **authentication** mechanism (who you are), and Roles as **authorization** mechanism (what you
are allowed to do). Decoupling authentication from authorization allows you to grant permissions to multiple users or
groups at once by attaching a single Role to a Group.
::

::collapse{title="Why can't I edit an existing Binding?"}

A Binding is an immutable object. If a Binding no longer reflects the desired permissions, you can delete the existing
Binding and create a new one for the same User, Service Account or Group, but with different Roles and/or namespaces.
This is a safety feature to prevent accidental changes to existing permissions.
::
