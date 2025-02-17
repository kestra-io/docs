---
title: Dynamic Dropdown for Inputs
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Concepts
---

Support dynamic dropdown for inputs based on data from external source.

## Use-case

In this guide, we show how you can create a dynamic dropdown list for inputs. The dropdown retrieves the values from an external source. While it is not possible to directly integrate the external source for powering the dynamic dropdown, it is possible to do so using the [KV store](../05.concepts/05.kv-store.md).

## Update KV store on schedule

To get started, we create a flow that fetches the data from the external source and set the value in the KV store. The value will be in the form of a list of strings.

In this example, the flow fetches data from a PostgreSQL table on an hourly schedule. You can change the `cron` property to run at a different frequency depending on how frequently you expect the data at the source to change. If the external source is in a database that supports change data capture, as in this case where we use PostgreSQL table, you can also leverage [debezium trigger](/plugins/debezium%20postgresql/triggers/io.kestra.plugin.debezium.postgres.trigger) and immediately update the KV store.

```yaml
id: update_kv_store
namespace: company.team

tasks:
  - id: fetch_departments
    type: io.kestra.plugin.jdbc.postgresql.Query
    url: "jdbc:postgresql://{{ secret('POSTGRES_HOST') }}:5432/postgres"
    username: "{{ secret('POSTGRES_USERNAME') }}"
    password: "{{ secret('POSTGRES_PASSWORD') }}"
    sql: select department_name from departments
    fetchType: FETCH

  - id: department_key
    type: io.kestra.plugin.core.kv.Set
    key: "{{ task.id }}"
    kvType: JSON
    value: "{{ outputs.fetch_departments.rows | jq('.[].department_name') }}"

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 */1 * * *"
```

This is how the KV store will look post execution of the above flow.

![kv_store_content](/docs/how-to-guides/dynamic-inputs/kv_store_content.png)

## Flow supporting Dynamic Inputs

Let us now create the flow that supports dynamic dropdown for inputs powered by the KV store key.

```yaml
id: dynamic_input_flow
namespace: company.team

inputs:
  - id: department
    displayName: Department Name
    type: SELECT
    expression: "{{ kv('department_key') }}"

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: "The selected department is {{ inputs.department }}"
```

When you execute this flow, the `department` input will have a dropdown that contains the values fetched from the `department_key` key in the KV store.

![dynamic_dropdown](/docs/how-to-guides/dynamic-inputs/dynamic_dropdown.png)
