---
order: 4
---
# Debugging techniques

Without any order, find debugging techniques that administrator can used to understand theirs issues:

## Enable verbose log
Kestra had some [endpoints](README.md#others-micronaut-default-endpoint) and one for allowing change logging verbosity at run time.

Inside the container (or in local if standalone jar is used), just send this command to enable very verbose logging:

```shell
curl -i -X POST -H "Content-Type: application/json" \
  -d '{ "configuredLevel": "TRACE" }' \
  http://localhost:8081/loggers/io.kestra
```

Alernatively, you can change logging on configuration files:

```yaml
logger:
  levels:
    io.kestra.core.runners: TRACE
```
-