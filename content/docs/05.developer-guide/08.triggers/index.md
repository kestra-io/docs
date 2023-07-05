---
title: Triggers & schedule
---

Triggers can start a flow based on an external event. A trigger can be a scheduled date, a new file arrival, a new message in a queue, or the end of another flow's execution.

Triggers restrict parallel execution for a given trigger ID to one active run. For instance, if an Execution from a flow with a `Schedule` trigger with ID `hourly` is still in a `Running` state, another one will not be started. However, you can still trigger the same flow manually (from the UI or API), and the scheduled Executions will not be affected.

```yaml
id: hourlyFlow
namespace: dev
tasks:
  - id: important-task
    type: io.kestra.core.tasks.log.Log
    message: If this runs for longer than 1h, next Executions will be queued rather than being started immediately
triggers:
  - id: hourly
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "@hourly"
```


## Core triggers

The following triggers are included in Kestra core:

- [Schedule](./01.schedule.md): to trigger a flow based on a schedule.
- [Flow](./02.flow.md): to trigger a flow after another one.
- [Webhook](./03.webhook.md): to trigger a flow from an HTTP request.

## Polling triggers

Polling triggers are a type of triggers that are provided by our plugins. They allow polling an external system for the presence of data. In case data are ready to be processed, a flow execution is started.

Kestra provides polling triggers for a wide variety of external systems: databases, message brokers, ftp, ...

Polling triggers will poll the external system at a fixed interval defined by the `interval` property, the triggered flow will have the outputs of the polling trigger available on the `trigger` variable.

For example, the following flow will be triggered when rows are available on the `my_table` PostgreSQL table, and when triggered, it will delete the rows (to avoid processing them again on the next pol) and log them.

```yaml
id: jdbc-trigger
namespace: io.kestra.tests

tasks:
- id: update
  type: io.kestra.plugin.jdbc.postgresql.Query
  sql: DELETE * FROM my_table
- id: log
  type: io.kestra.core.tasks.log.Log
  message: {{trigger.rows}}

triggers:
  - id: watch
    type: io.kestra.plugin.jdbc.postgresql.Trigger
    interval: "PT5M"
    sql: "SELECT * FROM my_table"
```

Polling triggers can be evaluated on a specific [Worker Group (EE)](../08.architecture.md#worker-group-ee), thanks to the `workerGroup.key` property.