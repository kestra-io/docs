---
title: "ETL Workflow: How to Design, Orchestrate, and Scale Data Integration"
description: "ETL workflows are more than the three-letter acronym. Learn how to design, orchestrate, and operate production-grade ETL with modern declarative tools."
metaTitle: "ETL Workflow: Design, Orchestrate, and Scale | Kestra"
metaDescription: "Design, orchestrate, and operate production ETL workflows: loading a data warehouse, ETL vs ELT trade-offs, and declarative orchestration with Kestra."
tag: data
date: 2026-04-22
lastUpdated: 2026-10-26
faq:
  - question: "What is an ETL workflow as distinct from an ETL pipeline?"
    answer: "An ETL pipeline refers to the specific code or scripts that perform the extract, transform, and load operations on data. An ETL workflow, however, is the orchestrated system that manages, schedules, monitors, and ensures the reliable execution of one or more ETL pipelines in a production environment. It encompasses the entire operational lifecycle."
  - question: "What are the main stages of the ETL process?"
    answer: "The canonical stages are Extract (collecting data from sources), Transform (cleaning, structuring, and enriching data), and Load (delivering data to a destination). In modern production workflows, these are often expanded to include additional critical stages like Cleansing, Validation, and Monitoring to ensure data quality and operational health."
  - question: "How does ETL compare to ELT?"
    answer: "ETL (Extract, Transform, Load) performs transformations before data is loaded into the target system, often useful for sensitive data or pre-processing. ELT (Extract, Load, Transform) loads raw data directly into a data warehouse first, then transforms it using the warehouse's compute power. ELT is favored by modern data warehouses for its flexibility and ability to retain raw data, while ETL remains relevant for specific use cases."
  - question: "What are common challenges in operating ETL workflows?"
    answer: "Common challenges include ensuring reliable scheduling and execution, implementing robust error handling and retry mechanisms, managing backfills and ensuring data idempotency, providing comprehensive observability and alerting for failures or data quality issues, and versioning workflows to enable easy rollbacks and collaboration."
  - question: "How do modern ETL workflows integrate with tools like dbt and Airbyte?"
    answer: "Modern ETL workflows often use specialized tools for different stages. Airbyte (or Fivetran) can handle the 'Extract' and 'Load' phases, synchronizing data from various sources to a data warehouse. dbt (data build tool) is then commonly used for the 'Transform' stage, allowing data teams to build, test, and document transformations in SQL. An orchestration tool then coordinates the execution of these separate tools into a cohesive workflow."
  - question: "What are the four main types of workflow patterns?"
    answer: "Workflows can generally be categorized by their execution logic: Sequential workflows execute tasks one after another; Parallel workflows run multiple tasks concurrently; Conditional workflows use logic to determine which tasks run based on outcomes; and Event-driven workflows are triggered by external events rather than fixed schedules."
  - question: "What is ETL in data warehousing?"
    answer: "ETL in data warehousing is the process that pulls data from operational systems, reshapes it to the warehouse schema, and loads it on a schedule, so analysts query one consistent copy instead of a dozen source systems. For example, orders from Postgres, customers from a CRM API, and payments from a billing API are conformed to shared keys and loaded into fact and dimension tables that a BI tool reads. In the ELT variant, the raw data lands in the warehouse first and the same reshaping runs there in SQL."
  - question: "What are the benefits of ETL for data warehouses?"
    answer: "Three benefits matter most: consistency, history, and query speed. Consistency comes from conforming values and keys across sources, so 'USA' and 'United States' count as one country. History comes from loading snapshots or change records over time, which operational systems usually overwrite. Query speed comes from modeling data into star schemas or aggregates before analysts touch it. Together they let a dashboard answer 'how did revenue by region change since last year' without anyone joining raw exports by hand."
---

"ETL" is a three-letter acronym that underpins nearly every data stack, but a robust **ETL workflow** is far more complex than just "extract, transform, load." It involves intricate scheduling, robust error handling, version control, and comprehensive observability. Many teams grapple with legacy ETL systems that are brittle, hard to debug, and struggle to scale.

