---
title: Tenants
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.13.0"
docId: tenants
---

How to enable multi-tenancy in your Kestra instance.


## What is Multi-Tenancy
A tenant represents an **isolated environment within a single Kestra instance**.

Each tenant functions as a separate entity with its own resources, such as flows, triggers, or executions. Multi-tenancy enables different teams, projects, or customers to operate independently within the same Kestra instance, ensuring data privacy, security along with separation of resources between business units, teams, or customers. For example, you can have a `dev` tenant for development, a `staging` tenant for testing, and a `prod` tenant for production.

::alert{type="info"}
You can think of multi-tenancy as running multiple virtual instances in a single physical instance of [Kestra Cloud](/cloud) or [Kestra Enterprise Edition](../01.overview/01.enterprise-edition.md).
::

When multi-tenancy is enabled, all resources (such as [flows](../../04.workflow-components/01.flow.md), [triggers](../../04.workflow-components/07.triggers/index.md), [executions](../../04.workflow-components/03.execution.md), [RBAC](../03.auth/rbac.md), and more) are isolated by the tenant. This means that you can have a flow with the same identifier and the same namespace in multiple tenants at the same time.

Data stored inside the internal storage are also isolated by tenants.

Multi-tenancy functionality is not visible to end-users from the UI except for the tenant selection dropdown menu. That dropdown menu lists all tenants a user has access to, allowing them to switch between tenants easily. Each UI page also includes the tenant ID in the URL like `https://demo.kestra.io/ui/yourTenantId/executions/namespace/flow/executionId`.

![Tenants selection dropdown](/docs/enterprise/tenants.png)

The API URLs also include the tenant identifier. For example, the URL of the API operation to list flows of the `marketing` namespace is `/api/v1/flows/marketing` when multi-tenancy is not enabled. Once you enable multi-tenancy and create a tenant `prod`, this URL becomes `/api/v1/prod/flows/marketing`. You can check the [API Guide](../../api-reference/enterprise.md) for more information.

Tenants must be created upfront, and a user needs to be granted access to use a specific tenant.

## Key Benefits of Multi-Tenancy

1. **Data Isolation**: each tenant's data, configuration, and code are isolated and inaccessible to other tenants.
2. **Resource Isolation**: each tenant's resources are isolated from other tenants — incl. flows, triggers, executions, logs, audit logs, secrets, etc.
3. **Simple Configuration**: you can easily create new tenants instantly giving you a fresh, fully-isolated workspace accessible from your existing Kestra instance.
4. **Intuitive UI Navigation**: the UI provides a dropdown as well as tenant identifiers included in the URL to make switching between tenants seamless.


## How to Enable Multi-Tenancy

As of version 0.22.0, multi-tenancy is enabled by default. To disable it, change `true` in following configuration to `false`:

```yaml
kestra:
  ee:
    tenants:
      enabled: true
```

::alert{type="warning"}
If you enable multi-tenancy in a Kestra instance with existing resources (flows, namespaces, executions), make sure to execute the `kestra auths users sync-access` command to synchronize the existing access permissions with the default tenant.
::

### Default Tenant

::alert{type="warning"}
As of version 0.22.0, Default Tenant is by default set to `false` and is a deprecated feature.
::

When enabling multi-tenancy, you can also decide whether to enable the default tenant or not. Default tenant is a placeholder for a tenant without an identifier (aka the null tenant) — it's not a real tenant, so you cannot edit it (e.g., you cannot add a logo for a default tenant). Default tenant exists as a concept only for backward compatibility when multi-tenancy is enabled in a Kestra instance that was created before multi-tenancy was introduced (i.e., in a Kestra version <= 0.13).

If you disable the default tenant in a Kestra instance that already has flows and executions, you will no longer be able to access them.

When multi-tenancy is enabled in a new Kestra instance, **it's recommended to disable the default tenant** so that all tenants will have an identifier. This way, all tenants are explicitly defined and can be referenced by their ID.

By default, as of version 0.22.0, multi-tenancy is enabled, and the default tenant is set to `false`. The following configuration is the default and recommended best practice:

```yaml
kestra:
  ee:
    tenants:
      enabled: true
      defaultTenant: false
```


::alert{type="info"}
Note that in [Kestra Cloud](/cloud), multi-tenancy is automatically enabled and the default tenant is disabled.
::

Once multi-tenancy is enabled, you can create one or more tenants either from the UI, CLI, Terraform, or API. Then, you can assign user roles and permissions within each tenant.


