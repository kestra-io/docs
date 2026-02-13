---
title: Align JVM CPU Limits on Kubernetes
sidebarTitle: JVM CPU Limits
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
description: Configure the Kestra Helm chart to force the JVM to honor Kubernetes CPU limits, preventing pods from over-consuming resources.
---

Force the JVM to match Kubernetes CPU limits through the Kestra Helm chart.

Kestra pods on some Kubernetes clusters can exceed their CPU and memory limits because the Java Virtual Machine (JVM) does not always read cgroup data correctly. This guide explains how to align the JVM with [Kubernetes](../../02.installation/03.kubernetes/index.md) constraints using the Kestra Helm chart and the `-XX:ActiveProcessorCount` flag. For broader deployment guidance, see [High Availability](../high-availability/index.md) and [Monitoring](../03.monitoring/index.md).

## Why JVM sizing can ignore Kubernetes limits

Kubernetes enforces container limits with cgroups, but the JVM may still detect the host capacity instead of the constrained container. When that happens:

- Netty and other pools size themselves for the full node.
- The pod uses more memory and threads than its limits allow and can be killed by the OOM killer.

This behavior depends on the cluster runtime and cgroup configuration, so a consistent fix must live in the Helm chart rather than in the application code.

## Use `-XX:ActiveProcessorCount` to align CPU detection

`-XX:ActiveProcessorCount` lets you tell the JVM how many CPUs to see. Using it inside the Kestra container makes internal pools scale to the CPU count that matches your Kubernetes limits:

```bash
java -XX:ActiveProcessorCount=2 -jar kestra.jar
```

Because many clusters already expose cgroup data correctly, the Helm chart keeps this flag optional and configurable.

## Configure the Kestra Helm chart

The chart adds a dedicated JVM section in `values.yaml`:

```yaml
common:
  jvm:
    forceActiveProcessors:
      enabled: false
      count: "auto"           # "auto" or "value"
      value: 2                # only used when count = "value"
    extraOpts: ""
```

- `enabled`: toggle the feature (disabled by default).
- `count`:
  - `"auto"` derives the CPU count from `resources.limits.cpu`.
  - `"value"` uses a fixed number.
- `value`: CPU count when `count` is set to `"value"`.
- `extraOpts`: additional JVM flags; the chart prepends `-XX:ActiveProcessorCount` when enabled.

### Derive CPU count automatically

Auto mode reads `resources.limits.cpu`, supports values such as `"250m"`, `"1"`, or `"1.5"`, converts them to an integer CPU count (minimum 1), and injects:

```text
-XX:ActiveProcessorCount=<computed value>
```

Example:

```yaml
common:
  resources:
    limits:
      cpu: "250m"
  jvm:
    forceActiveProcessors:
      enabled: true
      count: "auto"
```

This yields `KESTRA_JAVA_OPTS="-XX:ActiveProcessorCount=1"` for the pod.

### Provide an explicit CPU value

If you prefer a fixed number, switch to `"value"`:

```yaml
common:
  jvm:
    forceActiveProcessors:
      enabled: true
      count: "value"
      value: 3
```

This sets `KESTRA_JAVA_OPTS="-XX:ActiveProcessorCount=3"`, which can be useful to keep the JVM more conservative than the container limit.

### Override per component

Different components can use different CPU counts. Component overrides take precedence over the global setting:

```yaml
common:
  jvm:
    forceActiveProcessors:
      enabled: true
      count: "value"
      value: 2

deployments:
  standalone:
    enabled: true
    jvm:
      forceActiveProcessors:
        enabled: true
        count: "value"
        value: 5
```

## How the chart applies the setting

- The Helm helper computes the CPU count from the global `common.jvm.forceActiveProcessors`, any component override, and the component `resources.limits.cpu` (falling back to `common.resources.limits.cpu`).
- It builds `KESTRA_JAVA_OPTS`, adding `-XX:ActiveProcessorCount=<N>` when enabled and appending `extraOpts`.
- The container exports `KESTRA_JAVA_OPTS`, and the Kestra start script runs `exec java ${KESTRA_JAVA_OPTS} ${JAVA_OPTS} ...`.

## When to enable it

Enable `forceActiveProcessors` when pods hit OOMs or thread pools scale as if the full node is available. Start with auto mode so the JVM mirrors your Kubernetes CPU limits:

```yaml
common:
  resources:
    limits:
      cpu: "2"
  jvm:
    forceActiveProcessors:
      enabled: true
      count: "auto"
```

If your pods already respect limits, keep the feature disabled. Combine this setting with your existing Helm configuration in [High Availability](../high-availability/index.md) to scale components safely and monitor the impact using [Prometheus metrics](../prometheus-metrics/index.md).
