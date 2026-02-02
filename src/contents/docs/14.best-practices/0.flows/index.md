---
title: Flow Best Practices
sidebarTitle: Flow Best Practices
icon: /src/contents/docs/icons/best-practices.svg
description: Design Kestra flows for optimal performance and reliability by managing task count, data volume, and parallelism.
---

How to design your workflows for optimal performance.

## Design flows for performance and reliability

## Understanding what an execution is in Kestra

A flow execution in Kestra is an object that contains:
- All **TaskRuns** for that flow, each with:
  - Their attempts, including:
    - Metrics
    - State history
  - Their outputs
  - Their state history

Internally:
- Each TaskRun belongs to the same execution context, which holds all task data for the entire flow.
- The Kestra Executor reads each TaskRun’s status changes (typically three per task: **CREATED**, **RUNNING**, and **SUCCESS**).
- For each state transition, the Executor must:
  - Fetch the serialized flow execution context over the network.
  - Deserialize it, determine the next task(s), then reserialize the context.
  - Send the updated serialized context back over the network.

The larger the flow execution context, the longer the serialization process takes.
Depending on the internal queue and repository implementation, there may be a hard limit on the size of this context, since it’s stored as a single row or message (often around **1 MB**). To avoid hitting this limit, do not store large amounts of data inside the flow execution context.

## Tasks in the same execution

While a flow can contain many tasks, it’s not recommended to include a large number of tasks within a single execution.

A flow can contain either manually defined tasks or dynamically generated ones. While [ForEach](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.ForEach) and [ForEachItem](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.ForEachItem) are powerful for looping over results, they can easily create hundreds of TaskRuns if used on large datasets. For example, a nested loop of 20 × 20 tasks results in **400 TaskRuns**.

:::alert{type="warning"}
In our experience, flows with **over 100 tasks** tend to experience performance degradation and longer execution times.
:::

To avoid this, consider breaking the workflow into subflows using the [Subflow task](../../05.workflow-components/10.subflows/index.md). Since a `Subflow` task creates a new execution, its tasks are **isolated** and do not affect the parent flow’s performance.

## Managing output data volume

Some tasks allow you to fetch outputs from previous tasks and reuse them in subsequent ones.
While powerful, this feature **should not be used to transfer large amounts of data**.

For example, the [Query](/plugins/plugin-gcp/bigquery/io.kestra.plugin.gcp.bigquery.query) task in BigQuery has a `fetch` property that retrieves query results as an output attribute. If the query returns a large dataset, the result will be stored in the execution context — meaning it will be serialized and deserialized on each task state change, severely impacting performance.

This feature is best suited for small datasets, such as querying a few rows to feed into a [Switch](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.Switch) or [ForEach](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.ForEach) task.

:::alert{type="info"}
For large data volumes, use the `stores` property instead. Stored outputs are written to Kestra’s internal storage, and only the file URL is referenced in the execution context.
:::

Some plugins have outputs that include both a `value` and a `uri`. The `store` property for these plugins is set to `false` by default and should typically only be used with small data volumes. This property should be adjusted for larger data volumes to make file URIs available. 

When `store` is set to `false` or the default value, the output will include a `value`, which is accessible through a Pebble expression like `"{{ outputs.task.value }}"`. When `store` is set to `true`, `value` is not accessible but instead the file URI is accessible through a Pebble expression like `"{{ outputs.task.uri }}"`. `value` and `uri` are not available outputs at the same time. Trying to access `value` when `store: true` will cause an execution error.

## Parallel tasks

The [Parallel](/plugins/core/tasks/flows/io.kestra.plugin.core.flow.Parallel) task helps reduce overall flow duration by running multiple branches simultaneously.
By default, **all parallel tasks start at the same time**, unless you set the `concurrent` property. The only limit is the number of worker threads configured in your environment.

Be mindful of external system limits such as API rate restrictions or connection quotas — running too many parallel tasks may overload those systems.

## Task duration

By default, Kestra **does not limit task duration** unless explicitly stated in a task’s documentation. Long-running or infinite processes will continue indefinitely.

You can control task runtime for [Runnable Tasks](../../05.workflow-components/01.tasks/01.runnable-tasks/index.md) using the `timeout` property, which accepts [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) durations (e.g., `PT5M` for five minutes).
This helps prevent stalled executions and ensures resource efficiency.

## Flow trigger on state change

Kestra can automatically start a flow as soon as another flow completes. This makes it easy to create dependencies between flows, even when they are owned by different teams. For example, a flow can trigger based on the `state` of another flow’s execution. There are multiple ways to configure this behavior, but one approach is recommended as a best practice.

Take the following two triggers polling one specific flow: one using `preconditions.flows.states` to define the required `states` and the other using the `states` property.

**Option 1**

```yaml
triggers:
  - id: release
    type: io.kestra.plugin.core.trigger.Flow
    preconditions:
      id: flows
      flows:
        - namespace: company.release
          flowId: parent
          states:
            - SUCCESS
```

or **Option 2**

```yaml
triggers:
  - id: release
    type: io.kestra.plugin.core.trigger.Flow
    states:
      - SUCCESS
    preconditions:
      id: flows
      flows:
        - namespace: company.release
          flowId: parent
```

While both configurations will work, **Option 1** is the recommended approach. It is more performant and declarative compared to **Option 2**, especially when working with flow triggers dependent on state.
