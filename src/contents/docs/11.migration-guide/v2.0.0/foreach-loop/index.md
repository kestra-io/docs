---
title: ForEach and ForEachItem Replaced by Loop
sidebarTitle: ForEach Replaced by Loop
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: ForEach and ForEachItem are removed in Kestra 2.0. The Loop task replaces both with isolated sub-executions per iteration, safer expression syntax, and built-in output collection.
---

`ForEach` and `ForEachItem` are removed in Kestra 2.0. The `Loop` task replaces both.

:::alert{type="warning"}
Flows that still reference `io.kestra.plugin.core.flow.ForEach` or `io.kestra.plugin.core.flow.ForEachItem` will fail to parse after upgrading to 2.0.0. Complete this migration before upgrading.
:::

This guide covers both migrations. If your flows use `ForEach`, follow the [Migrating `ForEach`](#migrating-foreach) section. If your flows use `ForEachItem`, follow the [Migrating `ForEachItem`](#migrating-foreachitem) section. Both must be complete before you upgrade.

## Why the change

`ForEach` ran all iterations as task runs inside the **same execution**. A flow iterating over a large dataset — thousands of files, rows, or API results — could generate tens of thousands of task runs in a single execution. That volume would exhaust executor memory and could bring down the entire Kestra instance. The failure was not isolated to the flow that caused it; it affected every other flow running at the same time.

`ForEachItem` addressed this by dispatching each batch to a separate subflow execution, which kept the task run count manageable. But it required splitting your logic into a separate flow, passing data through inputs and outputs across a flow boundary, and managing the lifecycle of subflow executions. For simple per-item processing, this overhead was hard to justify.

`Loop` fixes the stability problem and simplifies the model. Each iteration runs as an **isolated sub-execution**, so no single flow can generate unbounded task runs in one execution. The child tasks live inline — no separate flow required — and each iteration's failure is contained. A badly-sized loop degrades gracefully rather than destabilizing the instance.

The expression syntax also improves. In `ForEach`, accessing the current value from inside a nested flowable required `parent.taskrun.value` or `parents[0].taskrun.value`. In `Loop`, `item` is bound to the sub-execution itself, so all tasks — including those inside nested `If`, `Parallel`, or other flowables — access it as `item.value` with no parent traversal required.

## Expression quick reference

The table below maps every `ForEach` expression to its `Loop` equivalent. The sections that follow show complete before-and-after examples for each pattern.

| ForEach expression | Loop equivalent | Notes |
|---|---|---|
| `taskrun.value` | `item.value` | |
| `taskrun.iteration` | `item.index` | Zero-based in both |
| `parent.taskrun.value` | `item.value` | No prefix needed inside nested flowables |
| `parents[0].taskrun.value` | `item.parent.value` | Inside the inner of two nested loops |
| `parents[1].taskrun.value` | `item.parents[0].value` | One level further up |
| `outputs.task_id[taskrun.value].value` | `outputs.task_id.value` | Inside the iteration; task outputs are scoped to the current sub-execution |
| `outputs.foreach_id[value].field` (after the loop) | `outputs.loop_id.outputs['value'].output_id` (after the loop) | Outside the loop; collected outputs are keyed by iteration value string |

## Migrating `ForEach`

For most flows, the `ForEach` migration has three parts: replace the task type, update expressions inside child tasks, and update any post-loop output access. The sections below cover each pattern with before-and-after examples.

### Basic iteration

Replace `io.kestra.plugin.core.flow.ForEach` with `io.kestra.plugin.core.flow.Loop`. Inside child tasks, replace `{{ taskrun.value }}` with `{{ item.value }}` and `{{ taskrun.iteration }}` with `{{ item.index }}`.

**Before**

```yaml
tasks:
  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    values: ["value 1", "value 2", "value 3"]
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "value={{ taskrun.value }}"
```

**After**

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: ["value 1", "value 2", "value 3"]
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "index={{ item.index }} value={{ item.value }}"
```

### Nested flowables

In `ForEach`, tasks inside a nested `If` or `Parallel` had to traverse up to the ForEach task run with `parent.taskrun.value` or `parents[0].taskrun.value`. In `Loop`, `item` is bound to the sub-execution and is accessible directly from any depth — no traversal needed.

**Before**

```yaml
tasks:
  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    values: ["value 1", "value 2", "value 3"]
    tasks:
      - id: check
        type: io.kestra.plugin.core.flow.If
        condition: '{{ taskrun.value == "value 2" }}'
        then:
          - id: matched
            type: io.kestra.plugin.core.log.Log
            message: "Matched at {{ parents[0].taskrun.value }}"
        else:
          - id: skipped
            type: io.kestra.plugin.core.log.Log
            message: "Skipped: {{ parents[0].taskrun.value }}"
```

**After**

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: ["value 1", "value 2", "value 3"]
    tasks:
      - id: check
        type: io.kestra.plugin.core.flow.If
        condition: '{{ item.value == "value 2" }}'
        then:
          - id: matched
            type: io.kestra.plugin.core.log.Log
            message: "Matched at index={{ item.index }}: {{ item.value }}"
        else:
          - id: skipped
            type: io.kestra.plugin.core.log.Log
            message: "Skipped: {{ item.value }}"
```

### Concurrent execution

The `concurrencyLimit` property carries over unchanged. Update only the task type and the expressions inside child tasks.

**Before**

```yaml
tasks:
  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    values: [1, 2, 3, 4, 5]
    concurrencyLimit: 3
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "Processing {{ taskrun.value }}"
```

**After**

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: [1, 2, 3, 4, 5]
    concurrencyLimit: 3
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "Processing {{ item.value }} (index={{ item.index }})"
```

### Nested loops

Nested loops work the same structurally. The change is how you reference outer loop values: `item.parent.value` replaces `parents[0].taskrun.value`, and for deeper hierarchies `item.parents[n]` replaces `parents[n+1].taskrun.value`.

**Before**

```yaml
tasks:
  - id: outer
    type: io.kestra.plugin.core.flow.ForEach
    values: [1, 2, 3]
    tasks:
      - id: inner
        type: io.kestra.plugin.core.flow.ForEach
        values: ["a", "b"]
        tasks:
          - id: log
            type: io.kestra.plugin.core.log.Log
            message: "outer={{ parents[0].taskrun.value }} inner={{ taskrun.value }}"
```

**After**

```yaml
tasks:
  - id: outer
    type: io.kestra.plugin.core.flow.Loop
    values: [1, 2, 3]
    tasks:
      - id: inner
        type: io.kestra.plugin.core.flow.Loop
        values: ["a", "b"]
        tasks:
          - id: log
            type: io.kestra.plugin.core.log.Log
            message: "outer={{ item.parent.value }} inner={{ item.value }}"
```

### Failure handling

`ForEach` required wrapping tasks in `AllowFailure` to continue past failures. `Loop` replaces this with a first-class `transmitFailed` property. Set `transmitFailed: false` on the Loop task and remove the `AllowFailure` wrapper entirely.

**Before**

```yaml
tasks:
  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    values: ["ok", "fail", "ok"]
    tasks:
      - id: guard
        type: io.kestra.plugin.core.flow.AllowFailure
        tasks:
          - id: maybe_fail
            type: io.kestra.plugin.core.flow.If
            condition: '{{ taskrun.value == "fail" }}'
            then:
              - id: do_fail
                type: io.kestra.plugin.core.execution.Fail
            else:
              - id: success
                type: io.kestra.plugin.core.log.Log
                message: "OK: {{ taskrun.value }}"
```

**After**

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

### Iterating over a map

`Loop` adds native support for map values — `ForEach` had no equivalent. If your flows previously worked around this limitation by serializing maps or splitting keys and values, you can simplify them. When `values` is a map, `item.key` holds the key and `item.value` holds the associated value.

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values:
      dev: http://dev.example.com
      staging: http://staging.example.com
      prod: http://prod.example.com
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "env={{ item.key }} url={{ item.value }}"
```

### Outputs

In `ForEach`, task outputs from all iterations were automatically merged into a single map in the parent execution, keyed by `taskrun.value`. Any task after the loop could access `outputs.task_id[value].field` without any extra configuration.

In `Loop`, each iteration runs in its own sub-execution. Task outputs inside an iteration are **not** visible outside the loop by default. You must explicitly declare which values to expose using the `outputs` property on the Loop task. After the loop completes, the collected outputs are available as a map keyed by iteration value: `outputs.<loop_id>.outputs['<iteration_value>'].<output_id>`.

**Before**

```yaml
tasks:
  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    values: ["a", "b", "c"]
    tasks:
      - id: process
        type: io.kestra.plugin.core.debug.Return
        format: "processed {{ taskrun.value }}"

  - id: summary
    type: io.kestra.plugin.core.log.Log
    message: "Results: {{ outputs.process | jq('[.[].value]') }}"
```

**After**

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: ["a", "b", "c"]
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
    message: |
      Loop ran {{ outputs.loop.iterationCount }} iterations.
      All results: {{ outputs.loop.outputs | toJson }}
      Result for 'a': {{ outputs.loop.outputs['a'].result }}
```

## Migrating `ForEachItem`

`ForEachItem` dispatched each batch to a separate subflow execution. With `Loop`, you process each item inline — no separate flow required. When `values` is an internal storage URI, Kestra iterates over each line of the file and runs the child tasks for that line, with `item.value` holding the content of each line.

For flows that used `ForEachItem` with `batch.rows: 1`, the migration is a direct substitution: replace the `ForEachItem` block and its subflow with a single `Loop` task with inline tasks.

**Before**

```yaml
tasks:
  - id: each_item
    type: io.kestra.plugin.core.flow.ForEachItem
    items: "{{ inputs.file }}"
    batch:
      rows: 1
    wait: true
    namespace: company.team
    flowId: process_item
    inputs:
      item: "{{ taskrun.items }}"
```

**After**

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ inputs.file }}"
    tasks:
      - id: process
        type: io.kestra.plugin.core.log.Log
        message: "Processing: {{ item.value }}"
```

For flows that relied on batch sizes larger than 1, you will need to restructure: either reduce to single-item processing, or keep a `Subflow` task inside a `Loop` and handle batching within that subflow.

## Migration steps

1. Search all flows for `io.kestra.plugin.core.flow.ForEach` and replace the task type with `io.kestra.plugin.core.flow.Loop`.
2. Replace every `{{ taskrun.value }}` inside the loop with `{{ item.value }}`.
3. Replace every `{{ taskrun.iteration }}` inside the loop with `{{ item.index }}`.
4. Remove `parent.taskrun.value` and `parents[0].taskrun.value` references inside nested flowables — `{{ item.value }}` works directly at any nesting depth.
5. Update post-loop output access: declare `outputs` on the Loop task, then access collected results via `outputs.<loop_id>.outputs['<iteration_value>'].<output_id>`. The map is keyed by iteration value string.
6. Search all flows for `io.kestra.plugin.core.flow.ForEachItem` and migrate to `Loop` with a URI value as described above.
7. Validate each updated flow by saving it in the Kestra UI or via the API and confirming no parse errors.
