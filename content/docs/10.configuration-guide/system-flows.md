---
title: System Flows
icon: /docs/icons/admin.svg
---

How to overwrite the default namespace for system flows.

By default, the `system` namespace is reserved for background workflows — a feature we [plan to implement](https://github.com/kestra-io/kestra/issues/3003) in the near future (not yet available as of Kestra 0.15.0). These background workflows are intended to perform routine tasks such as sending alerts and purging old logs. If you want to use the `system` namespace for your regular flows, you can specify which namespace should be used for background workflows with this configuration:

```yaml
kestra:
  system-flows:
    namespace: system
```