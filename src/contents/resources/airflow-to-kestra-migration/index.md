---
title: "How to Migrate from Airflow to Kestra: A Practical Guide"
description: "A step-by-step plan to move Apache Airflow DAGs to Kestra: a complete concept mapping, a DAG translated before and after, the patterns that need a decision, and how to run both orchestrators side by side until cutover."
metaTitle: "Migrate from Airflow to Kestra: Step-by-Step Guide | Kestra"
metaDescription: "Move Airflow DAGs to Kestra without a big-bang rewrite: concept mapping (XCom, sensors, catchup, pools), a DAG translated to YAML, and a phased migration plan."
tag: "data"
date: 2026-09-29
slug: "airflow-to-kestra-migration"
author: "Kestra"
faq:
  - question: "How do I migrate from Airflow to Kestra?"
    answer: "Inventory your DAGs and classify them by complexity, set up namespaces, secrets, and Git sync in Kestra, then put Kestra in front of Airflow with the Airflow plugin so it can trigger existing DAGs. Translate DAGs in waves, starting with the simplest, run each translated flow in parallel with its DAG until outputs match, then disable the DAG and decommission Airflow once nothing depends on it."
  - question: "Is there a tool that converts Airflow DAGs to Kestra flows automatically?"
    answer: "Kestra publishes a migrate-airflow-kestra agent skill for AI coding agents such as Claude Code. It reads a DAG file, extracts task logic into namespace files, maps dependencies and parallel branches, and generates a flow validated against the live Kestra schema. The output still needs an engineer's review, especially for sensors, custom operators, and date logic."
  - question: "What is the Kestra equivalent of XCom?"
    answer: "Small values become task outputs: a script task emits them with the Kestra client library and downstream tasks read them with expressions such as outputs.task_id.vars.key. Datasets and files become output files stored in Kestra's internal storage and passed to the next task as input files, with no size limit and no serialization into a metadata database."
  - question: "How do Airflow sensors translate to Kestra?"
    answer: "Most sensors become triggers rather than tasks. File and object sensors map to polling triggers (for example the S3 or GCS triggers), ExternalTaskSensor and Datasets map to a Flow trigger with dependsOn, HTTP sensors map to the HTTP trigger or a webhook, and custom Python sensors map to a Python script trigger. Triggers are checked at an interval and start an execution only when their condition is met, so no long-running task holds a slot while waiting."
  - question: "How do I avoid running a pipeline twice while Airflow and Kestra run in parallel?"
    answer: "Decide which system owns the schedule for each pipeline at any given time. During validation, point the Kestra flow at a staging target or run it without its Schedule trigger enabled. At cutover, pause the DAG in Airflow before enabling the Kestra trigger, and make loads idempotent (delete-then-insert or merge by date) so an accidental double run cannot duplicate data."
  - question: "What happens to catchup and backfills when I move a DAG to Kestra?"
    answer: "Kestra has no start_date. A new Schedule trigger starts from the moment the flow is deployed, and historical intervals are replayed on demand with a Backfill from the Triggers tab or the API. Behavior after downtime is set with recoverMissedSchedules: LAST behaves like catchup=False, ALL (the default) replays every missed interval, and NONE skips them."
---

Moving from Airflow to Kestra means translating the orchestration layer, not rewriting your business logic. Your Python, SQL, dbt, and Spark code keeps running as it is. Dependencies, schedules, retries, and data passing move from Python DAG files into declarative YAML flows, one pipeline at a time, while Airflow keeps running in production.

This guide is for data and platform engineers who have already decided to leave Airflow and need a concrete plan. If you are still weighing an Airflow 3 upgrade against a switch, start with the [Airflow 2 end-of-life decision guide](/resources/airflow-2-eol-whitepaper). If you want to compare tools first, see [Kestra vs. Airflow](/vs/airflow).

## What moves and what stays

Teams who leave Airflow usually describe the same pain points. Managed Airflow bills them per execution. Upgrades take an engineer for days. Worker dependencies conflict because tasks don't run in their own containers. And the whole platform feels heavy when all they need is to run a job on Kubernetes. None of these problems sits in the business logic, so the migration shouldn't touch it either.

**What stays the same:**

