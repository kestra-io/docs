---
title: Triggers & Schedule
icon: /docs/icons/components.svg
---

Trigger is a mechanism that automates the execution of a flow. Triggers can be scheduled, event-based or webhook-based.

## Trigger types
Kestra supports both **scheduled** and **external** events.

Kestra core provides three types of triggers:

* [Schedule trigger](./schedule-trigger.md) allows you to execute your flow on a regular cadence e.g. using a CRON expression and custom scheduling conditions
* [Flow trigger](./flow-trigger.md) allows you to execute your flow when another flow finishes its execution (based on a configurable list of states)
* [Webhook trigger](./webhook-trigger.md) allows you to execute your flow based on an HTTP request emitted by a webhook.

Many other triggers are available from the plugins, such as triggers based on file detection events, e.g. the [S3 trigger](https://kestra.io/plugins/plugin-aws/triggers/s3/io.kestra.plugin.aws.s3.trigger), or a new message arrival in a message queue, such as the [SQS](https://kestra.io/plugins/plugin-aws/triggers/sqs/io.kestra.plugin.aws.sqs.trigger) or [Kafka trigger](https://kestra.io/plugins/plugin-kafka/triggers/io.kestra.plugin.kafka.trigger).

### Trigger common properties

Following trigger properties can be set.

| Field | Description                                                         |
| ----- |---------------------------------------------------------------------|
|`id`| The flow identifier, must be unique inside a flow.                  |
|`type`| The Java FQDN of the trigger.                                       |
|`description`| The description of the trigger.                                     |
|`disabled`| Set it to `true` to disable execution of the trigger.               |
|`workerGroup.key`| To execute this trigger on a specific Worker Group (EE) |

---

## Trigger variables

Triggers allow you to access trigger metadata through expressions e.g. `{{ trigger.date }}` to access the current date of the [Schedule trigger](https://kestra.io/plugins/core/triggers/io.kestra.core.models.triggers.types.schedule), `{{ trigger.uri }}` to access the file or message from any file detection or message arrival event, as well as `{{ trigger.rows }}` for all Query triggers e.g. the [PostgreSQL Query](https://kestra.io/plugins/plugin-jdbc-postgres/triggers/io.kestra.plugin.jdbc.postgresql.trigger) trigger.

::alert{type="warning"}
Note that the above-mentioned **templated variables** are only available when the execution is created **automatically** by the trigger. You'll get an error if you try to run a flow containing such variables **manually**.

Also, note that **you don't need an extra task to consume** the file or message from the event. Kestra downloads those automatically to the **internal storage** and makes those available in your flow using `{{ trigger.uri }}` variable. Therefore, you don't need any additional task to e.g. consume a message from the SQS queue or to download a file from S3 when using those event triggers. The trigger already consumes and downloads those, making them directly available for further processing. Check the documentation of a specific trigger and [Blueprints](https://kestra.io/blueprints) with the **Trigger** tag for more details and examples.
::

Triggers restrict parallel execution for a given trigger ID to one active run. For instance, if an Execution from a flow with a `Schedule` trigger with ID `hourly` is still in a `Running` state, another one will not be started. However, you can still trigger the same flow manually (from the UI or API), and the scheduled Executions will not be affected.

```yaml
id: hourlyFlow
namespace: dev
tasks:
  - id: important-task
    type: io.kestra.core.tasks.log.Log
    message: If this runs for longer than 1h, next Executions will be queued rather than being started immediately
triggers:
  - id: hourly
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "@hourly"
```

## Core triggers

The following triggers are included in Kestra core:

* [Schedule](./schedule-trigger.md): to trigger a flow based on a schedule.
* [Flow](./flow-trigger.md): to trigger a flow after another one.
* [Webhook](./webhook-trigger.md): to trigger a flow from an HTTP request.

## Polling triggers

Polling triggers are a type of triggers that are provided by our plugins. They allow polling an external system for the presence of data. In case data are ready to be processed, a flow execution is started.

Kestra provides polling triggers for a wide variety of external systems: databases, message brokers, ftp, ...

Polling triggers will poll the external system at a fixed interval defined by the `interval` property, the triggered flow will have the outputs of the polling trigger available on the `trigger` variable.

For example, the following flow will be triggered when rows are available on the `my_table` PostgreSQL table, and when triggered, it will delete the rows (to avoid processing them again on the next poll) and log them.

```yaml
id: jdbc-trigger
namespace: io.kestra.tests

tasks:
- id: update
  type: io.kestra.plugin.jdbc.postgresql.Query
  sql: DELETE * FROM my_table
- id: log
  type: io.kestra.core.tasks.log.Log
  message: {{trigger.rows}}

triggers:
  - id: watch
    type: io.kestra.plugin.jdbc.postgresql.Trigger
    interval: "PT5M"
    sql: "SELECT * FROM my_table"
```

Polling triggers can be evaluated on a specific Worker Group (EE), thanks to the `workerGroup.key` property.

## Unlocking, enabling and disabling triggers

### Disabling a trigger in the source code
If you want to temporarily disable a trigger, you could do so by setting the `disabled` property to `true`, as you can see in the example below:

```yaml
id: hello_world
namespace: dev

tasks:
  - id: sleep
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - sleep 30

triggers:
  - id: schedule
    type: io.kestra.core.models.triggers.types.Schedule
    cron: "*/1 * * * *"
    disabled: true
```

However, this approach requires changing the source code. A better approach is to use the `Enabled` toggle from the UI.

### Disabling a trigger from the UI

You can disable or re-enable a trigger from the UI. Here is how you can do it:
1. Go to the `Flows` page and click on the flow you want to disable the trigger for.
2. Go to the `Triggers` tab and click on the `Enabled` toggle next to the trigger you want to disable. You can re-enable it by clicking the toggle again.

![triggers_flow](/docs/workflow-components/triggers_flow.png)

If your trigger is locked due to an execution in progress, you can unlock it by clicking the `Unlock trigger` button.

![trigger_unlock](/docs/workflow-components/trigger_unlock.png)

The **Unlock trigger** functionality is useful for troubleshooting, e.g. if a process is stuck due to infrastructure issues. Note that manually unlocking triggers may result in multiple concurrent (potentially duplicated) executions — use it with caution.

### Toggle or unlock triggers from the Administation page

You can also disable, re-enable, or unlock triggers from the Administration page. Here is how you can do it:

![triggers_administration](/docs/workflow-components/triggers_administration.png)


## The ``stopAfter`` property

Kestra 0.15 introduced a generic `stopAfter` property which is a list of states that will disable the trigger after the flow execution has reached one of the states in the list.

This property is meant to be used primarily for a `Schedule` trigger and triggers that poll for conditions including the HTTP, JDBC, or File Detection triggers. However, you can use it with all triggers.

::alert{type="info"}
Note that we don't handle any automatic trigger reenabling logic. After a trigger has been disabled due to the `stopAfter` state condition, you can take some action based on it and manually reenable the trigger.
::


### Pause the schedule trigger after a failed execution

The `stopAfter` property can be used to pause a schedule trigger after a failed execution. Here is an example of how to use it:

```yaml
id: business_critical_flow
namespace: production

tasks:
 - id: important_task
   type: io.kestra.core.tasks.log.Log
   message: if this fails, we want to stop the flow from running until we fix it

triggers:
 - id: stopAfter
   type: io.kestra.core.models.triggers.types.Schedule
   cron: "0 9 * * *"
   stopAfter:
     - FAILED
```

The above flow will be triggered every day at 9:00 AM, but if it fails, the schedule will be paused so that you can manually reenable the trigger once the issue is fixed. This is useful for business-critical flows that should not continue running the next scheduled executions if a previous execution has failed.

### Disable the HTTP trigger after the first successful execution

The example below shows how to use the `stopAfter` property with the HTTP trigger condition. The use case is to poll an API endpoint and send a Slack alert if the price is below $110. If the condition is met, the trigger will be disabled so that you don't get alerted every 30 seconds about the same condition.

```yaml
id: http
namespace: dev

tasks:
  - id: slack
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    payload: |
      {
        "channel": "#price-alerts",
        "text": "The price is now: {{ json(trigger.body).price }}"
      }

triggers:
  - id: http
    type: io.kestra.plugin.fs.http.Trigger
    uri: https://fakestoreapi.com/products/1
    responseCondition: "{{ json(response.body).price <= 110 }}"
    interval: PT30S
    stopAfter:
      - SUCCESS
```

Let's break down the above example:
1. The HTTP trigger will poll the API endpoint every 30 seconds to check if the price of a product is below $110.
2. If the condition is met, the Execution will be created
3. Within that execution, the `slack` task will send a Slack message to the `#price-alerts` channel to notify about the price change
4. After that execution finishes successfully, the `stopAfter` property condition is met — it will disable the trigger ensuring that you don't get alerted every 30 seconds about the same condition.

