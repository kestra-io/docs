---
title: Kestra 0.21
description: XXX.
date: 2025-02-04T17:00:00
category: News & Products Updates
author:
  name: Benoit Pimpaud
  image: bpimpaud
image: /blogs/release-0-21.png
---


Kestra 0.21.0 is here, introducing multiple highly requested features to your favorite open-source orchestration platform. This release adds XXX

Enterprise Edition users can now benefit XXX

The table below highlights the key features of this release.

| Feature                                          | Description                                                                                                                                                                               | Edition |
|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| --- |
| Log Shipper                                      | Forward Kestra logs to external destination                                                                                                 | Enterprise Edition |
| No Code                                          | New experience regarding no-code flow creation and task edition                                                                             | All Editions |
| Custom Dashboards                                | Create your own custom dashboards, tailored to your monitoring needs                                                                        | All Editions |
| Maintenance Mode                                 | Set your Kestra instance in maintenance mode to streamline server upgrades                                                                  |  Enterprise Edition |


Check the video below for a quick overview of the new features.

[PLACEHOLDER VIDEO RELEASE]

Let's dive into these highlights and other enhancements in more detail.

## Feature Highlights

### Log Shipper

We're excited to introduce Log Shipper, a powerful new feature that streamlines how you manage and distribute logs across your entire infrastructure. Whether you're using Elasticsearch, Datadog, Azure, or other logging platforms, you can now effortlessly ensure your logs are exactly where you need them, when you need them.

This log synchronization feature automatically batches your logs in optimal chunks and intelligently manages synchronization points. This means you get reliable, consistent log delivery without overwhelming your systems or missing critical data.

Log Shipper is build on top plugins, meaning it can be integrated with many log collectors. Launch day support includes integration with major observability and cloud platforms:  ElasticSearch, Datadog, New Relic, Azure, Google Cloud Plateform, AWS CloudWatch and OpenTelemetry. 

We're particularly excited about our OpenTelemetry integration. As an open-source observability framework, OpenTelemetry has emerged as the industry standard for telemetry data collection. This integration means you can forward logs to any platform supporting the OpenTelemetry protocol.

For example, here is a flow designed to send logs via Opentelemetry exporter to an Opentelemetry collector.

::collapse{title="Expand for a LogShipper example "}
```yaml
id: log_shipper
namespace: company.team

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"

tasks:
  - id: log_export
    type: io.kestra.plugin.ee.core.log.LogShipper
    logLevelFilter: INFO
    batchSize: 1000
    lookbackPeriod: P1D
    logExporters:
      - id: OTLPLogExporter
        type: io.kestra.plugin.ee.opentelemetry.LogExporter
        otlpEndpoint: http://localhost:4318/v1/logs
        authorizationHeaderName: Authorization
        authorizationHeaderValue: Bearer token
```
::



### New No Code Experience

Kestra's interface has always been its core strength, bridging the gap between no-code and traditional development approaches. 
While we've successfully supported both worlds, the no-code experience needed enhancement: today, we're excited to unveil a complete redesign of our no-code flow editor.

The new interface introduces intuitive left-side panels for flow properties and task management. We've simplified task configuration through organized drawers, making complex nested properties more accessible. A clear breadcrumb navigation helps you track your position within the configuration hierarchy.

[PLACEHOLDER IMAGE 1]
[PLACEHOLDER IMAGE 2]

### Custom Dashboards

Monitoring executions and get overview of what's going on in your automations is a keystone of orchestration. In this new release we doubled down on that promise: rather than relying only on the default dashboard on Kestra's home screen, you can create charts that answer specific questions and track key metrics. Everyone as different need, different service level threasholds. With custom dashboards you can now create tailored dashboards and focus on what matters the most to you.
As everything in Kestra, you can declare dashboards as code. Clicking on the + Create a new dashboard button opens a Code Editor where you can define the dashboard layout and data sources in code. Here's an example of a dashboard definition that displays executions over time and a pie chart of execution states:

