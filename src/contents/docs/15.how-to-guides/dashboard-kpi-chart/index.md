---
title: Build a KPI Success Ratio Chart in Kestra Dashboards
h1: Build a KPI Success Ratio Dashboard Chart
icon: /src/contents/docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Kestra Concepts
description: Build a KPI success ratio chart in Kestra using the No Code dashboard editor, then extend it to track failure rates.
---

Build a KPI chart that displays the percentage of successful executions using Kestra's No Code dashboard editor.

## Prerequisites

- A Kestra instance with at least one completed execution.
- Access to the **Dashboards** section in the UI.

## Steps

### 1. Open the dashboard editor

From **Dashboards**, select **Default Dashboard** and click **+ Create Dashboard**.

![Create Dashboard](./create-dashboard.png)

In the editor, select the **No Code** tab. It appears alongside the YAML editor so you can view both as you work.

![No Code Dashboard Editor](./no-code-dashboards.png)

### 2. Set the dashboard properties

Give your dashboard an ID, title, description, and time window. Changes in the No Code form immediately reflect in the YAML editor.

![Time Window](./time-window.png)

### 3. Add a KPI chart

Click **+ Add** in the **charts** block. Choose **KPI Chart** as the chart type. Open the **Documentation** tab at any time to view chart-specific guidance without leaving the editor.

![Documentation Multi-Panel](./documentation-view.png)

Give the chart an ID and set the data type to **Executions**. Set `field` to `ID` and `agg` to `COUNT` to count all executions.

![KPI Chart](./kpi-chart.png)

### 4. Add a numerator filter

Click **+ Add** under the numerator section. Set `type` to `IN`, add `SUCCESS` as a value, and set `field` to `STATE`. This scopes the numerator to successful executions — the denominator remains all executions.

![Add Numerator](./add-numerator.png)

### 5. Set display options

Return to the `charts` No Code tab and open **Optional Properties**. Set `displayName`, change `numberType` to `PERCENTAGE`, and set `width` to `3`.

![Chart Options](./chart-options.png)

### 6. Preview and save

Open the **Preview** tab to review the chart. Click **Save** when satisfied.

![Chart Preview](./chart-preview.png)

## Extend: add a failure ratio chart

To add a failure ratio chart alongside the success ratio, copy the generated YAML for the KPI chart, paste it into the YAML editor as a second chart entry, and replace `SUCCESS` with `FAILED`. The two charts will sit side by side on the dashboard.

## Best practices

**Organize by purpose.** Group related charts into dashboards with a clear goal — for example, separate dashboards for system health, execution performance, and user activity.

**Use consistent naming.** A pattern like `team_metric_type` (e.g., `dataops_executions_latency`) makes dashboards easier to find, version, and export.

**Use YAML for reuse.** When charts share the same structure with small differences in filters or fields, copy-paste the YAML and modify — faster than rebuilding forms.

**Preview before saving.** Catch mismatched fields and aggregation errors early before they make it into a published dashboard.

## Next steps

See the [Dashboards reference](../../09.ui/00.dashboard/index.md) for the full list of chart types, data source fields, and filter options.
