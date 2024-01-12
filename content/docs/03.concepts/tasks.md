---
title: Tasks
---


## Flowable Tasks

Kestra orchestrates your flows using [Flowable Tasks](flowable-tasks.md). These tasks do not perform any heavy computation. Instead, they control the orchestration behavior, allowing you to implement more advanced workflow patterns.

## Runnable Tasks

In Kestra, most data processing workloads are executed using [Runnable Tasks](runnable-tasks.md).

In contrast to Flowable Tasks, Runnable Tasks are responsible for performing the actual work. For example, file system operations, API calls, database queries, etc. These tasks can be compute-intensive and are handled by [workers](../03.concepts/worker.md).

## Core task properties

Check the [task properties](task-properties.md) page for a full list of core task properties available to all tasks.
