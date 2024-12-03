---
title: Pause and Resume Flows in Kestra
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - Kestra Concepts
---

How to Pause and Resume your flows.

## The use cases for pausing and resuming workflows

Here are common scenarios where the Pause and Resume feature is particularly useful:
1. **Output Validation**: you can pause a workflow to check the logs and view the generated outputs before processing downstream tasks.
2. **Manual Approval**: the execution can wait for manual approval, e.g. after validating that a file has been correctly uploaded to an external system.
3. **Human-in-the-loop**: you can pause a workflow execution to perform a human task before resuming the execution, e.g. to validate a trained machine learning model before deploying it to production.

## How to pause and resume a workflow

```yaml
id: pause_resume
namespace: company.team

tasks:
  - id: pause
    type: io.kestra.plugin.core.flow.Pause

  - id: after_pause
    type: io.kestra.plugin.core.log.Log
    message: Execution has been resumed!
```

The `Pause` task will pause the execution and the `Log` task will run only once the workflow has been resumed.

## Pausing and resuming a workflow from the UI

You can either use the Pause task or manually Pause from the Execution overview page. Once the execution is paused, you can inspect the current logs and outputs. Then, you can resume it from the UI by clicking on the `Resume` button in the `Overview` tab:

![pause_resume](/docs/how-to-guides/pause-resume/pause_resume.png)

## Bulk-resuming paused workflows

You can bulk-resume paused workflows from the `Executions` page by selecting the workflows you want to resume and clicking on the `Resume` button:

![pause_resume2](/docs/how-to-guides/pause-resume/pause_resume2.png)

This feature is useful when you have multiple paused workflows and want to resume them all at once.

::alert{type="warning"}
Make sure to select only workflows in the `PAUSED` state, as the `Resume` button will not work if you select workflows in other states.
::


### Manual Approval Process

Below, you can see an example of a workflow that sends a Slack message requesting approval for a vacation request to a manager. The workflow execution is paused until the manager resumes it with custom input values. Those input values indicate whether the request was approved and the reason for the decision.

```yaml
id: vacation_approval_process
namespace: company.team

inputs:
  - id: request.name
    type: STRING
    defaults: Rick Astley

  - id: request.start_date
    type: DATE
    defaults: 2024-07-01

  - id: request.end_date
    type: DATE
    defaults: 2024-07-07

  - id: slack_webhook_uri
    type: URI
    defaults: https://reqres.in/api/slack

tasks:
  - id: sendApprovalRequest
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ inputs.slack_webhook_uri }}"
    payload: |
      {
        "channel": "#vacation",
        "text": "Validate holiday request for {{ inputs.request.name }}. To approve the request, click on the `Resume` button here http://localhost:28080/ui/executions/{{flow.namespace}}/{{flow.id}}/{{execution.id}}"
      }

  - id: waitForApproval
    type: io.kestra.plugin.core.flow.Pause
    onResume:
      - id: approved
        description: Approve the request?
        type: BOOLEAN
        defaults: true
      - id: reason
        description: Reason for approval or rejection?
        type: STRING
        defaults: Approved

  - id: approve
    type: io.kestra.plugin.core.http.Request
    uri: https://reqres.in/api/products
    method: POST
    contentType: application/json
    body: "{{ inputs.request }}"

  - id: log
    type: io.kestra.plugin.core.log.Log
    message: Status is {{ outputs.waitForApproval.onResume.reason }}. Process finished with {{ outputs.approve.body }}
```

When you click on the `Resume` button in the UI, you will be prompted to provide the approval status and the reason for their decision. The workflow will then continue with the provided input values.

![pause_resume_1](/docs/how-to-guides/pause-resume/pause_resume_1.png)

After the Execution has been resumed, any downstream task can access the `onResume` inputs using the `outputs` of the `Pause` task:

![pause_resume_2](/docs/how-to-guides/pause-resume/pause_resume_2.png)
