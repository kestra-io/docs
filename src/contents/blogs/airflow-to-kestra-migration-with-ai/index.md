---
title: "Migrating from Airflow to Kestra with AI Coding Agents"
description: "Learn how to migrate Apache Airflow DAGs to Kestra flows using AI coding agents like Claude Code, with step-by-step guidance on the kestra-flow and kestra-ops agent skills."
date: 2026-04-02T09:00:00
category: Solutions
author:
  name: Benoit Pimpaud
  image: bpimpaud
  role: Data Engineer
---

Migrating from Apache Airflow to Kestra is a decision many engineering teams make as their workflow complexity grows. Airflow's Python-first model works well for teams already comfortable with Python, but as pipelines scale, the operational overhead mounts: workers need the right packages installed, XCom has size limits, and DAG files mix orchestration logic with business logic in ways that become hard to maintain.

Kestra takes a different approach: declarative YAML flows, file-based data passing with no size limits, and a 600+ plugin ecosystem that covers most integrations out of the box. The IDE-like UI, with a live topology view and built-in code editor, makes the day-to-day workflow significantly smoother.

The migration itself used to require deep knowledge of both platforms. Now, with AI coding agents and Kestra's dedicated agent skills, you can migrate a DAG in minutes rather than hours. Here's exactly how it works.

## What Changes When You Move from Airflow to Kestra

Before touching any code, it helps to internalize the key conceptual shifts:

| Aspect | Airflow | Kestra |
|---|---|---|
| **Definition format** | Python code (DAG files) | Declarative YAML |
| **State passing** | XCom (serialized to metadata DB, size-limited) | Files via internal storage — no size limits |
| **Parallelism** | Implicit — independent tasks run in parallel | Explicit — wrap concurrent tasks in `io.kestra.plugin.core.flow.Parallel` |
| **Scheduling** | `schedule` parameter on the DAG object | Separate `Schedule` trigger with a `cron` expression |
| **Dependencies** | pip packages installed on workers | Java plugins loaded at startup, or per-task `beforeCommands` |
| **Namespace files** | No equivalent | First-class script/config storage, scoped per namespace |

The biggest shift is **data passing**. In Airflow, tasks return Python objects via XCom, which get serialized to the metadata database. In Kestra, tasks write files to disk, declare them in `outputFiles`, and Kestra uploads them to internal storage. Downstream tasks reference them via `inputFiles` using Pebble expressions like `{{ outputs.my_task.outputFiles['data.json'] }}`. No size limits, no serialization overhead.

## The Tool Stack for AI-Assisted Migration

The migration uses three tools working together:

1. **Claude Code** (or Codex / Gemini CLI) — the AI coding agent that reads your DAGs and generates Kestra flows
2. **`kestra-flow` agent skill** — gives Claude Code live knowledge of Kestra's flow schema so it never generates invalid YAML
3. **`kestra-ops` agent skill** — gives Claude Code the ability to operate `kestractl` for deployment, validation, and namespace file management

