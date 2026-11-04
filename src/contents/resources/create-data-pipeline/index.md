---
title: "How to Create a Data Pipeline: A Step-by-Step Guide"
description: "Creating a data pipeline takes more than stitching scripts together. Learn what a data pipeline is, how it differs from ETL, the reference architecture, the five-step build process, and how to automate triggers, retries, testing, and monitoring in production."
metaTitle: "How to Create a Data Pipeline: Complete Guide | Kestra"
metaDescription: "Learn what a data pipeline is and how to create one: the three stages, a reference architecture, YAML examples, and how to automate retries, alerts, and tests."
tag: data
date: 2026-04-22
lastUpdated: 2026-10-26
faq:
  - question: "How do you build your own data pipeline?"
    answer: "Five steps: (1) define goals, consumers, and SLAs, (2) select data sources and ingestion patterns, (3) design transformation and storage, (4) choose the destination (warehouse, lake, operational system), and (5) orchestrate the flow with triggers, retries, and monitoring. The fifth step is where most first pipelines fail — without orchestration, a pipeline is just a collection of scripts."
  - question: "What are the main 3 stages in a data pipeline?"
    answer: "The three main stages are ingestion (extracting from sources), transformation (cleaning, joining, applying business logic), and loading (writing to the destination). ELT pipelines reverse the last two — load raw data first, transform inside the warehouse. ETL transforms before loading. Both are valid depending on compliance and cost constraints."
  - question: "What is creating data pipelines?"
    answer: "Creating a data pipeline means designing, building, and operating the automated chain that moves data from source to destination. It covers the extraction logic, the transformations, the loading strategy, and the orchestration that runs it all reliably — including scheduling, retries, failure handling, and observability."
  - question: "Is a data pipeline the same as ETL?"
    answer: "No. A data pipeline is any automated system that moves data from a source to a destination. ETL (Extract, Transform, Load) is one pattern a pipeline can follow, where data is transformed before it lands. The same pipeline category also covers ELT, CDC replication, streaming, and reverse ETL. Every ETL job is a data pipeline; a Kafka stream feeding a fraud model is a data pipeline that is not ETL."
  - question: "What does it mean to automate a data pipeline?"
    answer: "Automating a data pipeline means nobody has to start, watch, or rerun it by hand. A trigger (schedule, new file, webhook, or upstream completion) starts each run, failed tasks retry on their own when the failure is transient, alerts fire when a run fails or exceeds its SLA, and every execution keeps logs and history for debugging. If an engineer still restarts a job every Monday morning, the pipeline is scheduled, not automated."
  - question: "What is an example of a data pipeline?"
    answer: "A typical example: an e-commerce company ingests order events via CDC every 15 minutes, lands them in cloud storage, runs dbt models in Snowflake to join orders with customer and product dimensions, and pushes daily revenue metrics to a dashboard and Slack. That's a real pipeline with ingestion, transformation, loading, and orchestration all working together."
  - question: "Will ETL be replaced by AI?"
    answer: "No. AI is changing how pipelines are built and maintained — generating boilerplate, suggesting transformations, diagnosing failures faster — but it doesn't replace the need for extract-transform-load operations. Data still has to move from sources to destinations, and orchestration is still required to run that reliably."
  - question: "How long does it take to build a data pipeline?"
    answer: "A simple scheduled pipeline (one source, one destination, basic transforms) can be running in a few hours with modern tools like Airbyte plus dbt plus a YAML-based orchestrator. Production-grade pipelines with monitoring, lineage, alerting, and multi-environment deployment typically take one to three weeks to stabilize. Complexity scales with the number of sources and the freshness requirements."
---

Every analytics dashboard, machine learning model, and operational report depends on a data pipeline somewhere upstream. The question most teams face isn't *whether* to build one. It's how to build one that doesn't break at 3 a.m. and require an engineer to restart it manually.