## Creating and Managing Tenants

Tenants in Kestra can be managed in various ways: from the UI, CLI, API, or Terraform.

### Creating a Tenant from the UI

Tenants can be created and managed directly through Kestra's user interface. Go to **Administration -> Tenants**. Then, click on the **Create** button:
![create tenant from the UI](/docs/enterprise/tenant-create.png)

Fill in the form and click **Save**:
![create tenant from the UI](/docs/enterprise/tenant-create-2.png)

The user who created the tenant will get an Admin Role for that tenant. You may need to refresh the UI to see updated Roles.

### Creating a Tenant from the CLI

Kestra provides CLI commands for tenant creation. The following command creates a tenant with the identifier `stage` and the name `Staging`:

```bash
kestra tenants create --tenant stage --name "Staging"
```

Running `kestra tenants create --help` shows you all available properties:

```bash
$ kestra tenants create --help
Usage: kestra tenants create [-hVv] [--internal-log]
                                [--admin-username=<adminUser>] [-c=<config>]
                                [-l=<logLevel>] [--name=<tenantName>]
                                [-p=<pluginsPath>] [--tenant=<tenantId>]
create a tenant and assign admin roles to an existing admin user
      --admin-username=<adminUser>
                            Username of an existing admin user that will be
                              admin of this tenant
  -c, --config=<config>     Path to a configuration file, default: /Users/anna/.
                              kestra/config.yml)
  -h, --help                Show this help message and exit.
      --internal-log        Change also log level for internal log, default:
                              false)
  -l, --log-level=<logLevel>
                            Change log level (values: TRACE, DEBUG, INFO, WARN,
                              ERROR; default: INFO)
      --name=<tenantName>   tenant description
  -p, --plugins=<pluginsPath>
                            Path to plugins directory , default:
                              /Users/anna/dev/plugins)
      --tenant=<tenantId>   tenant identifier
  -v, --verbose             Change log level. Multiple -v options increase the
                              verbosity.
  -V, --version             Print version information and exit.
```

### Creating a Tenant from the API

Tenants can be managed programmatically via Kestra's [API](../../api-reference/enterprise.md#post-/api/v1/tenants). Here is an example of an API call for creating a tenant:

```bash
curl -X POST "https://demo.kestra.io/api/v1/tenants" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{ \"id\": \"stage\", \"name\": \"staging\", \"deleted\": false}"
```

### Creating a Tenant from Terraform

Tenants can be managed via Infrastructure as Code using [Kestra's Terraform provider](../../13.terraform/resources/tenant.md). Here is an example of a Terraform configuration for creating a tenant:

```hcl
resource "kestra_tenant" "stage" {
  tenant_id = "stage"
  name      = "staging"
}
```

### Deleting a tenant

Deleting a tenant will delete all its resources including flows, namespaces, apps, dashboards, and roles. Execution data, logs, metrics, and audit logs remain stored in the database, and they can be purged if needed with their corresponding [Purge tasks](../../09.administrator-guide/purge.md).

Key Value pairs and namespace files will not be deleted as they are persisted in internal storage.

### Admin Role Assignment

Regardless of which of the above methods you use to create a tenant, the User who creates the tenant automatically gets the Admin Role assigned. That role grants admin rights to that user on that tenant.

Note that there is an exception to this rule if tenant is created by a Super Admin. In that case, the Super Admin has to explicitly assign the Admin Role for that tenant to themselves or any other User, Service Account, or Group.

### Dedicated Storage and Secrets backend per Tenant

By default, each tenant uses the same [internal storage](../../configuration/index.md#internal-storage) and [secrets backend](./secrets-manager.md) configured for your Kestra instance. If you need more isolation, you can configure a dedicated storage and secrets backend per tenant. This can be useful if each of your tenants serves different customers and you need to ensure complete data isolation between them.

To configure a dedicated storage and secrets backend per tenant, navigate to the respective tenant in the UI and click on the **Edit** button. Then, select the storage and secrets backend you want to use for that tenant:

![tenants-dedicated-internal-storage](/docs/enterprise/tenants-dedicated-internal-storage.png)


::alert{type="warning"}
Note that this feature has been introduced in Kestra 0.20.0. If you are using an older version, you need to upgrade to set up dedicated storage and secrets backend per tenant.

Also, make sure to use `camelCase` notation. For example, if you want to use the `GCS` storage backend, you should use `projectId` as the value rather than `project-id`.
::
