---
order: 2
---

# Variables

Variables are specific fields for tasks. They use the power of [Pebble](https://pebbletemplates.io/) with Kestra's special context system, allowing powerful task composition.

Variables can use variable information registered/existing in the execution context. The context is data injected in Variables and can be from different sources:


## Default variables

### Flow & Execution

Flow & Execution variables allow using current context for this execution in order to customize the tasks (example: name file with current date or current execution id, ...)

The following table lists all the default variables available on each execution.
| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ flow.id }}</code> | The name of the current flow ID |
|  <code v-pre>{{ flow.namespace }}</code> | The name of the current namespace |
|  <code v-pre>{{ flow.revision }}</code> | The revision of the current flow |
|  <code v-pre>{{ execution.id }}</code> | Return the execution Id, a unique id for each  |
|  <code v-pre>{{ execution.startDate }}</code> | The start date of the current execution, it can be formatted with <code v-pre>{{ dateFormat execution.startDate  "yyyy-MM-dd HH:mm:ss.SSSSSS"}}</code> |
|  <code v-pre>{{ task.id }}</code> | The current task ID |
|  <code v-pre>{{ task.type }}</code> | The current task Type (full class name) |
|  <code v-pre>{{ taskrun.id }}</code> | The current task ID |
|  <code v-pre>{{ taskrun.value }}</code> | The value for the current task run, only available with ([Flowable Task](../flowable)) |
|  <code v-pre>{{ taskrun.attemptsCount }}</code> | The number of attempts for current task (when retry or restart is done) |
|  <code v-pre>{{ parents[].taskrun.value }}</code> | The value of parents task run, the index if based on closest [Flowable Task](../flowable), only available with tasks previsouly in a ([Flowable Task](../flowable)) |
|  <code v-pre>{{ parents[].outputs }}</code> | The outputs of the parent task run, the index if based on closest [Flowable Task](../flowable), only available with tasks previously run in a ([Flowable Task](../flowable)) |
|  <code v-pre>{{ parent.taskrun.value }}</code> | The value of closest (first) parent task run [Flowable Task](../flowable), only available with tasks run previously in a ([Flowable Task](../flowable)) |
|  <code v-pre>{{ parent.outputs }}</code> | The outputs of (first) parent task run [Flowable Task](../flowable), only available with tasks previously run in a ([Flowable Task](../flowable)) |

If the flow is triggered by a [schedule](../triggers/schedule.md), these variables (vars) are also available :

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ schedule.date }}</code> | the date of current schedule |
|  <code v-pre>{{ schedule.next }}</code> | the date of next schedule |
|  <code v-pre>{{ schedule.previous }}</code> | the date of previous schedule |

If the flow is triggered by a [flow](../triggers/flow.md), these variables (vars) are also available:

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ trigger.executionId }}</code> | the execution id that triggers the current flow |
|  <code v-pre>{{ trigger.namespace }}</code> | the namespace of the flow that triggers the current flow |
|  <code v-pre>{{ trigger.flowId }}</code> | the flow id that triggers the current flow |
|  <code v-pre>{{ trigger.flowRevision }}</code> | the flow revision that triggers the current flow |

Below is an example of typical usage:

```yaml
id: context-example
namespace: io.kestra.tests

tasks:
  - id: echo
    type: io.kestra.core.tasks.debugs.Return
    format: |
      taskid: {{task.id}}
      date: {{  execution.startDate | date("yyyy-MM-dd HH:mm:ss.SSSSSS") }}
```

### Inputs variables
You can use any [inputs](../inputs/README.md) using its `name`, example:

```yaml
id: context-inputs
namespace: io.kestra.tests

inputs:
  - name: myinput
    type: STRING

tasks:
  - id: mytask
    type: io.kestra.core.tasks.debugs.Return
    format: "{{inputs.myinput}}"
```

### Outputs variables
[Outputs variables](../outputs/README.md) can also be referencing their `names` with the form
`outputs.NAME.PROPERTY` :
- `NAME` is the taskId you want to locate
- `PROPERTY` is the property you want to use, each task type can emit different properties, so look at the
documentation of one.

```yaml
id: context-outpouts
namespace: io.kestra.tests

tasks:
    - id: task-id
      type: io.kestra.task.templates.Example
      format: "{{task.id}}"
    - id: flow-id
      type: io.kestra.task.templates.Example
      format: "{{outputs.task-id.child.value}}"
```

## More

In order to customize the :

<ChildTableOfContents :max="1" />
