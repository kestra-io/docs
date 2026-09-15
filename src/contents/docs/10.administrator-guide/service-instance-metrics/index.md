---
title: Service Instance Metrics in Kestra – Expose via the Webserver
description: Configure the webserver to collect and expose metrics from other Kestra service instances, making them available through a single monitoring endpoint.
sidebarTitle: Service Instance Metrics
icon: /src/contents/docs/icons/admin.svg
---

Configure which service instance metrics the webserver collects and re-exposes through its monitoring endpoint.

## Service instance metrics – expose via the webserver

By default, each Kestra service (Worker, Executor, Scheduler, and so on) publishes its own metrics on its own management port. In deployments where only the webserver is reachable from the outside — for example, behind an ingress or a load balancer — metrics from other service instances are not directly accessible.

The `kestra.metrics.sharedServiceInstanceMetrics` configuration lets you define a set of metrics per service type that the webserver will collect from all running instances and re-expose on its own monitoring endpoint. This gives any compatible monitoring consumer a single scrape target for the metrics you choose.

## How it works

The webserver runs a background task that polls the service instance repository every 30 seconds. For each running service instance whose type is listed in `sharedServiceInstanceMetrics`, it collects the configured metrics, sums the values across all instances of that type, and registers the results as Micrometer gauges. The webserver itself is excluded from this aggregation.

Metric tags are preserved, so you can still filter by dimensions such as `worker_group`.

When a service instance is no longer active, its contribution is set to zero at the next poll cycle.

## How to configure `sharedServiceInstanceMetrics`

Set `kestra.metrics.sharedServiceInstanceMetrics` in your [configuration file](../../configuration/03.observability-and-networking/index.md). The value is a map where each key is a service type and each value is a list of fully-qualified metric names to collect from instances of that type. Kestra ships with the following defaults:

```yaml
kestra:
  metrics:
    prefix: kestra
    sharedServiceInstanceMetrics:
      WORKER:
        - kestra.worker.job.pending
        - kestra.worker.job.thread
        - kestra.worker.job.running
```

You can extend or replace these entries to expose any metric listed in the [Alerting and Monitoring](../03.monitoring/index.md) reference.

:::alert{type="info"}
Metric names must include the prefix (e.g. `kestra.`) as configured in `kestra.metrics.prefix`.
:::

### Configuration properties

| Property | Type | Description |
|---|---|---|
| `kestra.metrics.sharedServiceInstanceMetrics` | `Map<ServiceType, List<String>>` | Maps each service type to the metric names to collect and expose via the webserver. Defaults to an empty map. |
| Key | `ServiceType` | One of `EXECUTOR`, `INDEXER`, `SCHEDULER`, `WEBSERVER`, `WORKER` |
| Value | List of `String` | Fully-qualified metric names to collect from instances of that type, including the configured prefix |

## Next steps

- [Prometheus Metrics](../prometheus-metrics/index.md) — scrape Kestra metrics using Prometheus
- [OpenTelemetry](../open-telemetry/index.md) — export Kestra metrics using OpenTelemetry
- [Alerting and Monitoring](../03.monitoring/index.md) — full metrics reference for each service component
- [Observability and Networking Configuration](../../configuration/03.observability-and-networking/index.md) — configure the metrics prefix, tags, and label-based metrics
- [Server Components](../../08.architecture/02.server-components/index.md) — understand the role of each Kestra service