This article cuts through the marketing fluff to explore how senior data engineers design, orchestrate, and operate production-grade ETL in 2026. We'll look at the architectural patterns that endure, the trade-offs between ETL and ELT, and how declarative orchestration can simplify the most challenging aspects of data integration.

## ETL Beyond the Acronym: What a Workflow Truly Means

The term "ETL" is often used loosely, leading to confusion. To build reliable systems, it's critical to distinguish between three related concepts:

-   **ETL (The Concept):** This is the data integration *pattern* of Extracting data from a source, Transforming it into a desired format or structure, and Loading it into a destination system. It's a strategic approach.
-   **ETL Pipeline (The Implementation):** This is the code that executes the ETL pattern. It could be a set of Python scripts, SQL queries, or Spark jobs. This is the "what"—the specific logic that moves and changes data.
-   **ETL Workflow (The Orchestration):** This is the system that manages the execution of one or more ETL pipelines. It handles scheduling, dependencies, retries, monitoring, and alerting. The workflow is the "how"—the operational layer that turns a simple script into a reliable, production-grade process.

Focusing only on the pipeline code is a common mistake. A robust ETL strategy depends on a well-designed workflow that provides reliability and visibility, moving beyond simple [data orchestration for analytics](/blogs/data-orchestration-beyond-analytics) to encompass the full operational lifecycle.

## The Stages of a Production-Grade ETL Workflow

While "Extract, Transform, Load" provides a neat summary, production workflows include several more implicit stages that are essential for data quality and operational stability.

### Extract: Sourcing Data Reliably

The first step is to pull data from its source. This isn't just a simple read operation. Production systems must handle:
-   **Connectivity:** Securely connecting to a variety of sources, from relational databases and REST APIs to file systems like S3 or FTP servers.
-   **Loading Strategy:** Deciding between full loads (copying the entire dataset) and incremental loads (capturing only changes since the last run). Incremental loads, often using [Change Data Capture (CDC)](/resources/data/change-data-capture) techniques, are more efficient for large datasets.
-   **Data Contracts:** Ensuring the source data schema hasn't changed unexpectedly, which could break downstream transformations.

### Transform & Cleanse: Shaping Data for Value

This is where the raw data becomes useful. The transformation stage is often the most complex and can involve multiple sub-steps:
-   **Cleansing:** Handling null values, correcting data types, and removing duplicates.
-   **Enrichment:** Joining data with other datasets to add context or new attributes.
-   **Business Logic:** Applying calculations, aggregations, or custom rules to meet business requirements.
-   **Structuring:** Reshaping the data, such as pivoting or unpivoting, to fit the schema of the target data warehouse.

Tools like dbt are frequently used for SQL-based transformations, while Apache Spark is a common choice for processing very large datasets in a distributed manner.

### Load: Delivering to the Destination

Once transformed, the data is loaded into its final destination. Key considerations here include:
-   **Target System:** This could be a cloud data warehouse like Snowflake or BigQuery, a data lake, or another operational application.
-   **Loading Pattern:** Data can be appended, overwritten, or upserted (updating existing records and inserting new ones).
-   **Idempotency:** Ensuring that running the same load process multiple times with the same data produces the exact same result. This is critical for recovery after a failure.

### Validate & Monitor: Ensuring Data Quality and Health

These stages run throughout the workflow and are what separate hobby projects from enterprise systems.
-   **Validation:** Running checks before and after loading to ensure data quality. This could be as simple as checking row counts or as complex as running statistical tests for anomalies.
-   **Monitoring:** Tracking the health of the workflow itself. Are jobs running on time? Are there performance bottlenecks? Are failure rates increasing? This is where observability and alerting become crucial.

## ETL vs. ELT: Choosing the Right Data Integration Pattern

A common alternative to ETL is ELT (Extract, Load, Transform). In this pattern, raw data is loaded directly into the data warehouse first, and all transformations happen *inside* the warehouse using its powerful SQL engine.

Neither pattern is universally better; they serve different needs.

