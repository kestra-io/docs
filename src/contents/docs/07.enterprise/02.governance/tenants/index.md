---
title: "Multi-Tenancy in Kestra: Configure Tenants"
h1: Isolate Resources and Users Across Teams with Multi-Tenancy
description: Enable Multi-Tenancy in Kestra Enterprise. Isolate resources, flows, and users across different teams or projects within a single Kestra instance.
sidebarTitle: Tenants
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.13.0"
docId: tenants
---

Multi-tenancy lets you run isolated environments for different teams, projects, or customers within a single Kestra instance.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/z4uzAyjKeoc?si=vy-CPQKNYXYZMwoo" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Multi-tenancy — configure and manage tenants

A tenant represents an **isolated environment within a single Kestra instance**.

Each tenant functions as a separate entity with its own resources, such as flows, triggers, or executions. Multi-tenancy enables different teams, projects, or customers to operate independently within the same Kestra instance, ensuring data privacy, security, and separation of resources between business units, teams, or customers. For example, you can have a `dev` tenant for development, a `staging` tenant for testing, and a `prod` tenant for production.

:::alert{type="info"}
You can think of multi-tenancy as running multiple virtual instances in a single physical instance of [Kestra Cloud](/cloud) or [Kestra Enterprise Edition](../../01.overview/01.enterprise-edition/index.md).
:::

All resources (such as [flows](../../../05.workflow-components/01.flow/index.md), [triggers](../../../05.workflow-components/07.triggers/index.mdx), [executions](../../../05.workflow-components/03.execution/index.md), [RBAC](../../03.auth/rbac/index.md), and more) are isolated by the tenant. This means that you can have a flow with the same identifier and the same namespace in multiple tenants at the same time.

Data stored inside the internal storage is also separated by tenants.

Users switch between tenants using the tenant dropdown in the bottom-left corner of the UI. The dropdown shows every tenant the user has access to; the active tenant is indicated with a checkmark. Each UI page includes the tenant ID in the URL (e.g., `https://demo.kestra.io/ui/yourTenantId/executions/namespace/flow/executionId`).

![Tenant switcher dropdown showing Development, Production, North America, Europe, and Asia Pacific tenants](./tenant-switcher.png)

Most [API](../../../api-reference/index.mdx) endpoints also include the tenant identifier. The exception to that is instance-level endpoints such as `/configs`, `/license-info` or `/banners` that require Instance Owner access.

For example, the URL of the API operation to list flows of the `products` namespace is `/api/v1/{your_tenant_id}/flows/products`. You can check the [Enterprise Edition API Guide](../../../api-reference/01.enterprise/index.mdx) for more information.

Tenants must be created upfront, and a user needs to be granted access to use a specific tenant.

## Key benefits of multi-tenancy

1. **Data Isolation**: each tenant's data, configuration, and code is isolated and inaccessible to other tenants.
2. **Resource Isolation**: each tenant's resources are isolated from other tenants — including flows, triggers, executions, logs, audit logs, secrets, etc.
3. **Simple Configuration**: create new tenants at any time, each providing a fresh, fully isolated workspace accessible from your existing Kestra instance.
4. **Intuitive UI Navigation**: the UI provides a dropdown as well as tenant identifiers included in the URL to make switching between tenants seamless.


## Creating and managing tenants

Tenants are created and managed through the **Instance Owner console** — only users with the Instance Owner privilege can create, edit, or delete tenants. The console is accessible from **Instance Owner → Tenants** in the UI. Tenants can also be managed via the CLI, API, or Terraform.

### Creating a tenant from the UI

Tenants are created from **Instance Owner → Tenants**. The user who creates a tenant is automatically granted the Admin Role for that tenant.

### Creating a tenant from the CLI

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

### Creating a tenant from the API

Tenants can be managed programmatically via Kestra's [API](../../../api-reference/01.enterprise/index.mdx#post-/api/v1/tenants). Here is an example of an API call for creating a tenant:

```bash
curl -X POST "https://demo.kestra.io/api/v1/tenants" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{ \"id\": \"stage\", \"name\": \"staging\", \"deleted\": false}"
```

### Creating a tenant from Terraform

