---
title: Loop Over a List of Values
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Workflow Components
---

How to iterate over a list of values in your flow.

In this example, we can use `EachSequential` to iterate over a list of values.

```yaml
id: each_nested
namespace: company.team

tasks:
  - id: 1_each
    type: io.kestra.plugin.core.flow.EachSequential
    value: '["s1", "s2", "s3"]'
    tasks:
      - id: 1-1_return
        type: io.kestra.plugin.core.debug.Return
        format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
      - id: 1-2_each
        type: io.kestra.plugin.core.flow.EachSequential
        value: '["a a", "b b"]'
        tasks:
          - id: 1-2-1_return
            type: io.kestra.plugin.core.debug.Return
            format: "{{task.id}} > {{taskrun.value}} > {{taskrun.startDate}}"
          - id: 1-2-2_return
            type: io.kestra.plugin.core.debug.Return
            format: "{{task.id}} > {{ outputs['1-2-1_return'].s1[taskrun.value].value }} >> get {{ outputs['1-2-1_return']['s1'][taskrun.value].value }} > {{taskrun.startDate}}"
      - id: 1-3_return
        type: io.kestra.plugin.core.debug.Return
        format: "{{task.id}} > {{ outputs['1-1_return'][taskrun.value].value }} > {{taskrun.startDate}}"
  - id: 2_return
    type: io.kestra.plugin.core.debug.Return
    format: "{{task.id}} > {{outputs['1-2-1_return'].s1['a a'].value}}"
```

