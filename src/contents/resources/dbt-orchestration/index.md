---
title: "dbt Orchestration: Running dbt as Part of Production Pipelines"
description: "dbt orchestration extends dbt's transformation capabilities with advanced scheduling, error handling, state management, and integration across your data stack. Learn how to build production-grade data pipelines with dbt."
metaTitle: "dbt Orchestration: Schedule, Chain and Monitor dbt"
metaDescription: "Orchestrate dbt for production: trigger builds after ingestion, run only changed models with state-aware execution, retry failures, and alert on errors."
tag: "data"
date: 2026-09-25
slug: "dbt-orchestration"
faq:
  - question: "Can dbt do orchestration?"
    answer: "dbt is primarily a data transformation tool, not a full-fledged orchestrator. While dbt Cloud offers basic job scheduling, it lacks advanced features like complex dependency management across external systems, event-driven triggers, custom error handling, or integrating non-dbt tasks. For production-grade pipelines, dbt relies on external orchestration tools to manage its runs alongside other data operations."
  - question: "Is dbt SQL or Python?"
    answer: "dbt models are defined using SQL, leveraging Jinja templating for dynamic logic. While dbt primarily processes SQL, it can integrate with Python for specific tasks like data quality checks or custom transformations through dbt Python models. The core of dbt's transformation logic remains SQL-centric, though."
  - question: "What does ETL orchestration mean?"
    answer: "ETL orchestration refers to coordinating the entire Extract, Transform, Load process. This includes scheduling data extraction from sources, triggering data transformations (like dbt models), and loading processed data into target systems. It ensures dependencies are met, errors are handled, and the overall data pipeline runs reliably and efficiently."
  - question: "Is dbt Core still available?"
    answer: "Yes, dbt Core is and will remain open-source and freely available. It is the command-line tool that allows users to develop, run, and document dbt projects. dbt Cloud builds on dbt Core by adding a hosted environment, a UI, enhanced scheduling, and collaboration features."
  - question: "Is dbt Core free to use?"
    answer: "Yes, dbt Core is completely free and open-source under the Apache 2.0 license. Users can download and run it locally or deploy it on their own infrastructure. The commercial offerings, like dbt Cloud, provide additional managed services and features built around dbt Core."
  - question: "Who shouldn't use dbt?"
    answer: "dbt might not be the best fit for teams that primarily need row-level data manipulation, real-time stream processing, or complex procedural logic that is difficult to express in SQL. Teams without a strong SQL foundation or those exclusively working with unstructured data might also find dbt's model-centric approach less suitable. It's best for batch-oriented, SQL-based transformations."
---

> **TL;DR** — dbt orchestration is the layer that decides when dbt runs and what surrounds it: it triggers builds after ingestion, runs only the models that changed, retries failures, alerts the team, and connects dbt to the systems upstream and downstream. dbt defines the transformations; the orchestrator makes them a reliable production pipeline.

dbt has revolutionized how data teams transform data in their warehouses, bringing software engineering best practices to analytics. Yet dbt only reaches production when it is paired with an orchestrator. While dbt excels at defining transformations, it relies on external systems to manage its lifecycle: from triggering runs based on events to handling complex dependencies, ensuring state-aware execution, and integrating with the broader data and infrastructure stack. This article explores why dedicated orchestration is essential for dbt projects and how to build resilient, production-grade dbt pipelines.

## How dbt orchestration works

At its core, dbt orchestration operates on a principle of separation of concerns. dbt handles the "what" of data transformation: defining models, tests, and dependencies within the data warehouse. An orchestrator handles the "when" and "how": coordinating the execution of these transformations within a larger workflow.

The orchestrator's job is to trigger dbt CLI commands (like `dbt build` or `dbt test`) at the right time and in the right context. This involves:
- **Scheduling:** Running dbt jobs on a fixed schedule (e.g., daily, hourly).
- **Event-driven triggers:** Initiating dbt runs based on external events, such as the arrival of new data from an ingestion tool.
- **Dependency management:** Ensuring that upstream tasks (like data loading) are complete before starting a dbt run, and that downstream tasks (like updating a BI dashboard) are triggered upon its successful completion.
- **Parameterization:** Passing dynamic parameters to dbt runs, such as dates or environment-specific configurations.

This coordination turns standalone dbt models into reliable components of a fully automated [data pipeline](/resources/data/data-pipeline). A well-defined [orchestration flow](/docs/workflow-components/flow) provides the control and visibility necessary for production environments.

## Why dbt projects need an orchestrator

While dbt Cloud offers a native scheduler, production data platforms often require more sophisticated coordination that extends beyond the capabilities of a simple job scheduler.

