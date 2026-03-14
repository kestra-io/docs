---
title: Best Practices for ForEach and ForEachItem
sidebarTitle: ForEach vs ForEachItem
icon: /src/contents/docs/icons/best-practices.svg
description: Learn when to use ForEach or ForEachItem in Kestra, how they scale differently, and how to access their outputs correctly in downstream tasks.
---

Use `ForEach` and `ForEachItem` for different scaling and orchestration patterns.

## Choose the right loop primitive

Both tasks iterate over multiple items, but they do it in different ways:

- `ForEach` creates child task runs inside the same execution.
- `ForEachItem` creates one subflow execution per batch of items.

That design difference affects performance, restart behavior, and how you access outputs.

## Decision guide

Use `ForEach` when:

- You already have a small list in memory, such as an input, a small JSON array, or a small fetched result.
- The work for each item is lightweight.
- You want to share outputs between sibling tasks inside the loop.
- You want a simple loop without introducing a subflow.

Use `ForEachItem` when:

- You need to process a large dataset or file.
- You want to split data into batches and scale processing through subflows.
- You need better isolation, troubleshooting, and restart behavior for individual batches.
- The data already lives in Kestra internal storage, or can be written there first.

:::alert{type="warning"}
`ForEach` can generate many task runs in a single execution. For large fan-out or nested loops, prefer `ForEachItem` or a `Subflow`-based design to avoid oversized execution contexts and slower orchestration.
:::

:::alert{type="info"}
`ForEachItem` expects `items` to be a Kestra internal storage URI, for example `{{ outputs.extract.uri }}` or a `FILE` input. If your source data is a regular JSON array, Excel file, Parquet file, or another non line-oriented format, convert it first.
:::

## Understand the main difference

`ForEach` iterates over a list of values and exposes:

- `{{ taskrun.value }}` for the current value
- `{{ taskrun.iteration }}` for the zero-based loop index

`ForEachItem` iterates over batches of file-backed items and exposes:

- `{{ taskrun.items }}` for the current batch file URI
- `{{ taskrun.iteration }}` for the zero-based batch index

In practice:

- `ForEach` is best when the iteration value itself is the thing you want to work with.
- `ForEachItem` is best when each iteration should receive a file or batch and hand it off to a subflow.

## Best practices for `ForEach`

- Keep the `values` list small to moderate in size.
- Use `concurrencyLimit` deliberately rather than leaving fan-out unbounded.
- If each iteration needs multiple tasks in parallel, put a `Parallel` task inside the loop instead of expecting child tasks to run concurrently by default.
- If iterating over JSON objects, remember that `taskrun.value` is a JSON string. Use `fromJson(taskrun.value)` to access properties.
- When referencing outputs from sibling tasks inside the same loop iteration, use `outputs.task_id[taskrun.value]`.

### Example: use sibling outputs correctly inside `ForEach`

```yaml
id: foreach_outputs
namespace: company.team

tasks:
  - id: enrich_regions
    type: io.kestra.plugin.core.flow.ForEach
    values: ["north", "south", "west"]
    concurrencyLimit: 2
    tasks:
      - id: metadata
        type: io.kestra.plugin.core.output.OutputValues
        values:
          region: "{{ taskrun.value }}"
          bucket: "landing-{{ taskrun.value }}"

      - id: build_message
        type: io.kestra.plugin.core.debug.Return
        format: "Load {{ outputs.metadata[taskrun.value].values.region }} into {{ outputs.metadata[taskrun.value].values.bucket }}"

  - id: log_one_result
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.build_message['north'].value }}"
```

Why this pattern works:

- Inside the loop, `outputs.metadata[taskrun.value]` reads the output from the current iteration.
- Outside the loop, `outputs.build_message['north'].value` reads the output for one specific loop value.

### Example: iterate over JSON objects safely

```yaml
id: foreach_json
namespace: company.team

tasks:
  - id: process_users
    type: io.kestra.plugin.core.flow.ForEach
    values:
      - {"id": 101, "email": "a@example.com"}
      - {"id": 102, "email": "b@example.com"}
    tasks:
      - id: log_user
        type: io.kestra.plugin.core.log.Log
        message: "User {{ fromJson(taskrun.value).id }} -> {{ fromJson(taskrun.value).email }}"
```

