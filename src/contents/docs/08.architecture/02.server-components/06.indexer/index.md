---
title: "Indexer in Kestra: How Logs and Metrics Are Stored"
h1: How the Kestra Indexer Stores Logs, Metrics, and Statistics
description: Understand what the Kestra Indexer writes and where it runs. Learn what happens when it falls behind and how to scale and monitor it.
sidebarTitle: Indexer
icon: /src/contents/docs/icons/architecture.svg
---

The Indexer is the server component that writes high-volume execution data from the queue to storage in batches.

Workers and the [Executor](../01.executor/index.md) publish logs, metrics, and execution statistics to the [queue](../../01.main-components/index.md#queue) as they produce them. The Indexer reads those records and saves them to the [repository](../../01.main-components/index.md#repository), where the UI, the API, and dashboards read them. Every Kestra deployment needs an Indexer, whatever its queue and repository backends.

## What the Indexer writes

The Indexer writes three kinds of records:

| Record | Produced by | Used for |
|---|---|---|
| Logs | Tasks and triggers | The **Logs** tab, log search, and dashboards. Logs go to the [log data store](../../../10.administrator-guide/log-data-store/index.md#how-it-works), which can be separate from the main database. |
| Metrics | Tasks that emit metrics | The **Metrics** tab and dashboards |
| Execution statistics | The Executor, once per finished execution | Flow duration averages, which the UI uses to estimate the progress of a running execution |

:::alert{type="info"}
In Enterprise Edition, the Indexer also writes [audit logs](../../../07.enterprise/02.governance/06.audit-logs/index.md) and [asset](../../../07.enterprise/02.governance/01.assets/index.md) lineage events.
:::

The Indexer doesn't write flows, executions, or triggers. The components that change them write them to the repository directly, so they stay current even when the Indexer is behind.

## Where the Indexer runs

The Webserver and the standalone server each start an embedded Indexer by default. To run the Indexer as its own process instead, start `kestra server indexer` and start the Webserver or standalone server with `--no-indexer`. See the [`kestra server` commands](../../../kestra-cli/kestra-server/index.md#kestra-server-indexer).

## How records are indexed

The Indexer reads each record type from the queue in batches and saves each batch in a single write. With a JDBC queue, a batch holds up to `kestra.jdbc.queues.poll-size` records (default `100`). The Indexer has no settings of its own; batch size and polling come from the queue backend. See [JDBC queue tuning](../../../configuration/02.runtime-and-storage/index.md#connection-pooling-and-jdbc-queue-tuning).

With a JDBC queue, each poll locks the rows it reads and skips rows locked by another reader, so several Indexers can run side by side and share the work.

A record that can't be deserialized is logged as an error and skipped. A record that is read but can't be saved stops the Indexer by default, as described in [When a record can't be saved](#when-a-record-cant-be-saved).

## When the Indexer falls behind or stops

Records wait in the queue until an Indexer saves them. With a JDBC queue, a record is removed from the queue only in the same transaction that processes it, so a backlog is kept, not lost.

While the Indexer is behind or stopped:

- Recent logs and metrics are missing from the UI, search, and dashboards.
- Progress estimates for running executions use older averages.
- In Enterprise Edition, recent audit log entries and asset lineage events are missing.

Executions, flows, and triggers are unaffected. Following an execution's logs live in the UI also keeps working, because live logs reach the UI through a separate stream that doesn't go through the Indexer.

## When a record can't be saved

If saving a batch fails, the Indexer retries the records one at a time to find the one that fails. For that record, it logs an error with the record's key.

By default, `kestra.queue.fail-fast` is `true`: the error stops the Kestra server that runs the Indexer, and the record is not removed from the queue, so it is delivered again after a restart. When the Indexer is embedded, that server is the Webserver or the standalone server. With `kestra.queue.fail-fast: false`, the server keeps running and the record is lost.

The error message suggests the `--ignore-queue-records` flag to skip a record that keeps failing. This works only for record types with a stable key; see [Monitoring and troubleshooting](#monitoring-and-troubleshooting).

## Execution statistics compaction

With a JDBC repository, the execution statistics table receives one row per finished execution. A scheduled job merges the rows of each flow and state for each closed minute into a single row and deletes the originals, which keeps the table small. The job runs on Webserver, standalone, and Indexer servers, even when the Webserver or standalone server is started with `--no-indexer`.

With an Elasticsearch repository, there's no compaction. Statistics are aggregated when they're read.

## Running the Indexer

### Scaling

To add indexing capacity, run more Webserver replicas with their embedded Indexers, or run dedicated `kestra server indexer` processes. With a JDBC queue, they share the work as described in [How records are indexed](#how-records-are-indexed). See [high availability](../../../10.administrator-guide/high-availability/index.md#scaling-components).

### Liveness

The Indexer takes part in [server liveness](../../../10.administrator-guide/server-lifecycle/index.md#the-liveness-mechanism) like every other server. If other servers mark an Indexer as not running after missed heartbeats, the Indexer sets itself back to running instead of shutting down, as Webserver and standalone servers also do.

### Configuration

| Property | Default | Purpose |
|---|---|---|
| `kestra.jdbc.queues.poll-size` | `100` | Maximum number of records read in one poll from a JDBC queue, which is the Indexer's batch size. It applies to every JDBC queue consumer, not only the Indexer. |
| `kestra.queue.fail-fast` | `true` | Stop the server when a record can't be processed, so the record is delivered again after restart. With `false`, the record is skipped and lost. It applies to every queue consumer, not only the Indexer. |
| `kestra.jdbc.execution-statistics.compactor.initial-delay` | `1m` | Delay before the first compaction run after startup (JDBC repository only). |
| `kestra.jdbc.execution-statistics.compactor.fixed-delay` | `1m` | Delay between the end of one compaction run and the start of the next. |
| `kestra.jdbc.execution-statistics.compactor.max-keys-per-run` | `1000` | Maximum number of flow and state combinations compacted per run. |

### Monitoring and troubleshooting

The Indexer publishes metrics under `kestra.indexer.*`, each tagged with `type`, the class of the record (for example `io.kestra.core.models.executions.LogEntry`):

- `indexer.request.count`: batches saved
- `indexer.message.in.count`: records received
- `indexer.message.out.count`: records saved
- `indexer.request.duration`: time spent saving a batch

Any server that runs an Indexer publishes these metrics, including Webservers and standalone servers with an embedded Indexer. See the [Indexer metrics](../../../10.administrator-guide/03.monitoring/index.md#indexer) and their [Prometheus names](../../../10.administrator-guide/prometheus-metrics/index.md#kestra-indexer-metrics). The queue metrics on the same pages show how fast each queue is consumed.

To skip records while you investigate a failure, start the server that runs the Indexer with one of these comma-separated lists:

- `--ignore-queue-records`: skips queue records with the given keys before they are processed. The `controller`, `indexer`, `webserver`, and `standalone` server commands accept it.
- `--ignore-indexer-records`: skips indexer records with the given keys just before they are saved. The `indexer`, `webserver`, and `standalone` server commands accept it.

Logs and metrics get a new random key each time, so neither flag can target a specific log or metric record. Both flags work for execution statistics, and in Enterprise Edition for audit logs and asset lineage events.
