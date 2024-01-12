---
title: Task properties
---

The table below lists the core task properties available to all tasks.

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


Task properties can be **static** or **dynamic**. Dynamic task properties can be set using [epressions](./expression/01.index.md). To find out whether a given task property is static or dynamic, check the task documentation. You can find task documentation on the respective plugin's page as well as in the UI when you hover over a task and click on the documentation tab on the right.