| Aspect | ETL (Extract, Transform, Load) | ELT (Extract, Load, Transform) |
| --- | --- | --- |
| **Transformation Location** | In a separate processing engine (e.g., Spark, Python script) before loading. | Inside the target data warehouse using its compute resources. |
| **Data in Warehouse** | Only clean, transformed data is stored. | Raw, untransformed data is available alongside transformed models. |
| **Use Cases** | Good for sensitive data (PII can be removed before loading), complex pre-processing, or when the target system has limited compute power. | Ideal for modern cloud data warehouses, agile development (analysts can transform raw data themselves), and situations where future use cases for raw data are unknown. |
| **Tooling** | Requires a distinct transformation tool or custom code. | Leverages the data warehouse's SQL engine, often managed with a tool like dbt. |

The choice is strategic. ETL is still highly relevant for compliance and performance reasons, while ELT offers greater flexibility for modern analytics. For a deeper dive, see our comparison of [ETL vs. ELT](/resources/data/etl-vs-elt).

## ETL for the Data Warehouse

A data warehouse changes what the workflow has to guarantee. The target is no longer a file or a single application: it is the shared, historical record that every dashboard and model reads, so a bad load surfaces in every downstream report at once.

### What warehouse loads add to the pattern

Three requirements set warehouse ETL apart from moving data between two systems:

-   Conformed data. Customers from the CRM, orders from Postgres, and payments from a billing API need shared keys and shared values ("USA" and "United States" become one country) before they can be joined. Most warehouse business logic lives in this conforming step.
-   History. Operational systems overwrite rows; the warehouse is expected to keep them. That rules out a blind full refresh on most tables. Facts are appended or merged on a key, and dimensions that change over time, such as a customer's region or a product's price, are versioned as slowly changing dimensions so last year's report still adds up.
-   Query-ready models. BI tools read fact and dimension tables in a [star schema](/resources/data/star-schema) or pre-aggregated marts, not raw source tables. A load is not finished when the rows arrive. It is finished when the models analysts query are rebuilt and checked.

### In-warehouse ELT: load raw, transform with SQL

Cloud warehouses made it practical to move the transformation step inside the warehouse. The pattern has three layers:

1.  Land raw. Source data lands unchanged in a raw schema, usually through the warehouse's own bulk loader: `COPY INTO` from a stage in Snowflake, load jobs from Cloud Storage in BigQuery, `COPY` from S3 in Redshift. External tables go one step further and let the warehouse query files in object storage before anything is loaded.
2.  Stage. SQL models fix types, rename columns, and deduplicate, one model per source table.
3.  Model. Joins, business rules, and aggregates produce the marts BI tools read, the same raw, cleaned, and business-ready progression as a [medallion architecture](/resources/data/medallion-architecture).

The transformations run on warehouse compute, usually as dbt models or SQL scripts kept in Git. Because the raw layer is kept, a bug in a model is fixed by changing the SQL and rebuilding, not by re-extracting from the source.

ELT moves where transformations run. It does not remove the need for orchestration. Something still has to start the load when the source is ready, run models in dependency order, test row counts and freshness before analysts see the data, and stop a failed load from publishing a half-built mart. Warehouse compute is also billed by usage, so incremental models and a schedule matched to how fresh the data actually needs to be keep the bill predictable (see [dbt orchestration](/resources/data/dbt-orchestration) for running dbt inside a wider workflow).

Transform before the warehouse when data should never land raw: PII that must be masked for compliance, binary or deeply nested formats that SQL handles poorly, or heavy processing better suited to Spark or Python than to warehouse credits.

## Operational Challenges of Scaling ETL Workflows

Building an ETL script that works once is easy. Building an ETL workflow that runs reliably every day for years is hard. As you scale, you'll inevitably face these operational hurdles:

