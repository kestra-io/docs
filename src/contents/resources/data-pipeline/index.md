---
title: "What Is a Data Pipeline? Definition, Architecture, and Tools"
description: "Every modern business runs on data pipelines. Learn the architecture, the three stages (ingestion, transformation, loading), how pipelines differ from ETL, the main types (batch, streaming, event-driven), and how to choose the right tool."
metaTitle: "What Is a Data Pipeline? Definition & Architecture | Kestra"
metaDescription: "A data pipeline moves data from sources to destinations via ingestion, transformation, and loading. Learn the types, architecture, and how to choose tools."
tag: data
date: 2026-04-21
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

Every modern business runs on data that lives in dozens of systems — CRMs, ad platforms, product databases, event streams, SaaS apps. A **data pipeline** is the automated system that moves that data from where it's generated to where it can be used. Without pipelines, analytics dashboards never refresh, ML models train on stale data, and finance teams spend half their week manually exporting CSVs.

But a pipeline by itself is just a sequence of steps. What makes it reliable in production is the *orchestration layer* around it: the triggers that start it, the retry logic that recovers from failures, the lineage that tracks what data moved where, and the observability that tells you when something breaks before a dashboard lies to an executive.

This guide covers the full concept — what a data pipeline is, how the three stages work, how pipelines differ from ETL, the main types (batch, streaming, event-driven), real YAML examples, and how to choose the right tool.

## What Is a Data Pipeline?

A data pipeline is an automated sequence of steps that ingests data from source systems, transforms it according to business rules, and loads it into a destination such as a data warehouse, lake, or operational system. It handles the movement, shaping, and delivery of data across an organization's stack.

Every data pipeline has three things in common, regardless of the tool or pattern:

- A **source** — a database, API, file, stream, or SaaS app where data originates
- A **set of transformations** — logic that cleans, joins, aggregates, or reshapes the data
- A **destination** — a warehouse, lake, operational system, or downstream service

An important distinction: a **data pipeline** describes the steps data moves through. The **orchestration layer** is the system that runs those steps reliably — schedules them, retries failed tasks, manages dependencies, and logs what happened. Many teams conflate the two, then discover the hard way that a pipeline without proper orchestration is a pipeline that breaks at 3 a.m.

## How Does a Data Pipeline Work? The Three Main Stages

The three main stages of a data pipeline are ingestion (extracting data from sources), transformation (cleaning, joining, and applying business logic), and loading (writing to the destination). Modern ELT pipelines reverse the order of the last two stages, loading raw data first and transforming it in the warehouse.

### Ingestion

Ingestion pulls data from its source system. Methods fall into two broad categories:

- **Batch ingestion** — pull data on a schedule (hourly, daily). Simple to reason about, fine for most analytics use cases.
- **Streaming / CDC ingestion** — pull data continuously as it changes, via Change Data Capture, message queues (Kafka, Pub/Sub), or event streams. Required when latency matters.

Tools like Airbyte, Fivetran, and custom Python scripts handle this stage for most teams. For a deeper look at ingestion patterns, see the [data ingestion guide](/resources/data/what-is-data-ingestion).

### Transformation

Transformation reshapes raw data into something analytics-ready. Typical operations: removing duplicates, joining data across sources, aggregating (daily totals, rolling averages), applying business rules, enforcing types, masking or redacting sensitive fields.

This stage is where SQL and modern tools like **dbt** dominate — declarative transformations versioned in Git, testable, and composable.

### Loading

Loading writes the transformed (or raw, in ELT) data to its destination. Modern targets include cloud warehouses (Snowflake, BigQuery, Redshift), lakehouses (Databricks, Iceberg on S3), and operational systems (CRMs, marketing tools) in the case of Reverse ETL.

## Data Pipeline Architecture — A Reference Blueprint

A production-grade data pipeline architecture spans more than the three core stages. It includes an orchestration layer, a storage layer, observability, and often a metadata layer for lineage.

The components you'll recognize in most modern architectures:

