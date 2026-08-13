---
title: "Cron Expression: The Universal Language of Scheduled Workflows"
description: "Understand cron expressions, their syntax, and how they define scheduled tasks. Learn to use them effectively for workflow automation, including a practical Kestra example."
metaTitle: "Cron Expression Explained: Syntax & Examples | Kestra"
metaDescription: "Master cron expressions for precise task scheduling. Learn syntax, patterns, and how Kestra orchestrates reliable, event-driven workflows with them."
tag: infrastructure
date: 2026-07-07
slug: cron-expression
faq:
  - question: "What is a cron expression?"
    answer: "A cron expression is a string of characters used to define a schedule for automated tasks or jobs. It typically consists of five fields representing minutes, hours, day of month, month, and day of week, allowing precise scheduling down to the minute. Cron expressions are widely used in Unix-like operating systems and modern orchestrators to automate repetitive tasks."
  - question: "What is an example of a cron expression?"
    answer: "A common cron expression example is `0 9 * * MON-FRI`. This expression schedules a task to run at 9:00 AM (0 minutes, 9 hours) every weekday (Monday through Friday). The asterisks (`*`) act as wildcards, meaning 'every' for the day of month and month fields."
  - question: "How do you write a cron expression for every 5 minutes?"
    answer: "To write a cron expression for a task that runs every 5 minutes, you would use `*/5 * * * *`. The `*/5` in the minute field specifies that the task should execute every fifth minute. The remaining asterisks ensure it runs every hour, every day of the month, every month, and every day of the week."
  - question: "What does `*/5` mean in cron?"
    answer: "In a cron expression, `*/5` in a field (e.g., the minute field) means 'every 5 units' of that field. For example, `*/5` in the minute field means 'at every 5th minute' (0, 5, 10, 15, etc.). This is a convenient way to specify intervals for task execution."
  - question: "What is cron used for in modern systems?"
    answer: "In modern systems, cron is used for a wide range of automated tasks, including data synchronization, report generation, system maintenance, backups, and triggering complex data pipelines. While traditional cron has limitations, its time-based scheduling concept is fundamental to modern workflow orchestration platforms like Kestra."
  - question: "How does Kestra leverage cron expressions?"
    answer: "Kestra uses cron expressions within its Schedule trigger to define when workflows should run. Unlike traditional cron, Kestra integrates these schedules with advanced orchestration features like native error handling, retries, dynamic task generation, and comprehensive observability. This transforms simple time-based triggers into robust, production-grade automated workflows."
  - question: "What are the limitations of traditional cron jobs?"
    answer: "Traditional cron jobs lack built-in error handling, retry mechanisms, logging, and observability, making them difficult to manage and debug at scale. They are also tightly coupled to the host machine, lack event-driven capabilities, and offer limited flexibility for complex dependencies, leading to operational overhead in production environments."
---

> **TL;DR** — A cron expression is a string used to define a schedule for automated jobs. It consists of five fields representing minutes, hours, day of month, month, and day of week, enabling precise, time-based task automation in systems from Unix to modern orchestrators.

For decades, cron expressions have been the silent workhorse of automated tasks, reliably triggering scripts and commands at precise intervals. From system maintenance to data backups, this simple yet powerful syntax has enabled countless time-based automations across Unix-like systems.

However, as modern data, AI, and infrastructure operations grow in complexity, the limitations of traditional cron jobs become apparent. Orchestrating intricate workflows requires more than just time-based triggers; it demands robust error handling, dynamic execution, comprehensive observability, and seamless integration with diverse tools. This guide will demystify cron expressions and then show how Kestra elevates them into a foundational component for resilient, production-ready workflow orchestration.

## Understanding Cron Expressions: The Time-Based Scheduler

Cron (derived from "chronos," the Greek word for time) is a time-based job scheduler in Unix-like computer operating systems. A cron expression is the specific string format that tells the cron daemon when to execute a command or script. Its ubiquity and simplicity have made it the de facto standard for defining schedules across a vast array of tools, platforms, and programming languages.

### Deconstructing the Cron Syntax: Fields and Special Characters

A standard cron expression is composed of five fields, separated by spaces. Each field represents a unit of time. Some modern implementations, like Quartz Scheduler, extend this with optional sixth (seconds) and seventh (year) fields.

Here's the breakdown of the standard five-field syntax:

