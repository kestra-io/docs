---
title: Custom Dashboards
icon: /docs/icons/kestra.svg
editions: ["EE"]
version: ">= 0.20.0"
---

Build custom dashboards to visualize your executions, logs and metrics.

## Overview

Dashboards let you define custom queries and charts to visualize data on your executions, logs, and metrics. Rather than relying only on the default dashboard on Kestra’s home screen, you can create charts that answer specific questions and track key metrics.

## The Dashboard Page

The Dashboard page displays both the **default dashboard** and any **custom dashboards** you’ve created. To switch between dashboards, use the hamburger menu. If you have over 10 dashboards, simply type the dashboard name in the search bar to quickly find it. The same menu also lets you edit or delete existing dashboards.

![main_page](/docs/enterprise/dashboards/main_page.png)

The `+ Create a new dashboard` button lets you set up a new dashboard defined directly as code.

## Create a new Dashboard as Code

Clicking on the `+ Create a new dashboard` button opens a Code Editor where you can define the dashboard layout and data sources in code.

Here's an example of a dashboard definition that displays executions per project:

```yaml
id: mydashboard
displayName: Executions per project
description: Count executions per project and execution state

timeWindow:
  default: P30D
  max: P365D

charts:
  - id: time_series
    type: io.kestra.plugin.core.dashboards.TimeSeries
    timeseries:
      column: executionDate
    panelOptions:
      displayName: Executions per project
    data:
      type: io.kestra.plugin.core.dashboards.data.Executions
      columns:
        project:
          field: label.project
          displayName: Project
        state:
          field: execution.state
          displayName: Execution State
        executionDate:
          field: execution.startDate
          displayName: Execution Date
        duration: # right vertical axis
          field: execution.duration
          displayName: Execution Duration
          agg: SUM
          graphStyle: LINES
        total: # left vertical axis
          field: execution
          displayName: Total Executions
          agg: COUNT
          graphStyle: BARS # LINES, BARS, POINTS
```

To see all available properties to configure a custom dashboard as code, expand the example below.

::collapse{title="Complete Configuration for a Dashboard Definition"}
```yaml
id: countries
displayName: Executions per country
description: Count executions per country label and execution state
timeWindow:
  default: P30D # P30DT30H
  max: P365D

charts:
  - id: time_series
    type: io.kestra.plugin.core.dashboards.TimeSeries
    timeseries:
      column: executionDate
    panelOptions:
      displayName: Executions per country over time
      description: Count executions per country label and execution state # optional icon on hover
      tooltip: ALL # ALL, NONE, SINGLE
      legend:
        enabled: true # later on possible to extend it e.g. position AUTO, LEFT, RIGHT, TOP, BOTTOM
      # colorScheme: CLASSIC # PURPLE - TBD - we may sync with the Settings color scheme as in the main dashboard
    data:
      type: io.kestra.plugin.core.dashboards.data.Executions # also: Logs and Metrics available
      columns:
        executionDate:
          field: execution.startDate
          displayName: Execution Date
        country:
          field: label.country
          displayName: Country
          # alternative definition timeseries: true
        state:
          field: execution.state
          displayName: Execution State
        duration: # right vertical axis
          field: execution.duration
          displayName: Execution Duration
          agg: SUM
          graphStyle: LINES # LINES, BARS, POINTS
        total: # left vertical axis
          field: execution
          displayName: Total Executions
          agg: COUNT
          graphStyle: BARS # LINES, BARS, POINTS
      where:
        - field: namespace
          type: IN
          value:
            - aimtec.production
            - aimtec.partners
      orderBy:
        total: DESC
        duration: ASC

  - id: markdown_section
    type: io.kestra.plugin.core.dashboards.charts.Markdown
    panelOptions:
      displayName: Executions per country over time
      description: Count executions per country label and execution state # optional icon on hover
    markdownContent: |
      ## This is a markdown panel

  - id: executions_per_country
    type: io.kestra.plugin.core.dashboards.BarChart
    panelOptions:
      displayName: Executions per country
      description: Count executions per country label and execution state # optional icon on hover
      tooltip: ALL # ALL, NONE, SINGLE
      legend:
        enabled: true # later on possible to extend it e.g. position AUTO, LEFT, RIGHT, TOP, BOTTOM
      # colorScheme: CLASSIC # PURPLE - TBD - we may sync with the Settings color scheme as in the main dashboard
    axes:
      horizontal:
        - column: namespace
          limit: 100
        - column: state
          limit: 10
    data:
      type: io.kestra.plugin.core.dashboards.data.Executions
      columns:
        namespace:
          field: namespace
          displayName: Namespace
        state:
          field: execution.state
          displayName: Execution State
        total: # left vertical axis
          field: execution
          displayName: Total Executions
          agg: COUNT
      orderBy:
        total: DESC

  - id: total_executions_per_country
    type: io.kestra.plugin.core.dashboards.charts.PieChart
    panelOptions:
      displayName: Executions per country
      description: Count executions per country label and execution state
      graphStyle: PIE # PIE, DONUT - donutdefault
      legend:
        enabled: true # later on possible to extend it e.g. position AUTO, LEFT, RIGHT, TOP, BOTTOM
      # colorScheme: CLASSIC # PURPLE - TBD - we may sync with the Settings color scheme as in the main dashboard
    data:
      type: io.kestra.plugin.core.dashboards.data.Executions
      columns:
        country:
          field: label.country
          displayName: Country
        total:
          field: execution
          agg: COUNT
          displayName: Total Executions

  - id: table
    type: io.kestra.plugin.core.dashboards.charts.Table
    panelOptions:
      displayName: Executions per country
      description: Count executions per country label and execution state
      header:
        enabled: true # header = column names; in the future can add customization
      pagination:
        enabled: true # in the future: possible to add page size
    data:
      type: io.kestra.plugin.core.dashboards.data.Executions
      columns:
        country:
          field: label.country
          displayName: Country
          columnAlignment: LEFT #  RIGHT, CENTER
        project:
          field: label.project
        env:
          field: label.env
        state:
          field: execution.state
          displayName: Execution State
        total: # left vertical axis
          field: execution
          agg: COUNT # we group by all columns that don't have aggregation
          displayName: Total Executions
        duration:
          field: execution.duration
          agg: SUM
      where:
        - field: namespace
          type: IN
          value:
            - aimtec.production
            - aimtec.partners
        - field: duration
          type: GREATER_THAN_OR_EQUAL_TO
          value: 30
        - type: OR
          value:
            - field: execution.state
              type: EQUAL_TO
              value: CREATED
            - field: label.country
              type: EQUAL_TO
              value: Italy
      orderBy:
        total: DESC
        duration: ASC
```
::

