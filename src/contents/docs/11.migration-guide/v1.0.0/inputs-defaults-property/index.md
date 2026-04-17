---
title: Input Default Values Are Now Dynamically Rendered
h1: Input Default Values Now Support Dynamic Rendering in 1.0.0
icon: /src/contents/docs/icons/migration-guide.svg
release: 1.0.0
editions: ["OSS", "EE"]
description: Details on the change to dynamic rendering for input default values in Kestra 1.0.0.---


## Input defaults are now dynamic

The `defaults` property of all inputs is now dynamic. This change has implications for users who use a Pebble [expression](../../../expressions/index.mdx) as a default value. Consider this use case:

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
