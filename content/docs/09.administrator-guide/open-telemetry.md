---
title: Open Telemetry
icon: /docs/icons/admin.svg
version: ">= 0.21.0"
---

**Observability** is the ability to understand the internal state of a system from the outside without knowing its inner workings.
In the context of software, this means being able to understand the internal state of a system by examining its telemetry data, which includes traces, metrics, and logs.

**OpenTelemetry** is a vendor neutral and tool-agnostic framework and toolkit designed to create and manage telemetry data.
It helps implements observability in software programs.

OpenTelemetry defines three different kinds of telemetry data:
- **Traces** give us the big picture of what happens when a request is made to an application. Traces can contain multiple spans.
- **Metrics** are measurements of a service captured at runtime.
- **Logs** are timestamped text records, either structured (recommended) or unstructured, with optional metadata.

Starting with 0.21, Kestra supports all three kinds of telemetry data thanks to OpenTelemetry compatible exporters.

## Traces

::alert{type="info"}
This is a beta feature.
::

The first step is to enable distributed traces inside the Kestra configuration file:

```yaml
kestra:
  traces:
    # Enable traces inside Kestra flow executions
    root: DEFAULT
otel:
  traces:
    # Here we define an exporter, only otlp is supported at the moment
    exporter: otlp
  exporter:
    otlp:
      # This is the address of the collector, here we point to the gRPC collector deployed in localhost.
      # Change this to match the address of your own collector.
      endpoint: http://localhost:4317
```

When enabled, Kestra will instrument:
- All calls to its API,
- All flow executions by creating one span by task execution and one span each time the Executor will process an execution message,
- External HTTP calls made by the HTTP tasks (including tasks that use our HTTP client under the cover).

Kestra will propagate the trace context so that traces are correlated:
- The trace of an API call will be correlated with the execution it creates.
- The trace of a flow execution will be correlated with the parent flow when the `Subflow` or `ForEachItem` task is used.
- External HTTP calls will include the standard propagation header so correlation would happen to downstream systems.

The following screenshot is for traces created inside [Jaeger](https://www.jaegertracing.io), an OpenTelemetry compatible tracing platform.

You can see three traces, all correlated:
- One created from the API call that creates the execution,
- One created from an execution of a flow named `opentelemetry_parent` which have a bunch of spans, one of them is for a `Subflow` task that will create an execution of the flow `opentelemetry_basic`,
- One created from an execution of a flow named `opentelemetry_basic`.

![Traces example](/docs/administrator-guide/opentelemetry_traces.png)

Kestra traces inside flow executions can be disabled while keeping traces inside the API by disabling the Kestra tracer:

```yaml
kestra:
  traces:
    # Disable traces inside Kestra flows
    root: DISABLED
```

You can also disable traces at the component level, this is still experimental and propagation may not work properly, for e.g., if the tracer is disabled in the Executor but still enabled in other components.

```yaml
kestra:
  traces:
    # Enable traces inside Kestra flows
    root: DEFAULT
    categories:
      # Disable traces inside the Executor
      io.kestra.core.runners.Executor: DISABLED
```

Supported categories are:
- `io.kestra.core.runners.Executor`: creates spans for each message in the execution queue.
- `io.kestra.core.runners.Worker`: creates spans for each runnable tasks execution.
- `io.kestra.plugin.core.flow.Subflow`: creates spans for each `Subflow` task execution.
- `io.kestra.plugin.core.flow.ForEachItem`: creates spans for each `ForEachItem`task execution.

You can disable multiple tracer in one configuration item using a category prefix, for e.g., `io.kestra.plugin.core.flow` will disable traces for both the `Subflow` and the `ForEachItem` tasks.

## Metrics

To send metrics to an OpenTelemetry compatible collector, you need to add the following configuration to your Kestra configuration file:

```yaml
micronaut:
  metrics:
    export:
      otlp:
        enabled: true
        # This is the address of the collector, here we point to the HTTP collector deployed in localhost.
        # Change this to match the address of your own collector.
        url: http://localhost:4318/v1/metrics
```

## Logs

To send logs to an OpenTelemetry compatible collector, you can use the new [LogShipper](TODO) functionality with the builtin OpenTelemetry log exported. This is a Kestra [Enterprise Edition](/enterprise) feature.

The following flow will send logs from all flows to an OpenTelemetry compatible collector daily.

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
        # This is the address of the collector, here we point to the HTTP collector deployed in localhost.
        # Change this to match the address of your own collector.
        otlpEndpoint: http://localhost:4318/v1/logs
```