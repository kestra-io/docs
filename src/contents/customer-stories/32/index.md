---
title: Apple's ML Team Orchestrates Large-Scale Data Pipelines with Kestra
description: How Apple's 200-engineer ML team replaced Airflow with Kestra to
  orchestrate large-scale ETL workloads between a data warehouse and ML
  platform — with declarative syntax, robust fault tolerance, and the
  scalability to match one of the world's largest AI/ML operations.
metaTitle: Apple's ML Team Orchestrates Large-Scale Data Pipelines with Kestra
metaDescription: How Apple's 200-engineer ML team replaced Airflow with Kestra
  to orchestrate large-scale ETL workloads between a data warehouse and ML
  platform — with declarative syntax and fault tolerance at AI/ML scale.
heroImage: ./hero.jpeg
featuredImage: ./hero.jpeg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.scripts.python.Commands
  - io.kestra.plugin.aws.s3.Upload
  - io.kestra.plugin.jdbc.postgresql.Query
  - io.kestra.plugin.core.flow.Parallel
kpi1: |-
  ##### 200
  ML Engineers on Kestra
kpi2: |-
  ##### Language-Agnostic
  Declarative YAML Pipelines
kpi3: |-
  ##### Massive Scale
  ETL Across App Store, Apple Music & More
quote: I want to highlight their robustness, which is crucial at our scale—few
  companies operate at this level, especially in AI/ML.
quotePerson: Senior Engineering Manager
quotePersonTitle: Apple ML Team
industry: Technology
headquarter: Cupertino, USA
solution: Apple is a global technology leader whose services — including the App
  Store, Apple Music, and device ecosystems — generate some of the world's
  largest data volumes, processed daily by a 200-engineer ML team.
companyName: Apple
cta: "What would change if your ML data pipelines processed at massive scale—orchestrating complex ETL workloads between your data warehouse and ML platform with declarative simplicity?"
---

Apple's ML team runs at a scale that few organizations will ever face. Massive volumes of data flow in continuously from the App Store, Apple Music, device debugging logs, and user interactions — all of it needing to be ingested, cleaned, and delivered to a centralized ML platform for modeling and analysis. For years, Apache Airflow handled orchestration. Eventually, the operational cost of keeping it running outgrew the value it delivered.

**Why Kestra:** Apple needed an orchestrator that could handle complex, fault-tolerant ETL at extreme scale, without requiring engineers to write Python just to define a pipeline. They evaluated Prefect and Dagster before landing on Kestra — choosing it for its declarative YAML syntax, scalability, error handling, and price.

**The result:** A 200-engineer ML team now orchestrates their full data pipeline infrastructure — from raw data ingestion to ML platform delivery — using Kestra, with the reliability and robustness their scale demands.

## The story

Apple's ML data infrastructure is not a typical setup. The team processes data continuously from multiple high-volume services — the App Store alone generates transaction, review, and behavioral data at a rate that would overwhelm most pipeline systems. Add Apple Music streaming signals, per-device debugging telemetry, and user interaction data, and the ingestion surface becomes enormous.

The mission is clear: build robust ETL workflows that efficiently extract from each source, transform data into model-ready form, and load it into the ML platform reliably — at scale, every time.

> "Apple has massive volumes of data that are being generated from multiple services. We use Kestra's orchestration to handle these large-scale ETL workloads when we need to integrate with diverse data sources."

Airflow was the incumbent. It did the job — until managing it became a job in itself.

## Why Airflow wasn't enough

Apache Airflow carries real operational weight: Python DAG definitions, a complex scheduler, dependency management, and the need for specialized knowledge to tune, debug, and scale it. For a team of 200 engineers focused on solving ML problems, not infrastructure problems, that overhead became a drag.

> "Apache Airflow is complex and has been challenging to manage, with significant operational overhead."

The team began evaluating alternatives: Prefect, Dagster, and Kestra. The question was not just "can it handle our workloads?" but "can our engineers define pipelines without context-switching into infrastructure mode?"

## Why Kestra won

Four factors drove the decision: scalability, YAML-based configuration, pricing, and error handling.

The YAML angle was not about avoiding code — Apple's engineers write code all day. It was about where engineering effort should go.

> "Coding is not a problem for us, but the problem here is that we want to be coding for solving our problems."

Defining a pipeline should not require Python expertise. Kestra's declarative, language-agnostic syntax lets engineers express *what* a workflow does without dictating *how* the orchestrator runs it — a clean separation that aligned with how Apple's team wanted to work.

> "We really like the end-to-end automation capabilities of the tool and the fact that it's language-agnostic and has declarative syntax."

Error handling was the second major factor. At Apple's data volumes, failures are not edge cases — they're expected. An orchestrator that surfaces errors clearly and recovers predictably is not a nice-to-have; it's a prerequisite.

> "Kestra excels at managing complex ETL workloads. Data engineering pipelines require robust fault tolerance, but configuring them is challenging. We needed a simpler solution."

## What they run on Kestra

Apple's ML team uses Kestra to manage the pipelines that move data between their data warehouse and ML platform. These are not simple scheduled jobs — they're multi-step ETL workflows integrating diverse upstream data sources, each with different schemas, latencies, and failure modes.

Data originates from services like the App Store, Apple Music, device-level debugging logs, and aggregated user interactions. Kestra orchestrates ingestion, transformation, and delivery into the ML platform where models are trained and served.

The team's 200 engineers operate in this environment daily — defining flows, monitoring runs, responding to exceptions, and iterating on pipeline logic — all through a workflow layer that stays out of the way.

## Robustness at AI/ML scale

Apple operates at a tier where few peers exist. The expectations placed on infrastructure reflect that reality: a pipeline failure does not just delay a report — it can disrupt model training, downstream decisions, and product signals that feed millions of users.

> "I want to highlight their robustness, which is crucial at our scale—few companies operate at this level, especially in AI/ML."

This is where Kestra's fault tolerance architecture — retry logic, error handling, execution observability — proved its value. The team is not just using Kestra to schedule jobs. They're relying on it to keep a mission-critical ML data layer running reliably in one of the most demanding production environments in the industry.

## Before Kestra / After Kestra

**Before:** Airflow managed the pipelines, but at the cost of sustained operational overhead. Defining and maintaining DAGs required Python expertise, debugging failures was slow, and scaling the infrastructure demanded ongoing platform work that pulled engineers away from ML problems.

**After:** Kestra handles orchestration across the full data pipeline — from multi-source ingestion to ML platform delivery — with declarative YAML flows that any engineer on the team can read, write, and reason about. Error handling is built in. Fault tolerance is configurable. The infrastructure operates at scale without demanding constant attention.

The engineering team writes code for ML. Kestra handles the orchestration.
