---
title: Tasks
icon: /docs/icons/flow.svg
---

Tasks are the steps within a flow.

They represent discrete actions, capable of processing inputs and variables and producing outputs for downstream consumption by end users and other tasks.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/vRdlf1OwYWA?si=1qKj45mEsKtOF3bP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Flowable tasks

Kestra orchestrates flows using [Flowable tasks](./00.flowable-tasks.md). These tasks do not perform heavy computation. Instead, they control orchestration behavior, enabling advanced workflow patterns.

Example Flowable tasks include:
- `io.kestra.plugin.core.flow.Parallel`
- `io.kestra.plugin.core.flow.Switch`
- `io.kestra.plugin.core.flow.ForEachItem`

Read the full list on the [Flowable tasks page](./00.flowable-tasks.md).

## Runnable tasks

Most data processing in Kestra is performed by [Runnable tasks](./01.runnable-tasks.md).

Unlike Flowable tasks, Runnable tasks perform the actual work — such as file system operations, API calls, or database queries. These tasks can be compute-intensive and are executed by [workers](../../08.architecture/02.server-components.md#worker).

Example runnable tasks include:
- `io.kestra.plugin.scripts.python.Commands`
- `io.kestra.plugin.core.http.Request`
- `io.kestra.plugin.notifications.slack.SlackExecution`

## Core task properties

All tasks share the following core properties:

| Property       | Description                                                                                                                                                                                                                                                                                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`           | A unique identifier of the task                                                                                                                                                                                                                                                                                                                              |
| `type`         | A full Java class name that represents the type of the task                                                                                                                                                                                                                                                                                                       |
| `description`  | Your custom [documentation](../../05.workflow-components/15.descriptions.md) of what the task does                                                                                                                                                                                                                                                    |
| `retry`        | How often should the task be retried in case of a failure, and the [type of retry strategy](../../05.workflow-components/12.retries.md)                                                                                                                                                                                                               |
| `timeout`      | The [maximum time allowed](../../05.workflow-components/13.timeout.md) for the task to complete expressed in [ISO 8601 Durations](https://en.wikipedia.org/wiki/ISO_8601#Durations)                                                                                                                                                                                                                                                         |
| `runIf`        | Skip a task if the provided condition evaluates to false                                                                                                                                                                                                                                                       |
| `disabled`     | A boolean flag indicating whether the task is [disabled or not](../../05.workflow-components/16.disabled.md); if set to `true`, the task will be skipped during the execution                                                                                                                                                                         |
| `workerGroup`  | The [group of workers](../../07.enterprise/04.scalability/worker-group.md) (EE-only) that are eligible to execute the task; you can specify a `workerGroup.key` and a `workerGroup.fallback` (the default is `WAIT`)                                                                                                                                                              |
| `allowFailure` | A boolean flag allowing to continue the execution even if this task fails                                                                                                                                                                                                                                                                                     |
| `allowWarning` | A boolean flag allowing to mark a task run as Success despite Warnings                                                                                                                                                                                                                                                                                     |
| `logLevel`     | Defines the log level persisted to the backend database. By default, all logs are stored. For example, restricting to `INFO` prevents `DEBUG` and `TRACE` logs from being saved.                                                                                                                                                                                                                                                                                                                         |
| `logToFile`    | A boolean that lets you store logs as a file in [internal storage](../../08.architecture/data-components.md#kestra-internal-storage). That file can be previewed and downloaded from the Logs and Gantt Execution tabs. When set to `true`, logs aren't saved in the database, which is useful for tasks that produce a large amount of logs that would otherwise take up too much space. The same property can be set on [triggers](../../05.workflow-components/07.triggers/index.md). |

## Dynamic vs. static task properties

Task properties can be static or dynamic. Dynamic properties can be set using expressions. To determine whether a property is static or dynamic, check the task’s documentation on the [plugin's homepage](/plugins) or in the UI by clicking on the documentation tab for the task.

![dynamic_properties](/docs/concepts/dynamic_properties.png)

Some properties are marked as **not dynamic** because they are complex types (e.g., maps, lists of strings, lists of maps). These act as **placeholders** for other dynamic properties.

For example, the [runTasks](/plugins/tasks/job/io.kestra.plugin.databricks.job.SubmitRun#runtasks) property of Databricks' `SubmitRun` is not dynamic because it is an array of [RunSubmitTaskSetting](/plugins/tasks/job/io.kestra.plugin.databricks.job.SubmitRun#runsubmittasksetting).

Each `RunSubmitTaskSetting` contains its own properties, many of which are dynamic or placeholders for more complex types. Always drill down to the lowest level — most low-level properties are dynamic and can be templated using expressions.

:::ChildCard
:::
