---
title: Alerting & Monitoring
---

## Alerting

Failure alerts are non-negotiable. When a production workflow fails, you should get notified about it as soon as possible. To implement failure alerting, you can leverage Kestra's built in notification tasks, including: 
- [Slack](../../../plugins/plugin-notifications/tasks/slack/io.kestra.plugin.notifications.slack.slackexecution.md) 
- [Microsoft Teams](../../../plugins/plugin-notifications/tasks/teams/io.kestra.plugin.notifications.teams.teamsexecution.md) 
- [Email](../../../plugins/plugin-notifications/tasks/mail/io.kestra.plugin.notifications.mail.mailexecution.md)


Technically, you can add custom failure alerts to each flow separately using the [`errors` tasks](../../02.tutorial/06.errors.md):

```yaml
id: onFailureAlert
namespace: blueprint

tasks:
  - id: fail
    type: io.kestra.plugin.scripts.shell.Commands
    runner: PROCESS
    commands:
      - exit 1

errors:
  - id: slack
    type: io.kestra.plugin.notifications.slack.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK') }}"
    payload: |
      {
        "channel": "#alerts",
        "text": "Failure alert for flow {{ flow.namespace }}.{{ flow.id }} with ID {{ execution.id }}"
      }
```

However, this can lead to some boilerplate code if you start copy-pasting this `errors` configuration to multiple flows. 

To implement a centralized namespace-level alerting, we instead recommend a dedicated monitoring workflow with a notification task and a [Flow trigger](../../05.developer-guide/08.triggers/02.flow.md). Below is an example workflow that automatically sends a Slack alert as soon as any flow in a namespace `prod` fails or finishes with warnings. 

```yaml
id: failureAlertToSlack
namespace: prod.monitoring

tasks:
  - id: send
    type: io.kestra.plugin.notifications.slack.SlackExecution
    url: "{{ secret('SLACK_WEBHOOK') }}"
    channel: "#general"
    executionId: "{{trigger.executionId}}"

triggers:
  - id: listen
    type: io.kestra.core.models.triggers.types.Flow
    conditions:
      - type: io.kestra.core.models.conditions.types.ExecutionStatusCondition
        in:
          - FAILED
          - WARNING
      - type: io.kestra.core.models.conditions.types.ExecutionNamespaceCondition
        namespace: prod
        prefix: true
```

Adding this single flow will ensure that you receive a Slack alert on any flow failure in the `prod` namespace. Here is an example alert notification:

![alert notification](/docs/administrator-guide/alert-notification.png)


## Monitoring 

By default, Kestra exposes a monitoring endpoint on port 8081. You can change this port using the `endpoints.all.port` property in the [configuration options](../01.configuration/index.md).

This monitoring endpoint provides invaluable information for troubleshooting and monitoring, including Prometheus metrics and several Kestra's internal routes.


## Prometheus

Kestra exposes [Prometheus](https://prometheus.io/) metrics on the endpoint `/prometheus`. This endpoint can be used by any compatible monitoring system.

### Kestra's metrics

You can leverage Kestra's internal metrics to configure custom alerts. Each metric provides multiple timeseries with tags allowing to track at least namespace & flow but also other tags depending on available tasks.

Kestra metrics use the prefix `kestra`. This prefix can be changed using the `kestra.metrics.prefix` property in the [configuration options](../01.configuration/05.others.md#metrics-configuration).

Each task type can expose [custom metrics](../../03.concepts/02.executions.md#metrics) that will be also exposed on Prometheus.

#### Worker

|Metrics|Type|Description|
|-|-|-|
|worker.running.count|`GAUGE`|Count of tasks actually running|
|worker.started.count|`COUNTER`|Count of tasks started|
|worker.retried.count|`COUNTER`|Count of tasks retried|
|worker.ended.count|`COUNTER`|Count of tasks ended|
|worker.ended.duration|`TIMER`|Duration of tasks ended|

#### Executor

|Metrics|Type|Description|
|-|-|-|
|executor.taskrun.next.count|`COUNTER`|Count of tasks found|
|executor.taskrun.ended.count|`COUNTER`|Count of tasks ended|
|executor.taskrun.ended.duration|`TIMER`|Duration of tasks ended|
|executor.workertaskresult.count|`COUNTER`|Count of task results sent by a worker|
|executor.execution.started.count|`COUNTER`|Count of executions started|
|executor.execution.end.count|`COUNTER`|Count of executions ended|
|executor.execution.duration|`TIMER`|Duration of executions ended|

#### Indexer

|Metrics|Type| Description                               |
|-|-|-------------------------------------------|
|indexer.count|`COUNTER`| Count of indexers sent to a repository      |
|indexer.duration|`DURATION`| Duration of indexers sent to a repository |

#### Scheduler

|Metrics|Type| Description                                                                                         |
|-|-|-----------------------------------------------------------------------------------------------------|
|scheduler.trigger.count|`COUNTER`| Count of triggers                                                                                   |
|scheduler.evaluate.running.count|`COUNTER`| Evaluation of triggers actually running (equivalent to the number of threads used by the scheduler) |
|scheduler.evaluate.duration|`TIMER`| Duration of trigger evaluation                                                                      |

### Others metrics

Kestra also exposes all internal metrics from the following sources:

- [Micronaut](https://micronaut-projects.github.io/micronaut-micrometer/latest/guide/)
- [Kafka](https://kafka.apache.org/documentation/#remote_jmx)
- Thread pools of the application
- JVM

Check out the [Micronaut documentation](https://micronaut-projects.github.io/micronaut-micrometer/latest/guide/) for more information.


## Grafana and Kibana

Kestra uses Elasticsearch to store all executions and metrics. Therefore, you can easily create a dashboard with [Grafana](https://grafana.com/) or [Kibana](https://www.elastic.co/kibana) to monitor the health of your Kestra instance.

We'd love to see what dashboards you will build. Feel free to share a screenshot or a template of your dashboard with [the community](https://kestra.io/slack).


## Kestra endpoints

Kestra exposes internal endpoints on the management port (8081 by default) to provide status corresponding to the [server type](../../08.architecture.md#the-kestra-server-components):

* `/worker`: will expose all currently running tasks on this worker.
* `/scheduler`: will expose all currently scheduled flows on this scheduler with the next date.
* `/kafkastreams`: will expose all [Kafka Streams](https://kafka.apache.org/documentation/streams/) states and aggregated store lag.
* `/kafkastreams/{clientId}/lag`: will expose details lag for a `clientId`.
* `/kafkastreams/{clientId}/metrics`: will expose details metrics for a `clientId`.

## Other Micronaut default endpoints

Since Kestra is based on [Micronaut](https://micronaut.io), the [default Micronaut endpoints](https://docs.micronaut.io/latest/guide/index.html#providedEndpoints) are enabled by default on port 8081:

* `/info` [Info Endpoint](https://docs.micronaut.io/snapshot/guide/index.html#infoEndpoint) with git status information.
* `/health` [Health Endpoint](https://docs.micronaut.io/snapshot/guide/index.html#healthEndpoint) usable as an external heathcheck for the application.
* `/loggers` [Loggers Endpoint](https://docs.micronaut.io/snapshot/guide/index.html#loggersEndpoint) allows changing logger level at runtime.
* `/metrics` [Metrics Endpoint](https://docs.micronaut.io/snapshot/guide/index.html#metricsEndpoint) metrics in JSON format.
* `/env` [Environment Endpoint](https://docs.micronaut.io/snapshot/guide/index.html#environmentEndpoint) to debug configuration files.

You can disable some endpoints following the above Micronaut configuration.
