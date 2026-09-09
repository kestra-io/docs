---
title: "Snowpipe: Automated Data Ingestion for Snowflake"
description: "Understand Snowpipe's role in continuous data loading for Snowflake, its key differences from Snowpipe Streaming, and how Kestra enhances these pipelines with advanced orchestration."
metaTitle: "Snowpipe: Automated Data Loading in Snowflake"
metaDescription: "Learn what Snowpipe is, how it automates data loading into Snowflake, how it compares to Snowpipe Streaming, and how to orchestrate it with Kestra."
tag: data
date: 2026-08-03
slug: "snowpipe"
faq:
  - question: "What is the purpose of Snowpipe?"
    answer: "Snowpipe is Snowflake's continuous data ingestion service, designed to load data from files into tables as soon as they become available in a stage. This allows for near real-time data availability by processing files in micro-batches, automating what would otherwise be manual COPY statements."
  - question: "Is Snowpipe part of Snowflake's ecosystem?"
    answer: "Yes, Snowpipe is an integral, serverless component of the Snowflake ecosystem. It works seamlessly with Snowflake stages (internal or external) and integrates with cloud messaging services like AWS SNS/SQS, Azure Event Grid, or GCP Pub/Sub to trigger automatic data loading upon file arrival."
  - question: "How much does Snowpipe cost?"
    answer: "Snowpipe's cost is based on the compute resources consumed during data loading, including file scanning, data transformation, and metadata management. There are no charges for idle time, only for active ingestion. Costs can vary significantly based on data volume, file size, and the complexity of transformations."
  - question: "What is a Snowpipe?"
    answer: "A Snowpipe refers to Snowflake's serverless data ingestion service that automates the loading of data files from cloud storage stages into Snowflake tables. It eliminates the need for manual data loading, making data available for querying within minutes of its arrival in a stage."
  - question: "What are the drawbacks of Snowpipe?"
    answer: "While efficient, Snowpipe can incur costs if not optimized, especially with many small files or inefficient file formats. It's primarily designed for batch/micro-batch file loading, not true real-time streaming (which is Snowpipe Streaming's domain). Complex transformations often require additional compute resources outside Snowpipe itself."
  - question: "How does Snowpipe compare to Snowpipe Streaming?"
    answer: "Snowpipe handles continuous micro-batch loading of files from stages, ideal for new file arrivals. Snowpipe Streaming, conversely, is for true real-time streaming, allowing applications to insert data directly into Snowflake tables as individual rows, bypassing stages and offering lower latency for high-velocity data."
---

> **TL;DR** — Snowpipe is Snowflake's serverless service for continuous data ingestion, automatically loading data files from cloud storage stages into Snowflake tables as soon as they become available. It enables near real-time data availability by automating micro-batch processing.

Automating data ingestion into Snowflake is a critical step for any modern data platform. While Snowflake's native capabilities, like Snowpipe, simplify getting data into your warehouse, they are just one piece of the puzzle. Real-world data pipelines demand more than just loading; they require robust transformations, comprehensive error handling, and end-to-end visibility.

This article will explore Snowpipe's role in continuous data loading and differentiate it from Snowpipe Streaming. We'll then demonstrate why a powerful orchestration layer, like Kestra, is essential to build resilient, cost-effective, and fully automated data pipelines around Snowflake's ingestion services.

## How Snowpipe Works: Automated Ingestion for Snowflake

Snowpipe automates the `COPY INTO <table>` command, traditionally used for bulk loading, by running it continuously as a serverless process. Instead of scheduling a warehouse to run a `COPY` command periodically, Snowpipe listens for new files in a specified stage and loads them automatically. This serverless model means you only pay for the compute used for active ingestion, not for idle time.

### The Role of Stages and Notifications

The process begins when new data files arrive in a Snowflake stage. A stage is a location, either internal to Snowflake or in external cloud storage like Amazon S3, Google Cloud Storage, or Azure Blob Storage, where data files are temporarily stored before being loaded.

To trigger the ingestion process automatically, Snowpipe relies on event notifications from the cloud storage provider. When a new file is created in a bucket, the storage service (e.g., S3) sends a notification to a messaging service (e.g., AWS SQS). Snowpipe subscribes to this queue, and upon receiving a message, it automatically copies the new file into the target Snowflake table. This event-driven approach ensures data is loaded within minutes of its arrival. [Using Kestra for Snowflake workflow orchestration](/blogs/kestra-over-snowpipe) can provide an additional layer of control and visibility over this process.

### Supported File Formats and Data Types