-   **Scheduling & Triggers:** Simple cron schedules are a starting point, but production systems need more. Event-driven triggers—such as a new file arriving in S3, an API webhook, or the completion of an upstream workflow—are essential for creating responsive and efficient data systems.
-   **Error Handling & Retries:** What happens when a network connection drops or an API returns a `503` error? A robust workflow needs automatic retries with configurable backoff strategies and dead-letter queues to handle unrecoverable failures gracefully.
-   **Backfills & Idempotency:** You will eventually need to re-process historical data. Your workflow must be idempotent to handle this without creating duplicate records or corrupting state.
-   **Observability & Alerting:** When a workflow fails at 3 AM, you need more than just a failure status. You need detailed logs, performance metrics, data lineage, and proactive alerts that tell you *why* it failed.
-   **Versioning & Rollbacks:** ETL logic changes. Workflows must be version-controlled (ideally in Git) so that you can see a history of changes, review new proposals, and quickly roll back to a previous version if a deployment goes wrong.
-   **Resource Management:** A transformation job might need significant CPU and memory for a short period. A scalable workflow system must manage these compute resources efficiently, provisioning them on-demand and releasing them when done.

## Modern ETL with Declarative Orchestration

Addressing these operational challenges is the core job of a [data orchestration](/resources/data/data-orchestration) platform. The modern approach favors declarative orchestration, where you define the *what* (the desired state of your workflow) in a configuration file, and the engine handles the *how*.

### Why Declarative YAML for ETL Workflows?

Defining workflows in a declarative format like YAML, as opposed to a general-purpose programming language like Python, offers significant operational advantages:
-   **Reviewability:** A YAML file is a simple data structure. A `git diff` is unambiguous, making code reviews faster and safer. You can see exactly what changed—a timeout, a new task, a different schedule—without having to mentally execute code.
-   **Simplified Rollbacks:** A bad deployment is a `git revert` away. There's no complex application state to manage.
-   **Language-Agnosticism:** The orchestration layer is separate from the execution layer. Your ETL workflow can seamlessly orchestrate tasks written in SQL, Python, R, Shell, or any other language, allowing teams to use the best tool for each job.
-   **Separation of Concerns:** Business logic (the Python or SQL script) is kept separate from orchestration logic (the YAML file). This makes both easier to manage, test, and maintain.

### Integrating with the Modern Data Stack

A declarative orchestrator acts as the central nervous system for the modern data stack. Instead of building a monolithic ETL application, you can compose a workflow from best-in-class tools:
-   **Extract & Load:** Use a connector-based tool like Airbyte or Fivetran.
-   **Transform:** Use dbt to manage SQL-based transformations.
-   **Orchestrate:** Use Kestra to trigger the Airbyte sync, wait for it to complete, run the dbt models, and then run data quality checks, all in one coordinated workflow.

This modular approach, exemplified in blueprints like the [Airbyte Cloud and dbt Core integration](/blueprints/airbyte-cloud-dbt), allows each component to be updated independently and makes the entire system more resilient.

### Kestra for Production ETL Workflows

Kestra is an open-source, declarative orchestration platform designed to solve these modern ETL challenges. It allows [data engineers](/use-cases/data-engineers) to define complex, resilient workflows as simple YAML files.
-   **YAML-Defined Flows:** Kestra's core is declarative. Every workflow is a YAML file, enabling GitOps practices for all your data processes.
-   **Polyglot Tasks:** With a vast library of plugins, you can run anything from a shell command or Python script to a dbt model or Spark job as a native task.
-   **Event-Driven Triggers:** Kestra has built-in triggers for schedules, webhooks, file detection, and more, making it easy to build reactive ETL workflows.

By combining a declarative interface with a powerful, language-agnostic execution engine, Kestra provides a robust foundation for building and scaling [ETL pipelines](/docs/how-to-guides/etl-pipelines) across your entire organization. To explore more patterns and solutions, browse our [ETL pipeline tools guide](/resources/data/etl-pipeline-tools), the full [data resources](/resources/data) collection, or learn how Kestra can power your [data platform](/data).

### Example: An Opinionated Kestra ETL Workflow

Here's what a simple ETL workflow—extracting from Postgres, transforming with Python, and loading to S3—looks like in Kestra:

