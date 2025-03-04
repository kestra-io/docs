---
title: "The Guide to Cloud Data Warehouse Integration and Ingestion"
description: "All you need to know about integration and Ingestion in your Cloud Data Warehouse"
date: 2024-03-06T12:00:00
category: Solution
author:
  name: Kevin Fleming
  image: "kfleming"
image: /blogs/2024-03-06-guide-integration-ingestion.jpg
---

This blog post serves as a practical guide to cloud data warehouse (CDW) ingestion and integration, focusing on BigQuery, Redshift, and Snowflake. We address the key challenges data teams face, such as manual pipeline maintenance, and offer solutions to streamline these processes. Dive in!


## The Problem
According to a [2022 report by Wakefield Research](https://get.fivetran.com/rs/353-UTB-444/images/2021-CDL-Wakefield-Research.pdf), data teams spend 40% of their time troubleshooting data downtime. [According to a 2023 TDWI article on data engineer burnout](https://tdwi.org/articles/2023/02/21/ppm-all-how-to-fix-data-engineer-burnout.aspx), more than half of all data engineers say they spend too much time on:

- Finding and fixing errors
- Maintaining data pipelines and manual processes
- Playing catch-up with requests that come in at too fast a pace.

And then there’s the trouble caused by software developers: changing the data schema all the time. Sorry about that!

>One of the Wakefield report’s key findings was the insanely high cost of data integration

- Companies spend, on average, $520K every year paying data engineers to build and maintain data pipelines manually.
- That cost doesn't even factor in inefficiencies, as 4 in 5 data leaders (80%) say they sometimes have to rebuild data pipelines after deployment; this happens often or even all the time in 39% of companies.
- This means that the actual cost of data integration that relies on this manual process could be an even larger line item on the balance sheet than most companies suspect.

Why am I writing about the problems faced by data engineers and companies trying to be data-driven? Because context is everything. Cloud Data Warehouse do not exist in isolation; there’s the general business context as seen above; there’s the business architectural context - how CDWs are used in an organization; and finally, there’s the technical architectural context - how CDWs fit with all the other systems. CDW data ingestion and integration lie at the center of all three contexts so it’s critical to consider the full spectrum of potential drawbacks and benefits, and pitfalls and opportunities.


---


Cloud data warehouses (CDWs) can streamline, automate, and improve data workflows, leading to faster insights, better decision-making, and increased efficiency across the organization. **Or not.**

Most data & analytics leaders in that Wakefield study (73%) say their team’s time is being wasted on manual oversight of data pipelines. Time sunk into this takes away from engineers’ ability to provide more advanced analysis - i.e., the work that provides real business value.

Research shows that organizations that make the best use of data insights tend to do the best in the marketplace by leveraging data and analytics to drive strategic and operational decision-making, but for most organizations, that is just not happening:

- A NewVantage Partners survey in 2021 found that only 38% of companies described themselves as data-driven, down from 46% in 2020.
- A 2021 Accenture survey found that 67% of organizations struggle to build trust in data and analytics within their businesses.
- 85% of big data projects fail ([Gartner](https://designingforanalytics.com/resources/failure-rates-for-analytics-bi-iot-and-big-data-projects-85-yikes/), 2017)
- 87% of data science projects never make it to production ([VentureBeat](https://venturebeat.com/2019/07/19/why-do-87-of-data-science-projects-never-make-it-into-production/), 2019)
- “Through 2022, only 20% of analytic insights will deliver business outcomes”* ([Gartner](https://blogs.gartner.com/andrew_white/2019/01/03/our-top-data-and-analytics-predicts-for-2019/), 2019)


And on top of all this, someone in your org is trying to implement a data democratization initiative, or talking about things like decentralization and self-service.

## What is the solution?

The solution has two components. The first will be found in your workflow metadata. The second will be found in your data workflow architectures, or, more precisely, a smaller, faster, better, simpler set of workflow architectures.

But before we get to the solution, we have to understand the problem domain. Lets take a brief moment for important definitions:

- **System Integration**: This term should refer to the integration of one CDW with other systems, either internal to the Cloud Service Provider (CSP) or external, on the input side or output side. Some are for adding value to the query engine output - on the extraction or export side, some are for visualization, and some for AI/ML. Many are for management.

- **Data integration**: the process of combining data from multiple sources into a unified view to provide users with valuable and actionable information. In this case, data is not ingested by the destination system, but it is combined by the CDW. Data is necessarily transferred from there to here, but not stored.

- **Data Ingestion**: This term should refer to getting data into your destination storage, the ‘L’ in ETL

*I mention this because, I have often seen the three terms mixed up, leading to confusion.*


---


## Integration & Ingestion

### BigQuery Integrations

Google BigQuery integrates well with other Google Cloud services like Cloud Storage, Dataflow, and Pub/Sub.

It also supports external data sources, such as Google Sheets, Bigtable, and Cloud SQL, that can be queried directly from BigQuery without loading the data into the warehouse.

**API**

[BigQuery APIs and libraries overview](https://cloud.google.com/bigquery/docs/reference)
BigQuery API reference:
- **BigQuery client libraries**
- **REST API reference**
- **ODBC and JDBC drivers for BigQuery**
- **`pandas-gbq` to BigQuery Python client library migration guide**

### Change Data Capture

BigQuery [change data capture](https://cloud.google.com/bigquery/docs/change-data-capture) (CDC) updates your BigQuery tables by processing and applying streamed changes to existing data from RDBMS’s such as MySQL, PostgreSQL, AlloyDB, and Oracle.

### Batch

Options for batch loading in BigQuery include the following:

- **Load Data Jobs** – Load data from Cloud Storage or from a local file. Accepted file formats are Avro, CSV, JSON, ORC, or Parquet.

- **LOAD DATA SQL** – Loads data from one or more files into a new or existing table. You can use the LOAD DATA statement to load Avro, CSV, JSON, ORC, or Parquet files.

- **Data Transfer Service** – This lets you automate loading data from Google Software as a Service (SaaS) apps or from third-party applications and services

- **Storage Write API** – This lets you batch-process an arbitrarily large number of records and commit them in a single atomic operation. If the commit operation fails, you can safely retry the operation. Unlike BigQuery load jobs, the Storage Write API does not require staging the data to intermediate storage such as Cloud Storage.

- **Other Managed Google Services** – Use other managed services to export data from an external data store and import it into BigQuery. For example, you can load data from Firestore exports or Cloud Datastore exports.

### Streaming

With streaming, you continually send smaller batches of data in real time, so the data is available for querying as it arrives. Options for streaming in BigQuery include the following:

- **Storage Write API** – The Storage Write API supports high-throughput streaming ingestion with exactly-once delivery semantics.

- **Dataflow** – Use Dataflow with the Apache Beam SDK to set up a streaming pipeline that writes to BigQuery. For more information, see BigQuery I/O connector in the Apache Beam documentation and the Stream from Pub/Sub to BigQuery tutorial.

- **Datastream** – Datastream uses BigQuery change data capture functionality and the Storage Write API to replicate data and schema updates from operational databases directly into BigQuery. Follow this quickstart for an example of replicating from a Cloud SQL for PostgreSQL database into BigQuery.

- **BigQuery Connector for SAP** – The BigQuery Connector for SAP enables near real-time replication of SAP data directly into BigQuery. For more information, see the BigQuery Connector for the SAP planning guide.

- **Pub/Sub** – Pub/Sub is a messaging service you can use to coordinate streaming analytics and data integration pipelines. You can use BigQuery subscriptions to write messages directly to an existing BigQuery table.

### Command Line Tool

The [bq command-line tool](https://cloud.google.com/bigquery/docs/bq-command-line-tool#:~:text=The%20bq%20command%2Dline%20tool%20is%20a%20Python%2Dbased%20command,the%20bq%20command%2Dline%20tool.) is a Python-based command-line tool for BigQuery.

### 3rd party integration

BigQuery also supports third-party data integration tools, such as Stitch, Fivetran, and Integrate.io, that can connect to various data sources and load data into the warehouse. These tools can simplify the data integration process and provide additional features, such as data quality monitoring, data transformation, and data cataloging.


---


## Redshift Integration

Amazon Redshift supports various data integration options, including AWS Glue, AWS Data Pipeline, and AWS Database Migration Service¹². These services allow you to extract, transform, and load (ETL) data from various sources into Redshift, as well as migrate data from other databases to Redshift.

### API

You can access your Amazon Redshift database using the built-in [Amazon Redshift Data API](https://docs.aws.amazon.com/redshift/latest/mgmt/data-api.html). Using this API, you can access Amazon Redshift data with web services–based applications, including AWS Lambda, Amazon SageMaker notebooks, and AWS Cloud9.

**[Loading Data](https://cloud.google.com/bigquery/docs/loading-data)**

### Change Data Capture
Amazon Aurora RDBMS zero-ETL integration with Amazon Redshift, making data available in the warehouse for analytics within seconds of it being written into Amazon Aurora.

### Batch

- **COPY command** – This is the core method for loading data from various file formats like CSV, JSON, Parquet, and Avro stored in Amazon S3 buckets. It's efficient for large datasets and offers options for compression and error handling.

- **Data API** – This allows programmatic data ingestion using familiar programming languages and the AWS SDK. It simplifies data transfer and automates workflows.

### Streaming

Streaming ingestion provides low-latency, high-speed ingestion of stream data from Amazon Kinesis Data Streams and Amazon Managed Streaming for Apache Kafka (MKS) into an Amazon Redshift provisioned or Amazon Redshift Serverless materialized view.

**Additional Ingestion Options**

- **Amazon S3 Select** – This service allows filtering and transforming data directly within S3 before loading it into Redshift, potentially optimizing performance for specific use cases.

- **AWS Glue** – This managed ETL service can be used to orchestrate and manage data extraction, transformation, and loading processes for Redshift, including integrating with various data sources.

### Command Line Tool

The AWS CLI command line tools are used in managing Amazon Redshift. The Amazon Redshift command line tools run on the [AWS Command Line Interface](https://docs.aws.amazon.com/redshift/latest/mgmt/setting-up-rs-cli.html) (AWS CLI), which in turn uses Python. The AWS CLI can be run on any operating system that supports Python.

- **Redshift Serverless**: Used to manage [Amazon Redshift Serverless](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/redshift-serverless/index.html).

### 3rd party integration

The following AWS Partners can integrate with Amazon Redshift using the AWS CLI or Amazon Redshift API operations:

- **Datacoral**
- **Etleap**
- **Fivetran**
- **SnapLogic**
- **Stitch**
- **Upsolver**
- **Matillion (preview)**
- **Sisense (preview)**
- **Thoughtspot**


---


## Snowflake Integration

In addition to being petabyte-scale cloud data warehouses, Snowflake specializes in data integration, which they define as, the process of combining data from multiple sources into a unified view to provide users valuable and actionable information.”

Snowflake can connect with various business applications like Salesforce, SAP, NetSuite, and many others.

Cloud storage: You can integrate with cloud storage services like Amazon S3, Google Cloud Storage, and Microsoft Azure Blob Storage.

### Data sources

- **Databases**: Snowflake can integrate with various relational and non-relational databases like MySQL, PostgreSQL, Oracle, SQL Server, and more.

- **Flat files**: Snowflake allows access to data stored in flat file formats like CSV, JSON, and Avro.

- **Streaming data sources**: It can integrate with real-time data sources like Kafka and Apache Flume.

### Integration methods

- **Snowflake Data Pipes**: A built-in tool for scheduling and automating data movement between Snowflake and other systems.

- **Snowflake Data Exchange**: Enables direct data sharing between Snowflake accounts, eliminating the need for complex data movement.

### API

The [Snowflake SQL API](https://docs.snowflake.com/en/developer-guide/sql-api/index.md) is a REST API that you can use to access and update data in a Snowflake database. You can use this API to develop custom applications and integrations that:

- Perform queries
- Manage deployment (e.g. provision users and roles, create tables, etc...)
- Submit SQL statements to execute standard queries and most DDL and DML statements. See [Limitations of the SQL API](https://docs.snowflake.com/en/developer-guide/sql-api/intro.html#label-sql-api-limitations) for the types of statements that are not supported.

### Snowflake Connectors

[Snowflake Connectors](https://other-docs.snowflake.com/en/connectors) provide native integration of third-party applications and database systems in Snowflake. The connectors provide instant access to current data without the need to manually integrate against API endpoints. Data automatically refreshes, based on your desired frequency, in your Snowflake account. The connectors support both the initial load of historical data as well as incremental changes for the following systems:

- **Snowflake Connector for Google Analytics Aggregate Data**
- **Snowflake Connector for Google Analytics Raw Data**
- **Snowflake Connector for Google Looker Studio**
- **Snowflake Connector for ServiceNow®**

### Change Data Capture

Snowflake implements CDC using [Table Streams](https://docs.snowflake.com/en/user-guide/streams) and [Tasks](https://docs.snowflake.com/en/user-guide/tasks-intro).

**Streams:**

- Act as the core component for capturing changes.
- Continuously monitor designated source tables (internal or external).
- Capture every modification made to the source table, including insertions, updates, and deletions.
- Store captured information as change records within the stream.

**Tasks:**

- Automate the process of applying captured changes to target tables.
- Utilize the MERGE statement, which combines INSERT, UPDATE, and DELETE functionalities in a single operation.
- Efficiently apply the captured changes to the target table, keeping it synchronized with the source.

### Command Line Tool

SnowSQL is the command line client for connecting to Snowflake to execute SQL queries and perform all DDL and DML operations, including loading data into and unloading data out of database tables. [SnowSQL](https://docs.snowflake.com/en/user-guide/snowsql) can be run as an interactive shell or in batch mode.

### 3rd party integration

Snowflake partners with various data integration platforms:

- **Informatica**
- **Talend**
- **Apache Nifi**
- **Matillion**
- **Apache Kafka**
- **Fivetran**
- **Stitch**


---


## ClickHouse Cloud Integration

ClickHouse offers a lengthy list of integrations of 18 different types. The [constantly updated list can be found here](https://clickhouse.com/docs/en/integrations).  ClickHouse integrations are organized by their support level:

- **Core integrations**: built or maintained by ClickHouse, they are supported by ClickHouse and live in the ClickHouse GitHub organization**
- **Partner integrations**: built or maintained, and supported by, third-party software vendors**
- **Community integrations**: built or maintained and supported by community members. No direct support is available besides the public GitHub repositories and community Slack channels

Each integration is further categorized:

- **AI Integration**
- **AI/ML**
- **Blockchain analytics**
- **Dashboard**
- **Data API Framework**
- **Data ingestion**
- **Data integration**
- **Data management**
- **Data orchestration**
- **Data sharing**
- **Data visualization**
- **Deployment method**
- **GUI**
- **Language client**
- **No code**
- **SDK**
- **SQL client**
- **Schema management**

### Command Line Tool

[ClickHouse Client](https://clickhouse.com/docs/en/interfaces/cli) ClickHouse Client is the native command-line SQL client for ClickHouse.

### 3rd party integrations

| Data Ingestion         | Data Integration     |
|------------------------|----------------------|
| Amazon MSK             | Cassandra            |
| Amazon S3              | DeltaLake            |
| dbt                    | EmbeddedRocksDB      |
| Google Cloud Storage   | HDFS                 |
| Kafka                  | Hive                 |
| MinIO                  | Hudi                 |
|                        | Iceberg              |
|                        | JDBC                 |
|                        | MongoDB              |
|                        | MySQL                |
|                        | NATS                 |
|                        | ODBC                 |
|                        | PostgreSQL           |
|                        | RabbitMQ             |
|                        | Redis                |
|                        | SQLite               |

---

## A Solution to the Problems of High Cost and High Friction of Managing Data Pipelines

A solution to the problems of the high cost and friction of creating, changing, and managing data pipeline is a few simple architectures based on your data, metadata and your chosen CDW. Depending on your source, either Redshift or BigQuery was the first cloud data warehouse as a service, and in the past 13 years, these products have become incredibly popular, capable, and mature. Have a look at the diagram below created by Google Machine Learning Solution Architect, Rajesh Thallam, for his blog, [How to load, import, or ingest data into BigQuery for analysis | Google Cloud Blog](https://cloud.google.com/blog/topics/developers-practitioners/bigquery-explained-data-ingestion). It’s an almost complete list of the ways you can load data into BigQuery (see the section above on integration and ingestion).

![diagram](/blogs/2024-03-06-guide-integration-ingestion/diagram.png)


There are 39 leaf nodes in the above diagram. 39 different data sources that BigQuery knows how to handle. Then there’s logging, monitoring, alerting, permissions, and security.

Let’s take a look at the work that might be involved in going from a great idea to production.

## Nothing Stays Simple for Long

*Just to be clear, neither GCP nor BigQuery are being singled out as bad examples.*

So, we uploaded some CSV to cloud storage and then queried the data with BigQuery! Simple, straightforward, and easy to maintain.

![Step1](/blogs/2024-03-06-guide-integration-ingestion/step1.png)

Then one day, some eager beaver says, “You know, we could capture some events from the mobile app, and make it available to BigQuery. The business would love it! Probably wouldn't be too hard…”

![Step2](/blogs/2024-03-06-guide-integration-ingestion/step2.png)

Ok, that’s adding some complexity but there’s real business value.

A few months later, another bright spark says, “You know, instead of uploading these events every day, we could stream these app events in real time. The business would love it! Probably wouldn't be too hard…”

![Step3](/blogs/2024-03-06-guide-integration-ingestion/step3.png)

Did we really need to stream the event data in real time? Was the business value worth the cost in added complexity and dev hours? Or did the business team just say, “Yeah, that’d be cool.”

Par for the course, right? But this is a simplified, cartoon version of how things go at the office. What actually happens is this, **The great idea lifecycle**:

| Could we?                                      | Develop                                | Deploy                                | Repair                                                        | Need to make a change…           |
|------------------------------------------------|----------------------------------------|---------------------------------------|---------------------------------------------------------------|----------------------------------|
| How does Cloud Pub/Sub work?                   | Code a prototype                       | Deploy to prod                        | Business user says the data is stale                         | Go back to Development           |
| Learn about pub/sub errors                     | Test & Fix                             | Is It working?                        | Business user says the data is wrong                         |                                  |
| How does BigQuery API work?                    | Show the business                      | Add some logging                      | Business user says the data is duplicated                    |                                  |
| Learn about API errors                         | Accept praise                          | Add some monitoring                   | What broke?                                                   |                                  |
| Permissions?                                   |                                        | Add some alerting                     | Debug                                                         |                                  |
| Security?                                      |                                        |                                       | Fix                                                           |                                  |
| Update MDM                                     |                                        |                                       | Deploy Fix                                                    |                                  |



**None of the above includes the many different business departments, subject matter experts, technical teams, policies, procedures, and personalities.**
-Analysis of potential business value is basic, at best.
- No OKRs or metrics for success are set.
- Then one day, the data quality suddenly drops
- Then devs change the schema without notifying data team
- Then business wants to change the schema and involve the data team
- Monitor the PubSub API for changes
- Monitor the BigQuery for changes
- Wait for the next big idea
- Someone from the risk team wants a meeting …

**All of this is the simplest version of a new data feature’s lifecycle, and for just two of the 39 leaves of standard, built-in data GCP sources. There are 37 more. How many are you using? How many will you be using in a year?**

When you add up all of the above, you can clearly see what the problem is: complexity, a name for all the different types of interactions between components that are required to get from idea through to production. And whether you’re using GCP or AWS or Snowflake or or or, complexity is always the most likely outcome unless you constrain your data stack to avoid complexity wherever you can.

So, reduce complexity. But where?


---


## Smaller, Faster, Better Workflow Automation & Orchestration

The second part of your solution is architecture, specifically, there are three architectural principles that I’d like you to consider: **Separation of Concerns, Coupling, and Cohesion.**

- **Separation of concerns** is a design principle for separating a computer program into distinct sections or modules and offers a means of managing complexity. For example, bus drivers don’t fix roads. Similarly, cloud data warehouses shouldn’t manage data pipeline workflows.

- **Cohesion** is defined as a measure of the strength of association of the elements within a module. For example, a cohesive workflow orchestration platform should provide scheduling, triggers, and monitoring

- **Coupling** is defined as a measure of the interdependence among modules in a computer program. Loose coupling is the goal. Loosely coupled systems are more modular than tightly coupled systems, so they can be easily expanded and scaled without disrupting the entire system's architecture and offer greater extensibility.

The value of these three principles is one of the prime reasons for the ascendance of microservices. Monolithic infrastructures, like the do-everything cloud data warehouse, can be difficult to scale and maintain and trend strongly toward vendor lock-in.**

Following the three principles would strongly suggest that  big data query-related activities are handled by the Cloud Data Warehouse, while data pipeline-related activities like scheduling, monitoring, logging should be handled by your workflow orchestrations platform. This becomes even more important if your shop is hybrid- or multi-cloud.

The most valuable capability that Kestra provides is the power to keep workflow orchestration simpler, smaller, faster, better and still avoid the steep learning curves and admin nightmares. It allow me to quickly and easily create workflows that do everything I need:

- **AI**
- **Alerting**
- **Batch**
- **Cloud**
- **Database**
- **Error handling**
- **Event-driven execution**
- **File detection triggers**
- **Messaging**
- **Monitoring & Alerting**
- **Scripting**
- **Storage**
- **Streaming**
- **Transformation**
- **Triggers**
- **Versioning**
- **Webhooks**

You can get Kestra [running in a docker container in minutes](https://github.com/kestra-io/kestra) and then learn the basics of creating Flows (workflows) within minutes. The same docker image can be deployed to a K8s cluster on-prem or in the cloud. There is a simple pattern that is used in every Flow, written in declarative YAML.

If your organization is adopting a data mesh architecture, Kestra instances can be deployed as needed for each business domain.

**The architecture diagram below is actually the architecture I use in my startup company (I don't use every one of the CDWs shown). It is simple, clean, flexible, scalable, extremely capable and robust. Critically, it allows me to execute and monitor in real time.**

You have the ability to quickly implement any of the best-in-class tools like [FiveTran](/plugins/plugin-fivetran), [dlt](https://github.com/dlt-hub/dlt-kestra-demo), [Airbyte](/plugins/plugin-airbyte) or [SQLMesh](/plugins/plugin-sqlmesh).

![schema](/blogs/2024-03-06-guide-integration-ingestion/schema.png)


## Kestra Features

Kestra offers a flexible event-driven workflow execution and allows anyone to build workflows as code. This approach facilitates seamless integration with existing CI/CD processes, Infrastructure as Code tools like Terraform, and version control systems like Git.

From day one, Kestra has been an API-first design with declarative workflow definitions.

**Deploy and Run Anywhere**
From on-premise installations to cloud-based VMs and Kubernetes clusters, you can deploy both Kestra and individual workflows on any platform or machine.

**Code in Any Language**
Write your business logic in any language. Kestra supports Java-based plugins as well as scripts written in Python, R, Julia, Ruby, Shell, Powershell, and Node.js.

**Scale to Millions of Executions**
Kestra has been built on top of leading cloud-native technologies, enabling seamless scaling to millions of workflow executions.

## Conclusion

My mother was constantly sharing her pearls of wisdom, and the one that applies here is “A place for everything and everything in its place.” Through loose coupling, modularization, and separating concerns cohesively, you can save yourself a lot of the friction and wasted time usually found in creating and maintaining data pipelines.

In a happy and efficient architecture, cleaning and standardizing data should be handled by services, called by your workflow orchestrator. If you’re not able to easily implement REST APIs in your company, then you can do the same thing by calling the same code via command lines, executed by your workflow orchestrator.

Your data transformations should be executed at the cheapest possible price, and maybe that means spinning up 50 k8s nodes on a different cloud. Your workflow orchestrator should do that, too.

Alerting, monitoring, and logging of your data pipelines doesn’t need to be scattered over a half-dozen providers, it can and should be handled by, you guessed it, your workflow orchestrator.

Finally, your workflow orchestrator should be so complete and designed so intelligently that it can be used by some of your business partners – show them how to clean their messy data!

Workflow happiness is just minutes away: https://github.com/kestra-io/kestra