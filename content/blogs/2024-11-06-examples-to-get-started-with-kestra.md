---
title: "Curated Examples to Help You Build with Kestra"
description: "Explore our curated library of examples to help you build with Kestra"
date: 2024-10-25T13:00:00
category: Solutions
author:
  name: Will Russell
  image: "wrussell"
image: /blogs/.jpg
---

When you get started with a new tool, it can be overwhelming to know where to start and what to look at first. You probably already have some existing code that you're looking to integrate without having to do a ton of extra work.

To tackle this, we’ve build a library of curated examples called [Blueprints](/blueprints) to help you jump right in. We’ll walk through a number of our Blueprints to help you identify where you should start!

As a unified orchestrator, Kestra can handle almost any use case. With this in mind, we’re going to discuss some of the common building blocks to enable you to build something that fits your use case.

## Integrating Your Code into Kestra

One of the number one questions we get is "how do I get my code into Kestra?" - don't worry, we've got you sorted. We recently did [an in-depth article](./2024-10-25-code-in-any-language.md) on how to integrate your code directly into Kestra, including handling inputs, outputs and files to allow Kestra to work best with your code.

To accompany that, we've got a number of helpful Blueprints covering a variety of use cases.

**[Data Engineering Pipeline Example](/blueprints/data-engineering-pipeline)**

This flow demonstrates a data engineering pipeline utilizing Python. As each task generates outputs, we can access those in later tasks allowing everything to work in unison.

```yaml
id: data-engineering-pipeline
namespace: tutorial
description: Data Engineering Pipelines
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
  - id: transform
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:3.11-alpine
    inputFiles:
      data.json: "{{ outputs.extract.uri }}"
    outputFiles:
      - "*.json"
    env:
      COLUMNS_TO_KEEP: "{{ inputs.columns_to_keep }}"
    script: |
      import json
      import os

      columns_to_keep_str = os.getenv("COLUMNS_TO_KEEP")
      columns_to_keep = json.loads(columns_to_keep_str)

      with open("data.json", "r") as file:
          data = json.load(file)

      filtered_data = [
          {column: product.get(column, "N/A") for column in columns_to_keep}
          for product in data["products"]
      ]

      with open("products.json", "w") as file:
          json.dump(filtered_data, file, indent=4)
  - id: query
    type: io.kestra.plugin.jdbc.duckdb.Query
    inputFiles:
      products.json: "{{ outputs.transform.outputFiles['products.json'] }}"
    sql: |
      INSTALL json;
      LOAD json;
      SELECT brand, round(avg(price), 2) as avg_price
      FROM read_json_auto('{{ workingDir }}/products.json')
      GROUP BY brand
      ORDER BY avg_price DESC;
    store: true
```

**[]()**

Another example of integrating our code....

Shell example here

## Access your Git repositories

Orchestrating your code is useful, but being able to sync that with your Git repository streamlines it even more. There are multiple ways to integrate with Git inside of Kestra:
1. Clone
2. PushFlows/SyncFlows and PushNamespaceFiles/SyncNamespaceFiles


**[Clone a GitHub repository and run a Python ETL script](/blueprints/git-python)**

Starting with **Clone**, we can clone our repository and then have other tasks access it as if we were using it on our local machine.

This example also uses the [WorkingDirectory task](../docs/04.workflow-components/01.tasks/02.scripts/working-directory.md) to create an environment where we can write files and easily access them between tasks. Without this, we'd have to pass them between tasks as [output files](../docs/04.workflow-components/01.tasks/02.scripts/07.input-output-files.md) which can become tedious for larger outputs, like a repository. This means we're always using the most up to date code when we run this workflow.

```yaml
id: git-python
namespace: company.team
tasks:
  - id: python_scripts
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/scripts
        branch: main
      - id: python
        type: io.kestra.plugin.scripts.python.Commands
        warningOnStdErr: false
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: ghcr.io/kestra-io/pydata:latest
        commands:
          - python etl/global_power_plant.py
```

**[Sync code from Git at regular intervals](/blueprints/sync-from-git)

