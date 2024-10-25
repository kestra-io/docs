---
title: Custom Dashboards
icon: /docs/icons/kestra.svg
editions: ["EE"]
version: ">= 0.20.0"
---

Build custom dashboards to visualize your executions, logs and metrics.

## Overview

Dashboards allow you to define custom queries and charts to visualize data about your executions, logs and metrics. Instead of relying solely on the default dashboard provided by Kestra on the home screen, you can build charts that answer specific questions and monitor key metrics.

## Dashboards Page

The **Dashboards** page is your central hub for creating and managing dashboards. Here, you’ll find a table listing all available dashboards, along with a `+ Create` button to add new ones.

## Creating a Dashboard as Code

When you click on the `+ Create` button, you’ll be taken to a Code Editor where you can define the dashboard layout and data sources as code.

Here’s an example of a dashboard definition that will display executions per project:

```yaml
id: mydashboard
title: Executions per project
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
      title: Executions per project
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
title: Executions per country
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
      title: Executions per country over time
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
      title: Executions per country over time
      description: Count executions per country label and execution state # optional icon on hover
    markdownContent: |
      ## This is a markdown panel

  - id: executions_per_country
    type: io.kestra.plugin.core.dashboards.BarChart
    panelOptions:
      title: Executions per country
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
      title: Executions per country
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
      title: Executions per country
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

The `data` property of a chart defines the type of data that will be queried and displayed in the chart. The `type` of data determines the columns that can be displayed in the chart.

Dashboards can query data from the following source `types`:
- `type: io.kestra.plugin.core.dashboards.data.Executions`: data related to your workflow executions
- `type: io.kestra.plugin.core.dashboards.data.Logs`: logs produced by your workflows
- `type: io.kestra.plugin.core.dashboards.data.Metrics`: metrics emitted by your plugins.

Once you define the data source, you can specify the columns to display in the chart. Each column is defined by the `field` and additional optional properties:

| Property | Description                                                                                                         |
| --- |---------------------------------------------------------------------------------------------------------------------|
| `field` | The name of the column in the data source. This is the only required field.                                         |
| `displayName` | The label that will be displayed in the chart                                                                       |
| `agg` | The aggregation function to apply to the column. Supported aggregations include `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` |
| `graphStyle` | The style of the graph to display. Supported styles include `LINES`, `BARS`, `POINTS`                               |
| `columnAlignment` | The alignment of the column in the table. Supported alignments include `LEFT`, `RIGHT`, `CENTER`                    |


Additionally, using the `where` property, you can specify conditions to filter the result set before displaying it in the chart. Filters can be applied to any column in the data source. All conditions listed in the `where` property are combined using the `AND` operator. If you need to define multiple conditions, use the `type: OR` property. Here are the available filter types:
- `EQUAL_TO`
- `NOT_EQUAL_TO`
- `GREATER_THAN`
- `LESS_THAN`
- `GREATER_THAN_OR_EQUAL_TO`
- `LESS_THAN_OR_EQUAL_TO`
- `BETWEEN`
- `IS_EMPTY`
- `NOT_EMPTY`
- `OR`
- `IN`
- `NOT_IN`
- `STARTS_WITH`
- `ENDS_WITH`


## Adding Global Filters

Top-level filters allow you to refine dashboard data across all charts. Filters include:

- **Namespace**: multiselect dropdown
- **Labels**: multiselect dropdown
- **Date range**: date range selector
- **Refresh**: whether to update the dashboard data in real-time or on-demand, similar to the main dashboard.

These filters help narrow down data across all charts without modifying the code each time.
