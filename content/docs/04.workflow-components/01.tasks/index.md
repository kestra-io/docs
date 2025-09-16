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

Unlike Flowable tasks, Runnable tasks perform the actual work — such as file system operations, API calls, or database queries. These tasks can be compute-intensive and are executed by [workers](../../architecture/worker).

Example runnable tasks include:
- `io.kestra.plugin.scripts.python.Commands`
- `io.kestra.plugin.core.http.Request`
- `io.kestra.plugin.notifications.slack.SlackExecution`

## Core task properties

All tasks share the following core properties:

| Field             | Description                                                                                                                                                                                                                                                                                                                                                          |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`              | A unique identifier within the flow                                                                                                                                                                                                                                                                                                                   |
| `type`            | The Java Fully Qualified Class Name (FQCN) of the task                                                                                                                                                                                                                                                                                                                     |
| `description`     | The [description](../../04.workflow-components/15.descriptions.md) of the task                                                                                                                                                                                                                                                                                       |
| `retry`           | Task [retry](../../04.workflow-components/12.retries.md) behavior                                                                                                                                                                                                                                                                                                    |
| `runIf`           | To skip the task execution if the provided condition evaluates to false                                                                                                                                                                                                                                                                                              |
| `timeout`         | Task [timeout](../../04.workflow-components/13.timeout.md) expressed in [ISO 8601 Durations](https://en.wikipedia.org/wiki/ISO_8601#Durations)                                                                                                                                                                                                                      |
| `disabled`        | Set it to `true` to [disable](../../04.workflow-components/16.disabled.md) execution of the task                                                                                                                                                                                                                                                                    |
| `workerGroup.key` | To execute this task on a specific [Worker Group](../../06.enterprise/04.scalability/worker-group.md) (EE)                                                                                                                                                                                                                                                                         |
| `allowFailure`    | Boolean flag allowing to [the execution to continue](../../04.workflow-components/11.errors.md) even if this task fails                                                                                                                                                                                                                                                |
| `allowWarning`    | Boolean flag allowing to the execution to [finish with a `SUCCESS` state](../../04.workflow-components/11.errors.md#allowfailure-and-allowwarning-property) even if this task produces a warning                                                                                                                                                                    |
| `logLevel`        | Defines the log level persisted to the backend database. By default, all logs are stored. For example, restricting to `INFO` prevents `DEBUG` and `TRACE` logs from being saved.                                                                                                          |
| `logToFile`       | Stores logs in internal storage as a file instead of the database. Files can be previewed and downloaded from the **Logs** and **Gantt** tabs. Useful for tasks that generate large volumes of logs. Also available for triggers. |

## Dynamic vs. static task properties

Task properties can be static or dynamic. Dynamic properties can be set using expressions. To determine whether a property is static or dynamic, check the task’s documentation on the [plugin's homepage](/plugins) or in the UI by clicking on the documentation tab for the task.

![dynamic_properties](/docs/concepts/dynamic_properties.png)

Some properties are marked as **not dynamic** because they are complex types (e.g., maps, lists of strings, lists of maps). These act as **placeholders** for other dynamic properties.

For example, the [runTasks](/plugins/tasks/job/io.kestra.plugin.databricks.job.SubmitRun#runtasks) property of Databricks' `SubmitRun` is not dynamic because it is an array of [RunSubmitTaskSetting](/plugins/tasks/job/io.kestra.plugin.databricks.job.SubmitRun#runsubmittasksetting).

Each `RunSubmitTaskSetting` contains its own properties, many of which are dynamic or placeholders for more complex types. Always drill down to the lowest level — most low-level properties are dynamic and can be templated using expressions.

::ChildCard