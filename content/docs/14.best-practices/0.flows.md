---
title: Flow Best Practices
icon: /docs/icons/best-practices.svg
---

How to design your workflows for optimal performance.

## Understanding what is an execution internally for Kestra

The execution of a flow is an object that will contain:
- All the TaskRuns for this flow, with each having:
    - Theirs attempts, with each having:
        - Theirs metrics
        - Their state histories
    - Theirs outputs
    - Their state histories

Internally:
- Each TaskRun on a flow will be added on the same flow execution context that contains all tasks executed on this flow.
- Each TaskRun status change is read by the Kestra Executor (at most 3 for a task: CREATED, RUNNING then SUCCESS).
- For each state on the Executor, we need:
    - to fetch the serialized flow execution context over the network,
    - to deserialize the flow execution context, find the next task or tasks and serialize the flow execution context,
    - to send the serialized flow execution context over the network.
- The bigger the flow execution context, the longer it will take to handle this serialization phase.
- Depending on the Kestra internal queue and repository implementation, there can be a hard limit on the size of the flow execution context as it is stored as a single row/message. Usually, this limit is around 1MB, so this is important to avoid storing large amounts of data inside the flow execution context.

## Task in the same execution

While it is possible to code a flow with any number of tasks, it is not recommended to have a lot of tasks on the same flow.

A flow can be comprised of manually generated or dynamic tasks. While [EachSequential](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.EachSequential) and [EachParallel](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.EachParallel) are really powerful tasks to loop over the result of a previous task, there are some drawbacks. If the task you are looping over is too large, you can easily end up with hundreds of tasks created. If, for example, you were using a pattern with `Each` inside `Each` (nested looping), it would take only a flow with 20 TaskRuns X 20 TaskRuns to reach 400 TaskRuns.

::alert{type="warning"}
Based on our observations, we have seen that in cases where there are **more than 100** tasks on a flow, we see a decrease in performance and longer executions.
::

To avoid reaching these limits, you can easily create a subflow with the [Subflow task](../04.workflow-components/10.subflows.md), passing arguments from parent to child. In this case, since the `Subflow` task creates a new execution, the subflow tasks will be **isolated** and won't hurt performance.

## Volume of data from your outputs

Some tasks allow you to fetch results on outputs to be reused on the next tasks.
While this is powerful, this **is not intended to be used to transport a lot of data!**
For example, with the [Query](/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.query) task from BigQuery, there is a `fetch` property that allows fetching a result-set as an output attribute.

Imagine a big table with many megabytes or even gigabytes of data. If you use `fetch`, the output will be stored in the execution context and will need to be serialized on each task state change! This is not the idea behind `fetch`, it serves mostly to query a few rows to use it on a [Switch](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.Switch) task for example, or an [EachParallel](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.EachParallel) task to loop over.

::alert{type="info"}
In most cases, there is a `stores` property that can handle a large volume of data. When an output is stored, it uses Kestra's internal storage, and only the URL of the stored file is stored in the execution context.
::


## Parallel Task

Using the [EachParallel](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.EachParallel) task or the [Parallel](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.Parallel) task is a convenient way to optimize flow duration, but keep in mind that, by default, **all parallel tasks are launched at the same time** (unless you specify the `concurrent` property). The only limit will be the number of worker threads you have configured.

Keep this in mind, because you cannot allow parallel tasks to reach the limit of external systems, such as connection limits or quotas.


## Duration of Tasks

By default, Kestra **never limits the duration** (unless specified explicitly on the task's documentation) of the tasks. If you have a long-running process or an infinite loop, the tasks will never end. We can control the timeout on RunnableTask with the property `timeout` that takes a [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) duration like `PT5M` for a duration of 5 minutes.

## Task run JSON

Here is an example of a TaskRun JSON object:
```json
{
  "id": "5cBZ1JF8kim8fbFg13bumX",
  "executionId": "6s1egIkxu3gpzzILDnyxTn",
  "namespace": "io.kestra.tests",
  "flowId": "each-sequential-nested",
  "taskId": "1-1_return",
  "parentTaskRunId": "5ABxhOwhpd2X8DtwUPKERJ",
  "value": "s1",
  "attempts": [
    {
      "metrics": [
        {
          "name": "length",
          "tags": {
            "format": "{{task.id}} > {{taskrun.value}} ⬅ {{taskrun.startDate}}"
          },
          "value": 45.0,
          "type": "counter"
        },
        {
          "name": "duration",
          "tags": {
            "format": "{{task.id}} > {{taskrun.value}} ⬅ {{taskrun.startDate}}"
          },
          "type": "timer",
          "value": "PT0.007213673S"
        }
      ],
      "state": {
        "current": "SUCCESS",
        "histories": [
          {
            "state": "CREATED",
            "date": "2021-05-04T12:02:54.121836Z"
          },
          {
            "state": "RUNNING",
            "date": "2021-05-04T12:02:54.121841Z"
          },
          {
            "state": "SUCCESS",
            "date": "2021-05-04T12:02:54.131892Z"
          }
        ],
        "duration": "PT0.010056S",
        "endDate": "2021-05-04T12:02:54.131892Z",
        "startDate": "2021-05-04T12:02:54.121836Z"
      }
    }
  ],
  "outputs": {
    "value": "1-1_return > s1 ⬅ 2021-05-04T12:02:53.938333Z"
  },
  "state": {
    "current": "SUCCESS",
    "histories": [
      {
        "state": "CREATED",
        "date": "2021-05-04T12:02:53.938333Z"
      },
      {
        "state": "RUNNING",
        "date": "2021-05-04T12:02:54.116336Z"
      },
      {
        "state": "SUCCESS",
        "date": "2021-05-04T12:02:54.144135Z"
      }
    ],
    "duration": "PT0.205802S",
    "endDate": "2021-05-04T12:02:54.144135Z",
    "startDate": "2021-05-04T12:02:53.938333Z"
  }
}
```
