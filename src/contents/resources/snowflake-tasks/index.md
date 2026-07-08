---
title: "Snowflake Tasks: Scheduling Inside vs Outside Snowflake"
description: "Snowflake Tasks run SQL on a schedule directly inside the warehouse. This guide explains how they work, what they cost, where they stop — and how to orchestrate Snowflake from outside when pipelines span more than one system."
metaTitle: "Snowflake Tasks: Inside vs Outside Scheduling"
metaDescription: "Snowflake Tasks schedule SQL inside the warehouse. Learn how they work, what they cost, their limits — and when an external orchestrator is the better call."
tag: data
date: 2026-07-08
faq:
  - question: "What are Snowflake Tasks?"
    answer: "Snowflake Tasks are Snowflake's built-in scheduling objects: a task wraps a single SQL statement or stored procedure call and runs it on a cron schedule or after a parent task completes. Chained tasks form a task graph — a simple DAG that lives and runs entirely inside Snowflake."
  - question: "Do Snowflake Tasks cost money?"
    answer: "Yes — tasks consume compute. A task runs either on a user-managed virtual warehouse (billed per-second while it runs, with auto-resume) or on serverless compute managed by Snowflake (billed per-second of actual usage at a slight premium). A forgotten task on an oversized warehouse is a classic source of silent credit burn."
  - question: "What is the difference between Snowflake Tasks and Streams?"
    answer: "They solve different halves of one problem. A Stream tracks what changed in a table (change data capture inside Snowflake); a Task is the scheduler that periodically consumes those changes. The canonical pattern pairs them: a task that runs when a stream has data, processes the delta, and advances the stream offset."
  - question: "Can a Snowflake Task call an external system?"
    answer: "Not directly. Tasks execute SQL and stored procedures inside Snowflake. External access requires workarounds like external functions or external network access from procedures — at which point you are building an orchestrator inside your warehouse, paying warehouse rates for glue logic."
  - question: "How do I monitor Snowflake Task failures?"
    answer: "Task history lives in the TASK_HISTORY table function and ACCOUNT_USAGE views, and you can attach error notifications to cloud messaging services. What Snowflake does not provide is workflow-level observability: cross-task retry policies, alert routing, or a single view of a pipeline that spans tasks and non-Snowflake systems."
  - question: "When should I use an external orchestrator instead of Snowflake Tasks?"
    answer: "When a pipeline touches anything outside Snowflake (ingestion, APIs, ML, notifications), when you need real retry and alerting policies, when you want backfills and event-driven triggers, or when task graphs have grown past a handful of steps. Keep tasks for small warehouse-local chains; orchestrate everything else from outside."
---

> **TL;DR** — Snowflake Tasks are Snowflake's built-in scheduler: SQL statements that run on a cron schedule or after a parent task completes, organized in simple task graphs. They are convenient and cost-efficient for warehouse-local jobs, but they only see Snowflake — cross-system pipelines, retry policies with alerting, and event-driven triggers require an external orchestrator.

Snowflake ships its own scheduler, and for a certain class of job it is genuinely the shortest path: `CREATE TASK`, a cron expression, a SQL statement, done. The question that matters isn't whether Snowflake Tasks work — they do — but where they stop, because that boundary is where most Snowflake-centric data platforms end up rebuilding orchestration by accident.

## How Snowflake Tasks work

A task is a schema-level object that wraps exactly one SQL statement or stored procedure call:

```sql
CREATE TASK analytics.refresh_daily_orders
  WAREHOUSE = transform_wh
  SCHEDULE = 'USING CRON 0 2 * * * UTC'
AS
  CALL analytics.refresh_orders();
```

Three mechanics define the model:

- **Scheduling** — a cron expression or a fixed interval on the *root* task only. Child tasks declare `AFTER parent_task` instead, forming a **task graph**: a DAG of up to a few hundred tasks, with one schedule at the root.
- **Compute** — each run executes either on a user-managed warehouse (per-second billing, auto-resume — and a classic source of silent credit burn when the warehouse is oversized) or on Snowflake-managed **serverless compute**.
- **Conditions** — the `WHEN` clause can gate a run, most usefully on `SYSTEM$STREAM_HAS_DATA()`: paired with a Stream, a task graph becomes an incremental processing loop that only spends compute when there are changes to process.

