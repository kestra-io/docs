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
tagline: Remote recording platform for podcasts and video interviews
companyName: Riverside
intro: Riverside is a podcast recording and editing platform used by creators and media teams worldwide. Their analytics engineering team runs the company's internal data operations — ELT ingestion into Snowflake, sequential dbt Cloud transformation jobs, Metaplane data quality checks, and Hightouch reverse ETL to downstream platforms. Six tools in total, all with dependencies on each other, all previously running on isolated time-based schedules with no actual handoff between them. The team evaluated Astronomer, Dagster, Mage, and Orchestra. All four were rejected. Airflow was too complex for a team of SQL and YAML practitioners. Dagster required too steep a learning curve. Orchestra abstracted too much away. They chose Kestra Cloud and connected their full analytics stack without rewriting a single pipeline.
deployment: Cloud · Kestra Cloud · GCP
useCase: Analytics pipeline orchestration — connecting ELT sources, dbt Cloud, Metaplane, and Hightouch in a dependency-aware sequence
cta: What would your analytics team build if your pipelines ran in sync, with no framework overhead and no infrastructure to manage?
---

## The problem

<div class="section-subtitle">Six tools with real dependencies on each other — coordinated only by timers.</div>

Riverside's analytics engineering team runs the company's internal data operations. Every business insight moves through a pipeline — ELT ingestion into Snowflake, sequential dbt Cloud transformation jobs, Metaplane data quality checks, and Hightouch reverse ETL to downstream platforms. Six tools, all with real dependencies on each other, all previously running on isolated schedules with no actual handoff between them.

<div class="problem-list">
<div class="problem-item">
<span class="problem-number">01</span>
<div class="problem-title">Pipelines ran on timers, not dependencies</div>
<div class="problem-desc">Each tool assumed the previous step had finished. If ELT was still running when dbt's scheduled slot arrived, the transformation would execute on incomplete data. No alert fired. The cost became visible when the CEO flagged a number that looked off — every tool had run on schedule, but the data was wrong because the sequence had broken silently. <em class="inline-quote">"It undermines credibility."</em></div>
</div>
<div class="problem-item">
<span class="problem-number">02</span>
<div class="problem-title">Python-first orchestrators required expertise the team didn't have</div>
<div class="problem-desc">The analytics engineering team writes SQL, YAML, and Python transformation logic — not platform engineering. Astronomer and Dagster both required adopting a Python-centric execution model: decorators, framework abstractions, proprietary asset definitions. An orchestrator that required learning a new programming model was not viable for a team whose job is data transformation, not infrastructure ownership.</div>
</div>
<div class="problem-item">
<span class="problem-number">03</span>
<div class="problem-title">The final choice came down to abstraction vs. control</div>
<div class="problem-desc">Orchestra and Kestra were the final two. Orchestra hides the YAML entirely — appealing, but that meant less control over flow structure and fewer options for the custom connectors the team needed for tools like Metaplane. Kestra's YAML gave the team direct control over sequencing, conditional logic, and custom API calls. After the trial: <em class="inline-quote">"Simply powerful yet simple enough."</em></div>
</div>
</div>

<div class="problem-close">
<div class="problem-close-prefix">// The requirement</div>
Tools that could talk to each other — <strong class="problem-close-key">not just run on timers.</strong>
</div>

## What Kestra fixed

<div class="section-subtitle">Developer-experience arguments won the eval. Dependency-aware pipelines won the team.</div>

<div class="fix-list">
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Declarative orchestration at the right level of abstraction</div>
<div class="fix-desc">Kestra sits on top of Riverside's existing tools. Nothing was rewritten. Custom Python scripts stay in their own repository — Kestra calls them. dbt Cloud jobs run as sequential steps, each dependent on the last. Analytics engineers can add a step to an existing flow without understanding how Kestra executes it underneath. <em class="inline-quote">"You give flexibility, but you abstract that with a declarative approach in which you say, okay, I want this to happen and it will happen."</em></div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Data quality gates embedded between every pipeline stage</div>
<div class="fix-desc">Metaplane checks run between dbt stages and halt the pipeline if a check fails, sending a Slack alert before bad data reaches stakeholders. The CEO had previously flagged a number that looked off because the sequence had broken silently. That's why these gates exist at every stage.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Event-driven triggers for the Snowflake handoff</div>
<div class="fix-desc">Some of Riverside's ELT tools run continuously and don't emit a clean completion event. Kestra polls a Snowflake table for the latest run status, confirms success, and only then kicks off the dbt pipeline — no timers, no guesswork.</div>
</div>
</div>
<div class="fix-item">
<div class="fix-check">✓</div>
<div>
<div class="fix-title">Managed cloud, no infrastructure required</div>
<div class="fix-desc"><em class="inline-quote">"We don't have the technical knowledge nor the help from our teams to set up the infra. We just need something available to use right from the get-go."</em> Self-hosted was never on the table. Kestra Cloud gave them a production-ready instance without a DevOps engagement. Two engineers maintain all production flows.</div>
</div>
</div>
</div>

## Outcomes

<div class="results-list">
<div class="result-item">
<div class="result-metric">6+ tools in sync</div>
<div class="result-desc">ELT ingestion, sequential dbt Cloud jobs, Metaplane data quality gates, and Hightouch reverse ETL now run in a dependency-aware sequence instead of on isolated timers.</div>
</div>
<div class="result-item">
<div class="result-metric">Quality gates at every stage</div>
<div class="result-desc">Metaplane checks between every dbt stage halt the pipeline on failure and fire a Slack alert. Bad data no longer reaches stakeholders silently.</div>
</div>
<div class="result-item">
<div class="result-metric">2 engineers own it all</div>
<div class="result-desc">Hernán and one other engineer maintain all production flows. Team members without deep Kestra knowledge can read a flow and add a step. <em class="inline-quote">"They don't need to know a lot to read an extra flow."</em></div>
</div>
</div>

## Kestra in the Riverside analytics stack

Riverside runs Kestra Cloud on GCP. Custom Python scripts and Fivetran connectors handle ELT ingestion from external sources. Kestra triggers sequential dbt Cloud jobs via the API connector. Metaplane checks run between dbt stages via a custom HTTP connector, halting the pipeline on failure. Hightouch is triggered after dbt completes to sync results to downstream platforms. Slack handles alerting throughout — pipeline failures, data quality alerts, and development-mode suppression via tag-based conditions.

<div class="stack-row">
<span class="stack-pill">Kestra Cloud</span>
<span class="stack-pill">dbt Cloud</span>
<span class="stack-pill">Snowflake</span>
<span class="stack-pill">Fivetran</span>
<span class="stack-pill">Metaplane</span>
<span class="stack-pill">Hightouch</span>
<span class="stack-pill">Python</span>
<span class="stack-pill">Slack</span>
<span class="stack-pill">GCP</span>
</div>
