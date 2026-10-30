---
title: Send Kestra Asset Lineage to OpenLineage Tools Such as Marquez
h1: Export Asset Lineage to an OpenLineage Backend
description: Ship Kestra asset lineage to Marquez or any OpenLineage-compatible backend on a schedule, map assets to OpenLineage datasets, and export lineage files.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
editions: ["EE", "Cloud"]
topics:
  - Data Pipelines
  - Integrations
---

Export the lineage Kestra records for your assets to an OpenLineage-compatible backend such as Marquez, so orchestration lineage appears next to the lineage from your warehouse and other tools.

Kestra's dependencies graph shows lineage for the flows Kestra runs. If your organization keeps a central lineage or catalog tool, that tool also needs Kestra's part of the picture. The `AssetShipper` task sends new lineage events on a schedule, and the `OpenLineageAssetExporter` turns each event into an OpenLineage run event.

## Prerequisites

- Kestra Enterprise Edition or Kestra Cloud.
- Flows that already record assets. If you have none yet, follow [Track lineage across a dbt pipeline](../asset-lineage-dbt/index.md) first.
- An OpenLineage HTTP endpoint that Kestra can reach without authentication. For local testing, run [Marquez](https://marquezproject.ai/) with its quickstart. Its API listens on port `5000`.

## How the export works

Each time a task with assets runs, Kestra records which assets it read and wrote. `AssetShipper` rebuilds one lineage event per task run from that history: the flow and task, the execution, the run state, and the input and output assets. It reads the history recorded since its last run and passes the events to one or more exporters.

The `OpenLineageAssetExporter` sends one OpenLineage run event per lineage event:

| Kestra | OpenLineage |
| --- | --- |
| Tenant and namespace | Job namespace (`<tenant>.<namespace>`) |
| Flow ID and task ID | Job name (`<flow>.<task>`) |
| Task run | Run, with event type `COMPLETE`, `FAIL`, `ABORT`, or `RUNNING` from the run state |
| Input and output assets | Input and output datasets |

By default, a dataset's namespace is the asset's namespace and its name is the asset ID. Exporters always send the asset's current metadata, and they skip assets that were deleted since the event.

## Step 1: Ship lineage on a schedule

Create a flow in a namespace your platform team owns. It runs every hour and sends new events to Marquez:

```yaml
id: ship_lineage_to_marquez
namespace: company.platform

tasks:
  - id: ship_lineage
    type: io.kestra.plugin.ee.assets.AssetShipper
    lookbackPeriod: P7D
    assetExporters:
      - id: marquez
        type: io.kestra.plugin.ee.openlineage.OpenLineageAssetExporter
        uri: http://marquez:5000

triggers:
  - id: hourly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@hourly"
```

Replace `http://marquez:5000` with your endpoint's base URL. The exporter sends no authentication, so the endpoint must accept unauthenticated requests from Kestra.

Notice `lookbackPeriod: P7D`. The first run has no stored offset, so it exports the last seven days of events. After each run, `AssetShipper` stores the timestamp of the last exported event in the KV Store of the flow's namespace, and the next run continues from there. The KV key is `AssetShipper-state_<flow id>_<task id>` unless you set `offsetKey` to change the prefix.

Execute the flow once to send the backlog. The `ship_lineage` task's `size` output shows how many events it exported.

## Step 2: Map assets to your dataset naming

OpenLineage tools match datasets across producers by namespace and name. If your warehouse lineage names a table `postgres://warehouse:5432` / `analytics.public.orders`, Kestra's dataset for the same table must use the same values to merge with it.

Use `mappings` to read the dataset namespace or name from asset metadata. Each key under `mappings` is an asset type. Each value maps `namespace`, `name`, or both to a metadata key:

```yaml
- id: ship_lineage
  type: io.kestra.plugin.ee.assets.AssetShipper
  assetExporters:
    - id: marquez
      type: io.kestra.plugin.ee.openlineage.OpenLineageAssetExporter
      uri: http://marquez:5000
      mappings:
        io.kestra.plugin.ee.assets.Table:
          namespace: lineage_namespace
```

With this mapping, every `Table` asset uses the value of its `lineage_namespace` metadata key as the dataset namespace, and keeps its asset ID as the dataset name. Other asset types keep the defaults.

Every asset of a mapped type must have the mapped metadata key, or the export fails. Add the key where the assets are declared:

```yaml
assets:
  outputs:
    - id: analytics.public.orders
      type: io.kestra.plugin.ee.assets.Table
      metadata:
        system: postgres
        lineage_namespace: postgres://warehouse:5432
```

## Step 3: Limit what you export

By default, `AssetShipper` exports events from every namespace in the tenant. To export a subset, add filters:

| Property | Exports events |
| --- | --- |
| `flowNamespace` | From flows in this namespace and its child namespaces |
| `flowId`, `taskId` | From this flow or task |
| `assetNamespace` | That involve at least one asset in this exact namespace |
| `assetTypes` | That involve at least one asset of these types |

```yaml
- id: ship_data_lineage
  type: io.kestra.plugin.ee.assets.AssetShipper
  flowNamespace: company.data
  assetTypes:
    - io.kestra.plugin.ee.assets.Table
    - io.kestra.plugin.ee.assets.Dataset
  assetExporters:
    - id: marquez
      type: io.kestra.plugin.ee.openlineage.OpenLineageAssetExporter
      uri: http://marquez:5000
```

When you filter by `assetNamespace` or `assetTypes`, assets that don't match are also removed from each exported event.

Without `flowNamespace` or `assetNamespace`, the flow's namespace must be allowed to access every namespace in the tenant. If you restrict [allowed namespaces](../../07.enterprise/02.governance/07.namespace-management/index.md#allowed-namespaces), set one of these filters or allow the shipping namespace.

## Step 4: Export to a file when no exporter fits

If your lineage tool doesn't accept OpenLineage over HTTP, write the events to files with `FileAssetExporter` and send the files with another task. This flow uploads each day's events to S3 as JSON:

```yaml
id: ship_lineage_to_s3
namespace: company.platform

tasks:
  - id: export_lineage
    type: io.kestra.plugin.ee.assets.AssetShipper
    assetExporters:
      - id: file
        type: io.kestra.plugin.ee.assets.FileAssetExporter
        format: JSON

  - id: upload
    type: io.kestra.plugin.aws.s3.Upload
    region: "{{ secret('AWS_DEFAULT_REGION') }}"
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    bucket: company-lineage
    key: "kestra/{{ execution.startDate | date('yyyy-MM-dd') }}"
    from: "{{ outputs.export_lineage.outputs.file.uris }}"

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
```

`outputs.export_lineage.outputs.file.uris` holds the internal storage URIs of the files the `file` exporter wrote. Each file holds up to `maxLinesPerFile` events, 100,000 by default.

## Verify the result

1. Open the latest execution of `ship_lineage_to_marquez` and check the `ship_lineage` task's outputs. `size` is the number of events exported, and `endFetchedDate` is the offset the next run starts from.
2. In Marquez, open the **Jobs** view and search for your Kestra namespace. Each Kestra task that recorded assets appears as a job named `<flow>.<task>`.
3. Open one job. Its inputs and outputs match the asset's **Upstream Assets** and **Downstream Assets** on the Kestra **Overview** tab.
4. To re-send events, delete the offset key in the KV Store of `company.platform`. The next run starts again from `lookbackPeriod`.

## Next steps

- See every `AssetShipper` and exporter property in the [asset tasks and triggers reference](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#assetshipper).
- Keep lineage storage under control with [PurgeAssets](../../10.administrator-guide/purge/index.md#purge-assets-and-lineage-retention).
- Plan asset IDs and metadata keys that match your catalog with the [asset best practices](../../14.best-practices/13.assets/index.md).
- Learn how Kestra records lineage in [Assets](../../07.enterprise/02.governance/01.assets/index.md).
