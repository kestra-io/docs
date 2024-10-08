---
title: System Flows
icon: /docs/icons/admin.svg
editions: ["OSS", "EE"]
version: ">= 0.19.0"
---

How to overwrite the default namespace for system flows.

By default, the `system` namespace is reserved for [System Flows](../05.concepts/system-flows.md). These background workflows are intended to perform routine tasks such as sending alerts and purging old logs. If you want to overwrite the name used for System Flows, use the following configuration:

```yaml
kestra:
  system-flows:
    namespace: system
```
