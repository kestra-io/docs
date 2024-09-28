---
title: Tasks
icon: /docs/icons/flow.svg
---

Tasks are the steps within a flow.

Tasks are discrete actions within a flow, capable of taking inputs and variables from the flow, and producing outputs for downstream consumption by end users and other tasks.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/vRdlf1OwYWA?si=1qKj45mEsKtOF3bP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Flowable Tasks

Kestra orchestrates your flows using [Flowable Tasks](./00.flowable-tasks.md). These tasks do not perform any heavy computation. Instead, they control the orchestration behavior, allowing you to implement more advanced workflow patterns.

Example Flowable tasks include:
- `io.kestra.plugin.core.flow.Parallel`
- `io.kestra.plugin.core.flow.Switch`
- `io.kestra.plugin.core.flow.ForEachItem`

Read the full list on the [Flowable tasks page](./00.flowable-tasks.md).

## Runnable Tasks

In Kestra, most data processing workloads are executed using [Runnable Tasks](./01.runnable-tasks.md).

In contrast to Flowable Tasks, Runnable Tasks are responsible for performing the actual work. For example, file system operations, API calls, database queries, etc. These tasks can be compute-intensive and are handled by [workers](../../architecture/worker).

Example runnable tasks include:
- `io.kestra.plugin.scripts.python.Commands`
- `io.kestra.plugin.core.http.Request`
- `io.kestra.plugin.notifications.slack.SlackExecution`

## Core task properties

The table below lists the core task properties available to all tasks.

| Field             | Description                                                                                                                                                                                                                                                                                                                                                          |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`              | The flow identifier, must be unique inside a flow.                                                                                                                                                                                                                                                                                                                   |
| `type`            | The Java Fully Qualified Class Name of the task.                                                                                                                                                                                                                                                                                                                     |
| `description`     | The [description](../../04.workflow-components/15.descriptions.md) of the task                                                                                                                                                                                                                                                                                       |
| `retry`           | Task [retry](../../04.workflow-components/12.retries.md) behavior                                                                                                                                                                                                                                                                                                    |
| `timeout`         | Task [timeout](../../04.workflow-components/13.timeout.md) expressed in [ISO 8601 Durations](https://en.wikipedia.org/wiki/ISO_8601#Durations).                                                                                                                                                                                                                      |
| `disabled`        | Set it to `true` to [disable](../../04.workflow-components/16.disabled.md) execution of the task.                                                                                                                                                                                                                                                                    |
| `workerGroup.key` | To execute this task on a specific [Worker Group](../../06.enterprise/worker-group.md) (EE).                                                                                                                                                                                                                                                                         |
| `allowFailure`    | Boolean flag allowing to [continue the execution](../../04.workflow-components/11.errors.md) even if this task fails.                                                                                                                                                                                                                                                |
| `logLevel`        | To define the log level granularity for which logs will be inserted into the backend database. By default, all logs are stored. However, if you restrict that to e.g., the `INFO` level, all lower log levels such as `DEBUG` and TRACE won't be persisted.                                                                                                          |
| `logToFile`       | Boolean flag that lets you store logs as a file in internal storage. That file can be previewed and downloaded from the `Logs` and `Gantt` Execution tabs. When set to true, logs aren’t saved in the database, which is useful for tasks that produce a large amount of logs that would otherwise take up too much space. The same property can be set on triggers. |

## Dynamic vs. static task properties

Task properties can be **static** or **dynamic**. Dynamic task properties can be set using expressions. To find out whether a given task property is static or dynamic, check the task documentation available on the [plugin's homepage](/plugins) as well as in the UI when you hover over a task and click on the documentation tab on the right.

![dynamic_properties](/docs/concepts/dynamic_properties.png)

Often some task properties are marked as **not dynamic** because they are complex types (e.g. maps, list of strings, list of maps), meaning that they are **placeholders** for other dynamic properties. Let's take the [runTasks](/plugins/tasks/job/io.kestra.plugin.databricks.job.SubmitRun#runtasks) property of Databrick's `SubmitRun` task as an example. This property is not dynamic because it's an array of [RunSubmitTaskSetting](/plugins/tasks/job/io.kestra.plugin.databricks.job.SubmitRun#runsubmittasksetting).

On top of that, `RunSubmitTaskSetting` is a group of other properties which are also either dynamic or of complex type (placeholder for other properties). It's therefore useful to always drill down to the lowest level — most properties at the lowest level are dynamic and can be templated using expressions.

::ChildCard
::