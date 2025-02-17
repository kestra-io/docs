---
title: Log Shipper
icon: /docs/icons/admin.svg
editions: ["EE"]
version: "0.21.0"
---

Manage and distribute logs across your entire infrastructure.

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/iV6JtAwtuBg?si=9BrJXbEZLXbRXQIN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Log Shipper functionality

Log Shipper can distribute Kestra logs from across your instance to an external logging platform. Log synchronization queries logs and automatically batches them into optimal chunks. The batch process is done intelligently through defined synchronization points. Once batched, the Log Shipper delivers reliable, consistent log batches to your monitoring platform.

Log Shipper is built on top of [Kestra plugins](/plugins/), ensuring it can integrate with popular logging platforms and expand as more plugins are developed. As of Kestra version 0.21, supported observability platforms include ElasticSearch, Datadog, New Relic, Azure Monitor, Google Operational Suite, AWS Cloudwatch, and OpenTelemetry.

## Log Shipper properties

The Log Shipper plugin has several key properties to define where the logs should be sent and how they are batched. Below is a list of the definable properties and their purpose:

- `logExporters` - This property is required, and it specifies the plaform where the logs will be exported. It support a list of entries, allowing you to export logs to different platforms at once
- `batchSize` - Defines the amount of logs per batch when fetching the database. The default value is set to `1000`.
- `logLevelFilter` - Specifies the minimum log level to send with the default being `INFO`. With `INFO`, all log levels `INFO` and above (`WARNING` and `ERROR`) are batched. If you only want logs that are warnings or errors, then you can set this property to `WARNING` and so on.
- `lookbackPeriod` - Determines the fetch period for logs to be sent. For example, with a default value of `P1D`, all logs generated between now and one day ago are batched.
- `namespace` - Sets the task to only gather logs from a specific Kestra [Namespace](../../04.workflow-components/02.namespace.md). If not specified, all instance logs are fetched.
- `offsetKey` - Specifies the prefix of the [Key Value (KV) store](../../05.concepts/05.kv-store.md) key that contains the last execution's end fetched date. By default this is set as `LogShipper-state`. You can change this key store name to reset the last fetched date if, for example, you want to export previously exported logs.


## Log Shipper examples

The Log Shipper integrates with many popular observability platforms. Below are a coupe of example flows using a Kestra core plugin as well as external platform plugins.

### Kestra `FileLogExporter`

The following example uses Kestra's core `FileLogExporter` plugin to sychronize the logs of the `company.team` namespace. The `synchronize_logs` task outputs a file, and the log file `uri` is passed as an expression in the `upload` task to then upload the logs to an S3 bucket.

```yaml
id: log_shipper_file
namespace: system

tasks:
  - id: synchronize_logs
    type: io.kestra.plugin.ee.core.log.LogShipper
    logLevelFilter: INFO
    batchSize: 2
    lookbackPeriod: P1D
    offsetKey: LogShipper-local-demo
    namespace: company.team
    logExporters:
      - id: file
        type: io.kestra.plugin.ee.core.log.FileLogExporter

  - id: upload
    type: io.kestra.plugin.aws.s3.Upload
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    from: "{{ outputs.synchronize_logs.outputs.file.uri }}"
    key: logs/kestra.txt
    bucket: kestra-log-demo-bucket
    region: eu-west-2
```

### Datadog

