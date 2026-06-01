---
title: Task Runs in Kestra – Track Task Execution
h1: Monitor Task Run States, Attempts, and Outputs
description: Understand Task Runs in Kestra. Track the execution of individual tasks, monitor their states, attempts, and outputs within your workflow executions.
sidebarTitle: Task Runs
icon: /src/contents/docs/icons/flow.svg
docId: taskruns
---

A task run is a single execution of an individual task within an [Execution](../../03.execution/index.md), where an execution represents a run of the entire flow. One execution can therefore contain multiple task runs.

## Understand task runs

Each task run includes associated data such as:

- Execution ID
- State
- Start Date
- End Date

## Attempts

A task run can include one or more attempts. Most have only a single attempt, but you can configure [retries](../../12.retries/index.md) if needed.
When retries are enabled, a task failure triggers new attempts until the `maxAttempts` or `maxDuration` threshold is reached.

## States

Similar to executions, task runs can exist in different states.

| State | Description                                                                                                                                                                                                                                  |
| - |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `CREATED` | The task run is waiting to be processed, usually queued and not yet started.                                                                                                                                                                 |
| `SUBMITTED` | The task run has been submitted to a Worker but has not started running yet.                                                                                                                                                               |
| `RUNNING` | The execution or task run is currently being processed.                                                                                                                                                                                      |
| `SUCCESS` | The execution or task run has been completed successfully.                                                                                                                                                                                   |
| `WARNING` | The task run had issues but continued, flagged with a warning.                                                                                                                                                                               |
| `FAILED` | The task run encountered errors that caused the execution to fail.                                                                                                                                                                           |
| `RETRYING` | The execution or task run is currently being [retried](../../12.retries/index.md).                                                                                                                                                           |
| `RETRIED` | An execution or task run exhibited unintended behavior, stopped, and created a new execution as defined by its [flow-level retry policy](../../12.retries/index.md#flow-level-retries). The policy was set to the `CREATE_NEW_EXECUTION` behavior. |
| `KILLING` | A kill command was issued and the system is terminating the task run.                                                                                                                                                                        |
| `KILLED` | An execution or task run was killed (upon request), and no more tasks will run.                                                                                                                                                              |

:::alert{type="info"}
For a detailed overview of how each task run transition through different states, see the [States](../../17.states/index.md#how-are-task-run-states-different-from-execution-states) page.
:::

## Expression

You can access information about the current task run using the `{{ taskrun }}` expression.

The following example outputs task run details using `{{ taskrun }}`:

```yaml
id: taskrun
namespace: company.team

tasks:
  - id: return
    type: io.kestra.plugin.core.debug.Return
    format: "{{ taskrun }}"
```

The logs show the following:

```json
{
    "id": "61TxwXQjkXfwTd4ANK6fhv",
    "startDate": "2024-11-13T14:38:38.355668Z",
    "attemptsCount": 0
}
```

## Loop iteration context

Inside a [Loop](../00.flowable-tasks/index.md#loop) task, each iteration runs as an isolated sub-execution. Use `{{ item.value }}` and `{{ item.index }}` to access the current iteration value and zero-based index from any task inside that sub-execution, including tasks nested inside `If`, `Parallel`, or other flowable tasks.

```yaml
id: loop
namespace: company.team

tasks:
  - id: loop
    type: io.kestra.plugin.core.flow.Loop
    values: [1, 2, 3]
    tasks:
      - id: log
        type: io.kestra.plugin.core.log.Log
        message: |
          value={{ item.value }}
          index={{ item.index }}
          taskrun.id={{ taskrun.id }}
          taskrun.startDate={{ taskrun.startDate }}
          taskrun.attemptsCount={{ taskrun.attemptsCount }}
          taskrun.parentId={{ taskrun.parentId }}
```

For nested loops, `{{ item.parent.value }}` accesses the immediate enclosing loop's value, and `{{ item.parents[n].value }}` accesses deeper ancestors (`[0]` = immediate parent, `[1]` = grandparent, and so on).

See [Loop iteration context](../../../expressions/01.context/index.mdx#loop-iteration-context) in the expressions reference for the full `item` variable table.

:::collapse{title="Task Run JSON Object Example"}
```json
{
  "id": "5cBZ1JF8kim8fbFg13bumX",
  "executionId": "6s1egIkxu3gpzzILDnyxTn",
  "namespace": "io.kestra.tests",
  "flowId": "each-sequential-nested",
  "taskId": "1-1_return",
  "parentTaskRunId": "5ABxhOwhpd2X8DtwUPKERJ",
  "value": "s1",
  "attempts": [
    {
      "metrics": [
        {
          "name": "length",
          "tags": {
            "format": "{{task.id}} > {{taskrun.value}} ⬅ {{taskrun.startDate}}"
          },
          "value": 45.0,
          "type": "counter"
        },
        {
          "name": "duration",
          "tags": {
            "format": "{{task.id}} > {{taskrun.value}} ⬅ {{taskrun.startDate}}"
          },
          "type": "timer",
          "value": "PT0.007213673S"
        }
      ],
      "state": {
        "current": "SUCCESS",
        "histories": [
          {
            "state": "CREATED",
            "date": "2025-05-04T12:02:54.121836Z"
          },
          {
            "state": "RUNNING",
            "date": "2025-05-04T12:02:54.121841Z"
          },
          {
            "state": "SUCCESS",
            "date": "2025-05-04T12:02:54.131892Z"
          }
        ],
        "duration": "PT0.010056S",
        "endDate": "2025-05-04T12:02:54.131892Z",
        "startDate": "2025-05-04T12:02:54.121836Z"
      }
    }
  ],
  "outputs": {
    "value": "1-1_return > s1 ⬅ 2025-05-04T12:02:53.938333Z"
  },
  "state": {
    "current": "SUCCESS",
    "histories": [
      {
        "state": "CREATED",
        "date": "2025-05-04T12:02:53.938333Z"
      },
      {
        "state": "RUNNING",
        "date": "2025-05-04T12:02:54.116336Z"
      },
      {
        "state": "SUCCESS",
        "date": "2025-05-04T12:02:54.144135Z"
      }
    ],
    "duration": "PT0.205802S",
    "endDate": "2025-05-04T12:02:54.144135Z",
    "startDate": "2025-05-04T12:02:53.938333Z"
  }
}
```
:::
