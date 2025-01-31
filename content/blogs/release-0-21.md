---
title: Kestra 0.21 introduces Custom Dashboards, new No Code experience and Log Shipper for logs synchronization over your entire infrastructure
description: Elevate yourn platform with a no-code workflow creation experience, new customizable operation dashboards, advanced infrastructure-wide log forwarding, and a suite improvements that streamline workflow management.
date: 2025-02-04T17:00:00
category: News & Products Updates
author:
  name: Benoit Pimpaud
  image: bpimpaud
image: /blogs/release-0-21.jpg
---

Kestra 0.21.0 is here, packed with your most-requested features for our open-source orchestration platform. This major release introduces a seamless no-code experience for easier workflow creation, customizable dashboards to monitor your operations, advanced log forwarding across your entire infrastructure - and many improvements.

The table below highlights the key features of this release.

| Feature                                          | Description                                                                                                                                                                               | Edition |
|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| --- |
| No Code                                          | New experience regarding no-code flow creation and task edition                                                                             | All Editions |
| Custom Dashboards                                | Create your own custom dashboards, tailored to your monitoring needs                                                                        | All Editions |
| Log Shipper                                      | Forward Kestra logs logs across your entire infrastructure                                                                                                 | Enterprise Edition |
| Maintenance Mode                                 | Set your Kestra instance in maintenance mode to streamline server upgrades                                                                  |  Enterprise Edition |


Check the video below for a quick overview of the new features.

[PLACEHOLDER VIDEO RELEASE]

Let's dive into these highlights and other enhancements in more detail.

## Feature Highlights

### Log Shipper

We're excited to introduce Log Shipper, a powerful new feature that streamlines how you manage and distribute logs across your entire infrastructure. Whether you're using Elasticsearch, Datadog, Azure, or other logging platforms, you can now effortlessly ensure your logs are exactly where you need them, when you need them.

This log synchronization feature automatically batches your logs in optimal chunks and intelligently manages synchronization points. This means you get reliable, consistent log delivery without overwhelming your systems or missing critical data.

Log Shipper is built on top plugins, meaning it can be integrated with many log collectors. Launch day support includes integration with major observability and cloud platforms:  ElasticSearch, Datadog, New Relic, Azure, Google Cloud Plateform, AWS CloudWatch and OpenTelemetry. 

We're particularly excited about our OpenTelemetry integration. As an open-source observability framework, OpenTelemetry has emerged as the industry standard for telemetry data collection. This integration means you can forward logs to any platform supporting the OpenTelemetry protocol.

For example, here is a flow designed to send logs via Datadog.

::collapse{title="Expand for a LogShipper example with Datadog "}
```yaml
id: log_shipper
namespace: company.team
tasks:
  - id: log_export
    type: io.kestra.plugin.ee.core.log.LogShipper
    logLevelFilter: INFO
    batchSize: 1000
    lookbackPeriod: P1D
    logExporters:
      - id: DatadogLogExporter
        type: io.kestra.plugin.ee.datadog.LogExporter
        basePath: '{{ secret("DATADOG_INSTANCE_URL") }}'
        apiKey: '{{ secret("DATADOG_APIK_KEY") }}'
triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
```
::

![datadog logshipper](/blogs/logshipper_datadog.png)

Here is an example with AWS CloudWatch:
::collapse{title="Expand for an example with AWS CloudWatch"}
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
      - id: AWSLogExporter
        type: io.kestra.plugin.ee.aws.LogExporter
        accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
        secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
        region: "{{ vars.region }}"