- **Sources** — databases, APIs, files, streams
- **Ingestion layer** — connectors that pull data (Airbyte, Fivetran, Kafka Connect)
- **Staging storage** — raw landing zone (S3, GCS, warehouse staging schema)
- **Transformation layer** — SQL/Python logic (dbt, Spark, custom scripts)
- **Destination** — warehouse, lake, lakehouse, or operational system
- **Orchestration layer** — spans all stages, manages triggers, dependencies, retries, and observability
- **Metadata & lineage** — tracks what data moved where, when, and with which transformation

The orchestration layer is what turns a collection of steps into a system. Tools like [Kestra](/), Airflow, and Dagster sit here. The ingestion and transformation layers can be swapped — the orchestration layer is what ties them together reliably.

## Data Pipeline vs. ETL — What's the Difference?

No, a data pipeline and ETL are not the same. A data pipeline is the broader concept — any automated system moving data from source to destination. ETL (Extract, Transform, Load) is one specific pipeline pattern. A data pipeline can follow ETL, ELT, streaming, event-driven, or reverse-ETL patterns depending on the architecture.

| Concept | Scope | Typical pattern |
| --- | --- | --- |
| **ETL** | Specific pattern — transform before load | Pre-warehouse transforms, strict compliance, smaller data |
| **Reverse ETL** | Reverse flow — warehouse back to operational tools | Sync curated data to CRMs, marketing, support tools |

**Is ETL obsolete?** No. The shift toward ELT and modern patterns hasn't made ETL obsolete. ETL is still required when data must be cleaned, masked, or transformed before entering the warehouse — common in compliance-heavy industries handling PII, PHI, or regulated financial data.

For a deeper comparison of ETL and ELT specifically, see [ETL vs ELT](/resources/data/etl-vs-elt).

## Types of Data Pipelines — Batch, Streaming, Event-Driven

Three patterns dominate production data pipelines in 2026. Most teams use a mix. For a side-by-side breakdown, see [batch vs. streaming processing](/resources/data/batch-vs-streaming-processing).

### Batch Pipelines

Batch pipelines run on a fixed schedule — typically hourly, daily, or weekly. They process a bounded chunk of data per run: "yesterday's orders," "the last hour of events." Batch is the default for analytics workloads where freshness within hours is acceptable, and it's the easiest pattern to reason about, test, and recover from.

### Streaming Pipelines

Streaming pipelines process data continuously, one record (or micro-batch) at a time, as it arrives. Latency drops from hours to seconds or milliseconds. Tools like Kafka, Flink, and Spark Streaming power this pattern. Use cases: fraud detection, real-time personalization, operational dashboards, and [connected-vehicle data pipelines in the automotive industry](/use-cases/automotive).

### Event-Driven Pipelines

Event-driven pipelines sit between batch and streaming. They don't wait for a schedule — they trigger on events: a file landing in S3, a webhook firing, a message appearing on a queue. This pattern eliminates the "wait until the next run" tax of batch pipelines while staying simpler than full streaming architectures.

Event-driven is increasingly the default for modern data teams. Kestra handles it natively — any of 1,400+ triggers can start a workflow, not just schedules.

## Data Pipeline Examples — Real Pipelines in Production

Two examples show what a production data pipeline looks like, from simple scheduled to event-driven.

### Example 1 — Daily batch: Airbyte + dbt + Snowflake

The most common modern pattern: ingest raw data with Airbyte, transform with dbt, load into Snowflake, notify Slack. Orchestrated as a single Kestra workflow in YAML:

```yaml
id: daily_analytics_pipeline
namespace: company.data

triggers:
  - id: daily_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 5 * * *"

tasks:
  - id: airbyte_ingest
    type: io.kestra.plugin.airbyte.connections.Sync
    connectionId: "{{ secret('AIRBYTE_CONNECTION_ID') }}"
    wait: true

  - id: dbt_transform
    type: io.kestra.plugin.dbt.cli.DbtCLI
    commands:
      - dbt deps
      - dbt build --select tag:daily

  - id: notify_team
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    payload: '{"text": "Daily analytics pipeline completed ✅"}'
```

### Example 2 — Event-driven: S3 → Python → BigQuery

When a new file lands in S3, the pipeline runs immediately — no scheduled wait, no polling logic:

