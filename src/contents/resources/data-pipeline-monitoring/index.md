---
title: "Data Pipeline Monitoring: Catching Failures Before They Impact Your Business"
description: "Data pipeline monitoring catches silent failures before they reach a dashboard: run health, freshness, volume, and schema drift. Learn which signals matter, how to alert without drowning the team, and how to wire the checks into your orchestration layer."
metaTitle: "Data Pipeline Monitoring and Alerting"
metaDescription: "Monitor data pipelines for silent failures using four critical signals. Build a smart alerting strategy wired directly into your orchestrator."
tag: data
date: 2026-09-17
slug: "data-pipeline-monitoring"
faq:
  - question: "What is a pipeline monitoring system?"
    answer: "A pipeline monitoring system tracks the health and performance of data workflows, from ingestion to delivery. It detects issues like execution failures, delays, or data quality anomalies, ensuring timely intervention and preventing downstream impact. Effective systems provide visibility into each stage of a pipeline, offering real-time status updates and historical performance data."
  - question: "What is the difference between data pipeline monitoring and data observability?"
    answer: "Data pipeline monitoring primarily focuses on the operational health of the pipeline itself: whether tasks run on schedule, complete successfully, and within expected durations. Data observability, on the other hand, extends to the quality and characteristics of the data flowing through the pipeline, including its freshness, volume, distribution, and schema. While monitoring confirms the pipeline is running, observability confirms the data is right."
  - question: "How do you detect a silent data pipeline failure?"
    answer: "Detecting silent data pipeline failures requires moving beyond simple execution success checks. Implement monitoring for data freshness (is data recent?), volume (are expected rows/files present?), and schema changes (did the data's structure unexpectedly change?). These signals, combined with end-to-end lineage, help identify issues where a pipeline 'succeeds' but delivers incorrect or incomplete data, preventing user-reported incidents."
  - question: "What metrics should you monitor in a data pipeline?"
    answer: "Key metrics for data pipeline monitoring include execution status (success/failure), duration, latency, resource utilization (CPU, memory), data freshness (age of last update), data volume (row counts, file sizes), and schema drift. Integrating these with alerting thresholds ensures that operational teams are promptly notified of anomalies, allowing for quick diagnosis and resolution."
---
> **TL;DR** — Data pipeline monitoring tracks the operational health of your data workflows, ensuring timely execution and detecting silent failures like stale data or schema drift. By focusing on key signals beyond simple success/failure, teams can proactively identify issues and prevent negative business impact.

Imagine your data pipeline "succeeds" but delivers stale, incomplete, or corrupted data. This isn't a hypothetical scenario; it's the reality for many teams where "silent failures" are only discovered when leadership finds missing data in executive reports or customers flag discrepancies. Traditional pipeline monitoring often falls short, focusing solely on execution status while critical data integrity issues go unnoticed.

This article explores how to move beyond basic uptime checks to implement truly effective data pipeline monitoring. We’ll examine the four essential signals that expose hidden problems, differentiate between pipeline monitoring and broader [data observability](/resources/data/data-observability), and show how to build an alerting strategy that your team will actually read—not ignore.

## Why Silent Data Pipeline Failures Are Your Biggest Risk

A green dashboard can be dangerously misleading. When a pipeline run completes without error, most monitoring systems report success. But this "success" says nothing about the data itself. This is the core of the silent failure problem: the pipeline's mechanics worked, but the data it produced is wrong.

The costs of these undetected issues are steep and compound over time:
*   **Eroded Trust:** When business users or leadership consistently find errors in dashboards and reports, they lose faith in the data and the teams that provide it.
*   **Flawed Decisions:** Critical business decisions are made based on incorrect or incomplete information, leading to misallocated resources, missed opportunities, and flawed strategies.
*   **Operational Scrambles:** The discovery of a data issue by an end-user triggers a reactive, high-pressure fire drill to identify the source, assess the blast radius, and backfill correct data, often under intense scrutiny.

As one team described it, the worst-case scenario is "leadership discovering missing data in executive reports due to lack of central monitoring." This is the detection channel you want to eliminate. Traditional monitoring, focused on infrastructure health (CPU, memory) and basic execution status, simply isn't equipped to catch these data-centric failures.

## The Four Essential Signals for Effective Pipeline Monitoring

To catch silent failures, you need to monitor signals that reflect the state of the data, not just the pipeline. Four categories of metrics give you the full view of your pipeline's health.