```
::

![logshipper aws cloudwatch](/blogs/logshipper_aws_cloudwatch.png)

### New No Code Experience

Kestra's interface has always been its core strength, bridging the gap between no-code and traditional development approaches. 
While we've successfully supported both worlds, the no-code experience needed enhancement: today, we're excited to unveil a complete redesign of our no-code flow editor.

The new interface introduces intuitive left-side panels for flow properties and task management. We've simplified task configuration through organized drawers, making complex nested properties more accessible. A clear breadcrumb navigation helps you track your position within the configuration hierarchy.

[PLACEHOLDER IMAGE 1]
[PLACEHOLDER IMAGE 2]

### Custom Dashboards

Monitoring executions to get an overview of what's going on in your automations is a keystone of orchestration. In this new release we doubled down on that promise: rather than relying only on the default dashboard on Kestra's home screen, you can create charts that answer specific questions and track your key metrics. Everyone has different needs and service level thresholds. With custom dashboards you can now create tailored dashboards and focus on what matters the most to you.
As with everything in Kestra, you can declare dashboards as code. Clicking on the **+ Create new dashboard** button opens a Code Editor where you can define the dashboard layout and data sources in code. Here's an example of a dashboard definition that displays executions over time and a pie chart of execution states:

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

![alt text](/blogs/custom_dashboard1.png)
![alt text](/blogs/custom_dashboard2.png)

You can find Custom Dashboard blueprints directly inside you instance (under the Blueprint tab).


### Maintenance Mode

We're excited to announce Maintenance Mode, a new feature designed to simplify platform maintenance operations for Kestra installations running at scale. This feature addresses a common challenge faced by organizations running numerous workflows: finding the right moment to perform platform updates without disrupting ongoing operations.

When activated, Maintenance Mode introduces a controlled state where:

- The executor stops processing new executions. New flow executions are automatically queued.
- Existing executions are allowed to complete gracefully (workers complete their current tasks without picking up new ones).
- The platform continues to accept and schedule new executions, storing them for later processing (web server and scheduler components remain active, ensuring no requests are lost).
- New executions are queued for processing after maintenance concludes


You can enter in Maintenance Mode via the `Administration > Instance` panel of you Kestra instance.

## User Interface & Experience Improvements

As with each release, we continue to improve the Kestra interface:

- Filters and search bars are now consistent across the different panels

- Improvements for Apps:
  - Apps can now be previewed in the editor.
  - Apps can be declared via [Terraform definitions](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs/resources/app).
  - You can find Apps blueprints inside the Blueprint tab of your instance.

- Introduce [system labels](https://github.com/kestra-io/kestra/issues/6682) for restarted and replayed execution.
- Enhanced in-app documentation with collapsible task examples and properties, resulting in a cleaner, more organized interface.
- Add [revision history](https://github.com/kestra-io/kestra-ee/issues/1403) for all resources (EE)
- Failed subflow executions now resume from their last execution when restarted, rather than creating new executions from scratch

## Other Features and Improvements


- [OpenTelemetry traces and metrics](https://github.com/kestra-io/kestra/issues/5102) can be collected from your Kestra instance. OpenTelemetry is an observability framework withk an API, SDK, and tools that are designed to aid in the generation and collection of application telemetry data such as metrics, logs, and traces.

- A wider set of tasks properties now support [dynamic values](https://www.youtube.com/watch?v=TJ4BFBV8ZvU) - allowing better integration with tasks dependanices and Pebble syntax.

- [Notification plugin improvement](https://github.com/kestra-io/plugin-notifications/issues/171). The tasks allowing to send flow execution information to your favorite messaging app now include the last task ID in an execution in addition to the a link to the execution page, the execution ID, namespace, flow name, the start date, duration, and the final status of the execution.

- Declare [Apps](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs/resources/app) and [Custom Dashboards](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs/resources/dashboard) with Terraform. 

- [Manage iteration index inside the ForEach](https://github.com/kestra-io/kestra/issues/4842) task with the new `taskrun.iteration` property.

- New `finally` properties that run any tasks at the [end of a flow execution](https://github.com/kestra-io/kestra/issues/6649), regardless of the final state.

## New Tasks & Plugins

### DuckDB Fixes

We have fixed a [long running issue](https://github.com/kestra-io/plugin-jdbc/issues/165) regarding the DuckDB version used in Kestra. 

Now Kestra supports the latest version of DuckDB!


### New Exit task

The Exit task gives you control over your workflow's execution state. This new addition gives you precise control over how and when your workflows terminate. For example, it allows you to kill an execution depending on some conditional logics, as highlighted in the following example:

::collapse{title="Exit task example"}
```yaml
id: exit
namespace: company.team
inputs:
  - id: state
    type: SELECT
    values:
      - CONTINUE
      - END
    defaults: CONTINUE