That last pattern — Streams for change tracking, Tasks for scheduled consumption — is the best thing about the feature, and if your entire pipeline lives inside Snowflake, it is hard to beat for simplicity.

## Where Snowflake Tasks stop

Every limitation of tasks is a variation of the same fact: **the scheduler lives inside the thing it schedules.**

- **They only see Snowflake.** A task cannot pull from an API, wait for a file on S3, trigger a dbt Cloud job, or send a Slack alert without stored-procedure gymnastics. The moment a pipeline has a step outside the warehouse, tasks can't own it.
- **Failure handling is minimal.** A failed task run can suspend the graph or notify a queue, but there are no retry policies with backoff, no alert routing, no error branches. `TASK_HISTORY` records what happened; acting on it is your problem.
- **Observability is table-shaped.** There is no execution view of a pipeline — you reconstruct runs by querying history functions, which works until the 3am incident where you need to see, not query.
- **Operational blind spots** — no backfills as a first-class concept, no event triggers beyond streams, and a graph that silently stops running when its owner's role loses a grant is a rite of passage.

None of this is a design flaw — Snowflake built a warehouse-local scheduler, not an orchestrator. The failure mode is using it as one.

## Orchestrate Snowflake from outside

An external orchestrator inverts the model: Snowflake becomes one (excellent) execution engine among the systems a pipeline touches, and scheduling, retries, alerting, and visibility live in a layer that sees everything. Here is the nightly-transform pattern in Kestra — same job as the `CREATE TASK` above, plus the things tasks can't do:

```yaml
id: snowflake-nightly-transform
namespace: company.analytics

tasks:
  - id: refresh
    type: io.kestra.plugin.jdbc.snowflake.Queries
    url: "jdbc:snowflake://{{ secret('SNOWFLAKE_ACCOUNT') }}.snowflakecomputing.com"
    username: "{{ secret('SNOWFLAKE_USERNAME') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    sql: |
      CALL analytics.refresh_orders();
      CALL analytics.refresh_customers();
    retry:
      type: exponential
      interval: PT10S
      maxInterval: PT2M
      maxAttempt: 4

  - id: quality_gate
    type: io.kestra.plugin.jdbc.snowflake.Query
    url: "jdbc:snowflake://{{ secret('SNOWFLAKE_ACCOUNT') }}.snowflakecomputing.com"
    username: "{{ secret('SNOWFLAKE_USERNAME') }}"
    password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
    sql: SELECT count(*) AS broken FROM analytics.orders WHERE order_id IS NULL;
    fetchType: FETCH_ONE

triggers:
  - id: nightly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 2 * * *"
```

Worth noticing:

- **Retries are a policy, not a hope** — transient warehouse contention gets exponential backoff; exhausted retries can route to an `errors` branch that alerts a human.
- **The quality gate is part of the pipeline** — a downstream task can assert on the result and halt before bad data propagates, something a task graph expresses awkwardly at best.
- **The same file scales sideways** — add an ingestion step before the refresh or a Slack notification after it, and the pipeline still reads top to bottom in one place. That is the step Snowflake Tasks structurally cannot take.

### Keep tasks, or move out?

The honest decision rule: **Snowflake Tasks for warehouse-local micro-chains, external orchestration for pipelines.** A two-step task graph that refreshes a materialized view off a stream is exactly what tasks are for — moving it out adds a component for no gain. The trigger to move is the first time a pipeline needs something outside Snowflake: an ingestion dependency, a real alert, a backfill, an API call. At that point, orchestrating *around* tasks (an orchestrator that triggers task graphs it cannot see into) is the worst of both worlds — orchestrate the SQL directly instead.

## Related concepts

[Change data capture](/resources/data/change-data-capture) · [Data orchestration](/resources/data/data-orchestration) · [Airflow alternatives](/resources/data/airflow-alternatives) · [Retries in Kestra](/docs/workflow-components/retries)
