---
title: Dag onChildFailure Default Changed to FAIL
h1: Keep Dag Tasks Running After a Failure with onChildFailure
sidebarTitle: Dag onChildFailure Default
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["OSS", "EE"]
description: The onChildFailure property of io.kestra.plugin.core.flow.Dag now defaults to FAIL. When one task in a DAG fails, Kestra interrupts the other running tasks. Set onChildFailure to CONTINUE to keep the previous behavior.
---

The `onChildFailure` property of `io.kestra.plugin.core.flow.Dag` now defaults to `FAIL` instead of `CONTINUE`.

When a task inside a `Dag` fails with no retry left, Kestra now interrupts every other task in that `Dag` that is still running and sets it to `FAILED`. Before 2.1.0, those tasks kept running to completion.

## What changes after upgrading

A `Dag` task without an explicit `onChildFailure` value behaves as follows when one of its tasks fails:

- Tasks that are still running are interrupted and end in the `FAILED` state. This includes tasks nested at any depth, such as tasks inside a `Parallel` or `ForEach` within the `Dag`.
- Each interrupted task logs a warning that names the task that caused the interruption: `Task terminated because sibling task '<task_id>' failed`.
- The `Dag` task itself ends in the `FAILED` state, and its `errors` and `finally` tasks run as before.

`Parallel` already used `FAIL` as its default, so both tasks now handle a failure the same way.

## Migration steps

1. Search your flows for tasks of type `io.kestra.plugin.core.flow.Dag`.
2. For each `Dag` that should let its other tasks finish after one fails, add `onChildFailure: CONTINUE`.
3. Check any existing `onChildFailure` values on `Dag` and `Parallel` tasks. The accepted values are `CONTINUE`, `CANCEL`, and `FAIL`. Replace `CANCELLED` with `CANCEL` and `FAILED` with `FAIL`.

**Before:** in 2.0, tasks in the `Dag` kept running after a failure.

```yaml
id: dag_flow
namespace: company.team

tasks:
  - id: dag
    type: io.kestra.plugin.core.flow.Dag
    tasks:
      - task:
          id: extract_orders
          type: io.kestra.plugin.core.execution.Fail
      - task:
          id: extract_customers
          type: io.kestra.plugin.core.flow.Sleep
          duration: PT1M
```

**After:** set `onChildFailure: CONTINUE` to keep the same behavior.

```yaml
id: dag_flow
namespace: company.team

tasks:
  - id: dag
    type: io.kestra.plugin.core.flow.Dag
    onChildFailure: CONTINUE
    tasks:
      - task:
          id: extract_orders
          type: io.kestra.plugin.core.execution.Fail
      - task:
          id: extract_customers
          type: io.kestra.plugin.core.flow.Sleep
          duration: PT1M
```

With `onChildFailure: CONTINUE`, `extract_customers` runs for its full minute after `extract_orders` fails. Without it, Kestra interrupts `extract_customers` as soon as `extract_orders` fails.

To set interrupted tasks to `CANCELLED` instead of `FAILED`, use `onChildFailure: CANCEL`.

:::alert{type="warning"}
Kestra saves a flow with an unrecognized `onChildFailure` value, such as `CANCELLED` or `FAILED`, without a validation error. When a task in that `Dag` fails, the `Dag` task fails with an error log and the other running tasks are not interrupted.
:::

## Related

- [Flowable tasks](../../../05.workflow-components/01.tasks/00.flowable-tasks/index.md)
- [Dag task reference](/plugins/core/flow/io.kestra.plugin.core.flow.dag)
