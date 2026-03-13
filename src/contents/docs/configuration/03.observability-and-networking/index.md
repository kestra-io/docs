---
title: Kestra Observability and Networking Configuration
description: Configure telemetry, logs, metrics, Micronaut settings, endpoints, SSL, CORS, and webserver behavior in Kestra.
sidebarTitle: Observability and Networking
icon: /src/contents/docs/icons/admin.svg
---

Use this page for operational visibility and network-facing configuration.

## Observability

Use this section when you need to understand what Kestra emits about itself, not when you are changing task behavior. The settings here are mostly for platform operators and anyone integrating Kestra with monitoring or logging systems.

Configuration areas in this group include:

- anonymous telemetry
- logger settings
- access logs and log formatting
- metrics and label-based metrics
- Micronaut HTTP settings

These settings are useful when you need to tune visibility, log volume, request handling, or integration with monitoring platforms.

Anonymous usage reporting is enabled by default. Disable or tune it with:

```yaml
kestra:
  anonymous-usage-report:
    enabled: false
```

```yaml
kestra:
  anonymous-usage-report:
    initial-delay: 5m
    fixed-delay: 1h
```

UI usage reporting is configured separately:

```yaml
kestra:
  ui-anonymous-usage-report:
    enabled: false
```

## Logs and access logging

There are two different concerns here: application logs and HTTP access logs. Reach for `logger.levels` when you want to change verbosity inside Kestra, and Micronaut access logging when you want request-by-request HTTP visibility.

Use `logger.levels` to adjust server log verbosity:

```yaml
logger:
  levels:
    io.kestra.core.runners: TRACE
    org.apache.kafka: DEBUG
```

You can also suppress execution-scoped logs:

```yaml
logger:
  levels:
    execution: 'OFF'
    task: 'OFF'
    trigger: 'OFF'
```

Micronaut access logging is configured separately:

```yaml
micronaut:
  server:
    netty:
      access-logger:
        enabled: true
        logger-name: io.kestra.webserver.access
        log-format: "[Date: {}] [Duration: {} ms] [Method: {}] [Url: {}] [Status: {}] [Length: {}] [Ip: {}] [Port: {}]"
        exclusions:
          - /ui/.+
          - /health
          - /prometheus
```

If you need structured platform-specific logging, the full reference includes `logback.xml` examples for GCP and ECS.

## Metrics and telemetry exports

These settings are usually enabled with restraint. Metrics are broadly useful, but label-based metrics should stay limited to a small set of low-cardinality dimensions or they become expensive to store and query.

Set a metrics prefix:

```yaml
kestra:
  metrics:
    prefix: kestra
```

Add low-cardinality labels as metric tags:

```yaml
kestra:
  metrics:
    labels:
      - country
      - environment
```

This creates tags such as `label_country` and uses `__none__` when a configured label key is missing, which keeps the metric tag set stable.

For traces, metrics, and logs exported through OpenTelemetry, use the dedicated [OpenTelemetry guide](../../10.administrator-guide/open-telemetry/index.md).

## Network and HTTP settings

This section matters when Kestra is exposed behind a load balancer, reverse proxy, ingress, or private network boundary. If requests are not arriving with the expected URL, protocol, size limit, or auth behavior, the fix is often here.

Micronaut-backed settings cover:

- server port
- SSL
- timeouts
- upload size
- base path
- host resolution
- CORS
- management endpoints

Common examples:

```yaml
micronaut:
  server:
    port: 8086
```

```yaml
micronaut:
  server:
    max-request-size: 10GB
    multipart:
      max-file-size: 10GB
      disk: true
    read-idle-timeout: 60m
    write-idle-timeout: 60m
    idle-timeout: 60m
```

Reverse proxy support:

```yaml
micronaut:
  server:
    context-path: "kestra-prd"
    host-resolution:
      host-header: Host
      protocol-header: X-Forwarded-Proto
```

Enable CORS:

```yaml
micronaut:
  server:
    cors:
      enabled: true
```

Secure or move management endpoints:

```yaml
endpoints:
  all:
    basic-auth:
      username: your-user
      password: your-password
    port: 8084
```

SSL example:

```yaml
micronaut:
  security:
    x509:
      enabled: true
  ssl:
    enabled: true
  server:
    ssl:
      client-authentication: need
      key-store:
        path: classpath:ssl/keystore.p12
        password: ${KEYSTORE_PASSWORD}
        type: PKCS12
      trust-store:
        path: classpath:ssl/truststore.jks
        password: ${TRUSTSTORE_PASSWORD}
        type: JKS
```

## UI and webserver settings

These settings are lighter-weight than the Micronaut server settings above. Use them when you are customizing the user-facing web experience rather than transport-level HTTP behavior.

The webserver-related configuration also includes:

- Google Analytics ID
- additional HTML tags
- mail server settings

Examples:

```yaml
kestra:
  webserver:
    google-analytics-id: G-XXXXXXXXXX
```

```yaml
kestra:
  webserver:
    html-head:
      - "<script>/* custom tag */</script>"
```

Mail server settings are useful when you need platform emails for invitations and notifications.

## Typical use cases

Use this section when you need to:

- expose Kestra behind a reverse proxy
- enable HTTPS
- adjust access log format for GCP or ECS
- configure Prometheus-style metrics ingestion
- change management endpoint behavior

For detailed properties and examples, see [Full Reference](../99.full-reference/index.md#telemetry).
