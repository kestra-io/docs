---
order: 7
---
# Errors handling
Errors are special branches of your flow where you can define how to handle task failures.

Two kinds of error handlers can be defined:
* **Global**: error handling global to a flow that must be at the root of the flow.
* **Local**: error handling local to a [Flowable Task](../flowable), will handle errors for the flowable task and its children.


## Global Error Handler

This flow example has a single Bash task that fails immediately.
The global error handler will then be called so the `2nd` task will run.

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


## Local Error Handler

In this flow example, the error branch will be used **only** if a child of the task `t2` has an error. If the task `t1` failed, the error branch would not be used. 

This can be useful to restrict error handling for a specific part of the flow and perform specific tasks like resource cleanup. 

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


