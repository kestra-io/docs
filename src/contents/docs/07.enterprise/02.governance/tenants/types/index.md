---
title: "Tenant Types in Kestra Enterprise"
h1: Tenant Types
description: Choose a tenant type to tailor the Kestra UI and navigation to your team's primary use case.
sidebarTitle: Tenant Types
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
---

import ChildCard from "~/components/docs/ChildCard.astro"

A tenant type determines the home page, sidebar layout, and vocabulary presented to everyone inside that tenant.

The engine, API, and data model are identical across types. Flows, executions, namespaces, and assets remain available. The type is a presentation layer that surfaces the features most relevant to a team's primary use case, without hiding anything else.

## Available types

| Type | Home page | Primary use case |
|---|---|---|
| `DEFAULT` | Dashboards | General-purpose workflow orchestration |
| `INFRASTRUCTURE` | Catalog | Infrastructure self-service and day-2 operations |

**`DEFAULT`** is the standard Kestra experience. Every feature is visible and the navigation is unchanged. This is the type assigned to every tenant unless you choose otherwise.

**`INFRASTRUCTURE`** replaces the home page with a Catalog of self-service requests and groups Catalog, Requests, Deployments, Inventory, Cases, and Dashboards under a Self-Service section in the sidebar. The standard Automation, Infrastructure, and Tenant sections remain below it.

Neither type removes any functionality. The type can be changed at any time in tenant settings, and members see the updated navigation on their next page load.

## Where to set the type

### During tenant creation

The tenant creation wizard includes a **Type** step. Select either `DEFAULT` or `INFRASTRUCTURE`, review the summary, and continue. The type is shown in the final review step before the tenant is saved.

### In tenant settings

Open **Instance Owner → Tenants**, find the tenant, and open its **Settings** page. The tenant type is editable there. Members see a re-ordered navigation and a new home page on their next load after the change.

### In the tenants list

The **Instance Owner → Tenants** list includes a **Tenant type** column with a colored badge for each tenant. Use it to identify tenant types at a glance.

### In the tenant switcher

Infrastructure tenants are visually distinct in the tenant switcher (bottom-left of the UI), making it easy to spot them when switching contexts.

## Explore types

<ChildCard />
