---
title: "Snowflake data pipeline with Kestra"
description: Kestra’s Snowflake plugin makes data warehousing simple. Even non-developers can write relevant flows and data pipeline
date: 2022-10-05T10:00:00
category: Solutions
author:
  name: Ludovic Dehon
  image: "ldehon"
  twitter: "@tchiotludo"
image: /blogs/2022-10-05-kestra-snowflake.jpg
---

The 21st century is the golden age of data. Today, modern data stacks offer numerous tools and workloads for data warehousing, data lakes, data analytics, and data engineering to manage massive amounts of data inflow. One such platform is Snowflake, a robust data cloud tool that streamlines many operations in a modern data stack.

In this article, we'll discuss how Snowflake integrates with [Kestra](https://github.com/kestra-io/kestra) (an **open-source, scalable orchestration and scheduling platform**) using Snowflake plugin to create a seamless and scalable data pipeline.

First, let's discuss Snowflake briefly.

### What is Snowflake?

<p style="text-align:center">
<img src="https://cdn-images-1.medium.com/max/800/0*KLr8jj4UG7HYd1DQ" class="rounded img-thumbnail mt-4 mb-4" alt="Tradeoff using a Database">
</p>


Leveraged by thousands of organizations worldwide, [Snowflake](https://www.snowflake.com/) is a top-of-the-line SaaS cloud data warehousing and data lake platform offering reliable data pipelines with high performance, concurrency, and scale across multiple cloud providers like AWS, Azure, and GCP.

Snowflake is a unified cloud-native platform that enables teams to avoid data silos by sharing and collaborating on data pipelines securely. It offers a flexible [architecture](https://docs.snowflake.com/en/user-guide/intro-key-concepts.html) with three components, i.e., robust cloud storage, query processing engine, and a layer of cloud services with numerous third-party integrations.

Snowflake is a **multi-cloud, multi-cluster warehouse platform** that can *auto-scale* to manage virtual warehouses dynamically. In the [*auto-scale* mode](https://docs.snowflake.com/en/user-guide/warehouses-multicluster.html#maximized-vs-auto-scale), it starts and stops warehouses to govern cloud resource usage and their corresponding cost credits.

### Why is Snowflake Popular?

In the last few years, Snowflake has had huge traction. Today more than 5900+ companies (as of March 2022) are running their critical data pipelines on Snowflake.

With Snowflake, companies don't have to pay for huge and expensive licenses for using data warehousing tools. Unlike conventional data warehousing tools, Snowflake charges on a **pay-as-you-basis for storage and compute**, enabling small and medium-scale companies to leverage cloud data pipelines for improved data management.

Now, companies can build **scalable data workloads** that can perform strong data analysis on structured, unstructured, and semi-structured data to derive valuable business insights and make data-driven decisions. Additionally, [Snowflake Data Marketplace](https://www.snowflake.com/data-marketplace/) allows customers to access numerous ready-to-query datasets, further reducing integration costs.

### Where does kestra fit in?

<p style="text-align:center">
<img src="/blogs/2022-10-05-kestra-snowflake/mario.jpg" class="rounded img-thumbnail mt-4 mb-4" alt="Tradeoff using a Database">
</p>


Typically, data warehouse workloads are part of a bigger technology stack within an organization or across organizations. To streamlines various operations, data pipelines should be orchestrated and scheduled. Data orchestration unifies data from disparate sources and transforms it to enable analytics. This is where [Kestra](/) jumps in.

Kestra is a state-of-the-art, open-source, cloud-native platform built to orchestrate & schedule scalable data workflows, aiming to improve the productivity of DataOps teams. Kestra's orchestration platform can build, run, manage, and monitor all [kinds of complex workflows](../docs/02.tutorial/05.flowable.md) sequentially and in parallel. It offers numerous [plugin integrations](../plugins/index.md) to build advanced data workflows, including our [Snowflake plugin](../plugins/plugin-jdbc-snowflake/index.md), discussed below.

Moreover, Kestra can execute workflows based on event-based, time-based, and API-based scheduling, giving complete control to the data teams. With a unified end-to-end platform, companies save time and money on storage, compute, and development costs.

Snowflake already offers many cost optimization processes like data compression and auto-scaling. However, Kestra makes it simpler to [download](../plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.Download.md), [upload](../plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.Upload.md), and [query](../plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.Query.md) data by integrating with Snowflake's storage and compute resources. Let's discuss Kestra's Snowflake plugin in detail.

### Dissecting Kestra's Snowflake Plugin.

Kestra's Snowflake plugin can create complex data pipelines, whether Snowflake is a target or simply storing data as a part of a larger workflow for downstream applications.

Besides the Snowflake plugin, Kestra offers numerous JDBC plugin integrations, including [ClickHouse](../plugins/plugin-jdbc-clickhouse/index.md), [DuckDb](../plugins/plugin-jdbc-duckdb/index.md), [MySQL](../plugins/plugin-jdbc-mysql/index.md), [Oracle](../plugins/plugin-jdbc-oracle/index.md), [Apache Pinot](../plugins/plugin-jdbc-pinot/index.md), [PostgreSQL](/plugins/plugin-jdbc-postgres/), [Redshift](../plugins/plugin-jdbc-redshift/index.md), [Rockset](/plugins/plugin-jdbc-rockset/), [SQL Server](../plugins/plugin-jdbc-sqlserver/index.md), [Trino](../plugins/plugin-jdbc-trino/index.md), [Vectorwise](/plugins/plugin-jdbc-vectorwise/), and [Vertica](../plugins/plugin-jdbc-vertica/index.md). These plugins can effectively process and transform tabular data within relational databases, reducing the processing cost of platforms like Snowflake.

Using Kestra, the data teams are at liberty to decide where certain data, plugins, and connectors would fit. As mentioned above, the Snowflake plugin can perform the download, upload, and query tasks. Let's discuss each of them below.

### Query Snowflake table

Kestra can query the Snowflake server using this task to insert, update, and delete data. The *Query* task offers numerous properties, including auto-committing SQL statements, different fetching operations, specifying access-control roles, and storing fetch results. When the `store`value is `true`, Kestra allows storage of large results as an output of the *Query* task.

The plugin allows the usage of multi-SQL statements in the same transaction as a full SQL script with isolation support. It allows simple queries and fetches results with `fetch` or `fetchOne` properties, enabling teams to reuse the output on the next tasks from tools like [Kafka Consume](../plugins/plugin-kafka/tasks/io.kestra.plugin.kafka.Consume.md), [Elastic Search](../plugins/plugin-elasticsearch/tasks/io.kestra.plugin.elasticsearch.Search.md), [Mongo Find](../plugins/plugin-mongodb/tasks/io.kestra.plugin.mongodb.Find.md), and more. Some *Query* task instances are:

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

As the name suggests, this task downloads data from the Snowflake server to an internal Kestra stage, which is based on [Amazon ION](https://amzn.github.io/ion-docs/). The [Download](../plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.Download.md) task offers properties such as data compression and access control role to streamline the download process of the connected database. The [Download](../plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.Download.md) task outputs the URL of the downloaded file available on the Kestra storage server.

The following code snippet downloads default database to specified `fileName` location on internal Kestra server.

```yaml
id: "download"
type: "io.kestra.plugin.jdbc.snowflake.Download"
stageName: MYSTAGE
fileName: prefix/destFile.csv
```

### Upload to Snowflake stage

This task uploads data to an internal [Snowflake stage](https://docs.snowflake.com/en/user-guide/data-load-considerations-stage.html). Similar to *Download* task, [Upload](../plugins/plugin-jdbc-snowflake/tasks/io.kestra.plugin.jdbc.snowflake.Upload.md) can perform data compression and set access control role. Snowflake also support [data transformation](https://docs.snowflake.com/en/user-guide/data-load-transform.html) while loading data, which simplifies the ETL process.

The following code snippet uploads data to the specified `fileName` location.

```yaml
id: "upload"
type: "io.kestra.plugin.jdbc.snowflake.Upload"
stageName: MYSTAGE
prefix: testUploadStream
fileName: destFile.csv
```

### Building Dynamic Data Workflows With Kestra

![](/ui.gif)

[Kestra](/) has quickly become an essential piece of the modern data stack. Kestra provides unprecedented flexibility and control to data teams. It can orchestrate any kind of workflow with ease using a rich UI that monitors all flows.

Kestra's Snowflake plugin makes data warehousing simple. Even non-developers can write relevant flows using descriptive YAML. Your Snowflake storage pipeline accommodates raw data from multiple sources and transforms it using ETL operations. Additionally, you can skip the transformation and directly load data into the warehouse using the [ELT pipeline](/blogs/2022-04-27-etl-vs-elt.html). Kestra can manage both workflows simultaneously. In any case, Kestra ensures that the data is readily available to perform analysis and learn valuable patterns.

If you need any guidance with your Snowflake deployment, our experts at Kestra would love to hear from you. [Let us know](https://kestra.io/slack) if you would like us to add more plugins to the [list](/plugins). Or start building your [custom Kestra plugin](../docs/10.plugin-developer-guide/index.md) today and send it our way. We always welcome [contributions](https://github.com/kestra-io/kestra)!
