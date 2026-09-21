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
- **Automation**, **Infrastructure**, and **Tenant** sidebar groups remain below, giving access to flows, executions, namespaces, and all standard settings

Everything available in a `DEFAULT` tenant is still accessible. The Infrastructure layout surfaces the most relevant screens first.

## Catalog

The Catalog is the home page of an Infrastructure tenant. It shows the Apps available for users to request — for example, provisioning a VM, requesting a database, or creating a cloud bucket.

Each catalog entry is a Kestra [App](../../../../apps/index.md) visible to users with the appropriate RBAC. When a user submits a catalog form, it creates a Request and triggers the underlying flow.

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

### Day-2 actions

Day-2 actions are flows attached to a deployment that can be run directly from its page. Common actions include extending a lease, resizing a resource, or decommissioning it. The execution is stamped with the asset ID it was started from, linking it back to the deployment in the Deployments screen.

Attach day-2 actions to a deployment by declaring `assetActions` on the asset in `assets.outputs`. Each action names a flow by namespace and flow ID and provides a label for the button shown on the deployment's page:

```yaml
assets:
  outputs:
    - id: my-vm-001
      type: io.kestra.plugin.ee.assets.Deployment
      displayName: "VM my-vm-001"
      status: active
      assetActions:
        - namespace: infrastructure.examples
          flowId: extend_lease
          label: Extend lease
        - namespace: infrastructure.examples
          flowId: decommission_resource
          label: Decommission
```

## Inventory

**Inventory** is the broader asset list — all assets in the tenant, not just Deployment-typed ones. Use it to view and filter the full set of resources your workflows track, including tables, files, and any custom asset types your plugins emit.

Like Deployments, Inventory supports filtering by lease expiry bucket, owner, and status.

## Asset lifecycle properties

The `status`, `ttl`, and `owner` fields are top-level properties on any asset declaration — not entries in the `metadata` map. They apply to all asset types, not just Deployments. Kestra stores them internally under the `system.` prefix (`system.status`, `system.ttl`, `system.owner`), which is the form used in dashboard queries and filter expressions.

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
- Flows: provisioning policy, allowed regions, VM provisioning, database/environment/bucket requests, lease extension, resize, decommission, and a lease watchdog trigger
- Apps: four self-service catalog entries (provision VM, request database, environment, and bucket)
- A dashboard: Infrastructure Overview
- A bootstrap flow (`setup_demo_environment`) that runs once on creation to populate demo inventory

The bootstrap flow triggers one execution to populate the Inventory with example deployments. Nothing is fetched from the network. The bundle ships inside the JAR.

Example resources are tagged so they can be hidden in the Catalog using the **Hide examples** toggle.

### Seeding on type change

If a tenant is switched from `DEFAULT` to `INFRASTRUCTURE`, it is also seeded with the example bundle. An existing tenant that already received this bundle version is not seeded again.

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

- Auto-emission of assets by Terraform, Ansible, and cloud provider plugins. Assets must be declared explicitly in tasks.
- Declaring relationships between assets (for example, recording that a resource belongs to a deployment without a flow that reads one and writes the other).
- An App screen that shows the assets its execution produced.
- An import path for bringing existing infrastructure under management.
