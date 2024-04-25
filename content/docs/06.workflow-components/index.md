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

Flows can also have a variety of optional properties, which you can read more about below:

::ChildCard
::
