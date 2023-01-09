---
order: 2
---
# Execution
An execution is a flow that is currently processing or has already finished all flow's tasks. 
It is a set of tasks processing all task's inputs and outputs to achieve the goal of the flow upon success.

## Task Run
A Task Run is a task that has been executed and associated to its operational data such as execution id, state, start date, end date, etc...

## Attempts 
Each task run will produce 1 or more attempts. Most common task runs will have only 1 attempt, but you can configure [Retries](../developer-guide/retries) to a task. If retries are configured, they will generate new attempts for each failed task runs.

## Outputs 
Each task can generate output data that can be reused in other tasks of the current execution.

## Metrics 
Each task can generate metrics data that may be useful in understanding what the current task is doing. 
Examples of metrics you might see include: `file.size`, `row.count`, etc...

There are 2 kinds of metrics: 
* `Duration` 
* `Counter`  


## State 
A Task Run or an Execution can be in a particular state. 

The possible States are defined below:  
* `CREATED`: The Task Run or Execution is not yet handled internally, waiting to be processed. This usually means the Execution is in a queue.
* `RUNNING`: The Task or Execution is currently running.
* `SUCCESS`: The Task or Execution has completed successfully.
* `WARNING`: The Task Run or Execution is exhibiting unintended behaviour, but the execution continued and was flagged with a warning.
* `FAILED`: The Task Run or Execution exhibited unintended behaviour that caused the execution to fail.
* `KILLING`: A command was run asking the Task Run or Execution to be killed, and the system is in the process of killing the associated tasks.
* `KILLED`: A Task Run or Execution was killed (upon request), and no more tasks will be run for that process.
* `RESTARTED`: This status is a transitive status that essentially means `CREATED`, but for a process that has already been executed and failed, and has been restarted.
