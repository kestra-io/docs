---
title: "What Is a Data Pipeline? Definition, Architecture, and Tools"
description: "Every modern business runs on data pipelines. Learn the architecture, the three stages (ingestion, transformation, loading), how pipelines differ from ETL, the main types (batch, streaming, event-driven), and how to choose the right tool."
metaTitle: "What Is a Data Pipeline? Definition & Architecture | Kestra"
metaDescription: "A data pipeline moves data from sources to destinations via ingestion, transformation, and loading. Learn the types, architecture, and how to choose tools."
tag: data
date: 2026-07-01
faq:
  - question: "What is meant by a data pipeline?"
    answer: "A data pipeline is an automated sequence of steps that ingests data from source systems, transforms it according to business rules, and loads it into a destination such as a data warehouse, lake, or operational system. It handles the movement, shaping, and delivery of data across an organization's stack."
  - question: "What are the main 3 stages in a data pipeline?"
    answer: "The three main stages of a data pipeline are ingestion (extracting data from sources), transformation (cleaning, joining, and applying business logic), and loading (writing to the destination). Modern ELT pipelines reverse the order of the last two stages, loading raw data first and transforming it in the warehouse."
  - question: "Is data pipeline the same as ETL?"
    answer: "No. A data pipeline is the broader concept — any automated system moving data from source to destination. ETL (Extract, Transform, Load) is one specific pipeline pattern. A data pipeline can follow ETL, ELT, streaming, event-driven, or reverse-ETL patterns depending on the architecture."
  - question: "Is ETL obsolete?"
    answer: "No. The shift toward ELT and modern patterns hasn't made ETL obsolete. ETL is still required when data must be cleaned, masked, or transformed before entering the warehouse — common in compliance-heavy industries handling PII, PHI, or regulated financial data."
  - question: "What's the difference between a data pipeline and a workflow?"
    answer: "A data pipeline describes the data-specific flow (extract, transform, load). A workflow is the broader orchestration system that runs pipelines alongside other tasks — triggers, retries, approvals, and dependencies. One pipeline is often a subset of a larger workflow that may also include infrastructure, messaging, or approval steps."
  - question: "How do I choose a data pipeline tool?"
    answer: "Choose based on five criteria: (1) team skills — Python, SQL, or YAML?, (2) stack — AWS-locked or cloud-agnostic?, (3) triggers — schedule-only or event-driven?, (4) observability requirements, and (5) pricing model. Teams often split the decision: a managed ingestion tool (Fivetran, Airbyte) for extraction plus a general orchestrator (Kestra, Airflow) for the rest."
---

A finance team opens Monday's revenue dashboard and the numbers are three days old. A machine learning model scores customers on data that stopped updating last week. An analyst spends every Friday afternoon pulling CSV exports from four SaaS tools and stitching them together by hand in a spreadsheet. None of these are exotic failures. They are the everyday cost of moving data without a real pipeline.

A data pipeline is what replaces that manual, error-prone work with an automated path from source to insight. This article defines what a data pipeline is, walks through how it works stage by stage, clarifies how it differs from ETL, and shows a reference architecture with two concrete, named-stack examples. You will also see how Kestra's declarative orchestration keeps these flows reliable, version-controlled, and observable, with working YAML you can read and adapt.

## What Is a Data Pipeline?

At its core, a data pipeline is an automated system for moving data from a source to a destination. It is a series of connected processing steps that ingest, transform, and deliver data so it arrives in a clean, consistent, and usable state.

### What defines a modern data pipeline?

A modern data pipeline is more than a script that moves data. It is an engineered system built for reliability, scalability, and observability. It handles dependencies between tasks, manages failures gracefully, and gives you visibility into the entire data flow. The goal is an automated, repeatable process that turns raw data into a usable asset for analytics, machine learning, or operational use cases. Solid [data orchestration](/resources/data/data-orchestration) is what keeps these pipelines manageable as they grow.

### The essential components of a data pipeline

Architectures vary, but most data pipelines share the same building blocks:

