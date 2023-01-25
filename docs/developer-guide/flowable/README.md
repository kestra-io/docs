---
order: 2
---

# Flowable Task

In Kestra, we orchestrate your workflows using `Flowable Tasks`. These tasks do not compute anything, but allow to build more complex workflows.
Flowable Tasks are used for things like branching, doing tasks in parallel, etc...

Flowable Tasks mostly use context with [variables](../variables) in order to define the next tasks.
For example, you can use the [outputs](../outputs) of a variable to run a `Switch` task to move to the next defined task.

Here is the current list of Flowable Tasks:

## Sequential

This task processes tasks one after another sequentially. It is mostly used in order to group tasks.

```yaml
id: sequential
namespace: io.kestra.tests

tasks:
  - id: sequential
    type: io.kestra.core.tasks.flows.Sequential
    tasks:
      - id: 1st
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
      - id: 2nd
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.id}}"
  - id: last
    type: io.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
```

:::tip
You can access the output of a sibling task with <code v-pre>{{outputs.sibling.value}}</code>, see [Lookup in sibling tasks](/docs/developer-guide/outputs/README.md#lookup-in-sibling-tasks)
:::

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Sequential">Sequential Task documentation</a>
</div>


## Parallel

This task processes tasks in parallel. It makes it convenient to process many tasks at once.

```yaml
id: parallel
namespace: io.kestra.tests

tasks:
  - id: parallel
    type: io.kestra.core.tasks.flows.Parallel
    tasks:
      - id: 1st
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
      - id: 2nd
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.id}}"
  - id: last
    type: io.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
```

:::warning
You cannot access the output of a sibling task as tasks will be run in parallel.
:::

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Parallel">Parallel Task documentation</a>
</div>


## Switch

This task processes some tasks conditionally depending on a contextual value.
In this case, an input value will trigger only some parts of the flow.

```yaml
id: switch
namespace: io.kestra.tests

inputs:
  - name: string
    type: STRING
    required: true

tasks:
  - id: switch
    type: io.kestra.core.tasks.flows.Switch
    value: "{{inputs.string}}"
    cases:
      FIRST:
        - id: 1st
          type: io.kestra.core.tasks.debugs.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
      SECOND:
        - id: 2nd
          type: io.kestra.core.tasks.debugs.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
      THIRD:
        - id: 3th
          type: io.kestra.core.tasks.debugs.Return
          format: "{{task.id}} > {{taskrun.startDate}}"
    defaults:
      - id: default
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
```

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Switch">Switch Task documentation</a>
</div>


## EachSequential

This task will generate many tasks at runtime depending on the value of a field.
Here, the field is static, but it can be generated from a previous task output and trigger an arbitrary number of subtasks.
Each subtask will run after the others sequentially.

```yaml
id: each
namespace: io.kestra.tests

tasks:
  - id: each
    type: io.kestra.core.tasks.flows.EachSequential
    value: '["value 1", "value 2", "value 3"]'
    tasks:
      - id: 1st
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
      - id: 2nd
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
  - id: last
    type: io.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
```

:::tip
You can access the output of a sibling task with <code v-pre>{{outputs.sibling[taskrun.value].value}}</code>, see [Lookup in sibling tasks](/docs/developer-guide/outputs/README.md#lookup-in-sibling-tasks)
:::

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachSequential">EachSequential Task documentation</a>
</div>

## EachParallel

This task is the same as EachSequential but each subtask will run in parallel.

```yaml
id: each-parallel
namespace: io.kestra.tests

tasks:
  - id: 1_each
    type: io.kestra.core.tasks.flows.EachParallel
    value: '["value 1", "value 2", "value 3"]'
    tasks:
      - id: 1-1
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - 'echo "{{task.id}} > $(date +"%T.%N")"'
          - 'sleep 1'
      - id: 1-2
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - 'echo "{{task.id}} > $(date +"%T.%N")"'
          - 'sleep 1'
  - id: 2_end
    type: io.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
```
:::warning
You cannot access the output of a sibling task as tasks will be run in parallel.
:::

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachParallel">EachParallel Task documentation</a>
</div>



## AllowFailure
This task will allow a failed child task. If any child task fails:
- The AllowFailure failed task will be marked as status `WARNING`.
- All children tasks inside the AllowFailure will be stopped immediately.
- The Execution will continue for all others tasks.
- At the end, the execution as a whole will be also marked as status `WARNING`.

In this example:
- `allow-failure` will be labelled as `WARNING`.
- `ko` will be labelled as `FAILED`.
- `next` will not be run.
- `end` will be run and labelled `SUCCESS`.

```yaml
id: each
namespace: io.kestra.tests

tasks:
  - id: allow-failure
    type: io.kestra.core.tasks.flows.AllowFailure
    tasks:
      - id: ko
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - 'exit 1'
      - id: next
        type: io.kestra.core.tasks.debugs.Return
        format: "{{task.id}} > {{taskrun.startDate}}"
  - id: end
    type: io.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
```

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.AllowFailure">AllowFailure Task documentation</a>
</div>


## Flow

This task will trigger another flow.
This allows to decouple the first flow from the second and to monitor each flow individually.

You can pass [outputs](../outputs) to the trigger flow as [inputs](../inputs) (that must be declared in the subflow).

```yaml
id: subflow
namespace: io.kestra.tests

tasks:
  - id: "subflow"
    type: io.kestra.core.tasks.flows.Flow
    namespace: io.kestra.tests
    flowId: my-sub-flows
    inputs:
      file: "{{ inputs.myFile }}"
      store: 12
```

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Flow">Flow Task documentation</a>
</div>

## Worker

By default, Kestra will launch each task on a fresh filesystem and on a new worker instance.

This task will run sequentially all tasks keeping the same filesystem allowing reuse of the previous task file on the next tasks and keeping track of execution time for each task. This task is mostly useful when working with large filesystem operations.

```yaml
id: worker
namespace: io.kestra.tests

tasks:
  - id: worker
    type: io.kestra.core.tasks.flows.Worker
    tasks:
      - id: first
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - 'echo "{{ taskrun.id }}" > {{ workingDir }}/stay.txt'
      - id: second
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - |
            echo '::{"outputs": {"stay":"'$(cat {{ workingDir }}/stay.txt)'"}}::'
```

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Worker">Worker Task documentation</a>
</div>


## Pause

Kestra flows run tasks untill the end of all task, but sometime, you need to:
- add a manual validation before continuing the execution.
- wait some duration before continuing the execution.

```yaml
id: pause
namespace: io.kestra.tests

tasks:
  - id: validation
    type: io.kestra.core.tasks.flows.Pause
    tasks:
      - id: ok
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - 'echo "started after manual validation"'
  - id: wait
    type: io.kestra.core.tasks.flows.Pause
    delay: PT5M
    tasks:
      - id: waited
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - 'echo "start after 5 minutes"'
```

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Pause">Pause Task documentation</a>
</div>

## Templates
[Templates](../templates) are special tasks that will include tasks from a template at *runtime*.
First, you create the template, then you can use it on every flow you want, allowing to share common tasks between your flows.

```yaml
id: template
namespace: io.kestra.tests

tasks:
  - id: template
    type: io.kestra.core.tasks.flows.Template
    namespace: io.kestra.tests
    templateId: template
```

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Template">Template Task documentation</a>
</div>
