---
title: Logging Configuration
icon: /docs/icons/admin.svg
---

Here you will find the necessary information for configuring the logging of your Kestra cluster.

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


## `micronaut.server.netty.access-logger`: Access Log configuration
- `micronaut.server.netty.access-logger.enabled`: enable access log from webserver (default `true`).
- `micronaut.server.netty.access-logger.name`: logger name (default `io.kestra.webserver.access`).
- `micronaut.server.netty.access-logger.format`: access log format (default `"%{yyyy-MM-dd'T'HH:mm:ss.SSS'Z'}t | %r | status: %s | ip: %a | length: %b | duration: %D"`).
- `micronaut.server.netty.access-logger.exclusions`: list of regexp to define which log to exclude.

Here is the default values:

```yaml
micronaut:
  server:
    netty:
      access-logger:
        enabled: true
        name: io.kestra.webserver.access
        format: "[Date: {}] [Duration: {} ms] [Method: {}] [Url: {}] [Status: {}] [Length: {}] [Ip: {}] [Port: {}]"
        exclusions:
          - /ui/.+
          - /health
          - /prometheus
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