---
title: "Kestra Cloud Compute: When Tasks Use the Cloud Runner"
h1: Kestra Cloud Compute
sidebarTitle: Cloud compute
icon: /src/contents/docs/icons/admin.svg
editions: ["Cloud"]
description: Understand which task types use Kestra Cloud compute, what is measured per attempt, and how to run tasks on your own infrastructure instead.
---

This page explains which tasks in a flow use the Kestra Cloud task runner, and what is measured when they do. Task runs are counted separately from runner time: every task counts whether or not it uses the runner. See [Task runs](../03.task-runs/index.md) for how task runs are counted.

On Kestra Cloud, time on the Cloud task runner is what you are billed for. If a task runs on your own Kubernetes cluster or batch service, none of its time is billed by Kestra: you pay your cloud provider instead.

## When a task uses the Cloud runner

A task uses the Cloud task runner when its task type has a `taskRunner` property and your flow leaves that property unset. Kestra runs the process for you: a Python script, a shell command, a dbt CLI run, a Terraform plan. Tasks that call someone else's API on your behalf (a BigQuery query, a dbt Cloud job trigger, an HTTP request, a Slack message) do not: that work happens on the vendor's infrastructure.

Three checks, in order:

1. **Is it a flow-control task?** `Parallel`, `Sequential`, `Loop`, `LoopUntil`, `Subflow`, `WorkingDirectory`, `If`, `Switch`, `Dag`, `AllowFailure`, and `Pause` organize other tasks and never use the Cloud runner. Triggers never use it either.
2. **Does the task type have a `taskRunner` property?** Check the list below, or look for `taskRunner` in the task's properties in the Kestra editor. No `taskRunner` property means the task never uses the Cloud runner.
3. **Does your flow set `taskRunner` to your own infrastructure?** Then the task runs there instead. If you leave it unset, the Cloud task runner is used.

:::alert{type="info"}
If most of your flows should run on your own infrastructure, set `taskRunner` once with a [governance policy](../../02.governance/policies/index.md) at tenant or namespace scope. Those scopes are applied before the Kestra Cloud default, so your policy wins and your flows need no `taskRunner` of their own.
:::

Task types with `.cli.` in the name usually qualify; task types named after an API action (`Query`, `TriggerRun`, `Upload`) usually do not. `docker.cli.Compose` qualifies; the other `docker.cli.*` tasks do not. When in doubt, use the list below.

## Task types that use the Cloud task runner

The list below is generated from the plugin schemas in the Kestra plugin registry and is updated periodically. Task type names are shown without the `io.kestra.plugin.` prefix.

### Mixed plugins

Ten plugins are mixed: judge by task type, not by plugin name. `dbt.cli.DbtCLI` runs dbt for you and uses the Cloud runner; `dbt.cloud.TriggerRun` calls the dbt Cloud API and does not.

| Plugin | Uses the Cloud task runner | Does not |
|---|---|---|
| AWS | `aws.cli.AwsCLI` | 60 others, including `aws.athena.Query` and `aws.cloudformation.Create` |
| Azure | `azure.cli.AzCLI` | 70 others, including `azure.batch.job.Create` and `azure.horizondb.Query` |
| ClickHouse | `jdbc.clickhouse.ChDB`, `jdbc.clickhouse.ClickHouseLocalCLI` | `jdbc.clickhouse.BulkInsert`, `jdbc.clickhouse.Queries`, `jdbc.clickhouse.Query` |
| Databricks | `databricks.cli.DatabricksCLI`, `databricks.cli.DatabricksSQLCLI` | 7 others, including `databricks.dbfs.Download` and `databricks.dbfs.Upload` |
| dbt | `dbt.cli.DbtCLI` | `dbt.cloud.CheckStatus`, `dbt.cloud.TriggerRun` |
| Docker | `docker.cli.Compose` | 12 others, including `docker.cli.Push` and `docker.cli.Run` |
| Google Cloud | `gcp.cli.GCloudCLI` | 73 others, including `gcp.bigquery.Query` and `gcp.compute.Create` |
| Huawei Cloud | `huawei.koocli.KooCLI` | 36 others, including `huawei.ces.Push` and `huawei.ces.Query` |
| Redis | `redis.cli.RedisCLI` | 15 others, including `redis.json.Get` and `redis.pubsub.Publish` |
| Snowflake | `jdbc.snowflake.SnowflakeCLI` | `jdbc.snowflake.Download`, `jdbc.snowflake.Queries`, `jdbc.snowflake.Query`, `jdbc.snowflake.Upload` |

