---
title: Using SQLMesh
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Integrations
version: ">= 0.18.0"
---

Using SQLMesh to run dbt project via Kestra

## Introduction to SQLMesh

SQLMesh is an open source data transformation and modelling framework. It is a Python framework that automates everything needed to run a scalable data transformation platform. SQLMesh works with a variety of [engines and orchestrators](https://sqlmesh.readthedocs.io/en/stable/integrations/overview/).

SQLMesh enables data teams to efficiently run and deploy data transformations written in SQL or Python.

In this guide, we will learn how to run dbt project based on BigQuery using SQLMesh via Kestra.

## SQLMesh based flow

### Introduction to Flow

Here is what we are going to do in the Kestra flow:

1. Download the `orders.csv` using http download task.
2. Create the table in BigQuery.
3. Upload the data from the csv file into BigQuery table.
4. Create dbt project which will create the BigQuery view from the BigQuery table.
5. Create SQLMeshCLI task that will run the dbt project.

### How will we implement dbt project?

SQLMesh supports integration with a variety of tools like Airflow, dbt, dlt, etc. One of the common use-cases of SQLMesh is to run dbt projects.

You can choose to pull your dbt project from Git repository as mentioned in the [how-to-guide on dbt](docs/how-to-guides/dbt) or create the namespace files for the complete project. Here, we will create the complete project using namespace files which we will create on the fly. You can later choose to push all the namespace files to GitHub repository using [PushNamespaceFiles](docs/how-to-guides/pushnamespacefiles).

### Creating Flow with SQLMeshCLI task

We will first create the Kestra flow.

Based on the steps mentioned in the description, lets create tasks for each step.

```yaml
id: sqlmesh_transform
namespace: company.team

tasks:
  - id: orders_http_download
    type: io.kestra.plugin.core.http.Download
    description: Download orders.csv using HTTP Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/#main/csv/orders.csv

  - id: create_orders_table
    type: io.kestra.plugin.gcp.bigquery.CreateTable
    description: Create orders table in BigQuery
    serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    projectId: <gcp-project-id>
    dataset: ecommerce
    table: orders
    tableDefinition:
      type: TABLE
      schema:
        fields:
        - name: order_id
          type: INT64
        - name: customer_name
          type: STRING
        - name: customer_email
          type: STRING
        - name: product_id
          type: INT64
        - name: price
          type: FLOAT64
        - name: quantity
          type: INT64
        - name: total
          type: FLOAT64

  - id: load_orders_table
    type: io.kestra.plugin.gcp.bigquery.Load
    description: Load orders table with data from orders.csv
    from: "{{ outputs.orders_http_download.uri }}"
    projectId: <gcp-project-id>
    serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    destinationTable: "<gcp-project-id>.ecommerce.orders"
    format: CSV
    csvOptions:
      fieldDelimiter: ","
      skipLeadingRows: 1

  - id: sqlmesh_transform
    type: io.kestra.plugin.sqlmesh.cli.SQLMeshCLI
    description: Use SQLMesh to run the dbt project
    inputFiles:
      sa.json: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    namespaceFiles:
      enabled : true
    beforeCommands:
      - pip install "sqlmesh[bigquery]"
      - pip install dbt-bigquery
    commands:
      - sqlmesh init -t dbt
      - sqlmesh plan --auto-apply
```

Ensure you set the `namespaceFiles` property with `enabled: true` to ensure that the task has access to namespaceFiles. Provide the GCP service account JSON file so that the task is able to connect to GCP account in order to access BigQuery. This file is referenced in the dbt project file.

Also, we require the `sqlmesh[bigquery]` depenedency to be installed so that the SQLMesh is able to perform operations on BigQuery. Along with this, we will also require `dbt-bigquery` dependency. We will put these dependencies installation in the `beforeCommands`.

Once the task is created, save the flow.

### Creating dbt project

Let us now go to the Editor, and create the `profiles.yml` file with the following content:

```yaml
bq_dbt_project:
  outputs:
    dev:
      type: bigquery
      method: service-account
      dataset: ecommerce
      project: <gcp-project-id>
      keyfile: sa.json
      location: US
      priority: interactive
      threads: 16
      timeout_seconds: 300
      fixed_retries: 1
  target: dev
```

Next, we will create `dbt_project.yml` file:

```yaml
name: 'bq_dbt_project'
version: '1.0.0'
config-version: 2

profile: 'bq_dbt_project'

model-paths: ["models"]
analysis-paths: ["analyses"]
test-paths: ["tests"]
seed-paths: ["seeds"]
macro-paths: ["macros"]
snapshot-paths: ["snapshots"]

clean-targets:
  - "target"
  - "dbt_packages"

models:
  bq_dbt_project:
    example:
      +materialized: view
  +start: Nov 10 2024
```

Note that `models` require a start date for backfilling data through use of the `start` configuration parameter.

Let us now create a folder `models` in the namespace. In the `models` folder, we will create `sources.yml` which will define the source models.

```yaml
version: 2

sources:
  - name: ecommerce
    database: <gcp-project-id>
    schema: ecommerce
    tables: 
      - name: orders
```

Lastly, we will create the `stg_orders.sql` file which will materialize the `stg_orders` view for the `orders` table.

```
{{ config(materialized="view") }}

select order_id,
customer_name,
customer_email,
product_id,
price,
quantity,
total
from {{ source('ecommerce', 'orders') }}
```

Thats it! We are now ready to run the flow.

Once the flow runs successfully, you can go to BigQuery console, and ensure that the view `stg_orders` has been created.

This is how we can run SQLMeshCLI for the dbt project. These instructions also help you relate as to how you can integrate SQLMeshCLI task with other SQLMesh [integrations and execution engines](https://sqlmesh.readthedocs.io/en/stable/integrations/dbt/).
