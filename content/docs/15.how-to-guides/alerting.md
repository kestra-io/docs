---
title: Configure Alerts in Kestra
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - DevOps
  - Kestra Concepts
---

Configure alerts that fire whenever a workflow fails.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/wIsbBpw3yCM?si=y0ZcPIDjLYPHnVVN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Alerting is essential to keeping production systems reliable. Kestra makes it easy with multiple ways to attach alerts to workflows so you always know what’s happening.

## Setting up Alerts in Kestra

Kestra’s Notifications plugin group ships tasks for popular platforms such as Slack, Teams, and PagerDuty, making it straightforward to configure alerts directly inside workflows.

![notifications](/docs/how-to-guides/alerting/notifications.png)

Each platform exposes two task types:

- **Execution task** – sends execution metadata directly in the notification, including a link to the run, ID, namespace, flow name, start time, duration, and final status.
- **Send task** – sends a custom message, useful when you want to describe the state of a specific task or output.

For this walkthrough we’ll use the `SlackExecution` task to send a detailed execution summary.

## `errors` property

If we add the task directly to a workflow, it runs every time—which isn’t useful. Instead, place it in the `errors` block so it only fires when the execution fails.

Just like the `tasks` block, define `SlackExecution` under `errors`:

```yaml
errors:
  - id: alert
    type: io.kestra.plugin.notifications.slack.SlackExecution
    channel: "#general"
    url: "{{ secret('SLACK_WEBHOOK') }}"
```

When executed, it looks like this in Slack:

![slack](/docs/how-to-guides/alerting/slack.png)

## Subflows

Copying that snippet into every flow is repetitive and hard to maintain. Instead, move the alerting logic into a Subflow and reference it from any workflow that needs alerts.

Move the `errors` tasks into their own Subflow so the `errors` block only calls that subflow. Update the alert logic once and every consumer benefits.

Subflow which contains the alert logic:

```yaml
id: slack_alert
namespace: system

tasks:
  - id: alert
    type: io.kestra.plugin.notifications.slack.SlackExecution
    channel: "#general"
    url: "{{ secret('SLACK_WEBHOOK') }}"
```

Parent flow which only calls the Subflow when an error occurs:

```yaml
errors:
  - id: alert
    type: io.kestra.plugin.core.flow.Subflow
    flowId: slack_alert
    namespace: system
```

## Flow Trigger

Subflows cut down on duplication, but you still need the `errors` block in every flow. For a fully centralized approach, use a **Flow trigger** that reacts to execution status. Trigger conditions let you target specific states (for example, FAILED or WARNING), and you can define separate triggers per status if needed.

```yaml
id: failure_alert_slack
namespace: system

tasks:
  - id: send_alert
    type: io.kestra.plugin.notifications.slack.SlackExecution
    url: "{{ secret('SLACK_WEBHOOK') }}"
    channel: "#general"
    executionId: "{{ trigger.executionId }}"

triggers:
  - id: on_failure
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatus
        in:
          - FAILED
          - WARNING

```

With multiple options for automatic alerting in Kestra, you can choose the level of centralization and customization that fits each use case.
