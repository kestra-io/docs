---
title: "Kestra 0.11 adds new Topology view, Admin UI, Outputs Preview, new CLI Tasks and Dynamic Webhooks ✨"
description: "We're excited to announce Kestra 0.11.0 which includes a redesigned topology view and many highly anticipated features. We've introduced outputs preview, caching, dynamic webhooks, and a new Administration UI to observe and troubleshoot event-driven workflows."
date: 2023-08-30T14:00:00
category: News & Products Updates
author:
  name: Anna Geller
  image: "ageller"
image: /blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more.png
---


We're excited to announce Kestra 0.11.0, which includes a **redesigned topology view**. We've introduced **outputs preview**, **caching**, **dynamic webhooks**, and a new **Administration UI** to help you troubleshoot event-driven workflows.

Along with this release, we've published the **[official Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=kestra-io.kestra)** offering autocompletion and syntax validation for local development. You can now create and deploy complex workflows directly from your local VS Code IDE without ever having to open the UI.

This release also makes Kestra easier to use for Command Line enthusiasts. We've added new integrations to automate tasks on [AWS](/plugins/plugin-aws#cli), [Google Cloud](/plugins/plugin-gcp#cli), [Azure](/plugins/plugin-azure#cli), [dbt](/plugins/plugin-dbt/cli/io.kestra.plugin.dbt.cli.dbtcli), and [Spark](/plugins/plugin-spark/io.kestra.plugin.spark.sparkcli) using dedicated **CLI tasks**.

