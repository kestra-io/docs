---
title: "Observability inside your Kestra flows with OpenTelemetry traces"
description: "TODO"
date: 2025-03-30T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: TODO.png
---

**Observability** refers to understanding a system's internal state by analyzing its outputs. In software, this means examining telemetry data — such as traces, metrics, and logs — to gain insights into system behavior.

OpenTelemetry is a vendor-neutral, tool-agnostic framework and toolkit for creating and managing telemetry data. It helps implement observability in software applications.

OpenTelemetry defines three different kinds of telemetry data:
- **Traces** provide a high-level view of what happens when a request is made to an application. A trace can contain multiple spans.
- **Metrics** are measurements of a service captured at runtime.
- **Logs** are timestamped text records, either structured (recommended) or unstructured, with optional metadata.

Starting with 0.21, Kestra supports all three kinds of telemetry data thanks to OpenTelemetry compatible exporters.

In this blog post, we explore how to leverage OpenTelemetry traces to monitor flow executions. For Metrics and Logs, please have a look at our dedicated page: [OpenTelemetry](/docs/09.administrator-guide/open-telemetry).

## OpenTelemetry traces

First, we need to enable OpenTelemetry traces and configure an exporter. We will use [Jaeger](https://www.jaegertracing.io/) as an OpenTelemetry collector. Jaeger is an open-source, distributed tracing platform and an essential tool for monitoring distributed workflows.

Configuring OpenTelemetry is done in three steps: enable globally, configure OTLP exporter, and enable for Kestra flows:

```yaml
# 1. Enable OpenTelemetry traces globally
micronaut:
  otel:
    enabled: false

# 2. Configure an OTLP exporter to export on localhost to the gRPC port of Jaeger
otel:
  traces:
    exporter: otlp
  exporter:
    otlp:
      endpoint: http://localhost:4317 # Jaeger OTLP/gRPC is on port 4317

# 3. Enable OpenTelemetry traces in Kestra flows
kestra:
  traces:
    root: DEFAULT

```

You can enable OpenTelemetry traces without enabling it inside Kestra flows, in this case you will only have traces accessible through the Kestra API and not inside the context of your flow executions.

You can launch Jaeger with the following Docker compose snippet:

```yaml
services:
  jaeger-all-in-one:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686" # Jaeger UI
      - "14268:14268" # Receive legacy OpenTracing traces, optional
      - "4317:4317"   # OTLP gRPC receiver
      - "4318:4318"   # OTLP HTTP receiver
      - "14250:14250" # Receive from external otel-collector, optional
    environment:
      - COLLECTOR_OTLP_ENABLED=true
```

Let's first test with an __Hello World__ flow:

```yaml
id: hello-world
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World! 🚀
```

After launching a flow execution, go to the Jaeger UI (http://localhost:16686/), select **Kestra** as a service and hit **Find Traces**.

You will see traces for every API call.

![postgres](/blogs/2025-03-30-observability-with-opentelemetry-traces/opentelemetry-traces-01.png)

Most interesting, is the trace that starts an execution, its name is **POST /api/v1/executions/{namespace}/{id}** and you can see it has 7 spans. Click on it and you will see the detail of the span.

![postgres](/blogs/2025-03-30-observability-with-opentelemetry-traces/opentelemetry-traces-02.png

The trace starts inside the API, then you can see 6 spans inside Kestra itself, those spans are children of the API span. Each span has a duration and is displayed as a timeline.

Inside Kestra, there a multiple kinds of spans, but two to make special note of:
- **EXECUTOR**: spans created inside the Executor each time an execution message is processed (for each change on the execution).
- **WORKER** : spans created inside the Worker each time it executes a task or a trigger.

If you click on a span, you will see additional information stored inside the span. Here I also clicked on **Tags** to see all tags.

![postgres](/blogs/2025-03-30-observability-with-opentelemetry-traces/opentelemetry-traces-03.png

As you can see, retrievable inside the span is a multitude of useful execution information such as namespace, flow id, execution id and an uid, which for a task execution is the task run id.

## Correlation between a parent flow and a subflow

Critical to orchestration, is the relationship between distributed workflows. To monitor the correlation of flows, let's define a flow that will start a subflow of the `hello-world` flow on each execution:

```yaml
id: parent
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: I'm your father
  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    namespace: company.team
    flowId: hello-world
```

If you start one execution and look for its trace, you will see 19 spans and a correlated sub-trace for the subflow execution.

![postgres](/blogs/2025-03-30-observability-with-opentelemetry-traces/opentelemetry-traces-04.png

You can see in the parent flow execution a span named **EXECUTOR - io.kestra.plugin.core.flow.Subflow**; this is the Subflow task that creates it. Next, you can see a correlated trace with the 7 spans of the subflow execution.

## Correlation between incoming and outgoing HTTP calls

As we already saw, all calls to the API will create new traces. But if the call is made by a system that instruments HTTP calls via the standard OpenTelemetry traces headers; they will be correlated to the call of the API.

In the same manner, each HTTP call done by a Kestra task will send the standard OpenTelemetry traces headers. If the target HTTP server supports OpenTelemetry, its traces will be correlated with the traces started inside Kestra.

TODO find a sentence to explain that it's super cool to have a global monitoring of your system with traces...

In the following screenshot, you can see a trace starting in an external service called **upstream**.
This service will trigger a new flow execution via a webhook. Then this flow will use a `io.kestra.plugin.core.http.Request` task that will call the **downstream** external service.
Finally, you can see a trace inside the **downstream** external service for the `/hello` HTTP endpoint.

![postgres](/blogs/2025-03-30-observability-with-opentelemetry-traces/opentelemetry-traces-05.png

## Conclusion

TODO
