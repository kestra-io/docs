---
title: OpenTelemetry
icon: /docs/icons/admin.svg
version: ">= 0.21.0"
---

**Observability** refers to understanding a system's internal state by analyzing its outputs. In software, this means examining telemetry data—such as traces, metrics, and logs—to gain insights into system behavior.

**OpenTelemetry** is a vendor-neutral, tool-agnostic framework and toolkit for creating and managing telemetry data.
It helps implement observability in software applications.

OpenTelemetry defines three different kinds of telemetry data:
- **Traces** provide a high-level view of what happens when a request is made to an application. A trace can contain multiple [spans](https://opentelemetry.io/docs/concepts/signals/traces/#spans).
- **Metrics** are measurements of a service captured at runtime.
- **Logs** are timestamped text records, either structured (recommended) or unstructured, with optional metadata.

Starting with 0.21, Kestra supports all three kinds of telemetry data thanks to OpenTelemetry compatible exporters. For more details about OpenTelemetry, check out the [OpenTelemetry official documentation](https://opentelemetry.io/docs/).

## Traces

::alert{type="info"}
Exporting trace data in Kestra is currently a Beta feature.
::

The first step is to enable distributed traces inside the Kestra configuration file:

```yaml
kestra:
  traces:
    root: DEFAULT  # Enable traces inside Kestra flow executions
otel:
  traces:
    exporter: otlp # Here we define an exporter, only otlp is supported for now
  exporter:
    otlp:
      endpoint: http://localhost:4317 # This is the address of the collector, here we point to the gRPC collector deployed in localhost. Replace to match the address of your own collector.
```

When enabled, Kestra instruments:
- All calls to its API
- All flow executions by creating one span by task execution and one span each time the Executor processes an execution message
- External HTTP calls made by the HTTP tasks (including tasks that use the Kestra HTTP client under the cover)

Kestra propagates the trace context so that traces are correlated:
- The API call trace correlates with the execution it creates.
- The flow execution trace correlates with the parent flow when the `Subflow` or `ForEachItem` task is used.
- External HTTP calls include the standard propagation header so correlation happens with downstream systems.

Enable [Jaeger](https://www.jaegertracing.io), and OpenTelemetry compatible tracing platform, with Kestra in a docker-compose configuration file with the following:

```yaml
services:
  restart: on-failure

  postgres:
    image: postgres:14.13
    environment:
      POSTGRES_DB: kestra_unit
      POSTGRES_USER: kestra
      POSTGRES_PASSWORD: k3str4
    ports:
      - 5432:5432
    restart: on-failure

  jaeger-all-in-one:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"  # Jaeger UI
      - "14268:14268"  # Receive legacy OpenTracing traces, optional
      - "4317:4317"    # OTLP gRPC receiver
      - "4318:4318"    # OTLP HTTP receiver
      - "14250:14250"  # Receive from external otel-collector, optional
    environment:
      - COLLECTOR_OTLP_ENABLED=true
```

The following screenshot displays traces created inside Jaeger:

You can see three traces, all correlated:
- One created from the API call that creates the execution
- One created from an execution of a flow named `opentelemetry_parent` which has several spans, including one for a `Subflow` task that creates an execution of the flow `opentelemetry_basic`
- One created from an execution of a flow named `opentelemetry_basic`

![Traces example](/docs/administrator-guide/opentelemetry_traces.png)

Kestra traces inside flow executions can be disabled while keeping traces inside the API by disabling the Kestra tracer:

```yaml
kestra:
  traces:
    root: DISABLED # Disable traces inside Kestra flows
```

You can also disable traces at the component level. However, this feature is still experimental, and propagation may not work properly. For example, if the tracer is disabled in the Executor but remains enabled in other components, issues may arise.

```yaml
kestra:
  traces:
    root: DEFAULT # Enable traces inside Kestra flows
    categories:
      io.kestra.core.runners.Executor: DISABLED # Disable traces inside the Executor
```

Supported categories are:
- `io.kestra.core.runners.Executor`: creates spans for each message in the execution queue.
- `io.kestra.core.runners.Worker`: creates spans for each runnable tasks execution.
- `io.kestra.plugin.core.flow.Subflow`: creates spans for each `Subflow` task execution.
- `io.kestra.plugin.core.flow.ForEachItem`: creates spans for each `ForEachItem`task execution.

You can disable multiple tracers in one configuration item using a category prefix. For example, `io.kestra.plugin.core.flow` disables traces for both the `Subflow` and the `ForEachItem` tasks.

## Metrics

To send metrics to an OpenTelemetry compatible collector, add the following parameters to your Kestra configuration file:

```yaml
micronaut:
  metrics:
    export:
      otlp:
        enabled: true
        url: http://localhost:4318/v1/metrics # This is the address of the collector, here we point to the HTTP collector deployed in localhost. Replace to match the address of your own collector.
```

## Logs

To send logs to an OpenTelemetry compatible collector, use the new [LogShipper](../06.enterprise/02.governance/logshipper.md) functionality with the built-in OpenTelemetry log exporter. LogShipper is available in the Kestra [Enterprise Edition](/enterprise).

The following flow sends logs from all flows to an OpenTelemetry compatible collector daily:

```yaml
id: log_shipper
namespace: company.team

triggers:
  - id: daily
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "@daily"

tasks:
  - id: log_export
    type: io.kestra.plugin.ee.core.log.LogShipper
    logExporters:
      - id: OTLPLogExporter
        type: io.kestra.plugin.ee.opentelemetry.LogExporter
        otlpEndpoint: http://localhost:4318/v1/logs # This is the address of the collector, here we point to the HTTP collector deployed in localhost. Replace to match the address of your own collector.
```
