---
title: Python, R, Node.js and Shell Scripts
icon: /docs/icons/dev.svg
---

Kestra is language agnostic. You can orchestrate custom business logic written in `Python`, `R`, `Julia`, `Ruby`,  `Node.js`, `Powershell` and `Shell` scripts, and you can also build custom plugins in Java.

By default, these tasks run in individual Docker containers (`taskRunner type: io.kestra.plugin.scripts.runner.docker.Docker`). You can overwrite that default behavior if you prefer that your scripts run in a local process (`taskRunner type: io.kestra.plugin.core.runner.Process`) instead.

If you use a [commercial version of Kestra](../../06.enterprise/index.md), you can also run your scripts on [dedicated remote workers](../../06.enterprise/worker-group.md) by specifying a `workerGroup` property or using other [Task Runner types](../../05.concepts/09.task-runners/04.types/index.md) for AWS, GCP, Azure and Kubernetes.

The following pages dive into details of each task runner, supported programming languages and how to manage dependencies.

::ChildCard
::
