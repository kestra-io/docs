---
title: Logging
icon: /docs/icons/admin.svg
---

Configure the logging of your Kestra cluster.

You can change the log behavior in Kestra by adjusting the following configuration parameters:

## Configure the log level

```yaml
logger:
  levels:
    io.kestra.runner: TRACE
    org.elasticsearch.client: TRACE
    org.elasticsearch.client.sniffer: TRACE
    org.apache.kafka: DEBUG
    io.netty.handler.logging: TRACE
```


## `kestra.server.access-log`: Access Log configuration
- `kestra.server.access-log.enabled`: enable access log from webserver (default `true`).
- `kestra.server.access-log.name`: logger name (default `io.kestra.webserver.access`).
- `kestra.server.access-log.format`: access log format (default `[Date: {}] [Duration: {} ms] [Method: {}] [Url: {}] [Status: {}] [Length: {}] [Ip: {}] [Port: {}]`).
- `kestra.server.access-log.filters`: list of regexp to define which log to include, use `.*` to enable all logs (default `- ".*\\[Url: /api/.*"`).

Here is the default values:

```yaml
kestra:
  server:
    access-log:
      enabled: true
      name: io.kestra.webserver.access
      format: "[Date: {}] [Duration: {} ms] [Method: {}] [Url: {}] [Status: {}] [Length: {}] [Ip: {}] [Port: {}]"
      filters:
        - ".*\\[Url: /api/.*"
```

## Log Format

We are using [Logback](https://logback.qos.ch/) to handle log. You change the format of the log format, and we provide some default and common one configuring a [logback configuration files](https://logback.qos.ch/manual/).

If you want to customize the log format, you can create a `logback.xml` file and add it to the classpath. Then, add a new `JAVA_OPTS` environment variable: `"-Dlogback.configurationFile=file:/path/to/your/configuration/logback.xml"`

We provide some predefined configuration, and some example of the `logback.xml` files:

### GCP
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

### Elastic Common Schema (ECS) format

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