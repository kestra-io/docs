---
title: No-Code Dashboards
icon: /docs/icons/ui.svg
editions: ["OSS", "EE", "Cloud"]
---

Build Dashboards without writing YAML.

## Overview

The No-Code Dashboard editor lets you design Kestra Dashboards directly in the UI using structured forms. It’s ideal for teams that want to create insightful dashboards quickly, empower non-developers to contribute, and maintain a smooth handoff to code.  
You can switch between No-Code and YAML views at any time — the editor automatically generates schema-validated YAML and stays synchronized with the live preview and documentation panels.

<div class="video-container">
  <iframe src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Why choose No-Code (or combine it with code)

- **Speed & accessibility**: Start creating dashboards without writing YAML — perfect for analysts, operators, or anyone new to Kestra.  
- **Visual clarity**: Live previews and real-time updates let you “see” your dashboard evolve as you edit.  
- **Consistency & governance**: Form-based configuration aligns with widget schemas and validation rules, ensuring consistent data representation and design standards across teams.  
- **No ceiling**: When you need advanced customization, switch to YAML to add filters, queries, or layout logic — all while keeping everything in sync within the same editor.  

## The Multi-Panel Dashboard Editor

- **No-Code View:** Form-based editing of dashboard widgets, layout, and data sources. Changes automatically generate YAML in real time.  
- **Dashboard Code View (YAML):** Full-featured editor with autocompletion, validation, and file sidebar.  
- **Charts Tab:** Displays all currently saved charts in the dashboard, providing a complete overview of existing visualizations.  
- **Preview Tab:** Shows in-progress charts as you design, allowing you to instantly review updates before saving.  
- **Documentation & Blueprints Panels:** In-context documentation and ready-to-use dashboard examples to help you get started faster.  

## Interactive demo

<div style="position: relative; padding-bottom: calc(48.9583% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/osPYHR3VcFqjZ1HDVF8A?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="No-Code Dashboard | Kestra" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

## Quick Start: Create Your First Dashboard in No-Code

To start building dashboards, navigate to the **Dashboards** tab. Click the **Default Dashboard** button at the top of the page (the name may vary depending on your instance) and select **+ Create Dashboard**.

![Create Dashboard](/docs/no-code/create-dashboard.png)

Next, you’ll see the Dashboard YAML editor. Select the **No Code** tab to open the No-Code panel editor. It will appear alongside the YAML editor so you can view both as you work.

![No-Code Dashboard Editor](/docs/no-code/no-code-dashboards.png)

## Build a chart

This example walks through creating a dashboard for the last year, starting with an **Executions Success Ratio KPI Chart**.  
Begin by giving your dashboard an ID, title, description, and time window. If the YAML editor is open, you’ll see every change in the No-Code form instantly reflected in code.

![Time Window](/docs/no-code/time-window.png)

Once those fields are set, click **+ Add** in the **charts** block to create your first chart.  
The first step is to choose a chart type. In this example, select **KPI Chart**.  
Each chart type has its own set of options and data representations — see the [Chart Plugin documentation](/plugins/core/chart) for full details.  
While editing, you can open the **Documentation** tab to view chart-specific guidance without leaving the editor.

![Documentation Multi-Panel](/docs/no-code/documentatio-view.png)

After selecting **KPI Chart**, give the chart an ID and select the type of data.  
In this example, choose **Executions**. To ensure all executions are captured, set the `field` property to `ID` and the `agg` property to `COUNT`. Optionally, set a display name or label for readability.

![KPI Chart](/docs/no-code/kpi-chart.png)

Next, add a filter for the execution data. Click **+ Add** under the data numerator section.  
For an execution success ratio, choose `IN` for the `type`, with `values` set to `STRING`.  
Add the value `SUCCESS` so the chart only considers successful executions. Under **Optional Properties**, set the `field` to `STATE`.

![Add Numerator](/docs/no-code/add-numerator.png)

Now that the correct data is connected to the chart, return to the `charts` No-Code tab and open **Optional Properties**.  
Set the `displayName` and change `numberType` to `PERCENTAGE` so the chart shows a ratio rather than a flat count.  
Adjust the `width` to your preference — a value of `3` is recommended for this type of chart.

![Chart Options](/docs/no-code/chart-options.png)

Once configured, open the **Preview** tab to view your chart.  
If satisfied with the result, click **Save** and continue building additional charts.  
For example, you can copy the YAML generated for the KPI Success Chart, paste it into the YAML editor, and replace `SUCCESS` with `FAILED` to create a chart for the execution failure ratio.

![Chart Preview](/docs/no-code/chart-preview.png)

For more example charts, see the [Dashboards documentation page](../08.ui/00.dashboard.md#create-a-new-custom-dashboard-as-code).

## Best Practices

### Organize dashboards by purpose
Group related charts into dashboards that serve a clear goal — for example, separate dashboards for **system health**, **execution performance**, and **user activity**. This keeps data focused and easier to interpret.

### Use consistent naming conventions
Use clear, descriptive IDs for dashboards and charts. A good pattern is `team_metric_type`, such as `dataops_executions_latency` or `marketing_pipeline_health`.
Consistent naming helps when searching, versioning, or exporting dashboards as code.

### Leverage YAML for advanced logic
When you need to reuse queries, apply filters dynamically, or control layout programmatically, switch to YAML mode. If a chart is similar to another with a small tweak of the filter or field, copy and paste the YAML to quickly change the field rather than rebuild with No-Code forms. The No-Code editor keeps everything synchronized, so you can safely go back and forth without losing your structure.

### Preview frequently
Use the **Preview** tab to verify data bindings and chart outputs before saving. This ensures filters and aggregations are configured correctly and helps catch mismatched fields early.
