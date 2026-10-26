---
title: Run a Flow When an Upstream Table Changes in Kestra
h1: Run a Flow When an Upstream Table Changes
description: Start a downstream flow automatically each time an upstream table asset is created or updated, using the Kestra asset EventTrigger and metadata filters.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
editions: ["EE", "Cloud"]
topics:
  - Data Pipelines
  - Kestra Concepts
---

Start a downstream flow each time an upstream flow writes a table, without scheduling the two flows to line up.

When one team loads staging tables and another builds marts from them, a fixed schedule for the mart flow either runs too early and reads stale data, or runs late and wastes time. An asset `EventTrigger` starts the mart flow when the staging table is actually written, and the lineage between the two flows appears in the dependencies graph.

## Prerequisites

- A Kestra Enterprise Edition or Cloud instance.
- Permission to create flows in the `company.data` namespace, and the `ASSET` permissions `VIEW` and `LIST` to inspect the result.
- A single worker, or workers that share `/tmp`. The examples store tables in a DuckDB file at `/tmp/kestra_warehouse.duckdb` so they run without credentials. In production, point both flows at your warehouse instead.

## Step 1: Create the producer flow

The producer flow downloads orders, loads them into a staging table, and declares that table as an output asset. The `model_layer: staging` metadata key is what the downstream trigger filters on.

```yaml
id: load_staging_orders
namespace: company.data

tasks:
  - id: download_orders
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: load_orders
    type: io.kestra.plugin.jdbc.duckdb.Queries
    url: jdbc:duckdb:/tmp/kestra_warehouse.duckdb
    inputFiles:
      orders.csv: "{{ outputs.download_orders.uri }}"
    sql: |
      CREATE OR REPLACE TABLE stg_orders AS
      SELECT * FROM read_csv_auto('{{ workingDir }}/orders.csv', header=True);
    assets:
      inputs:
        - id: kestra_datasets.orders_csv
      outputs:
        - id: warehouse.stg_orders
          namespace: company.data
          type: io.kestra.plugin.ee.assets.Table
          displayName: Staging orders
          metadata:
            system: duckdb
            database: warehouse
            name: stg_orders
            model_layer: staging
```

Notice the following:

- `kestra_datasets.orders_csv` doesn't exist as an asset yet, so Kestra creates it as an `External` placeholder and draws lineage from it to `warehouse.stg_orders`.
- The output sets `namespace` explicitly. Without it, Kestra would create a Global asset, and the trigger's `namespace` filter in Step 2 wouldn't match it.
- `metadata.name` holds the physical table name, so the downstream flow can query it without parsing the asset ID.

## Step 2: Create the downstream flow with an `EventTrigger`

The downstream flow builds a mart from whichever staging table changed. The trigger reacts to `CREATED` and `UPDATED` events on `Table` assets in `company.data` whose `model_layer` is `staging`.

```yaml
id: build_orders_mart
namespace: company.data

tasks:
  - id: build_mart
    type: io.kestra.plugin.jdbc.duckdb.Queries
    url: jdbc:duckdb:/tmp/kestra_warehouse.duckdb
    sql: |
      CREATE OR REPLACE TABLE mart_orders_by_customer AS
      SELECT customer_name, count(order_id) AS orders
      FROM {{ trigger.asset.metadata.name }}
      GROUP BY customer_name;
    assets:
      inputs:
        - id: "{{ trigger.asset.id }}"
      outputs:
        - id: warehouse.mart_orders_by_customer
          namespace: company.data
          type: io.kestra.plugin.ee.assets.Table
          displayName: Orders by customer
          metadata:
            system: duckdb
            database: warehouse
            name: mart_orders_by_customer
            model_layer: mart

  - id: log_source
    type: io.kestra.plugin.core.log.Log
    message: "Rebuilt the mart after {{ trigger.asset.id }} was {{ trigger.asset.event }} at {{ trigger.asset.eventTime }}"

triggers:
  - id: on_staging_table_change
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

Notice the following:

- `trigger.asset` holds the asset that matched, including its `metadata`, `event`, and `eventTime`.
- The input `{{ trigger.asset.id }}` connects the mart to the staging table that started the execution, so the dependencies graph shows the full chain.
- The mart's output has `model_layer: mart`, so writing it doesn't match this trigger's filter and can't start the flow again.

## Step 3: Run the producer

Execute `load_staging_orders`. When `load_orders` succeeds, Kestra creates `warehouse.stg_orders` and emits a `CREATED` event, which starts `build_orders_mart`. Each later run of the producer emits `UPDATED` and starts the downstream flow again.

## Verify the result

1. Open **Executions** and filter on `build_orders_mart`. You should see one execution per producer run, started by the `on_staging_table_change` trigger.
2. Open the `log_source` task logs. The message names `warehouse.stg_orders` and the event, `CREATED` on the first run and `UPDATED` afterward.
3. Open **Assets** and select `warehouse.mart_orders_by_customer`. The **Overview** tab lists `warehouse.stg_orders` under **Upstream Assets**.
4. Open the **Dependencies** tab. The graph shows `kestra_datasets.orders_csv`, then `load_staging_orders`, `warehouse.stg_orders`, `build_orders_mart`, and `warehouse.mart_orders_by_customer`.

## Avoid common mistakes

- **Always set `events`.** A trigger without `events` never fires.
- **Expect `UPDATED` on every producer run.** Kestra emits `UPDATED` each time a successful task writes the asset, even when the data didn't change. If the downstream flow must only run on real changes, compare a value such as a row count or a `metadata` field inside the flow before doing the work.
- **Don't use `USED` to detect new data.** `USED` fires every time a task reads or writes the asset, including failed runs.
- **Match the namespace exactly.** The `namespace` filter doesn't include child namespaces. Assets in `company.data.sales` don't match `namespace: company.data`. Global assets have no namespace and only match a trigger without a `namespace` filter.
- **Use the full type.** `assetType: TABLE` only matches assets whose type is the literal string `TABLE`.
- **Don't let a flow trigger itself.** If the downstream flow writes an asset that matches its own trigger filters, each run starts another. Give its outputs metadata or a type the filter excludes, as `model_layer: mart` does here.

## Variant: audit asset deletions

The same trigger can react to `DELETED` events. This flow logs a warning for every asset deleted anywhere in the tenant. It has no `namespace` filter, so it also matches Global assets.

```yaml
id: audit_asset_deletions
namespace: company.governance

tasks:
  - id: log_deletion
    type: io.kestra.plugin.core.log.Log
    level: WARN
    message: >
      Asset {{ trigger.asset.id }} of type {{ trigger.asset.type }}
      in namespace {{ trigger.asset.namespace ?? 'Global' }}
      was deleted at {{ trigger.asset.eventTime }}.

triggers:
  - id: on_asset_deleted
    type: io.kestra.plugin.ee.assets.EventTrigger
    events:
      - DELETED
```

To test it, open an asset in the UI and select **Delete** from the **⋮** menu. Replace the `Log` task with a database insert or a notification task to keep a permanent audit trail.

## Next steps

- See every `EventTrigger` property, event, and `trigger.asset` variable in the [asset tasks and triggers reference](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#eventtrigger).
- Learn when Kestra creates and updates assets in the [asset declaration reference](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md).
- Catch tables that stop updating with [Detect and refresh stale data](../asset-freshness/index.md).
- Plan IDs and metadata keys with the [asset best practices](../../14.best-practices/13.assets/index.md).
