---
title: Executions in the Kestra UI – Inspect and Manage Runs
description: Inspect flow runs in the Kestra UI. Track execution status, view logs, analyze outputs, and manage tasks via Gantt and Topology views.
sidebarTitle: Executions
icon: /src/contents/docs/icons/ui.svg
---

Manage your Flow executions all in one place.

## Inspect and manage execution history

On the **Executions** page, you see a list of all your completed flow executions.

You can select multiple checkboxes to choose executions for bulk actions, such as Restart, Kill, Pause, or Force Run. Alternatively, you can click an execution ID or the magnifying glass icon to open an execution for further examination.

![Kestra User Interface Executions Page](./executions-overview.png)

## Overview

An **Execution's Overview** page displays the details of a flow execution. There is a wealth of information available here at a glance separated into compartments. For reference, below is an example flow and its **Execution Overview**.

```yaml
id: conditionallyReturnOutputs
namespace: company.team

labels:
  - key: environment
    value: dev
  - key: owner
    value: data-team
variables:
  description: This is a demo flow
  version: 1.0.0

inputs:
  - id: runTask
    type: BOOL
    defaults: true

tasks:
  - id: taskA
    runIf: "{{ inputs.runTask }}"
    type: io.kestra.plugin.core.debug.Return
    format: Hello World!

  - id: taskB
    type: io.kestra.plugin.core.debug.Return
    format: Fallback output

outputs:
  - id: flowOutput
    type: STRING
    value: "{{ tasks.taskA.state != 'SKIPPED' ? outputs.taskA.value : outputs.taskB.value }}"

triggers:
  - id: every_minute_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "* * * * *"
```

![Kestra User Interface Execution Page](./execution-results-overview.png)

From the **Overview** tab, you can:
- Set Labels: give a label to the execution for tracking or filtering.
- Change State: change the execution state.
- Force Run: forces the execution to run. It is possible that this action creates duplicate task executions so use with caution or take another action if possible.

The **Previous and Next Execution** buttons navigate you through past and future (if there's a trigger) flow executions.

- Execution **state** is displayed along with a timestamped state history from `CREATED` to `RUNNING` to `SUCCESS` (or any other possible state).
- Flow [Variables](../../05.workflow-components/04.variables/index.md) and [Inputs](../../05.workflow-components/05.inputs/index.md) are clearly listed along with execution details including dates and the corresponding namespace and flow.
- Flow Output and Trigger data is captured with expression rendering

Additionally, from the **Overview** page, you can also take actions on your execution such as [**Replay**](../../06.concepts/10.replay/index.md) or **Pause** and view the executions over time, switching between previous runs for comparison.

## Filters

From the main Executions page, you can filter the displayed executions on fields like namespace, flowId, labels, state, startDate, open text, and more. You can save applied filters and export the data all from the UI. The following video demonstrates the filters in action:

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/RwazDJghgx81hvQqOt5e?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Executions Filters | Kestra" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

## Gantt

The **Gantt** tab visualizes each task's duration. From this interface, you can replay a specific task, see task source code, change task status, or look at task metrics and outputs.

![Kestra User Interface Execution Gantt](./execution-gantt-view.png)

The **Gantt** view displays all successful and failed tasks in the execution. For failed tasks, you can open the task and click the three dots to **"Fix with AI"**. This option reopens the flow editor with the [AI Copilot](../../ai-tools/ai-copilot/index.md) prompted to help resolve any issues with the task.

![Fix with AI](../../ai-tools/ai-copilot/fix-with-ai-gantt.png)

## Logs

The **Logs** tab gives access to a task's logs. You can filter by log level, copy logs into your clipboard, or download logs as a file. Logs can be viewed per task in the **Default View** or temporally based on timestamp in the **Temporal View**.

![Kestra User Interface Execution Log](./execution-logs-view.png)

For failed tasks, click the three dots to **"Fix with AI"**. This option reopens the flow editor with the [AI Copilot](../../ai-tools/ai-copilot/index.md) prompted to help resolve any issues with the task.

![Fix with AI](./fix-with-ai-logs.png)

## Topology

Similar to the Editor view, you can see your execution's topology. **Topology** provides a graphical view to access specific task logs, replay certain tasks, or change task status. Tasks' state progression is shown and updated as the status changes. For example, green indicates a task has reached **SUCCESS** while red indicated **FAILED**.

![Kestra User Interface Execution Topology](./execution-topology-view.png)

From a **FAILED** task, click the magnifying glass icon to open the logs and read the error message, investigate, and **"Fix with AI"** if you have [AI Copilot](../../ai-tools/ai-copilot/index.md) configured.

## Outputs

The **Outputs** tab presents the execution's generated outputs. All tasks and their corresponding outputs are accessible from this page for examination and debugging. Outputs could be results or variables to pass onto downstream tasks, or files to download or pass downstream as a URI for processing. The example below downloads an outputted file generated from a SQL query.

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/BTW4jefHMCoxw5VgY9mB?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Execution Outputs | Kestra" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

The **Debug Expression** button allows you to evaluate [expressions](../../expressions/index.md) on those task outputs. It's a great way to ensure your actual output aligns with your expected output, and if not, it provides a place to debug your flows.

> Note: You have to select one task to be able to use the **Debug Expression** button.

![Kestra User Interface Execution Debug Expression](./execution-debug-expression.png)

For example, you can use the **Debug Expression** feature to deep-dive into your tasks' outputs and play directly with expressions.

## Metrics

The Metrics tab shows every metric exposed by tasks after execution. For example, a [BigQuery load task](/plugins/plugin-gcp/bigquery/io.kestra.plugin.gcp.bigquery.load) might show the amount of files inputted, rows inserted, and how long the operation took to complete. Another example, a flow using an AI plugin shows token usage as a metric for the task.

![Kestra User Interface Execution Metric](./execution-metrics-view.png)

## Dependencies

<div style="position: relative; padding-bottom: calc(48.95833333333333% + 41px); height: 0; width: 100%;"><iframe src="https://demo.arcade.software/k3WASzX7Oi0F1kRHOBKj?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="Dependencies | Kestra" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

The Dependencies tab shows the relationship dependencies between other flows and the selected execution. It also displays extra execution metadata such as state.

![Execution Dependencies](./executions-dependencies-1-0.png)
