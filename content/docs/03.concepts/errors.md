---
title: Errors
---

The `errors` is a property of a flow that accepts a list of tasks that will be executed when an error occurs. You can add as many tasks as you want, and they will be executed sequentially.

The example below sends a flow-level failure alert via Slack using the [SlackIncomingWebhook](../../../plugins/plugin-notifications/tasks/slack/io.kestra.plugin.notifications.slack.slackincomingwebhook.md) task defined using the `errors` property.


```yaml
id: unreliable_flow
namespace: prod

tasks:
  - id: fail
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - exit 1

errors:
  - id: alert_on_failure
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}" # https://hooks.slack.com/services/xyz/xyz/xyz
    payload: |
      {
        "channel": "#alerts",
        "text": "Failure alert for flow {{ flow.namespace }}.{{ flow.id }} with ID {{ execution.id }}"
      }
```