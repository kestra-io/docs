---
title: Role-Based Access Control (RBAC)
icon: /docs/icons/admin.svg
---

Kestra Enterprise supports Role-Based Access Control (RBAC), allowing you to manage access to workflows and resources by assigning [Roles](01.roles.md) to [Users, Groups and Service Accounts](03.users.md) through the **Access page**.

The image below shows the relationship between Users, Groups, Service Accounts, Roles, and Bindings (visible on the Access page in the UI).

![bindings](/docs/bindings.png)


## Roles and Bindings

A Role is a collection of permissions that can be assigned to Users, Service Accounts or Groups. A Role can be granted one or more permissions, which are defined by a combination of a **Permission** (e.g. `FLOWS`) and an **Action** (e.g. `CREATE`).

You can think of a **Role** as a policy that defines what Permissions and Actions should be granted to someone. Once you attach a Role to a User, Service Account or Group through the **Access** UI page, Kestra creates a **Binding**, and that Binding (_optionally limited to one or more namespaces_) grants the permissions defined by that Role to the User, Service Account or Group. This means that the Role itself does not grant any permissions to anyone. It's the Binding that grants permissions defined by a Role to the User, Service Account or Group.

A Binding can be optionally limited to one or more specific namespaces. When a Binding is tied to a namespace, it also automatically grants permissions to all child namespaces. For example, a Role attached to the `prod` namespace will automatically grant access to `prod.engineering` namespace as well.

In short, Roles encapsulate permission boundaries that can be attached to users, service accounts or groups across tenants and namespaces.


### Permissions

A Permission is a resource that can be accessed by a user or group. The following permissions are currently supported: `FLOWS`, `BLUEPRINTS`, `TEMPLATES`, `NAMESPACES`, `EXECUTIONS`, `USERS`, `GROUPS`, `ROLES`, `BINDINGS`, `AUDITLOGS`, `SECRETS`, `IMPERSONATE`, `SETTINGS`, `WORKERS`, `SUPERADMIN`.

