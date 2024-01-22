---
title: Flowable Tasks
---

Kestra orchestrates your flows using **Flowable Tasks**. These tasks do not perform any heavy computation. Instead, they control the orchestration behavior, allowing you to implement more advanced workflow patterns.

Flowable Tasks are used for branching, grouping, doing tasks in parallel, etc...

Flowable Tasks use context [variables](./expression/01.index.md) to define the next tasks to run. For example, you can use the [outputs](./outputs.md) of a previous task in a `Switch` task to decide which task to run next.

### Sequential

This task processes tasks one after another sequentially. It is used to group tasks.

```yaml
id: sequential
namespace: dev

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

::alert{type="info"}
You can access the output of a sibling task with `{{outputs.sibling.value}}`, see [Lookup in sibling tasks](./outputs.md#lookup-in-sibling-tasks)
::

::next-link
[Sequential Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachSequential.md)
::


### Parallel

This task processes tasks in parallel. It makes it convenient to process many tasks at once.

```yaml
id: parallel
namespace: dev

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

::alert{type="warning"}
You cannot access the output of a sibling task as tasks will be run in parallel.
::

::next-link
[Parallel Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.Parallel.md)
::

### Switch

This task processes a set of tasks conditionally depending on a contextual variable's value.

In the following example, an input will be used to decide which task to run next.

```yaml
id: switch
namespace: dev

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

::next-link
[Switch Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.Switch.md)
::


### If

This task processes a set of tasks conditionally depending on a condition.
The condition must coerce to a boolean. Boolean coercion allows 0, -0, null and '' to coerce to false,  all other values to coerce to true.
The `else` branch is optional.

In the following example, an input will be used to decide which task to run next.

```yaml
id: if-condition
namespace: dev

inputs:
  - name: param
    type: STRING

tasks:
  - id: if
    type: io.kestra.core.tasks.flows.If
    condition: "{{inputs.param}}"
    then:
      - id: when-true
        type: io.kestra.core.tasks.log.Log
        message: 'Condition was true'
    else:
      - id: when-false
        type: io.kestra.core.tasks.log.Log
        message: 'Condition was false'
```

::next-link
[If Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.If.md)
::


### EachSequential

This task will generate many tasks at runtime depending on the value of a variable.
Each subtask will run after the others sequentially.

In the following example, the variable is static, but it can be generated from a previous task output and starts an arbitrary number of subtasks.

```yaml
id: each_example
namespace: dev

tasks:
  - id: each
    type: io.kestra.core.tasks.flows.EachSequential
    value: ["value 1", "value 2", "value 3"]
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

