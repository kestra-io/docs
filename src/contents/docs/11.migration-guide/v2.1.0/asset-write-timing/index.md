---
title: Assets Are Written While the Task Runs in Kestra 2.1
h1: Assets Are Written While the Task Runs
sidebarTitle: Asset Write Timing
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["EE", "Cloud"]
description: In 2.1.0, Kestra writes assets while the task runs instead of when it ends, locks a task's declared outputs during each attempt, and restores them when the attempt fails. The execution API no longer returns assetEmits on task runs.
---

Kestra 2.1.0 writes [assets](../../../07.enterprise/02.governance/01.assets/index.md) during the task run instead of after it.

## What changed

| Before | Now |
|---|---|
| Declared outputs and emitted assets were written when the task ended. | Emitted assets are written when they're emitted. Declared outputs are written when the task starts, then again when it ends. |
| Two task runs could write the same declared output at the same time. | A task run locks its declared outputs until its attempt ends. Another task run that declares the same output gets the [failure behavior](../../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#failure-behavior) of its task, `WARNING` by default. |
| A failed task left its declared outputs unchanged. | During the run, a declared output has the status `pending` (new) or `updating` (existing). If the attempt fails, an existing asset is restored and a new one keeps the status `failed`. |
| Task runs in the execution API carried an `assetEmits` list. | The field is gone. Executions saved with it still load. |
| A trigger's `assets` block offered `assetFailureBehavior`. | Triggers accept the property but ignore it, since it only applies to a task run. |

See [While the task runs](../../../07.enterprise/02.governance/01.assets/01.declare-assets/index.md#while-the-task-runs) for the details.

## Who is affected

You need to act if any of these apply:

- Several tasks or flows declare the same asset in `assets.outputs` and can run at the same time, including parallel tasks of one execution. The task that runs second now ends in `WARNING`, or `FAILED` with `assetFailureBehavior: FAIL`, and doesn't write that asset.
- A dashboard query, an asset filter, or a flow selects assets whose `system.status` is `active`. An asset a task run is writing has the status `pending` or `updating` until the attempt ends.
- An API client or script reads `assetEmits` from the task runs of an execution.
- A plugin built for Kestra 2.0 sets the assets of the dynamic task runs it creates, as the dbt plugin does for each model. Built against 2.0, those assets are dropped on 2.1.

<!-- TODO(verify on merge): add the plugin-dbt version built for 2.1 once plugin-dbt#376 is released. -->

## What to do

- For outputs that several flows write concurrently, either let the later task end in `WARNING`, or serialize the flows, for example with the [`Acquire` and `Release` tasks](../../../07.enterprise/02.governance/01.assets/02.tasks-and-triggers/index.md#acquire-and-release).
- Include `pending` and `updating` in status filters that should also match assets being written, or exclude them on purpose.
- Read an execution's assets from the [asset relations](../asset-relations/index.md) of its task runs instead of `assetEmits`.
- Update plugins that emit assets for dynamic task runs, such as the dbt plugin, to their version built for Kestra 2.1.
