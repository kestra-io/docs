---
title: Workflow Components
---

Flow is a container for tasks and and their orchestration logic, as well as labels, variables, inputs, outputs and triggers.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/videoseries?si=whmYodwNaDUsj1VL&amp;list=PLEK3H8YwZn1qZQ6s3FORSx9fwZUpZKHVM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Components of a flow

A [flow](../04.workflow-components/01.flow.md) is a container for `tasks`, their `inputs`, `outputs`, handling `errors` and overall orchestration logic. It defines the **order** in which tasks are executed and **how** they are executed, e.g. **sequentially**, **in parallel**, based on upstream task dependencies and their state, etc.

You can define a flow declaratively using a [YAML](https://en.wikipedia.org/wiki/YAML) file.

A flow must have:
- identifier (`id`)
- [namespace](../04.workflow-components/02.namespace.md)
- [list of tasks](../04.workflow-components/01.tasks/index.md)

Flows can also have a variety of optional properties, which you can read more about below:

::ChildCard
::
