---
title: "Apache Iceberg: The High-Performance Data Lake Table Format"
description: "Apache Iceberg brings ACID transactions, schema evolution, and time travel to data lakes. Learn how this open-source table format simplifies data management and how Kestra orchestrates its power for reliable analytics."
metaTitle: "Apache Iceberg: High-Performance Data Lake Format"
metaDescription: "Apache Iceberg is an open-source table format that transforms data lakes with ACID transactions, schema evolution, and time travel for big data management."
tag: data
date: 2026-09-14
slug: "apache-iceberg"
faq:
  - question: "What is Apache Iceberg used for?"
    answer: "Apache Iceberg is used to manage large analytic tables in data lakes, providing capabilities like ACID transactions, schema evolution, and time travel. It enables reliable and high-performance data processing for use cases such as real-time analytics, data warehousing, and machine learning pipelines."
  - question: "How does Apache Iceberg compare to Delta Lake?"
    answer: "Both Apache Iceberg and Delta Lake are open-source table formats for data lakes, offering ACID properties, schema evolution, and time travel. Key differences often lie in their underlying file formats, community adoption, and specific integrations with various query engines and cloud platforms."
  - question: "Does Netflix use Apache Iceberg for its data?"
    answer: "Yes, Netflix originally developed Apache Iceberg to address the challenges of managing massive datasets in its own data lake. It continues to be a primary user and contributor to the project, leveraging Iceberg for its high-performance analytics and data management needs."
  - question: "What are the main benefits of using Apache Iceberg?"
    answer: "Apache Iceberg offers several benefits, including atomic changes for reliable data writes, flexible schema evolution without data rewrites, hidden partitioning to simplify query planning, and time travel for querying historical data states or rolling back changes."
  - question: "What are the limitations of Apache Iceberg?"
    answer: "While powerful, Apache Iceberg can introduce operational overhead due to its metadata management. Performance can vary depending on the query engine and configuration, and it requires careful planning for optimal partitioning and file compaction strategies in large-scale deployments."
  - question: "How does Apache Iceberg improve upon traditional Hive tables?"
    answer: "Iceberg significantly improves upon traditional Hive tables by providing reliable ACID transactions, faster query performance through optimized metadata handling, support for flexible schema evolution, and capabilities like time travel, which are absent in standard Hive."
  - question: "Can Apache Iceberg be used with AWS S3?"
    answer: "Yes, Apache Iceberg is designed to work directly with cloud object storage like AWS S3. It uses S3 as its underlying storage layer for data files, while managing metadata to provide table-like functionalities and enable efficient queries with tools like Amazon Athena."
---

> **TL;DR** — Apache Iceberg is an open table format that brings ACID transactions, schema evolution, and time travel to data lakes. It keeps a metadata layer over Parquet or ORC files on object storage such as S3, so engines like Spark, Trino, Flink, and Snowflake can query the same tables reliably at petabyte scale.

Managing vast datasets in a data lake often comes with a hidden cost: the complexity of ensuring data quality, consistency, and performance. Without a disciplined framework, data pipelines become brittle, schema changes lead to outages, and auditing historical data is a nightmare. This challenge is precisely what Apache Iceberg was built to solve.

Apache Iceberg transforms raw object storage into reliable, high-performance tables. It brings the familiar semantics of a SQL database to your data lake, enabling atomic operations, flexible schema evolution, and even time travel. For data engineers, it means building more resilient and scalable data platforms with less operational overhead.

## How Apache Iceberg works

Apache Iceberg is not a storage engine or a query engine; it's a table format specification. It defines how to manage a collection of data files in a directory to present them as a single, consistent table. This is achieved through a structured metadata layer that sits on top of files stored in formats like Parquet, Avro, or ORC.

### Key characteristics of Apache Iceberg
- **Metadata-driven:** Iceberg tracks the state of a table through a hierarchy of metadata files. A snapshot represents the state of a table at a specific time, pointing to a manifest list, which in turn points to manifest files. These manifests track the individual data files that make up the table.
- **Atomic Commits:** All changes to a table, from adding a single row to rewriting entire partitions, are committed as a new metadata snapshot. This operation is atomic, meaning queries either see the complete change or none of it, eliminating inconsistencies.
- **Decoupled from Compute:** Iceberg is engine-agnostic. It can be used with a variety of query engines like Spark, Trino, Flink, and Amazon Athena, providing flexibility in your data stack.