- The Python functions inside your `@task` decorators and `PythonOperator` callables. They move into standalone scripts and run in [script tasks](/docs/scripts/languages), each in its own container.
- SQL files, dbt projects, Spark jobs, and shell scripts. Kestra calls them the same way Airflow did.
- Your cron expressions. Kestra's Schedule trigger accepts standard cron syntax and the `@daily` / `@hourly` shortcuts.

**What gets translated:**

- DAG structure and task dependencies, which become an ordered list of tasks with explicit parallel branches.
- Data passing: XCom becomes task outputs and files in internal storage.
- Connections and Variables, which become secrets and KV store entries.
- Sensors, callbacks, `default_args`, pools, and catchup behavior. These need a decision, covered below.

Be honest with yourself about scope. Moving from Airflow is real work, not a one-click import. A handful of simple DAGs translate in an afternoon. A catalog built on custom operators, dynamic task mapping, and cross-DAG sensors needs a plan. The rest of this guide is that plan.

## Concept mapping: Airflow to Kestra

The table below reflects Kestra 2.0 syntax. If you have read older migration material, note the main changes: `Loop` replaces `ForEach`, Flow triggers use `dependsOn`, and `pluginDefaults` is replaced by Policies.

| Airflow | Kestra | Notes |
|---|---|---|
| DAG | [Flow](/docs/workflow-components/flow) | One YAML file with `id`, `namespace`, `tasks`, `triggers` |
| DAG folder / `dag_id` prefix | [Namespace](/docs/workflow-components/namespace) | Hierarchical (`company.data.sales`), carries secrets, files, and permissions |
| Operator / `@task` | Task (plugin type) | 1,800+ [plugins](/plugins) cover the major clouds, databases, and data tools |
| `PythonOperator`, `@task` | `io.kestra.plugin.scripts.python.Commands` | Function body moves to a [namespace file](/docs/concepts/namespace-files); dependencies declared per task |
| `BashOperator` | `io.kestra.plugin.scripts.shell.Commands` | Runs in a container by default |
| `t1 >> t2` | Task order in `tasks:` | Sequential by default |
| Independent branches | `io.kestra.plugin.core.flow.Parallel` | Parallelism is explicit, see [flowable tasks](/docs/workflow-components/tasks/flowable-tasks) |
| `schedule="@daily"` | `io.kestra.plugin.core.trigger.Schedule` | Several triggers per flow are allowed |
| `start_date` + `catchup` | `recoverMissedSchedules` + [Backfill](/docs/concepts/backfill) | No start date, see the patterns section |
| XCom (small values) | Task outputs (`outputs.task_id.vars.key`) | Emitted from scripts with the Kestra client library |
| XCom (files, dataframes) | `outputFiles` → `inputFiles` | Stored in internal storage, no size limit |
| Connections | [Secrets](/docs/concepts/secret) (`{{ secret('NAME') }}`) | External secret managers are supported in Enterprise Edition |
| Variables | [KV store](/docs/concepts/kv-store) (`{{ kv('key') }}`) | See [credentials vs. secrets vs. KV store](/docs/best-practices/credentials-vs-secrets-vs-kv-store) |
| `params` | Typed `inputs` | Validated before the execution starts |
| `default_args` | Per-task `retry` / `timeout`, or Policies (Enterprise) | `pluginDefaults` no longer exists in 2.0 |
| `retries`, `retry_delay` | `retry` (`constant`, `exponential`, `random`) | Set on tasks or groups of tasks |
| `on_failure_callback` | [`errors`](/docs/workflow-components/errors) block, or a Flow trigger alert flow | A single alert flow can cover a whole namespace |
| `trigger_rule="all_done"` | [`finally`](/docs/workflow-components/finally) block | Always runs, whatever the outcome |
| Other `trigger_rule` values | `allowFailure`, `runIf`, `errors` | Case by case |
| Sensors | Triggers ([polling](/docs/workflow-components/triggers/polling-trigger), [Flow](/docs/workflow-components/triggers/flow-trigger), Webhook, HTTP) | No task holds a slot while waiting |
| Datasets / Assets | Flow trigger with `dependsOn` | Lineage tracking via Assets in Enterprise Edition |
| Dynamic task mapping (`.expand()`) | `io.kestra.plugin.core.flow.Loop` | `concurrencyLimit` caps parallel iterations |
| TaskGroup | `Parallel` / `Sequential` grouping | Or split into a subflow if reused |
| SubDAG | [Subflow](/docs/workflow-components/subflows) | Reusable across flows with typed inputs and outputs |
| `max_active_runs` | `concurrency.limit` on the flow | `behavior: QUEUE`, `CANCEL`, or `FAIL` |
| Pools | [Concurrency limits](/docs/workflow-components/concurrency) at flow, namespace, or tenant level | No one-to-one equivalent, see below |
| Executors (Celery, Kubernetes) | [Task runners](/docs/task-runners/overview) | Docker by default; Kubernetes and cloud batch runners in Enterprise Edition |
| Queues | [Worker groups](/docs/enterprise/scalability/worker-group) (Enterprise) | Route tasks to specific workers |
| Jinja macros (`{{ ds }}`) | [Pebble expressions](/docs/expressions) | `{{ trigger.date \| date('yyyy-MM-dd') }}` |
| `sla` | Flow-level [`sla`](/docs/workflow-components/sla) | `MAX_DURATION` or `EXECUTION_ASSERTION` |
| Tags | Labels | Also usable as trigger filters |
| DAG versioning | Flow revisions + [Git sync](/docs/version-control-cicd/git) | Every save creates a revision you can roll back to |

