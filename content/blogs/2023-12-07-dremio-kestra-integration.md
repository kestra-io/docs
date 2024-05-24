---
title: "Data lakehouse orchestration with Kestra, Dremio, dbt and Python"
description: "Recently, we've released the Dremio and Arrow Flight SQL plugins for Kestra, which allow you to seamlessly integrate Dremio with Kestra workflows. This blog post will dive into how you can leverage Dremio, dbt, Python, and Kestra to orchestrate workflows built on top of a data lakehouse."
date: 2023-12-07T15:30:00
category: Solutions
author:
  name: Anna Geller
  image: "ageller"
image: /blogs/2023-12-07-dremio-kestra-integration.png
---



Recently, we've released the [Dremio](https://kestra.io/plugins/plugin-jdbc-dremio/) and [Arrow Flight SQL](https://kestra.io/plugins/plugin-jdbc-arrow-flight/) plugins, which allow you to automate [Dremio](https://www.dremio.com/) data workflows with [Kestra](https://github.com/kestra-io/kestra). This post will dive into how you can leverage Dremio, [dbt](https://github.com/dbt-labs/dbt-core), Python and Kestra to orchestrate processes built on top of a data lakehouse.

---

## What is Dremio

[Dremio](https://github.com/kestra-io/kestra) is a data lakehouse platform that simplifies big data analytics. It allows you to directly access data from various sources, such as Postgres, S3 and Azure Data Lake Storage, without needing to copy or move the data. Its key features include a fast query engine, a semantic layer to help manage and share data, a catalog for [Iceberg tables](https://kestra.io/blogs/2023-08-05-iceberg-for-aws-users), and [reflections](https://www.dremio.com/resources/tutorials/getting-started-with-reflections/) — a market-leading query acceleration technology that delivers sub-second query response times. Designed to work with SQL and common BI tools, Dremio provides self-service analytics and data management for BI workloads with the best price performance and lowest cost.


---

## How Kestra Helps to Manage Data Lakehouse Workflows

Kestra is a universal orchestration platform for business-critical operations. It allows you to automate data workflows across multiple systems, including Dremio. It's designed to reliably manage complex workflows, be it event-driven pipelines, scheduled batch data transformations, or API-driven automations. Kestra is built with a modular architecture that allows you to easily extend its functionality with plugins, including among others [dbt](https://kestra.io/plugins/plugin-dbt/tasks/cli/io.kestra.plugin.dbt.cli.dbtcli), [Python](https://kestra.io/plugins/plugin-script-python), [Dremio](https://kestra.io/plugins/plugin-jdbc-dremio) and the [Arrow Flight SQL](https://kestra.io/plugins/plugin-jdbc-arrow-flight) plugins. These plugins allow you to execute custom scripts and SQL queries, trigger actions based on data changes, and much more.

---

### Dremio Plugin

With the Dremio plugin, you can interact with Dremio data sources via JDBC. This plugin includes:

- **Trigger**: trigger workflows based on conditions in the Dremio database. For example, you can execute a workflow when there is an anomaly in the data, or when certain KPIs fall outside of an expected range.
- **Task**: run SQL queries against Dremio databases to fetch data for downstream processing in Python, R, or other languages supported by Kestra.

---

### Arrow Flight SQL Plugin

For broader compatibility with databases using Apache Arrow, Kestra offers the Arrow Flight SQL plugin. It includes:

- **Trigger**: trigger workflows in response to data changes in Arrow Flight SQL-compatible databases.
- **Task**: use SQL to fetch columnar data from Arrow Flight SQL-compatible databases for further processing.

---

## Tutorial: How to Automate Data Lakehouse Workflows with Kestra and Dremio

Let's look at a practical application of Kestra and Dremio for data lakehouse orchestration. The workflow involves data transformation with dbt, then fetching transformed data from a Dremio lakehouse using SQL, and finally processing it with Polars in a Python task.

---

### Prerequisites

- **Kestra Setup**: start Kestra — by default, it includes all plugins that you need to follow this tutorial. See the [Getting Started](https://kestra.io/docs/developer-guide/plugins) documentation for more installation details.
- **Dremio Account**: if you are new to Dremio, the easiest way to familiarize yourself with the platform is to create a [Dremio Test Drive](https://docs.dremio.com/cloud/test-drive/) account, which provides you with a Dremio instance and sample datasets to query without requiring any subscription or installation.
- **Dremio Token**: create a Personal Access Token (PAT) in your Dremio account. To do that, go to your Dremio account settings and then to the section "Personal Access Token". From here, you can create the token, copy it and store it as a [Kestra secret](https://kestra.io/docs/developer-guide/secrets) to avoid exposing it directly in your flow code. Check the [Dremio documentation](https://docs.dremio.com/cloud/security/authentication/personal-access-token#creating-a-pat) for more details.
- **Dremio Project ID**: you can find the project ID in your Dremio URL. For example, if your Dremio URL is `https://app.dremio.cloud/sonar/ead79cc0-9e93-4d50-b364-77639a56d4a6`, then your project ID is the last string `ead79cc0-9e93-4d50-b364-77639a56d4a6`.

---

### Workflow Breakdown

1. **Transforming Data with dbt**:
   - The `io.kestra.plugin.git.Clone` task clones the [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop) repository, which contains a sample dataset in the `seeds` directory, and dbt models in the `models` directory.
   - The `io.kestra.plugin.dbt.cli.DbtCLI` task runs a `dbt` command to build models and run tests.
   - Make sure to follow the [dbt Dremio installation instructions](https://docs.getdbt.com/docs/core/connect-data-platform/dremio-setup) to set up your dbt profile for Dremio.

2. **Querying Data from Dremio**:
   - The `io.kestra.plugin.jdbc.dremio.Query` task queries the Dremio data source using JDBC.
   - The query results are fetched for downstream use into Kestra's internal storage as a file serialized in the Amazon Ion format.

3. **Convert Ion to CSV**:
   - The `io.kestra.plugin.serdes.csv.IonToCsv` task converts the Ion file into a CSV file. This task saves us many lines of code to transform between data formats because the Polars library, used in the next task, does not support Amazon Ion files as input [yet](https://github.com/pola-rs/polars/issues/12069).

4. **Processing Data with Python**:
   - The `io.kestra.plugin.scripts.python.Script` task utilizes a Docker image with [Polars](https://www.pola.rs/).
   - The script reads the query result into a [Polars DataFrame](https://kestra.io/blogs/2023-08-11-dataframes).
   - This DataFrame is then available for further analysis or reporting.



![dremio architecture](/blogs/2023-12-07-dremio-kestra-integration/dremio-architecture.png)

---

### Workflow Code

Here is the full workflow code for this example:

```yaml
id: dremio_sql_python
namespace: dremio

variables:
  user: rick.astley@kestra.io
  project_id: ead79cc0-9e93-4d50-b364-77639a56d4a6

tasks:
  - id: wdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
    - id: cloneRepository
      type: io.kestra.plugin.git.Clone
      url: https://github.com/dbt-labs/jaffle_shop
      branch: main

    - id: dbt
      type: io.kestra.plugin.dbt.cli.DbtCLI
      docker:
        image: ghcr.io/kestra-io/dbt-dremio:latest
      profiles: |
        jaffle_shop:
          outputs:
            dev:
              type: dremio
              threads: 16
              cloud_host: api.dremio.cloud
              cloud_project_id: "{{ vars.project_id }}"
              user: "{{ vars.user }}"
              pat: "{{ secret('DREMIO_TOKEN') }}"
              use_ssl: true
          target: dev
      commands:
        - dbt build

  - id: query
    type: io.kestra.plugin.jdbc.dremio.Query
    disabled: false
    url: "jdbc:dremio:direct=sql.dremio.cloud:443;ssl=true;PROJECT_ID={{vars.project_id}};"
    username: $token
    password: "{{ secret('DREMIO_TOKEN') }}"
    sql: SELECT * FROM "@{{ vars.user }}"."stg_customers";
    store: true

  - id: to_csv
    type: io.kestra.plugin.serdes.csv.IonToCsv
    from: "{{ outputs.query.uri }}"

  - id: python
    type: io.kestra.plugin.scripts.python.Script
    warningOnStdErr: false
    docker:
      image: ghcr.io/kestra-io/polars:latest
    inputFiles:
      data.csv: "{{ outputs.to_csv.uri }}"
    script: |
      import polars as pl
      df = pl.read_csv("data.csv")

      print(df.glimpse())
```

This flow clones a Git repository with [dbt code](https://github.com/dbt-labs/jaffle_shop), and runs dbt models and tests. Then, it fetches that transformed data from Dremio and passes the query results to a downstream Python task that further transforms fetched data using [Polars](https://www.pola.rs).



![dremio_topology](/blogs/2023-12-07-dremio-kestra-integration/dremio_topology.png)


---

## How to Extend this Workflow

This use case is deliberately simple to demonstrate the basic usage of these plugins. However, you can easily extend it to accommodate more complex data processing requirements. For example, if you need to automate business-critical operations **for each row from a large dataset**, add a `ForEachItem` task. [That task](https://kestra.io/docs/developer-guide/tasks#foreachitem) allows you to iterate over a list of items fetched from your data lakehouse and reliably execute downstream tasks in parallel for each row.

---

## Next Steps

Integrating Dremio with Kestra offers a powerful solution for analytical workflows and scenarios involving complex data transformations and business-critical operations. The simple example covered in this post can be easily customized based on your requirements. If you like Kestra, give us a [star on GitHub](https://github.com/kestra-io/kestra) and join the [community](https://kestra.io/slack). If you want to learn more about Dremio, visit https://www.dremio.com for more information.