The below example demonstrates an execution that runs a daily log synchronization and distribution of logs with [Datadog](https://www.datadoghq.com/) using the default property settings.

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
      - id: DatadogLogExporter
        type: io.kestra.plugin.ee.datadog.LogExporter
        basePath: '{{ secret("DATADOG_INSTANCE_URL") }}'
        apiKey: '{{ secret("DATADOG_APIK_KEY") }}'
```

The batched logs directly populate your Datadog instance like in the following screenshot:

![Datadog Logs](/docs/enterprise/logshipper_datadog.png)

### AWS Cloudwatch

This example exports logs to [AWS Cloudwatch](https://aws.amazon.com/cloudwatch/). The following example flow triggers a daily batch and exports to AWS's service [Amazon CloudWatch](https://docs.aws.amazon.com/cloudwatch/):

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
    offsetKey: log_shipper_aws_cloudwatch_state
    logExporters:
      - id: aws_cloudwatch
        type: io.kestra.plugin.ee.aws.cloudwatch.LogExporter
        accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
        secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
        region: "{{ vars.region }}"
        logGroupName: kestra
        logStreamName: kestra-log-stream
```

The logs are viewable in the interface of the specified Log Group and can be examined like in the following screenshot:

![AWS Cloud Watch Logs](/docs/enterprise/logshipper_aws_cloudwatch.png)

### Google Operational Suite

This example exports logs to [Google Cloud Observability](https://cloud.google.com/products/observability). The following example flow triggers a daily batch and exports to Google Cloud Platform's observability monitor.

```yaml
id: log_shipper
namespace: company.team

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"

tasks:
  - id: shipLogs
    type: io.kestra.plugin.ee.core.log.LogShipper
    logLevelFilter: INFO
    batchSize: 1000
    lookbackPeriod: P1D
    offsetKey: logShipperOffset
    logExporters:
      - id: googleOperationalSuite
        type: io.kestra.plugin.ee.gcp.operationalsuite.LogExporter
        projectId: my-gcp-project
```

### Azure Monitor

This example exports logs to [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/overview). The following example flow triggers a daily batch and export to Azure Monitor.

```yaml
id: log_shipper
namespace: company.team

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"

tasks:
  - id: shipLogs
    type: io.kestra.plugin.ee.core.log.LogShipper
    logLevelFilter: INFO
    batchSize: 1000
    lookbackPeriod: P1D
    offsetKey: logShipperOffset
    logExporters:
      - id: azureMonitor
        type: io.kestra.plugin.ee.azure.LogExporter
        endpoint: https://endpoint-host.ingest.monitor.azure.com
        tenantId: "{{ secret('AZURE_TENANT_ID') }}"
        clientId: "{{ secret('AZURE_CLIENT_ID') }}"
        clientSecret: "{{ secret('AZURE_CLIENT_SECRET') }}"
        ruleId: dcr-69f0b123041d4d6e9f2bf72aad0b62cf
        streamName: kestraLogs
```

### Elasticsearch

This example exports logs to [Elasticsearch](https://www.elastic.co). The following example flow triggers a daily batch and export to [Elasticsearch Observability platform](https://www.elastic.co/observability).

```yaml
id: logShipper
namespace: system

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"

tasks:
  - id: shipLogs
    type: io.kestra.plugin.ee.core.log.LogShipper
    logLevelFilter: INFO
    batchSize: 1000
    lookbackPeriod: P1D
    offsetKey: logShipperOffset
    logExporters:
      - id: elasticsearch
        type: io.kestra.plugin.elasticsearch.LogExporter
        indexName: kestra-logs
        connection:
          basicAuth:
            password: "{{ secret('ES_PASSWORD') }}"
            username: kestra_user
          hosts:
            - https://elastic.example.com:9200
```

### New Relic

This example exports logs to [New Relic](https://newrelic.com/). The following example flow triggers a daily batch and export to the [New Relic Observability Platform](https://newrelic.com/platform).

```yaml
id: logShipper
namespace: system

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"

tasks:
  - id: shipLogs
    type: io.kestra.plugin.ee.core.log.LogShipper
    logLevelFilter: INFO
    batchSize: 1000
    lookbackPeriod: P1D
    offsetKey: logShipperOffset
    logExporters:
      - id: newRelic
        type: io.kestra.plugin.ee.newrelic.LogExporter
        basePath: https://log-api.newrelic.com
        apiKey: "{{ secret('NEWRELIC_API_KEY') }}"
```

### OpenTelemetry

This example exports logs to [OpenTelemetry](https://opentelemetry.io/). The following example flow triggers a daily batch and export to an [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/).

```yaml
id: logShipper
namespace: system

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"

tasks:
  - id: shipLogs
    type: io.kestra.plugin.ee.core.log.LogShipper
    logLevelFilter: INFO
    batchSize: 1000
    lookbackPeriod: P1D
    offsetKey: logShipperOffset
    logExporters:
      - id: openTelemetry
        type: io.kestra.plugin.ee.opentelemetry.LogExporter
        otlpEndpoint: http://otel-collector:4318/v1/logs
        authorizationHeaderName: Authorization
        authorizationHeaderValue: "Bearer {{ secret('OTEL_TOKEN') }}"
```
