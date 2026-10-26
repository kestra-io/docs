---
title: "Asset Tasks, Triggers, and Functions Reference"
h1: Asset Triggers, Tasks, Functions, and Exporters
description: Reference for Kestra asset triggers (EventTrigger, FreshnessTrigger), asset tasks (Set, List, Delete, PurgeAssets, Acquire, Release), the assets() Pebble function, and AssetShipper exporters.
sidebarTitle: Tasks and Triggers
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 1.2.0"
---

This reference lists the triggers, tasks, Pebble function, and exporters that read or act on [assets](../index.md).

For how to attach assets to a task, see the [asset declaration reference](../01.declare-assets/index.md). For the full property schemas, follow the plugin links in each section.

## Summary

| Name | Kind | Type | Use it to |
| --- | --- | --- | --- |
| [`EventTrigger`](#eventtrigger) | Trigger | `io.kestra.plugin.ee.assets.EventTrigger` | Start a flow when an asset is created, updated, deleted, or used |
| [`FreshnessTrigger`](#freshnesstrigger) | Trigger | `io.kestra.plugin.kestra.ee.assets.FreshnessTrigger` | Start a flow when assets haven't been updated for too long |
| [`Set`](#set) | Task | `io.kestra.plugin.kestra.ee.assets.Set` | Create an asset as its own step |
| [`List`](#list) | Task | `io.kestra.plugin.kestra.ee.assets.List` | Query assets during an execution |
| [`Delete`](#delete) | Task | `io.kestra.plugin.kestra.ee.assets.Delete` | Delete an asset |
| [`PurgeAssets`](#purgeassets) | Task | `io.kestra.plugin.kestra.ee.assets.PurgeAssets` | Hard-delete old assets, usages, and lineage events |
| [`Acquire`](#acquire-and-release) | Task | `io.kestra.plugin.kestra.ee.locks.Acquire` | Lock an asset against writes from other executions |
| [`Release`](#acquire-and-release) | Task | `io.kestra.plugin.kestra.ee.locks.Release` | Release a lock this execution holds |
| [`assets()`](#assets-pebble-function) | Pebble function | — | Look up assets inside any expression, including dynamic inputs |
| [`AssetShipper`](#assetshipper) | Task | `io.kestra.plugin.ee.assets.AssetShipper` | Export lineage events to OpenLineage or a file |

`EventTrigger` and `AssetShipper` run inside Kestra. The tasks and the `FreshnessTrigger` from the `io.kestra.plugin.kestra.ee` package call the Kestra API, so they accept the [connection properties](#connection-properties-for-api-based-tasks) described at the end of this page.

## Metadata queries

`EventTrigger`, `FreshnessTrigger`, `List`, and `PurgeAssets` accept a `metadataQuery` list. Each entry compares one top-level metadata key with a value:

| Property | Description |
| --- | --- |
| `field` | Metadata key to compare, for example `environment`. Nested keys aren't supported. |
| `type` | `EQUAL_TO` or `NOT_EQUAL_TO`. No other operators exist. |
| `value` | Value to compare, as a string. |

An asset matches only when it satisfies every entry. Use each `field` only once per operator in the same list.

```yaml
metadataQuery:
  - field: environment
    type: EQUAL_TO
    value: prod
  - field: model_layer
    type: NOT_EQUAL_TO
    value: staging
```

## Asset type filters

Filters such as `assetType` and `types` compare the full type string exactly. To match a built-in type, use its full class name, for example `io.kestra.plugin.ee.assets.Table`. A shortened value such as `TABLE` matches only assets whose type is literally `TABLE`.

## EventTrigger

[`io.kestra.plugin.ee.assets.EventTrigger`](/plugins/core/asset-ee/io.kestra.plugin.ee.assets.eventtrigger) starts an execution each time a matching asset event occurs.

| Property | Required | Description |
| --- | --- | --- |
| `events` | Yes in practice | List of events to react to: `CREATED`, `UPDATED`, `DELETED`, `USED`. A trigger without `events` never fires. |
| `assetId` | No | Only react to this asset ID. |
| `namespace` | No | Only react to assets in this exact namespace. Child namespaces and Global assets don't match. |
| `assetType` | No | Only react to assets of this exact type. |
| `metadataQuery` | No | Only react to assets whose metadata matches. See [Metadata queries](#metadata-queries). |

Kestra emits each event in these situations:

| Event | Emitted when |
| --- | --- |
| `CREATED` | An asset is created by a task's `assets.outputs`, by an auto-emitting plugin, by the `Set` task, by the UI or API, or as an `External` placeholder for an unknown input. If a task reads an asset before any task writes it, the placeholder emits `CREATED` and the first write emits `UPDATED`. |
| `UPDATED` | An existing asset is written again. Each successful run of a task that declares the asset as an output emits `UPDATED`, even when no field changed. Retyping an asset through a typed input also emits `UPDATED`. |
| `DELETED` | An asset is deleted or purged. |
| `USED` | A task declares the asset as an input or an output. Kestra emits `USED` for every such task run, including failed ones. |

The execution exposes the asset that matched as `trigger.asset`:

| Variable | Description |
| --- | --- |
| `trigger.asset.id` | Asset ID |
| `trigger.asset.namespace` | Asset namespace, empty for a Global asset |
| `trigger.asset.type` | Asset type |
| `trigger.asset.displayName` | Display name |
| `trigger.asset.description` | Description |
| `trigger.asset.metadata` | Metadata map, for example `trigger.asset.metadata.environment` |
| `trigger.asset.created` | When the asset was first created |
| `trigger.asset.updated` | When the asset was last written |
| `trigger.asset.event` | Event that started the execution |
| `trigger.asset.eventTime` | When the event occurred |

This flow starts whenever a staging `Table` asset in `company.data` is created or updated:

```yaml
id: refresh_marts_on_staging_change
namespace: company.data

tasks:
  - id: log_change
    type: io.kestra.plugin.core.log.Log
    message: "{{ trigger.asset.id }} was {{ trigger.asset.event }} at {{ trigger.asset.eventTime }}"

triggers:
  - id: staging_table_changed
    type: io.kestra.plugin.ee.assets.EventTrigger
    namespace: company.data
    assetType: io.kestra.plugin.ee.assets.Table
    events:
      - CREATED
      - UPDATED
    metadataQuery:
      - field: model_layer
        type: EQUAL_TO
        value: staging
```

For a complete walkthrough, see [Run a flow when a table changes](../../../../15.how-to-guides/asset-event-triggers/index.md).

## FreshnessTrigger

[`io.kestra.plugin.kestra.ee.assets.FreshnessTrigger`](/plugins/plugin-kestra/kestra-assets/io.kestra.plugin.kestra.ee.assets.freshnesstrigger) polls for assets whose last update is older than a threshold.

| Property | Required | Default | Description |
| --- | --- | --- | --- |
| `maxStaleness` | Yes | — | ISO 8601 duration. An asset is stale when its last update is older than `now - maxStaleness`. |
| `interval` | No | `PT1H` | How often the trigger checks. |
| `assetId` | No | — | Only check this asset ID. |
| `namespace` | No | — | Only check assets in this exact namespace. |
| `assetType` | No | — | Only check assets of this exact type. |
| `metadataQuery` | No | — | Only check assets whose metadata matches. |

Staleness is based on the asset's `updated` timestamp. Any write refreshes it: a task that declares the asset as an output, the API, or the UI. Lineage and usage records don't count.

When at least one asset is stale, the trigger starts one execution for all stale assets found in that check. It starts a new execution at every interval for as long as the assets stay stale.

The execution exposes the stale assets as the list `trigger.assets`. Each item contains:

| Field | Description |
| --- | --- |
| `id`, `namespace`, `type`, `displayName`, `description`, `metadata` | Asset attributes |
| `created` | When the asset was first created |
| `lastUpdated` | When the asset was last written |
| `staleDuration` | Seconds since the asset was last written, as a decimal number |
| `checkTime` | When the check ran |

This flow checks every 30 minutes for production mart tables that haven't been written in 6 hours and logs each one:

```yaml
id: stale_marts_monitor
namespace: company.monitoring

tasks:
  - id: for_each_stale_asset
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ trigger.assets }}"
    tasks:
      - id: log_stale
        type: io.kestra.plugin.core.log.Log
        message: "{{ fromJson(item.value).id }} last updated {{ fromJson(item.value).lastUpdated }} ({{ fromJson(item.value).staleDuration }} seconds ago)"

triggers:
  - id: stale_marts
    type: io.kestra.plugin.kestra.ee.assets.FreshnessTrigger
    assetType: io.kestra.plugin.ee.assets.Table
    maxStaleness: PT6H
    interval: PT30M
    metadataQuery:
      - field: environment
        type: EQUAL_TO
        value: prod
      - field: model_layer
        type: EQUAL_TO
        value: mart
```

`Loop` passes each stale asset to its child tasks as a JSON string, so read its fields with `fromJson(item.value)`.

:::alert{type="info"}
`FreshnessTrigger` and the freshness states shown in the [dependencies graph](../03.manage-assets/index.md#freshness-states) use different rules. The trigger compares the asset's last update with `maxStaleness`. The graph compares the last producing execution with the producing flow's `Schedule` cadence.
:::

For a complete walkthrough, see [Detect and refresh stale data](../../../../15.how-to-guides/asset-freshness/index.md).

## Set

[`io.kestra.plugin.kestra.ee.assets.Set`](/plugins/plugin-kestra/kestra-assets/io.kestra.plugin.kestra.ee.assets.set) creates an asset.

| Property | Required | Description |
| --- | --- | --- |
| `assetId` | Yes | Asset ID |
| `assetType` | Yes | Asset type, either a built-in type class or any custom string |
| `namespace` | No | Asset namespace. If you omit it, the asset is created as a Global asset. |
| `displayName` | No | Human-readable name |
| `assetDescription` | No | Markdown description |
| `metadata` | No | Map of metadata key-value pairs |

`Set` fails if an asset with the same ID already exists. To create or update an asset as part of the work that produces it, declare it in the producing task's [`assets.outputs`](../01.declare-assets/index.md#declare-inputs-and-outputs) instead. That path updates existing assets and records lineage, which `Set` doesn't.

```yaml
id: register_customers_table
namespace: company.data

tasks:
  - id: register
    type: io.kestra.plugin.kestra.ee.assets.Set
    namespace: company.data
    assetId: analytics.customers_by_country
    assetType: io.kestra.plugin.ee.assets.Table
    displayName: Customers by country
    assetDescription: Customer counts aggregated by country.
    metadata:
      owner: data-team
      environment: prod
```

## List

[`io.kestra.plugin.kestra.ee.assets.List`](/plugins/plugin-kestra/kestra-assets/io.kestra.plugin.kestra.ee.assets.list) queries assets.

| Property | Default | Description |
| --- | --- | --- |
| `namespace` | — | Only return assets in this exact namespace. |
| `types` | — | Only return assets whose type is in this list. |
| `metadataQuery` | — | Only return assets whose metadata matches. |
| `fetchType` | `STORE` | `FETCH` returns `outputs.<task_id>.assets`. `FETCH_ONE` returns the first match as `outputs.<task_id>.asset`. `STORE` writes the results to an internal storage file at `outputs.<task_id>.uri`. `NONE` returns only the count. |
| `size` | `100` | Page size. |
| `page` | — | Page to return. When omitted, the task fetches every page. |

Every fetch type also returns the number of results as `outputs.<task_id>.size`.

```yaml
id: list_data_team_tables
namespace: company.data

tasks:
  - id: list_tables
    type: io.kestra.plugin.kestra.ee.assets.List
    namespace: company.data
    types:
      - io.kestra.plugin.ee.assets.Table
    metadataQuery:
      - field: owner
        type: EQUAL_TO
        value: data-team
    fetchType: FETCH

  - id: log_ids
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.list_tables.assets | jq('.[].id') }}"
```

## Delete

[`io.kestra.plugin.kestra.ee.assets.Delete`](/plugins/plugin-kestra/kestra-assets/io.kestra.plugin.kestra.ee.assets.delete) deletes one asset by its required `assetId`. Deleting an asset emits a `DELETED` event and removes the asset from the dependencies graph.

```yaml
- id: delete_asset
  type: io.kestra.plugin.kestra.ee.assets.Delete
  assetId: analytics.customers_by_country
```

## PurgeAssets

[`io.kestra.plugin.kestra.ee.assets.PurgeAssets`](/plugins/plugin-kestra/kestra-assets/io.kestra.plugin.kestra.ee.assets.purgeassets) hard-deletes assets, asset usage records, and lineage events older than a cutoff date. Locked assets are skipped.

The [purge reference](../../../../10.administrator-guide/purge/index.md#purge-assets-and-lineage-retention) lists every property and the filter combinations each record type supports. For retention strategy, see [Purging data](../../../../14.best-practices/11.purging-data/index.md#when-to-purge-assets-and-lineage).

## Acquire and Release

[`io.kestra.plugin.kestra.ee.locks.Acquire`](/plugins/plugin-kestra/kestra-asset-locks/io.kestra.plugin.kestra.ee.locks.acquire) locks an asset for the current execution. While the lock is held, writes from other executions fail. The execution that holds the lock can still write to the asset, and each write extends the lock.

| Property | Required | Default | Description |
| --- | --- | --- | --- |
| `assetId` | Yes | — | Asset to lock |
| `ttl` | No | `PT5M` | How long the lock lasts before it expires |

| Output | Description |
| --- | --- |
| `lockedUntil` | When the lock expires |
| `ownerType` | Always `EXECUTION` for a lock taken by a task |
| `executionId` | ID of the execution that holds the lock |

If another owner already holds the lock, `Acquire` fails with HTTP 423. Add a [`retry`](../../../../05.workflow-components/12.retries/index.md) to wait for the lock.

[`io.kestra.plugin.kestra.ee.locks.Release`](/plugins/plugin-kestra/kestra-asset-locks/io.kestra.plugin.kestra.ee.locks.release) releases the lock on its required `assetId` if the current execution holds it. If the lock has expired or belongs to another owner, `Release` does nothing, so it's safe to call unconditionally.

`Acquire` needs the `LOCK` permission on the `ASSET` resource, and `Release` needs `UNLOCK`.

For locking from the UI and how locks affect each write path, see [Lock an asset](../03.manage-assets/index.md#lock-an-asset). For a complete walkthrough, see [Prevent concurrent changes to a resource](../../../../15.how-to-guides/asset-locks/index.md).

## assets() Pebble function

The `assets()` function returns the assets that match its arguments. Use it anywhere an expression is allowed, for example to fill a `SELECT` or `MULTISELECT` input with live asset IDs.

```plaintext
assets(id=null, type=null, namespace=null, metadata=null)
```

| Argument | Description |
| --- | --- |
| `id` | Only return the asset with this ID. IDs are unique per tenant, so this returns at most one asset. |
| `type` | Only return assets of this exact type. |
| `namespace` | Only return assets in this namespace and its child namespaces. When omitted, the function doesn't filter by namespace. |
| `metadata` | Only return assets whose metadata contains every key-value pair in this map, for example `{"environment": "prod"}`. |

When you pass `namespace`, Kestra also checks [allowed namespaces](../../07.namespace-management/index.md#allowed-namespaces): if any namespace in the tenant restricts its allowed namespaces without listing the namespace you pass, the function fails with `All namespaces are not allowed`. Namespaces allow all others by default, so this only matters once you restrict them. To avoid the check, filter by `type` or `metadata` instead.

The function returns a list. Each item has `id`, `namespace`, `type`, `displayName`, `description`, `metadata`, `tenantId`, `created`, `updated`, and `deleted`. Use the [`jq` filter](../../../../expressions/03.filters/01.json/index.mdx#jq) to extract fields.

This flow lets the user pick from the production `Table` assets in `company.data`:

```yaml
id: pick_tables
namespace: company.data

inputs:
  - id: tables
    type: MULTISELECT
    expression: '{{ assets(type="io.kestra.plugin.ee.assets.Table", namespace="company.data", metadata={"environment": "prod"}) | jq(".[].id") }}'

tasks:
  - id: for_each_table
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ inputs.tables }}"
    tasks:
      - id: log_table
        type: io.kestra.plugin.core.log.Log
        message: "Selected {{ item.value }}"
```

This expression reads one metadata value from a known asset:

```yaml
message: "{{ assets(id='reports.weekly_csv') | jq('.[0].metadata.path') | first }}"
```

## AssetShipper

[`io.kestra.plugin.ee.assets.AssetShipper`](/plugins/core/asset-ee/io.kestra.plugin.ee.assets.assetshipper) exports asset lineage events to one or more destinations. Each lineage event describes one task run: the flow and task, the execution, the run state, and the input and output assets.

The task runs incrementally. On its first run, it exports events from the last `lookbackPeriod`. It then stores the timestamp of the last exported event in the KV Store and continues from there on the next run. Schedule it with a [`Schedule` trigger](../../../../05.workflow-components/07.triggers/01.schedule-trigger/index.md).

| Property | Default | Description |
| --- | --- | --- |
| `assetExporters` | — | Required list of exporters. Each needs an `id` and a `type`. |
| `lookbackPeriod` | `P1D` | How far back the first run looks when no offset is stored. |
| `offsetKey` | — | Prefix of the KV Store key that stores the offset. Set it when several `AssetShipper` tasks must keep separate offsets. |
| `flowNamespace`, `flowId`, `taskId` | — | Only export events from this namespace, flow, or task. |
| `assetNamespace`, `assetTypes` | — | Only export events that involve assets in this namespace or of these types. |
| `delete` | `false` | Delete the exported records after export. |

Outputs: `size` (number of events exported), `endFetchedDate`, and `outputs` (one entry per exporter).

### FileAssetExporter

`io.kestra.plugin.ee.assets.FileAssetExporter` writes events to files in internal storage. Use it when no exporter targets your destination, then send the files on with another task.

| Property | Default | Description |
| --- | --- | --- |
| `format` | `ION` | `ION` or `JSON` |
| `maxLinesPerFile` | `100000` | Events per file |
| `logFilePrefix` | `kestra-log-file` | File name prefix |

```yaml
id: export_lineage_to_file
namespace: company.data

tasks:
  - id: export
    type: io.kestra.plugin.ee.assets.AssetShipper
    assetExporters:
      - id: file
        type: io.kestra.plugin.ee.assets.FileAssetExporter
        format: JSON

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
```

### OpenLineageAssetExporter

`io.kestra.plugin.ee.openlineage.OpenLineageAssetExporter` sends each event as an OpenLineage run event over HTTP. The Kestra flow and task become the OpenLineage job, and input and output assets become datasets.

| Property | Required | Description |
| --- | --- | --- |
| `uri` | Yes | OpenLineage HTTP endpoint. The exporter sends no authentication. |
| `mappings` | No | Per asset type, the metadata keys to use as the dataset `namespace` and `name`. By default, the dataset namespace is the asset namespace and the dataset name is the asset ID. |

Every asset of a mapped type must have the mapped metadata keys. For a complete walkthrough, see [Send asset lineage to OpenLineage](../../../../15.how-to-guides/asset-openlineage/index.md).

## Dashboards

The `io.kestra.plugin.ee.dashboard.data.Assets` data source charts your current asset inventory in a custom dashboard. See [Assets data source](../../../../09.ui/00.dashboard/index.md#assets-ee-and-cloud-only) for fields and examples.

## Connection properties for API-based tasks

`Set`, `List`, `Delete`, `PurgeAssets`, `Acquire`, `Release`, and `FreshnessTrigger` call the Kestra API. By default, they connect to the current instance with the authentication configured for SDK tasks, and they act on the current tenant. Override these defaults when needed:

| Property | Description |
| --- | --- |
| `kestraUrl` | Kestra API URL. Defaults to the configured SDK URL, then to `kestra.url`. |
| `auth` | `apiToken`, or `username` and `password`. `auto: true` (the default) uses the configured SDK authentication. |
| `tenantId` | Tenant to act on. Defaults to the current tenant. |

If `kestra.url` is an address that only works from outside the worker, such as a host port mapped to a Docker container, set `kestraUrl` to an address the worker can reach. Otherwise the task fails with a connection error.

The credentials need the matching `ASSET` permissions. See the [ASSET permissions reference](../../../03.auth/rbac/permissions-reference/index.md).
