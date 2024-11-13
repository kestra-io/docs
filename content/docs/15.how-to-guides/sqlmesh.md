---
title: Using SQLMesh to run dbt Projects
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Integrations
version: ">= 0.18.0"
---

Using SQLMesh to run dbt project with Kestra.

## What is SQLMesh?

SQLMesh is an open source python data transformation and modelling framework. It automates everything needed to run a scalable data transformation platform. SQLMesh works with a variety of [engines and orchestrators](https://sqlmesh.readthedocs.io/en/stable/integrations/overview/).

SQLMesh enables data teams to efficiently run and deploy data transformations written in SQL or Python.

In this guide, we will learn how to run dbt projects based on BigQuery using SQLMesh with Kestra.

## Example

Our Flow will do the following steps:

1. Download `orders.csv` using HTTP download task.
2. Create the table in BigQuery.
3. Upload the data from the csv file into the BigQuery table.
4. Create a dbt project which will create the BigQuery view from the BigQuery table.
5. Create SQLMeshCLI task that will run the dbt project.

SQLMesh supports integration with a variety of tools like Airflow, dbt, dlt, etc. One of the common use-cases of SQLMesh is to run dbt projects.

You can choose to pull your dbt project from a Git repository as mentioned in the [How-to guide on dbt](./dbt.md) or create [namespace files](../05.concepts/02.namespace-files.md) for the project. Here, we will create the complete project using namespace files which we will create as we go. You can later choose to push all the namespace files to a GitHub repository using [PushNamespaceFiles](./pushnamespacefiles.md).

### Creating our Flow with SQLMeshCLI Task

Based on the steps mentioned in the description, let's create tasks for each step.

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

It's important that we have the following properties configured:
- `namespaceFiles` property has `enabled` set to `true` to ensure that the task has access to your namespace files.
- Provide the GCP service account JSON file so that the task is able to connect to your GCP account in order to access BigQuery. Check out the [dedicated guide](./google-credentials.md) on how to add it. This file is referenced in the dbt project file.
- Install the `sqlmesh[bigquery]` and `dbt-bigquery` depenedencies with `beforeCommands`. These allow SQLMesh and dbt to perform operations on BigQuery. 

Once the task is created and configured correctly, save the flow.

### Creating dbt project

Now go to the Editor, create a new file called `profiles.yml` with the following content:

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

Next, we will create `dbt_project.yml` with the following content:

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

::alert{type="info"}
Note that `models` require a start date for backfilling data through use of the `start` configuration parameter.
::

Now create a folder called `models` in the namespace. In the `models` folder, we will create `sources.yml` which will define the source models, with the following content:

```yaml
version: 2

sources:
  - name: ecommerce
    database: <gcp-project-id>
    schema: ecommerce
    tables: 
      - name: orders
```

Lastly, we will create `stg_orders.sql` which will materialize the `stg_orders` view for the `orders` table.

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

This is how we can run SQLMeshCLI for the dbt project. These instructions can also help you integrate the SQLMeshCLI task with other SQLMesh [integrations and execution engines](https://sqlmesh.readthedocs.io/en/stable/integrations/dbt/).
