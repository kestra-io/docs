---
title: "Medallion Architecture: Structuring Your Lakehouse Data"
description: "The Medallion Architecture organizes data into Bronze, Silver, and Gold layers, ensuring progressive quality and refinement in your data lakehouse. Learn how to implement and orchestrate it for robust data pipelines."
metaTitle: "Medallion Architecture for Data Lakehouses | Kestra"
metaDescription: "Medallion Architecture structures lakehouse data into Bronze, Silver, Gold layers. Learn its benefits, challenges, and how to build reliable data pipelines."
tag: "data"
date: 2026-07-15
slug: "medallion-architecture"
faq:
  - question: "What is the Medallion Architecture?"
    answer: "The Medallion Architecture is a data design pattern for data lakehouses, organizing data into three progressively refined layers: Bronze (raw), Silver (cleaned and conformed), and Gold (aggregated for consumption). It enhances data quality, governance, and analytics readiness."
  - question: "Is the Medallion Architecture ETL or ELT?"
    answer: "The Medallion Architecture is designed to align with ELT (Extract, Load, Transform) principles. Data is first loaded raw into the Bronze layer, then progressively transformed in subsequent Silver and Gold layers, making transformations happen *after* initial loading."
  - question: "What is the issue with Medallion Architecture?"
    answer: "Common issues include increased complexity if not managed well, potential for data quality problems to propagate if validation is insufficient, and the overhead of maintaining multiple layers. It requires careful design and robust orchestration to be effective."
  - question: "Does Snowflake use Medallion Architecture?"
    answer: "While Medallion Architecture is often associated with data lakehouses (like Databricks), its principles of progressive data refinement can be applied to any data platform, including Snowflake. Snowflake's architecture supports similar layering for data quality and access control."
  - question: "How does Medallion Architecture improve data governance?"
    answer: "By segregating data into distinct layers based on quality and purpose, Medallion Architecture simplifies data governance. Each layer can have specific access controls, data quality rules, and audit trails, making it easier to manage compliance and ensure data integrity."
  - question: "What is the difference between the Silver and Gold layers?"
    answer: "The Silver layer contains cleaned, conformed, and semi-processed data, often denormalized. The Gold layer further aggregates and transforms this data into highly refined, domain-specific datasets optimized for business intelligence, analytics, and machine learning consumption."
---

> **TL;DR** — The Medallion Architecture is a data design pattern for lakehouses, organizing data into three progressively refined layers: Bronze (raw), Silver (cleaned and conformed), and Gold (aggregated for consumption). It enhances data quality, governance, and analytics readiness.

Data lakes promise flexibility, but without structure, they quickly become data swamps. This is the core challenge many organizations face: how to manage vast amounts of raw data while ensuring it remains reliable, governed, and ready for consumption by various teams. The Medallion Architecture offers a robust solution to this dilemma.

This article will explore the Medallion Architecture, detailing its three layers—Bronze, Silver, and Gold—and explaining how each contributes to progressive data refinement. We'll delve into its benefits, address common criticisms, and demonstrate how Kestra can orchestrate the complex pipelines required to implement this powerful data design pattern effectively.

## How Medallion Architecture Structures Your Data Lakehouse

The Medallion Architecture is a data design pattern that logically organizes data within a [data lakehouse](/resources/data/lakehouse-architecture). Its primary goal is to incrementally improve the quality, reliability, and usability of data as it flows through the system. This is achieved by structuring data into three distinct layers, or "medals": Bronze, Silver, and Gold.

The core principles of this architecture are:
- **Progressive Refinement**: Data is ingested in its rawest form and is progressively cleaned, transformed, and aggregated as it moves through the layers.
- **Data Quality as a Priority**: Each layer transition represents an opportunity to validate, clean, and enrich the data, ensuring that downstream consumers receive high-quality, reliable information.
- **Support for Diverse Workloads**: The multi-layered approach caters to a wide range of use cases, from raw data exploration for data scientists to aggregated business intelligence for analysts.
- **Improved Governance**: By segregating data based on its quality and state, organizations can implement more granular access controls and audit trails.

This structured approach transforms a potentially chaotic data lake into a well-organized, reliable asset, forming the backbone of a modern [data pipeline](/resources/data/data-pipeline).

