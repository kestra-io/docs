---
title: Python, R, Node.js and Shell Scripts
icon: /docs/icons/dev.svg
---

Kestra is language agnostic. You can orchestrate custom business logic written in `Python`, `R`, `Julia`, `Ruby`,  `Node.js`, `Powershell` and `Shell` scripts, and you can also build custom plugins in Java.

By default, these tasks run in individual Docker containers (`runner: DOCKER`). You can overwrite that default behavior if you prefer that your scripts run in a local process (`runner: PROCESS`) instead.

If you use a [commercial version of Kestra](/pricing), you can also run your scripts on dedicated remote workers by specifying a `workerGroup` property.

The following pages dive into details of each runner, supported programming languages and how to manage dependencies.

::ChildCard
::