tasks:
  - id: if
    type: io.kestra.plugin.core.flow.If
    condition: "{{inputs.state == 'CONTINUE'}}"
    then:
      - id: continue
        type: io.kestra.plugin.core.log.Log
        message: I'm continuing
    else:
      - id: exit
        type: io.kestra.plugin.core.execution.Exit
        state: KILLED
  - id: end
    type: io.kestra.plugin.core.log.Log
    message: I'm ending
```
::

[TBD LINK TO PLUGIN DOC]

### New Write task

The Write task takes your string input and saves it as a file in Kestra's internal storage. The task returns a URI pointing to the newly created file, which you can easily reference in subsequent tasks.
This is particuliarly useful when you want to store messages that come as a string to files that could be later passed on as uri further down the flow for further processing.

[TBD LINK TO PLUGIN DOC]


### New HugginFace Plugin

HuggingFace has become a leading force in democratizing AI and Large Language Models (LLMs). We're excited to introduce the new `huggingface.Inference` task, enabling seamless integration with the [HuggingFace Inference API](https://huggingface.co/docs/api-inference/index).
This integration allows you to leverage thousands of state-of-the-art AI models directly in your Kestra workflows. With a generous free tier of 50 API calls per hour, you can easily incorporate LLM capabilities into your Kestra flows.

::collapse{title="HuggingFace Inference task example"}
```yaml
id: hugging_face
namespace: blueprint

inputs:
  - id: message
    type: STRING

tasks:

  - id: classification
    type: io.kestra.plugin.huggingface.Inference
    model: facebook/bart-large-mnli
    apiKey: "{{ secret('HUGGINGFACE_API_KEY') }}"
    inputs: "{{ inputs.message }}"
    parameters:
        candidate_labels:
          - "support"
          - "warranty"
          - "upsell"
          - "help"

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "The input is categorized as a {{ json(outputs.classification.output).labels[0] }} message."
```
:: 

[TBD LINK TO PLUGIN DOC]


### New AWS EMR plugin

The AWS EMR plugin allows you to create (`io.kestra.plugin.aws.emr.CreateCluster`) or delete (`io.kestra.plugin.aws.emr.DeleteCluster`) AWS EMR clusters while managing running jobs (`io.kestra.plugin.aws.emr.AddJobFlowsSteps`).

::collapse{title="Example to create an AWS EMR cluster with a Spark job"}
```yaml
id: create-aws-emr-cluster
namespace: company.team

tasks:
  - id: create_cluster
    type: io.kestra.plugin.aws.emr.CreateCluster
    accessKeyId: {{ secret('AWS_ACCESS_KEY') }}
    secretKeyId: {{ secret('AWS_SECRET_KEY') }}
    region: eu-west-3
    clusterName: "Spark_job_cluster"
    logUri: "s3://kestra-test/test-emr-logs"
    keepJobFlowAliveWhenNoSteps: true
    applications:
        - Spark
    masterInstanceType: m5.xlarge
    slaveInstanceType: m5.xlarge
    instanceCount: 3
    ec2KeyName: test-key-pair
    steps:
        - name: Spark_job_test
          jar: "command-runner.jar"
          actionOnFailure: CONTINUE
          commands:
            - spark-submit s3://kestra-test/health_violations.py --data_source s3://kestra-test/food_establishment_data.csv --output_uri s3://kestra-test/test-emr-output
    wait: false
```
::

[TBD LINK TO PLUGIN DOC]

### New Pebble functions

- `randomInt`: you can now [generate a random integer](https://github.com/kestra-io/kestra/issues/6207) with the `randomInt` function in Pebble.

- `uuid`: you can [generate a UUID](https://github.com/kestra-io/kestra/issues/6208) with the new `uuid` function in Pebble.

- `distinct`: you can now [get the uniq set of values](https://github.com/kestra-io/kestra/issues/6417) from an array with the new `distinct` function in Pebble. For example: `"{{ ['1', '1', '2', '3'] | distinct }}"` will return `['1', '2', '3']`.


## Thanks to Our Contributors

A big thanks to all the contributors who helped make this release possible. Your feedback, bug reports, and pull requests have been invaluable.

If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues).

## Next Steps

This post covered new features and enhancements added in Kestra 0.21.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
