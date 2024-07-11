---
title: Tutorial Flows
icon: /docs/icons/admin.svg
---

This section describes how to disable the tutorial flows.

## Tutorial Flows

Tutorial flows are used to help users understand how Kestra works. They are used in the Guided Tour that allows you to select your use case and see how Kestra can help you solve it.

## Disable Tutorial Flows

To disable the tutorial flows, set the `tutorial-flows` property to `false` in your configuration file.

```yaml
kestra:
  tutorial-flows:
    enabled: false # true by default
```

The tutorial flows are included in the open-source edition of Kestra by default. It's recommended to set that property to `false` in production environments to avoid unnecessary flows from being loaded into the production system.