### Deep dive into Iceberg's metadata architecture

The core of Iceberg's reliability lies in its metadata. Unlike Hive, which relies on a directory listing to discover data, Iceberg maintains a complete list of a table's data files in its metadata. This file-level tracking, known as snapshot isolation, is what enables ACID transactions and prevents "dirty reads" where queries might access partially written data. When a write operation occurs, Iceberg creates new data files and a new set of metadata files, then atomically swaps a pointer to the new top-level metadata file. This design ensures that readers are never disrupted by ongoing write operations.

## Why your data lake needs Apache Iceberg

Adopting Apache Iceberg changes how you manage and interact with data in your lakehouse. It addresses common pain points that have historically made data lakes difficult to govern and use for production analytics.

### Reliability and consistency with SQL-like semantics
Iceberg provides ACID (Atomicity, Consistency, Isolation, Durability) transactions. This means you can perform reliable `INSERT`, `UPDATE`, `DELETE`, and `MERGE` operations directly on your data lake tables, just as you would with a traditional data warehouse. This eliminates the need for complex, error-prone data pipeline logic to handle updates and deletes.

### Performance optimization for large analytic tables
By maintaining detailed statistics about data files (like min/max values for columns), Iceberg enables query engines to perform efficient file pruning. This means queries can skip reading irrelevant files entirely, drastically reducing scan times and improving performance for large-scale analytical workloads.

### Flexible schema evolution and hidden partitioning
Iceberg supports full schema evolution, allowing you to add, drop, rename, or reorder columns without rewriting the entire table. This is a significant advantage over older formats where schema changes were often disruptive. Iceberg's "hidden partitioning" feature also decouples the physical data layout from the logical table structure. You can evolve your partitioning strategy over time without breaking existing queries, a common challenge with Hive tables.

### Time travel and data versioning for auditing and recovery
Every change to an Iceberg table creates a new snapshot. This history of snapshots allows you to query the table as it existed at any point in time, a feature known as "time travel." This is invaluable for auditing, debugging data issues, or rolling back erroneous writes to a previous known-good state.

## Orchestrate Apache Iceberg with Kestra: Managing an S3 Lakehouse

While Iceberg provides the table format, you still need to orchestrate the end-to-end data pipelines that populate and maintain these tables. This includes ingesting raw data, transforming it, merging it into the final table, and performing maintenance operations like compaction.

This is where an orchestration platform like Kestra comes in. The following Kestra flow demonstrates an event-driven pipeline that automatically ingests new CSV files from an S3 bucket, processes them, and merges them into an Iceberg table using Amazon Athena.

```yaml
id: event-driven-iceberg-ingestion
namespace: company.team.data

tasks:
  - id: python-transform
    type: io.kestra.plugin.scripts.python.Script
    script: |
      import pandas as pd
      from kestra import Kestra
      
      df = pd.read_csv("{{ trigger.uri }}")
      # Example transformation: clean and rename columns
      df.rename(columns={'user_id': 'customer_id', 'transaction_date': 'sale_date'}, inplace=True)
      df['sale_date'] = pd.to_datetime(df['sale_date']).dt.strftime('%Y-%m-%d %H:%M:%S')
      
      # Output transformed data to Kestra's internal storage
      output_path = Kestra.create_storage_output_uri(".csv")
      df.to_csv(output_path, index=False)
    outputFiles:
      - "*.csv"

  - id: upload-to-staging
    type: io.kestra.plugin.aws.s3.Upload
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    region: "us-east-1"
    bucket: "iceberg-staging-bucket"
    key: "processed/{{ execution.id }}.csv"
    from: "{{ outputs['python-transform'].outputFiles['*'] }}"

  - id: merge-into-iceberg
    type: io.kestra.plugin.aws.athena.Query
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    region: "us-east-1"
    database: "iceberg_db"
    query: |
      MERGE INTO sales_iceberg t
      USING (SELECT * FROM staging_table) s
      ON t.customer_id = s.customer_id
      WHEN MATCHED THEN
        UPDATE SET t.sale_amount = s.sale_amount, t.sale_date = s.sale_date
      WHEN NOT MATCHED THEN
        INSERT (customer_id, sale_amount, sale_date)
        VALUES (s.customer_id, s.sale_amount, s.sale_date);

triggers:
  - id: on-new-s3-file
    type: io.kestra.plugin.aws.s3.Trigger
    bucket: "raw-data-bucket"
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    region: "us-east-1"
```

