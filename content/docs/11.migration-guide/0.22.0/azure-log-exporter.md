---
title: Azure Log Exporter
icon: /docs/icons/migration-guide.svg
release: 0.22.0
editions: ["EE"]
---

Azure Log Exporter plugin is now split into two plugins.

## Overview

The log exporter plugin for Azure `io.kestra.plugin.ee.azure.LogExporter`, introduced in Kestra 0.21, got split into two plugins:
1. `io.kestra.plugin.ee.azure.monitor.LogExporter` for exporting logs to Azure Monitor.
2. `io.kestra.plugin.ee.azure.storage.LogExporter` for exporting logs to Azure Blob Storage.

This reflects that you can now export your log to Azure either using Azure Monitor or using Azure Blob Storage.

## Before Kestra 0.22

Before Kestra 0.22, the `io.kestra.plugin.ee.azure.LogExporter` plugin would export logs to Azure Monitor.

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
      - id: AzureLogExporter
        type: io.kestra.plugin.ee.azure.LogExporter
        endpoint: https://endpoint-host.ingest.monitor.azure.com
        tenantId: tenant_id
        clientId: client_id
        clientSecret: client_secret
        ruleId: dcr-69f0b123041d4d6e9f2bf72aad0b62cf
        streamName: Custom-JSONLogs
```

## After Kestra 0.22

In Kestra 0.22, you can now choose to export logs to Azure Monitor or Azure Blob Storage, or both.

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
      - id: AzureLogExporter
        type: io.kestra.plugin.ee.azure.monitor.LogExporter
        endpoint: https://endpoint-host.ingest.monitor.azure.com
        tenantId: tenant_id
        clientId: client_id
        clientSecret: client_secret
        ruleId: dcr-69f0b123041d4d6e9f2bf72aad0b62cf
        streamName: Custom-JSONLogs

      - id: AzureLogExporter
        type: io.kestra.plugin.ee.azure.storage.LogExporter
        endpoint: https://myblob.blob.core.windows.net/
        tenantId: tenant_id
        clientId: client_id
        clientSecret: client_secret
        containerName: logs
        format: JSON
        logFilePrefix: kestra-log-file
        maxLinesPerFile: 1000000
        chunk: 1000
```