## The Three Layers of Medallion Architecture Explained

The architecture's strength lies in the clear separation of concerns between its three layers. Each layer has a specific purpose and set of characteristics.

### The Bronze Layer: Raw, Immutable Ingestion

The Bronze layer, often called the "raw" layer, is the initial landing zone for all data ingested from source systems. Its defining characteristics are:
- **Raw**: Data is stored as-is, with no cleaning or transformation applied. The structure of the data mirrors the source system.
- **Immutable**: Once written, data in the Bronze layer is never altered. This creates an auditable, historical archive.
- **Append-Only**: New data is added, but existing data is not updated. This preserves the history of changes from the source.

The primary role of the Bronze layer is to provide a durable, long-term record of all source data, enabling replayability and recovery without needing to re-query the source systems.

### The Silver Layer: Cleaned, Conformed, and Integrated

The Silver layer, or "conformed" layer, is where the data begins to take on business value. Data from the Bronze layer is processed and refined to create a more structured and reliable dataset. Key characteristics include:
- **Validated and Cleaned**: Data is filtered, cleansed of inconsistencies, and validated against quality rules. Missing values are handled, and data types are standardized.
- **Conformed and Integrated**: Data from various sources is often joined and conformed into a common model, creating a single source of truth for key business entities (e.g., customers, products).
- **Semi-Processed**: The data is more structured than Bronze but not yet fully aggregated for specific use cases.

This layer serves as the foundation for most ad-hoc querying, data exploration, and as a source for the final Gold layer.

### The Gold Layer: Refined, Aggregated, and Consumption-Ready

The Gold layer, or "curated" layer, represents the highest level of data refinement. It contains data that is highly processed, aggregated, and optimized for specific business needs. Its characteristics are:
- **Highly Refined**: Data is aggregated and transformed into specific data models, such as star schemas or denormalized tables.
- **Domain-Specific**: Datasets are often organized by business subject area (e.g., sales, marketing, finance).
- **Consumption-Ready**: The data is optimized for performance and is directly consumable by BI tools, analytics applications, and machine learning models.

The Gold layer provides business users and applications with clean, reliable, and easily accessible data to drive insights and decisions.

## Why Medallion Architecture Needs Robust Orchestration

Implementing a Medallion Architecture involves more than just creating three storage locations. It requires a sophisticated orchestration engine to manage the flow of data between layers. At scale, this is where enterprises like Apple, with hundreds of AI engineers, and JPMorgan Chase, processing billions of rows for cybersecurity, rely on a central orchestration layer. Robust orchestration is critical for:

- **Ensuring Data Quality**: Orchestration tools can enforce [data quality](/resources/data/data-quality) checks and validation rules at each layer transition, preventing bad data from propagating downstream.
- **Managing Complex Dependencies**: A typical Medallion pipeline involves multiple transformation steps with complex dependencies. An orchestrator ensures tasks run in the correct order and handles parallel execution.
- **Implementing Error Handling and Recovery**: When a transformation fails, the orchestrator can trigger alerts, retry the task, or execute a predefined recovery workflow, ensuring pipeline resilience.
- **Maintaining Data Lineage and Auditability**: A central orchestration platform provides a clear audit trail of all data movements and transformations, which is essential for compliance and debugging.
- **Orchestrating ELT Processes**: The architecture naturally aligns with ELT, and an orchestrator manages the entire process, from loading raw data to triggering transformations within the data platform.

Without a powerful orchestration tool, managing a Medallion Architecture can become a complex and error-prone manual process. Check out the [Kestra concepts](/docs/concepts) to learn more about orchestration primitives.

## Orchestrate Medallion Pipelines with Kestra: A Bronze-to-Silver Scenario

The following Kestra flow demonstrates a practical example of orchestrating a data pipeline from the Bronze to the Silver layer. This workflow simulates ingesting raw data, applying cleaning and transformation logic, performing a quality check, and notifying on failure.

