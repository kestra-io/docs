---
title: Workflow Components
---

Flow is a container for tasks and and their orchestration logic, as well as labels, variables, inputs, outputs and triggers.

## Components of a flow

A flow is a container for `tasks`, their `inputs`, `outputs`, handling `errors` and overall orchestration logic. It defines the **order** in which tasks are executed and **how** they are executed, e.g. **sequentially**, **in parallel**, based on upstream task dependencies and their state, etc.

You can define a flow declaratively using a [YAML](https://en.wikipedia.org/wiki/YAML) file.

A flow must have:
- identifier (`id`)
- [namespace](/docs/workflow-components/namespace)
- [list of tasks](/docs/workflow-components/tasks)

Optionally, a flow can also have:
- [inputs](/docs/workflow-components/inputs)
- [outputs](/docs/workflow-components/outputs)
- [variables](/docs/workflow-components/variables)
- [labels](/docs/workflow-components/labels)
- [descriptions](/docs/workflow-components/descriptions)
- [taskDefaults](/docs/workflow-components/task-defaults)
- [errors](/docs/workflow-components/errors)
- [triggers](/docs/workflow-components/triggers)

Here is a sample flow definition. It uses tasks available in Kestra core for testing purposes, such as the `Return` or `Log` tasks, and demonstrates how to use `labels`, `inputs`, `variables`, `triggers` and various `descriptions`.

::collapse{title="Flow example"}
```yaml
id: hello-world
namespace: dev

description: flow **documentation** in *Markdown*

labels:
  env: prod
  team: engineering

inputs:
  - id: my-value
    type: STRING
    required: false
    defaults: "default value"
    description: This is a not required my-value

variables:
  first: "1"
  second: "{{vars.first}} > 2"

tasks:
  - id: date
    type: io.kestra.core.tasks.debugs.Return
    description: "Some tasks **documentation** in *Markdown*"
    format: "A log line content with a contextual date variable {{taskrun.startDate}}"

taskDefaults:
  - type: io.kestra.core.tasks.log.Log
    values:
      level: ERROR
```
::



::ChildCard
::
