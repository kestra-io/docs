---
order: 2
---

# Execution

An execution is a single run of a flow. An execution has a [state](#state).


## Task Run

A task run is a task that has been executed. A task run has associated data like Execution Id, State, Start Date, End Date, etc.


## Attempts 

Each task run can have one or more attempts. Most task runs will have only one attempt, but you can configure [retries](../developer-guide/errors-handling/README.md#retries) for a task. 
If retries have been configured, a task failure will generate new attempts until the retry `maxAttempt` or `maxDuration` threshold was hit.


## Outputs 

Each task can generate output data that other tasks of the current flow execution can use.

These outputs can be variables or files that will be stored inside Kestra's [internal storage](../architecture/#the-internal-storage).

Outputs are described on each task documentation page and can be seen in the **Outputs** tab of the **Execution** page.


## Metrics 

Each task can generate metrics that may be useful in understanding what the current task is doing. For example: file size, number of rows, etc.

There are two kinds of metrics: duration and counter.

Metrics can be seen in the **Outputs** tab of the **Execution** page.


## State 

An Execution or a Task Run can be in a particular state. 

There are nine possible states:    
* `CREATED`: The Execution or Task Run is waiting to be processed. This state usually means that the Execution is in a queue and has yet to be started.
* `RUNNING`: The Execution or Task Run is currently running.
* `PAUSED`: The Execution or Task Run has been paused. This status is used for two reasons:
    * Manual validation
    * Delay (for a specified duration before continuing the execution)
* `SUCCESS`: The Execution or Task Run has been completed successfully.
* `WARNING`: The Execution or Task Run exhibited unintended behavior, but the execution continued and was flagged with a warning.
* `FAILED`: The Execution or Task Run exhibited unintended behavior that caused the execution to fail.
* `KILLING`: A command was issued that asked for the Execution or Task Run to be killed. The system is in the process of killing the associated tasks.
* `KILLED`: An Execution or Task Run was killed (upon request), and no more tasks will run for it.
* `RESTARTED`: This status is transitive. It is the same as `CREATED`, but for a flow that has already been executed, failed, and has been restarted.
