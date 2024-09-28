---
title: Task Runners
icon: /docs/icons/concepts.svg
version: ">= 0.18.0"
editions: ["OSS", "EE"]
---

Task Runners is an extensible, pluggable system capable of executing your tasks in arbitrary remote environments.

Many data processing tasks are **computationally intensive** and require a lot of resources (_such as CPU, GPU, and memory_). Instead of provisioning always-on servers, Task Runners can execute your code on **dynamically provisioned compute instances** in the cloud, such as AWS ECS Fargate, Azure Batch, Google Batch, auto-scaled Kubernetes clusters, and more.

All you have to do to offload your task execution to a remote environment is to specify the `taskRunner` type in your task configuration. Each `type` of a task runner is a **plugin** with its own schema. The built-in code editor provides documentation, autocompletion, and syntax validation for all task runner plugin properties to ensure correctness, standardization, and consistency.

::alert{type="info"}
Note that some task runner plugins are available only in the [Enterprise Edition](../06.enterprise/index.md). If you want to try them out, please [reach out](/demo).
::

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/edYa8WAMAdQ?si=2vu6XPUUeTQziWNq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

::ChildCard
::
