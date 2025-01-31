---
title: Orchestrate Data Pipelines
description: Schedule, backfill, automate, and scale data pipelines declaratively
order: 10
---

Data teams use orchestration platforms like Kestra to manage complex pipelines — ingesting raw data, transforming it, and delivering it to warehouses, lakes, or applications. The orchestration engine ensures workflows run in the correct sequence, recover from failures, and scale dynamically.

## What is Data Orchestration?

Data orchestration automates the execution of interconnected tasks (like ETL, analytics, or ML jobs) while respecting dependencies and business logic. It focuses on **how data moves** between systems, teams and processes.

With Kestra, orchestration means:
- **Flexible workflow triggers** via `Schedule`, external events (e.g., a new file in S3/SFTP), or API calls.
- **Managing execution** — retries, parallel task runs, timeouts, SLAs, concurrency and error handling.
- **Dynamic resource allocation** — provisioning containers on-demand (e.g., AWS Fargate, GCP Batch, Azure Batch, Kubernetes) for compute-heavy tasks.
- **Visibility** — tracking logs, inputs, outputs, metrics, and lineage across workflows and tasks.

---

## Why Use Kestra for Data Orchestration?

1. **Portability** – Define each data pipeline in a self-contained, portable YAML configuration that includes tasks, triggers, dependencies and infrastructure concerns.
2. **Dynamic Scaling** – Task runners spin up containers on cloud services (AWS ECS Fargate, Google Batch, Kubernetes) dynamically at runtime — no need for dedicated always-on workers (unless on-premise resources are preferred using [worker groups](../06.enterprise/worker-group.md)).
3. **Execution Control** – Set retries, timeouts, SLAs, and concurrency limits.
4. **Zero Code Changes** – Run existing Python/R/SQL scripts as-is (no decorators needed); specify dependencies via YAML configuration.
5. **State Management** – Pass data of any size between tasks (files, variables, query results) or between workflows (using KV Store) thanks to [internal storage](../07.architecture/09.internal-storage.md).
6. **Extensible Integrations** – Connect to over 600 services via [pre-built plugins](https://kestra.io/plugins).
7. **Observability** – Monitor flow execution states, durations, logs, inputs, outputs and resource usage in real time.

---

## Example: Data Engineering Pipeline

This flow downloads a JSON dataset via REST API, filters specific columns using Python, and calculates KPIs with DuckDB. Kestra dynamically provisions a Python container for the transformation step and terminates it once the task completes:

```yaml
id: data_pipeline
namespace: tutorial
description: Process product data to calculate brand price averages

inputs:
  - id: columns_to_keep
    type: ARRAY
    itemType: STRING
    defaults:
      - brand
      - price

tasks:
  - id: extract
    type: io.kestra.plugin.core.http.Download
    uri: https://dummyjson.com/products

  # Filter columns in a disposable Python container
  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:3.11-slim
    taskRunner: # spins up container on-demand
      type: io.kestra.plugin.scripts.runner.docker.Docker
    inputFiles:
      data.json: "{{ outputs.extract.uri }}"  # Input from previous task
    outputFiles:
      - "*.json"
    script: |
      import json
      filtered_data = [
          {col: product.get(col, "N/A") for col in {{ inputs.columns_to_keep }}}
          for product in json.load(open("data.json"))["products"]
      ]
      json.dump(filtered_data, open("products.json", "w"), indent=4)

  # Analyze filtered data with DuckDB
  - id: query
    type: io.kestra.plugin.jdbc.duckdb.Query
    fetchType: STORE
    inputFiles:
      products.json: "{{ outputs.transform.outputFiles['products.json'] }}"
    sql: |
      INSTALL json;
      LOAD json;
      SELECT brand, ROUND(AVG(price), 2) AS avg_price
      FROM read_json_auto('{{ workingDir }}/products.json')
      GROUP BY brand
      ORDER BY avg_price DESC;
```

---

## Getting Started with Data Orchestration

1. **Install Kestra** – Follow the [quick start guide](../01.getting-started/01.quickstart.md) or the full [installation instructions for production environments](../02.installation/index.md).
2. **Write Your Workflows** – Configure your [flow](../03.tutorial/index.md) in YAML, declaring inputs, tasks, and triggers. Tasks can be anything — scripts, queries, remote jobs or API calls. Add `retry`, `timeout`, `concurrency` or `taskRunner` settings to scale tasks dynamically and manage the orchestration logic.
3. **Add Triggers** – Execute flows manually, via schedules, API, flow or event [triggers](../04.workflow-components/07.triggers/index.md) (e.g., S3 file uploads).
4. **Observe and Manage** – Use [Kestra’s UI](../08.ui/index.md) to inspect workflow outputs, logs, execution states, and dependencies.

---

## Next Steps
- [Explore plugins](https://kestra.io/plugins) for databases, data ingestion and transformation tools or custom scripts in any language.
- [Explore blueprints](https://kestra.io/blueprints) for common data workflows and orchestration patterns.
- [Explore How-to Guides](../15.how-to-guides/index.md) for detailed examples on [using Kestra for ETL](../15.how-to-guides/etl-pipelines.md), [ELT](../15.how-to-guides/dbt.md), ML, and more.
- [Explore Task Runners](../06.enterprise/task-runners.md) for scaling custom scripts and containers.
- [Join Slack](https://kestra.io/slack) to share flow examples or ask questions.
- [Book a demo](https://kestra.io/demo) to discuss how Kestra can help orchestrate your data workflows.