::collapse{title="Expand for a Custom Dashboard Code example "}
```yaml
title: Data Team Executions
description: Data Executions dashboard
timeWindow:
  default: P30D # P30DT30H
  max: P365D

charts:
  - id: executions_timeseries
    type: io.kestra.plugin.core.dashboard.chart.TimeSeries
    chartOptions:
      displayName: Executions
      description: Executions duration and count per date
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
      where:
        - field: NAMESPACE
          type: STARTS_WITH
          value: data

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
      where:
        - field: NAMESPACE
          type: STARTS_WITH
          value: data
```
::

![custom dashboard editor screenshot](/blogs/custom_dashboard_editor.png)

To see all available properties to configure a custom dashboard as code, see examples provided in the [Enterprise Edition Examples repository](https://github.com/kestra-io/enterprise-edition-examples).


### Maintenance Mode

We're excited to announce Maintenance Mode, a new feature designed to simplify platform maintenance operations for Kestra installations running at scale. This feature addresses a common challenge faced by organizations running numerous workflows: finding the right moment to perform platform updates without disrupting ongoing operations.

When activated, Maintenance Mode introduces a controlled state where:

- The executor stops processing new executions. New flow executions are automatically queued.
- Existing executions are allowed to complete gracefully (workers complete their current tasks without picking up new ones).
- The platform continues to accept and schedule new executions, storing them for later processing (web server and scheduler components remain active, ensuring no requests are lost).
- New executions are queued for processing after maintenance concludes


You can enter in Maintenance Mode via the `Administration > Instance` panel of you Kestra instance.

## User Interface & Experience Improvements

As with each release, we continued to improve the interface elements, colors and user motion:

- Improvements in the UI: 
  - Filters ans search bars are now consistent across the different panels
  - We also fixed some UI paddings, buttons, and colors.

- Improvments for Apps:
  - Apps can now be previewed in the corresponding editor
  - Apps can be declared via Terraform definitions
  - [TBD] Access Group?
  - [TBD] mention UI improvements (bulk action & co)?

- Introduce system labels for restarted and replayed execution - https://github.com/kestra-io/kestra/issues/6682
- [TBD] Contextual In-Apps documentation
- [TBD] Resource Type filter in AuditLogs - https://github.com/kestra-io/kestra-ee/issues/1403
- Subflow restart behavior

## Other Features and Improvements

- [TBD] Dynamic Properties in every task (but not for trigger)
- [TBD] Notification plugin improvement - https://github.com/kestra-io/plugin-notifications/issues/171
- [TBD] Update Terraform ressources
- [TBD] taskrun.iteration in ForEach - https://github.com/kestra-io/kestra/issues/4842
- [TBD] New `finally` properties that run at the end regardless of the final state - https://github.com/kestra-io/kestra/issues/6649

## New Tasks & Plugins

### DuckDB Fixes

We have fixed a [long running issue](https://github.com/kestra-io/plugin-jdbc/issues/165) regarding the DuckDB version used in Kestra. Now Kestra support the latest version of DuckDB!


### New Exit task

[TBD] https://github.com/kestra-io/kestra/issues/5599

### New Write task

The Write task takes your string input and saves it as a file in Kestra's internal storage. The task returns a URI pointing to the newly created file, which you can easily reference in subsequent tasks.
This particuliarly useful when you want to store messages that come as a string to files that could be later passed on as uri further down the flow for further processing.

[TBD LINK TO PLUGIN DOC]

https://github.com/kestra-io/kestra/issues/6524

### New AI plugins

[TBD] **HuggingFace Inference**  https://github.com/kestra-io/kestra/issues/6352 
[TBD] LangChain task

### New AWS EMR plugin
[TBD; see blueprints] https://github.com/kestra-io/blueprints/pull/21

### New Pebble functions

`randomInt` - you can now [generate a random integer](https://github.com/kestra-io/kestra/issues/6207) with the `randomInt` function in Pebble.

`uuid` - you can [generate a UUID](https://github.com/kestra-io/kestra/issues/6208) with the new `uuid` function in Pebble.

`distinct` - you can now [get the uniq set of values](https://github.com/kestra-io/kestra/issues/6417) from an array with the new `distinct` function in Pebble.

`"{{ ['1', '1', '2', '3'] | distinct }}"`


## Thanks to Our Contributors

A big thanks to all the contributors who helped make this release possible. Your feedback, bug reports, and pull requests have been invaluable.

If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues).

## Next Steps

This post covered new features and enhancements added in Kestra 0.21.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
