---
title: "How to Orchestrate dbt Core in Production with Kestra"
description: "dbt Core handles transformation but leaves scheduling, retries, upstream dependencies, and failure handling to you. Kestra fills that gap — and its YAML-first model makes it a natural fit for teams already living in dbt."
date: 2026-02-25T13:00:00
category: Solutions
author:
  name: Elliot Gunn
  image: egunn
  role: Product Marketing Manager
image: ./main.png
---

[dbt Core](/plugins/plugin-dbt) handles transformation. It doesn't schedule itself, wait for upstream sources, retry on failure, or alert anyone when something breaks. So you need something around it that does — an orchestrator that knows when source data is ready, triggers the run, and handles what happens when things break.

There are several options, and I'll get into why Kestra is a natural fit for dbt Core teams specifically. Kestra's own analytics stack runs this way — our analytics engineer, Rok, uses Kestra to orchestrate PyAirbyte ingestion, dbt transformations in [BigQuery](/plugins/plugin-gcp), and Lightdash reporting for the entire company on a single platform. [That setup is documented here.](../2026-01-06-how-kestra-runs-on-kestra/index.md) I'll also walk through the key YAML patterns for running dbt in production with Kestra.


## Kestra works with dbt Core and dbt Cloud

The two use cases are different, but Kestra adds value in both.

**dbt Core** ships without a production runtime. No scheduler, no retry logic, no dependency management, no alerting. You need something around it that handles all of that.

Kestra is that layer: it runs your dbt CLI commands in isolated containers, waits for upstream sources before triggering, retries on transient failures, and routes alerts when things break. The rest of this post is about this setup.

**dbt Cloud** includes its own scheduler and CI runner, so teams whose pipeline starts and ends with dbt can get by without a separate orchestrator. But most pipelines don't start and end with dbt. They start with ingestion ([Airbyte](/plugins/plugin-airbyte), [Fivetran](/plugins/plugin-fivetran), custom extractors) and feed into activation or analytics layers downstream.

dbt Cloud orchestrates its slice. Everything around it is your problem.

Kestra handles that broader pipeline (ingestion, transformation, activation) as a single workflow. dbt Cloud can still run the transformation layer; Kestra coordinates what happens before and after.

And for teams that care about cross-stack lineage, Kestra's [Assets](../../docs/07.enterprise/02.governance/01.assets/index.md) fill the gap dbt Cloud leaves: dbt tracks lineage within your models, but has no visibility into the S3 bucket feeding them or the reverse ETL sync consuming their output. Assets tracks inputs and outputs across every step in the pipeline, not just within dbt.


## Why Kestra is a natural fit for dbt Core


### dbt is YAML. So is Kestra.

dbt teams already think in YAML. A Kestra workflow uses the same syntax and mental model, so there's no context switch between defining a dbt model and defining the orchestration around it.

Here's a dbt schema definition:

```yaml
# dbt schema.yml
models:
  - name: orders
    description: cleaned orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
```

And here's the Kestra task that runs it:

```yaml
# kestra workflow
id: dbt_pipeline
namespace: company.data

tasks:
  - id: build
    type: io.kestra.plugin.dbt.cli.DbtCLI
    commands:
      - dbt build
```

Python-based orchestrators require a different context entirely: DAG definitions, decorator patterns, framework-specific imports. For a team that lives in YAML and SQL, that's a real overhead cost.


### Your dbt project stays untouched

Kestra's dbt plugin runs CLI commands (`dbt build`, `dbt test`, `dbt deps`) inside isolated Docker containers. Point it at your existing repo and it runs as-is.


### Orchestration beyond dbt, including lineage

dbt rarely runs in isolation. Ingestion and activation sit on either side of it, and Kestra handles those with 1200+ plugins. dbt becomes one step in a larger workflow rather than an isolated process you glue to other tools with scripts.

For teams that care about cross-pipeline lineage, Kestra's [Assets](../../docs/07.enterprise/02.governance/01.assets/index.md) feature tracks inputs and outputs across every step, not just within dbt. You can see which warehouse tables a dbt model reads from, what downstream workflows consume its output, and which execution created or last modified a given asset, across your entire stack from ingestion through activation.


### Built-in production primitives

[Retries](../../docs/05.workflow-components/12.retries/index.md) with exponential backoff, [error handling](../../docs/05.workflow-components/11.errors/index.md) blocks, [secrets management](../../docs/07.enterprise/02.governance/secrets-manager/index.md), [RBAC](../../docs/07.enterprise/03.auth/rbac/index.md), [audit logs](../../docs/07.enterprise/02.governance/06.audit-logs/index.md) — Kestra treats these as first-class workflow components, declared in the same YAML file as your dbt tasks rather than bolted on through separate tooling.


