---
title: "Snowflake data pipeline with Kestra"
description: Kestra’s Snowflake plugin makes data warehousing simple. Even non-developers can write relevant flows and data pipeline
date: 2023-06-22T10:00:00
category: Solutions
author:
  name: Ludovic Dehon
  image: "ldehon"
  twitter: "@tchiotludo"
image: /blogs/2022-10-05-kestra-snowflake.jpg
---

Snowflake is one of the most popular cloud data warehouse technologies. This post demonstrates [Kestra](https://github.com/kestra-io/kestra) plugins for Snowflake data management, including event-driven triggers based on changes in your Snowflake data, file management, and queries.

## About Snowflake ##

With Snowflake, companies can build **scalable data workloads** that can perform strong data analysis on structured, unstructured, and semi-structured data to derive valuable business insights and make data-driven decisions. Additionally, [Snowflake Data Marketplace](https://www.snowflake.com/data-marketplace/) allows customers to access numerous ready-to-query datasets, further reducing integration costs.

Snowflake can automatically manage its multi-cluster warehouses, dynamically scaling up and down to balance resource usage and costs.

The platform enables organizations to avoid large-scale licensing costs commonly associated with data warehousing tools, operating on a pay-as-you-go basis for storage and compute.

## Enhancing Snowflake with Kestra ##

![Kestra x Snowflake](/blogs/2022-10-05-kestra-snowflake/snowflake.png)

Data warehouse workloads are typically part of a larger technological stack. To streamline operations, orchestration, and scheduling of data pipelines are crucial. This is where Kestra comes into play.

Kestra is designed to orchestrate and schedule scalable data workflows, thereby enhancing DataOps teams' productivity. It can construct, operate, manage, and monitor a [variety of complex workflows](/docs/tutorial/flowable) sequentially or in parallel.

Kestra can execute workflows based on event-based, time-based, and API-based scheduling, giving complete control.
Snowflake already offers many cost optimization processes like data compression and auto-scaling. However, Kestra makes it simpler to [download](/plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.download), [upload](/plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.upload), and [query](/plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.query) data by integrating with Snowflake's storage and compute resources.

### Kestra's Plugin System ###
Besides the Snowflake plugin, Kestra offers numerous JDBC plugin integrations, including [ClickHouse](/plugins/plugin-jdbc-clickhouse), [DuckDb](/plugins/plugin-jdbc-duckdb), [MySQL](/plugins/plugin-jdbc-mysql), [Oracle](/plugins/plugin-jdbc-oracle), [Apache Pinot](/plugins/plugin-jdbc-pinot), [PostgreSQL](/plugins/plugin-jdbc-postgres), [Redshift](/plugins/plugin-jdbc-redshift), [Rockset](/plugins/plugin-jdbc-rockset/), [SQL Server](/plugins/plugin-jdbc-sqlserver), [Trino](/plugins/plugin-jdbc-trino), [Vectorwise](/plugins/plugin-jdbc-vectorwise), and [Vertica](/plugins/plugin-jdbc-vertica). These plugins can effectively process and transform tabular data within relational databases, reducing the processing cost of platforms like Snowflake.

Kestra's Snowflake plugin provides an efficient solution for creating intricate data pipelines. You can perform the download, upload, and query tasks. Let's dive into the key functionalities provided by the plugin.

### Query Snowflake table ###
Kestra can query the Snowflake server using this task to insert, update, and delete data. The *Query* task offers numerous properties, including auto-committing SQL statements, different fetching operations, specifying access-control roles, and storing fetch results. When the `store`value is `true`, Kestra allows storage of large results as an output of the *Query* task.

The plugin allows the usage of multi-SQL statements in the same transaction as a full SQL script with isolation support. It allows simple queries and fetches results with `fetch` or `fetchOne` properties, enabling teams to reuse the output on the next tasks from tools like [Kafka Consume](/plugins/plugin-kafka/tasks/io.kestra.plugin.kafka.consume), [Elastic Search](/plugins/plugin-elasticsearch/tasks/io.kestra.plugin.elasticsearch.search), [Mongo Find](/plugins/plugin-mongodb/tasks/io.kestra.plugin.mongodb.find), and more. Some *Query* task instances are:

-   Fetch a row from the database, and define multiple flows depending on the output
-   Fetch the count of a store and iterate through the list. If an item doesn't exist, perform a particular task.

The following code snippet executes a query to fetch results from one table into Kestra internal storage.

```yaml
id: select
type: io.kestra.plugin.jdbc.snowflake.Query
url: jdbc:snowflake://<account_identifier>.snowflakecomputing.com
username: snowflake
password: snowflake_passwd
sql: select * from source
fetch: true
```

### Download from Snowflake stage
This task downloads data from the Snowflake server to an internal Kestra stage which is based on [Amazon ION](https://amzn.github.io/ion-docs/). The Download task provides the URL of the downloaded file available on the Kestra storage server. The [Download](/plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.download) task offers properties such as data compression and access control role to streamline the download process of the connected database.

The following code snippet downloads the default database to the specified `fileName` location on the internal Kestra server.

```yaml
id: "download"
type: "io.kestra.plugin.jdbc.snowflake.Download"
stageName: MYSTAGE
fileName: prefix/destFile.csv
```

### Upload to Snowflake stage ###
This task uploads data to an internal [Snowflake stage](https://docs.snowflake.com/en/user-guide/data-load-considerations-stage.html). Similar to *Download* task, [Upload](/plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.upload) can perform data compression and set access control role. Snowflake also support [data transformation](https://docs.snowflake.com/en/user-guide/data-load-transform.html) while loading data, which simplifies the ETL process.

The following code snippet uploads data to the specified `fileName` location.

```yaml
id: "upload"
type: "io.kestra.plugin.jdbc.snowflake.Upload"
stageName: MYSTAGE
prefix: testUploadStream
fileName: destFile.csv
```

### Building Dynamic Data Workflows With Kestra

With its rich set of features, Kestra's Snowflake plugin offers you the ability to build highly customizable and robust data pipelines:

1. **Querying a Snowflake Table with Conditions**
In data analysis, you often need to fetch specific rows based on certain conditions. The Query task provides a where property to filter the data accordingly. Here's how you can use it:

```yaml
id: conditional_select
type: io.kestra.plugin.jdbc.snowflake.Query
url: jdbc:snowflake://<account_identifier>.snowflakecomputing.com
username: snowflake
password: snowflake_passwd
sql: SELECT * FROM source WHERE id > 1000
fetch: true
```

2. **Listening to Changes in a Snowflake Table with Trigger**
Real-time monitoring of changes in your Snowflake table is a vital aspect of data pipeline management. The Snowflake Trigger plugin is designed precisely for this task. Here's an example of how to use it:

```yaml
id: trigger_on_update
type: io.kestra.plugin.jdbc.snowflake.trigger
url: jdbc:snowflake://<account_identifier>.snowflakecomputing.com
username: snowflake
password: snowflake_passwd
sql: SELECT MAX(updated_at) FROM source
interval: PT1M
```

3. **Downloading Specific Columns from a Snowflake Stage**
While managing data, you might not need all the information from your Snowflake stage. The Download task allows you to fetch only the specific columns you need. This is achievable by modifying the sql property in the task:

```yaml
id: "selective_download"
type: "io.kestra.plugin.jdbc.snowflake.Download"
stageName: MYSTAGE
sql: SELECT column1, column2 FROM source
fileName: destFile.csv
```

4. **Uploading Data to a Snowflake Stage with Transformations**
Uploading data often involves a transformation process. The Upload task allows you to upload and transform your data in a single step, as shown below:

```yaml
id: "transformed_upload"
type: "io.kestra.plugin.jdbc.snowflake.Upload"
stageName: MYSTAGE
prefix: transformedData
fileName: destFile.csv
fileFormat: (type = 'CSV', field_delimiter = ',', skip_header = 1, NULL_IF = ('\\N'))
```

Kestra provides flexibility and control to data teams, it can orchestrate any kind of workflow with ease using the rich UI that monitors all flows.

![](/ui.gif)

Kestra's Snowflake plugin makes data warehousing simple even for non-developers thanks to YAML. Your Snowflake storage pipeline can accommodates raw data from multiple sources and transforms it using ETL operations. Additionally, you can skip the transformation and directly load data into the warehouse using the [ELT pipeline](./2022-04-27-etl-vs-elt). Kestra can manage both workflows simultaneously. In any case, Kestra ensures that the data is readily available to perform analysis and learn valuable patterns.

Join the Slack [community](https://kestra.io/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
