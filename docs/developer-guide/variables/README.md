---
order: 2
---

# Variables

Variables are specific fields for task. They use the power of [handlebars](https://handlebarsjs.com/guide/) with Kestra's special context system, allowing powerfull task composition.

Variables can use variable information registrered / existing in the execution context. This context are some data injected in Variables and are from different sources:


## Default variable 

### Flow & Execution

Flow & Execution variables allow using current context for this execution in order to customize the tasks (example: name file with current date or current execution id, ...)

The following table lists all the default variables available on each execution. 

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ flow.id }}</code> | The name the current flow Id |
|  <code v-pre>{{ flow.namespace }}</code> | The name current namespace |
|  <code v-pre>{{ execution.id }}</code> | Return the execution Id, a unique id for each  |
|  <code v-pre>{{ execution.startDate }}</code> | The start date of the current execution, you can format it with <code v-pre>{{ instantFormat execution.startDate  "yyyy-MM-dd HH:mm:ss.SSSSSS"}}</code> |
|  <code v-pre>{{ task.id }}</code> | The current task Id |
|  <code v-pre>{{ task.type }}</code> | The current task Type (full class name) |
|  <code v-pre>{{ taskrun.id }}</code> | The current task Id |
|  <code v-pre>{{ taskrun.value }}</code> | The value for current taskrun, only available with ([Flowable Task](../flowable)) |
|  <code v-pre>{{ taskrun.attemptsCount }}</code> | The number of attempts for current task (when retry or restart is done) |
|  <code v-pre>{{ parents.[].taskrun.value }}</code> | The value of parents taskrun, the index if based on closest [Flowable Task](../flowable), only available with tasks previsouly in a ([Flowable Task](../flowable)) |
|  <code v-pre>{{ parents.[].outputs }}</code> | The outputs of parents taskrun, the index if based on closest [Flowable Task](../flowable), only available with tasks previsouly in a ([Flowable Task](../flowable)) |
|  <code v-pre>{{ parent.taskrun.value }}</code> | The value of closest (first) parent taskrun [Flowable Task](../flowable), only available with tasks previsouly in a ([Flowable Task](../flowable)) |
|  <code v-pre>{{ parent.outputs }}</code> | The outputs of (first) parent taskrun [Flowable Task](../flowable), only available with tasks previsouly in a ([Flowable Task](../flowable)) |

If the flow is triggered by a [schedule](../triggers/schedule.md), this vars are also available :  

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ schedule.date }}</code> | the date of current schedule |
|  <code v-pre>{{ schedule.next }}</code> | the date of next schedule |
|  <code v-pre>{{ schedule.previous }}</code> | the date of previous schedule |

If the flow is triggered by a [flow](../triggers/flow.md), this vars are also available :  

| Parameter | Description |
| ---------- | ----------- |
|  <code v-pre>{{ trigger.executionId }}</code> | the execution id that trigger the current flow |
|  <code v-pre>{{ trigger.namespace }}</code> | the namespace of the flow that trigger the current flow |
|  <code v-pre>{{ trigger.flowId }}</code> | the flow id that trigger the current flow |
|  <code v-pre>{{ trigger.flowRevision }}</code> | the flow revision that trigger the current flow |

Here some example usage : 

```yaml
id: context-example
namespace: org.kestra.tests

tasks:
  - id: echo
    type: org.kestra.core.tasks.debugs.Return
    format: |
      taskid: {{task.id}}
      date: {{ instantFormat execution.startDate "yyyy-MM-dd HH:mm:ss.SSSSSS" }}
```

### Inputs variables
You can use any [inputs](../inputs/README.md) using his `name`, example: 

```yaml
id: context-inputs
namespace: org.kestra.tests

inputs:
  - name: myinput
    type: STRING

tasks:
  - id: mytask
    type: org.kestra.core.tasks.debugs.Return
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
namespace: org.kestra.tests

tasks:
    - id: task-id
      type: io.kestra.task.templates.Example
      format: "{{task.id}}"
    - id: flow-id
      type: io.kestra.task.templates.Example
      format: "{{outputs.task-id.child.value}}"
```

### Dynamic variables
Some tasks are dynamic like [EachSequential](/plugins/core/tasks/flows/org.kestra.core.tasks.flows.EachSequential.md),
[EachParallel](/plugins/core/tasks/flows/org.kestra.core.tasks.flows.EachParallel.md) or
[Switch](/plugins/core/tasks/flows/org.kestra.core.tasks.flows.Switch.md) and can hold a special `taskrun.value`.


#### Current value
You can access the current value with <code v-pre>{{ taskrun.value }}</code> like that: 

```yaml
tasks:
  - id: each
    type: org.kestra.core.tasks.flows.EachSequential
    value: '["value 1", "value 2", "value 3"]'
    tasks:
      - id: inner
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
```

#### Previous task lookup
It's also possible to locate a special task by his `value`:
```yaml
tasks:
  - id: each
    type: org.kestra.core.tasks.flows.EachSequential
    value: '["value 1", "value 2", "value 3"]'
    tasks:
      - id: inner
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}}"
  - id: end
    type: org.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{outputs.inner.[value 1].value}}"
```
with the format `outputs.TASKID.[VALUE].PROPERTY`. The special bracket `[]` in  `.[VALUE].` enable special chars like space (and can be remove without any special characters)

#### Lookup in current childs tasks tree

Sometime, it can be useful to access to previous outputs on current task tree, for example on 
[EachSequential](/plugins/core/tasks/flows/org.kestra.core.tasks.flows.EachSequential.md),
you iterate for a list of value, doing a first tasks (Download a file for example) and 
loading previous files to a database.

For this, you will need a special function `eval` : 
```yaml
tasks:
  - id: each
    type: org.kestra.core.tasks.flows.EachSequential
    value: '["value 1", "value 2", "value 3"]'
    tasks:
      - id: first
        type: org.kestra.core.tasks.debugs.Return
        format: "{{task.id}}"
      - id: second
        type: org.kestra.core.tasks.debugs.Return
        format: "{{ eval 'outputs.first.[{{taskrun.value}}].value' }}"
  - id: end
    type: org.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{outputs.inner.[value 1].value}}"
```

## Functions

Some time, you need to change the format of variables. For this, you can use some functions: 

- [String functions](./string.md)
- [Boolean functions](./boolean.md)
- [Number functions](./number.md)
- [Date functions](./date.md)
- [Json functions](./json.md)
- [Iterations functions](./iterations.md)
