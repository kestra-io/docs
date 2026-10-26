---
title: "Infrastructure Tenant in Kestra Enterprise"
h1: Infrastructure Tenant
description: Use an Infrastructure tenant to deliver self-service provisioning, day-2 operations, and asset lifecycle management through a purpose-built UI.
sidebarTitle: Infrastructure
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
---

An Infrastructure tenant is a Kestra tenant configured for infrastructure self-service and day-2 operations. It presents the same Kestra engine and data model through a purpose-built navigation focused on a Catalog, Requests, Deployments, and Inventory rather than the general-purpose Flows and Apps views.

## Navigation

When a tenant's type is set to `INFRASTRUCTURE`, all users in that tenant see a different home and sidebar:

- **Home**: Catalog (instead of Dashboards)
- **Self-Service** sidebar group: Catalog, Requests, Deployments, Inventory, Cases, Dashboards
- **Automation**, **Infrastructure**, and **Tenant** sidebar groups remain below, giving access to flows, executions, namespaces, and all standard settings. **Automation** starts with **Templates**, where you manage [app templates](../../../app-templates/index.md) that publish new catalog entries.

Everything available in a `DEFAULT` tenant is still accessible. The Infrastructure layout surfaces the most relevant screens first.

## Catalog

The Catalog is the home page of an Infrastructure tenant. It shows the Apps available for users to request — for example, provisioning a VM, requesting a database, or creating a cloud bucket.

