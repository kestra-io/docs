---
title: Worker Group
icon: /docs/icons/admin.svg
editions: ["EE"]
---

How to configure Worker Groups in Kestra Enterprise Edition.


Worker Group is a set of workers that can be targeted specifically for a task execution or a polling trigger evaluation.

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

## Load balancing

Whether you leverage worker groups or not, Kestra will balance the load across all available workers. The primary difference is that with worker groups, you can target **specific** workers for task execution or polling trigger evaluation.

There is also a slight difference between Kafka and JDBC architectures in terms of load balancing:
- The Kafka architecture relies on Kafka consumer group protocol — each worker group will use a different consumer group protocol, therefore each worker group will balance the load independently.
- For JDBC, each worker within a group will poll the `queues` database table using the same poll query. All workers within the same worker group will poll for task runs and polling triggers in a FIFO manner.

### Central Queue to distribute task runs and polling triggers
In both JDBC and Kafka architectures, we leverage a Central Queue to ensure that tasks and polling triggers are executed only once and in the right order.

Here's how it works:
- Jobs (task runs and polling triggers) are submitted to a centralized queue. The queue acts as a holding area for all incoming jobs.
- Workers periodically poll the central queue to check for available jobs. When a worker becomes free, it requests the next job from the queue.
- Kestra backend keeps track of assignment of jobs to workers to ensure reliable execution and prevent duplicate processing.

### What if multiple workers from the same worker group poll for jobs from the central queue?

Whether the jobs (task runs and polling triggers) are evenly distributed among workers depends on several factors:
1. The order in which workers poll the queue will affect distribution — workers that poll the queue first will get jobs first (FIFO).
2. Variations in worker compute capabilities (and their processing speeds) can cause uneven job distribution. Faster workers will complete jobs and return to poll the queue more quickly than slower workers.

