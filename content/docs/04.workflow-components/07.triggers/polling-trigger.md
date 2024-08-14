---
title: Polling Trigger
icon: /docs/icons/flow.svg
---

Trigger flows by polling external systems.

Polling triggers are a type of triggers that are provided by our plugins. They allow polling an external system for the presence of data. In case data is ready to be processed, a flow execution is started.

Kestra provides polling triggers for a wide variety of external systems, for example: databases, message brokers, ftp, ...

Polling triggers will poll the external system at a fixed interval defined by the `interval` property, the triggered flow will have the outputs of the polling trigger available on the `trigger` variable.

## Example

For example, the following flow will be triggered when rows are available on the `my_table` PostgreSQL table, and when triggered, it will delete the rows (to avoid processing them again on the next poll) and log them.

```yaml
id: jdbc-trigger
namespace: company.team

inputs:
  - id: db_url
    type: STRING

tasks:
- id: update
  type: io.kestra.plugin.jdbc.postgresql.Query
  url: "{{ inputs.db_url }}"
  sql: DELETE * FROM my_table

- id: log
  type: io.kestra.plugin.core.log.Log
  message: "{{ trigger.rows }}"

triggers:
  - id: watch
    type: io.kestra.plugin.jdbc.postgresql.Trigger
    url: myurl
    interval: "PT5M"
    sql: "SELECT * FROM my_table"
```

Polling triggers can be evaluated on a specific Worker Group (EE), thanks to the `workerGroup.key` property.
