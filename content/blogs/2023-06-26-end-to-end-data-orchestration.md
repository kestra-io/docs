---
title: "End-to-End Data Ingestion, Transformation and Orchestration with Airbyte, dbt and Kestra"
description: How you can use open-source tools to ingest, transform and orchestrate data pipelines without vendor lock-in.
date: 2023-06-26T14:00:00
category: Solutions
author:
  name: Anna Geller
  image: "ageller"
image: /blogs/2023-06-26-end-to-end-data-orchestration.png
---


The key benefit of the Modern Data Stack is that you can avoid vendor lock-in by selecting best-of-breed tools rather than paying expensive license fees for one inflexible solution. However, assembling your modular stack based on multiple SaaS solutions will only marginally improve that situation. It’s undoubtedly easier to swap only one component by, e.g., migrating between two SaaS BI solutions than migrating an entire all-in-one stack. However, the vendor lock-in issue remains unresolved — all you’ll achieve is multiple vendor lock-ins at a smaller scale rather than one giant lock-in. Open-core technologies and SaaS offerings built on top of them can help avoid these issues and future-proof your data stack.

This post will discuss a selection of open-core tools that you can use to build your data stack in a modular way. Specifically, we'll leverage **Airbyte**, **dbt**, and **Kestra** — all of them are either **source-available** (*Airbyte*) or entirely **open-source** (*dbt and Kestra*).

---

## Airbyte

