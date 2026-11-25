---
title: Observability & Networking Configuration in Kestra
h1: Configure Telemetry, Logs, Metrics & SSL in Kestra
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

You can also suppress execution-scoped logs globally:

```yaml
logger:
  levels:
    execution: 'OFF'
    task: 'OFF'
    trigger: 'OFF'
```

Or scope suppression to a specific flow, task, or trigger by appending the flow ID and optionally the task or trigger ID:

```yaml
logger:
  levels:
    execution.hello-world: 'OFF'
    task.hello-world: 'OFF'
    trigger.hello-world: 'OFF'
    task.hello-world.log: 'OFF'
    trigger.hello-world.schedule: 'OFF'
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

Kestra uses [Logback](https://logback.qos.ch/) for logging. To use a custom `logback.xml`, pass it via `JAVA_OPTS`:

```shell
export JAVA_OPTS="-Dlogback.configurationFile=file:/path/to/logback.xml"
```

GCP structured logging:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">
  <include resource="logback/base.xml" />
  <include resource="logback/gcp.xml" />
  <root level="WARN">
    <appender-ref ref="CONSOLE_JSON_OUT" />
    <appender-ref ref="CONSOLE_JSON_ERR" />
  </root>
</configuration>
```

ECS format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="true">
  <include resource="logback/base.xml" />
  <include resource="logback/ecs.xml" />
  <root level="WARN">
    <appender-ref ref="CONSOLE_ECS_OUT" />
    <appender-ref ref="CONSOLE_ECS_ERR" />
  </root>
</configuration>
```

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

This creates a tag named `label_<key>` for each configured label. When an execution does not have a configured label key, the tag value is set to `__none__`, which keeps the set of tag keys stable and avoids metric series fragmentation.

For example, with `country` and `environment` configured, an execution that has `country=Germany` but no `environment` label produces:

```plaintext
kestra_executions_total{flow_id="my-flow",namespace_id="default",state="SUCCESS",label_country="Germany",label_environment="__none__"} 1
```

To collect metrics from other service instances and re-expose them on the webserver's monitoring endpoint, use `sharedServiceInstanceMetrics`. Each key is a service type (`EXECUTOR`, `INDEXER`, `SCHEDULER`, `WEBSERVER`, `WORKER`, `SYSTEM_WORKER`, `CONTROLLER`) and each value is a list of fully-qualified metric names that the service publishes in its heartbeat:

```yaml
kestra:
  metrics:
    sharedServiceInstanceMetrics:
      WORKER:
        - kestra.worker.job.thread
        - kestra.worker.max.concurrency
        - kestra.worker.running.count
```

See [Service Instance Metrics](../../10.administrator-guide/service-instance-metrics/index.md) for details.

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
      mixed: true
    read-idle-timeout: 60m
    write-idle-timeout: 60m
    idle-timeout: 60m
    netty:
      max-chunk-size: 10MB
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

- disabling the UI to run the webserver API-only
- Google Analytics ID
- a custom HTML title and additional HTML tags
- security response headers

Examples:

```yaml
kestra:
  webserver:
    google-analytics: G-XXXXXXXXXX
```

`html-title` sets the browser tab title, and `html-head` is a single string of HTML inserted into the page head:

```yaml
kestra:
  webserver:
    html-title: Kestra Production
    html-head: "<script>/* custom tag */</script>"
```

Platform emails for invitations and notifications use the Enterprise Edition [mail service](../06.enterprise-and-advanced/index.md#mail-service), configured under `kestra.ee.mail-service`.

### Default time range for charts

`kestra.ui.charts.default-duration` sets the time range the UI applies when you haven't selected one: on dashboards, on the flow and namespace overview charts, and on lists that filter by date. It takes an ISO 8601 duration and defaults to `PT24H`. For example, to show the last 7 days by default:

```yaml
kestra:
  ui:
    charts:
      default-duration: P7D
```

### Security response headers

Kestra adds browser security response headers to every HTTP response, including error responses (401, 403) and static file responses.

Three headers are enabled by default:

| Header | Default value |
|---|---|
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

Two additional headers are disabled by default:

| Header | When emitted |
|---|---|
| `Content-Security-Policy` | When `content-security-policy` is set to a non-blank value |
| `Strict-Transport-Security` | When `strict-transport-security` is set and the request is HTTPS (see [HSTS behind a reverse proxy](#hsts-behind-a-reverse-proxy)) |

Each header is added only if not already present in the response.

Configuration reference:

| Property | Type | Default | Description |
|---|---|---|---|
| `kestra.webserver.security-headers.enabled` | boolean | `true` | Master toggle. When `false`, the filter is not created and no headers are added. |
| `kestra.webserver.security-headers.frame-options` | string | `SAMEORIGIN` | Value for `X-Frame-Options`. Set to `""` to disable this header only. |
| `kestra.webserver.security-headers.content-type-options` | string | `nosniff` | Value for `X-Content-Type-Options`. Set to `""` to disable this header only. |
| `kestra.webserver.security-headers.referrer-policy` | string | `strict-origin-when-cross-origin` | Value for `Referrer-Policy`. Set to `""` to disable this header only. |
| `kestra.webserver.security-headers.content-security-policy` | string | (absent) | Value for `Content-Security-Policy`. Not set unless configured. |
| `kestra.webserver.security-headers.content-security-policy-report-only` | boolean | `false` | When `true`, the CSP value is sent under `Content-Security-Policy-Report-Only` instead of `Content-Security-Policy`. Use this to test a policy before enforcing it. |
| `kestra.webserver.security-headers.strict-transport-security` | string | (absent) | Value for `Strict-Transport-Security`. Not set unless configured, and only emitted on HTTPS requests. |

Enable CSP in report-only mode — report-only sends the policy without blocking any resources, so you can test that your CSP does not break any Kestra UI functionality before switching to enforcement:

```yaml
kestra:
  webserver:
    security-headers:
      content-security-policy: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' wss:; frame-ancestors 'none'"
      content-security-policy-report-only: true
