---
title: ETL Pipelines in Kestra
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Integrations
---

Build ETL pipelines in Kestra using DuckDB, Python and Task Runners.

This tutorial demonstrates building different ETL pipelines in Kestra.

::alert{type="info"}
We have used AWS access key and secret key in the example workflows below. To know more about these keys and how to get one, you can refer [this](https://aws.amazon.com/blogs/security/wheres-my-secret-access-key/) page. Once we have these, we can store them in the [KV Store](../05.concepts/05.kv-store.md) or as [Secrets](../05.concepts/04.secret.md).
::

## Using DuckDB

DuckDB can be leveraged to transform the data directly using SQL queries.

In the example below, we fetch CSV files, perform the join transformation using DuckDB Query task, store the result, upload the detailed orders onto S3, perform another transformation on the stored result, and finally upload the file as CSV onto S3.

```yaml
id: etl_using_duckdb
namespace: company.team

tasks:
  - id: download_orders_csv
    type: io.kestra.plugin.core.http.Download
    description: Download orders.csv file
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: download_products_csv
    type: io.kestra.plugin.core.http.Download
    description: Download products.csv file
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/products.csv

  - id: get_detailed_orders
    type: io.kestra.plugin.jdbc.duckdb.Query
    description: Perform JOIN transformation using DuckDB
    inputFiles:
      orders.csv: "{{ outputs.download_orders_csv.uri }}"
      products.csv: "{{ outputs.download_products_csv.uri }}"
    sql: |
      SELECT 
        o.order_id,
        o.customer_name,
        o.customer_email,
        o.product_id,
        o.price,
        o.quantity,
        o.total,
        p.product_name,
        p.product_category,
        p.brand 
      FROM read_csv_auto('{{ workingDir }}/orders.csv', header=True) o 
      JOIN read_csv_auto('{{ workingDir }}/products.csv', header=True) p
      ON o.product_id = p.product_id
      ORDER BY order_id ASC;
    store: true

  - id: ion_to_csv
    type: io.kestra.plugin.serdes.csv.IonToCsv
    description: Convert the result into CSV
    from: "{{ outputs.get_detailed_orders.uri }}"

  - id: upload_detailed_orders_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    description: Upload the resulting CSV file onto S3
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: "eu-central-1"
    from: "{{ outputs.get_orders_per_product_csv.uri }}"
    bucket: "my_bucket"
    key: "orders/detailed_orders" 

  - id: get_orders_per_product
    type: io.kestra.plugin.jdbc.duckdb.Query
    description: Perform aggregation using DuckDB
    inputFiles:
      detailed_orders.csv: "{{ outputs.ion_to_csv.uri }}"
    sql: |
      SELECT product_id,
         COUNT(product_id) as order_count,
         SUM(quantity) as product_count,
         CAST(SUM(total) AS DECIMAL(10,2)) AS order_total
      FROM read_csv_auto('{{ workingDir }}/detailed_orders.csv', header=True)
      GROUP BY product_id
      ORDER BY product_id ASC
    store: true
  
  - id: get_orders_per_product_csv
    type: io.kestra.plugin.serdes.csv.IonToCsv
    description: Convert the result into CSV
    from: "{{ outputs.get_orders_per_product.uri }}"

  - id: upload_orders_per_product_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    description: Upload the resulting CSV file onto S3
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: "eu-central-1"
    from: "{{ outputs.get_orders_per_product_csv.uri }}"
    bucket: "my_bucket"
    key: "orders/orders_per_product" 
```

Similar Query tasks can be performed on different databases like Snowflake, Postgres, etc.

## Using Python

You can choose to perform ETL using python (pandas) and then run it as a Python script.

The ETL performed using [DuckDB](#using-duckdb) above can be performed using Python as shown in the example flow below.

```yaml
id: python_etl
namespace: company.team

tasks:
  - id: etl
    type: io.kestra.plugin.scripts.python.Script
    description: Python ETL Script
    beforeCommands:
      - pip install requests pandas
    script: |
      import io
      import requests
      import pandas as pd

      def _extract(url):
        csv_data = requests.get(url).content
        return pd.read_csv(io.StringIO(csv_data.decode('utf-8')), header=0)
      
      def run_etl():
        orders_data = _extract("https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv")
        products_data = _extract("https://huggingface.co/datasets/kestra/datasets/raw/main/csv/products.csv")
        # perform join transformation
        detailed_orders = orders_data.merge(products_data, how='left', left_on='product_id', right_on='product_id')
        detailed_orders.to_csv("detailed_orders.csv")
        # perform aggregation
        orders_per_product = detailed_orders.groupby('product_id').agg(order_count= ('product_id', 'count'), product_count=('quantity', 'sum'), order_total=('total', 'sum')).sort_values('product_id')
        orders_per_product['order_total'] = orders_per_product['order_total'].apply(lambda x: float("{:.2f}".format(x)))
        orders_per_product.to_csv("orders_per_product.csv")
      
      if __name__ == "__main__":
          run_etl()
    outputFiles:
      - detailed_orders.csv
      - orders_per_product.csv

  - id: upload_detailed_orders_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    description: Upload the resulting CSV file onto S3
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: "eu-central-1"
    from: "{{ outputs.python_etl.outputFiles('detailed_orders.csv') }}"
    bucket: "my_bucket"
    key: "orders/detailed_orders"

  - id: upload_orders_per_product_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    description: Upload the resulting CSV file onto S3
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: "eu-central-1"
    from: "{{ outputs.python_etl.outputFiles('orders_per_product.csv') }}"
    bucket: "my_bucket"
    key: "orders/orders_per_product"
```

## Using Batch Task Runners

When the python scripts get more compute-intesive or memory-intensive, it is advised to run them on remote batch compute resources using Batch Task Runners.

Kestra provides a variety of Batch Task Runners(/docs/enterprise/task-runners#task-runner-types). Here is an example of how the ETL python script can be run on a AWS Batch Task Runner.

```yaml
id: aws_batch_task_runner_etl
namespace: company.team

tasks:
  - id: python_etl_on_aws_task_runner
    type: io.kestra.plugin.scripts.python.Script
    description: Run python ETL script on Docker Task Runner
    containerImage: python:3.11-slim
    taskRunner:
      type: io.kestra.plugin.ee.aws.runner.Batch
      region: eu-central-1
      accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
      secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
      computeEnvironmentArn: "arn:aws:batch:eu-central-1:01234567890:compute-environment/kestraFargateEnvironment"
      jobQueueArn: "arn:aws:batch:eu-central-1:01234567890:job-queue/kestraJobQueue"
      executionRoleArn: "arn:aws:iam::01234567890:role/kestraEcsTaskExecutionRole"
      taskRoleArn: arn:aws:iam::01234567890:role/ecsTaskRole
      bucket: kestra-product-de
    beforeCommands:
      - pip install requests pandas
    script: |
      import io
      import requests
      import pandas as pd

      def _extract(url):
        csv_data = requests.get(url).content
        return pd.read_csv(io.StringIO(csv_data.decode('utf-8')), header=0)
      
      def run_etl():
        orders_data = _extract("https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv")
        products_data = _extract("https://huggingface.co/datasets/kestra/datasets/raw/main/csv/products.csv")
        # perform join transformation
        detailed_orders = orders_data.merge(products_data, how='left', left_on='product_id', right_on='product_id')
        detailed_orders.to_csv("detailed_orders.csv")
        # perform aggregation
        orders_per_product = detailed_orders.groupby('product_id').agg(order_count= ('product_id', 'count'), product_count=('quantity', 'sum'), order_total=('total', 'sum')).sort_values('product_id')
        orders_per_product['order_total'] = orders_per_product['order_total'].apply(lambda x: float("{:.2f}".format(x)))
        orders_per_product.to_csv("orders_per_product.csv")
      
      if __name__ == "__main__":
          run_etl()
    outputFiles:
      - detailed_orders.csv
      - orders_per_product.csv
  
  - id: upload_detailed_orders_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    description: Upload the resulting CSV file onto S3
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: "eu-central-1"
    from: "{{ outputs.python_etl.outputFiles('detailed_orders.csv') }}"
    bucket: "my_bucket"
    key: "orders/detailed_orders"

  - id: upload_orders_per_product_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    description: Upload the resulting CSV file onto S3
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: "eu-central-1"
    from: "{{ outputs.python_etl.outputFiles('orders_per_product.csv') }}"
    bucket: "my_bucket"
    key: "orders/orders_per_product"
```

## Using dbt

We can create a similar pipeline based on a ELT model using dbt via Kestra. We can leverage the namespace files for creating the dbt models.

In this example, we will be using dbt + BigQuery and perform the ELT process where we will load data from a http request to Hugging Face into BigQuery tables, perform transformations such as join and aggregates using dbt, and then query the newly generated tables as a result of dbt transformation.

```yaml
id: dbt_transformations
namespace: kestra.engineering.bigquery.dbt

tasks:
  - id: orders_http_download
    type: io.kestra.plugin.core.http.Download
    description: Download orders.csv using HTTP Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: products_http_download
    type: io.kestra.plugin.core.http.Download
    description: Download products.csv using HTTP Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/products.csv

  - id: create_orders_table
    type: io.kestra.plugin.gcp.bigquery.CreateTable
    description: Create orders table in BigQuery
    serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    projectId: <gcp_project_id>
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
  
  - id: create_products_table
    type: io.kestra.plugin.gcp.bigquery.CreateTable
    description: Create products table in BigQuery.
    serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    projectId: <gcp_project_id>
    dataset: ecommerce
    table: products
    tableDefinition:
      type: TABLE
      schema:
        fields:
        - name: product_id
          type: INT64
        - name: product_name
          type: STRING
        - name: product_category
          type: STRING
        - name: brand
          type: STRING

  - id: load_orders_table
    type: io.kestra.plugin.gcp.bigquery.Load
    description: Load orders table with data from orders.csv
    from: "{{ outputs.orders_http_download.uri }}"
    projectId: <gcp_project_id>
    serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    destinationTable: "<gcp_project_id>.ecommerce.orders"
    format: CSV
    csvOptions:
      fieldDelimiter: ","
      skipLeadingRows: 1
  
  - id: load_products_table
    type: io.kestra.plugin.gcp.bigquery.Load
    description: Load products table with data from products.csv
    from: "{{ outputs.products_http_download.uri }}"
    projectId: <gcp_project_id>
    serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    destinationTable: "<gcp_project_id>.ecommerce.products"
    format: CSV
    csvOptions:
      fieldDelimiter: ","
      skipLeadingRows: 1
  
  - id: dbt
    type: io.kestra.plugin.dbt.cli.DbtCLI
    description: Use dbt build to perform the dbt transformations
    inputFiles:
      sa.json: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/kestra-io/dbt-bigquery:latest
    namespaceFiles:
      enabled : true
    profiles: |
      bq_dbt_project:
        outputs:
          dev:
            type: bigquery
            method: service-account
            dataset: ecommerce
            project: <gcp_project_id>
            keyfile: sa.json
            location: US
            priority: interactive
            threads: 16
            timeout_seconds: 300
            fixed_retries: 1
        target: dev
    commands:
      - dbt deps
      - dbt build

  - id: query_detailed_orders
    type: io.kestra.plugin.gcp.bigquery.Query 
    description: Query the newly generated detailed_orders BigQuery table
    serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    projectId: <gcp_project_id>
    sql: |
      SELECT * FROM <gcp_project_id>.ecommerce.detailed_orders
    store: true

  - id: query_orders_per_product
    type: io.kestra.plugin.gcp.bigquery.Query 
    description: Query the newly generated orders_per_product BigQuery table
    serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    projectId: <gcp_project_id>
    sql: |
      SELECT * FROM <gcp_project_id>.ecommerce.orders_per_product
    store: true
```

Here are the files that you should create in the Kestra editor.

Firstly, create `dbt_project.yml` file, and put the following contents into it.

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
```

Next, create `models` folder. All the upcoming files will be created under the `models` folder.

We will create `sources.yml` which defines the source tables that will be referenced in other models.

```yaml
version: 2

sources:
  - name: ecommerce
    database: <gcp_project_id>
    schema: ecommerce
    tables: 
      - name: orders
      - name: products
```

Next, we will create two files `stg_orders.sql` and `stg_products.sql` which will materialize as views on top of the source tables. The contents of these files respectively will be:

**stg_orders.sql**

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

**stg_products.sql**

```
{{ config(materialized="view") }}

select 
product_id,
product_name,
product_category,
brand
from {{ source('ecommerce', 'products') }}
```

Next, we will create `detailed_orders.sql` which will create the `detailed_orders` table. This model will join the `stg_orders` and `stg_products` view based on `product_id`. The contents of `detailed_orders.sql` file will be as follows:

```
{{ config(materialized="table") }}

select 
o.order_id,
o.customer_name,
o.customer_email,
o.product_id,
p.product_name,
p.product_category,
p.brand,
o.price,
o.quantity,
o.total
from {{ ref('stg_orders') }} o join {{ ref('stg_products') }} p
on o.product_id = p.product_id
```

Next, we will create `order_per_product.sql` which will create the `order_per_product` table. This model demonstrates aggregation performed on `detailed_orders` table. The contents of `order_per_product.sql` file will be as follows:

```
{{ config(materialized="table") }}

select 
product_id,
COUNT(product_id) as order_count,
SUM(quantity) as product_count,
SUM(total) AS order_total
from {{ ref('detailed_orders') }}
group by product_id
order by product_id asc
```

With this, we are ready with all the dbt models. You can now execute the flow. The flow will generate the `detailed_orders` and `orders_per_product` tables. You can view the content of this table by going to the Outputs of the last two tasks.

## Using Spark

We can perform the same ETL process using Spark.

The flow for performing the same transformation using Spark will look as follows:

```yaml
id: spark_python_submit
namespace: kestra.engineering.spark

tasks:
  - id: python_submit
    type: io.kestra.plugin.spark.PythonSubmit
    runner: DOCKER
    docker:
      networkMode: host
      user: root
    master: spark://localhost:7077
    args:
      - "10"
    mainScript: |
      from pyspark.sql import SparkSession
      from pyspark import SparkFiles

      orders_url = "https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv"
      products_url = "https://huggingface.co/datasets/kestra/datasets/raw/main/csv/products.csv"
      spark.sparkContext.addFile(orders_url)
      spark.sparkContext.addFile(products_url)

      if __name__ == "__main__":
          spark = SparkSession.builder.appName("EcommerceApp").getOrCreate()

          #Create orders dataframe based on orders.csv
          orders_df = spark.read.csv("file://" + SparkFiles.get("orders.csv"), inferSchema=True, header=True)
          
          #Create products dataframe based on orders.csv
          products_df = spark.read.csv("file://" + SparkFiles.get("products.csv"), inferSchema=True, header=True)
          
          #Create detailed_orders by joining orders_df and products_df
          detailed_orders_df = orders_df.join(products_df, orders_df.product_id ==  products_df.product_id, "left") 
          
          # Print the contents of detailed_orders_df
          detailed_orders_df.show(10)

          spark.stop()
```
