---
title: "How Kestra's Assets Give You Complete Pipeline Lineage"
description: "Kestra 1.2 introduces Assets, a unified way to track both data artifacts and infrastructure resources across your workflows, giving you lineage that reflects what your pipelines actually touch."
date: 2026-01-26T13:00:00
category: Solutions
author: 
  name: "Parham Parvizi"
  image: pparvizi
  role: Solutions Engineer
image: ./main.png
---

[Kestra 1.2](https://kestra.io/blogs/release-1-2) introduces Assets, a way to track both data artifacts (tables, datasets, files) and infrastructure resources (buckets, VMs, compute) in a single inventory. Every workflow declares what it consumes and produces, and Kestra builds the dependency graph automatically.

Here’s why this matters: You're a data engineer and your DevOps team moves an on-prem ETL node to a different subnet. Which pipelines are now failing to connect? Or a team member provisions a new S3 bucket for customer data. How do you track which workflows are writing to it?

These scenarios share a common problem: the thing that changed includes both data and infrastructure, but your orchestrator only tracks task execution order. You can see that "Task A runs before Task B," but you can't see what they actually touch. When something breaks, you're left tracing dependencies manually.

Assets solve this by letting you declare what each task reads and writes, whether that's a database table, a cloud bucket, a file, or a provisioned VM. Kestra builds the dependency graph automatically, so your lineage reflects everything your pipelines touch, not just the data layer.

## Why data-only orchestration falls short

Modern [orchestration tools](https://kestra.io/blogs/2024-09-18-what-is-an-orchestrator), even forward-thinking ones, assume that "asset" means "data asset," like tables, views, and datasets. **This is a fundamental architectural limitation.** These tools were designed around the assumption that orchestration means scheduling SQL transformations, so they track what happens between databases, not what happens between systems.

This works well enough for transformation-heavy workflows where every step reads a table and writes another table. But production [data pipelines](https://kestra.io/docs/use-cases/data-pipelines) rarely stay that clean. A typical analytics workflow might:

1. Pull raw data from an external API
2. Land it in a cloud storage bucket
3. Load it into a staging table
4. Transform it through multiple layers
5. Export aggregates to a downstream system

Steps 1, 2, and 5 involve infrastructure, not just data. If your lineage tool only tracks tables, you lose visibility into the bucket that holds your raw data, the API that feeds it, and the export job that delivers it. When something breaks, you're missing context. And when you're planning changes, you can't predict the impact across systems.

Kestra’s Assets solve this by treating data and infrastructure as first-class citizens in the orchestrator itself. Tables, buckets, file uploads, and provisioned VMs are assets. A table is an asset. A bucket is an asset. A file upload is an asset. They all live in the same inventory, with the same lineage tracking, built into execution.

## How Kestra's Assets work

You declare assets directly on workflow tasks using the `assets` property. Each task can specify `inputs` (resources it reads) and `outputs` (resources it creates or modifies).

<Add a dependency graph screenshot for the job above>

Here's a simple example that creates a staging table:

```yaml
tasks:
  - id: create_trips_table
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      CREATE TABLE IF NOT EXISTS trips AS
      SELECT VendorID, passenger_count, trip_distance
      FROM sample_data.nyc.taxi LIMIT 10;
    assets:
      inputs:
        - id: sample_data.nyc.taxi
      outputs:
        - id: trips
          type: io.kestra.plugin.ee.assets.Table
          metadata:
            model_layer: staging
```

The task declares `sample_data.nyc.taxi` as an input (an external source managed outside this workflow) and `trips` as an output. Kestra registers both in its inventory and draws the dependency line between them.

The `metadata` field is flexible. You can tag assets by model layer (staging, mart), owner, environment, or any dimension that helps you filter and organize. This becomes useful when you have hundreds of assets and need to answer questions like "show me all staging tables owned by the data team."

## Three use cases for data teams

### 1. Multi-layer data pipelines with full lineage

The classic analytics pattern: staging layer reads from external sources, mart layer aggregates for reporting. With Assets, you track the complete chain.

> Suggested image 1: Screenshot of the Assets UI showing the lineage graph for this pipeline, with the external source, staging table, and mart table connected by dependency lines.
> 

```yaml
tasks:
  - id: staging
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      CREATE TABLE trips AS
      SELECT * FROM sample_data.nyc.taxi LIMIT 10;
    assets:
      inputs:
        - id: sample_data.nyc.taxi
      outputs:
        - id: trips
          type: io.kestra.plugin.ee.assets.Table
          metadata:
            model_layer: staging

  - id: mart
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: SELECT AVG(trip_distance) AS avg_distance FROM trips;
    assets:
      inputs:
        - id: trips
      outputs:
        - id: avg_trip_distance
          type: io.kestra.plugin.ee.assets.Table
          metadata:
            model_layer: mart

```

Kestra builds the lineage graph automatically: `sample_data.nyc.taxi` -> `trips` -> `avg_trip_distance`. If the external source schema changes, you can trace the impact downstream. If a mart table looks wrong, you can trace it back to its staging dependencies.

### 2. Infrastructure provisioning with resource tracking

Many data teams do more than transform data; they also [provision the infrastructure](https://kestra.io/docs/use-cases/infrastructure) that holds it. When your platform team creates S3 buckets for different domains, those buckets become dependencies for downstream workflows.

> Suggested image 2: Screenshot showing the Assets inventory filtered by type: AWS_BUCKET, displaying the four team buckets with their metadata.
> 

```yaml
id: provision_team_buckets
namespace: company.infra

inputs:
  - id: teams
    type: MULTISELECT
    values: [Business, Data, Finance, Product]

tasks:
  - id: create_buckets
    type: io.kestra.plugin.core.flow.ForEach
    values: "{{ inputs.teams }}"
    tasks:
      - id: create_bucket
        type: io.kestra.plugin.aws.cli.AwsCLI
        commands:
          - aws s3 mb s3://kestra-{{ taskrun.value | slugify }}-bucket
        assets:
          outputs:
            - id: kestra-{{ taskrun.value | slugify }}-bucket
              type: AWS_BUCKET
              metadata:
                provider: s3
                team: "{{ taskrun.value }}"

```

Later, when the data team uploads files to their bucket, they reference it as an input asset:

```yaml
tasks:
  - id: upload_to_bucket
    type: io.kestra.plugin.aws.s3.Upload
    bucket: kestra-data-bucket
    from: '{{ outputs.download.uri }}'
    key: raw_customers.csv
    assets:
      inputs:
        - id: kestra-data-bucket
      outputs:
        - id: raw_customers
          type: io.kestra.plugin.ee.assets.File
          metadata:
            owner: data

```

Now your lineage graph connects infrastructure provisioning to data workflows. You can answer questions like: "Which teams are using which buckets?" and "What files have been uploaded to each bucket?"

### 3. Infrastructure operations with asset-based targeting

> Suggested image 3: Screenshot of the workflow execution form showing a list of machines (nodes) registered as assets with the "python" metadata tag, ready to be upgraded.
> 

Once Assets exist in the inventory, you can reference them dynamically in other workflows. The `assets()` function queries your inventory and returns matching assets, which you can use to target infrastructure operations at scale.

```
id: upgrade_python
namespace: team.infra

tasks:
  - id: upgrade_python_on_machines
    type: io.kestra.plugin.core.flow.ForEach
    values: '{{ assets(metadata={"nodes": "python"}) | jq(".[].id") }}'
    tasks:
      - id: upgrade_python
        type: io.kestra.plugin.scripts.shell.Commands
        description: "upgrades Python to 3.14, and checks the version."
        commands:
          - "ssh user@{{ taskrun.value }} 'sudo apt-get update && sudo apt-get install -y python3.14'"
          - "echo 'Python upgrade and check completed for {{ taskrun.value }}'"
```

This workflow queries the asset inventory for all machines tagged with `"nodes": "python"` and runs the upgrade across each one. The inventory stays current because it's populated by the workflows that provision the infrastructure.

## Shipping lineage to external systems

If you're already using OpenLineage-compatible tools (Marquez, DataHub, Atlan), Assets integrates with them. The `AssetShipper` task exports your asset metadata to external lineage providers:

```yaml
tasks:
  - id: export_lineage
    type: io.kestra.plugin.ee.assets.AssetShipper
    assetExporters:
      - id: openlineage
        type: io.kestra.plugin.ee.openlineage.OpenLineageAssetExporter
        uri: <http://your-lineage-server:5000>
        mappings:
          io.kestra.plugin.ee.assets.Table:
            namespace: namespace

```

This lets you maintain a single source of truth in Kestra while pushing lineage data to specialized catalogs for discovery and [governance](https://kestra.io/docs/enterprise/governance).

## Blueprints to get started

Kestra's [Templated Blueprints](https://kestra.io/docs/enterprise/governance/custom-blueprints) let you create reusable workflow templates that users can instantiate by filling out a form, no YAML editing required. Platform teams define the template once (including asset declarations), and other teams generate production-ready workflows by selecting options from dropdowns.

To make asset tracking adoption easier, consider creating these Blueprints for your team:

| Blueprint | Description | Template Arguments |
| --- | --- | --- |
| **staging-to-mart** | Multi-layer pipeline with automatic asset declaration | Source table, mart name, aggregation type, model layer tags |
| **team-bucket-provisioner** | Self-service S3/GCS bucket creation with asset registration | Team name, cloud provider, region, retention policy |
| **asset-quality-scanner** | Run quality checks on assets matching metadata filters | Asset type, metadata filters, check severity |
1. **Staging-to-Mart Pipeline Blueprint** - A template where users select source tables, transformation logic, and target mart names. Assets are declared automatically based on inputs.
2. **Team Bucket Provisioning Blueprint** - A self-service template for platform teams to provision cloud storage for new domains, with assets registered on creation.
3. **Data Quality Check Blueprint** - A template that queries the asset inventory for tables matching certain metadata (e.g., `model_layer: staging`) and runs quality checks against each.

These blueprints let teams adopt asset tracking without writing YAML from scratch. Fill in the form, get a workflow with complete lineage built in.

## **Assets build the complete picture**

Most lineage tools track data. Assets track everything your pipelines touch: the tables, the buckets, the files, the infrastructure. When you declare inputs and outputs on every task, Kestra builds the dependency graph that shows how it all connects.

The result is lineage that reflects reality, not just the data transformation layer. When something breaks, you can trace the full chain. When you're planning changes, you can see the impact across data and infrastructure.

Assets are available in Kestra Enterprise Edition 1.2+. Check out our [docs](https://kestra.io/docs/enterprise/governance/assets) or get in touch [for a demo.](https://kestra.io/demo)