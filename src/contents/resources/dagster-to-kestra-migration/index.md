---
title: "How to Migrate from Dagster to Kestra: A Practical Guide"
description: "Transitioning from Dagster to Kestra involves a shift from asset-centric to declarative workflows. This guide covers concept mapping, code examples, and a phased migration checklist to ensure a smooth transition for your pipelines."
metaTitle: "Migrate from Dagster to Kestra: A Practical Guide | Kestra"
metaDescription: "Step-by-step guide to migrating Dagster pipelines to Kestra: concept mapping (assets, sensors), code examples, and a phased migration checklist."
tag: "data"
date: 2026-07-23
slug: "dagster-to-kestra-migration"
faq:
  - question: "Can I keep my Python code when migrating from Dagster to Kestra?"
    answer: "Yes, your core Python business logic remains largely unchanged. Kestra's language-agnostic script tasks and task runners allow you to port your Python code directly, while the orchestration layer moves to declarative YAML definitions."
  - question: "What is the Kestra equivalent of Dagster assets?"
    answer: "In Kestra, the concept of software-defined assets is handled by flows, tasks, and their outputs. Workflows declare the process that produces data, and task outputs capture the resulting artifacts and metadata."
  - question: "How do Dagster sensors map to Kestra triggers?"
    answer: "Dagster sensors can be replicated in Kestra using polling triggers (for example, for file arrival, queue messages, or HTTP events) and Flow triggers, which start a workflow when another flow completes."
  - question: "How long does a Dagster to Kestra migration typically take?"
    answer: "The duration varies with the number and complexity of your pipelines. A phased approach, starting with a low-risk pilot running in parallel with Dagster, keeps the process manageable and scales with your pipeline count rather than with Kestra's learning curve."
  - question: "Do I need to migrate all my Dagster pipelines at once?"
    answer: "No. A big-bang migration is not recommended. Migrate pipeline by pipeline, validate each one in parallel with its Dagster counterpart, and decommission progressively."
author: "Kestra"
---

<!-- REVIEWER INPUT NEEDED — Martin (global): please confirm every Kestra-side claim in the mapping table and the three YAML examples. Dagster-side snippets should also be sanity-checked against a recent Dagster version. All open points are marked with individual comments below. -->

Migrating an orchestration platform can feel daunting, especially when moving between tools with different core philosophies. This guide is for data engineers and platform leads actively evaluating or executing a transition from Dagster to Kestra. It provides a pragmatic, step-by-step roadmap to make the shift as smooth as possible.

Let's acknowledge the fundamental paradigm difference upfront: Dagster is Python-native and asset-centric, while Kestra is declarative (YAML) and workflow-centric. Understanding that distinction — including what it means you'll do differently, not just what maps one-to-one — is the key to a successful migration. Below you'll find an honest concept mapping, side-by-side code examples, and a phased migration playbook.

## Before you migrate: the paradigm shift

### From asset-centric to workflow-centric

In Dagster, you declare what *should exist*: software-defined assets bundle a definition, its materialization logic, and its metadata into a single decorator. In Kestra, you declare the [workflow](/docs/workflow-components/flow) that *produces* it: flows and tasks describe the process, and task outputs capture what was produced, along with its metadata.

### From Python-as-orchestration-language to Python-as-task

Your business logic stays in Python. What changes is where orchestration lives: instead of expressing dependencies, schedules, and configuration in Python code, you express them in [declarative YAML](/features/declarative-data-orchestration). Python (or any other language) runs inside script tasks and [task runners](/docs/architecture).

### What you gain

- **Language-agnostic orchestration.** Not everything is Python anymore: Bash, Node.js, Go, R, Julia, SQL, and containerized workloads are first-class citizens, backed by a plugin ecosystem of over 1,700 integrations.
- **One declarative model for orchestration, triggers, and deployment.** Flow definitions, scheduling, event triggers, and environment configuration all live in the same YAML, versioned in Git.
- **UI-based development.** Flows can be authored, tested, and monitored from the built-in editor — no local development environment required to get started.
- **API-first platform with Terraform support.** Everything you can do in the UI is available through the API and infrastructure-as-code.

### What you lose, or do differently

Being honest about the trade-offs matters more in a migration guide than anywhere else. None of the following are hidden costs — they are the flip side of moving from asset-centric Python orchestration to declarative, workflow-centric orchestration — but you should walk in with clear expectations.

<!-- REVIEWER INPUT NEEDED — Martin: confirm each of the seven items below. Items 3, 4, and 5 have specific open questions. -->

