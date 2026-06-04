---
title: "Flowable Tasks in Kestra: Control Flow Logic"
h1: Control Execution Flow with Sequential, Parallel, and Loop Tasks
description: Deep dive into Kestra Flowable Tasks. Learn to control execution flow with sequential, parallel, switch, if/else, loops, and error handling constructs.
sidebarTitle: Flowable Tasks
icon: /src/contents/docs/icons/flow.svg
---

Control your orchestration logic.

## Control orchestration with flowable tasks

Flowable tasks control orchestration logic — running tasks or subflows in parallel, creating loops, and handling conditional branching. They do not run heavy operations; those are handled by workers.

Flowable tasks use [expressions](../../../expressions/index.mdx) from the execution context to determine which tasks run next. For example, you can use the outputs of a previous task in a `Switch` task to decide which task to run next.

### Sequential

This task runs tasks sequentially and is typically used to group them.

```yaml
id: sequential
namespace: company.team

tasks:
  - id: sequential
    type: io.kestra.plugin.core.flow.Sequential
    tasks:
      - id: 1st
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ taskrun.startDate }}"

      - id: 2nd
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ taskrun.id }}"

  - id: last
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"
```

:::alert{type="info"}
You can access the output of a sibling task using the syntax `{{ outputs.sibling.value }}`.
:::

For more details on capabilities, check out the [Sequential Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.sequential).

### Parallel

This task runs tasks in parallel, making it convenient to process many tasks simultaneously.

```yaml
id: parallel
namespace: company.team

tasks:
  - id: parallel
    type: io.kestra.plugin.core.flow.Parallel
    tasks:
      - id: 1st
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ taskrun.startDate }}"

      - id: 2nd
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ taskrun.id }}"

  - id: last
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"
```

:::alert{type="warning"}
You cannot access the output of a sibling task as tasks will be run in parallel.
:::

For more task details, refer to the [Parallel Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.parallel).

### Switch

This task conditionally runs tasks based on the value of a contextual variable.

In the following example, an input is used to decide which task to run next.

```yaml
id: switch
namespace: company.team

inputs:
  - id: param
    type: BOOLEAN

tasks:
  - id: decision
    type: io.kestra.plugin.core.flow.Switch
    value: "{{ inputs.param }}"
    cases:
      true:
        - id: is_true
          type: io.kestra.plugin.core.log.Log
          message: "This is true"
      false:
        - id: is_false
          type: io.kestra.plugin.core.log.Log
          message: "This is false"
```

For more plugin details, refer to the [Switch Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.switch).

### If

This task processes a set of tasks conditionally depending on a condition.

The condition must evaluate to a boolean. Values such as `0`, `-0`, `null`, and `''` evaluate to `false`; all other values evaluate to `true`.
The `else` branch is optional.

In the following example, an input is used to decide which task to run next.

```yaml
id: if_condition
namespace: company.team

inputs:
  - id: param
    type: BOOLEAN

tasks:
  - id: if
    type: io.kestra.plugin.core.flow.If
    condition: "{{ inputs.param }}"
    then:
      - id: when_true
        type: io.kestra.plugin.core.log.Log
        message: "This is true"
    else:
      - id: when_false
        type: io.kestra.plugin.core.log.Log
        message: "This is false"
```

For more details, check out the [If Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.if).

### Loop

The `Loop` task iterates over a set of values and runs child tasks for each item. Unlike `ForEach`, each iteration runs in an isolated sub-execution with its own context.

`values` accepts a list, a JSON array string, a map, or an ION file URI. When `values` is a URI, Kestra performs one iteration per line of the file.

```yaml
id: loop-basic
namespace: company.team

tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: ["value 1", "value 2", "value 3"]
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "index={{ item.index }} value={{ item.value }}"
```

Inside each iteration, use the `item` variable to access the iteration context:

| Expression | Description |
|---|---|
| `{{ item.index }}` | Zero-based iteration index |
| `{{ item.value }}` | Current iteration value |
| `{{ item.key }}` | Current map key when `values` is a map; not set for list or URI values |
| `{{ item.parent.index }}` | Index of the nearest enclosing loop (nested loops only) |
| `{{ item.parent.value }}` | Value of the nearest enclosing loop (nested loops only) |
| `{{ item.parents[n].value }}` | Value of the nth ancestor loop, counting from innermost |