| Field         | Allowed Values | Allowed Special Characters |
|---------------|----------------|----------------------------|
| Minute        | 0 - 59         | `*` `,` `-` `/`            |
| Hour          | 0 - 23         | `*` `,` `-` `/`            |
| Day of Month  | 1 - 31         | `*` `,` `-` `?` `L` `W`      |
| Month         | 1 - 12 (or names)| `*` `,` `-`                |
| Day of Week   | 0 - 7 (or names)| `*` `,` `-` `?` `L` `#`      |

*Note: Both 0 and 7 can represent Sunday in the Day of Week field.*

To build complex schedules, you use a set of special characters:

*   **`*` (Asterisk/Wildcard):** Represents "every". An asterisk in the `Hour` field means the job runs every hour.
*   **`,` (Comma):** Specifies a list of values. `1,15` in the `Day of Month` field means the job runs on the 1st and 15th of the month.
*   **`-` (Hyphen):** Defines a range of values. `MON-FRI` in the `Day of Week` field schedules the job for every weekday.
*   **`/` (Slash/Step):** Specifies intervals. `*/15` in the `Minute` field means "every 15 minutes".
*   **`?` (Question Mark):** Used in either the `Day of Month` or `Day of Week` field to signify "no specific value". This is useful when you need to specify one but not the other.
*   **`L` (Last):** Has different meanings in different fields. In `Day of Month`, it means the last day of the month. In `Day of Week`, it means the last day of the week (Saturday).
*   **`W` (Weekday):** Specifies the weekday (Monday-Friday) nearest the given day. `15W` means the nearest weekday to the 15th of the month.
*   **`#` (Hash):** Specifies the "Nth" day of the month. `TUE#3` means the third Tuesday of the month.

## Crafting Effective Cron Schedules: Examples and Patterns

Understanding the syntax is the first step. The real power comes from combining these fields and characters to create precise schedules.

### Common Cron Expression Examples for Daily Operations

*   **Run every minute:** `* * * * *`
*   **Run every hour at the top of the hour:** `0 * * * *`
*   **Run every day at 9:00 AM:** `0 9 * * *`
*   **Run every Monday at 10:30 AM:** `30 10 * * MON`
*   **Run at midnight on January 1st:** `0 0 1 1 *`

### Advanced Scheduling with Interval and Range Patterns

*   **Run every 5 minutes:** `*/5 * * * *`
*   **Run every 3 hours:** `0 */3 * * *`
*   **Run at 9:00 AM and 5:00 PM every day:** `0 9,17 * * *`
*   **Run every 15 minutes between 9:00 AM and 5:00 PM on weekdays:** `*/15 9-17 * * MON-FRI`
*   **Run at midnight on the first day of every quarter:** `0 0 1 */3 *`

## Why Modern Workflows Demand More Than Basic Cron

While cron is excellent for simple, time-based triggers, relying on traditional `crontab` files for critical production workflows exposes significant operational weaknesses:

*   **No Native Error Handling:** If a cron job fails, it fails silently. There are no built-in retry mechanisms or alerting systems.
*   **Poor Observability:** Logs are often scattered across different files or systems, with no centralized view to diagnose issues or audit past runs.
*   **Single Point of Failure:** Cron jobs are tied to a specific machine. If that host goes down, all its scheduled tasks are lost.
*   **Limited to Time-Based Triggers:** Cron cannot react to events, such as a file arriving in storage or an API call.
*   **Complex Dependency Management:** Orchestrating sequences of jobs is difficult and often requires brittle, custom scripting.
*   **Lack of Version Control:** `crontab` files are hard to manage collaboratively, review, and roll back, violating Infrastructure-as-Code principles.

## Orchestrate Scheduled Tasks with Kestra's Cron Trigger: Automated Reporting Scenario

Kestra addresses these limitations by integrating cron expressions into a modern orchestration platform. The [Schedule trigger](/docs/workflow-components/triggers/schedule-trigger) uses the same familiar cron syntax but embeds it within a declarative, observable, and fault-tolerant workflow.

Consider a daily reporting workflow that extracts data from a PostgreSQL database, processes it with a Python script, and logs the result.

