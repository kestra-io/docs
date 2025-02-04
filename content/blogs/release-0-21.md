---
title: Kestra 0.21 introduces Custom Dashboards, No-Code Forms, Log Shipper, and New Flow Property
description: Elevate your orchestration platform with improved no-code forms, custom operational dashboards, log forwarding, and a new flow property for cleanup tasks called finally.
date: 2025-02-04T17:00:00
category: News & Products Updates
author:
  name: Benoit Pimpaud
  image: bpimpaud
image: /blogs/release-0-21.jpg
---

Kestra 0.21 introduces no-code forms for simpler workflow creation, customizable dashboards for more flexible monitoring, a new core property for cleanup tasks, advanced log forwarding across your entire infrastructure, and several other improvements.

The table below highlights the key features of this release.

| Feature                                   | Description                                                                | Edition |
|-------------------------------------------|----------------------------------------------------------------------------| --- |
| Log Shipper       | Forward Kestra logs across your entire infrastructure                 | Enterprise Edition |
| New `finally` core property               | Run cleanup tasks at the end of your workflow even if previous tasks fail  | All Editions |
| No Code                                   | New experience regarding no-code flow creation and task edition            | All Editions |
| Custom Dashboards | Create your own custom dashboards, tailored to your monitoring needs       | All Editions |
| Maintenance Mode                          | Set your Kestra instance in maintenance mode to streamline server upgrades |  Enterprise Edition |

Check the video below for a quick overview of the new features.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/C8sBlcAHi-k?si=QDhbv7TUa7hDR5DO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Let's dive into these highlights and other enhancements in more detail.

## Feature Highlights

### Log Shipper

The new Log Shipper feature streamlines how you manage and distribute logs across your entire infrastructure. Whether you're using Elasticsearch, Datadog, New Relic, Azure Monitor, AWS CloudWatch or other logging platforms, you can ensure logs are delivered exactly where you need them, when you need them.

This synchronization automatically batches logs into optimized chunks and manages synchronization points. It provides reliable, consistent log delivery without overloading your systems or losing critical data.

Built on plugin architecture, the Log Shipper integrates with many log collectors, including Elasticsearch, Datadog, New Relic, Azure Monitor, Google Operational Suite, AWS CloudWatch, and OpenTelemetry.

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/iV6JtAwtuBg?si=AgiIWVZUKmaT1Mrn" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

The examples below show how to configure Log Shipper with Datadog and AWS CloudWatch.

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

![datadog logshipper](/blogs/release-0-21/logshipper_datadog.png)

Here is an example with AWS CloudWatch:
::collapse{title="Expand for an example with AWS CloudWatch"}
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
      - id: AWSLogExporter
        type: io.kestra.plugin.ee.aws.LogExporter
        accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
        secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
        region: "{{ vars.region }}"

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
```
::

![logshipper aws cloudwatch](/blogs/release-0-21/logshipper_aws_cloudwatch.png)

### New No Code Experience

Kestra's interface has always bridged the gap between code and no-code. In this release, we've redesigned our no-code flow editor. The new interface features intuitive left-side panels for flow properties and task management, plus organized drawers for simpler navigation of complex nested properties. A breadcrumb shows your position within each configuration.

### Custom Dashboards

Monitoring workflow execution states is a critical aspect of orchestration. This release adds the ability to create custom dashboards, so you can track the executions, logs and metrics in a way that matches your needs. You can declare these dashboards as code in the UI's editor, defining both chart types and data sources.

<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/Ag4ICYbE2YE?si=GOUc6r4RCb0If88M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

As with everything in Kestra, you can manage dashboards as code (and you can create them via Terraform or API). Clicking **+ Create new dashboard** opens a code editor where you can define the dashboard layout and data sources.

Here’s an example that displays executions over time and a pie chart of execution states:

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

![alt text](/blogs/release-0-21/custom_dashboard1.png)

![alt text](/blogs/release-0-21/custom_dashboard2.png)

You can find Dashboard blueprints from the left side menu.

### Maintenance Mode

Maintenance Mode addresses a frequent challenge in environments running many workflows at scale: safely updating the platform without disrupting active operations. When enabled:

- The executor stops processing new executions; new flow executions are automatically queued.
- Ongoing executions complete gracefully (workers complete their current tasks without picking up new ones).
- The platform still accepts and schedules new executions, buffering them until maintenance is finished (webserver and scheduler components remain active, ensuring no requests are lost).
- Once Maintenance Mode is disabled, queued executions resume as normal.

You can enter Maintenance Mode from the **Administration > Instance** panel.

## New `finally` Core Property

We've [introduced](https://github.com/kestra-io/kestra/issues/6649) a `finally` property that runs tasks at the end of a flow, regardless of prior task outcomes. It's especially useful for cleanup steps like shutting down temporary resources spun up during a flow execution such as Docker containers or on-demand Spark clusters.

::collapse{title="Example starting and stopping a Docker container"}

```yaml
id: dockerRedis
namespace: company.team

variables:
  host: host.docker.internal