## Best practices for `ForEachItem`

- Store the dataset in internal storage first and pass its URI to `items`.
- Batch by `rows`, `partitions`, or `bytes` based on how the downstream subflow processes data.
- Design the subflow so it can be rerun independently for one batch.
- Prefer passing `taskrun.items` to a `FILE` input in the subflow.
- If the parent flow must depend on child results, keep `wait: true`.
- If a child failure should fail the parent task, keep `transmitFailed: true`.

### Example: process a file in batches with `ForEachItem`

This pattern is recommended when each batch should run in its own execution.

```yaml
id: parent_foreachitem
namespace: company.team

tasks:
  - id: extract
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      SELECT *
      FROM read_csv_auto('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv', header=true);
    store: true

  - id: process_batches
    type: io.kestra.plugin.core.flow.ForEachItem
    items: "{{ outputs.extract.uri }}"
    batch:
      rows: 100
    namespace: company.team
    flowId: process_order_batch
    wait: true
    transmitFailed: true
    inputs:
      orders_file: "{{ taskrun.items }}"

  - id: log_batch_stats
    type: io.kestra.plugin.core.log.Log
    message: "Batches={{ outputs.process_batches.numberOfBatches }}, success={{ outputs.process_batches.iterations.SUCCESS ?? 0 }}"
```

And the subflow:

```yaml
id: process_order_batch
namespace: company.team

inputs:
  - id: orders_file
    type: FILE

tasks:
  - id: inspect_batch
    type: io.kestra.plugin.core.log.Log
    message: "{{ read(inputs.orders_file) }}"

outputs:
  - id: batch_file
    type: FILE
    value: "{{ inputs.orders_file }}"
```

## Use `ForEachItem` outputs correctly

`ForEachItem` exposes useful parent-task outputs:

- `{{ outputs.task_id.numberOfBatches }}` gives the total number of batches.
- `{{ outputs.task_id.iterations.SUCCESS }}` shows how many child executions succeeded.
- `{{ outputs.task_id.uri }}` points to a file containing the merged outputs from the child subflows.

This is different from `ForEach`, where you typically access outputs by loop value, such as `outputs.inner['north'].value`.

### Example: consume merged subflow outputs

If the subflow defines typed flow outputs, the parent `ForEachItem` task can expose them as a merged file through `{{ outputs.process_batches.uri }}`.

```yaml
id: parent_read_merged_outputs
namespace: company.team

tasks:
  - id: extract
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      SELECT *
      FROM read_csv_auto('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv', header=true);
    store: true

  - id: process_batches
    type: io.kestra.plugin.core.flow.ForEachItem
    items: "{{ outputs.extract.uri }}"
    batch:
      rows: 250
    namespace: company.team
    flowId: process_order_batch
    wait: true
    transmitFailed: true
    inputs:
      orders_file: "{{ taskrun.items }}"

  - id: log_merged_outputs_uri
    type: io.kestra.plugin.core.log.Log
    message: "{{ outputs.process_batches.uri }}"
```

Use that URI when a downstream task needs the collected outputs from all child subflows.

## Common mistakes to avoid

- Do not use `ForEach` for very large datasets just because the input started as a JSON array.
- Do not pass a non-storage path or raw inline content to `ForEachItem.items`; it must be a Kestra internal storage URI.
- Do not assume sibling task outputs in `ForEach` use the plain `outputs.task_id.value` syntax; inside the loop, use `outputs.task_id[taskrun.value]`.
- Do not expect `ForEach` child tasks to run in parallel unless you either set loop concurrency or add a `Parallel` task inside the loop.
- Do not forget that `taskrun.iteration` starts at `0` for both `ForEach` and `ForEachItem`.

## Recommended rule of thumb

Use `ForEach` for orchestration over a relatively small list of values.

Use `ForEachItem` for data processing over file-backed items or batches, especially when you need scale, restartability, or subflow isolation.

For API details, see the [ForEach plugin documentation](/plugins/core/tasks/flow/io.kestra.plugin.core.flow.foreach), the [ForEachItem plugin documentation](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.ForEachItem), and the [Outputs documentation](../../05.workflow-components/06.outputs/index.md).