Snowpipe supports the same file formats and data types as the `COPY INTO` command. This includes structured formats like CSV and TSV, as well as semi-structured formats such as JSON, Avro, ORC, and Parquet. This flexibility allows data teams to ingest data from a wide variety of sources without needing to pre-process files into a specific format.

## Snowpipe vs. Snowpipe Streaming: Choosing the Right Approach

Snowflake offers two distinct services for continuous data ingestion: Snowpipe and Snowpipe Streaming. While both aim to make data available quickly, they serve different use cases and operate on different principles.

| Feature                 | Snowpipe                                                | Snowpipe Streaming                                          |
|-------------------------|---------------------------------------------------------|-------------------------------------------------------------|
| **Latency**             | Minutes (micro-batch)                                   | Seconds (real-time)                                         |
| **Data Granularity**    | File-based                                              | Row-based                                                   |
| **Ingestion Method**    | `COPY INTO` from staged files                           | Direct insertion via Snowflake Ingest SDK                   |
| **File Staging**        | Required (S3, GCS, Azure Blob)                          | Not required; data is sent directly to Snowflake tables     |
| **Primary Use Case**    | Continuous loading of files from various sources        | High-throughput, low-latency streaming from applications    |
| **Pricing Model**       | Per-second compute usage for ingestion                  | Per-second compute usage + per-client data migration costs  |
| **Supported Data Types**| All formats supported by `COPY` command (CSV, JSON, etc.) | Rows of structured or semi-structured data via SDK        |

### When to use Snowpipe for continuous micro-batching

Snowpipe is the ideal choice when your data arrives as files in cloud storage. It excels at scenarios where multiple systems or services generate data files periodically throughout the day. Common examples include ingesting application logs, IoT sensor data, or transactional data from third-party services. If your data pipeline is already file-based, Snowpipe provides a simple and efficient way to automate ingestion.

### When to use Snowpipe Streaming for true real-time ingestion

Snowpipe Streaming is designed for true real-time data pipelines where data is generated continuously and needs to be available for querying in seconds. It's built for developers to integrate directly into applications using the Snowflake Ingest SDK. This approach bypasses the need for staging files, as data is sent as rows directly to Snowflake. Use Snowpipe Streaming for high-velocity event streams, such as clickstream data from websites, financial market data, or real-time application metrics. The choice between tools like [Databricks vs. Snowflake](/resources/data/databricks-vs-snowflake) often comes down to these fundamental architectural differences in data ingestion and processing.

## Why Data Ingestion Needs Orchestration Beyond Snowpipe

While Snowpipe effectively automates the loading step, a production-grade data pipeline involves much more. An external orchestration platform is necessary to manage the entire workflow lifecycle.

*   **Data Quality & Validation**: Snowpipe loads data as-is. A robust pipeline must perform validation checks post-ingestion to ensure data integrity, check for nulls, and enforce business rules before the data is consumed downstream.
*   **Complex Transformations**: Ingestion is rarely the final step. Data often needs to be cleaned, enriched, aggregated, or joined with other datasets. Orchestrating tools like dbt, Spark, or custom Python scripts after Snowpipe has loaded the raw data is a common requirement.
*   **Error Handling & Recovery**: What happens if a loaded file is corrupt or a transformation fails? An orchestration tool can implement advanced retry logic, route failed records to a dead-letter queue for analysis, and send alerts to the responsible team, providing resilience that Snowpipe alone does not offer.
*   **End-to-End Visibility & Governance**: Snowpipe provides visibility into the loading process, but a true [data orchestration](/resources/data/data-orchestration) platform offers a single pane of glass for the entire pipeline. This includes upstream data generation, the ingestion step, all downstream transformations, and final delivery to BI tools or applications.
*   **Cost Optimization**: Post-ingestion tasks, such as running transformations or cleaning up staging areas, consume compute resources. An orchestrator can manage these resources efficiently, for instance by using a smaller virtual warehouse for validation tasks and spinning it down when not in use, helping to control costs. Using the right [ETL pipeline tools](/resources/data/etl-pipeline-tools) is key to managing this complexity.

## Orchestrate Snowpipe with Kestra: Building a Robust Data Pipeline

Kestra can orchestrate the entire process around Snowpipe, triggering downstream workflows as soon as data is loaded. By listening to the same cloud notifications that trigger Snowpipe, Kestra can kick off a sequence of validation, transformation, and alerting tasks to create a fully automated and resilient pipeline.

The following example shows a Kestra flow that is triggered by an SQS message sent when a new file arrives. It then runs a Snowflake query to merge the new data, executes a Python script for data quality checks, and sends a Slack notification if any step fails.