- **Per-asset materialization history.** Dagster gives you a persistent view of every materialization of a logical asset across runs. In Kestra, execution history and outputs are browsable per flow, not per logical asset across flows. If the asset catalog is your team's primary observability surface, plan for a different mental model: flow executions, task outputs, and attached metadata.
- **Asset sensors.** There is no standalone asset-materialization event to subscribe to. The closest substitute is a [Flow trigger](/docs/workflow-components/triggers) keyed to the producing flow — this covers the common "run B when A's output updates" case, but couples the trigger to the workflow rather than to the data artifact.
- **Asset freshness policies.** <!-- REVIEWER INPUT NEEDED — Martin: is there an equivalent (SLA-style monitoring, expression-based checks), or do we state plainly that this is not a Kestra concept and observability is handled at the execution level? -->
- **Non-time-based partitions.** Time-based partitions (daily, hourly) map cleanly to [Schedule backfills](/docs/concepts/backfill). Static or dynamic partitions (per-category, per-customer, per-region) have no first-class equivalent; `ForEachItem` covers fan-out at execution time but doesn't persist a per-partition materialization state. <!-- REVIEWER INPUT NEEDED — Martin: confirm limits of this framing. -->
- **A single injected resource object.** Dagster resources are instantiated once and injected wherever they're needed. In Kestra, each task configures its own connection properties, references the [KV Store](/docs/concepts/kv-store) for shared state, or pulls secrets. Configuration is distributed, mitigated by [`pluginDefaults`](/docs/workflow-components/plugin-defaults) at the namespace level. <!-- REVIEWER INPUT NEEDED — Martin: confirm pluginDefaults framing. -->
- **Code-location-level Python isolation.** Dagster code locations can pin isolated Python and package versions per location. Kestra's isolation lives one layer lower, at the task-runner/container level: each task can run in its own image.
- **Branch deployments as a built-in feature.** Dagster+ branch deployments are a product feature; in Kestra the equivalent is a convention — namespace-per-environment plus [flow revisions](/docs/concepts/revision), wired through your CI.

Teams for whom per-asset lineage is the core requirement should weigh that trade-off explicitly. Teams orchestrating beyond Python data pipelines typically gain more than they give up.

## Concept mapping: Dagster to Kestra

| Dagster | Kestra equivalent | Notes |
|---|---|---|
| `@asset` / software-defined assets | Flow + task `outputs` (+ metadata) | Paradigm shift — a Dagster asset bundles definition, materialization, and metadata in one decorator; in Kestra that splits across the flow (the process definition) and task outputs (what was produced). Kestra has no persistent per-asset materialization history across flows; execution history is browsable per flow. |
| `@op` / `@job` | Task / Flow | Direct conceptual match. |
| `@schedule` | `Schedule` trigger (cron) | Direct match. |
| `@sensor` | Polling triggers (file, queue, HTTP…) + `Flow` trigger | Run-status and file-arrival sensors map to polling and Flow triggers. Asset sensors have no direct equivalent — the closest substitute is a Flow trigger keyed to the producing flow. <!-- REVIEWER INPUT NEEDED — Martin: confirm trigger coverage for the common sensor use cases (S3 arrival, run-status, asset sensors). --> |
| Partitions + backfills | Backfill executions on Schedule triggers; `ForEachItem` for fan-out | Clean mapping for time-based partitions — backfill replays missed schedule windows directly. Static/dynamic partitions: see "What you lose" above. |
| `resources` / `io_manager` | Plugin task properties, internal storage, KV Store, secrets | Not one-to-one — resources dissolve into plugin configuration plus platform primitives. No single resource object instantiated once and injected everywhere. |
| `Definitions` / code locations | [Namespaces](/docs/workflow-components/namespace) + flow files (Git sync) | One nuance: code locations pin isolated Python/package versions per location; Kestra's isolation sits at the task-runner/container level. |
| `dagster-dbt` | Kestra [dbt plugin](/plugins/plugin-dbt) | `DbtCLI` supports arbitrary dbt commands including selective runs via `--select`/`--exclude`, and can handle `manifest.json` for state comparison. <!-- REVIEWER INPUT NEEDED — Martin: the Notion outline said io.kestra.plugin.dbt.cli.Commands, but current docs use io.kestra.plugin.dbt.cli.DbtCLI — confirm the correct task type and the manifest/state-comparison claim. --> |
| Dagster+ branch deployments | Namespace-per-environment convention + flow revisions, deployed via CI | Not a feature match but a genuine difference in how environments are structured. |
| Run retries / alerting | `retries` on tasks, `errors` branch, notification plugins | Direct match. |
| Config / run config | Flow `inputs` + `variables` + plugin defaults | Direct match. |

## Code side-by-side

The point of these examples is simple: your Python business logic survives the migration largely unchanged. What changes is the orchestration wrapper around it.

<!-- REVIEWER INPUT NEEDED — Martin: validate that all three Kestra YAML examples run against the current version, and sanity-check the Dagster snippets against a recent Dagster release. -->

### Example 1 — A simple scheduled pipeline

In Dagster, a daily asset with a schedule:

```python
import dagster as dg

@dg.asset
def daily_sales_report():
    data = fetch_sales()          # your business logic
    return transform(data)

daily_job = dg.define_asset_job("daily_job", selection=[daily_sales_report])

daily_schedule = dg.ScheduleDefinition(
    job=daily_job,
    cron_schedule="0 9 * * *",
)
```

