---
title: "Plugin Artifacts and Assets in Kestra: Data vs Display"
h1: How Plugins Write Data as Assets and Display It with Artifacts
description: Understand how Kestra plugins write data as assets and display data with artifacts. Learn where artifacts appear and how the two work together.
sidebarTitle: Plugin Artifacts and Assets
icon: /src/contents/docs/icons/concepts.svg
version: ">= 2.1.0"
---

Plugins extend Kestra in two complementary ways: they write data as assets, and they display data with artifacts.

An asset is a record that a plugin's tasks write about a resource, such as a table or a file: its metadata and its links to the flows and other assets around it. A plugin artifact is front-end code that a plugin ships so that Kestra can display that plugin's data in the UI, in places Kestra reserves for plugins. Assets hold the data. Artifacts decide how a plugin shows it.

## At a glance

| | Plugin artifact | Asset |
|---|---|---|
| What it is | A UI component bundled in a plugin | A record of a resource, with metadata and lineage |
| Who creates it | The plugin developer, once for the plugin | Tasks that declare or emit assets when they run, or you, from the UI or API |
| What it holds | Nothing. It displays the data Kestra passes to it. | Metadata, kept until you delete or purge the asset |
| Where you see it | Slots in the UI: task nodes and task details in the topology, and asset cards in the dependency graph | The **Assets** page, an asset's **Dependencies** tab, and the **Assets** tab of an execution or namespace |
| Edition | All editions. A plugin can mark an artifact as Enterprise-only. | Enterprise Edition and Kestra Cloud |

## Where artifacts appear

Kestra renders artifacts in slots. A plugin declares which slots its artifacts fill, and Kestra loads the matching artifact wherever that slot appears. You don't configure artifacts in your flows: if a plugin you use ships one, it appears automatically.

| Slot | Where it appears | What the artifact receives |
|---|---|---|
| `topology-details` | Inside a task's node in the topology: the flow editor, the execution **Topology** tab, and blueprints | The task definition and, in an execution, the task run's outputs, metrics, and live progress |
| `topology-task-modal` | A full-screen dialog opened from a task node | The same data as `topology-details` |
| `topology-task-drawer` | The task drawer in the flow editor | The same data as `topology-details` |
| `asset-card-footer` | Below an asset's card in the dependency graph | The asset's ID, type, and metadata, and the current tenant |

For the topology slots, Kestra picks the artifact from the task's type, or from its task runner's type when the runner ships its own artifact.

<!-- TODO: asset-card-footer currently picks the artifact from the task type that produced the asset
     (DagCanvas.vue on develop). The 2026-10-20 Artifacts & Assets meeting decided to match on
     asset type instead, with plugin-specific asset types (e.g. dbt model, test, snapshot, seed).
     Describe the matching rule here once that change lands in core. -->

To build an artifact, see [Develop Plugin Artifacts](../../plugin-developer-guide/10.plugin-ui/index.md).

## How assets and artifacts work together

The `asset-card-footer` slot connects the two. When a task runs, its plugin writes values to the asset's metadata, and the plugin's artifact displays those values below the asset's card. The metadata stays on the asset, so the card shows the asset's latest state across executions. You can check the health of every asset across your flows from the dependency graph, and open an execution only when something needs attention.

:::alert{type="info"}
Assets, including the `asset-card-footer` slot, are available in Enterprise Edition and Kestra Cloud.
:::

Asset metadata also drives flows. An [`EventTrigger`](../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#eventtrigger) can filter on metadata values to start a flow when an asset changes, for example when a test result written to the asset reports a failure.

## Choosing what to build

If you develop a plugin, the two features cover different needs:

- **Write asset metadata** for data that must outlast a single execution, appear alongside lineage, or trigger flows. Emit assets with `runContext.assets().emit(...)`. Emitted assets are recorded only when the task sets `assets.enableAuto: true`.
- **Build an artifact** to display data: a task run's results in the topology, or an asset's metadata on its card.

An artifact displays the data Kestra passes to it, such as a task run's outputs and metrics or an asset's metadata, and doesn't call the Kestra API itself. When an artifact needs more data, the data should come from the task: as an output for a task run, or as metadata for an asset.

<!-- TODO: dbt worked example. Add once these ship:
     - plugin-dbt#350 (DbtCLI) and plugin-dbt#351 (dbt Cloud): run and test summaries in the topology
     - plugin-dbt emitting dbt-specific asset types instead of io.kestra.plugin.ee.assets.Table
     - kestra-ee#11726: dbt asset-card-footer artifact showing test status (dbtTestStatus, dbtTestsTotal, dbtTestsFailed)
     - artifact-sdk#88: asset-card-footer published in the artifact SDK
     Show one DbtCLI run: the topology artifact for the run, and the footer on the model's asset card.
     Include screenshots of both. -->
