---
title: Task Runner Types
icon: /docs/icons/dev.svg
version: ">= 0.16.0"
---

This section lists all task runners available in Kestra.


The `ProcessTaskRunner` is located within the core repository. Additionally, the `DockerTaskRunner` runner is included in the `plugin-script` repository — by default, Kestra runs all script tasks in Docker.

Other plugins such as the AWS, Azure, GCP, and Kubernetes plugins provide additional task runners for their respective environments. Each `taskRunner` is identified by its `type`.

::ChildCard
::

