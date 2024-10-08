---
title: Naming conventions
icon: /docs/icons/best-practices.svg
---

This page describes common naming conventions to keep your flows and tasks well-organized and consistent.

## Namespace Naming Conventions

We recommend using the `company.team` naming convention for namespaces to maintain a well-organized and consistent structure across your workflows. This pattern helps in the following ways:
1. Centralized governance for credentials
2. Sharing configurations across namespaces
3. Simplified Git sync

### Why we recommend a `company.team` namespace structure

By having **a root namespace named after your company**, you can centrally govern [plugin defaults](../04.workflow-components/09.plugin-defaults.md), [variables](../04.workflow-components/04.variables.md) and [secrets](../05.concepts/04.secret.md) and share that configuration across all other namespaces under the company root.

Adhering to this naming convention also simplifies [Git operations](../version-control-cicd/04.git.md). You can maintain a single flow that synchronizes all workflows with Git across all namespaces under the parent namespace named after your company.

The next level of namespaces should be named after your team (e.g., `company.team`). This structure allows for centralized governance and visibility at the team level before further dividing into projects, systems, or other logical hierarchies. When syncing your code with Git, that nested structure will be reflected as nested directories in your Git repository.

### Example Namespace Structure

Here is an example of how you might structure your namespaces:

- `mycompany`
  - `mycompany.marketing`
    - `mycompany.marketing.projectA`
    - `mycompany.marketing.projectB`
  - `mycompany.sales`
    - `mycompany.sales.projectC`
    - `mycompany.sales.projectD`

### Should you use environment-specific namespaces?

We generally recommend against using environment-specific namespaces (e.g., `dev`, `prod`, `staging`) because it can lead to several issues such as:
- **Dev and prod not fully separated**: a development workflow running out of memory could impact the production instance.
- **Duplication of configurations**: you may end up duplicating configurations across environments, which can lead to inconsistencies.

It's recommended to use separate Kestra instances to separate dev and prod environments.

### Summary

The `company.team` namespace structure  will help you to facilitate a logical, easy to maintain hierarchy, and will make it easy to sync your workflows with Git. To reliably separate dev and prod environments, use separate Kestra instances or tenants.

---

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
    type: io.kestra.plugin.core.http.Request
    uri: "{{ inputs.api_endpoint }}"

  - id: transform_in_python
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:slim
    beforeCommands:
      - pip install polars
    warningOnStdErr: false
    outputFiles:
      - "products.csv"
    script: |
      import polars as pl
      data = {{ outputs.fetch_products.body | jq('.products') | first }}
      df = pl.from_dicts(data)
      df.glimpse()
      df.select(["brand", "price"]).write_csv("products.csv")

  - id: sql_query
    type: io.kestra.plugin.jdbc.duckdb.Query
    inputFiles:
      in.csv: "{{ outputs.transform_in_python.outputFiles['products.csv'] }}"
    sql: |
      SELECT brand, round(avg(price), 2) as avg_price
      FROM read_csv_auto('{{ workingDir }}/in.csv', header=True)
      GROUP BY brand
      ORDER BY avg_price DESC;
    fetchType: STORE

outputs:
  - id: final_result
    value: "{{ outputs.sql_query.uri }}"

triggers:
  - id: daily_at_9am
    type: io.kestra.plugin.core.trigger.Schedule
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
    type: io.kestra.plugin.core.http.Request
    uri: "{{ inputs.apiEndpoint }}"

  - id: transformInPython
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:slim
    beforeCommands:
      - pip install polars
    warningOnStdErr: false
    outputFiles:
      - "products.csv"
    script: |
      import polars as pl
      data = {{outputs.fetchProducts.body | jq('.products') | first}}
      df = pl.from_dicts(data)
      df.glimpse()
      df.select(["brand", "price"]).write_csv("products.csv")

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
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
```

Both conventions are valid and it's up to you to choose the one you prefer.

