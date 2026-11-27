---
title: "Set Up an Infrastructure Tenant in Kestra Enterprise"
h1: Set Up an Infrastructure Tenant
description: Create an Infrastructure tenant or switch an existing tenant to it, explore the example environment it ships with, and remove the examples when you're done.
sidebarTitle: Set Up an Infrastructure Tenant
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
version: ">= 2.1.0"
---

Create an Infrastructure tenant, or switch an existing tenant to the `INFRASTRUCTURE` type, to give its members the [self-service layout](../index.mdx).

## Prerequisites

- An Enterprise Edition license that includes Infrastructure tenants. Without it, the **Infrastructure** type is locked in the UI and the API rejects it. A tenant that is already of this type stays selectable.
- The Instance Owner role. Only an Instance Owner can create a tenant or change its type.

## Create an Infrastructure tenant

1. Go to **Instance Owner** → **Tenants** and click **Create**.
2. On **Tenant identity**, enter a **Name** and an **ID**, then click **Continue**.
3. On **Tenant type**, select **Infrastructure** and click **Continue**.
4. Complete **Worker & namespace**, **Internal storage**, **Secrets manager**, and **Retention policy**. The storage and secrets steps appear only when your license includes dedicated storage and secrets.
5. On **Review**, check the settings and click **Create**.

Switch to the new tenant with the tenant switcher. The Catalog opens as its home page.

To create the tenant through the API, add `"type": "INFRASTRUCTURE"` to the body of `POST /api/v1/tenants`:

```bash
curl -X POST "https://kestra.example.com/api/v1/tenants" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"id": "platform", "name": "Platform", "type": "INFRASTRUCTURE"}'
```

See [Tenants](../../07.enterprise/02.governance/tenants/index.md) for the other tenant settings.

## Switch an existing tenant

Open **Instance Owner** → **Tenants**, open the tenant's **Settings** page, and change its type to **Infrastructure**. The change applies to every member of the tenant on their next page load. Flows, apps, assets, and settings are kept. Only the home page and the sidebar change.

Switching the type seeds the [example environment](#example-environment) only if the tenant never received it. See [When examples are seeded](#when-examples-are-seeded).

## Example environment

A new Infrastructure tenant starts with a working example in the `infrastructure.examples` namespace, so the Catalog, Deployments, and Inventory aren't empty. Nothing is provisioned in a real cloud: the example flows only declare assets.

The example environment includes:

- Four catalog apps: **Provision a virtual machine**, **Request object storage**, **Request a database**, and **Request an environment**.
- The flows behind them, plus flows that price a request against a budget, list the regions allowed for a provider, register resources, and run the **Resize** and **Decommission** day-2 actions. A lease watchdog flow is included with its daily schedule disabled.
- An **Infrastructure overview** dashboard that charts deployments by environment, inventory by resource type, and resources by owner.
- An app template, **New application environment**. See [App templates](../05.app-templates/index.md).
- A `setup_demo_environment` flow that runs once to fill Deployments and Inventory with example deployments, some of them close to expiry or already expired.

The example bundle ships with Kestra, and nothing is fetched from the network. Seeding runs in the background and never blocks tenant creation.

The example request forms run small flows while you fill them in. The region list and the cost estimate on **Provision a virtual machine** come from the `allowed_regions` and `provisioning_policy` flows, so each form you open adds executions of those flows.

### Product tour

When the examples are present, the Catalog offers a guided tour of them. It walks through requesting a resource, following the request in its Gantt chart and on the Requests page, the flow behind the app, the Deployments list, the deployment's lease and inventory, its decommission action, and the dashboard. If you skip or leave the tour, select the tour entry at the bottom of the sidebar, such as **Resume tour**, to continue it.

### When examples are seeded

Kestra seeds the example environment when a tenant is created as, or switched to, `INFRASTRUCTURE` and never received the examples. After that, a type switch never seeds the tenant again, whatever the version of the example bundle, and removed examples stay removed.

To add the examples on purpose, open the tenant's **Settings** page and click **Add examples** next to **Example resources**. It seeds the current version of the example bundle on a tenant that doesn't have the examples. Only the Instance Owner can add examples. Through the API, call `POST /api/v1/tenants/{id}/examples`.

To get a newer version of the example bundle on a tenant that has the examples, [remove them](#remove-the-example-environment), then add them again. Any change you made to the example flows is lost.

Kestra doesn't seed the examples when:

- Your license doesn't include both Apps and Assets. The tenant is created empty, and the server logs a warning.
- Seeding is turned off in the configuration.

A tenant skipped for one of these reasons never received the examples. Once the cause is fixed, **Add examples** or a later switch to `INFRASTRUCTURE` seeds it.

To turn off seeding for every tenant, set `kestra.ee.tenant-examples.enabled` to `false`:

```yaml
kestra:
  ee:
    tenant-examples:
      enabled: false
```

## Remove the example environment

A banner on the Catalog, Deployments, and Inventory pages counts the example resources. Click **Remove examples** in the banner, or **Remove** next to **Example resources** on the tenant's settings page, and confirm.

Removing the examples deletes:

- Every app, flow, and asset in the `infrastructure.examples` namespace, including any you created there yourself.
- The example dashboard and the example app template.
- The `setup_demo_environment` execution and the examples' asset usage records.
- The `infrastructure.examples` namespace.

:::alert{type="warning"}
Removal also deletes anything you created in `infrastructure.examples`, and it can't be undone.
:::

Removal is available once the `setup_demo_environment` execution ends. Until then, Kestra refuses it with "The example setup run is still running. Try again once it ends."

The banner and the action are available to the Instance Owner, and to members who can delete flows, apps, dashboards, assets, namespaces, and executions in `infrastructure.examples`. Through the API, call `DELETE /api/v1/tenants/{id}/examples`.

Removed examples stay removed: switching the tenant's type doesn't seed them again. To bring them back, click **Add examples** on the tenant's settings page. The product tour needs the examples, so the sidebar shows no tour entry while they're absent. The entry returns once you add them again.

To hide the examples without deleting them, turn on **Hide examples** on the Catalog, Deployments, or Inventory page. Your browser remembers the setting.