```yaml
id: daily_report_generation
namespace: company.team

description: "Scheduled daily workflow to extract data, process it, and log completion, with error handling."

triggers:
  - id: daily_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 8 * * *" # Every day at 8:00 AM

tasks:
  - id: extract_data
    type: io.kestra.plugin.jdbc.postgresql.Query
    url: "{{ secret('POSTGRES_URL') }}"
    username: "{{ secret('POSTGRES_USERNAME') }}"
    password: "{{ secret('POSTGRES_PASSWORD') }}"
    sql: |
      SELECT
        order_id,
        customer_id,
        order_date,
        total_amount
      FROM orders
      WHERE order_date = CURRENT_DATE - INTERVAL '1 day';
    store: true # Store query results for downstream tasks

  - id: process_report_data
    type: io.kestra.plugin.scripts.python.Script
    inputFiles:
      data.csv: "{{ outputs.extract_data.uri }}"
    script: |
      import pandas as pd
      import io

      # Load data from the input file
      with open('data.csv', 'r') as f:
          df = pd.read_csv(f)

      # Example processing: calculate total sales
      total_sales = df['total_amount'].sum()
      print(f"Total sales for yesterday: ${total_sales:.2f}")

      # Save processed data (optional)
      df.to_csv('processed_data.csv', index=False)
    outputFiles:
      - processed_data.csv

  - id: log_success
    type: io.kestra.plugin.core.log.Logger
    level: INFO
    message: "Daily report generated successfully."

errors:
  - id: notify_on_failure
    type: io.kestra.plugin.core.log.Logger
    level: ERROR
    message: "Daily report generation failed for flow '{{ flow.id }}' with execution '{{ execution.id }}'. Error: {{ task.error.message }}"

```

This Kestra flow demonstrates several key advantages over a simple cron job:

*   **Declarative Scheduling:** The cron expression `0 8 * * *` is defined directly in the YAML workflow, making it version-controlled and auditable alongside the tasks it triggers.
*   **Native Error Handling:** The `errors` block provides a dedicated, reliable mechanism to catch failures from any task and execute a custom recovery or notification flow.
*   **Centralized Observability:** Every execution, including logs, metrics, and task durations, is captured and visualized in the Kestra UI, providing a complete audit trail.
*   **Polyglot Execution:** The workflow seamlessly combines a SQL query and a Python script without requiring complex wrapper scripts or environment management.
*   **Context Passing:** The output from the `extract_data` task is automatically stored and made available to the `process_report_data` task through Kestra's internal storage and expression syntax.

### Beyond Basic Schedules: Dynamic and Event-Driven Triggers

While the [Kestra Schedule trigger](/plugins/core/trigger/io.kestra.plugin.core.trigger.schedule) is a powerful cron replacement, modern automation often requires more than fixed schedules. Kestra extends this with a rich set of [event-driven triggers](/docs/workflow-components/triggers) that can start workflows based on file uploads, API calls, message queues, or the completion of other flows. This allows you to build reactive systems that respond to real-time events, a capability far beyond traditional cron.

## Where Kestra's Scheduled Orchestration Pays Off

By combining the simplicity of cron expressions with robust orchestration features, teams can reliably automate critical business processes. Common use cases include:

*   **Automated ETL/ELT:** [Schedule data workflows](/resources/data/schedule-data-workflows) to load, transform, and update data warehouses or data lakes on a daily or hourly basis.
*   **Reporting & Analytics:** Automatically generate and distribute business intelligence reports to stakeholders at the start of each business day.
*   **Infrastructure Maintenance:** Use a declarative [job scheduler](/resources/infrastructure/job-scheduler) for regular backups, log rotation, security scans, and system health checks.
*   **AI/ML Model Retraining:** Schedule recurring pipelines to retrain machine learning models with new data, ensuring they remain accurate and relevant.
*   **Data Synchronization:** Keep disparate systems, databases, and applications in sync by running synchronization jobs at regular intervals.

This approach provides a unified control plane for all your [infrastructure automation](/infra-automation) needs, from simple scheduled tasks to complex, event-driven processes.

## Related Concepts

*   [Cron Replacement: Modern Alternatives & Schedulers](/resources/infrastructure/cron-replacement)
*   [Job Scheduler: Declarative Orchestration for Workflows](/resources/infrastructure/job-scheduler)
*   [Triggers in Kestra: Schedule, Events, Webhooks](/docs/workflow-components/triggers)
*   [Schedule Trigger in Kestra – Cron-Based Scheduling](/docs/workflow-components/triggers/schedule-trigger)
*   [Schedule Plugin Documentation](/plugins/core/trigger/io.kestra.plugin.core.trigger.schedule)
*   [Kestra, Open Source Declarative Orchestration Platform](/)
