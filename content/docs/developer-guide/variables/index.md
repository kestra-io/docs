---
order: 3
---

# Variables

You can use variables to set any task property. They use the power of [Pebble Templates](https://pebbletemplates.io/) with Kestra's special context system, allowing powerful task composition inside a flow.

Variables can use flow execution contextual information registered inside the execution context. The execution context is a set of data from different sources: flow and execution, environment variables, global variables, task defaults, flow inputs, and task outputs.

## Flow and Execution variables

Flow and Execution variables allow using the current execution context to set task properties. For example: name a file with the current date or the current execution id.

The following table lists all the default variables available on each execution.

| Parameter | Description |
| ---------- | ----------- |
|  `{{ flow.id }}` | The identifier of the flow. |
|  `{{ flow.namespace }}` | The name of the flow namespace. |
|  `{{ flow.revision }}` | The revision of the flow. |
|  `{{ execution.id }}` | The execution ID, a generated unique id for each execution. |
|  `{{ execution.startDate }}` | The start date of the current execution, can be formatted with `{{ execution.startDate \| date("yyyy-MM-dd HH:mm:ss.SSSSSS") }}`. |
|  `{{ execution.originalId }}` | The original execution ID, this id will never change even in case of replay and keep the first execution ID. |
|  `{{ task.id }}` | The current task ID |
|  `{{ task.type }}` | The current task Type (Java fully qualified class name). |
|  `{{ taskrun.id }}` | The current task run ID. |
|  `{{ taskrun.startDate }}` | The current task run start date. |
|  `{{ taskrun.parentId }}` | The current task run parent identifier. Only available with tasks inside a  ([Flowable Task](../tasks#flowable-tasks)).|
|  `{{ taskrun.value }}` | The value of the current task run, only available with tasks inside a ([Flowable Task](../tasks#flowable-tasks)). |
|  `{{ taskrun.attemptsCount }}` | The number of attempts for the current task (when retry or restart is performed). |
|  `{{ parent.taskrun.value }}` | The value of the closest (first) parent task run [Flowable Task](../tasks#flowable-tasks), only available with tasks inside a ([Flowable Task](../tasks#flowable-tasks)). |
|  `{{ parent.outputs }}` | The outputs of the closest (first) parent task run [Flowable Task](../tasks#flowable-tasks), only available with tasks inside in a ([Flowable Task](../tasks#flowable-tasks)). |
|  `{{ parents }}` | The list of parent tasks, only available with tasks inside a ([Flowable Task](../tasks#flowable-tasks)). See [Parents variables](../variables/basic-usage.md#parents-with-flowable-task) for its usage. |

If a [schedule](../triggers/schedule.md) event triggers the flow, these variables are also available:

| Parameter | Description |
| ---------- | ----------- |
|  `{{ schedule.date }}` | The date of the current schedule. |
|  `{{ schedule.next }}` | The date of the next schedule. |
|  `{{ schedule.previous }}` | The date of the previous schedule. |

If a [flow](../triggers/flow.md) event triggers the flow, these variables are also available:

| Parameter | Description |
| ---------- | ----------- |
|  `{{ trigger.executionId }}` | The ID of the execution that triggers the current flow. |
|  `{{ trigger.namespace }}` | The namespace of the flow that triggers the current flow. |
|  `{{ trigger.flowId }}` | The ID of the flow that triggers the current flow. |
|  `{{ trigger.flowRevision }}` | The revision of the flow that triggers the current flow. |

All these variables can be used thanks to the Pebble template syntax `{{varName}}`:

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

::alert{type="info"}
`{{ execution.startDate | date("yyyy-MM-dd HH:mm:ss.SSSSSS") }}` uses the `date` filter to format the `execution.startDate` variable with the date pattern `yyyy-MM-dd HH:mm:ss.SSSSSS`. More information on filters [here](./filter/).
::

## Environment variables

By default, Kestra allows access to environment variables that start with `KESTRA_` unless configured otherwise, see [Variables configuration](../../administrator-guide/configuration/others#variables-configuration).

To access an environment variable `KESTRA_FOO` from one of your tasks, you can use `{{ envs.foo }}`, the variable's name is the part after the `KESTRA_` prefix in **lowercase**.

## Global variables

You can define global variables inside Kestra's configuration files and access them using `{{ globals.foo }}`, see [Variables configuration](../../administrator-guide/configuration/others#variables-configuration) for more information.

## Inputs variables

You can use any flow [inputs](../inputs) using `inputs.inputName`, for example:

```yaml
id: context-inputs
namespace: io.kestra.tests

inputs:
  - name: myInput
    type: STRING

tasks:
  - id: myTask
    type: io.kestra.core.tasks.debugs.Return
    format: "{{inputs.myInput}}"
```

## Outputs variables

You can use any task [output](../outputs) attributes using `outputs.taskId.outputAttribute` where:
- `taskId` is the ID of the task.
- `outputAttribute` is the attribute of the task output you want to use. Each task output can emit different attributes; refer to the task documentation for the list of output attributes.

Example:

```yaml
id: context-outputs
namespace: io.kestra.tests

tasks:
    - id: firstExample
      type: io.kestra.core.tasks.debugs.Return
      format: "First return"
    - id: second-example
      type: io.kestra.core.tasks.debugs.Return
      format: "Second return"
    - id: log-both-variables
      type: io.kestra.core.tasks.log.Log
      message: "First: {{outputs.firstExample.value}}, Second: {{outputs['second-example'].value}}"
```

::alert{type="info"}
The `Return` task has an output attribute `value` which is used by the `log-both-variables` task.
In the `log-both-variables` task, you can see two ways to access task outputs: the dot notation (`outputs.firstExample`) and the subscript notation (`outputs['second-example']`). The subscript notation must be used when a variable contains a special character, such as `-` that is a Pebble reserved character.
::

## Pebble templating
Pebble templating offers various ways to process variables, see:

<ChildTableOfContents :max="1" />