Note that the `SUPERADMIN` permission is a special permission that is only granted to a [Super Admin](02.admins.md#super-admin). This permission grants access to manage tenants within a Kestra Enterprise instance.


### Actions

An Action is a specific operation that can be performed on a Permission. The currently supported Actions are: `CREATE`, `READ`, `UPDATE`, `DELETE`.


### Currently supported Roles

Kestra currently supports the following roles by default:
- **Admin**: this role has full access to **all resources in a specific tenant**.
- **Super Admin**: this role has full access to all resources within the tenant from which it was granted to a User, Service Account or Group. On top of that, this role also has access to **manage tenants** within a Kestra Enterprise instance.

You can create additional Roles with custom permissions.

---

## Admin

Kestra doesn't have a concept of an admin user. Instead, it has a **Super Admin** and a tenant-scoped **Admin** roles, which can be assigned to any User, Service Account or Group. This allows you to grant multiple users with admin permissions if needed, and you can revoke those admin permissions at any time without having to delete the user.

The Admin role has full access to all resources in a specific tenant. This includes managing users, service accounts, groups, roles, and their tenant-level permissions. By default, Kestra assigns the Admin Role to the user who created a tenant (unless the tenant was created by a user with a [Super Admin Role](02.admins.md#super-admin)).

::alert{type="warning"}
Note that Admin is **NOT a User**, but a **Role**. This means that there can be multiple users with that permission, and that role can be revoked from a user at any time.
::

Users with an `Admin` role in a given tenant:
- cannot see all workers in the Instance, you'd need the `Super Admin` role to see workers
- cannot directly change the password or email address of any User for privacy reasons; instead, they can only reset the password and send a mandatory reset-password request to the user
- cannot see all Users existing in the instance for privacy reasons
- can automatically send a **reset-password request** to any User, Service Account or Group in that tenant
- can invite Users (already existing in the instance) to that tenant by adding them to a Group or by assigning a Role to them. When selecting the user from the dropdown and typing the exact email address, the user will become visible and can be added to the tenant. That User or Service Account will then also be visible in the Users or Service Accounts page for that tenant, even if it has not been originally created in that tenant.

The Admin role can also create new Users or Service Accounts, modify or remove tenant-level access for existing Users or Service Accounts, and reset their passwords.

::alert{type="info"}
If you see an error when creating a new User or Service Account, it might be caused by a limit of your license. In that case, [reach out to us](https://kestra.io/contact-us) to validate and optionally upgrade your license.
::


### Creating a User with an Admin Role from the UI

Go to **Administration -> Users**. Then, click on the **Create** button and assign the `Admin` Role to the User.


### Creating a User with an Admin Role from the CLI

To create a User with an Admin Role from the CLI, use the `--admin` boolean flag along with `--tenant` property with the tenant ID (here `prod`):

```bash
kestra auths users create prod.admin@kestra.io TopSecret42 \
--tenant=prod --admin

# schema: select either `--admin` or `--superadmin`:
kestra auths users create <username> <password> \
--tenant=<tenant-id> --admin --superadmin
```

---

## Super Admin

A user with a Super Admin role has full access to all resources in a specific tenant from which it was created. Additionally, it has permissions to create or delete tenants, as well as centrally govern Roles, Groups, and Users on the instance level (i.e. across all tenants). Users with Super Admin Role can access executions, logs, audit logs, and other tenant information from any tenant if this is required for troubleshooting purposes or to help a user with a problem, e.g. if a user forgot their password, locked themselves out, etc.

When a User with Super Admin Role creates a new tenant, they aren't automatically granted an Admin Role to that tenant. They can assign Admin Role to themselves or any other User, Service Account or Group in that tenant. The tenant-level Admin Role must be explicitly granted.

**How can a User with a Super Admin Role grant someone an Admin Role without having an Admin Role in that tenant themselves?** There is a dedicated API endpoint accessible only to those with a Super Admin Role through a Management Console, allowing them to bypass the tenant-level permissions. Even though that user can grant permission to any tenant, that user will not be listed under tenant-level Users.

Super Admin is a powerful Role that allows you to troubleshoot any tenant issues without having to be an Admin in that tenant. Use that role sparingly and only for use cases that require it, such as creating a new tenant, troubleshooting tenant issues, or helping a user with a problem.

::alert{type="info"}
Except for the `Super Admin`, all Roles are always tied to one and only one [tenant ID](../03.tenants.md). We currently don’t provide any cross-tenant RBAC permissions. However, when configuring permissions using [our Terraform provider](https://registry.terraform.io/providers/kestra-io/kestra/latest), you can add modules to reuse the same configuration across tenants to achieve the same effect without duplicating the configuration.
::

The main difference between an **Admin** and a **Super Admin** roles is that the **Instance Admin** also has the `SUPERADMIN` permission. This extra permission grants access to create, manage or delete tenants.

A User with a `Super Admin` Role can:
- create/remove tenants
- create/remove Roles
- create/remove Users, Service Accounts, and Groups
- add users to, or remove them from, tenants or Groups
- add or remove Roles from Users, Service Accounts, and Groups in any tenant
- assign themselves or anyone else an `Admin` Role in any tenant.
- grant `Super Admin` Role to other Users, Service Accounts, and Groups
- do anything in their tenant: manage Users, Groups, Roles, flows, executions, logs, audit logs etc.
- get access other tenants' flows, executions, logs, audit logs, etc when needed for troubleshooting purposes
- see an instance-level overview of existing tenants.


### Creating a User with Super Admin Role from the UI

When launching Kestra for the first time, you will see a welcome screen allowing you to create a first User if you don't have one already. This User will automatically be assigned the `Super Admin` Role.

### Creating a User with Super Admin Role from the CLI

To create a User with a Super Admin Role from the CLI, use the `--superadmin` property:

```bash
kestra auths users create prod.admin@kestra.io TopSecret42 --superadmin

# schema: select either `--admin` or `--superadmin`:
kestra auths users create <username> <password> \
--tenant=<tenant-id> --admin --superadmin
```

If you use the same command as above, but change the `--superadmin` flag to just `--admin`, the user will be created with the `Tenant Admin` Role instead. Make sure to include the `--tenant` property with the tenant ID when creating a user with an `Admin` Role.

Note that only a user with a `Super Admin` Role can grant a Role with `SUPERADMIN` or `ROLES` permissions:
  - If you want to give a role with `SUPERADMIN` permission to someone, you need to have a `SUPERADMIN` permission yourself
  - If you want to give a role with `ROLES` permission, you need to have a `SUPERADMIN` permission, as otherwise, someone could grant themselves or someone else a `SUPERADMIN` permission.

---

## Users, Groups and Service Accounts

Users and Service Accounts are two different types of users that can access Kestra. Each `User` represents a **person**, while each `Service Account` represents an **application** that can access Kestra resources.

Both `Users` and `Service Accounts` can be directly assigned one or more `Roles` defining their permission boundaries. `Users` and `Service Accounts` can also be assigned to `Groups`, and those `Groups` can be assigned one or more `Roles` as well. Groups are especially useful to provide the same permissions to multiple Users or Service Accounts at once by assigning a single Role to a Group.


### Groups

Each `Group` is a collection of zero, one or more `Users` or `Service Accounts`.
- Each `User` can be assigned to zero, one or more `Groups` as a **Group Owner** or **Group Member**.
- Each `Service Account` can also be assigned to zero, one or more `Groups` as a **Group Owner** or **Group Member**.

Technically speaking, Groups don't have Users or Service Accounts. Instead, Users or Service Accounts can be _attached_ to Groups. As soon as a User or a Service Account gets attached to a Group, you’ll see them listed in the `Members` or `Owners` tab in the UI. You can attach Users or Service Accounts **from the Group page**, or you can attach a Group to a given Users or Service Accounts **from the Users or Service Accounts pages** — both options are equivalent.

You can think of a Group as a category label that you can attach to a collection of Users or Service Accounts. Groups are a useful mechanism providing the same permissions to multiple Users or Service Accounts at once by assigning a single Role to a Group.

**What happens if you delete a Group?** The assignment of User to Group will be deleted as well, but the user will still exist because the User is independent of a Group. Group acts as a label of users from the same _family_.

**How to attach permissions to a User or Group?** You need to create a Role first. Then you can attach that Role to a User or Group. You can also limit that Role to one or more namespaces.

**How many Roles can a User or Group have?** A User or Group can have zero, one or more Roles attached, giving specific permissions, optionally tied to one or more namespaces.

---

### Users

A User represents a **person** who can access Kestra, identified by an email address. Each user might have personal information attached to it, such as the first name or last name.

Each User can be assigned one or more Roles, which define what resources the User can access. `User` can be a developer writing flows, operator running flows, viewer only viewing execution states or run artifacts. The combination of Permissions and Actions specified in a Role determine what the user can do.

Note that Users and Groups don’t belong to namespaces, but their Roles can be limited to specific namespaces via Bindings (Access page).

A `User` without `Admin` or `Super Admin` Role will not see the Administration and IAM views listing all Users, Groups, Service Accounts, Roles, and Bindings. They can change their own password, and adjust other settings such as theme, editor preferences, timezone, and a default namespace per tenant. The profiles bound to a tenant allow each user to save their preferences per tenant allowing configuring default preferences per environment.


#### Forgot password (initiated by the user)

If the user forgot their password, they can reset it by clicking on the `Forgot Password` button on the login screen. This will send an email with a secure link to change the password. The user can also change their password from their Settings page.


#### Reset password (initiated by the admin)

Neither Admin nor Super Admin can change a user's password arbitrarily. However, both Admins can issue a `change password request` which will send an email to one or more selected users with a secure link to change the password. This is useful in the following use cases:

1. Security breach - specific passwords must be reset
2. Password rotation policy - e.g. a compliance policy requires all passwords to be rotated every 90 days
3. Employee departure or customer churn - the admin can immediately reset their password and keep the user account to keep the audit logs, or delete the user account later.

---

### Service Accounts

A Service Account represents an **application** that can access Kestra. It is not tied to a specific person, and does not have personal information (such as first name, last name or email) attached to it. Instead, it only has an ID, an OAuth token and an optional expiration date for that token. The token is automatically generated by Kestra. The Service Account can be granted Roles with fine-grained Permissions bound to one or more specific namespace(s).

Each Service Account can be attached to one or more Groups e.g. a group “Bots” that centrally governs programmatic access for CI/CD across multiple projects with just one Role. This is useful to manage programmatic access used by Terraform, GitHub Action, or other external applications, in one place by attaching a single Role to that Group.

Speaking of CI/CD, note that currently Kestra supports authenticating with both Basic Authentication User, as well as with a Service Account's token:

1. Use the `--token=mytoken` CLI property to allow authenticating with a service account token, e.g.:

```
./kestra namespace files update prod scripts . \
--server=https://demo.kestra.io --token yourtoken
```

2. Use the `--user user_email:password` flag to the CLI to allow authenticating with a Basic Authentication access, e.g.:

```
./kestra namespace files update prod scripts . \
--server=https://demo.kestra.io --user=rick.astely@kestra.io:password42
```

## RBAC FAQ

**Why a Service Account is not just one type of User?**

Service Account is not a User, but a collection of Permissions and an OAuth token associated with it to allow an external application (such as Terraform or GitHub Actions) to assume programmatic access to Kestra resources. You can think of a Service Account as an application that is granted permissions to perform actions on behalf of a user.

**Why Admin and Super Admin are Roles rather than Users?**

Becuase they can be assumed by multiple users or groups, and because some user may be later granted a higher permission; in the same way, some user may initially be an Admin but then their permission may be revoked. The Admin Roles enables all these patterns in a flexible way.

You can think of Users as **authentication** mechanism (who you are), and Roles as **authorization** mechanism (what you are allowed to do). Decoupling authentication from authorization allows you to grant permissions to multiple users or groups at once by attaching a single Role to a Group.
