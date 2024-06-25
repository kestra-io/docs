---
title: "Orchestrate dbt Jobs with Kestra"
description: "Dive into the ways to use dbt in a, quite literally, transformative way!"
date: 2024-04-02T08:00:00
category: Solutions
author:
  name: Martin-Pierre Roset
  image: "mproset"
image: /blogs/2024-04-02-dbt-kestra.jpg
---


At Kestra, we observe many users orchestrating their dbt workflows alongside various elements – data ingestion, alerting, machine learning training, and more. While SQL plays a crucial role, organizations need a solution to automate the entire pipeline. This is where Kestra's orchestration engine steps in.

In this blog post, we will delve into the usage of dbt among our users.

---

## About dbt

[dbt](https://www.getdbt.com/) is the most popular SQL framework in the data industry.

**it’s a SQL-first transformation workflow that lets teams quickly and collaboratively deploy analytics code following software engineering best practices like modularity, portability, CI/CD, and documentation.**

Pioneering the concept of a full-fledged SQL framework, dbt empowers users to construct intricate model dependencies and efficiently test their SQL queries using a straightforward YAML declaration syntax. This combination of functionality and ease of use has cemented dbt's position as a leader in data transformation.

They offer two versions of their tools. dbt Core, the open-source command line tool, and dbt Cloud, a subscription-based cloud version, provide an additional interface layer. The latter handles hosting, offers a managed Git repository, and can schedule dbt transformation jobs for various environments.

---

## Kestra Plugin for dbt

You can leverage the [dbt plugin](https://kestra.io/plugins/plugin-dbt) to orchestrate dbt Cloud and dbt Core jobs. After each scheduled or ad-hoc workflow execution, the Outputs tab in the Kestra UI allows you to download and preview all dbt build artifacts. The Gantt and Topology view additionally render the metadata to visualize dependencies and runtimes of your dbt models and tests. The dbt Cloud task provides convenient links to easily navigate Kestra and dbt Cloud UI.

### Execute dbt CLI commands from Kestra

The **`io.kestra.plugin.dbt.cli.DbtCLI`** can be used to orchestrate any dbt command. You can run dbt Core jobs and enhance the functionality of dbt Cloud tasks within the Kestra environment.

The plugin offers various customizable properties to fine-tune dbt tasks. These include specifying dbt CLI commands (**`dbt deps`**, **`dbt build`**), choosing the execution environment (Docker for isolation or process-based execution), and setting up the environment before running dbt commands. This configuration ensures that dbt tasks are executed with all dependencies correctly prepared.

For example, you can Launch a `dbt build` command on a  dbt project hosted on GitHub:

```yaml

id: dbt_build
namespace: company.team

tasks:
  - id: dbt
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
    - id: cloneRepository
      type: io.kestra.plugin.git.Clone
      url: https://github.com/kestra-io/dbt-example
      branch: main
    - id: dbt-build
      type: io.kestra.plugin.dbt.cli.DbtCLI
      runner: DOCKER
      docker:
        image: ghcr.io/kestra-io/dbt-duckdb
      commands:
        - dbt build
      profiles: |
        my_dbt_project:
          outputs:
            dev:
            type: duckdb
            path: ":memory:"
          target: dev

```

You can also install a custom dbt version and run `dbt deps` and `dbt build` commands:

```yaml
id: dbt_custom_dependencies
namespace: company.team

inputs:
  - id: dbt_version
    type: STRING
    defaults: "dbt-duckdb==1.6.0"

tasks:
  - id: git
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: clone_repository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/dbt-example
        branch: main

      - id: dbt
        type: io.kestra.plugin.dbt.cli.DbtCLI
        runner: DOCKER
        docker:
          image: python:3.11-slim
        beforeCommands:
          - pip install uv
          - uv venv --quiet
          - . .venv/bin/activate --quiet
          - uv pip install --quiet {{ inputs.dbt_version }}
        commands:
          - dbt deps
          - dbt build
        profiles: |
          my_dbt_project:
            outputs:
              dev:
                type: duckdb
                path: ":memory:"
                fixed_retries: 1
                threads: 16
                timeout_seconds: 300
            target: dev

```

### Disable parsing

The dbt tasks have the option to turn off parsing dbt DAG with the `parseRunResults` flag, a boolean property allowing disabling parsing of the dbt manifest. If your dbt project is large, with hundreds or thousands of models and tests, parsing the manifest may be unnecessary. This flag allows you to turn off parsing the manifest and still get the results of the dbt job by inspecting the execution logs.

Here is how you can use this flag:

```yaml
id: dbt
namespace: company.team

tasks:
  - id: dbt
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
    - id: cloneRepository
      type: io.kestra.plugin.git.Clone
      url: https://github.com/kestra-io/dbt-demo
      branch: main

    - id: dbt-build
      type: io.kestra.plugin.dbt.cli.DbtCLI
      parseRunResults: false
      runner: DOCKER
      docker:
        image: ghcr.io/kestra-io/dbt-duckdb:latest
      commands:
        - dbt deps
        - dbt build
```

## Run a dbt project from a GitHub repository

Here is an example using Kestra declarative syntax to run data ingestion pipelines with Airbyte and then run a dbt project from a GitHub repository

```yaml
id: airbyteSyncParallelWithDbt
namespace: company.team

tasks:
  - id: data-ingestion
    type: io.kestra.plugin.core.flow.Parallel
    tasks:
      - id: salesforce
        type: io.kestra.plugin.airbyte.connections.Sync
        connectionId: e3b1ce92-547c-436f-b1e8-23b6936c12ab

      - id: google-analytics
        type: io.kestra.plugin.airbyte.connections.Sync
        connectionId: e3b1ce92-547c-436f-b1e8-23b6936c12cd

      - id: facebook-ads
        type: io.kestra.plugin.airbyte.connections.Sync
        connectionId: e3b1ce92-547c-436f-b1e8-23b6936c12ef

  - id: dbt
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
    - id: cloneRepository
      type: io.kestra.plugin.git.Clone
      url: https://github.com/kestra-io/dbt-demo
      branch: main

    - id: dbt-run
      type: io.kestra.plugin.dbt.cli.Run
      runner: DOCKER
      dbtPath: /usr/local/bin/dbt
      dockerOptions:
        image: ghcr.io/kestra-io/dbt-bigquery:latest
      inputFiles:
        .profile/profiles.yml: |
          jaffle_shop:
            outputs:
              dev:
                type: bigquery
                dataset: your_big_query_dataset_name
                project: your_big_query_project
                fixed_retries: 1
                keyfile: sa.json
                location: EU
                method: service-account
                priority: interactive
                threads: 8
                timeout_seconds: 300
            target: dev
        sa.json: "{{ secret('GCP_CREDS') }}"

pluginDefaults:
  - type: io.kestra.plugin.airbyte.connections.Sync
    values:
      url: <http://host.docker.internal:8000/>
      username: "{{ secret('AIRBYTE_USERNAME') }}"
      password: "{{ secret('AIRBYTE_PASSWORD') }}"

```

Having the business logic managed by dbt and the orchestration logic in Kestra makes things much simpler to automate. Thanks to Kestra, analytics engineers and data analysts can focus on the actual code that extracts business value from the data while data engineers can manage the orchestration layer and other projects.

By using a declarative language syntax, everyone can readily understand data pipelines. This simplifies collaboration, promotes knowledge sharing, and ultimately makes everyone more productive and confident in utilizing data within the company.

## What’s Next

Kestra simplifies the orchestration of dbt workflows, making it easier for users to manage and automate their data transformation processes. As we continue to witness the adoption and utilization of dbt within Kestra, we look forward to further improving our dbt plugin capabilities.

If you want to learn more about the integrations between Kestra and dbt, you can check our [library of dbt blueprints](https://kestra.io/blueprints?page=1&size=24&q=dbt).

Check out the [plugin](https://kestra.io/plugins/plugin-dbt) documentation for more information about the dbt plugin.

Join the Slack [community](https://kestra.io/slack) if you have any questions or need assistance.
Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news.
Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.