```yaml
id: medallion_bronze_to_silver
namespace: company.data.medallion

description: Orchestrates a data pipeline from a raw (Bronze) layer to a cleaned (Silver) layer.
  Includes ingestion, transformation, and error handling.

inputs:
  - id: source_data_path
    type: STRING
    defaults: "s3://my-raw-bucket/landing/{{trigger.date | date('YYYY/MM/DD')}}/raw_data.csv"
  - id: target_silver_path
    type: STRING
    defaults: "s3://my-silver-bucket/cleaned/{{trigger.date | date('YYYY/MM/DD')}}/cleaned_data.parquet"

tasks:
  - id: bronze_ingest
    type: io.kestra.plugin.scripts.python.Script
    description: Ingests raw data into the Bronze layer (simulated).
    runner: DOCKER
    docker:
      image: python:3.10-slim-buster
    script: |
      import pandas as pd
      import os
      # Simulate reading from a raw source (e.g., S3)
      # In a real scenario, this would use an S3 plugin or direct S3 read
      print(f"Simulating ingestion from {{inputs.source_data_path}}")
      raw_data = pd.DataFrame({'id': [1, 2, 3], 'name': ['Alice ', 'Bob', 'Charlie'], 'value': ['100', '200', 'invalid']})
      raw_data.to_csv("{{outputDir}}/bronze_data.csv", index=False)
      print(f"Raw data ingested to {{outputDir}}/bronze_data.csv")

  - id: silver_transform
    type: io.kestra.plugin.scripts.python.Script
    description: Cleans and transforms data from Bronze to Silver layer.
    runner: DOCKER
    docker:
      image: python:3.10-slim-buster
    inputFiles:
      bronze_data.csv: "{{outputs.bronze_ingest.outputFiles['bronze_data.csv']}}"
    script: |
      import pandas as pd
      import os

      df_bronze = pd.read_csv("bronze_data.csv")
      print("Bronze data loaded:")
      print(df_bronze)

      # Simulate cleaning: strip whitespace, convert value to numeric, handle errors
      df_silver = df_bronze.copy()
      df_silver['name'] = df_silver['name'].str.strip()
      df_silver['value'] = pd.to_numeric(df_silver['value'], errors='coerce') # Coerce errors to NaN
      df_silver = df_silver.dropna(subset=['value']) # Drop rows with invalid 'value'

      print("Silver data transformed:")
      print(df_silver)

      df_silver.to_parquet("{{outputDir}}/silver_data.parquet", index=False)
      print(f"Silver data written to {{outputDir}}/silver_data.parquet")

  - id: silver_quality_check
    type: io.kestra.plugin.scripts.shell.Commands
    description: Performs a basic data quality check on the Silver layer.
    runner: DOCKER
    docker:
      image: busybox
    inputFiles:
      silver_data.parquet: "{{outputs.silver_transform.outputFiles['silver_data.parquet']}}"
    commands:
      - 'parquet-tool inspect silver_data.parquet | grep "rows: 2"' # Expect 2 valid rows after cleaning
    onError:
      - id: notify_quality_failure
        type: io.kestra.plugin.notifications.slack.SlackSimpleMessage
        url: "{{ secret('SLACK_WEBHOOK_URL') }}"
        payload: |
          {
            "text": "🚨 Medallion Data Quality Alert! 🚨\nFlow `{{flow.id}}` failed quality checks for Silver layer.\nExecution URL: {{flow.executionUrl}}"
          }
  - id: upload_silver_to_lake
    type: io.kestra.plugin.scripts.shell.Commands
    description: Uploads the cleaned Silver data to the target lakehouse path (simulated).
    runner: DOCKER
    docker:
      image: busybox
    commands:
      - 'echo "Simulating upload of {{outputs.silver_transform.outputFiles['silver_data.parquet']}} to {{inputs.target_silver_path}}"'
      - 'echo "Upload successful"'

triggers:
  - id: daily_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 2 * * *" # Every day at 2 AM
```

Key points to notice in this Kestra flow:
- **Declarative YAML**: The entire pipeline is defined in a clear, version-controlled YAML file, making it easy to understand and manage. See how Kestra's [declarative flows](/docs/concepts/flow) simplify pipeline creation.
- **Polyglot Execution**: The flow seamlessly combines Python for data manipulation and shell commands for a quick quality check, all within isolated Docker containers for consistency.
- **Built-in Error Handling**: The `onError` property on the quality check task automatically triggers a Slack notification if the check fails, ensuring immediate visibility into issues.
- **Automated Scheduling**: The `Schedule` trigger ensures this pipeline runs automatically every day, but it could just as easily be triggered by an event, such as a file landing in S3.
- **Data Passing**: Kestra's internal storage is used to pass the output of the `bronze_ingest` task as an input to the `silver_transform` task, simplifying data flow between steps. This is a core part of the [Kestra architecture](/docs/architecture).

