---
title: "Approvals in Kestra Enterprise: Assignees, Approval Cases, and the Approvals Page"
h1: Assign, Track, and Audit Approval Requests
sidebarTitle: Approvals
description: Restrict who can review an Approval task, track every request as an approval case on the Approvals page, chain multi-step sign-offs, and let reviewers decide from an App.
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 2.1.0"
docId: approvals
---

Kestra Enterprise adds reviewers, tracking, and notifications to the [`Approval` task](../../../05.workflow-components/23.approvals/index.md).

The `Approval` task page covers the decision branches, review inputs, automatic approval, expiry, and outputs. This page covers what Enterprise adds on top:

- `assignment` restricts who can review a request.
- Each request opens an approval case, listed on the **Approvals** page.
- A later `Approval` task can add its request to the same case for multi-step sign-offs.
- In-app notifications reach the assignees and the requester.
- App blocks let users review a request without opening Kestra.

## Request an approval from specific reviewers

The following task asks the platform leads to approve a production deployment within four hours:

```yaml
id: deploy_to_production
namespace: company.team

inputs:
  - id: version
    type: STRING
    defaults: "2.4.0"

tasks:
  - id: approve_deploy
    type: io.kestra.plugin.core.flow.Approval
    title: "Deploy {{ inputs.version }} to production"
    timeout: PT4H
    commentRequired: ON_DENY
    assignment:
      users:
        - release-manager@company.com
      groups:
        - Platform Leads
    case:
      severity: HIGH
      description: "Release notes: https://example.com/releases/{{ inputs.version }}"
    onApprove:
      - id: deploy
        type: io.kestra.plugin.core.log.Log
        message: "Deploying {{ inputs.version }}, approved by {{ outputs.approve_deploy.by }}"
```

