---
title: Task Runners
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.18.0"
---

Task Runner capabilities and supported plugins.

[Task Runners](../task-runners/index.md) offer a powerful way to offload compute-intensive tasks to remote environments.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/edYa8WAMAdQ?si=WiXpLNPOwk3mekwh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Task Runner Types

There are a number of task runner types. The [Docker](../../task-runners/04.types/02.docker-task-runner.md) and [Process](../../task-runners/04.types/01.process-task-runner.md) task runners are included in the Open Source edition. All other types require an [Enterprise Edition](./index.md) license or a [Kestra Cloud](/cloud) account.

Enterprise Edition Task Runners:
- [Kubernetes](../task-runners/04.types/03.kubernetes-task-runner.md)
- [AWS Batch](../task-runners/04.types/04.aws-batch-task-runner.md)
- [Azure Batch](../task-runners/04.types/05.azure-batch-task-runner.md)
- [Google Batch](../task-runners/04.types/06.google-batch-task-runner.md)
- [Google Cloud Run](../task-runners/04.types/07.google-cloudrun-task-runner.md)

## Task Runners vs Worker Groups

[Task Runners](../../task-runners/index.md) and [Worker Groups](worker-group.md) both **offload compute-intensive tasks to dedicated workers**. However, **worker groups have a broader scope**, applying to **all tasks** in Kestra, whereas **task runners** are limited to **scripting tasks** (Python, R, JavaScript, Shell, dbt, etc. — see the [full list here](../../task-runners/01.overview.md#plugins-supporting-task-runners)). Worker groups can be used with any plugins.

For instance, if you need to query an on-premise SQL Server database running on a different server than Kestra, your SQL Server Query task can target a worker with access to that server. Additionally, worker groups can fulfill the same use case as task runners by distributing the load of scripting tasks to dedicated workers with the necessary resources and dependencies (_incl. hardware, region, network, operating system_).

You can read more about the differences on the [dedicated Task Runners vs. Worker Groups page](../../task-runners/03.task-runners-vs-worker-groups.md).
