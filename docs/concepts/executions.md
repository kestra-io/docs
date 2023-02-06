---
order: 2
---

# Execution

An execution is a single run of a flow. An execution in Kestra can exist in many [states](#state).


## Task Run

A task run is a task that has been executed. A task run has associated data like Execution Id, State, Start date, End date, etc.


## Attempts 

Each task run will produce one or more attempts. Most task runs will have only one attempt, but you can configure [retries](../developer-guide/retries) for a task. If retries have been configured, they will generate new attempts for each failed task run.


## Outputs 

Each task can generate output data that other tasks of the current execution can use.


## Metrics 

Each task can generate metrics data that may be useful in understanding what the current task is doing. For example, `file.size`, `row.count`, etc.

There are two kinds of metrics. Those can measure duration or a counter. 


## State 

An Execution or a Task Run can be in a particular state. 

There are eight possible states:    
* `CREATED`: The Execution or Task Run is waiting to be processed. This state usually means that the Execution is in a queue and has not been handled internally.
* `RUNNING`: The Execution or Task Run is currently running.
* `SUCCESS`: The Execution or Task Run has been completed successfully.
* `WARNING`: The Execution or Task Run exhibited unintended behavior, but the execution continued and was flagged with a warning.
* `FAILED`: The Execution or Task Run exhibited unintended behavior that caused the execution to fail.
* `KILLING`: A command was issued that asked for the Execution or Task Run to be killed. The system is in the process of killing the associated flow or tasks.
* `KILLED`: An Execution or Task Run was killed (upon request), and no more tasks will run for that process.
* `RESTARTED`: This status is transitive. It means `CREATED`, but for a process that has already been executed, failed, and has been restarted.