```yaml
id: s3_to_bigquery_pipeline
namespace: company.data

triggers:
  - id: new_file_landing
    type: io.kestra.plugin.aws.s3.Trigger
    bucket: raw-events-bucket
    action: NONE
    interval: PT1M

tasks:
  - id: transform_with_python
    type: io.kestra.plugin.scripts.python.Script
    script: |
      import pandas as pd
      df = pd.read_csv("{{ trigger.objects[0].uri }}")
      df = df.dropna().drop_duplicates()
      df.to_parquet("transformed.parquet")

  - id: load_to_bigquery
    type: io.kestra.plugin.gcp.bigquery.Load
    from: "{{ outputs.transform_with_python.outputFiles['transformed.parquet'] }}"
    destinationTable: "analytics.events"
    format: PARQUET
```

For teams on AWS specifically, Kestra replaces the legacy AWS Data Pipeline service (which AWS closed to new customers in July 2025 and recommends migrating to AWS Glue, Step Functions, or MWAA) with a cloud-agnostic orchestrator that still integrates deeply with AWS services.

## Key Features of a Modern Data Pipeline

Six features separate a data pipeline that scales from one that quietly rots in production:

- **Reliability** — Every task fails eventually. Retries with exponential backoff, timeouts, idempotent task design, and clear error handlers are not nice-to-haves — they're what keeps the pipeline running while you sleep.
- **Observability** — Logs alone aren't enough. You need per-task execution metrics, data volumes, latency, and SLA tracking. Answering "what broke?" in minutes instead of hours requires observability baked into the orchestrator, not bolted on. See the [data observability guide](/resources/data/data-observability) for what to instrument.
- **Lineage** — Knowing which tables depend on which upstream sources matters for impact analysis, debugging, and compliance. Modern orchestrators track pipeline lineage natively across tables, datasets, and infrastructure resources.
- **Security** — Secrets management (API keys, credentials), role-based access control, audit logs, and support for air-gapped environments. Non-negotiable in regulated industries.
- **Scalability** — Dynamic compute allocation (AWS Fargate, GCP Batch, Kubernetes), parallel task execution, concurrency controls, and partition-aware processing. What works on 1 GB breaks on 1 TB without these.
- **Integration breadth** — 1,400+ plugins covering databases, cloud storage, SaaS APIs, messaging platforms, and ML frameworks. One engine to orchestrate the whole stack beats a fragmented tool chain every time.

## Data Pipeline Tools — How Kestra Compares

The data pipeline tool landscape splits into two broad categories: orchestrators (what runs your pipelines) and managed ETL/ELT vendors (what moves data through them). The choice isn't either-or — most production setups use both.

| Tool | Category | Workflow language | Cloud-agnostic | Best for |
| --- | --- | --- | --- | --- |
| **Airflow / Astronomer** | Orchestrator | Python DAGs | ✅ | Python-native data teams |
| **AWS Glue / Step Functions** | Orchestrator | Visual / JSON | ❌ (AWS) | AWS-native stacks |
| **Informatica** | Legacy ETL suite | GUI / proprietary | ✅ | Enterprise shops with existing Informatica footprint |

Kestra's positioning: an orchestrator that runs your existing ETL/ELT stack (Airbyte, dbt, Fivetran, Informatica) without replacing it. Declarative YAML makes it accessible to analytics engineers who write SQL, not just Python engineers. Event-driven triggers are first-class. Git versioning is native. And 1,400+ plugins cover the full data-plus-infra stack in a single engine.

For direct head-to-head comparisons, see [Kestra vs Dagster](/vs/dagster), [Kestra vs Astronomer](/vs/astronomer), and [Kestra vs Temporal](/vs/temporal). For the broader Kestra approach to data teams, see [Declarative Orchestration for Modern Data Engineers](/data).

## Getting Started

Data pipelines are infrastructure — the kind you don't notice when they work and can't ignore when they don't. The modern question isn't whether to build them, but how to build them so they scale past the first handful.

For teams evaluating orchestration for their pipelines, Kestra is open-source, self-hostable, and ships with ready-to-use blueprints for the common patterns. Start with the [data engineering pipeline blueprint](/blueprints), explore the [data orchestration guide](/resources/data/data-orchestration), or read about the broader [declarative orchestration approach](/data).