*   **Data Sources**: The origin of the data. This can be relational databases (Postgres, MySQL), NoSQL stores, SaaS application APIs (Salesforce, HubSpot), file systems (S3, GCS), or streaming sources like Kafka.
*   **Ingestion**: The process of extracting data from its source. This is the first step in any pipeline and needs reliable connectors and methods for handling varied data formats and access patterns. A solid [data ingestion](/resources/data/what-is-data-ingestion) strategy is fundamental.
*   **Processing/Transformation**: The engine that cleans, enriches, aggregates, and restructures the data. This can be simple filtering and formatting, or complex joins and computations using tools like dbt, Spark, or custom Python scripts.
*   **Destination (or Sink)**: The final storage location for the processed data. Common destinations include data warehouses (Snowflake, BigQuery, Redshift), data lakes, or operational systems that consume the data in real time.
*   **Orchestration**: The control plane that schedules, monitors, and manages the whole workflow. It defines the sequence of tasks, handles dependencies, retries failures, and provides alerting and logging.

## How Does a Data Pipeline Work?

Every data pipeline, whatever its complexity, follows a logical progression to move data from its origin to its destination. Understanding how to [create a data pipeline](/resources/data/create-data-pipeline) means mastering three fundamental stages: ingestion, transformation, and loading.

### Stage 1: Data Ingestion (Extraction)

This is the entry point where the pipeline collects raw data from one or more sources. The method depends on the source system and the requirements of the pipeline:

*   **Batch Ingestion**: Data is collected and processed in large chunks at scheduled intervals (hourly, daily). This is common for traditional data warehousing and reporting.
*   **Streaming Ingestion**: Data is ingested and processed continuously, often event by event, in near real-time. This suits applications that need low latency, like fraud detection.
*   **Change Data Capture (CDC)**: This method identifies changes made to data in a source database and streams those changes to the destination, keeping the two in sync.

### Stage 2: Data Transformation (Cleaning, Enrichment, Structuring)

Once ingested, raw data is rarely in the right shape for analysis. The transformation stage refines it for quality and consistency. Common tasks include:

*   **Cleaning**: Handling missing values, correcting errors, and removing duplicates.
*   **Enrichment**: Augmenting the data by joining it with data from other sources.
*   **Standardization**: Bringing data to a consistent format (for example, standardizing date formats or address fields).
*   **Aggregation**: Summarizing data to a higher level of granularity (for example, calculating daily sales from individual transactions).

This stage often uses dbt for SQL-based transformations, Apache Spark for large-scale processing, or custom scripts in languages like Python.

### Stage 3: Data Loading (Delivery to Destination)

The final stage loads the transformed data into its target destination. This could be:

*   **Data Warehouse**: A structured repository optimized for analytics and business intelligence (Snowflake, BigQuery).
*   **Data Lake**: A centralized repository for storing large amounts of raw and processed data in various formats.
*   **Data Mart**: A subset of a data warehouse focused on a specific business line or department.
*   **Operational Database**: A system that powers a user-facing application.

The following Kestra flow shows a simple ETL pattern: it extracts user data from an API, transforms it with a Python script, and loads it into a PostgreSQL database.

```yaml
id: simple-etl-pipeline
namespace: company.team.production

tasks:
  - id: extract_users
    type: io.kestra.plugin.core.http.Request
    uri: https://jsonplaceholder.typicode.com/users

  - id: transform_users
    type: io.kestra.plugin.scripts.python.Script
    script: |
      import json
      from kestra import Kestra
      
      data = json.loads({{ outputs.extract_users.body }})
      transformed = []
      for user in data:
          transformed.append({
              "id": user["id"],
              "name": user["name"],
              "email": user["email"],
              "city": user["address"]["city"]
          })
      
      Kestra.outputs({"data": transformed})
    outputFiles:
      - data.json

  - id: load_to_postgres
    type: io.kestra.plugin.jdbc.postgresql.Copy
    from: "{{ outputs.transform_users.outputFiles['data.json'] }}"
    url: jdbc:postgresql://host.docker.internal:5432/postgres
    username: postgres
    password: "{{ secret('POSTGRES_PASSWORD') }}"
    tableName: users
    format: JSON
```