Creating a data pipeline is more than writing a script that copies data from A to B. A production pipeline needs scheduling, retries, monitoring, lineage, and a way to recover when sources change shape. This guide covers the full process: what a data pipeline is and how it differs from ETL, the three stages it goes through, a reference architecture, the five-step build process, how to automate and test the result, and two YAML examples to anchor the theory.

## What Is a Data Pipeline?

A data pipeline is an automated sequence of steps that moves data from source systems, transforms it according to business rules, and loads it into a destination. The sources can be transactional databases, SaaS APIs, event streams, or files. The destination can be a warehouse, a lake, a feature store, or an operational system.

What separates a data pipeline from a one-off script is **repeatability**. A pipeline runs on a trigger (schedule, event, or dependency), handles failures without a human in the loop, and produces consistent output. The orchestration layer wrapping it is what turns a collection of steps into infrastructure you can trust in production.

Most pipelines share five building blocks:

- Sources: relational databases (Postgres, MySQL), SaaS APIs (Salesforce, HubSpot), object storage (S3, GCS), or streams (Kafka).
- [Ingestion](/resources/data/what-is-data-ingestion): the connectors and extraction logic that pull data out of each source.
- Processing: the engine that cleans, joins, and aggregates, whether dbt, Spark, or Python.
- Destination (or sink): the warehouse, lake, or application that receives the finished data.
- Orchestration: the control plane that schedules runs, enforces task order, retries failures, and records what happened.

### Upstream and downstream in a data pipeline

Data engineers describe dependencies by direction. **Upstream** is everything a step depends on: the source systems and the tasks that run before it. **Downstream** is everything that depends on a step: later transformations, the tables built from its output, and the dashboards, models, and reverse-ETL syncs that read them. A schema change in an upstream CRM table propagates downstream into every model and report built on it, which is why pipelines need dependency tracking and lineage, not just a list of jobs.

### Data pipeline vs workflow

A data pipeline describes the data-specific path: extract, transform, load. A workflow is the broader unit an orchestrator runs, and it can include steps that have nothing to do with moving data: provisioning infrastructure, waiting for a human approval, calling a microservice, or posting to an incident channel. A pipeline is often one part of a larger workflow, for example a nightly load followed by a Terraform scale-down and a Slack summary.

## Data Pipeline vs ETL: What's the Difference?

"Data pipeline" and "ETL" get used interchangeably, but they sit at different levels. A data pipeline is the general category: any automated process that moves data between systems. ETL (Extract, Transform, Load) is one specific pattern inside that category, where data is extracted, transformed in a staging area, and only then loaded into the destination.

All ETL processes are data pipelines; not all data pipelines are ETL. The other common patterns:

- ELT loads raw data first and transforms it inside the warehouse with its own compute. It is the default for cloud warehouses like Snowflake and BigQuery because raw data stays available for reprocessing.
- CDC replication streams row-level changes from a source database to a target, with little or no transformation in flight.
- Streaming pipelines process events continuously, in seconds rather than hours. "ETL vs streaming" is really a latency question: classic ETL runs in bounded batches, streaming never stops.
- Reverse ETL pushes modeled data from the warehouse back into operational tools such as a CRM.

ETL is not obsolete. It remains the right choice when data must be masked, hashed, or filtered *before* it reaches the warehouse, which is common for PII and regulated financial data. See [ETL vs ELT](/resources/data/etl-vs-elt) for a side-by-side comparison and [ETL pipeline tools](/resources/data/etl-pipeline-tools) for the tooling that supports both.

SQL fits inside this picture as a tool, not a pipeline. It does most of the transformation work (filtering, joining, aggregating, standardizing values), but it doesn't schedule itself, retry, or move data between systems. The pipeline is the assembly line; SQL is one of the machines on it.

## The Three Main Stages of a Data Pipeline

Whatever the pattern, the work breaks down into ingestion, transformation, and loading. ETL and ELT differ only in the order of the last two.

### Ingestion: Getting Data In

Ingestion pulls data out of source systems. The method depends on how fresh downstream consumers need the data:

