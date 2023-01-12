---
order: 4
---
# Debugging techniques

Without any order, here are debugging techniques that administrators can used to understand their issues:

## Enable verbose log
Kestra had some [endpoints](README.md#others-micronaut-default-endpoint) including one that allow changing logging verbosity at run time.

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