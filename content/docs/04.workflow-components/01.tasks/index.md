---
title: Tasks
icon: /docs/icons/flow.svg
---

Tasks are the steps within a flow.

Tasks are discrete actions within a flow, capable of taking inputs and variables from the flow, and producing outputs for downstream consumption by end users and other tasks.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/vRdlf1OwYWA?si=1qKj45mEsKtOF3bP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Supported Task Types

There are multiple task types.

### Core

**Core tasks** from the `io.kestra.plugin.core.flow` category are commonly used to control the flow logic. You can use them to declare which processes should run **in parallel** or **sequentially**. You can specify **conditional branching**, **iterating** over a list of items, **pausing** or allowing certain tasks to fail without failing the execution.

### Scripts

**Script tasks** are used to run scripts in Docker containers or local processes. You can use them to run Python, Node.js, R, Julia, or any other script. You can also use them to execute a series of commands in Shell or PowerShell. Check the [Script tasks](../04.workflow-components/01.tasks/02.scripts/index.md) page for more details.

### Internal Storage

Tasks from the `io.kestra.plugin.core.storage` category, along with [Outputs](../06.outputs.md), are used to interact with the **internal storage**. Kestra uses internal storage to **pass data between tasks**. You can think of internal storage as an S3 bucket. In fact, you can use your private S3 bucket as internal storage. This storage layer helps avoid proliferation of connectors. For example, you can use the Postgres plugin to extract data from a Postgres database and load it to the internal storage. Other task(s) can read that data from internal storage and load it to other systems such as Snowflake, BigQuery, or Redshift, or process it using any other plugin, without requiring point to point connections between each of them.

### State Store

Internal storage is mainly used to pass data within a single flow execution. If you need to pass data between different flow executions, you can use the **State Store**. The tasks `Set`, `Get` and `Delete` from the `	io.kestra.plugin.core.state` category allow you to persist files between executions (even across namespaces). For example, if you are using [dbt](https://www.getdbt.com/), you can leverage the State Store to persist the `manifest.json` file between executions and implement the slim CI pattern.

### ⚡️ Plugins

Apart from **core tasks**, the [plugins library](/plugins) provides a wide range of integrations. Kestra has built-in plugins for data ingestion, data transformation, interacting with databases, object stores, or message queues, and the list keeps growing with every new release. On top of that, you can also [create your own plugins](../08.developer-guide/06.plugins.md) to integrate with any system or programming language.

## Flowable vs Runnable Tasks

On top of the task types above, there are two ways that tasks are used inside of Kestra. These are split between [flowable tasks](00.flowable-tasks.md) and [runnable tasks](01.runnable-tasks.md).

### Flowable Tasks

Kestra orchestrates your flows using [Flowable Tasks](00.flowable-tasks.md). These tasks do not perform any heavy computation. Instead, they control the orchestration behavior, allowing you to implement more advanced workflow patterns.

Example Flowable tasks include:
- `io.kestra.plugin.core.flow.Parallel`
- `io.kestra.plugin.core.flow.Switch`
- `io.kestra.plugin.core.flow.ForEachItem`

Read the full list on the [Flowable tasks page](00.flowable-tasks.md).

### Runnable Tasks

In Kestra, most data processing workloads are executed using [Runnable Tasks](01.runnable-tasks.md).

In contrast to Flowable Tasks, Runnable Tasks are responsible for performing the actual work. For example, file system operations, API calls, database queries, etc. These tasks can be compute-intensive and are handled by [workers](../../07.architecture/05.worker.md).

Example runnable tasks include:
- `io.kestra.plugin.scripts.python.Commands`
- `io.kestra.plugin.core.http.Request`
- `io.kestra.plugin.notifications.slack.SlackExecution`

## Core task properties

The table below lists the core task properties available to all tasks.

| Field             | Description                                                                                                                                                                                                                                                 |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`              | The flow identifier, must be unique inside a flow.                                                                                                                                                                                                          |
| `type`            | The Java Fully Qualified Class Name of the task.                                                                                                                                                                                                            |
| `description`     | The [description](../16.descriptions.md) of the task                                                                                                                                                                                 |
| `retry`           | Task [retry](../12.retries.md) behavior                                                                                                                                                                                              |
| `timeout`         | Task [timeout](../13.timeout.md) expressed in [ISO 8601 Durations](https://en.wikipedia.org/wiki/ISO_8601#Durations).                                                                                                                |
| `disabled`        | Set it to `true` to [disable](../17.disabled.md) execution of the task.                                                                                                                                                              |
| `workerGroup.key` | To execute this task on a specific [Worker Group](../../06.enterprise/worker-group.md) (EE).                                                                                                                                                                   |
| `logLevel`        | To define the log level granularity for which logs will be inserted into the backend database. By default, all logs are stored. However, if you restrict that to e.g., the `INFO` level, all lower log levels such as `DEBUG` and TRACE won't be persisted. |
| `allowFailure`    | Boolean flag allowing to [continue the execution](../11.errors.md) even if this task fails.                                                                                                                                          |

## Dynamic vs. static task properties

Task properties can be **static** or **dynamic**. Dynamic task properties can be set using expressions. To find out whether a given task property is static or dynamic, check the task documentation available on the [plugin's homepage](/plugins) as well as in the UI when you hover over a task and click on the documentation tab on the right.

![dynamic_properties](/docs/concepts/dynamic_properties.png)

Often some task properties are marked as **not dynamic** because they are complex types (e.g. maps, list of strings, list of maps), meaning that they are **placeholders** for other dynamic properties. Let's take the [runTasks](/plugins/tasks/job/io.kestra.plugin.databricks.job.SubmitRun#runtasks) property of Databrick's `SubmitRun` task as an example. This property is not dynamic because it's an array of [RunSubmitTaskSetting](/plugins/tasks/job/io.kestra.plugin.databricks.job.SubmitRun#runsubmittasksetting).

On top of that, `RunSubmitTaskSetting` is a group of other properties which are also either dynamic or of complex type (placeholder for other properties). It's therefore useful to always drill down to the lowest level — most properties at the lowest level are dynamic and can be templated using expressions.