[Airbyte](https://airbyte.com/) is a data integration platform that simplifies and standardizes replicating data from source systems to desired destinations, such as a data warehouse or a data lake. It provides many pre-built connectors to various databases, APIs, storage systems, and a [low-code CDK](https://docs.airbyte.com/connector-development/config-based/low-code-cdk-overview/) for creating new custom connectors.

To start using Airbyte, you only need a workstation with Docker and a terminal. You can follow [the quickstart guide](https://docs.airbyte.com/quickstart/deploy-airbyte/) to launch Airbyte on your local machine:


```bash
git clone https://github.com/airbytehq/airbyte.git
cd airbyte
./run-ab-platform.sh
```


Then, you can begin creating your sources, destinations, and connections:

- **Sources** describe source systems, such as your applications and databases. This is usually the raw data that serves as a basis for analytics.
- The **destination** is typically your data warehouse or a data lake platform (*such as BigQuery, Snowflake, Redshift, Databricks, Dremio, Starburst, Azure Synapse, and more*).
- Finally, **connections** tie sources and destinations together by specifying how and when to load data from a specific source to a specific destination.

![airbyte1](/blogs/2023-06-26-end-to-end-data-orchestration/airbyte1.png)


## dbt

dbt is a **data build tool** that enables data analysts and engineers to **transform** data in a cloud analytics warehouse using templated SQL and a Command Line Interface (CLI). After you've ingested raw data with Airbyte, dbt can query it and transform it into analytics-ready datasets by executing SQL (*or Python*) code within your warehouse.  Thanks to dbt, you can organize your business logic into modular components (models) and document and test those models. Finally, you can version control your dbt transformations to allow other people in your team to collaborate on the same project and improve the auditability and rollback of your cloud analytics warehouse.

The easiest way to get started with dbt is to leverage the [dbt-duckdb](https://github.com/jwills/dbt-duckdb) package, allowing you to use an in-memory DuckDB database and run everything locally. However, you can also start using dbt for free with [Google BigQuery](https://docs.getdbt.com/docs/core/connect-data-platform/bigquery-setup).


## Kestra

Orchestration is a critical aspect of end-to-end data management, as it helps you coordinate all steps, control and monitor their execution, and respond to failure scenarios. For instance, you can ensure that transformation steps run only after your data has been successfully ingested. If something fails, you can retry it and get notified about that failure.

[Kestra](https://github.com/kestra-io/kestra) is a simple, event-driven orchestrator that helps to maintain orchestration logic as code while bridging the gap between engineers and domain experts. The declarative YAML syntax opens the process of building data workflows to domain experts who are not programmers, as well as programmers working on a different stack (*a language-agnostic interface rather than only Python*).

---

## Hands-on demo

Let's look at how you can combine Airbyte, dbt, and Kestra to build an end-to-end workflow.

First, download Kestra's [Docker Compose file](https://raw.githubusercontent.com/kestra-io/kestra/develop/docker-compose.yml), for example, using `curl`:

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/kestra-io/kestra/develop/docker-compose.yml
```

Then, run `docker compose up -d` and navigate to the UI under `http://localhost:8080/`. You can start [building your first flows](https://kestra.io/docs/getting-started) using the integrated code editor in the UI.

The UI ships with Blueprints, which provide ready-to-use flow examples. For instance, you can use [the following Blueprint](https://demo.kestra.io/ui/blueprints/community/30) that combines all steps needed to orchestrate Airbyte, dbt, and Kestra:

![airbyte2](/blogs/2023-06-26-end-to-end-data-orchestration/airbyte2.png)


Here is a copy of that Blueprint. Make sure that you copy the ID of each connection from the Airbyte UI and paste those into the Airbyte task:

```yaml
id: airbyteDbtCore
namespace: dev

tasks:
  - id: data-ingestion
    type: io.kestra.plugin.core.flow.Parallel
    tasks:
      - id: psyduck
        type: io.kestra.plugin.airbyte.connections.Sync
        connectionId: 4de8ab1e-50ef-4df0-aa01-7f21491081f1

      - id: sample-data
        type: io.kestra.plugin.airbyte.connections.Sync
        connectionId: 71291950-ccc1-4875-91b7-e801376c549e

      - id: charizard
        type: io.kestra.plugin.airbyte.connections.Sync
        connectionId: 9bb96539-73e7-4b9a-9937-6ce861b49cb9

      - id: pikachu
        type: io.kestra.plugin.airbyte.connections.Sync
        connectionId: 39c38950-b0b9-4fce-a303-06ced3dbfa75

  - id: dbt
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: cloneRepository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/jwills/jaffle_shop_duckdb
        branch: duckdb

      - id: dbt-build
        type: io.kestra.plugin.dbt.cli.Build
        debug: true
        runner: DOCKER
        dockerOptions:
          image: ghcr.io/kestra-io/dbt-duckdb:latest
        dbtPath: /usr/local/bin/dbt
        inputFiles:
          .profile/profiles.yml: |
            jaffle_shop:
              outputs:
                dev:
                  type: duckdb
                  path: ':memory:'
                  extensions:
                    - parquet
              target: dev
pluginDefaults:
  - type: io.kestra.plugin.airbyte.connections.Sync
    values:
      url: http://host.docker.internal:8000/
      username: "{{envs.airbyte_username}}"
      password: "{{envs.airbyte_password}}"
```

When you execute that workflow, you should see a similar output:

![airbyte3](/blogs/2023-06-26-end-to-end-data-orchestration/airbyte3.png)


The flow runs four Airbyte data ingestion processes in parallel. Once raw data is successfully ingested, the flow clones a Git repository and runs dbt CLI commands that build models committed to that Git repository.

The topology view shows the duration of each task. The entire flow, executing four Airbyte syncs and `dbt build`, took just one minute to run — all that without having to manually install any dependencies or build a CI/CD. To schedule that flow, you can add a simple CRON-based trigger:

```yaml
triggers:
  - id: everyMinute
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/1 * * * *"
```

---

## Next steps

This post covered how combining Airbyte, dbt, and Kestra can simplify data management. Using these open-core technologies, you can avoid vendor lock-in and get the most out of the Modern Data Stack. If you encounter anything unexpected while reproducing this demo, you can open [a GitHub issue](https://github.com/kestra-io/kestra) or [ask via Kestra Community Slack](https://kestra.io/slack). Lastly, give us [a GitHub star](https://github.com/kestra-io/kestra) if you like the project.

