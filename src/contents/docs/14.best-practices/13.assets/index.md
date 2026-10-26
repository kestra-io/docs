---
title: "Kestra Asset Best Practices: IDs, Metadata, and Namespaces"
h1: Model Assets So Lineage and Inventory Stay Useful
description: Best practices for Kestra assets. Choose stable IDs, agree on metadata keys, pick namespaces or Global assets, combine automatic and declared assets, and keep the catalog clean.
sidebarTitle: Assets
icon: /src/contents/docs/icons/best-practices.svg
editions: ["EE", "Cloud"]
---

How to design asset IDs, metadata, namespaces, and declarations so that your lineage graph and inventory stay accurate as more flows and teams use them.

Assets only help if the same resource always gets the same record and people can find it. Most problems with assets come from a few early modeling choices. This page covers those choices. For the feature itself, see [Assets](../../07.enterprise/02.governance/01.assets/index.md).

## Quick recommendation

- Give each resource one stable ID that every flow uses, built from its real address, such as `analytics.marts.fct_orders`.
- Agree on a small set of metadata keys, such as `owner`, `environment`, and `system`, and use them everywhere.
- Declare assets on the task that actually reads or writes the resource, not on a separate step.
- Turn on `enableAuto` for plugins that emit assets, and declare only what the plugin can't see.
- Put team-owned assets in the team's namespace. Use Global assets only for resources every namespace must reference.

## Choose stable, meaningful IDs

Kestra identifies an asset by its `id` within the tenant. The namespace and the type aren't part of the identity. Every flow that uses the same ID connects to the same asset, and every flow that uses a different ID for the same resource creates a separate, disconnected asset.

Build IDs from the resource's real address so that any author derives the same ID without looking it up:

| Resource | Recommended ID |
| --- | --- |
| Warehouse table | `<database>.<schema>.<table>`, for example `analytics.marts.fct_orders` |
| Object storage file | Bucket and key, for example `s3.company-reports.weekly.revenue_csv` |
| Virtual machine | A unique host name or cloud instance name, for example `vm-web-prod-01` |
| Bucket | `<provider>.<bucket>`, for example `s3.company-raw` |

