---
title: Flow trigger now also reacts to PAUSED state by default
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS", "EE"]
---

## Overview

Next to the terminated states, the Flow trigger now also reacts to the `PAUSED` state to make it easier to respond to a paused workflow, for example, to send alerts to the right stakeholders to manually approve and resume paused workflow executions.

Using the following flow with a Flow trigger as example:

```yaml
id: react_to_states
namespace: company
tasks:
  - id: hello
     ...
triggers:
  - id: mytrigger
    type: io.kestra.plugin.core.trigger.Flow
    preconditions:
      id: flow
      flows:
        - namespace: company
```

## Before

This flow would be triggered for each terminated execution in the `company` namespace.

## After

From 0.23 on, this flow will be triggered for each **terminated** and `PAUSED` execution in the `company` namespace.