These stages form the core of most data engineering workflows, and platforms exist to help [orchestrate data pipelines](/docs/use-cases/data-pipelines) reliably.

## Data Pipeline vs ETL — What's the Difference?

The data engineering vocabulary is full of overlapping terms. "Data pipeline" and "ETL" get used interchangeably, but they are not the same thing.

*   **Data Pipeline** is the broader, more general term. It refers to any automated process that moves data between systems.
*   **ETL (Extract, Transform, Load)** is a specific *type* of data pipeline. In this pattern, data is extracted from the source, transformed in a staging area, and then loaded into the destination.

All ETL processes are data pipelines, but not all data pipelines follow the ETL pattern. Another common pattern is **ELT (Extract, Load, Transform)**, where raw data is loaded directly into the destination (often a data warehouse) and transformed in place using the warehouse's compute power. The choice between [ETL vs ELT](/resources/data/etl-vs-elt) depends on the data volume, the capabilities of the destination system, and the latency you need. Many modern [ETL pipeline tools](/resources/data/etl-pipeline-tools) support both patterns.

### Is SQL a data pipeline? How SQL fits into the flow

SQL (Structured Query Language) is a tool *used within* a data pipeline, not a pipeline itself. SQL is the language used to query and manipulate data in relational databases and data warehouses. In a data pipeline, SQL most often appears during the transformation stage to:

*   Filter and select specific data.
*   Join data from multiple tables.
*   Aggregate data to create summaries.
*   Clean and standardize values.

Think of it this way: if a data pipeline is the entire factory assembly line, SQL is a specific, high-powered tool used at one of the workstations. The pipeline orchestrates the whole process, while SQL performs one important task within it.

## Data Pipeline Architecture: A Reference Blueprint

Beyond the three stages, a production-grade pipeline has a recognizable shape. Picturing the layers makes it easier to decide where each tool fits and where things tend to break.

A reference data pipeline architecture has five layers stacked between the source and the consumer:

1.  **Source layer** — operational databases, SaaS APIs, event streams, and files. Each source has its own access pattern, refresh rate, and failure mode.
2.  **Ingestion layer** — connectors and CDC tools (Airbyte, Fivetran, Debezium, custom extractors) that pull or receive data and land it in a staging area such as object storage or a raw warehouse schema.
3.  **Transformation layer** — the engines (dbt, Spark, Python) that clean, join, and model the raw data into analytics-ready tables.
4.  **Storage layer** — the warehouse, lake, or lakehouse where modeled data lives (Snowflake, BigQuery, Redshift, S3).
5.  **Serving and consumption layer** — BI dashboards, reverse-ETL syncs, ML feature stores, and application APIs that read the finished data.

Cutting across all five layers is an **orchestration plane**. It decides what runs, in what order, on which trigger, and what happens when a step fails. This is the layer that turns a collection of scripts into a dependable pipeline, with scheduling, dependency management, retries, alerting, and lineage. Without it, the other layers are just disconnected jobs hoping to run in the right order.

Most production incidents trace back to the seams between these layers rather than the layers themselves. A source API changes its schema and the ingestion job loads garbage. An overnight batch finishes late, so the transformation step reads yesterday's partial data. A warehouse load silently truncates a column and the dashboard is wrong before anyone notices. A clear architecture, paired with an orchestration plane that enforces ordering and surfaces failures early, is what keeps these seams from quietly corrupting downstream data.

## Types of Data Pipelines: Matching Design to Use Case

Not all data pipelines are alike. The architecture and technology choices depend heavily on the business requirements for latency and processing style. The key distinction is [Batch vs Streaming Processing](/resources/data/batch-vs-streaming-processing).

### Batch data pipelines: when scheduled processing is enough

Batch pipelines process data in discrete, large volumes at regular intervals. This is the traditional approach for warehousing and analytics use cases where real-time data is not a strict requirement.

*   **Use Cases**: Daily sales reporting, monthly financial consolidation, ETL jobs that run overnight.
*   **Characteristics**: High throughput, cost-effective for large datasets, higher latency.
*   **Technologies**: Scheduled jobs run by orchestrators, MapReduce, Spark Batch.

