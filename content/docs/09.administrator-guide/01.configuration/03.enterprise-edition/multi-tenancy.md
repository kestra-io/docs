---
title: Multi-tenancy configuration
---

For an overview of what is multi-tenancy, please read the [Architecture - Multi-tenancy](../../../08.architecture.md#multi-tenancy) documentation.

## Configuring multi-tenancy

### `kestra.ee.tenants.enabled`

Set it to `true` to enable multi-tenancy.
By default multi-tenancy is disabled.

### `kestra.ee.tenants.default-tenant`

The default tenant is a tenant without identifier (or the null tenant), it exists for backward compatibility when multi-tenancy is enabled in an existing Kestra instance. If you disable the default tenant in a Kestra instance that already have flows and executions, those will not be available anymore to anyone.

When multi-tenancy is enabled in a new Kestra instance, it is advised to disabled the default tenant so all tenants will have an identifier.

By default, the default tenant is enabled, set it to `false` to disable it.

## Creating tenants

In order to create tenants, a user must have the **CREATE** permission on the **TENANT** role.

The tenant can be created from the UI, from the [API](../../../12.api-guide/api-ee-guide.md#post-/api/v1/tenants), from our [Terraform integration](https://kestra.io/docs/terraform/resources/tenant), or thanks to a kestra CLI command. In all cases, an **Admin** role is created with admin rights on the new tenant and the authenticated use, or the user passed to the command, will have this role on the new tenant.

### From the UI

To create a tenant with the identifier `production`, go to **Administration -> Tenants** then click on the **Create** button.

Fill in the form then click on the **Save** button.

![Create tenant](/docs/administrator-guide/configuration/enterprise-edition/tenant-create.png "Create tenant")

The user that create the tenant will have admin rights on it, you may need to refresh the UI to refresh your roles.

## From the Kestra CLI

The following command will create a tenant with the identifier `dev` and gives admin rights for this tenant to the user `john@doe.com`.

```shell
kestra tenants create --admin-username john@doe.com --tenant dev --name "Development environment"
```