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
| `parent.taskrun.value` | `item.value` | No prefix needed — `item` is accessible from any depth inside a Loop sub-execution, including inside `If` or `Parallel` |
| `parents[0].taskrun.value` | `item.parent.value` | Only when inside an inner of two nested Loops; when used inside a nested flowable (If, Parallel) within a single Loop, it maps to `item.value` instead |
| `parents[1].taskrun.value` | `item.parents[1].value` | One level further up |
| `outputs.task_id[taskrun.value].value` | `outputs.task_id.value` | Inside the iteration; task outputs are scoped to the current sub-execution |
| `outputs.foreach_id[value].field` (after the loop) | `outputs.loop_id.outputs[n].outputs.output_id` (by index) or `loopOutputs(outputs.loop_id.outputs, 'output_id')` (all values as a list) | Outside the loop; outputs are now a list — key-based access by value string is no longer supported |

## Pattern quick reference

The table below maps the common 1.0 iteration patterns to their 2.0 equivalents. The expression quick reference above covers the variable renames; this table covers the broader structural changes.

| 1.0 pattern | 2.0 replacement | What changed |
|---|---|---|
| `ForEach` | `Loop` | Same shape. Adds typed `outputs:`, `finally:`, and `item.parents[N]`. |
| `ForEach + If` | `Loop + If` | No change to the inner `If` task — update expressions only. |
| `ForEachItem` | `Loop + Subflow` | Isolation is now opt-in via `Subflow`. Same per-batch execution model, explicit instead of implicit. |
| `subflowOutputs` | `outputs: [{id, type, value}]` | Per-iteration outputs are declared, not auto-surfaced. |
| `taskrun.value` / `taskrun.iteration` | `item.value` / `item.index` | Variable rename only. |
| Built-in batch aggregation | `Concat + Aggregate` | Reduce is its own task — compose explicitly after the loop. |

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

### Iterating over object lists

If your `ForEach` flow iterated over a list of objects using `fromJson(taskrun.value).field`, the same pattern applies in `Loop` — only the variable name changes.

**Before**

```yaml
tasks:
  - id: for_each
    type: io.kestra.plugin.core.flow.ForEach
    values:
      - { id: 101, email: "a@example.com" }
      - { id: 102, email: "b@example.com" }
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "User {{ fromJson(taskrun.value).id }} -> {{ fromJson(taskrun.value).email }}"
```

**After**

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values:
      - { id: 101, email: "a@example.com" }
      - { id: 102, email: "b@example.com" }
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "User {{ fromJson(item.value).id }} -> {{ fromJson(item.value).email }}"
```

`item.value` is always a string when list elements are not plain strings. Never access `item.value.field` directly — use `fromJson(item.value).field`.

### Outputs

In `ForEach`, task outputs from all iterations were automatically merged into a single map in the parent execution, keyed by `taskrun.value`. Any task after the loop could access `outputs.task_id[value].field` without any extra configuration.

In `Loop`, each iteration runs in its own sub-execution. Task outputs inside an iteration are **not** visible outside the loop by default. You must explicitly declare which values to expose using the `outputs` property on the Loop task, and set `fetchType` to control how they are stored and accessed downstream:

| `fetchType` | Downstream access | When to use |
|---|---|---|
| `AUTO` | Default; uses `STORE` when `values` is a URI, `FETCH` otherwise | General use |
| `FETCH` | `outputs.<loop_id>.outputs` — in-memory list of all iterations | Small iteration counts |
| `STORE` | `outputs.<loop_id>.uri` — URI to a file in internal storage | Large iteration counts |

With `FETCH`, after the loop completes, `outputs.<loop_id>.outputs` is a list of iteration results — each entry has an `item` object (with `value`, `iteration`, and `key`) and an `outputs` map of the declared output values. Access a single iteration by index: `outputs.<loop_id>.outputs[n].outputs.<output_id>`. To extract one output across all iterations as a list, use the [`loopOutputs()` function](../../../expressions/04.functions/04.workflow/index.mdx#loopoutputs). With `STORE`, the results are written to internal storage and exposed as `outputs.<loop_id>.uri` — use this for loops with large iteration counts where loading everything into memory is not practical.

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
      All results: {{ loopOutputs(outputs.loop.outputs, 'result') }}
      First result: {{ outputs.loop.outputs[0].outputs.result }}
```