### Real-time and streaming data pipelines: for immediate insights

Streaming pipelines process data continuously as it is generated, event by event. This approach is essential for applications that must act immediately on fresh data.

*   **Use Cases**: Real-time fraud detection, live monitoring dashboards, recommendation engines, IoT sensor data processing.
*   **Characteristics**: Low latency, continuous processing, often more complex and costly to operate.
*   **Technologies**: Apache Kafka, Apache Flink, Spark Streaming, Amazon Kinesis.

## Data Pipeline Examples: Two Concrete Stacks

Definitions are easier to apply when you can see the actual tools wired together. Here are two pipelines that data teams build often, with the specific components in each.

### Example 1: ELT analytics pipeline (Airbyte + dbt + Snowflake)

A SaaS company wants daily marketing and product metrics in one warehouse.

*   **Ingest**: Airbyte connectors pull raw data from Salesforce, HubSpot, and the product Postgres database into a `raw` schema in Snowflake.
*   **Transform**: dbt models run inside Snowflake, cleaning the raw tables, joining them, and building tested `marts` tables for revenue and engagement.
*   **Load/serve**: BI tools read the marts tables; a reverse-ETL job syncs key metrics back into the CRM.
*   **Orchestrate**: A single flow triggers the Airbyte sync, waits for it to finish, then runs `dbt build`, and alerts on failure. This is the exact pattern in Kestra's guide to [end-to-end orchestration with Airbyte, dbt, and Kestra](/blogs/2023-06-26-end-to-end-data-orchestration).

### Example 2: Cloud ETL pipeline (S3 + Python + BigQuery)

A data team receives daily partner exports as files and needs them in a warehouse for reporting.

*   **Ingest**: Files land in an S3 bucket; an event trigger detects new objects and starts the flow.
*   **Transform**: A Python task validates the schema, deduplicates rows, and reshapes the records into the target format.
*   **Load**: The cleaned file is loaded into a BigQuery table partitioned by date.
*   **Orchestrate**: The flow handles retries on transient API errors and posts a summary to Slack. The same building blocks appear in Kestra's walkthrough of a [BigQuery and Google Cloud data pipeline](/blogs/2022-11-19-create-data-pipeline-bigquery-google-cloud) and an [Amazon Redshift data pipeline](/blogs/2024-04-09-aws-data-pipeline).

The flow below sketches the second example: it triggers on a new file in S3, transforms it with Python, and loads the result into BigQuery.

```yaml
id: s3-to-bigquery-pipeline
namespace: company.team.analytics

tasks:
  - id: download_file
    type: io.kestra.plugin.aws.s3.Download
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: eu-west-1
    bucket: partner-exports
    key: "{{ trigger.objects[0].key }}"

  - id: clean_data
    type: io.kestra.plugin.scripts.python.Script
    inputFiles:
      raw.csv: "{{ outputs.download_file.uri }}"
    script: |
      import pandas as pd
      df = pd.read_csv("raw.csv").drop_duplicates()
      df.to_csv("clean.csv", index=False)
    outputFiles:
      - clean.csv

  - id: load_bigquery
    type: io.kestra.plugin.gcp.bigquery.Load
    from: "{{ outputs.clean_data.outputFiles['clean.csv'] }}"
    destinationTable: my_project.analytics.partner_data
    format: CSV
    csvOptions:
      fieldDelimiter: ","

triggers:
  - id: new_file
    type: io.kestra.plugin.aws.s3.Trigger
    bucket: partner-exports
    prefix: incoming/
    interval: PT1M
```

## Benefits of Effective Data Pipelines

Well-architected data pipelines turn data from a siloed liability into a usable asset, and the payoff shows up across the business.

### Better data quality and consistency

By centralizing processing logic, pipelines enforce consistent rules for cleaning, validation, and transformation. Every downstream consumer, from analysts to machine learning models, works from a reliable, single source of truth.

### Wider data accessibility for analytics and AI

