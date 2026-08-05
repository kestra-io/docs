---
title: "Flowable Tasks in Kestra: Control Flow Logic"
h1: Control Execution Flow with Sequential, Parallel, and Loop Tasks
description: Deep dive into Kestra Flowable Tasks. Learn to control execution flow with sequential, parallel, switch, if/else, loops, and error handling constructs.
sidebarTitle: Flowable Tasks
icon: /src/contents/docs/icons/flow.svg
---

Flowable tasks control orchestration logic — branching, looping, and parallelizing work — without performing heavy computation themselves.

Flowable tasks use [expressions](../../../expressions/index.mdx) from the execution context to determine which tasks run next.

### Sequential

`Sequential` runs child tasks one after another, with optional `errors` and `finally` hooks. It is useful for grouping related steps into a named block, particularly when mixing sequential and parallel constructs.

Tasks inside a `Sequential` block can reference sibling task outputs using `{{ outputs.sibling_id.value }}`.

```yaml
id: sequential
namespace: company.team

tasks:
  - id: sequential
    type: io.kestra.plugin.core.flow.Sequential
    tasks:
      - id: first_task
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ taskrun.startDate }}"

      - id: second_task
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ outputs.first_task.value }}"

  - id: last
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"
```

For more details, check out the [Sequential Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.sequential).

### Parallel

`Parallel` starts all child tasks concurrently, reducing total elapsed time when tasks are independent. Because branches run simultaneously, you cannot access the output of a sibling task from within the same `Parallel` block — outputs are only available to tasks that run after the `Parallel` task completes.

Use the `concurrent` property to cap how many branches run at once (`0` = no limit, the default).

```yaml
id: parallel
namespace: company.team

tasks:
  - id: parallel
    type: io.kestra.plugin.core.flow.Parallel
    concurrent: 2
    tasks:
      - id: branch_1
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ taskrun.startDate }}"

      - id: branch_2
        type: io.kestra.plugin.core.debug.Return
        format: "{{ task.id }} > {{ taskrun.id }}"

  - id: last
    type: io.kestra.plugin.core.debug.Return
    format: "{{ task.id }} > {{ taskrun.startDate }}"
```

Nest `Sequential` inside `Parallel` branches to run multi-step sequences concurrently:

```yaml
tasks:
  - id: parallel
    type: io.kestra.plugin.core.flow.Parallel
    tasks:
      - id: sequence1
        type: io.kestra.plugin.core.flow.Sequential
        tasks:
          - id: task1
            type: io.kestra.plugin.core.log.Log
            message: "step 1a"
          - id: task2
            type: io.kestra.plugin.core.log.Log
            message: "step 1b"
      - id: sequence2
        type: io.kestra.plugin.core.flow.Sequential
        tasks:
          - id: task3
            type: io.kestra.plugin.core.log.Log
            message: "step 2a"
          - id: task4
            type: io.kestra.plugin.core.log.Log
            message: "step 2b"
```

For more task details, refer to the [Parallel Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.parallel).

### Switch

`Switch` routes execution to a matching case based on the value of an expression. In the following example, an input determines which branch runs.

```yaml
id: switch
namespace: company.team

inputs:
  - id: param
    type: BOOL

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

`If` runs one branch of tasks when a condition is true and an optional `else` branch when it is false. The condition must evaluate to a boolean — `0`, `-0`, `null`, and `''` evaluate to `false`; all other values evaluate to `true`.

```yaml
id: if_condition
namespace: company.team

inputs:
  - id: param
    type: BOOL

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

The `Loop` task iterates over a set of values and runs child tasks for each item in an isolated sub-execution with its own context.

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