## Translating a DAG: before and after

Here is a typical daily pipeline written with the TaskFlow API. It pulls orders from an API, aggregates them with pandas, loads the result into Postgres, and posts to Slack when something fails.

```python
from datetime import datetime, timedelta

import pandas as pd
import requests
from airflow.decorators import dag, task
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.providers.slack.notifications.slack_webhook import send_slack_webhook_notification

@dag(
    schedule="@daily",
    start_date=datetime(2026, 1, 1),
    catchup=False,
    default_args={
        "retries": 2,
        "retry_delay": timedelta(minutes=5),
        "on_failure_callback": send_slack_webhook_notification(
            slack_webhook_conn_id="slack_alerts",
            text="daily_orders failed",
        ),
    },
    tags=["sales"],
)
def daily_orders():
    @task
    def extract(ds=None):
        response = requests.get("https://api.example.com/orders", params={"date": ds})
        response.raise_for_status()
        return response.json()

    @task
    def transform(orders):
        df = pd.DataFrame(orders)
        daily = df.groupby("region", as_index=False)["amount"].sum()
        return daily.to_dict("records")

    @task
    def load(rows):
        hook = PostgresHook(postgres_conn_id="warehouse")
        hook.insert_rows("daily_sales", [(r["region"], r["amount"]) for r in rows])

    load(transform(extract()))

daily_orders()
```

The same pipeline in Kestra. The transformation logic moves to a namespace file, `scripts/transform.py`, with no Airflow imports left:

```python
import pandas as pd

orders = pd.read_json("orders.json")
daily = orders.groupby("region", as_index=False)["amount"].sum()
daily.to_csv("daily_sales.csv", index=False)
```

And the flow:

```yaml
id: daily_orders
namespace: company.sales
labels:
  team: sales

tasks:
  - id: extract
    type: io.kestra.plugin.core.http.Download
    uri: https://api.example.com/orders
    params:
      date: "{{ (trigger.date ?? execution.startDate) | dateAdd(-1, 'DAYS') | date('yyyy-MM-dd') }}"
    retry:
      type: constant
      maxAttempts: 3
      interval: PT5M

  - id: transform
    type: io.kestra.plugin.scripts.python.Commands
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: python:3.12-slim
    dependencies:
      - pandas
    namespaceFiles:
      enabled: true
      include:
        - scripts/transform.py
    inputFiles:
      orders.json: "{{ outputs.extract.uri }}"
    commands:
      - python scripts/transform.py
    outputFiles:
      - daily_sales.csv

  - id: load
    type: io.kestra.plugin.jdbc.postgresql.CopyIn
    url: "{{ secret('WAREHOUSE_JDBC_URL') }}"
    username: "{{ secret('WAREHOUSE_USER') }}"
    password: "{{ secret('WAREHOUSE_PASSWORD') }}"
    from: "{{ outputs.transform.outputFiles['daily_sales.csv'] }}"
    table: daily_sales
    format: CSV
    header: true
    columns:
      - region
      - amount
    retry:
      type: constant
      maxAttempts: 3
      interval: PT5M

errors:
  - id: alert
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "{{ flow.namespace }}.{{ flow.id }} failed, execution {{ execution.id }}"

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"
    recoverMissedSchedules: LAST
```