IDs accept letters, digits, `.`, `_`, `:`, and `-`, up to 150 characters. Use the [`slugify` filter](../../expressions/03.filters/03.strings/index.mdx#slugify) when you build an ID from user input.

### Match the IDs that plugins emit

dbt, Fivetran, and BigQuery emit table IDs as `<database>.<schema>.<table>`. Use the same format in your own declarations so manual and automatic assets join into one graph. JDBC query tasks emit `<database>.<table>` without the schema. When you mix JDBC with dbt or Fivetran, declare the full three-part ID yourself. See [Plugins that emit assets](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#plugins-that-emit-assets).

### Use stable IDs for long-lived resources and unique IDs for per-run ones

A table, a VM, or a bucket keeps its ID for its whole life, and each run updates the same asset. A snapshot, a backup, or a certificate issued per run is a new resource each time. Add a run-specific suffix such as `{{ execution.id }}` or a date so each one gets its own asset:

```yaml
outputs:
  - id: "snapshot.vm-web-prod-01.{{ execution.id }}"
    type: company.infra.Snapshot
```

Per-run assets accumulate. Plan a retention policy for them with [`PurgeAssets`](../11.purging-data/index.md#when-to-purge-assets-and-lineage).

## Agree on metadata keys

Metadata is what makes assets searchable. Triggers, the `List` task, the `assets()` function, dashboards, and the UI filter all match on metadata keys, and they match exactly. `env: prod` and `environment: production` are different filters.

Pick a short vocabulary and document it for your teams:

| Key | Example values | Used for |
| --- | --- | --- |
| `owner` | `data-team`, `platform` | Routing alerts and questions |
| `environment` | `dev`, `staging`, `prod` | Scoping triggers and fleet operations |
| `system` | `postgres`, `snowflake`, `s3` | Grouping in the dependencies graph |
| `model_layer` | `staging`, `mart` | Data layering and event-driven pipelines |

Metadata filters compare top-level keys as strings. Keep values flat: `environment: prod`, not `labels: {environment: prod}`.

### Store references to related assets

When one asset belongs to another, such as an IP address attached to a VM, store the parent's ID in metadata, for example `vm: vm-web-prod-01`. Lineage edges show the relationship in the graph, but a metadata key lets a flow find all children with `assets(metadata={"vm": "vm-web-prod-01"})`.

## Pick namespaces deliberately

The namespace controls who can see an asset and which flows can write it.

- Put assets that one team owns in that team's namespace. Namespace-scoped RBAC then applies to them.
- Use a Global asset, with no namespace, only for a resource that every namespace must reference, such as a shared reference table. Namespace-level access control doesn't restrict Global assets.
- A new output without a `namespace` becomes Global. If you mean the asset to belong to a namespace, set `namespace` explicitly, for example `namespace: "{{ flow.namespace }}"`.
- Plugins such as dbt and JDBC emit assets without a namespace, so their assets start as Global. Leave out the `namespace` filter in triggers and queries that must match them, or move them into a namespace by declaring the same ID as an output with a `namespace`.

When a flow writes an asset in another namespace that restricts its allowed namespaces, that namespace must list the flow's namespace. Configure this with [allowed namespaces](../../07.enterprise/02.governance/07.namespace-management/index.md#allowed-namespaces) rather than moving assets to Global to avoid the check.

## Declare assets where the work happens

Declare `assets.outputs` on the task that creates or changes the resource. Kestra then skips the write when that task fails, records which execution wrote it, and links the inputs of that task to its outputs in the graph.

Avoid registering assets with a separate `Set` task after the real work. `Set` doesn't record lineage, and it fails if the asset already exists.

### Declare inputs, including external sources

List every resource a task reads in `assets.inputs`, including sources that no Kestra flow produces, such as an application database or a vendor API export. Kestra creates them as `External` placeholders, and the graph shows where your data comes from. Without inputs, outputs appear with no upstream.

### Combine automatic and declared assets

When a plugin emits assets, turn on `assets.enableAuto: true` and add only the declarations the plugin can't infer. BI tools such as Hex and Qlik Cloud emit their output but not the tables they read, so declare those tables as inputs. The emitted and declared assets combine.

## Choose a failure behavior

By default, a task that succeeds but can't write one of its assets ends in `WARNING`. Choose the behavior that matches how much you rely on the catalog:

- Keep `WARN` for most flows. You see the problem without failing the work.
- Use `FAIL` when downstream automation depends on the asset being current, for example when an `EventTrigger` starts the next stage.
- Use `IGNORE` only for best-effort lineage where warnings would be noise.

See [Failure behavior](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#failure-behavior).

## Design triggers that don't fire too often

- An `EventTrigger` on `UPDATED` fires on every successful run of the producing task, even when the data didn't change. Filter with `metadataQuery` or `assetId`, and make the triggered flow safe to run repeatedly.
- Don't let a flow write an asset that matches its own `EventTrigger`. It would start itself again on every run.
- A `FreshnessTrigger` fires again at every interval while assets stay stale. Make sure the remediation writes the asset, or alert once and track the issue elsewhere.

## Keep the catalog clean

- Delete assets when you decommission the resource, with the [`Delete` task](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#delete) in your teardown flow.
- Purge per-run assets and old usage and lineage records on a schedule. See [When to purge assets and lineage](../11.purging-data/index.md#when-to-purge-assets-and-lineage).
- Don't register temporary files that exist only inside one execution. Use [outputs](../../05.workflow-components/06.outputs/index.md) for those.

## Anti-patterns

| Anti-pattern | Problem | Instead |
| --- | --- | --- |
| Different IDs for the same table in different flows | The graph splits into disconnected pieces | Derive IDs from the resource address |
| Short type names such as `TABLE` | Type filters that use the full class name don't match | Use `io.kestra.plugin.ee.assets.Table` or another full type string |
| `Set` task after the work | No lineage, and it fails once the asset exists | Declare `assets.outputs` on the working task |
| Omitting `namespace` by accident | The asset becomes Global and skips namespace RBAC | Set `namespace` explicitly |
| Free-form metadata keys per team | Filters and triggers miss assets | Agree on a shared vocabulary |
| `enableAuto` left off | Plugins emit nothing | Turn it on for every plugin that emits assets |

## Summary

Stable IDs connect your graph, shared metadata keys make it searchable, and deliberate namespaces keep it secure. Declare assets on the tasks that do the work, let plugins emit what they can, and prune what no longer exists.