## Migrating `ForEachItem`

`ForEachItem` dispatched each batch to a separate subflow execution. `Loop` offers two migration paths depending on whether you need per-batch execution isolation.

### Inline processing

For flows that used `ForEachItem` with `batch.rows: 1`, the migration is a direct substitution: replace the `ForEachItem` block and its subflow with a single `Loop` task with inline tasks. When `values` is an internal storage URI, `Loop` iterates one line per iteration with `item.value` holding the line content.

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

### Isolated per-batch execution

If your `ForEachItem` flows relied on subflow-level isolation — separate retries, separate logs, and failure containment per batch — preserve that isolation with `Loop` + `Subflow`. Split the source file into chunk URIs first, then loop over the URIs and call the child flow per batch.

**Parent flow**

```yaml
tasks:
  - id: split
    type: io.kestra.plugin.core.storage.Split
    from: "{{ inputs.file }}"
    rows: 100

  - id: per_batch
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ outputs.split.uris }}"
    concurrencyLimit: 4
    fetchType: FETCH
    outputs:
      - id: result_uri
        type: STRING
        value: "{{ outputs.run_child.outputs.uri }}"
    tasks:
      - id: run_child
        type: io.kestra.plugin.core.flow.Subflow
        namespace: company.team
        flowId: process_batch
        wait: true
        transmitFailed: true
        inputs:
          batch_uri: "{{ item.value }}"

  - id: concat
    type: io.kestra.plugin.core.storage.Concat
    files: "{{ loopOutputs(outputs.per_batch.outputs, 'result_uri') }}"
    extension: .ion
```

**Child flow** (`process_batch`)

```yaml
inputs:
  - id: batch_uri
    type: STRING

tasks:
  - id: process
    type: io.kestra.plugin.core.debug.Return
    format: "{{ inputs.batch_uri }}"

outputs:
  - id: uri
    type: STRING
    value: "{{ outputs.process.value }}"
```

The child flow surfaces its result through a flow-level `outputs:` declaration. The parent collects all result URIs with `loopOutputs(outputs.per_batch.outputs, 'result_uri')` and passes them to `Concat`.

For flows that used `ForEachItem` with batch sizes larger than 1, set `rows` on the `Split` task to your batch size — each chunk URI passed to the child flow then contains that many rows.

## Migration steps

1. Search all flows for `io.kestra.plugin.core.flow.ForEach` and replace the task type with `io.kestra.plugin.core.flow.Loop`.
2. Replace every `{{ taskrun.value }}` inside the loop with `{{ item.value }}`.
3. Replace every `{{ taskrun.iteration }}` inside the loop with `{{ item.index }}`.
4. Remove `parent.taskrun.value` and `parents[0].taskrun.value` references inside nested flowables — `{{ item.value }}` works directly at any nesting depth.
5. Update post-loop output access: declare `outputs` on the Loop task and set `fetchType`. With `FETCH`, `outputs.<loop_id>.outputs` is an in-memory list of iteration results — access a single entry by index with `outputs.<loop_id>.outputs[n].outputs.<output_id>`, or extract one field across all iterations as a list with `{{ loopOutputs(outputs.<loop_id>.outputs, '<output_id>') }}`. With `STORE`, results are written to internal storage and exposed as `outputs.<loop_id>.uri`. See the [fetchType table](#outputs) in the Outputs section for all modes.
6. Search all flows for `io.kestra.plugin.core.flow.ForEachItem` and migrate to `Loop` with a URI value as described above.
7. Validate each updated flow by saving it in the Kestra UI or via the API and confirming no parse errors.