| Signal | What it Measures | What it Catches | What it Misses |
| --- | --- | --- | --- |
| **Execution** | Pipeline run status, duration, latency | Outright failures, performance degradation, resource bottlenecks | Incorrect but successfully processed data, content-level errors |
| **Freshness** | Time since the last data update | Stale data, upstream source delays, missed schedules | Incorrect data values, volume anomalies, schema changes |
| **Volume** | Row counts, file sizes, record changes | Partial data loads, empty files, unexpected data drops or spikes | Stale data, incorrect data types, subtle content errors |
| **Schema** | Data structure, column types, formats | Unexpected changes from source systems, breaking API updates | Data freshness issues, incorrect data values, volume drops |

### Execution Metrics
This is the baseline: did the job run, did it finish, and how long did it take? These metrics catch obvious breakages, performance regressions, and resource contention issues like infinite loops or stuck processes. Most orchestration tools provide this out of the box.

### Data Freshness
Freshness monitoring answers the question: "Is my data as recent as I expect it to be?" It involves tracking the timestamp of the latest record or file and comparing it against an expected interval. This is the first line of defense against problems like a source system failing to export new data or a scheduled trigger being missed. As one team noted, this helps avoid "stale data undetected for hours or days" caused by silent script errors.

### Data Volume
Volume metrics track the amount of data processed. This can be row counts in a database table, file sizes in object storage, or the number of records in a message queue. A sudden, unexpected drop in volume can indicate a partial data load or an issue with an upstream data source, even if the pipeline itself completed without error.

### Schema Drift
Schema drift occurs when the structure of your data changes unexpectedly—a column is added or removed, a data type changes, or a field is renamed. These changes can cause downstream processes to fail or, worse, silently corrupt data. Monitoring the schema and creating alerts for any deviation from the expected structure prevents these breakages.

## Data Pipeline Monitoring vs. Data Observability: Drawing the Line

While related, pipeline monitoring and data observability are not the same. Understanding the distinction helps in choosing the right tools and strategies.

*   **Data Pipeline Monitoring** focuses on the **operational health of the pipeline's infrastructure and execution**. It answers questions like: "Did my pipeline run successfully and on time?" and "Are the workers healthy?"
*   **Data Observability** focuses on the **quality, health, and reliability of the data itself**. It goes deeper, answering questions like: "Is the data fresh, accurate, and complete?" and "Has the distribution of values in this column changed?"

In short, monitoring tells you if the system is working; observability tells you if the data makes sense.

| Dimension | Data Pipeline Monitoring | Data Observability |
| --- | --- | --- |
| **Focus** | Pipeline health, execution status | Data health, content quality |
| **Scope** | Infrastructure, tasks, workflows | Datasets, tables, schemas, values |
| **Primary Questions** | Did it run? Was it on time? Did it fail? | Is the data fresh? Is it complete? Is it accurate? |
| **Example Tools** | Orchestrator UI (Kestra), Prometheus, Grafana | Monte Carlo, Soda, Great Expectations |
| **Kestra's Role** | Native execution monitoring, alerting, custom checks | Orchestrates observability tools, acts on their findings |

You need monitoring for any production pipeline. You need to invest in a full data observability platform when the cost of subtle, content-level data errors is high.

## Orchestrate Proactive Data Pipeline Monitoring with Kestra: A Practical Example

An orchestration platform is the ideal place to implement monitoring checks, as it has context over the entire workflow. Instead of a separate system polling for status, you can build monitoring directly into your data pipelines.

This Kestra flow demonstrates how to monitor a critical PostgreSQL table for freshness, volume, and schema drift, sending a detailed Slack alert if any anomaly is detected.

```yaml
id: critical-data-feed-monitor
namespace: company.data.monitoring

description: Monitors a critical PostgreSQL table for freshness, volume, and schema drift. Sends a Slack alert on any anomaly.

triggers:
  - id: hourly-check
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 * * * *"

tasks:
  - id: get-monitoring-metrics
    type: io.kestra.plugin.jdbc.postgresql.Query
    url: "{{ secret('POSTGRES_URI') }}"
    username: "{{ secret('POSTGRES_USER') }}"
    password: "{{ secret('POSTGRES_PASSWORD') }}"
    sql: |
      SELECT 
        (SELECT MAX(updated_at) FROM public.users) as last_updated,
        (SELECT COUNT(*) FROM public.users) as row_count;
    fetchOne: true

  - id: check-for-anomalies
    type: io.kestra.plugin.core.flow.If
    condition: |
      {{ outputs['get-monitoring-metrics'].row.last_updated < now() | dateAdd(-1, 'HOURS') or 
         outputs['get-monitoring-metrics'].row.row_count < 1000 }}
    then:
      - id: send-alert
        type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
        url: "{{ secret('SLACK_WEBHOOK_URL') }}"
        payload: |
          {
            "text": ":alert: *Critical Data Pipeline Anomaly Detected for `public.users`*",
            "attachments": [
              {
                "color": "#FF0000",
                "fields": [
                  { "title": "Last Updated", "value": "{{ outputs['get-monitoring-metrics'].row.last_updated }}", "short": true },
                  { "title": "Row Count", "value": "{{ outputs['get-monitoring-metrics'].row.row_count }}", "short": true },
                  { "title": "Anomaly Type", "value": "{% if outputs['get-monitoring-metrics'].row.last_updated < now() | dateAdd(-1, 'HOURS') %}Stale Data{% endif %}{% if outputs['get-monitoring-metrics'].row.row_count < 1000 %} Low Volume{% endif %}" }
                ]
              }
            ]
          }

errors:
  - id: alert-on-failure
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      { "text": ":bangbang: *Data pipeline monitoring flow `{{ flow.id }}` failed! Execution: `{{ execution.id }}`*" }
```

