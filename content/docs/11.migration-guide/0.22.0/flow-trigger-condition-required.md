---
title: Flow trigger now requires a condition
icon: /docs/icons/migration-guide.svg
release: 0.22.0
editions: ["OSS", "EE"]
---

Flow trigger now requires at least one condition

## Overview

So far, users could create a `Flow` trigger without any conditions, which is usually not intended as it would imply that such flow is triggered after any execution in any state of any workflow within your instance. We’ve seen that typically, a Flow trigger without any conditions was a user mistake (some users forgot to add conditions), which could result in the worst case in an instance crash due to a massive number of unplanned executions.

To make the system safer, we now require at least one condition on the `Flow` trigger (PR [#971](https://github.com/kestra-io/kestra/issues/971)). If, for some reason, you created such an unconditional `Flow` trigger intentionally, you can add a condition that always evaluates to `true` to keep the previous behavior.

## Before Kestra 0.22

Here is an example of a `Flow` trigger without any conditions in Kestra 0.21:

```yaml
id: myflow
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World!

triggers:
  - id: parent_flow
    type: io.kestra.plugin.core.trigger.Flow
    states:
      - FAILED
      - WARNING
```

## After Kestra 0.22

```yaml
id: myflow
namespace: company.team

tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello World!

triggers:
  - id: parent_flow
    type: io.kestra.plugin.core.trigger.Flow
    states:
      - FAILED
      - WARNING
    conditions:
      - type: io.kestra.plugin.core.condition.Expression
        expression: "true"
```