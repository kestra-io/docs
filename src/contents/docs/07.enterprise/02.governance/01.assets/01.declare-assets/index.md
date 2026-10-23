---
title: "Declare Assets on Tasks: Reference for Kestra"
h1: Asset Declaration Reference
description: Reference for the Kestra task `assets` property, asset fields and identity, built-in asset types, plugins that emit assets automatically, script-based emission, and failure behavior.
sidebarTitle: Declare Assets
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 1.2.0"
---

This reference describes the `assets` property you add to a task, the fields of an asset, and the ways a task can register assets.

For what assets are and when to use them, see [Assets](../index.md). For triggers, tasks, and functions that act on assets, see the [asset tasks and triggers reference](../02.tasks-and-triggers/index.md).

## The `assets` property

Every task accepts an `assets` property:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `inputs` | List of asset references | — | Assets the task reads. Each entry needs an `id`. Add `type` to type an asset that doesn't exist yet. |
| `outputs` | List of assets | — | Assets the task creates or updates. Each entry needs an `id` and a `type`. |
| `enableAuto` | Boolean | `false` | Accept assets emitted by the plugin or by script log lines. See [Automatic emission](#automatic-emission). |
| `assetFailureBehavior` | `WARN`, `FAIL`, or `IGNORE` | `WARN` | What happens to the task state when an asset can't be written. See [Failure behavior](#failure-behavior). |

Asset declarations are an Enterprise Edition feature. In the open-source edition, a flow with an `assets` property fails validation with the message `assets are only available in Enterprise Edition`.

## Declare inputs and outputs

This flow loads raw orders into a reporting table. The task reads `raw.orders` and writes `analytics.orders_daily`:

```yaml
id: build_orders_daily
namespace: company.data

tasks:
  - id: build_table
    type: io.kestra.plugin.jdbc.postgresql.Queries
    url: jdbc:postgresql://postgres:5432/analytics
    username: "{{ secret('POSTGRES_USER') }}"
    password: "{{ secret('POSTGRES_PASSWORD') }}"
    sql: |
      CREATE TABLE IF NOT EXISTS analytics.orders_daily AS
      SELECT order_date, count(*) AS orders, sum(amount) AS revenue
      FROM raw.orders
      GROUP BY order_date;
    assets:
      inputs:
        - id: raw.orders
      outputs:
        - id: analytics.orders_daily
          namespace: company.data
          type: io.kestra.plugin.ee.assets.Table
          displayName: Daily orders
          description: One row per day with order count and revenue.
          metadata:
            system: postgres
            database: analytics
            schema: analytics
            name: orders_daily
            owner: data-team
```

When `build_table` finishes:

- If the task succeeded, Kestra creates `analytics.orders_daily`, or updates it if it exists.
- If `raw.orders` doesn't exist, Kestra creates it as an `io.kestra.core.models.assets.External` placeholder in `company.data`.
- Kestra records lineage from `raw.orders` to `analytics.orders_daily`, from `raw.orders` to the flow, and from the flow to `analytics.orders_daily`.
- Kestra records a usage entry for both assets on this execution.

### Rendering and task outputs

Kestra renders the `assets` block after the task finishes, so expressions in it can read the task's own outputs with `outputs.<task_id>.<output>`. Use this when the resource name is only known at runtime:

```yaml
- id: download
  type: io.kestra.plugin.core.http.Download
  uri: https://example.com/exports/latest.csv
  assets:
    outputs:
      - id: "exports.{{ execution.startDate | date('yyyyMMdd') }}"
        type: io.kestra.plugin.ee.assets.File
        metadata:
          path: "{{ outputs.download.uri }}"
```

If an expression in `inputs` can't be rendered, Kestra still processes `outputs`, and the reverse.

### What happens when a task fails

When a task ends in `FAILED`, Kestra records lineage and usage for its inputs and outputs, and still creates placeholders for unknown inputs, but doesn't create or update its output assets. A failed run never overwrites an asset's metadata or `updated` timestamp.

A task with `allowFailure: true` that fails ends in `WARNING` instead, so Kestra writes its output assets.

## Asset fields

An asset in `outputs` has these fields:

| Field | Required | Description |
| --- | --- | --- |
| `id` | Yes | Unique within the tenant. Starts with a letter or digit, then letters, digits, `.`, `_`, `:`, or `-`. Up to 150 characters. |
| `type` | Yes | A [built-in type](#built-in-asset-types) or any custom string. |
| `namespace` | No | Namespace the asset belongs to, used for filtering and access control. Lowercase letters, digits, `.`, `_`, and `-`. See [Namespace and Global assets](#namespace-and-global-assets). |
| `displayName` | No | Human-readable name shown in the UI |
| `description` | No | Markdown description |
| `metadata` | No | Map of custom key-value pairs |

Any other key you add to an output entry is stored in `metadata`. For example, `system: postgres` at the top level of the entry and `metadata.system: postgres` produce the same asset.

### Lifecycle fields

Three more top-level fields describe a resource's lifecycle. Set them directly on the output entry, not inside `metadata`:

| Field | Description |
| --- | --- |
| `status` | Lifecycle state of the resource, as any string. Defaults to `active` when absent. |
| `ttl` | Lease expiry as a UTC instant with milliseconds: `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`. An empty value means no expiry. Any other format is rejected. |
| `owner` | Who the resource belongs to. Conventionally `user:<id>` or `group:<id>`. |

Kestra stores these as `system.status`, `system.ttl`, and `system.owner`. Use those keys in dashboard queries and filter expressions. The fields apply to every asset type.

```yaml
outputs:
  - id: staging-cluster-eu
    type: io.kestra.plugin.ee.assets.VM
    status: active
    ttl: "2026-12-01T00:00:00.000Z"
    owner: group:platform
```

To act before or after `ttl` passes, use a [`TtlTrigger`](../02.tasks-and-triggers/index.md#ttltrigger).

### Identity

Kestra identifies an asset by its `id` within a tenant. The namespace and the type aren't part of the identity. Two declarations with the same `id` always refer to the same asset, even in different namespaces or flows.

### Update rules

When a task writes an asset that already exists, Kestra merges the new declaration into the stored asset:

| Field | Rule |
| --- | --- |
| `type` | The declared type replaces the stored one. An `External` placeholder never replaces a real type. |
| `namespace` | A declared namespace replaces the stored one. An omitted namespace keeps the stored one. |
| `displayName`, `description` | A declared value replaces the stored one. An omitted value keeps the stored one. |
| `metadata` | Merged key by key. Declared keys replace stored keys. Keys you don't declare are kept. A flow can't remove a key; to remove one, edit the asset in the UI or through the API. |
| `partOf` | A declared parent replaces the stored one. An omitted `partOf` keeps the stored parent. |
| `related` | Declared relations are added. Removing an entry from the list doesn't remove the relation; remove it through the API. |
| `assetActions` | A declared list replaces the stored list. An omitted list keeps the stored one. |

Each write updates the asset's `updated` timestamp and emits an `UPDATED` event, even when no field changed.

### Namespace and Global assets

The namespace controls who can see and change an asset. Users with namespace-scoped `ASSET` permissions only see assets in the namespaces they have access to.

An asset without a namespace is a Global asset. Namespace-level access control doesn't apply to Global assets: any user with an `ASSET` permission in the tenant can see them. Use Global assets for resources that every namespace should be able to reference.

How the namespace is set depends on where the asset comes from:

| Source | Namespace when you omit it |
| --- | --- |
| New asset in `outputs` | None. The asset is created as a Global asset. |
| Existing asset in `outputs` | The stored namespace is kept. |
| Placeholder created from `inputs` | The namespace of the flow that references it. |
| New asset emitted by a plugin | None. Plugins emit assets without a namespace, so they're created as Global assets. |

A flow can't send an explicit empty namespace. Omitting `namespace` on a new output is the only way to create a Global asset from a flow.

### Cross-namespace writes

When a flow writes an asset in another namespace, Kestra checks that the flow's namespace is allowed to access the target namespace. The check applies to the asset's current namespace and, when it changes, to the new one. It also applies when a typed input retypes an existing asset. If the check fails, the write is rejected and the [failure behavior](#failure-behavior) applies.

Namespaces allow all others by default, so the check only blocks a write when the target namespace restricts its [allowed namespaces](../../07.namespace-management/index.md#allowed-namespaces). To allow the write, add the flow's namespace to that list. Global assets aren't checked.

### Typed inputs

An input entry can include a `type`. If the asset doesn't exist yet, Kestra creates it with that type instead of `External`. If it exists with another type, Kestra changes its type, subject to locks and the [cross-namespace check](#cross-namespace-writes).

```yaml
assets:
  inputs:
    - id: warehouse.raw.customers
      type: io.kestra.plugin.ee.assets.Table
```

## Relate assets

Lineage edges come from what tasks read and write. To record other connections, add `partOf` and `related` to an output asset:

| Field | Description |
| --- | --- |
| `partOf` | One parent asset, such as the deployment a VM belongs to. Creates a **Part of** relation. |
| `related` | Up to 50 assets connected without a direction, such as a VM and its load balancer. Creates **Related** relations. |

Each entry takes an `id`, an optional `namespace`, and an optional `role` of up to 100 characters that describes the connection:

```yaml
outputs:
  - id: web-01
    type: io.kestra.plugin.ee.assets.VM
    partOf:
      id: deploy-prod-eu
      role: primary
    related:
      - id: lb-prod-eu
        role: backend
```

The parent shows **web-01** under **Parts**, and the dependencies graph draws **Part of** and **Related** edges. To change relations without a flow, or to remove them, use the [relations API](../03.manage-assets/index.md#relations).

## Asset actions

Asset actions attach flows to an asset so users can run them from the asset's page, for example to resize or decommission a resource. Declare them with `assetActions` on an output asset. Each action names a flow by `namespace` and `flowId`, with an optional button `label`:

```yaml
outputs:
  - id: web-01
    type: io.kestra.plugin.ee.assets.VM
    status: active
    assetActions:
      - namespace: company.infra
        flowId: resize_vm
        label: Resize
      - namespace: company.infra
        flowId: decommission_vm
        label: Decommission
        when:
          - field: status
            operator: EQUAL_TO
            value: active
      - namespace: company.infra
        flowId: scale_cluster
        label: Scale up
        when:
          - field: metadata.nodeCount
            operator: LESS_THAN_OR_EQUAL_TO
            value: 2
```

An action can carry up to 20 `when` conditions. Kestra offers the action and lets it run only while all of them hold, and an action without conditions is always offered. Each condition has a `field`, an `operator`, and a `value`.

A condition reads one of the asset's fields: `id`, `namespace`, `type`, `displayName`, `description`, `status`, `ttl`, `owner`, or a metadata key as `metadata.<key>`. Use a dotted path such as `metadata.network.zone` for a nested key.

The operators are `EQUAL_TO`, `NOT_EQUAL_TO`, `IN`, `NOT_IN`, `CONTAINS`, `NOT_CONTAINS`, `STARTS_WITH`, `ENDS_WITH`, `PREFIX`, `REGEX`, `GREATER_THAN`, `GREATER_THAN_OR_EQUAL_TO`, `LESS_THAN`, `LESS_THAN_OR_EQUAL_TO`, `IS_NULL`, and `IS_NOT_NULL`. `IN` and `NOT_IN` take a list as `value`, and `IS_NULL` and `IS_NOT_NULL` take no `value`. Text operators compare values as strings and are case-sensitive. The `GREATER_THAN` and `LESS_THAN` operators and their `_OR_EQUAL_TO` variants compare numbers and dates by value. Write dates in ISO 8601, either as a plain date or as a date-time with an offset, such as `2026-12-31T00:00:00Z`.

A field the asset doesn't have, or an empty one, counts as unset, so `NOT_EQUAL_TO`, `NOT_IN`, and `NOT_CONTAINS` hold on it. An asset without a `status` counts as `active`. An asset can have up to 100 actions. To add actions or edit their conditions in the UI, see [Manage assets](../03.manage-assets/index.md#asset-detail-page).

Running an action starts an execution of its flow with the labels `system.from: asset` and `system.assetId: <asset id>`. The asset ID isn't passed as an input, so read it from the labels or pass inputs when you run the action [through the API](../03.manage-assets/index.md#automate-with-the-api). In an Infrastructure tenant, actions appear as [day-2 actions](../../tenants/types/infrastructure/index.md#day-2-actions) on a deployment's page.

## Built-in asset types

| Type | Common metadata keys |
| --- | --- |
| `io.kestra.plugin.ee.assets.Table` | `system`, `database`, `schema`, `name` |
| `io.kestra.plugin.ee.assets.Dataset` | `system`, `location`, `format` |
| `io.kestra.plugin.ee.assets.File` | `system`, `path` |
| `io.kestra.plugin.ee.assets.VM` | `provider`, `region`, `state` |
| `io.kestra.plugin.ee.assets.Deployment` | None. Groups the resources of one provisioned environment, which point to it with `partOf`. The default type for [`TtlTrigger`](../02.tasks-and-triggers/index.md#ttltrigger), and the type the [Infrastructure tenant](../../tenants/types/infrastructure/index.md) lists under **Deployments**. |
| `io.kestra.core.models.assets.External` | None. Placeholder only: Kestra assigns it to assets created from untyped inputs. You can't declare it as a type. |

The metadata keys are conventions. Kestra stores them in `metadata` like any other key, and the [dependencies graph](../03.manage-assets/index.md#explore-the-dependencies-graph) uses `system` and `schema` for grouping.

You can also use any custom string as a type, such as `AWS_BUCKET` or `company.infra.LoadBalancer`. Custom types behave like built-in types, except that no plugin emits them unless the plugin defines them. Some plugins define their own types, for example `io.kestra.plugin.ee.assets.HelmRelease`.

## Automatic emission

Some plugins detect the resources a task reads and writes and emit assets themselves. Script tasks can do the same by printing a special log line. In both cases, set `assets.enableAuto: true` on the task. Without it, Kestra discards emitted assets.

:::alert{type="warning"}
Some plugins log that they emitted assets even when `enableAuto` is off, while Kestra records nothing. If a task logs asset emission but no asset appears, check that the task has `assets.enableAuto: true`.
:::

Plugins emit assets without a namespace, so a new emitted asset is a [Global asset](#namespace-and-global-assets). To move it into a namespace, declare the same ID in a task's `outputs` with a `namespace`. Later emissions keep that namespace.

Emitted assets and declared assets combine. You can turn on `enableAuto` and also declare `inputs` or `outputs`, for example to connect a plugin's outputs to upstream assets the plugin can't see.

### Plugins that emit assets

| Plugin and tasks | Emits | Asset IDs |
| --- | --- | --- |
| JDBC `Query` and `Queries` (all databases) | One `Table` output per `CREATE TABLE` statement. `Query` emits at most one. No inputs. | `<database>.<table>`. The schema isn't part of the ID. |
| dbt `DbtCLI`, dbt Cloud `CheckStatus`, and dbt Cloud `TriggerRun` when `wait` is `true` | One `Table` output per model, seed, and snapshot, with its parents and sources as `Table` inputs. Adds test results as `dbtTestStatus` (`pass`, `fail`, or `warn`), `dbtTestsTotal`, and `dbtTestsFailed` when `parseRunResults` is `true`. | `<database>.<schema>.<name>` |
| Fivetran `connectors.Sync` and `connectors.Status` | One `Dataset` output per connector schema and one `Table` output per enabled table | Tables: `<database>.<schema>.<table>` |
| Google Cloud BigQuery `RunTransferConfig` | One `Table` output for the destination table, or one `Dataset` output when the table isn't fixed. Emitted only after a successful run. | `<project>.<dataset>.<table>` or `<project>.<dataset>` |
| Hex `projects.Run` | One `Dataset` output for the project, with `system: hex`. No inputs. | The `projectId` |
| Qlik Cloud `apps.Reload` | One `io.kestra.plugin.qlikcloud.assets.App` output for the reloaded app. Set the task's `emitAssets` to `false` to turn this off. | The app ID |
| Ansible `AnsibleCLI` | One `VM` input per host in an INI inventory file named exactly `inventory.ini` at the working directory root | The host name |
| Helm `Upgrade`, `Rollback`, `Status`, and `Uninstall` | One `io.kestra.plugin.ee.assets.HelmRelease` output, with the chart and `valuesFrom` files as inputs, plus one `io.kestra.plugin.ee.assets.KubernetesResource` per managed resource. `Uninstall` deletes these assets. | Built from the cluster, Kubernetes namespace, and release name |

dbt and Fivetran use the same `<database>.<schema>.<table>` ID format, so a Fivetran table and the dbt source that reads it join into one lineage chain. JDBC IDs leave out the schema, so they don't join with dbt or Fivetran IDs. To connect them, declare the matching IDs yourself.

Plugins that only emit outputs, such as Hex and Qlik Cloud, can't see their upstream tables. Declare `assets.inputs` on those tasks with the IDs the upstream plugins emit:

```yaml
- id: reload_dashboard
  type: io.kestra.plugin.qlikcloud.apps.Reload
  tenantUrl: https://mytenant.eu.qlikcloud.com
  apiKey: "{{ secret('QLIK_API_KEY') }}"
  appId: 60f2e3b1a1b2c3d4e5f6a7b8
  assets:
    enableAuto: true
    inputs:
      - id: analytics.marts.fct_orders
        type: io.kestra.plugin.ee.assets.Table
```

For each plugin's properties, see its page in the [plugin catalog](/plugins). For a complete dbt example, see [Track lineage across a dbt pipeline](../../../../15.how-to-guides/asset-lineage-dbt/index.md).

### Emit assets from a script

A script task can emit assets by printing a line in this format to standard output:

```plaintext
::{"assets": {"inputs": [{"id": "<input id>"}], "outputs": [{"id": "<output id>", "type": "<type>"}]}}::
```

The task must have `assets.enableAuto: true`. Each output entry accepts the same [fields](#asset-fields) as a declared output.

This Shell task writes a CSV export and emits it as an asset that reads from `crm.contacts`:

```yaml
id: export_contacts
namespace: company.data

tasks:
  - id: export
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    outputFiles:
      - contacts.csv
    commands:
      - printf 'id,email\n1,ada@example.com\n' > contacts.csv
      - |
        echo '::{"assets": {"inputs": [{"id": "crm.contacts"}], "outputs": [{"id": "exports.contacts_csv", "type": "io.kestra.plugin.ee.assets.File", "metadata": {"path": "contacts.csv"}}]}}::'
    assets:
      enableAuto: true
```

In Python, the Kestra library sends the same structure with `Kestra.assets()`. Add `kestra` to the task's dependencies:

```yaml
- id: export_report
  type: io.kestra.plugin.scripts.python.Script
  dependencies:
    - kestra
  assets:
    enableAuto: true
  script: |
    from kestra import Kestra

    Kestra.assets({
        "outputs": [
            {
                "id": "reports.weekly_revenue",
                "type": "io.kestra.plugin.ee.assets.File",
                "metadata": {"path": "s3://company-reports/weekly_revenue.csv"},
            }
        ]
    })
```

## Failure behavior

Writing an asset can fail after the task itself succeeds, for example when the asset is [locked](../03.manage-assets/index.md#lock-an-asset), when the [cross-namespace check](#cross-namespace-writes) rejects the write, or when an expression in the `assets` block can't be rendered. `assetFailureBehavior` decides what happens to the task state:

| Value | Effect |
| --- | --- |
| `WARN` | A successful task ends in `WARNING`. This is the default. |
| `FAIL` | The task ends in `FAILED`. |
| `IGNORE` | The task state doesn't change. The failure only appears in the task logs. |

Kestra tries to write every declared asset before it applies the failure behavior, so one failed asset doesn't stop the others. The task's `allowFailure` and `allowWarning` properties still apply after the escalation. A task that already failed keeps its failed state.

```yaml
assets:
  assetFailureBehavior: FAIL
  outputs:
    - id: finance.ledger
      type: io.kestra.plugin.ee.assets.Table
```

An invalid declaration is different. If a rendered asset breaks a [field](#asset-fields) rule, for example an `id` with a space, the task fails regardless of `assetFailureBehavior`.

The value accepts expressions. To set it across many tasks without editing each flow, use a [Policy](../../policies/index.md) `Add` rule with `values: {assets: {assetFailureBehavior: FAIL}}`.

:::alert{type="info"}
If tasks that declare assets start ending in `WARNING`, their asset writes were already failing before this property existed, but silently. Set `assetFailureBehavior: IGNORE` to restore the silent behavior while you fix the cause.
:::

## Next steps

- [Asset tasks and triggers reference](../02.tasks-and-triggers/index.md)
- [Manage assets in the UI, API, and CLI](../03.manage-assets/index.md)
- [Asset best practices](../../../../14.best-practices/13.assets/index.md)
