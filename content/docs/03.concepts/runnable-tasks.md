---
title: Runnable Tasks
---

Runnable tasks handle computational work in the flow. For example, file system operations, API calls, database queries, etc. These tasks can be compute-intensive and are handled by [workers](../03.concepts/worker.md).

Each task must have an identifier (id) and a type. The type is the task's Java Fully Qualified Class Name (FQCN).

Tasks have properties specific to the type of the task; check each task's documentation for the list of available properties.

Most available tasks are Runnable Tasks except special ones that are [Flowable Tasks](#flowable-tasks); those are explained later on this page.

By default, Kestra only includes a few Runnable Tasks. However, many of them are available as [plugins](../../plugins/index.md), and if you use our default Docker image, plenty of them will already be included.