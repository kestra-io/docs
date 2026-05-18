---
title: "Loop Task Best Practices in Kestra"
h1: "Best Practices for the Loop Task"
sidebarTitle: Loop
icon: /src/contents/docs/icons/best-practices.svg
description: Best practices for using the Loop task in Kestra — output collection, concurrency, error handling, large-file processing, and subflow isolation patterns.
---

Use `Loop` for all iteration needs in Kestra.

## Choose the right iteration pattern

`Loop` runs child tasks for each item in a list, map, file, or URI list. Every iteration is an isolated sub-execution.

Use a plain `Loop` when:

- You need to run the same tasks for each item in a list or dataset.
- Each iteration should process one value, one object, or one file chunk.
- You want parallel iteration with controlled concurrency.
- You want per-iteration failure handling without stopping the entire loop.

Use `Loop` + `Subflow` when:

- You need full execution isolation per batch — own retries, own logs, own failure state.
- Each batch should be independently restartable.

## Access the iteration value

Inside a Loop, use `item.value` for the current value and `item.index` for the zero-based position. These are available in every child task, including those nested inside `If`, `Parallel`, or other flowable tasks — no parent traversal needed.

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: ["north", "south", "west"]
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "region={{ item.value }} index={{ item.index }}"
```

When iterating over JSON objects, `item.value` is a JSON string. Use `fromJson(item.value).field` to access properties — `item.value.field` does not work.

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values:
      - {"id": 101, "email": "a@example.com"}
      - {"id": 102, "email": "b@example.com"}
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: "User {{ fromJson(item.value).id }} -> {{ fromJson(item.value).email }}"
```

## Expose outputs explicitly

Task outputs inside a loop are not visible outside it by default. Declare an `outputs:` block on the Loop task to surface values. Choose `fetchType` based on data volume:

- `AUTO` — default, switches automatically based on whether `values` is a URI
- `FETCH` — collects all iteration results inline (suitable for small iteration counts)
- `STORE` — writes results to internal storage and exposes a URI (preferred for large iteration counts)

After the loop:
- `outputs.<loop_id>.outputs` is a list of per-iteration results
- `outputs.<loop_id>.outputs[n].outputs.<output_id>` accesses a specific iteration by index
- `loopOutputs(outputs.<loop_id>.outputs, '<output_id>')` extracts one field across all iterations as a flat list

### Example: collect outputs and read them downstream

```yaml
id: loop_outputs
namespace: company.team

tasks:
  - id: enrich_regions
    type: io.kestra.plugin.core.flow.Loop
    values: ["north", "south", "west"]
    concurrencyLimit: 2
    fetchType: AUTO
    outputs:
      - id: bucket
        type: STRING
        value: "landing-{{ item.value }}"
      - id: message
        type: STRING
        value: "{{ outputs.build_message.value }}"
    tasks:
      - id: build_message
        type: io.kestra.plugin.core.debug.Return
        format: "Load {{ item.value }} into landing-{{ item.value }}"

  - id: log_first
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.enrich_regions.outputs[0].outputs.message }}"

  - id: log_all
    type: io.kestra.plugin.core.log.Log
    message: "{{ loopOutputs(outputs.enrich_regions.outputs, 'message') }}"
```

Inside the loop, sibling task outputs are accessed with plain `outputs.task_id.attribute` syntax — each iteration runs in its own isolated context, so there is no ambiguity.

## Use `concurrencyLimit` deliberately

- `1` (default) — sequential execution
- A positive integer — bounded parallelism; prefer this for heavy workloads
- `0` — unlimited; all iterations run simultaneously; avoid for large datasets without understanding resource implications

## Process large files with Split and Loop

For file-backed datasets, use `Split` to break the file into chunk URIs, then loop over the URI list. Each `item.value` is one chunk URI.

Passing `values: "{{ outputs.split.uris }}"` where `outputs.split.uris` is a **list** is different from passing a single file URI string. A list iterates over elements; a single URI string iterates line-by-line through that file.