The same pipeline in Kestra — the Python logic is identical, the orchestration moves to YAML:

```yaml
id: daily_sales_report
namespace: company.analytics

tasks:
  - id: build_report
    type: io.kestra.plugin.scripts.python.Script
    beforeCommands:
      - pip install kestra
    script: |
      from kestra import Kestra

      data = fetch_sales()          # your business logic, unchanged
      result = transform(data)

      Kestra.outputs({"rows": len(result)})

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 9 * * *"
```

### Example 2 — An event-driven pipeline

A Dagster sensor watching for new files:

```python
@dg.sensor(job=process_job, minimum_interval_seconds=60)
def s3_file_sensor(context):
    new_keys = check_s3_for_new_files()
    for key in new_keys:
        yield dg.RunRequest(run_key=key, run_config={"ops": {"process": {"config": {"key": key}}}})
```

In Kestra, the polling logic disappears into a declarative trigger — no sensor code to write or maintain:

```yaml
id: process_incoming_files
namespace: company.analytics

tasks:
  - id: process
    type: io.kestra.plugin.scripts.python.Script
    inputFiles:
      data.csv: "{{ trigger.objects | jq('.[].uri') | first }}"
    script: |
      process_file("data.csv")   # your business logic, unchanged

triggers:
  - id: watch_bucket
    type: io.kestra.plugin.aws.s3.Trigger
    bucket: incoming-data
    prefix: raw/
    interval: PT1M
    action: MOVE
    moveTo:
      key: archive/raw/
```

### Example 3 — Orchestrating dbt

With `dagster-dbt`, models become assets:

```python
from dagster_dbt import DbtCliResource, dbt_assets

@dbt_assets(manifest=dbt_manifest_path)
def my_dbt_assets(context, dbt: DbtCliResource):
    yield from dbt.cli(["build"], context=context).stream()
```

In Kestra, the [dbt plugin](/docs/how-to-guides/dbt) runs your project directly:

```yaml
id: dbt_build
namespace: company.analytics

tasks:
  - id: sync
    type: io.kestra.plugin.git.SyncNamespaceFiles
    url: https://github.com/your-org/dbt-project
    branch: main
    namespace: "{{ flow.namespace }}"

  - id: dbt
    type: io.kestra.plugin.dbt.cli.DbtCLI
    containerImage: ghcr.io/kestra-io/dbt-duckdb:latest
    namespaceFiles:
      enabled: true
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    commands:
      - dbt build --select state:modified+
```

## The phased migration playbook

Migration time depends mainly on two things: how many pipelines you're moving, and how many rely on sensors versus schedules — schedules port over mechanically, while sensors need case-by-case mapping using the table above. Most teams migrate pipeline by pipeline in parallel with their existing Dagster setup rather than all at once, so there's no single timeline: it scales with your pipeline count, not with Kestra's learning curve.

1. **Inventory.** Map your Dagster assets and jobs. For each one, separate pure orchestration (schedules, dependencies, retries, config) from business logic (the Python inside). The orchestration gets rewritten declaratively; the logic gets ported as-is.
2. **Pilot.** Pick one low-risk pipeline and run it on Kestra in parallel with Dagster. No big bang. This is where your team internalizes the paradigm shift on something that can't hurt you.
3. **Port the logic.** Python code moves into [script tasks](/docs/task-runners) largely unchanged. Resist the urge to refactor during migration — port first, improve later.
4. **Rebuild the triggers.** Schedules first (mechanical, low-risk), sensors second (case-by-case per the mapping table). This is where most of the genuine migration thinking happens.
5. **Cut over per pipeline.** Give each pipeline a parallel-run validation window where both orchestrators execute and you compare outputs, then switch the consumers.
6. **Decommission.** Retire Dagster pipelines progressively. If you're on Dagster+, factor your contract renewal date into the cutover sequencing.

For moving flows from development to production, see [our best practices guide](/docs/best-practices/from-dev-to-prod); [flow revisions](/docs/concepts/revision) give you versioning and rollback throughout the process.

## Conclusion: a different model, not just a different tool

Migrating off Dagster means trading an asset-centric, Python-native model for a declarative, workflow-centric one. The honest framing: if per-asset lineage is your team's central requirement, weigh that trade-off carefully. If your orchestration needs extend beyond Python data pipelines — infrastructure automation, business processes, AI workloads, polyglot teams — the declarative model gives you one platform and one mental model for all of it.

Start with the pilot. One pipeline, run in parallel, compared honestly. That's the lowest-cost way to find out whether the trade-offs in this guide are the right ones for your team.

To go further, explore [Kestra for data engineering](/data) and our [data engineering resources](/resources/data), or compare the two platforms in depth on [Kestra vs. Dagster](/vs/dagster).
