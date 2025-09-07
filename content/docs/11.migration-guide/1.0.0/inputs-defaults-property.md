---
title: Input defaults are now dynamic
icon: /docs/icons/migration-guide.svg
release: 1.0.0
editions: ["OSS", "EE"]
---

## Overview

The `defaults` property of all inputs is now dynamic. This change has implications for users who use a Pebble [expression](../../expressions/index.md) as a default value. Consider this use case:

```yaml
id: session
namespace: company.team

inputs:
  - id: sessionId
    type: STRING
    defaults: "{{ execution.id }}"   

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "This is my session id: {{render(inputs.sessionId)}}"
```

Given that the `defaults` are now dynamically rendered, the above flow will fail in Kestra 0.24 and higher, unless you move the expression to the tasks as follows:

```yaml
id: session
namespace: company.team

inputs:
  - id: sessionId
    type: STRING
    required: false

tasks:
  - id: log
    type: io.kestra.plugin.core.log.Log
    message: "This is my session id: {{ inputs.sessionId ?? execution.id }}"
```