### What's worth noticing in this flow:
*   **Unified Checks:** The flow combines freshness (`last_updated`) and volume (`row_count`) checks in a single, efficient query.
*   **Declarative Logic:** The entire monitoring process, including thresholds (`< now() | dateAdd(-1, 'HOURS')`, `< 1000`), is defined in version-controlled YAML, making it transparent and auditable.
*   **Actionable Alerts:** The Slack notification provides immediate context on *what* went wrong (Stale Data, Low Volume), not just that a pipeline failed.
*   **Built-in Error Handling:** A dedicated `errors` block ensures that if the monitoring flow itself fails (e.g., due to a database connection issue), the team is immediately notified.

## Building an Alerting Strategy People Will Actually Read

Effective monitoring is useless if its alerts are ignored. "Alert fatigue" is a common failure mode where teams are inundated with so many low-priority notifications that they begin to tune them out, eventually missing the critical ones.

*   **Tier Your Alerts:** Not all alerts are created equal. Define severity levels. A critical failure that impacts production data should trigger a PagerDuty alert and wake someone up. A warning about a non-critical pipeline delay can be a Slack message.
*   **Route Intelligently:** Send alerts to the team that owns the process. A generic `#data-alerts` channel quickly becomes noise.
*   **Alert on Symptoms, Provide Cause:** The alert should state the user-facing impact ("Customer dashboard data is stale") but provide debugging information that points to the cause ("Upstream API is unresponsive").
*   **Optimize for Off-Hours Recovery:** An alert at 3 AM should contain everything an on-call engineer needs: a clear description of the problem, a link to the failed execution, and a link to a runbook. This context is vital when dealing with what one team called the "difficulty with job recovery and troubleshooting during off-hours."

## When Monitoring Becomes the Problem: Cost and Complexity

As data platforms scale, the monitoring systems themselves can become a source of cost and operational complexity.

*   **Log Volume and Database Bloat:** Storing detailed execution logs for thousands of daily pipeline runs can strain your orchestration backend, especially if it's a relational database. One team identified "Postgres database performance bloat from execution logs" as a major scaling challenge.
*   **Provider Quotas and Limits:** Cloud services often impose limits on logging APIs, concurrency, and data streaming, which can be hit by a high-throughput monitoring setup.
*   **Cost Optimization:** Retaining all logs indefinitely is expensive. Implement a data retention policy: decide what to keep in hot storage for immediate debugging, what to ship to cheaper, long-term storage like S3 for compliance, and what to discard. Decoupling logs from the main orchestration database is a key architectural pattern for scalability.

## Kestra's Role in a Data Pipeline Monitoring Toolkit

No single tool solves all monitoring challenges. An effective strategy combines the strengths of different platforms.

Your orchestrator is the first and most critical line of defense. Kestra provides built-in execution logs, metrics, and a visual topology of every run, giving you immediate insight into the operational health of your pipelines. You can check our guide on how to [configure monitoring with Grafana and Prometheus](/docs/how-to-guides/monitoring) for more details.

By using Kestra's declarative workflows and extensive plugin library (over 1,700+ plugins), you can build custom monitoring and data quality checks directly into your pipelines, as shown in the example above. This allows Kestra to act as the central nervous system, coordinating both the data workflows and the specialized tools that ensure data quality, such as Soda, Great Expectations, or a dedicated data observability platform.

## Related Concepts

*   [Data Quality: Checks, Tests, and Ownership](/resources/data/data-quality)
*   [How to Create a Data Pipeline](/resources/data/create-data-pipeline)
*   [What is Data Ingestion?](/resources/data/what-is-data-ingestion)
*   [Orchestrate Data Pipelines (docs)](/docs/use-cases/data-pipelines)
*   [ETL Orchestration Tool Alternatives](/resources/data/etl-orchestration-tool-alternatives)
*   [Open Source ETL Tools](/resources/data/open-source-etl-tool)

Kestra provides the declarative control plane to build, run, and monitor all your data pipelines. Explore our [data orchestration features](/data) to see how.
