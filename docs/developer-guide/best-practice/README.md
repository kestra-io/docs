---
order: 12
---

# Flow best practice
While Kestra allow you to create almost every kind of flow, there is some case that will be not working well or worst can break Kestra application.
In this section, we will describe the best way to create efficient flow and pattern to avoid. 


## Understand what is an execution internally for Kestra
The execution of a flow is an object that will contain :
- all the TaskRun for this flow, with each having :
    - theirs attempts, with each having :
        - theirs metrics
        - theirs state histories
    - theirs outputs
    - theirs state histories

Here is an example of a taskRun :
```json
{
  "id": "5cBZ1JF8kim8fbFg13bumX",
  "executionId": "6s1egIkxu3gpzzILDnyxTn",
  "namespace": "org.kestra.tests",
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
- Each taskRun on a flow will be added on the same object that contains all task executed on this flow.
- Each TaskRun status changed is read by Kestra Executor (at most 3 for a task = CREATED, RUNNING, SUCCESS)
- For each state on Executor, we need
    - to fetch over the network the serialized object
    - deserialize the object, find the next tasks and serialized the execution object
    - to send over network the serialized object
- The bigger is the execution object, the longer it will take to handle this serialization phase.
- Since we rely on Kafka for storing the object, Kafka have a size limit on message he could accept (default: 1MB). Larger message won't be accepted and will lead to FAILED the execution

## Task on the same execution
Based on previous observation, here is some recommandation to avoid these case : 

While it's possible to code a flow with many tasks, it's not recommended having a lot of tasks on the same flow.

It can be manually generated tasks or dynamic one. While [EachSequential](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachSequential) & [EachParallel](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachParallel) are really powerful task in order to loop over result of a previous task, there is some drawback. If the task you are looping over is too big, you can easily create hundreds of tasks. Or if you using a pattern with Each inside Each (nested looping), you just need to create a 20 taskRuns X 20 taskRuns to reach 400 taskRuns.  

::: warning
Based on our observation, we see that **more than 100** tasks on a flow, we see a decreased of performance and longer execution. 
:::

To avoid reaching this limits, you can easily create a sub flow with [Flow](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Flow) passing argument from parent ot child. In this case, since `Flow` create a new execution, the sub flow tasks will be **isolated** and won't hurt performance. 

## Volume of data from your outputs
Some tasks allow you to fetch some result on outputs in order to be reuse on next tasks. 
While this is powerful, this **is not intended to be used to transport a lot of data!**  
Example with [Query](/plugins/plugin-gcp/tasks/bigquery/io.kestra.plugin.gcp.bigquery.Query) from BigQuery, there is a parameter `fetch` that allow to fetch a resultset as output. 

Imagine a big table with many mo / go of datas, if you use `fetch`, the outputs will be on the execution object and will be need to be serialized on each task state change. This is not the idea behind `fetch`, this one serve mostly to query fews rows in order use it on a [Switch](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Switch) or a [EachParallel](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachParallel) to loop over.

::: tip
In most of the case, there is a conter properties called mostly `store` that can handle a large volume of data since this one will be storage as file in Kestra storage and only the url of this file will be available as output.
:::


## io.kestra.core.tasks.flows.Flow task with wait: true
[Flow](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Flow) allow you to trigger another flow from the current one. 
This is fine on most of the case, except when you use the properties `wait: true`. In this case, the worker will trigger the execution and will wait the end of the child execution. 
So, imagine that you have 16 thread on your worker, you can't have more than 16 concurrents executions that is waiting for a flow. If you reach the max worker thread, you will have all your worker that is waiting for the end of executions, and no more worker will be able to handle new tasks, mean infinite loop.

::: warning 
For now, avoid as possible the `wait: true`. In mean time, we are working on removing this issue and to handle this type of tasks on the executor in a future release. 
:::

## Parallel Task 
Using [EachParallel](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachParallel) &  [Parallel](/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Parallel) is a convenient way to optimize flow duration, but keep in mind by default, **all the tasks are launched at the same time** (unless you specify the `concurrent` properties). The only limit will be the number of worker thread you have configured.
Keep this in mind, because you can't reach limit of external systems like connection limits or quotas.


## Duration of Tasks
By default, Kestra **never limit the duration** (unless specify explicity on the tasks documentation) of the tasks. If you have a long running process or an infinite loop, the tasks will never end. We can control the timeout on RunnableTask with properties `timeout: PT15M` 