This example uses the SyncFlows and SyncNamespaceFiles to pull the content of our Git repository directly into Kestra, rather than isolated inside of a flow. This is useful for managing our Kestra instance, especially if we have separate dev and production instances.

```yaml
id: sync-from-git
namespace: company.team
tasks:
  - id: sync_flows
    type: io.kestra.plugin.git.SyncFlows
    gitDirectory: flows
    targetNamespace: git
    includeChildNamespaces: true
    delete: true
    url: https://github.com/kestra-io/flows
    branch: main
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    dryRun: true
  - id: sync_namespace_files
    type: io.kestra.plugin.git.SyncNamespaceFiles
    namespace: prod
    gitDirectory: _files
    delete: true
    url: https://github.com/kestra-io/flows
    branch: main
    username: git_username
    password: "{{ secret('GITHUB_ACCESS_TOKEN') }}"
    dryRun: true
triggers:
  - id: every_full_hour
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/15 * * * *"
```

## Tapping into the Power of the Cloud

Another common use case is integrating Kestra directly with the cloud. It's no mystery that cloud providers can unlock tons of possibilities with their huge amount of compute power.

We have official plugins for [AWS](/plugins/plugin-aws), [Google Cloud](/plugins/plugin-gcp) and [Azure](/plugins/plugin-azure).

S3, BigQuery, Batch

**[Event-driven data ingestion to AWS S3 data lake managed by Apache Iceberg, AWS Glue and Amazon Athena](/blueprints/ingest-to-datalake-event-driven)**

Jumping right in, this workflow uses a bunch of different AWS services. This workflow ingests data to an S3 data lake using a Python script.

```yaml
id: ingest-to-datalake-event-driven
namespace: company.team

variables:
  source_prefix: inbox
  destination_prefix: archive
  database: default
  bucket: kestraio

tasks:
  - id: wdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/scripts
      - id: etl
        type: io.kestra.plugin.scripts.python.Commands
        warningOnStdErr: false
        taskRunner:
          type: io.kestra.plugin.scripts.runner.docker.Docker
        containerImage: ghcr.io/kestra-io/aws:latest
        env:
          AWS_ACCESS_KEY_ID: "{{ secret('AWS_ACCESS_KEY_ID') }}"
          AWS_SECRET_ACCESS_KEY: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
          AWS_DEFAULT_REGION: "{{ secret('AWS_DEFAULT_REGION') }}"
        commands:
          - python etl/aws_iceberg_fruit.py {{ vars.destination_prefix }}/{{
            trigger.objects | jq('.[].key') | first }}

  - id: merge_query
    type: io.kestra.plugin.aws.athena.Query
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    region: "{{ secret('AWS_DEFAULT_REGION') }}"
    database: "{{ vars.database }}"
    outputLocation: s3://{{ vars.bucket }}/query_results/
    query: >
      MERGE INTO fruits f USING raw_fruits r
          ON f.fruit = r.fruit
          WHEN MATCHED
              THEN UPDATE
                  SET id = r.id, berry = r.berry, update_timestamp = current_timestamp
          WHEN NOT MATCHED
              THEN INSERT (id, fruit, berry, update_timestamp)
                    VALUES(r.id, r.fruit, r.berry, current_timestamp);
  - id: optimize
    type: io.kestra.plugin.aws.athena.Query
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    region: "{{ secret('AWS_DEFAULT_REGION') }}"
    database: "{{ vars.database }}"
    outputLocation: s3://{{ vars.bucket }}/query_results/
    query: |
      OPTIMIZE fruits REWRITE DATA USING BIN_PACK;       

triggers:
  - id: wait_for_new_s3_objects
    type: io.kestra.plugin.aws.s3.Trigger
    bucket: kestraio
    interval: PT1S
    maxKeys: 1
    filter: FILES
    action: MOVE
    prefix: "{{ vars.source_prefix }}"
    moveTo:
      key: "{{ vars.destination_prefix }}/{{ vars.source_prefix }}"
      bucket: "{{ vars.bucket }}"
    region: "{{ secret('AWS_DEFAULT_REGION') }}"
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
```

