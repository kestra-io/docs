---
title: Task Runner Types
icon: /docs/icons/concepts.svg
version: ">= 0.18.0"
editions: ["OSS", "EE"]
---

This section lists all task runners available in Kestra.


Each `taskRunner` is identified by its `type`. The [Process](./01.process-task-runner.md) and [Docker](./02.docker-task-runner.md) task runners are fully open-source and located within the [Kestra repository](https://github.com/kestra-io/kestra). By default, Kestra runs all script tasks using the Docker task runner.

All other plugins such as the [AWS Batch](./04.aws-batch-task-runner.md), [Google Batch](./06.google-batch-task-runner.md), [Google Cloud Run](./07.google-cloudrun-task-runner.md), [Azure Batch](./05.azure-batch-task-runner.md), [Kubernetes](./03.kubernetes-task-runner.md), and more planned for the future, are managed by Kestra and require an [Enterprise Edition](../../06.enterprise/index.md) license. If you want to try them out, please [reach out](/demo).

::ChildCard
::

