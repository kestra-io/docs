---
title: Multi-Language Script Tasks
icon: /docs/icons/dev.svg
---

Kestra is language agnostic. Write your business logic in any language.

You can orchestrate custom business logic written in any language, and you can also build custom plugins in Java.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/GBUJTjHE9ig?si=3MMIiyEqqjIGjOy_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

There are dedicated plugins for `Python`, `R`, `Julia`, `Ruby`,  `Node.js`, `Powershell` and `Shell`. You can also run any language using the `Shell` plugin too.

By default, these tasks run in individual Docker containers (taskRunner type: `io.kestra.plugin.scripts.runner.docker.Docker`). You can overwrite that default behavior if you prefer that your scripts run in a local process (taskRunner type: `io.kestra.plugin.core.runner.Process`) instead.

If you use a [commercial version of Kestra](../06.enterprise/index.md), you can also run your scripts on [dedicated remote workers](../06.enterprise/04.scalability/worker-group.md) by specifying a `workerGroup` property or using other [Task Runner types](../task-runners/04.types/index.md) for AWS, GCP, Azure, and Kubernetes.

The following pages dive into details of each task runner, supported programming languages, and how to manage dependencies.

::ChildCard
::