```yaml
tasks:
  - id: split
    type: io.kestra.plugin.core.storage.Split
    from: "{{ inputs.file }}"
    rows: 100

  - id: per_chunk
    type: io.kestra.plugin.core.flow.Loop
    values: "{{ outputs.split.uris }}"
    concurrencyLimit: 4
    fetchType: FETCH
    outputs:
      - id: result_uri
        type: STRING
        value: "{{ outputs.process.value }}"
    tasks:
      - id: process
        type: io.kestra.plugin.core.debug.Return
        format: "processed chunk {{ item.index }}: {{ item.value }}"

  - id: summary
    type: io.kestra.plugin.core.log.Log
    message: "{{ loopOutputs(outputs.per_chunk.outputs, 'result_uri') }}"
```

## Handle per-iteration failures

Set `transmitFailed: false` to continue the loop when individual iterations fail. Use `errors:` to run tasks per failed iteration, and `finally:` for a one-time cleanup block after all iterations finish. `errors:` requires `transmitFailed: false`; `finally:` always runs regardless.

```yaml
tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: ["ok", "boom", "ok"]
    transmitFailed: false
    tasks:
      - id: maybe_fail
        type: io.kestra.plugin.scripts.shell.Commands
        commands:
          - |
            if [ "{{ item.value }}" = "boom" ]; then exit 1; fi
            echo "ok {{ item.value }}"
    errors:
      - id: handle_error
        type: io.kestra.plugin.core.log.Log
        message: "Iteration {{ item.index }} ({{ item.value }}) failed"
    finally:
      - id: cleanup
        type: io.kestra.plugin.core.log.Log
        message: "Loop finished (with or without failures)"
```

## Use Loop + Subflow for isolated per-batch execution

When each batch needs its own execution — independent retries, logs, and failure ownership — pair `Loop` with `Subflow`. The parent splits the data and fans out; the child flow receives one chunk URI per invocation and returns its result as a flow-level output.

```yaml
# Parent flow
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

## Compose Loop with supporting tasks

`Loop` iterates. These tasks handle the rest — batching, transforming, stitching, and reducing. Each does one thing well; combine them around `Loop` to build larger pipelines.

| Task | Role | When to reach for it |
|---|---|---|
| `io.kestra.plugin.core.storage.Split` | Batching | Split a single file into chunk URIs by `rows`, `bytes`, `partitions`, or `separator`. Feeds `Loop.values` for map-reduce. |
| `io.kestra.plugin.core.storage.Concat` | Stitching | Concatenate per-iteration output files into one before a reduce step. |
| `io.kestra.plugin.transform.Aggregate` | Reduce | Group records by one or more keys with `count()`, `sum()`, `max()`, and more. The reduce side of map-reduce. |
| `io.kestra.plugin.transform.Filter` | Predicate | Keep only rows where a boolean expression holds. |
| `io.kestra.plugin.transform.Map` | Project | Per-record rename, drop, or compute fields — SQL `SELECT`-style. |
| `io.kestra.plugin.transform.Unnest` | Explode | Flatten an array field into one row per element, carrying sibling fields through. |
| `io.kestra.plugin.core.flow.Subflow` | Isolate | Spawn a separate execution per iteration — own retries, own logs, own failure state. The `ForEachItem` replacement. |
| `io.kestra.plugin.core.flow.Parallel` | Fan-out | Run independent task groups concurrently inside a single iteration. |

## Common mistakes to avoid

- Do not use `taskrun.value` or `taskrun.iteration` — use `item.value` and `item.index`.
- Do not access `item.value.field` directly on object values — use `fromJson(item.value).field`.
- Do not expect loop outputs to be visible downstream without declaring an `outputs:` block.
- Do not use `outputs.task_id[item.value]` inside a loop — sibling outputs are accessed with plain `outputs.task_id.attribute`.
- Do not set `concurrencyLimit: 0` on very large datasets without considering memory and worker capacity.

For more details, see the [Loop task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.loop) and the [Flowable Tasks reference](../../05.workflow-components/01.tasks/00.flowable-tasks/index.md#loop).
