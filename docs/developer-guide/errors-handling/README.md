---
order: 7
---
# Errors handling
Errors are a special branch of your flow where you can define how to handle any task failures.

2 kinds of errors can be defined:
* **Global**: for the flow and must be at the root of the flow.
* **Local**: these are available for all [Flowable Task](../flowable), and are only allowed for these tasks and their children.


## Global Error

This example processes a task that fails immediately. Then a task sequence is processed in the error branch of the flow.

```yaml
id: errors
namespace: io.kestra.tests

tasks:
  - id: failed
    type: io.kestra.core.tasks.scripts.Bash
    commands:
      - exit 1
errors:
  - id: 2nd
    type: io.kestra.core.tasks.debugs.Echo
    format: I'm failing {{task.id}}
    level: INFO
```


## Local Error

In this case, the error branch will be used **only** if all children of task `t2` have errors. 
In this specific example, if the task `t1` failed, no error will be used. This is really useful to perform cleanup of resources for this task only. 

```yaml
id: errors
namespace: io.kestra.tests

tasks:
  - id: parent-seq
    type: io.kestra.core.tasks.flows.Sequential
    tasks:
      - id: t1
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
      - id: t2
        type: io.kestra.core.tasks.flows.Sequential
        tasks:
          - id: t2-t1
            type: io.kestra.core.tasks.scripts.Bash
            commands:
              - 'exit 1'
        errors:
          - id: error-t1
            type: io.kestra.core.tasks.debugs.Return
            format: "Error Trigger ! {{task.id}}"
```


