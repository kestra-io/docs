---
title: Log Shipper
icon: /docs/icons/admin.svg
editions: ["EE"]
version: "0.21.0"
---

Manage and distribute logs across your entire infrastructure.

**Add Video**

## Log Shipper functionality

Log Shipper can distribute Kestra logs from across your instance to an external logging platform. Log synchronization queries logs and automatically batches them into optimal chunks. The batch process is done intelligently through defined synchronization points. Once batched, the Log Shipper delivers reliable, consistent log batches to your monitoring platform.

Log Shipper is built on top of [Kestra plugins](/plugins/), ensuring it can integrate with popular logging platforms and expand as more plugins are developed. As of Kestra version 0.21, supported observability platforms include ElasticSearch, Datadog, New Relic, Azure, Google Cloud Platform, AWS Cloudwatch, and OpenTelemetry.

## Log Shipper properties

The Log Shipper plugin has several key properties to define where the logs should be sent and how they are batched. Below is a list of the definable properties and their purpose:

- `logExporters` - This property is required, and it specifies how the logs are exported. For example, you can specify AWS Cloudwatch credentials to use an external plugin or use Kestra's core `FileLogExporter` plugin.
- `batchSize` - Defines the amount of logs per batch. The default value is set to `1000`.
- `logLevelFilter` - Specifies the minimum log level to send with the default being `INFO`. You can specify, for example, only to batch `WARNING` or `ERROR` level logs.
- `lookbackPeriod` - Determines the fetch period for logs to be sent. For example, with a default value of `P1D`, all logs generated between now and one day ago are batched.
- `namespace` - Sets the task to only gather logs from a specific Kestra Namespace. If not specified, all instance logs are fetched.
- `offsetKey` - Specifies the prefix of the Key Value (KV) store key that contains the last execution's end fetched date. By default this is set as `LogShipper-state`.


## Log Shipper examples

The Log Shipper integrates with many popular observability platforms. Below are a coupe of example flows using a Kestra core plugin as well as a couple of external platform plugins.

### Kestra `FileLogExporter`

The following example uses Kestra's core `FileLogExporter` plugin to sychronize the logs of the `company.team` namespace. The `synchronize_logs` task outputs a file, and the log file uri is passed as an expression in the `upload` task to then upload the logs to an S3 bucket. 

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
    key: "logs"
    bucket: kestra-log-demo-bucket
    region: "eu-west-2"
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

This example exports logs to [AWS Cloudwatch](https://aws.amazon.com/cloudwatch/). The following example flow triggers a daily batch and export to an AWS Cloudwatch instance:

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
    offsetKey: LogShipper-state-2
    logExporters:
      - id: AWSLogExporter
        type: io.kestra.plugin.ee.aws.LogExporter
        accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
        secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
        region: "{{ vars.region }}"
        logGroupName: test_kestra
        logStreamName: test_stream
```

The logs are viewable in the interface of the specified Log Group and can be examined like in the following screenshot:

![AWS Cloud Watch Logs](/docs/enterprise/logshipper_aws_cloudwatch.png)
