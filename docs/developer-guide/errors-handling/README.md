---
order: 5
---
# Errors handling


## Error sample

This example processes a task which fails immediately. Then a tasks sequence is processed in the error branch of the flow.

```yaml
id: errors
namespace: org.kestra.tests

tasks:
  - id: failed
    type: org.kestra.core.tasks.scripts.Bash
    commands:
      - exit 1
errors:
  - id: 2nd
    type: org.kestra.core.tasks.debugs.Echo
    format: I'm failing {{task.id}}
    level: INFO
```

::: warning
TODO
:::