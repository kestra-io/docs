---
title: "Approval Task in Kestra: Pause a Flow for a Human Decision"
h1: Pause a Flow Until Someone Approves or Denies It
sidebarTitle: Approval Task
description: Use the Approval task to pause an execution until a reviewer approves or denies it, then run different tasks for each decision, with comments, review inputs, automatic approval, and expiry.
icon: /src/contents/docs/icons/flow.svg
version: ">= 2.1.0"
docId: approval-task
---

The `Approval` task pauses an execution until a reviewer approves or denies it, then runs the tasks for that decision.

This page covers the task in every edition. To restrict who can review a request, track requests on the **Approvals** page, or chain several sign-offs, see [Approvals in Kestra Enterprise](../../07.enterprise/02.governance/approvals/index.md).

## Approval, Pause, and HumanTask

Use `Approval` when a person has to make a decision. [`Pause`](/plugins/core/flow/io.kestra.plugin.core.flow.pause) and [`HumanTask`](/plugins/core/flow/io.kestra.plugin.ee.flow.humantask) only wait to be resumed, so a flow that needs a "no" has to model it with inputs and an `If` task.

| | `Approval` | `Pause` | `HumanTask` (Enterprise) |
|---|---|---|---|
| Outcome | Approve or deny, each with its own tasks | Resume | Resume |
| Tasks before the pause | `onWait` list | One `onPause` task | One `onPause` task |
| Reviewer comment | Built in, optionally required | Only through an input | Only through an input |
| Skip the wait conditionally | `autoApprove` | No | No |
| When the wait times out | `expireBehavior` | `behavior` | `behavior` |
| Restrict who decides | `assignment` (Enterprise) | No | `assignment` |

`Pause` and `HumanTask` keep working unchanged.

## Request an approval

The following flow asks for an approval before it deploys a release. The `onWait` task posts the request to Slack with a link to the execution, and each decision runs its own branch:

```yaml
id: deploy_release
namespace: company.team

inputs:
  - id: version
    type: STRING
    defaults: "2.4.0"

tasks:
  - id: build
    type: io.kestra.plugin.core.log.Log
    message: "Built release {{ inputs.version }}"

  - id: approve_deploy
    type: io.kestra.plugin.core.flow.Approval
    timeout: P1D
    decisions:
      approve: Deploy
      deny: Stop
    commentRequired: ON_DENY
    inputs:
      - id: environment
        type: SELECT
        values: [staging, production]
        defaults: staging
    onWait:
      - id: ask_for_review
        type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
        url: "{{ secret('SLACK_WEBHOOK') }}"
        messageText: "Release {{ inputs.version }} is waiting for a review: {{ outputs.approve_deploy.url }}"
    onApprove:
      - id: deploy
        type: io.kestra.plugin.core.log.Log
        message: "Deploying {{ inputs.version }} to {{ outputs.approve_deploy.inputs.environment }}, approved by {{ outputs.approve_deploy.by }}"
    onDeny:
      - id: report_denial
        type: io.kestra.plugin.core.log.Log
        message: "Deployment stopped by {{ outputs.approve_deploy.by }}: {{ outputs.approve_deploy.comment }}"
```

When the flow runs:

1. `onWait` runs while the execution is in the `PAUSING` [state](../17.states/index.md). Use it to notify reviewers.
2. The execution moves to `PAUSED` and waits for a decision.
3. A reviewer approves or denies the request, fills in the review `inputs`, and adds a comment.
4. Kestra runs `onApprove` or `onDeny`, then applies the [behavior](#choose-what-happens-after-a-decision) for that decision. By default, an approval continues to the next task and a denial cancels the execution.

`onWait`, `onApprove`, and `onDeny` are all optional. The task also accepts `errors` and `finally` blocks, like other flowable tasks.

`outputs.<taskId>.url` links to the execution page when the instance has [`kestra.url`](../../configuration/02.runtime-and-storage/index.md#server-environment-and-jvm-settings) configured. In Enterprise, it links to the approval case instead, unless the task disables the case.

## Review a request

Open the execution and click **Review**. The review dialog shows the task's review inputs, a comment field, and one button for each decision. The **Resume** action isn't available for an execution that waits on an `Approval` task, because resuming would end the request without a decision.

To review from a script, call the review endpoint with the decision and the ID of the paused task run. Send the comment as the `kestra_review_comment` multipart part and each review input as its own part:

```bash
curl -X POST "http://localhost:8080/api/v1/main/executions/{executionId}/actions/review?taskRunId={taskRunId}&decision=APPROVE" \
  -H "Authorization: Bearer $KESTRA_API_TOKEN" \
  -F "environment=production" \
  -F "kestra_review_comment=Change approved in the release meeting"
```

Use `decision=DENY` to deny the request. The endpoint returns:

- `404` when the execution has no task run with that ID.
- `409` when the task run is still running its `onWait` tasks, or is not paused because it was already decided or cancelled.
- `422` when the task run is not an `Approval`, or when the review is refused, for example because a required comment is missing.

`POST .../actions/review/validate` checks a review with the same parameters without submitting it.

## Customize the review

| Property | Description | Default |
|---|---|---|
| `decisions` | Labels of the two buttons, for example `approve: Deploy` and `deny: Stop`. The decision itself is always `APPROVED` or `DENIED` in the outputs. | **Approve** and **Deny** |
| `commentRequired` | When a comment is mandatory: `NEVER`, `ALWAYS`, `ON_DENY`, or `ON_APPROVE`. | `NEVER` |
| `inputs` | Fields the reviewer fills in, declared like [flow inputs](../05.inputs/index.md). The values are available as `outputs.<taskId>.inputs`. | None |

An `Approval` always has exactly two decisions. To ask the reviewer to pick among more options, add a `SELECT` input and branch on its value in `onApprove`.

## Approve automatically

`autoApprove` skips the review when an expression is true. The task approves the request immediately and runs `onApprove`, without running `onWait` and without pausing. The outputs contain `auto: true` and `decision: APPROVED`.

The following task approves small purchases automatically and sends larger ones for review:

```yaml
  - id: purchase_approval
    type: io.kestra.plugin.core.flow.Approval
    autoApprove: "{{ inputs.amount < 500 }}"
    onApprove:
      - id: order
        type: io.kestra.plugin.core.log.Log
        message: "Ordering, approved {{ outputs.purchase_approval.auto ? 'automatically' : 'by ' ~ outputs.purchase_approval.by }}"
```

## Let a request expire

Set the task's `timeout` to limit how long a request waits. When the timeout is reached without a decision, the decision is `EXPIRED`, no decision branch runs, and `expireBehavior` decides what happens to the execution. `outputs.<taskId>.due` holds the expiry time while the request waits.

Without a `timeout`, the request waits until someone decides or cancels it. The waiting execution is stored in the database and survives restarts.

## Choose what happens after a decision

Three properties set the outcome of the execution after a decision. `approveBehavior` applies after `onApprove` finishes, `denyBehavior` after `onDeny` finishes, and `expireBehavior` when the request expires.

| Value | Effect |
|---|---|
| `CONTINUE` | The flow continues with the next task. Default for `approveBehavior`. |
| `WARN` | The task ends in `WARNING` and the flow continues. |
| `FAIL` | The task ends in `FAILED`, and the flow handles it like any failed task. |
| `SUCCEED` | The execution ends in `SUCCESS` without running the next tasks. |
| `CANCEL` | The execution ends in `CANCELLED`. Default for `denyBehavior` and `expireBehavior`. |
| `KILL` | The execution ends in `KILLED`. |

The behavior applies only when the decision branch succeeds. If a task in `onApprove` or `onDeny` fails, the `Approval` task fails, whatever the behavior.

The flow's `finally` tasks still run when a denial, an expiry, or `SUCCEED` ends the execution early. They don't run when the request is cancelled.

## Cancel a request

Cancelling ends a request without a decision: no decision branch runs and the execution ends in `CANCELLED`. Cancel a request from the execution page, or with the API:

```bash
curl -X POST "http://localhost:8080/api/v1/main/executions/{executionId}/actions/cancel-approval?taskRunId={taskRunId}" \
  -H "Authorization: Bearer $KESTRA_API_TOKEN"
```

Killing the execution also ends the request.

## Outputs

| Output | Description |
|---|---|
| `decision` | `APPROVED`, `DENIED`, or `EXPIRED`. Empty while the request waits. |
| `auto` | `true` when `autoApprove` approved the request. |
| `by` | Username of the reviewer. Empty when the request was approved automatically or expired. |
| `on` | When the decision was made. |
| `comment` | The reviewer's comment. |
| `inputs` | The values the reviewer entered in the review `inputs`. |
| `due` | When the request expires, computed from `timeout`. |
| `url` | Link to the approval case in Enterprise, or to the execution when no case is opened. |
| `commentRequired` | The rendered `commentRequired` value, while the request waits. |
| `title` | The rendered request title. Enterprise only. |
| `caseId` | ID of the approval case. Enterprise only. |

`onWait` tasks can already read `url`, `title`, and `caseId`, so a notification can link straight to the request.

## Enterprise properties

:::alert{type="info"}
`title`, `assignment`, `case`, and `inAppNotification` require Kestra Enterprise or Cloud. Other editions save a flow that sets them, but fail the task when it runs. See [Approvals in Kestra Enterprise](../../07.enterprise/02.governance/approvals/index.md).
:::

Without `assignment`, any user who can review executions in the namespace can decide the request.
