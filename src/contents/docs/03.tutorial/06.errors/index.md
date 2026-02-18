---
title: Tutorial – Handle Errors in Kestra – Retries and Alerts
description: Build resilient workflows in Kestra with robust error handling. Learn to configure retries, set up alerts, and manage failures at the flow and namespace levels.
sidebarTitle: Error Handling
icon: /src/contents/docs/icons/tutorial.svg
---

Handle errors with automatic retries and notifications.

Failure is inevitable. Kestra offers automatic retries and error handling to help you build resilient workflows.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/fjq4z19PZ5w?si=ca80qvdamP6g1hWO" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Handle errors with retries and alerts

By default, if any task fails, the execution stops and is marked as failed. For more control over error handling, you can add `errors` tasks, `AllowFailure` tasks, or automatic retries.

The `errors` property allows you to execute one or more actions before terminating the flow (e.g., sending an email or a Slack message to your team). The property is named `errors` because it is triggered when errors occur within a flow.

You can implement error handling at the flow level or namespace level:

1. **Flow-level**: Useful to implement custom alerting for a specific flow or task. This can be accomplished by adding `errors` tasks.
2. **Namespace-level**: Useful to send a notification for any failed Execution within a given namespace. This approach allows you to implement centralized error handling for all flows within a given namespace.

---

## Flow-level error handling using `errors`

The `errors` property of a flow accepts a list of tasks to execute when an error occurs. You can add as many tasks as you want, and they will be executed sequentially similar to the `tasks` block.

The following example workflow automatically sends a Slack alert via the [SlackIncomingWebhook](/plugins/plugin-slack/io.kestra.plugin.slack.slackincomingwebhook) whenever any flow in the `company.team` namespace fails or finishes with warnings.

```yaml
id: unreliable_flow
namespace: company.team

tasks:
  - id: fail
    type: io.kestra.plugin.core.execution.Fail

errors:
  - id: alert_on_failure
    type: io.kestra.plugin.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}" # https://hooks.slack.com/services/xyz/xyz/xyz
    messageText: "Failure alert for flow {{ flow.namespace }}.{{ flow.id }} with ID {{ execution.id }}"
```

:::alert{type="info"}
Note that we hide the Slack Webhook URL with a secret expression to not expose private endpoints or credentials. Follow our [Open-source Secrets guide](../../15.how-to-guides/secrets/index.md) or check out the [Enterprise Edition](../../oss-vs-paid/index.md) to incorporate your own external [Secrets Manager](../../07.enterprise/02.governance/secrets-manager/index.md).
:::

For the final time, taking our flow from earlier stages, we can add a Slack alert on an execution error like the following:

```yaml
id: getting_started_category_check
namespace: company.team

inputs:
  - id: category
    type: SELECT
    displayName: Select a category
    values: ['beauty', 'notebooks']
    defaults: 'beauty'

tasks:
  - id: api
    type: io.kestra.plugin.core.http.Request
    uri: "https://dummyjson.com/products/category/{{ inputs.category }}"
    method: GET
    retry:
      type: constant
      interval: PT20S
      maxDuration: PT1H
      maxAttempts: 10
      warningOnRetry: true

  - id: check_products
    type: io.kestra.plugin.core.flow.If
    condition: "{{ json(outputs.api.body).products | length > 0 }}"
    then:
      - id: log_status
        type: io.kestra.plugin.core.log.Log
        message: "Found {{ json(outputs.api.body).products | length }} products for category {{ inputs.category }}"
      - id: python
        type: io.kestra.plugin.scripts.python.Script
        containerImage: python:slim
        dependencies:
          - polars
        outputFiles:
          - "products.csv"
        script: |
          import polars as pl
          data = {{ outputs.api.body | jq('.products') | first }}
          df = pl.from_dicts(data)
          df.glimpse()
          df.select(["title", "brand", "price", "rating"]).write_csv("products.csv")
      - id: sqlQuery
        type: io.kestra.plugin.jdbc.duckdb.Queries
        inputFiles:
          in.csv: "{{ outputs.python.outputFiles['products.csv'] }}"
        sql: |
          SELECT brand, round(avg(price), 2) AS avg_price, count(*) AS cnt
          FROM read_csv_auto('{{ workingDir }}/in.csv', header=True)
          GROUP BY brand
          ORDER BY avg_price DESC;
        store: true
    else:
      - id: when_false
        type: io.kestra.plugin.core.log.Log
        message: "No products found for category {{ inputs.category }}."

errors:
  - id: alert_on_failure
    type: io.kestra.plugin.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    messageText: "Failure alert for flow {{ flow.namespace }}.{{ flow.id }} with ID {{ execution.id }}"

triggers:
  - id: every_monday_at_10_am
    type: io.kestra.plugin.core.trigger.Schedule
    cron: 0 10 * * 1
```

