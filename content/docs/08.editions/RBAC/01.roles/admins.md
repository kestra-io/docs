---
title: Admin Roles
---


## Instance Admin

The Instance Admin role is not limited to any single tenant. It has full access to all resources in all tenants. You can think of this role as a super-admin role that can manage all tenants, users and resources across the instance.

::alert{type="info"}
Except for the `Instance Admin`, all Roles are always tied to one and only one tenant ID. We currently don’t provide any cross-tenant RBAC permissions. However, when configuring permissions using our Terraform provider, you can add modules to reuse the same configuration across tenants if needed.
::


The **Instance Admin** is a super-admin role with the same permissions that each **Tenant Admin** has, but it also has permissions to manage tenants and tenant admins, as well as enforce tenant-level rules e.g. to centrally govern Roles, Groups, and Users on the instance level.

Note that Instance Admin is not a User, but a Role. This means that there can be multiple users with that permission. `Instance Admin` can:
- create new tenants
- remove tenants
- modify tenant settings
- assign roles to users across all tenants in the instance
- do anything in that Enterprise Edition instance: unlimited permissions to see and do everything across all tenants incl. managing users, groups, roles, flows, executions, logs, audit logs etc.

We plan to provide a Management Console that will offer an instance-level overview of existing Tenants, Roles, and Users across the Enterprise Edition installation. This view will be visible only to Instance Admins.

---

## Tenant Admin

The Tenant Admin role has full access to all resources in a specific tenant. This includes managing users, service accounts, groups, roles, and their tenant-level permissions.

`Tenant Admin` can `reset the password` for any User, Service Account or Group, or reset them in a bulk action. However, the Tenant Admin cannot directly change the password or email address of any User for privacy reasons. Instead, the Tenant Admin can only reset the password and send a mandatory password change request to the user.

The `Tenant Admin` cannot see all users existing in the instance for privacy reasons. However, that admin can invite Users already existing in the instance to that tenant by adding them to a Group or by assigning a Role to them. When selecting the user from the dropdown and typing the exact email address, the user will become visible and you will be able to add them to the tenant. That User or Service Account will then also be visible in the Users or or Service Accounts page for that tenant, even though it has not been originally created in that tenant.

This admin role can also create new Users or Service Accounts, modify or remove tenant-level access for existing Users or Service Accounts, and reset their passwords.

::alert{type="info"}
**TECHNICAL DETAIL:** How does Kestra ensure that only Users who have access to that tenant are visible on the tenant level? In the view for a specific tenant, we filter the list of Users or Service Accounts to only show users who have access to that tenant by doing a join on the `tenant_access` table and filtering by tenant ID. That view will is visible to all Tenant Admins.
::

If you see an error when creating a new User or Service Account, it might be caused by a limit of your license. In that case, [reach out to us](https://kestra.io/contact-us) to validate and optionally upgrade your license.

Note that the Tenant Admin is not a User, but a Role. This means that there can be multiple users with that permission. `Tenant Admin` can do the same what **Instance Admin** can do, but only for a specific tenant.

To create a User with a Tenant Admin Role, use the `--tenant-admin` property with the tenant ID:

```yaml
auths users create --tenant-admin prod --username demo --password demo
```

By default, Kestra assigns the Tenant Admin Role to the user who created a tenant. This includes the default tenant as well. This means there are currently dedicated Admin roles for each tenant, incl. the default tenant.
