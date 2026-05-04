---
title: Inputs name Renamed to id in Kestra 0.15.0
h1: "Flow Inputs: name Property Changed to id in Kestra 0.15.0"
sidebarTitle: "Inputs: name → id"
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.15.0
description: Notice regarding the change of the name property to id for flow inputs in Kestra 0.15.0.
---


## Inputs `name` changed to `id`

The `name` property of `inputs` are deprecated in favor of `id` for consistency with the rest of the flow configuration.

The change is non-breaking, so existing flows do not need to be changed immediately to migrate to 0.15.0. Use the `id` property for new flows. The `name` property will be removed in the future.

:::alert{type="info"}
All you need to do is to rename the `name` to `id` in your flow configuration — no other changes are required.
:::

To make the change clear, here is how inputs were defined before Kestra 0.15.0:

```yaml
id: myflow
namespace: company.team
inputs:
  - name: beverage
    type: STRING
    defaults: coffee
  - name: quantity
    type: INTEGER
    defaults: 1
```

## After Kestra 0.15.0

Here is how inputs are defined after Kestra 0.15.0:

```yaml
id: myflow
namespace: company.team
inputs:
  - id: beverage
    type: STRING
    defaults: coffee
  - id: quantity
    type: INTEGER
    defaults: 1
```