### Event-driven, not just scheduled

Kestra can trigger dbt runs on a [cron schedule](../../docs/05.workflow-components/07.triggers/01.schedule-trigger/index.md), but also in response to file arrivals in S3, [webhook calls](../../docs/05.workflow-components/07.triggers/03.webhook-trigger/index.md), [Kafka](/plugins/plugin-kafka) messages, or the completion of an upstream task. Your dbt models run when the data is actually ready, not on a timer that hopes it is.


## How dbt Core and Kestra work together

These examples build up a production dbt setup in Kestra piece by piece, drawn from [Kestra's dbt documentation](../../docs/use-cases/02.dbt/index.md) and tested Blueprints.


### Basic dbt build from Git

Clone your dbt project, install dependencies, run the build, schedule it daily:

```yaml
id: dbt_pipeline
namespace: company.data

tasks:
  - id: dbt
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone
        type: io.kestra.plugin.git.Clone
        url: https://github.com/your-org/dbt-project
        branch: main
      - id: build
        type: io.kestra.plugin.dbt.cli.DbtCLI
        containerImage: ghcr.io/kestra-io/dbt-duckdb:latest
        commands:
          - dbt deps
          - dbt build
        profiles: |
          my_project:
            outputs:
              prod:
                type: snowflake
                account: "{{ secret('SNOWFLAKE_ACCOUNT') }}"
                user: "{{ secret('SNOWFLAKE_USER') }}"
                password: "{{ secret('SNOWFLAKE_PASSWORD') }}"
                database: analytics
                schema: public
            target: prod

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 8 * * *"
```

Credentials live in Kestra's secrets manager, not in your repo. The `containerImage` field controls which dbt version runs, isolated from anything else on the host.


### Waiting for upstream data

If your dbt models depend on an Airbyte sync completing first, declare that dependency directly:

```yaml
tasks:
  - id: airbyte_sync
    type: io.kestra.plugin.airbyte.connections.Sync
    connectionId: "{{ secret('AIRBYTE_CONNECTION_ID') }}"

  - id: dbt_build
    type: io.kestra.plugin.dbt.cli.DbtCLI
    containerImage: ghcr.io/kestra-io/dbt-duckdb:latest
    commands:
      - dbt build
```

Tasks run sequentially by default. If the sync fails, dbt never starts. If you have multiple independent sources, you can run syncs in parallel and gate dbt on all of them completing.


### Retries on failure

Warehouse timeouts, network issues, transient [Snowflake](/plugins/plugin-jdbc-snowflake) errors. Add retry logic at the task level:

```yaml
- id: dbt_build
  type: io.kestra.plugin.dbt.cli.DbtCLI
  retry:
    type: exponential
    maxAttempts: 3
    interval: PT30S
    maxInterval: PT5M
  commands:
    - dbt build
```

Three attempts with exponential backoff. The retry is declared alongside the task, not in a separate config file or monitoring layer.


### Failure alerts

Route failures to [Slack](/plugins/plugin-slack) (or email, [PagerDuty](/plugins/plugin-pagerduty), or anything with an API) using Kestra's error handling block:

```yaml
errors:
  - id: slack_alert
    type: io.kestra.plugin.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: |
      dbt build failed in {{ flow.namespace }}
      Execution: {{ execution.id }}
```

The `errors` block runs only when the workflow fails. The message includes the execution ID, so whoever responds can jump directly to the logs.


### Git sync and CI/CD

For teams that want Kestra to pull the latest dbt code on every run without a separate clone step, [Git sync](../../docs/version-control-cicd/04.git/index.md) keeps namespace files in sync with your repo:

```yaml
tasks:
  - id: sync
    type: io.kestra.plugin.git.SyncNamespaceFiles
    url: https://github.com/your-org/dbt-project
    branch: main
    namespace: "{{ flow.namespace }}"
    gitDirectory: dbt

  - id: dbt_build
    type: io.kestra.plugin.dbt.cli.DbtCLI
    containerImage: ghcr.io/kestra-io/dbt-duckdb:latest
    namespaceFiles:
      enabled: true
    commands:
      - dbt deps
      - dbt build
```

For CI workflows, run `dbt build --select state:modified+` against a feature branch and block merges on test failures. Kestra stores the dbt manifest between runs, so state-based selection works across executions.


## Getting started

The fastest path is a [dbt Blueprint](/blueprints?tags=dbt): a production-ready template you can deploy and customize. For a full walkthrough of profiles management, manifest caching, and multi-environment setups, see the [dbt orchestration docs](../../docs/use-cases/02.dbt/index.md).

Running dbt across multiple teams with [namespace isolation](../../docs/07.enterprise/02.governance/07.namespace-management/index.md), RBAC, and audit logging? [Book a demo](/demo) to see those features in action.