Now if there is an error, say our API endpoint is unreachable, we'll get a Slack alert notifying a team to investigate. For more, check the [error handling](../../05.workflow-components/11.errors/index.md) page.

---

## Namespace-level error handling using a flow trigger

To get notified on a workflow failure, you can leverage Kestra's built-in notification tasks, including among others (_the list keeps growing with new releases_):

- [Slack](/plugins/plugin-slack/io.kestra.plugin.slack.slackexecution)
- [Microsoft Teams](/plugins/plugin-teams/io.kestra.plugin.teams.teamsexecution)
- [Email](/plugins/plugin-mail/io.kestra.plugin.mail.mailexecution)

For a centralized namespace-level alerting, we recommend adding a dedicated monitoring workflow with one of the above mentioned notification tasks and a Flow trigger. Below is an example workflow that automatically sends a Slack alert as soon as any flow in the namespace `company.team` fails or finishes with warnings.

```yaml
id: failure_alert
namespace: system

tasks:
  - id: send
    type: io.kestra.plugin.slack.SlackExecution
    url: "{{ secret('SLACK_WEBHOOK') }}"
    channel: "#general"
    executionId: "{{trigger.executionId}}"

triggers:
  - id: listen
    type: io.kestra.plugin.core.trigger.Flow
    conditions:
      - type: io.kestra.plugin.core.condition.ExecutionStatus
        in:
          - FAILED
          - WARNING
      - type: io.kestra.plugin.core.condition.ExecutionNamespace
        namespace: company.team
        prefix: true
```

Adding this flow ensures you receive a Slack alert for any flow failure in the `company.team` namespace.

![alert notification](./alert-notification.png)

---

## Retries

When working with external systems, transient errors are common. For example, a file may not be available yet, an API might be temporarily unreachable, or a database can be under maintenance. In such cases, retries can often resolve the issue without human intervention.

### Configuring retries

Each task can be retried a certain number of times and in a specific way. Use the `retry` property with the desired type of retry.

The following types of retries are currently supported:

- **Constant**: The task will be retried every X seconds/minutes/hours/days.
- **Exponential**: The task will also be retried every X seconds/minutes/hours/days but with an exponential backoff (i.e., an exponential time interval in between each retry attempt.)
- **Random**: The task will be retried every X seconds/minutes/hours/days with a random delay (i.e., a random time interval in between each retry attempt.)

In this example, the task is retried up to 5 times within a total duration of 1 minute, with a constant 2-second interval between attempts.

```yaml
id: retries
namespace: company.team

tasks:
  - id: fail_four_times
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - 'if [ "{{ taskrun.attemptsCount }}" -eq 4 ]; then exit 0; else exit 1; fi'
    retry:
      type: constant
      interval: PT2S
      maxAttempts: 5
      maxDuration: PT1M
      warningOnRetry: false

errors:
  - id: will_never_run
    type: io.kestra.plugin.core.debug.Return
    format: This will never be executed as retries will fix the issue
```

### Adding a retry configuration to our tutorial workflow

Returning to the first iteration of our flow from the [Fundamentals](../01.fundamentals/index.md) section. We can add a retry configuration to the `api` task. API calls are prone to transient errors, so we will retry that task up to 10 times, for at most 1 hour of total duration, every 10 seconds (i.e., with a constant interval of 10 seconds in between retry attempts).

```yaml
id: getting_started
namespace: company.team

tasks:
  - id: api
    type: io.kestra.plugin.core.http.Request
    uri: https://dummyjson.com/products
    retry:
      type: constant
      interval: PT20S
      maxDuration: PT1H
      maxAttempts: 10
      warningOnRetry: true
```

## Next steps

Congrats! 🎉 You've completed the tutorial.

Next, you can dive into:

- [Architecture](../../08.architecture/index.mdx)
- [Workflow Components](../../05.workflow-components/index.mdx)
- [Key concepts](../../06.concepts/index.mdx)
- [Plugins](/plugins) to integrate with external systems
- [Deployments](../../10.administrator-guide/index.mdx) to deploy Kestra to production.
- [Scripts](../../16.scripts/index.mdx)