### Plugins where all task types qualify

| Plugin | Task types |
|---|---|
| .NET (C#) | `scripts.dotnet.Commands`, `scripts.dotnet.Script` |
| Ansible | `ansible.cli.AnsibleCLI` |
| Apache Beam | `beam.RunPipeline` |
| Apache Spark | `spark.JarSubmit`, `spark.PythonSubmit`, `spark.RSubmit`, `spark.SparkCLI` |
| Argo CD | `argocd.apps.Create`, `argocd.apps.Delete`, `argocd.apps.Patch`, `argocd.apps.Status`, `argocd.apps.Sync` |
| Bun | `scripts.bun.Commands`, `scripts.bun.Script` |
| CloudQuery | `cloudquery.CloudQueryCLI`, `cloudquery.Sync` |
| Dagger | `dagger.Commands`, `dagger.Script` |
| Dataform | `dataform.cli.DataformCLI` |
| DataHub | `datahub.Ingestion` |
| Deno | `scripts.deno.Commands`, `scripts.deno.Script` |
| dlt | `dlt.CLI`, `dlt.Run` |
| Go | `scripts.go.Commands`, `scripts.go.Script` |
| Helm | `helm.Rollback`, `helm.Status`, `helm.Template`, `helm.Uninstall`, `helm.Upgrade` |
| JBang | `scripts.jbang.Commands`, `scripts.jbang.Script` |
| Julia | `scripts.julia.Commands`, `scripts.julia.Script` |
| Liquibase | `liquibase.CLI`, `liquibase.Diff` |
| Lua | `scripts.lua.Commands`, `scripts.lua.Script` |
| Malloy | `malloy.CLI` |
| Modal | `modal.cli.ModalCLI` |
| Node.js | `scripts.node.Commands`, `scripts.node.Script` |
| Ollama | `ollama.cli.OllamaCLI` |
| OpenTofu | `opentofu.cli.OpenTofuCLI` |
| Perl | `scripts.perl.Commands`, `scripts.perl.Script` |
| PHP | `scripts.php.Commands`, `scripts.php.Script` |
| PowerShell | `scripts.powershell.Commands`, `scripts.powershell.Script` |
| Python | `scripts.python.Commands`, `scripts.python.Script` |
| R | `scripts.r.Commands`, `scripts.r.Script` |
| Ruby | `scripts.ruby.Commands`, `scripts.ruby.Script` |
| Scrapy | `scrapy.CLI` |
| Shell | `scripts.shell.Commands`, `scripts.shell.Script` |
| Skopeo | `skopeo.cli.SkopeoCLI` |
| Soda | `soda.VerifyContract` |
| SQLMesh | `sqlmesh.cli.SQLMeshCLI` |
| Terraform | `terraform.cli.TerraformCLI` |
| Terragrunt | `terragrunt.cli.TerragruntCLI` |
| Trivy | `trivy.cli.TrivyCLI` |

Every other task type in the registry (about 1,600 total, including all `core.*`, `jdbc.*.Query`, `gcp.bigquery.*`, notification, HTTP, storage, and file tasks) has no `taskRunner` property and never uses the Cloud runner.

Eleven deprecated task types also have a `taskRunner` property (the older per-command dbt tasks such as `dbt.cli.Run`, `dbt.cli.Build`, and `dbt.cli.Test`, plus `soda.Scan`) and are measured the same way as their replacements.

A few plugins are blocked on Kestra Cloud for security reasons and do not appear above. The most notable is Groovy: `scripts.groovy.Script` and `scripts.groovy.Commands` accept a `taskRunner` but cannot run on Kestra Cloud.

## What is measured

### Fan-out

A `Loop` over N items with a qualifying task inside starts N separate runners, one per iteration. Looping over 500 items with a `scripts.python.Script` inside means 500 runner starts, not one. Nested loops multiply again. This is the most common reason usage ends up higher than a per-task estimate. Where the work allows, pass the list into a single script and loop there.

### Size

Each task runs at one of four sizes: `S`, `M`, `L`, or `XL`. The default is `S`. Set it per task with `taskRunner.size`:

```yaml
- id: transform
  type: io.kestra.plugin.scripts.python.Script
  taskRunner:
    type: io.kestra.plugin.cloud.runner.Cloud
    size: M
  script: |
    ...
```

`size` is a fixed value, not a Pebble expression.

### Time

Measured per attempt, from the moment Kestra starts preparing the runner to the moment the attempt's result is recorded, rounded up to the next whole second. This window is wider than your code's runtime: it includes scheduling the runner, pulling the container image, transferring input and output files, and a short wait after your process exits so the last log lines are collected.

Two ways to reduce that overhead:

- Use a prebuilt container image with your dependencies already installed, so nothing is downloaded or compiled at task start.
- Prefer fewer, larger tasks. A single script that does five short steps records one start-up; five tasks doing one step each record five. This applies inside a `WorkingDirectory` too: each child task starts its own runner.

### Retries

Each attempt is measured separately. A task that fails, retries, and succeeds records two attempts.

### Killed or timed-out tasks

Measured for the time they ran, up to the kill or the timeout.

### Tasks that fail before they start

If a task fails before its runner starts (for example, a template that does not render, or an invalid property), no runner time is recorded.

### Waiting counts as running

A script that sleeps or polls an external system holds a runner the whole time. If you need to wait for something external, prefer a task type that calls the vendor's API and waits on the worker (`dbt.cloud.CheckStatus`, `databricks.job.SubmitRun`), or a `Pause` task. Neither uses the Cloud runner.

## Bringing your own runner

Set `taskRunner` explicitly to run a task on your own infrastructure. Your setting wins over the Cloud default and the task does not use the Cloud runner:

```yaml
- id: heavy_job
  type: io.kestra.plugin.scripts.python.Script
  taskRunner:
    type: io.kestra.plugin.ee.kubernetes.runner.Kubernetes
    namespace: jobs
    config:
      masterUrl: https://your-cluster.example.com
  script: |
    ...
```

The Kubernetes runner, AWS Batch, Azure Batch, Google Batch, EC2, Azure VM, and Compute Engine runners all target infrastructure you control. See [all available task runners](../../../task-runners/index.mdx) for the full list. Runner time on your own infrastructure is billed by that provider, not through Kestra Cloud.

Two runners common in self-hosted flows do not work on Kestra Cloud: the Process runner (which would run your code on the Kestra worker itself) and the Docker runner (which needs a Docker daemon that Cloud instances do not have). If you are bringing flows from a self-hosted install, change any explicit `taskRunner` of either type before they run.

## FAQ

**My flow runs a BigQuery query, then a Python transform, then posts to Slack. What uses the Cloud runner?**

Only the Python task. `gcp.bigquery.Query` and the Slack notification task have no `taskRunner` property.

**Does time spent queued, paused, or waiting for a concurrency slot count?**

No. Measurement starts when Kestra begins preparing the runner for the attempt, which is after any queueing or pause.

**How can I see which tasks used the Cloud runner?**

Open the execution, select the task, and check its Outputs. A task that ran on the Cloud runner shows a `taskRunner` output with `type: io.kestra.plugin.cloud.runner.Cloud` and the `size` it ran at. A task killed before it finished may not have written its outputs; check the task definition in that case.

**Can a plugin update change whether a task type qualifies?**

Yes, if the plugin adds or removes the `taskRunner` property on a task type. The list above is regenerated from the plugin schemas periodically.
