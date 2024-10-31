---
title: Configure Alerts inside of Kestra
icon: /docs/icons/tutorial.svg
stage: Getting Started
topics:
  - DevOps
  - Kestra Concepts
---

Configure alerts when workflow failures occurs.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/wIsbBpw3yCM?si=y0ZcPIDjLYPHnVVN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

Alerting is a crucial part to a production environment to ensure high uptime and reliability. Kestra makes this easy by having multiple ways you can add alerts to your workflows so you always know what’s going on.

## Setting up Alerts in Kestra

Kestra has a Notifications plugin group that has tasks for all your favorite platforms, like Slack, Teams and PagerDuty. This makes it really easy to configure them directly inside of your workflows.

![notifications](/docs/how-to-guides/alerting/notifications.png)

There’s 2 tasks for each of these platforms:

- **Execution Task**: that allows us to send execution information directly in the notification. This includes a link to the execution page in the UI as well as the execution ID, namespace, flow name, start date, duration and the final status of the execution.
- **Send Task**: that allows us to send a custom message of our choice. This is useful if we want to send a more detailed status about a specific task or output.

For this example, we’re going to use the `SlackExecution task to send us a detailed message about our execution.

## `errors` property

Now if we add this to our workflow, it will run this task every execution which isn’t helpful. We can use the `errors` block to allow us to run separate tasks only when our execution fails.

Just like the `tasks` block, we can define our `SlackExecution` task as below:

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

At the moment, we'll need to copy and paste this across all of our flows. This can get repetitive, as well as make it difficult to maintain. By using a Subflow, we can put all of our alert logic in one flow, and reference it in the flows which we want alerting.

The tasks underneath the `errors` block will be moved into their own Subflow. This wraps all the logic together into one task that we can call from `errors`. The benefit here is we can modify our alerting logic in one place for all of our workflows.

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

While our new method using a Subflow is neater and easier to maintain, we still have to write the same `error` block on every flow in order to have alerting. We can resolve this by using a **Flow Trigger** to automatically send alerts based on the execution status of workflows. This is much easier for being able to have all the alert logic in one place, without having to configure it to work for each workflow. By using the Trigger Conditions, we can fine tune the Flow Trigger to alert us in specific cases, such as when Executions finish with a FAILED or WARNING status. We could even setup separate Flow Triggers for different statuses.

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
      - type: io.kestra.plugin.core.condition.ExecutionStatusCondition
        in:
          - FAILED
          - WARNING

```

With multiple ways to set up automatic alerting inside of Kestra, there's something for every use case.
