---
title: Track Lineage Across a dbt Pipeline Without Writing It by Hand
h1: Track dbt Lineage Automatically with Kestra Assets
description: Capture dbt model lineage as Kestra assets automatically, connect downstream consumers to the graph, and alert when dbt tests fail on a model.
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
editions: ["EE", "Cloud"]
topics:
  - Data Pipelines
  - Integrations
---

Turn on automatic asset emission on a dbt task so Kestra records every model as an asset with its upstream dependencies, then connect the tasks that consume those models to the same lineage graph.

A dbt project already describes which models depend on which. When you run it from Kestra, that knowledge usually stays inside dbt, so nobody can see which flow refreshes a model or which report reads it. With `assets.enableAuto`, the dbt task emits each model as a `Table` asset with its parents as inputs, and you only declare the edges dbt can't see.

## Prerequisites

- Kestra Enterprise Edition or Kestra Cloud.
- A Kestra worker that can run Docker containers. The example uses the Docker task runner.
- The `ASSET` permissions to view assets. See the [ASSET permissions reference](../../07.enterprise/03.auth/rbac/permissions-reference/index.md).

## Step 1: Run dbt with automatic asset emission

The flow below clones the [kestra-io/dbt-example](https://github.com/kestra-io/dbt-example) project and builds it against a local DuckDB file. The project has two models: `my_first_dbt_model` and `my_second_dbt_model`, which selects from the first.

```yaml
id: dbt_build_with_lineage
namespace: company.data

tasks:
  - id: workspace
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_project
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/dbt-example
        branch: main

      - id: dbt_build
        type: io.kestra.plugin.dbt.cli.DbtCLI
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: ghcr.io/kestra-io/dbt-duckdb:latest
        commands:
          - dbt build
        profiles: |
          my_dbt_project:
            outputs:
              dev:
                type: duckdb
                path: dbt.duckdb
            target: dev
        assets:
          enableAuto: true
```

The only asset-specific line is `assets.enableAuto: true`. Without it, Kestra discards the assets the dbt plugin emits. After `dbt build` finishes, the plugin reads dbt's `manifest.json` and emits:

- One `io.kestra.plugin.ee.assets.Table` output per model, seed, and snapshot, with the ID `<database>.<schema>.<name>`.
- Each model's parents as `Table` inputs, which become edges in the dependencies graph.
- The metadata keys `system` (the dbt adapter), `database`, `schema`, and `name`.

The plugin emits assets without a namespace, so Kestra creates the models as [Global assets](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#namespace-and-global-assets), visible to every namespace.

The `ghcr.io/kestra-io/dbt-duckdb:latest` tag moves when the image is rebuilt. Pin a specific tag for production flows.

Execute the flow.

## Step 2: Find the emitted asset IDs

You need the exact IDs dbt emitted to connect other tasks to them.

1. Open **Assets** in the left navigation.
2. Filter by the type `io.kestra.plugin.ee.assets.Table`. Don't filter by namespace: the dbt models are Global assets.
3. Note the IDs of the two models. With a DuckDB file named `dbt.duckdb`, the database is `dbt` and the default schema is `main`, so the IDs look like `dbt.main.my_first_dbt_model` and `dbt.main.my_second_dbt_model`.

You can also open the execution and select its **Assets** tab to list every asset the run read or wrote.

## Step 3: Connect a downstream consumer

The dbt plugin knows its own models, but not what reads them afterwards. Declare the consumer's inputs with the dbt IDs so the graph continues past dbt.

Add a task to the same working directory that exports `my_second_dbt_model` to a CSV report. The task declares the dbt model as an input and the report as an output:

```yaml
id: dbt_build_with_lineage
namespace: company.data

tasks:
  - id: workspace
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_project
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/dbt-example
        branch: main

      - id: dbt_build
        type: io.kestra.plugin.dbt.cli.DbtCLI
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: ghcr.io/kestra-io/dbt-duckdb:latest
        commands:
          - dbt build
        profiles: |
          my_dbt_project:
            outputs:
              dev:
                type: duckdb
                path: dbt.duckdb
            target: dev
        assets:
          enableAuto: true

      - id: export_report
        type: io.kestra.plugin.scripts.python.Script
        dependencies:
          - duckdb
        outputFiles:
          - second_model_report.csv
        script: |
          import duckdb

          con = duckdb.connect("dbt.duckdb", read_only=True)
          con.sql("SELECT * FROM main.my_second_dbt_model").write_csv("second_model_report.csv")
        assets:
          inputs:
            - id: dbt.main.my_second_dbt_model
          outputs:
            - id: reports.second_model_report
              namespace: company.data
              type: io.kestra.plugin.ee.assets.File
              metadata:
                path: second_model_report.csv
                owner: analytics-team
```

If the IDs you found in step 2 differ, use yours in `assets.inputs`. An input ID that doesn't match an existing asset creates a separate `External` placeholder instead of joining the dbt model.

The same pattern applies to BI tools. Hex `projects.Run` and Qlik Cloud `apps.Reload` emit their own output asset but can't see their upstream tables, so declare the dbt IDs in their `assets.inputs`. See [Plugins that emit assets](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#plugins-that-emit-assets).

Execute the flow again.

## Step 4: Alert when dbt tests fail

With `parseRunResults` left at its default of `true`, the dbt plugin adds test results to each model's metadata:

| Key | Value |
| --- | --- |
| `dbtTestStatus` | `pass`, `fail`, or `warn`, rolled up from the tests on the model |
| `dbtTestsTotal` | Number of tests run on the model |
| `dbtTestsFailed` | Number of failed tests |

Models without executed tests carry none of these keys.

Create a second flow that reacts when a model is written with a failing test status:

```yaml
id: dbt_test_failure_alert
namespace: company.data

tasks:
  - id: notify
    type: io.kestra.plugin.core.log.Log
    level: WARN
    message: >
      dbt tests failed on {{ trigger.asset.id }}:
      {{ trigger.asset.metadata.dbtTestsFailed }} of {{ trigger.asset.metadata.dbtTestsTotal }} failed.

triggers:
  - id: dbt_tests_failed
    type: io.kestra.plugin.ee.assets.EventTrigger
    assetType: io.kestra.plugin.ee.assets.Table
    events:
      - CREATED
      - UPDATED
    metadataQuery:
      - field: dbtTestStatus
        type: EQUAL_TO
        value: fail
```

The trigger has no `namespace` filter because the dbt models are Global assets, and a `namespace` filter never matches a Global asset. It listens to both `CREATED` and `UPDATED` so it also fires on a model's first run. Replace the `Log` task with your notification task, for example Slack or email.

Kestra writes output assets only for task runs that don't fail. If a failing test makes `dbt build` exit with an error, check that the model's metadata still updates in your setup before you rely on this alert. Tests with `severity: warn` let the run succeed and report `warn`.

## Verify the result

1. Open **Assets** and select `dbt.main.my_second_dbt_model`.
2. On the **Overview** tab, check that **Upstream Assets** lists `dbt.main.my_first_dbt_model` and **Downstream Assets** lists `reports.second_model_report`. **Asset Values** shows the dbt metadata, including `dbtTestStatus` if tests ran.
3. Open the **Dependencies** tab. The graph shows `my_first_dbt_model` → `my_second_dbt_model` → `second_model_report`, with the `dbt_build_with_lineage` flow attached. Use **Group by** and select **Plugins** to separate the dbt-produced assets from the Python-produced one.
4. Open the **Executions** tab to see both runs of the flow.

## Next steps

- Fivetran and BigQuery `RunTransferConfig` emit table IDs in the same `<database>.<schema>.<table>` format, so their tables join dbt sources automatically. See [Plugins that emit assets](../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#plugins-that-emit-assets).
- Start downstream flows when a model changes with [Run a flow when a table changes](../asset-event-triggers/index.md).
- Send this lineage to an OpenLineage tool with [Send asset lineage to OpenLineage](../asset-openlineage/index.md).
- Choose stable IDs and shared metadata keys with the [asset best practices](../../14.best-practices/13.assets/index.md).
- Look up every trigger and task in the [asset tasks and triggers reference](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md).