Install both skills by following the instructions at [kestra.io/docs/ai-tools/agent-skills](https://kestra.io/docs/ai-tools/agent-skills). Once installed, Claude Code automatically invokes the right skill based on what you ask.

You also need `kestractl` installed and pointed at a running Kestra instance:

```bash
kestractl config add local http://localhost:8080 ""
kestractl config use local

# Verify connectivity
kestractl flows list --namespace analytics
```

## Step-by-Step: Migrating a DAG

### 1. Get Airflow Running (with Claude Code)

If you don't have a local Airflow instance already running, the fastest way to spin one up for inspection purposes is to just ask Claude Code:

```
Install Airflow and run it on port 28080
```

Claude will create a virtual environment, install Airflow, initialize the database, and run `airflow standalone`. You'll have a working Airflow UI at `http://localhost:28080` in a few minutes.

### 2. Analyze Your DAG

Before prompting Claude to migrate, understand what you're working with. Look at your DAG and note:

- How many tasks exist, and which can run in parallel
- How data flows between tasks (XCom returns, file paths, external storage)
- Large inline scripts that should become namespace files
- External dependencies (databases, APIs, credentials)
- Retry/backfill configuration

A typical Airflow project looks like this:

```
airflow-project/
├── airflow.cfg
├── dags/
│   ├── my_pipeline.py       # DAG definition
│   ├── sql/                 # Supporting SQL files
│   └── scripts/             # Supporting Python scripts
└── data/
```

### 3. Generate the Kestra Flow

Open Claude Code in your project directory and give it a specific migration prompt:

```
Using the kestra-flow skill, migrate my Airflow DAG at dags/my_pipeline.py to Kestra.

Requirements:
- Namespace: analytics.products
- Use Python Script tasks with docker runner
- Extract long scripts into namespace files
- Preserve the parallelism from the DAG
- Add retries matching the Airflow config
```

What happens under the hood:

1. Claude reads your DAG file completely — tasks, dependencies, schedule, retries
2. It invokes the `kestra-flow` skill, which fetches the live Kestra plugin schema from `https://api.kestra.io/v1/plugins/schemas/flow`
3. Every task type and property is validated against that schema before the YAML is written
4. Claude creates the flow YAML and extracts long scripts to separate Python files

The output structure:

```
kestra/
├── my_pipeline.yml          # The Kestra flow definition
└── scripts/
    ├── fetch_products.py
    ├── compute_stats.py
    └── build_summary.py
```

### 4. Deploy Namespace Files

Namespace files let your flows reference scripts, SQL, and configs stored in Kestra's file storage — separate from the flow YAML itself. Upload your extracted scripts:

```bash
for f in kestra/scripts/*.py; do
  name=$(basename "$f")
  kestractl nsfiles upload analytics.products "$f" "scripts/$name" \
    --allow-missing-namespace --override
done

# Verify
kestractl nsfiles list analytics.products --path scripts/ --recursive
```

Or ask Claude to handle this for you — it will use the `kestra-ops` skill and run the right `kestractl` commands.

### 5. Validate and Deploy the Flow

Always validate before deploying:

```bash
kestractl flows validate kestra/my_pipeline.yml
```

Expected output:
```
FILE                    STATUS  CONSTRAINTS  WARNINGS
kestra/my_pipeline.yml  OK      -            -
```

If validation fails, paste the error back to Claude:

```
The flow validation failed with this error: <paste error>. Fix the flow YAML.
```

The `kestra-flow` skill will re-fetch the schema and correct the YAML. Then deploy:

```bash
# First time
kestractl flows create kestra/my_pipeline.yml

# Update existing flow
kestractl flows create kestra/my_pipeline.yml --override
```

Open the Kestra UI to confirm the topology view matches your expected DAG structure, then trigger a test execution.

## Key Translation Patterns

Here are the most common Airflow patterns and their Kestra equivalents.

### Sequential pipeline

**Airflow:**
```python
task_a >> task_b >> task_c
```

**Kestra:**
```yaml
tasks:
  - id: task_a
    type: io.kestra.plugin.scripts.python.Script
    # ...
  - id: task_b
    type: io.kestra.plugin.scripts.python.Script
    # ...
  - id: task_c
    type: io.kestra.plugin.scripts.python.Script
    # ...
```

Tasks execute top-to-bottom by default.

### Fan-out / Fan-in (parallel branches)

**Airflow:**
```python
products = fetch_products()
stats = compute_stats(products)      # can run in parallel
brands = compute_brands(products)    # can run in parallel
summary = build_summary(stats, brands)
```

**Kestra:**
```yaml
tasks:
  - id: fetch_products
    type: io.kestra.plugin.scripts.python.Script
    outputFiles:
      - products.json

  - id: parallel_compute
    type: io.kestra.plugin.core.flow.Parallel
    tasks:
      - id: compute_stats
        type: io.kestra.plugin.scripts.python.Script
        inputFiles:
          products.json: "{{ outputs.fetch_products.outputFiles['products.json'] }}"
        outputFiles:
          - stats.json
      - id: compute_brands
        type: io.kestra.plugin.scripts.python.Script
        inputFiles:
          products.json: "{{ outputs.fetch_products.outputFiles['products.json'] }}"
        outputFiles:
          - brands.json

  - id: build_summary
    type: io.kestra.plugin.scripts.python.Script
    inputFiles:
      stats.json: "{{ outputs.compute_stats.outputFiles['stats.json'] }}"
      brands.json: "{{ outputs.compute_brands.outputFiles['brands.json'] }}"
```

Note how data passing works: each task declares what files it produces (`outputFiles`) and what files it needs (`inputFiles`), referencing upstream task outputs by name.

### Conditional branching

**Airflow:**
```python
@task.branch
def choose_branch(**kwargs):
    return "task_a" if condition else "task_b"
```

**Kestra:**
```yaml
- id: choose_branch
  type: io.kestra.plugin.core.flow.If
  condition: "{{ outputs.previous_task.vars.condition == 'true' }}"
  then:
    - id: task_a
      type: ...
  else:
    - id: task_b
      type: ...
```

### Scheduling

**Airflow:**
```python
dag = DAG("my_dag", schedule="@daily", ...)
```

**Kestra:**
```yaml
triggers:
  - id: daily_schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 0 * * *"
```

Kestra supports multiple triggers per flow — combine a schedule trigger with a webhook trigger to make the same flow runnable both on a schedule and via API call.

### Retries

**Airflow:**
```python
default_args = {"retries": 3, "retry_delay": timedelta(seconds=30)}
```

**Kestra** (per task):
```yaml
- id: my_task
  type: io.kestra.plugin.scripts.python.Script
  retry:
    type: constant
    maxAttempts: 3
    interval: PT30S
```

## Concept Mapping Reference

| Airflow Concept | Kestra Equivalent |
|---|---|
| DAG | Flow |
| Task | Task (YAML object in `tasks` list) |
| Operator | Plugin task type |
| XCom | `outputFiles` / `inputFiles` with internal storage |
| Connections | `{{ secret('KEY') }}` or task-level credential properties |
| Variables | Flow `inputs` or KV store |
| Sensors | `Schedule`, `Webhook`, `Flow` triggers or polling tasks |
| TaskGroups | `io.kestra.plugin.core.flow.Parallel` or Sequential grouping |
| SubDAGs | `io.kestra.plugin.core.flow.Subflow` |
| `default_args` | Per-task `retry`, `timeout` |
| Tags | Labels (`labels: { env: "prod" }`) |
| `trigger_rule` | `allowFailure: true` on tasks |

## Why This Approach Works

The AI-assisted migration works well because the `kestra-flow` skill grounds Claude Code in the actual, live Kestra schema. Without it, an AI agent would guess task type names and property names, producing YAML that fails validation. With the skill, every generated property is validated against the plugin registry before it's written.

The `kestra-ops` skill handles the operational side — Claude doesn't need to memorize `kestractl` flags. It fetches the right commands, runs them, and reports back.

For teams with large DAG catalogs, this approach scales. You can migrate DAGs one at a time, running both Airflow and Kestra in parallel until you're confident in the new flows.

## Getting Started

1. Install Kestra agent skills: [kestra.io/docs/ai-tools/agent-skills](https://kestra.io/docs/ai-tools/agent-skills)
2. Install `kestractl`: [kestra.io/docs/kestra-cli/kestractl](https://kestra.io/docs/kestra-cli/kestractl)
3. Spin up a local Kestra instance or connect to your existing environment
4. Pick a simple DAG to start — a 3-5 task sequential pipeline is a good first candidate

The migration from Airflow to Kestra doesn't have to be a months-long project. With the right tooling, a single DAG goes from Python to validated, deployed Kestra flow in under an hour.