For more details on `item`, see [loop iteration context](../../../expressions/index.mdx#loop-iteration-context) in the expressions reference.

#### Iterating over objects

When `values` contains a list of objects, each `item.value` is a JSON string. Use `fromJson(item.value).field` to read fields — `item.value.field` does not work.

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values:
      - { id: 101, email: "a@example.com" }
      - { id: 102, email: "b@example.com" }
    fetchType: AUTO
    outputs:
      - id: user_id
        type: INT
        value: "{{ fromJson(item.value).id }}"
      - id: email
        type: STRING
        value: "{{ fromJson(item.value).email }}"
    tasks:
      - id: log_user
        type: io.kestra.plugin.core.log.Log
        message: "User {{ fromJson(item.value).id }} -> {{ fromJson(item.value).email }}"
```

#### Concurrent execution

By default (`concurrencyLimit: 1`), iterations run one at a time in order. Set `concurrencyLimit` to a higher value to run multiple iterations simultaneously, or `0` for no limit.

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    concurrencyLimit: 0
    tasks:
      - id: parallel
        type: io.kestra.plugin.core.flow.Parallel
        tasks:
          - id: log
            type: io.kestra.plugin.core.log.Log
            message: "Processing {{ item.value }}"
          - id: shell
            type: io.kestra.plugin.scripts.shell.Commands
            commands:
              - "echo done {{ item.value }}"
```

#### Failure propagation

By default (`transmitFailed: true`), a failed iteration causes the Loop task itself to fail. Set `transmitFailed: false` to let the loop continue even when individual iterations fail.

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: ["ok", "fail", "ok"]
    transmitFailed: false
    tasks:
      - id: maybe_fail
        type: io.kestra.plugin.core.flow.If
        condition: '{{ item.value == "fail" }}'
        then:
          - id: do_fail
            type: io.kestra.plugin.core.execution.Fail
        else:
          - id: success
            type: io.kestra.plugin.core.log.Log
            message: "OK: {{ item.value }}"
```

#### Error handling per iteration

Use `errors:` to run tasks when an iteration fails, and `finally:` to run a block once after all iterations complete regardless of outcome. `errors:` requires `transmitFailed: false` — with the default `transmitFailed: true`, a failed iteration stops the loop before `errors:` can run. `finally:` always runs regardless of the `transmitFailed` setting.

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values:
      - ok
      - boom
      - ok
    transmitFailed: false
    tasks:
      - id: maybe_fail
        type: io.kestra.plugin.scripts.shell.Commands
        commands:
          - |
            if [ "{{ item.value }}" = "boom" ]; then
              echo "failing on {{ item.value }}" >&2
              exit 1
            fi
            echo "ok {{ item.value }}"
    errors:
      - id: handle_error
        type: io.kestra.plugin.core.log.Log
        message: "Iteration {{ item.index }} ({{ item.value }}) failed"
    finally:
      - id: cleanup
        type: io.kestra.plugin.core.log.Log
        message: "Loop completed (with or without failures)"
```

#### Nested loops

Loops can be nested to any depth. Because `item` is bound to the loop execution rather than individual task runs, flowable tasks nested inside a loop can access `item` directly without a `parent.` prefix.

`item.parents[0]` is the immediate parent loop (same as `item.parent`), `item.parents[1]` is the next outer loop, and so on.

```yaml
tasks:
  - id: outer
    type: io.kestra.plugin.core.flow.Loop
    values: ["bucket1", "bucket2"]
    tasks:
      - id: middle
        type: io.kestra.plugin.core.flow.Loop
        values: [2025, 2026]
        tasks:
          - id: inner
            type: io.kestra.plugin.core.flow.Loop
            values: ["Jan", "Feb", "Mar"]
            tasks:
              - id: log
                type: io.kestra.plugin.core.log.Log
                message: "bucket={{ item.parents[1].value }} year={{ item.parent.value }} month={{ item.value }}"
```

#### Loop outputs

By default, task outputs produced inside a loop are not accessible to tasks that run after the loop. Use the `outputs` property on the Loop task to explicitly declare which values to expose.

```yaml
id: loop-outputs
namespace: company.team

tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: ["a", "b", "c"]
    fetchType: AUTO
    outputs:
      - id: result
        type: STRING
        value: "{{ outputs.process.value }}"
    tasks:
      - id: process
        type: io.kestra.plugin.core.debug.Return
        format: "processed {{ item.value }}"

  - id: summary
    type: io.kestra.plugin.core.log.Log
    message: "Loop ran {{ outputs.loop.iterationCount }} iterations"
```

The loop also exposes monitoring outputs regardless of whether `outputs` is declared:

| Output | Description |
|---|---|
| `iterationCount` | Total number of iterations |
| `runningIterations` | Iterations still in progress |
| `terminatedIterations` | Iterations that have finished |

The `fetchType` property controls how iteration outputs are collected: `FETCH` returns them inline in the execution context (suitable for small iteration counts), `STORE` writes them to internal storage and exposes a URI (preferred for large iteration counts), and `AUTO` (the default) chooses based on whether `values` is a URI.

#### Processing large files

When `values` is a list of URIs from a [`Split`](/plugins/core/storage/io.kestra.plugin.core.storage.split) task, each iteration receives one chunk URI as `item.value`. Combine `Split`, `Loop`, and `Concat` to implement a map-reduce pattern: split a large file into chunks, process each chunk in parallel, then merge the per-chunk outputs into a single result.

Passing `values: "{{ outputs.split.uris }}"` where `outputs.split.uris` is a **list** is different from passing a single file URI. When `values` is a list, each `item.value` is one element of that list. When `values` is a single URI string, Kestra iterates line-by-line through the file.

```yaml
id: map-reduce
namespace: company.team

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: to_ion
    type: io.kestra.plugin.serdes.csv.CsvToIon
    from: "{{ outputs.download.uri }}"

  - id: split
    type: io.kestra.plugin.core.storage.Split
    from: "{{ outputs.to_ion.uri }}"
    rows: 25

  - id: per_chunk
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ outputs.split.uris }}"
    concurrencyLimit: 4
    fetchType: FETCH
    outputs:
      - id: data
        type: STRING
        value: "{{ outputs.aggregate.uri }}"
    tasks:
      - id: aggregate
        type: io.kestra.plugin.transform.Aggregate
        from: "{{ item.value }}"
        outputType: STORE
        groupBy: [customer_email]
        aggregates:
          orders:
            expr: count()
            type: INT
          revenue:
            expr: sum(todecimal(total))
            type: DECIMAL

  - id: concat
    type: io.kestra.plugin.core.storage.Concat
    files: "{{ loopOutputs(outputs.per_chunk.outputs, 'data') }}"
    extension: .ion

  - id: reduce
    type: io.kestra.plugin.transform.Aggregate
    from: "{{ outputs.concat.uri }}"
    outputType: STORE
    groupBy: [customer_email]
    aggregates:
      orders:
        expr: sum(orders)
        type: INT
      revenue:
        expr: sum(revenue)
        type: DECIMAL
```

Use `fetchType: FETCH` to collect per-iteration output URIs inline, then pass them to `Concat` via `loopOutputs(outputs.per_chunk.outputs, 'data')`.

#### Accessing loop outputs in a script task

The following example runs a Python task inside a loop to compute a value, then reads the collected results in a subsequent Python task using the monitoring output and the Kestra Python SDK.

```yaml
id: loop-python-outputs
namespace: company.team

tasks:
  - id: process_items
    type: io.kestra.plugin.core.flow.Loop
    values: [1, 2, 3, 4, 5]
    outputs:
      - id: squared
        type: INT
        value: "{{ outputs.compute.vars.result }}"
    tasks:
      - id: compute
        type: io.kestra.plugin.scripts.python.Script
        dependencies:
          - kestra
        script: |
          from kestra import Kestra
          n = {{ item.value }}
          Kestra.outputs({"result": n * n})

  - id: analyze
    type: io.kestra.plugin.scripts.python.Script
    dependencies:
      - kestra
    script: |
      from kestra import Kestra

      iteration_count = {{ outputs.process_items.iterationCount }}

      # outputs.process_items.outputs is a list of iteration results:
      # [{"item": {"value": "1", "iteration": 1}, "outputs": {"squared": 1}}, ...]
      all_outputs = {{ outputs.process_items.outputs | toJson }}

      squared_values = [iteration["outputs"]["squared"] for iteration in all_outputs]

      print(f"Processed {iteration_count} items")
      print(f"Squared values: {squared_values}")
      print(f"Sum of squares: {sum(squared_values)}")

      Kestra.outputs({"total": sum(squared_values)})
```

`outputs.process_items.iterationCount` is always available after the loop finishes. `outputs.process_items.outputs` is a list of iteration results — each entry contains an `item` object (with `value`, `iteration`, and `key`) and an `outputs` map of the declared output values. To access the first iteration's output in an expression, use `outputs.process_items.outputs[0].outputs.squared`. To extract one output across all iterations as a list, use the `loopOutputs()` function: `{{ loopOutputs(outputs.process_items.outputs, 'squared') }}`.

For more details, see the [Loop task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.loop).


### LoopUntil

`LoopUntil` runs a group of tasks repeatedly until a boolean condition evaluates to `true`. After each iteration, the task evaluates the `condition` expression; if it evaluates to `false`, the block is executed again after the configured interval.

Typical use cases include polling an external API, waiting for a long-running job to transition to a terminal state, or checking for the presence of downstream resources.

Key properties:

- `condition` — expression evaluated after each iteration; has access to the child task outputs from the most recent run (e.g. `{{ outputs.checkStatus.code }}`).
- `tasks` — the list of child tasks to run before re-evaluating the condition.
- `checkFrequency` — optional guardrails that define `interval`, `maxIterations`, and/or `maxDuration` between repeats. (See the [LoopUntil migration note](../../../11.migration-guide/v0.23.0/loop-until-defaults/index.md) for default values.)

Example: poll an API until it returns HTTP 200, checking every 30 seconds and stopping after 50 attempts if it never succeeds.

```yaml
id: loop_until
namespace: company.team

tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.LoopUntil
    condition: "{{ outputs.ping.code == 200 }}"
    checkFrequency:
      interval: PT30S
      maxIterations: 50
    tasks:
      - id: ping
        type: io.kestra.plugin.core.http.Request
        method: GET
        uri: https://kestra.io/api/mock
```

For more details, refer to the [LoopUntil Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.loopuntil).

### AllowFailure

This task allows child tasks to fail.

If any child task fails:
- The `AllowFailure` task is marked with status `WARNING`.
- All child tasks inside `AllowFailure` stop immediately.
- The execution continues for all other tasks.
- At the end, the execution as a whole is marked as status `WARNING`.

In the following example:
- `allow_failure` will be labelled as `WARNING`.
- `ko` will be labelled as `FAILED`.
- `next` will not be run.
- `end` will be run and labelled `SUCCESS`.

```yaml
id: each
namespace: company.team

tasks:
  - id: allow_failure
    type: io.kestra.plugin.core.flow.AllowFailure
    tasks:
      - id: ko
        type: io.kestra.plugin.core.execution.Fail
      - id: next
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ taskrun.startDate }}"

  - id: end
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"
```

:::alert{type="info"}
For more details, refer to the [AllowFailure Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.allowfailure).
:::

### Fail

This task fails the flow; it can be used with or without conditions.

Without conditions, it can be used, for example, to fail on some switch value.

```yaml
id: fail_on_switch
namespace: company.team

inputs:
  - id: param
    type: STRING
    required: true

tasks:
  - id: switch
    type: io.kestra.plugin.core.flow.Switch
    value: "{{ inputs.param }}"
    cases:
      case1:
        - id: case1
          type: io.kestra.plugin.core.log.Log
          message: Case 1
      case2:
        - id: case2
          type: io.kestra.plugin.core.log.Log
          message: Case 2
      notexist:
        - id: fail
          type: io.kestra.plugin.core.execution.Fail
      default:
        - id: default
          type: io.kestra.plugin.core.log.Log
          message: default
```

With conditions, it can be used, for example, to validate inputs.

```yaml
id: fail_on_condition
namespace: company.team

inputs:
  - id: param
    type: STRING
    required: true

tasks:
  - id: before
    type: io.kestra.plugin.core.log.Log
    message: "I'm before the fail on condition"
  - id: fail
    type: io.kestra.plugin.core.execution.Fail
    condition: "{{ inputs.param == 'fail' }}"
  - id: after
    type: io.kestra.plugin.core.log.Log
    message: "I'm after the fail on condition"
```

For more information, refer to the [Fail Task documentation](/plugins/core/execution/io.kestra.plugin.core.execution.fail).

### Subflow

This task triggers another flow. This enables you to decouple the first flow from the second and monitor each flow individually.

You can pass flow outputs as inputs to the triggered subflow (those must be declared in the subflow).

```yaml
id: subflow_example
namespace: company.team

inputs:
  - id: my_file
    type: FILE

tasks:
  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    namespace: company.team
    flowId: my_subflow
    inputs:
      file: "{{ inputs.my_file }}"
      store: 12
```

For more details, refer to the [Subflow Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.subflow).

### WorkingDirectory

By default, Kestra launches each task in a new working directory, possibly on different workers if multiple ones exist.

The example below runs all tasks nested under the `WorkingDirectory` task sequentially in the same directory, allowing downstream tasks to reuse output files from previous ones. To share a working directory, all tasks nested under the `WorkingDirectory` task are launched on the same worker.

This task can be particularly useful for compute-intensive file system operations.

```yaml
id: working_dir_flow
namespace: company.team

tasks:
  - id: working_dir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
      - id: first
        type: io.kestra.plugin.scripts.shell.Commands
        taskRunner:
          type: io.kestra.plugin.core.runner.Process
        commands:
          - 'echo "{{ taskrun.id }}" > {{ workingDir }}/stay.txt'

      - id: second
        type: io.kestra.plugin.scripts.shell.Commands
        taskRunner:
          type: io.kestra.plugin.core.runner.Process
        commands:
          - |
            echo '::{"outputs": {"stay":"'$(cat {{ workingDir }}/stay.txt)'"}}::'
```

This task can also cache files inside the working directory, for example, to cache script dependencies like the `node_modules` of a node `Script` task.

```yaml
id: node_with_cache
namespace: company.team

tasks:
  - id: working_dir
    type: io.kestra.plugin.core.flow.WorkingDirectory
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

This task can also fetch files from [namespace files](../../../06.concepts/02.namespace-files/index.md) and make them available to all child tasks.

```yaml
id: node_with_cache
namespace: company.team

tasks:
  - id: working_dir
    type: io.kestra.plugin.core.flow.WorkingDirectory
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

:::alert{type="info"}
[WorkingDirectory Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.workingdirectory)
:::

### Pause

Kestra flows run until all tasks complete, but sometimes you need to:
- Add a manual validation before continuing the execution
- Wait for some duration before continuing the execution

For this, you can use the Pause task.

In the following example, the `validation` task pauses until it is manually resumed, while the `wait` task pauses for 5 minutes.

```yaml
id: pause
namespace: company.team

tasks:
  - id: validation
    type: io.kestra.plugin.core.flow.Pause
    tasks:
      - id: ok
        type: io.kestra.plugin.scripts.shell.Commands
        taskRunner:
          type: io.kestra.plugin.core.runner.Process
        commands:
          - 'echo "started after manual validation"'

  - id: wait
    type: io.kestra.plugin.core.flow.Pause
    delay: PT5M
    tasks:
      - id: waited
        type: io.kestra.plugin.scripts.shell.Commands
        taskRunner:
          type: io.kestra.plugin.core.runner.Process
        commands:
          - 'echo "start after 5 minutes"'
```

:::alert{type="info"}
A Pause task without delay waits indefinitely until the task state is changed to **Running**.
For this: go to the **Gantt** tab of the **Execution** page, click on the task, select **Change status** on the contextual menu, and select **Mark as RUNNING** on the form. This makes the task run until its end. For more details, refer to the [Pause Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.pause).
:::

### DAG

This task allows defining dependencies between tasks by creating a directed acyclic graph (DAG). Instead of an explicit DAG structure, this task defines dependencies for each task using the `dependsOn` property. This way, you can set dependencies more implicitly for each task, and Kestra figures out the overall flow structure.

```yaml
id: dag
namespace: company.team
tasks:
  - id: dag
    description: "my task"
    type: io.kestra.plugin.core.flow.Dag
    tasks:
      - task:
          id: task1
          type: io.kestra.plugin.core.log.Log
          message: I'm the task 1
      - task:
          id: task2
          type: io.kestra.plugin.core.log.Log
          message: I'm the task 2
        dependsOn:
          - task1
      - task:
          id: task3
          type: io.kestra.plugin.core.log.Log
          message: I'm the task 3
        dependsOn:
          - task1
      - task:
          id: task4
          type: io.kestra.plugin.core.log.Log
          message: I'm the task 4
        dependsOn:
          - task2
      - task:
          id: task5
          type: io.kestra.plugin.core.log.Log
          message: I'm the task 5
        dependsOn:
          - task4
          - task3
```

For more details, refer to the [Dag Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.dag).

### Template (deprecated)

Templates are lists of tasks that can be shared between flows. You can define a template and call it from other flows, allowing them to share a list of tasks and keep these tasks updated without changing your flow.

The following example uses the Template task to use a template.

```yaml
id: template
namespace: company.team

tasks:
  - id: template
    type: io.kestra.plugin.core.flow.Template
    namespace: company.team
    templateId: template
```