Each catalog entry is a Kestra [App](../../../../04.scalability/apps/index.md) visible to users with the appropriate RBAC. When a user submits a catalog form, it creates a Request and triggers the underlying flow. When the flow finishes, the example catalog apps list the resources it provisioned with the [`Assets` block](../../../../04.scalability/apps/index.md#assets-emitted-by-an-execution).

The catalog title, colors, and banner are configurable per tenant. Open **Instance Owner → Tenants**, find the tenant, and open its **Apps Catalog** page to customize them.

## Requests

The **Requests** screen shows the history of what has been requested through the Catalog — what was asked, by whom, with which inputs, and what state the request is in. Each request links to its underlying execution.

Requests give platform teams visibility into self-service activity without needing to navigate to the Executions screen.

## Deployments

**Deployments** are assets of type `io.kestra.plugin.ee.assets.Deployment`. They represent the resources provisioned through the Catalog — a VM, a database, a bucket.

Each deployment carries the standard asset lifecycle properties:

| Property | Field | Description |
|---|---|---|
| Status | `status` | Lifecycle state of the resource. Defaults to `active`. |
| Lease expiry | `ttl` | UTC instant at which the resource is considered expired. Format: `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`, or empty for no expiry. |
| Owner | `owner` | Who the resource belongs to. Conventionally `user:<id>` or `group:<id>`. |

Kestra stores these internally as `system.status`, `system.ttl`, and `system.owner` — those are the keys used in dashboard queries and filter expressions.

These properties appear as dedicated columns on the Deployments screen and support filtering by expiry bucket:

| Bucket | Description |
|---|---|
| `EXPIRING_7D` | Expires within 7 days |
| `EXPIRING_30D` | Expires within 30 days |
| `EXPIRED` | Past the expiry instant |
| `NO_EXPIRY` | No `ttl` set |

### TTL and lease

The **TTL & Lease** card on a deployment's page shows when its lease expires. If you can update assets in the deployment's namespace and the deployment isn't destroyed, you can change the expiry from the card:

1. Click the pencil icon next to **Expires**.
2. Choose **Keep current**, **No expiry**, a preset of 7, 30, 60, or 90 days from now, or **Pick a date and time**. A picked time uses the time zone from your [UI settings](../../../../../09.ui/06.settings/index.md) and defaults to 23:59:59 if you only pick a day. Past dates and times are disabled.
3. Click **Save**. A confirmation shows the new expiry.

Changing the expiry updates only the deployment's `ttl`, not the underlying infrastructure. To act on the resource when its lease is about to expire or has expired, attach a flow with **On expiring** or **On expired** on the same card. These flows use the [`TtlTrigger`](../../../01.assets/02.tasks-and-triggers/index.md#ttltrigger) and can apply to one deployment, to a namespace, or to every deployment in the tenant.

### Day-2 actions

Day-2 actions are flows attached to a deployment that can be run directly from its page. Common actions include resizing a resource or decommissioning it. The execution is stamped with the asset ID it was started from, linking it back to the deployment in the Deployments screen.

Attach day-2 actions to a deployment by declaring `assetActions` on the asset in `assets.outputs`. Each action names a flow by namespace and flow ID and provides a label for the button shown on the deployment's page. To limit when an action can run, or to run one through the API, see [Asset actions](../../../01.assets/01.declare-assets/index.md#asset-actions). For example:

```yaml
assets:
  outputs:
    - id: my-vm-001
      type: io.kestra.plugin.ee.assets.Deployment
      displayName: "VM my-vm-001"
      status: active
      assetActions:
        - namespace: infrastructure.examples
          flowId: resize_vm
          label: Resize
        - namespace: infrastructure.examples
          flowId: decommission_resource
          label: Decommission
```

## Inventory

**Inventory** is the broader asset list — all assets in the tenant, not just Deployment-typed ones. Use it to view and filter the full set of resources your workflows track, including tables, files, and any custom asset types your plugins emit.

Like Deployments, Inventory supports filtering by lease expiry bucket, owner, and status.

## Import an existing inventory

Import a Terraform state or a file of records to bring existing infrastructure into Kestra. Kestra creates one asset per resource and groups the resources under a single deployment, so they appear in Deployments and Inventory next to the resources your flows provision.

Importing requires permission to create assets in the target namespace, and to update any assets that already exist.

1. On the **Deployments** or **Inventory** page, click **Import**.
2. Drop a file in the upload area, or click it to select one:
   - Terraform state: `.tfstate`, `.backup`, or a `.json` state file
   - Table: `.csv` or `.tsv`
   - Records: `.json`, `.jsonl`, `.ndjson`, `.yaml`, or `.yml`
3. For a table or records file, review the **Id column**, **Name column**, and **Resource type column**. Kestra preselects them from the column names.
4. Review the **Deployment** name, which defaults to the file name. Optionally, choose a **Namespace**.
5. Review the preview, then click **Import**.

A confirmation shows how many assets were imported and into which deployment.

### How a file maps to assets

| Asset field | Terraform state | Table or records file |
|---|---|---|
| ID | `tf:<deployment>:<resource address>` | Value of the **Id column** |
| Display name | Resource address, for example `aws_instance.web` | Value of the **Name column**, or the ID |
| Type | Resource type in PascalCase, for example `AwsInstance` | Value of the **Resource type column** |
| Metadata | `provider` and `externalId` (the resource's `arn` or `id`) | Every other column |

A Terraform state imports one asset per instance of each managed resource. Data sources are skipped. The output of `terraform show -json` isn't accepted. Import the state file itself, for example the output of `terraform state pull`.

For a table or records file:

- A type that contains a dot, such as `com.example.VirtualMachine`, is used as is. Other values are converted to PascalCase, so `virtual_machine` becomes `VirtualMachine`. An empty value becomes `io.kestra.core.models.assets.External`.
- Characters in an ID other than letters, digits, `.`, `_`, `:`, and `-` are replaced with `-`, and IDs are capped at 150 characters. When this changes an ID, the original value is kept in the `externalId` metadata.
- Rows with an empty ID, or an ID already used earlier in the file, are skipped. The preview shows how many.
- Columns named `deployment` or starting with `system.` aren't imported as metadata.

Each imported resource gets a `deployment` metadata entry that links it to its deployment. The resources and the deployment also get a `system.source` value of `terraform`, `csv`, `json`, or `yaml`, shown in the **Source** column of Deployments and Inventory.

If you leave **Namespace** empty and the deployment already exists, new resources go into the deployment's namespace.

### Preview and re-import

Before anything is written, the preview labels each resource:

| Result | Meaning |
|---|---|
| **New** | No asset with this ID exists. Kestra creates it. |
| **Will be updated** | An asset with this ID already belongs to this deployment. Kestra updates its metadata with the file's values. |
| **Outside this deployment** | An asset with this ID exists but doesn't belong to this deployment. Kestra leaves it untouched. |

**Import** stays disabled when nothing would be created or updated.

When you re-import, an asset keeps its stored display name unless the file provides one through the **Name column**. An import can't change the namespace or the type of an existing asset, except to or from `External`. Kestra validates every resource before writing, so if any resource is invalid or locked, nothing is imported.

### Import through the API

The **Import** dialog calls the bulk asset endpoint, which you can also call directly in any tenant. It takes asset definitions as YAML documents separated by `---` and applies the same rules as the dialog. For example, this `assets.yaml` defines a deployment and one resource in it:

```yaml
id: web-prod
type: io.kestra.plugin.ee.assets.Deployment
namespace: company.infra
---
id: vm-web-01
type: VirtualMachine
namespace: company.infra
metadata:
  deployment: web-prod
  region: eu-west-1
```

Send the file with `dryRun=true` to preview the result without writing anything:

```bash
curl -X POST "https://kestra.example.com/api/v1/<tenant>/assets/bulk?dryRun=true" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/x-yaml" \
  --data-binary @assets.yaml
```

The response lists asset IDs under `created`, `updated`, and `skipped`, which match the preview's **New**, **Will be updated**, and **Outside this deployment**. To import, set `dryRun=false` or omit it.

## Asset lifecycle properties

The `status`, `ttl`, and `owner` fields are top-level properties on any asset declaration, not entries in the `metadata` map, and they apply to every asset type. See [Lifecycle fields](../../../01.assets/01.declare-assets/index.md#lifecycle-fields) for their formats and the `system.` keys used in queries.

Set lifecycle properties as top-level fields in a task's `assets.outputs` declaration:

```yaml
tasks:
  - id: provision
    type: io.kestra.plugin.scripts.shell.Commands
    commands:
      - ./provision.sh
    assets:
      outputs:
        - id: my-vm-001
          type: io.kestra.plugin.ee.assets.Deployment
          displayName: "VM my-vm-001"
          status: active
          ttl: "2025-12-31T23:59:59.999Z"
          owner: "user:anna"
```

Kestra rejects a `ttl` value that is not in the expected UTC format. An empty `ttl` means "no expiry".

## Example environment

When an Infrastructure tenant is created, Kestra seeds it with an example environment so the vertical opens with content rather than empty screens. The seed includes:

- A namespace (`infrastructure.examples`) with a description
- Flows: provisioning policy, allowed regions, VM provisioning, database/environment/bucket requests, resize, decommission, and a lease watchdog trigger
- Apps: four self-service catalog entries (provision VM, request database, environment, and bucket)
- A dashboard: Infrastructure Overview
- An [app template](../../../app-templates/index.md): **New application environment**, which creates a flow and the catalog app that runs it
- A bootstrap flow (`setup_demo_environment`) that runs once on creation to populate demo inventory

The bootstrap flow triggers one execution to populate the Inventory with example deployments. Nothing is fetched from the network. The bundle ships inside the JAR.

Example resources are tagged so they can be hidden in the Catalog using the **Hide examples** toggle.

### Seeding on type change

If a tenant is switched from `DEFAULT` to `INFRASTRUCTURE`, it is also seeded with the example bundle. An existing tenant that already received this bundle version is not seeded again. Later updates to the example bundle aren't applied to existing tenants. To see them, create a new tenant.

### Disabling example seeding

Set `kestra.ee.tenant-examples.enabled: false` in your Kestra configuration to disable example seeding globally. No namespace, flows, apps, dashboard, or bootstrap execution will be created when a tenant of a seeded type is created.

```yaml
kestra:
  ee:
    tenant-examples:
      enabled: false
```

## Create an Infrastructure tenant

1. Go to **Instance Owner → Tenants** and click **Create**.
2. Fill in the tenant **ID** and **Name**, then click **Next**.
3. On the **Type** step, select **Infrastructure** and click **Next**.
4. Complete the remaining steps (worker selector, storage, secrets) and click **Save**.

Kestra creates the tenant, seeds the example environment (unless disabled), and runs the bootstrap flow. Switch to the new tenant using the tenant switcher to see the Infrastructure vertical.

## Known limitations

The following capabilities are planned and not yet available:

- Auto-emission of assets by Terraform and cloud provider plugins. Declare those resources explicitly in tasks. Ansible and Helm tasks can [emit assets automatically](../../../01.assets/01.declare-assets/index.md#plugins-that-emit-assets).
