---
title: "App Templates in Kestra: Self-Service Flows and Apps"
h1: Create a Flow and Its App from One Template
description: Understand how app templates create a flow and the app that runs it in one step. Learn to write, use, and manage templates for a self-service catalog.
sidebarTitle: App Templates
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
version: ">= 2.1.0"
---

<!-- TODO(naming): the UI labels this feature "Templates"; the API uses "app templates"; kestra-ee#9856 calls it "provisioning templates". Confirm the name with PM before publishing. -->
<!-- TODO(editions): Custom Blueprints is ["EE", "Cloud"]. Confirm whether app templates ship on Cloud. -->

An app template creates a flow and the [app](../../04.scalability/apps/index.md) that runs it, in a namespace chosen when the template is used.

Platform teams write a template once and decide what is fixed: the repository a service is scaffolded from, the database version, or the regions a team may pick. Whoever uses the template answers a short set of arguments, reviews both resources, and Kestra creates them. The app is usually published to the [App Catalog](../../04.scalability/apps/index.md#app-catalog), so other teams can request the resource from a form.

## App templates and Custom Blueprints

App templates build on [Templated Blueprints](../custom-blueprints/index.md#templated-blueprints) and use the same templating syntax, but they produce more than a flow.

| | Custom Blueprint | App template |
|---|---|---|
| Creates | One flow | One flow and the app that runs it |
| Namespace | Part of the flow source | Chosen when the template is used |
| Where to find it | **Blueprints** → **Custom Blueprints** | **Templates** in the left sidebar |
| Typical result | A flow you keep editing | A catalog entry other teams can request |

Use a Custom Blueprint when you want a starting point for a single flow. Use an app template when the goal is a self-service form backed by a flow.

App templates don't appear under **Blueprints** → **App Blueprints**. They're listed only on the **Templates** page.

## Find app templates

Open **Templates** in the left sidebar. In an [Infrastructure tenant](../tenants/types/infrastructure/index.md), it is the first entry in the **Automation** group.

<!-- TODO(verify): the UI code also adds Templates to the Workspace group of DEFAULT tenants (no tenant-type check in useLeftMenu.ts). Confirm on a 2.1 RC whether it appears outside Infrastructure tenants, then update this section. -->

The entry appears when your license includes Custom Blueprints and you hold at least one `BLUEPRINT` permission. Each template card shows its title, description, argument count, and tags, with **Edit** and **Use** actions.

An Infrastructure tenant includes an example template, **New application environment**. Its arguments fix the scaffolding repository, the database engine and version, and the sizes and regions teams may request. Using it creates a demo flow and publishes its request form to the catalog.

## Template structure

A template has four parts, each edited in its own panel:

- **Details**: the title (required), description, tags, and arguments
- **Flow**: the source of the flow to create
- **App**: the source of the app to create
- **Syntax Helper**: a reference for the templating syntax

### Arguments

Arguments are the questions answered once, by whoever uses the template. They support every Kestra [input type](../../../05.workflow-components/05.inputs/index.md), its validation rules, and `dependsOn` conditions. Edit them with the **Form** view, or switch to **YAML** and write them as a list:

```yaml
- id: name
  type: STRING
  displayName: Name
  defaults: my-service
- id: allowed_regions
  type: MULTISELECT
  displayName: Regions teams may request
  values:
    - eu-west-1
    - eu-central-1
    - us-east-1
  defaults:
    - eu-west-1
```

Unlike a Templated Blueprint, a template does not wrap its arguments in `extend.templateArguments`. The list is the whole declaration.

### Flow and app sources

The flow and app sources reference arguments with `<< arg.<id> >>`, and support the same [loops and conditions](../custom-blueprints/index.md#loops-and-conditions) as Templated Blueprints. Kestra expressions such as `{{ inputs.size }}` are left untouched and evaluated when the flow runs.

This flow takes the allowed regions from the template arguments and asks the requester to pick one at execution time:

```yaml
id: << arg.name >>-provision
description: Provisions << arg.name >>.

inputs:
  - id: region
    type: SELECT
    displayName: Region
    values: << arg.allowed_regions >>

tasks:
  - id: provision
    type: io.kestra.plugin.core.log.Log
    message: "Provisioning << arg.name >> in {{ inputs.region }}"
```

The matching app publishes a request form to the catalog:

```yaml
id: << arg.name >>-request
type: io.kestra.plugin.ee.apps.Execution
displayName: Request << arg.name >>
access:
  type: PRIVATE
  catalog: true
layout:
  - on: OPEN
    blocks:
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionForm
      - type: io.kestra.plugin.ee.apps.execution.blocks.CreateExecutionButton
        text: Request
  - on: RUNNING
    blocks:
      - type: io.kestra.plugin.ee.apps.execution.blocks.Logs
```

Neither source declares a `namespace`, and the app does not declare a `flowId`. Kestra adds both when the template is used:

- `namespace` is the namespace chosen in the **Use** dialog, applied to the flow and the app.
- The app's `flowId` is the `id` of the flow created from the same template.

Kestra reports a problem during review if a source breaks one of these rules:

- The flow or the app declares a `namespace`.
- The app declares a `flowId`, or the flow has no `id` for the app to reference.
- A source renders as more than one YAML document.
- A flow with the same `id` already exists in the namespace, or an app with the same `id` already exists.

## Create a template

You need the `BLUEPRINT` `CREATE` permission.

1. Open **Templates** in the left sidebar.
2. Start the template one of two ways:
   - Click **New template** to start from a working example with a `name` argument, a flow, and an app.
   - Click **From a flow**, select a namespace and a flow, and click **Create the template**. Kestra copies the flow as it is, turns its `id` into a `name` argument, and generates an app that runs it.
3. In **Details**, enter a title and declare the arguments.
4. Edit the **Flow** and **App** panels.
5. Click **Save**.

The template appears in the **Templates** list. To change it later, click **Edit** on its card. Save your changes before you use the template; **Use** is disabled while the template has unsaved changes.

## Use a template

Using a template creates the flow first, then the app. You need the `BLUEPRINT` `VIEW` permission, and the `FLOW` `CREATE` and `APP` `CREATE` permissions on the target namespace.

1. On the template card, click **Use**.
2. In the **Arguments** step, select the namespace where both resources are created. The list shows only namespaces where you can create flows and apps.
3. Answer the arguments, then click **Next**.
4. In the **Review** step, check the rendered **Flow** and **App** tabs. Each tab lists the problems that block creation. Edit a source to fix them; the edited source is validated again when you click **Create**.
5. Click **Create**.

The **Created** step reports each resource with a link to open it. When the app is created, click **Open the catalog** to see the new entry.

If the app fails to be created after the flow succeeds, click **Back to review**, fix the app source, and click **Create** again. The flow that was already created is kept and is not created twice.

Kestra creates each resource through the same endpoints as the flow and app editors, so namespace permissions and [Policies](../policies/index.md) apply as usual.

## Permissions

App templates use the [`BLUEPRINT` permission](../../03.auth/rbac/permissions-reference/index.md), granted globally for the tenant:

| Action | Requires |
|---|---|
| Browse templates | `BLUEPRINT` `LIST` |
| Open a template | `BLUEPRINT` `VIEW` |
| Create a template | `BLUEPRINT` `CREATE` |
| Edit a template | `BLUEPRINT` `UPDATE` |
| Delete a template | `BLUEPRINT` `DELETE` |
| Use a template | `BLUEPRINT` `VIEW`, plus `FLOW` `CREATE` and `APP` `CREATE` on the target namespace |

The created app follows the usual [app access rules](../../04.scalability/apps/index.md#app-access-and-rbac-permissions). For example, a `PRIVATE` app is visible in the catalog only to users with `APP` `EXECUTE` on its namespace.

## Manage templates with the API

Every action in the UI is available through the REST API under `/api/v1/{tenant}/app-templates`:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/app-templates` | Search templates |
| `POST` | `/app-templates` | Create a template |
| `GET` | `/app-templates/{id}` | Retrieve a template |
| `PUT` | `/app-templates/{id}` | Update a template |
| `DELETE` | `/app-templates/{id}` | Delete a template |
| `POST` | `/app-templates/{id}/validate` | Resolve argument values, including `dependsOn` conditions |
| `POST` | `/app-templates/{id}/render` | Render the flow and app for a namespace and report problems |

A template body holds `title`, `description`, `tags`, `arguments`, `flow`, and `app`. The `flow` and `app` fields are YAML strings.

The `render` endpoint takes a `namespace` and `argumentValues`, and returns each rendered source with its problems. It does not create anything. To create the resources from a script, render the template, then send the rendered flow to the flow creation endpoint and the rendered app to the app creation endpoint, in that order.

<!-- TODO(verify): Git sync for Custom Blueprints (custom-blueprints page, "Version control for Custom Blueprints") filters repository queries to flow blueprints after this change; app templates are probably not pushed or synced. Test on a 2.1 RC before documenting either way. -->
<!-- TODO(screenshots, 2.1 RC): Templates list (tour panel closed), template editor with Details/Flow/App panels, Use dialog Review step. -->