Data pipelines break down silos, making information from across the organization available in one place like a warehouse or lake. That access is a foundational requirement for building any serious [AI pipeline](/resources/ai/ai-pipeline). Modern applications like Retrieval-Augmented Generation also depend on well-orchestrated data flows to populate vector databases, as shown in a [RAG pipeline](/resources/ai/rag-pipeline).

### Higher operational efficiency through automation

The primary benefit of a data pipeline is automation. Replacing manual extraction and hand-editing with an automated, scheduled workflow gives data teams their time back. It cuts the risk of human error and lets engineers focus on higher-value work instead of repetitive exports.

## Data Pipeline Tools — How Kestra Compares

The orchestration market is crowded, and the right choice depends on how broad your workloads are and how much your team wants to write in Python versus declarative config. Kestra is a language-agnostic, declarative orchestrator: you define pipelines in version-controlled YAML and run any language, plugin, or tool from one control plane. To see where it sits against the established players, these comparison pages lay out the trade-offs directly:

*   [Airflow Alternatives](/resources/data/airflow-alternatives) — for teams weighing the Python-DAG incumbent against declarative options.
*   [Top Dagster Alternatives](/resources/data/dagster-alternatives) — how Kestra and others compare to the asset-based model.
*   [Top Astronomer Alternatives](/resources/data/astronomer-alternatives) — managed-Airflow trade-offs versus a unified platform.
*   [Prefect Alternatives](/resources/data/prefect-alternatives) — Python-first orchestration compared with a YAML-first approach.

For a side-by-side view across the field, the [Kestra vs. Alternatives](/vs) hub collects the head-to-head comparisons in one place.

## Building Reliable Data Pipelines with Kestra: Best Practices

A simple data pipeline is easy to build; one that stays reliable, scalable, and maintainable is hard. An orchestration platform like Kestra gives you a framework for the practices that keep pipelines healthy.

### Design for scalability, reliability, and GitOps with declarative YAML

Modern data pipelines should be treated as code. Kestra's declarative YAML interface lets you define an entire workflow in simple, version-controllable files. This GitOps approach enables peer review, automated testing, and dependable deployments. Acxiom, a leader in customer intelligence, modernized its Big Data orchestration by integrating Kestra with its existing DevOps and GitOps practices. The same declarative model is why Apple's ML team replaced Airflow with Kestra to orchestrate large-scale ETL pipelines.

### Monitoring, error handling, and lineage

A pipeline is only as good as its handling of failure. Kestra provides a visual interface to monitor every execution, with detailed logs, built-in retries, and alerting on failure. Kestra's Assets add automated data lineage, so you can see how data flows and transforms across pipelines. That visibility matters for debugging and governance, as detailed in our guide to how [Kestra's Assets give you complete pipeline lineage](/blogs/2026-01-26-data-assets-use-cases).

### Security and governance

Data pipelines often handle sensitive information, so security cannot be an afterthought. Kestra includes secrets management to protect credentials and API keys. The Enterprise Edition adds Role-Based Access Control (RBAC) and detailed audit logs, which matter for compliance in regulated industries like finance. That governance foundation is what enables secure [banking data pipeline automation](/resources/data/banking-data-pipeline-automation).

## Unified Orchestration Across Data, AI, and Infrastructure

As organizations mature, the lines between data, infrastructure, and AI workflows blur. The next step for data pipelines is a unified control plane that manages all of these from one platform. This is where Kestra fits, with a language-agnostic, declarative framework that reaches beyond traditional data tasks.

Leroy Merlin France used Kestra to enable Data Mesh at scale, increasing data production by 900%. JPMorgan Chase uses it for cybersecurity analytics orchestration, processing billions of rows securely. These cases show that a capable orchestration layer is the key to getting full value from an organization's data. By adopting a platform that handles diverse workloads, teams can [automate data pipelines](/resources/data/automate-data-pipeline) more effectively and build a scalable foundation for what comes next. As the orchestration landscape shifts, Kestra holds up well against the [top Dagster alternatives](/resources/data/dagster-alternatives) and the wider field.

To start building your own reliable data flows, explore Kestra's [declarative orchestration for modern data engineers](/data).