For a real-world implementation, check out this blueprint for an [end-to-end Fabric orchestration](/blueprints/fabric-end-to-end-pipeline).

## Medallion Architecture: The ELT Approach

The Medallion Architecture inherently aligns with the principles of [ELT (Extract, Load, Transform)](/resources/data/etl-vs-elt). In this model:
- **Extract & Load**: Data is extracted from source systems and loaded directly into the Bronze layer with minimal processing. This step is fast and efficient, as it doesn't wait for complex transformations.
- **Transform**: Transformations occur within the data lakehouse as data moves from Bronze to Silver, and from Silver to Gold. This leverages the processing power of the modern data platform and provides flexibility.

This approach preserves the raw source data in the Bronze layer, allowing for schema-on-read flexibility and the ability to rebuild Silver and Gold layers from scratch if business logic changes.

## Addressing Common Challenges in Medallion Implementation

While powerful, the Medallion Architecture is not without its challenges. Effective implementation requires careful planning and the right tools.

### Managing Complexity and Data Governance

As the number of data sources and pipelines grows, a Medallion implementation can become complex. Without proper organization, it can be difficult to manage dependencies, track lineage, and enforce governance policies. Kestra helps manage this complexity through features like hierarchical namespaces for organizing flows and [Role-Based Access Control (RBAC)](/resources/infrastructure/rbac) to enforce security. For larger organizations, Kestra's [multi-tenancy architecture](/docs/architecture/multi-tenancy) provides strong isolation between teams.

### Ensuring Data Quality Across Layers

A common criticism is that if data quality is not rigorously managed, errors from the Bronze layer can propagate and even be amplified in the Silver and Gold layers. This highlights the need for robust validation at each stage. Kestra pipelines can integrate dedicated data quality tools (like dbt tests, Great Expectations, or Soda) as tasks within the flow, ensuring that data is validated before it's promoted to the next layer.

### Medallion Architecture on Diverse Platforms

The Medallion pattern is not limited to a single platform like Databricks. Its principles can be applied to any modern data platform, including Snowflake, Redshift, BigQuery, and Microsoft Fabric. Kestra's platform-agnostic nature makes it an ideal orchestrator for these environments, allowing you to build and manage Medallion pipelines regardless of the underlying data storage and processing engine. You can, for example, use Kestra to orchestrate [uploading data to Microsoft Fabric OneLake](/blueprints/fabric-onelake-upload).

## Where Medallion Architecture Pays Off

When implemented and orchestrated correctly, the Medallion Architecture provides significant value across the organization. It is foundational for:
- **Building reliable analytics and BI dashboards**: Gold layer data is clean and optimized for fast, accurate reporting.
- **Powering machine learning and AI applications**: Data scientists can access raw data in Bronze for feature engineering or use cleaned data in Silver to train models, as seen in complex [AI pipelines](/resources/ai/ai-pipeline).
- **Ensuring regulatory compliance and auditability**: The immutable Bronze layer and clear lineage provide a complete audit trail for compliance purposes.
- **Facilitating self-service data access**: Different user groups can be given access to the appropriate layer, empowering them to work with data safely and efficiently. This is a key component of effective [data observability](/resources/data/data-observability).

By structuring data with clear quality gates, organizations like Crédit Agricole have successfully replaced fragmented scripts with a single, reliable orchestration layer to power their critical operations.

## Related concepts
- [What Is Data Mesh Architecture? Principles & Examples](/resources/data/data-mesh-architecture)
- [Lakehouse Architecture: Principles & Benefits](/resources/data/lakehouse-architecture)
- [Data Pipeline Explained: Stages, Architecture, and Automation](/resources/data/data-pipeline)
- [Data Quality: Ensuring Trust in Your Data Pipelines](/resources/data/data-quality)
- [ETL vs. ELT: The Data Pipeline Showdown](/resources/data/etl-vs-elt)
- [Data Orchestration: The Engine of Modern Data Stacks](/resources/data/data-orchestration)
