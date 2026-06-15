---
title: Purge Executions, Logs, and Files in Kestra
h1: Delete old executions, logs, and files to reclaim storage
description: Reclaim storage by purging old executions, logs, KV entries, and orphaned execution files in Kestra. Configure scheduled purge jobs to keep your database lean in production.
sidebarTitle: Purge
icon: /src/contents/docs/icons/admin.svg
version: ">= 0.18.0"
---

Use purge tasks to remove old executions, logs, and key-value pairs, helping reduce storage usage.

To keep storage optimized, use [`PurgeExecutions`](/plugins/core/execution/io.kestra.plugin.core.execution.purgeexecutions), [`PurgeLogs`](/plugins/core/log/io.kestra.plugin.core.log.purgelogs), [`PurgeKV`](/plugins/core/kv/io.kestra.plugin.core.kv.purgekv), and [`PurgeStorage`](/plugins/core/storage/io.kestra.plugin.core.storage.purgestorage).

- `PurgeExecutions`: deletes execution records from the database and their associated storage files
- `PurgeLogs`: removes execution logs and non-execution logs (e.g. trigger logs) in bulk; use `purgeExecutionLogs` and `purgeNonExecutionLogs` to target each type independently
- `PurgeKV`: deletes expired keys globally for a specific namespace
- `PurgeStorage`: removes orphaned execution files from internal storage — files that exist on disk but whose execution records are no longer in the database

`PurgeExecutions`, `PurgeLogs`, and `PurgeKV` replace the legacy `io.kestra.plugin.core.storage.Purge` task. `PurgeStorage` is a new addition that handles orphaned files the other tasks cannot reach.

