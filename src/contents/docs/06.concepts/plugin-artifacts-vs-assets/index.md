---
title: "Plugin Artifacts vs Assets in Kestra"
h1: Plugin Artifacts and Assets, and When to Use Each
description: Understand the difference between plugin artifacts and assets in Kestra. Artifacts show one task run in the topology; assets track resources across flows.
sidebarTitle: Plugin Artifacts vs Assets
icon: /src/contents/docs/icons/concepts.svg
version: ">= 2.0.0"
---

<!-- DRAFT: title, h1, and description are placeholders for the SEO lead to replace. -->

Plugin artifacts and assets can both show a graph of the same data, but they answer different questions.

A plugin artifact shows what happened in one run of one task. An asset records a resource your workflows touch, such as a table, a file, or a virtual machine, and tracks it across every flow and execution that produces or consumes it.

## At a glance

| | Plugin artifact | Asset |
|---|---|---|
| What it is | A UI component that a plugin ships to display a task | A stored record of a resource, with its relations to flows and other assets |
| Scope | One task in one flow or execution | The whole tenant, across flows and executions |
| Lifetime | Rendered on demand from the task run's data; stores nothing of its own | Persisted until you delete or purge it |
| Where you see it | The topology view: task nodes, the task drawer, and the task detail modal | The **Assets** page, an asset's **Dependencies** tab, and the **Assets** tab of an execution or namespace |
| Who controls it | The plugin developer who builds it | The flow author, by declaring `assets` on a task |
| Edition | Open source, Enterprise, and Cloud. A plugin can mark an individual artifact as Enterprise-only. | Enterprise and Cloud |

## Plugin artifacts: a view of one task run

A [plugin artifact](../../plugin-developer-guide/10.plugin-ui/index.md) is a Vue.js component bundled in a plugin's JAR. Kestra loads it into the topology view whenever a task of that type appears, so the task node can show something more useful than its type and configuration, such as a query's cost, a step-by-step progress indicator, or a full-screen breakdown of a task runner's phases.

An artifact has no storage of its own. In the flow editor, it renders the task's configuration. In an execution, it also reads that task run's outputs, metrics, and live progress. Open a different execution and the same artifact shows that run instead. If an execution's outputs are purged, the artifact has nothing left to show for it.

You don't configure artifacts in your flow. If the plugin you use ships one, it appears automatically.

## Assets: a record across flows and executions

An [asset](../../07.enterprise/02.governance/01.assets/index.md) is a named resource that your tasks read from or write to. Tasks declare assets with the `assets` property, either explicitly through `inputs` and `outputs` or automatically with `enableAuto: true` on plugins that support it.

Kestra stores each asset and connects it to the flows that produce and consume it and to the assets upstream and downstream of it. That record outlives any single execution, so assets support features that depend on history:

- Lineage across flows, including resources that a different team's flow produces.
- Freshness states based on the producing flow's schedule.
- Lifecycle triggers, TTL, and locks.
- Export to lineage platforms through OpenLineage.

:::alert{type="info"}
Assets are available in Kestra Enterprise Edition and Kestra Cloud.
:::

## Which one answers your question

| Question | Look at |
|---|---|
| What did this task do in this run? How long did it take, and what did it cost? | The plugin artifact in the execution topology |
| Where is this task right now while it runs? | The plugin artifact's live progress |
| Which flows write to this table, and which read from it? | The asset's **Dependencies** tab |
| Is this table stale? Did the last flow that produced it fail? | The asset's freshness state |
| What breaks downstream if this resource changes? | The asset's **Dependencies** tab |

The two are not alternatives. A single task can have an artifact and emit assets at the same time, and each view stays accurate for its own scope.

## Example: dbt

<!-- TODO: complete when plugin-dbt#350 (DbtCLI) and plugin-dbt#351 (dbt Cloud) ship.
     Confirm the user-facing labels in the Show details drawer, the artifact's edition
     (distribution OSS or EE), and add screenshots of the topology box, the model graph,
     and the asset Dependencies tab for the same run. -->

A `DbtCLI` task with `assets.enableAuto: true` produces both views from the same `manifest.json` and `run_results.json`.

The dbt plugin artifact shows the dbt run itself: model and test counts on the task node, and a model graph colored by each model's status in that run. It answers "which model failed in this run, and what depended on it?"

The assets view shows each model, seed, and snapshot as a `Table` asset, connected to the flows and assets around it. A dbt model's asset can sit downstream of a table that an ingestion flow loads and upstream of a dashboard that a BI flow refreshes. dbt test results are stored on the model's asset as metadata, so an [`EventTrigger`](../../07.enterprise/02.governance/01.assets/index.md#operational-automation) can react to failing tests. It answers "where does this table come from, who uses it, and is it fresh?"

## For plugin developers: build an artifact, emit assets, or both

When you add a task to a plugin, the two features cover different needs:

- Build a [plugin artifact](../../plugin-developer-guide/10.plugin-ui/index.md) when users need a better view of what your task did in a run, such as a summary of its outputs, a domain-specific graph, or live progress.
- Emit assets with `runContext.assets().emit(...)` when your task creates, modifies, or reads a resource that users want to track over time. Emitted assets are recorded only when the user sets `assets.enableAuto: true` on the task, and only on Enterprise Edition and Cloud.

A task that transforms data, like `DbtCLI`, often warrants both.
