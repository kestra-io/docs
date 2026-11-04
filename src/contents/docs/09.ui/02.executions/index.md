---
title: Executions in the Kestra UI – Inspect and Manage Runs
h1: Track, Inspect & Manage Flow Runs via Gantt and Topology Views
description: Inspect flow runs in the Kestra UI. Track execution status, view logs, analyze outputs, and manage tasks via Gantt and Topology views.
sidebarTitle: Executions
icon: /src/contents/docs/icons/ui.svg
---

The **Executions** page lists all flow executions across the tenant.

Selecting one or more executions enables bulk actions (Restart, Kill, Pause, Force Run). An execution ID opens to the execution detail view.

![Kestra User Interface Executions Page](./executions-overview.png)

## Overview

The **Overview** tab displays the details of a flow execution.

![Kestra User Interface Execution Page](./execution-results-overview.png)

The **Overview** tab provides these actions:
- **Set Labels** — adds a label to the execution for tracking or filtering.
- **Change State** — manually updates the execution state.
- **Force Run** — forces the execution to run. May create duplicate task executions.

The **Previous** and **Next Execution** buttons step through past and scheduled future executions.

- Execution **state** is displayed along with a timestamped state history from `CREATED` to `RUNNING` to `SUCCESS` (or any other possible state).
- Flow [Variables](../../05.workflow-components/04.variables/index.md) and [Inputs](../../05.workflow-components/05.inputs/index.md) are clearly listed along with execution details including dates and the corresponding namespace and flow.
- Flow outputs and trigger data are captured with expression rendering.

The **Overview** tab also supports [**Replay**](../../15.how-to-guides/replay/index.md) and **Pause**, and displays execution history for comparing previous runs.

The Overview tab also embeds a **topology diagram** showing each task's state in the execution graph — green for `SUCCESS`, red for `FAILED`. Click any task node to access its logs, replay it, or change its status.

## Filters

Executions can be filtered by namespace, flow ID, labels, state, start date, or free text. Applied filters can be saved and results exported. The following video demonstrates the filters in action:

<div style="position: relative; padding-bottom: calc(54.828% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/1zqBYvR7JifFkwNSa7Qh?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Executions | Kestra EE" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write; autoplay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

## Timeline

:::badge{version=">=2.1" editions="OSS,EE,Cloud"}
:::

The chart at the top of the Executions page has two modes: **Counts**, which shows the number of executions per state over time, and **Timeline**, which draws each execution as a bar from its start date to its end date. Use the timeline to spot overlapping runs, gaps in a schedule, or an execution that held a concurrency slot longer than expected. Kestra remembers the mode you last picked.

- **Rows**: executions are grouped by namespace. Click a namespace to drill into its flows; the breadcrumb shows the total and failed run counts for the current level.
- **Bars**: each bar takes its color from the execution state, and running executions extend to the current time. When a row has too many executions to draw individually, bars are aggregated into buckets tinted by the most common state. Zoom in for execution-level detail.
- **Bar details**: click a bar to see its namespace, flow, state, and dates, then **Open execution** or **Show only this flow**.
- **Legend**: shows the count per state. Click a state to dim it.
- **Time range**: zoom, pan, or jump to **Now** from the toolbar, or drag across the density bar to select a range. The default range is 24 hours, from 5 minutes up to 1 year.

The filters applied to the Executions page also apply to the timeline. The timeline loads at most 1,000 executions, newest first; narrow the time range or filters to see the rest.

<!-- TODO: screenshot. kestra#19334 merged to develop 2026-10-30, not in the v2.1.x RC cut; confirm it ships in 2.1 GA. Not verified: which filters the density bar ignores. -->

## Gantt

The **Gantt** tab visualizes each task's duration. From this view, a specific task can be replayed, its source code viewed, status changed, or metrics and outputs inspected.

![Kestra User Interface Execution Gantt](./execution-gantt-view.png)

The **Gantt** view displays all successful and failed tasks in the execution. For failed tasks, use **Fix with AI** from the task menu to open the flow editor with [AI Copilot](../../develop-with-ai/01.ai-copilot/index.md) pre-loaded with the error context.

## Logs

The **Logs** tab displays task logs, filterable by log level. Logs can be copied to clipboard or downloaded as a file. Logs can be viewed per task in the **Default View** or temporally based on timestamp in the **Temporal View**.

![Kestra User Interface Execution Log](./execution-logs-view.png)

For failed tasks, use **Fix with AI** from the task menu to open the flow editor with [AI Copilot](../../develop-with-ai/01.ai-copilot/index.md) pre-loaded with the error context.

![Fix with AI](./fix-with-ai-logs.png)

## Input/Output

The **Input/Output** tab shows execution inputs and all task outputs — variables to pass downstream or files to download and inspect. The example below downloads a file generated from a SQL query.

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/BTW4jefHMCoxw5VgY9mB?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Execution Outputs | Kestra" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

The **Debug Expression** button evaluates [expressions](../../expressions/index.mdx) against task outputs. A task must be selected first to enable it.

![Kestra User Interface Execution Debug Expression](./execution-debug-expression.png)

## Metrics

The **Metrics** tab shows every metric exposed by tasks after execution. For example, an HTTP Request task emits `request.bytes`, `response.bytes`, and `response.length` per request. A BigQuery load task might expose rows inserted and bytes processed. An AI plugin task might show token usage.

![Kestra User Interface Execution Metric](./execution-metrics-view.png)

## Dependencies

The **Dependencies** tab shows the relationship between other flows and the selected execution, including extra execution metadata such as state.

![Execution Dependencies](./executions-dependencies-1-0.png)
