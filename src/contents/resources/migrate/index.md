---
title: "Migrate to Kestra: Guides for Moving Off Airflow and Legacy Schedulers"
description: "Practical guides for migrating pipelines to Kestra from Airflow, Dagster, cron, and legacy ETL schedulers: what changes, what stays, and a phased plan that keeps production running during the move."
metaTitle: "Migrate to Kestra: Airflow, Dagster & Cron Migration Guides"
metaDescription: "Migration guides for moving to Kestra from Airflow, Dagster, cron, and legacy schedulers: concept mappings, translated examples, and phased cutover plans."
tag: "migrate"
date: 2026-09-29
slug: "migrate"
href: /resources/migrate
faq:
  - question: "What does migrating to Kestra involve?"
    answer: "Migrating to Kestra means translating the orchestration layer (schedules, dependencies, retries, data passing, and credentials) into declarative YAML flows. The business logic itself, whether Python, SQL, dbt, Spark, or shell scripts, keeps running as it is inside script tasks. Most teams migrate pipeline by pipeline while the old system keeps running."
  - question: "Can Kestra run alongside my current orchestrator during a migration?"
    answer: "Yes. Kestra can run in parallel with the existing system for as long as the migration takes. For Airflow, the Airflow plugin lets a Kestra flow trigger existing DAGs and wait for their result, so new pipelines can be built in Kestra from day one while older ones are migrated in waves."
  - question: "Which orchestrators and schedulers can I migrate from?"
    answer: "Kestra publishes step-by-step guides for Apache Airflow, Dagster, cron, and IBM DataStage. The same approach applies to other schedulers: inventory the jobs, map their concepts to Kestra flows and triggers, run both systems in parallel, and cut over one pipeline at a time."
  - question: "Do I need to rewrite my code to migrate to Kestra?"
    answer: "No. Kestra runs code in any language in isolated containers, so existing scripts move with little or no change. What gets rewritten is the orchestration logic around them, which becomes a declarative YAML definition instead of framework-specific code."
---

Every orchestration migration has the same core problem: years of schedules, dependencies, and workarounds are encoded in a tool you want to leave, and production can't stop while you move them. The guides in this section give you a concrete plan for each source system, with concept mappings, before-and-after examples, and the pitfalls that show up when two orchestrators run side by side.

## What every migration to Kestra has in common

Whatever you are migrating from, the split is the same:

- **What stays:** your business logic. Python functions, SQL files, dbt projects, Spark jobs, and shell scripts keep running as they are. Kestra runs code in any language, each task in its own container, so you move scripts instead of rewriting them.
- **What gets translated:** the orchestration layer. Schedules become triggers, dependencies become an ordered list of tasks, retries and timeouts become task properties, credentials become secrets, and data passed between steps becomes task outputs and files in internal storage.
- **What gets simpler:** the glue code. Many custom wrappers exist only to handle retries, alerting, or file transfers. In Kestra those are built-in properties and plugins, so a large share of the old code simply disappears.

Moving an orchestration layer is real work, not a one-click import. The guides below are written to make that work predictable.

## Pick your starting point

| Migrating from | What changes most | Guide |
|---|---|---|
| Apache Airflow | Python DAGs become YAML flows; XCom, Connections, sensors, catchup, and pools need a mapping | [Airflow to Kestra migration guide](/resources/migrate/airflow-to-kestra) |
| Dagster | Asset-centric definitions become workflow-centric flows; sensors become triggers | [Dagster to Kestra migration guide](/resources/data/dagster-to-kestra-migration) |
| Cron | Crontab lines become Schedule triggers, with retries, alerting, and backfill added | [Cron to Kestra migration guide](/resources/infrastructure/migrate-from-cron) |
| IBM DataStage | Legacy ETL jobs move to cloud ETL services, with Kestra as the orchestration layer | [DataStage migration guide](/resources/data/migrate-datastage) |

Still deciding whether to move at all? The [Airflow 2 end-of-life decision guide](/resources/airflow-2-eol-whitepaper) compares an Airflow 3 upgrade with a switch, and the comparison pages for [Airflow](/vs/airflow) and [Dagster](/vs/dagster) cover the product differences.

## A migration plan that keeps production running

The source system changes the details, not the shape of the plan. The approach that works is incremental: Kestra starts next to the existing orchestrator, takes over pipelines one at a time, and the old system shrinks until it can be switched off.

1. **Inventory and triage.** List every job with its schedule, owner, dependencies, and consumers. Classify each as simple, complex, or ready to retire. Deleting unused jobs is the cheapest migration of all.
2. **Build the foundation.** Set up namespaces by team or domain, load secrets, and connect Kestra to [Git](/docs/version-control-cicd/git) so flows are reviewed and deployed like any other code.
3. **Coexist.** Run Kestra alongside the existing system. New pipelines start in Kestra, and where possible Kestra triggers the jobs you haven't moved yet, so there is one place to see what runs.
4. **Translate in waves.** Start with a few simple pipelines to settle conventions, never with the most complex or most critical one. Each wave reuses the decisions of the previous one.
5. **Run in parallel and validate.** Run each translated flow next to the original for a validation window, compare outputs, and make loads idempotent so a double run can't duplicate data.
6. **Cut over and decommission.** Switch pipelines one at a time: pause the old job, enable the Kestra trigger, and retire the old system once nothing depends on it.

## Tools that shorten the migration

- **[Airflow plugin](/plugins/plugin-airflow).** Trigger existing Airflow DAGs from a Kestra flow and wait for their result, so both systems work together during the transition. A ready-to-run version is available as the [Trigger an Airflow DAG blueprint](/blueprints/airflow-trigger-dag).
- **[Agent skills](/docs/ai-tools/agent-skills).** AI coding agents such as Claude Code, Codex, or Cursor get live knowledge of the Kestra flow schema, so the YAML they generate validates. A dedicated skill converts Airflow DAG files into flows plus namespace files, as shown in [migrating from Airflow with AI coding agents](/blogs/airflow-to-kestra-migration-with-ai).
- **[AI Copilot](/docs/ai-tools/ai-copilot).** Describe a pipeline in plain language and edit the generated flow directly in the Kestra UI.
- **[Blueprints](/blueprints).** Ready-made flows for common integrations that you can adapt instead of writing from scratch.
- **[Backfill](/docs/concepts/backfill) and replay.** Replay historical intervals after cutover, or rerun a failed execution from the task that failed.

Kestra is open source, so you can [run it locally](/docs/quickstart) and translate a first pipeline today. If you are planning a migration across many teams, [talk to our team](/demo) about your setup.
