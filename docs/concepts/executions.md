---
order: 2
---
# Execution
An execution is a flow that is currently processing or has already finished performing a task. It is a task set processing all elements together to achieve the flow goal that is to be run successfully.

## Task Run
A Task Run is a task that has been executed and associated to its operational data, such as execution_id, state, start_date, end_date, etc...

## Attempts 
Each task run will produce 1 or more attempts. Most common tasks run will have only 1 attempt, but you can add [Retries](../developer-guide/retries) to a task. If retries are added, they will generate new attempts for each failed task run.

## Outputs 
Each task can generate output data that can be reused in other tasks of the current execution.

## Metrics 
Each task can generate metrics data that may be useful in understanding what the current task is doing. 
Examples of metrics you might see include: `file.size`, `row.count`, etc...

There are 2 kinds of metrics : 
* `Duration` 
* `Counter`  


## State 
A Task Run or Execution can be defined as being in a particular state. 

The possible States are defined below:  
* `CREATED`: The Task Run or Execution is not yet handled internally, waiting to be treated. This usually means the Execution is in a queue.
* `RUNNING`: The Task or Execution is currently running.
* `SUCCESS`: The Task or Execution has completed without a recorded failure.
* `WARNING`: The Task Run or Execution is exhibiting unintended behaviour, but the execution continued and was flagged with a warning.
* `FAILED`: The Task Run or Execution exhibited unintended behaviour that caused the execution to fail.
* `KILLING`: A command was run asking the the Task Run or Execution to be killed, and the system is in the process of killing the associated tasks.
* `KILLED`: A Task Run or Execution was killed (upon request), and no more tasks will be run for that process.
* `RESTARTED`: This status is a transitive status that essentially means `CREATED`, but for a process that has already been executed and killed, and has been restarted.
