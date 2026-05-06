---
title: Use Dataform in Kestra
h1: Orchestrate Declarative Dataform Workflows in Kestra
description: Orchestrate DataForm transformations in Kestra. Schedule and run DataForm jobs in your data pipeline for reliable, version-controlled SQL-based data modeling.
icon: /src/contents/docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Integrations
version: ">= 0.18.0"
---

Run transformations on BigQuery using Dataform in Kestra

Dataform is modern data pipeline tool based on Extract-Load-Transform (ELT). It has been acquired by Google Cloud and has been integrated within the BigQuery.

Similar to other ELT tools, Dataform handles the transformation on diffferent warehouses. Some of the data stores that are supported by Dataform include BigQuery, Snowflake, Redshift, etc. One of the advantages of using Dataform is that you can put together the transformation in the form of SQL, thus empowering multiple roles like Data Analysts and Data Scientists to perform the transformations. Being based on SQL makes it easier for anyone to onboard onto Dataform.

## Using Dataform with Kestra

There are two ways in which you can create a Dataform project while running with Kestra:

1. Create the Dataform project in GitHub, clone the GitHub project in Kestra and then run it using the [DataformCLI](/plugins/plugin-dataform/cli/io.kestra.plugin.dataform.cli.dataformcli) task.

2. Create the Dataform project in Kestra using [Namespace Files](../../../docs/06.concepts/02.namespace-files/index.md), and then run it using the [DataformCLI](/plugins/plugin-dataform/cli/io.kestra.plugin.dataform.cli.dataformcli) task. You can later choose to push the Namespace Files into GitHub repository using [PushNamespaceFiles](/plugins/plugin-git/io.kestra.plugin.git.pushnamespacefiles) task.

This guide covers both methods for transforming data using Dataform in Kestra for BigQuery.

### Using GitHub repository

Here is how you can pull an existing project from a GitHub repository and run it with DataformCLI task:

```yaml
id: dataform
namespace: company.team
tasks:
  - id: wdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repo
        type: io.kestra.plugin.git.Clone
        url: https://github.com/dataform-co/dataform-example-project-bigquery

      - id: transform
        type: io.kestra.plugin.dataform.cli.DataformCLI
        beforeCommands:
          - npm install @dataform/core
          - dataform compile
        env:
          GOOGLE_APPLICATION_CREDENTIALS: "sa.json"
        inputFiles:
          sa.json: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
          .df-credentials.json: |
            {
              "projectId": "<gcp-project-id>",
              "location": "us"
            }
        commands:
          - dataform run --dry-run
```

The `clone_repo` task pulls the repository with the Dataform project, and the `transform` task executes the Dataform project.

### Using Dataform project creation in Kestra

First, create and save the Kestra flow. The flow contains the following tasks:

1. HTTP Download task that downloads the `orders.csv` file using HTTP URL.
2. BigQuery CreateTable task that creates the `orders` table in the `ecommerce` dataset.
3. BigQuery Load task that loads the `orders.csv` contents into the BigQuery `orders` table.
4. DataformCLI task that runs the Dataform project, created later using Namespace Files. The project creates the `stg_orders` BigQuery view based on the `orders` BigQuery table.

```yaml
id: dataform_project
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

  - id: dataform_cli
    type: io.kestra.plugin.dataform.cli.DataformCLI
    beforeCommands:
      - npm install @dataform/core
      - dataform compile
    namespaceFiles:
      enabled: true
    env:
      GOOGLE_APPLICATION_CREDENTIALS: "sa.json"
    inputFiles:
      sa.json: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
      .df-credentials.json: |
        {
          "projectId": "<gcp-project-id>",
          "location": "us"
        }
    commands:
      - dataform run
```

Once the flow is saved, navigate to the Editor, and create a file `package.json` with the contents:

```json
{
    "dependencies": {
        "@dataform/core": "2.3.0"
    }
}
```

This file is not required for Kestra execution, as the dependency is installed via `beforeCommands`. It is required if you push the namespace files to a GitHub repository so you can run the project in other ways.

Next, create `dataform.json`.

```json
{
  "warehouse": "bigquery",
  "defaultSchema": "ecommerce",
  "defaultDatabase": "<default-database>",
  "defaultLocation": "us"
}
```

Most often, the `database` is same as the GCP project ID.

Create a `definitions` folder. Inside it, create a file `orders.sqlx` to define the `orders` table as the source table:

```javascript
config {
  type: "declaration",
  database: "<database>",
  schema: "ecommerce",
  name: "orders",
  description: "raw orders table"
}
```

Next, create `stg_orders.sqlx` under the `definitions` folder to define the `stg_orders` view:

```javascript
config {
  type: "view",  // Specify whether this model will create a table or a view
  schema: "ecommerce",
  database: "<database>"
}

select
  order_id,
  customer_name,
  customer_email,
  product_id,
  price,
  quantity,
  total
from
  ${ref("orders")}
```

That's it! We are now ready to run the flow.

Once the flow runs successfully, you can go to the BigQuery console, and ensure that the view `stg_orders` has been created.

This is how we can run Dataform for BigQuery in Kestra. These instructions can also help you integrate the DataformCLI task with other data stores like Snowflake, Redshift, Postgres and more.