What changed in the translation:

- **The HTTP call no longer needs Python.** A built-in task downloads the file into internal storage. Every task you replace with a plugin is one less script to maintain.
- **XCom became files.** `extract` stores `orders.json`, `transform` receives it through `inputFiles` and declares `daily_sales.csv` as an output file, and `load` reads it by reference. No serialized objects pass through a metadata database, so size is no longer a constraint.
- **Dependencies are declared per task.** pandas is installed for this task only, inside its own container, instead of on every Airflow worker.
- **Connections became secrets.** The Postgres hook and the Slack connection turn into `{{ secret('...') }}` references on the tasks that need them.
- **The date logic is explicit.** Airflow's `ds` is the start of the data interval, which for a daily DAG is the day before the run fires (with Airflow 2's default cron timetable). Kestra's `trigger.date` is the scheduled fire time, so the flow subtracts one day. The `?? execution.startDate` fallback makes manual runs work too.
- **The failure callback is an `errors` block.** It runs only when a task fails, with the whole execution context available.

To speed up this translation across a large DAG catalog, see [migrating Airflow DAGs with AI coding agents](/blogs/airflow-to-kestra-migration-with-ai).

## Patterns without a one-to-one equivalent

Most of the mapping table is mechanical. These seven patterns are where migrations stall. Decide how you'll handle each one before you translate at scale.

### Catchup and start_date

Kestra has no `start_date`: a Schedule trigger starts evaluating when the flow is deployed. Replaying history is an explicit action. You run a [Backfill](/docs/concepts/backfill) over a date range from the flow's Triggers tab or through the API, and you can pause, resume, and label it. What happens after the Kestra server has been down is controlled by `recoverMissedSchedules`:

| Airflow | Kestra |
|---|---|
| `catchup=False` | `recoverMissedSchedules: LAST` |
| `catchup=True` (after downtime) | `recoverMissedSchedules: ALL` (the default) |
| No catch-up at all | `recoverMissedSchedules: NONE` |
| `airflow dags backfill` | Backfill from the UI or API |

Airflow 3 changed its default cron timetable, which moves the meaning of `logical_date` for new DAGs. Check which timetable each DAG uses before you translate its date logic.

### Sensors

In Airflow, a sensor is a task that waits, holding a worker slot or a triggerer. In Kestra, waiting is the job of a trigger: it's checked at a set interval and starts an execution only when its condition is met, so no long-running task sits in a slot while it waits.

- `S3KeySensor`, `GCSObjectExistenceSensor`, `FileSensor` → the matching polling trigger (for example `io.kestra.plugin.aws.s3.Trigger`), which can also move or delete the file once it's processed.
- `ExternalTaskSensor` → a Flow trigger on the upstream flow, with `dependsOn` and an optional `window` (for example, "both upstream flows succeeded before 09:00").
- `HttpSensor` → the HTTP trigger, or invert the dependency with a Webhook trigger so the upstream system calls Kestra.
- Custom sensors that poll a database → the JDBC trigger of the matching plugin (for example `io.kestra.plugin.jdbc.postgresql.Trigger`).
- Custom Python sensors → `io.kestra.plugin.scripts.python.ScriptTrigger`, which runs your check and starts the flow when it passes.

### Datasets and Assets

Data-aware scheduling ("run this DAG when that table is updated") maps to Flow triggers. The downstream flow declares `dependsOn` on the upstream flows, with `mode: ALL`, `ANY`, or `AT_LEAST` and a time window. Kestra Enterprise Edition adds Assets for lineage and metadata on the data itself.

### Dynamic task mapping

`.expand()` over a list becomes a `Loop` task. Each iteration runs as an isolated sub-execution, the current value is `{{ item.value }}`, and `concurrencyLimit` caps how many iterations run at once. Per-iteration outputs are declared on the Loop and collected afterwards with `loopOutputs()`. For large fan-outs where each batch needs its own retries and logs, combine `Loop` with a `Subflow`, as described in the [Loop migration guide](/docs/migration-guide/v2.0.0/foreach-loop).

### Pools and concurrency

Airflow pools cap task slots shared across DAGs, usually to protect a database or an API. Kestra caps executions instead:

- `concurrency.limit` on a flow replaces `max_active_runs`.
- Namespace-level and tenant-level [concurrency limits](/docs/workflow-components/concurrency) cap every flow under a namespace, which covers most "one pool per team" setups.
- `concurrencyLimit` on `Loop` and `Parallel` caps fan-out inside a single execution.
- [Worker groups](/docs/enterprise/scalability/worker-group) (Enterprise) route heavy tasks to dedicated workers.

If a pool protects one shared system across unrelated DAGs, group those flows under one namespace and set the limit there.

### Jinja templates

Pebble syntax looks like Jinja and most templates port directly. The context variables change:

| Airflow | Kestra |
|---|---|
| `{{ ds }}` | `{{ trigger.date \| date('yyyy-MM-dd') }}` (mind the interval shift above) |
| `{{ params.region }}` | `{{ inputs.region }}` |
| `{{ var.value.threshold }}` | `{{ kv('threshold') }}` |
| `{{ conn.warehouse.password }}` | `{{ secret('WAREHOUSE_PASSWORD') }}` |
| `{{ ti.xcom_pull(task_ids='extract') }}` | `{{ outputs.extract.vars.key }}` or `outputs.extract.outputFiles['file']` |
| `{{ run_id }}` | `{{ execution.id }}` |

### Custom operators

Custom operators usually wrap three things: a client library, credentials, and some retry or polling logic. In Kestra, the retry and polling logic moves to task properties, credentials move to secrets, and the client call becomes a script task. Check the [plugin catalog](/plugins) first: most provider operators already have a native equivalent. If an operator is used across dozens of DAGs and no plugin covers it, the plugin developer guide lets you package it as a Java plugin that looks like any other task in YAML.

## The phased migration plan

Big-bang cutovers are where orchestration migrations fail. The approach that works is the Strangler Fig pattern: Kestra starts alongside Airflow, takes over pipelines one at a time, and Airflow shrinks until it can be switched off. Production stays stable the whole time.

### 1. Inventory and triage

List every DAG with its schedule, owner, operators used, connections, sensors, and downstream consumers. Then sort them into three buckets:

- **Simple**: sequential, schedule-based, standard operators. Translate these first.
- **Complex**: sensors, dynamic task mapping, custom operators, cross-DAG dependencies. Plan these case by case.
- **Retire**: DAGs nobody owns or reads anymore. Most catalogs have more of these than expected, and deleting one is the cheapest migration of all.

### 2. Build the foundation

Before translating a single DAG, set up the namespace hierarchy (usually by team or domain), load secrets, and connect Kestra to Git so flows are reviewed and deployed like any other code. Choose task runners that match where your Airflow workers run today. The [quickstart](/docs/quickstart) gets a local instance running in a few minutes for the first tests.

### 3. Put Kestra in front of Airflow

The [Airflow plugin](/plugins/plugin-airflow) lets a Kestra flow trigger an existing DAG through the Airflow REST API, wait for it to finish, and read its final state. From day one, new pipelines are built in Kestra and can still call DAGs you haven't migrated yet:

```yaml
id: run_legacy_dag
namespace: company.sales

tasks:
  - id: trigger_dag
    type: io.kestra.plugin.airflow.dags.TriggerDagRun
    baseUrl: "{{ secret('AIRFLOW_BASE_URL') }}"
    dagId: daily_orders
    wait: true
    options:
      auth:
        type: BASIC
        username: "{{ secret('AIRFLOW_USERNAME') }}"
        password: "{{ secret('AIRFLOW_PASSWORD') }}"

  - id: downstream
    type: io.kestra.plugin.core.log.Log
    message: "DAG run {{ outputs.trigger_dag.dagRunId }} finished with state {{ outputs.trigger_dag.state }}"
```

The Kestra execution ID, flow, and namespace are passed to the DAG run's `conf`, so runs are traceable across both systems. The [Trigger an Airflow DAG blueprint](/blueprints/airflow-trigger-dag) is a ready-to-run version, and [orchestrating Airflow DAGs from Kestra](/blogs/2024-10-22-orchestrate-dags-with-kestra) walks through the setup.

### 4. Translate in waves

Start with the simple bucket, and never with your most complex or most critical pipeline. A first wave of three to five DAGs is enough to settle conventions: naming, namespace layout, where scripts live, how secrets are referenced. Everyone who follows reuses those decisions.

