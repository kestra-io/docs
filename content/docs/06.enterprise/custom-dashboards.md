---
title: Custom Dashboards
icon: /docs/icons/kestra.svg
editions: ["EE", "Beta"]
version: ">= 0.20.0"
docId: default
---

Build custom dashboards to visualize your executions, logs, and metrics.

## Overview

Dashboards let you define custom queries and charts to visualize data on your executions, logs, and metrics. Rather than relying only on the default dashboard on Kestra’s home screen, you can create charts that answer specific questions and track key metrics.

Note that during the Beta phase, this feature is only available to customers running Kestra with a Kafka/Elastic backend. Once released in GA, custom dashboards will be available to all Enterprise customers regardless of the backend.

## Dashboard page

The Dashboard page displays both the **default dashboard** and any **custom dashboards** you’ve created. To switch between dashboards, use the hamburger menu. If you have over 10 dashboards, type the dashboard name in the search bar to quickly find it. The same menu also lets you edit or delete existing dashboards.

![main_page](/docs/enterprise/dashboards/main_page.png)

## Create a new Dashboard as code

Clicking on the `+ Create new dashboard` button opens a code editor where you can define the dashboard layout and data sources as code.

Below is an example of a dashboard definition that displays executions over time and a pie chart of execution states:

```yaml
title: Getting Started
description: First custom dashboard
timeWindow:
  default: P7D
  max: P365D
charts:
  - id: executions_timeseries
    type: io.kestra.plugin.core.dashboard.chart.TimeSeries
    chartOptions:
      displayName: Executions
      description: Executions last week
      legend:
        enabled: true
      column: date
      colorByColumn: state
    data:
      type: io.kestra.plugin.core.dashboard.data.Executions
      columns:
        date:
          field: START_DATE
          displayName: Date
        state:
          field: STATE
        total:
          displayName: Executions
          agg: COUNT
          graphStyle: BARS
        duration:
          displayName: Duration
          field: DURATION
          agg: SUM
          graphStyle: LINES

  - id: executions_pie
    type: io.kestra.plugin.core.dashboard.chart.Pie
    chartOptions:
      graphStyle: DONUT
      displayName: Total Executions
      description: Total executions per state
      legend:
        enabled: true
      colorByColumn: state
    data:
      type: io.kestra.plugin.core.dashboard.data.Executions
      columns:
        state:
          field: STATE
        total:
          agg: COUNT
```

To see all available properties to configure a custom dashboard as code, see examples provided in the [Enterprise Edition Examples](https://github.com/kestra-io/enterprise-edition-examples) repository.

## Querying data

The `data` property of a chart defines the type of data that is queried and displayed. The `type` determines which columns are displayed.

Dashboards can query data from these source `types`:
- `type: io.kestra.plugin.core.dashboard.data.Executions`: data related to your workflow executions
- `type: io.kestra.plugin.core.dashboard.data.Logs`: logs produced by your workflows
- `type: io.kestra.plugin.core.dashboard.data.Metrics`: metrics emitted by your plugins

After defining the data source, specify the columns to display in the chart. Each column is defined by the `field` and may include additional optional properties.


| Property | Description                                                                                                    |
| --- |----------------------------------------------------------------------------------------------------------------|
| `field` | The only required field, specifies the name of the column in the data source to use                           |
| `displayName` | Sets the label displayed in the chart                                                                  |
| `agg` |  Defines the aggregation function applied to the column: supported aggregations include `AVG`, `COUNT`, `MAX`, `MIN`, `SUM` |
| `graphStyle` | Indicates the style of the graph displayed: supported styles include `LINES`, `BARS`, `POINTS`                          |
| `columnAlignment` | Specifies the alignment of the column in the table: supported alignments include `LEFT`, `RIGHT`, `CENTER`               |


You can also use the `where` property to set conditions that filter the result set before displaying it in the chart. Filters can apply to any column in the data source. For shared logic, use the `AND` operator in the `where` property to combine several conditions. If multiple conditions are needed with different logic, use the `type: OR` property.

Available filter types include:
- `CONTAINS`
- `ENDS_WITH`
- `EQUAL_TO`
- `GREATER_THAN`
- `GREATER_THAN_OR_EQUAL_TO`
- `IN`
- `IS_FALSE`
- `IS_NOT_NULL`
- `IS_NULL`
- `IS_TRUE`
- `LESS_THAN`
- `LESS_THAN_OR_EQUAL_TO`
- `NOT_EQUAL_TO`
- `NOT_IN`
- `OR`
- `REGEX`
- `STARTS_WITH`.

Available field types include the following columns:
- `ATTEMPT_NUMBER`
- `DATE`
- `DURATION`
- `END_DATE`
- `EXECUTION_ID`
- `FLOW_ID`
- `FLOW_REVISION`
- `ID`
- `LABELS`
- `LEVEL`
- `MESSAGE`
- `NAME`
- `NAMESPACE`
- `START_DATE`
- `STATE`
- `TASK_ID`
- `TASK_RUN_ID`
- `TRIGGER_ID`
- `TYPE`
- `VALUE`.

Note that some of the above are reserved only for specific types of `data` e.g. the `LEVEL` column is only available for `type: io.kestra.plugin.core.dashboard.data.Logs`.
