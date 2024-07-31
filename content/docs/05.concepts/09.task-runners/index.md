---
title: Task Runners
icon: /docs/icons/dev.svg
version: ">= 0.16.0"
---

Task Runners are plugins capable of executing your tasks in remote environments.

Many data processing tasks are **computationally intensive** and require a lot of resources (_such as CPU, GPU, and memory_). Instead of provisioning always-on servers, Task Runners can run your code on **dynamically provisioned compute instances** in the cloud, such as AWS ECS Fargate, Azure Batch, Google Batch, auto-scaled Kubernetes clusters, and more.

::ChildCard
::