AI coding agents handle the mechanical part of the translation well, because DAGs are structured code with predictable patterns. Kestra's [agent skills](/docs/ai-tools/agent-skills) ground the agent in the live flow schema, and the dedicated [migrate-airflow-kestra skill](https://github.com/kestra-io/agent-skills/blob/main/skills/migrate-airflow-kestra/SKILL.md) converts one DAG file into a flow plus namespace files. An engineer still reviews each flow, especially sensors, date logic, and anything touching a production table.

### 5. Run in parallel and validate

For each translated pipeline, run the Kestra flow alongside the DAG for a validation window, writing to a staging target or with its trigger disabled and executions started manually. Compare outputs (row counts, checksums, or the downstream reports themselves) and watch execution times. Add alerting from the start: a namespace-wide Flow trigger on `FAILED` executions replaces dozens of per-DAG callbacks.

### 6. Cut over and decommission

Cut over one pipeline at a time. Pause the DAG, enable the Kestra trigger, and replace the DAG run with a `TriggerDagRun` call only where other DAGs still depend on it. When the last DAG is paused and no flow calls Airflow anymore, back up the metadata database for audit purposes and shut Airflow down.

## Pitfalls when running both systems

Parallel operation is an intentional state, and it comes with specific failure modes:

- **Double execution.** If a DAG and its Kestra flow are both scheduled against the same target, the pipeline runs twice. Assign ownership of each schedule to one system at a time, and pause the DAG before enabling the Kestra trigger, never after.
- **Non-idempotent loads.** Make every load safe to rerun (delete-then-insert or merge by date, never plain append). This protects you during cutover, and it's what makes Backfill safe later.
- **Backfills replay successes too.** A Kestra Backfill replays every interval in the window, including those that already succeeded. Use Replay for individual failed executions instead.
- **Timezones.** Airflow schedules default to UTC. Set `timezone` explicitly on Kestra Schedule triggers when a pipeline is tied to business hours, and check what daylight saving time does to the run.
- **Secrets drift.** Credentials rotated in Airflow Connections but not in Kestra secrets (or the reverse) break whichever side you forgot. Point both at the same external secret manager if you have one.
- **Recovered schedules at restart.** With the default `recoverMissedSchedules: ALL`, restarting Kestra after maintenance replays every missed interval. Set `LAST` or `NONE` on flows where that would overlap with Airflow.

## Migration checklist

- [ ] Every DAG inventoried with owner, schedule, operators, connections, sensors, and consumers
- [ ] DAGs classified as simple, complex, or retire; unused DAGs deleted
- [ ] Namespace hierarchy defined and secrets loaded
- [ ] Flows synced from Git and deployed through CI
- [ ] Airflow plugin configured so Kestra can trigger remaining DAGs
- [ ] First wave (3 to 5 simple DAGs) translated and conventions documented
- [ ] Date logic checked on every flow (`ds` vs. `trigger.date`)
- [ ] Loads made idempotent before any parallel run
- [ ] Namespace-level failure alerting in place
- [ ] Each pipeline validated in parallel before cutover
- [ ] DAG paused before the Kestra trigger is enabled
- [ ] `recoverMissedSchedules` set explicitly on migrated flows
- [ ] Airflow metadata database backed up, Airflow decommissioned

## What teams gained after moving off Airflow

[Leroy Merlin France](/customers/leroy-merlin-france) replaced a fragmented scheduling stack and an Airflow deployment that failed their benchmarks, where a single badly written DAG could slow the entire cluster. They moved incrementally: new cloud projects started on Kestra while legacy systems kept running. They now orchestrate 5,000+ flows for 250+ active users, with a 900% increase in data production.

[Apple's ML team](/customers/apple) replaced Airflow for 200 engineers running large-scale ETL across App Store, Apple Music, and device data. The driver was operational overhead: Python DAG definitions, a complex scheduler, and the specialized knowledge needed to tune and scale it. They moved to declarative, language-agnostic pipelines.

Moving from Dagster instead? The [Dagster to Kestra migration guide](/resources/data/dagster-to-kestra-migration) follows the same structure. For a broader view of the market, see [Airflow alternatives](/resources/data/airflow-alternatives).

Kestra is open source, so you can [start locally](/docs/quickstart) and translate your first DAG today. If you are planning a migration across many teams, [talk to our team](/demo) about your setup.