tasks:
  - id: start
    type: io.kestra.plugin.docker.Run
    containerImage: redis
    wait: false
    portBindings:
      - "6379:6379"

  - id: sleep
    type: io.kestra.plugin.core.flow.Sleep
    duration: PT1S
    description: Wait for the Redis container to start

  - id: set
    type: io.kestra.plugin.redis.string.Set
    url: "redis://:redis@{{vars.host}}:6379/0"
    key: "key_string_{{execution.id}}"
    value: "{{flow.id}}"
    serdeType: STRING

  - id: get
    type: io.kestra.plugin.redis.string.Get
    url: "redis://:redis@{{vars.host}}:6379/0"
    key: "key_string_{{execution.id}}"
    serdeType: STRING

  - id: assert
    type: io.kestra.plugin.core.execution.Assert
    errorMessage: "Invalid get data {{outputs.get}}"
    conditions:
      - "{{outputs.get.data == flow.id}}"

  - id: delete
    type: io.kestra.plugin.redis.string.Delete
    url: "redis://:redis@{{vars.host}}:6379/0"
    keys:
      - "key_string_{{execution.id}}"

  - id: getAfterDelete
    type: io.kestra.plugin.redis.string.Get
    url: "redis://:redis@{{vars.host}}:6379/0"
    key: "key_string_{{execution.id}}"
    serdeType: STRING

  - id: assertAfterDelete
    type: io.kestra.plugin.core.execution.Assert
    errorMessage: "Invalid get data {{outputs.getAfterDelete}}"
    conditions:
      - "{{(outputs.getAfterDelete contains 'data') == false}}"

finally:
  - id: stop
    type: io.kestra.plugin.docker.Stop
    containerId: "{{outputs.start.taskRunner.containerId}}"
```
::

## User Interface & Experience Improvements

As with each release, there are more UI and UX enhancements:

- Filters and search bars are now consistent across different panels.
- Apps can be previewed in the editor and declared via [Terraform definitions](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs/resources/app). You can also find App blueprints in the Blueprint tab.
- [System labels](https://github.com/kestra-io/kestra/issues/6682) have been added for restarted and replayed executions.
- In-app plugin documentation now has collapsible task examples and properties, providing a cleaner UI.
- Revision history is now available for all resources in the Enterprise Edition.
- Failed subflow executions, when restarted from a parent execution, now restart their existing execution from a failed task rather than creating a new execution from scratch.

## Other Features and Improvements

- [OpenTelemetry traces and metrics](https://github.com/kestra-io/kestra/issues/5102) can now be collected from your Kestra instance.
- Most Kestra plugins now support [dynamic properties](https://www.youtube.com/watch?v=TJ4BFBV8ZvU), improving dynamic rendering of Pebble expressions.
- [Notification plugin improvements](https://github.com/kestra-io/plugin-notifications/issues/171): tasks that send flow execution updates now include the last task ID in an execution, along with a link to the execution page, the execution ID, namespace, flow name, start date, duration, and final status.
- [Apps](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs/resources/app) and [Custom Dashboards](https://registry.terraform.io/providers/kestra-io/kestra/latest/docs/resources/dashboard) can be declared via Terraform.
- [ForEach iteration index](https://github.com/kestra-io/kestra/issues/4842) is now accessible within the execution context using the `taskrun.iteration` property.

## Plugin enhancements

### DuckDB

We’ve [fixed](https://github.com/kestra-io/plugin-jdbc/issues/165) an issue preventing DuckDB upgrades. Kestra now supports the latest DuckDB version.

### New `Exit` core task

The `Exit` task allows you to terminate an execution in a given state based on a custom condition.

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
        message: Show must go on...
    else:
      - id: exit
        type: io.kestra.plugin.core.execution.Exit
        state: KILLED

  - id: end
    type: io.kestra.plugin.core.log.Log
    message: This is the end
```
::

### New `Write` task

The `Write` task takes your string input and saves it as a file in Kestra's internal storage. The task returns a URI pointing to the newly created file, which you can reference in subsequent tasks e.g., to upload the file to an S3 bucket.

```yaml
id: write_file
namespace: company.team

tasks:
  - id: write
    type: io.kestra.plugin.core.storage.Write
    content: Hello World
    extension: .txt

  - id: s3
    type: io.kestra.plugin.aws.s3.Upload
    from: "{{ outputs.write.uri }}"
    bucket: kestraio
    key: data/myfile.txt
```

### New HuggingFace Plugin

The new `huggingface.Inference` task integrates with the [HuggingFace Inference API](https://huggingface.co/docs/api-inference/index), letting you incorporate LLM-based capabilities into your Kestra workflows.

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

### New AWS EMR plugin

The [AWS EMR plugin](https://kestra.io/plugins/plugin-aws#emr) lets you create or terminate AWS EMR clusters and manage jobs.

::collapse{title="Example to create an AWS EMR cluster with a Spark job"}
```yaml
id: aws_emr
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

### New Pebble functions

- `randomInt` to generate a [random integer](https://github.com/kestra-io/kestra/issues/6207).
- `uuid` to generate a [UUID](https://github.com/kestra-io/kestra/issues/6208).
- `distinct` to get a [unique set of values](https://github.com/kestra-io/kestra/issues/6417) from an array (e.g., `['1', '1', '2', '3'] | distinct` returns `['1', '2', '3']`).

## Thanks to Our Contributors

Thank you to everyone who contributed to this release through feedback, bug reports, and pull requests. If you want to become a Kestra contributor, check out our [Contributing Guide](https://kestra.io/docs/getting-started/contributing) and the [list of good first issues](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues&utm_source=GitHub&utm_medium=github&utm_content=Good+First+Issues).

## Next Steps

This post covered new features and enhancements added in Kestra 0.21.0. Which of them are your favorites? What should we add next? Your feedback is always appreciated.

If you have any questions, reach out via [Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
