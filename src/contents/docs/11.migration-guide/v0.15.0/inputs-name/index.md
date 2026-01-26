---
title: Inputs Name
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.15.0
description: Notice regarding the change of the name property to id for flow inputs in Kestra 0.15.0.
---


## Inputs `name` changed to `id`

The `name` property of `inputs` are deprecated in favor of `id` for consistency with the rest of the flow configuration.

Note that the change has been implemented in a non-breaking way, so you don't need to immediately change your existing flows in order to successfully migrate to 0.15.0. However, we recommend using the `id` property at least for new flows. The `name` property will be removed in the future.

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