```yaml
id: snowflake-post-ingestion-checks
namespace: company.team.data

description: A flow to validate and transform data in Snowflake after a Snowpipe load.

triggers:
  - id: on-new-file-in-s3
    type: io.kestra.plugin.aws.sqs.Trigger
    queueUrl: "https://sqs.us-east-1.amazonaws.com/0123456789/snowpipe-notifications"
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"

tasks:
  - id: merge-new-data
    type: io.kestra.plugin.jdbc.snowflake.Query
    url: "jdbc:snowflake://<account_name>.snowflakecomputing.com"
    username: "{{ secret('SNOWFLAKE_USER') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    warehouse: "TRANSFORM_WH"
    database: "RAW_DB"
    schema: "PUBLIC"
    sql: |
      MERGE INTO production.customers t
      USING staging.customers_new s
      ON t.customer_id = s.customer_id
      WHEN MATCHED THEN UPDATE SET t.last_seen = s.event_timestamp
      WHEN NOT MATCHED THEN INSERT (customer_id, first_seen, last_seen)
      VALUES (s.customer_id, s.event_timestamp, s.event_timestamp);

  - id: data-quality-check
    type: io.kestra.plugin.scripts.python.Script
    docker:
      image: "python:3.11"
    script: |
      # Example: A simple script to check for null customer_ids
      # In a real scenario, this would use a library like Great Expectations
      import pandas as pd
      # Assume a previous task extracted new data to a CSV
      df = pd.read_csv("{{ outputs['extract-new-data'].uri }}")
      if df['customer_id'].isnull().any():
          raise ValueError("Null customer_ids found in new data.")
      print("Data quality check passed.")

errors:
  - id: send-failure-alert
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {
        "text": "Snowflake post-ingestion pipeline failed on task `{{ task.id }}` with error: `{{ error.message }}`",
        "attachments": [
          {
            "color": "#d63333",
            "fields": [
              {
                "title": "Execution ID",
                "value": "<https://your-kestra-url/ui/executions/{{ execution.namespace }}/{{ execution.id }}|{{ execution.id }}>",
                "short": true
              }
            ]
          }
        ]
      }
```

A few things are worth noticing in this workflow:
- **Event-Driven Architecture**: The entire pipeline is triggered by an event from AWS SQS, ensuring that processing happens immediately after data arrival without any polling.
- **Integrated SQL Transformations**: The flow seamlessly connects to Snowflake to run complex SQL operations like `MERGE`, managing credentials securely.
- **Flexible Python Validation**: A Python script provides limitless flexibility for custom data validation logic, from simple checks to sophisticated tests using libraries like Great Expectations.
- **Built-in Error Handling**: The `errors` block automatically catches failures from any task and triggers a detailed notification, enabling rapid response and debugging.

By using a declarative platform like Kestra, you can manage your entire [data infrastructure](/data) as code, bringing version control, collaboration, and CI/CD practices to your data pipelines.

## Optimizing Snowpipe Workflows: Use Cases and Best Practices

To get the most out of Snowpipe, it's important to follow best practices for both performance and cost management.

### Common use cases for automated ingestion with Snowpipe
Snowpipe is well-suited for a variety of scenarios, including:
- **Log and Clickstream Data**: Continuously loading semi-structured log data from applications and web servers.
- **IoT Data**: Ingesting frequent, small batches of data from a large number of devices.
- **Transactional Data**: Loading data from operational databases (via CDC tools that output files) to feed analytics dashboards.

### Managing costs and performance
- **File Sizing**: Snowflake recommends aiming for file sizes between 100MB and 250MB. Ingesting a large number of very small files can lead to higher overhead and costs.
- **Compression**: Use compressed file formats like Gzip. Snowpipe can decompress files automatically during ingestion, reducing storage and data transfer costs.
- **Monitor Usage**: Regularly monitor Snowpipe's credit usage and ingestion history using Snowflake's built-in views to identify inefficiencies or unexpected costs.
- **Orchestrate Post-Load Tasks**: Use an orchestrator to manage compute-intensive tasks separately from ingestion, ensuring you use the right-sized warehouse for each job and improving overall [data quality](/resources/data/data-quality) and [data observability](/resources/data/data-observability).

## Related concepts
- [Data Pipeline: Components, Architecture and Best Practices](/resources/data/data-pipeline)
- [ETL vs. ELT: Key Differences and Use Cases](/resources/data/etl-vs-elt)
- [Snowflake Tasks Alternatives for Modern Data Orchestration](/resources/data/snowflake-tasks-alternatives)
- [dbt Integrations: Orchestrating Your Transformations](/resources/data/dbt-integrations)
- [Kestra Blog: Orchestration Insights & Product Updates](/blogs)
- [Infrastructure Automation from One Control Plane](/infra-automation)
