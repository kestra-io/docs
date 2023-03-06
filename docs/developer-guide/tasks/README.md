---
order: 2
---

# Tasks

## Runnable Tasks

In Kestra, workloads are done using **Runnable Tasks**.

Runnable Tasks handle computational work in the flow. For example, file system operations, API calls, database queries, etc. These tasks can be compute-intensive and are handled by [workers](../../architecture/#worker).

Each task must have an identifier (id) and a type. The type is a Java Fully Qualified Class Name (FQCN) of the task.

Tasks have properties specific to the type of the task; check each task's documentation for the list of available properties.

Most available tasks are Runnable Tasks except special ones that are [Flowable Tasks](#flowable-tasks); those are explained later on this page.

### Task common properties

The following task properties can be set.

| Field | Description |
| ---------- | ----------- |
|`id`|The flow identifier, must be unique inside a flow.|
|`type`|The Java FQCN of the task.|
|`description`|The description of the task, more details [here](../documentation/).|
|`retry`|Task retry behavior, more details [here](../retries/).|
|`timeout`|Task timeout expressed in [ISO 8601 Durations](https://en.wikipedia.org/wiki/ISO_8601#Durations).|
|`disabled`|Set it to `true` to disable execution of the task.|

Task properties can be static or dynamic. Dynamic task properties can be set using [variables](../variables/README.md). To know if a task property is dynamic, read the task's documentation.


## Flowable Tasks

In Kestra, we orchestrate your workflows using **Flowable Tasks**. These tasks do not compute anything but allow us to build more complex workflows.

Flowable Tasks are used for branching, grouping, doing tasks in parallel, etc...

Flowable Tasks use context [variables](../variables) to define the next tasks to run. For example, you can use the [outputs](../outputs) of a previous task in `Switch` task to decide which task to run next.

## Sequential

This task processes tasks one after another sequentially. It is used to group tasks.

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

This task processes a task conditionally depending on a contextual variable's value.

In the following example, an input will be used to decide which task to run next.

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

This task will generate many tasks at runtime depending on the value of a variable.
Each subtask will run after the others sequentially.

In the following example, the variable is static, but it can be generated from a previous task output and starts an arbitrary number of subtasks.

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

This task will allow children tasks to fail.
If any child task fails:
- The AllowFailure failed task will be marked as status `WARNING`.
- All children's tasks inside the AllowFailure will be stopped immediately.
- The Execution will continue for all others tasks.
- At the end, the execution as a whole will also be marked as status `WARNING`.

In the following example:
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
This allows us to decouple the first flow from the second and monitor each flow individually.

You can pass flow [outputs](../outputs) as [inputs](../inputs) for the triggered flow (those must be declared in the sub-flow).

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

This task will run all tasks sequentially, keeping the same filesystem, allowing the reuse of the previous task files on the next tasks, and keeping track of the execution time for each tasks. This task is useful when working with large filesystem operations.

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

Kestra flows a ran until the end of all tasks, but sometimes, you need to:
- Add a manual validation before continuing the execution.
- Wait some duration before continuing the execution.

For this, you can use the Pause task.

On the following example, the `validation` will pause until a manual modification of the task step, and the `wait` will wait for 5 minutes.

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

:::tip
A Pause task without delay will wait indefinitely until the task state is changed to **Running**.
For this: go to the **Gantt** tab of the **Execution** page, click on the task, select **Change status** on the contextual menu and select **Mark as RUNNING** on the form. This will make the task run until its end.
:::

<div style="text-align: right">
    <a class="btn btn-primary" href="/plugins/core/tasks/flows/io.kestra.core.tasks.flows.Pause">Pause Task documentation</a>
</div>

## Template

[Templates](../templates) are lists of tasks that can be shared between flows. You can define a template and call it from other flows, allowing them to share a list of tasks and keep these tasks updated without changing your flow.

The following example uses the Template task to use a template.

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