```

Remove `content-security-policy-report-only` or set it to `false` to switch from reporting to enforcement.

Disable an individual header by setting its value to an empty string:

```yaml
kestra:
  webserver:
    security-headers:
      frame-options: ""
```

Disable all security headers:

```yaml
kestra:
  webserver:
    security-headers:
      enabled: false
```

#### HSTS behind a reverse proxy

Kestra treats a request as HTTPS when it terminates TLS itself, or when the request carries `X-Forwarded-Proto: https` or a `Forwarded` header with `proto=https`. When a reverse proxy such as nginx, Traefik, AWS ALB, or Cloudflare terminates TLS and forwards plain HTTP, configure it to send one of these headers. Otherwise, Kestra does not send `Strict-Transport-Security`.

The same check sets the `Secure` attribute on Kestra's cookies. See [Secure cookies](#secure-cookies).

### Secure cookies

Kestra sets the `Secure` attribute on the cookies it issues when the request is HTTPS, using the same check as [HSTS](#hsts-behind-a-reverse-proxy). This covers the basic authentication session cookies, the CSRF token cookie, and, in the Enterprise Edition, the JWT, refresh token, OIDC, and SAML logout cookies.

Set `kestra.webserver.cookies.secure` to override the per-request check:

| Value | Behavior |
|---|---|
| Unset (default) | `Secure` is set on HTTPS requests, including requests forwarded with `X-Forwarded-Proto: https` or `Forwarded: proto=https`. |
| `true` | `Secure` is always set. Use this when your proxy terminates TLS but does not send a forwarded protocol header. |
| `false` | `Secure` is never set. |

```yaml
kestra:
  webserver:
    cookies:
      secure: true
```

Browsers do not send a cookie with `Secure` over plain HTTP, so set `true` only when users reach Kestra over HTTPS. This setting does not affect `Strict-Transport-Security`.

### Disabling the UI (API-only mode)

The bundled web UI is enabled by default. Set `kestra.webserver.ui.enabled` to `false` to run the webserver as an API-only service — useful when Kestra is driven entirely through the REST API or fronted by your own application, and you don't want the UI exposed.

```yaml
kestra:
  webserver:
    ui:
      enabled: false
```

When the UI is disabled:

- requests to `/ui/**` return `404`, and `/` no longer redirects to the UI;
- the REST API (`/api/v1/**`) and health endpoints keep working as usual.

The setting can also be provided through the `KESTRA_WEBSERVER_UI_ENABLED` environment variable.

### Default flow template

`kestra.flowTemplate` sets the YAML that opens in the editor when someone creates a flow from scratch. Use it to give every team the same starting point, such as standard labels or error handling. Kestra adds `id` and `namespace` when the template leaves them out, and keeps them when it sets them.

```yaml
kestra:
  flowTemplate: |
    labels:
      team: data
    tasks:
      - id: hello
        type: io.kestra.plugin.core.log.Log
        message: Hello World!
```

The template doesn't apply to flows created from a blueprint. Users can replace it with their own template in the **Default Flow Template** preference, described on the [Settings](../../09.ui/06.settings/index.md#preferences) page. When neither template is set, the editor opens a built-in Hello World flow.

### File preview rows

`kestra.server.preview.initial-rows` sets how many rows a file preview shows when it opens, and defaults to `100`. `kestra.server.preview.max-rows` caps how many rows a user can request in the preview or through the API's `maxRows` parameter, and defaults to `5000`.

```yaml
kestra:
  server:
    preview:
      initial-rows: 200
      max-rows: 10000
```

### Hidden label prefixes

`kestra.hidden-labels.prefixes` lists the label prefixes that the UI hides by default. The default list is `system.` and `internal.`. Setting the property replaces that list, so include both prefixes if you still want those labels hidden:

```yaml
kestra:
  hidden-labels:
    prefixes:
      - system.
      - internal.
      - admin.
```

See [Hidden labels](../../06.concepts/system-labels/index.md#hidden-labels) for how hidden labels appear in the UI.

### Query filter limits

`kestra.webserver.query-filter.max-depth` and `kestra.webserver.query-filter.max-width` cap how deeply API filter groups can nest and how many filters or groups each one holds. They default to `3` and `20`, and lower values are raised to the defaults. To set different limits for one resource, add them under `resources`, keyed by the resource name in lowercase, such as `execution` or `flow`. This example allows 30 filters per group on every endpoint and 50 on execution endpoints:

```yaml
kestra:
  webserver:
    query-filter:
      max-width: 30
      resources:
        execution:
          max-width: 50
```

A request over the limit is rejected with an `invalid-query-filters` error. See [Query filters](../../api-reference/04.query-filters.md#limits).

## Typical use cases

Use this section when you need to:

- expose Kestra behind a reverse proxy
- enable HTTPS
- adjust access log format for GCP or ECS
- configure Prometheus-style metrics ingestion
- change management endpoint behavior
- configure security response headers (CSP, HSTS, framing)
- set the `Secure` attribute on cookies behind a reverse proxy