```yaml
id: postgres-etl-to-s3
namespace: company.team.production

description: Extracts new user data from Postgres, performs a simple transformation, and uploads it as a CSV to S3.

tasks:
  - id: extract_from_postgres
    type: io.kestra.plugin.jdbc.postgresql.Query
    sql: "SELECT user_id, email, signup_date FROM users WHERE signup_date >= '{{ trigger.date }}';"
    fetchType: STORE # Stores the result in Kestra's internal storage

  - id: to_csv
    type: io.kestra.plugin.serdes.csv.IonToCsv
    from: "{{ outputs.extract_from_postgres.uri }}"

  - id: transform_with_python
    type: io.kestra.plugin.scripts.python.Script
    containerImage: ghcr.io/kestra-io/pydata:latest
    inputFiles:
      data.csv: "{{ outputs.to_csv.uri }}"
    outputFiles:
      - transformed_users.csv
    script: |
      import pandas as pd

      df = pd.read_csv('data.csv')
      df['signup_year'] = pd.to_datetime(df['signup_date']).dt.year
      df.to_csv('transformed_users.csv', index=False)

  - id: load_to_s3
    type: io.kestra.plugin.aws.s3.Upload
    from: "{{ outputs.transform_with_python.outputFiles['transformed_users.csv'] }}"
    bucket: my-data-bucket
    key: "processed/users/{{ execution.startDate | date('yyyy-MM-dd') }}.csv"

triggers:
  - id: daily_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 5 * * *" # Runs daily at 5 AM UTC
```

This single YAML file defines the entire workflow, including its schedule, dependencies between tasks, and how data flows from one step to the next.

### Example: In-Warehouse ELT into Snowflake

The same model applies to the warehouse pattern described above. This flow lands a daily export in a raw Snowflake table, then lets the warehouse do the transformation:

```yaml
id: orders-elt-snowflake
namespace: company.team

description: Lands a daily orders export in Snowflake, then merges it into the modeled fact table inside the warehouse.

tasks:
  - id: extract_orders
    type: io.kestra.plugin.core.http.Download
    uri: https://api.example.com/exports/orders.csv

  - id: land_raw
    type: io.kestra.plugin.jdbc.snowflake.Upload
    url: "{{ secret('SNOWFLAKE_URL') }}"
    username: "{{ secret('SNOWFLAKE_USERNAME') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    from: "{{ outputs.extract_orders.uri }}"
    stageName: "@ANALYTICS.RAW.%ORDERS"
    prefix: "{{ trigger.date ?? execution.startDate | date('yyyy-MM-dd') }}"
    fileName: orders.csv

  - id: transform_in_warehouse
    type: io.kestra.plugin.jdbc.snowflake.Queries
    url: "{{ secret('SNOWFLAKE_URL') }}"
    username: "{{ secret('SNOWFLAKE_USERNAME') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    transaction: true
    sql: |
      COPY INTO ANALYTICS.RAW.ORDERS
        FROM @ANALYTICS.RAW.%ORDERS
        FILE_FORMAT = (TYPE = CSV SKIP_HEADER = 1);
      MERGE INTO ANALYTICS.MARTS.FCT_ORDERS AS t
        USING (
          SELECT * FROM ANALYTICS.RAW.ORDERS
          QUALIFY ROW_NUMBER() OVER (PARTITION BY ORDER_ID ORDER BY UPDATED_AT DESC) = 1
        ) AS s
        ON t.ORDER_ID = s.ORDER_ID
        WHEN MATCHED THEN UPDATE SET t.STATUS = s.STATUS, t.AMOUNT = s.AMOUNT, t.UPDATED_AT = s.UPDATED_AT
        WHEN NOT MATCHED THEN INSERT (ORDER_ID, STATUS, AMOUNT, UPDATED_AT)
          VALUES (s.ORDER_ID, s.STATUS, s.AMOUNT, s.UPDATED_AT);

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 4 * * *"
```

The raw table is append-only, so history stays queryable. The `QUALIFY` clause keeps the latest version of each order, and the `MERGE` is keyed on `ORDER_ID`, so rerunning or backfilling a day updates rows instead of duplicating them. `COPY` and `MERGE` run in one transaction: if the merge fails, the batch rolls back and the fact table is never left half-updated.
