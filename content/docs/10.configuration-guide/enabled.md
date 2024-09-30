---
title: Enabled
icon: /docs/icons/admin.svg
---

How to manage deprecated or disabled features.

Often, some features get deprecated or disabled by default in Kestra. This page describes how you can enable them.


## `kestra.templates`
Templates are marked as [deprecated](../11.migration-guide/0.11.0/templates.md) and disabled by default starting from the 0.11.0 release. You can re-enable them with this configuration:

```yaml
kestra:
  templates:
    enabled: true
```

## `kestra.listeners`

Listeners are deprecated and disabled by default since the 0.11.0 release. You can re-enable them with this configuration:
```yaml
kestra:
  listeners:
    enabled: true
```