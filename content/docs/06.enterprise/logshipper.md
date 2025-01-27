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

## Log Shipper example

The below example demonstrates how to design an execution that runs a daily log synchronization and distribution of logs through an Opentelemetry exporter to an Opentelemetry collector.

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

An execution uses either the last log send date or the difference between **Now** and the `startingDayBefore` to search logs, fetch a batch of logs, and send them via a log shipper plugin. 

The `batchSize` property can be changed to your desired amount of logs, and the default size is `1000` logs. The `logExporters` property defines the endpoint of your logging platform the logs should be sent to.

(TBD) Add more about properties
