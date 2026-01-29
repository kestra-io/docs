---
title: Task Runners in Kestra Enterprise – Offload and Isolate Compute
description: Optimize compute with Kestra Task Runners. Offload intensive tasks to Docker, Kubernetes, AWS Batch, and other remote environments for scalability.
sidebarTitle: Task Runners
icon: /src/contents/docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.18.0"
---

Task Runner capabilities and supported plugins.

## Task runners – offload and isolate compute

[Task Runners](../../../task-runners/index.mdx) offer a powerful way to offload compute-intensive tasks to remote environments.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/edYa8WAMAdQ?si=WiXpLNPOwk3mekwh" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Task runner types

There are a number of task runner types. The [Docker](../../../task-runners/04.types/02.docker-task-runner/index.md) and [Process](../../../task-runners/04.types/01.process-task-runner/index.md) task runners are included in the Open Source edition. All other types require an [Enterprise Edition](./index.md) license or a [Kestra Cloud](/cloud) account.

Enterprise Edition Task Runners:
- [Kubernetes](../../../task-runners/04.types/03.kubernetes-task-runner/index.md)
- [AWS Batch](../../../task-runners/04.types/04.aws-batch-task-runner/index.md)
- [Azure Batch](../../../task-runners/04.types/05.azure-batch-task-runner/index.md)
- [Google Batch](../../../task-runners/04.types/06.google-batch-task-runner/index.md)
- [Google Cloud Run](../../../task-runners/04.types/07.google-cloudrun-task-runner/index.md)

## Task runners vs Worker Groups

[Task Runners](../../../task-runners/index.mdx) and [Worker Groups](../worker-group/index.md) both **offload compute-intensive tasks to dedicated workers**. However, **worker groups have a broader scope**, applying to **all tasks** in Kestra, whereas **task runners** are limited to **scripting tasks** (Python, R, JavaScript, Shell, dbt, etc. — see the full list in the [Task Runner Overview](../../../task-runners/index.mdx)). Worker groups can be used with any plugins.

For instance, if you need to query an on-premise SQL Server database running on a different server than Kestra, your SQL Server Query task can target a worker with access to that server. Additionally, worker groups can fulfill the same use case as task runners by distributing the load of scripting tasks to dedicated workers with the necessary resources and dependencies (_incl. hardware, region, network, operating system_).

You can read more about the differences on the [dedicated Task Runners vs. Worker Groups page](../../../task-runners/03.task-runners-vs-worker-groups/index.md).
