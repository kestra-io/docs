---
title: Monitoring & Alerting
---

Kestra will deploy a monitoring endpoint on port 8081 by default. (You can change this port with
[configuration options](../01.configuration/index.md) `endpoints.all.port`)

This monitoring endpoint will expose some helpful routes in order to monitor Kestra:

## Prometheus
If you have any [Prometheus](https://prometheus.io/) compatible monitoring system, Kestra exposes Prometheus metrics on the endpoint `/prometheus`.


### Kestra metrics
Kestra exposes some internal metrics allowing to add some alerts. Each metric declares many timeseries with tags allowing
to track at least namespace & flow. But also some other tags depending on available tasks.

Each task type can expose [custom metrics](../../03.concepts/02.executions.md#metrics) that will be exposed on Prometheus.


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
|executor.workertaskresult.count|`COUNTER`|Count of task result send by worker|
|executor.execution.started.count|`COUNTER`|Count of executions started|
|executor.execution.end.count|`COUNTER`|Count of executions ended|
|executor.execution.duration|`TIMER`|Duration of executions ended|

#### Indexer
|Metrics|Type|Description|
|-|-|-|
|indexer.count|`COUNTER`|Count of indexation sent to repository|
|indexer.duration|`DURATION`|Duration of indexation sent to repository|

#### Scheduler
|Metrics|Type|Description|
|-|-|-|
|scheduler.trigger.count|`COUNTER`|Count of trigger found|
|scheduler.evaluate.running.count|`COUNTER`|Evaluation of trigger actually running (aka: number of threads used by the scheduler)|
|scheduler.evaluate.duration|`TIMER`|Duration of evaluation of trigger|


### Others metrics

It will also expose all internal metrics from :
- [Micronaut](https://micronaut-projects.github.io/micronaut-micrometer/latest/guide/)
- [Kafka](https://kafka.apache.org/documentation/#remote_jmx)
- Thread pools of the application
- ...

Some additional information can be found on [Micronaut documentation](https://micronaut-projects.github.io/micronaut-micrometer/latest/guide/)


## Grafana or Kibana
Since Elasticsearch is used to store all executions & metrics, you can easily make a dashboard with
[Grafana](https://grafana.com/) or [Kibana](https://www.elastic.co/kibana) in order to follow your Kestra instance.

In a near future, we will provide a template dashboard as a quick start.


## Kestra endpoints

Kestra exposes internal endpoints on the management port (8081 by default) to provide status corresponding to the [server type](../../08.architecture.md#the-kestra-server-components):

* `/worker`: will expose all currently running tasks on this worker.
* `/scheduler`: will expose all currently scheduled flows on this scheduler with the next date.
* `/kafkastreams`: will expose all [Kafka Streams](https://kafka.apache.org/documentation/streams/) states and aggregated store lag.
* `/kafkastreams/{clientId}/lag`: will expose details lag for a `clientId`.
* `/kafkastreams/{clientId}/metrics`: will expose details metrics for a `clientId`.

## Other Micronaut default endpoints
Since Kestra is based on [Micronaut](https://micronaut.io), the [default Micronaut endpoints](https://docs.micronaut.io/latest/guide/index.html#providedEndpoints) are enabled by default on port 8081 :

* `/info` [Info Endpoint](https://docs.micronaut.io/snapshot/guide/index.html#infoEndpoint) with git status information.
* `/health` [Health Endpoint](https://docs.micronaut.io/snapshot/guide/index.html#healthEndpoint) usable as an external heathcheck for the application.
* `/loggers` [Loggers Endpoint](https://docs.micronaut.io/snapshot/guide/index.html#loggersEndpoint) allows changing logger level at runtime.
* `/metrics` [Metrics Endpoint](https://docs.micronaut.io/snapshot/guide/index.html#metricsEndpoint) metrics in JSON format.
* `/env` [Environment Endpoint](https://docs.micronaut.io/snapshot/guide/index.html#environmentEndpoint) to debug configuration files.

You can disable some endpoints following Micronaut configuration above.
