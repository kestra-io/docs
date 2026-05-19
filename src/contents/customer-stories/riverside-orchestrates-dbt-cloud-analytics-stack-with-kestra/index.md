---
title: How Riverside Connected dbt Cloud, Snowflake, and Hightouch Into a Single Dependency-Aware Pipeline
rank: 2
description: Riverside's analytics engineering team replaced isolated time-based scheduling with a single dependency-aware pipeline connecting dbt Cloud, Snowflake, Metaplane, and Hightouch. No existing scripts were rewritten.
metaTitle: How Riverside Connected dbt Cloud, Snowflake, and Hightouch Into a Single Pipeline
metaDescription: Riverside's analytics engineering team connected dbt Cloud, Snowflake, and Hightouch into a single dependency-aware pipeline using Kestra Cloud. No rewrites, no Python framework, no infrastructure to manage.
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
tasks:
  - io.kestra.plugin.dbt.cloud.TriggerRun
  - io.kestra.plugin.scripts.python.Script
  - io.kestra.plugin.notifications.slack.SlackIncomingWebhook
  - io.kestra.plugin.core.http.Request
kpi1: |
  6+
  data tools orchestrated
  ELT sources, dbt Cloud, Metaplane, Hightouch, and more
kpi2: |
  4
  orchestrators evaluated
  Astronomer, Dagster, Mage, and Orchestra all rejected
kpi3: |
  0
  pipeline rewrites
  existing scripts and tools stay in place
kpi4: |
  2
  engineers maintaining all production flows
  no DevOps required
quote: Simply powerful yet simple enough.
quotePerson: Hernán Estrin
quotePersonTitle: Analytics Engineering Lead, Riverside
industry: Media Tech / SaaS
headquarter: Tel Aviv, Israel
region: Global
companySize: "300+"
solution: Orchestration layer connecting ELT ingestion, sequential dbt Cloud jobs, Metaplane data quality gates, and Hightouch reverse ETL across Riverside's Snowflake-based analytics stack
companyName: Riverside
intro: Riverside is a podcast recording and editing platform used by creators and media teams worldwide. Their analytics engineering team runs the company's internal data operations: ELT ingestion into Snowflake, sequential dbt Cloud transformation jobs, Metaplane data quality checks, and Hightouch reverse ETL to downstream platforms. Six tools in total, all with dependencies on each other, all previously running on isolated time-based schedules with no actual handoff between them. The team evaluated Astronomer, Dagster, Mage, and Orchestra. All four were rejected. Airflow was too complex for a team of SQL and YAML practitioners. Dagster required too steep a learning curve. Orchestra abstracted too much away. They chose Kestra Cloud and connected their full analytics stack without rewriting a single pipeline.
deployment: Cloud · Kestra Cloud · GCP
useCase: Analytics pipeline orchestration: connecting ELT sources, dbt Cloud, Metaplane, and Hightouch in a dependency-aware sequence
cta: What would your analytics team build if your pipelines ran in sync, with no framework overhead and no infrastructure to manage?
---

## The problem

Riverside's analytics engineering team runs the company's internal data operations. Every business insight moves through a pipeline that starts with ELT ingestion, passes through sequential dbt Cloud transformation jobs in Snowflake, runs data quality checks via Metaplane, and ends at downstream platforms via Hightouch reverse ETL. Six tools, all with real dependencies on each other, all previously coordinated by time-based scheduling with no actual handoff between them.

**01 -- Pipelines ran on timers, not dependencies**

Each tool assumed the previous step had finished. If ELT was still running when dbt's scheduled slot arrived, the transformation would execute on incomplete data. No alert fired. The pipeline had no way to know the sequence had broken.

The cost of this became visible when the CEO flagged a number that looked off. The pipeline had technically succeeded: every tool had run on schedule. But the data was wrong because the sequence had broken silently. *"It undermines credibility,"* Hernán Estrin, Analytics Engineering Lead, noted when explaining the motivation for embedding data quality checks between pipeline stages. The team needed tools that could talk to each other, not just run on timers.

**02 -- Python-first orchestrators required expertise the team didn't have**

The analytics engineering team writes SQL, YAML, and Python transformation logic. Infrastructure engineering is not their domain. Astronomer and Dagster both required adopting a Python-centric execution model: decorators, framework abstractions, proprietary asset definitions. The team didn't want to own any of it. An orchestrator that required learning a new programming model was not a viable option for a team whose job is data transformation, not platform engineering.

**03 -- The final choice came down to abstraction vs. flexibility**

Orchestra and Kestra were the final two. Orchestra's UI abstraction was appealing: it hides the YAML entirely. But that abstraction also meant less control over flow structure and fewer options for the custom connectors the team needed for tools like Metaplane. Kestra's YAML is visible, which requires slightly more familiarity, but gave the team control over the exact sequencing, conditional logic, and custom API calls their stack required. After the trial, Hernán's assessment: *"Simply powerful yet simple enough."* The docs were clear. Each task had its own inline configuration. The learning curve was short enough that analytics engineers could own their own flows without deep Kestra knowledge.

## What Kestra fixed

**Declarative orchestration at the right level of abstraction**

Kestra sits on top of Riverside's existing tools. Nothing was rewritten. Custom Python ingestion scripts stay in their own repository; Kestra calls them. dbt Cloud jobs run as sequential steps in a single flow, sometimes three jobs in a row, each dependent on the last. Metaplane data quality checks run between dbt stages and halt the pipeline if a check fails, sending a Slack alert before bad data reaches stakeholders.

*"You give flexibility, but you abstract that with a declarative approach in which you say, okay, I want this to happen and it will happen."* Analytics engineers can add a dbt Cloud job to an existing flow without understanding how Kestra executes it underneath.

**Event-driven triggers for the Snowflake handoff**

Some of Riverside's ELT tools run continuously and don't emit a clean completion event. The fix is a Snowflake-based trigger: Kestra polls a Snowflake table for the latest run status, confirms success, and only then kicks off the dbt pipeline.

**Managed cloud, no infrastructure required**

*"We don't have the technical knowledge nor the help from our teams in order to set up the infra. We just need something available to use right from the get-go."* Self-hosted was never on the table. Kestra Cloud gave them a production-ready instance without a DevOps engagement. Hernán and one other engineer maintain all production flows.

## Outcomes

**Full analytics stack in sync:** ELT ingestion, sequential dbt Cloud jobs, Metaplane data quality gates, and Hightouch reverse ETL now run in dependency-aware sequence instead of on isolated timers.

**Data quality gates between every pipeline stage:** Metaplane checks are embedded between dbt steps. A failed check halts the pipeline and sends a Slack alert. The CEO had previously flagged a number that looked off because the sequence had broken silently. That's why these gates exist at every stage.

**Analytics engineers own the orchestration:** Two engineers maintain all production flows. Team members without deep Kestra knowledge can read a flow and add a step. *"They don't need to know a lot to read an extra flow."*

## Kestra in the Riverside analytics stack

Riverside runs Kestra Cloud on GCP. The full pipeline runs through a single orchestration layer: custom Python scripts and Fivetran connectors handle ELT ingestion from external sources; Kestra triggers sequential dbt Cloud jobs via the API connector; Metaplane checks run between dbt stages via a custom HTTP connector, halting the pipeline on failure; Hightouch is triggered after dbt completes to sync results to downstream platforms.

Slack handles alerting throughout: pipeline failures, data quality alerts, and development-mode suppression via tag-based conditions to avoid alert noise during testing.

The full stack: Kestra Cloud · dbt Cloud · Snowflake · Fivetran · Metaplane · Hightouch · Python · Slack.