- **Batch**: pull data on a schedule (hourly, daily). Good enough for most analytics, easy to reason about.
- **Change Data Capture (CDC)**: replicate database changes continuously using tools like Debezium or native connectors. See the [change data capture guide](/resources/data/change-data-capture) for a deeper look at log-based CDC patterns.
- **Event streaming**: consume from Kafka, Kinesis, or Pub/Sub when latency matters in seconds, not hours.
- **API polling**: pull from SaaS APIs on a schedule, handling pagination and rate limits.

Managed tools like Airbyte and Fivetran handle most ingestion patterns out of the box. Custom Python is still common for APIs with unusual auth or non-standard pagination.

### Transformation: Making Data Useful

Transformation reshapes raw data into something analytics-ready. Typical operations: deduplication, type casting, joining across sources, aggregating metrics, applying business rules, redacting sensitive fields.

Where transformation happens is a design choice. Warehouse-native SQL (via dbt) is the dominant pattern in 2026: cheap compute, version-controlled logic, native testing. Python and Spark handle the cases SQL can't: unstructured data, ML preprocessing, complex window logic.

### Loading: Delivering to the Destination

Loading writes the final data where consumers can use it. Warehouses (Snowflake, BigQuery, Redshift) dominate analytics. Lakehouses (Databricks, Iceberg on S3) are growing for mixed SQL and ML workloads. Operational systems (CRMs, marketing tools) receive data through [reverse ETL](/resources/data/reverse-etl) when the pipeline's output needs to drive action, not just reporting.

Loading strategy matters: full refresh, incremental loads, and upserts each have different trade-offs around cost, latency, and consistency.

## Data Pipeline Architecture: A Reference Blueprint

Beyond the three stages, a production pipeline has a recognizable shape. Picturing the layers makes it easier to decide where each tool fits and where things tend to break. A reference architecture stacks five layers between the source and the consumer:

1. **Source layer**: operational databases, SaaS APIs, event streams, and files, each with its own access pattern, refresh rate, and failure mode.
2. **Ingestion layer**: connectors and CDC tools (Airbyte, Fivetran, Debezium, custom extractors) that land data in a staging area such as object storage or a raw warehouse schema.
3. **Transformation layer**: dbt, Spark, or Python jobs that clean, join, and model raw data into analytics-ready tables.
4. **Storage layer**: the warehouse, lake, or lakehouse where modeled data lives.
5. **Serving layer**: BI dashboards, reverse-ETL syncs, ML feature stores, and application APIs that read the finished data.

An orchestration plane cuts across all five. It decides what runs, in what order, on which trigger, and what happens when a step fails. Without it, the other layers are disconnected jobs hoping to run in the right order.

Most production incidents happen at the seams between layers, not inside them. A source API changes its schema and ingestion loads garbage. An overnight batch finishes late, so the transformation step reads yesterday's partial data. A warehouse load silently truncates a column and the dashboard is wrong before anyone notices. A clear architecture, paired with an orchestrator that enforces ordering and surfaces failures early, keeps those seams from corrupting downstream data.

## How to Create a Data Pipeline in Five Steps

Building a data pipeline follows a repeatable sequence. Most teams that skip steps end up rebuilding the pipeline within a year.

### Step 1: Define Goals and Requirements

Start with the consumer. Who uses the data, how often do they need it, and what's the cost of it being late or wrong? These answers set the non-negotiables: latency target, freshness SLA, acceptable failure modes, observability requirements. Without this step, every downstream decision is guesswork.

### Step 2: Select Data Sources and Ingestion Patterns

List every source and classify each by access pattern: batch-pullable API, CDC-capable database, streaming feed, file drop. For each, decide between full refresh and incremental ingestion. Incremental wins on cost and speed at scale, but requires a reliable high-watermark or primary key on the source side.

### Step 3: Design Processing and Storage

Decide where transformations run. In-warehouse with SQL and dbt is the default for structured data. Out-of-warehouse with Python, Polars, or Spark is right for unstructured data, complex ML preprocessing, or when keeping compute off the warehouse matters for cost. Either way, structure the storage layer in distinct zones (raw, staging, curated) so lineage stays clear and debugging stays possible.

