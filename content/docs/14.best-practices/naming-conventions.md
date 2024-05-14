---
title: Naming conventions
icon: /docs/icons/best-practices.svg
---

This page describes common naming conventions to keep your flows and tasks well-organized and consistent.

## Subscript notation and valid characters in IDs

Kestra doesn't _enforce_ any naming convention. For example, if you want to use the URL-style naming including hyphens, Kestra supports that. However, keep in mind that IDs for flows, tasks, inputs, outputs and triggers must match the `"^[a-zA-Z0-9][a-zA-Z0-9_-]*"` regex pattern. This means that:

- you can't use any special characters except for hyphens ``-`` and underscores ``_``
- when using hyphens, you need to follow the format `"{{ outputs.task_id[your-custom-value].attribute }}"` when referencing that ID in output expressions; the square brackets `[]` in  `[your-custom-value]` is called the subscript notation and it enables using special characters such as spaces or hyphens (as in the `kebab-case` notation) in task identifiers or output attributes.

::alert{type="info"}
We recommend using the `snake_case` or `camelCase` conventions over the `kebab-case`, as they allow you to avoid the subscript notation and make your flows easier to read.
::

## Snake case

Snake case is a common naming convention in programming. It's popular among Python developers in the data science, AI and data engineering domain.

Here is an example of a flow using the snake case convention to name IDs for flows, inputs, outputs, tasks, and triggers:

```yaml
id: api_python_sql
namespace: prod.marketing.attribution

inputs:
  - id: api_endpoint
    type: URL
    defaults: https://dummyjson.com/products

tasks:
  - id: fetch_products
    type: io.kestra.plugin.fs.http.Request
    uri: "{{ inputs.api_endpoint }}"

  - id: transform_in_python
    type: io.kestra.plugin.scripts.python.Script
    docker:
      image: python:slim
    beforeCommands:
      - pip install polars
    warningOnStdErr: false
    script: |
      import polars as pl
      data = {{outputs.fetch_products.body | jq('.products') | first}}
      df = pl.from_dicts(data)
      df.glimpse()
      df.select(["brand", "price"]).write_csv("{{outputDir}}/products.csv")

  - id: sql_query
    type: io.kestra.plugin.jdbc.duckdb.Query
    inputFiles:
      in.csv: "{{ outputs.transform_in_python.outputFiles['products.csv'] }}"
    sql: |
      SELECT brand, round(avg(price), 2) as avg_price
      FROM read_csv_auto('{{workingDir}}/in.csv', header=True)
      GROUP BY brand
      ORDER BY avg_price DESC;
    store: true

outputs:
  - id: final_result
    value: "{{ outputs.sql_query.uri }}"

triggers:
  - id: daily_at_9am
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "0 9 * * *"
```

## Camel case

Camel case is another common naming convention in programming. It's popular among Java and JavaScript developers. Let's look at the same flow as above, but using the camel case convention:

```yaml
id: apiPythonSql
namespace: prod.marketing.attribution

inputs:
  - id: apiEndpoint
    type: URL
    defaults: https://dummyjson.com/products

tasks:
  - id: fetchProducts
    type: io.kestra.plugin.fs.http.Request
    uri: "{{ inputs.apiEndpoint }}"

  - id: transformInPython
    type: io.kestra.plugin.scripts.python.Script
    docker:
      image: python:slim
    beforeCommands:
      - pip install polars
    warningOnStdErr: false
    script: |
      import polars as pl
      data = {{outputs.fetchProducts.body | jq('.products') | first}}
      df = pl.from_dicts(data)
      df.glimpse()
      df.select(["brand", "price"]).write_csv("{{outputDir}}/products.csv")

  - id: sqlQuery
    type: io.kestra.plugin.jdbc.duckdb.Query
    inputFiles:
      in.csv: "{{ outputs.transformInPython.outputFiles['products.csv'] }}"
    sql: |
      SELECT brand, round(avg(price), 2) as avgPrice
      FROM read_csv_auto('{{workingDir}}/in.csv', header=True)
      GROUP BY brand
      ORDER BY avgPrice DESC;
    store: true

outputs:
  - id: finalResult
    value: "{{ outputs.sqlQuery.uri }}"

triggers:
  - id: dailyAt9am
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "0 9 * * *"
```

Both conventions are valid and it's up to you to choose the one you prefer.