- **Beyond basic scheduling:** Cron-based scheduling is a starting point, but real-world pipelines need to react to events. A dbt run should start when new data lands from Airbyte, not at a fixed time, to ensure freshness and efficiency.
- **Dependency management:** A dbt model is rarely an island. The orchestrator manages the entire chain, from data ingestion and [data quality](/resources/data/data-quality) checks to running dbt models and then feeding the results into reverse ETL tools or machine learning models.
- **Error handling & recovery:** Production pipelines fail. An orchestrator provides recovery mechanisms like automated retries with exponential backoff, custom alerting to Slack or PagerDuty, and the ability to define specific failure branches to handle issues gracefully without manual intervention.
- **State-aware execution:** Rebuilding all dbt models on every run is inefficient and costly. [State-aware orchestration](https://docs.getdbt.com/reference/node-selection/state-selection) runs only the models impacted by changes in data or code, significantly reducing computation time and warehouse costs.
- **CI/CD integration:** A mature [CI/CD orchestration](/resources/infrastructure/ci-cd-orchestration) process for dbt involves more than just running tests. It includes automatically deploying projects, managing different environments (dev, staging, prod), and promoting artifacts in a governed way.
- **Resource management:** Orchestrators can run dbt jobs in isolated environments, such as Docker containers. This ensures that each run has the exact dependencies it needs, preventing conflicts and making the pipeline more portable and reproducible.

## Orchestrate dbt with Kestra: a state-aware pipeline example

Kestra provides a declarative, YAML-based approach to orchestrating dbt workflows. Instead of writing Python DAGs, you define your entire pipeline, including Git operations, dbt commands, and notifications, in a single version-controlled configuration file.

The following example demonstrates a daily, state-aware dbt pipeline. It automatically clones the dbt project from a Git repository, runs only the modified models, and sends a detailed Slack alert if any step fails.

```yaml
id: dbt_state_aware_daily_run
namespace: company.team
description: Runs dbt daily on the models changed since the last run, and alerts Slack on failure.

inputs:
  - id: dbt_git_repo
    type: STRING
    defaults: "https://github.com/your-org/your-dbt-project.git"
  - id: dbt_git_branch
    type: STRING
    defaults: main
  - id: dbt_profile
    type: STRING
    defaults: your_warehouse_profile

tasks:
  - id: dbt
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_dbt_project
        type: io.kestra.plugin.git.Clone
        url: "{{ inputs.dbt_git_repo }}"
        branch: "{{ inputs.dbt_git_branch }}"

      - id: dbt_build_state_aware
        type: io.kestra.plugin.dbt.cli.DbtCLI
        containerImage: ghcr.io/dbt-labs/dbt-postgres:1.8.0
        loadManifest:
          key: manifest.json
          namespace: "{{ flow.namespace }}"
        storeManifest:
          key: manifest.json
          namespace: "{{ flow.namespace }}"
        commands:
          - dbt deps
          - dbt build --select state:modified+ --defer --state ./target
        profiles: |
          {{ inputs.dbt_profile }}:
            target: prod
            outputs:
              prod:
                type: postgres
                host: "{{ secret('DBT_HOST') }}"
                port: 5432
                user: "{{ secret('DBT_USER') }}"
                password: "{{ secret('DBT_PASSWORD') }}"
                dbname: "{{ secret('DBT_DBNAME') }}"
                schema: analytics
                threads: 4

triggers:
  - id: daily_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 8 * * *"

errors:
  - id: send_slack_alert
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    payload: |
      {
        "text": "dbt pipeline {{ flow.namespace }}.{{ flow.id }} failed, execution {{ execution.id }}."
      }
```

A few things are worth noticing in this workflow:
- **Declarative & Version-Controlled:** The entire pipeline is a single YAML file that can be stored in Git alongside your dbt project, ensuring a single source of truth.
- **State-Aware Execution:** `loadManifest` restores the previous run's `manifest.json` from the KV Store and `storeManifest` saves the new one, so `dbt build --select state:modified+` with [`--defer`](https://docs.getdbt.com/reference/node-selection/defer) rebuilds only the models that changed, saving time and compute.
- **Shared Working Directory:** The clone and the dbt build sit inside a `WorkingDirectory` task, so dbt sees the files the clone just fetched.
- **Integrated Error Handling:** The `errors` block runs only when a task fails, and sends the flow and execution identifiers to Slack without extra code.
- **Isolated Environment:** The `containerImage` property ensures that dbt runs in a specific, containerized environment, guaranteeing consistency and avoiding dependency conflicts.

### Choosing your dbt orchestration strategy

The right tool for dbt orchestration depends on your team's needs.
- **dbt Cloud Scheduler:** For teams whose workflows live entirely within dbt and require simple, time-based scheduling, the native [dbt Cloud scheduler](/orchestration/dbt-cloud) is a convenient and well-integrated option.
- **External Orchestrator (Kestra, Airflow):** For teams that need to integrate dbt with the rest of their stack, an external orchestrator is essential. This is the case when you need to trigger dbt runs from upstream tools, manage complex dependencies with non-dbt systems (like [Databricks Workflows](/vs/databricks-workflows)), or require advanced error handling and event-driven capabilities. Comparing tools like [Airflow vs Kestra](/vs/airflow) often comes down to preferring declarative YAML over Python scripting and seeking a more language-agnostic platform.

## Where dbt orchestration pays off

Implementing a dedicated orchestration layer for your dbt projects delivers significant returns:

- **Enhanced Reliability:** With automated retries, dependency checks, and proactive alerting, pipelines become more resilient, reducing manual intervention and firefighting.
- **Cost Optimization:** State-aware and event-driven runs prevent unnecessary computation in the data warehouse, directly lowering costs.
- **Improved Data Quality:** Orchestration allows you to embed data quality tests and validation steps directly into your pipelines, catching issues before they impact downstream consumers.
- **Faster Development Cycles:** By automating the testing and deployment process, teams can ship changes to dbt projects faster and more confidently.
- **Unified Observability:** A central orchestrator provides a single place for [data pipeline monitoring](/resources/data/data-pipeline-monitoring) and [workflow observability](/resources/infrastructure/workflow-observability), making it easier to debug issues across the entire data stack.

## Related concepts

- [What Is dbt in Data Engineering?](/resources/data/what-is-dbt-in-data-engineering)
- [dbt Integrations for Data Orchestration](/resources/data/dbt-integrations)
- [dbt on Airflow vs Kestra: Orchestration Comparison](/resources/data/dbt-on-airflow-vs-kestra)
- [ETL Workflow Explained](/resources/data/etl-workflow)
- [GitOps for Data and Infrastructure Pipelines](/resources/infrastructure/gitops)
- [What Is Data Orchestration?](/resources/data/data-orchestration)
