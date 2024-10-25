---
title: Purge
icon: /docs/icons/admin.svg
version: ">= 0.18.0"
---

Purge old executions and logs to save disk space.

As your workflows grow, you may need to clean up old executions and logs to save disk space.

The recommended way to clean execution and logs is using a combination of `io.kestra.plugin.core.execution.PurgeExecutions` and the newly added `io.kestra.plugin.core.log.PurgeLogs` task as shown below. The `PurgeLogs` task removes all logs (both `Execution` logs and `Trigger` logs) in a performant batch operation. Combining those two together will give you the same functionality as the previous `io.kestra.plugin.core.storage.Purge` task but in a more performant and reliable way (roughly [10x faster](https://github.com/kestra-io/kestra/pull/4298#issuecomment-2220106142)).

::alert{type="info"}
Additionally, the [Enterprise Edition](../06.enterprise/index.md) includes the [`PurgeAuditLogs` task](../06.enterprise/06.audit-logs.md#how-to-purge-audit-logs).
::

```yaml
id: purge
namespace: company.myteam
description: |
  This flow will remove all executions and logs older than 1 month.
  We recommend running this flow daily to avoid running out of disk space.

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

::alert{type="warning"}
Note that the **Purge tasks** do not affect Kestra's [internal queues](../07.architecture/01.main-components.md#queue). Queue retention is configured separately. The database type uses a dedicated [JDBC Cleaner](../configuration/index.md#jdbc-cleaner) and the Kafka type relies on [topic retention](../configuration/index.md#topic-retention).
::

::collapse{title="Renamed Purge Tasks in 0.18.0"}
We've [improved](https://github.com/kestra-io/kestra/pull/4298) the mechanism of the **Purge tasks** to make them more performant and reliable — some tasks have been renamed to reflect their enhanced functionality.

Here are the main `Purge` plugin changes in Kestra 0.18.0:

- `io.kestra.plugin.core.storage.Purge` has been renamed to `io.kestra.plugin.core.execution.PurgeExecutions` to reflect that it only purges data related to executions (_e.g. not including trigger logs — to purge those you should use the `PurgeLogs` task_) — we've added an alias so that using the old task type will still work but it will emit a warning. We recommend using the new task type.
- `io.kestra.plugin.core.storage.PurgeExecution` has been renamed to `io.kestra.plugin.core.storage.PurgeCurrentExecutionFiles` to reflect that it can purge all execution-related data incl. inputs to an Execution and Execution outputs — also here, we've added an alias so that using the old task type will still work but it will emit a warning. Again, we recommend adjusting your flow code to match the new task type.
::
