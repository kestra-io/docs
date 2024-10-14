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
We have used AWS access key and secret key in the example workflows in this document. To know more about these keys and how to get one, you can refer [this](https://aws.amazon.com/blogs/security/wheres-my-secret-access-key/) page.
::

## Using DuckDB

DuckDB can be leveraged to transform the data directly using SQL queries.

In the exmaple below, we fetch CSV files, perform the join transformation using DuckDB Query task, store the result, upload the detailed orders onto S3, perform another transformation on the stored result, and finally upload the file as CSV onto S3.

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

Similar Query tasks can be perfomed on different databases like Snowflake, Postgres, etc.

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
