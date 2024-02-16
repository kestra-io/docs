---
title: System Flows Configuration
icon: /docs/icons/admin.svg
---

This page describes how you can overwrite the default namespace for system flows.

By default, the `system` namespace is reserved for background workflows intended to perform routine tasks such as sending alerts and purging old logs. If you want to use the `system` namespace for your regular flows, you can specify which namespace should be used for background workflows with this configuration:

```yaml
kestra:
  system-flows:
    namespace: system
```