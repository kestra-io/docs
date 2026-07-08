---
title: "pg_cron: Scheduling Jobs in Postgres — and Its Limits"
description: "pg_cron runs SQL on a cron schedule inside PostgreSQL itself. This guide covers how it works, where it shines, where it fails silently — and what to do when your database cron outgrows the database."
metaTitle: "pg_cron: Postgres Job Scheduling & Its Limits"
metaDescription: "pg_cron schedules SQL jobs inside PostgreSQL. Learn how it works, its silent-failure blind spots, and when to move scheduling out of the database."
tag: data
date: 2026-07-08
faq:
  - question: "What is pg_cron?"
    answer: "pg_cron is an open-source PostgreSQL extension (originally by Citus Data) that runs SQL commands on a cron schedule inside the database itself, using a background worker. Jobs are managed with SQL — cron.schedule() and cron.unschedule() — and require no external scheduler or infrastructure."
  - question: "How do I install pg_cron?"
    answer: "Add pg_cron to shared_preload_libraries in postgresql.conf, restart Postgres, then run CREATE EXTENSION pg_cron in the target database. Most managed services support it natively — Amazon RDS/Aurora, Cloud SQL, Azure Database for PostgreSQL, and Supabase all offer it as a supported extension."
  - question: "Does pg_cron retry failed jobs?"
    answer: "No. A failed run is recorded in the cron.job_run_details table with its error message, and the job simply waits for its next scheduled time. There are no retries, no backoff, and no alerting — noticing failures is entirely up to you, typically by polling job_run_details."
  - question: "How do I see pg_cron job history?"
    answer: "Query the cron.job_run_details table, which records each run's start and end time, status, and return message. It grows unbounded by default, so schedule a periodic cleanup — commonly with a pg_cron job that purges its own history table."
  - question: "Can pg_cron run jobs on other databases or systems?"
    answer: "Only within PostgreSQL: jobs can target another database on the same instance (or a remote Postgres via cron.schedule_in_database and configuration), but pg_cron cannot call APIs, move files, or touch anything that is not Postgres. Cross-system work needs an external scheduler or orchestrator."
  - question: "When should I move from pg_cron to an orchestrator?"
    answer: "Move when a job needs retries and alerting, when jobs depend on each other, when the work spans more than Postgres (files, APIs, warehouses), or when auditors ask for run history you cannot comfortably produce from a table. Keep pg_cron for small, self-contained maintenance jobs — it is excellent at those."
---

> **TL;DR** — pg_cron is a PostgreSQL extension that runs SQL commands on a cron schedule directly inside the database, with no external scheduler required. It is ideal for small maintenance jobs like refreshing materialized views or purging old rows — but jobs stay invisible outside Postgres: no retries, no alerting, and no coordination with other systems.

Somewhere in most Postgres installations there is a materialized view that must refresh nightly, a partition to rotate, ninety days of raw events to purge. pg_cron exists because standing up scheduling infrastructure for jobs like these feels absurd — and it is. One extension, one `cron.schedule()`, and the database maintains itself.

That convenience is real, which is exactly why pg_cron deployments grow until they cross a line nobody drew: the day the jobs stop being maintenance and start being your data pipeline.

## How pg_cron works

pg_cron is a background worker inside PostgreSQL. Once the extension is loaded (`shared_preload_libraries`) and created, scheduling is just SQL:

```sql
-- Refresh a materialized view every night at 03:30
SELECT cron.schedule(
  'refresh-daily-orders',
  '30 3 * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.daily_orders$$
);

-- Purge old events every Sunday
SELECT cron.schedule(
  'purge-raw-events',
  '0 4 * * 0',
  $$DELETE FROM events.raw WHERE created_at < now() - interval '90 days'$$
);
```

Jobs live in the `cron.job` table; every run is logged to `cron.job_run_details` with status and error message. Standard cron syntax applies, and managed Postgres services — RDS, Aurora, Cloud SQL, Azure, Supabase — support the extension natively, which is a big part of why it became the default answer to "how do I schedule things in Postgres?"

**What it is genuinely good at:** self-contained maintenance touching only this database — view refreshes, partition management, history cleanup, `VACUUM ANALYZE` on chosen tables, small periodic aggregations. For these, adding an external tool is overhead without benefit.

## Where pg_cron fails you — silently

pg_cron's limits all share a shape: **the scheduler can only see, and only tell, the database it lives in.**

- **Failures are silent by design.** A failed run writes a row to `job_run_details` and waits for next time. No retries, no backoff, no alert. The standard war story: a materialized view refresh that had been failing for three weeks, caught by a stakeholder, not a monitor. Noticing failures means polling a table — with tooling you now have to build.
- **No dependencies.** Jobs are independent cron lines. "Refresh B after A succeeds" becomes staggered schedule times and hope — the exact anti-pattern that made everyone abandon crontabs on VMs.
- **SQL only, one system only.** The moment the nightly job needs to export the refreshed view to S3, call an API, or warn a Slack channel, pg_cron is out of its jurisdiction.
- **Scheduling load on the primary.** Jobs consume database connections and run on your production instance — a heavy scheduled query and a traffic spike will happily coincide.

## When your cron outgrows the database

The graduation path isn't to abandon the SQL — it's to move the *scheduling and reliability* out while the SQL stays exactly what it was. The same nightly maintenance, orchestrated externally:

```yaml
id: postgres-nightly-maintenance
namespace: company.data

tasks:
  - id: refresh_and_purge
    type: io.kestra.plugin.jdbc.postgresql.Queries
    url: "jdbc:postgresql://{{ secret('PG_HOST') }}:5432/analytics"
    username: "{{ secret('PG_USERNAME') }}"
    password: "{{ secret('PG_PASSWORD') }}"
    sql: |
      REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.daily_orders;
      DELETE FROM events.raw WHERE created_at < now() - interval '90 days';
    retry:
      type: exponential
      interval: PT10S
      maxInterval: PT5M
      maxAttempt: 4

triggers:
  - id: nightly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "30 3 * * *"
```

Worth noticing — each bullet is a pg_cron blind spot, closed:

- **Lock contention gets retried, not ignored.** `REFRESH ... CONCURRENTLY` failing on a lock is transient; exponential backoff absorbs it, and only exhausted retries fail the run.
- **Failure is an event, not a table row.** A failed execution can alert a channel via an `errors` branch — the three-weeks-of-silent-failure story becomes structurally impossible.
- **The pipeline can grow sideways.** Add an export-to-S3 step or a data-quality check after the refresh and it is two more tasks in the same file — no jurisdiction problem.
- **Run history is an execution view**, not a self-managed log table that itself needs a cleanup job.

### Keep pg_cron, or move out?

Honest rule: **pg_cron for micro-jobs that start and end in one database; an orchestrator for anything that is secretly a pipeline.** Purging a history table? pg_cron, forever, happily. A refresh that feeds a dashboard the business reads every morning? That job has an SLA, and an SLA needs retries, alerting, and visible history — capabilities that were never pg_cron's job to provide. The tell is usually the second system: the first time you think "…and then push it somewhere," you have outgrown the extension.

## Related concepts

[Change data capture](/resources/data/change-data-capture) · [Data orchestration](/resources/data/data-orchestration) · [Retries in Kestra](/docs/workflow-components/retries) · [Schedule trigger](/docs/workflow-components/triggers/schedule-trigger)
