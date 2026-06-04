---
title: Loop Over a List of Values
h1: Iterate Over Lists with the Loop Task
icon: /src/contents/docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Workflow Components
description: Learn how to iterate over a list of values in Kestra workflows using the Loop task, access iteration context, collect outputs, and run iterations in parallel.
---

Use the `Loop` task to iterate over a list of values and run tasks for each item. Each iteration runs as an isolated sub-execution with access to the current value via `item.value` and the zero-based index via `item.index`.

## Prerequisites

Before you begin:

- Deploy [Kestra](../../02.installation/index.mdx) in your preferred development environment.
- Ensure you have a [basic understanding of how to run Kestra flows.](../../03.tutorial/index.mdx)

## Basic iteration

The simplest use of `Loop` iterates over a static list and runs child tasks for each item. The example below makes an API call for each author in the list.

```yaml
id: loop_basic
namespace: company.team

tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: ["pynchon", "dostoyevsky", "hedayat"]
    tasks:
      - id: api
        type: io.kestra.plugin.core.http.Request
        uri: "https://openlibrary.org/search.json?author={{ item.value }}&sort=new"
```

Inside each iteration:
- `{{ item.value }}` — the current value from the list
- `{{ item.index }}` — the zero-based position (0, 1, 2, …)

After execution, the Gantt view shows a separate task group for each author.

When `values` contains objects, each `item.value` is a JSON string. Use `fromJson(item.value).field` to access fields — `item.value.field` does not work.

## Nested loops

To iterate over multiple dimensions, nest `Loop` tasks. The inner loop accesses the outer loop's value with `{{ item.parent.value }}`. For three or more levels, `{{ item.parents[1].value }}` is the grandparent — `item.parents[0]` is the same as `item.parent`.

```yaml
id: loop_nested
namespace: company.team

tasks:
  - id: outer
    type: io.kestra.plugin.core.flow.Loop
    values: ["bucket1", "bucket2"]
    tasks:
      - id: inner
        type: io.kestra.plugin.core.flow.Loop
        values: [2025, 2026]
        tasks:
          - id: log
            type: io.kestra.plugin.core.log.Log
            message: "bucket={{ item.parent.value }} year={{ item.value }}"
```

## Collect outputs across iterations

By default, outputs produced inside a loop are not visible to tasks that run after it. Declare an `outputs:` block on the Loop task to surface values explicitly. After the loop, `outputs.loop.outputs` is a list of per-iteration results. Use `loopOutputs()` to extract one field across all iterations as a flat list.

```yaml
id: loop_outputs
namespace: company.team

tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: ["alpha", "beta", "gamma"]
    fetchType: AUTO
    outputs:
      - id: label
        type: STRING
        value: "{{ outputs.process.value }}"
    tasks:
      - id: process
        type: io.kestra.plugin.core.debug.Return
        format: "processed {{ item.value }}"

  - id: read_outputs
    type: io.kestra.plugin.core.log.Log
    message: "All results: {{ loopOutputs(outputs.loop.outputs, 'label') }}"
```

## Run iterations in parallel

Set `concurrencyLimit` to a positive integer to cap how many iterations run at once. Setting it to `0` removes the cap entirely — only do this for small datasets where you understand the resource implications.

```yaml
id: loop_parallel
namespace: company.team

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

## Next steps

- For the full Loop property reference, see the [Loop task documentation](/plugins/core/flow/io.kestra.plugin.core.flow.loop).
- For output collection patterns, error handling, and map-reduce examples, see the [Flowable Tasks](../../05.workflow-components/01.tasks/00.flowable-tasks/index.md#loop) reference.
- For Loop best practices, see the [Loop best practices guide](../../14.best-practices/11.loop/index.md).