::alert{type="info"}
You can access the output of a sibling task with `{{outputs.sibling[taskrun.value].value}}`, see [Lookup in sibling tasks](./outputs.md#lookup-in-sibling-tasks)
::


::next-link
[EachSequential Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachSequential.md)
::

### EachParallel

This task is the same as `EachSequential`, but each subtask will run in parallel.

```yaml
id: each-parallel
namespace: dev

tasks:
  - id: 1_each
    type: io.kestra.core.tasks.flows.EachParallel
    value: ["value 1", "value 2", "value 3"]
    tasks:
      - id: 1-1
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - 'echo "{{task.id}} > $(date +"%T.%N")"'
          - 'sleep 1'
          -
      - id: 1-2
        type: io.kestra.core.tasks.scripts.Bash
        commands:
          - 'echo "{{task.id}} > $(date +"%T.%N")"'
          - 'sleep 1'
          -
  - id: 2_end
    type: io.kestra.core.tasks.debugs.Return
    format: "{{task.id}} > {{taskrun.startDate}}"
```
::alert{type="warning"}
You cannot access the output of a sibling task as tasks will be run in parallel.
::

::next-link
[EachParallel Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.EachParallel.md)
::


### ForEachItem

This task allows you to iterate over a list of items and run a subflow for each item, or for each batch containing multiple items.

Syntax:

```yaml
  - id: each
    type: io.kestra.core.tasks.flows.ForEachItem
    items: "{{ inputs.file }}" # could be also an output variable {{ outputs.extract.uri }}
    inputs:
      file: "{{ taskrun.items }}" # items of the batch
    batch:
      rows: 4
    namespace: dev
    flowId: subflow
    revision: 1 # optional (default: latest)
    wait: true # wait for the subflow execution
    transmitFailed: true # fail the task run if the subflow execution fails
    labels: # optional labels to pass to the subflow to be executed
      key: value
```

This will execute the subflow `dev.subflow` for each batch of items.
To pass the batch of items to a subflow, you can use [inputs](../inputs.md). The example above uses an input of `FILE` type called `file` that takes the URI of an internal storage file containing the batch of items.

::next-link
[ForEachItem Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.ForEachItem.md)
::


### AllowFailure

This task will allow child tasks to fail.
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
namespace: dev

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

::next-link
[AllowFailure Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.AllowFailure.md)
::

### Fail

This task will fail the flow; it can be used with or without conditions.

Without conditions, it can be used, for example, to fail on some switch value.

```yaml
id: fail-on-switch
namespace: dev

inputs:
  - name: param
    type: STRING
    required: true

tasks:
  - id: switch
    type: io.kestra.core.tasks.flows.Switch
    value: "{{inputs.param}}"
    cases:
      case1:
        - id: case1
          type: io.kestra.core.tasks.log.Log
          message: Case 1
      case2:
        - id: case2
          type: io.kestra.core.tasks.log.Log
          message: Case 2
      notexist:
        - id: fail
          type: io.kestra.core.tasks.executions.Fail
      default:
        - id: default
          type: io.kestra.core.tasks.log.Log
          message: default
```

With conditions, it can be used, for example, to validate inputs.

```yaml
id: fail-on-condition
namespace: dev

inputs:
  - name: param
    type: STRING
    required: true

tasks:
  - id: before
    type: io.kestra.core.tasks.log.Log
    message: "I'm before the fail on condition"
  - id: fail
    type: io.kestra.core.tasks.executions.Fail
    condition: "{{inputs.param == 'fail'}}"
  - id: after
    type: io.kestra.core.tasks.log.Log
    message: "I'm after the fail on condition"
```


::next-link
[Fail Task documentation](../../plugins/core/tasks/executions/io.kestra.core.tasks.executions.Fail.md)
::


### Subflow

This task will trigger another flow. This allows you to decouple the first flow from the second and monitor each flow individually.

You can pass flow [outputs](./outputs.md) as [inputs](./inputs.md) for the triggered subflow (those must be declared in the subflow).

```yaml
id: subflow
namespace: dev

tasks:
  - id: "subflow"
    type: io.kestra.core.tasks.flows.Subflow
    namespace: dev
    flowId: my-subflow
    inputs:
      file: "{{ inputs.myFile }}"
      store: 12
```

::next-link
[Subflow Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.Subflow.md)
::


### Worker

The `Worker` task is deprecated in favor of the`WorkingDirectory` task. The next section explains how you can use the`WorkingDirectory` task in order to allow multiple tasks to share a file system during the flow's Execution.

### WorkingDirectory

By default, Kestra will launch each task in a new working directory, possibly on different workers if multiple ones exist.

The example below will run all tasks nested under the `WorkingDirectory` task sequentially. All those tasks will be executed in the same working directory, allowing the reuse of the previous tasks' output files in the downstream tasks. In order to share a working directory, all tasks nested under the `WorkingDirectory` task will be launched on the same worker.

This task can be particularly useful for compute-intensive file system operations.

```yaml
id: working-dir
namespace: dev

tasks:
  - id: working-dir
    type: io.kestra.core.tasks.flows.WorkingDirectory
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

This task can also cache files inside the working directory, for example, to cache script dependencies like the `node_modules` of a node `Script` task.

```yaml
id: node-with-cache
namespace: dev

tasks:
  - id: working-dir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    cache:
      patterns:
        - node_modules/**
      ttl: PT1H
    tasks:
    - id: script
      type: io.kestra.plugin.scripts.node.Script
      beforeCommands:
        - npm install colors
      script: |
        const colors = require("colors");
        console.log(colors.red("Hello"));
```

This task can also fetch files from [namespace files][namespace files](./namespace-files.md) and make them available to all child tasks.

```yaml
id: node-with-cache
namespace: dev

tasks:
  - id: working-dir
    type: io.kestra.core.tasks.flows.WorkingDirectory
    namespaceFiles:
      enabled: true
      include:
      - dir1/*.*
      exclude:
      - dir2/*.*
    tasks:
    - id: shell
      type: io.kestra.plugin.scripts.shell.Commands
      commands:
      - cat dir1/file1.txt
```

::next-link
[WorkingDirectory Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.WorkingDirectory.md)
::


### Pause

Kestra flows a ran until the end of all tasks, but sometimes, you need to:
- Add a manual validation before continuing the execution.
- Wait for some duration before continuing the execution.

For this, you can use the Pause task.

On the following example, the `validation` will pause until a manual modification of the task step, and the `wait` will wait for 5 minutes.

```yaml
id: pause
namespace: dev

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

::alert{type="info"}
A Pause task without delay will wait indefinitely until the task state is changed to **Running**.
For this: go to the **Gantt** tab of the **Execution** page, click on the task, select **Change status** on the contextual menu and select **Mark as RUNNING** on the form. This will make the task run until its end.
::


::next-link
[Pause Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.Pause.md)
::


### DAG

This task allows defining dependencies between tasks by creating a directed acyclic graph (DAG). Instead of an explicit DAG structure, this task allows you to only define upstream dependencies for each task using the `dependsOn` property. This way, you can set dependencies more implicitly for each task, and Kestra will figure out the overall flow structure.

```yaml
id: "dag"
namespace: "dev"
tasks:
  - id: dag
    description: "my task"
    type: io.kestra.core.tasks.flows.Dag
    tasks:
      - task:
          id: task1
          type: io.kestra.core.tasks.log.Log
          message: I'm the task 1
      - task:
          id: task2
          type: io.kestra.core.tasks.log.Log
          message: I'm the task 2
        dependsOn:
          - task1
      - task:
          id: task3
          type: io.kestra.core.tasks.log.Log
          message: I'm the task 3
        dependsOn:
          - task1
      - task:
          id: task4
          type: io.kestra.core.tasks.log.Log
          message: I'm the task 4
        dependsOn:
          - task2
      - task:
          id: task5
          type: io.kestra.core.tasks.log.Log
          message: I'm the task 5
        dependsOn:
          - task4
          - task3
```

::next-link
[Dag Task documentation](../../plugins/core/tasks/flows/io.kestra.core.tasks.flows.Dag.md)
::


### Template (deprecated)

[Templates](./templates.md) are lists of tasks that can be shared between flows. You can define a template and call it from other flows, allowing them to share a list of tasks and keep these tasks updated without changing your flow.

The following example uses the Template task to use a template.

```yaml
id: template
namespace: dev

tasks:
  - id: template
    type: io.kestra.core.tasks.flows.Template
    namespace: dev
    templateId: template
```
