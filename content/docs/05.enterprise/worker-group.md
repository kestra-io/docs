---
title: Worker Group
icon: /docs/icons/admin.svg
---

How to configure Worker Groups in Kestra Enterprise Edition.

Worker Group is a set of workers that can be targeted specifically for a task execution or a polling trigger evaluation.


::alert{type="info"}
This feature requires a [commercial license](https://kestra.io/pricing).
::

To assign a worker group, the task or the polling trigger must define the `workerGroup.key` property with the key of the worker group to target. A default worker group can also be configured at the namespace level.


If the `workerGroup.key` property is not provided, all tasks and polling triggers are executed on the default worker group. That default worker group doesn't have a dedicated key.

Here are common use cases in which Worker Groups can be beneficial:
- Execute tasks and polling triggers on specific compute instances (e.g., a VM with a GPU and preconfigured CUDA drivers).
- Execute tasks and polling triggers on a worker with a specific Operating System (e.g., a Windows server).
- Restrict backend access to a set of workers (firewall rules, private networks, etc.).
- Execute tasks and polling triggers close to a remote backend (region selection).

::alert{type="warning"}
Even if you are using worker groups, we strongly recommend having at least one worker in the default worker group, as there is no way to enforce that all tasks and polling triggers have a `workerGroup.key` property set.
::

There is currently no way to validate whether a worker group exists before using it in a task or polling trigger. If a task or a polling trigger defines a worker group that doesn't exist, it will wait forever, leaving the flow's Execution stuck in a pending state.

A worker is part of a worker group if it is started with `--worker-group workerGroupKey`.