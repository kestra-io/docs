---
title: Multi-tenancy configuration
---

This section dives into how you can configure multi-tenancy in your Kestra instance. For a high-level overview, check the multi-tenancy section of the [Architecture documentation](../../../01.architecture.md#multi-tenancy) or the [Tenants page](../../../08.kestra-editions/03.tenants.md).

## Enabling multi-tenancy

### Enable multi-tenancy with the `kestra.ee.tenants.enabled` boolean property

Set this property to `true` to enable multi-tenancy. By default, multi-tenancy is disabled.

If you enable multi-tenancy in a Kestra instance with existing resources (flow, namespace, execution), you must use the `kestra auths users sync-access` command to synchronize the existing accesses to the default tenant (see above).

### Enable or disable the default tenant with the `kestra.ee.tenants.default-tenant` boolean property

The **default tenant** is a tenant without an identifier (aka the null tenant). It exists for backward compatibility when multi-tenancy is enabled in an existing Kestra instance. If you disable the default tenant in a Kestra instance that already has flows and executions, you will no longer be able to access them.

When multi-tenancy is enabled in a new Kestra instance, it's recommended to disable the default tenant so that all tenants will have an identifier. This way, all tenants are explicitly defined and can be referenced by their ID.

By default, multi-tenancy is disabled, and the default tenant is set to `true`. Once you enable multi-tenancy, you can set the **default tenant** to `false` to disable it so that your Kestra instance includes only the tenants you explicitly create.

## Creating tenants

In order to create tenants, a user must have the **CREATE** permission on the **TENANT** role.

The tenant can be created in multiple ways:
1. From the UI
2. From an [API call](../../../12.api-guide/api-ee-guide.md#post-/api/v1/tenants)
3. From the [Kestra Terraform provider](https://kestra.io/docs/terraform/resources/tenant)
4. From a [kestra CLI](https://kestra.io/docs/administrator-guide/servers) command.

In all cases, a [Tenant Admin Role](../../../08.kestra-editions/RBAC/02.admins.md) is created with tenant-level admin rights. The authenticated user or the user passed to the command will have this Tenant Admin Role on the new tenant.

### From the UI

To create a tenant with the identifier `production`, go to **Administration -> Tenants**. Then, click on the **Create** button.

Fill in the form and click **Save**.

![Create tenant](/docs/administrator-guide/configuration/enterprise-edition/tenant-create.png "Create tenant")

The user that creates the tenant will get a [Tenant Admin Role](../../../08.kestra-editions/RBAC/02.admins.md) assigned to it. You may need to refresh the UI to see updated [Roles](../../../08.kestra-editions/RBAC/01.roles.md).

## From the Kestra CLI

The following command will create a tenant with the identifier `dev`:

```shell
kestra tenants create --tenant dev --name "Development environment"
```
