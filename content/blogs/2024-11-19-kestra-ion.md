---
title: "Why Kestra relies on ION and how to use it"
description: Why Kestra is centralized around ION, and how its internal storage only supports ION format. It also details how this helps standardize ETL and data processing.
date: 2024-11-19T16:00:00
category: Solutions
author:
  name: Shruti Mantri
  image: smantri
image: /blogs/2024-11-19-kestra.ion.jpg
---

Kestra is a powerful orchestration tool that integrates with multiple data stores across different cloud environments, such as AWS, GCP, and Azure. It supports a wide range of databases, both relational and non-relational, as well as various file systems that store data in formats like CSV, Avro, Parquet, JSON, and more. With such a diverse set of data sources, it was essential to unify all incoming data into a common format. This is where Kestra had to decide how to manage and store the diverse data it ingests from various sources.

## Kestra's Internal Storage

Kestra decided to adopt **ION format** for all the data stored in its internal storage. Regardless of the original format of the incoming data, Kestra transforms it into ION format before storing it.

Amazon Ion is a richly-typed, self-describing, hierarchical data serialization format offering interchangeable binary and text representations. The ION format comes with multiple benefits, and you can read more about its advantages [here](https://amazon-ion.github.io/ion-docs/guides/why.html).

By standardizing on the ION format for internal storage, Kestra ensures flexibility in handling any type of data. This approach eliminates the overhead of dealing with multiple data formats and helps standardize ETL (Extract, Transform, Load) and data processing across systems.

## Standardized ETL

Let's explore how Kestra's decision to store data in the ION format has helped standardize its ETL workflows. Consider a pipeline that pulls data from Snowflake, joins it with data from a MySQL table, and outputs the results as a CSV file to S3.

As a prerequisite, we will push the orders data from the CSV file into Snowflake. Yon can do it using SQL commands in the Snowflake console or a short Kestra flow as shown here:

```yaml
id: load_data_into_snowflake
namespace: company.team

tasks:
  - id: download_csv
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: create_table
    type: io.kestra.plugin.jdbc.snowflake.Query
    url: jdbc:snowflake://<account_identifier>.snowflakecomputing.com
    username: "{{ secret('SNOWFLAKE_USER') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    sql: |
      CREATE TABLE IF NOT EXISTS my_db.my_schema.orders (
        order_id INT,
        customer_name STRING,
        customer_email STRING,
        product_id INT,
        price DECIMAL,
        quantity INT,
        total DECIMAL
      )

  - id: load_data_to_stage
    type: io.kestra.plugin.jdbc.snowflake.Upload
    url: jdbc:snowflake://<account_identifier>.snowflakecomputing.com
    username: "{{ secret('SNOWFLAKE_USER') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    from: "{{ outputs.download_csv.uri }}"
    fileName: orders.csv
    prefix: raw
    stageName: "@my_db.my_schema.%orders"

  - id: load_data_to_table
    type: io.kestra.plugin.jdbc.snowflake.Query
    url: jdbc:snowflake://<account_identifier>.snowflakecomputing.com
    username: "{{ secret('SNOWFLAKE_USER') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    sql: |
      COPY INTO my_db.my_schema.orders
      FROM @my_db.my_schema.%orders
      FILE_FORMAT = (TYPE = 'CSV' FIELD_OPTIONALLY_ENCLOSED_BY = '"' SKIP_HEADER = 1);
```

And we will upload the products from the CSV file into MySQL. Again, this can be done using SQL commands in any MySQL client or a short Kestra flow as shown here:

```yaml
id: load_data_into_mysql
namespace: company.team

tasks:
  - id: http_download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/products.csv
    
  - id: create_table
    type: io.kestra.plugin.jdbc.mysql.Query
    url: jdbc:mysql://<mysql_host>:3306/public
    username: "{{ secret('MYSQL_USER') }}"
    password: "{{ secret('MYSQL_PASSWORD') }}"
    sql: |
      CREATE TABLE IF NOT EXISTS products (
        product_id INT,
        product_name VARCHAR(100),
        product_category VARCHAR(100),
        brand VARCHAR(100),
        PRIMARY KEY (product_id)
      )
  
  - id: load_products
    type: io.kestra.plugin.jdbc.mysql.Query
    url: jdbc:mysql://<mysql_host>:3306/public
    username: "{{ secret('MYSQL_USER') }}"
    password: "{{ secret('MYSQL_PASSWORD') }}"
    sql: |
      LOAD DATA INFILE '{{ outputs.http_download.uri }}' 
      INTO TABLE products
      FIELDS TERMINATED BY ',' 
      ENCLOSED BY '"'
      LINES TERMINATED BY '\n'
      IGNORE 1 ROWS
```

Do note that `secure_file_priv` variable should be set to NULL in MySQL server for this.

Now, we will put together the Kestra ETL flow that will join the data from Snowflake and MySQL and uploads the result into S3 as a CSV file:

```yaml
id: detailed_orders_etl
namespace: company.team

tasks:
  - id: load_orders
    type: io.kestra.plugin.jdbc.snowflake.Query
    url: jdbc:snowflake://<account_identifier>.snowflakecomputing.com
    username: "{{ secret('SNOWFLAKE_USER') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    sql: SELECT * FROM my_db.my_schema.orders
    fetchType: STORE

  - id: load_products
    type: io.kestra.plugin.jdbc.mysql.Query
    url: jdbc:mysql://<mysql_host>:3306/public
    username: "{{ secret('MYSQL_USER') }}"
    password: "{{ secret('MYSQL_PASSWORD') }}"
    sql: SELECT * FROM products
    fetchType: STORE
  
  - id: join_datasets
    type: io.kestra.plugin.scripts.python.Script
    description: Python ETL Script
    beforeCommands:
      - pip install kestra-ion pandas
    script: |
      from kestra_ion import read_ion
      import pandas as pd

      orders_data = read_ion("{{ outputs.load_orders.uri }}")
      products_data = read_ion("{{ outputs.load_products.uri }}")
      orders_df = pd.DataFrame(orders_data)
      products_df = pd.DataFrame(products_data) 
      detailed_orders = orders_df.merge(products_df, how='left', left_on='PRODUCT_ID', right_on='product_id')
      detailed_orders.to_csv("detailed_orders.csv")
    outputFiles:
      - detailed_orders.csv

  - id: upload_detailed_orders_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    description: Upload the resulting CSV file onto S3
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: "eu-central-1"
    from: "{{ outputs.join_datasets.outputFiles('detailed_orders.csv') }}"
    bucket: "my_bucket"
    key: "orders/detailed_orders"
```

### Adapting to Changing Data Sources

Suppose the data source changes from **Snowflake** to **BigQuery**. Thanks to Kestra's use of ION format for internal storage, you only need to update the first task to fetch data from BigQuery instead of Snowflake. The rest of the pipeline remains unchanged.

Here is how the updated Kestra flow will look like:

```yaml
id: detailed_orders_etl
namespace: company.team

tasks:
  - id: load_orders
    type: io.kestra.plugin.gcp.bigquery.Query
    projectId: my_gcp_project
    serviceAccount: "{{ secret('GCP_SERVICE_ACCOUNT_JSON') }}"
    sql: SELECT * FROM my_dataset.orders
    fetch: true

  - id: load_products
    type: io.kestra.plugin.jdbc.mysql.Query
    url: jdbc:mysql://<mysql_host>:3306/public
    username: "{{ secret('MYSQL_USER') }}"
    password: "{{ secret('MYSQL_PASSWORD') }}"
    sql: SELECT * FROM products
    fetchType: STORE
  
  - id: join_datasets
    type: io.kestra.plugin.scripts.python.Script
    description: Python ETL Script
    beforeCommands:
      - pip install kestra-ion pandas
    script: |
      from kestra_ion import read_ion
      import pandas as pd

      orders_data = read_ion("{{ outputs.load_orders.uri }}")
      products_data = read_ion("{{ outputs.load_products.uri }}")
      orders_df = pd.DataFrame(orders_data)
      products_df = pd.DataFrame(products_data) 
      detailed_orders = orders_df.merge(products_df, how='left', left_on='PRODUCT_ID', right_on='product_id')
      detailed_orders.to_csv("detailed_orders.csv")
    outputFiles:
      - detailed_orders.csv

  - id: upload_detailed_orders_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    description: Upload the resulting CSV file onto S3
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: "eu-central-1"
    from: "{{ outputs.join_datasets.outputFiles('detailed_orders.csv') }}"
    bucket: "my_bucket"
    key: "orders/detailed_orders"
```

Thus, it is clear that having ION format throughout for the internal storage can prove to be very powerful.

## ION Transformations

Given that ION is a standardized format used by Kestra for its internal storage, you might come across multiple scenarios for converting data in other formats to and from ION format while working with Kestra. For this, Kestra has a rich set of [SerDe tasks](https://kestra.io/plugins/plugin-serdes) that you can use for format conversions. It supports data conversion from and to CSV, Avro, JSON, XML, Parquet and Excel formats into ION format. Here is an example of how you can convert CSV file into ION format and vice-versa:

```yaml
id: csv_to_ion
namespace: company.team

tasks:
  - id: http_download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/products.csv

  - id: to_ion
    type: io.kestra.plugin.serdes.csv.CsvToIon
    from: "{{ outputs.http_download.uri }}"
```

```yaml
id: ion_to_csv
namespace: company.team

tasks:
  - id: download_csv
    type: io.kestra.plugin.core.http.Download
    description: salaries of data professionals from 2020 to 2023 (source ai-jobs.net)
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/salaries.csv

  - id: avg_salary_by_job_title
    type: io.kestra.plugin.jdbc.duckdb.Query
    inputFiles:
      data.csv: "{{ outputs.download_csv.uri }}"
    sql: |
      SELECT
        job_title,
        ROUND(AVG(salary),2) AS avg_salary
      FROM read_csv_auto('{{ workingDir }}/data.csv', header=True)
      GROUP BY job_title
      HAVING COUNT(job_title) > 10
      ORDER BY avg_salary DESC;
    store: true

  - id: result
    type: io.kestra.plugin.serdes.csv.IonToCsv
    from: "{{ outputs.avg_salary_by_job_title.uri }}"
```

Similarly, other formats can also be converted into ION using the correponding tasks.

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) ⭐️ and join [the community](https://kestra.io/slack).
