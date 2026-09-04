---
title: "Replay Executions in Kestra: Rerun from Any Task"
h1: Re-run Any Workflow Execution from a Chosen Task
description: Replay Kestra workflow executions from any chosen task run. Re-trigger failed or incomplete executions without starting from scratch for faster recovery.
sidebarTitle: Replay
icon: /src/contents/docs/icons/dev.svg
---

Replay re-runs a workflow execution from any chosen task — skipping tasks that already completed successfully. Use it to recover from failures without reprocessing upstream work, or to iterate on a specific task without re-running the full flow.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/RvNc3gLXMEs?si=sBuEo3yPfJvi4K48" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

To replay from a specific task, open the **Gantt** or **Logs** tab of any execution and use the three-dot menu on the task run. You can also replay a single execution or bulk-replay from the **Executions** page, with the option to use the latest flow revision.

## Example: fixing a failed task and replaying

Consider a flow that downloads a file and then validates its schema:

```yaml
id: replay_demo
namespace: company.team

tasks:
  - id: download
    type: io.kestra.plugin.core.http.Download
    uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv

  - id: validate
    type: io.kestra.plugin.core.execution.Assert
    errorMessage: "Schema validation failed — unexpected number of columns"
    conditions:
      - "{{ 8 >= 5 }}"

  - id: notify
    type: io.kestra.plugin.core.log.Log
    message: Validation passed, data is ready for processing.
```

Run the flow once with `8 == 5` as the condition — `download` succeeds, then `validate` fails because the assertion is always false.

Open the failed execution and go to the **Gantt** tab. Use the three-dot menu on `validate` to select **Fix with AI** or correct the condition yourself — change `8 == 5` to `8 >= 5` and save as a new revision. Then select **Replay** from the same menu.

![Gantt tab of a failed execution showing the three-dot menu on validate with Fix with AI and Replay options](./replay-task.png)

In the confirmation dialog, select **Latest flow revision** to use the revision containing your fix.

![Replay execution dialog showing revision options: Original flow revision, Latest flow revision, and Specific flow revision](./latest-revision.png)

The `download` task is skipped — Kestra reuses its output from the original execution. Only `validate` and `notify` run again. The **Attempt 2/2** label on `validate` confirms this is the replayed run.

![Gantt view of the replayed execution showing download skipped, validate with Attempt 2/2 succeeding, and notify running](./task-count.png)

The **Overview** tab shows the attempt number, the revision used, a `system.replay: true` label marking this as a replay, and a `system.correlationId` label linking back to the original execution.

![Overview tab showing Execution is Replayed badge, system.replay: true label, 2 revisions, 2 attempts, and a link to the original execution](./replay-execution-overview.png)
