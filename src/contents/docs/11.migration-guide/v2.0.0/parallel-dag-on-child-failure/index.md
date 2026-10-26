---
title: Parallel and Dag Interrupt Running Tasks When One Fails
h1: Keep Parallel and Dag Tasks Running After a Failure with onChildFailure
sidebarTitle: Parallel and Dag onChildFailure
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["OSS", "EE"]
description: Parallel and Dag tasks now interrupt their other running tasks when one task fails. Set onChildFailure to CONTINUE to keep the 1.x behavior.
---

`Parallel` and `Dag` tasks now interrupt their other running tasks when one task fails. The new `onChildFailure` property controls this behavior, and its default is `FAIL` on both tasks.

| Task | `onChildFailure` default |
|---|---|
| `io.kestra.plugin.core.flow.Parallel` | `FAIL` from 2.0.0 |
| `io.kestra.plugin.core.flow.Dag` | `CONTINUE` in 2.0.0 to 2.0.7, `FAIL` from 2.0.8 |

In 1.x, the other tasks kept running to completion after a failure.

## What changes after upgrading

When a task inside a `Parallel` or `Dag` fails with no retry left, and `onChildFailure` is `FAIL`:

- Tasks that are still running are interrupted and end in the `FAILED` state. This includes tasks nested at any depth, such as tasks inside a `Sequential` branch.
- Each interrupted task logs a warning that names the task that caused the interruption: `Task terminated because sibling task '<task_id>' failed`.
- The `Parallel` or `Dag` task itself ends in the `FAILED` state, and its `errors` and `finally` tasks run as before.

## Migration steps

1. Search your flows for tasks of type `io.kestra.plugin.core.flow.Parallel` and `io.kestra.plugin.core.flow.Dag`.
2. For each task that should let its other tasks finish after one fails, add `onChildFailure: CONTINUE`.
3. Check any existing `onChildFailure` values. The accepted values are `CONTINUE`, `CANCEL`, and `FAIL`. Replace `CANCELLED` with `CANCEL` and `FAILED` with `FAIL`.

**Before:** in 1.x, `extract_customers` kept running after `extract_orders` failed.

```yaml
id: parallel_flow
namespace: company.team

tasks:
  - id: parallel
    type: io.kestra.plugin.core.flow.Parallel
    tasks:
      - id: extract_orders
        type: io.kestra.plugin.core.execution.Fail

      - id: extract_customers
        type: io.kestra.plugin.core.flow.Sleep
        duration: PT1M
```

**After:** set `onChildFailure: CONTINUE` to keep the same behavior.

```yaml
id: parallel_flow
namespace: company.team

tasks:
  - id: parallel
    type: io.kestra.plugin.core.flow.Parallel
    onChildFailure: CONTINUE
    tasks:
      - id: extract_orders
        type: io.kestra.plugin.core.execution.Fail

      - id: extract_customers
        type: io.kestra.plugin.core.flow.Sleep
        duration: PT1M
```

With `onChildFailure: CONTINUE`, `extract_customers` runs for its full minute after `extract_orders` fails. Without it, Kestra interrupts `extract_customers` as soon as `extract_orders` fails.

The same property works on `Dag`:

```yaml
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

To set interrupted tasks to `CANCELLED` instead of `FAILED`, use `onChildFailure: CANCEL`.

:::alert{type="warning"}
Kestra saves a flow with an unrecognized `onChildFailure` value, such as `CANCELLED` or `FAILED`, without a validation error. When a task fails, the `Parallel` or `Dag` task fails with an error log and the other running tasks are not interrupted.
:::

## Related

- [Flowable tasks](../../../05.workflow-components/01.tasks/00.flowable-tasks/index.md)
- [Parallel task reference](/plugins/core/flow/io.kestra.plugin.core.flow.parallel)
- [Dag task reference](/plugins/core/flow/io.kestra.plugin.core.flow.dag)