| Property | Description |
|---|---|
| `title` | Title of the request, shown on the Approvals page and in notifications. Defaults to the task ID. |
| `assignment` | `users` (usernames) and `groups` (group names) allowed to review. Both accept expressions. At least one user or group is required. |
| `case.enabled` | Whether to open an approval case for the request. Defaults to `true`. |
| `case.severity` | Severity of the approval case: `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`. |
| `case.description` | Markdown description of the approval case. |
| `case.sla` | Deadline of the approval case. Defaults to the task's `timeout`. |
| `case.id` | ID of an existing approval case of the same execution to add this request to. See [Chain several sign-offs](#chain-several-sign-offs). |
| `inAppNotification` | Whether to send in-app notifications when the request has no approval case. Defaults to `true`. |

If `assignment` names a user that doesn't exist, the task fails with a `User not found` error instead of waiting for a review nobody can give.

To review a request, a user needs the `REVIEW` action on the `EXECUTION` permission in the flow's namespace. When the task sets `assignment`, the user must also be one of the assigned users, or a member of an assigned group. Everyone else gets an access-denied error, from the UI, the API, and Apps alike. See the [permissions reference](../../03.auth/rbac/permissions-reference/index.md) for the endpoints that check `REVIEW`.

## Approval cases

Each approval is a case of kind Approval, listed on the **Approvals** page and not on [Cases](../cases/index.md).

When the request opens, the approval case gets:

- The task's `title`, and the `case.severity` and `case.description` values.
- The `assignment` users and groups as assignees.
- The user who started the execution as a watcher, when a signed-in user started it.
- A resolution SLA equal to `case.sla`, or to the task's `timeout`.
- A link to the execution.

The `caseId` and `url` outputs of the task point to the approval case, and `onWait` tasks can already read them.

An approval case follows its request, so its status can't be changed by hand. The case closes when the request ends:

| How the request ends | Case status | Resolution reason |
|---|---|---|
| Approved | `RESOLVED` | `Approved` |
| Denied | `RESOLVED` | `Denied` |
| Expired | `RESOLVED` | `Expired` |
| Cancelled | `CANCELLED` | `Cancelled` |
| Execution killed | `CANCELLED` | `Killed` |

The resolution note is the reviewer's comment. The timeline records an `APPROVAL_DECIDED` event with the decision, the reviewer, and the comment.

Approval cases keep the other case features: comments, watchers, linked assets, custom fields, and [`CaseEvent` triggers](../cases/index.md#react-to-case-events). For example, a flow with a `CaseEvent` trigger on `APPROVAL_DECIDED` can post every decision to a channel.

Set `case.enabled: false` to skip the approval case. The request then doesn't appear on the Approvals page.

## The Approvals page

**Approvals** in the left menu lists every approval request you can see, with a **Resolution** column that shows how each request ended. Open a request to see its details and timeline, and click **Review** to approve or deny it.

To cancel pending requests in bulk, select them and click **Cancel**. Each request ends without a decision: no decision branch runs, and its execution ends in `CANCELLED`. Requests you aren't allowed to review are left untouched and listed in the result.

The Approvals page requires the `LIST` action on the `CASE` permission, and opening a request requires `VIEW`.

From the API, cancel requests and check which ones you may review by approval case ID, up to 100 IDs per call:

```bash
# Cancel pending requests without a decision
curl -X POST "https://{host}/api/v1/{tenant}/cases/approvals/cancel/by-ids" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '["{caseId1}", "{caseId2}"]'

# List the requests the caller may review
curl -X POST "https://{host}/api/v1/{tenant}/cases/approvals/reviewable/by-ids" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '["{caseId1}", "{caseId2}"]'
```

## Chain several sign-offs

A later `Approval` task in the same execution can add its request to an earlier approval case by passing the earlier task's `caseId` as `case.id`. The requests are reviewed one after the other, and the case keeps the full history in one timeline.

The following flow needs the team lead's approval, then the CTO's:

```yaml
id: purchase_request
namespace: company.team

tasks:
  - id: lead_approval
    type: io.kestra.plugin.core.flow.Approval
    title: Purchase request
    assignment:
      groups:
        - Team Leads

  - id: cto_approval
    type: io.kestra.plugin.core.flow.Approval
    title: Purchase request
    assignment:
      users:
        - cto@company.com
    case:
      id: "{{ outputs.lead_approval.caseId }}"

  - id: order
    type: io.kestra.plugin.core.log.Log
    message: "Approved by {{ outputs.lead_approval.by }} and {{ outputs.cto_approval.by }}"
```

When the second request joins the case:

- The case reopens if the first decision resolved it.
- The new task's assignees replace the previous ones, and the previous assignees become watchers.
- The case deadline restarts from the new request's `timeout` or `case.sla`.

`case.id` must name an approval case of the same execution that isn't cancelled.

## Notifications

When a request has an approval case, the case notifies its assignees and watchers in the app, like any [case](../cases/index.md#notifications).

When a request has no approval case, Kestra sends in-app notifications directly: to each assignee when the request opens, and to the requester when it's decided. Set `inAppNotification: false` to turn these off.

The requester is the user who started the execution from the UI, the API, an App, or a case action. An execution started by a schedule, a webhook, or a Flow trigger has no requester. To notify someone outside Kestra, add a notification task to `onWait`, `onApprove`, or `onDeny`.

## Review from an App

[Apps](../../04.scalability/apps/index.md) can show an approval request to reviewers outside the Kestra UI:

- The `ApprovalReview` block shows the review inputs, a comment field, and the two decision buttons.
- The `CancelApprovalRequestButton` block cancels the request without a decision.
- The `APPROVED`, `DENIED`, and `EXPIRED` stages show what happened after the decision. `APPROVED` applies until the execution ends, then `SUCCESS` or `FAILURE` takes over.

Set `task` on a layout to bind it to one `Approval` task when the flow has several:

```yaml
layout:
  - on: PAUSE
    task: approve_deploy
    blocks:
      - type: io.kestra.plugin.ee.apps.execution.blocks.Inputs
      - type: io.kestra.plugin.ee.apps.execution.blocks.ApprovalReview
      - type: io.kestra.plugin.ee.apps.execution.blocks.CancelApprovalRequestButton

  - on: APPROVED
    task: approve_deploy
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Markdown
        content: "## Deployment approved, deploying {{ inputs.version }} now"
      - type: io.kestra.plugin.ee.apps.execution.blocks.Logs

  - on: DENIED
    task: approve_deploy
    blocks:
      - type: io.kestra.plugin.ee.apps.core.blocks.Alert
        style: ERROR
        content: The deployment was denied.
```

`ApprovalReview` checks `REVIEW` and the `assignment` the same way as the Kestra UI.
