---
title: "Reusable Inputs in Kestra Enterprise"
h1: Reusable Inputs
sidebarTitle: Reusable Inputs
description: Define a named input group once at the namespace level and reference it across multiple flows to eliminate duplicated input declarations.
icon: /src/contents/docs/icons/flow.svg
editions: ["EE", "Cloud"]
---

Reusable inputs let you define a named group of typed inputs once at the namespace level and reference them in any flow.

## Define a reusable input set

Open the namespace where you want the reusable input set to live, select the **Reusable Inputs** tab, and click **Create**. Give the set an `id`, an optional description, and declare the inputs the same way you would in a flow.

```yaml
id: ad_credentials
namespace: company.team
description: Active Directory credentials required by provisioning flows.
inputs:
  - id: username
    type: STRING
    required: true
    displayName: AD Username

  - id: domain
    type: SELECT
    required: true
    values:
      - corp.example.com
      - eu.example.com

  - id: password
    type: SECRET
    required: true
    displayName: AD Password
```

The set's `id` must start with a letter or digit and may contain letters, digits, dots, hyphens, and underscores. All flow input types are valid inside a set, including `FORM` groups.

Each time you save, Kestra stores a new revision.

## Reference a set in a flow

Add an input of `type: REUSABLE_INPUTS` to any flow and set `ref` to the set's `id`. Kestra inlines each child input before the execution starts, prefixing its id with the reference id (`<refId>.<childId>`).

```yaml
id: provision_ad_account
namespace: company.team

inputs:
  - id: environment
    type: SELECT
    values: [staging, production]

  - id: ad
    type: REUSABLE_INPUTS
    ref: ad_credentials

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: |
      User: {{ inputs.ad.username }}
      Domain: {{ inputs.ad.domain }}
```

The set expands into three inputs — `ad.username`, `ad.domain`, and `ad.password` — available alongside `environment` in the execution form.

### Access input values

Reference each child input as `{{ inputs.<refId>.<childId> }}`, where `refId` is the `id` of the `REUSABLE_INPUTS` input in the flow and `childId` is the `id` from the set definition.

```twig
{{ inputs.ad.username }}
{{ inputs.ad.domain }}
{{ inputs.ad.password }}
```

## Set properties

| Property | Required | Description |
| --- | --- | --- |
| `ref` | Yes | The `id` of the reusable input set to include. |
| `namespace` | No | Namespace where the set is defined. Defaults to the flow's own namespace. Resolution walks the hierarchy — a set in a parent namespace is available to child namespaces. |
| `revision` | No | Integer revision to pin. Omit to use the latest revision at execution time. |

### Pin a specific revision

To lock a flow to a particular version of a set — for example, to avoid pulling in a breaking change before your team has reviewed it — set `revision`:

```yaml
inputs:
  - id: ad
    type: REUSABLE_INPUTS
    ref: ad_credentials
    revision: 3
```

Omit `revision` to always resolve the latest published revision when the execution starts.

### Use a set from a parent namespace

A set defined in `company` is available to any flow in `company`, `company.team`, `company.team.infra`, and any other descendant namespace. If a child namespace defines a set with the same `id`, the child's definition takes precedence over the parent's. To use a set from a different branch of the hierarchy, set `namespace` explicitly:

```yaml
inputs:
  - id: ad
    type: REUSABLE_INPUTS
    ref: ad_credentials
    namespace: company
```

## RBAC

The `REUSABLE_INPUTS` resource controls who can manage reusable input sets. Flows that reference a set require only normal flow-execution permissions — the expansion happens server-side before the execution form is rendered.

| Role | Permissions |
| --- | --- |
| Viewer | View, list |
| Launcher | View, list |
| Editor | View, list, create, update, delete |
| Admin | All actions |

## Validation

Kestra does not check whether a referenced set exists at flow save time — the existence check runs at execution creation. If the set is missing, execution creation fails with an error naming the missing set and the namespace hierarchy that was searched.

A reusable input set's inputs are expanded in a single pass. If a set's inputs list contains a `REUSABLE_INPUTS` entry, that nested reference is not recursively expanded and the execution form will fail to render it correctly. Keep set definitions flat.
