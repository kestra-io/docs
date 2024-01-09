---
title: Tasks
---


## Flowable Tasks

Kestra orchestrates your flows using [Flowable Tasks](flowable-tasks.md). These tasks do not perform any heavy computation. Instead, they control the orchestration behavior, allowing you to implement more advanced workflow patterns.

## Runnable Tasks

In Kestra, most data processing workloads are executed using [Runnable Tasks](runnable-tasks.md).

In contrast to Flowable Tasks, Runnable Tasks are responsible for performing the actual work. For example, file system operations, API calls, database queries, etc. These tasks can be compute-intensive and are handled by [workers](../03.concepts/worker.md).

### Task common properties

The following task properties can be set.

| Field | Description                                                                                                                                                                                                                                                 |
| ---------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`id`| The flow identifier, must be unique inside a flow.                                                                                                                                                                                                          |
|`type`| The Java FQCN of the task.                                                                                                                                                                                                                                  |
|`description`| The description of the task, more details [here](flow.md#document-your-flow).                                                                                                                                                                               |
|`retry`| Task retry behavior, more details [here](retries.md).                                                                                                                                                                                                       |
|`timeout`| Task timeout expressed in [ISO 8601 Durations](https://en.wikipedia.org/wiki/ISO_8601#Durations).                                                                                                                                                           |
|`disabled`| Set it to `true` to disable execution of the task.                                                                                                                                                                                                          |
|`workerGroup.key`| To execute this task on a specific [Worker Group (EE)](worker-group.md).                                                                                                                                                                     |
|`logLevel`| To define the log level granularity for which logs will be inserted into the backend database. By default, all logs are stored. However, if you restrict that to e.g., the `INFO` level, all lower log levels such as `DEBUG` and TRACE won't be persisted. |
| `allowFailure`    | Boolean flag allowing to continue the execution even if this task fails.                                                                                                                                                                                    |


Task properties can be static or dynamic. Dynamic task properties can be set using [epressions](./expression/01.index.md). To know if a task property is dynamic, check the task documentation embedded in the UI.