### Step 4: Choose the Destination

Match the destination to the consumer. BI dashboards read from a warehouse. ML models need a feature store or a warehouse with point-in-time correctness. Operational systems get data through reverse ETL to the CRM or marketing platform. Many pipelines have multiple destinations and fan out from a single transformation layer.

### Step 5: Orchestrate the Flow

This is where most first pipelines fail. Without orchestration, the pipeline is a collection of scripts glued together with cron. Orchestration handles triggers (schedule, event, webhook, file drop), dependencies between tasks, retry logic on failure, alerting, and execution history. It's the difference between a pipeline that runs in production and a pipeline that breaks in production. See [how to schedule data workflows](/resources/data/schedule-data-workflows) for practical scheduling patterns.

## A Concrete Example: Building a Pipeline End to End

Here's what a scheduled pipeline looks like in Kestra: ingest from an API, load into BigQuery, transform with dbt, notify Slack. Everything lives in one YAML file, triggered on a schedule, with retries and error handling declared next to the tasks they protect.

```yaml
id: create_data_pipeline_example
namespace: company.data

triggers:
  - id: daily_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 6 * * *"

tasks:
  - id: ingest_from_api
    type: io.kestra.plugin.scripts.python.Script
    beforeCommands:
      - pip install requests pandas pyarrow
    script: |
      import requests, pandas as pd
      r = requests.get("https://api.example.com/orders", headers={
          "Authorization": "Bearer {{ secret('API_TOKEN') }}"
      })
      r.raise_for_status()
      pd.DataFrame(r.json()).to_parquet("orders.parquet")
    outputFiles:
      - orders.parquet
    retry:
      type: exponential
      maxAttempts: 3
      interval: PT1M
      maxInterval: PT10M

  - id: load_to_warehouse
    type: io.kestra.plugin.gcp.bigquery.Load
    from: "{{ outputs.ingest_from_api.outputFiles['orders.parquet'] }}"
    destinationTable: "raw.orders"
    format: PARQUET

  - id: transform_with_dbt
    type: io.kestra.plugin.dbt.cli.DbtCLI
    namespaceFiles:
      enabled: true
    commands:
      - dbt deps
      - dbt build --select tag:daily

  - id: notify_team
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "Daily pipeline completed for {{ flow.id }}"

errors:
  - id: alert_on_failure
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "Pipeline {{ flow.id }} failed, execution {{ execution.id }}"
```

Four tasks, one trigger, an error handler, and secrets management, in one declarative file that any engineer can read on day one. The retry sits only on the ingestion task because it performs a read-only GET, so rerunning it is safe. The dbt project lives in [namespace files](/docs/concepts/namespace-files) next to the flow.

## How to Automate a Data Pipeline

A scheduled pipeline still needs someone to notice when it fails. An automated pipeline starts itself, recovers from transient failures, and tells you when it can't. Four mechanisms do that work, and a platform that handles pipeline monitoring, alerting, and retry logic should give you all four without custom code.

**Triggers** decide when a run starts. Schedules cover fixed cadences. Event triggers react to a file landing in S3, a message on a queue, or a webhook from a SaaS tool, so data moves when it arrives instead of at the next cron tick. Flow triggers start a pipeline when an upstream flow succeeds, which replaces "start at 7:00 and hope ingestion finished by then."

**Retries** absorb transient failures: API rate limits, network blips, a warehouse that is briefly busy. Configure them per task, with exponential backoff for external APIs. Only retry tasks that are safe to repeat. A read-only extract or an upsert can retry freely; an append-only insert retried after a partial write produces duplicate rows.

**Alerting** turns failures into notifications. Error handlers send a Slack or email alert with the execution ID when any task fails. SLAs catch the quieter failure: a run that doesn't fail but takes three hours instead of twenty minutes, so the data is late without anyone knowing.

