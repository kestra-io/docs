---
order: 12
---

# Flow best practice
While Kestra allows you to create almost every kind of flow, there are some cases that will not work very well, or worse, can break the Kestra application.
In this section, we will describe the best way to create efficient flows as well as patterns to avoid.


## Understanding what is an execution internally for Kestra
The execution of a flow is an object that will contain:
- all the TaskRuns for this flow, with each having:
    - theirs attempts, with each having:
        - theirs metrics
        - theirs state histories
    - theirs outputs
    - theirs state histories

Here is an example of a TaskRun :
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

Internally:
- Each TaskRun on a flow will be added on the same object that contains all tasks executed on this flow.
- Each TaskRun status change is read by the Kestra Executor (at most 3 for a task: CREATED, RUNNING then SUCCESS).
- For each state on the Executor, we need:
    - to fetch the serialized object over the network,
    - to deserialize the object, find the next task or tasks and serialize the execution object,
    - to send the serialized object over the network.
- The bigger the execution object, the longer it will take to handle this serialization phase.
- Since we rely on Kafka or a database for storing the object, large message will lead to slow the execution (due to network transmission or deserialization). Moreover, Kafka has a size limit on messages it can accept (default: 1MB). Larger messages will not be accepted and will lead to a FAILED execution.

## Task on the same execution
Based on previous observation, here are some recommendations to avoid such cases:

While it is possible to code a flow with many tasks, it is not recommended to have a lot of tasks on the same flow.

A flow can be comprised of manually generated tasks or dynamic ones. While [EachSequential](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachSequential) & [EachParallel](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachParallel) are really powerful tasks to loop over the result of a previous task, there are some drawbacks. If the task you are looping over is too large, you can easily end up with hundreds of tasks created. If, for example, you were using a pattern with Each inside Each (nested looping), it would take only a 20 TaskRuns X 20 TaskRuns flow to reach 400 TaskRuns.

::: warning
Based on our observations, we have seen that in cases where there are **more than 100** tasks on a flow, we see a decrease in performance and longer executions.
:::

To avoid reaching these limits, you can easily create a sub-flow with [Flow](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Flow) passing arguments from parent to child. In this case, since the `Flow` create a new execution, the sub-flow tasks will be **isolated** and won't hurt performance.

## Volume of data from your outputs
Some tasks allow you to fetch results on outputs in order to be reused on the next tasks.
While this is powerful, this **is not intended to be used to transport a lot of data!**
For example with [Query](/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.Query) from BigQuery, there is a parameter `fetch` that allow us to fetch a resultset as output.

Imagine a big table with many mo / go of data. If you use `fetch`, the outputs will be on the execution object and will need to be serialized on each task state change. This is not the idea behind `fetch`, this serves mostly to query a fews rows in order to use it on a [Switch](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Switch) or an [EachParallel](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachParallel) to loop over.

::: tip
In most cases, there are counter properties called `stores` that can handle a large volume of data. These serve as storage within Kestra, and only the URL of the stored file is available as output.
:::


## Parallel Task
Using [EachParallel](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachParallel) &  [Parallel](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Parallel) serves as a convenient way to optimize flow duration, but keep in mind, that by default **all the tasks are launched at the same time** (unless you specify the `concurrent` properties). The only limit will be the number of worker threads you have configured.
Keep this in mind, because you cannot allow parallel tasks to reach the limits of external systems, such as connection limits or quotas.


## Duration of Tasks
By default, Kestra **never limits the duration** (unless specified explicitly on the tasks documentation) of the tasks. If you have a long running process or an infinite loop, the tasks will never end. We can control the timeout on RunnableTask with the properties `timeout: PT15M`.