For more details on `item`, see [loop iteration context](../../../expressions/01.context/index.mdx#loop-iteration-context) in the expressions reference.

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

Use `errors:` to run tasks when an iteration fails, and `finally:` to run a block once after all iterations complete regardless of outcome. `errors:` runs within the failing iteration regardless of `transmitFailed` — with `transmitFailed: true` (default), the loop stops after the failing iteration completes; with `transmitFailed: false`, the loop continues to subsequent iterations. `finally:` always runs regardless.

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
- `failOnMaxReached` — if `true`, the task fails when `maxIterations` or `maxDuration` is reached without the condition becoming true. Default: `false` (the task succeeds when limits are reached).

After the loop completes, `outputs.<task_id>.iterationCount` holds the total number of iterations (1-based). Use this in downstream tasks to report how many attempts were needed.

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

`AllowFailure` lets child tasks fail without failing the overall execution. If any child task fails:
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

For more details, refer to the [AllowFailure Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.allowfailure).

### Fail

`Fail` explicitly fails the execution, optionally guarded by a `condition` expression. Without a condition, it is useful inside a `Switch` branch to reject invalid cases.

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

With a condition, it can validate inputs before any work begins.

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

`Subflow` starts a child execution of another flow, letting you decompose complex workflows, share reusable logic across namespaces, and monitor each execution independently.

Required properties are `namespace` and `flowId`. Pass values to the subflow via `inputs` — those inputs must be declared in the subflow's definition.

By default (`wait: true`), the parent execution waits for the subflow to finish before continuing. Set `wait: false` to fire-and-forget; the parent moves on immediately without tracking the child's result.

When `wait: true`, the parent captures the subflow's final state and outputs:

- `{{ outputs.subflow_task.executionId }}` — the child execution ID
- `{{ outputs.subflow_task.state }}` — the child's final state (`SUCCESS`, `FAILED`, etc.)
- `{{ outputs.subflow_task.outputs.some_key }}` — a value from the subflow's declared outputs

`transmitFailed: true` (the default when `wait: true`) causes the parent to fail if the subflow fails. Set it to `false` to continue the parent regardless of the child's outcome.

```yaml
id: parent_flow
namespace: company.team

tasks:
  - id: call_subflow
    type: io.kestra.plugin.core.flow.Subflow
    namespace: company.team
    flowId: my_subflow
    inputs:
      user: "{{ inputs.username }}"
    wait: true
    transmitFailed: true

  - id: use_output
    type: io.kestra.plugin.core.log.Log
    message: "Subflow returned: {{ outputs.call_subflow.outputs.result }}"
```

Use `revision` to pin the subflow to a specific version. Use `inheritLabels: true` to forward the parent's execution labels to the child. Use `scheduleDate` to defer the child execution to a future time instead of starting it immediately.

For more details, refer to the [Subflow Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.subflow).

### WorkingDirectory

`WorkingDirectory` runs all nested tasks sequentially in the same directory on the same worker, so downstream tasks can read files written by earlier ones. It is useful for compute-intensive file system operations.

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

For more details, refer to the [WorkingDirectory Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.workingdirectory).

### Pause

`Pause` halts the execution until it is manually resumed or a timeout expires. Tasks declared after the `Pause` in the flow run once the execution resumes.

To resume manually, open the **Gantt** tab on the execution, click the Pause task, select **Change status**, and choose **Mark as RUNNING**. You can also resume via the API: `POST /api/v1/executions/{executionId}/resume`.

```yaml
id: pause_for_approval
namespace: company.team

tasks:
  - id: before
    type: io.kestra.plugin.core.log.Log
    message: "Waiting for manual approval"

  - id: approval
    type: io.kestra.plugin.core.flow.Pause

  - id: after
    type: io.kestra.plugin.core.log.Log
    message: "Approved — continuing execution"
```

Use `pauseDuration` to resume automatically after a fixed interval (ISO 8601 duration format). The `behavior` property controls what happens when that duration expires without a manual resume: `RESUME` continues (the default), `WARN` continues with a warning, `CANCEL` cancels the execution, or `FAIL` fails the task.

```yaml
tasks:
  - id: wait
    type: io.kestra.plugin.core.flow.Pause
    pauseDuration: PT5M
    behavior: WARN
```

Use `onResume` to collect structured input from the person approving the pause. Downstream tasks access those values via `{{ outputs.<pause_task_id>.onResume.<input_id> }}`.

```yaml
tasks:
  - id: wait_for_approval
    type: io.kestra.plugin.core.flow.Pause
    onResume:
      - id: approved
        description: Approve or reject
        type: BOOL
        defaults: true
      - id: reason
        description: Reason for decision
        type: STRING

  - id: log_decision
    type: io.kestra.plugin.core.log.Log
    message: "Decision: {{ outputs.wait_for_approval.onResume.approved }} — {{ outputs.wait_for_approval.onResume.reason }}"
```

For more details, refer to the [Pause Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.pause).

### DAG

`DAG` lets you declare tasks and their `dependsOn` links; Kestra derives execution order and runs tasks in parallel as their dependencies are satisfied. Use it when your dependency graph cannot be expressed as a flat sequence or a single `Parallel` block — for example, when task C depends on both A and B, but A and B are independent.

Tasks with no `dependsOn` start immediately. The `concurrent` property caps how many tasks run at once (`0` = no limit, the default).

Note: UI no-code forms are not available for DAG tasks — configure them in YAML or the code editor.

```yaml
id: dag_flow
namespace: company.team

tasks:
  - id: dag
    type: io.kestra.plugin.core.flow.Dag
    tasks:
      - task:
          id: task1
          type: io.kestra.plugin.core.log.Log
          message: task 1
      - task:
          id: task2
          type: io.kestra.plugin.core.log.Log
          message: task 2 (depends on task1)
        dependsOn:
          - task1
      - task:
          id: task3
          type: io.kestra.plugin.core.log.Log
          message: task 3 (depends on task1)
        dependsOn:
          - task1
      - task:
          id: task4
          type: io.kestra.plugin.core.log.Log
          message: task 4 (depends on task2 and task3)
        dependsOn:
          - task2
          - task3
```

In this example, `task2` and `task3` run in parallel after `task1` completes, and `task4` starts once both finish.

For more details, refer to the [DAG Task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.dag).