**Monitoring** gives you the history to debug: per-execution logs, task durations, outputs, and states, plus metrics you can export to Prometheus or Grafana. For deeper coverage of this layer, see the guide to [data pipeline monitoring](/resources/data/data-pipeline-monitoring).

The flow below combines all four for a file-driven pipeline: a partner drops a CSV into S3, the flow cleans it with Python and loads it into BigQuery.

```yaml
id: partner_files_to_bigquery
namespace: company.data

triggers:
  - id: new_partner_file
    type: io.kestra.plugin.aws.s3.Trigger
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_KEY_ID') }}"
    region: eu-west-1
    bucket: partner-exports
    prefix: incoming/
    interval: PT1M
    maxKeys: 1
    action: MOVE
    moveTo:
      bucket: partner-exports
      key: archive/

sla:
  - id: max_runtime
    type: MAX_DURATION
    duration: PT30M
    behavior: FAIL
    labels:
      sla: miss

tasks:
  - id: clean_data
    type: io.kestra.plugin.scripts.python.Script
    beforeCommands:
      - pip install pandas
    inputFiles:
      raw.csv: "{{ trigger.objects[0].uri }}"
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
    autodetect: true

errors:
  - id: alert_on_failure
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "Partner load failed for {{ trigger.objects[0].key }}, execution {{ execution.id }}"
```

The trigger's `MOVE` action archives each file once it is picked up, so the same file never starts a second run. The load deliberately has no `retry`: appending the same file twice would duplicate rows. The `sla` block fails any run that exceeds 30 minutes and labels it `sla: miss`, so a separate alerting flow with a Flow trigger on that label can page the on-call engineer. See [event-driven orchestration](/resources/infrastructure/event-driven-orchestration) for more trigger patterns.

## Testing a Data Pipeline

Automation without tests just moves bad data faster. Schema changes in a source, a bug in a join, or an upstream outage can all produce a pipeline run that succeeds while the data is wrong. Tests turn those silent failures into visible ones, at four points:

- Source checks run before ingestion: freshness (did the source update?), volume (did row counts drop by 90%?), and schema drift (did a column disappear or change type?).
- Transformation tests assert conditions on modeled tables: a primary key is unique and not null, a foreign key resolves, an amount is never negative. [dbt tests](/resources/data/dbt-tests-explained) are the standard tool here; `dbt build` runs them alongside the models, so a failing test stops the run before bad data reaches the marts.
- End-to-end reconciliation compares record counts or aggregate totals between source and destination to confirm nothing was dropped or duplicated in transit.
- Workflow tests validate the orchestration logic itself before deployment, using fixtures and mocked task outputs. Kestra Enterprise Edition supports [unit tests for flows](/resources/infrastructure/workflow-unit-testing).

Data tests and workflow tests answer different questions. The first asks "is this data correct?", the second asks "does this pipeline behave as designed when an input is empty or a task fails?" Production pipelines need both. The [data quality guide](/resources/data/data-quality) covers the data side in more depth.

## Types of Data Pipelines: Batch, Streaming, Event-Driven

Three patterns dominate in 2026. Most teams run a mix.

- **Batch**: fixed schedule, bounded data per run. Easiest to reason about. Default for analytics where freshness within hours is acceptable, such as daily sales reporting or monthly financial consolidation.
- **Streaming**: continuous processing, latency in seconds or milliseconds, typically on Kafka, Flink, or Kinesis. Used for fraud detection, real-time personalization, and operational dashboards. Higher complexity around ordering, state, and exactly-once guarantees.
- **Event-driven**: triggers on events (file lands in S3, webhook fires, message on a queue) rather than a schedule. Removes the "wait until next run" tax of batch without the full complexity of streaming.

Event-driven is increasingly the default pattern for modern data teams. See [batch vs streaming processing](/resources/data/batch-vs-streaming-processing) for when each pattern fits.

## Tools for Creating Data Pipelines

The pipeline tool landscape splits into two categories: orchestrators (what runs your pipelines) and managed ETL/ELT vendors (what moves data through them). Most production setups use both.