### Worth noticing: what the Kestra flow handles
- **Event-Driven Automation:** The workflow is automatically triggered by a new file landing in an S3 bucket, enabling real-time data ingestion.
- **Stateful Processing:** Kestra manages the state between tasks, passing the transformed file from the Python script to the S3 upload task without extra glue code.
- **Separation of Concerns:** The flow clearly separates data transformation (Python script) from data loading (Athena query), making the pipeline easier to understand and maintain.
- **Declarative and Version-Controlled:** The entire pipeline is defined in a single YAML file, which can be version-controlled in Git, reviewed, and deployed as part of a CI/CD process.

### Choosing between batch and event-driven ingestion

The example above uses an event-driven trigger, which is ideal for low-latency use cases where data needs to be available quickly. For many analytical workloads, a scheduled batch approach is more efficient. Kestra can easily be configured for batch processing by replacing the S3 trigger with a `Schedule` trigger, which runs the pipeline at a defined interval (e.g., hourly or daily). The choice depends on your specific business requirements for data freshness and the cost implications of running frequent, small updates versus larger, periodic batches.

## Where Apache Iceberg delivers value

Iceberg is not just a technical curiosity; it enables powerful new patterns for data architecture and solves real-world business problems.

### Common use cases for Apache Iceberg
- **Building a [Data Lakehouse Architecture](/resources/data/lakehouse-architecture):** Iceberg is a foundational component of modern lakehouses, providing the reliable table storage layer.
- **Streaming Ingestion:** Its atomic commits and snapshot isolation make it safe for streaming jobs to write into tables that are simultaneously being read by analytical queries.
- **Data Compliance (GDPR/CCPA):** Row-level `DELETE` and `UPDATE` operations make it easier to handle data deletion and correction requests to comply with privacy regulations.

### How Netflix pioneered Iceberg for scale
Netflix developed Iceberg to solve the reliability and performance issues they faced with their massive petabyte-scale data lake built on Hive. They needed a way to manage huge tables with millions of partitions and billions of files without performance degradation or data consistency problems. Iceberg's metadata-centric design was the solution, and its open-sourcing has allowed the broader community to benefit from their experience.

### Integrating Apache Iceberg with your existing data stack
Iceberg's strength is its broad adoption across query engines and cloud providers. It is supported by major cloud providers and query engines, including AWS (Athena, EMR), Google Cloud (BigQuery), Snowflake, and Databricks. This wide support ensures you are not locked into a single vendor and can choose the best tools for your analytical needs.

## Apache Iceberg: Comparing lakehouse table formats

Iceberg is one of three popular open table formats, alongside Delta Lake and Apache Hudi.

### Apache Iceberg vs Delta Lake and Apache Hudi
All three formats aim to bring data warehousing capabilities to data lakes. While they share core features like ACID transactions and time travel, they differ in their implementation details, metadata management, and community focus.
- **[Delta Lake](/resources/data/delta-lake)**, primarily developed by Databricks, is tightly integrated with Spark and Databricks.
- **Apache Hudi** offers different table types (Copy-on-Write and Merge-on-Read) to optimize for read-heavy or write-heavy workloads.
- **Apache Iceberg** is often praised for its engine-agnostic design and a specification-driven approach that encourages broad community adoption.

The choice between them often depends on your primary query engine, specific feature requirements (like Hudi's incremental queries), and your organization's preference for community-driven versus vendor-backed projects.

### Why Iceberg simplifies data management compared to Hive
Traditional Hive tables rely on directory structures for partitioning and data discovery. This approach is fragile: renaming a directory can break the table, and schema changes are complex. Iceberg's metadata layer completely abstracts away the physical file layout. This makes operations like partitioning, schema evolution, and data maintenance significantly simpler and more reliable, reducing the operational burden on data teams.

## Related concepts
- [Apache Iceberg vs. Delta Lake: Choosing a Table Format](/resources/data/iceberg-vs-delta-lake)
- [Parquet File Format Explained](/resources/data/parquet-file-format)
- [Databricks Alternatives: Top Data & AI Platforms](/resources/data/databricks-alternatives)
- [What is Data Ingestion?](/resources/data/what-is-data-ingestion)
- [Declarative Orchestration for Modern Data Engineers](/data)

To build reliable, production-grade data platforms with Apache Iceberg, you need a powerful orchestration layer. Explore how Kestra can help you automate and manage your entire data lifecycle.