The [Databricks](/plugins/plugin-databricks) and [AWS Athena](/plugins/plugin-aws#athena) integrations help orchestrate and manage **data lake(house)s**, and the script plugin now also supports **[Julia](/plugins/plugin-script-julia)**.

This release adds a [Hightouch plugin](/plugins/plugin-hightouch), a [Telegram](/plugins/plugin-notifications#telegram) notification task, Singer Taps for [Oracle](/plugins/plugin-singer/targets/io.kestra.plugin.singer.targets.oracle) and [Microsoft SQL Server](/plugins/plugin-singer/targets/io.kestra.plugin.singer.targets.sqlserver), and [GCP tasks](/plugins/plugin-gcp/#vertex-ai) to declaratively interact with Google's PaLM 2 Large Language Models.

Lastly, we've introduced several performance, documentation, and usability enhancements.

Let's dive into the highlights of this release.

---

## New topology view

The flagship feature of this release is the fully redesigned Topology view. Your data pipelines and process flows are now more visually appealing and, at the same time, more powerful than ever before. You can expand and collapse any group of tasks, including parallel and sequential task groups, working directories, lists of triggers, conditional branches, and more, helping you navigate complex workflows by drilling down to details and zooming out to see a bigger picture.

Here is what the new topology view looks like:

![topology1](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/topology1.png)

And here is the same flow when you expand the `Parallel` task group:

![topology2](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/topology2.png)


---

## Outputs Preview

When you navigate complex workflows that produce specific outputs, it's useful to see the result of each process. The new Outputs Preview feature allows you to view API payloads, tables, plots, and much more.

**How does it work?** Once your flow finishes running, navigate to the Outputs tab on the Execution page. Then, click on the "Preview" icon of any Kestra output to see the result of any task that produces a file. This feature is available across a wide variety of file formats, including ION, CSV, JSON, PNG, and JPG, as well as text and markdown files.

Here is an example of a Query task returning output results, serialized in Amazon ION format, which Kestra renders as a table:

![preview1](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/preview1.png)

![preview2](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/preview2.png)


And here is a preview of a CSV file `products.csv`, returned by a Python task:

![preview3](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/preview3.png)

![preview4](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/preview4.png)


Finally, here is a simple flow example rendering a markdown file:

```yaml
id: release_post
namespace: company.team

tasks:
  - id: render_markdown
    type: io.kestra.core.tasks.storages.LocalFiles
    inputs:
      myfile.md: |
        ### Welcome to Kestra 0.11.0 ✨

        Kestra `0.11.0` includes:
        - a **redesigned topology view**
        - and this *beautiful* **outputs preview** you see now.
    outputs:
      - "*.md"
```

![preview5](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/preview5.png)


---

## Even easier environment separation

While Kestra allows you to use namespaces to separate environments, most of our users deploy dedicated instances for development, staging, and production. This release introduces a UI setting to easily distinguish between environments.

[Inspired](https://github.com/kestra-io/kestra/issues/1483) by [Gunnar Morling's](https://twitter.com/gunnarmorling) excellent blog post ["Oh... This is Prod?!"](https://www.morling.dev/blog/oh_this_is_prod/), you can now optionally set a custom environment name and color in the top bar in the UI. Simply go to Settings and from there, set the desired environment name and color.

![envs_color](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/envs_color.png)

Big thanks to the community member, [yuri](https://github.com/yuri1969), for [contributing this feature](https://github.com/kestra-io/kestra/pull/1875)!

Additionally, the Settings page now allows you to customize the [type](https://github.com/kestra-io/kestra/issues/1654) and [size](https://github.com/kestra-io/kestra/issues/1218) of the font for the code editor.

---

## Visual Studio Code extension

We believe that the code editor, embedded within the Kestra UI, is the easiest way to create complex workflows. It provides autocompletion, syntax validation, a live-updating topology view, built-in documentation and example workflows provided as blueprints.

However, we know that many of you would love to use a local IDE to write flows along with your custom applications that you want to orchestrate incl. microservices, Python, R, Julia, or Node.js scripts as well as SQL queries. We're working on further enhancing that local development experience. Today, we're thrilled to announce the first step on that journey — our official [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=kestra-io.kestra).

The [VS Code extension](https://github.com/kestra-io/vscode-kestra) provides **autocompletion** and **syntax validation** so that you can easily write Kestra workflow code without opening the UI.

### How to use the new VS Code extension

First, install the extension by searching for "Kestra" in the VS Code extensions marketplace or using the following [marketplace link](https://marketplace.visualstudio.com/items?itemName=kestra-io.kestra).

![vscode1](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/vscode_1.png)

After installing the extension, press `Command/Ctrl + Shift + P` in VS Code to navigate to the Command Palette. Start typing the command called **"Download Kestra schema"** and paste the endpoint of your Kestra's instance.

![vscode2](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/vscode_2.png)

If you use the open-source version running locally, type: ``http://localhost:8080/`` and hit Enter.

![vscode3](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/vscode_3.png)

If your instance is secured with some authentication mechanism (e.g. basic auth), you'll be prompted to enter credentials.

You should then see a notification that the schema has been downloaded, requesting you to save your work and reload the VS Code window.

![vscode4](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/vscode_4.png)

After reloading the window, you can open a Kestra flow file (or create a new YAML file) and use the `Control + Space` command to get **autocompletion**.

![vscode5](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/vscode_5.png)


Note how flows that don't pass the **syntax validation** are marked red. As soon as we fix the syntax error, the red underlines disappear.

![vscode6](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/vscode_6.png)


The VS Code extension can make CI/CD and infrastructure build pipelines easier:
1. Write Kestra flows along with custom application code in a local IDE
2. Commit and push that code to a Git repository
3. Let CI/CD take care of deploying it to your Kestra instance after your Pull Request is merged.


### What's next?

The VS Code extension is just the first step to better support the local development of workflow code along with your business and application logic. In the upcoming releases, we'll further simplify syncing local files to Kestra, even without Git and CI/CD.

---

## Dynamically rendered webhook keys

From this release on, you can set a secret or environment variable name and that value will be dynamically rendered. The expression `{{ secret('KESTRA_WEBHOOK_KEY') }}` will fetch the value of the secret `KESTRA_WEBHOOK_KEY` so that you don't have to use hardcoded webhook keys. You can now easily rotate such sensitive values without having to change anything in your flow code.

```yaml
id: webhook
namespace: company.team

tasks:
  - id: message
    type: io.kestra.core.tasks.log.Log
    message: Hi from a flow triggered by a webhook!

triggers:
  - id: captain-hook
    type: io.kestra.core.models.triggers.types.Webhook
    key: "{{ secret('KESTRA_WEBHOOK_KEY') }}"
```

Because of that dynamicism, we no longer auto-generate webhook keys. You must provide a key when creating a webhook trigger to ensure that the webhook definition remains fully declarative. With that change, the webhook trigger is now defined and managed entirely from the YAML flow configuration, true to the philosophy of Infrastructure as Code.

::alert{type="warning"}
If you have **existing webhook triggers**, make sure to explicitly set a webhook key before upgrading to Kestra 0.11.0. We recommend using a secret or an environment variable.
::

The webhook URL stays the same as before by following the format `https://your_kestra_hostname/api/v1/executions/webhook/{namespace}/{flowId}/{key}`. The only difference is that from this release on, the webhook key can be dynamically rendered from secrets or environment variables.

---

## Caching

If you've used GitHub Actions before, the new  [Caching feature](https://github.com/kestra-io/kestra/issues/1275) in Kestra will look familiar. It allows you to cache a subset of files to speed up your workflow execution. This is especially useful when you work with sizeable package dependencies that don't change often.

For instance, you may want to install some Python or Node.js packages before running your script. You can now cache the `node_modules` or Python `venv` folder to avoid re-installing the dependencies on each run.

To do that, add a `cache` to your `WorkingDirectory` task. The `cache` property accepts a list of glob `patterns` to match files to cache. The cache will be automatically invalidated after a specified time-to-live using the `ttl` property accepting a duration.

**How does it work under the hood?** Kestra packages the files that need to be cached and stores them in the internal storage. When the task is executed again, the cached files are retrieved, initializing the working directory with their contents.

```yaml
id: node_cached_dependencies
namespace: company.team

tasks:
  - id: working_dir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    cache:
      patterns:
        - node_modules/**
      ttl: PT1H
    tasks:
    - id: node_script
      type: io.kestra.plugin.scripts.node.Script
      beforeCommands:
        - npm install colors
      script: |
        const colors = require("colors");
        console.log(colors.red("Hello"));
```

**What about cache invalidation?** Here's how that works:
- After the first run, the files are cached
- The next time the task is executed:
  - if the `ttl` didn't pass, the files are retrieved from cache
  - If the `ttl` passed, the cache is invalidated and no files will be retrieved from cache; because cache is no longer present, the `npm install` command from the `beforeCommands` property will take a bit longer to execute
- If you edit the task and change the `ttl` to:
  - a longer duration e.g. `PT5H` — the files will be cached for five hours using the new `ttl` duration
  - a shorter duration e.g. `PT5M` — the cache will be invalidated after five minutes using the new `ttl` duration.

The `ttl` is evaluated at runtime. If the most recently set `ttl` duration has passed as compared to the last task run execution date, the cache is invalidated and the files are no longer retrieved from cache.

---

## New Administration UI

As Werner Vogels, Amazon's CTO, once said: "Everything fails all the time". External systems can experience outages and some processes might be stuck. That's why this release introduces a new **Administration** section, including a **Triggers** page that can help you troubleshoot event-driven workflows when needed.

The triggers page gives an overview of all triggers, grouped by a namespace. You can see the last time a given trigger was modified and whether there are some executions currently in progress that have been executed as a result of that trigger. For instance, the image below shows that the trigger named `everyMinute` is currently locked due to an Execution in progress.

![admin_triggers](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/admin_triggers.png)

You can either troubleshoot why this execution is still in progress (e.g., a process stuck due to infrastructure issues) or manually unlock this trigger. Note that manually unlocking triggers may result in multiple concurrent (potentially duplicated) executions.

![admin_triggers_2](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/admin_triggers_2.png)


In the Enterprise Editon, the Administration section also includes user management (Users, Groups, Roles) as well as the recently introduced Workers to help you monitor the health of the remote infrastructure.

![admin_workers](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/admin_workers.png)

---

## New CLI Tasks

We've added several Command Line Interface tasks to help you automate any process or service API calls on [AWS](/plugins/plugin-aws#cli), [Google Cloud](/plugins/plugin-gcp#cli) and [Microsoft Azure](/plugins/plugin-azure#cli).

We've also introduced additional CLI tasks to the following existing plugins:
- **dbt plugin** now includes a generic `DbtCLI` task to run any dbt command
- **Spark plugin** now has a `SparkCLI` task to submit custom jobs to a Spark cluster.


### Google Cloud CLI

Using the `gcloud` [CLI task](/plugins/plugin-gcp#cli), you can automate virtually any action that you can perform on Google Cloud Platform. Below is an example from the [blueprints catalog](https://demo.kestra.io/ui/blueprints/community/96) showing various ways of capturing relevant API responses from the CLI output.

```yaml
id: gcloudCLI
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.gcp.cli.GCloudCLI
    serviceAccount: "{{ secret('GCP_CREDS') }}"
    projectId: yourProject
    commands:
      - gcloud storage ls # plain text e.g. gs://bucket/
      - gcloud storage ls --json > {{outputDir}}/storage.json # output to file makes it available for further processing or download.
      - gcloud storage ls --json | tr -d '\n ' | xargs -0 -I {} echo '::{"outputs":{"gcloud":{}}}::' # output to Kestra output variables allows passing those variables to downstream tasks
```

### AWS CLI

AWS CLI is useful for automating tasks on Amazon Web Services. With the [AWS CLI task](/plugins/plugin-aws#cli), you can trigger any API call interacting with your AWS resources as part of your end-to-end workflow. Below is a simple example from the [blueprints catalog](https://demo.kestra.io/ui/blueprints/community/97) listing AWS ECS clusters from the `AwsCLI` task.

```yaml
id: awsCLIlistECSclusters
namespace: company.team

tasks:
  - id: aws
    type: io.kestra.plugin.aws.cli.AwsCLI
    accessKeyId: "{{ secret('AWS_ACCESS_KEY_ID') }}"
    secretKeyId: "{{ secret('AWS_SECRET_ACCESS_KEY') }}"
    region: "us-east-1"
    commands:
      - aws ecs list-clusters --query 'clusterArns[*]'
      - aws ecs list-clusters > {{outputDir}}/output.json
```

### Microsoft Azure CLI

This release also introduces the `az` [CLI task](/plugins/plugin-azure#cli) to automate any Azure task from the Command Line, as shown in the following [blueprints example](https://demo.kestra.io/ui/blueprints/community/98).

```yaml
id: azureCLI
namespace: company.team

tasks:
  - id: listAzureRegions
    type: io.kestra.plugin.azure.cli.AzCLI
    tenant: "{{ secret('AZURE_TENANT_ID') }}"
    username: "{{ secret('AZURE_SERVICE_PRINCIPAL_CLIENT_ID') }}"
    password: "{{ secret('AZURE_SERVICE_PRINCIPAL_PASSWORD') }}"
    servicePrincipal: true
    commands:
      - az account list-locations --query "[].{Region:name}" -o table
```


### New dbt and Spark CLI tasks

You can use the new Spark CLI to orchestrate Spark jobs. The [blueprint](https://demo.kestra.io/ui/blueprints/community/124) shown below submits PySpark code from [Git](https://github.com/kestra-io/scripts/blob/main/etl/spark_pi.py) to a Spark cluster.

```yaml
id: gitSpark
namespace: company.team

tasks:
- id: working_directory
  type: io.kestra.core.tasks.flows.WorkingDirectory
  tasks:
    - id: git
      type: io.kestra.plugin.git.Clone
      url: https://github.com/kestra-io/scripts
      branch: main

    - id: spark_job
      type: io.kestra.plugin.spark.SparkCLI
      commands:
        - spark-submit --name Pi --master spark://localhost:7077 etl/spark_pi.py
```

Similarly to `SparkCLI`, the new [DbtCLI task](/plugins/plugin-dbt/cli/io.kestra.plugin.dbt.cli.dbtcli) can be used to orchestrate any dbt command. Below is a [Blueprint example](https://demo.kestra.io/ui/blueprints/community/125) running `dbt deps` and `dbt build` commands.

```yaml
id: dbtGitDockerDuckDB
namespace: company.team

tasks:
  - id: dbt
    type: io.kestra.core.tasks.flows.WorkingDirectory
    tasks:
      - id: cloneRepository
        type: io.kestra.plugin.git.Clone
        url: https://github.com/kestra-io/dbt-demo
        branch: main

      - id: dbt-build
        type: io.kestra.plugin.dbt.cli.DbtCLI
        runner: DOCKER
        docker:
          image: ghcr.io/kestra-io/dbt-duckdb:latest
        profiles: |
          jaffle_shop:
            outputs:
              dev:
                type: duckdb
                path: ":memory:"
                extensions:
                  - parquet
                fixed_retries: 1
                threads: 16
                timeout_seconds: 300
            target: dev
        commands:
          - dbt deps
          - dbt build
```


---

## Data lake orchestration

This release introduces new integrations to automate data lake processes including data ingestion and transformation.

### Amazon Athena

Amazon Athena is a serverless query engine allowing to analyze data in Amazon S3 using standard SQL. You can now use [the new AWS task](/plugins/plugin-aws#athena) to run any SQL query on Athena. For detailed integration examples, check our [Apache Iceberg Crash Course for AWS users](https://kestra.io/blogs/2023-08-05-iceberg-for-aws-users).

### Databricks plugin

Databricks is a unified data analytics platform that provides a collaborative workspace for data scientists, engineers, and machine learning practitioners. The `Databricks` [plugin](/plugins/plugin-databricks) allows managing Databricks jobs, clusters, files and queries as part of your end-to-end automated data pipelines in Kestra. Here are example use cases available in the blueprints catalog:


- [Run a SQL query on Databricks, output the result to a CSV file and read that CSV file in a Python script with Pandas](https://demo.kestra.io/ui/blueprints/community/92) - this flow demonstrates how you can fetch data from Databricks using SQL and use that data in any downstream process e.g. in a custom Python script
- [Run a task on an on-demand Databricks cluster](https://demo.kestra.io/ui/blueprints/community/95) - this flow will create a Databricks cluster, create a job, wait for its completion and in the end, it will delete the on-demand cluster even if the job doesn't complete successfully (to avoid paying for idle compute)
- [Create a Spark job on a Databricks cluster and wait for its completion](https://demo.kestra.io/ui/blueprints/community/94) - this flow will start a job on an existing Databricks cluster and wait for its completion up to 5 hours; it uses the `CreateJob` API
- [Execute a Spark/Python script on an existing Databricks cluster and wait for its completion](https://demo.kestra.io/ui/blueprints/community/93) - this blueprint is similar to the previous one; however, it uses the `SubmitRun` API
- [Download a Parquet file from Databricks and use it in a Python script](https://demo.kestra.io/ui/blueprints/community/91) - this flow demonstrates how you can download a Parquet file from Databricks and use it in a Python script
- [Upload a Parquet file to Databricks](https://demo.kestra.io/ui/blueprints/community/90) - similar to the previous example, but in reverse order.


---

## AI and ML

We've added two new tasks to integrate Kestra with [Vertex AI APIs](/plugins/plugin-gcp/#vertex-ai) using Google's PaLM 2 Large Language Models.
1. The [PaLM TextCompletion API](/plugins/plugin-gcp/vertexai/io.kestra.plugin.gcp.vertexai.chatcompletion) uses Google Bard for generative AI use cases. It takes a prompt and returns a response.
2. The [PaLM ChatCompletion API](/plugins/plugin-gcp/vertexai/io.kestra.plugin.gcp.vertexai.chatcompletion) follows the same approach but is more flexible as it allows providing additional context and a list of messages.

To see both of these tasks in action, check [the blog post by Loïc Mathieu](https://kestra.io/blogs/2023-08-24-using-google-bard-ai-with-kestra).

---

## Other plugins and enhancements

### Hightouch plugin to support reverse ETL

Our community member, [Antoine Balliet](https://github.com/aballiet), contributed a [Hightouch plugin](/plugins/plugin-hightouch/io.kestra.plugin.hightouch.sync) that allows triggering Hightouch syncs as part of end-to-end processes. The task is fully declarative — add a Hightouch API token and a sync ID, and start syncing data from a data warehouse to your SaaS tools.

```yaml
id: bigquery_to_gsheets
namespace: company.team
tasks:
  - id: reverseETL
    type: io.kestra.plugin.hightouch.Sync
    token: "{{ secret('HIGHTOUCH_API_TOKEN') }}"
    syncId: 1716609
```

### New Singer Taps: Oracle and Microsoft SQL Server

We've extended the existing Singer plugin to support the following new taps:
- [Microsoft SQL Server](/plugins/plugin-singer/targets/io.kestra.plugin.singer.targets.sqlserver)
- [Oracle](/plugins/plugin-singer/targets/io.kestra.plugin.singer.targets.oracle).


### MotherDuck integration

The DuckDB plugin [now supports MotherDuck](https://github.com/kestra-io/plugin-jdbc/pull/144). All DuckDB blueprints now also work with [MotherDuck](https://motherduck.com/) as long as you provide the MotherDuck service token and database name in your JDBC URL.

We recommend storing the MotherDuck service token as a Kestra [Secret](https://kestra.io/docs/developer-guide/secrets). Below is an example pointing the Query task to the MotherDuck database named `my_db` and referencing the token stored as `MOTHERDUCK_TOKEN` secret:

```yaml
  - id: query
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      SELECT *
      FROM read_csv_auto('your_file.csv')
      WHERE price * quantity != total;
    store: true
    url: "jdbc:duckdb:md:my_db?motherduck_token={{ secret('MOTHERDUCK_TOKEN') }}"
```

You can read more about various use cases for using MotherDuck with Kestra in our guest blog post on the MotherDuck blog [Beyond storing data: how to use DuckDB, MotherDuck and Kestra for ETL](https://motherduck.com/blog/motherduck-kestra-etl-pipelines/).


### Julia support and new script documentation

So far, Kestra has supported custom scripts written in Python, R, Node.js, Shell and Powershell. With this release, we've also added [support for Julia](/plugins/plugin-script-julia).

We've also improved the [documentation for new script plugins](https://kestra.io/docs/developer-guide/scripts).


### Telegram notifications

There is a [new plugin](/plugins/plugin-notifications#telegram) allowing you to send notifications using [Telegram](https://telegram.org/).

Below is a simple example:

```yaml
id: telegram
namespace: company.team
tasks:
  - id: telegram_notification
    type: io.kestra.plugin.notifications.telegram.TelegramSend
    channel: "@general"
    token: "{{ secret('TELEGRAM_BOT_TOKEN') }}"
    payload: "Hello from Kestra!"
```

---

## Deprecations

### Templates

::alert{type="warning"}
Templates are now marked as **deprecated**. Please use **subflows** instead. The [migration documentation](https://kestra.io/docs/migration-guide/templates) explains why templates are being phased out and how to transition from templates to subflows.
::

If you are using templates and you are not ready to migrate to subflows yet, add the following Kestra configuration option to still be able to use them:

```yaml
kestra:
  templates:
    enabled: true
```

### Core script tasks

Before Kestra 0.10.0, script tasks were offered exclusively by the `core` plugin (the one which is always included in any Kestra distribution). In 0.10.0, we introduced new [script tasks](https://kestra.io/docs/developer-guide/scripts) maintained using [dedicated script plugins](https://github.com/kestra-io/plugin-scripts) which offer script tasks for Python, R, Node.js, Shell and Powershell (and now, also Julia). Since then, the old core scripting tasks have been deprecated and moved out of the core plugin.

::alert{type="warning"}
If you use one of these `core` script tasks e.g. `io.kestra.core.tasks.scripts.python`, you should **migrate to the new script task** that runs by default in a Docker container and is more feature-rich. Using the same Python task as an example, you should now use the  `io.kestra.plugin.scripts.python.Script` task instead.
::

Our `*-full` Docker images include both the new and the deprecated `core` script tasks. If you're not using our `*-full` Docker images in which plugins are preinstalled, make sure to **install the new script plugins**  as the deprecated tasks are now packaged alongside the new script plugins.

---

## Bulk Actions

Several tables in Kestra allow you to perform bulk operations, such as exporting, (re)enabling, disabling, or deleting multiple flows at once, as well as deleting, killing, or restarting multiple executions. The results in the table are paged. Sometimes you would need to scroll down to the very bottom to select all elements. We've relocated that configuration to the top of the table to make bulk actions more accessible.

In the example below, you can select all elements in just one click and easily perform any bulk operation.

![bulk_actions](/blogs/2023-08-30-release-0-11-topology-preview-vscode-and-more/bulk_actions.png)


---

## Performance and Documentation

We have further **improved performance** across multiple areas, including:
- Logs visualization and search
- [PostgreSQL runner](https://github.com/kestra-io/kestra/pull/1883)
- Flows and executions search by labels — to take advantage of that performance enhancement on existing flows, use the following kestra CLI command to re-index flows in the database: `kestra sys reindex --type flow`.


The **documentation enhancements** include, among others:
- [New welcome page](https://kestra.io/docs) explaining the product principles
- [New troubleshooting section](https://kestra.io/docs/troubleshooting) explaining a.o. how to troubleshoot networking issues when running Kestra locally with Docker-Compose
- [New migrations section](https://kestra.io/docs/migration-guide) explaining how to migrate from older versions of Kestra and how to transition from deprecated features e.g. from templates to subflows
- [New FAQ page](https://kestra.io/faq)
- [Improved inputs docs](https://kestra.io/docs/developer-guide/inputs) providing examples on how to use custom input validators.

---

## Next steps

This post covered new features and enhancements added in Kestra 0.11.0. Which of them are your favorites? What should we add next? Your input and feedback is always appreciated.

If you have any questions, reach out via [Kestra Community Slack](https://kestra.io/slack) or open [a GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us [a GitHub star](https://github.com/kestra-io/kestra) and join [the open-source community](https://kestra.io/slack).