| Tool | Category | Interface | Cloud-agnostic | Best for |
| --- | --- | --- | --- | --- |
| **Kestra** | Orchestrator | YAML + UI | Yes | Multi-language teams, event-driven, hybrid stacks |
| **Airflow / Astronomer** | Orchestrator | Python DAGs | Yes | Python-native data teams |
| **Dagster** | Orchestrator | Python + assets | Yes | Asset-centric modeling, Python-first |
| **AWS Glue / Step Functions** | Orchestrator | Visual / JSON | No (AWS) | AWS-native stacks |
| **Airbyte / Fivetran** | Managed ingestion | Connectors | Yes | Offloading connector maintenance |
| **dbt** | Transformation | SQL + Jinja | Yes | Warehouse-native transforms |

Cloud-native services (AWS Step Functions, Azure Data Factory, Google Cloud Composer) integrate tightly with their own cloud but get awkward once a pipeline spans clouds or on-premises systems. For a deeper comparison of orchestrators, see [Airflow alternatives](/resources/data/airflow-alternatives) and [Dagster alternatives](/resources/data/dagster-alternatives).

For most teams building a pipeline today, the pragmatic stack is: Airbyte or Fivetran for ingestion, dbt for transformation, and a general orchestrator to tie them together with event triggers, retries, and observability.

### Two stacks data teams build often

An ELT analytics pipeline for a SaaS company: Airbyte pulls Salesforce, HubSpot, and the product Postgres database into a `raw` schema in Snowflake. dbt models clean and join those tables into tested `marts`. BI tools read the marts, and a reverse-ETL job syncs key metrics back to the CRM. One flow triggers the Airbyte sync, waits for it, runs `dbt build`, and alerts on failure, the pattern described in [end-to-end orchestration with Airbyte, dbt, and Kestra](/blogs/2023-06-26-end-to-end-data-orchestration).

A file-driven cloud ETL pipeline: partners drop daily exports into S3, an event trigger starts the flow, Python validates and deduplicates the rows, and the result lands in a date-partitioned BigQuery table. That is the second YAML example above.

## Best Practices for Production Pipelines

Seven practices separate pipelines that scale from pipelines that rot:

- Idempotent tasks: the same pipeline run twice should produce the same output. Re-runs are the most common recovery mechanism, and non-idempotent tasks turn recovery into a minefield.
- Incremental processing: ingest and transform only what's changed since the last run. Full-refresh pipelines don't scale past a few million rows.
- Data quality tests: assertion tests (dbt tests, Great Expectations) catch regressions before they reach dashboards. Cheaper to fix upstream than to explain to a CFO why Q3 revenue was wrong.
- Modularity: split large pipelines into subflows (one per source, one for the transformation layer) so each piece can be tested, rerun, and owned independently.
- Version control: every pipeline definition lives in Git, reviewed like application code. The pipeline is infrastructure; treat it that way.
- Observability: logs alone aren't enough. Per-task metrics, data volumes, latency, and SLA tracking are what let you answer "what broke?" in minutes instead of hours. Lineage tells you which downstream tables a failure touched; in Kestra Enterprise Edition, [Assets](/blogs/2026-01-26-data-assets-use-cases) record which tables each task reads and writes.
- Secrets management: credentials in a vault, not in the pipeline code. Rotatable, auditable, and not committed to Git.

## Getting Started

Creating a data pipeline is less about the specific tools and more about the system around them. The orchestrator you pick, the way you structure storage, and the observability you bake in from day one shape whether the pipeline is still running reliably a year later.

For teams evaluating orchestration, Kestra is open-source, self-hostable, and ships with ready-to-use blueprints for the most common pipeline patterns. Start with a [ready-made data pipeline blueprint](/blueprints), explore the [data orchestration guide](/resources/data/data-orchestration), see how Kestra [orchestrates data pipelines](/docs/use-cases/data-pipelines) in the docs, or read about the broader [declarative orchestration approach](/data).
