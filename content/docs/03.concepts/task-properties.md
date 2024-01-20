---
title: Task properties
---

The table below lists the core task properties available to all tasks.

| Field | Description                                                                                                                                                                                                                                                 |
| ---------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`id`| The flow identifier, must be unique inside a flow.                                                                                                                                                                                                          |
|`type`| The Java FQCN of the task.                                                                                                                                                                                                                                  |
|`description`| The [description](descriptions.md) of the task.                                                                                                                                                                                                             |
|`retry`| Task retry behavior, more details [here](retries.md).                                                                                                                                                                                                       |
|`timeout`| Task timeout expressed in [ISO 8601 Durations](https://en.wikipedia.org/wiki/ISO_8601#Durations).                                                                                                                                                           |
|`disabled`| Set it to `true` to disable execution of the task.                                                                                                                                                                                                          |
|`workerGroup.key`| To execute this task on a specific [Worker Group (EE)](worker-group.md).                                                                                                                                                                                    |
|`logLevel`| To define the log level granularity for which logs will be inserted into the backend database. By default, all logs are stored. However, if you restrict that to e.g., the `INFO` level, all lower log levels such as `DEBUG` and TRACE won't be persisted. |
| `allowFailure`    | Boolean flag allowing to continue the execution even if this task fails.                                                                                                                                                                                    |

## Dynamic vs. static task properties

Task properties can be **static** or **dynamic**. Dynamic task properties can be set using [epressions](./expression/01.index.md). To find out whether a given task property is static or dynamic, check the task documentation available on the [plugin's homepage](https://kestra.io/plugins) as well as in the UI when you hover over a task and click on the documentation tab on the right.

![dynamic_properties](/docs/concepts/dynamic_properties.png)

Often some task properties are marked as **not dynamic** because they are of complex types (e.g. maps, list of strings, list of maps), meaning that they are **placeholders** for other dynamic properties. Let's take the [runTasks](https://kestra.io/plugins/tasks/job/io.kestra.plugin.databricks.job.SubmitRun#runtasks) property of Databrick's `SubmitRun` task as an example. This property is not dynamic because it's an array of [RunSubmitTaskSetting](https://kestra.io/plugins/tasks/job/io.kestra.plugin.databricks.job.SubmitRun#runsubmittasksetting). This `RunSubmitTaskSetting` in turn is a group of multiple other properties which are also either dynamic or of complex type (placeholder for other properties). It's therefore useful to always drill down to the lowest level — most lowest level properties are dynamic and can be templated using [epressions](./expression/01.index.md).