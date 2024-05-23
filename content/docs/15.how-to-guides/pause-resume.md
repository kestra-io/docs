---
title: How to Use Pause and Resume in Kestra
icon: /docs/icons/tutorial.svg
---

Pause and Resume flows in Kestra.

## The use cases for pausing and resuming workflows

Here are common scenarios where the Pause and Resume feature is particularly useful:
1. **Output Validation**: you can pause a workflow to check the logs and view the generated outputs before processing downstream tasks.
2. **Manual Approval**: the execution can wait for manual approval, e.g. after validating that a file has been correctly uploaded to an external system.
3. **Human-in-the-loop**: you can pause a workflow execution to perform a human task before resuming the execution, e.g. to validate a trained machine learning model before deploying it to production.

## How to pause and resume a workflow

```yaml
id: pause_resume
namespace: dev

tasks:
  - id: pause
    type: io.kestra.plugin.core.flow.Pause

  - id: after_pause
    type: io.kestra.plugin.core.log.Log
    message: Execution has been resumed!
```

The `Pause` task will pause the execution and the `Log` task will run only once the workflow has been resumed.

## Pausing and resuming a workflow from the UI

Create and execute the above workflow. Once the execution is paused, you can inspect the current logs and outputs. Then, you can resume it from the UI by clicking on the `Resume` button in the `Overview` tab:

![pause_resume](/docs/how-to-guides/pause-resume/pause_resume.png)

## Bulk-resuming paused workflows

You can bulk-resume paused workflows from the `Executions` page by selecting the workflows you want to resume and clicking on the `Resume` button:

![pause_resume2](/docs/how-to-guides/pause-resume/pause_resume2.png)

This feature is useful when you have multiple paused workflows and want to resume them all at once.

::alert{type="warning"}
Make sure to select only workflows in the `PAUSED` state, as the `Resume` button will not work if you select workflows in other states.
::