:::alert{type="info"}
The [Enterprise Edition](../../07.enterprise/index.mdx) also includes [`PurgeAuditLogs`](../../07.enterprise/02.governance/06.audit-logs/index.md#how-to-purge-audit-logs).
:::

## Purge executions and logs

The flow below purges executions and logs older than one month on a daily schedule:

```yaml
id: purge
namespace: company.myteam
description: |
  This flow will remove all executions and logs older than 1 month.
  We recommend running it daily to prevent storage issues.

tasks:
  - id: purge_executions
    type: io.kestra.plugin.core.execution.PurgeExecutions
    endDate: "{{ now() | dateAdd(-1, 'MONTHS') }}"
    purgeLog: false

  - id: purge_logs
    type: io.kestra.plugin.core.log.PurgeLogs
    endDate: "{{ now() | dateAdd(-1, 'MONTHS') }}"

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
```

### Selectively purge execution or trigger logs

Both `purgeExecutionLogs` and `purgeNonExecutionLogs` default to `true`. Set either to `false` to exclude that log type — for example, to retain execution logs for debugging while still clearing trigger logs.

Purge only trigger (non-execution) logs:

```yaml
id: purge-trigger-logs
namespace: company.myteam

tasks:
  - id: purge_logs
    type: io.kestra.plugin.core.log.PurgeLogs
    endDate: "{{ now() | dateAdd(-1, 'MONTHS') }}"
    purgeExecutionLogs: false

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
```

Purge only execution logs:

```yaml
id: purge-execution-logs
namespace: company.myteam

tasks:
  - id: purge_logs
    type: io.kestra.plugin.core.log.PurgeLogs
    endDate: "{{ now() | dateAdd(-1, 'MONTHS') }}"
    purgeNonExecutionLogs: false

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
```

The task outputs `executionLogsCount` and `nonExecutionLogsCount` alongside the existing `count` (total), so you can log or alert on how many of each type were removed.

### Control deletion batch size

By default, `PurgeLogs` deletes all matching rows in a single transaction. Use `batchSize` to split the deletion into smaller batches — useful when purging a large volume of logs to limit transaction size:

```yaml
id: purge-logs-batched
namespace: company.myteam

tasks:
  - id: purge_logs
    type: io.kestra.plugin.core.log.PurgeLogs
    endDate: "{{ now() | dateAdd(-1, 'MONTHS') }}"
    batchSize: 1000

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
```

## Purge orphaned execution files

`PurgeStorage` removes execution files from internal storage whose last-modified timestamp falls within a date window. Unlike `PurgeExecutions`, which is database-driven (it looks up execution records and deletes their files), `PurgeStorage` is storage-driven — it walks the storage tree directly and deletes files regardless of whether a matching execution record exists. This makes it the right tool for reclaiming storage that `PurgeExecutions` cannot reach.

:::alert{type="warning"}
`PurgeStorage` permanently deletes files. Always run with `dryRun: true` first and review the output counts before switching to `dryRun: false`. The `dryRun` property defaults to `true`.
:::

### Isolated worker groups and orphaned files

The most common use case is deployments with remote worker groups using dedicated internal storage that the primary Kestra cluster cannot access. When `PurgeExecutions` runs on the primary cluster, it deletes execution records from the database. Any subsequent `PurgeExecutions` run targeted at the remote worker group finds no execution records to match and never touches the isolated storage — leaving orphaned files behind.

There are two strategies depending on whether orphaned files already exist:

**Prevention — order your purge tasks correctly.** Run a worker-group-scoped `PurgeExecutions` with `purgeExecution: false` before the primary purge. This deletes files from the remote storage while the execution records still exist:

```yaml
id: purge_isolated_storage
namespace: system

tasks:
  - id: purge_remote_files_first
    type: io.kestra.plugin.core.execution.PurgeExecutions
    endDate: "{{ now() | dateAdd(-1, 'MONTHS') }}"
    purgeExecution: false
    purgeStorage: true
    workerGroup:
      key: my-worker-group

  - id: purge_executions
    type: io.kestra.plugin.core.execution.PurgeExecutions
    endDate: "{{ now() | dateAdd(-1, 'MONTHS') }}"

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
```

**Remediation — clean up existing orphans with `PurgeStorage`.** If orphaned files already exist (execution records deleted but files remain), use `PurgeStorage` targeted at the remote worker group:

```yaml
id: purge_orphan_storage
namespace: system

tasks:
  - id: dry_run
    type: io.kestra.plugin.core.storage.PurgeStorage
    namespace: company.team
    endDate: "{{ now() | dateAdd(-1, 'MONTHS') }}"
    dryRun: true
    workerGroup:
      key: my-worker-group

  - id: real_run
    type: io.kestra.plugin.core.storage.PurgeStorage
    namespace: company.team
    endDate: "{{ now() | dateAdd(-1, 'MONTHS') }}"
    dryRun: false
    workerGroup:
      key: my-worker-group

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
```

Both tasks run sequentially in the same execution. Check the `dry_run` task output in the execution logs — when the counts look correct, set `dryRun: false` on the `real_run` task (or remove `dry_run` entirely for scheduled runs). Outputs are:

| Output | Description |
|---|---|
| `scannedCount` | Total execution storage directories found |
| `purgedCount` | Execution directories matched within the date window (preview when `dryRun: true`) |
| `deletedFilesCount` | Files actually deleted (`0` when `dryRun: true`) |

### Namespace scoping

`namespace` matching is recursive — `namespace: company` also reaches `company.team` and `company.team.prod`. Omitting `namespace` purges across every namespace under the tenant (requires tenant-admin level access). Narrowing with `flowId` is also supported but requires `namespace` to be set.

:::alert{type="info"}
In the Enterprise Edition, sub-namespaces configured with their own dedicated storage are **not** reached by recursive namespace scoping — they must be targeted explicitly by setting `namespace` to that sub-namespace. This applies directly to the isolated worker group pattern above.
:::

## Purge Key-value pairs

The example below purges expired key-value pairs from the `company` namespace. It's set up as a flow in the [`system`](../../06.concepts/system-flows/index.md) namespace.

```yaml
id: purge_kv_store
namespace: system

tasks:
  - id: purge_kv
    type: io.kestra.plugin.core.kv.PurgeKV
    expiredOnly: true
    namespaces:
      - company
    includeChildNamespaces: true
```

:::alert{type="warning"}
Purge tasks permanently delete data. Always test in non-production environments first.
:::

## Auto-delete expired key-value pairs

Rather than scheduling a flow to purge key-value pairs, you can configure Kestra to delete expired entries automatically:

```yaml
kestra:
  kv:
    purge-expired:
      enabled: true # default true
      initial-delay: PT5S # default PT6H 
      fixed-delay: PT5S # default PT6H
      batch-size: 10 # default 1000
```

## Purge namespace files

The example below purges old versions of namespace files for a namespace tree (parent and child namespaces). Use `filePattern` and `behavior` to keep the last N versions or delete versions older than a given date:

```yaml
id: purge_namespace_files
namespace: system

tasks:
  - id: purge_files
    type: io.kestra.plugin.core.namespace.PurgeFiles
    namespaces:
      - company
    includeChildNamespaces: true
    filePattern: "**/*.sql"
    behavior:
      type: version
      before: "2025-01-01T00:00:00Z"
```

Refer to the [PurgeFiles documentation](/plugins/core/namespace/io.kestra.plugin.core.namespace.purgefiles) for more details.

## Purge assets and lineage (retention)

Use the `io.kestra.plugin.ee.assets.PurgeAssets` task to enforce asset retention without touching executions or logs. By default, this task purges assets, asset usage events (execution view), and asset lineage events (for asset exporters) matching the filters. You can configure it to only purge specific types of records.

**Filters:**

| Property | Description |
| --- | --- |
| `namespace` | Filter by namespace. Supports prefix matching (e.g., `company.data` matches `company.data.staging`). |
| `assetId` | Filter by a specific asset ID. |
| `assetType` | Filter by one or more asset types (e.g., `io.kestra.plugin.ee.assets.Table`). |
| `metadataQuery` | Filter by metadata key-value pairs. |
| `endDate` | **(required)** Purge records created or updated before this date (ISO 8601). |

**Purge scope:**

| Property | Default | Description |
| --- | --- | --- |
| `purgeAssets` | `true` | Whether to purge the asset records themselves. |
| `purgeAssetUsages` | `true` | Whether to purge asset usage events (execution view). |
| `purgeAssetLineages` | `true` | Whether to purge asset lineage events. |

**Outputs:** `purgedAssetsCount`, `purgedAssetUsagesCount`, `purgedAssetLineagesCount`.

Example: purge old VM assets on a monthly schedule.

```yaml
id: asset_retention_policy
namespace: company.infra

triggers:
  - id: monthly_cleanup
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 0 1 * *"

tasks:
  - id: purge_old_vms
    type: io.kestra.plugin.ee.assets.PurgeAssets
    assetType:
      - io.kestra.plugin.ee.assets.VM
    endDate: "{{ now() | dateAdd(-180, 'DAYS') }}"
```

## Purge tasks vs. UI deletion

Purge tasks perform **hard deletion**, permanently removing records and reclaiming storage. In contrast, deleting items in the UI is a **soft deletion** — the data is hidden but retained (e.g., revision history and past executions can reappear if a flow with the same ID is recreated).

This distinction matters for compliance and troubleshooting: purge flows are best for cleaning up space, while UI deletions preserve history for auditability.

:::alert{type="warning"}
Purge tasks do not affect Kestra’s [internal queues](../../08.architecture/01.main-components/index.md#queue). Queue retention is managed separately via the [Runtime and Storage configuration](../../configuration/02.runtime-and-storage/index.md) for JDBC or the [Enterprise and Advanced configuration](../../configuration/06.enterprise-and-advanced/index.md) for Kafka.
:::

:::collapse{title="Renamed Purge Tasks in 0.18.0"}
We've [improved](https://github.com/kestra-io/kestra/pull/4298) the mechanism of the **Purge tasks** to make them more performant and reliable — some tasks have been renamed to reflect their enhanced functionality.

Here are the main `Purge` plugin changes in Kestra 0.18.0:

- `io.kestra.plugin.core.storage.Purge` has been renamed to `io.kestra.plugin.core.execution.PurgeExecutions` to reflect that it only purges data related to executions (e.g., it doesn't include trigger logs; use the `PurgeLogs` task for those). An alias has been added so that using the old task type will still work, but it will emit a warning. Use the new task type going forward.
- `io.kestra.plugin.core.storage.PurgeExecution` has been renamed to `io.kestra.plugin.core.storage.PurgeCurrentExecutionFiles` to reflect that it purges all data from the current execution, including inputs and outputs. An alias has been added for backward compatibility, but update your flows to use the new task type.
:::
