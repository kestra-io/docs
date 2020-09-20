---
order: 2
---
# Execution
An execution is a flow that is currently processing or have already finished doing things. It is a task set processing together to achieve the flow goal that is to be ran successfully.

## Task Run
A task run is a task that was executed and associated to its operationnal data like execution_id, state, start_date, end_date, ...

## Attempts 
Each task run will be produce 1 or more attempt. Most common task run will have only 1 attempt, but you can add some [Retries](../developer-guide/retries) that will generate new attempts for every failed taskrun.

## Outputs 
Each task can generate some output data that can be reused in other tasks of the current execution.

## Metrics 
Each task can generate some metrics data that be useful to understand what the current task are doing. 
This can be for example `file.size`, `row.count`, ...

There is 2 kind of metrics : 
* `Duration` 
* `Counter`  


## State 
Define all the state that a Task Run or an Execution can have. 

The Execution or Task Run can have these state :  
* `CREATED`: not handle internally, waiting to be treated. Mostly the execution is in a queue.
* `RUNNING`: the tasks are running right now.
* `SUCCESS`: all the task are done without any failure.
* `FAILED`: execution have any unintended behaviour that cause the execution to failed.
* `KILLING`: execution was asked to be killed and waiting tasks were killed.
* `KILLED`: execution was killed, and no more task will be done.
* `RESTARTED`: this status is a transitive status that mean `CREATED`, only for keep track of the restart
