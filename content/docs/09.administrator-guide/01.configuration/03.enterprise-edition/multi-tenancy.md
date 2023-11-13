---
title: Multi-tenancy configuration
---

This section dives into how you can configure multi-tenancy in your Kestra instance. For a high-level overview, check the multi-tenancy section of the [Architecture documentation](../../../08.architecture.md#multi-tenancy).

## Configuring multi-tenancy

### `kestra.ee.tenants.enabled`

Set it to `true` to enable multi-tenancy. By default, multi-tenancy is disabled.

### `kestra.ee.tenants.default-tenant`

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

In all cases, an **Admin** role is created with admin rights on the new tenant. The authenticated user or the user passed to the command will have this Admin role on the new tenant.

### From the UI

To create a tenant with the identifier `production`, go to **Administration -> Tenants**. Then, click on the **Create** button.

Fill in the form and then click on **Save**.

![Create tenant](/docs/administrator-guide/configuration/enterprise-edition/tenant-create.png "Create tenant")

The user that creates the tenant will have admin rights on it. You may need to refresh the UI to refresh your roles.

## From the Kestra CLI

The following command will create a tenant with the identifier `dev` and give admin rights for this tenant to the user `john@doe.com`.

```shell
kestra tenants create --admin-username john@doe.com --tenant dev --name "Development environment"
```