Tenants can be managed via Infrastructure as Code using [Kestra's Terraform provider](../../../13.terraform/resources/tenant/index.md).

:::alert{type="info"}
This example assumes you have already configured the [Kestra Terraform Provider](../../../13.terraform/index.mdx)
:::

Here is an example of a Terraform configuration for creating a tenant:

```hcl
resource "kestra_tenant" "stage" {
  tenant_id = "stage"
  name      = "staging"
}
```

### Deleting a tenant

Deleting a tenant removes all associated resources including flows, namespaces, apps, dashboards, and roles. Execution data, logs, metrics, and audit logs are retained in the database, and they can be purged if needed with their corresponding [Purge tasks](../../../10.administrator-guide/purge/index.md).

:::alert{type="warning"}
Deleting a tenant is irreversible. All resources under the tenant will be permanently removed, except for logs and execution history stored in the database.
:::

Key-value pairs and namespace files will not be deleted as they are persisted in internal storage.

### Admin role assignment

Regardless of which of the above methods you use to create a tenant, the User who creates the tenant automatically gets the Admin Role assigned. That role grants admin rights to that user on that tenant.

Note that there is an exception to this rule if a tenant is created by an Instance Owner. In that case, the Instance Owner has to explicitly assign the Admin Role for that tenant to themselves or any other User, Service Account, or Group.

### Dedicated storage and secrets backend per tenant

By default, each tenant uses the same [runtime and storage configuration](../../../configuration/02.runtime-and-storage/index.md) and [secrets backend](../secrets-manager/index.md) configured for your Kestra instance. If you need more isolation, you can configure a dedicated storage and secrets backend per tenant. This can be useful if each of your tenants serves different customers and you need to ensure complete data isolation between them.

Configure a dedicated backend from the tenant's **Settings** page, under **Dedicated internal storage** and **Dedicated secrets manager**. Each section has a type selector and a YAML configuration editor. The API (`storageType`, `storageConfiguration`, `secretType`, and `secretConfiguration` on the tenant) and the [Terraform `kestra_tenant` resource](../../../13.terraform/resources/tenant/index.md) accept the same fields.

#### Use camelCase keys

Write the configuration in camelCase, for example `accessKey` and `projectId`. In `application.yml` and Helm values, Kestra converts kebab-case keys such as `access-key` for you. Tenant settings pass your keys straight to the backend plugin with no conversion, so a kebab-case key fails when you save:

```
Failed to create storage 's3'. Error: Unrecognized field "access-key"
```

To reuse an existing instance configuration:

1. Copy the properties nested under `kestra.storage.<type>` or `kestra.secret.<type>`.
2. Remove that prefix and the `type` key. The type selector sets the backend type.
3. Rename every kebab-case key to camelCase.

Common keys:

| `application.yml` or Helm key | Tenant settings key | Backend |
|---|---|---|
| `access-key`, `secret-key` | `accessKey`, `secretKey` | S3 storage |
| `force-path-style` | `forcePathStyle` | S3 storage |
| `project-id`, `service-account` | `projectId`, `serviceAccount` | GCS storage |
| `connection-string` | `connectionString` | Azure Blob storage |
| `shared-key-account-name`, `shared-key-account-access-key` | `sharedKeyAccountName`, `sharedKeyAccountAccessKey` | Azure Blob storage |
| `access-key-id`, `secret-key-id` | `accessKeyId`, `secretKeyId` | AWS Secrets Manager |
| `app-role.role-id`, `app-role.secret-id` | `appRole.roleId`, `appRole.secretId` | HashiCorp Vault |
| `filter-on-tags`, `filter-on-prefix` | `filterOnTags`, `filterOnPrefix` | AWS, Azure, and Google secrets managers |

Single-word keys such as `bucket`, `region`, `endpoint`, and `address` stay the same.

#### Dedicated storage example

An S3 bucket as the tenant's internal storage, entered in **Dedicated internal storage** with the type set to `s3`:

```yaml
bucket: tenant-a-kestra-storage
region: eu-west-1
accessKey: YOUR_ACCESS_KEY
secretKey: YOUR_SECRET_KEY
```

The same bucket in `application.yml` uses kebab-case keys under `kestra.storage.s3`:

```yaml
kestra:
  storage:
    type: s3
    s3:
      bucket: tenant-a-kestra-storage
      region: eu-west-1
      access-key: YOUR_ACCESS_KEY
      secret-key: YOUR_SECRET_KEY
```

For a GCS bucket, set the type to `gcs`:

```yaml
bucket: tenant-a-kestra-storage
projectId: my-gcp-project
serviceAccount: |
  { "type": "service_account", ... }
```

#### Dedicated secrets manager example

AWS Secrets Manager, entered in **Dedicated secrets manager** with the type set to `aws-secret-manager`:

```yaml
region: eu-west-1
accessKeyId: YOUR_ACCESS_KEY_ID
secretKeyId: YOUR_SECRET_ACCESS_KEY
```

HashiCorp Vault with AppRole authentication, with the type set to `vault`:

```yaml
address: https://vault.example.com:8200
appRole:
  path: approle
  roleId: YOUR_ROLE_ID
  secretId: YOUR_SECRET_ID
```

For every property of each backend, see [Runtime and Storage](../../../configuration/02.runtime-and-storage/index.md) and the [Secrets Manager documentation](../secrets-manager/index.md). Those pages show `application.yml` keys, so rename them to camelCase before you paste them here.

### Isolate Kestra services

When using [Dedicated Storage or Secret backends](../tenants/index.md#dedicated-storage-and-secrets-backend-per-tenant), you can isolate specific [Kestra services](../../../08.architecture/02.server-components/index.md) to prevent them from accessing the storage or secret backend. For example, you may not want the [Webserver](../../../08.architecture/02.server-components/index.md#webserver) to be able to access the dedicated internal storage. This isolation is intended for Kestra instances where multiple teams or organizations share access, but storage or secret data access must be limited to specific segments.

The configuration utilizes the `deniedServices` property with a list of the services to isolate. Take the following as an example using `storage` (this can be replaced with `secret` for a dedicated secret backend), where the Executor and Webserver must be isolated:

```yaml
kestra:
  storage:   # or secret
    isolation:
      enabled: true
      deniedServices: [EXECUTOR, WEBSERVER]
```

For additional configuration details, refer to dedicated [Security and Secrets](../../../configuration/05.security-and-secrets/index.md) and [Runtime and Storage](../../../configuration/02.runtime-and-storage/index.md) pages in the configuration guide.

:::alert{type="info"}
If this feature is enabled some UI or flow execution capabilities may not work as expected. If unsure, contact support.
:::

### Default service account for SDK plugins

Each tenant can define **default authentication credentials** used by [SDK-based plugins](/plugins/plugin-kestra). Configure this in the Tenant settings (API token or basic auth). [Namespaces](../07.namespace-management/index.md#default-service-account-for-sdk-plugins) can override it with their own default service account; otherwise the tenant-level default is used. If neither is set, SDK plugins require the properties to be defined in the tasks.
