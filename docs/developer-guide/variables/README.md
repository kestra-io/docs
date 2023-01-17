---
order: 2
---

# Variables

Variables are specific fields for tasks. They use the power of [Pebble Templates](https://pebbletemplates.io/) with Kestra's special context system, allowing powerful task composition.

Variables can use variable information registered/existing in the execution context. The context is data injected in variables and can be from different sources:


## Default variables

### Flow & Execution

Flow & Execution variables allow using current context for an execution in order to customize the tasks (example: name file with current date or current execution id, ...).

The following table lists all the default variables available on each execution.
| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ flow.id }}</code> | The name of the current flow ID |
|  <code v-pre>{{ flow.namespace }}</code> | The name of the current namespace |
|  <code v-pre>{{ flow.revision }}</code> | The revision of the current flow |
|  <code v-pre>{{ execution.id }}</code> | Return the execution ID, a generated unique id for each execution |
|  <code v-pre>{{ execution.startDate }}</code> | The start date of the current execution, it can be formatted with <code v-pre>{{ dateFormat execution.startDate  "yyyy-MM-dd HH:mm:ss.SSSSSS"}}</code> |
|  <code v-pre>{{ task.id }}</code> | The current task ID |
|  <code v-pre>{{ task.type }}</code> | The current task Type (fully qualified class name) |
|  <code v-pre>{{ taskrun.id }}</code> | The current task run ID |
|  <code v-pre>{{ taskrun.value }}</code> | The value for the current task run, only available within a ([Flowable Task](../flowable)) |
|  <code v-pre>{{ taskrun.attemptsCount }}</code> | The number of attempts for the current task (when retry or restart is done) |
|  <code v-pre>{{ parents[].taskrun.value }}</code> | The value of parents task run, the index is based on closest [Flowable Task](../flowable), only available with tasks previsouly in a ([Flowable Task](../flowable)) |
|  <code v-pre>{{ parents[].outputs }}</code> | The outputs of parents task run, the index is based on closest [Flowable Task](../flowable), only available with tasks previously run in a ([Flowable Task](../flowable)) |
|  <code v-pre>{{ parent.taskrun.value }}</code> | The value of closest (first) parent task run [Flowable Task](../flowable), only available with tasks run previously in a ([Flowable Task](../flowable)) |
|  <code v-pre>{{ parent.outputs }}</code> | The outputs of (first) parent task run [Flowable Task](../flowable), only available with tasks previously run in a ([Flowable Task](../flowable)) |

If the flow is triggered by a [schedule](../triggers/schedule.md) event, these variables (vars) are also available :

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ schedule.date }}</code> | the date of the current schedule |
|  <code v-pre>{{ schedule.next }}</code> | the date of the next schedule |
|  <code v-pre>{{ schedule.previous }}</code> | the date of the previous schedule |

If the flow is triggered by a [flow](../triggers/flow.md) event, these variables (vars) are also available:

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ trigger.executionId }}</code> | the ID of the execution that triggers the current flow |
|  <code v-pre>{{ trigger.namespace }}</code> | the namespace of the flow that triggers the current flow |
|  <code v-pre>{{ trigger.flowId }}</code> | the ID of the flow that triggers the current flow |
|  <code v-pre>{{ trigger.flowRevision }}</code> | the revision of the flow that triggers the current flow |

Below is an example of a typical usage:

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

### Environment variables

By default Kestra allow to access environment variable that starts by `KESTRA_` unless configured otherwise, see [Variables configuration](../../administrator-guide/configuration/others/README.md#variables-configuration).

To access an environnement variable `KESTRA_FOO` from one of your task you can use `{{env.foo}}`, the name of the variable is the part after the `KESTRA_` prefix in lower case.

### Global variables

You can also define global variable inside Kestra configuration files and access them using `{{ globals.foo }}`, see [Variables configuration](../../administrator-guide/configuration/others/README.md#variables-configuration) for more information.

## Inputs variables
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

## Outputs variables
[Outputs variables](../outputs/README.md) can also be referencing by their `names` with the form
`outputs.NAME.PROPERTY`:
- `NAME` is the taskId you want to locate.
- `PROPERTY` is the property you want to use, each task type can emit different properties, so look at the
documentation of those.

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

In order to customize the variable see:

<ChildTableOfContents :max="1" />
