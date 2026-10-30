---
title: Detect and Refresh Stale Data with Kestra Asset Freshness Checks
h1: Detect and Refresh Stale Data
description: Find tables that haven't been updated on time with the Kestra asset FreshnessTrigger, then rerun the flow that produces each one and send an alert.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
editions: ["EE", "Cloud"]
topics:
  - Data Pipelines
  - Kestra Concepts
---

Detect tables that missed their expected refresh, rerun the flow that produces each one, and notify your team.

A failed or skipped load often goes unnoticed until someone reads an outdated dashboard. Execution alerts only cover runs that happened. A freshness check looks at the data itself: it finds assets whose last update is older than a threshold, whatever the reason.

## Prerequisites

- A Kestra Enterprise Edition or Cloud instance.
- Permission to create flows in the `company.data` namespace.
- SDK authentication configured so that Kestra can call its own API. `FreshnessTrigger` queries assets through the API. By default, it uses the [SDK default authentication](../../configuration/01.configuration-basics/index.md#sdk-default-authentication), which is a namespace or tenant default service account in Enterprise Edition. The credential needs `ASSET:LIST`. To pass credentials explicitly, see the [connection properties](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#connection-properties-for-api-based-tasks).
- Optional: a Slack incoming webhook URL stored as the secret `SLACK_WEBHOOK`.

The examples store tables in a DuckDB file at `/tmp/kestra_warehouse.duckdb` so they run without credentials. They require a single worker, or workers that share `/tmp`.

## How staleness is measured

`FreshnessTrigger` compares each asset's `updated` timestamp with `now - maxStaleness`. Kestra updates that timestamp every time a successful task declares the asset as an output. A failed run doesn't update it, so a producer that keeps failing makes its assets stale.

## Step 1: Record the producing flow on each asset

To rerun the right flow for each stale asset, the remediation flow needs to know which flow produces it. Store that in the asset's metadata.

This producer loads a staging table once a day and records itself in `producer_flow`:

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
      outputs:
        - id: warehouse.stg_orders
          namespace: company.data
          type: io.kestra.plugin.ee.assets.Table
          metadata:
            system: duckdb
            name: stg_orders
            model_layer: staging
            producer_flow: "{{ flow.id }}"

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 6 * * *"
```

`{{ flow.id }}` keeps `producer_flow` correct if you copy this pattern into other flows. Execute the flow once so the asset exists.

## Step 2: Create the freshness monitor

The monitor checks every hour for staging tables in `company.data` that haven't been written in 26 hours. That is the daily cadence plus two hours of slack.

```yaml
id: refresh_stale_staging_tables
namespace: company.data

concurrency:
  limit: 1
  behavior: CANCEL

tasks:
  - id: for_each_stale_table
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ trigger.assets }}"
    tasks:
      - id: rerun_producer
        type: io.kestra.plugin.core.flow.Subflow
        namespace: company.data
        flowId: "{{ fromJson(item.value).metadata.producer_flow }}"
        wait: true
        transmitFailed: false

      - id: notify
        type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
        url: "{{ secret('SLACK_WEBHOOK') }}"
        messageText: >
          {{ fromJson(item.value).id }} was last updated {{ fromJson(item.value).lastUpdated }},
          {{ fromJson(item.value).staleDuration }} seconds before the check.
          Kestra reran {{ fromJson(item.value).metadata.producer_flow }}.

triggers:
  - id: stale_staging_tables
    type: io.kestra.plugin.kestra.ee.assets.FreshnessTrigger
    namespace: company.data
    assetType: io.kestra.plugin.ee.assets.Table
    maxStaleness: PT26H
    interval: PT1H
    metadataQuery:
      - field: model_layer
        type: EQUAL_TO
        value: staging
```

Notice the following:

- The trigger starts one execution for all stale assets found in a check, and exposes them as the list `trigger.assets`. There is no `trigger.asset` variable for this trigger.
- `Loop` passes each list item as a JSON string, so read fields with `fromJson(item.value)`.
- The subflow reruns the producer. When the producer succeeds, it writes the asset again, which updates `updated` and makes the asset fresh.
- `transmitFailed: false` lets the loop continue to the notification when a rerun fails.

If you don't use Slack, replace the `notify` task with a `io.kestra.plugin.core.log.Log` task and the same message.

## Step 3: Prevent repeated remediation

`FreshnessTrigger` doesn't remember what it already reported. It starts a new execution at every `interval` for as long as an asset stays stale. Plan for that:

- Make sure the remediation writes the asset, as the producer rerun does here. Remediation that only alerts produces one alert per interval until someone fixes the data.
- Keep `interval` longer than a typical remediation run. The `concurrency` block cancels a new check while the previous one is still running, so two reruns of the same producer never overlap.
- Choose `maxStaleness` from the producer's schedule plus a margin. A threshold equal to the schedule cadence fires before every normal run.

## Verify the result

To test without waiting a day, temporarily set `maxStaleness: PT1M` and `interval: PT1M` on the monitor, and wait two minutes after the last producer run.

1. Open **Executions** and filter on `refresh_stale_staging_tables`. An execution started by the `stale_staging_tables` trigger appears.
2. Open its **Gantt** or **Logs** tab. The `for_each_stale_table` loop has one iteration for `warehouse.stg_orders`, and `rerun_producer` started an execution of `load_staging_orders`.
3. Open **Assets**, select `warehouse.stg_orders`, and open the **Executions** tab. The rerun of `load_staging_orders` appears as the latest execution that wrote the asset.
4. Restore the original `maxStaleness` and `interval` values.

## Freshness in the dependencies graph

The **Dependencies** tab also shows freshness states for each asset. Those states use a different rule: they compare the last producing execution with the producing flow's `Schedule` cadence, and they don't start any flow. Use the graph to see freshness at a glance, and `FreshnessTrigger` to act on it. See [freshness states](../../07.enterprise/02.governance/01.assets/03.manage-assets/index.md#freshness-states).

## Next steps

- See every `FreshnessTrigger` property and `trigger.assets` field in the [asset tasks and triggers reference](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#freshnesstrigger).
- React to new data instead of missing data with [Run a flow when an upstream table changes](../asset-event-triggers/index.md).
- Choose metadata keys such as `model_layer` and `producer_flow` consistently with the [asset best practices](../../14.best-practices/13.assets/index.md).
- Limit overlapping executions with [flow concurrency](../../05.workflow-components/14.concurrency/index.md).
