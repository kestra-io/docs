---
title: Debugging techniques
---

Without any order, here are debugging techniques that administrators can use to understand their issues:

## Enable verbose log
Kestra had some [management endpoints](./index.md#other-micronaut-default-endpoints) including one that allows changing logging verbosity at run time.

Inside the container (or in local if standalone jar is used), send this command to enable very verbose logging:

```shell
curl -i -X POST -H "Content-Type: application/json" \
  -d '{ "configuredLevel": "TRACE" }' \
  http://localhost:8081/loggers/io.kestra
```

Alternatively, you can change logging levels on configuration files:

```yaml
logger:
  levels:
    io.kestra.core.runners: TRACE
```

## Take a thread dump

You can request a thread dump via the `/threaddump` endpoint available on the management port (8081 if not configured otherwise).