---
title: Purge
icon: /docs/icons/admin.svg
version: ">= 0.18.0"
---

Use purge tasks to remove old executions, logs, and Key-value pairs, helping reduce storage usage.

The recommended to keep optimized storage is to use [`io.kestra.plugin.core.execution.PurgeExecutions`](/plugins/core/tasks/io.kestra.plugin.core.execution.purgeexecutions), [`io.kestra.plugin.core.log.PurgeLogs`](/plugins/core/tasks/log/io.kestra.plugin.core.log.purgelogs), and [`io.kestra.plugin.core.kv.PurgeKV`](/plugins/core/kv/io.kestra.plugin.core.kv.purgekv).
- `PurgeExecutions`: deletes execution records
- `PurgeLogs`: removes both `Execution` and `Trigger` logs in bulk
- `PurgeKV`: deletes expired keys globally for a specific namespace.

Together, these replace the legacy `io.kestra.plugin.core.storage.Purge` task with a **faster and more reliable process (~10x faster)**.

:::alert{type="info"}
The [Enterprise Edition](../07.enterprise/index.md) also includes [`PurgeAuditLogs`](../07.enterprise/02.governance/06.audit-logs.md#how-to-purge-audit-logs).
:::

The flow below purges executions and logs:

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

The example below purges expired Key-value pairs from the `company` Namespace. It's set up as a flow in the [`system`](../06.concepts/system-flows.md) namespace.

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

## Purge tasks vs. UI deletion

Purge tasks perform **hard deletion**, permanently removing records and reclaiming storage. In contrast, deleting items in the UI is a **soft deletion**—the data is hidden but retained (e.g., revision history and past executions can reappear if a flow with the same ID is recreated).

This distinction matters for compliance and troubleshooting: purge flows are best for cleaning up space, while UI deletions preserve history for auditability.

:::alert{type="warning"}
Purge tasks do not affect Kestra’s [internal queues](../08.architecture/01.main-components.md#queue). Queue retention is managed separately via [JDBC Cleaner](../configuration/index.md#jdbc-cleaner) (for database) or [topic retention](../configuration/index.md#topic-retention) (for Kafka).
:::

:::collapse{title="Renamed Purge Tasks in 0.18.0"}
We've [improved](https://github.com/kestra-io/kestra/pull/4298) the mechanism of the **Purge tasks** to make them more performant and reliable — some tasks have been renamed to reflect their enhanced functionality.

Here are the main `Purge` plugin changes in Kestra 0.18.0:

- `io.kestra.plugin.core.storage.Purge` has been renamed to `io.kestra.plugin.core.execution.PurgeExecutions` to reflect that it only purges data related to executions (_e.g. not including trigger logs — to purge those you should use the `PurgeLogs` task_) — we've added an alias so that using the old task type will still work but it will emit a warning. We recommend using the new task type.
- `io.kestra.plugin.core.storage.PurgeExecution` has been renamed to `io.kestra.plugin.core.storage.PurgeCurrentExecutionFiles` to reflect that it purges all data from the current execution, including inputs and outputs. We've also added an alias for backward compatibility, but we recommend updating your flows to use the new task type.
:::