## Querying Data

The `data` property of a chart defines the type of data that will be queried and displayed. The `type` determines which columns are available for display.

Dashboards can query data from these source `types`:
- `type: io.kestra.plugin.core.dashboards.data.Executions`: data related to your workflow executions
- `type: io.kestra.plugin.core.dashboards.data.Logs`: logs produced by your workflows
- `type: io.kestra.plugin.core.dashboards.data.Metrics`: metrics emitted by your plugins

After defining the data source, specify the columns to display in the chart. Each column is defined by the `field` and may include additional optional properties.


| Property | Description                                                                                                         |
| --- |---------------------------------------------------------------------------------------------------------------------|
| `field` | The name of the column in the data source. This is the only required field.                                         |
| `displayName` | The label that will be displayed in the chart                                                                       |
| `agg` | The aggregation function to apply to the column. Supported aggregations include `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` |
| `graphStyle` | The style of the graph to display. Supported styles include `LINES`, `BARS`, `POINTS`                               |
| `columnAlignment` | The alignment of the column in the table. Supported alignments include `LEFT`, `RIGHT`, `CENTER`                    |


You can also use the `where` property to set conditions that filter the result set before displaying it in the chart. Filters can apply to any column in the data source, with all conditions in the `where` property combined using the `AND` operator. If multiple conditions are needed with different logic, you can use the `type: OR` property.

Available filter types include:
- `EQUAL_TO`
- `NOT_EQUAL_TO`
- `GREATER_THAN`
- `LESS_THAN`
- `GREATER_THAN_OR_EQUAL_TO`
- `LESS_THAN_OR_EQUAL_TO`
- `IS_NULL`
- `NOT_NULL`
- `OR`
- `IN`
- `NOT_IN`
- `STARTS_WITH`
- `ENDS_WITH`

## Adding Global Filters

Top-level filters let you refine data across the entire dashboard, applying to all charts. Available filters include:

- **Namespace**: multiselect dropdown
- **Labels**: multiselect dropdown
- **Date range**: date range selector
- **Refresh**: controls whether to update dashboard data in real-time or on-demand, similar to the main dashboard.

These filters will filter data across all charts without any code changes.
