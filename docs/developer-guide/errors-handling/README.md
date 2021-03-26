---
order: 5
---
# Errors handling
Errors are special branch of your flow, where you can define how to handle it if any task failed.

2 kinds of errors can be defined : 
* **Global**: for the flow and must be at root of the flow.
* **Local**: that is available for all [Flowable Task](../flowable), that allow to be only for this tasks and all theirs childs.


## Global Error

This example processes a task which fails immediately. Then a tasks sequence is processed in the error branch of the flow.

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

In this case, the error branch will be used **only** if all childs of task `t2` have an errors. 
In this specific example, if the task `t1` failed, no errors will be used. This is really usefull to do some cleanup of resource for this tasks only. 

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


