---
title: Restarting an Execution on Another Revision Is Deprecated
h1: Replay Instead of Restarting an Execution on Another Flow Revision
sidebarTitle: Restart on Another Revision
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.1.0
editions: ["OSS", "EE"]
description: In 2.1.0, a restart always runs on the revision the execution already ran on. Restarting on another revision is deprecated in the API and will be removed in 2.2. Replay instead.
---

In Kestra 2.1.0, a restart always runs an execution again on the flow revision it already ran on. To run an execution again on another revision, [replay](../../../15.how-to-guides/replay/index.md) it instead.

## What changed

- The **Restart latest revision** button is removed from the **Executions** list. **Restart** on selected executions keeps each execution on its own revision.
- The restart dialog of an execution no longer sends a revision. Choosing a revision is only available when you replay.
- In the API, the parameters that restart on another revision still work but are deprecated, and will be removed in 2.2:

| Endpoint | Deprecated parameter |
|---|---|
| `POST /api/v1/{tenant}/executions/{executionId}/actions/restart` | `revision` |
| `POST /api/v1/{tenant}/executions/restart/by-ids` | `latestRevision` |
| `POST /api/v1/{tenant}/executions/restart/by-query` | `latestRevision` |

`kestractl executions restart --revision` calls the deprecated `revision` parameter.

## Who is affected

API clients, scripts, and `kestractl` commands that restart executions on another revision, and users who restarted executions from the **Executions** list with **Restart latest revision**.

## What to do

Replay the execution on the revision you want. In the UI, open the execution, select **Replay**, and pick **Latest flow revision** or **Specific flow revision**. In the API, call `POST /api/v1/{tenant}/executions/{executionId}/actions/replay` with the `revision` query parameter, and `taskRunId` to replay from a given task run.

When you replay from a task run on another revision, Kestra first checks that the revision is compatible with the results it reuses. See [Replay on another flow revision](../../../15.how-to-guides/replay/index.md#replay-on-another-flow-revision).
